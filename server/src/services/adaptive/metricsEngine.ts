/**
 * AI Study OS — Metrics Engine + Optimization Engine  (GAP 8 FIX)
 * ─────────────────────────────────────────────────────────────
 * Tracks learning outcomes and uses them to optimize the system.
 *
 * metricsEngine tracks:
 *   • retentionRate       — did student come back?
 *   • accuracyImprovement — is mastery score rising over sessions?
 *   • sessionDuration     — engagement quality
 *   • comebackRate        — churn signal
 *   • strategyEfficiency  — which strategies deliver mastery fastest?
 *
 * optimizationEngine uses metrics to:
 *   • Adjust strategy weights for this specific user
 *   • Suggest difficulty adjustments
 *   • Personalize teaching pace
 *   • Trigger re-engagement when churn risk is detected
 *
 * Integration:
 *   • aiBrainCore.ts         — reads optimization output for personalization
 *   • aiDecisionEngine.ts    — uses optimization signals for decisions
 *   • daily_cron trigger     — runs metricsEngine.computeForUser() nightly
 */

import { StudentProfile }     from '../../models/StudentProfile.model.js';
import { AskAISession }       from '../../models/AskAISession.model.js';
import { longTermMemoryEngine } from './longTermMemoryEngine.js';
import { logger }             from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export interface LearningMetrics {
  userId:               string;
  retentionRate:        number;    // 0–1: sessions in last 7 days / baseline
  accuracyImprovement:  number;    // % change in mastery score over last 2 weeks
  avgSessionDurationMin: number;
  comebackRate:         number;    // 0–1: returned after 2+ day gap
  totalSessions:        number;
  totalQuestions:       number;
  avgConfusionRate:     number;    // 0–1: confusion events / total turns
  avgMasteryRate:       number;    // 0–1: mastery events / total turns
  topPerformingTopics:  string[];
  topWeakTopics:        string[];
  computedAt:           string;
}

export interface OptimizationOutput {
  userId:                    string;
  suggestedDifficultyDelta:  number;   // -1 (easier), 0 (same), +1 (harder)
  paceAdjustment:            'slow' | 'normal' | 'fast';
  preferredStrategyBoosts:   Record<string, number>;  // strategy → score boost
  churnRisk:                 'low' | 'medium' | 'high';
  reengagementSuggested:     boolean;
  focusTopics:               string[];    // should focus on these next session
  avoidTopics:               string[];    // already mastered, skip for now
  recommendation:            string;      // human-readable summary
  optimizedAt:               string;
}

