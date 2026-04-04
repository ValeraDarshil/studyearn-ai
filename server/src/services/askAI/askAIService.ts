// ─────────────────────────────────────────────────────────────
// AskAI — askAIService.ts  (v7 — Production-Grade Pipeline)
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
//   ↓ responseValidator  ← FIX: now actually called
//   ↓ conversationMemoryEngine.addMessage
//   ↓ persistLearningData ← FIX: now writes to DB
//   ↓ Final Output
//
// Changes v7:
//   1. validateResponse() is now CALLED after AI response
//   2. afterResponse() now persists topic data to StudentProfile DB
//   3. Both changes are non-blocking (won't delay the response)
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
  const memory        = getOrCreateMemory(userId);
  const mistakeTopics = getMistakeTopics(userId);
  const memHistory    = getRecentHistory(userId, 10);

  // ── Step 2: Rich context from all systems ──────────────
  let context: EnhancedContext;
  try {
    context = await buildEnhancedContext(userId, message);
  } catch {
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
  const personality = inferPersonality(message);
  const isFirstTurn = memory.turnCount === 0;

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
// validateAndLog
// FIX: Actually validates the AI response and logs issues.
// Call this AFTER the AI has finished streaming (non-blocking).
// ─────────────────────────────────────────────────────────────
export function validateAndLog(
  aiResponse:  string,
  intent:      string,
  userPrompt:  string,
  userId:      string,
): ValidationResult {
  const result = validateResponse(aiResponse, intent, userPrompt);

  if (!result.isValid) {
    logger.warn(
      `[AskAI] Response validation failed | userId=${userId.slice(-6)} ` +
      `intent=${intent} score=${result.score} issues=${result.issues.join(', ')}`
    );
  } else if (result.issues.length > 0) {
    logger.info(
      `[AskAI] Response validation passed with warnings | userId=${userId.slice(-6)} ` +
      `score=${result.score} warnings=${result.issues.join(', ')}`
    );
  }

  return result;
}

// ─────────────────────────────────────────────────────────────
// afterResponse  (call after AI generates response)
// FIX: Now persists learning data to DB in addition to in-memory update.
// Stores both messages in memory for next turn context.
// Writes topic + mistake data to StudentProfile (non-blocking).
// ─────────────────────────────────────────────────────────────
export function afterResponse(
  userId:       string,
  userMessage:  string,
  aiResponse:   string,
  topic?:       string | null,
): void {
  // 1. Update in-session memory (sync)
  try {
    addMessage(userId, 'user',      userMessage, topic ?? undefined);
    addMessage(userId, 'assistant', aiResponse,  topic ?? undefined);
  } catch (e: any) {
    logger.warn('afterResponse memory update failed: ' + e.message);
  }

  // 2. Persist learning data to DB (async, non-blocking — won't delay response)
  if (userId && topic) {
    persistLearningData(userId, userMessage, topic).catch((e: any) => {
      logger.warn('afterResponse DB persist failed (non-blocking): ' + e.message);
    });
  }
}

// ─────────────────────────────────────────────────────────────
// persistLearningData  (PRIVATE — called by afterResponse)
// FIX: Writes topic interaction to StudentProfile.topicMastery
//      and updates dailyLogs.questionsAsked in the DB.
// This is what makes long-term memory actually persist.
// ─────────────────────────────────────────────────────────────
async function persistLearningData(
  userId:       string,
  userMessage:  string,
  topic:        string,
): Promise<void> {
  try {
    // Dynamic import so this file doesn't add a hard DB dependency at startup
    const { StudentProfile } = await import('../../models/StudentProfile.model.js');

    const now          = new Date();
    const todayStr     = now.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const isConfusion  = /don't understand|confused|not clear|samajh nahi|kya matlab|phir se|not getting/i.test(userMessage);
    const isMastery    = /got it|makes sense|understand now|clear hai|samajh gaya|samajh gayi/i.test(userMessage);

    // Update topicMastery for this topic (upsert-style with $set on existing or $push for new)
    const profile = await StudentProfile.findOne({ userId }).select('topicMastery dailyLogs recentMistakes').lean() as any;

    if (!profile) return; // No profile yet — skip

    const existingIdx = (profile.topicMastery || []).findIndex(
      (t: any) => t.topic?.toLowerCase() === topic.toLowerCase()
    );

    if (existingIdx >= 0) {
      // Topic exists — update it
      const updateKey = `topicMastery.${existingIdx}`;
      await StudentProfile.updateOne(
        { userId },
        {
          $inc: {
            [`${updateKey}.totalAttempts`]:   1,
            [`${updateKey}.correctAttempts`]: isMastery ? 1 : 0,
          },
          $set: {
            [`${updateKey}.lastAttemptedAt`]: now,
            [`${updateKey}.trend`]: isConfusion ? 'declining' : isMastery ? 'improving' : 'stable',
          },
        }
      );
    } else {
      // New topic — push it in
      await StudentProfile.updateOne(
        { userId },
        {
          $push: {
            topicMastery: {
              topic,
              subject:         detectSubject(topic),
              category:        'self',
              masteryLevel:    isMastery ? 30 : 10,
              correctAttempts: isMastery ? 1 : 0,
              totalAttempts:   1,
              lastAttemptedAt: now,
              isWeak:          true,
              isStrong:        false,
              trend:           isConfusion ? 'declining' : isMastery ? 'improving' : 'stable',
            },
          },
        }
      );
    }

    // Update recentMistakes if student showed confusion
    if (isConfusion) {
      await StudentProfile.updateOne(
        { userId },
        {
          $push: {
            recentMistakes: {
              $each:  [topic],
              $slice: -10,  // keep only last 10
            },
          },
        }
      );
    }

    // Increment today's questionsAsked in dailyLogs
    const todayLogIdx = (profile.dailyLogs || []).findIndex((d: any) => d.date === todayStr);
    if (todayLogIdx >= 0) {
      await StudentProfile.updateOne(
        { userId },
        { $inc: { [`dailyLogs.${todayLogIdx}.questionsAsked`]: 1 } }
      );
    } else {
      // First question today — create a new daily log entry
      await StudentProfile.updateOne(
        { userId },
        {
          $push: {
            dailyLogs: {
              $each: [{
                date:                     todayStr,
                minutesStudied:           0,
                questionsAsked:           1,
                quizzesCompleted:         0,
                codingSectionsCompleted:  0,
                xpEarned:                 0,
                topicsCovered:            [topic],
              }],
              $slice: -90, // keep last 90 days
            },
          },
        }
      );
    }

    logger.info(`[AskAI] Persisted learning data for ${userId.slice(-6)} | topic: ${topic} | confusion: ${isConfusion}`);
  } catch (err: any) {
    // Re-throw so the caller (afterResponse) can log it as a warning
    throw new Error(`persistLearningData: ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────
// detectTopic  (heuristic — maps message to a topic name)
// ─────────────────────────────────────────────────────────────
export function detectTopic(message: string, subjectMode: string): string | null {
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
    [/\balgebra\b|\bequation\b|\bpolynomial\b/,           'algebra'],
    [/\bpython\b/,                                        'Python'],
    [/\bjavascript\b|\bjs\b|\bnode\.?js\b/,              'JavaScript'],
    [/\breact\b|\bnext\.?js\b/,                           'React'],
    [/\bsql\b|\bdatabase\b|\bmysql\b|\bpostgres\b/,       'databases'],
  ];

  for (const [pattern, topic] of TOPIC_MAP) {
    if (pattern.test(lower)) return topic;
  }

  if (subjectMode && subjectMode !== 'auto') return subjectMode;
  return null;
}

// ─────────────────────────────────────────────────────────────
// detectSubject  (maps topic to subject for StudentProfile)
// ─────────────────────────────────────────────────────────────
function detectSubject(topic: string): string {
  const t = topic.toLowerCase();
  if (['loops', 'arrays', 'functions', 'recursion', 'oop', 'sorting', 'pointers'].includes(t)) return 'Programming';
  if (['python', 'javascript', 'react', 'databases'].includes(t)) return t.charAt(0).toUpperCase() + t.slice(1);
  if (['algebra', 'calculus', 'trigonometry', 'probability'].includes(t)) return 'Mathematics';
  if (['newtonian mechanics', 'electricity'].includes(t)) return 'Physics';
  if (['chemistry', 'photosynthesis'].includes(t)) return 'Chemistry';
  return 'General';
}