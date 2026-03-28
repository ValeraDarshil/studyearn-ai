/**
 * AI Study OS — Difficulty Adapter (Stage 3)
 * ─────────────────────────────────────────────────────────────
 * Automatically adjusts the difficulty of learning tasks
 * based on the student's real-time performance data.
 *
 * Core idea: "Zone of Proximal Development"
 *   Too easy  → student gets bored, disengages
 *   Too hard  → student gets frustrated, quits
 *   Just right → student is challenged but succeeds → growth
 *
 * Signals used to adapt difficulty:
 *   - Quiz accuracy (last 5 quizzes on a topic)
 *   - Consecutive correct/wrong answers
 *   - Time spent per question (fast = easy, slow = hard)
 *   - Overall mastery level on the topic
 *   - Current streak (momentum indicator)
 *
 * Output: difficulty setting + explanation + XP multiplier
 */

import { StudentProfile } from '../../models/StudentProfile.model.js';
import { logger }         from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export type DifficultyLevel = 'beginner' | 'easy' | 'medium' | 'hard' | 'advanced';

export interface DifficultyDecision {
  level:          DifficultyLevel;
  numericLevel:   1 | 2 | 3 | 4 | 5;   // 1=beginner, 5=advanced
  xpMultiplier:   number;                // higher difficulty = more XP
  reason:         string;
  shouldIncrease: boolean;
  shouldDecrease: boolean;
  suggestion:     string;                // what type of task to give
}

export interface TopicDifficulty {
  topic:      string;
  subject:    string;
  decision:   DifficultyDecision;
}

// ── Difficulty thresholds ──────────────────────────────────────
const INCREASE_THRESHOLD = 80;  // quiz accuracy % → increase difficulty
const DECREASE_THRESHOLD = 50;  // quiz accuracy % → decrease difficulty
const MASTERY_ADVANCED   = 75;
const MASTERY_MEDIUM     = 45;
const MASTERY_EASY       = 20;

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — getAdaptedDifficulty
// Returns difficulty setting for a specific topic
// ─────────────────────────────────────────────────────────────
export async function getAdaptedDifficulty(
  userId:  string,
  topic:   string,
  subject: string,
): Promise<DifficultyDecision> {
  try {
    const profile = await StudentProfile.findOne({ userId })
      .select('topicMastery quizHistory avgTimePerQuestion currentStreak learningSpeed')
      .lean() as any;

    if (!profile) return buildDefaultDecision('medium', 'No profile data found.');

    // Find topic entry
    const topicEntry = (profile.topicMastery || []).find(
      (t: any) => t.topic.toLowerCase() === topic.toLowerCase()
    );

    // Get recent quiz scores for this topic (last 5)
    const topicQuizzes = (profile.quizHistory || [])
      .filter((q: any) => q.topic === topic)
      .slice(-5);

    const recentAccuracy = topicQuizzes.length > 0
      ? topicQuizzes.reduce((s: number, q: any) => s + (q.score || 0), 0) / topicQuizzes.length
      : null;

    const mastery   = topicEntry?.masteryLevel ?? 0;
    const attempts  = topicEntry?.totalAttempts ?? 0;
    const trend     = topicEntry?.trend ?? 'stable';
    const avgTime   = profile.avgTimePerQuestion ?? 60;
    const streak    = profile.currentStreak ?? 0;
    const speed     = profile.learningSpeed ?? 'medium';

    return computeDifficulty({ mastery, recentAccuracy, attempts, trend, avgTime, streak, speed, topic });
  } catch (err: any) {
    logger.error(`[DifficultyAdapter] getAdaptedDifficulty: ${err.message}`);
    return buildDefaultDecision('medium', 'Error computing difficulty.');
  }
}

