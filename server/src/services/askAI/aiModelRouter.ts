// ─────────────────────────────────────────────────────────────
// AskAI — aiModelRouter.ts  (v9 — Fixed Priority Routing)
//
// ROUTING RULES (as per product spec):
//
//  Text question  → GROQ first (primary, fast, free)
//                 → OpenRouter fallback (if GROQ fails)
//
//  Image / PDF    → NVIDIA (primary vision model)
//                 → Groq Vision (fallback)
//                 → OpenRouter Vision (last resort)
//
// This file just declares the config. Actual API calls happen
// in aiService.ts — this file tells it WHAT to call.
// ─────────────────────────────────────────────────────────────

import type { Intent }     from './aiResponsePlanner.js';
import type { SkillLevel } from './difficultyAdapter.js';

export type ModelTarget  = 'groq' | 'openrouter' | 'nvidia';
export type QuestionType = 'text' | 'image' | 'pdf';

export interface ModelConfig {
  provider:     ModelTarget;
  modelId:      string;
  reason:       string;
  questionType: QuestionType;
  fallbackChain: FallbackStep[];  // ordered list of providers to try
}

export interface FallbackStep {
  provider: ModelTarget;
  modelId:  string;
}

// ── Text models (GROQ primary, OpenRouter fallback) ───────────
const TEXT_FALLBACK_CHAIN: FallbackStep[] = [
  // 1st priority — GROQ (fast, free, low latency)
  { provider: 'groq',        modelId: 'llama-3.3-70b-versatile'                    },
  { provider: 'groq',        modelId: 'llama-3.1-70b-versatile'                    },
  { provider: 'groq',        modelId: 'mixtral-8x7b-32768'                         },
  // 2nd priority — OpenRouter (if ALL groq models fail)
  { provider: 'openrouter',  modelId: 'meta-llama/llama-3.3-70b-instruct:free'     },
  { provider: 'openrouter',  modelId: 'deepseek/deepseek-r1-0528:free'             },
  { provider: 'openrouter',  modelId: 'qwen/qwen3-235b-a22b:free'                  },
];

// ── Coding specialist chain (GROQ fast → OpenRouter deepseek) ─
const CODING_FALLBACK_CHAIN: FallbackStep[] = [
  { provider: 'groq',        modelId: 'llama-3.3-70b-versatile'                    },
  { provider: 'openrouter',  modelId: 'deepseek/deepseek-coder'                    },
  { provider: 'openrouter',  modelId: 'meta-llama/llama-3.3-70b-instruct:free'     },
];

// ── Math/Science chain (GROQ mixtral best for reasoning) ──────
const MATH_FALLBACK_CHAIN: FallbackStep[] = [
  { provider: 'groq',        modelId: 'mixtral-8x7b-32768'                         },
  { provider: 'groq',        modelId: 'llama-3.3-70b-versatile'                    },
  { provider: 'openrouter',  modelId: 'mistralai/mixtral-8x7b-instruct'            },
  { provider: 'openrouter',  modelId: 'deepseek/deepseek-r1-0528:free'             },
];

// ── Image / PDF chain (NVIDIA primary — NO GROQ/OR for vision) ─
// RULE: Image/PDF always goes to NVIDIA first.
// Groq Vision and OR Vision only if NVIDIA is down.
const VISION_FALLBACK_CHAIN: FallbackStep[] = [
  { provider: 'nvidia',      modelId: 'meta/llama-3.2-11b-vision-instruct'         },
  { provider: 'nvidia',      modelId: 'microsoft/phi-3.5-vision-instruct'          },
  // Only reach here if NVIDIA is completely down
  { provider: 'groq',        modelId: 'meta-llama/llama-4-scout-17b-16e-instruct'  },
  { provider: 'openrouter',  modelId: 'qwen/qwen2.5-vl-72b-instruct:free'          },
  { provider: 'openrouter',  modelId: 'meta-llama/llama-3.2-11b-vision-instruct:free'},
];

// ─────────────────────────────────────────────────────────────
// routeToModel  ← MAIN EXPORT
//
// questionType param is the key decision:
//   'image' or 'pdf' → NVIDIA chain (never touches GROQ/OR first)
//   'text'           → GROQ chain (OR is fallback only)
// ─────────────────────────────────────────────────────────────
export function routeToModel(
  intent:        Intent,
  subjectMode:   string,
  skillLevel:    SkillLevel,
  messageLength: number,
  questionType:  QuestionType = 'text',  // ← NEW param
): ModelConfig {

  // ── IMAGE / PDF — always NVIDIA first ──────────────────────
  if (questionType === 'image' || questionType === 'pdf') {
    return {
      provider:      'nvidia',
      modelId:       'meta/llama-3.2-11b-vision-instruct',
      reason:        'NVIDIA Vision (image/PDF primary)',
      questionType,
      fallbackChain: VISION_FALLBACK_CHAIN,
    };
  }

  // ── TEXT — GROQ first, OpenRouter fallback ─────────────────

  // Coding → GROQ llama + deepseek fallback
  if (subjectMode === 'coding' || intent === 'DEBUG') {
    return {
      provider:      'groq',
      modelId:       'llama-3.3-70b-versatile',
      reason:        'GROQ (coding, fast) → OR deepseek fallback',
      questionType:  'text',
      fallbackChain: CODING_FALLBACK_CHAIN,
    };
  }

  // Math / Science → GROQ mixtral (best reasoning)
  if (subjectMode === 'math' || subjectMode === 'science') {
    return {
      provider:      'groq',
      modelId:       'mixtral-8x7b-32768',
      reason:        'GROQ Mixtral (math/science reasoning)',
      questionType:  'text',
      fallbackChain: MATH_FALLBACK_CHAIN,
    };
  }

  // Default text → GROQ llama (fastest), OR fallback
  return {
    provider:      'groq',
    modelId:       'llama-3.3-70b-versatile',
    reason:        'GROQ (text primary) → OpenRouter fallback',
    questionType:  'text',
    fallbackChain: TEXT_FALLBACK_CHAIN,
  };
}

// ─────────────────────────────────────────────────────────────
// isVisionRequest  — helper for controller
// Call this to decide PATH A (image) vs PATH B (text stream)
// ─────────────────────────────────────────────────────────────
export function isVisionRequest(questionType: QuestionType): boolean {
  return questionType === 'image' || questionType === 'pdf';
}

// ─────────────────────────────────────────────────────────────
// getModelNote  (for logging)
// ─────────────────────────────────────────────────────────────
export function getModelNote(config: ModelConfig): string {
  const chain = config.fallbackChain
    .map(f => `${f.provider}/${f.modelId.split('/').pop()}`)
    .join(' → ');
  return `[Router: ${config.provider}/${config.modelId} | Chain: ${chain}]`;
}