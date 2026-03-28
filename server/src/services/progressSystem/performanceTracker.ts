/**
 * AI Study OS — Performance Tracker (Stage 4)
 * ─────────────────────────────────────────────────────────────
 * Aggregates RAW performance data from ALL stages:
 *   Stage 1 (AI Brain)    → topic mastery, streaks, daily logs
 *   Stage 2 (AI Tutor)    → questions asked, topics detected
 *   Stage 3 (Learning)    → plan completion, difficulty levels
 *   CodeLearn system      → coding progress per language
 *   Quiz system           → accuracy, scores, attempts
 *
 * This is the DATA LAYER of Stage 4 — it collects,
 * normalises and returns a single PerformanceSnapshot
 * that every other Stage 4 module reads from.
 *
 * No AI calls here — pure data aggregation for speed.
 */

import { StudentProfile }  from '../../models/StudentProfile.model.js';
import { ProgressReport }  from '../../models/ProgressReport.model.js';
import { CodeProgress }    from '../../models/CodeLearn.model.js';
import { Activity }        from '../../models/Activity.model.js';
import { LearningPath }    from '../../models/LearningPath.model.js';
import { logger }          from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export interface SubjectPerformance {
  subject:       string;
  avgMastery:    number;       // 0–100 weighted average
  topicCount:    number;
  weakTopics:    string[];
  strongTopics:  string[];
  trend:         'improving' | 'declining' | 'stable';
  quizAccuracy:  number;       // 0–100
  quizCount:     number;
}

export interface CodingPerformance {
  totalLanguages:   number;
  languages:        { name: string; xp: number; week: number; streak: number }[];
  totalCodingXP:    number;
  avgWeekReached:   number;
  recentSessions:   number;    // last 7 days
}

export interface WeeklyComparison {
  thisWeek:   WeeklyMetrics;
  lastWeek:   WeeklyMetrics;
  deltas:     { minutes: number; quizzes: number; questions: number; xp: number };
  trend:      'improving' | 'declining' | 'stable';
}

export interface WeeklyMetrics {
  minutesStudied:    number;
  quizzesCompleted:  number;
  questionsAsked:    number;
  xpEarned:          number;
  activeDays:        number;
  codingSessions:    number;
}

export interface PerformanceSnapshot {
  userId:           string;
  capturedAt:       string;

  // Overall
  overallMastery:   number;     // 0–100
  progressScore:    number;     // computed by progressScoreCalculator
  streak:           number;
  totalStudyDays:   number;
  learnerCategory:  string;
  learningSpeed:    string;

  // By subject
  subjectPerformance:  SubjectPerformance[];
  bestSubject:         string | null;
  worstSubject:        string | null;

  // Quiz intelligence
  overallQuizAccuracy: number;
  totalQuizzesTaken:   number;
  recentQuizScores:    number[];    // last 5 scores
  quizTrend:           'improving' | 'declining' | 'stable';

  // Coding
  codingPerformance:   CodingPerformance;
  isCodingLearner:     boolean;

  // Time & consistency
  weekly:              WeeklyComparison;
  avgDailyMins:        number;     // rolling 7-day
  consistencyScore:    number;     // 0–100

  // Learning path
  activePath:          { title: string; progress: number; daysLeft: number } | null;

  // Focus detection (Stage 4 special feature)
  focusLevel:          'high' | 'medium' | 'low' | 'absent';
  daysSinceActive:     number;
  focusDropDetected:   boolean;

