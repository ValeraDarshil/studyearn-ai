/**
 * AI Study OS — Bandit Strategy Engine  (BRAIN UPGRADE — Phase 1b)
 * ─────────────────────────────────────────────────────────────
 * WHY THIS EXISTS:
 *   strategyScoringEngine.ts scores all 10 strategies with a fixed
 *   formula and always returns the argmax (highest score wins, every
 *   time). That means:
 *     1. It NEVER learns to prefer a strategy the formula underrates —
 *        the formula's weights are fixed forever, not adaptive.
 *     2. A strategy with only 2 data points and a lucky 100% success
 *        rate gets treated with the same confidence as one with 200
 *        data points — no uncertainty awareness at all.
 *     3. Zero exploration — the system can get permanently stuck
 *        favoring a "good enough" strategy while never discovering a
 *        better one for a given student.
 *
 * WHAT THIS ADDS:
 *   Thompson Sampling — a standard, well-studied multi-armed-bandit
 *   algorithm. For each strategy we maintain a Beta(alpha, beta)
 *   distribution over "probability this strategy succeeds for THIS
 *   student right now". We sample once from each strategy's
 *   distribution and pick the highest sample (not the highest mean).
 *
 *   This naturally balances explore vs exploit:
 *     - Strategies with little data have WIDE distributions → they get
 *       sampled high occasionally → the system tries them → genuine
 *       learning happens.
 *     - Strategies with lots of consistent success have NARROW, high
 *       distributions → they win almost every time, but not with
 *       robotic 100% certainty.
 *
 * SAFETY — this does NOT replace domain knowledge with pure randomness:
 *   strategyScoringEngine's contextual score (success rate + student
 *   preference signals like confusion/frustration + difficulty match)
 *   is used as an INFORMATIVE PRIOR for each strategy's Beta
 *   distribution. Real per-user outcome counts (successCount/
 *   failureCount, already stored in StudentProfile.aiStrategyStats)
 *   are then layered on top as evidence. A strategy the context engine
 *   scores near-zero (e.g. CHALLENGE while the student is frustrated)
 *   gets a near-zero prior and essentially never wins — the bandit
 *   explores among REASONABLE options, never among clearly wrong ones.
 *
 * Integration:
 *   • aiBrainCore.ts — replaces the direct strategyScoringEngine
 *     .getBestStrategy() call at STEP 2.5. strategyScoringEngine
 *     itself is UNCHANGED — this engine wraps it, doesn't fork it.
 */

import { StudentProfile }                                       from '../../models/StudentProfile.model.js';
import { strategyScoringEngine, TeachingStrategy, ScoringContext, StrategyScore } from './strategyScoringEngine.js';
import { logger }                                                from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export interface BanditPick {
  strategy:           TeachingStrategy;
  sampledValue:        number;               // the winning Thompson sample (0–1)
  contextualScore:     number;                // what strategyScoringEngine said (for comparison/logging)
  wasExploration:      boolean;               // true if bandit picked something OTHER than the argmax
  allScores:           StrategyScore[];       // full contextual ranking (unchanged — for transparency UI)
  rawStats:            Record<string, { successCount: number; failureCount: number }>;
}

// Strategies scoring below this contextual floor are excluded from
// sampling entirely — the bandit never "explores" a pedagogically
// unsafe option (e.g. CHALLENGE for a frustrated, STUCK student).
const SAFETY_FLOOR = 0.18;

// Total pseudo-observations the contextual prior is worth. Small
// enough that ~6-10 real outcomes from THIS student start to dominate
// the prior — the bandit genuinely learns per-student over time
// instead of staying anchored to the formula forever.
const PRIOR_STRENGTH = 6;

