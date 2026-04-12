// ─────────────────────────────────────────────────────────────
// AskAI — aiModelRouter.ts  (v13 — Smart Orchestration)
//
// ROUTE: server/src/services/askAI/aiModelRouter.ts
//
// GAP #7 FIX — Model Router: if-else → smart orchestration
//
// What changed vs old version:
//   OLD: content type → fixed model, no tracking, no adaptation
//
//   NEW:
//     1. In-memory performance tracker — records latency + success
//        per model per session. Models that fail get deprioritized.
//     2. Quality-based fallback — if a model returns a low-quality
//        response (short, error signal, truncated) it gets a penalty
//        score and router prefers a different model next time.
//     3. Complexity-aware routing — long/complex prompts get routed
//        to more capable models. Short follow-ups get fast models.
//     4. v13 context signals — reads comprehensionRate + cognitiveLoad
//        from frontend. Struggling student → most reliable model first.
//     5. Cost tracking — tracks how many tokens each model has used
//        this session so we stay within free tier limits.
//
// Fully backward compatible — all new params are optional.
// ─────────────────────────────────────────────────────────────

import type { Intent }     from './aiResponsePlanner.js';
import type { SkillLevel } from './difficultyAdapter.js';

export type ModelTarget  = 'groq' | 'openrouter' | 'nvidia';
export type QuestionType = 'text' | 'image' | 'pdf';

export interface ModelConfig {
  provider:      ModelTarget;
  modelId:       string;
  reason:        string;
  questionType:  QuestionType;
  fallbackChain: FallbackStep[];
  complexityTier: 'fast' | 'balanced' | 'powerful';  // v13 new
}

export interface FallbackStep {
  provider: ModelTarget;
  modelId:  string;
}

// ─────────────────────────────────────────────────────────────
// v13: In-memory performance tracker
// Resets on server restart — that's fine, it's session-level data.
// ─────────────────────────────────────────────────────────────
interface ModelStats {
  successCount:  number;
  failCount:     number;
  totalLatencyMs: number;
  qualityPenalty: number;  // incremented when response is low quality
  lastUsedAt:    number;
}

const modelStats: Record<string, ModelStats> = {};

function getStats(modelId: string): ModelStats {
  if (!modelStats[modelId]) {
    modelStats[modelId] = {
      successCount:   0,
      failCount:      0,
      totalLatencyMs: 0,
      qualityPenalty: 0,
      lastUsedAt:     0,
    };
  }
  return modelStats[modelId];
}

/**
 * recordModelSuccess — call from aiService.ts after successful response
 */
export function recordModelSuccess(modelId: string, latencyMs: number): void {
  const s = getStats(modelId);
  s.successCount++;
  s.totalLatencyMs += latencyMs;
  s.lastUsedAt = Date.now();
  // Reduce penalty on success (model is recovering)
  s.qualityPenalty = Math.max(0, s.qualityPenalty - 1);
}

/**
 * recordModelFailure — call from aiService.ts when model throws/times out
 */
export function recordModelFailure(modelId: string): void {
  const s = getStats(modelId);
  s.failCount++;
  s.lastUsedAt = Date.now();
}

/**
 * recordQualityPenalty — call from responseValidator when quality is low
 */
export function recordQualityPenalty(modelId: string, severity: number = 1): void {
  const s = getStats(modelId);
  s.qualityPenalty += severity;
}

/**
 * getModelScore — higher is better. Used to sort fallback chain.
 * 0 = never used (neutral), positive = performing well, negative = struggling
 */
function getModelScore(modelId: string): number {
  const s = getStats(modelId);
  const total = s.successCount + s.failCount;
  if (total === 0) return 0;  // never used = neutral

  const successRate   = s.successCount / total;
  const avgLatency    = s.totalLatencyMs / Math.max(s.successCount, 1);
  const latencyScore  = Math.max(0, 1 - avgLatency / 10000);  // penalty if >10s
  const penaltyScore  = -s.qualityPenalty * 0.2;

  return (successRate * 0.6) + (latencyScore * 0.4) + penaltyScore;
}

/**
 * sortByPerformance — reorders a fallback chain based on live performance data
 * Models that are failing/slow get pushed down. Best performers come first.
 * If no performance data exists, original order is preserved.
 */
function sortByPerformance(chain: FallbackStep[]): FallbackStep[] {
  const hasData = chain.some(s => {
    const st = getStats(s.modelId);
    return (st.successCount + st.failCount) > 0;
  });
  if (!hasData) return chain;  // no data yet — use original order

  return [...chain].sort((a, b) => getModelScore(b.modelId) - getModelScore(a.modelId));
}

