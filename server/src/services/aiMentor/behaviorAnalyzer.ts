/**
 * AI Study OS — Behavior Analyzer (Stage 6)
 * ─────────────────────────────────────────────────────────────
 * Analyzes user behavior patterns to feed the AI Mentor Engine.
 *
 * Detects:
 *   - inactivity (hours/days since last login)
 *   - streak breaks
 *   - performance drops
 *   - high improvement moments
 *   - learning patterns (time-of-day, session length)
 *   - mood signals (low/high activity proxies)
 *   - comeback opportunity (long gap + easy win needed)
 */

import { StudentProfile } from '../../models/StudentProfile.model.js';
import { Activity }       from '../../models/Activity.model.js';
import { logger }         from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export type MoodSignal = 'demotivated' | 'neutral' | 'engaged' | 'highly_engaged';

export interface ActiveHourPattern {
  preferredHour: number;       // 0–23 (24h)
  preferredPeriod: 'morning' | 'afternoon' | 'evening' | 'night';
  confidence: number;          // 0–1
}

export interface BehaviorSnapshot {
  userId:               string;

  // Inactivity
  hoursSinceLastLogin:  number;
  daysSinceLastLogin:   number;
  isInactive:           boolean;  // > 24h

  // Streak
  currentStreak:        number;
  streakBroken:         boolean;
  streakAtRisk:         boolean;  // hasn't studied today

  // Performance
  recentAccuracy:       number;   // 0–1 (last 5 quizzes)
  previousAccuracy:     number;   // 0–1 (5 before that)
  accuracyTrend:        'up' | 'down' | 'stable';
  performanceDrop:      boolean;  // > 15% drop
  highImprovement:      boolean;  // > 15% improvement

  // Topic intelligence
  weakTopics:           string[];
  strongTopics:         string[];
  mostRecentTopic:      string | null;

  // Session patterns
  avgSessionMinutes:    number;
  activeHours:          ActiveHourPattern;
  comebackCandidate:    boolean;  // inactive 3+ days

  // Mood proxy
  moodSignal:           MoodSignal;

  // Meta
  analyzedAt:           string;
}

// ── Internal helpers ───────────────────────────────────────────

function detectPreferredHour(activities: any[]): ActiveHourPattern {
  if (!activities.length) {
    return { preferredHour: 20, preferredPeriod: 'evening', confidence: 0 };
  }

  const hourCounts: Record<number, number> = {};
  for (const a of activities) {
    const h = new Date(a.createdAt ?? a.timestamp).getHours();
    hourCounts[h] = (hourCounts[h] ?? 0) + 1;
  }

  let maxCount = 0;
  let preferredHour = 20;
  for (const [h, cnt] of Object.entries(hourCounts)) {
    if (cnt > maxCount) { maxCount = cnt; preferredHour = Number(h); }
  }

  const confidence = Math.min(maxCount / Math.max(activities.length, 1), 1);

  let preferredPeriod: ActiveHourPattern['preferredPeriod'] = 'evening';
  if (preferredHour >= 5  && preferredHour < 12) preferredPeriod = 'morning';
  else if (preferredHour >= 12 && preferredHour < 17) preferredPeriod = 'afternoon';
  else if (preferredHour >= 17 && preferredHour < 22) preferredPeriod = 'evening';
  else preferredPeriod = 'night';

  return { preferredHour, preferredPeriod, confidence };
}

function calcAccuracy(quizHistory: any[], from: number, to: number): number {
  const slice = quizHistory.slice(from, to);
  if (!slice.length) return 0;
  return slice.reduce((sum: number, q: any) => sum + (q.score / 100), 0) / slice.length;
}

function detectMood(
  hoursSinceLastLogin: number,
  recentAccuracy:      number,
  currentStreak:       number,
  recentActivityCount: number,
): MoodSignal {
  if (hoursSinceLastLogin > 72)  return 'demotivated';
  if (hoursSinceLastLogin > 24)  return 'neutral';
  if (recentActivityCount > 10 && recentAccuracy > 0.75) return 'highly_engaged';
  if (currentStreak >= 3 && recentAccuracy >= 0.6)       return 'engaged';
  if (recentAccuracy < 0.4)                               return 'demotivated';
  return 'neutral';
}