// ─────────────────────────────────────────────────────────────
// getBulkDifficulty — difficulty for all tracked topics at once
// Used by LearningPathGenerator to set step difficulties
// ─────────────────────────────────────────────────────────────
export async function getBulkDifficulty(userId: string): Promise<TopicDifficulty[]> {
  try {
    const profile = await StudentProfile.findOne({ userId })
      .select('topicMastery quizHistory avgTimePerQuestion currentStreak learningSpeed')
      .lean() as any;

    if (!profile) return [];

    const speed = profile.learningSpeed ?? 'medium';
    const streak = profile.currentStreak ?? 0;
    const avgTime = profile.avgTimePerQuestion ?? 60;

    return (profile.topicMastery || []).map((t: any) => {
      const topicQuizzes = (profile.quizHistory || [])
        .filter((q: any) => q.topic === t.topic).slice(-5);
      const recentAccuracy = topicQuizzes.length > 0
        ? topicQuizzes.reduce((s: number, q: any) => s + (q.score || 0), 0) / topicQuizzes.length
        : null;

      return {
        topic:    t.topic,
        subject:  t.subject,
        decision: computeDifficulty({
          mastery: t.masteryLevel, recentAccuracy,
          attempts: t.totalAttempts, trend: t.trend,
          avgTime, streak, speed, topic: t.topic,
        }),
      };
    });
  } catch (err: any) {
    logger.error(`[DifficultyAdapter] getBulkDifficulty: ${err.message}`);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// getOverallDifficulty — single difficulty for the student overall
// Used when generating a new learning path
// ─────────────────────────────────────────────────────────────
export async function getOverallDifficulty(userId: string): Promise<DifficultyDecision> {
  try {
    const profile = await StudentProfile.findOne({ userId })
      .select('overallMasteryScore learningSpeed currentStreak quizHistory')
      .lean() as any;

    if (!profile) return buildDefaultDecision('medium', 'No profile found.');

    const mastery = profile.overallMasteryScore ?? 0;
    const speed   = profile.learningSpeed ?? 'medium';
    const streak  = profile.currentStreak ?? 0;

    const recentQuizzes = (profile.quizHistory || []).slice(-10);
    const recentAccuracy = recentQuizzes.length > 0
      ? recentQuizzes.reduce((s: number, q: any) => s + (q.score || 0), 0) / recentQuizzes.length
      : null;

    return computeDifficulty({
      mastery, recentAccuracy, attempts: recentQuizzes.length,
      trend: 'stable', avgTime: 60, streak, speed, topic: 'overall',
    });
  } catch (err: any) {
    logger.error(`[DifficultyAdapter] getOverallDifficulty: ${err.message}`);
    return buildDefaultDecision('medium', 'Error.');
  }
}

// ─────────────────────────────────────────────────────────────
// CORE ALGORITHM
// ─────────────────────────────────────────────────────────────
function computeDifficulty(data: {
  mastery:        number;
  recentAccuracy: number | null;
  attempts:       number;
  trend:          string;
  avgTime:        number;
  streak:         number;
  speed:          string;
  topic:          string;
}): DifficultyDecision {
  const { mastery, recentAccuracy, attempts, trend, avgTime, streak, speed, topic } = data;

  // Start with mastery-based baseline
  let level: DifficultyLevel = mastery >= MASTERY_ADVANCED ? 'hard'
    : mastery >= MASTERY_MEDIUM ? 'medium'
    : mastery >= MASTERY_EASY  ? 'easy' : 'beginner';

  let shouldIncrease = false;
  let shouldDecrease = false;
  const reasons: string[] = [];

  // Adjust based on recent accuracy
  if (recentAccuracy !== null) {
    if (recentAccuracy >= INCREASE_THRESHOLD) {
      shouldIncrease = true;
      reasons.push(`${Math.round(recentAccuracy)}% quiz accuracy — ready for harder content`);
    } else if (recentAccuracy < DECREASE_THRESHOLD) {
      shouldDecrease = true;
      reasons.push(`only ${Math.round(recentAccuracy)}% accuracy — need easier content first`);
    }
  }

  // Adjust for first-time learners (0–2 attempts)
  if (attempts <= 1) {
    level = 'beginner';
    reasons.push('new topic — start at beginner level');
  }

  // Adjust for declining trend
  if (trend === 'declining') {
    shouldDecrease = true;
    reasons.push('performance is declining — reduce difficulty');
  }

  // Learning speed modifier
  if (speed === 'fast' && !shouldDecrease) {
    shouldIncrease = true;
    reasons.push('fast learner — can handle more challenge');
  } else if (speed === 'slow') {
    shouldDecrease = true;
    reasons.push('slow learner pace — keep it manageable');
  }

  // Streak momentum boost
  if (streak >= 7 && !shouldDecrease) {
    reasons.push(`${streak}-day streak — student is in momentum`);
  }

  // Apply adjustments
  if (shouldIncrease && !shouldDecrease) level = increaseLevel(level);
  if (shouldDecrease && !shouldIncrease) level = decreaseLevel(level);

  const numericLevel = levelToNumber(level);
  const xpMultiplier = 0.5 + (numericLevel * 0.3); // 0.8x to 2.0x

  return {
    level,
    numericLevel,
    xpMultiplier: Math.round(xpMultiplier * 10) / 10,
    reason:       reasons.length > 0 ? reasons.join('. ') : `Based on ${mastery}% mastery.`,
    shouldIncrease,
    shouldDecrease,
    suggestion:   buildSuggestion(level, topic),
  };
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function increaseLevel(level: DifficultyLevel): DifficultyLevel {
  const order: DifficultyLevel[] = ['beginner', 'easy', 'medium', 'hard', 'advanced'];
  const idx = order.indexOf(level);
  return order[Math.min(idx + 1, order.length - 1)];
}

function decreaseLevel(level: DifficultyLevel): DifficultyLevel {
  const order: DifficultyLevel[] = ['beginner', 'easy', 'medium', 'hard', 'advanced'];
  const idx = order.indexOf(level);
  return order[Math.max(idx - 1, 0)];
}

function levelToNumber(level: DifficultyLevel): 1 | 2 | 3 | 4 | 5 {
  const map: Record<DifficultyLevel, 1 | 2 | 3 | 4 | 5> = {
    beginner: 1, easy: 2, medium: 3, hard: 4, advanced: 5,
  };
  return map[level];
}

function buildSuggestion(level: DifficultyLevel, topic: string): string {
  const suggestions: Record<DifficultyLevel, string> = {
    beginner: `Give definition + 1 simple example of ${topic}. No tricks.`,
    easy:     `Basic practice problems on ${topic} with step-by-step guidance.`,
    medium:   `Standard problems on ${topic} — mix of concept and application.`,
    hard:     `Complex ${topic} problems that combine multiple concepts.`,
    advanced: `Edge cases, optimization, and real-world application of ${topic}.`,
  };
  return suggestions[level];
}

function buildDefaultDecision(level: DifficultyLevel, reason: string): DifficultyDecision {
  return {
    level,
    numericLevel:   levelToNumber(level),
    xpMultiplier:   1.0,
    reason,
    shouldIncrease: false,
    shouldDecrease: false,
    suggestion:     `Standard practice on the topic.`,
  };
}