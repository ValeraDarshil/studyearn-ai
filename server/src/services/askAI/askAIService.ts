// ─────────────────────────────────────────────────────────────
// AskAI — askAIService.ts
// MAIN ORCHESTRATOR — ChatGPT-level pipeline
//
// Flow:
//  User Input
//   ↓ conversationMemoryEngine
//   ↓ contextEnhancer (AI Brain + Progress + Learning)
//   ↓ aiResponsePlanner  (intent + strategy)
//   ↓ difficultyAdapter  (level-appropriate explanation)
//   ↓ mentorTeachingMode (teach vs guide vs hint)
//   ↓ aiPersonalityEngine (consistent tone)
//   ↓ aiModelRouter      (best model for this query)
//   ↓ AI response generate
//   ↓ responseValidator
//   ↓ conversationMemoryEngine.addMessage
//   ↓ Final Output
// ─────────────────────────────────────────────────────────────

import {
  getOrCreateMemory,
  addMessage,
  getRecentHistory,
  getMistakeTopics,
} from './conversationMemoryEngine.js';

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
// buildMasterPrompt
// The core prompt architecture:
//   PERSONALITY BLOCK + CONTEXT BLOCK + INSTRUCTION LAYER
// ─────────────────────────────────────────────────────────────
export async function buildMasterPrompt(
  input: AskAIServiceInput,
): Promise<AskAIPromptPackage> {

  const { userId, message, subjectMode, stepByStep } = input;

  // ── Step 1: Memory ──────────────────────────────────────
  const memory       = getOrCreateMemory(userId);
  const mistakeTopics = getMistakeTopics(userId);
  const memHistory   = getRecentHistory(userId, 10);

  // ── Step 2: Rich context from all systems ──────────────
  let context: EnhancedContext;
  try {
    context = await buildEnhancedContext(userId, message);
  } catch {
    // Graceful fallback
    const fallbackLevel = detectSkillLevelFromMessage(message);
    context = {
      skillLevel:    fallbackLevel,
      weakTopics:    mistakeTopics,
      strongTopics:  [],
      currentGoal:   '',
      learningState: 'unknown',
      recentActivity: '',
      sessionSummary: '',
      contextBlock:   `Student Level: ${fallbackLevel.toUpperCase()}`,
    };
  }

  // Override: use detected skill if context doesn't specify
  const skillLevel: SkillLevel = context.skillLevel ?? detectSkillLevelFromMessage(message);

  // Combine weak topics from both context and session memory
  const allWeakTopics = [...new Set([...context.weakTopics, ...mistakeTopics])];

  // ── Step 3: Response Planning (thinking layer) ──────────
  const plan = buildResponsePlan(
    message,
    skillLevel,
    allWeakTopics,
    memory.turnCount,
  );

  // Override strategy if stepByStep is forced by user
  if (stepByStep && plan.strategy !== 'QUIZ') {
    plan.strategy = 'STEP_BY_STEP';
  }

  // ── Step 4: Model Routing ───────────────────────────────
  const modelConfig = routeToModel(
    plan.intent,
    subjectMode,
    skillLevel,
    message.length,
  );

  // ── Step 5: Topic Detection ─────────────────────────────
  const detectedTopic = detectTopic(message, subjectMode);

  // ── Step 6: Personality ─────────────────────────────────
  const personality   = inferPersonality(message);
  const isFirstTurn   = memory.turnCount === 0;

  // ── Step 7: Build Master System Prompt ─────────────────
  const sections: string[] = [

    // A) PERSONALITY BLOCK (who the AI is)
    buildPersonalityBlock(personality),

    // B) CONTEXT BLOCK (who the student is)
    context.contextBlock,

    // C) INSTRUCTION LAYER (how to respond)
    '\n=== HOW TO RESPOND ===',
    'Before answering, internally:',
    '1. Check the student\'s level and learning state',
    '2. Check if they struggled with related topics before',
    '3. Decide explanation depth based on skill level',
    '4. Think step by step before giving the final answer',

    // D) DIFFICULTY ADAPTER
    '\n' + buildDifficultyInstruction(skillLevel),
    getResponseStyleNote(skillLevel, allWeakTopics.length > 0),

    // E) TEACHING MODE
    buildTeachingInstruction(plan.strategy),

    // F) FOLLOW-UP + CONFIDENCE + CORRECTION
    buildFollowUpInstruction(plan.followUpQuestion, detectedTopic ?? undefined),
    buildConfidenceBoost(plan.boostConfidence, isFirstTurn),
    buildCorrectionInstruction(plan.correctGently),

    // G) PERSONALITY POST-PROCESS
    getPersonalityPostProcessNote(personality, isFirstTurn, plan.correctGently),

    // H) SUBJECT MODE
    subjectMode === 'math'
      ? '\nMATH: Show formula → substitution → every step → boxed final answer.'
      : subjectMode === 'coding'
      ? '\nCODING: Provide complete runnable code. Comment each section. Show expected output.'
      : subjectMode === 'science'
      ? '\nSCIENCE: State law/principle → formula with units → worked example.'
      : '',

    // I) MODEL note (internal, won't be seen by student)
    '\n' + getModelNote(modelConfig),
  ];

  const systemPrompt = sections.filter(Boolean).join('\n');

  // History: prefer session memory (more accurate) over passed history
  const history = memHistory.length > 0
    ? memHistory
    : (input.history || []).slice(-10);

  logger.info(
    'AskAI prompt built | intent=' + plan.intent +
    ' strategy=' + plan.strategy +
    ' skill=' + skillLevel +
    ' model=' + modelConfig.modelId +
    ' weakTopics=' + allWeakTopics.length +
    ' turn=' + memory.turnCount
  );

  return { systemPrompt, history, userMessage: message, modelConfig, plan, context, detectedTopic };
}

