/**
 * usePersonalization.ts
 * ─────────────────────────────────────────────────────────────
 * ROUTE: src/hooks/usePersonalization.ts
 *
 * GAP #4 FIX — Real Personalization Engine
 *
 * What this does:
 *   OLD: skillLevel + weakTopics (static, never changes)
 *   NEW: Dynamic behavioral profiling based on actual actions
 *
 * Tracks & adapts:
 *   1. Learning style (beginner / real-world / future) — from StyleChoiceCard clicks
 *   2. Response speed (fast thinker vs slow processor)
 *   3. Cognitive load index — auto-detects overload from re-explain frequency
 *   4. Attention span modeling — session length + engagement drops
 *   5. Dynamic skill level — updates based on test results, not static
 *   6. Preferred explanation density (short vs detailed)
 *   7. Subject-specific skill maps (math vs coding vs science)
 *
 * Output: buildPersonalizationContext() → injected into every AI request
 * so the model automatically adjusts tone, depth, and style per student.
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────

export type LearningStyle =
  | "beginner"    // wants simple, step-by-step
  | "real_world"  // wants practical examples
  | "future"      // wants to know WHY it matters
  | "unknown";    // not yet detected

export type CognitiveLoad =
  | "low"         // student breezing through, can take more depth
  | "normal"      // comfortable pace
  | "high"        // showing signs of overload, need to simplify
  | "overloaded"; // multiple failures, needs a break or total reset

export type ResponseDensity =
  | "brief"       // student prefers short answers
  | "normal"      // standard length
  | "detailed";   // student asks follow-ups, wants depth

export interface SubjectSkill {
  subject:       string;
  level:         "beginner" | "intermediate" | "advanced";
  correctCount:  number;
  wrongCount:    number;
  lastUpdated:   number;  // timestamp
}

export interface PersonalizationProfile {
  // Learning style
  learningStyle:      LearningStyle;
  styleConfidence:    number;       // 0-100: how sure we are
  styleCounts:        Record<LearningStyle, number>;

  // Cognitive state
  cognitiveLoad:      CognitiveLoad;
  reexplainStreak:    number;       // consecutive re-explains needed
  consecutivePassed:  number;       // consecutive correct answers

  // Speed & density
  avgAnswerSpeedMs:   number;       // avg ms to answer a question
  responseDensity:    ResponseDensity;
  longResponseCount:  number;       // times student asked follow-up/detail
  shortResponseCount: number;       // times student used "understood" quickly

  // Skill by subject
  subjectSkills:      Record<string, SubjectSkill>;

  // Session meta
  totalTurns:         number;
  sessionStartTime:   number;
  lastActiveTime:     number;
  engagementDrops:    number;       // long gaps detected this session
}

// ─── Default profile ──────────────────────────────────────────
function defaultProfile(): PersonalizationProfile {
  return {
    learningStyle:     "unknown",
    styleConfidence:   0,
    styleCounts:       { beginner: 0, real_world: 0, future: 0, unknown: 0 },
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

  // ── Style detection ────────────────────────────────────────

  /**
   * recordStyleChoice — called when student picks from StyleChoiceCard
   * "Beginner friendly" / "Real-world example" / "Future impact"
   */
  const recordStyleChoice = useCallback((choice: string) => {
    let style: LearningStyle = "unknown";
    if (choice.toLowerCase().includes("beginner") || choice.toLowerCase().includes("simple")) {
      style = "beginner";
    } else if (choice.toLowerCase().includes("real") || choice.toLowerCase().includes("example")) {
      style = "real_world";
    } else if (choice.toLowerCase().includes("future") || choice.toLowerCase().includes("impact")) {
      style = "future";
    }
    if (style === "unknown") return;

    setProfile(prev => {
      const newCounts = {
        ...prev.styleCounts,
        [style]: (prev.styleCounts[style] || 0) + 1,
      };
      // Dominant style = most chosen
      const dominant = (Object.entries(newCounts) as [LearningStyle, number][])
        .filter(([k]) => k !== "unknown")
        .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "unknown";

      const total = Object.values(newCounts).reduce((a, b) => a + b, 0);
      const confidence = total > 0
        ? Math.round((newCounts[dominant] / total) * 100)
        : 0;

      return {
        ...prev,
        learningStyle:   dominant,
        styleConfidence: confidence,
        styleCounts:     newCounts,
      };
    });
  }, []);

  // ── Cognitive load tracking ────────────────────────────────

  /**
   * recordComprehensionAction — called on every action button press
   * Updates cognitive load based on pattern.
   */
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

      // Update average answer speed
      if (answerSpeedMs && answerSpeedMs > 0) {
        avgAnswerSpeedMs = prev.avgAnswerSpeedMs === 0
          ? answerSpeedMs
          : Math.round((prev.avgAnswerSpeedMs * 0.7) + (answerSpeedMs * 0.3));
      }

      // Determine cognitive load
      if (reexplainStreak >= 4) {
        cognitiveLoad = "overloaded";
      } else if (reexplainStreak >= 2) {
        cognitiveLoad = "high";
      } else if (consecutivePassed >= 3) {
        cognitiveLoad = "low";
      } else {
        cognitiveLoad = "normal";
      }

      // Response density preference
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

  /**
   * recordTestResult — called when test answer is evaluated
   */
  const recordTestResult = useCallback((
    result:  "correct" | "incorrect" | "partial",
    subject: string,
  ) => {
    setProfile(prev => {
      // Update subject skill
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

      // Update cognitive load from test results
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

  /**
   * recordTurn — called on every send — tracks engagement/attention
   */
  const recordTurn = useCallback(() => {
    const now = Date.now();
    const gap = now - lastTurnTimeRef.current;
    lastTurnTimeRef.current = now;

    setProfile(prev => ({
      ...prev,
      totalTurns:     prev.totalTurns + 1,
      lastActiveTime: now,
      // If gap > 3 minutes = engagement drop detected
      engagementDrops: gap > 3 * 60 * 1000
        ? prev.engagementDrops + 1
        : prev.engagementDrops,
    }));
  }, []);

  // ── Prompt context builder ─────────────────────────────────

  /**
   * buildPersonalizationContext — THE main output function
   * Returns a compact string to inject into every AI request.
   *
   * This tells the AI exactly HOW to respond to THIS specific student.
   */
  const buildPersonalizationContext = useCallback((): string => {
    const p = profile;
    if (p.totalTurns === 0 && p.learningStyle === "unknown") return "";

    const parts: string[] = ["STUDENT PERSONALIZATION:"];

    // 1. Learning style
    if (p.learningStyle !== "unknown" && p.styleConfidence > 30) {
      const styleInstructions: Record<LearningStyle, string> = {
        beginner:   "Student prefers BEGINNER-FRIENDLY explanations. Use simple language, avoid jargon, build from basics.",
        real_world: "Student prefers REAL-WORLD EXAMPLES. Always connect concepts to practical, relatable scenarios.",
        future:     "Student is motivated by FUTURE IMPACT. Explain why this matters and where it's used in real life.",
        unknown:    "",
      };
      if (styleInstructions[p.learningStyle]) {
        parts.push(styleInstructions[p.learningStyle]);
      }
    }

    // 2. Cognitive load
    const loadInstructions: Record<CognitiveLoad, string> = {
      low:        "Student is grasping concepts quickly. Can handle more depth, advanced nuance, and edge cases.",
      normal:     "",
      high:       "Student is showing signs of overload. SIMPLIFY. Use shorter sentences. One concept at a time.",
      overloaded: "CRITICAL: Student is struggling significantly. Use the SIMPLEST possible language. No jargon at all. Very short paragraphs. Add encouragement.",
    };
    if (loadInstructions[p.cognitiveLoad]) {
      parts.push(loadInstructions[p.cognitiveLoad]);
    }

    // 3. Response density
    const densityInstructions: Record<ResponseDensity, string> = {
      brief:    "Student prefers CONCISE responses. Keep answers short and to the point.",
      normal:   "",
      detailed: "Student appreciates DETAILED explanations. Go deeper, include edge cases and context.",
    };
    if (densityInstructions[p.responseDensity]) {
      parts.push(densityInstructions[p.responseDensity]);
    }

    // 4. Subject-specific skill level
    const skills = Object.values(p.subjectSkills);
    if (skills.length > 0) {
      const skillSummary = skills
        .map(s => `${s.subject}: ${s.level} (${s.correctCount}✓ ${s.wrongCount}✗)`)
        .join(", ");
      parts.push(`Subject skill levels: ${skillSummary}`);
    }

    // 5. Attention/engagement
    if (p.engagementDrops >= 2) {
      parts.push("Student has had attention gaps this session. Keep responses engaging and energetic.");
    }

    // 6. Speed hint
    if (p.avgAnswerSpeedMs > 0) {
      if (p.avgAnswerSpeedMs < 5000) {
        parts.push("Student responds quickly — they are engaged and confident.");
      } else if (p.avgAnswerSpeedMs > 30000) {
        parts.push("Student takes time to answer — patient, methodical learner. Allow them space to think.");
      }
    }

    return parts.length > 1 ? parts.join("\n") : "";
  }, [profile]);

  /**
   * getSkillLevelForSubject — returns skill for a specific subject
   */
  const getSkillLevelForSubject = useCallback((subject: string) => {
    return profile.subjectSkills[subject]?.level ?? "intermediate";
  }, [profile.subjectSkills]);

  /**
   * resetPersonalization — call on startNewChat
   */
  const resetPersonalization = useCallback(() => {
    setProfile(defaultProfile());
    lastTurnTimeRef.current = Date.now();
  }, []);

  /**
   * getPersonalizationSummary — for MentorIntelligenceBar display
   */
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
    // Recording actions
    recordStyleChoice,
    recordComprehensionAction,
    recordTestResult,
    recordTurn,
    // Prompt building
    buildPersonalizationContext,
    getSkillLevelForSubject,
    // Session management
    resetPersonalization,
    getPersonalizationSummary,
  };
}