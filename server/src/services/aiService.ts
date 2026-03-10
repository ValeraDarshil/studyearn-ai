// ─────────────────────────────────────────────────────────────
// StudyEarn AI — AI Service
// ─────────────────────────────────────────────────────────────
// Groq + OpenRouter ke saath saari communication yahan hoti hai
// Controllers seedha AI APIs ko KABHI call nahi karte
// Sirf is service ko call karte hain
// ─────────────────────────────────────────────────────────────

import { logger } from '../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// AI TIMEOUT HELPER
// Agar AI 30 seconds mein reply nahi deta → abort karo
// Bina iske agar Groq/OpenRouter hang ho toh request
// forever wait karti rahegi — server slow ho jaata
// ─────────────────────────────────────────────────────────────
const AI_TIMEOUT_MS = 30_000; // 30 seconds

function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

const GROQ_KEY       = process.env.GROQ_API_KEY       || '';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';

// ─────────────────────────────────────────────────────────────
// SYSTEM PROMPT — Indian students ke liye tuned
// ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are StudyEarn AI — an expert academic tutor for Indian students (CBSE, ICSE, State boards, Class 8-12 and college).

Rules:
- Solve questions COMPLETELY, step-by-step, show ALL working.
- If multiple questions exist, answer EACH ONE separately and fully with its number.
- Math: write every calculation step. Show formula → substitution → answer.
- Science: state the formula, substitute values, solve, and explain the concept.
- Theory: structured explanation with key points and real examples.
- Be thorough. Never skip steps. Indian exam style.`;

// ─────────────────────────────────────────────────────────────
// PRIVATE — Groq Text (primary, fast, free)
// ─────────────────────────────────────────────────────────────
export type ChatMessage = { role: 'user' | 'assistant'; content: string };

async function groqText(userPrompt: string, history: ChatMessage[] = []): Promise<string> {
  const MODELS = [
    'llama-3.3-70b-versatile',
    'llama-3.1-70b-versatile',
    'mixtral-8x7b-32768',
    'gemma2-9b-it',
  ];

  for (const model of MODELS) {
    try {
      logger.debug(`[Groq text] trying ${model}`);
      const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user',   content: userPrompt },
          ],
          temperature: 0.4,
          max_tokens:  4096,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        logger.debug(`[Groq text] ${model} HTTP ${res.status}: ${err.substring(0, 80)}`);
        continue;
      }

      const data   = await res.json();
      const answer = data.choices?.[0]?.message?.content;
      if (answer && answer.trim().length > 20) {
        logger.info(`[Groq text] ✅ ${model}`);
        return answer;
      }
    } catch (e: any) {
      // AbortError = timeout ho gaya — next model try karo
      logger.debug(`[Groq text] ${model} error: ${e.message}`);
    }
  }
  throw new Error('Groq text: all models failed');
}

// ─────────────────────────────────────────────────────────────
// PRIVATE — OpenRouter Text (fallback)
// ─────────────────────────────────────────────────────────────
async function openRouterText(userPrompt: string, history: ChatMessage[] = []): Promise<string> {
  if (!OPENROUTER_KEY) throw new Error('OPENROUTER_API_KEY not set');

  const MODELS = [
    'meta-llama/llama-3.3-70b-instruct:free',
    'deepseek/deepseek-r1-0528:free',
    'qwen/qwen3-235b-a22b:free',
    'google/gemma-3-27b-it:free',
    'mistralai/mistral-small-3.1-24b-instruct:free',
  ];

  for (const model of MODELS) {
    try {
      logger.debug(`[OpenRouter text] trying ${model}`);
      const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer':  process.env.FRONTEND_URL || 'https://studyearn-ai.vercel.app',
          'X-Title':       'StudyEarn AI',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user',   content: userPrompt },
          ],
          temperature: 0.4,
          max_tokens:  4096,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        logger.debug(`[OpenRouter text] ${model} HTTP ${res.status}: ${err.substring(0, 80)}`);
        continue;
      }

      const data   = await res.json();
      const answer = data.choices?.[0]?.message?.content;
      if (answer && answer.trim().length > 20) {
        logger.info(`[OpenRouter text] ✅ ${model}`);
        return answer;
      }
    } catch (e: any) {
      logger.debug(`[OpenRouter text] ${model} error: ${e.message}`);
    }
  }
  throw new Error('OpenRouter text: all models failed');
}

// ─────────────────────────────────────────────────────────────
// PRIVATE — Vision helpers
// ─────────────────────────────────────────────────────────────
const BAD_VISION_PHRASES = [
  "i don't see any image", "no image was provided", "i cannot see the image",
  "no image has been", "image doesn't appear", "haven't received an image",
  "i don't have access to", "no picture", "can't view", "unable to view",
  "please share the question", "please provide the image", "please share the image",
  "i'll be happy to assist once",
];

function isBadVisionResponse(text: string): boolean {
  const lower = text.toLowerCase();
  return BAD_VISION_PHRASES.some(phrase => lower.includes(phrase));
}

function buildVisionPrompt(userPrompt: string): string {
  const base = "You are an expert tutor. The image attached contains a question or problem from a student's exam or homework.";
  const instruction = 'Read the image very carefully. Identify ALL questions, equations, diagrams, or problems in it. Then solve each one completely with step-by-step working. Show every calculation. Give the final answer clearly.';
  if (userPrompt?.trim()) {
    return `${base}\n\nStudent says: "${userPrompt}"\n\n${instruction}`;
  }
  return `${base}\n\n${instruction}`;
}

const VISION_MODELS = [
  'qwen/qwen2.5-vl-72b-instruct:free',
  'meta-llama/llama-3.2-11b-vision-instruct:free',
  'google/gemma-3-27b-it:free',
  'mistralai/mistral-small-3.1-24b-instruct:free',
  'microsoft/phi-4-multimodal-instruct:free',
];

async function callGroqVision(imageUrl: string, prompt: string): Promise<string> {
  if (!GROQ_KEY) throw new Error('No Groq key');
  const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.2-11b-vision-preview',
      messages: [{ role: 'user', content: [
        { type: 'text',      text: prompt },
        { type: 'image_url', image_url: { url: imageUrl } },
      ]}],
      temperature: 0.2,
      max_tokens:  4096,
    }),
  });
  if (!res.ok) throw new Error(`Groq vision HTTP ${res.status}`);
  const data   = await res.json();
  const answer = data.choices?.[0]?.message?.content?.trim();
  if (!answer || answer.length < 20 || isBadVisionResponse(answer)) {
    throw new Error('Groq vision: bad response');
  }
  return answer;
}

async function callOpenRouterVision(model: string, imageUrl: string, prompt: string): Promise<string> {
  if (!OPENROUTER_KEY) throw new Error('OPENROUTER_API_KEY not configured');
  const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'HTTP-Referer':  process.env.FRONTEND_URL || 'https://studyearn-ai.vercel.app',
      'X-Title':       'StudyEarn AI',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: [
        { type: 'text',      text: prompt },
        { type: 'image_url', image_url: { url: imageUrl } },
      ]}],
      temperature: 0.2,
      max_tokens:  4096,
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => 'unknown error');
    throw new Error(`HTTP ${res.status}: ${errText.substring(0, 120)}`);
  }
  const data   = await res.json();
  const answer = data.choices?.[0]?.message?.content?.trim();
  if (!answer || answer.length < 20)   throw new Error('Empty or too-short response');
  if (isBadVisionResponse(answer))     throw new Error(`Model could not see image: "${answer.substring(0, 80)}"`);
  return answer;
}

// ─────────────────────────────────────────────────────────────
// PUBLIC API — Controllers in call karte hain
// ─────────────────────────────────────────────────────────────

/**
 * Plain text question solve karo
 * Chain: Groq → OpenRouter fallback
 */
export async function solveText(prompt: string, history: ChatMessage[] = []): Promise<string> {
  if (GROQ_KEY) {
    try { return await groqText(prompt, history); } catch {}
    logger.warn('Text chain: Groq failed → OpenRouter fallback');
  }
  if (OPENROUTER_KEY) {
    try { return await openRouterText(prompt, history); } catch {}
  }
  throw new Error('All text AI providers failed');
}

/**
 * Image wala question solve karo
 * Chain: Groq vision → 5 OpenRouter vision models → smart text fallback
 * GUARANTEED kuch na kuch return karega — kabhi fail nahi hoga
 */
export async function solveWithVision(imageUrl: string, userPrompt: string): Promise<string> {
  const visionPrompt = buildVisionPrompt(userPrompt);
  const attempts: string[] = [];

  // 1. Groq vision (fast jab kaam kare)
  try {
    const ans = await callGroqVision(imageUrl, visionPrompt);
    logger.info('[Vision] ✅ Groq succeeded');
    return ans;
  } catch (e: any) {
    attempts.push(`Groq: ${e.message}`);
    logger.warn(`[Vision] Groq failed: ${e.message}`);
  }

  // 2. OpenRouter vision models (5 different models try karo)
  for (const model of VISION_MODELS) {
    try {
      const ans = await callOpenRouterVision(model, imageUrl, visionPrompt);
      logger.info(`[Vision] ✅ OpenRouter ${model} succeeded`);
      return ans;
    } catch (e: any) {
      attempts.push(`${model}: ${e.message}`);
      logger.warn(`[Vision] ${model} failed: ${e.message}`);
    }
  }

  // 3. Smart text fallback — image nahi padh paye toh bhi helpful answer do
  logger.warn('[Vision] All vision models failed — using smart text fallback');
  const fallback = userPrompt?.trim()
    ? `A student has an image with this question/request: "${userPrompt}"\n\nPlease provide a complete, detailed answer. If math/science, solve step-by-step.`
    : `A student uploaded an exam question image. Please provide a comprehensive study guide with example problems for Indian school/college exams.`;

  try {
    const ans = await solveText(fallback);
    return `Note: I could not read your image directly, but here is help based on your question:\n\n${ans}`;
  } catch {}

  return 'I was unable to process this image. Please try: (1) Re-uploading with better lighting, (2) Typing out the question manually, or (3) Taking a clearer screenshot.';
}

/**
 * PPT ke liye slide content JSON generate karo
 * Chain: Groq → OpenRouter fallback
 */
export async function generatePPTContent(system: string, user: string): Promise<string> {
  const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'gemma2-9b-it'];

  for (const model of GROQ_MODELS) {
    try {
      logger.debug(`[PPT Groq] trying ${model}`);
      const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
          temperature: 0.3,
          max_tokens:  3000,
        }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const ans  = data.choices?.[0]?.message?.content;
      if (ans && ans.length > 50) {
        logger.info(`[PPT Groq] ✅ ${model}`);
        return ans;
      }
    } catch (e: any) {
      logger.debug(`[PPT Groq] ${model}: ${e.message}`);
    }
  }

  if (!OPENROUTER_KEY) throw new Error('No OpenRouter key');

  const OR_MODELS = [
    'meta-llama/llama-3.3-70b-instruct:free',
    'deepseek/deepseek-r1-0528:free',
    'qwen/qwen3-235b-a22b:free',
    'google/gemma-3-27b-it:free',
  ];

  for (const model of OR_MODELS) {
    try {
      logger.debug(`[PPT OR] trying ${model}`);
      const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer':  process.env.FRONTEND_URL || 'https://studyearn-ai.vercel.app',
          'X-Title':       'StudyEarn AI',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
          temperature: 0.3,
          max_tokens:  3000,
        }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const ans  = data.choices?.[0]?.message?.content;
      if (ans && ans.length > 50) {
        logger.info(`[PPT OR] ✅ ${model}`);
        return ans;
      }
    } catch (e: any) {
      logger.debug(`[PPT OR] ${model}: ${e.message}`);
    }
  }

  throw new Error('PPT content generation: all providers failed');
}