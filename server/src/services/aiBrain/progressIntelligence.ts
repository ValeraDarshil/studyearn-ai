/**
 * AI Study OS — Progress Intelligence (AI Brain Module)
 * ─────────────────────────────────────────────────────────────
 * Converts raw analytics data into human-readable AI insights.
 *
 * This module sits ON TOP of the existing progressIntelService.ts —
 * it adds real-time intelligence that doesn't require a database write.
 *
 * What it produces:
 *   - Instant activity insights ("You studied 4 days this week!")
 *   - Coding speed observations ("Your code submission speed improved")
 *   - Quiz trend analysis ("Quiz accuracy dropped 15% — let's fix that")
 *   - Streak milestone messages
 *   - Weekly comparison insights (this week vs last week)
 *
 * The key difference from progressIntelService.ts:
 *   - That service: generates and SAVES heavy ProgressReport to DB (weekly)
 *   - This module: generates FAST in-memory insights (on every request)
 *
 * Both are used — weekly reports for the dashboard, live insights for chat.
 */

import { StudentProfile } from '../../models/StudentProfile.model.js';
import { logger }         from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export interface LiveInsight {
  type:    'achievement' | 'warning' | 'tip' | 'streak' | 'improvement' | 'decline';
  icon:    string;
  message: string;
  detail?: string;
}

export interface ProgressSnapshot {
  // This week
  daysActiveThisWeek:    number;
  minutesThisWeek:       number;
  quizzesThisWeek:       number;
  questionsThisWeek:     number;
  xpThisWeek:            number;

  // vs last week
  vsLastWeek: {
    minutesDelta: number;
    quizzesDelta: number;
    streak:       number;
    trend:        'up' | 'down' | 'same';
  };

  // coding-specific
  codingSessionsThisWeek: number;

