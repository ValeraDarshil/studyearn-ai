/**
 * AI Study OS — Progress Intelligence Service
 * ─────────────────────────────────────────────────────────────
 * Automatically analyzes student data and generates insights.
 *
 * Examples of generated insights:
 *   "Your focus dropped in the last 7 days"
 *   "Math performance improved by 18%"
 *   "You are improving in JavaScript"
 *   "Your coding speed increased"
 *   "Physics needs more practice"
 *
 * Runs:
 *   - Weekly report generation (cron or on-demand)
 *   - Real-time performance alerts after quiz/challenge
 *   - Streak milestone detection
 */

import { StudentProfile } from '../models/StudentProfile.model.js';
import { ProgressReport, IPerformanceAlert } from '../models/ProgressReport.model.js';
import { logger } from '../utils/logger.js';

// ── AI call for narrative generation ─────────────────────────
const GROQ_KEY = process.env.GROQ_API_KEY || '';
const AI_TIMEOUT_MS = 25_000;

async function callAIText(prompt: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model:       'llama-3.3-70b-versatile',
        temperature: 0.5,
        max_tokens:  512,
        messages: [
          { role: 'system', content: 'You are an AI learning coach. Be concise, encouraging, and specific. Max 3 sentences.' },
          { role: 'user',   content: prompt },
        ],
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  } finally {
    clearTimeout(timer);
  }
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function getTodayIST(): string {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().split('T')[0];
}

