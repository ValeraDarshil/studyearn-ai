/**
 * AI Study OS — Progress Analyzer (Stage 4 — Central Hub)
 * ─────────────────────────────────────────────────────────────
 * THE MAIN ORCHESTRATOR — connects all 4 stages together.
 *
 * Stage 1 (AI Brain)    → profile data, mastery, streaks
 * Stage 2 (AI Tutor)    → learning mode, topic detection
 * Stage 3 (Learning)    → priority topics, difficulty, path
 * Stage 4 (This)        → analysis, insights, score, report
 *
 * Internal flow:
 *
 *   userId
 *     ↓
 *   capturePerformance()     ← Stage 1+2+3 data collected
 *     ↓
 *   calculateProgressScore() ← gamified score (0–100)
 *     ↓
 *   analyzeTrends()          ← pattern detection
 *     ↓
 *   generateInsights()       ← human-like AI insight cards
 *     ↓
 *   generateEnrichedWeeklyReport() ← full weekly AI report
 *     ↓
 *   ProgressAnalysisOutput   ← returned to controller
 *
 * This is the ONLY file controllers need to import.
 * Everything else in progressSystem/ is internal.
 */

import { capturePerformance, PerformanceSnapshot }      from './performanceTracker.js';
import { calculateProgressScore, getScoreChangeTip,
         ProgressScore }                                 from './progressScoreCalculator.js';
import { analyzeTrends, TrendReport }                    from './learningTrendAnalyzer.js';
import { generateInsights, InsightBundle }               from './insightGenerator.js';
import { generateEnrichedWeeklyReport, WeeklyReportData } from './weeklyReportGenerator.js';

// Stage 1 — AI Brain connection
import { getBrainSnapshot }                             from '../aiBrain/aiBrain.service.js';
// Stage 3 — Learning Engine connection
import { getContextualRecommendation }                  from '../learningSystem/personalLearningEngine.js';
import { logger }                                        from '../../utils/logger.js';

// ── Re-exports ─────────────────────────────────────────────────
export type { PerformanceSnapshot }  from './performanceTracker.js';
export type { ProgressScore }        from './progressScoreCalculator.js';
export type { TrendReport }          from './learningTrendAnalyzer.js';
export type { InsightBundle, InsightCard } from './insightGenerator.js';
export type { WeeklyReportData }     from './weeklyReportGenerator.js';

