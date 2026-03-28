/**
 * AI Study OS — AI Tutor Service (Personal AI Tutor Engine)
 * ─────────────────────────────────────────────────────────────
 * Stage 2: The complete Personal AI Tutor system.
 *
 * This is the UPGRADED replacement for contextTutorService.
 * It wraps and enhances contextAwareSolve with:
 *
 *   1. TutorContextManager  → full context packet (brain + memory + mode)
 *   2. LearningModeDetector → what is the student doing right now?
 *   3. AIMemoryEngine       → what has the student done before?
 *   4. HintGenerator        → hints instead of direct answers (when enabled)
 *   5. ResponseOptimizer    → post-process response for student's level
 *
 * Full flow:
 *   User message
 *     → detectLearningMode()
 *     → buildTutorContext() [AI Brain + Memory + Mode + Personality]
 *     → buildHintContext()  [if hint mode]
 *     → getOptimizationSystemPrompt() [complexity/length control]
 *     → AI call (Groq → OpenRouter fallback)
 *     → optimizeResponse() [encouragement, follow-up, topic detection]
 *     → updateTopicMastery() [background, non-blocking]
 *     → Return TutorResponse
 *
 * BACKWARD COMPATIBLE: existing contextAwareSolve() still works.
 * This is a NEW endpoint — old one stays untouched.
 */

import { buildTutorContext, TutorPersonality }   from './tutorContextManager.js';
import { buildHintContext, shouldGiveDirectAnswer, isStudentStuck } from './hintGenerator.js';
import { optimizeResponse, getOptimizationSystemPrompt, OptimizationOptions } from './responseOptimizer.js';
import { detectLearningMode }                    from './learningModeDetector.js';
import { updateTopicMastery }                    from '../studentProfileService.js';
import { logger }                                from '../../utils/logger.js';

export type { TutorPersonality } from './tutorContextManager.js';
export type { LearningMode }     from './learningModeDetector.js';

// ── Types ──────────────────────────────────────────────────────
export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export interface TutorRequest {
  userId:          string;
  message:         string;
  history?:        ChatMessage[];
  personality?:    TutorPersonality;
  hintOverride?:   boolean;        // force hint mode on/off
  recentActivity?: string;         // e.g. 'coding', 'quiz', 'ask'
}

export interface TutorResponse {
  answer:          string;
  followUpQ:       string | null;
  learningMode:    string;
  hintMode:        boolean;
  detectedTopic:   string | null;
  personality:     string;
  contextUsed:     boolean;        // was AI Brain context successfully loaded?
}

// ── AI config ──────────────────────────────────────────────────
const GROQ_KEY       = process.env.GROQ_API_KEY       || '';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const AI_TIMEOUT_MS  = 30_000;

function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
];

const OR_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-r1-0528:free',
  'qwen/qwen3-235b-a22b:free',
  'google/gemma-3-27b-it:free',
];

async function callGroq(messages: any[]): Promise<string> {
  for (const model of GROQ_MODELS) {
    try {
      const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({ model, temperature: 0.4, max_tokens: 4096, messages }),
      });
      if (!res.ok) continue;
      const data   = await res.json();
      const answer = data.choices?.[0]?.message?.content;
      if (answer && answer.trim().length > 20) {
        logger.info(`[AITutor] ✅ Groq ${model}`);
        return answer;
      }
    } catch (e: any) { logger.debug(`[AITutor] Groq ${model}: ${e.message}`); }
  }
  throw new Error('Groq: all models failed');
}

