/**
 * AI Study OS — Strategy Scoring Engine  (v2 — FIX 2: upsert:true for new users)
 * ─────────────────────────────────────────────────────────────
 * WHAT CHANGED IN v2:
 *   recordOutcome() previously used { upsert: false } in its
 *   findOneAndUpdate call. For new users whose StudentProfile doesn't
 *   exist yet, every outcome write silently failed — the adaptive
 *   profile never built. Changed to { upsert: true } with a proper
 *   $setOnInsert default so new profiles are created automatically.
 *
 * Everything else is unchanged from the original.
 * ─────────────────────────────────────────────────────────────
 */

import { StudentProfile } from '../../models/StudentProfile.model.js';
import { logger }         from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export type TeachingStrategy =
  | 'TEACH'         // full concept explanation
  | 'SIMPLIFY'      // break down to basics
  | 'HINT'          // give hint, not full answer
  | 'CHALLENGE'     // raise difficulty, push harder
  | 'STEP_BY_STEP'  // numbered breakdown
  | 'QUIZ'          // test comprehension
  | 'GUIDE'         // Socratic questioning
  | 'FULL_SOLUTION' // complete worked solution
  | 'ENCOURAGE'     // motivational + re-attempt
  | 'SHORT';        // brief, direct answer

export interface StrategyStats {
  strategy:     TeachingStrategy;
  successCount: number;
  failureCount: number;
  usageCount:   number;
  lastUsedAt:   string | null;
}

export interface StrategyScore {
  strategy:          TeachingStrategy;
  score:             number;   // 0–1
  successRate:       number;
  preferenceScore:   number;
  difficultyMatch:   number;
  reason:            string;
}

export interface ScoringContext {
  userId:            string;
  currentState:      string;  // STUCK | LEARNING | ADVANCED | etc.
  masteryLevel:      number;  // 0–100
  confusionSignal:   boolean;
  frustrationSignal: boolean;
  sessionStreak:     number;  // consecutive correct answers
  lastStrategy?:     TeachingStrategy | null;
}

// ── Weight constants ───────────────────────────────────────────
const W_SUCCESS    = 0.50;
const W_PREFERENCE = 0.30;
const W_DIFFICULTY = 0.20;

// ── In-memory global fallback stats (used for new users) ──────
const globalStats: Map<TeachingStrategy, StrategyStats> = new Map([
  ['TEACH',         { strategy: 'TEACH',         successCount: 80, failureCount: 20, usageCount: 100, lastUsedAt: null }],
  ['SIMPLIFY',      { strategy: 'SIMPLIFY',       successCount: 75, failureCount: 25, usageCount: 100, lastUsedAt: null }],
  ['HINT',          { strategy: 'HINT',           successCount: 70, failureCount: 30, usageCount: 100, lastUsedAt: null }],
  ['CHALLENGE',     { strategy: 'CHALLENGE',      successCount: 65, failureCount: 35, usageCount: 100, lastUsedAt: null }],
  ['STEP_BY_STEP',  { strategy: 'STEP_BY_STEP',   successCount: 78, failureCount: 22, usageCount: 100, lastUsedAt: null }],
  ['QUIZ',          { strategy: 'QUIZ',           successCount: 72, failureCount: 28, usageCount: 100, lastUsedAt: null }],
  ['GUIDE',         { strategy: 'GUIDE',          successCount: 68, failureCount: 32, usageCount: 100, lastUsedAt: null }],
  ['FULL_SOLUTION', { strategy: 'FULL_SOLUTION',  successCount: 82, failureCount: 18, usageCount: 100, lastUsedAt: null }],
  ['ENCOURAGE',     { strategy: 'ENCOURAGE',      successCount: 60, failureCount: 40, usageCount: 100, lastUsedAt: null }],
  ['SHORT',         { strategy: 'SHORT',          successCount: 74, failureCount: 26, usageCount: 100, lastUsedAt: null }],
]);

