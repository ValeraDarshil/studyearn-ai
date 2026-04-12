/**
 * useAdaptiveTeaching.ts
 * ─────────────────────────────────────────────────────────────
 * ROUTE: src/hooks/useAdaptiveTeaching.ts
 *
 * GAP #3 FIX — Adaptive Teaching Loop
 *
 * What this does:
 *   OLD: AI explains → student reads → done (no verification)
 *   NEW: AI explains → auto check-question → student answers →
 *        AI evaluates → if wrong: re-explain differently → repeat
 *
 * The full cycle:
 *   EXPLAIN → CHECK → EVALUATE → (PASS: next topic) | (FAIL: RE-EXPLAIN → CHECK again)
 *
 * Key features:
 *   1. TeachingPhase state machine — tracks where in cycle we are
 *   2. Auto-injects check question after every explanation
 *   3. Tracks retry count per topic (max 3 retries before moving on)
 *   4. Different re-explain strategies: analogy / simpler / visual / example
 *   5. Builds teaching context for AI prompt so it knows current phase
 *   6. Works 100% without backend — pure frontend state machine
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────

export type TeachingPhase =
  | "idle"          // no teaching in progress
  | "explaining"    // AI is explaining a concept
  | "checking"      // AI asked a check question, waiting for student
  | "evaluating"    // evaluating student's answer
  | "re_explaining" // student failed, AI re-explaining with different strategy
  | "mastered"      // student passed — concept mastered
  | "giving_up";    // max retries hit — moving on

export type ReExplainStrategy =
  | "analogy"       // use a real-world analogy
  | "simpler"       // break into even smaller steps
  | "visual"        // describe it visually / diagrammatically
  | "example"       // give a concrete code/math/science example
  | "different";    // completely different explanation approach

export interface TeachingCycleState {
  phase:          TeachingPhase;
  topic:          string | null;
  subject:        string;
  retryCount:     number;         // how many re-explains for this topic
  maxRetries:     number;         // default 3
  strategies:     ReExplainStrategy[]; // strategies used so far
  nextStrategy:   ReExplainStrategy;   // which strategy to use next
  lastCheckQuestion: string | null;    // the question AI asked
  cycleCount:     number;         // total teaching cycles this session
  masteredTopics: string[];       // topics student has mastered
  struggledTopics: string[];      // topics that needed multiple retries
}

export interface TeachingPromptInstructions {
  // Injected into every AI request so AI knows what to do
  phaseInstruction:  string;   // what AI should do in this phase
  strategyHint:      string;   // HOW to explain (if re-explaining)
  checkInstruction:  string;   // whether to append a check question
  contextSummary:    string;   // compact state summary for system prompt
}

// ─── Re-explain strategy prompts ─────────────────────────────
const STRATEGY_PROMPTS: Record<ReExplainStrategy, string> = {
  analogy:   "Use a completely different real-world analogy. Connect to something from daily life the student can visualize.",
  simpler:   "Break this into the smallest possible steps. Assume zero prior knowledge. One idea per sentence.",
  visual:    "Describe this visually. Use ASCII diagrams, before/after comparisons, or step-by-step visual flow.",
  example:   "Skip theory entirely. Start with a concrete working example first, then explain why it works.",
  different: "Use a completely different explanation approach than before. Change the angle entirely.",
};

// Rotate through strategies so we never repeat the same one
const STRATEGY_ROTATION: ReExplainStrategy[] = [
  "analogy", "simpler", "example", "visual", "different",
];

// ─── Hook ─────────────────────────────────────────────────────

export function useAdaptiveTeaching() {
  const [cycle, setCycle] = useState<TeachingCycleState>({
    phase:            "idle",
    topic:            null,
    subject:          "general",
    retryCount:       0,
    maxRetries:       3,
    strategies:       [],
    nextStrategy:     "analogy",
    lastCheckQuestion: null,
    cycleCount:       0,
    masteredTopics:   [],
    struggledTopics:  [],
  });

  // Track turn index when checking started (to detect student answer)
  const checkStartTurnRef = useRef<number>(-1);

  // ── Phase transitions ──────────────────────────────────────

  /**
   * startTeachingCycle — call when AI is about to explain a concept
   * This sets phase to "explaining" and prepares for the check question.
   */
  const startTeachingCycle = useCallback((topic: string, subject: string) => {
    setCycle(prev => ({
      ...prev,
      phase:            "explaining",
      topic,
      subject,
      retryCount:       0,
      strategies:       [],
      nextStrategy:     "analogy",
      lastCheckQuestion: null,
    }));
  }, []);

  /**
   * markExplainDone — call after AI finishes explaining
   * Transitions to "checking" phase — AI will now ask a question.
   */
  const markExplainDone = useCallback((turnIndex: number) => {
    checkStartTurnRef.current = turnIndex;
    setCycle(prev => ({
      ...prev,
      phase: prev.phase === "explaining" || prev.phase === "re_explaining"
        ? "checking"
        : prev.phase,
    }));
  }, []);

  /**
   * recordCheckQuestion — store what question AI asked
   */
  const recordCheckQuestion = useCallback((question: string) => {
    setCycle(prev => ({ ...prev, lastCheckQuestion: question }));
  }, []);

  /**
   * markStudentPassed — student answered correctly
   * Transitions to "mastered" and records topic.
   */
  const markStudentPassed = useCallback(() => {
    setCycle(prev => {
      const topic = prev.topic || "general";
      const isStruggled = prev.retryCount > 0;
      return {
        ...prev,
        phase:          "mastered",
        cycleCount:     prev.cycleCount + 1,
        masteredTopics: prev.masteredTopics.includes(topic)
          ? prev.masteredTopics
          : [...prev.masteredTopics, topic],
        struggledTopics: isStruggled && !prev.struggledTopics.includes(topic)
          ? [...prev.struggledTopics, topic]
          : prev.struggledTopics,
      };
    });
  }, []);

  /**
   * markStudentFailed — student answered incorrectly
   * Transitions to "re_explaining" with next strategy, or "giving_up" if max retries hit.
   */
  const markStudentFailed = useCallback(() => {
    setCycle(prev => {
      if (prev.retryCount >= prev.maxRetries) {
        // Max retries hit — move on
        const topic = prev.topic || "general";
        return {
          ...prev,
          phase: "giving_up",
          cycleCount: prev.cycleCount + 1,
          struggledTopics: prev.struggledTopics.includes(topic)
            ? prev.struggledTopics
            : [...prev.struggledTopics, topic],
        };
      }

      // Pick next strategy (rotate, skip already used ones)
      const usedStrategies = new Set(prev.strategies);
      const nextStrategy = STRATEGY_ROTATION.find(s => !usedStrategies.has(s))
        ?? "different";

      return {
        ...prev,
        phase:        "re_explaining",
        retryCount:   prev.retryCount + 1,
        strategies:   [...prev.strategies, nextStrategy],
        nextStrategy,
      };
    });
  }, []);

  /**
   * resetCycle — call on startNewChat or when topic changes
   */
  const resetCycle = useCallback(() => {
    setCycle({
      phase:            "idle",
      topic:            null,
      subject:          "general",
      retryCount:       0,
      maxRetries:       3,
      strategies:       [],
      nextStrategy:     "analogy",
      lastCheckQuestion: null,
      cycleCount:       0,
      masteredTopics:   [],
      struggledTopics:  [],
    });
    checkStartTurnRef.current = -1;
  }, []);

  /**
   * completeCycle — reset phase to idle after mastered/giving_up
   * so the next topic starts fresh.
   */
  const completeCycle = useCallback(() => {
    setCycle(prev => ({
      ...prev,
      phase:      "idle",
      topic:      null,
      retryCount: 0,
      strategies: [],
      nextStrategy: "analogy",
      lastCheckQuestion: null,
    }));
  }, []);

  // ── Prompt instruction builder ─────────────────────────────

  /**
   * getTeachingInstructions — call before every AI request
   * Returns instructions to inject into the system prompt.
   *
   * Usage in AskAI.tsx:
   *   const ti = getTeachingInstructions();
   *   // Add ti.contextSummary to the request body as teachingContext
   */
  const getTeachingInstructions = useCallback((): TeachingPromptInstructions => {
    const { phase, topic, retryCount, nextStrategy, masteredTopics, struggledTopics } = cycle;

    let phaseInstruction = "";
    let strategyHint     = "";
    let checkInstruction = "";

    switch (phase) {
      case "explaining":
        phaseInstruction = `You are about to explain "${topic}". After your explanation, end with ONE clear check question to verify understanding. Keep the question simple and direct.`;
        checkInstruction = "END_WITH_CHECK_QUESTION";
        break;

      case "re_explaining":
        phaseInstruction = `Student did NOT understand "${topic}" (attempt ${retryCount + 1}). Re-explain using a COMPLETELY DIFFERENT approach. DO NOT repeat your previous explanation.`;
        strategyHint     = STRATEGY_PROMPTS[nextStrategy] || STRATEGY_PROMPTS.different;
        checkInstruction = "END_WITH_CHECK_QUESTION";
        break;

      case "checking":
        phaseInstruction = `You asked a check question about "${topic}". Wait for the student's answer before proceeding.`;
        break;

      case "mastered":
        phaseInstruction = `Student has mastered "${topic}". Briefly congratulate them and naturally transition to the next concept or ask what they want to explore next.`;
        break;

      case "giving_up":
        phaseInstruction = `Student struggled with "${topic}" after ${retryCount} attempts. Acknowledge this warmly. Suggest they revisit it later, and move forward.`;
        break;

      default:
        phaseInstruction = "";
    }

    // Build compact context summary
    const parts: string[] = [];
    if (phase !== "idle") {
      parts.push(`TEACHING PHASE: ${phase.toUpperCase()}`);
    }
    if (masteredTopics.length > 0) {
      parts.push(`Mastered this session: ${masteredTopics.join(", ")}`);
    }
    if (struggledTopics.length > 0) {
      parts.push(`Student struggled with: ${struggledTopics.join(", ")}`);
    }
    if (retryCount > 0 && phase === "re_explaining") {
      parts.push(`Re-explanation attempt ${retryCount}/${cycle.maxRetries}. Strategy: ${nextStrategy}`);
    }
    if (phaseInstruction) parts.push(phaseInstruction);
    if (strategyHint)     parts.push(strategyHint);

    return {
      phaseInstruction,
      strategyHint,
      checkInstruction,
      contextSummary: parts.join("\n"),
    };
  }, [cycle]);

  // ── Helper: should we auto-trigger a teaching cycle? ──────

  /**
   * shouldStartCycle — detects if AI response is an explanation
   * Call after receiving AI response to auto-start teaching cycle.
   */
  const shouldStartCycle = useCallback((
    aiResponse:    string,
    detectedTopic: string | null,
    subject:       string,
  ): boolean => {
    if (cycle.phase !== "idle") return false;
    if (!detectedTopic)        return false;
    if (aiResponse.length < 200) return false; // too short to be an explanation

    const lower = aiResponse.toLowerCase();
    const isExplanation =
      lower.includes("let me explain") ||
      lower.includes("here's how") ||
      lower.includes("this means") ||
      lower.includes("in simple terms") ||
      lower.includes("samjhte hain") ||
      lower.includes("samajhte") ||
      lower.includes("yeh concept") ||
      lower.includes("## ") ||        // markdown heading = structured explanation
      lower.includes("**what") ||
      lower.includes("**how") ||
      (lower.includes("step 1") || lower.includes("step-1") || lower.includes("1."));

    return isExplanation;
  }, [cycle.phase]);

  /**
   * isStudentAnsweringCheck — detects if current student message
   * is a reply to a check question.
   * Call in handleSend before sending to AI.
   */
  const isStudentAnsweringCheck = useCallback((turnIndex: number): boolean => {
    return (
      cycle.phase === "checking" &&
      checkStartTurnRef.current >= 0 &&
      turnIndex > checkStartTurnRef.current
    );
  }, [cycle.phase]);

  // ── Session stats ──────────────────────────────────────────

  const getTeachingStats = useCallback(() => ({
    cycleCount:      cycle.cycleCount,
    masteredTopics:  cycle.masteredTopics,
    struggledTopics: cycle.struggledTopics,
    currentPhase:    cycle.phase,
    currentTopic:    cycle.topic,
    retryCount:      cycle.retryCount,
  }), [cycle]);

  return {
    cycle,
    // Phase control
    startTeachingCycle,
    markExplainDone,
    recordCheckQuestion,
    markStudentPassed,
    markStudentFailed,
    resetCycle,
    completeCycle,
    // Prompt building
    getTeachingInstructions,
    // Detection helpers
    shouldStartCycle,
    isStudentAnsweringCheck,
    // Stats
    getTeachingStats,
  };
}