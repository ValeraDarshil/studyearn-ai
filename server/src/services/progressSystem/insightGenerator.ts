/**
 * AI Study OS — Insight Generator (Stage 4)
 * ─────────────────────────────────────────────────────────────
 * Converts raw performance data + trend analysis into
 * HUMAN-LIKE, MOTIVATIONAL AI insights.
 *
 * This is what makes Stage 4 feel like a real AI coach —
 * not just numbers but meaningful, personal statements.
 *
 * Input: PerformanceSnapshot + TrendReport
 * Output: Array of InsightCards (shown on dashboard)
 *
 * Example insights:
 *   "🎯 You solve coding problems 20% faster this week!"
 *   "⚠️  Physics has been your weak spot for 2 weeks"
 *   "🔥 5-day streak! You're building real momentum"
 *   "📈 Math improved 18% — your hard work is paying off"
 *   "💡 You haven't revised Loops in 10 days — quick review needed"
 *
 * Insight priority system ensures the most important
 * insights always appear first on the dashboard.
 */

import { PerformanceSnapshot } from './performanceTracker.js';
import { TrendReport }         from './learningTrendAnalyzer.js';
import { ProgressScore }       from './progressScoreCalculator.js';
import { logger }              from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export type InsightType =
  | 'achievement'    // positive milestone
  | 'improvement'    // measurable improvement
  | 'warning'        // something needs attention
  | 'streak'         // streak-related
  | 'focus'          // focus/activity related
  | 'coding'         // coding-specific
  | 'quiz'           // quiz performance
  | 'tip'            // actionable learning tip
  | 'comeback';      // returning after break

export type InsightPriority = 'critical' | 'high' | 'medium' | 'low';

export interface InsightCard {
  id:         string;
  type:       InsightType;
  priority:   InsightPriority;
  icon:       string;
  title:      string;           // short (4–6 words)
  message:    string;           // 1–2 sentences, human-like
  action:     string | null;    // optional CTA
  topic:      string | null;    // related topic if any
  subject:    string | null;
  metric:     string | null;    // e.g. "+18%", "5 days", "82/100"
  isRead:     boolean;
  createdAt:  string;
}

