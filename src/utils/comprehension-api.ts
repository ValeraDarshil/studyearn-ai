/**
 * comprehension-api.ts
 * ─────────────────────────────────────────────────────────────
 * ROUTE: src/utils/comprehension-api.ts
 *
 * GAP #1 FIX — Real Feedback Loop (Comprehension Tracking)
 *
 * What this does:
 *   1. Tracks every student response action (understood / reexplain / testme)
 *   2. Tracks test-question results (correct / incorrect / skipped)
 *   3. Sends comprehension events to backend for DB storage
 *   4. Provides local session stats so AskAI can adapt in real-time
 *
 * Backend endpoints this calls (you need to create these):
 *   POST /api/comprehension/event   — log a comprehension event
 *   POST /api/comprehension/result  — log test question result
 *   GET  /api/comprehension/stats   — get user's comprehension stats
 *
 * If backend is not ready yet, everything degrades gracefully
 * (local session tracking still works without backend calls).
 * ─────────────────────────────────────────────────────────────
 */

const API_URL = import.meta.env.VITE_API_URL as string;

function authHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Types ────────────────────────────────────────────────────

export type ComprehensionAction =
  | "understood"    // Student clicked "Samajh aaya 👍"
  | "reexplain"     // Student clicked "Dubara samjhao 🔁"
  | "testme"        // Student clicked "Test me 🧠"
  | "style_choice"  // Student picked a learning style
  | "hint_used"     // Student used a hint
  | "skipped";      // Student moved on without feedback

export type TestResult =
  | "correct"       // Student answered test question correctly
  | "incorrect"     // Student answered test question incorrectly
  | "partial"       // Student partially answered
  | "skipped";      // Student didn't answer

export interface ComprehensionEvent {
  action:        ComprehensionAction;
  topic:         string | null;    // detected topic at time of action
  subject:       string | null;    // auto/math/coding/science/general
  convoId:       string | null;    // which conversation
  turnIndex:     number;           // which turn in conversation (0-based)
  responseTimeMs?: number;         // how fast student responded (ms)
}

export interface TestResultEvent {
  topic:         string | null;
  subject:       string | null;
  convoId:       string | null;
  result:        TestResult;
  questionText?: string;           // the test question asked
  answerText?:   string;           // student's answer text
  confidenceMs?: number;           // time taken to answer
}

export interface ComprehensionStats {
  totalInteractions:   number;
  understoodCount:     number;
  reexplainCount:      number;
  testmeCount:         number;
  testCorrectCount:    number;
  testIncorrectCount:  number;
  comprehensionRate:   number;    // 0-100: (understood + testCorrect) / total
  reexplainRate:       number;    // % of times student needed re-explanation
  topWeakTopics:       string[];  // topics most often re-explained
  topStrongTopics:     string[];  // topics student understood quickly
  sessionStreak:       number;    // consecutive "understood" in this session
  avgResponseTimeMs:   number;
}

// ─── Local Session State (in-memory, no DB needed) ─────────────
// This tracks stats for the CURRENT session only.
// Resets on page refresh. Backend stores long-term data.

interface SessionState {
  events:              ComprehensionEvent[];
  testResults:         TestResultEvent[];
  topicReexplainMap:   Record<string, number>;  // topic → reexplain count
  topicUnderstoodMap:  Record<string, number>;  // topic → understood count
  consecutiveUnderstood: number;
  lastActionTime:      number;
}

const sessionState: SessionState = {
  events:              [],
  testResults:         [],
  topicReexplainMap:   {},
  topicUnderstoodMap:  {},
  consecutiveUnderstood: 0,
  lastActionTime:      0,
};

// ─── Core Functions ───────────────────────────────────────────

/**
 * trackComprehension — call this when student clicks action buttons
 *
 * Usage in AskAI.tsx:
 *   import { trackComprehension } from "../utils/comprehension-api";
 *   trackComprehension({ action: "understood", topic: currentTopic, ... });
 */
