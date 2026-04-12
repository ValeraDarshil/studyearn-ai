// ─────────────────────────────────────────────────────────────
// AskAI — aiResponsePlanner.ts  (v13 — Intelligent Adaptive Planner)
//
// ROUTE: server/src/services/askAI/aiResponsePlanner.ts
//
// GAP #5 FIX — Response Planner: from static rules → adaptive intelligence
//
// What changed vs old version:
//   OLD: Rule-based intent detection → fixed strategy mapping
//        Same strategy for same intent every time, never adapts
//
//   NEW: 5 layers of intelligence added:
//     1. Comprehension-aware strategy — reads frontend comprehension stats
//        and adapts strategy based on how well student is doing RIGHT NOW
//     2. Reexplain detection — detects "dubara samjhao" patterns and
//        automatically switches to a different strategy, never repeats
//     3. Teaching phase awareness — knows if we're in EXPLAIN/CHECK/REEXPLAIN
//        cycle and picks strategy accordingly
//     4. Personalization signals — reads learningStyle + cognitiveLoad
//        from frontend and bakes them into strategy choice
//     5. Dynamic follow-up logic — adapts whether to ask follow-up based
//        on comprehension rate, not just intent
//
// All new fields are OPTIONAL — if frontend sends them, planner adapts.
// If not sent (old frontend), falls back to same behavior as before.
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
  intent:              Intent;
  strategy:            ResponseStrategy;
  followUpQuestion:    boolean;
  correctGently:       boolean;
  boostConfidence:     boolean;
  turnCount?:          number;
  // v13 additions
  adaptationReason?:   string;   // why this strategy was chosen (for logging)
  useAnalogy?:         boolean;  // should AI use a real-world analogy?
  keepShort?:          boolean;  // override: keep response brief
  emphasizeEncourage?: boolean;  // extra encouragement for struggling student
}

// ─────────────────────────────────────────────────────────────
// v13: Intelligence input — optional fields from frontend
// ─────────────────────────────────────────────────────────────
export interface PlannerIntelligenceInput {
  // Gap #1: from comprehension-api.ts
  comprehensionRate?:  number;   // 0-100: session comprehension %
  reexplainRate?:      number;   // 0-100: % of times re-explain was needed
  sessionStreak?:      number;   // consecutive correct answers
  topWeakTopics?:      string[]; // topics that needed re-explanation

  // Gap #3: teaching phase from useAdaptiveTeaching
  teachingPhase?:      string;   // 'idle'|'explaining'|'checking'|'re_explaining'|'mastered'

  // Gap #4: personalization from usePersonalization
  learningStyle?:      string;   // 'beginner'|'real_world'|'future'|'unknown'
  cognitiveLoad?:      string;   // 'low'|'normal'|'high'|'overloaded'
  responseDensity?:    string;   // 'brief'|'normal'|'detailed'
}

// ─────────────────────────────────────────────────────────────
// Intent Detection — unchanged from v8, keeps backward compat
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
// v13: Reexplain Detection
// Detects when student is asking for re-explanation so we
// automatically switch strategy (never repeat same approach)
// ─────────────────────────────────────────────────────────────
function detectReexplainRequest(message: string): boolean {
  const lower = message.toLowerCase();
  return /dubara|phir se|samajh nahi|nahi samajha|explain again|re.?explain|different (way|example|approach)|try again|once more|aur simple|aur easy|naya example|new example|different analogy|kuch aur|alag se/.test(lower);
}

