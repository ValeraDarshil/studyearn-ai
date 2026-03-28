/**
 * AI Study OS — Progress Score Calculator (Stage 4)
 * ─────────────────────────────────────────────────────────────
 * Calculates ONE number that represents the student's overall
 * learning health: the PROGRESS SCORE (0–100).
 *
 * Formula (weighted, 5 pillars):
 *   Consistency    (25%) → how regularly they study
 *   Performance    (30%) → quiz accuracy + mastery levels
 *   Activity       (20%) → daily engagement, XP earned
 *   Improvement    (15%) → week-over-week growth
 *   Completion     (10%) → learning plan step completion
 *
 * Score tiers:
 *   90–100 → Elite Learner    🏆
 *   75–89  → Advanced         ⭐
 *   60–74  → On Track         ✅
 *   40–59  → Developing       📈
 *   0–39   → Needs Support    ⚠️
 *
 * This score drives gamification — users see it go up and
 * feel rewarded. It's the "health bar" of learning.
 */

import { PerformanceSnapshot } from './performanceTracker.js';

// ── Types ──────────────────────────────────────────────────────
export type ScoreTier = 'elite' | 'advanced' | 'on_track' | 'developing' | 'needs_support';

export interface ProgressScore {
  total:       number;          // 0–100 final score
  tier:        ScoreTier;
  tierLabel:   string;          // human-readable
  tierIcon:    string;          // emoji
  breakdown: {
    consistency:  number;       // 0–25
    performance:  number;       // 0–30
    activity:     number;       // 0–20
    improvement:  number;       // 0–15
    completion:   number;       // 0–10
  };
  trend:       'up' | 'down' | 'stable';
  message:     string;          // motivational message
  nextMilestone: number;        // score needed for next tier
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — calculateProgressScore
// ─────────────────────────────────────────────────────────────
export function calculateProgressScore(snap: PerformanceSnapshot): ProgressScore {
  // ── Pillar 1: Consistency (0–25 pts) ─────────────────────
  // Based on active days this week + streak
  const consistencyPts = Math.round(
    (snap.consistencyScore / 100) * 18 +           // active days this week (max 18)
    Math.min(snap.streak / 30, 1) * 7              // streak contribution (max 7)
  );

  // ── Pillar 2: Performance (0–30 pts) ─────────────────────
  // Quiz accuracy + overall mastery, weighted
  const quizPts   = Math.round((snap.overallQuizAccuracy / 100) * 18);
  const masteryPts = Math.round((snap.overallMastery / 100) * 12);
  const performancePts = Math.min(30, quizPts + masteryPts);

  // ── Pillar 3: Activity (0–20 pts) ────────────────────────
  // Daily minutes + XP earned this week
  const minsPts = Math.min(10, Math.round((snap.weekly.thisWeek.minutesStudied / 120) * 10));
  const xpPts   = Math.min(10, Math.round((snap.weekly.thisWeek.xpEarned / 300) * 10));
  const activityPts = minsPts + xpPts;

  // ── Pillar 4: Improvement (0–15 pts) ─────────────────────
  // Week-over-week growth (or penalty for decline)
  let improvementPts = 8; // neutral baseline
  if (snap.weekly.trend === 'improving') improvementPts = 15;
  if (snap.weekly.trend === 'declining') improvementPts = Math.max(0, 8 - 5);
  if (snap.quizTrend  === 'improving')  improvementPts = Math.min(15, improvementPts + 5);
  if (snap.quizTrend  === 'declining')  improvementPts = Math.max(0, improvementPts - 3);

  // ── Pillar 5: Completion (0–10 pts) ──────────────────────
  // Learning path completion + plan adherence
  const completionPts = snap.activePath
    ? Math.round((snap.activePath.progress / 100) * 10)
    : snap.totalStudyDays > 0 ? 5 : 2; // fallback if no active path

  // ── Final score ───────────────────────────────────────────
  const total = Math.min(100, Math.round(
    consistencyPts + performancePts + activityPts + improvementPts + completionPts
  ));

  // ── Tier ─────────────────────────────────────────────────
  const { tier, tierLabel, tierIcon, nextMilestone } = getTier(total);

  // ── Trend ─────────────────────────────────────────────────
  const trend: 'up' | 'down' | 'stable' = snap.weekly.trend === 'improving' ? 'up'
    : snap.weekly.trend === 'declining' ? 'down' : 'stable';

  return {
    total,
    tier,
    tierLabel,
    tierIcon,
    breakdown: {
      consistency:  Math.min(25, consistencyPts),
      performance:  Math.min(30, performancePts),
      activity:     Math.min(20, activityPts),
      improvement:  Math.min(15, improvementPts),
      completion:   Math.min(10, completionPts),
    },
    trend,
    message:       buildScoreMessage(total, tier, snap),
    nextMilestone,
  };
}

// ─────────────────────────────────────────────────────────────
// getScoreChangeTip — what to do to increase the score
// ─────────────────────────────────────────────────────────────
export function getScoreChangeTip(score: ProgressScore, snap: PerformanceSnapshot): string {
  const { breakdown } = score;

  // Find weakest pillar and give targeted advice
  const pillars = [
    { name: 'consistency',  pts: breakdown.consistency,  max: 25, tip: `Study at least 20 min every day this week to boost your consistency score.` },
    { name: 'performance',  pts: breakdown.performance,  max: 30, tip: `Focus on quiz practice — your performance score has the highest impact.` },
    { name: 'activity',     pts: breakdown.activity,     max: 20, tip: `Complete more tasks daily — even short sessions earn XP and activity points.` },
    { name: 'improvement',  pts: breakdown.improvement,  max: 15, tip: `You need to show growth vs last week — do more sessions than you did 7 days ago.` },
    { name: 'completion',   pts: breakdown.completion,   max: 10, tip: `Complete steps in your active learning path to earn completion points.` },
  ];

  const weakest = pillars
    .map(p => ({ ...p, pct: p.pts / p.max }))
    .sort((a, b) => a.pct - b.pct)[0];

  return weakest.tip;
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function getTier(score: number): {
  tier: ScoreTier; tierLabel: string; tierIcon: string; nextMilestone: number;
} {
  if (score >= 90) return { tier: 'elite',         tierLabel: 'Elite Learner',    tierIcon: '🏆', nextMilestone: 100 };
  if (score >= 75) return { tier: 'advanced',      tierLabel: 'Advanced',         tierIcon: '⭐', nextMilestone: 90  };
  if (score >= 60) return { tier: 'on_track',      tierLabel: 'On Track',         tierIcon: '✅', nextMilestone: 75  };
  if (score >= 40) return { tier: 'developing',    tierLabel: 'Developing',       tierIcon: '📈', nextMilestone: 60  };
  return             { tier: 'needs_support',  tierLabel: 'Needs Support',    tierIcon: '⚠️', nextMilestone: 40  };
}

function buildScoreMessage(score: number, tier: ScoreTier, snap: PerformanceSnapshot): string {
  if (tier === 'elite')        return `Outstanding! You're in the top tier with a ${score} score. You're setting the standard.`;
  if (tier === 'advanced')     return `Excellent progress! Your ${score} score shows real dedication. Push for Elite!`;
  if (tier === 'on_track')     return `You're on track with a ${score} score. Consistent effort will push you to Advanced.`;
  if (snap.focusDropDetected)  return `Your focus dropped recently — your score is ${score}. Let's rebuild momentum!`;
  if (snap.streak > 5)         return `${snap.streak}-day streak helping you! Your score is ${score}. Keep the consistency going.`;
  return `Your learning score is ${score}. Small improvements every day compound into big gains.`;
}