// ─────────────────────────────────────────────────────────────
// metricsEngine
// ─────────────────────────────────────────────────────────────
export const metricsEngine = {

  /**
   * computeForUser — computes all learning metrics for a user.
   * Run after each session or via daily_cron.
   */
  async computeForUser(userId: string): Promise<LearningMetrics> {
    logger.info({ userId }, '[MetricsEngine] Computing metrics');

    try {
      const now = new Date();
      const sevenDaysAgo  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
      const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      // Fetch sessions
      const [recentSessions, olderSessions, profile] = await Promise.all([
        AskAISession.find({ userId, deletedAt: null, lastMessageAt: { $gte: sevenDaysAgo } })
          .select('turnCount confusionCount masteryCount sessionStartAt lastMessageAt')
          .lean(),
        AskAISession.find({ userId, deletedAt: null, lastMessageAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } })
          .select('turnCount confusionCount masteryCount')
          .lean(),
        StudentProfile.findOne({ userId })
          .select('topicMastery currentStreak')
          .lean(),
      ]);

      // ── Retention rate ─────────────────────────────────────
      const baseline = Math.max(1, olderSessions.length);
      const retentionRate = Math.min(1, recentSessions.length / baseline);

      // ── Accuracy improvement ──────────────────────────────
      const recentMasteryRate  = computeAvgMasteryRate(recentSessions as any[]);
      const olderMasteryRate   = computeAvgMasteryRate(olderSessions as any[]);
      const accuracyImprovement = recentMasteryRate - olderMasteryRate;  // positive = improving

      // ── Session duration ───────────────────────────────────
      const durationsMin = recentSessions.map((s: any) => {
        const start = new Date(s.sessionStartAt).getTime();
        const end   = new Date(s.lastMessageAt).getTime();
        return Math.max(0, (end - start) / 60_000);
      });
      const avgSessionDurationMin = durationsMin.length > 0
        ? durationsMin.reduce((a, b) => a + b, 0) / durationsMin.length
        : 0;

      // ── Comeback rate (returned after 2+ day gap) ─────────
      const comebackRate = computeComebackRate(recentSessions as any[]);

      // ── Confusion / mastery rates ─────────────────────────
      const allSessions = [...recentSessions] as any[];
      const totalTurns      = allSessions.reduce((s, sess) => s + (sess.turnCount ?? 0), 0);
      const totalConfusion  = allSessions.reduce((s, sess) => s + (sess.confusionCount ?? 0), 0);
      const totalMastery    = allSessions.reduce((s, sess) => s + (sess.masteryCount ?? 0), 0);

      const avgConfusionRate = totalTurns > 0 ? totalConfusion / totalTurns : 0;
      const avgMasteryRate   = totalTurns > 0 ? totalMastery   / totalTurns : 0;

      // ── Top/weak topics from profile ────────────────────────
      const topics: any[]  = (profile as any)?.topicMastery ?? [];
      const topPerforming  = topics.filter(t => t.isStrong).map(t => t.topic).slice(0, 5);
      const topWeak        = topics.filter(t => t.isWeak).map(t => t.topic).slice(0, 5);

      const metrics: LearningMetrics = {
        userId,
        retentionRate:        Math.min(1, retentionRate),
        accuracyImprovement,
        avgSessionDurationMin: Math.round(avgSessionDurationMin),
        comebackRate,
        totalSessions:        recentSessions.length,
        totalQuestions:       totalTurns,
        avgConfusionRate:     Math.min(1, avgConfusionRate),
        avgMasteryRate:       Math.min(1, avgMasteryRate),
        topPerformingTopics:  topPerforming,
        topWeakTopics:        topWeak,
        computedAt:           now.toISOString(),
      };

      logger.info(
        { userId, retention: retentionRate.toFixed(2), accuracy: accuracyImprovement.toFixed(2) },
        '[MetricsEngine] Metrics computed'
      );

      return metrics;

    } catch (err: any) {
      logger.error({ userId, err: err.message }, '[MetricsEngine] computeForUser failed');
      return buildEmptyMetrics(userId);
    }
  },
};

