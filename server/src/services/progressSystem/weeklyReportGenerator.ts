/**
 * AI Study OS — Weekly Report Generator (Stage 4)
 * ─────────────────────────────────────────────────────────────
 * Generates a COMPLETE weekly progress report that combines:
 *   - Stage 1 (AI Brain)    → mastery + topic data
 *   - Stage 3 (Learning)    → plan completion
 *   - Stage 4 (Progress)    → score + trends + insights
 *   - AI (Groq/OpenRouter)  → narrative headline + summary
 *
 * This EXTENDS (not duplicates) the existing progressIntelService
 * generateWeeklyReport() — it adds:
 *   ✅ Progress Score (new)
 *   ✅ Trend analysis per subject (new)
 *   ✅ Focus detection (new)
 *   ✅ Coding performance section (new)
 *   ✅ Difficulty evolution data (new)
 *   ✅ Next week recommendations from Stage 3 (new)
 *
 * The report is saved to ProgressReport model (existing),
 * so the existing /api/brain/weekly-report endpoint gets
 * the enriched data automatically.
 */

import { PerformanceSnapshot }           from './performanceTracker.js';
import { TrendReport }                   from './learningTrendAnalyzer.js';
import { ProgressScore }                 from './progressScoreCalculator.js';
import { InsightBundle }                 from './insightGenerator.js';
import { ProgressReport }               from '../../models/ProgressReport.model.js';
import { getTopNPriorityTopics }        from '../learningSystem/topicPriorityAnalyzer.js';
import { logger }                        from '../../utils/logger.js';

// ── AI config ─────────────────────────────────────────────────
const GROQ_KEY     = process.env.GROQ_API_KEY || '';
const AI_TIMEOUT   = 20_000;

async function callAI(prompt: string): Promise<string> {
  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), AI_TIMEOUT);
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model:       'llama-3.3-70b-versatile',
        temperature: 0.6,
        max_tokens:  400,
        messages: [
          { role: 'system', content: 'You are an AI learning coach writing a weekly report for an Indian student. Be encouraging, specific, and concise. Max 2 sentences.' },
          { role: 'user',   content: prompt },
        ],
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  } catch { return ''; }
  finally { clearTimeout(timer); }
}

// ── Types ──────────────────────────────────────────────────────
export interface WeeklyReportData {
  // Meta
  weekKey:        string;
  period:         string;         // "March 22 – March 28"
  learnerCategory:string;

  // Score
  progressScore:  number;
  scoreTier:      string;
  scoreIcon:      string;

  // Study time
  totalStudyHours:number;
  avgDailyMins:   number;
  activeDays:     number;

  // Performance
  totalQuizzes:   number;
  quizAccuracy:   number;
  totalXP:        number;
  questionsAsked: number;

  // Subjects
  bestSubject:    string | null;
  worstSubject:   string | null;
  subjectSummary: { subject: string; change: string; status: string }[];

  // Coding
  codingSessions: number;
  codingXP:       number;

  // AI narrative
  headline:       string;
  summaryText:    string;
  suggestions:    string[];

  // Insights
  topInsights:    { icon: string; message: string }[];

  // Next week
  nextWeekFocus:  { topic: string; subject: string; action: string }[];

