/**
 * AI Study OS — Learning Trend Analyzer (Stage 4)
 * ─────────────────────────────────────────────────────────────
 * Detects PATTERNS in a student's learning data over time.
 *
 * Key patterns it finds:
 *   1. Subject trends    → Math improving, Physics declining
 *   2. Activity trends   → Focus dropping, comeback after absence
 *   3. Coding velocity   → Solving problems faster now
 *   4. Quiz patterns     → Accuracy trending up/down
 *   5. Consistency drift → Studying less/more than before
 *   6. Topic breakthrough→ Mastery jumped from weak to strong
 *
 * Output is human-readable trend statements that go directly
 * into insights and reports — NOT raw numbers.
 *
 * Example outputs:
 *   "Math improved 18% this week"
 *   "Your focus dropped in the last 3 days"
 *   "Coding speed is increasing — you're solving faster"
 *   "Physics has been weak for 2 weeks — needs attention"
 */

import { PerformanceSnapshot } from './performanceTracker.js';

// ── Types ──────────────────────────────────────────────────────
export type TrendDirection = 'strongly_up' | 'up' | 'stable' | 'down' | 'strongly_down';

export interface SubjectTrend {
  subject:      string;
  direction:    TrendDirection;
  changeLabel:  string;           // "improved 18%", "dropped slightly"
  statement:    string;           // full human sentence
  isBreakthrough: boolean;        // went from weak to strong
  isAlert:      boolean;          // needs attention
}

export interface TrendReport {
  // Subject-level trends
  subjectTrends:       SubjectTrend[];
  topImprovement:      SubjectTrend | null;
  topDecline:          SubjectTrend | null;

  // Activity/focus trends
  focusTrend:          string;    // human sentence about focus
  consistencyTrend:    string;
  codingTrend:         string | null;
  quizTrend:           string;

  // Engagement patterns
  isReturningAfterBreak: boolean;
  isOnMomentum:          boolean;
  isStrugglingFocus:     boolean;

