/**
 * AI Study OS — Topic Analyzer
 * ─────────────────────────────────────────────────────────────
 * Hidden powerful feature: Automatic weak topic detection.
 *
 * What it does:
 *   1. Analyzes topic mastery data to find TRUE weak spots
 *   2. Detects declining performance patterns (before mastery drops)
 *   3. Identifies "nearly weak" topics (mastery 40–55%) — at risk
 *   4. Groups topics by subject to find weakest subjects
 *   5. Returns ranked priority list for AI recommendations
 *
 * Called by: contextBuilder.ts, learningEngine.ts
 *
 * Example:
 *   Input:  quiz results (Algebra: failed 3x, Loops: failed 2x)
 *   Output: { critical: ['Algebra'], warning: ['Loops'], atRisk: ['Arrays'] }
 */

import { StudentProfile } from '../../models/StudentProfile.model.js';
import { logger } from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export interface TopicAnalysis {
  critical:  AnalyzedTopic[];   // mastery < 30%  — needs immediate attention
  weak:      AnalyzedTopic[];   // mastery 30–39% — clearly weak
  atRisk:    AnalyzedTopic[];   // mastery 40–55% — declining or borderline
  strong:    AnalyzedTopic[];   // mastery >= 80%
  summary: {
    totalTopicsTracked: number;
    criticalCount:      number;
    weakCount:          number;
    atRiskCount:        number;
    strongCount:        number;
    weakestSubject:     string | null;
    mostImproved:       string | null;
    mostDeclined:       string | null;
  };
}

export interface AnalyzedTopic {
  topic:       string;
  subject:     string;
  mastery:     number;     // 0–100
  attempts:    number;
  trend:       'improving' | 'declining' | 'stable';
  priority:    1 | 2 | 3; // 1 = highest priority
  action:      string;     // human-readable recommendation
}

