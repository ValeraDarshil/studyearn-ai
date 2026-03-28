/**
 * AI Study OS — Learning Mode Detector
 * ─────────────────────────────────────────────────────────────
 * Detects WHAT the student is doing right now so the AI
 * can match its behavior to the learning context.
 *
 * Modes:
 *   study    → Concept questions, theory, "explain me"
 *   coding   → Code problems, debugging, programming exercises
 *   revision → "revise", "recap", "summary", past topic revisit
 *   exam     → Quiz mode, time-bound, MCQs, "test me"
 *   homework → Specific assignment help, "solve this problem"
 *   doubt    → Confusion on a specific point, "I don't understand"
 *
 * AI behavior changes per mode:
 *   study    → Full explanation, examples, analogies
 *   coding   → Complete runnable code, inline comments
 *   revision → Bullet points, flash-card style, short answers
 *   exam     → Hints first, MCQ format, time-pressure awareness
 *   homework → Step-by-step solve, show working
 *   doubt    → Re-explain from scratch, different angle
 */

export type LearningMode =
  | 'study'
  | 'coding'
  | 'revision'
  | 'exam'
  | 'homework'
  | 'doubt';

export interface ModeDetectionResult {
  mode:       LearningMode;
  confidence: number;   // 0–1
  signals:    string[]; // why this mode was chosen
  hintMode:   boolean;  // true → give hints, not direct answers
}

// ── Keyword banks per mode ────────────────────────────────────
const MODE_SIGNALS: Record<LearningMode, string[]> = {
  coding: [
    'code', 'program', 'function', 'loop', 'array', 'debug', 'error',
    'syntax', 'output', 'python', 'javascript', 'java', 'c++', 'html', 'css',
    'react', 'node', 'api', 'sql', 'algorithm', 'recursion', 'class', 'object',
    'compile', 'runtime', 'variable', 'string', 'integer', 'list', 'dict',
    'implement', 'write a program', 'write code', 'fix this code', 'what is wrong',
    'print(', 'console.log', 'def ', 'const ', 'let ', 'var ', 'import ',
  ],
  exam: [
    'test me', 'quiz me', 'mcq', 'multiple choice', 'exam', 'mock test',
    'practice questions', 'previous year', 'board exam', 'jee', 'neet',
    'give me questions', 'ask me', 'check my knowledge', 'test my',
    'what would be the answer', 'which option', 'correct answer',
  ],
  revision: [
    'revise', 'revision', 'recap', 'summarize', 'summary', 'key points',
    'quick review', 'brush up', 'remind me', 'what was', 'we studied',
    'last time', 'previously', 'flashcard', 'short notes', 'brief',
    'overview', 'main points', 'important topics',
  ],
  doubt: [
    "don't understand", 'confused', 'not clear', 'what do you mean',
    'can you explain again', 'still not getting', 'i am lost', "i'm lost",
    'not making sense', 'unclear', 'elaborate', 'in simple words',
    'kya matlab', 'samajh nahi', 'phir se batao', 'simple mein',
    'ek baar aur', 'ye kya hai', 'this is confusing',
  ],
  homework: [
    'homework', 'assignment', 'solve this', 'solve the', 'find the',
    'calculate', 'compute', 'evaluate', 'given that', 'prove that',
    'show that', 'question is', 'problem is', 'answer this', 'help me solve',
    'this question', 'this problem', 'my assignment',
  ],
  study: [
    'explain', 'what is', 'how does', 'how do', 'tell me about', 'teach me',
    'what are', 'define', 'concept', 'theory', 'meaning', 'difference between',
    'compare', 'when to use', 'why is', 'how to learn', 'introduction to',
    'basics of', 'fundamentals', 'kya hota', 'kaise kaam karta', 'batao',
  ],
};

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — detectLearningMode
// ─────────────────────────────────────────────────────────────
export function detectLearningMode(
  userMessage: string,
  learnerCategory: string = 'self',
  recentActivity?: string,
): ModeDetectionResult {
  const q       = userMessage.toLowerCase();
  const signals: string[] = [];
  const scores: Record<LearningMode, number> = {
    coding: 0, exam: 0, revision: 0, doubt: 0, homework: 0, study: 0,
  };

  // Score each mode
  for (const [mode, keywords] of Object.entries(MODE_SIGNALS) as [LearningMode, string[]][]) {
    for (const kw of keywords) {
      if (q.includes(kw)) {
        scores[mode] += kw.includes(' ') ? 2 : 1; // phrase match = stronger signal
        signals.push(`"${kw}" → ${mode}`);
      }
    }
  }

  // Boost coding mode for coding learners
  if (learnerCategory === 'coding') scores.coding += 1;

  // Context boost from recent activity
  if (recentActivity) {
    const ra = recentActivity.toLowerCase();
    if (ra.includes('quiz') || ra.includes('challenge')) scores.exam    += 2;
    if (ra.includes('code') || ra.includes('coding'))    scores.coding  += 2;
    if (ra.includes('ask'))                               scores.study   += 1;
  }

  // Find the winning mode
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a) as [LearningMode, number][];
  const [topMode, topScore] = sorted[0];
  const totalSignals = Object.values(scores).reduce((s, v) => s + v, 0);

  const mode       = topScore > 0 ? topMode : 'study'; // default to study
  const confidence = totalSignals > 0 ? Math.min(1, topScore / totalSignals) : 0.5;

  // Hint mode: exam + homework → give hints first (promotes learning)
  const hintMode = mode === 'exam' || (mode === 'homework' && learnerCategory !== 'college');

  return { mode, confidence, signals: signals.slice(0, 5), hintMode };
}

// ─────────────────────────────────────────────────────────────
// getModeInstructions — system prompt instructions per mode
// ─────────────────────────────────────────────────────────────
export function getModeInstructions(mode: LearningMode, hintMode: boolean): string {
  const base: Record<LearningMode, string> = {
    study: `📚 STUDY MODE:
• Give a complete, well-structured explanation with a real-world example.
• Use analogies to make concepts stick.
• End with a 1-sentence key takeaway.`,

    coding: `💻 CODING MODE:
• Always provide COMPLETE, runnable code. No "..." truncations.
• Add inline comments on every important line.
• Show expected output clearly.
• Explain WHY the solution works, not just what it does.
• For bugs: show wrong code → explain the issue → show fixed code.`,

    revision: `🔄 REVISION MODE:
• Be concise. Use bullet points and numbered lists.
• Format as: Key Concept → Brief Explanation → Example (1 line).
• Cover the most important 3–5 points only.
• End with "Quick Test: [1 question to self-check]".`,

    exam: `🎯 EXAM MODE:
• Time is important. Give structured, marks-worthy answers.
• For MCQs: eliminate wrong options first, then explain correct one.
• Write in exam format: intro → body → conclusion.
• Highlight key terms that examiners look for.`,

    homework: `📝 HOMEWORK MODE:
• Solve step-by-step. Show ALL working — no shortcuts.
• Number each step clearly.
• Write the final answer in a box or bold.
• Explain the method so the student can replicate it.`,

    doubt: `🤔 DOUBT MODE:
• The student is confused. Start from absolute basics.
• Use a different approach/angle than before.
• Use an analogy or visual description (ASCII diagram if helpful).
• Check understanding at the end: "Does this make sense now?"`,
  };

  const hintOverride = hintMode ? `\n\n💡 HINT MODE ACTIVE:
• Do NOT give the direct answer immediately.
• First give a hint/nudge: "Think about..." or "Try using...".
• If the student asks for the answer explicitly, then reveal it step by step.
• This promotes active learning and retention.` : '';

  return (base[mode] || base.study) + hintOverride;
}