export interface InsightBundle {
  cards:          InsightCard[];
  primaryInsight: InsightCard;  // most important one
  totalCount:     number;
  unreadCount:    number;
  focusAlert:     boolean;      // true if student needs urgent attention
  generatedAt:    string;
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — generateInsights
// ─────────────────────────────────────────────────────────────
export function generateInsights(
  snap:   PerformanceSnapshot,
  trends: TrendReport,
  score:  ProgressScore,
): InsightBundle {
  const cards: InsightCard[] = [];
  const now = new Date().toISOString();

  // ── 1. Streak insights ────────────────────────────────────
  if (snap.streak >= 30) {
    cards.push(mkInsight('streak', 'achievement', 'critical',
      '🏆', `${snap.streak}-Day Streak Legend!`,
      `You've studied for ${snap.streak} days straight. You're in an elite group of learners — keep going!`,
      null, null, null, `${snap.streak} days`));
  } else if (snap.streak >= 7) {
    cards.push(mkInsight('streak', 'achievement', 'high',
      '🔥', `${snap.streak}-Day Streak!`,
      `${snap.streak} days of consistent learning. Your brain is building strong memory pathways.`,
      null, null, null, `${snap.streak} days`));
  } else if (snap.streak === 0 && snap.daysSinceActive > 0) {
    cards.push(mkInsight('focus', 'warning', 'high',
      '⚡', 'Start Your Streak Today',
      `You haven't studied in ${snap.daysSinceActive} day(s). Even 15 minutes today restarts your momentum.`,
      'Study 15 min now', null, null, null));
  }

  // ── 2. Focus drop detection ───────────────────────────────
  if (snap.focusDropDetected && snap.daysSinceActive >= 3) {
    cards.push(mkInsight('focus', 'warning', 'critical',
      '📉', 'Your Focus Dropped',
      `You've been away for ${snap.daysSinceActive} days. A quick comeback session will get you back on track.`,
      'Start a 15-min session', null, null, `${snap.daysSinceActive} days`));
  }

  // ── 3. Top subject improvement ────────────────────────────
  if (trends.topImprovement) {
    const t = trends.topImprovement;
    const mastery = snap.subjectPerformance.find(s => s.subject === t.subject)?.avgMastery;
    cards.push(mkInsight('improvement', 'improvement', 'high',
      '📈', `${t.subject} Is Improving!`,
      t.statement,
      null, null, t.subject, mastery ? `${mastery}%` : null));
  }

  // ── 4. Top subject decline ────────────────────────────────
  if (trends.topDecline) {
    const t = trends.topDecline;
    const sp = snap.subjectPerformance.find(s => s.subject === t.subject);
    cards.push(mkInsight('warning', 'warning', 'high',
      '⚠️', `${t.subject} Needs Attention`,
      t.statement,
      `Practice ${t.subject}`, sp?.weakTopics[0] || null, t.subject, null));
  }

  // ── 5. Persistent weak topics ─────────────────────────────
  if (snap.persistentWeakTopics.length > 0) {
    const topic = snap.persistentWeakTopics[0];
    cards.push(mkInsight('warning', 'warning', 'critical',
      '🚨', `${topic} Stuck at Weak Level`,
      `${topic} has been weak for over 2 weeks. One focused session can change this — tackle it today.`,
      `Study ${topic} now`, topic, null, '14+ days weak'));
  }

  // ── 6. Quiz performance ───────────────────────────────────
  if (snap.overallQuizAccuracy >= 80 && snap.totalQuizzesTaken >= 3) {
    cards.push(mkInsight('quiz', 'achievement', 'medium',
      '🎯', 'Strong Quiz Performance!',
      `Your quiz accuracy is at ${snap.overallQuizAccuracy}% — you're retaining what you study.`,
      null, null, null, `${snap.overallQuizAccuracy}%`));
  } else if (snap.overallQuizAccuracy < 55 && snap.totalQuizzesTaken >= 3) {
    cards.push(mkInsight('quiz', 'warning', 'high',
      '📝', 'Quiz Accuracy Needs Work',
      `At ${snap.overallQuizAccuracy}% accuracy, you're missing key concepts. Review mistakes after each quiz.`,
      'Review quiz mistakes', null, null, `${snap.overallQuizAccuracy}%`));
  }

  // ── 7. Coding performance ─────────────────────────────────
  if (snap.codingPerformance.recentSessions >= 4) {
    cards.push(mkInsight('coding', 'improvement', 'medium',
      '💻', 'Coding Speed Growing!',
      `${snap.codingPerformance.recentSessions} coding sessions this week — you're building problem-solving instinct.`,
      null, null, 'Programming', `${snap.codingPerformance.recentSessions} sessions`));
  } else if (snap.isCodingLearner && snap.codingPerformance.recentSessions === 0) {
    cards.push(mkInsight('coding', 'tip', 'high',
      '💡', 'No Coding This Week',
      `You're a coding learner but haven't coded this week. Daily practice is the fastest way to improve.`,
      'Open CodeLearn', null, 'Programming', null));
  }

  // ── 8. Weekly improvement vs last week ────────────────────
  const { deltas, trend } = snap.weekly;
  if (deltas.minutes >= 30 && trend === 'improving') {
    cards.push(mkInsight('improvement', 'achievement', 'medium',
      '⏱️', 'More Study Time This Week!',
      `You studied ${deltas.minutes} more minutes than last week. More time = better results.`,
      null, null, null, `+${deltas.minutes} min`));
  } else if (deltas.minutes <= -30 && trend === 'declining') {
    cards.push(mkInsight('focus', 'warning', 'medium',
      '📉', 'Study Time Dropped',
      `You studied ${Math.abs(deltas.minutes)} fewer minutes than last week. Try to get back to your previous pace.`,
      null, null, null, `${deltas.minutes} min`));
  }

  // ── 9. Progress score insight ─────────────────────────────
  if (score.total >= 80) {
    cards.push(mkInsight('achievement', 'achievement', 'medium',
      '🏅', `Learning Score: ${score.total}/100`,
      `${score.message}`,
      null, null, null, `${score.total}/100`));
  } else if (score.total < 40) {
    cards.push(mkInsight('tip', 'warning', 'high',
      '💪', `Score: ${score.total}/100 — Let's Improve`,
      `Your learning score needs a boost. ${score.message}`,
      'View improvement tips', null, null, `${score.total}/100`));
  }

  // ── 10. Returning after break ─────────────────────────────
  if (trends.isReturningAfterBreak) {
    cards.push(mkInsight('comeback', 'achievement', 'high',
      '👋', 'Welcome Back!',
      `Great to see you back after a break! Start with a light review session to ease back in.`,
      'Start easy review', snap.recentMistakes[0] || null, null, null));
  }

  // ── Sort by priority ──────────────────────────────────────
  const priorityOrder: Record<InsightPriority, number> = {
    critical: 0, high: 1, medium: 2, low: 3,
  };
  cards.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Limit to 8 cards max
  const finalCards = cards.slice(0, 8);

  return {
    cards:          finalCards,
    primaryInsight: finalCards[0] || mkDefaultInsight(),
    totalCount:     finalCards.length,
    unreadCount:    finalCards.length,
    focusAlert:     snap.focusDropDetected,
    generatedAt:    now,
  };
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function mkInsight(
  type: InsightType, category: InsightType, priority: InsightPriority,
  icon: string, title: string, message: string,
  action: string | null, topic: string | null,
  subject: string | null, metric: string | null,
): InsightCard {
  return {
    id:        Math.random().toString(36).substring(2, 10),
    type,
    priority,
    icon,
    title,
    message,
    action,
    topic,
    subject,
    metric,
    isRead:    false,
    createdAt: new Date().toISOString(),
  };
}

function mkDefaultInsight(): InsightCard {
  return mkInsight('tip', 'tip', 'medium', '📚',
    'Start Your Learning Journey',
    'Complete your first quiz or ask the AI Tutor a question to get personalized insights.',
    'Take a quiz', null, null, null);
}