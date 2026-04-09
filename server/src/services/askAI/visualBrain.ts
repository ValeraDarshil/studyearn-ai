// ─────────────────────────────────────────────────────────────
// Visual Brain Service — visualBrain.ts
//
// Ek AI-powered "brain" jo plain text response ko analyze karke
// decides: kaunsi lines ko kaunsa visual treatment dena hai.
//
// OUTPUT: JSON array of segments — each with type, content, style
//
// Types:
//   "lead"     — first impactful sentence, brighter
//   "body"     — normal paragraph text
//   "key"      — single most important insight (amber)
//   "analogy"  — real-world example (teal italic)
//   "formula"  — equation/formula (monospace indigo)
//   "warning"  — caution/mistake (red)
//   "hook"     — curiosity/explore-next (orange italic)
//   "list"     — bullet list items
//   "heading"  — section heading
//
// HIGHLIGHT WORDS: brain picks max 3-4 UNIQUE important terms
// per response — not repeated, not generic
// ─────────────────────────────────────────────────────────────

import { logger } from '../../utils/logger.js';

const GROQ_KEY = (globalThis as any).process?.env?.GROQ_API_KEY || '';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface VisualSegment {
  type:       'lead' | 'body' | 'key' | 'analogy' | 'formula' | 'warning' | 'hook' | 'heading';
  content:    string;
  highlights: string[];  // exact words/phrases from content to highlight (max 3 per segment)
  emoji?:     string;    // optional emoji prefix
}

export interface VisualBrainOutput {
  segments:   VisualSegment[];
  rawUsed:    boolean;  // true if brain was used, false if fallback
}

const BRAIN_SYSTEM = `You are a Visual Learning Designer for an AI education platform for Indian students.

Your job: analyze an AI tutor's text response and return a JSON array that describes how to visually present it.

RULES FOR SEGMENTS:
1. Break the response into logical segments — each segment is one coherent thought
2. Classify each segment with these types ONLY:
   - "lead": the opening statement / core definition (first 1-2 sentences, most impactful)
   - "body": regular explanation text
   - "key": the single most important insight students must remember
   - "analogy": any real-world comparison ("think of it like", "imagine", "just like")
   - "formula": any mathematical equation, formula, or code snippet
   - "warning": common mistakes, cautions, things to avoid
   - "hook": curiosity-sparking next step ("did you know", "next interesting thing")
   - "heading": section headings or labels

3. HIGHLIGHT WORDS — per segment, pick max 2-3 words that are:
   - Domain-specific technical terms (e.g., "Newton's 3rd Law", "equal and opposite", "F = ma")
   - Key answer words (the actual answer to what was asked)
   - NOT common words like "the", "is", "and", "also", "very"
   - NOT repeated — if a word appears in highlights already, don't highlight it again
   - Be selective — most body segments should have 0-1 highlights, not 3

4. EMOJI — add one natural emoji only for: lead, key, analogy, formula, warning, hook segments
   - lead: matching subject emoji (⚛️ for physics, 🧮 for math, 💻 for coding, 🌍 for geo, etc.)
   - key: 🔑
   - analogy: 🌍 or 💡
   - formula: 📐
   - warning: ⚠️
   - hook: 🚀

OUTPUT FORMAT (strict JSON, no markdown, no explanation):
[
  {"type": "lead", "content": "exact text here", "highlights": ["Newton's 3rd Law"], "emoji": "⚛️"},
  {"type": "body", "content": "exact text here", "highlights": []},
  {"type": "analogy", "content": "exact text here", "highlights": ["ball", "racket"], "emoji": "🌍"},
  {"type": "key", "content": "exact text here", "highlights": ["equal and opposite"], "emoji": "🔑"},
  {"type": "formula", "content": "F = ma", "highlights": ["F", "ma"], "emoji": "📐"},
  {"type": "hook", "content": "exact text here", "highlights": [], "emoji": "🚀"}
]

IMPORTANT:
- Return ONLY the JSON array — no other text
- Keep segment content EXACTLY as in the original — don't rephrase or shorten
- Don't split mid-sentence unless it's a clear new thought
- Max 8 segments for a typical response (don't over-segment)`;

export async function analyzeWithVisualBrain(
  aiResponse: string,
  subjectMode: string,
): Promise<VisualBrainOutput> {
  // Only analyze responses > 100 chars (skip short answers)
  if (!GROQ_KEY || aiResponse.length < 100) {
    return { segments: [], rawUsed: false };
  }

  // Truncate very long responses to first 2000 chars for brain analysis
  const textToAnalyze = aiResponse.length > 2000
    ? aiResponse.slice(0, 2000) + '\n[response continues...]'
    : aiResponse;

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',   // fast + cheap — just for JSON analysis
        max_tokens: 1500,
        temperature: 0.1,                 // low temp for consistent JSON
        messages: [
          { role: 'system', content: BRAIN_SYSTEM },
          { role: 'user', content: `Subject: ${subjectMode}\n\nAnalyze this response:\n\n${textToAnalyze}` },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      logger.debug(`[VisualBrain] Groq failed: ${res.status}`);
      return { segments: [], rawUsed: false };
    }

    const data = await res.json();
    const raw  = data.choices?.[0]?.message?.content;
    if (!raw) return { segments: [], rawUsed: false };

    // Parse — handle both array and {segments: [...]} formats
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { segments: [], rawUsed: false };
    }

    const arr: any[] = Array.isArray(parsed)
      ? parsed
      : (Array.isArray(parsed.segments) ? parsed.segments : []);

    if (!arr.length) return { segments: [], rawUsed: false };

    // Validate and clean
    const VALID_TYPES = new Set(['lead','body','key','analogy','formula','warning','hook','heading']);
    const segments: VisualSegment[] = arr
      .filter((s: any) => s && typeof s.content === 'string' && VALID_TYPES.has(s.type))
      .map((s: any) => ({
        type:       s.type as VisualSegment['type'],
        content:    String(s.content).trim(),
        highlights: Array.isArray(s.highlights)
          ? s.highlights.filter((h: any) => typeof h === 'string' && h.length > 1).slice(0, 3)
          : [],
        emoji:      typeof s.emoji === 'string' ? s.emoji : undefined,
      }))
      .filter(s => s.content.length > 0);

    logger.info(`[VisualBrain] ✅ ${segments.length} segments, mode=${subjectMode}`);
    return { segments, rawUsed: true };

  } catch (e: any) {
    logger.debug(`[VisualBrain] error: ${e.message}`);
    return { segments: [], rawUsed: false };
  }
}