// ── Full analysis output ───────────────────────────────────────
export interface ProgressAnalysisOutput {
  userId:          string;
  snapshot:        PerformanceSnapshot;
  score:           ProgressScore;
  scoreTip:        string;
  trends:          TrendReport;
  insights:        InsightBundle;
  weeklyReport:    WeeklyReportData | null;
  // Connected data from other stages
  brainSummary:    string | null;          // Stage 1
  nextActionFromStage3: any | null;        // Stage 3
  generatedAt:     string;
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — runProgressAnalysis
// Full pipeline — used for dashboard loads
// ─────────────────────────────────────────────────────────────
export async function runProgressAnalysis(userId: string): Promise<ProgressAnalysisOutput | null> {
  try {
    logger.info(`[ProgressAnalyzer] Running full analysis for ${userId}`);

    // Step 1 — Capture all performance data (reads Stages 1,2,3 data)
    const snapshot = await capturePerformance(userId);
    if (!snapshot) return null;

    // Step 2 — Run all analyzers in parallel (all are pure functions except report)
    const score  = calculateProgressScore(snapshot);
    snapshot.progressScore = score.total; // inject score back into snapshot

    const trends   = analyzeTrends(snapshot);
    const insights = generateInsights(snapshot, trends, score);
    const scoreTip = getScoreChangeTip(score, snapshot);

    // Step 3 — Fetch Stage 1 brain summary and Stage 3 recommendation in parallel
    const [brainSnap, stage3Rec, weeklyReport] = await Promise.all([
      getBrainSnapshot(userId).catch(() => null),
      getContextualRecommendation(userId, 'login').catch(() => null),
      generateEnrichedWeeklyReport(userId, snapshot, trends, score, insights).catch(() => null),
    ]);

    logger.info(`[ProgressAnalyzer] Analysis complete for ${userId} | score=${score.total} | tier=${score.tier}`);

    return {
      userId,
      snapshot,
      score,
      scoreTip,
      trends,
      insights,
      weeklyReport,
      brainSummary:         brainSnap?.profile?.overallMastery
        ? `${brainSnap.profile.overallMastery}% overall mastery | ${brainSnap.profile.currentStreak} day streak`
        : null,
      nextActionFromStage3: stage3Rec?.primary || null,
      generatedAt:          new Date().toISOString(),
    };
  } catch (err: any) {
    logger.error(`[ProgressAnalyzer] runProgressAnalysis: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// getProgressSnapshot — lightweight (no weekly report)
// Used for quick dashboard widgets and API polling
// ─────────────────────────────────────────────────────────────
export async function getProgressSnapshot(userId: string): Promise<{
  snapshot:  PerformanceSnapshot;
  score:     ProgressScore;
  insights:  InsightBundle;
} | null> {
  try {
    const snapshot = await capturePerformance(userId);
    if (!snapshot) return null;

    const score    = calculateProgressScore(snapshot);
    snapshot.progressScore = score.total;
    const trends   = analyzeTrends(snapshot);
    const insights = generateInsights(snapshot, trends, score);

    return { snapshot, score, insights };
  } catch (err: any) {
    logger.error(`[ProgressAnalyzer] getProgressSnapshot: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// getInsightsOnly — just insight cards (for notification bell)
// ─────────────────────────────────────────────────────────────
export async function getInsightsOnly(userId: string): Promise<InsightBundle | null> {
  try {
    const snapshot = await capturePerformance(userId);
    if (!snapshot) return null;
    const score  = calculateProgressScore(snapshot);
    const trends = analyzeTrends(snapshot);
    return generateInsights(snapshot, trends, score);
  } catch (err: any) {
    logger.error(`[ProgressAnalyzer] getInsightsOnly: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// getWeeklyReportOnly — generate/fetch weekly report
// Connects to existing /api/brain/weekly-report
// ─────────────────────────────────────────────────────────────
export async function getWeeklyReportOnly(userId: string): Promise<WeeklyReportData | null> {
  try {
    const snapshot = await capturePerformance(userId);
    if (!snapshot) return null;
    const score    = calculateProgressScore(snapshot);
    snapshot.progressScore = score.total;
    const trends   = analyzeTrends(snapshot);
    const insights = generateInsights(snapshot, trends, score);
    return generateEnrichedWeeklyReport(userId, snapshot, trends, score, insights);
  } catch (err: any) {
    logger.error(`[ProgressAnalyzer] getWeeklyReportOnly: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// onActivityEvent — called after any student activity
// Connects Stage 4 with ALL other stages' events
// ─────────────────────────────────────────────────────────────
export async function onActivityEvent(
  userId:    string,
  eventType: 'quiz_done' | 'ai_tutor_used' | 'coding_done' | 'login' | 'step_completed',
  meta?:     { topic?: string; subject?: string; score?: number; mode?: string },
): Promise<{ insight: any | null; scoreUpdate: number | null }> {
  try {
    // Quick snapshot (no report generation)
    const snap = await capturePerformance(userId);
    if (!snap) return { insight: null, scoreUpdate: null };

    const score   = calculateProgressScore(snap);
    snap.progressScore = score.total;
    const trends  = analyzeTrends(snap);
    const bundle  = generateInsights(snap, trends, score);

    // Pick most relevant insight for this event
    const relevantInsight = bundle.cards.find(c => {
      if (eventType === 'quiz_done'       && c.type === 'quiz')        return true;
      if (eventType === 'coding_done'     && c.type === 'coding')      return true;
      if (eventType === 'ai_tutor_used'   && c.type === 'improvement') return true;
      if (eventType === 'step_completed'  && c.type === 'achievement') return true;
      return false;
    }) || bundle.primaryInsight;

    logger.info(`[ProgressAnalyzer] onActivityEvent: ${userId} | ${eventType} | score=${score.total}`);

    return {
      insight:     relevantInsight,
      scoreUpdate: score.total,
    };
  } catch (err: any) {
    logger.error(`[ProgressAnalyzer] onActivityEvent: ${err.message}`);
    return { insight: null, scoreUpdate: null };
  }
}