// ─────────────────────────────────────────────────────────────
// optimizationEngine
// ─────────────────────────────────────────────────────────────
export const optimizationEngine = {

  /**
   * optimize — computes optimization output from metrics.
   * Called by aiBrainCore and aiDecisionEngine.
   */
  async optimize(userId: string): Promise<OptimizationOutput> {
    logger.info({ userId }, '[OptimizationEngine] Running optimization');

    const metrics = await metricsEngine.computeForUser(userId);

    // ── Difficulty delta ───────────────────────────────────
    let suggestedDifficultyDelta = 0;
    if (metrics.avgMasteryRate > 0.7 && metrics.avgConfusionRate < 0.2) {
      suggestedDifficultyDelta = 1;  // too easy → harder
    } else if (metrics.avgConfusionRate > 0.5 || metrics.avgMasteryRate < 0.3) {
      suggestedDifficultyDelta = -1; // too hard → easier
    }

    // ── Pace adjustment ────────────────────────────────────
    const paceAdjustment: 'slow' | 'normal' | 'fast' =
      metrics.avgSessionDurationMin > 30 && metrics.avgMasteryRate > 0.6 ? 'fast'
      : metrics.avgConfusionRate > 0.4 ? 'slow'
      : 'normal';

    // ── Strategy boosts based on confusion rate ────────────
    const preferredStrategyBoosts: Record<string, number> = {};
    if (metrics.avgConfusionRate > 0.4) {
      preferredStrategyBoosts['SIMPLIFY']     = 0.20;
      preferredStrategyBoosts['STEP_BY_STEP'] = 0.15;
      preferredStrategyBoosts['ENCOURAGE']    = 0.10;
    }
    if (metrics.avgMasteryRate > 0.6) {
      preferredStrategyBoosts['CHALLENGE'] = 0.15;
      preferredStrategyBoosts['QUIZ']      = 0.10;
    }

    // ── Churn risk ─────────────────────────────────────────
    const churnRisk: 'low' | 'medium' | 'high' =
      metrics.retentionRate < 0.2 ? 'high'
      : metrics.retentionRate < 0.5 ? 'medium'
      : 'low';

    const reengagementSuggested = churnRisk !== 'low';

    // ── Focus topics ───────────────────────────────────────
    const focusTopics = metrics.topWeakTopics.slice(0, 3);
    const avoidTopics = metrics.topPerformingTopics.slice(0, 2);

    // ── Human-readable recommendation ─────────────────────
    const recommendation = buildRecommendation(metrics, suggestedDifficultyDelta, churnRisk);

    const output: OptimizationOutput = {
      userId,
      suggestedDifficultyDelta,
      paceAdjustment,
      preferredStrategyBoosts,
      churnRisk,
      reengagementSuggested,
      focusTopics,
      avoidTopics,
      recommendation,
      optimizedAt: new Date().toISOString(),
    };

    logger.info(
      { userId, difficulty: suggestedDifficultyDelta, pace: paceAdjustment, churnRisk },
      '[OptimizationEngine] Optimization complete'
    );

    return output;
  },
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function computeAvgMasteryRate(sessions: any[]): number {
  if (sessions.length === 0) return 0;
  const total   = sessions.reduce((s, sess) => s + (sess.turnCount      ?? 0), 0);
  const mastery = sessions.reduce((s, sess) => s + (sess.masteryCount   ?? 0), 0);
  return total > 0 ? mastery / total : 0;
}

function computeComebackRate(sessions: any[]): number {
  if (sessions.length < 2) return 0;
  const sorted = sessions
    .map((s: any) => new Date(s.sessionStartAt).getTime())
    .sort((a, b) => a - b);

  const twoDayMs = 2 * 24 * 60 * 60 * 1000;
  let comebacks = 0;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] >= twoDayMs) comebacks++;
  }

  return Math.min(1, comebacks / (sorted.length - 1));
}

function buildRecommendation(
  metrics:   LearningMetrics,
  diffDelta: number,
  churnRisk: string
): string {
  const parts: string[] = [];

  if (churnRisk === 'high') {
    parts.push('⚠️ Student engagement is low. Re-engagement recommended.');
  }

  if (diffDelta === 1) {
    parts.push('📈 Student is performing well. Increase difficulty.');
  } else if (diffDelta === -1) {
    parts.push('📉 Student is struggling. Reduce difficulty and use simpler explanations.');
  }

  if (metrics.topWeakTopics.length > 0) {
    parts.push(`🎯 Focus areas: ${metrics.topWeakTopics.slice(0, 2).join(', ')}`);
  }

  if (metrics.avgSessionDurationMin < 5 && metrics.retentionRate < 0.5) {
    parts.push('⏱️ Sessions are short. Content may not be engaging enough.');
  }

  return parts.join(' | ') || 'System performing normally.';
}

function buildEmptyMetrics(userId: string): LearningMetrics {
  return {
    userId,
    retentionRate:         0,
    accuracyImprovement:   0,
    avgSessionDurationMin: 0,
    comebackRate:          0,
    totalSessions:         0,
    totalQuestions:        0,
    avgConfusionRate:      0,
    avgMasteryRate:        0,
    topPerformingTopics:   [],
    topWeakTopics:         [],
    computedAt:            new Date().toISOString(),
  };
}