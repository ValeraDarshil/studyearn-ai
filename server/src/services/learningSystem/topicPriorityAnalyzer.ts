/**
 * AI Study OS — Topic Priority Analyzer (Stage 3)
 * ─────────────────────────────────────────────────────────────
 * Decides which topics the student MUST study first — right now.
 *
 * Priority algorithm combines 5 signals:
 *   1. Mastery level      (lower = higher priority)
 *   2. Trend direction    (declining = urgent)
 *   3. Recency            (not studied recently = needs attention)
 *   4. Attempt count      (never tried = must start)
 *   5. Quiz failure rate  (failed multiple times = critical)
 *
 * Output: ranked list with urgency scores + action labels
 *
 * Unlike aiBrain/topicAnalyzer.ts (which only classifies),
 * this file assigns PRIORITY SCORES and generates
 * learner-type-specific ACTION PLANS for each topic.
 */

import { StudentProfile }  from '../../models/StudentProfile.model.js';
import { logger }          from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export type Urgency = 'critical' | 'high' | 'medium' | 'low';
export type LearnerCategory = 'school' | 'coding' | 'college' | 'self';

export interface PrioritizedTopic {
  rank:          number;        // 1 = most urgent
  topic:         string;
  subject:       string;
  mastery:       number;        // 0–100
  urgencyScore:  number;        // 0–100 computed score
  urgency:       Urgency;
  trend:         'improving' | 'declining' | 'stable';
  daysSinceStudied: number | null;
  totalAttempts: number;
  actionPlan:    string;        // specific thing to do today
  estimatedMins: number;        // how long to spend
  reason:        string;        // why this is prioritized
}