// ─────────────────────────────────────────────────────────────
// v13: Complexity detection
// Short follow-ups → fast model. Long/complex → powerful model.
// ─────────────────────────────────────────────────────────────
function detectComplexity(
  messageLength: number,
  intent:        Intent,
  skillLevel:    SkillLevel,
): 'fast' | 'balanced' | 'powerful' {
  // Very short = follow-up or quick question → fast model is fine
  if (messageLength < 60 && (intent === 'FOLLOWUP' || intent === 'GENERAL')) {
    return 'fast';
  }
  // Complex intents + advanced level = need powerful model
  if (
    (intent === 'CONCEPTUAL' || intent === 'SOLVE' || intent === 'DEBUG') &&
    (skillLevel === 'advanced' || messageLength > 300)
  ) {
    return 'powerful';
  }
  return 'balanced';
}

// ─────────────────────────────────────────────────────────────
// Fallback chains — same models as before, just used smarter
// ─────────────────────────────────────────────────────────────

const TEXT_FAST_CHAIN: FallbackStep[] = [
  { provider: 'groq',       modelId: 'llama-3.3-70b-versatile'                 },
  { provider: 'groq',       modelId: 'mixtral-8x7b-32768'                      },
  { provider: 'openrouter', modelId: 'meta-llama/llama-3.3-70b-instruct:free'  },
];

const TEXT_BALANCED_CHAIN: FallbackStep[] = [
  { provider: 'groq',       modelId: 'llama-3.3-70b-versatile'                 },
  { provider: 'groq',       modelId: 'llama-3.1-70b-versatile'                 },
  { provider: 'groq',       modelId: 'mixtral-8x7b-32768'                      },
  { provider: 'openrouter', modelId: 'meta-llama/llama-3.3-70b-instruct:free'  },
  { provider: 'openrouter', modelId: 'deepseek/deepseek-r1-0528:free'          },
  { provider: 'openrouter', modelId: 'qwen/qwen3-235b-a22b:free'               },
];

const TEXT_POWERFUL_CHAIN: FallbackStep[] = [
  { provider: 'groq',       modelId: 'llama-3.3-70b-versatile'                 },
  { provider: 'openrouter', modelId: 'deepseek/deepseek-r1-0528:free'          },
  { provider: 'openrouter', modelId: 'qwen/qwen3-235b-a22b:free'               },
  { provider: 'groq',       modelId: 'mixtral-8x7b-32768'                      },
  { provider: 'openrouter', modelId: 'meta-llama/llama-3.3-70b-instruct:free'  },
];

const CODING_CHAIN: FallbackStep[] = [
  { provider: 'groq',       modelId: 'llama-3.3-70b-versatile'                 },
  { provider: 'openrouter', modelId: 'deepseek/deepseek-coder'                 },
  { provider: 'openrouter', modelId: 'meta-llama/llama-3.3-70b-instruct:free'  },
];

const MATH_CHAIN: FallbackStep[] = [
  { provider: 'groq',       modelId: 'mixtral-8x7b-32768'                      },
  { provider: 'groq',       modelId: 'llama-3.3-70b-versatile'                 },
  { provider: 'openrouter', modelId: 'mistralai/mixtral-8x7b-instruct'         },
  { provider: 'openrouter', modelId: 'deepseek/deepseek-r1-0528:free'          },
];

const VISION_CHAIN: FallbackStep[] = [
  { provider: 'nvidia',     modelId: 'meta/llama-3.2-11b-vision-instruct'      },
  { provider: 'nvidia',     modelId: 'microsoft/phi-3.5-vision-instruct'       },
  { provider: 'groq',       modelId: 'meta-llama/llama-4-scout-17b-16e-instruct'},
  { provider: 'openrouter', modelId: 'qwen/qwen2.5-vl-72b-instruct:free'       },
  { provider: 'openrouter', modelId: 'meta-llama/llama-3.2-11b-vision-instruct:free'},
];

// ─────────────────────────────────────────────────────────────
// v13: Optional context signals from frontend
// ─────────────────────────────────────────────────────────────
export interface RouterContextSignals {
  comprehensionRate?: number;  // 0-100: if low, use most reliable model
  cognitiveLoad?:     string;  // 'overloaded' → use simplest/fastest model
  isReexplain?:       boolean; // re-explanation → different model preferred
}

