// ─────────────────────────────────────────────────────────────
// AskAI — askAIService.ts  (v8 — Ultra-Powerful Teaching Partner)
//
// ROUTE: server/src/services/askAI/askAIService.ts
//
// What changed in v8:
//   1. Section J: MANDATORY RESPONSE STRUCTURE added to system prompt
//      → Forces AI to always return: Explanation → Example → Summary → "Quick check:"
//   2. detectEmotionalState() — new export function
//      → Detects correct / confused / frustrated / motivated from user message
//      → Used by aiController to emit emotionalState via SSE
//   3. turnCount added to ResponsePlan return (for emotional state detection)
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
      skillLevel:     fallbackLevel,
      weakTopics:     mistakeTopics,
      strongTopics:   [],
      currentGoal:    '',
      learningState:  'unknown',
      recentActivity: '',
      sessionSummary: '',
      contextBlock:   `Student Level: ${fallbackLevel.toUpperCase()}`,
    };
  }

  const skillLevel: SkillLevel = context.skillLevel ?? detectSkillLevelFromMessage(message);
  const allWeakTopics = [...new Set([...context.weakTopics, ...mistakeTopics])];

  // ── Step 3: Response Planning ───────────────────────────
  const plan = buildResponsePlan(
    message,
    skillLevel,
    allWeakTopics,
    memory.turnCount,
  );
  // Attach turnCount to plan so controller can use it
  plan.turnCount = memory.turnCount;

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

    // C) INSTRUCTION LAYER
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

    // I) MODEL note
    '\n' + getModelNote(modelConfig),

    // J) MANDATORY RESPONSE STRUCTURE ← THE KILLER FEATURE
    // This is what transforms AskAI from "answer machine" → "teaching partner"
    // Skipped only for QUIZ and SHORT strategies (they have their own format)
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

  const history = memHistory.length > 0
    ? memHistory
    : (input.history || []).slice(-10);

  logger.info(
    'AskAI v8 prompt | intent=' + plan.intent +
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
// detectEmotionalState  ← NEW in v8
// Detects the student's emotional state from their message.
// The aiController emits this via SSE → frontend shows toast.
// Covers English + Hindi + Hinglish patterns.
// ─────────────────────────────────────────────────────────────
export function detectEmotionalState(
  userMessage: string,
  turnCount:   number,
): 'correct' | 'confused' | 'frustrated' | 'motivated' | 'neutral' {
  const msg = userMessage.toLowerCase().trim();

  // ── Correct / mastery signals ──────────────────────────
  if (/\b(got it|makes sense|i understand|clear hai|samajh gaya|samajh gayi|oh i see|that makes sense|i get it|achha|accha|ohh|ahhh|right right|yes exactly|bilkul|haan samajh|ab samajh|got this)\b/.test(msg)) {
    return 'correct';
  }

  // ── Confusion signals ──────────────────────────────────
  if (/\b(don'?t understand|confused|not clear|samajh nahi|kya matlab|phir se|not getting|what do you mean|explain again|dubara|didn'?t get|unclear|ye kya hai|yeh kya|pata nahi|nahi pata|kuch nahi samajha)\b/.test(msg)) {
    return 'confused';
  }

  // ── Frustration signals ────────────────────────────────
  if (/\b(why is this so|this is hard|too difficult|giving up|i can'?t|can'?t do this|impossible|ugh|argh|frustrat|bahut mushkil|nahi ho raha|nahi samajh|ye toh bahut|yaar kuch nahi|pakka nahi hoga)\b/.test(msg)) {
    return 'frustrated';
  }

  // ── Motivated / excited signals ────────────────────────
  if (/\b(amazing|awesome|great|love this|this is cool|interesting|wow|wah|mast|bahut accha|nice|let'?s go|let me try|i want to|and then|what about|tell me more|aur batao|aage batao|next)\b/.test(msg)) {
    return 'motivated';
  }

  // First turn — no feedback needed yet
  if (turnCount === 0) return 'neutral';

  return 'neutral';
}

// ─────────────────────────────────────────────────────────────
// afterResponse
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

  if (userId && topic) {
    persistLearningData(userId, userMessage, topic).catch((e: any) => {
      logger.warn('afterResponse DB persist failed (non-blocking): ' + e.message);
    });
  }
}

// ─────────────────────────────────────────────────────────────
// persistLearningData  (PRIVATE)
// ─────────────────────────────────────────────────────────────
async function persistLearningData(
  userId:       string,
  userMessage:  string,
  topic:        string,
): Promise<void> {
  try {
    const { StudentProfile } = await import('../../models/StudentProfile.model.js');

    const now         = new Date();
    const todayStr    = now.toISOString().split('T')[0];
    const isConfusion = /don'?t understand|confused|not clear|samajh nahi|kya matlab|phir se|not getting/i.test(userMessage);
    const isMastery   = /got it|makes sense|understand now|clear hai|samajh gaya|samajh gayi/i.test(userMessage);

    const profile = await StudentProfile.findOne({ userId }).select('topicMastery dailyLogs recentMistakes').lean() as any;
    if (!profile) return;

    const existingIdx = (profile.topicMastery || []).findIndex(
      (t: any) => t.topic?.toLowerCase() === topic.toLowerCase()
    );

    if (existingIdx >= 0) {
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

    if (isConfusion) {
      await StudentProfile.updateOne(
        { userId },
        {
          $push: {
            recentMistakes: {
              $each:  [topic],
              $slice: -10,
            },
          },
        }
      );
    }

    const todayLogIdx = (profile.dailyLogs || []).findIndex((d: any) => d.date === todayStr);
    if (todayLogIdx >= 0) {
      await StudentProfile.updateOne(
        { userId },
        { $inc: { [`dailyLogs.${todayLogIdx}.questionsAsked`]: 1 } }
      );
    } else {
      await StudentProfile.updateOne(
        { userId },
        {
          $push: {
            dailyLogs: {
              $each: [{
                date:                    todayStr,
                minutesStudied:          0,
                questionsAsked:          1,
                quizzesCompleted:        0,
                codingSectionsCompleted: 0,
                xpEarned:                0,
                topicsCovered:           [topic],
              }],
              $slice: -90,
            },
          },
        }
      );
    }

    logger.info(`[AskAI] Persisted learning | ${userId.slice(-6)} | topic: ${topic} | confusion: ${isConfusion}`);
  } catch (err: any) {
    throw new Error(`persistLearningData: ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────
// detectTopic
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

// ─────────────────────────────────────────────────────────────
// detectSubject
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