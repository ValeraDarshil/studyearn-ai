/**
 * AI Study OS — Personal Learning Engine (Stage 3 — Central Hub)
 * ─────────────────────────────────────────────────────────────
 * The master orchestrator of the entire Stage 3 system.
 *
 * This is the SINGLE entry point for all Stage 3 features.
 * It connects Stage 1 (AI Brain) + Stage 2 (AI Tutor) +
 * Stage 3 (Learning Engine) into one unified pipeline.
 *
 * Architecture:
 *
 *   AI Brain data (Stage 1)
 *        │
 *        ▼
 *   TopicPriorityAnalyzer  → ranks topics by urgency
 *        │
 *        ▼
 *   DifficultyAdapter      → sets difficulty per topic
 *        │
 *   ┌────┴────┐
 *   ▼         ▼
 *   LearningPathGenerator  DailyLearningPlanner
 *   (7-day roadmap)        (today's exact schedule)
 *        │                        │
 *        └────────┬───────────────┘
 *                 ▼
 *   RecommendationEngine   → contextual nudges
 *                 │
 *                 ▼
 *   LearningEngineOutput   → returned to controller
 *
 * Adaptive Learning Cycle (the key innovation):
 *   After every quiz / session / coding:
 *     → re-analyze priorities
 *     → adapt difficulty
 *     → update daily plan
 *     → fire new recommendations
 *   This is what makes it truly adaptive.
 */

import { analyzePriorities, getTopNPriorityTopics, PriorityReport } from './topicPriorityAnalyzer.js';
import { getOverallDifficulty, getBulkDifficulty, DifficultyDecision } from './difficultyAdapter.js';
import { generatePath, GeneratedPath }                               from './learningPathGenerator.js';
import { generateDailyPlan, DailyPlanOutput }                        from './dailyLearningPlanner.js';
import { getRecommendations, afterQuizRecommendation,
         RecommendationBundle, RecommendationTrigger }               from './learningRecommendationEngine.js';
import { logger }                                                    from '../../utils/logger.js';

// ── Re-exports for convenience ─────────────────────────────────
export type { PriorityReport }     from './topicPriorityAnalyzer.js';
export type { DifficultyDecision } from './difficultyAdapter.js';
export type { GeneratedPath }      from './learningPathGenerator.js';
export type { DailyPlanOutput }    from './dailyLearningPlanner.js';
export type { RecommendationBundle, RecommendationTrigger } from './learningRecommendationEngine.js';

// ── Full Engine Output ─────────────────────────────────────────
export interface LearningEngineOutput {
  userId:           string;
  dailyPlan:        DailyPlanOutput | null;
  learningPath:     GeneratedPath   | null;
  priorityReport:   PriorityReport  | null;
  difficultyLevel:  DifficultyDecision | null;
  recommendations:  RecommendationBundle | null;
  generatedAt:      string;
}

// ─────────────────────────────────────────────────────────────
// getFullLearningPlan — heavy operation, for dashboard load
// Runs everything in parallel for maximum speed
// ─────────────────────────────────────────────────────────────
export async function getFullLearningPlan(
  userId:   string,
  subject?: string,
): Promise<LearningEngineOutput | null> {
  try {
    logger.info(`[LearningEngine] Building full plan for ${userId}`);

    const [dailyPlan, learningPath, priorityReport, difficultyLevel, recommendations] =
      await Promise.all([
        generateDailyPlan(userId).catch(() => null),
        generatePath(userId, subject).catch(() => null),
        analyzePriorities(userId).catch(() => null),
        getOverallDifficulty(userId).catch(() => null),
        getRecommendations(userId, 'login').catch(() => null),
      ]);

    logger.info(`[LearningEngine] Full plan built for ${userId}`);

    return {
      userId,
      dailyPlan,
      learningPath,
      priorityReport,
      difficultyLevel,
      recommendations,
      generatedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    logger.error(`[LearningEngine] getFullLearningPlan: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// getDailyPlan — lightweight, just today's tasks
// Used on dashboard home widget (fast)
// ─────────────────────────────────────────────────────────────
export async function getDailyPlanOnly(userId: string): Promise<DailyPlanOutput | null> {
  return generateDailyPlan(userId).catch((err: any) => {
    logger.error(`[LearningEngine] getDailyPlanOnly: ${err.message}`);
    return null;
  });
}

// ─────────────────────────────────────────────────────────────
// getPriorityTopics — what to study, ranked
// ─────────────────────────────────────────────────────────────
export async function getPriorityTopicsForUser(
  userId: string,
  limit = 5,
) {
  return getTopNPriorityTopics(userId, limit).catch((err: any) => {
    logger.error(`[LearningEngine] getPriorityTopicsForUser: ${err.message}`);
    return [];
  });
}

// ─────────────────────────────────────────────────────────────
// getAdaptivePath — generate learning path for a subject
// ─────────────────────────────────────────────────────────────
export async function getAdaptivePath(
  userId:  string,
  subject?: string,
): Promise<GeneratedPath | null> {
  return generatePath(userId, subject).catch((err: any) => {
    logger.error(`[LearningEngine] getAdaptivePath: ${err.message}`);
    return null;
  });
}

// ─────────────────────────────────────────────────────────────
// getContextualRecommendation — trigger-based suggestions
// Called after key events: quiz, coding, AI session, login
// ─────────────────────────────────────────────────────────────
export async function getContextualRecommendation(
  userId:  string,
  trigger: RecommendationTrigger,
  meta?:   { topic?: string; subject?: string; score?: number },
): Promise<RecommendationBundle | null> {
  return getRecommendations(userId, trigger, meta).catch((err: any) => {
    logger.error(`[LearningEngine] getContextualRecommendation: ${err.message}`);
    return null;
  });
}

// ─────────────────────────────────────────────────────────────
// onQuizComplete — adaptive cycle trigger
// Call this RIGHT AFTER every quiz to fire the adaptive engine
// ─────────────────────────────────────────────────────────────
export async function onQuizComplete(
  userId:  string,
  topic:   string,
  subject: string,
  score:   number,
): Promise<{
  recommendation: Awaited<ReturnType<typeof afterQuizRecommendation>>;
  updatedDifficulty: DifficultyDecision | null;
}> {
  const [recommendation, updatedDifficulty] = await Promise.all([
    afterQuizRecommendation(userId, topic, subject, score),
    getOverallDifficulty(userId).catch(() => null),
  ]);

  logger.info(`[LearningEngine] onQuizComplete: ${userId} | ${topic} | ${score}%`);

  return { recommendation, updatedDifficulty };
}

// ─────────────────────────────────────────────────────────────
// getDifficultySettings — what difficulty for every topic
// ─────────────────────────────────────────────────────────────
export async function getDifficultySettings(userId: string) {
  return getBulkDifficulty(userId).catch((err: any) => {
    logger.error(`[LearningEngine] getDifficultySettings: ${err.message}`);
    return [];
  });
}