function getWeekKey(date?: Date): string {
  const d = date || new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function getLastNDates(n: number): string[] {
  const dates: string[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(Date.now() - i * 86400000 + 5.5 * 60 * 60 * 1000);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

// ─────────────────────────────────────────────────────────────
// 1. GENERATE WEEKLY REPORT
//    Call this every Monday or on demand.
//    Analyzes last 7 days and produces insights + alerts.
// ─────────────────────────────────────────────────────────────
export async function generateWeeklyReport(userId: string): Promise<any> {
  try {
    const profile = await StudentProfile.findOne({ userId }).lean();
    if (!profile) return null;

    const weekKey   = getWeekKey();
    const last7days = getLastNDates(7);
    const logs      = (profile.dailyLogs as any[]).filter(l => last7days.includes(l.date));

    // Check if report already generated this week
    const existing = await ProgressReport.findOne({ userId, period: 'weekly', periodKey: weekKey });
    if (existing) return existing;

    // ── Compute metrics ───────────────────────────────────────
    const totalMinutes   = logs.reduce((s, l) => s + l.minutesStudied, 0);
    const totalQuestions = logs.reduce((s, l) => s + l.questionsAsked, 0);
    const totalQuizzes   = logs.reduce((s, l) => s + l.quizzesCompleted, 0);
    const totalXP        = logs.reduce((s, l) => s + l.xpEarned, 0);
    const activeDays     = logs.filter(l => l.questionsAsked + l.quizzesCompleted > 0).length;
    const consistency    = Math.round((activeDays / 7) * 100);

    // ── Topic analysis ────────────────────────────────────────
    const mastery   = (profile.topicMastery as any[]);
    const improving = mastery.filter(t => t.trend === 'improving').map(t => t.topic);
    const declining = mastery.filter(t => t.trend === 'declining').map(t => t.topic);
    const weak      = mastery.filter(t => t.isWeak).map(t => t.topic);

    // ── Build performance alerts ──────────────────────────────
    const alerts: IPerformanceAlert[] = [];

    // Streak milestone
    const streak = (profile as any).currentStreak;
    if (streak >= 7) {
      alerts.push({
        type:        'milestone',
        title:       `🔥 ${streak}-Day Streak!`,
        description: `You've been studying consistently for ${streak} days. Keep it up!`,
        generatedAt: new Date(),
        isRead:      false,
      });
    }

    // Consistency alert
    if (consistency < 40) {
      alerts.push({
        type:        'warning',
        title:       'Your focus dropped this week',
        description: `You only studied on ${activeDays} out of 7 days. Try to study at least 20 minutes daily.`,
        generatedAt: new Date(),
        isRead:      false,
      });
    } else if (consistency >= 80) {
      alerts.push({
        type:        'improvement',
        title:       'Excellent consistency this week!',
        description: `You studied on ${activeDays} days this week. Your discipline is paying off.`,
        generatedAt: new Date(),
        isRead:      false,
      });
    }

    // Topic improvements
    for (const topic of improving.slice(0, 2)) {
      const entry = mastery.find((t: any) => t.topic === topic);
      alerts.push({
        type:          'improvement',
        title:         `You are improving in ${topic}`,
        description:   `Your mastery in ${topic} has been trending up. Keep practicing!`,
        topic,
        subject:       entry?.subject,
        changePercent: 10, // estimated
        generatedAt:   new Date(),
        isRead:        false,
      });
    }

    // Weak topic warnings
    for (const topic of weak.slice(0, 2)) {
      const entry = mastery.find((t: any) => t.topic === topic);
      alerts.push({
        type:        'decline',
        title:       `${topic} needs more practice`,
        description: `Your mastery in ${topic} is below 40%. Focus on this topic this week.`,
        topic,
        subject:     entry?.subject,
        generatedAt: new Date(),
        isRead:      false,
      });
    }

    // ── AI-generated headline ─────────────────────────────────
    let headline  = '';
    let summaryText = '';
    const suggestions: string[] = [];

    const promptData = {
      category:    (profile as any).learnerCategory,
      activeDays,
      consistency,
      totalMinutes,
      totalQuizzes,
      improving:   improving.slice(0, 3),
      weak:        weak.slice(0, 3),
      streak,
    };

    try {
      headline = await callAIText(
        `Generate a single encouraging headline (max 10 words) for this student's weekly summary: ${JSON.stringify(promptData)}`
      );
      summaryText = await callAIText(
        `Write a 2-sentence encouraging weekly summary for this learner: ${JSON.stringify(promptData)}`
      );
      const suggestionText = await callAIText(
        `Give 3 specific improvement suggestions (one per line, no numbering) for this learner: ${JSON.stringify(promptData)}`
      );
      suggestions.push(...suggestionText.split('\n').filter(s => s.trim()).slice(0, 3));
    } catch {
      headline    = activeDays >= 5 ? 'Great week — keep the momentum!' : 'Room to grow — let\'s make next week better!';
      summaryText = `You studied for ${totalMinutes} minutes and completed ${totalQuizzes} quizzes this week.`;
      if (weak.length > 0)      suggestions.push(`Focus more on ${weak[0]} this week.`);
      if (improving.length > 0) suggestions.push(`You are improving in ${improving[0]} — keep going!`);
      suggestions.push('Try to study for at least 20 minutes every day.');
    }

    // ── Save report ───────────────────────────────────────────
    const report = await ProgressReport.create({
      userId,
      period:    'weekly',
      periodKey: weekKey,

      headline,
      summaryText,

      totalStudyMinutes:    totalMinutes,
      totalQuestionsAsked:  totalQuestions,
      totalQuizzesTaken:    totalQuizzes,
      totalXPEarned:        totalXP,
      avgDailyMinutes:      Math.round(totalMinutes / 7),
      consistencyScore:     consistency,

      streakAtEnd:         streak,
      maxStreakThisPeriod: streak,

      subjectBreakdowns: mastery.slice(0, 5).map((t: any) => ({
        subject:          t.subject,
        masteryStart:     t.masteryLevel - (t.trend === 'improving' ? 5 : t.trend === 'declining' ? -5 : 0),
        masteryEnd:       t.masteryLevel,
        change:           t.trend === 'improving' ? 5 : t.trend === 'declining' ? -5 : 0,
        quizzesTaken:     t.totalAttempts,
        avgScore:         t.masteryLevel,
        timeSpentMinutes: 0,
        topicsCovered:    [t.topic],
        weakTopics:       t.isWeak ? [t.topic] : [],
      })),

      alerts,
      suggestions,

      overallScoreStart: Math.max(0, (profile as any).overallMasteryScore - 3),
      overallScoreEnd:   (profile as any).overallMasteryScore,
      overallChange:     3,

      generatedByAI: true,
    });

    logger.info(`[ProgressIntel] Weekly report generated for ${userId}: ${weekKey}`);
    return report;
  } catch (err: any) {
    logger.error(`[ProgressIntel] generateWeeklyReport: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 2. GET UNREAD ALERTS (for notification bell)
// ─────────────────────────────────────────────────────────────
export async function getUnreadAlerts(userId: string): Promise<IPerformanceAlert[]> {
  try {
    const reports = await ProgressReport.find({ userId })
      .sort({ generatedAt: -1 })
      .limit(4)
      .lean();

    const alerts: IPerformanceAlert[] = [];
    for (const report of reports) {
      for (const alert of (report.alerts as any[])) {
        if (!alert.isRead) alerts.push(alert);
      }
    }
    return alerts.slice(0, 10);
  } catch (err: any) {
    logger.error(`[ProgressIntel] getUnreadAlerts: ${err.message}`);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// 3. GET LATEST WEEKLY REPORT (for dashboard)
// ─────────────────────────────────────────────────────────────
export async function getLatestReport(userId: string, period: 'weekly' | 'monthly' = 'weekly') {
  try {
    return await ProgressReport.findOne({ userId, period })
      .sort({ generatedAt: -1 })
      .lean();
  } catch (err: any) {
    logger.error(`[ProgressIntel] getLatestReport: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 4. REAL-TIME ALERT AFTER QUIZ
//    Call after every quiz completion.
//    Returns instant feedback alert.
// ─────────────────────────────────────────────────────────────
export async function generateQuizAlert(
  userId: string,
  topic: string,
  subject: string,
  score: number,
  previousBestScore?: number
): Promise<IPerformanceAlert | null> {
  if (score >= 80) {
    return {
      type:          'improvement',
      title:         `Great job on ${topic}!`,
      description:   `You scored ${score}% on ${topic}. Your mastery is improving!`,
      topic,
      subject,
      changePercent: previousBestScore ? score - previousBestScore : undefined,
      generatedAt:   new Date(),
      isRead:        false,
    };
  }

  if (score < 40) {
    return {
      type:        'warning',
      title:       `${topic} needs more practice`,
      description: `You scored ${score}% on this quiz. Review the concepts and try again.`,
      topic,
      subject,
      generatedAt: new Date(),
      isRead:      false,
    };
  }

  return null;
}