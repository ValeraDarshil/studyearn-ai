// ─────────────────────────────────────────────────────────────
// AskAI — aiResponsePlanner.ts  (v14 — EXECUTION LAYER ONLY)
//
// ARCHITECTURAL CHANGE (v13 → v14):
//
//   v13: This file detected intent, scored strategies, and made
//        decisions about which strategy to use. It was effectively
//        a second decision engine running in parallel with aiBrainCore.
//
//   v14: This file is now a PURE EXECUTION LAYER.
//        - It reads FinalDecision from aiBrainCore (the authority).
//        - It builds a ResponsePlan that downstream prompt-builders need.
//        - It makes ZERO independent decisions about strategy, model, or tone.
//
//   ALL decision logic (intent routing, comprehension overrides,
//   reexplain detection, cognitiveLoad switching) has been removed
//   from this file. Those decisions live in aiBrainCore.ts only.
//
//   BACKWARD COMPATIBILITY:
//   - ResponsePlan interface is preserved (same shape as v13)
//   - buildResponsePlan() still exists (signature compatible)
//   - detectIntent() still exported (used by orchestrator for logging)
//   - New: buildResponsePlanFromDecision() — primary function when
//     a FinalDecision is available (preferred path)
// ─────────────────────────────────────────────────────────────

import type { FinalDecision } from '../adaptive/aiBrainCore.js';

// ── Types (preserved from v13 — backward compatible) ──────────

export type Intent =
  | 'EXPLAIN'
  | 'SOLVE'
  | 'DEBUG'
  | 'GUIDE'
  | 'QUIZ'
  | 'FOLLOWUP'
  | 'CONCEPTUAL'
  | 'GENERAL';

export type ResponseStrategy =
  | 'TEACH'
  | 'STEP_BY_STEP'
  | 'HINT'
  | 'SOLVE'
  | 'GUIDE'
  | 'QUIZ'
  | 'FULL_SOLUTION'
  | 'SHORT'
  | 'SIMPLIFY'    // ✅ NEW
  | 'ENCOURAGE';  // ✅ NEW

export interface ResponsePlan {
  intent:              Intent;
  strategy:            ResponseStrategy;
  followUpQuestion:    boolean;
  correctGently:       boolean;
  boostConfidence:     boolean;
  turnCount?:          number;
  // v13 fields — preserved for downstream compatibility
  adaptationReason?:   string;
  useAnalogy?:         boolean;
  keepShort?:          boolean;
  emphasizeEncourage?: boolean;
}

// v13 intelligence input — preserved for legacy compatibility
export interface PlannerIntelligenceInput {
  comprehensionRate?:  number;
  reexplainRate?:      number;
  sessionStreak?:      number;
  topWeakTopics?:      string[];
  teachingPhase?:      string;
  learningStyle?:      string;
  cognitiveLoad?:      string;
  responseDensity?:    string;
}

// ─────────────────────────────────────────────────────────────
// Intent Detection — preserved from v13, used for logging only
// Planner no longer uses intent to determine strategy.
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
  if (trimmed.split(' ').length <= 5) return 'FOLLOWUP';
  return 'GENERAL';
}

// ─────────────────────────────────────────────────────────────
// mapBrainStrategy — maps adaptive TeachingStrategy to ResponseStrategy
// ─────────────────────────────────────────────────────────────
function mapBrainStrategy(brainStrategy: FinalDecision['strategy']): ResponseStrategy {
  const mapping: Record<string, ResponseStrategy> = {
    'TEACH':         'TEACH',
    'SIMPLIFY':      'SIMPLIFY',      // ✅ FIXED: was 'TEACH' — preserves simplest-level behaviour
    'STEP_BY_STEP':  'STEP_BY_STEP',
    'HINT':          'HINT',
    'CHALLENGE':     'FULL_SOLUTION', // CHALLENGE → FULL_SOLUTION (harder content)
    'GUIDE':         'GUIDE',
    'QUIZ':          'QUIZ',
    'FULL_SOLUTION': 'FULL_SOLUTION',
    'ENCOURAGE':     'ENCOURAGE',     // ✅ FIXED: was 'TEACH' — preserves warm-acknowledgement behaviour
    'SHORT':         'SHORT',
  };
  return mapping[brainStrategy] ?? 'TEACH';
}

