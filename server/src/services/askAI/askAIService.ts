// ─────────────────────────────────────────────────────────────
// AskAI — askAIService.ts  (v11 — Bug fixes applied)
//
// Bug #4 FIXED: turnCount passed correctly to buildResponsePlan
//   Before: buildResponsePlan(..., 0) then plan.turnCount = history.length
//   After:  currentTurnCount computed once, passed correctly
//
// Bug #3 FIXED: afterResponse RAM drift documented
//   RAM (conversationMemoryEngine) is kept ONLY for getMemorySummary
//   in contextEnhancer Layer 3. DB is the source of truth.
//   DB persistence (persistAIMessage) happens in aiController.ts only.
//
// Everything else unchanged from v10.
// ─────────────────────────────────────────────────────────────

// v10: RAM memory engine kept only for in-session getMemorySummary
// conversationMemoryEngine.addMessage used by afterResponse (Layer 3 context)
import { addMessage } from './conversationMemoryEngine.js';

import {
  buildResponsePlan,
  type ResponsePlan,
} from './aiResponsePlanner.js';

import {
  buildDifficultyInstruction,
  getResponseStyleNote,
  detectSkillLevelFromMessage,
  type SkillLevel,
} from './difficultyAdapter.js';

import {
  buildTeachingInstruction,
  buildFollowUpInstruction,
  buildConfidenceBoost,
  buildCorrectionInstruction,
} from './mentorTeachingMode.js';

import {
  buildPersonalityBlock,
  inferPersonality,
  getPersonalityPostProcessNote,
} from './aiPersonalityEngine.js';

import {
  routeToModel,
  getModelNote,
} from './aiModelRouter.js';

import {
  validateResponse,
  type ValidationResult,
} from './responseValidator.js';

import {
  buildEnhancedContext,
  type EnhancedContext,
} from './contextEnhancer.js';

import { logger } from '../../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface AskAIServiceInput {
  userId:      string;
  message:     string;
  subjectMode: string;
  stepByStep:  boolean;
  history?:    { role: 'user' | 'assistant'; content: string }[];
  // v9: persistent data from MongoDB
  persistentWeakTopics?: string[];
  dbSessionSummary?:     string;
}

export interface AskAIPromptPackage {
  systemPrompt:  string;
  history:       { role: 'user' | 'assistant'; content: string }[];
  userMessage:   string;
  modelConfig:   ReturnType<typeof routeToModel>;
  plan:          ResponsePlan;
  context:       EnhancedContext;
  detectedTopic: string | null;
}

