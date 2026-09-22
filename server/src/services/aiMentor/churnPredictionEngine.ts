/**
 * AI Study OS — Churn Prediction Engine  (MENTOR UPGRADE — Phase 1a)
 * ─────────────────────────────────────────────────────────────
 * WHY THIS EXISTS:
 *   behaviorAnalyzer.ts is entirely SNAPSHOT-based: it compares "last 5
 *   quizzes" vs "5 before that" and checks single booleans like
 *   isInactive (>24h) or streakBroken. That means every existing mentor
 *   trigger is REACTIVE — it only fires AFTER something has already
 *   gone wrong (streak already broken, already 24h+ inactive, accuracy
 *   already dropped 15%+).
 *
 *   A student's engagement usually DECLINES gradually before any of
 *   those thresholds trip — shorter sessions, fewer questions asked,
 *   slightly longer gaps between visits, day by day. By the time
 *   isInactive flips true, the mentor has already missed 24 hours of
 *   opportunity to intervene.
 *
 * WHAT THIS ADDS:
 *   Real trend analysis over the last 14 days of `dailyLogs` (already
 *   stored per user in StudentProfile — no schema change needed):
 *     - Linear regression slope of daily study minutes → is engagement
 *       actually trending down, not just "did something happen once"
 *     - Weekly frequency comparison (days-active this week vs last week)
 *     - Accuracy trend slope from quizHistory
 *   These combine into a 0–100 riskScore + a riskLevel band, used to
 *   fire a NEW proactive trigger (AT_RISK_PREDICTED) BEFORE the
 *   student actually goes inactive or breaks their streak.
 *
 * HONESTY NOTE:
 *   This does NOT predict an exact "churn date" — with the data
 *   available (a handful of daily-log points), a precise day-count
 *   forecast would be false precision dressed up as intelligence.
 *   What it DOES give is a well-calibrated risk score + the specific
 *   signals driving it, which is what the trigger engine actually needs
 *   to act on.
 *
 * Integration:
 *   • aiMentorEngine.ts     — called alongside behaviorAnalyzer.analyzeBehavior()
 *   • mentorTriggerEngine.ts — consumes ChurnRiskAssessment to fire AT_RISK_PREDICTED
 */

import { StudentProfile } from '../../models/StudentProfile.model.js';
import { logger }         from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ChurnRiskAssessment {
  riskScore:          number;      // 0–100, higher = more likely to disengage soon
  riskLevel:          RiskLevel;
  activityTrendPct:   number;      // % change in daily study minutes (negative = declining)
  accuracyTrendPct:   number;      // % change in quiz accuracy (negative = declining)
  daysActiveLastWeek: number;      // 0–7
  daysActivePrevWeek: number;      // 0–7
  signals:            string[];    // human-readable drivers, for logging + mentor context
  dataQuality:        'insufficient' | 'partial' | 'good'; // how much history this is based on
}

// ── Config ────────────────────────────────────────────────────
const MIN_LOGS_FOR_TREND = 4;     // fewer than this and a "trend" is just noise
const GOOD_DATA_THRESHOLD = 10;

// ─────────────────────────────────────────────────────────────
// churnPredictionEngine
// ─────────────────────────────────────────────────────────────
export const churnPredictionEngine = {

  /**
   * assessForUser — main entry point. Loads the user's own history and
   * returns a risk assessment. NEVER throws — returns a safe "low risk,
   * insufficient data" result on any DB error so a failure here can
   * never block the rest of the mentor pipeline.
   */
  async assessForUser(userId: string): Promise<ChurnRiskAssessment> {
    try {
      const profile = await StudentProfile.findOne({ userId })
        .select('dailyLogs quizHistory')
        .lean();

      if (!profile) return safeDefault('insufficient');

      const dailyLogs   = ((profile as any).dailyLogs   ?? []) as any[];
      const quizHistory = ((profile as any).quizHistory ?? []) as any[];

      return computeAssessment(dailyLogs, quizHistory);

    } catch (err: any) {
      logger.warn({ userId, err: err.message }, '[ChurnPrediction] Assessment failed, defaulting to low-risk');
      return safeDefault('insufficient');
    }
  },
};