export async function trackComprehension(event: ComprehensionEvent): Promise<void> {
  const now = Date.now();
  const responseTimeMs = sessionState.lastActionTime
    ? now - sessionState.lastActionTime
    : undefined;

  const enrichedEvent: ComprehensionEvent = {
    ...event,
    responseTimeMs: responseTimeMs ?? event.responseTimeMs,
  };

  // ── Update local session state ────────────────────────────
  sessionState.events.push(enrichedEvent);
  sessionState.lastActionTime = now;

  const topic = event.topic || "general";

  if (event.action === "understood") {
    sessionState.topicUnderstoodMap[topic] =
      (sessionState.topicUnderstoodMap[topic] || 0) + 1;
    sessionState.consecutiveUnderstood++;
  } else if (event.action === "reexplain") {
    sessionState.topicReexplainMap[topic] =
      (sessionState.topicReexplainMap[topic] || 0) + 1;
    sessionState.consecutiveUnderstood = 0;
  } else if (event.action === "testme") {
    sessionState.consecutiveUnderstood = 0;
  }

  // ── Send to backend (fire-and-forget, non-blocking) ────────
  try {
    await fetch(`${API_URL}/api/comprehension/event`, {
      method:  "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body:    JSON.stringify(enrichedEvent),
    });
  } catch {
    // Silent fail — local tracking still works
  }
}

/**
 * trackTestResult — call this when AI gave a test question and student answered
 *
 * Usage in AskAI.tsx:
 *   When AI response contains a question AND student sends an answer,
 *   call this with the evaluation result.
 */
export async function trackTestResult(result: TestResultEvent): Promise<void> {
  sessionState.testResults.push(result);

  const topic = result.topic || "general";
  if (result.result === "correct") {
    sessionState.topicUnderstoodMap[topic] =
      (sessionState.topicUnderstoodMap[topic] || 0) + 1;
    sessionState.consecutiveUnderstood++;
  } else if (result.result === "incorrect") {
    sessionState.topicReexplainMap[topic] =
      (sessionState.topicReexplainMap[topic] || 0) + 1;
    sessionState.consecutiveUnderstood = 0;
  }

  try {
    await fetch(`${API_URL}/api/comprehension/result`, {
      method:  "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body:    JSON.stringify(result),
    });
  } catch {
    // Silent fail
  }
}

/**
 * getSessionComprehensionStats — returns live stats for current session
 * Use this to adapt AI strategy mid-session without a backend call.
 */
export function getSessionComprehensionStats(): ComprehensionStats {
  const events     = sessionState.events;
  const tests      = sessionState.testResults;
  const total      = events.length;
  const understood = events.filter(e => e.action === "understood").length;
  const reexplain  = events.filter(e => e.action === "reexplain").length;
  const testme     = events.filter(e => e.action === "testme").length;
  const correct    = tests.filter(t => t.result === "correct").length;
  const incorrect  = tests.filter(t => t.result === "incorrect").length;

  const comprehensionRate = total > 0
    ? Math.round(((understood + correct) / (total + tests.length)) * 100)
    : 100;

  const reexplainRate = total > 0
    ? Math.round((reexplain / total) * 100)
    : 0;

  // Top weak topics = sorted by reexplain count desc
  const topWeakTopics = Object.entries(sessionState.topicReexplainMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([topic]) => topic);

  const topStrongTopics = Object.entries(sessionState.topicUnderstoodMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([topic]) => topic);

  const responseTimes = events
    .filter(e => e.responseTimeMs !== undefined)
    .map(e => e.responseTimeMs!);

  const avgResponseTimeMs = responseTimes.length > 0
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : 0;

  return {
    totalInteractions:   total,
    understoodCount:     understood,
    reexplainCount:      reexplain,
    testmeCount:         testme,
    testCorrectCount:    correct,
    testIncorrectCount:  incorrect,
    comprehensionRate,
    reexplainRate,
    topWeakTopics,
    topStrongTopics,
    sessionStreak:       sessionState.consecutiveUnderstood,
    avgResponseTimeMs,
  };
}

/**
 * getBackendComprehensionStats — fetches long-term stats from backend
 * Use this at session start to pre-load what AI knows about this student.
 */
