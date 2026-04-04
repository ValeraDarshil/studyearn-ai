// ─────────────────────────────────────────────────────────────
// AskAI — aiModelRouter.ts
// Smart routing: coding → deepseek, fast → groq, complex → mixtral
// Reads GROQ_API_KEY / OPENROUTER_API_KEY from env.
// ─────────────────────────────────────────────────────────────

import type { Intent } from './aiResponsePlanner.js';
import type { SkillLevel } from './difficultyAdapter.js';

export type ModelTarget = 'groq' | 'openrouter' | 'nvidia';

export interface ModelConfig {
  provider: ModelTarget;
  modelId:  string;
  reason:   string;
}

// ── Available models ──────────────────────────────────────────
const MODELS = {
  // GROQ — fast inference, great for quick explanations
  groqLlama:  { provider: 'groq' as ModelTarget, modelId: 'llama-3.1-70b-versatile',    reason: 'Fast general Q&A'        },
  groqMixtral:{ provider: 'groq' as ModelTarget, modelId: 'mixtral-8x7b-32768',          reason: 'Fast reasoning'           },

  // OpenRouter — specialist models
  deepseek:   { provider: 'openrouter' as ModelTarget, modelId: 'deepseek/deepseek-coder', reason: 'Coding specialist'      },
  claude:     { provider: 'openrouter' as ModelTarget, modelId: 'anthropic/claude-3-haiku', reason: 'Complex reasoning'     },
  mistral:    { provider: 'openrouter' as ModelTarget, modelId: 'mistralai/mixtral-8x7b-instruct', reason: 'Math & science' },
};

// ─────────────────────────────────────────────────────────────
// routeToModel
// ─────────────────────────────────────────────────────────────
export function routeToModel(
  intent:      Intent,
  subjectMode: string,
  skillLevel:  SkillLevel,
  messageLength: number,
): ModelConfig {

  // Coding → deepseek specialist
  if (subjectMode === 'coding' || intent === 'DEBUG') {
    return MODELS.deepseek;
  }

  // Math / Science deep problems → mixtral via groq
  if (subjectMode === 'math' || subjectMode === 'science') {
    if (skillLevel === 'advanced' || intent === 'SOLVE') {
      return MODELS.groqMixtral;
    }
  }

  // Complex / long questions → mixtral
  if (messageLength > 300 || intent === 'CONCEPTUAL') {
    return MODELS.groqMixtral;
  }

  // Short follow-ups, simple questions → fastest model
  if (intent === 'FOLLOWUP' || messageLength < 80) {
    return MODELS.groqLlama;
  }

  // Default: groq llama (fast + good)
  return MODELS.groqLlama;
}

// ─────────────────────────────────────────────────────────────
// getModelNote  (for logging / debug)
// ─────────────────────────────────────────────────────────────
export function getModelNote(config: ModelConfig): string {
  return `[Router: ${config.provider}/${config.modelId} — ${config.reason}]`;
}