// ─────────────────────────────────────────────────────────────
// strategyScoringEngine
// ─────────────────────────────────────────────────────────────
export const strategyScoringEngine = {

  /**
   * getTopStrategies — returns strategies ranked by score for this context.
   * Decision Engine should pick strategies[0] as primary.
   */
  async getTopStrategies(
    ctx: ScoringContext,
    topN: number = 3
  ): Promise<StrategyScore[]> {
    logger.info({ userId: ctx.userId, state: ctx.currentState }, '[StrategyScoringEngine] Scoring strategies');

    const userStats = await loadUserStats(ctx.userId);
    const candidates = ALL_STRATEGIES;

    const scored = candidates.map(strategy => scoreStrategy(strategy, ctx, userStats));
    scored.sort((a, b) => b.score - a.score);

    const top = scored.slice(0, topN);
    logger.info(
      { userId: ctx.userId, top: top.map(s => `${s.strategy}:${s.score.toFixed(2)}`) },
      '[StrategyScoringEngine] Top strategies selected'
    );

    return top;
  },

  /**
   * getBestStrategy — shortcut for single best pick.
   */
  async getBestStrategy(ctx: ScoringContext): Promise<TeachingStrategy> {
    const top = await this.getTopStrategies(ctx, 1);
    return top[0]?.strategy ?? 'TEACH';
  },

  /**
   * recordOutcome — called by feedbackLoopEngine after a response.
   * Updates per-user stats in MongoDB.
   *
   * FIX 2 (v2): Changed { upsert: false } to { upsert: true }.
   * Previously, new users with no StudentProfile had every outcome
   * write silently fail. Now the profile is created with safe defaults
   * on first write via $setOnInsert, so adaptive learning starts
   * immediately from the very first question.
   */
  async recordOutcome(
    userId:   string,
    strategy: TeachingStrategy,
    success:  boolean
  ): Promise<void> {
    try {
      const field = `aiStrategyStats.${strategy}`;
      const inc: Record<string, number> = {
        [`${field}.usageCount`]: 1,
      };
      if (success) {
        inc[`${field}.successCount`] = 1;
      } else {
        inc[`${field}.failureCount`] = 1;
      }

      await StudentProfile.findOneAndUpdate(
        { userId },
        {
          $inc: inc,
          $set: { [`${field}.lastUsedAt`]: new Date().toISOString() },
          // FIX 2: Initialize defaults when creating a new StudentProfile document.
          // These fields are only written when the doc is first inserted (upsert).
          $setOnInsert: {
            userId,
            aiStrategyStats:     {},
            topicMastery:        [],
            overallMasteryScore: 50,
            createdAt:           new Date(),
          },
        },
        {
          upsert: true,  // FIX 2: was { upsert: false } — new users had no profile built
          new:    false, // we don't need the returned doc
        }
      );

      // FIX: Do NOT mutate globalStats — it is a read-only prior for new users.
      // Mutating it causes: (a) incorrect priors after many requests, and
      // (b) async interleaving bugs when two recordOutcome() calls run in parallel.
      // Per-user DB stats (aiStrategyStats) are already the live source of truth.

      logger.info({ userId, strategy, success }, '[StrategyScoringEngine] Outcome recorded');
    } catch (err: any) {
      logger.error({ userId, err: err.message }, '[StrategyScoringEngine] recordOutcome failed');
    }
  },

  /**
   * getStrategyStats — for dashboard / debugging.
   */
  async getStrategyStats(userId: string): Promise<StrategyStats[]> {
    const userStats = await loadUserStats(userId);
    return ALL_STRATEGIES.map(s => userStats.get(s) ?? globalStats.get(s) ?? buildEmptyStats(s));
  },
};

// ─────────────────────────────────────────────────────────────
// Core scoring function
// ─────────────────────────────────────────────────────────────
function scoreStrategy(
  strategy: TeachingStrategy,
  ctx:      ScoringContext,
  userStats: Map<TeachingStrategy, StrategyStats>
): StrategyScore {

  const stats = userStats.get(strategy) ?? globalStats.get(strategy) ?? buildEmptyStats(strategy);

  // 1. Past success rate
  const successRate = stats.usageCount > 0
    ? stats.successCount / stats.usageCount
    : 0.5; // prior

  // 2. Student preference — derived from student state + signals
  const preferenceScore = computePreferenceScore(strategy, ctx);

  // 3. Difficulty match — how well does this strategy suit mastery level
  const difficultyMatch = computeDifficultyMatch(strategy, ctx);

  // Penalty: avoid repeating last strategy (small penalty for variety)
  const repeatPenalty = ctx.lastStrategy === strategy ? 0.05 : 0;

  const score = Math.min(1, Math.max(0,
    (successRate    * W_SUCCESS)
    + (preferenceScore * W_PREFERENCE)
    + (difficultyMatch * W_DIFFICULTY)
    - repeatPenalty
  ));

  return {
    strategy,
    score,
    successRate,
    preferenceScore,
    difficultyMatch,
    reason: buildReason(strategy, ctx, score),
  };
}