  // Mistakes
  recentMistakes:      string[];
  persistentWeakTopics:string[];   // weak for 14+ days
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — capturePerformance
// ─────────────────────────────────────────────────────────────
export async function capturePerformance(userId: string): Promise<PerformanceSnapshot | null> {
  try {
    const [profile, codingProgress, activePath, recentActivity] = await Promise.all([
      StudentProfile.findOne({ userId }).lean() as any,
      CodeProgress.find({ userId }).lean() as unknown as any[],
      LearningPath.findOne({ userId, status: 'active' }).sort({ createdAt: -1 }).lean() as any,
      Activity.find({ userId }).sort({ timestamp: -1 }).limit(30).lean() as unknown as any[],
    ]);

    if (!profile) return null;

    const now   = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const today = now.toISOString().split('T')[0];

    // ── Date helpers ──────────────────────────────────────────
    const lastNDates = (n: number, offset = 0) => {
      const dates: string[] = [];
      for (let i = offset; i < n + offset; i++) {
        const d = new Date(now.getTime() - i * 86400000);
        dates.push(d.toISOString().split('T')[0]);
      }
      return dates;
    };

    const thisWeekDates = lastNDates(7);
    const lastWeekDates = lastNDates(7, 7);
    const logs: any[]   = profile.dailyLogs || [];

    const thisWeekLogs = logs.filter((l: any) => thisWeekDates.includes(l.date));
    const lastWeekLogs = logs.filter((l: any) => lastWeekDates.includes(l.date));

    const sumField = (arr: any[], f: string) => arr.reduce((s, l) => s + (l[f] || 0), 0);

    // ── Weekly metrics ────────────────────────────────────────
    const thisWeek: WeeklyMetrics = {
      minutesStudied:   sumField(thisWeekLogs, 'minutesStudied'),
      quizzesCompleted: sumField(thisWeekLogs, 'quizzesCompleted'),
      questionsAsked:   sumField(thisWeekLogs, 'questionsAsked'),
      xpEarned:         sumField(thisWeekLogs, 'xpEarned'),
      activeDays:       thisWeekLogs.filter(l => (l.minutesStudied + l.questionsAsked) > 0).length,
      codingSessions:   sumField(thisWeekLogs, 'codingSectionsCompleted'),
    };

    const lastWeek: WeeklyMetrics = {
      minutesStudied:   sumField(lastWeekLogs, 'minutesStudied'),
      quizzesCompleted: sumField(lastWeekLogs, 'quizzesCompleted'),
      questionsAsked:   sumField(lastWeekLogs, 'questionsAsked'),
      xpEarned:         sumField(lastWeekLogs, 'xpEarned'),
      activeDays:       lastWeekLogs.filter(l => (l.minutesStudied + l.questionsAsked) > 0).length,
      codingSessions:   sumField(lastWeekLogs, 'codingSectionsCompleted'),
    };

    const deltaMinutes  = thisWeek.minutesStudied   - lastWeek.minutesStudied;
    const weeklyTrend   = deltaMinutes > 15 ? 'improving' : deltaMinutes < -15 ? 'declining' : 'stable';

    // ── Subject performance ───────────────────────────────────
    const topicMastery: any[] = profile.topicMastery || [];
    const subjectMap: Record<string, {
      mastery: number[]; weak: string[]; strong: string[]; trends: string[];
      quizScores: number[]; quizCount: number;
    }> = {};

    for (const t of topicMastery) {
      if (!subjectMap[t.subject]) {
        subjectMap[t.subject] = { mastery: [], weak: [], strong: [], trends: [], quizScores: [], quizCount: 0 };
      }
      subjectMap[t.subject].mastery.push(t.masteryLevel);
      subjectMap[t.subject].trends.push(t.trend);
      if (t.isWeak)   subjectMap[t.subject].weak.push(t.topic);
      if (t.isStrong) subjectMap[t.subject].strong.push(t.topic);
    }

    // Add quiz scores per subject
    for (const q of (profile.quizHistory || []).slice(-20)) {
      if (subjectMap[q.subject]) {
        subjectMap[q.subject].quizScores.push(q.score);
        subjectMap[q.subject].quizCount++;
      }
    }

    const subjectPerformance: SubjectPerformance[] = Object.entries(subjectMap).map(([subject, data]) => {
      const avg = Math.round(data.mastery.reduce((s, v) => s + v, 0) / data.mastery.length);
      const improvingCount = data.trends.filter(t => t === 'improving').length;
      const decliningCount = data.trends.filter(t => t === 'declining').length;
      const trend: 'improving' | 'declining' | 'stable' =
        improvingCount > decliningCount ? 'improving'
        : decliningCount > improvingCount ? 'declining' : 'stable';
      const quizAcc = data.quizScores.length > 0
        ? Math.round(data.quizScores.reduce((s, v) => s + v, 0) / data.quizScores.length)
        : 0;
      return {
        subject, avgMastery: avg, topicCount: data.mastery.length,
        weakTopics: data.weak, strongTopics: data.strong,
        trend, quizAccuracy: quizAcc, quizCount: data.quizCount,
      };
    }).sort((a, b) => b.avgMastery - a.avgMastery);

    const bestSubject  = subjectPerformance[0]?.subject || null;
    const worstSubject = subjectPerformance[subjectPerformance.length - 1]?.subject || null;

    // ── Quiz intelligence ─────────────────────────────────────
    const allQuizzes: any[] = (profile.quizHistory || []).slice(-10);
    const recentQuizScores  = allQuizzes.slice(-5).map((q: any) => q.score);
    const overallQuizAcc    = allQuizzes.length > 0
      ? Math.round(allQuizzes.reduce((s: number, q: any) => s + q.score, 0) / allQuizzes.length)
      : 0;

    // Quiz trend: compare last 5 vs previous 5
    const q1 = allQuizzes.slice(-5).reduce((s, q) => s + q.score, 0) / Math.max(allQuizzes.slice(-5).length, 1);
    const q2 = allQuizzes.slice(-10, -5).reduce((s, q) => s + q.score, 0) / Math.max(allQuizzes.slice(-10, -5).length, 1);
    const quizTrend: 'improving' | 'declining' | 'stable' =
      q1 > q2 + 5 ? 'improving' : q1 < q2 - 5 ? 'declining' : 'stable';

    // ── Coding performance ────────────────────────────────────
    const codingLanguages = (codingProgress || []).map((cp: any) => ({
      name:   cp.language,
      xp:     cp.totalXP || 0,
      week:   cp.currentWeek || 1,
      streak: cp.currentStreak || 0,
    }));
    const codingPerformance: CodingPerformance = {
      totalLanguages: codingLanguages.length,
      languages:      codingLanguages,
      totalCodingXP:  codingLanguages.reduce((s, l) => s + l.xp, 0),
      avgWeekReached: codingLanguages.length > 0
        ? Math.round(codingLanguages.reduce((s, l) => s + l.week, 0) / codingLanguages.length)
        : 0,
      recentSessions: thisWeek.codingSessions,
    };

    // ── Focus detection ───────────────────────────────────────
    const lastStudyDate   = profile.lastStudyDate || null;
    const daysSinceActive = lastStudyDate
      ? Math.floor((now.getTime() - new Date(lastStudyDate).getTime()) / 86400000)
      : 999;

    const focusLevel: 'high' | 'medium' | 'low' | 'absent' =
      thisWeek.activeDays >= 5 ? 'high'
      : thisWeek.activeDays >= 3 ? 'medium'
      : thisWeek.activeDays >= 1 ? 'low' : 'absent';

    const focusDropDetected = daysSinceActive >= 3 || (lastWeek.activeDays > thisWeek.activeDays + 2);

    // ── Persistent weak topics (weak for 14+ days) ────────────
    const fourteenDaysAgo  = new Date(now.getTime() - 14 * 86400000);
    const persistentWeak   = topicMastery
      .filter((t: any) => t.isWeak && t.lastAttemptedAt && new Date(t.lastAttemptedAt) < fourteenDaysAgo)
      .map((t: any) => t.topic);

    // ── Active learning path ──────────────────────────────────
    let activePathSummary = null;
    if (activePath) {
      const endDate  = new Date(activePath.endDate);
      const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / 86400000));
      activePathSummary = {
        title:    activePath.title,
        progress: activePath.progressPercent || 0,
        daysLeft,
      };
    }

