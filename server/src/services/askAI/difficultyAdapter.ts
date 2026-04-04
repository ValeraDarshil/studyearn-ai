// ─────────────────────────────────────────────────────────────
// AskAI — difficultyAdapter.ts
// Generates level-appropriate explanation instructions.
// Beginner → simple language + analogies
// Advanced  → deeper, edge cases, best practices
// ─────────────────────────────────────────────────────────────

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

// ─────────────────────────────────────────────────────────────
// Adapter Profiles
// ─────────────────────────────────────────────────────────────
const PROFILES: Record<SkillLevel, {
  label:        string;
  instruction:  string;
  exampleDepth: string;
  vocabulary:   string;
  analogy:      boolean;
}> = {
  beginner: {
    label:       'BEGINNER',
    instruction: 'Explain everything from scratch. Assume zero prior knowledge.',
    exampleDepth: 'Use simple, real-world everyday examples the student can instantly relate to.',
    vocabulary:   'Use simple words. Avoid jargon. If a technical term is unavoidable, immediately explain it.',
    analogy:      true,
  },
  intermediate: {
    label:       'INTERMEDIATE',
    instruction: 'Assume basic knowledge. Balance theory with practical examples.',
    exampleDepth: 'Use practical examples. Connect to things they already know.',
    vocabulary:   'Use standard terminology with brief clarifications.',
    analogy:      false,
  },
  advanced: {
    label:       'ADVANCED',
    instruction: 'Skip basics. Go deep. Include edge cases, trade-offs, and best practices.',
    exampleDepth: 'Use complex examples. Include time/space complexity, pitfalls, and optimizations.',
    vocabulary:   'Use precise technical vocabulary. No hand-holding.',
    analogy:      false,
  },
};

// ─────────────────────────────────────────────────────────────
// buildDifficultyInstruction
// Returns a prompt block that tells the AI how to adapt its response
// ─────────────────────────────────────────────────────────────
export function buildDifficultyInstruction(level: SkillLevel): string {
  const p = PROFILES[level];
  const lines = [
    `EXPLANATION LEVEL: ${p.label}`,
    p.instruction,
    p.exampleDepth,
    p.vocabulary,
  ];

  if (p.analogy) {
    lines.push('Use a relatable analogy (food, sports, daily life) to make the concept stick.');
  }

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────
// adaptResponse  (post-processing hint — not used to filter, just style)
// Returns a short note for the prompt about response style.
// ─────────────────────────────────────────────────────────────
export function getResponseStyleNote(level: SkillLevel, isStruggling: boolean): string {
  if (isStruggling && level === 'beginner') {
    return 'The student is struggling. Be extra patient. Break the concept into the smallest possible pieces. Celebrate small wins.';
  }
  if (isStruggling && level === 'intermediate') {
    return 'The student is confused. Go back to basics for this topic. Use a fresh angle or different example.';
  }
  if (level === 'advanced') {
    return 'This is an advanced student. Be concise and precise. They value depth over hand-holding.';
  }
  return '';
}

// ─────────────────────────────────────────────────────────────
// detectSkillLevel  (simple heuristic from question complexity)
// Used as a fallback when no DB profile exists
// ─────────────────────────────────────────────────────────────
export function detectSkillLevelFromMessage(message: string): SkillLevel {
  const lower = message.toLowerCase();

  // Advanced signals
  const advancedKeywords = [
    'time complexity', 'space complexity', 'big o', 'recursion', 'dynamic programming',
    'concurrency', 'deadlock', 'pointer', 'memory leak', 'async await', 'promise chain',
    'eigenvalue', 'fourier', 'laplace', 'differential equation', 'entropy',
    'gradient descent', 'backpropagation',
  ];
  if (advancedKeywords.some(k => lower.includes(k))) return 'advanced';

  // Beginner signals
  const beginnerKeywords = [
    'what is', 'kya hai', 'i am new', 'beginner', 'first time',
    'don\'t know', 'never heard', 'basics', 'start from', 'explain simply',
    'easy way', 'for dummies',
  ];
  if (beginnerKeywords.some(k => lower.includes(k))) return 'beginner';

  return 'intermediate';
}