// ─────────────────────────────────────────────────────────────
// banditStrategyEngine
// ─────────────────────────────────────────────────────────────
export const banditStrategyEngine = {

  /**
   * pick — Thompson-Sampling strategy selection.
   * Falls back to plain contextual argmax if anything goes wrong
   * (DB read failure, no candidates, etc.) — this NEVER throws and
   * NEVER returns an unsafe/undefined strategy.
   */
  async pick(ctx: ScoringContext): Promise<BanditPick> {
    // Contextual scores (unchanged engine — success rate + preference + difficulty)
    let allScores: StrategyScore[];
    try {
      allScores = await strategyScoringEngine.getTopStrategies(ctx, 10);
    } catch (err: any) {
      logger.warn({ userId: ctx.userId, err: err.message }, '[BanditEngine] Contextual scoring failed, using safe default');
      return safeDefault();
    }

    if (!allScores.length) return safeDefault();

    const argmax = allScores[0]; // contextual engine's own top pick (backward-compatible fallback)

    // Raw per-user outcome counts — real evidence layered onto the prior.
    const rawStats = await loadRawStats(ctx.userId);

    // Candidates: exclude anything the contextual engine flags as unsafe.
    const candidates = allScores.filter(s => s.score >= SAFETY_FLOOR);
    const pool = candidates.length > 0 ? candidates : [argmax]; // never end up with zero candidates

    let winner: StrategyScore = pool[0];
    let winnerSample = -1;

    for (const candidate of pool) {
      const stats = rawStats[candidate.strategy] ?? { successCount: 0, failureCount: 0 };

      // Contextual score becomes an informative Beta prior:
      // e.g. score=0.9 → prior strongly favors success; score=0.2 → prior strongly favors failure.
      const priorAlpha = Math.max(0.5, candidate.score * PRIOR_STRENGTH);
      const priorBeta  = Math.max(0.5, (1 - candidate.score) * PRIOR_STRENGTH);

      const posteriorAlpha = priorAlpha + stats.successCount;
      const posteriorBeta  = priorBeta  + stats.failureCount;

      const sample = sampleBeta(posteriorAlpha, posteriorBeta);

      if (sample > winnerSample) {
        winnerSample = sample;
        winner = candidate;
      }
    }

    const wasExploration = winner.strategy !== argmax.strategy;
    if (wasExploration) {
      logger.info(
        { userId: ctx.userId, chose: winner.strategy, insteadOf: argmax.strategy },
        '[BanditEngine] Exploring — chose a non-argmax strategy',
      );
    }

    return {
      strategy:        winner.strategy,
      sampledValue:    winnerSample,
      contextualScore: winner.score,
      wasExploration,
      allScores,
      rawStats,
    };
  },
};

// ─────────────────────────────────────────────────────────────
// safeDefault — used only if the contextual engine itself fails.
// TEACH is the safest general-purpose fallback (matches the
// pre-existing default used throughout strategyScoringEngine.ts).
// ─────────────────────────────────────────────────────────────
function safeDefault(): BanditPick {
  return {
    strategy:        'TEACH',
    sampledValue:    0.5,
    contextualScore: 0.5,
    wasExploration:  false,
    allScores:       [],
    rawStats:        {},
  };
}

// ─────────────────────────────────────────────────────────────
// loadRawStats — per-user success/failure counts from Mongo.
// Mirrors strategyScoringEngine's internal loader but returns plain
// counts (not the full StrategyStats shape) since that's all Thompson
// Sampling needs. Never throws — returns {} on any DB error so the
// bandit degrades gracefully to prior-only (still safe, just less
// personalized until the DB is reachable again).
// ─────────────────────────────────────────────────────────────
async function loadRawStats(userId: string): Promise<Record<string, { successCount: number; failureCount: number }>> {
  try {
    const profile = await StudentProfile.findOne({ userId }).select('aiStrategyStats').lean();
    const raw = (profile as any)?.aiStrategyStats;
    if (!raw) return {};

    const out: Record<string, { successCount: number; failureCount: number }> = {};
    for (const [strategy, entry] of Object.entries(raw as Record<string, any>)) {
      out[strategy] = {
        successCount: Number(entry?.successCount) || 0,
        failureCount: Number(entry?.failureCount) || 0,
      };
    }
    return out;
  } catch (err: any) {
    logger.warn({ userId, err: err.message }, '[BanditEngine] Could not load raw stats, using prior-only');
    return {};
  }
}

// ─────────────────────────────────────────────────────────────
// Statistical primitives — pure functions, no dependencies.
// Standard Marsaglia & Tsang (2000) method for Gamma sampling,
// used to derive a Beta(alpha, beta) sample via X/(X+Y) where
// X ~ Gamma(alpha), Y ~ Gamma(beta). This is the textbook-standard
// approach and needs no external statistics library.
// ─────────────────────────────────────────────────────────────

function randomStandardNormal(): number {
  // Box-Muller transform. u1 guarded away from 0 to avoid log(0) = -Infinity.
  let u1 = Math.random();
  if (u1 < 1e-12) u1 = 1e-12;
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function sampleGamma(shape: number): number {
  // Boost trick for shape < 1: Gamma(shape) = Gamma(shape+1) * U^(1/shape)
  if (shape < 1) {
    const u = Math.max(Math.random(), 1e-12);
    return sampleGamma(shape + 1) * Math.pow(u, 1 / shape);
  }

  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);

  // Bounded loop — Marsaglia-Tsang accepts within a handful of
  // iterations almost always; the cap guarantees this can never hang.
  for (let attempt = 0; attempt < 100; attempt++) {
    const x = randomStandardNormal();
    let v = 1 + c * x;
    if (v <= 0) continue;
    v = v * v * v;

    const u = Math.random();
    const x2 = x * x;

    if (u < 1 - 0.0331 * x2 * x2) return d * v;
    if (Math.log(u) < 0.5 * x2 + d * (1 - v + Math.log(v))) return d * v;
  }
  return d; // extremely unlikely fallback — keeps the function total or never hangs
}

function sampleBeta(alpha: number, beta: number): number {
  const x = sampleGamma(Math.max(alpha, 1e-3));
  const y = sampleGamma(Math.max(beta, 1e-3));
  const denom = x + y;
  return denom > 0 ? x / denom : 0.5;
}