/**
 * AI Study OS — AI Task Router (Stage 5)
 * ─────────────────────────────────────────────────────────────
 * Routes each OrchestratorDecision to the correct existing service.
 * ALL imports use the EXACT exported function names from each file.
 *
 * Verified function signatures:
 *   generatePath(userId, subject?)             → learningPathGenerator
 *   generateDailyPlan(userId)                  → aiBrain/learningEngine
 *   getAdaptedDifficulty(userId, topic?, ...)  → difficultyAdapter
 *   getRecommendations(userId, trigger?, meta?)→ learningRecommendationEngine
 *   runProgressAnalysis(userId)                → progressAnalyzer
 *   personalTutorSolve(req)                    → aiTutor.service (batch solve)
 *   buildTutorContext(userId, userMessage, ...) → tutorContextManager
 *   buildAIContext(userId)                     → aiBrain/contextBuilder
 *   buildStudentProfile(userId)                → aiBrain/studentProfileEngine
 */

import { OrchestratorDecision }              from './aiDecisionEngine.js';
import { aiMemoryStore }                     from './aiMemoryStore.js';

// Learning system
import { generatePath }                      from '../learningSystem/learningPathGenerator.js';
import { generateDailyPlan }                 from '../aiBrain/learningEngine.js';
import { getAdaptedDifficulty }              from '../learningSystem/difficultyAdapter.js';
import { getRecommendations }                from '../learningSystem/learningRecommendationEngine.js';

// Progress system
import { runProgressAnalysis, getInsightsOnly } from '../progressSystem/progressAnalyzer.js';

// AI Tutor
import { buildTutorContext }                 from '../aiTutor/tutorContextManager.js';

// AI Brain
import { buildAIContext }                    from '../aiBrain/contextBuilder.js';
import { buildStudentProfile }               from '../aiBrain/studentProfileEngine.js';

import { logger }                            from '../../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// aiTaskRouter
// ─────────────────────────────────────────────────────────────
export const aiTaskRouter = {

  /**
   * Execute blocking (non-background) decisions in order.
   * Returns list of completed task labels.
   */
  async execute(userId: string, decisions: OrchestratorDecision[]): Promise<string[]> {
    const executed: string[] = [];
    const blocking = decisions.filter(d => !d.background);

    logger.info({ userId, count: blocking.length }, '[TaskRouter] Executing blocking tasks');

    for (const decision of blocking) {
      const result = await runTask(userId, decision);
      executed.push(result.success ? decision.action : `${decision.action}:failed`);
    }

    return executed;
  },

  /**
   * Execute background decisions in parallel (fire-and-forget).
   * Called without await — never throws to caller.
   */
  async executeBackground(userId: string, decisions: OrchestratorDecision[]): Promise<void> {
    const background = decisions.filter(d => d.background);
    if (!background.length) return;

    logger.info({ userId, count: background.length }, '[TaskRouter] Running background tasks');

    const results = await Promise.allSettled(background.map(d => runTask(userId, d)));
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        logger.error({ userId, action: background[i].action, err: r.reason?.message }, '[TaskRouter] BG task failed');
      }
    });
  },
};

// ─────────────────────────────────────────────────────────────
// Task Dispatcher
// ─────────────────────────────────────────────────────────────
interface TaskResult { action: string; success: boolean; error?: string; }

async function runTask(userId: string, decision: OrchestratorDecision): Promise<TaskResult> {
  const { action, metadata } = decision;
  logger.info({ userId, action, priority: decision.priority }, '[TaskRouter] Running task');

  try {
    switch (action) {

      // ── Learning System ──────────────────────────────────────

      case 'generateLearningPlan': {
        // generatePath(userId, subject?)
        await generatePath(userId);
        return { action, success: true };
      }

      case 'reengagementPlan': {
        // Re-engagement = generate path for weakest subject
        await generatePath(userId);
        return { action, success: true };
      }

      case 'refreshDailyPlan': {
        // generateDailyPlan is from aiBrain/learningEngine
        await generateDailyPlan(userId);
        return { action, success: true };
      }

      case 'adjustDifficulty':
      case 'boostDifficulty':
      case 'challengeMode': {
        // ✅ FIX: getAdaptedDifficulty requires (userId, topic, subject)
        const topic   = (metadata?.topic   as string) ?? 'general';
        const subject = (metadata?.subject as string) ?? 'general';
        await getAdaptedDifficulty(userId, topic, subject);
        return { action, success: true };
      }

      case 'suggestTopics': {
        // getRecommendations(userId, trigger, meta?)
        await getRecommendations(userId, 'general');
        return { action, success: true };
      }

      // ── Progress System ──────────────────────────────────────

      case 'updateProgress': {
        await runProgressAnalysis(userId);
        return { action, success: true };
      }

      case 'generateInsights': {
        // getInsightsOnly returns InsightBundle (not array) — just call it
        await getInsightsOnly(userId);
        return { action, success: true };
      }

      // ── AI Tutor ─────────────────────────────────────────────

      case 'triggerTutor': {
        // buildTutorContext(userId, userMessage, recentActivity?, personality?)
        // Use a placeholder message for proactive tutor setup
        const weakTopics = (metadata?.weakTopics as string[]) ?? [];
        const msg = weakTopics.length > 0
          ? `Help me understand ${weakTopics[0]}`
          : 'I need help with my studies';
        await buildTutorContext(userId, msg);
        return { action, success: true };
      }

      case 'prepareTutor': {
        // Same — build context with neutral message for pre-warming
        await buildTutorContext(userId, 'prepare context');
        return { action, success: true };
      }

      // ── AI Brain ─────────────────────────────────────────────

      case 'buildAIContext': {
        // buildAIContext(userId) — single param
        await buildAIContext(userId);
        return { action, success: true };
      }

      case 'onboardStudent': {
        await buildStudentProfile(userId);
        return { action, success: true };
      }

      // ── Memory ───────────────────────────────────────────────

      case 'syncMemory': {
        await aiMemoryStore.commitOrchestrationSession(userId, {
          trigger:      'sync',
          studentState: 'LEARNING',
          decisions:    ['syncMemory'],
          timestamp:    new Date().toISOString(),
        });
        return { action, success: true };
      }

      case 'celebrateMilestone': {
        await aiMemoryStore.recordAchievement(userId, {
          type:  'streak',
          title: (metadata?.title as string) ?? 'Milestone Achieved!',
          value: metadata?.value as number | undefined,
        });
        return { action, success: true };
      }

      default:
        logger.warn({ userId, action }, '[TaskRouter] Unknown action — skipping');
        return { action, success: false, error: `Unknown action: ${action}` };
    }

  } catch (err: any) {
    logger.error({ userId, action, err: err.message }, '[TaskRouter] Task failed');
    return { action, success: false, error: err.message };
  }
}