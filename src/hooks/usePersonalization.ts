/**
 * usePersonalization.ts
 * ─────────────────────────────────────────────────────────────
 * GAP #4 FIX — Real Personalization Engine
 * GAP #5 FIX — Persists learningStyle to DB via /api/brain/learning-style
 *
 * On mount: fetches saved learningStyle from /api/brain/profile
 * When confidence > 50: PATCHes new style to DB (debounced, once per session)
 */

import { useState, useCallback, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

// ─── Types ────────────────────────────────────────────────────

export type LearningStyle =
  | "visual"      // wants diagrams, charts, visual explanations
  | "example"     // wants practical/real-world examples
  | "theory"      // wants deep conceptual understanding
  | "practice"    // wants to learn by doing
  | "unknown";    // not yet detected

export type CognitiveLoad =
  | "low"
  | "normal"
  | "high"
  | "overloaded";

export type ResponseDensity =
  | "brief"
  | "normal"
  | "detailed";

export interface SubjectSkill {
  subject:       string;
  level:         "beginner" | "intermediate" | "advanced";
  correctCount:  number;
  wrongCount:    number;
  lastUpdated:   number;
}

export interface PersonalizationProfile {
  learningStyle:      LearningStyle;
  styleConfidence:    number;
  styleCounts:        Record<LearningStyle, number>;
  cognitiveLoad:      CognitiveLoad;
  reexplainStreak:    number;
  consecutivePassed:  number;
  avgAnswerSpeedMs:   number;
  responseDensity:    ResponseDensity;
  longResponseCount:  number;
  shortResponseCount: number;
  subjectSkills:      Record<string, SubjectSkill>;
  totalTurns:         number;
  sessionStartTime:   number;
  lastActiveTime:     number;
  engagementDrops:    number;
}

// ─── Default profile ──────────────────────────────────────────
function defaultProfile(initialStyle: LearningStyle = "unknown"): PersonalizationProfile {
  return {
    learningStyle:     initialStyle,
    styleConfidence:   initialStyle !== "unknown" ? 60 : 0,
    styleCounts:       { visual: 0, example: 0, theory: 0, practice: 0, unknown: 0 },
    cognitiveLoad:     "normal",
    reexplainStreak:   0,
    consecutivePassed: 0,
    avgAnswerSpeedMs:  0,
    responseDensity:   "normal",
    longResponseCount: 0,
    shortResponseCount: 0,
    subjectSkills:     {},
    totalTurns:        0,
    sessionStartTime:  Date.now(),
    lastActiveTime:    Date.now(),
    engagementDrops:   0,
  };
}

// ─── Hook ─────────────────────────────────────────────────────

export function usePersonalization() {
  const [profile, setProfile] = useState<PersonalizationProfile>(defaultProfile());
  const lastTurnTimeRef = useRef<number>(Date.now());
  // Track whether we've already synced to DB this session
  const savedStyleRef = useRef<LearningStyle | null>(null);

  // ── On mount: load saved learningStyle from DB ─────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/api/brain/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        const style: LearningStyle = data?.profile?.learningStyle ?? "unknown";
        if (style && style !== "unknown") {
          savedStyleRef.current = style;
          setProfile(defaultProfile(style));
        }
      })
      .catch(() => {/* silently ignore — non-critical */});
  }, []);

  // ── Persist to DB when confidence crosses 50 ──────────────
  const persistLearningStyle = useCallback((style: LearningStyle, confidence: number) => {
    if (confidence <= 50) return;
    if (style === "unknown") return;
    // Once per session — don't re-save the same style
    if (savedStyleRef.current === style) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    savedStyleRef.current = style;

    fetch(`${API_URL}/api/brain/learning-style`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ learningStyle: style }),
    }).catch(() => {/* silently ignore — non-critical */});
  }, []);

  // ── Style detection ────────────────────────────────────────

  const recordStyleChoice = useCallback((choice: string) => {
    let style: LearningStyle = "unknown";
    const c = choice.toLowerCase();
    if (c.includes("visual") || c.includes("diagram") || c.includes("chart")) {
      style = "visual";
    } else if (c.includes("example") || c.includes("real") || c.includes("practical")) {
      style = "example";
    } else if (c.includes("theory") || c.includes("concept") || c.includes("why") || c.includes("future") || c.includes("impact")) {
      style = "theory";
    } else if (c.includes("practice") || c.includes("exercise") || c.includes("do") || c.includes("beginner") || c.includes("simple")) {
      style = "practice";
    }
    if (style === "unknown") return;

    setProfile(prev => {
      const newCounts = {
        ...prev.styleCounts,
        [style]: (prev.styleCounts[style] || 0) + 1,
      };
      const dominant = (Object.entries(newCounts) as [LearningStyle, number][])
        .filter(([k]) => k !== "unknown")
        .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "unknown";

      const total = Object.values(newCounts).reduce((a, b) => a + b, 0);
      const confidence = total > 0
        ? Math.round((newCounts[dominant] / total) * 100)
        : 0;

      persistLearningStyle(dominant, confidence);

      return {
        ...prev,
        learningStyle:   dominant,
        styleConfidence: confidence,
        styleCounts:     newCounts,
      };
    });
  }, [persistLearningStyle]);

  // ── Cognitive load tracking ────────────────────────────────

  const recordComprehensionAction = useCallback((
    action: "understood" | "reexplain" | "testme",
    answerSpeedMs?: number,
  ) => {
    setProfile(prev => {
      let { reexplainStreak, consecutivePassed, cognitiveLoad,
            shortResponseCount, longResponseCount, avgAnswerSpeedMs } = prev;

      if (action === "understood") {
        reexplainStreak    = 0;
        consecutivePassed += 1;
        shortResponseCount += 1;
      } else if (action === "reexplain") {
        reexplainStreak   += 1;
        consecutivePassed  = 0;
      } else if (action === "testme") {
        longResponseCount += 1;
      }

      if (answerSpeedMs && answerSpeedMs > 0) {
        avgAnswerSpeedMs = prev.avgAnswerSpeedMs === 0
          ? answerSpeedMs
          : Math.round((prev.avgAnswerSpeedMs * 0.7) + (answerSpeedMs * 0.3));
      }

      if (reexplainStreak >= 4)        cognitiveLoad = "overloaded";
      else if (reexplainStreak >= 2)   cognitiveLoad = "high";
      else if (consecutivePassed >= 3) cognitiveLoad = "low";
      else                             cognitiveLoad = "normal";

      const densityRatio = longResponseCount / Math.max(1, shortResponseCount + longResponseCount);
      const responseDensity: ResponseDensity =
        densityRatio > 0.6 ? "detailed" :
        densityRatio < 0.2 ? "brief"    : "normal";

      return {
        ...prev,
        reexplainStreak,
        consecutivePassed,
        cognitiveLoad,
        shortResponseCount,
        longResponseCount,
        avgAnswerSpeedMs,
        responseDensity,
      };
    });
  }, []);

  const recordTestResult = useCallback((
    result:  "correct" | "incorrect" | "partial",
    subject: string,
  ) => {
    setProfile(prev => {
      const existing = prev.subjectSkills[subject] || {
        subject, level: "intermediate" as const,
        correctCount: 0, wrongCount: 0, lastUpdated: Date.now(),
      };

      const correct = result === "correct" ? existing.correctCount + 1 : existing.correctCount;
      const wrong   = result === "incorrect" ? existing.wrongCount + 1 : existing.wrongCount;
      const total   = correct + wrong;
      const accuracy = total > 0 ? correct / total : 0.5;

      const level: "beginner" | "intermediate" | "advanced" =
        accuracy >= 0.75 && total >= 3 ? "advanced"    :
        accuracy <= 0.40 && total >= 2 ? "beginner"    : "intermediate";

      const newSkills = {
        ...prev.subjectSkills,
        [subject]: { subject, level, correctCount: correct, wrongCount: wrong, lastUpdated: Date.now() },
      };

      let { reexplainStreak, consecutivePassed, cognitiveLoad } = prev;
      if (result === "correct") {
        consecutivePassed += 1;
        reexplainStreak    = 0;
      } else if (result === "incorrect") {
        reexplainStreak   += 1;
        consecutivePassed  = 0;
      }

      if (reexplainStreak >= 3)        cognitiveLoad = "overloaded";
      else if (reexplainStreak >= 2)   cognitiveLoad = "high";
      else if (consecutivePassed >= 4) cognitiveLoad = "low";
      else                             cognitiveLoad = "normal";

      return {
        ...prev,
        subjectSkills:     newSkills,
        reexplainStreak,
        consecutivePassed,
        cognitiveLoad,
        totalTurns:        prev.totalTurns + 1,
      };
    });
  }, []);

  const recordTurn = useCallback(() => {
    const now = Date.now();
    const gap = now - lastTurnTimeRef.current;
    lastTurnTimeRef.current = now;

    setProfile(prev => ({
      ...prev,
      totalTurns:     prev.totalTurns + 1,
      lastActiveTime: now,
      engagementDrops: gap > 3 * 60 * 1000
        ? prev.engagementDrops + 1
        : prev.engagementDrops,
    }));
  }, []);

  // ── Prompt context builder ─────────────────────────────────

  const buildPersonalizationContext = useCallback((): string => {
    const p = profile;
    if (p.totalTurns === 0 && p.learningStyle === "unknown") return "";

    const parts: string[] = ["STUDENT PERSONALIZATION:"];

    if (p.learningStyle !== "unknown" && p.styleConfidence > 30) {
      const styleInstructions: Record<LearningStyle, string> = {
        visual:   "Student prefers VISUAL explanations. Use diagrams, charts, and structured layouts when possible.",
        example:  "Student prefers REAL-WORLD EXAMPLES. Always connect concepts to practical, relatable scenarios.",
        theory:   "Student prefers THEORY & CONCEPTS. Explain the 'why' deeply, include context and motivation.",
        practice: "Student learns by DOING. Provide exercises, step-by-step walkthroughs, and hands-on examples.",
        unknown:  "",
      };
      if (styleInstructions[p.learningStyle]) {
        parts.push(styleInstructions[p.learningStyle]);
      }
    }

    const loadInstructions: Record<CognitiveLoad, string> = {
      low:        "Student is grasping concepts quickly. Can handle more depth, advanced nuance, and edge cases.",
      normal:     "",
      high:       "Student is showing signs of overload. SIMPLIFY. Use shorter sentences. One concept at a time.",
      overloaded: "CRITICAL: Student is struggling significantly. Use the SIMPLEST possible language. No jargon at all. Very short paragraphs. Add encouragement.",
    };
    if (loadInstructions[p.cognitiveLoad]) {
      parts.push(loadInstructions[p.cognitiveLoad]);
    }

    const densityInstructions: Record<ResponseDensity, string> = {
      brief:    "Student prefers CONCISE responses. Keep answers short and to the point.",
      normal:   "",
      detailed: "Student appreciates DETAILED explanations. Go deeper, include edge cases and context.",
    };
    if (densityInstructions[p.responseDensity]) {
      parts.push(densityInstructions[p.responseDensity]);
    }

    const skills = Object.values(p.subjectSkills);
    if (skills.length > 0) {
      const skillSummary = skills
        .map(s => `${s.subject}: ${s.level} (${s.correctCount}✓ ${s.wrongCount}✗)`)
        .join(", ");
      parts.push(`Subject skill levels: ${skillSummary}`);
    }

    if (p.engagementDrops >= 2) {
      parts.push("Student has had attention gaps this session. Keep responses engaging and energetic.");
    }

    if (p.avgAnswerSpeedMs > 0) {
      if (p.avgAnswerSpeedMs < 5000) {
        parts.push("Student responds quickly — they are engaged and confident.");
      } else if (p.avgAnswerSpeedMs > 30000) {
        parts.push("Student takes time to answer — patient, methodical learner. Allow them space to think.");
      }
    }

    return parts.length > 1 ? parts.join("\n") : "";
  }, [profile]);

  const getSkillLevelForSubject = useCallback((subject: string) => {
    return profile.subjectSkills[subject]?.level ?? "intermediate";
  }, [profile.subjectSkills]);

  const resetPersonalization = useCallback(() => {
    // Keep saved DB style on reset — only reset session-specific state
    const savedStyle = savedStyleRef.current ?? "unknown";
    setProfile(defaultProfile(savedStyle));
    lastTurnTimeRef.current = Date.now();
  }, []);

  const getPersonalizationSummary = useCallback(() => ({
    learningStyle:   profile.learningStyle,
    cognitiveLoad:   profile.cognitiveLoad,
    responseDensity: profile.responseDensity,
    dominantSubjectSkill: Object.values(profile.subjectSkills)
      .sort((a, b) => b.lastUpdated - a.lastUpdated)[0] ?? null,
    totalTurns:      profile.totalTurns,
    engagementDrops: profile.engagementDrops,
  }), [profile]);

  return {
    profile,
    recordStyleChoice,
    recordComprehensionAction,
    recordTestResult,
    recordTurn,
    buildPersonalizationContext,
    getSkillLevelForSubject,
    resetPersonalization,
    getPersonalizationSummary,
  };
}