// ─────────────────────────────────────────────────────────────
// AskAI — aiResponsePlanner.ts
// Thinking layer: analyzes user intent before answering.
// Flow: input → intent → difficulty → response strategy → output
// ─────────────────────────────────────────────────────────────

export type Intent =
  | 'EXPLAIN'       // "what is X", "explain X"
  | 'SOLVE'         // "solve this", "find X"
  | 'DEBUG'         // "why is my code wrong", "fix this"
  | 'GUIDE'         // "how do I", "help me with"
  | 'QUIZ'          // "quiz me", "test me"
  | 'FOLLOWUP'      // short question continuing prior context
  | 'CONCEPTUAL'    // "why does X work", "what's the difference"
  | 'GENERAL';      // catch-all

export type ResponseStrategy =
  | 'TEACH'         // full concept explanation with examples
  | 'STEP_BY_STEP'  // numbered breakdown
  | 'HINT'          // give hint first, not full answer
  | 'SOLVE'         // complete solution
  | 'GUIDE'         // ask questions back to guide student
  | 'QUIZ'          // generate quiz question
  | 'FULL_SOLUTION' // comprehensive answer for complex problems
  | 'SHORT';        // brief, direct answer

export interface ResponsePlan {
  intent:           Intent;
  strategy:         ResponseStrategy;
  followUpQuestion: boolean;  // should AI end with a question?
  correctGently:    boolean;  // is user likely wrong? correct softly
  boostConfidence:  boolean;  // encourage the student
}

// ─────────────────────────────────────────────────────────────
// Intent Detection
// ─────────────────────────────────────────────────────────────
const INTENT_PATTERNS: { intent: Intent; patterns: RegExp[] }[] = [
  {
    intent: 'EXPLAIN',
    patterns: [
      /^(what is|what are|explain|describe|define|tell me about|kya hai|kya hota|bata)/i,
    ],
  },
  {
    intent: 'SOLVE',
    patterns: [
      /^(solve|calculate|compute|find the|evaluate|simplify|solve for)/i,
      /=\s*\?/,
      /find\s+(x|y|z|value)/i,
    ],
  },
  {
    intent: 'DEBUG',
    patterns: [
      /^(why (is|does|isn't|doesn't|won't)|debug|fix|error|wrong|not working|issue|bug)/i,
      /(error|exception|undefined|null pointer|stack overflow)/i,
    ],
  },
  {
    intent: 'GUIDE',
    patterns: [
      /^(how (do|can|should|to)|help me|guide me|walk me|kaise|kaise karu)/i,
    ],
  },
  {
    intent: 'QUIZ',
    patterns: [
      /^(quiz me|test me|ask me|give me (a )?question|practice)/i,
    ],
  },
  {
    intent: 'CONCEPTUAL',
    patterns: [
      /^(why|what('s| is) the difference|compare|vs|versus|difference between)/i,
    ],
  },
  {
    intent: 'FOLLOWUP',
    patterns: [
      /^(ok|okay|got it|i see|and|but|so|then|what about|how about|aur|toh)/i,
    ],
  },
];

export function detectIntent(message: string): Intent {
  const trimmed = message.trim();
  for (const { intent, patterns } of INTENT_PATTERNS) {
    if (patterns.some(p => p.test(trimmed))) return intent;
  }
  // Short messages in a session are likely follow-ups
  if (trimmed.split(' ').length <= 5) return 'FOLLOWUP';
  return 'GENERAL';
}

// ─────────────────────────────────────────────────────────────
// Strategy Selector
// ─────────────────────────────────────────────────────────────
export function selectStrategy(
  intent:        Intent,
  skillLevel:    'beginner' | 'intermediate' | 'advanced',
  isStruggling:  boolean,
  turnCount:     number,
): ResponseStrategy {

  if (intent === 'QUIZ')   return 'QUIZ';
  if (intent === 'DEBUG')  return 'STEP_BY_STEP';
  if (intent === 'FOLLOWUP' && turnCount > 0) return 'SHORT';

  if (isStruggling) {
    // Student is struggling → guide them, don't just give answer
    if (intent === 'SOLVE') return 'STEP_BY_STEP';
    if (intent === 'EXPLAIN') return 'TEACH';
    return 'GUIDE';
  }

  switch (intent) {
    case 'EXPLAIN':    return skillLevel === 'advanced' ? 'FULL_SOLUTION' : 'TEACH';
    case 'SOLVE':      return skillLevel === 'beginner'  ? 'STEP_BY_STEP'  : 'SOLVE';
    case 'GUIDE':      return 'STEP_BY_STEP';
    case 'CONCEPTUAL': return 'TEACH';
    case 'GENERAL':    return 'TEACH';
    default:           return 'TEACH';
  }
}

// ─────────────────────────────────────────────────────────────
// buildPlan  (main export)
// ─────────────────────────────────────────────────────────────
export function buildResponsePlan(
  message:      string,
  skillLevel:   'beginner' | 'intermediate' | 'advanced',
  mistakeTopics: string[],
  turnCount:    number,
): ResponsePlan {
  const intent        = detectIntent(message);
  const isStruggling  = mistakeTopics.length > 0;
  const strategy      = selectStrategy(intent, skillLevel, isStruggling, turnCount);

  return {
    intent,
    strategy,
    followUpQuestion: strategy !== 'QUIZ' && strategy !== 'SHORT' && strategy !== 'FULL_SOLUTION',
    correctGently:    isStruggling,
    boostConfidence:  isStruggling || turnCount > 3,
  };
}