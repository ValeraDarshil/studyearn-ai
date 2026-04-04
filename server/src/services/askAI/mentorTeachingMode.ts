// ─────────────────────────────────────────────────────────────
// AskAI — mentorTeachingMode.ts
// Controls how the AI "teaches" vs "answers".
// Generates the instruction block that transforms the AI from
// a search engine into an actual mentor.
// ─────────────────────────────────────────────────────────────

import type { ResponseStrategy } from './aiResponsePlanner.js';

// ─────────────────────────────────────────────────────────────
// Teaching mode instructions per strategy
// ─────────────────────────────────────────────────────────────
const STRATEGY_INSTRUCTIONS: Record<ResponseStrategy, string> = {
  TEACH: `
TEACHING MODE: EXPLAIN
- Start with the core concept in 1-2 simple sentences.
- Give a real-world analogy.
- Then go deeper with examples.
- End with 1 follow-up question to check understanding.`,

  STEP_BY_STEP: `
TEACHING MODE: STEP-BY-STEP
- Say "Let's solve this step by step."
- Number each step clearly (Step 1, Step 2…).
- Show all work — no skipping steps.
- After each major step, briefly explain WHY you did it.
- At the end, state the final answer clearly.`,

  HINT: `
TEACHING MODE: HINT
- DO NOT give the answer directly.
- Give 1-2 hints that point the student in the right direction.
- Ask: "Can you try the next step with this hint?"
- Only reveal the full solution if they're still stuck after the hint.`,

  SOLVE: `
TEACHING MODE: SOLVE
- Provide a complete, correct solution.
- Show key steps for clarity.
- Briefly explain the logic behind the approach.`,

  GUIDE: `
TEACHING MODE: GUIDE
- Ask the student 1 diagnostic question first to understand where they're stuck.
- Based on their response, guide them with targeted hints.
- Encourage them to arrive at the answer themselves.
- Say things like "You're on the right track…" or "Think about what happens when…"`,

  QUIZ: `
TEACHING MODE: QUIZ
- Create 1 clear, level-appropriate question on this topic.
- Give 4 multiple-choice options (A, B, C, D).
- Tell them you'll explain the answer after they respond.`,

  FULL_SOLUTION: `
TEACHING MODE: FULL SOLUTION
- Provide a comprehensive, complete answer.
- Use headings to organize different sections.
- Include examples, edge cases, and common mistakes to avoid.`,

  SHORT: `
TEACHING MODE: SHORT
- Give a concise, direct answer.
- 2-3 sentences maximum unless a brief example helps.`,
};

// ─────────────────────────────────────────────────────────────
// buildTeachingInstruction
// ─────────────────────────────────────────────────────────────
export function buildTeachingInstruction(strategy: ResponseStrategy): string {
  return STRATEGY_INSTRUCTIONS[strategy] || STRATEGY_INSTRUCTIONS.TEACH;
}

// ─────────────────────────────────────────────────────────────
// buildFollowUpInstruction
// ─────────────────────────────────────────────────────────────
export function buildFollowUpInstruction(shouldAsk: boolean, topic?: string): string {
  if (!shouldAsk) return '';
  const topicPart = topic ? ` about ${topic}` : '';
  return `\nFOLLOW-UP: End your response with 1 smart, short question${topicPart} to check the student's understanding. Keep it natural, not robotic.`;
}

// ─────────────────────────────────────────────────────────────
// buildConfidenceBoost
// ─────────────────────────────────────────────────────────────
export function buildConfidenceBoost(shouldBoost: boolean, isFirstInteraction: boolean): string {
  if (!shouldBoost) return '';
  if (isFirstInteraction) return '\nStart with a warm welcome — make the student feel at ease.';
  return '\nIf the student has been struggling, acknowledge their effort: "You\'re improving!" or "Good question!" before answering.';
}

// ─────────────────────────────────────────────────────────────
// buildCorrectionInstruction
// ─────────────────────────────────────────────────────────────
export function buildCorrectionInstruction(shouldCorrect: boolean): string {
  if (!shouldCorrect) return '';
  return '\nCORRECTION MODE: If the student said something incorrect, correct them gently. Start with what they got right, then fix the misunderstanding. Never say "you\'re wrong" — say "Almost! Let me clarify…"';
}