// ─────────────────────────────────────────────────────────────
// buildMasterPrompt — Main export
// Builds the complete system prompt + all AI pipeline decisions
// ─────────────────────────────────────────────────────────────
export async function buildMasterPrompt(
  input: AskAIServiceInput,
): Promise<AskAIPromptPackage> {

  const {
    userId,
    message,
    subjectMode,
    stepByStep,
    persistentWeakTopics = [],
    dbSessionSummary     = '',
  } = input;

  // Step 1: Rich context from AI Brain (orchestrator + tutor)
  let context: EnhancedContext;
  try {
    context = await buildEnhancedContext(userId, message);
  } catch {
    const fallbackLevel = detectSkillLevelFromMessage(message);
    context = {
      skillLevel:     fallbackLevel,
      weakTopics:     [],
      strongTopics:   [],
      currentGoal:    '',
      learningState:  'unknown',
      recentActivity: '',
      sessionSummary: '',
      contextBlock:   `Student Level: ${fallbackLevel.toUpperCase()}`,
    };
  }

  const skillLevel: SkillLevel = context.skillLevel ?? detectSkillLevelFromMessage(message);

  // Step 2: Merge ALL weak topic sources
  // Priority: DB persistent (30-day) > AI Brain orchestrator
  const allWeakTopics = [
    ...new Set([
      ...persistentWeakTopics,
      ...context.weakTopics,
    ]),
  ].slice(0, 10);

  // Step 3: Response Planning
  // Bug #4 FIX: pass correct turnCount directly — was passing 0 then overriding
  const currentTurnCount = input.history?.length ?? 0;
  const plan = buildResponsePlan(
    message,
    skillLevel,
    allWeakTopics,
    currentTurnCount,
  );
  plan.turnCount = currentTurnCount;

  if (stepByStep && plan.strategy !== 'QUIZ') {
    plan.strategy = 'STEP_BY_STEP';
  }

  // Step 4: Model Routing
  const modelConfig = routeToModel(
    plan.intent,
    subjectMode,
    skillLevel,
    message.length,
    'text',
  );

  // Step 5: Topic Detection (base — aiController uses detectTopicExpanded on top)
  const detectedTopic = detectTopic(message, subjectMode);

  // Step 6: Personality
  const personality = inferPersonality(message);
  const isFirstTurn = currentTurnCount === 0;

  // Step 7: Build Master System Prompt
  const sections: string[] = [

    // A) PERSONALITY BLOCK
    buildPersonalityBlock(personality),

    // B) CONTEXT BLOCK (AI Brain + Tutor data)
    context.contextBlock,

    // C) DB SESSION HISTORY — cross-session learning memory
    dbSessionSummary
      ? `\n=== STUDENT'S LEARNING HISTORY (from past sessions) ===\n${dbSessionSummary}\nUSE THIS: Reference past struggles naturally. E.g., "Since you've been working on recursion, let's connect this concept..."`
      : '',

    // D) INSTRUCTION LAYER
    '\n=== HOW TO RESPOND ===',
    'Before answering, internally:',
    '1. Check the student\'s level and learning state',
    '2. Check if they struggled with related topics before',
    '3. Decide explanation depth based on skill level',
    '4. Think step by step before giving the final answer',

    // E) DIFFICULTY ADAPTER
    '\n' + buildDifficultyInstruction(skillLevel),
    getResponseStyleNote(skillLevel, allWeakTopics.length > 0),

    // F) TEACHING MODE
    buildTeachingInstruction(plan.strategy),

    // G) FOLLOW-UP + CONFIDENCE + CORRECTION
    buildFollowUpInstruction(plan.followUpQuestion, detectedTopic ?? undefined),
    buildConfidenceBoost(plan.boostConfidence, isFirstTurn),
    buildCorrectionInstruction(plan.correctGently),

    // H) PERSONALITY POST-PROCESS
    getPersonalityPostProcessNote(personality, isFirstTurn, plan.correctGently),

    // I) SUBJECT MODE
    subjectMode === 'math'
      ? '\nMATH: Show formula → substitution → every step → boxed final answer.'
      : subjectMode === 'coding'
      ? '\nCODING: Provide complete runnable code. Comment each section. Show expected output.'
      : subjectMode === 'science'
      ? '\nSCIENCE: State law/principle → formula with units → worked example.'
      : '',

    // J) MODEL NOTE
    '\n' + getModelNote(modelConfig),

    // K) MANDATORY RESPONSE STRUCTURE
    plan.strategy !== 'QUIZ' && plan.strategy !== 'SHORT' ? `

=== MANDATORY RESPONSE STRUCTURE (follow this EVERY single time) ===

You MUST structure EVERY response in exactly these 4 sections:

1. 📖 EXPLANATION
   - Start with the core concept in 1-2 simple sentences
   - Match language complexity to the student's level (${skillLevel})
   - Use a real-world analogy if it helps

2. 💡 EXAMPLE
   - Give exactly 1 concrete example (real-life scenario or exam-style)
   - For math/coding: show the complete worked solution step by step
   - Keep it short, memorable, and directly relevant

3. ⚡ QUICK SUMMARY
   - Write exactly 2-3 lines summing up the key takeaway
   - Should be something they can remember 1 week from now

4. ❓ CHECK YOUR UNDERSTANDING  ← NEVER EVER SKIP THIS
   - Ask exactly 1 question to verify they understood
   - Make it slightly different from your example (test transfer, not recall)
   - Format EXACTLY as: "**Quick check:** [your question here]"

═══════════════════════════════════════════════════════
ABSOLUTE RULES:
- You MUST end EVERY response with a "**Quick check:**" question — NO exceptions
- Keep total response tight and focused — no information overload
- After student answers your check question, give EMOTIONAL feedback:
  ✓ Correct answer   → "Nice! 🔥" / "Exactly right!" / "You got it!"
  ✗ Wrong answer     → "Almost there! The key thing is..." (warm, not harsh)
  ? Confused         → "No worries, let's try a completely different angle..."
  ↩ Wants re-explain → Give same concept with NEW analogy/example
═══════════════════════════════════════════════════════
` : '',
  ];

  const systemPrompt = sections.filter(Boolean).join('\n');

  // Frontend history ONLY — already filtered for correct chat (v10 fix)
  const history = (input.history ?? []).slice(-20);

  logger.info(
    'AskAI v11 prompt | intent=' + plan.intent +
    ' strategy=' + plan.strategy +
    ' skill='    + skillLevel +
    ' model='    + modelConfig.modelId +
    ' history='  + history.length + 'msgs' +
    ' weakDB='   + persistentWeakTopics.length +
    ' turns='    + currentTurnCount,
  );

  return { systemPrompt, history, userMessage: message, modelConfig, plan, context, detectedTopic };
}

// ─────────────────────────────────────────────────────────────
// validateAndLog
// ─────────────────────────────────────────────────────────────
export function validateAndLog(
  aiResponse: string,
  intent:     string,
  userPrompt: string,
  userId:     string,
): ValidationResult {
  const result = validateResponse(aiResponse, intent, userPrompt);

  if (!result.isValid) {
    logger.warn(
      `[AskAI] Response validation failed | userId=${userId.slice(-6)} ` +
      `intent=${intent} score=${result.score} issues=${result.issues.join(', ')}`,
    );
  } else if (result.issues.length > 0) {
    logger.info(
      `[AskAI] Response validation passed with warnings | userId=${userId.slice(-6)} ` +
      `score=${result.score} warnings=${result.issues.join(', ')}`,
    );
  }

  return result;
}

