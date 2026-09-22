/**
 * AI Study OS — LLM Mentor Message Generator  (MENTOR UPGRADE — Phase 1b)
 * ─────────────────────────────────────────────────────────────
 * WHY THIS EXISTS:
 *   mentorMessageGenerator.ts is a lookup table: 10 triggers × 3
 *   personalities × 2 languages = 60 fixed strings with variables
 *   swapped in ({streak}, {weakTopic}...). Every student who breaks a
 *   7-day streak with a "motivational" mentor in Hinglish gets the
 *   EXACT SAME message, word for word. That's not a personality —
 *   it's a phrasebook. It can never reference what a specific student
 *   is actually going through beyond one or two interpolated numbers.
 *
 * WHAT THIS ADDS:
 *   A real LLM call that writes a fresh, specific message every time —
 *   grounded in the actual trigger, the student's real weak topics,
 *   streak, and (when available) the churn-risk signals driving why
 *   the mentor is speaking up right now. Same JSON-shaped output as
 *   the template system, so nothing downstream (UI, DB schema) changes.
 *
 * SAFETY — ZERO REGRESSION RISK:
 *   The original mentorMessageGenerator.ts is UNCHANGED and is called
 *   here as the fallback. If the LLM call fails, times out, returns
 *   malformed JSON, or produces a message that's suspiciously long/
 *   short/off-shape, this engine silently falls back to the proven
 *   template system. The mentor NEVER fails to send a message because
 *   of this upgrade — worst case, it just sends what it always sent.
 *
 * Integration:
 *   • aiMentorEngine.ts — replaces the direct mentorMessageGenerator
 *     .generateMentorMessage() call. mentorMessageGenerator.ts itself
 *     is untouched (aside from the new AT_RISK_PREDICTED templates
 *     added alongside the new trigger).
 */

import { BehaviorSnapshot }                                   from './behaviorAnalyzer.js';
import { MentorTrigger }                                      from './mentorTriggerEngine.js';
import {
  generateMentorMessage as generateTemplateMessage,
  MentorMessage, MentorPersonality, MentorLanguage,
}                                                               from './mentorMessageGenerator.js';
import { StudentProfile }                                     from '../../models/StudentProfile.model.js';
import { ChurnRiskAssessment }                                 from './churnPredictionEngine.js';
import { logger }                                              from '../../utils/logger.js';

// ── Config ────────────────────────────────────────────────────
const GROQ_KEY   = process.env.GROQ_API_KEY || '';
const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';
const LLM_MODEL  = 'llama-3.3-70b-versatile';
const TIMEOUT_MS = 3_500;

// Sanity bounds — matched loosely to what the existing templates
// actually produce, so an LLM message "looks" like it belongs in the
// same UI without needing any frontend changes.
const MAX_TITLE_LEN = 70;
const MAX_BODY_LEN  = 320;
const MAX_CTA_LEN   = 35;
const MAX_HINT_LEN  = 70;
const MIN_BODY_LEN  = 15; // reject suspiciously empty/truncated responses

interface RawLLMMessage {
  title?:    unknown;
  body?:     unknown;
  cta?:      unknown;
  taskHint?: unknown;
  emoji?:    unknown;
}

const PERSONALITY_VOICE: Record<MentorPersonality, string> = {
  friendly:      'warm, casual, encouraging friend — supportive, never pushy',
  strict:        'direct, no-nonsense coach — short sentences, zero fluff, firm but not mean',
  motivational:  'high-energy motivator — inspiring language, but genuine, not cringe or over-the-top',
};

function stripCodeFences(text: string): string {
  return text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
}

function validateShape(raw: RawLLMMessage): Omit<MentorMessage, 'triggerType' | 'personality' | 'language' | 'generatedAt'> | null {
  const title    = typeof raw.title === 'string' ? raw.title.trim() : '';
  const body     = typeof raw.body === 'string' ? raw.body.trim() : '';
  const cta      = typeof raw.cta === 'string' ? raw.cta.trim() : '';
  const taskHint = typeof raw.taskHint === 'string' ? raw.taskHint.trim() : '';
  const emoji    = typeof raw.emoji === 'string' ? raw.emoji.trim() : '';

  if (!title || !body || !cta || !taskHint) return null;
  if (body.length < MIN_BODY_LEN) return null;
  if (title.length > MAX_TITLE_LEN || body.length > MAX_BODY_LEN ||
      cta.length > MAX_CTA_LEN || taskHint.length > MAX_HINT_LEN) return null;

  return {
    title, body, cta, taskHint,
    emoji: emoji || '💬',
  };
}