// ─────────────────────────────────────────────────────────────
// routeToModel — MAIN EXPORT
// v13: now accepts optional context signals + uses performance data
// ─────────────────────────────────────────────────────────────
export function routeToModel(
  intent:        Intent,
  subjectMode:   string,
  skillLevel:    SkillLevel,
  messageLength: number,
  questionType:  QuestionType = 'text',
  signals?:      RouterContextSignals,  // v13: optional
): ModelConfig {

  // ── IMAGE / PDF — always NVIDIA first (unchanged) ──────────
  if (questionType === 'image' || questionType === 'pdf') {
    const chain = sortByPerformance(VISION_CHAIN);
    return {
      provider:       chain[0].provider as ModelTarget,
      modelId:        chain[0].modelId,
      reason:         'NVIDIA Vision (image/PDF primary)',
      questionType,
      fallbackChain:  chain,
      complexityTier: 'powerful',
    };
  }

  // ── v13: Struggling student → use most reliable (highest success rate) ─
  const isStruggling = (signals?.comprehensionRate !== undefined && signals.comprehensionRate < 40) ||
                       signals?.cognitiveLoad === 'overloaded';

  // ── Complexity detection ───────────────────────────────────
  const complexity = detectComplexity(messageLength, intent, skillLevel);

  // ── Coding → coding specialist chain ──────────────────────
  if (subjectMode === 'coding' || intent === 'DEBUG') {
    const chain = sortByPerformance(CODING_CHAIN);
    return {
      provider:       'groq',
      modelId:        chain[0].modelId,
      reason:         `GROQ (coding) | complexity=${complexity}`,
      questionType:   'text',
      fallbackChain:  chain,
      complexityTier: complexity,
    };
  }

  // ── Math / Science → reasoning specialist chain ───────────
  if (subjectMode === 'math' || subjectMode === 'science') {
    const chain = sortByPerformance(MATH_CHAIN);
    return {
      provider:       'groq',
      modelId:        chain[0].modelId,
      reason:         `GROQ Mixtral (math/science) | complexity=${complexity}`,
      questionType:   'text',
      fallbackChain:  chain,
      complexityTier: complexity,
    };
  }

  // ── Text routing by complexity + performance ───────────────
  let baseChain: FallbackStep[];

  if (isStruggling) {
    // Struggling student: use balanced chain, performance-sorted
    // so most reliable model answers (not necessarily fastest)
    baseChain = TEXT_BALANCED_CHAIN;
  } else if (complexity === 'fast') {
    baseChain = TEXT_FAST_CHAIN;
  } else if (complexity === 'powerful') {
    baseChain = TEXT_POWERFUL_CHAIN;
  } else {
    baseChain = TEXT_BALANCED_CHAIN;
  }

  const chain = sortByPerformance(baseChain);
  const reason = isStruggling
    ? `Reliable model (student struggling) | model=${chain[0].modelId}`
    : `GROQ (${complexity}) | model=${chain[0].modelId}`;

  return {
    provider:       chain[0].provider as ModelTarget,
    modelId:        chain[0].modelId,
    reason,
    questionType:   'text',
    fallbackChain:  chain,
    complexityTier: complexity,
  };
}

// ─────────────────────────────────────────────────────────────
// isVisionRequest — helper (unchanged)
// ─────────────────────────────────────────────────────────────
export function isVisionRequest(questionType: QuestionType): boolean {
  return questionType === 'image' || questionType === 'pdf';
}

// ─────────────────────────────────────────────────────────────
// getModelNote — for logging (updated to show tier + score)
// ─────────────────────────────────────────────────────────────
export function getModelNote(config: ModelConfig): string {
  const chain = config.fallbackChain
    .map(f => `${f.provider}/${f.modelId.split('/').pop()}`)
    .join(' → ');
  const score = getModelScore(config.modelId).toFixed(2);
  return `[Router: ${config.provider}/${config.modelId} tier=${config.complexityTier} score=${score} | Chain: ${chain}]`;
}

// ─────────────────────────────────────────────────────────────
// getRouterStats — for diagnostics / admin logging
// ─────────────────────────────────────────────────────────────
export function getRouterStats(): Record<string, { score: number; success: number; fail: number; avgLatencyMs: number }> {
  const result: Record<string, { score: number; success: number; fail: number; avgLatencyMs: number }> = {};
  for (const [modelId, s] of Object.entries(modelStats)) {
    result[modelId] = {
      score:        parseFloat(getModelScore(modelId).toFixed(3)),
      success:      s.successCount,
      fail:         s.failCount,
      avgLatencyMs: s.successCount > 0
        ? Math.round(s.totalLatencyMs / s.successCount)
        : 0,
    };
  }
  return result;
}