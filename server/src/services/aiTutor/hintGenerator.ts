/**
 * AI Study OS — Smart Hint Generator
 * ─────────────────────────────────────────────────────────────
 * Instead of giving direct answers, generates smart HINTS
 * that guide the student to discover the answer themselves.
 *
 * Why hints matter:
 *   Direct answer → student forgets in 1 hour
 *   Hint → student thinks → finds answer → remembers for weeks
 *
 * Hint levels (progressive):
 *   Level 1 → Conceptual nudge    ("Think about what a loop does...")
 *   Level 2 → Directional hint    ("Try using a for loop with range...")
 *   Level 3 → Structural hint     ("Your loop structure should look like: for i in ...")
 *   Level 4 → Full solution       (when student is clearly stuck)
 *
 * Used in:
 *   - Coding exercises (hintGenerator detects code problems)
 *   - Homework problems (when hintMode = true)
 *   - Exam prep (encourages recall, not lookup)
 */

import { logger } from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export interface HintResult {
  hintLevel:     1 | 2 | 3 | 4;
  hint:          string;
  shouldReveal:  boolean;   // true = give full answer
  nextPrompt:    string;    // what to ask student next
}

// ── Detect if a question is "hintable" ───────────────────────
const DIRECT_ANSWER_TRIGGERS = [
  'give me the answer', 'just tell me', 'full solution', 'complete solution',
  'tell me directly', 'show me the answer', 'i give up', 'i dont know',
  "i don't know", 'stop hinting', 'skip hints', 'full code please',
  'just show', 'no hints', 'answer directly', 'solution please',
  'bata do', 'direct bata', 'answer de do', 'seedha batao',
];

const STUCK_SIGNALS = [
  'still confused', 'still not getting', 'not working', 'error', 'wrong',
  "can't figure", "can't solve", 'tried everything', 'help me',
  'this is hard', 'no idea', 'what now', 'then what', 'what next',
  'samajh nahi', 'kya karoon', 'nahi ho raha',
];

export function shouldGiveDirectAnswer(userMessage: string): boolean {
  const q = userMessage.toLowerCase();
  return DIRECT_ANSWER_TRIGGERS.some(t => q.includes(t));
}

export function isStudentStuck(userMessage: string): boolean {
  const q = userMessage.toLowerCase();
  return STUCK_SIGNALS.some(t => q.includes(t));
}

// ─────────────────────────────────────────────────────────────
// generateHint — creates a contextual hint for any question
// ─────────────────────────────────────────────────────────────
export async function generateHint(
  userMessage:   string,
  topic:         string,
  subject:       string,
  hintLevel:     1 | 2 | 3 | 4 = 1,
  learnerType:   string = 'self',
): Promise<HintResult> {
  try {
    // Level 4 = just give the answer
    if (hintLevel >= 4 || shouldGiveDirectAnswer(userMessage)) {
      return {
        hintLevel: 4,
        hint: '',  // signal to aiTutor.service to give full answer
        shouldReveal: true,
        nextPrompt: 'Does the solution make sense? Try modifying it to make sure you understand.',
      };
    }

    const hint = buildHint(userMessage, topic, subject, hintLevel, learnerType);
    const clampedLevel = Math.min(hintLevel, 3) as 1 | 2 | 3;
    const nextPrompt = buildNextPrompt(clampedLevel, topic);

    return { hintLevel, hint, shouldReveal: false, nextPrompt };
  } catch (err: any) {
    logger.error(`[HintGenerator] generateHint: ${err.message}`);
    return { hintLevel: 4, hint: '', shouldReveal: true, nextPrompt: '' };
  }
}

// ─────────────────────────────────────────────────────────────
// getHintSystemPrompt — prompt suffix that activates hint mode
// ─────────────────────────────────────────────────────────────
export function getHintSystemPrompt(hintLevel: 1 | 2 | 3 | 4): string {
  if (hintLevel >= 4) return ''; // No restriction — give full answer

  const levelInstructions: Record<number, string> = {
    1: `💡 HINT MODE — LEVEL 1 (Conceptual Nudge):
• Do NOT give the answer or code.
• Give only a conceptual nudge: what concept/idea should the student think about?
• Example: "Think about what happens when you repeat an action multiple times..."
• End with a question that guides their thinking.`,

    2: `💡 HINT MODE — LEVEL 2 (Directional):
• Do NOT give the full answer.
• Point toward the right approach. Name the method/concept they should use.
• Example: "You'll want to use a for loop here. Think about what the range should be."
• Show at most 2-3 lines of pseudocode — NOT working code.`,

    3: `💡 HINT MODE — LEVEL 3 (Structural):
• Show the skeleton/structure only — NOT the complete working solution.
• Fill in key parts but leave the logic for the student to complete.
• Example: "for i in range(___): result = result + ___"
• Explain what goes in the blanks conceptually.`,
  };

  return levelInstructions[hintLevel] || '';
}

// ─────────────────────────────────────────────────────────────
// buildHintContext — injects hint instructions into tutor prompt
// Called by aiTutor.service before sending to AI
// ─────────────────────────────────────────────────────────────
export function buildHintContext(
  hintMode:  boolean,
  hintLevel: 1 | 2 | 3 | 4,
  userMsg:   string,
): string {
  if (!hintMode) return '';

  if (shouldGiveDirectAnswer(userMsg)) {
    return `\n\n⚠️ OVERRIDE: Student has explicitly asked for the full answer. Give the complete solution now.`;
  }

  if (isStudentStuck(userMsg)) {
    return `\n\n⚠️ STUDENT SEEMS STUCK: Give a stronger hint (level up). Don't reveal the full answer yet unless they've had 3+ attempts.`;
  }

  return `\n\n${getHintSystemPrompt(hintLevel)}`;
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function buildHint(
  question:    string,
  topic:       string,
  subject:     string,
  level:       1 | 2 | 3 | 4,
  learnerType: string,
): string {
  const q = question.toLowerCase();
  const isCoding = subject === 'Programming' || learnerType === 'coding';

  if (isCoding) {
    const codingHints: Record<number, string> = {
      1: `Think about what built-in tools or structures in the language could help solve this type of problem.`,
      2: `You'll want to use ${topic}. Think about how you'd loop through the data or check each element.`,
      3: `Your solution structure should be: [initialize] → [iterate/check] → [collect result]. Fill in the logic.`,
    };
    return codingHints[level] || '';
  }

  const mathSignals = ['solve', 'calculate', 'find', 'prove', 'equation'];
  if (mathSignals.some(s => q.includes(s))) {
    const mathHints: Record<number, string> = {
      1: `Start by identifying what formula applies to this type of problem.`,
      2: `Use the ${topic} formula. What values do you know, and what are you solving for?`,
      3: `Substitute the known values and simplify step by step.`,
    };
    return mathHints[level] || '';
  }

  // General hints
  const generalHints: Record<number, string> = {
    1: `Think about the core concept behind ${topic}. What is its fundamental purpose?`,
    2: `Focus on how ${topic} relates to the broader ${subject} concept. What key principle applies here?`,
    3: `Structure your answer: [state the concept] → [apply to this case] → [give the result].`,
  };
  return generalHints[level] || '';
}

function buildNextPrompt(level: 1 | 2 | 3, topic: string): string {
  const prompts: Record<number, string> = {
    1: `Give it a try! What do you think the approach might be?`,
    2: `Try to apply that approach and share what you come up with.`,
    3: `Fill in the blanks and run it. What output do you get?`,
  };
  return prompts[level] || `Try solving it and let me know where you get stuck!`;
}