export async function getBackendComprehensionStats(): Promise<ComprehensionStats | null> {
  try {
    const res  = await fetch(`${API_URL}/api/comprehension/stats`, {
      headers: authHeader(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.stats : null;
  } catch {
    return null;
  }
}

/**
 * buildComprehensionContext — builds a compact context string for AI prompt injection
 *
 * Usage: inject this into your system prompt so AI knows how well student is doing
 * Example output:
 *   "Student comprehension this session: 75% (3 understood, 1 re-explained).
 *    Weak topics: recursion, pointers. Strong: arrays, loops.
 *    Currently on a 2-question understanding streak."
 */
export function buildComprehensionContext(stats: ComprehensionStats): string {
  if (stats.totalInteractions === 0) return "";

  const parts: string[] = [];

  parts.push(
    `Student comprehension this session: ${stats.comprehensionRate}% ` +
    `(${stats.understoodCount} understood, ${stats.reexplainCount} re-explained, ` +
    `${stats.testCorrectCount} test-correct, ${stats.testIncorrectCount} test-wrong).`
  );

  if (stats.topWeakTopics.length > 0) {
    parts.push(`Weak topics: ${stats.topWeakTopics.join(", ")}.`);
  }

  if (stats.topStrongTopics.length > 0) {
    parts.push(`Strong topics: ${stats.topStrongTopics.join(", ")}.`);
  }

  if (stats.sessionStreak >= 2) {
    parts.push(`On a ${stats.sessionStreak}-question understanding streak.`);
  }

  if (stats.reexplainRate > 50) {
    parts.push("Student is struggling — use simpler language and more analogies.");
  } else if (stats.comprehensionRate > 80) {
    parts.push("Student is understanding well — can handle more depth.");
  }

  return parts.join(" ");
}

/**
 * resetSessionState — call this on startNewChat()
 */
export function resetSessionComprehension(): void {
  sessionState.events              = [];
  sessionState.testResults         = [];
  sessionState.topicReexplainMap   = {};
  sessionState.topicUnderstoodMap  = {};
  sessionState.consecutiveUnderstood = 0;
  sessionState.lastActionTime      = 0;
}

/**
 * detectIfAIAskedQuestion — helper to detect if AI response contains a test question
 * Returns true if AI response ends with or contains a direct question.
 *
 * Usage: Call after each AI response when action was "testme".
 * If returns true, set a flag so next student message is treated as an "answer to test".
 */
export function detectIfAIAskedQuestion(aiResponse: string): boolean {
  if (!aiResponse || aiResponse.length < 20) return false;

  const lower = aiResponse.toLowerCase();

  // Common question patterns
  const questionPatterns = [
    /\?(\s*$|\s*[""'])/,                         // ends with ?
    /what (is|are|was|were|do|does|did)\b/,       // what is...
    /can you (tell|explain|say|describe)\b/,      // can you tell...
    /which (of|one|option|answer)\b/,             // which of...
    /how (many|much|do|does|would)\b/,            // how many...
    /true or false/,                              // true/false questions
    /bata[oo]?\b/,                                // hinglish: batao
    /kya aap\b/,                                  // hinglish: kya aap
    /answer (this|below|the following)\b/,        // answer this
    /solve (this|the following)\b/,               // solve this
  ];

  return questionPatterns.some(p => p.test(lower));
}

/**
 * getAdaptiveStrategyHint — based on comprehension stats, suggests AI strategy
 * Returns a short instruction string to prepend to the system prompt.
 *
 * Usage: Inject into each request so AI adapts its teaching approach.
 */
export function getAdaptiveStrategyHint(stats: ComprehensionStats): string {
  if (stats.totalInteractions === 0) return "";

  if (stats.reexplainRate > 60) {
    return "ADAPTIVE: Student is struggling. Use very simple language. Break into tiny steps. More analogies. Avoid jargon.";
  }

  if (stats.sessionStreak >= 3) {
    return "ADAPTIVE: Student is on a hot streak. Can handle advanced depth, edge cases, and challenging follow-ups.";
  }

  if (stats.testIncorrectCount > stats.testCorrectCount) {
    return "ADAPTIVE: Student answers test questions incorrectly often. Re-explain before testing. Check understanding first.";
  }

  if (stats.comprehensionRate > 85 && stats.totalInteractions > 4) {
    return "ADAPTIVE: Student comprehends quickly. Keep responses concise. Can skip basics. Challenge them more.";
  }

  return "";
}