function buildPrompt(
  snap:         BehaviorSnapshot,
  trigger:      MentorTrigger,
  personality:  MentorPersonality,
  language:     MentorLanguage,
  risk:         ChurnRiskAssessment | null,
): string {
  const lines: string[] = [];
  lines.push(`Trigger: ${trigger.type} — ${trigger.reason}`);
  lines.push(`Current streak: ${snap.currentStreak} days`);
  if (snap.weakTopics.length)   lines.push(`Weak topics: ${snap.weakTopics.slice(0, 3).join(', ')}`);
  if (snap.strongTopics.length) lines.push(`Strong topics: ${snap.strongTopics.slice(0, 2).join(', ')}`);
  lines.push(`Recent quiz accuracy: ${Math.round(snap.recentAccuracy * 100)}%`);
  if (risk && risk.signals.length) lines.push(`Underlying signals: ${risk.signals.join('; ')}`);
  lines.push(`Write in: ${language === 'hinglish' ? 'Hinglish (natural Hindi-English mix, like texting a friend)' : 'English'}`);
  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────
// llmMentorMessageGenerator
// ─────────────────────────────────────────────────────────────
export const llmMentorMessageGenerator = {

  /**
   * generateSmartMentorMessage — tries an LLM-personalized message first,
   * falls back to the proven template system on ANY failure. Always
   * resolves with a valid MentorMessage — never throws, never returns
   * a partial/malformed message to the caller.
   */
  async generateSmartMentorMessage(
    snap:               BehaviorSnapshot,
    trigger:            MentorTrigger,
    personality?:       MentorPersonality,
    riskContext?:       ChurnRiskAssessment | null,
  ): Promise<MentorMessage> {

    // Template fallback needs the student's own style, same lookup the
    // original generator does — resolve it once, reuse for both paths.
    let language: MentorLanguage = 'english';
    let style: MentorPersonality = personality ?? 'motivational';
    try {
      const profile = await StudentProfile.findOne({ userId: snap.userId })
        .select('preferredLanguage')
        .lean();
      language = ((profile as any)?.preferredLanguage ?? 'english') as MentorLanguage;
    } catch { /* non-fatal — default to english, template path will re-resolve anyway */ }

    if (!GROQ_KEY) {
      return generateTemplateMessage(snap, trigger, personality);
    }

    const llmResult = await tryLLM(snap, trigger, style, language, riskContext ?? null);
    if (llmResult) {
      logger.info({ userId: snap.userId, trigger: trigger.type }, '[LLMMentorMessage] Personalized message generated');
      return {
        ...llmResult,
        triggerType: trigger.type,
        personality: style,
        language,
        generatedAt: new Date().toISOString(),
      };
    }

    // Any failure path (timeout, bad JSON, out-of-bounds content) → proven fallback.
    logger.info({ userId: snap.userId, trigger: trigger.type }, '[LLMMentorMessage] Falling back to template');
    return generateTemplateMessage(snap, trigger, personality);
  },
};

// ─────────────────────────────────────────────────────────────
// Internal: single best-effort LLM attempt. Returns null on ANY issue.
// ─────────────────────────────────────────────────────────────
async function tryLLM(
  snap:        BehaviorSnapshot,
  trigger:     MentorTrigger,
  personality: MentorPersonality,
  language:    MentorLanguage,
  risk:        ChurnRiskAssessment | null,
): Promise<Omit<MentorMessage, 'triggerType' | 'personality' | 'language' | 'generatedAt'> | null> {

  const systemPrompt = `You are an AI study mentor writing a short push-notification-style message to a student.
Voice: ${PERSONALITY_VOICE[personality]}.
Reply with ONLY a raw JSON object, no markdown fences, in EXACTLY this shape:
{"emoji":"single emoji","title":"short hook, under 60 chars","body":"1-3 sentences, under 280 chars","cta":"short button label, under 30 chars","taskHint":"one short action, under 60 chars"}
Be specific to the details given — reference the actual topic/streak/accuracy naturally, don't just restate the trigger name. Never invent facts not given to you.`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(GROQ_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model:           LLM_MODEL,
        temperature:     0.85,   // creative variation is the whole point here
        max_tokens:      220,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: buildPrompt(snap, trigger, personality, language, risk) },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      logger.warn({ status: res.status }, '[LLMMentorMessage] Groq returned non-OK');
      return null;
    }

    const data = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) return null;

    let parsed: RawLLMMessage;
    try {
      parsed = JSON.parse(stripCodeFences(content));
    } catch {
      logger.warn('[LLMMentorMessage] JSON parse failed');
      return null;
    }

    return validateShape(parsed);

  } catch (err: any) {
    const reason = err?.name === 'AbortError' ? 'timeout' : err?.message || 'unknown';
    logger.warn({ reason }, '[LLMMentorMessage] Call failed');
    return null;
  } finally {
    clearTimeout(timer);
  }
}