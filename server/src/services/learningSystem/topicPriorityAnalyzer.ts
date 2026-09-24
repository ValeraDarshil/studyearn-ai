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
  urgencyScore:  number;        // 0–100 computed score (how urgent, ignoring relevance)
  relevanceScore: number;       // 0–1 — LAYER 1: how much this subject is actually "yours"
  inScope:       boolean;       // LAYER 1: false = likely a one-off/curiosity topic, not your field
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

    // ── LAYER 1: Scope & Relevance Engine ──────────────────
    // WHY: without this, a topic tried once out of curiosity (a random
    // Physics question from a CS student) gets ranked by the exact same
    // rules as their actual field — both show up as "critical" the moment
    // mastery is 0%, with nothing distinguishing "this is your major" from
    // "you asked about this once." That's what made the priority list feel
    // directionless.
    //
    // A subject's relevance is derived from real engagement — its share of
    // the student's total practice attempts across every subject they've
    // touched — rather than asking them to declare a major up front (which
    // would need manual upkeep and wouldn't self-correct as their actual
    // focus shifts over a semester). Heavy, sustained engagement with
    // Programming naturally dominates; a single Physics attempt naturally
    // fades toward the background, without deleting or hiding the data.
    const subjectAttempts: Record<string, number> = {};
    let totalAttemptsAllSubjects = 0;
    for (const t of mastery) {
      const attempts = Number(t.totalAttempts) || 0;
      subjectAttempts[t.subject] = (subjectAttempts[t.subject] || 0) + attempts;
      totalAttemptsAllSubjects += attempts;
    }

    const RELEVANCE_FLOOR = 0.15;   // never fully erase a subject, just deprioritize it
    const IN_SCOPE_THRESHOLD = 0.3; // below this, flagged as likely one-off/exploratory

    function relevanceForSubject(subject: string): number {
      // Cold start: fewer than 5 total attempts anywhere isn't enough
      // signal to judge relevance yet — treat everything as equally
      // in-scope so a brand-new student doesn't get anything hidden.
      if (totalAttemptsAllSubjects < 5) return 1;
      const share = (subjectAttempts[subject] || 0) / totalAttemptsAllSubjects;
      // sqrt compresses the curve so a subject with genuine-but-modest
      // engagement isn't crushed as hard as one with a single attempt —
      // the floor guarantees it's deprioritized, never hidden entirely.
      return Math.max(RELEVANCE_FLOOR, Math.sqrt(share));
    }

    // ── Score every tracked topic ─────────────────────────
    const scored: PrioritizedTopic[] = mastery.map((t, i) => {
      const daysSince = t.lastAttemptedAt
        ? Math.floor((today.getTime() - new Date(t.lastAttemptedAt).getTime()) / 86400000)
        : null;

      // BUGFIX: clamp mastery ONCE at the top — a topic entry written by
      // an older pre-validation code path can carry a raw unrounded value
      // (e.g. a tiny float like 0.0055%) that sits untouched forever if
      // that topic isn't re-practiced. Every downstream calculation here
      // (score, action plan, reason text) and every API consumer should
      // work off one clean 0-100 integer — never trust a stored field to
      // already be valid at the point you read it.
      const cleanMastery = Math.round(Math.min(100, Math.max(0, t.masteryLevel || 0)));

      // Priority score formula (0–100):
      //  mastery component:  lower mastery = higher score (max 40pts)
      //  trend component:    declining +25, stable +10, improving +0
      //  recency component:  not studied in 7+ days +15, 3–7 days +8
      //  attempts component: 0 attempts +10, 1–2 attempts +5
      //  quiz failure bonus: if >50% quiz fails on this topic +10
      const masteryPts  = Math.round((1 - cleanMastery / 100) * 40);
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
      const relevanceScore = Math.round(relevanceForSubject(t.subject) * 100) / 100;
      const inScope = relevanceScore >= IN_SCOPE_THRESHOLD;

      const urgency: Urgency = urgencyScore >= 75 ? 'critical'
        : urgencyScore >= 50 ? 'high'
        : urgencyScore >= 25 ? 'medium' : 'low';

      const estimatedMins = urgency === 'critical' ? 30
        : urgency === 'high' ? 25
        : urgency === 'medium' ? 20 : 15;

      // BUGFIX: clamp mastery at the API boundary — a topic entry written
      // by an older pre-validation code path can carry a raw unrounded
      // value (e.g. a tiny float like 0.0055%) that sits untouched forever
      // if that topic isn't re-practiced. Every CONSUMER of this API
      // (dashboard, daily plan, any future client) should get a clean
      // 0-100 integer regardless of what's actually stored — never trust
      // a stored field to already be valid at the point you read it.
      return {
        rank:            i + 1, // will be re-ranked below
        topic:           t.topic,
        subject:         t.subject,
        mastery:         cleanMastery,
        urgencyScore,
        relevanceScore,
        inScope,
        urgency,
        trend:           t.trend,
        daysSinceStudied: daysSince,
        totalAttempts:   t.totalAttempts,
        actionPlan:      buildActionPlan(t.topic, t.subject, category, urgency, cleanMastery),
        estimatedMins,
        reason:          buildReason({ ...t, masteryLevel: cleanMastery }, daysSince, failRate, inScope),
      };
    });

    // ── Sort by RELEVANCE-WEIGHTED urgency, descending ─────
    // LAYER 1: this is the actual fix — ranking now uses
    // urgencyScore × relevanceScore instead of urgencyScore alone, so a
    // "critical" one-off topic outside the student's real focus no longer
    // outranks a "critical" topic that's actually core to what they study.
    // urgencyScore itself is left untouched in the response (still an
    // honest, relevance-independent measure of how weak that topic is),
    // it's only the SORT ORDER that changes.
    scored.sort((a, b) => (b.urgencyScore * b.relevanceScore) - (a.urgencyScore * a.relevanceScore));
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

function buildReason(t: any, daysSince: number | null, failRate: number, inScope: boolean): string {
  const parts: string[] = [];
  if (t.masteryLevel < 30)  parts.push(`mastery is only ${t.masteryLevel}%`);
  if (t.trend === 'declining') parts.push(`performance is declining`);
  if (daysSince !== null && daysSince >= 7) parts.push(`not studied in ${daysSince} days`);
  if (t.totalAttempts === 0) parts.push(`never attempted before`);
  if (failRate > 0.5) parts.push(`failed ${Math.round(failRate * 100)}% of quizzes on this topic`);
  const base = parts.length > 0
    ? `Priority because: ${parts.join(', ')}.`
    : `Steady practice needed to maintain ${t.topic}.`;
  // LAYER 1: make the deprioritization visible instead of silent — a
  // student should be able to see WHY something that looks "critical"
  // isn't at the top of their list, not just trust a hidden ranking.
  return inScope ? base : `${base} (Outside your usual focus area — lower priority for now.)`;
}