  // Live insights (max 5)
  insights:              LiveInsight[];
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — getProgressSnapshot
// ─────────────────────────────────────────────────────────────
export async function getProgressSnapshot(userId: string): Promise<ProgressSnapshot | null> {
  try {
    const profile = await StudentProfile.findOne({ userId })
      .select('dailyLogs currentStreak longestStreak learnerCategory weakTopics quizHistory overallMasteryScore')
      .lean() as any;

    if (!profile) return null;

    const logs: any[] = profile.dailyLogs || [];

    // ── Date ranges ───────────────────────────────────────
    const thisWeekDates = getLastNDates(7);
    const lastWeekDates = getDateRange(7, 14);

    const thisWeekLogs = logs.filter(d => thisWeekDates.includes(d.date));
    const lastWeekLogs = logs.filter(d => lastWeekDates.includes(d.date));

    // ── Aggregates ────────────────────────────────────────
    const minutesThisWeek  = sumField(thisWeekLogs, 'minutesStudied');
    const minutesLastWeek  = sumField(lastWeekLogs, 'minutesStudied');
    const quizzesThisWeek  = sumField(thisWeekLogs, 'quizzesCompleted');
    const quizzesLastWeek  = sumField(lastWeekLogs, 'quizzesCompleted');
    const xpThisWeek       = sumField(thisWeekLogs, 'xpEarned');
    const questionsThisWeek = sumField(thisWeekLogs, 'questionsAsked');
    const codingThisWeek   = sumField(thisWeekLogs, 'codingSectionsCompleted');
    const daysActiveThisWeek = thisWeekLogs.filter(d =>
      (d.minutesStudied + d.questionsAsked + d.quizzesCompleted) > 0
    ).length;

    // ── Week-over-week trend ──────────────────────────────
    const minutesDelta = minutesThisWeek - minutesLastWeek;
    const quizzesDelta = quizzesThisWeek - quizzesLastWeek;
    const trend: 'up' | 'down' | 'same' = minutesDelta > 5 ? 'up' : minutesDelta < -5 ? 'down' : 'same';

    // ── Generate live insights ────────────────────────────
    const insights = generateInsights({
      profile,
      daysActiveThisWeek,
      minutesThisWeek,
      minutesDelta,
      quizzesThisWeek,
      quizzesDelta,
      xpThisWeek,
      codingThisWeek,
    });

    return {
      daysActiveThisWeek,
      minutesThisWeek,
      quizzesThisWeek,
      questionsThisWeek,
      xpThisWeek,
      vsLastWeek: {
        minutesDelta,
        quizzesDelta,
        streak: profile.currentStreak,
        trend,
      },
      codingSessionsThisWeek: codingThisWeek,
      insights,
    };
  } catch (err: any) {
    logger.error(`[ProgressIntelligence] getProgressSnapshot: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// getLiveInsights — quick array of insight strings for AI context
// ─────────────────────────────────────────────────────────────
export async function getLiveInsights(userId: string): Promise<string[]> {
  const snapshot = await getProgressSnapshot(userId);
  if (!snapshot) return [];
  return snapshot.insights.map(i => i.message);
}

// ─────────────────────────────────────────────────────────────
// checkStreakMilestone — returns message if user hit a milestone
// ─────────────────────────────────────────────────────────────
export function checkStreakMilestone(streak: number): string | null {
  const milestones: Record<number, string> = {
    3:  '🔥 3-day streak! Great start!',
    7:  '🌟 One week streak! Incredible consistency!',
    14: '💪 Two-week streak! You\'re building a real habit!',
    30: '🏆 One month streak! You are absolutely unstoppable!',
    50: '🚀 50-day streak! Elite student status achieved!',
    100:'👑 100-day streak! Hall of Fame learner!',
  };
  return milestones[streak] || null;
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function generateInsights(data: {
  profile:             any;
  daysActiveThisWeek:  number;
  minutesThisWeek:     number;
  minutesDelta:        number;
  quizzesThisWeek:     number;
  quizzesDelta:        number;
  xpThisWeek:          number;
  codingThisWeek:      number;
}): LiveInsight[] {
  const {
    profile, daysActiveThisWeek, minutesThisWeek, minutesDelta,
    quizzesThisWeek, quizzesDelta, xpThisWeek, codingThisWeek,
  } = data;
  const insights: LiveInsight[] = [];

  // Streak insight
  const streak = profile.currentStreak || 0;
  if (streak >= 7) {
    insights.push({ type: 'streak', icon: '🔥', message: `${streak}-day streak! Your consistency is outstanding.` });
  } else if (streak === 0) {
    insights.push({ type: 'warning', icon: '⚡', message: `Start your streak today! Even 10 minutes counts.` });
  }

  // Study time insight
  if (minutesThisWeek >= 120) {
    insights.push({ type: 'achievement', icon: '⏱️', message: `You studied ${minutesThisWeek} minutes this week — great focus!` });
  } else if (minutesThisWeek < 30 && daysActiveThisWeek > 0) {
    insights.push({ type: 'tip', icon: '💡', message: `Try to study at least 20 minutes per session for better retention.` });
  }

  // Week-over-week
  if (minutesDelta > 20) {
    insights.push({ type: 'improvement', icon: '📈', message: `You studied ${minutesDelta} more minutes than last week — keep it up!` });
  } else if (minutesDelta < -20) {
    insights.push({ type: 'decline', icon: '📉', message: `Study time dropped this week. Try to get back to your previous pace.`, detail: `Down ${Math.abs(minutesDelta)} minutes vs last week` });
  }

  // Quiz insight
  if (quizzesThisWeek >= 5) {
    insights.push({ type: 'achievement', icon: '🎯', message: `${quizzesThisWeek} quizzes completed this week — your brain is getting stronger!` });
  } else if (quizzesThisWeek === 0 && daysActiveThisWeek > 0) {
    insights.push({ type: 'tip', icon: '📝', message: `Try taking a quiz today — they help identify weak spots automatically.` });
  }

  // Coding insight
  if (profile.learnerCategory === 'coding' && codingThisWeek >= 3) {
    insights.push({ type: 'achievement', icon: '💻', message: `${codingThisWeek} coding sessions this week — your coding speed is improving!` });
  }

  // Weak topics
  const weak: string[] = profile.weakTopics || [];
  if (weak.length >= 3) {
    insights.push({ type: 'warning', icon: '⚠️', message: `${weak.length} topics need attention: ${weak.slice(0, 2).join(', ')}...`, detail: `Focus on these topics this week to improve your overall mastery.` });
  }

  // XP insight
  if (xpThisWeek >= 200) {
    insights.push({ type: 'achievement', icon: '⭐', message: `Earned ${xpThisWeek} XP this week — you\'re among the top learners!` });
  }

  // Consistency insight
  if (daysActiveThisWeek >= 5) {
    insights.push({ type: 'achievement', icon: '🗓️', message: `Active ${daysActiveThisWeek} out of 7 days this week — excellent consistency!` });
  }

  // Mastery milestone
  const mastery = profile.overallMasteryScore || 0;
  if (mastery >= 80) {
    insights.push({ type: 'achievement', icon: '🏆', message: `Overall mastery: ${mastery}% — you\'re approaching expert level!` });
  } else if (mastery >= 50 && mastery < 80) {
    insights.push({ type: 'improvement', icon: '📚', message: `Mastery at ${mastery}% — you\'re in solid intermediate territory. Push for 80%!` });
  }

  // Return max 5 insights, prioritizing non-tips
  const sorted = [
    ...insights.filter(i => i.type !== 'tip'),
    ...insights.filter(i => i.type === 'tip'),
  ];
  return sorted.slice(0, 5);
}

function getLastNDates(n: number): string[] {
  const dates: string[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(Date.now() + 5.5 * 60 * 60 * 1000 - i * 86400000);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function getDateRange(from: number, to: number): string[] {
  const dates: string[] = [];
  for (let i = from; i < to; i++) {
    const d = new Date(Date.now() + 5.5 * 60 * 60 * 1000 - i * 86400000);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function sumField(logs: any[], field: string): number {
  return logs.reduce((s, d) => s + (d[field] || 0), 0);
}