// ─────────────────────────────────────────────────────────────
// afterResponse  (call after AI generates response)
// Stores both messages in memory for next turn context
// ─────────────────────────────────────────────────────────────
export function afterResponse(
  userId:       string,
  userMessage:  string,
  aiResponse:   string,
  topic?:       string | null,
): void {
  try {
    addMessage(userId, 'user',      userMessage, topic ?? undefined);
    addMessage(userId, 'assistant', aiResponse,  topic ?? undefined);
  } catch (e: any) {
    logger.warn('afterResponse memory update failed: ' + e.message);
  }
}

// ─────────────────────────────────────────────────────────────
// detectTopic  (heuristic — maps message to a topic name)
// ─────────────────────────────────────────────────────────────
function detectTopic(message: string, subjectMode: string): string | null {
  const lower = message.toLowerCase();

  const TOPIC_MAP: [RegExp, string][] = [
    [/\bloop(s)?\b|\bfor loop\b|\bwhile loop\b/,          'loops'],
    [/\brecursion\b|\brecursive\b/,                       'recursion'],
    [/\barray(s)?\b|\blist(s)?\b/,                        'arrays'],
    [/\bsort(ing)?\b|\bbubble sort\b|\bmerge sort\b/,     'sorting'],
    [/\bpointer(s)?\b/,                                   'pointers'],
    [/\bclass\b|\bobject\b|\boop\b|\binheritance\b/,      'OOP'],
    [/\bfunction(s)?\b|\bclosure(s)?\b/,                  'functions'],
    [/\bintegral\b|∫|\bderivative\b|\bdifferential\b/,    'calculus'],
    [/\btrigonometry\b|\bsin\b|\bcos\b|\btan\b/,          'trigonometry'],
    [/\bprobability\b|\bstatistics\b/,                    'probability'],
    [/\bphotos(ynthesis)?\b/,                             'photosynthesis'],
    [/\bnewton(s)?\b|\bgravity\b|\bforce\b/,              'Newtonian mechanics'],
    [/\bchemistry\b|\belement\b|\bperiodic\b|\bbond\b/,   'chemistry'],
  ];

  for (const [pattern, topic] of TOPIC_MAP) {
    if (pattern.test(lower)) return topic;
  }

  // Fall back to subject mode
  if (subjectMode && subjectMode !== 'auto') return subjectMode;
  return null;
}