// ─────────────────────────────────────────────────────────────
// buildResponsePlanFromDecision — PRIMARY function (v14)
//
// Converts a FinalDecision into a ResponsePlan.
// This is the ONLY place strategy enters the plan — from Brain Core.
// No overrides. No independent decisions.
// ─────────────────────────────────────────────────────────────
export function buildResponsePlanFromDecision(
  message:       string,
  decision:      FinalDecision,
  turnCount:     number,
  stepByStep?:   boolean,
): ResponsePlan {
  const intent = detectIntent(message); // for logging/metadata only

  // Strategy comes from Brain Core — this file does NOT override it
  let strategy = mapBrainStrategy(decision.strategy);

  // stepByStep is a user-explicit override — the one legitimate override
  // because it's a direct UI control, not a system decision
  if (stepByStep && strategy !== 'QUIZ') {
    strategy = 'STEP_BY_STEP';
  }

  const state = decision.inferredState;

  return {
    intent,
    strategy,
    followUpQuestion:    decision.followUpRequired,
    correctGently:       state.needsReexplain || state.emotion === 'confused',
    boostConfidence:     state.needsEncouragement || decision.tone === 'encouraging' || decision.tone === 'warm',
    turnCount,
    adaptationReason:    decision.strategyReason,
    useAnalogy:          state.needsReexplain || decision.difficultyLevel === 'beginner',
    keepShort:           strategy === 'SHORT',
    emphasizeEncourage:  decision.tone === 'encouraging',
  };
}

// ─────────────────────────────────────────────────────────────
// buildResponsePlan — LEGACY function (backward compatible)
//
// Preserved for callers that don't have a FinalDecision yet.
// When aiBrainCore is available, always prefer buildResponsePlanFromDecision.
//
// IMPORTANT: This function still does intent-based planning as a
// fallback. It is NOT authoritative. It should only run if Brain
// Core fails or is unavailable.
// ─────────────────────────────────────────────────────────────
export function buildResponsePlan(
  message:       string,
  skillLevel:    'beginner' | 'intermediate' | 'advanced',
  mistakeTopics: string[],
  turnCount:     number,
  intel?:        PlannerIntelligenceInput,
): ResponsePlan {
  const intent       = detectIntent(message);
  const isStruggling = mistakeTopics.length > 0;
  const isReexplain  = /dubara|phir se|samajh nahi|explain again|different (way|example)|try again|once more|naya example/.test(message.toLowerCase());

  // Fallback strategy selection (only used when Brain Core is unavailable)
  let strategy: ResponseStrategy = 'TEACH';

  if (intent === 'QUIZ')                       strategy = 'QUIZ';
  else if (intent === 'DEBUG')                 strategy = 'STEP_BY_STEP';
  else if (intent === 'FOLLOWUP' && turnCount > 0) strategy = 'SHORT';
  else if (isStruggling || isReexplain)        strategy = 'STEP_BY_STEP';
  else if (intent === 'SOLVE')                 strategy = skillLevel === 'beginner' ? 'STEP_BY_STEP' : 'SOLVE';
  else if (intent === 'GUIDE')                 strategy = 'STEP_BY_STEP';

  // Apply intel overrides (also fallback-only)
  if (intel) {
    const { cognitiveLoad, teachingPhase, comprehensionRate, responseDensity } = intel;
    if (cognitiveLoad === 'overloaded')       strategy = 'STEP_BY_STEP';
    if (teachingPhase === 'checking')          strategy = 'SHORT';
    if (teachingPhase === 're_explaining')     strategy = 'TEACH';
    if ((comprehensionRate ?? 100) < 40)       strategy = intent === 'SOLVE' ? 'STEP_BY_STEP' : 'TEACH';
    if (responseDensity === 'brief' && strategy !== 'QUIZ') strategy = 'SHORT';
  }

  const compRate   = intel?.comprehensionRate ?? 100;
  const shouldBoost = isStruggling
    || intel?.cognitiveLoad === 'overloaded'
    || (compRate !== undefined && compRate < 50)
    || turnCount > 3;

  return {
    intent,
    strategy,
    followUpQuestion: strategy !== 'QUIZ' && strategy !== 'SHORT' && compRate > 30,
    correctGently:    isStruggling || isReexplain,
    boostConfidence:  shouldBoost,
    turnCount,
    adaptationReason: '[FALLBACK] Brain Core unavailable — legacy planner used',
    useAnalogy:       isReexplain || skillLevel === 'beginner',
    keepShort:        strategy === 'SHORT',
    emphasizeEncourage: isStruggling || compRate < 40,
  };
}