// ── Mastery Thresholds ─────────────────────────────────────────
const CRITICAL_THRESHOLD = 30;
const WEAK_THRESHOLD     = 40;
const AT_RISK_THRESHOLD  = 55;
const STRONG_THRESHOLD   = 80;

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — analyzeTopics
// ─────────────────────────────────────────────────────────────
export async function analyzeTopics(userId: string): Promise<TopicAnalysis | null> {
  try {
    const profile = await StudentProfile.findOne({ userId })
      .select('topicMastery learnerCategory')
      .lean() as any;

    if (!profile || !profile.topicMastery?.length) {
      return buildEmptyAnalysis();
    }

    const mastery: any[] = profile.topicMastery;

    const critical: AnalyzedTopic[] = [];
    const weak:     AnalyzedTopic[] = [];
    const atRisk:   AnalyzedTopic[] = [];
    const strong:   AnalyzedTopic[] = [];

    // ── Subject performance aggregation ──────────────────
    const subjectMap: Record<string, { total: number; count: number }> = {};

    // Track trend extremes
    let mostImproved: string | null  = null;
    let mostDeclined: string | null  = null;
    let bestTrendDelta  = -Infinity;
    let worstTrendDelta = Infinity;

    for (const t of mastery) {
      const analyzed = buildAnalyzedTopic(t, profile.learnerCategory);

      // Classify
      if (t.masteryLevel < CRITICAL_THRESHOLD) {
        critical.push(analyzed);
      } else if (t.masteryLevel < WEAK_THRESHOLD) {
        weak.push(analyzed);
      } else if (t.masteryLevel < AT_RISK_THRESHOLD || t.trend === 'declining') {
        atRisk.push(analyzed);
      } else if (t.masteryLevel >= STRONG_THRESHOLD) {
        strong.push(analyzed);
      }

      // Subject aggregate
      if (!subjectMap[t.subject]) subjectMap[t.subject] = { total: 0, count: 0 };
      subjectMap[t.subject].total += t.masteryLevel;
      subjectMap[t.subject].count += 1;

      // Track trends (heuristic: improving = +delta, declining = -delta)
      const delta = t.trend === 'improving' ? 1 : t.trend === 'declining' ? -1 : 0;
      if (delta > bestTrendDelta)  { bestTrendDelta = delta;  mostImproved = t.topic; }
      if (delta < worstTrendDelta) { worstTrendDelta = delta; mostDeclined = t.topic; }
    }

    // Sort by priority (critical first, then by mastery ascending)
    critical.sort((a, b) => a.mastery - b.mastery);
    weak.sort((a, b) => a.mastery - b.mastery);
    atRisk.sort((a, b) => a.mastery - b.mastery);
    strong.sort((a, b) => b.mastery - a.mastery);

    // Weakest subject
    const subjectAvgs = Object.entries(subjectMap)
      .map(([s, v]) => ({ subject: s, avg: Math.round(v.total / v.count) }))
      .sort((a, b) => a.avg - b.avg);
    const weakestSubject = subjectAvgs[0]?.subject || null;

    // Only mark mostDeclined if it actually declined
    if (worstTrendDelta >= 0) mostDeclined = null;
    if (bestTrendDelta  <= 0) mostImproved = null;

    return {
      critical,
      weak,
      atRisk,
      strong,
      summary: {
        totalTopicsTracked: mastery.length,
        criticalCount:      critical.length,
        weakCount:          weak.length,
        atRiskCount:        atRisk.length,
        strongCount:        strong.length,
        weakestSubject,
        mostImproved,
        mostDeclined,
      },
    };
  } catch (err: any) {
    logger.error(`[TopicAnalyzer] analyzeTopics: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// getPriorityTopics — top N topics that need attention right now
// ─────────────────────────────────────────────────────────────
export async function getPriorityTopics(
  userId: string,
  limit = 3
): Promise<AnalyzedTopic[]> {
  const analysis = await analyzeTopics(userId);
  if (!analysis) return [];

  // Merge critical + weak + at-risk, already sorted by urgency
  return [
    ...analysis.critical,
    ...analysis.weak,
    ...analysis.atRisk,
  ].slice(0, limit);
}

// ─────────────────────────────────────────────────────────────
// getTopicReport — compact string summary for AI context
// ─────────────────────────────────────────────────────────────
export async function getTopicReport(userId: string): Promise<string> {
  const analysis = await analyzeTopics(userId);
  if (!analysis || analysis.summary.totalTopicsTracked === 0) {
    return 'No topic data yet — student is just starting out.';
  }

  const lines: string[] = [];
  const s = analysis.summary;

  if (s.criticalCount > 0) {
    const names = analysis.critical.slice(0, 3).map(t => `${t.topic} (${t.mastery}%)`);
    lines.push(`Critical gaps: ${names.join(', ')}`);
  }
  if (s.weakCount > 0) {
    const names = analysis.weak.slice(0, 3).map(t => t.topic);
    lines.push(`Weak topics: ${names.join(', ')}`);
  }
  if (s.atRiskCount > 0) {
    const names = analysis.atRisk.slice(0, 2).map(t => t.topic);
    lines.push(`At-risk topics: ${names.join(', ')}`);
  }
  if (s.strongCount > 0) {
    lines.push(`Strong areas: ${analysis.strong.slice(0, 2).map(t => t.topic).join(', ')}`);
  }
  if (s.weakestSubject) {
    lines.push(`Weakest subject: ${s.weakestSubject}`);
  }
  if (s.mostDeclined) {
    lines.push(`Declining: ${s.mostDeclined}`);
  }
  if (s.mostImproved) {
    lines.push(`Improving: ${s.mostImproved}`);
  }

  return lines.join(' | ') || 'Topics tracked but no strong patterns yet.';
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function buildAnalyzedTopic(t: any, category: string): AnalyzedTopic {
  const { topic, subject, masteryLevel, totalAttempts, trend } = t;
  const priority = masteryLevel < CRITICAL_THRESHOLD ? 1
    : masteryLevel < WEAK_THRESHOLD ? 2 : 3;

  const actionMap: Record<number, Record<string, string>> = {
    1: {
      school:  `Revise ${topic} basics with your teacher or notes immediately.`,
      coding:  `Practice ${topic} with simple exercises every day this week.`,
      college: `Review ${topic} theory and attempt practice problems urgently.`,
      self:    `Find a tutorial on ${topic} and practice daily.`,
    },
    2: {
      school:  `Spend 20 min on ${topic} today — solve 5 practice questions.`,
      coding:  `Code 2 mini projects using ${topic} to build confidence.`,
      college: `Solve 10 problems on ${topic} before your next session.`,
      self:    `Dedicate this week's sessions to improving ${topic}.`,
    },
    3: {
      school:  `Review ${topic} lightly — it's borderline, don't let it slip.`,
      coding:  `Revisit ${topic} concepts with a quick refresher.`,
      college: `Keep practicing ${topic} to maintain your current level.`,
      self:    `A short review of ${topic} would keep you on track.`,
    },
  };

  const action = actionMap[priority]?.[category] || `Review ${topic} to strengthen understanding.`;

  return { topic, subject, mastery: masteryLevel, attempts: totalAttempts, trend, priority, action };
}

function buildEmptyAnalysis(): TopicAnalysis {
  return {
    critical: [], weak: [], atRisk: [], strong: [],
    summary: {
      totalTopicsTracked: 0, criticalCount: 0, weakCount: 0,
      atRiskCount: 0, strongCount: 0,
      weakestSubject: null, mostImproved: null, mostDeclined: null,
    },
  };
}