  // All trend statements combined (for insight generator)
  allStatements:       string[];
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — analyzeTrends
// ─────────────────────────────────────────────────────────────
export function analyzeTrends(snap: PerformanceSnapshot): TrendReport {
  const subjectTrends = buildSubjectTrends(snap);
  const topImprovement = subjectTrends.filter(t => t.direction === 'up' || t.direction === 'strongly_up')[0] || null;
  const topDecline     = subjectTrends.filter(t => t.direction === 'down' || t.direction === 'strongly_down')[0] || null;

  const focusTrend       = buildFocusTrend(snap);
  const consistencyTrend = buildConsistencyTrend(snap);
  const codingTrend      = buildCodingTrend(snap);
  const quizTrend        = buildQuizTrend(snap);

  const isReturningAfterBreak = snap.daysSinceActive >= 3 && snap.weekly.thisWeek.activeDays > 0;
  const isOnMomentum          = snap.streak >= 5 && snap.weekly.trend === 'improving';
  const isStrugglingFocus     = snap.focusDropDetected || snap.focusLevel === 'absent' || snap.focusLevel === 'low';

  const allStatements: string[] = [
    ...subjectTrends.slice(0, 3).map(t => t.statement),
    focusTrend,
    consistencyTrend,
    quizTrend,
    codingTrend,
  ].filter((s): s is string => Boolean(s));

  return {
    subjectTrends,
    topImprovement,
    topDecline,
    focusTrend,
    consistencyTrend,
    codingTrend,
    quizTrend,
    isReturningAfterBreak,
    isOnMomentum,
    isStrugglingFocus,
    allStatements,
  };
}

// ─────────────────────────────────────────────────────────────
// BUILDERS
// ─────────────────────────────────────────────────────────────
function buildSubjectTrends(snap: PerformanceSnapshot): SubjectTrend[] {
  return snap.subjectPerformance.map(sp => {
    const direction = mapTrendDirection(sp.trend, sp.avgMastery);
    const changeLabel = buildChangeLabel(direction, sp.avgMastery);
    const isAlert = sp.weakTopics.length >= 2 || sp.trend === 'declining';
    const isBreakthrough = sp.strongTopics.length > 0 && sp.trend === 'improving';

    return {
      subject:     sp.subject,
      direction,
      changeLabel,
      statement:   buildSubjectStatement(sp.subject, direction, sp.avgMastery, sp.weakTopics, sp.quizAccuracy),
      isBreakthrough,
      isAlert,
    };
  }).sort((a, b) => {
    // Sort: improvements first, then declines, then stable
    const order: Record<TrendDirection, number> = {
      strongly_up: 0, up: 1, stable: 2, down: 3, strongly_down: 4,
    };
    return order[a.direction] - order[b.direction];
  });
}

function mapTrendDirection(trend: string, mastery: number): TrendDirection {
  if (trend === 'improving' && mastery >= 70) return 'strongly_up';
  if (trend === 'improving')                  return 'up';
  if (trend === 'declining' && mastery < 30)  return 'strongly_down';
  if (trend === 'declining')                  return 'down';
  return 'stable';
}

function buildChangeLabel(dir: TrendDirection, mastery: number): string {
  switch (dir) {
    case 'strongly_up':   return `improved significantly (${mastery}% mastery)`;
    case 'up':            return `improving (${mastery}% mastery)`;
    case 'stable':        return `stable at ${mastery}%`;
    case 'down':          return `declining (${mastery}% mastery)`;
    case 'strongly_down': return `dropped significantly — only ${mastery}%`;
  }
}

function buildSubjectStatement(
  subject: string, dir: TrendDirection, mastery: number,
  weakTopics: string[], quizAcc: number,
): string {
  switch (dir) {
    case 'strongly_up':
      return `${subject} performance is excellent at ${mastery}% mastery — you're mastering this subject.`;
    case 'up':
      return `${subject} is improving${quizAcc > 70 ? ` with ${quizAcc}% quiz accuracy` : ''} — keep the momentum going.`;
    case 'down':
      return weakTopics.length > 0
        ? `${subject} is declining — focus on ${weakTopics.slice(0, 2).join(' and ')} this week.`
        : `${subject} performance dropped slightly — revisit recent topics.`;
    case 'strongly_down':
      return `${subject} needs urgent attention — mastery is only ${mastery}%. Dedicate focused time this week.`;
    default:
      return `${subject} is stable at ${mastery}% — steady practice will push it higher.`;
  }
}

function buildFocusTrend(snap: PerformanceSnapshot): string {
  if (snap.daysSinceActive >= 5) {
    return `You've been away for ${snap.daysSinceActive} days — your focus needs a restart. Even a 15-min session today helps.`;
  }
  if (snap.daysSinceActive >= 3) {
    return `Your focus dropped in the last ${snap.daysSinceActive} days. Getting back to a daily habit will recover your momentum.`;
  }
  if (snap.focusLevel === 'high') {
    return `Your focus is excellent this week — ${snap.weekly.thisWeek.activeDays} active days shows strong commitment.`;
  }
  if (snap.focusLevel === 'medium') {
    return `Your focus is moderate this week. Try to add 1–2 more study sessions to maintain your streak.`;
  }
  if (snap.focusLevel === 'low') {
    return `You only had ${snap.weekly.thisWeek.activeDays} active day(s) this week — your focus is low. Let's change that today.`;
  }
  return `No activity detected this week. Start with just 10 minutes today to rebuild your learning habit.`;
}

function buildConsistencyTrend(snap: PerformanceSnapshot): string {
  const { thisWeek, lastWeek } = snap.weekly;
  const delta = thisWeek.activeDays - lastWeek.activeDays;

  if (snap.streak >= 14) {
    return `Incredible consistency — ${snap.streak}-day streak! You're in the top learners on this platform.`;
  }
  if (snap.streak >= 7) {
    return `${snap.streak}-day streak — your consistency is building strong learning habits.`;
  }
  if (delta >= 2) {
    return `You studied ${delta} more days this week than last week — your consistency is improving!`;
  }
  if (delta <= -2) {
    return `You studied ${Math.abs(delta)} fewer days than last week — try to maintain a steady daily habit.`;
  }
  if (snap.consistencyScore >= 70) {
    return `Good consistency this week — ${thisWeek.activeDays} out of 7 days active.`;
  }
  return `Aim to study at least 5 days a week. Currently at ${thisWeek.activeDays}/7 days.`;
}

function buildCodingTrend(snap: PerformanceSnapshot): string | null {
  if (!snap.isCodingLearner && snap.codingPerformance.totalLanguages === 0) return null;

  const { codingPerformance, weekly } = snap;
  if (weekly.thisWeek.codingSessions === 0) {
    return `No coding sessions this week — get back to practicing code daily.`;
  }
  if (weekly.thisWeek.codingSessions > weekly.lastWeek.codingSessions) {
    return `Your coding activity increased this week — ${weekly.thisWeek.codingSessions} sessions. You're building speed.`;
  }
  if (codingPerformance.totalCodingXP > 500) {
    return `Strong coding progress — ${codingPerformance.totalCodingXP} total XP earned across ${codingPerformance.totalLanguages} language(s).`;
  }
  return `Keep up the coding practice — ${weekly.thisWeek.codingSessions} session(s) this week.`;
}

function buildQuizTrend(snap: PerformanceSnapshot): string {
  const { quizTrend, overallQuizAccuracy, weekly } = snap;

  if (weekly.thisWeek.quizzesCompleted === 0) {
    return `No quizzes taken this week — quizzes are one of the best ways to strengthen your memory. Try one today!`;
  }
  if (quizTrend === 'improving') {
    return `Your quiz accuracy is improving — currently at ${overallQuizAccuracy}%. Great work!`;
  }
  if (quizTrend === 'declining') {
    return `Quiz accuracy dropped to ${overallQuizAccuracy}%. Focus on reviewing mistakes after each quiz.`;
  }
  if (overallQuizAccuracy >= 80) {
    return `Quiz accuracy is strong at ${overallQuizAccuracy}% — you're mastering the content well.`;
  }
  if (overallQuizAccuracy < 60) {
    return `Quiz accuracy is ${overallQuizAccuracy}% — below target. Spend more time on concept review before quizzing.`;
  }
  return `Quiz accuracy is stable at ${overallQuizAccuracy}%. Aim for 75%+ with consistent practice.`;
}