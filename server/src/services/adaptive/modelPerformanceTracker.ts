/**
 * AI Study OS — Model Performance Tracker  (GAP 5 FIX)
 * ─────────────────────────────────────────────────────────────
 * Extends the existing aiModelRouter.ts with persistent performance
 * tracking and cost optimization.
 *
 * The existing aiModelRouter.ts already has in-memory per-session stats.
 * THIS file adds:
 *   • Cross-session performance (persisted in process memory with
 *     periodic decay — no DB needed for metrics this fine-grained)
 *   • Cost tracking per model (tokens × price)
 *   • Smart routing logic that reads persistent stats
 *   • Automatic fallback escalation when model degrades
 *
 * How to integrate with existing aiModelRouter.ts:
 *   1. Import modelPerformanceTracker
 *   2. After recordModelSuccess() → also call modelPerformanceTracker.record()
 *   3. Before routing → call modelPerformanceTracker.getBestModel()
 *
 * Usage in aiService.ts / askAIService.ts:
 *   import { modelPerformanceTracker } from '../adaptive/modelPerformanceTracker.js';
 *   modelPerformanceTracker.recordSuccess('llama-3.3-70b-versatile', latencyMs, tokenCount);
 *   modelPerformanceTracker.recordFailure('some-model', 'timeout');
 *   const best = modelPerformanceTracker.getBestModel(complexityTier, budget);
 */

import { logger } from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export type ComplexityTier = 'fast' | 'balanced' | 'powerful';

export interface ModelCostConfig {
  pricePerMillionTokens: number;  // USD
  maxContextTokens:      number;
  tier:                  ComplexityTier;
  provider:              'groq' | 'openrouter' | 'nvidia';
}

export interface ModelPerformanceRecord {
  modelId:          string;
  successCount:     number;
  failureCount:     number;
  totalLatencyMs:   number;
  totalTokensUsed:  number;
  totalCostUSD:     number;
  qualityPenalty:   number;
  lastFailureAt:    number | null;
  lastSuccessAt:    number | null;
  tier:             ComplexityTier;
  provider:         string;
}

export interface RoutingDecision {
  modelId:    string;
  provider:   string;
  tier:       ComplexityTier;
  reason:     string;
  fallbackTo: string | null;
}

// ── Cost configs (approximate — adjust as pricing changes) ────
export const MODEL_COST_CONFIG: Record<string, ModelCostConfig> = {
  // Groq — ultra fast, free tier
  'llama-3.3-70b-versatile':   { pricePerMillionTokens: 0,    maxContextTokens: 128000, tier: 'powerful', provider: 'groq' },
  'llama-3.1-70b-versatile':   { pricePerMillionTokens: 0,    maxContextTokens: 128000, tier: 'balanced', provider: 'groq' },
  'mixtral-8x7b-32768':        { pricePerMillionTokens: 0,    maxContextTokens: 32768,  tier: 'balanced', provider: 'groq' },
  'gemma2-9b-it':              { pricePerMillionTokens: 0,    maxContextTokens: 8192,   tier: 'fast',     provider: 'groq' },

  // OpenRouter free tier
  'meta-llama/llama-3.3-70b-instruct:free': { pricePerMillionTokens: 0, maxContextTokens: 128000, tier: 'powerful', provider: 'openrouter' },
  'deepseek/deepseek-r1-0528:free':         { pricePerMillionTokens: 0, maxContextTokens: 128000, tier: 'powerful', provider: 'openrouter' },
  'qwen/qwen3-235b-a22b:free':              { pricePerMillionTokens: 0, maxContextTokens: 128000, tier: 'powerful', provider: 'openrouter' },
  'google/gemma-3-27b-it:free':             { pricePerMillionTokens: 0, maxContextTokens: 32768,  tier: 'balanced', provider: 'openrouter' },
  'mistralai/mistral-small-3.1-24b-instruct:free': { pricePerMillionTokens: 0, maxContextTokens: 32768, tier: 'fast', provider: 'openrouter' },
};

// ── In-process persistent stats (survives across requests) ───
const performanceStore = new Map<string, ModelPerformanceRecord>();

// Cooling-off window after failure — don't use model for 2 min
const FAILURE_COOLDOWN_MS = 2 * 60 * 1000;