    // ── Consistency score ─────────────────────────────────────
    const consistencyScore = Math.round((thisWeek.activeDays / 7) * 100);

    return {
      userId,
      capturedAt:         now.toISOString(),
      overallMastery:     profile.overallMasteryScore || 0,
      progressScore:      0,  // filled by progressScoreCalculator
      streak:             profile.currentStreak || 0,
      totalStudyDays:     profile.totalStudyDays || 0,
      learnerCategory:    profile.learnerCategory || 'self',
      learningSpeed:      profile.learningSpeed || 'medium',
      subjectPerformance,
      bestSubject,
      worstSubject,
      overallQuizAccuracy: overallQuizAcc,
      totalQuizzesTaken:   (profile.quizHistory || []).length,
      recentQuizScores,
      quizTrend,
      codingPerformance,
      isCodingLearner:    profile.learnerCategory === 'coding',
      weekly:             { thisWeek, lastWeek, deltas: { minutes: deltaMinutes, quizzes: thisWeek.quizzesCompleted - lastWeek.quizzesCompleted, questions: thisWeek.questionsAsked - lastWeek.questionsAsked, xp: thisWeek.xpEarned - lastWeek.xpEarned }, trend: weeklyTrend },
      avgDailyMins:       thisWeek.activeDays > 0 ? Math.round(thisWeek.minutesStudied / thisWeek.activeDays) : 0,
      consistencyScore,
      activePath:         activePathSummary,
      focusLevel,
      daysSinceActive,
      focusDropDetected,
      recentMistakes:     profile.recentMistakes || [],
      persistentWeakTopics: persistentWeak,
    };
  } catch (err: any) {
    logger.error(`[PerformanceTracker] capturePerformance: ${err.message}`);
    return null;
  }
}