export interface PriorityReport {
  userId:         string;
  learnerCategory:LearnerCategory;
  prioritizedTopics: PrioritizedTopic[];
  topUrgentTopic: PrioritizedTopic | null;
  subjectWeaknesses: { subject: string; avgMastery: number; topicCount: number }[];
  totalTopics:    number;
  analyzedAt:     string;
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — analyzePriorities
// ─────────────────────────────────────────────────────────────
export async function analyzePriorities(userId: string): Promise<PriorityReport | null> {
  try {
    const profile = await StudentProfile.findOne({ userId })
      .select('topicMastery learnerCategory quizHistory dailyLogs')
      .lean() as any;

    if (!profile) return null;

    const mastery: any[] = profile.topicMastery || [];
    const category: LearnerCategory = profile.learnerCategory || 'self';
    const today = new Date(Date.now() + 5.5 * 60 * 60 * 1000);

    // ── Score every tracked topic ─────────────────────────
    const scored: PrioritizedTopic[] = mastery.map((t, i) => {
      const daysSince = t.lastAttemptedAt
        ? Math.floor((today.getTime() - new Date(t.lastAttemptedAt).getTime()) / 86400000)
        : null;

      // Priority score formula (0–100):
      //  mastery component:  lower mastery = higher score (max 40pts)
      //  trend component:    declining +25, stable +10, improving +0
      //  recency component:  not studied in 7+ days +15, 3–7 days +8
      //  attempts component: 0 attempts +10, 1–2 attempts +5
      //  quiz failure bonus: if >50% quiz fails on this topic +10
      const masteryPts  = Math.round((1 - t.masteryLevel / 100) * 40);
      const trendPts    = t.trend === 'declining' ? 25 : t.trend === 'stable' ? 10 : 0;
      const recencyPts  = daysSince === null ? 15
        : daysSince >= 7 ? 15 : daysSince >= 3 ? 8 : 0;
      const attemptPts  = t.totalAttempts === 0 ? 10 : t.totalAttempts <= 2 ? 5 : 0;

      // Quiz failure rate for this topic
      const topicQuizzes = (profile.quizHistory || []).filter((q: any) => q.topic === t.topic);
      const failRate = topicQuizzes.length > 0
        ? topicQuizzes.filter((q: any) => q.score < 60).length / topicQuizzes.length
        : 0;
      const quizPts = failRate > 0.5 ? 10 : 0;

      const urgencyScore = Math.min(100, masteryPts + trendPts + recencyPts + attemptPts + quizPts);

      const urgency: Urgency = urgencyScore >= 75 ? 'critical'
        : urgencyScore >= 50 ? 'high'
        : urgencyScore >= 25 ? 'medium' : 'low';

      const estimatedMins = urgency === 'critical' ? 30
        : urgency === 'high' ? 25
        : urgency === 'medium' ? 20 : 15;

      return {
        rank:            i + 1, // will be re-ranked below
        topic:           t.topic,
        subject:         t.subject,
        mastery:         t.masteryLevel,
        urgencyScore,
        urgency,
        trend:           t.trend,
        daysSinceStudied: daysSince,
        totalAttempts:   t.totalAttempts,
        actionPlan:      buildActionPlan(t.topic, t.subject, category, urgency, t.masteryLevel),
        estimatedMins,
        reason:          buildReason(t, daysSince, failRate),
      };
    });

    // ── Sort by urgency score descending ─────────────────
    scored.sort((a, b) => b.urgencyScore - a.urgencyScore);
    scored.forEach((t, i) => t.rank = i + 1);

    // ── Subject weakness map ──────────────────────────────
    const subjectMap: Record<string, { total: number; count: number }> = {};
    for (const t of mastery) {
      if (!subjectMap[t.subject]) subjectMap[t.subject] = { total: 0, count: 0 };
      subjectMap[t.subject].total += t.masteryLevel;
      subjectMap[t.subject].count += 1;
    }
    const subjectWeaknesses = Object.entries(subjectMap)
      .map(([subject, v]) => ({
        subject,
        avgMastery: Math.round(v.total / v.count),
        topicCount: v.count,
      }))
      .sort((a, b) => a.avgMastery - b.avgMastery);

    return {
      userId,
      learnerCategory:   category,
      prioritizedTopics: scored,
      topUrgentTopic:    scored[0] || null,
      subjectWeaknesses,
      totalTopics:       mastery.length,
      analyzedAt:        today.toISOString(),
    };
  } catch (err: any) {
    logger.error(`[TopicPriorityAnalyzer] analyzePriorities: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// getTopN — get top N priority topics (quick access)
// ─────────────────────────────────────────────────────────────
export async function getTopNPriorityTopics(
  userId: string,
  n = 3,
): Promise<PrioritizedTopic[]> {
  const report = await analyzePriorities(userId);
  return report?.prioritizedTopics.slice(0, n) || [];
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function buildActionPlan(
  topic:    string,
  subject:  string,
  category: LearnerCategory,
  urgency:  Urgency,
  mastery:  number,
): string {
  if (category === 'coding') {
    if (urgency === 'critical') return `Write 3 code examples using ${topic} from scratch — no copying.`;
    if (urgency === 'high')     return `Solve 2 coding problems that require ${topic}.`;
    return `Review ${topic} syntax and write 1 small program.`;
  }
  if (category === 'school') {
    if (urgency === 'critical') return `Open your ${subject} textbook — revise ${topic} basics and solve 5 questions.`;
    if (urgency === 'high')     return `Practice 3 ${topic} problems and check your answers.`;
    return `Do a 10-minute quick revision of ${topic} key formulas.`;
  }
  if (category === 'college') {
    if (urgency === 'critical') return `Study ${topic} theory + solve 2 previous-year exam questions on this.`;
    if (urgency === 'high')     return `Solve advanced problems on ${topic} — aim for 80%+ accuracy.`;
    return `Review ${topic} notes and attempt 1 standard problem.`;
  }
  // self
  if (urgency === 'critical') return `Dedicate 30 min to ${topic} — use any resource and practice.`;
  return `Spend 20 min reviewing ${topic} and test yourself with a quick quiz.`;
}

function buildReason(t: any, daysSince: number | null, failRate: number): string {
  const parts: string[] = [];
  if (t.masteryLevel < 30)  parts.push(`mastery is only ${t.masteryLevel}%`);
  if (t.trend === 'declining') parts.push(`performance is declining`);
  if (daysSince !== null && daysSince >= 7) parts.push(`not studied in ${daysSince} days`);
  if (t.totalAttempts === 0) parts.push(`never attempted before`);
  if (failRate > 0.5) parts.push(`failed ${Math.round(failRate * 100)}% of quizzes on this topic`);
  return parts.length > 0
    ? `Priority because: ${parts.join(', ')}.`
    : `Steady practice needed to maintain ${t.topic}.`;
}