// ─────────────────────────────────────────────────────────────
// Base Strategy Selector — same logic as v8
// ─────────────────────────────────────────────────────────────
function selectBaseStrategy(
  intent:       Intent,
  skillLevel:   'beginner' | 'intermediate' | 'advanced',
  isStruggling: boolean,
  turnCount:    number,
): ResponseStrategy {
  if (intent === 'QUIZ')                          return 'QUIZ';
  if (intent === 'DEBUG')                         return 'STEP_BY_STEP';
  if (intent === 'FOLLOWUP' && turnCount > 0)     return 'SHORT';

  if (isStruggling) {
    if (intent === 'SOLVE')   return 'STEP_BY_STEP';
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
// v13: Comprehension-aware strategy override
// The key upgrade: looks at HOW WELL student is doing and picks
// the most effective strategy for THEM RIGHT NOW
// ─────────────────────────────────────────────────────────────
function applyComprehensionOverride(
  baseStrategy:      ResponseStrategy,
  intent:            Intent,
  intel:             PlannerIntelligenceInput,
  isReexplain:       boolean,
): { strategy: ResponseStrategy; reason: string; useAnalogy: boolean; emphasizeEncourage: boolean } {
  const rate    = intel.comprehensionRate   ?? 100;
  const reRate  = intel.reexplainRate       ?? 0;
  const streak  = intel.sessionStreak       ?? 0;
  const load    = intel.cognitiveLoad       ?? 'normal';
  const phase   = intel.teachingPhase       ?? 'idle';
  const density = intel.responseDensity     ?? 'normal';
  const style   = intel.learningStyle       ?? 'unknown';

  let strategy          = baseStrategy;
  let reason            = 'base selection';
  let useAnalogy        = false;
  let emphasizeEncourage = false;

  // ── Teaching phase overrides ───────────────────────────────
  if (phase === 're_explaining') {
    // Student failed a check question — use completely different approach
    strategy           = intent === 'SOLVE' ? 'STEP_BY_STEP' : 'TEACH';
    useAnalogy         = true;
    emphasizeEncourage = true;
    reason             = 'teaching-phase:re_explaining → analogy+encourage';
    return { strategy, reason, useAnalogy, emphasizeEncourage };
  }

  if (phase === 'checking') {
    // AI asked a check question — keep response short, evaluate their answer
    strategy = 'SHORT';
    reason   = 'teaching-phase:checking → short evaluative response';
    return { strategy, reason, useAnalogy, emphasizeEncourage };
  }

  // ── Cognitive overload — override everything to simplest mode ─
  if (load === 'overloaded') {
    strategy           = 'STEP_BY_STEP';
    useAnalogy         = true;
    emphasizeEncourage = true;
    reason             = 'cognitive-overload → step-by-step + analogy + encourage';
    return { strategy, reason, useAnalogy, emphasizeEncourage };
  }

  // ── Reexplain request — pick different strategy from last ──
  if (isReexplain) {
    const reexplainMap: Record<ResponseStrategy, ResponseStrategy> = {
      'TEACH':         'STEP_BY_STEP',
      'STEP_BY_STEP':  'GUIDE',
      'GUIDE':         'TEACH',
      'HINT':          'TEACH',
      'SOLVE':         'STEP_BY_STEP',
      'FULL_SOLUTION': 'TEACH',
      'QUIZ':          'TEACH',
      'SHORT':         'TEACH',
    };
    strategy   = reexplainMap[baseStrategy] ?? 'TEACH';
    useAnalogy = true;
    reason     = `reexplain-detected → switched ${baseStrategy} → ${strategy} + analogy`;
    return { strategy, reason, useAnalogy, emphasizeEncourage };
  }

  // ── Comprehension rate adjustments ────────────────────────
  if (rate < 40 || reRate > 60) {
    // Student struggling a lot — simplify
    strategy           = intent === 'SOLVE' ? 'STEP_BY_STEP' : 'TEACH';
    useAnalogy         = true;
    emphasizeEncourage = true;
    reason             = `low-comprehension(${rate}%) → simplified + analogy`;
  } else if (rate > 80 && streak >= 3) {
    // Student on a streak — can go deeper
    strategy = intent === 'EXPLAIN' ? 'FULL_SOLUTION' :
               intent === 'SOLVE'   ? 'SOLVE'         : baseStrategy;
    reason   = `high-comprehension(${rate}%) + streak(${streak}) → advanced mode`;
  } else if (load === 'high') {
    // High load but not overloaded — step by step
    strategy   = 'STEP_BY_STEP';
    useAnalogy = reRate > 30;
    reason     = 'cognitive-load:high → step-by-step';
  }

  // ── Density overrides ─────────────────────────────────────
  if (density === 'brief' && strategy !== 'QUIZ') {
    strategy = 'SHORT';
    reason   += ' + density:brief → SHORT';
  } else if (density === 'detailed' && strategy === 'SHORT') {
    strategy = 'TEACH';
    reason   += ' + density:detailed → TEACH';
  }

  // ── Learning style adjustments ────────────────────────────
  if (style === 'beginner' && strategy === 'FULL_SOLUTION') {
    strategy = 'TEACH';   // beginners find full solutions overwhelming
    reason  += ' + style:beginner → TEACH';
  } else if (style === 'real_world') {
    useAnalogy = true;    // always use analogy for real-world learners
  } else if (style === 'future' && strategy === 'SHORT') {
    strategy = 'TEACH';   // future-impact learners want context, not just answers
    reason  += ' + style:future → TEACH';
  }

  return { strategy, reason, useAnalogy, emphasizeEncourage };
}

// ─────────────────────────────────────────────────────────────
// buildResponsePlan — main export
// v13: accepts optional intelligence input for adaptation
// Fully backward compatible — works without intel input too
// ─────────────────────────────────────────────────────────────
export function buildResponsePlan(
  message:       string,
  skillLevel:    'beginner' | 'intermediate' | 'advanced',
  mistakeTopics: string[],
  turnCount:     number,
  intel?:        PlannerIntelligenceInput,   // v13: optional adaptive input
): ResponsePlan {
  const intent        = detectIntent(message);
  const isStruggling  = mistakeTopics.length > 0;
  const isReexplain   = detectReexplainRequest(message);
  const baseStrategy  = selectBaseStrategy(intent, skillLevel, isStruggling, turnCount);

  // v13: Apply intelligence override if intel data provided
  const override = intel
    ? applyComprehensionOverride(baseStrategy, intent, intel, isReexplain)
    : { strategy: baseStrategy, reason: 'no-intel', useAnalogy: false, emphasizeEncourage: false };

  const finalStrategy = override.strategy;

  // Dynamic follow-up: only ask follow-up if comprehension rate is decent
  // (no point asking follow-up if student is already struggling)
  const compRate          = intel?.comprehensionRate ?? 100;
  const shouldFollowUp    = finalStrategy !== 'QUIZ' &&
                            finalStrategy !== 'SHORT' &&
                            finalStrategy !== 'FULL_SOLUTION' &&
                            compRate > 30;

  // Boost confidence: struggling, or low comprehension, or early turns
  const shouldBoost = isStruggling ||
                      (intel?.cognitiveLoad === 'high' || intel?.cognitiveLoad === 'overloaded') ||
                      (intel?.comprehensionRate !== undefined && intel.comprehensionRate < 50) ||
                      turnCount > 3;

  return {
    intent,
    strategy:            finalStrategy,
    followUpQuestion:    shouldFollowUp,
    correctGently:       isStruggling || isReexplain,
    boostConfidence:     shouldBoost,
    turnCount,
    adaptationReason:    override.reason,
    useAnalogy:          override.useAnalogy,
    keepShort:           finalStrategy === 'SHORT',
    emphasizeEncourage:  override.emphasizeEncourage,
  };
}