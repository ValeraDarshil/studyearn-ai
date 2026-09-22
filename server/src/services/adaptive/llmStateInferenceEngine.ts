/**
 * AI Study OS — LLM State Inference Engine  (BRAIN UPGRADE — Phase 1a)
 * ─────────────────────────────────────────────────────────────
 * WHY THIS EXISTS:
 *   userStateInferenceEngine.ts detects confusion/frustration/mastery
 *   using a fixed list of regex phrases ("samajh nahi", "i don't get it",
 *   etc.). That catches the OBVIOUS cases but misses:
 *     - Indirect confusion ("wait so is X the same as Y then?")
 *     - Sarcasm / passive frustration ("sure, that TOTALLY makes sense")
 *     - Any phrasing not in the pattern list — which is most of them
 *   Regex can never generalize. A real language model can.
 *
 * DESIGN PRINCIPLE — THIS ENGINE NEVER BREAKS THE PIPELINE:
 *   It is an ENHANCEMENT layer, not a replacement. If the LLM call is
 *   slow, down, rate-limited, or returns garbage, this engine returns
 *   `null` and the caller silently keeps using regex-only inference.
 *   Every failure path is caught. Nothing here ever throws upward.
 *
 * LATENCY BUDGET:
 *   Runs in PARALLEL with longTermMemoryEngine/memoryRetrievalEngine
 *   inside aiBrainCore's existing Promise.allSettled batch — it adds
 *   ZERO serial latency to the pipeline when it succeeds in budget,
 *   and a hard 3.5s timeout means it can never meaningfully stall a
 *   response even in the worst case.
 *
 * Integration:
 *   • aiBrainCore.ts               — fired alongside STEP 2.1 memory calls
 *   • userStateInferenceEngine.ts  — mergeWithLLMSignal() blends the result
 */

import { logger } from '../../utils/logger.js';

// ── Config ────────────────────────────────────────────────────
const GROQ_KEY        = process.env.GROQ_API_KEY || '';
const GROQ_URL         = 'https://api.groq.com/openai/v1/chat/completions';
const LLM_MODEL        = 'llama-3.3-70b-versatile';   // same fast model used elsewhere in this codebase
const TIMEOUT_MS       = 3_500;                        // hard budget — never allowed to stall the brain pipeline
const MAX_MESSAGE_CHARS = 600;                          // classification doesn't need the full essay

// ── Types ──────────────────────────────────────────────────────
export type LLMEmotion = 'confused' | 'frustrated' | 'motivated' | 'neutral' | 'curious' | 'overloaded';

export interface LLMInferredState {
  emotion:          LLMEmotion;
  confusionScore:   number;   // 0–1
  frustrationScore: number;   // 0–1
  masterySignal:    boolean;
  confidence:        number;  // 0–1 — how sure the model is about this read
  reasoning:         string;  // one short phrase, for logs/debugging only
}

interface RawLLMShape {
  emotion?:          unknown;
  confusion?:        unknown;
  frustration?:      unknown;
  mastery?:          unknown;
  confidence?:       unknown;
  reasoning?:        unknown;
}

const VALID_EMOTIONS: readonly LLMEmotion[] = ['confused', 'frustrated', 'motivated', 'neutral', 'curious', 'overloaded'];

// ── Prompt ────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You classify a student's emotional/comprehension state from ONE chat message.
The student may write in English, Hindi, or Hinglish (mixed). Read the full meaning, tone and subtext — not just keywords.

Reply with ONLY a raw JSON object, nothing else, no markdown fences, in EXACTLY this shape:
{"emotion":"confused|frustrated|motivated|neutral|curious|overloaded","confusion":0.0,"frustration":0.0,"mastery":false,"confidence":0.0,"reasoning":"3-6 words"}

Rules:
- confusion/frustration/confidence are numbers between 0 and 1.
- mastery is true ONLY if the student clearly shows they understood something (e.g. "ohh got it", "that makes sense now").
- If the message is neutral/plain (a new question, a fact, small talk) set emotion="neutral", confusion=0, frustration=0.
- Be conservative: don't invent confusion/frustration that isn't really there.`;

// ── Helper: strip code fences some models add despite instructions ─
function stripCodeFences(text: string): string {
  return text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
}

function clamp01(n: unknown): number {
  const v = typeof n === 'number' ? n : parseFloat(String(n));
  if (Number.isNaN(v)) return 0;
  return Math.min(1, Math.max(0, v));
}

function validateShape(raw: RawLLMShape): LLMInferredState | null {
  const emotion = VALID_EMOTIONS.includes(raw.emotion as LLMEmotion)
    ? (raw.emotion as LLMEmotion)
    : null;
  if (!emotion) return null; // malformed — reject rather than guess

  return {
    emotion,
    confusionScore:   clamp01(raw.confusion),
    frustrationScore: clamp01(raw.frustration),
    masterySignal:    raw.mastery === true,
    confidence:       clamp01(raw.confidence),
    reasoning:        typeof raw.reasoning === 'string' ? raw.reasoning.slice(0, 80) : '',
  };
}

// ─────────────────────────────────────────────────────────────
// llmStateInferenceEngine
// ─────────────────────────────────────────────────────────────
export const llmStateInferenceEngine = {

  /**
   * infer — best-effort LLM read of student emotional/comprehension state.
   * Returns null on ANY failure (timeout, no API key, bad JSON, malformed
   * shape, network error) — caller MUST treat null as "no signal available"
   * and fall back to regex-only inference. This function never throws.
   */
  async infer(message: string, recentContextHint?: string): Promise<LLMInferredState | null> {
    if (!GROQ_KEY) return null;           // no key configured — silently skip, regex still works
    if (!message || message.trim().length < 3) return null; // nothing meaningful to classify

    const trimmedMessage = message.slice(0, MAX_MESSAGE_CHARS);
    const userPrompt = recentContextHint
      ? `Previous AI reply topic: ${recentContextHint.slice(0, 150)}\nStudent's message: "${trimmedMessage}"`
      : `Student's message: "${trimmedMessage}"`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(GROQ_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({
          model:           LLM_MODEL,
          temperature:     0.1,           // classification, not creative writing — keep it deterministic
          max_tokens:      120,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user',   content: userPrompt },
          ],
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        logger.warn({ status: res.status }, '[LLMStateInference] Groq returned non-OK, falling back to regex');
        return null;
      }

      const data = await res.json();
      const content: string | undefined = data?.choices?.[0]?.message?.content;
      if (!content) return null;

      let parsed: RawLLMShape;
      try {
        parsed = JSON.parse(stripCodeFences(content));
      } catch {
        logger.warn('[LLMStateInference] JSON parse failed, falling back to regex');
        return null;
      }

      const validated = validateShape(parsed);
      if (!validated) {
        logger.warn({ raw: content.slice(0, 100) }, '[LLMStateInference] Malformed shape, falling back to regex');
        return null;
      }

      logger.debug(
        { emotion: validated.emotion, confidence: validated.confidence },
        '[LLMStateInference] Inferred successfully',
      );
      return validated;

    } catch (err: any) {
      // Covers: abort/timeout, network error, DNS failure — all non-fatal.
      const reason = err?.name === 'AbortError' ? 'timeout' : err?.message || 'unknown';
      logger.warn({ reason }, '[LLMStateInference] Call failed, falling back to regex-only');
      return null;
    } finally {
      clearTimeout(timer);
    }
  },
};