async function callOpenRouter(messages: any[]): Promise<string> {
  if (!OPENROUTER_KEY) throw new Error('No OPENROUTER_API_KEY');
  for (const model of OR_MODELS) {
    try {
      const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer':  process.env.FRONTEND_URL || 'https://studyearnai.tech',
          'X-Title':       'AI Study OS',
        },
        body: JSON.stringify({ model, temperature: 0.4, max_tokens: 4096, messages }),
      });
      if (!res.ok) continue;
      const data   = await res.json();
      const answer = data.choices?.[0]?.message?.content;
      if (answer && answer.trim().length > 20) {
        logger.info(`[AITutor] ✅ OpenRouter ${model}`);
        return answer;
      }
    } catch (e: any) { logger.debug(`[AITutor] OR ${model}: ${e.message}`); }
  }
  throw new Error('OpenRouter: all models failed');
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — personalTutorSolve
// Drop-in upgrade for contextAwareSolve with full tutor system
// ─────────────────────────────────────────────────────────────
export async function personalTutorSolve(req: TutorRequest): Promise<TutorResponse> {
  const { userId, message, history = [], personality, hintOverride, recentActivity } = req;

  // ── 1. Quick mode detection (synchronous — no DB) ─────
  const quickMode = detectLearningMode(message, 'self', recentActivity);

  // ── 2. Build full tutor context (async — DB calls) ────
  const tutorCtx = await buildTutorContext(userId, message, recentActivity, personality).catch(() => null);

  const contextUsed  = tutorCtx !== null;
  const learningMode = tutorCtx?.learningMode  || quickMode.mode;
  const hintMode     = hintOverride !== undefined ? hintOverride
    : (tutorCtx?.hintMode || quickMode.hintMode);
  const tutorPersonality = tutorCtx?.tutorPersonality || 'friendly';
  const skillLevel   = (tutorCtx?.skillLevel || 'intermediate') as 'beginner' | 'intermediate' | 'advanced';
  const learningSpeed = (tutorCtx?.learningSpeed || 'medium') as 'slow' | 'medium' | 'fast';

  // ── 3. Build optimization options ─────────────────────
  const optOptions: OptimizationOptions = {
    skillLevel,
    learningMode,
    learningSpeed,
    learnerType:      tutorCtx?.learnerType     || 'self',
    weakTopics:       tutorCtx?.weakTopics      || [],
    hintMode,
    consecutiveWrong: tutorCtx?.consecutiveWrong || 0,
  };

  // ── 4. Assemble system prompt ─────────────────────────
  let systemPrompt = tutorCtx?.systemPromptBlock || buildFallbackSystemPrompt();

  // Inject optimization instructions
  systemPrompt += getOptimizationSystemPrompt(optOptions);

  // Inject hint instructions
  const hintCtx = buildHintContext(hintMode, 1, message);
  if (hintCtx) systemPrompt += hintCtx;

  // ── 5. Build messages array ───────────────────────────
  const safeHistory = (Array.isArray(history) ? history : [])
    .slice(-8)
    .filter((m: any) => m?.role && m?.content)
    .map((m: any) => ({ role: m.role as 'user' | 'assistant', content: String(m.content).slice(0, 2000) }));

  const messages = [
    { role: 'system',    content: systemPrompt },
    ...safeHistory,
    { role: 'user',      content: message },
  ];

  // ── 6. Call AI ────────────────────────────────────────
  let rawAnswer: string;
  try {
    rawAnswer = await callGroq(messages);
  } catch {
    try {
      rawAnswer = await callOpenRouter(messages);
    } catch (err: any) {
      logger.error(`[AITutor] All AI providers failed: ${err.message}`);
      rawAnswer = 'AI is temporarily unavailable. Please try again in a moment.';
    }
  }

  // ── 7. Optimize response ──────────────────────────────
  const optimized = optimizeResponse(rawAnswer, optOptions);

  // ── 8. Background: update topic mastery ──────────────
  if (optimized.detectedTopic && userId) {
    updateTopicMastery(userId, {
      subject:      detectSubjectFromTopic(optimized.detectedTopic),
      topic:        optimized.detectedTopic,
      isCorrect:    true,
      timeSpentSecs: 60,
      source:       'ai_tutor',
    }).catch(() => {});
  }

  logger.info(`[AITutor] Solved for ${userId} | mode=${learningMode} | hint=${hintMode} | ctx=${contextUsed}`);

  return {
    answer:        optimized.content,
    followUpQ:     optimized.followUpQ,
    learningMode,
    hintMode,
    detectedTopic: optimized.detectedTopic,
    personality:   tutorPersonality,
    contextUsed,
  };
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function buildFallbackSystemPrompt(): string {
  return `You are AI Study OS Personal Tutor — an intelligent AI tutor for Indian students.
Explain concepts clearly, step by step. Be encouraging. Indian exam style answers.
For code: provide complete runnable solutions with comments.
For math: show every calculation step.`;
}

function detectSubjectFromTopic(topic: string): string {
  const map: Record<string, string> = {
    'Loops': 'Programming', 'Arrays': 'Programming', 'Functions': 'Programming',
    'Recursion': 'Programming', 'OOP': 'Programming', 'Sorting': 'Algorithms',
    'Trees': 'Data Structures', 'Algebra': 'Mathematics', 'Calculus': 'Mathematics',
    'Trigonometry': 'Mathematics', 'Probability': 'Mathematics',
    'Laws of Motion': 'Physics', 'Electricity': 'Physics',
    'Organic Chem': 'Chemistry', 'Python': 'Python', 'JavaScript': 'JavaScript',
  };
  return map[topic] || 'General';
}