// ─────────────────────────────────────────────────────────────
// Core computation — pure function, easy to unit test in isolation.
// ─────────────────────────────────────────────────────────────
function computeAssessment(dailyLogs: any[], quizHistory: any[]): ChurnRiskAssessment {
  const signals: string[] = [];

  // Use the last 14 days of logs (most recent activity pattern).
  // dailyLogs is appended chronologically (oldest → newest), same
  // convention as quizHistory elsewhere in this codebase.
  const recentLogs = dailyLogs.slice(-14);
  const dataQuality: ChurnRiskAssessment['dataQuality'] =
    recentLogs.length >= GOOD_DATA_THRESHOLD ? 'good'
    : recentLogs.length >= MIN_LOGS_FOR_TREND ? 'partial'
    : 'insufficient';

  // ── 1. Activity trend (minutes studied per day, over time) ────
  let activityTrendPct = 0;
  if (recentLogs.length >= MIN_LOGS_FOR_TREND) {
    const minutes = recentLogs.map(l => Number(l.minutesStudied) || 0);
    const slope = linearSlope(minutes);
    const mean  = average(minutes);
    // Normalize slope to a %-change-per-day-relative-to-baseline, so
    // it's comparable across students with very different study volumes.
    activityTrendPct = mean > 0 ? (slope / mean) * 100 : 0;

    if (activityTrendPct < -8) signals.push(`Study time declining (~${Math.abs(Math.round(activityTrendPct))}%/day trend)`);
    else if (activityTrendPct > 8) signals.push('Study time trending up');
  }

  // ── 2. Weekly frequency comparison ─────────────────────────────
  const last7  = dailyLogs.slice(-7);
  const prev7  = dailyLogs.slice(-14, -7);
  const daysActiveLastWeek = last7.filter(l => (Number(l.minutesStudied) || 0) > 0).length;
  const daysActivePrevWeek = prev7.filter(l => (Number(l.minutesStudied) || 0) > 0).length;

  if (prev7.length >= 3 && daysActiveLastWeek < daysActivePrevWeek - 1) {
    signals.push(`Active ${daysActiveLastWeek}/7 days this week vs ${daysActivePrevWeek}/7 last week`);
  }

  // ── 3. Accuracy trend (quiz scores over time) ──────────────────
  let accuracyTrendPct = 0;
  const recentQuizzes = quizHistory.slice(-10);
  if (recentQuizzes.length >= MIN_LOGS_FOR_TREND) {
    const scores = recentQuizzes.map((q: any) => Number(q.score) || 0);
    const slope  = linearSlope(scores);
    const mean   = average(scores);
    accuracyTrendPct = mean > 0 ? (slope / mean) * 100 : 0;

    if (accuracyTrendPct < -10) signals.push(`Quiz accuracy declining (~${Math.abs(Math.round(accuracyTrendPct))}%/quiz trend)`);
  }

  // ── Combine into a 0–100 risk score ────────────────────────────
  let riskScore = 0;

  // Declining activity — strongest signal, up to 40 points
  if (activityTrendPct < 0) {
    riskScore += Math.min(40, Math.abs(activityTrendPct) * 1.2);
  }

  // Low frequency this week relative to last — up to 30 points
  if (daysActivePrevWeek > 0) {
    const freqDrop = (daysActivePrevWeek - daysActiveLastWeek) / daysActivePrevWeek;
    if (freqDrop > 0) riskScore += Math.min(30, freqDrop * 40);
  } else if (daysActiveLastWeek === 0 && dataQuality !== 'insufficient') {
    // No activity at all this week, but we DO have prior history — meaningful signal
    riskScore += 20;
  }

  // Declining accuracy — up to 20 points
  if (accuracyTrendPct < 0) {
    riskScore += Math.min(20, Math.abs(accuracyTrendPct) * 0.8);
  }

  // Very low absolute frequency this week — up to 10 points
  if (daysActiveLastWeek <= 1) riskScore += 10;

  riskScore = Math.round(Math.min(100, Math.max(0, riskScore)));

  // With insufficient data, cap risk score low — we should never
  // sound an alarm based on noise from 2-3 data points.
  const cappedScore = dataQuality === 'insufficient' ? Math.min(riskScore, 15) : riskScore;

  const riskLevel: RiskLevel =
    cappedScore >= 70 ? 'critical' :
    cappedScore >= 45 ? 'high' :
    cappedScore >= 20 ? 'medium' : 'low';

  return {
    riskScore: cappedScore,
    riskLevel,
    activityTrendPct: Math.round(activityTrendPct * 10) / 10,
    accuracyTrendPct: Math.round(accuracyTrendPct * 10) / 10,
    daysActiveLastWeek,
    daysActivePrevWeek,
    signals,
    dataQuality,
  };
}

function safeDefault(dataQuality: ChurnRiskAssessment['dataQuality']): ChurnRiskAssessment {
  return {
    riskScore: 0,
    riskLevel: 'low',
    activityTrendPct: 0,
    accuracyTrendPct: 0,
    daysActiveLastWeek: 0,
    daysActivePrevWeek: 0,
    signals: [],
    dataQuality,
  };
}

// ─────────────────────────────────────────────────────────────
// Statistics helpers — pure, no dependencies.
// ─────────────────────────────────────────────────────────────
function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Ordinary least-squares slope of `values` against their index (0,1,2,...). */
function linearSlope(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;

  const xMean = (n - 1) / 2;
  const yMean = average(values);

  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    const dx = i - xMean;
    numerator   += dx * (values[i] - yMean);
    denominator += dx * dx;
  }
  return denominator === 0 ? 0 : numerator / denominator;
}