// ─────────────────────────────────────────────────────────────
// Preference scoring — how much does this student NEED this strategy?
// ─────────────────────────────────────────────────────────────
function computePreferenceScore(strategy: TeachingStrategy, ctx: ScoringContext): number {
  const { currentState, confusionSignal, frustrationSignal, sessionStreak } = ctx;

  // Confusion → SIMPLIFY, STEP_BY_STEP, ENCOURAGE
  if (confusionSignal) {
    if (strategy === 'SIMPLIFY')     return 0.95;
    if (strategy === 'STEP_BY_STEP') return 0.90;
    if (strategy === 'ENCOURAGE')    return 0.85;
    if (strategy === 'FULL_SOLUTION') return 0.70;
    if (strategy === 'CHALLENGE')    return 0.10;
  }

  // Frustration → ENCOURAGE, SIMPLIFY
  if (frustrationSignal) {
    if (strategy === 'ENCOURAGE') return 0.95;
    if (strategy === 'SIMPLIFY')  return 0.85;
    if (strategy === 'HINT')      return 0.60;
    if (strategy === 'CHALLENGE') return 0.05;
  }

  // Streak → CHALLENGE, QUIZ
  if (sessionStreak >= 3) {
    if (strategy === 'CHALLENGE') return 0.90;
    if (strategy === 'QUIZ')      return 0.85;
    if (strategy === 'GUIDE')     return 0.70;
    if (strategy === 'SIMPLIFY')  return 0.20;
  }

  // State-based preferences
  switch (currentState) {
    case 'STUCK':
      if (strategy === 'SIMPLIFY')     return 0.95;
      if (strategy === 'STEP_BY_STEP') return 0.90;
      if (strategy === 'ENCOURAGE')    return 0.85;
      break;
    case 'ADVANCED':
      if (strategy === 'CHALLENGE')    return 0.95;
      if (strategy === 'QUIZ')         return 0.85;
      if (strategy === 'GUIDE')        return 0.75;
      break;
    case 'IMPROVING':
      if (strategy === 'QUIZ')         return 0.80;
      if (strategy === 'CHALLENGE')    return 0.75;
      if (strategy === 'TEACH')        return 0.65;
      break;
    case 'INACTIVE':
      if (strategy === 'ENCOURAGE')    return 0.90;
      if (strategy === 'SHORT')        return 0.80;
      if (strategy === 'TEACH')        return 0.70;
      break;
  }

  return 0.50; // neutral prior
}

// ─────────────────────────────────────────────────────────────
// Difficulty match — does strategy suit mastery level?
// ─────────────────────────────────────────────────────────────
function computeDifficultyMatch(strategy: TeachingStrategy, ctx: ScoringContext): number {
  const { masteryLevel } = ctx;

  if (masteryLevel < 30) {
    if (strategy === 'TEACH')        return 0.95;
    if (strategy === 'SIMPLIFY')     return 0.95;
    if (strategy === 'FULL_SOLUTION') return 0.85;
    if (strategy === 'CHALLENGE')    return 0.10;
    return 0.50;
  }

  if (masteryLevel < 60) {
    if (strategy === 'STEP_BY_STEP') return 0.90;
    if (strategy === 'HINT')         return 0.85;
    if (strategy === 'TEACH')        return 0.70;
    if (strategy === 'QUIZ')         return 0.65;
    if (strategy === 'CHALLENGE')    return 0.45;
    return 0.55;
  }

  if (masteryLevel < 80) {
    if (strategy === 'QUIZ')         return 0.90;
    if (strategy === 'CHALLENGE')    return 0.80;
    if (strategy === 'GUIDE')        return 0.75;
    if (strategy === 'HINT')         return 0.65;
    if (strategy === 'TEACH')        return 0.50;
    return 0.60;
  }

  if (strategy === 'CHALLENGE')    return 0.95;
  if (strategy === 'QUIZ')         return 0.90;
  if (strategy === 'GUIDE')        return 0.85;
  if (strategy === 'SHORT')        return 0.75;
  if (strategy === 'SIMPLIFY')     return 0.15;
  return 0.50;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
async function loadUserStats(userId: string): Promise<Map<TeachingStrategy, StrategyStats>> {
  const map = new Map<TeachingStrategy, StrategyStats>();
  try {
    const profile = await StudentProfile.findOne({ userId })
      .select('aiStrategyStats')
      .lean();

    const raw = (profile as any)?.aiStrategyStats;
    if (!raw) return map;

    for (const strategy of ALL_STRATEGIES) {
      if (raw[strategy]) {
        map.set(strategy, raw[strategy] as StrategyStats);
      }
    }
  } catch (err: any) {
    logger.warn({ userId, err: err.message }, '[StrategyScoringEngine] Could not load user stats');
  }
  return map;
}

function buildEmptyStats(strategy: TeachingStrategy): StrategyStats {
  return { strategy, successCount: 0, failureCount: 0, usageCount: 0, lastUsedAt: null };
}

function buildReason(strategy: TeachingStrategy, ctx: ScoringContext, score: number): string {
  if (ctx.confusionSignal)   return `${strategy} scored ${score.toFixed(2)} — confusion detected`;
  if (ctx.frustrationSignal) return `${strategy} scored ${score.toFixed(2)} — frustration detected`;
  if (ctx.sessionStreak >= 3) return `${strategy} scored ${score.toFixed(2)} — strong streak`;
  return `${strategy} scored ${score.toFixed(2)} — state=${ctx.currentState} mastery=${ctx.masteryLevel}%`;
}

const ALL_STRATEGIES: TeachingStrategy[] = [
  'TEACH', 'SIMPLIFY', 'HINT', 'CHALLENGE', 'STEP_BY_STEP',
  'QUIZ', 'GUIDE', 'FULL_SOLUTION', 'ENCOURAGE', 'SHORT',
];