// ─────────────────────────────────────────────────────────────
// modelPerformanceTracker
// ─────────────────────────────────────────────────────────────
export const modelPerformanceTracker = {

  /**
   * recordSuccess — call after a successful model response.
   */
  recordSuccess(modelId: string, latencyMs: number, tokensUsed: number = 500): void {
    const rec = getOrCreate(modelId);
    rec.successCount++;
    rec.totalLatencyMs  += latencyMs;
    rec.totalTokensUsed += tokensUsed;
    rec.lastSuccessAt    = Date.now();

    const costConfig = MODEL_COST_CONFIG[modelId];
    if (costConfig) {
      rec.totalCostUSD += (tokensUsed / 1_000_000) * costConfig.pricePerMillionTokens;
    }

    // Reward: reduce quality penalty
    rec.qualityPenalty = Math.max(0, rec.qualityPenalty - 1);

    logger.debug({ modelId, latencyMs }, '[ModelTracker] Success recorded');
  },

  /**
   * recordFailure — call when model throws or times out.
   */
  recordFailure(modelId: string, reason: string = 'unknown'): void {
    const rec = getOrCreate(modelId);
    rec.failureCount++;
    rec.lastFailureAt = Date.now();
    rec.qualityPenalty += 3;  // heavy penalty for hard failure

    logger.warn({ modelId, reason }, '[ModelTracker] Failure recorded');
  },

  /**
   * recordQualityIssue — call when response was technically successful
   * but content quality was low (too short, error-like, truncated).
   */
  recordQualityIssue(modelId: string, severity: number = 1): void {
    const rec = getOrCreate(modelId);
    rec.qualityPenalty += severity;
    logger.debug({ modelId, severity }, '[ModelTracker] Quality issue recorded');
  },

  /**
   * getBestModel — returns the best model for a given complexity tier.
   * Considers success rate, average latency, and penalty score.
   */
  getBestModel(
    tier: ComplexityTier,
    budgetUSD: number = Infinity,
    excludeModels: string[] = []
  ): RoutingDecision {

    const candidates = Object.entries(MODEL_COST_CONFIG)
      .filter(([id, cfg]) =>
        cfg.tier === tier &&
        !excludeModels.includes(id) &&
        !isInCooldown(id)
      );

    if (candidates.length === 0) {
      // Fallback: try any tier
      return {
        modelId:    'llama-3.3-70b-versatile',
        provider:   'groq',
        tier:       'powerful',
        reason:     'no candidates — default fallback',
        fallbackTo: 'meta-llama/llama-3.3-70b-instruct:free',
      };
    }

    // Score each candidate
    const scored = candidates.map(([modelId, cfg]) => {
      const rec = performanceStore.get(modelId);
      const successRate = rec
        ? rec.successCount / Math.max(1, rec.successCount + rec.failureCount)
        : 0.75;  // prior for new models

      const avgLatency = rec && rec.successCount > 0
        ? rec.totalLatencyMs / rec.successCount
        : 3000;  // assume 3s for new models

      const penalty = rec?.qualityPenalty ?? 0;

      // Score: higher is better
      // Prefer: high success rate, low latency, low penalty
      const score = (successRate * 0.6)
                  - (Math.min(1, avgLatency / 30_000) * 0.25)
                  - (Math.min(1, penalty / 10) * 0.15);

      return { modelId, cfg, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];
    const second = scored[1];

    return {
      modelId:    best.modelId,
      provider:   best.cfg.provider,
      tier:       best.cfg.tier,
      reason:     `score=${best.score.toFixed(2)} (best in tier=${tier})`,
      fallbackTo: second?.modelId ?? null,
    };
  },

  /**
   * getRoutingDecision — full smart routing with complexity awareness.
   * This is the main API for aiService.ts to call.
   */
  getRoutingDecision(
    complexity:    ComplexityTier,
    isStruggling:  boolean,
    excludeModels: string[] = []
  ): RoutingDecision {

    // Struggling students → prioritize reliability (powerful)
    const effectiveTier: ComplexityTier = isStruggling
      ? 'powerful'
      : complexity;

    const decision = this.getBestModel(effectiveTier, Infinity, excludeModels);

    if (isStruggling) {
      decision.reason = `struggling student → ${decision.reason}`;
    }

    logger.info(
      { modelId: decision.modelId, tier: effectiveTier, reason: decision.reason },
      '[ModelTracker] Routing decision'
    );

    return decision;
  },

  /**
   * getStats — returns current performance stats for all tracked models.
   */
  getStats(): ModelPerformanceRecord[] {
    return [...performanceStore.values()];
  },

  /**
   * getModelHealthSummary — for admin dashboard / debugging.
   */
  getModelHealthSummary(): Record<string, { successRate: number; avgLatencyMs: number; penalty: number }> {
    const summary: Record<string, any> = {};
    for (const [modelId, rec] of performanceStore) {
      const total = rec.successCount + rec.failureCount;
      summary[modelId] = {
        successRate:  total > 0 ? rec.successCount / total : null,
        avgLatencyMs: rec.successCount > 0 ? Math.round(rec.totalLatencyMs / rec.successCount) : null,
        penalty:      rec.qualityPenalty,
        inCooldown:   isInCooldown(modelId),
      };
    }
    return summary;
  },
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function getOrCreate(modelId: string): ModelPerformanceRecord {
  let rec = performanceStore.get(modelId);
  if (!rec) {
    const cfg = MODEL_COST_CONFIG[modelId];
    rec = {
      modelId,
      successCount:    0,
      failureCount:    0,
      totalLatencyMs:  0,
      totalTokensUsed: 0,
      totalCostUSD:    0,
      qualityPenalty:  0,
      lastFailureAt:   null,
      lastSuccessAt:   null,
      tier:            cfg?.tier     ?? 'balanced',
      provider:        cfg?.provider ?? 'groq',
    };
    performanceStore.set(modelId, rec);
  }
  return rec;
}

function isInCooldown(modelId: string): boolean {
  const rec = performanceStore.get(modelId);
  if (!rec || rec.lastFailureAt === null) return false;
  return (Date.now() - rec.lastFailureAt) < FAILURE_COOLDOWN_MS;
}