// ── Main export ────────────────────────────────────────────────

export async function analyzeBehavior(userId: string): Promise<BehaviorSnapshot> {
  try {
    const [profile, recentActivities] = await Promise.all([
      StudentProfile.findOne({ userId }).lean(),
      Activity.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
    ]);

    const now = new Date();

    // ── Inactivity ──────────────────────────────────────────────
    let hoursSinceLastLogin = 9999;
    if (recentActivities.length > 0) {
      const lastTs = new Date((recentActivities[0] as any).createdAt ?? (recentActivities[0] as any).timestamp);
      hoursSinceLastLogin = (now.getTime() - lastTs.getTime()) / (1000 * 60 * 60);
    }
    const daysSinceLastLogin = hoursSinceLastLogin / 24;
    const isInactive         = hoursSinceLastLogin > 24;

    // ── Streak ──────────────────────────────────────────────────
    const currentStreak = profile?.currentStreak ?? 0;
    const lastStudyDate = profile?.lastStudyDate ?? null;
    const todayKey      = now.toISOString().split('T')[0];
    const streakBroken  = lastStudyDate !== null && lastStudyDate !== todayKey
                          && (new Date(todayKey).getTime() - new Date(lastStudyDate).getTime()) > 86400000;
    const streakAtRisk  = lastStudyDate !== todayKey; // hasn't studied today yet

    // ── Performance ─────────────────────────────────────────────
    const quizHistory    = (profile as any)?.quizHistory ?? [];
    const recentAccuracy = calcAccuracy(quizHistory, 0, 5);
    const prevAccuracy   = calcAccuracy(quizHistory, 5, 10);
    const accDiff        = recentAccuracy - prevAccuracy;

    const accuracyTrend:  BehaviorSnapshot['accuracyTrend'] =
      accDiff > 0.08 ? 'up' : accDiff < -0.08 ? 'down' : 'stable';
    const performanceDrop   = accDiff < -0.15;
    const highImprovement   = accDiff > 0.15;

    // ── Topics ──────────────────────────────────────────────────
    const weakTopics    = profile?.weakTopics  ?? [];
    const strongTopics  = profile?.strongTopics ?? [];
    const mostRecentTopic: string | null =
      (profile as any)?.dailyLogs?.at(-1)?.topicsCovered?.[0] ?? null;

    // ── Session patterns ─────────────────────────────────────────
    const dailyLogs     = (profile as any)?.dailyLogs ?? [];
    const last7         = dailyLogs.slice(-7);
    const avgSessionMinutes = last7.length
      ? last7.reduce((s: number, d: any) => s + (d.minutesStudied ?? 0), 0) / last7.length
      : 0;

    const activeHours   = detectPreferredHour(recentActivities as any[]);
    const comebackCandidate = daysSinceLastLogin >= 3;

    // ── Mood ─────────────────────────────────────────────────────
    const moodSignal = detectMood(
      hoursSinceLastLogin,
      recentAccuracy,
      currentStreak,
      recentActivities.length,
    );

    return {
      userId,
      hoursSinceLastLogin,
      daysSinceLastLogin,
      isInactive,
      currentStreak,
      streakBroken,
      streakAtRisk,
      recentAccuracy,
      previousAccuracy: prevAccuracy,
      accuracyTrend,
      performanceDrop,
      highImprovement,
      weakTopics,
      strongTopics,
      mostRecentTopic,
      avgSessionMinutes,
      activeHours,
      comebackCandidate,
      moodSignal,
      analyzedAt: now.toISOString(),
    };

  } catch (err) {
    logger.error({ userId, err }, '[BehaviorAnalyzer] Failed');
    throw err;
  }
}

export const behaviorAnalyzer = { analyzeBehavior };