// ─────────────────────────────────────────────────────────────
// detectEmotionalState
// Detects user's current emotional state from their message.
// Supports English + Hinglish.
// ─────────────────────────────────────────────────────────────
export function detectEmotionalState(
  userMessage: string,
  turnCount:   number,
): 'correct' | 'confused' | 'frustrated' | 'motivated' | 'neutral' {
  const msg = userMessage.toLowerCase().trim();

  if (/\b(got it|makes sense|i understand|clear hai|samajh gaya|samajh gayi|oh i see|that makes sense|i get it|achha|accha|ohh|ahhh|right right|yes exactly|bilkul|haan samajh|ab samajh|got this)\b/.test(msg)) {
    return 'correct';
  }

  if (/\b(don'?t understand|confused|not clear|samajh nahi|kya matlab|phir se|not getting|what do you mean|explain again|dubara|didn'?t get|unclear|ye kya hai|yeh kya|pata nahi|nahi pata|kuch nahi samajha)\b/.test(msg)) {
    return 'confused';
  }

  if (/\b(why is this so|this is hard|too difficult|giving up|i can'?t|can'?t do this|impossible|ugh|argh|frustrat|bahut mushkil|nahi ho raha|nahi samajh|ye toh bahut|yaar kuch nahi|pakka nahi hoga)\b/.test(msg)) {
    return 'frustrated';
  }

  if (/\b(amazing|awesome|great|love this|this is cool|interesting|wow|wah|mast|bahut accha|nice|let'?s go|let me try|i want to|and then|what about|tell me more|aur batao|aage batao|next)\b/.test(msg)) {
    return 'motivated';
  }

  if (turnCount === 0) return 'neutral';
  return 'neutral';
}

// ─────────────────────────────────────────────────────────────
// afterResponse
// Bug #3 FIXED: RAM memory clarified.
// RAM (conversationMemoryEngine) is kept ONLY for in-session
// getMemorySummary used by contextEnhancer Layer 3.
// DB persistence (persistAIMessage) is in aiController.ts ONLY.
// ─────────────────────────────────────────────────────────────
export function afterResponse(
  userId:      string,
  userMessage: string,
  aiResponse:  string,
  topic?:      string | null,
): void {
  // RAM write: only for contextEnhancer.getMemorySummary (in-session context)
  // DB is the source of truth — this is supplementary, in-process only
  try {
    addMessage(userId, 'user',      userMessage, topic ?? undefined);
    addMessage(userId, 'assistant', aiResponse,  topic ?? undefined);
  } catch (e: any) {
    logger.warn('afterResponse RAM update failed: ' + e.message);
  }
  // NOTE: persistAIMessage() is called in aiController.ts — NOT here
}

// ─────────────────────────────────────────────────────────────
// detectTopic — base topic detection (18 topics)
// NOTE: aiController.ts uses detectTopicExpanded() (80+ topics)
// from askAIOrchestrator.ts on top of this. Keep both.
// ─────────────────────────────────────────────────────────────
export function detectTopic(message: string, subjectMode: string): string | null {
  const lower = message.toLowerCase();

  const TOPIC_MAP: [RegExp, string][] = [
    [/\bloop(s)?\b|\bfor loop\b|\bwhile loop\b/,          'loops'],
    [/\brecursion\b|\brecursive\b/,                        'recursion'],
    [/\barray(s)?\b|\blist(s)?\b/,                         'arrays'],
    [/\bsort(ing)?\b|\bbubble sort\b|\bmerge sort\b/,      'sorting'],
    [/\bpointer(s)?\b/,                                    'pointers'],
    [/\bclass\b|\bobject\b|\boop\b|\binheritance\b/,       'OOP'],
    [/\bfunction(s)?\b|\bclosure(s)?\b/,                   'functions'],
    [/\bintegral\b|∫|\bderivative\b|\bdifferential\b/,     'calculus'],
    [/\btrigonometry\b|\bsin\b|\bcos\b|\btan\b/,           'trigonometry'],
    [/\bprobability\b|\bstatistics\b/,                     'probability'],
    [/\bphotos(ynthesis)?\b/,                              'photosynthesis'],
    [/\bnewton(s)?\b|\bgravity\b|\bforce\b/,               'Newtonian mechanics'],
    [/\bchemistry\b|\belement\b|\bperiodic\b|\bbond\b/,    'chemistry'],
    [/\balgebra\b|\bequation\b|\bpolynomial\b/,            'algebra'],
    [/\bpython\b/,                                         'Python'],
    [/\bjavascript\b|\bjs\b|\bnode\.?js\b/,               'JavaScript'],
    [/\breact\b|\bnext\.?js\b/,                            'React'],
    [/\bsql\b|\bdatabase\b|\bmysql\b|\bpostgres\b/,        'databases'],
  ];

  for (const [pattern, topic] of TOPIC_MAP) {
    if (pattern.test(lower)) return topic;
  }

  if (subjectMode && subjectMode !== 'auto') return subjectMode;
  return null;
}