  // Focus
  focusLevel:     string;
  streak:         number;
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — generateEnrichedWeeklyReport
// ─────────────────────────────────────────────────────────────
export async function generateEnrichedWeeklyReport(
  userId:   string,
  snap:     PerformanceSnapshot,
  trends:   TrendReport,
  score:    ProgressScore,
  insights: InsightBundle,
): Promise<WeeklyReportData | null> {
  try {
    const weekKey = getWeekKey();

    // Check if already generated this week
    const existing = await ProgressReport.findOne({ userId, period: 'weekly', periodKey: weekKey }).lean();
    if (existing) {
      logger.info(`[WeeklyReport] Report already exists for ${userId} week ${weekKey}`);
      return buildReportData(weekKey, snap, trends, score, insights, [], '', '');
    }

    // Get next week priority topics (connects Stage 3)
    const nextTopics = await getTopNPriorityTopics(userId, 3);

    // AI-generated narrative
    const aiData = {
      category:     snap.learnerCategory,
      activeDays:   snap.weekly.thisWeek.activeDays,
      studyMins:    snap.weekly.thisWeek.minutesStudied,
      quizAccuracy: snap.overallQuizAccuracy,
      score:        score.total,
      scoreTier:    score.tierLabel,
      bestSubject:  snap.bestSubject,
      worstSubject: snap.worstSubject,
      streak:       snap.streak,
      improving:    trends.topImprovement?.subject,
      declining:    trends.topDecline?.subject,
      focusLevel:   snap.focusLevel,
    };

    let headline    = '';
    let summaryText = '';
    let suggestions: string[] = [];

    try {
      [headline, summaryText] = await Promise.all([
        callAI(`Write an encouraging 8-word headline for this student's weekly report: ${JSON.stringify(aiData)}`),
        callAI(`Write 2 encouraging sentences summarising this student's week: ${JSON.stringify(aiData)}`),
      ]);
      const suggestText = await callAI(
        `Give 3 specific improvement actions (one per line, no numbering, start with action verb) for next week: ${JSON.stringify(aiData)}`
      );
      suggestions = suggestText.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 3);
    } catch {
      headline    = score.total >= 70 ? 'Great week — keep pushing forward!' : 'Room to grow — next week is your chance!';
      summaryText = `You studied for ${Math.round(snap.weekly.thisWeek.minutesStudied / 60 * 10) / 10} hours and completed ${snap.weekly.thisWeek.quizzesCompleted} quizzes this week.`;
      if (snap.worstSubject) suggestions.push(`Dedicate extra time to ${snap.worstSubject} next week.`);
      if (snap.streak > 0)   suggestions.push(`Maintain your ${snap.streak}-day streak by studying every day.`);
      suggestions.push('Take at least 3 quizzes next week to sharpen your recall.');
    }

    // Save enriched report to DB (extends existing ProgressReport model)
    await ProgressReport.create({
      userId,
      period:    'weekly',
      periodKey: weekKey,
      headline,
      summaryText,
      totalStudyMinutes:    snap.weekly.thisWeek.minutesStudied,
      totalQuestionsAsked:  snap.weekly.thisWeek.questionsAsked,
      totalQuizzesTaken:    snap.weekly.thisWeek.quizzesCompleted,
      totalXPEarned:        snap.weekly.thisWeek.xpEarned,
      avgDailyMinutes:      snap.avgDailyMins,
      consistencyScore:     snap.consistencyScore,
      streakAtEnd:          snap.streak,
      maxStreakThisPeriod:  snap.streak,
      subjectBreakdowns:    snap.subjectPerformance.slice(0, 5).map(sp => ({
        subject:          sp.subject,
        masteryStart:     Math.max(0, sp.avgMastery - (sp.trend === 'improving' ? 5 : 0)),
        masteryEnd:       sp.avgMastery,
        change:           sp.trend === 'improving' ? 5 : sp.trend === 'declining' ? -5 : 0,
        quizzesTaken:     sp.quizCount,
        avgScore:         sp.quizAccuracy,
        timeSpentMinutes: 0,
        topicsCovered:    sp.strongTopics.slice(0, 3),
        weakTopics:       sp.weakTopics.slice(0, 2),
      })),
      alerts: insights.cards.slice(0, 5).map(c => ({
        type:        c.type === 'achievement' ? 'improvement' : c.type === 'warning' ? 'warning' : 'improvement',
        title:       c.title,
        description: c.message,
        topic:       c.topic || undefined,
        subject:     c.subject || undefined,
        generatedAt: new Date(),
        isRead:      false,
      })),
      suggestions,
      overallScoreStart: Math.max(0, score.total - 5),
      overallScoreEnd:   score.total,
      overallChange:     5,
      generatedByAI:     true,
    });

    logger.info(`[WeeklyReport] Generated enriched report for ${userId}: ${weekKey} | score=${score.total}`);
    return buildReportData(weekKey, snap, trends, score, insights, nextTopics, headline, summaryText, suggestions);
  } catch (err: any) {
    logger.error(`[WeeklyReport] generateEnrichedWeeklyReport: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// buildReportData — assemble the output object
// ─────────────────────────────────────────────────────────────
function buildReportData(
  weekKey:      string,
  snap:         PerformanceSnapshot,
  trends:       TrendReport,
  score:        ProgressScore,
  insights:     InsightBundle,
  nextTopics:   any[],
  headline:     string,
  summaryText:  string,
  suggestions?: string[],
): WeeklyReportData {
  const { thisWeek } = snap.weekly;
  const now = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const weekStart = new Date(now.getTime() - 6 * 86400000);
  const period = `${weekStart.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} – ${now.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`;

  return {
    weekKey,
    period,
    learnerCategory:  snap.learnerCategory,
    progressScore:    score.total,
    scoreTier:        score.tierLabel,
    scoreIcon:        score.tierIcon,
    totalStudyHours:  Math.round(thisWeek.minutesStudied / 60 * 10) / 10,
    avgDailyMins:     snap.avgDailyMins,
    activeDays:       thisWeek.activeDays,
    totalQuizzes:     thisWeek.quizzesCompleted,
    quizAccuracy:     snap.overallQuizAccuracy,
    totalXP:          thisWeek.xpEarned,
    questionsAsked:   thisWeek.questionsAsked,
    bestSubject:      snap.bestSubject,
    worstSubject:     snap.worstSubject,
    subjectSummary:   snap.subjectPerformance.slice(0, 5).map(sp => ({
      subject: sp.subject,
      change:  sp.trend === 'improving' ? `+${5}%` : sp.trend === 'declining' ? `-${5}%` : '0%',
      status:  sp.trend,
    })),
    codingSessions:   thisWeek.codingSessions,
    codingXP:         snap.codingPerformance.totalCodingXP,
    headline:         headline || (score.total >= 70 ? 'Strong week — keep the momentum!' : 'Keep going — progress takes time!'),
    summaryText:      summaryText || `You studied ${Math.round(thisWeek.minutesStudied / 60 * 10) / 10} hours and completed ${thisWeek.quizzesCompleted} quizzes.`,
    suggestions:      suggestions || [],
    topInsights:      insights.cards.slice(0, 4).map(c => ({ icon: c.icon, message: c.message })),
    nextWeekFocus:    nextTopics.map(t => ({
      topic:   t.topic,
      subject: t.subject,
      action:  t.actionPlan,
    })),
    focusLevel:       snap.focusLevel,
    streak:           snap.streak,
  };
}

function getWeekKey(): string {
  const d    = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
}