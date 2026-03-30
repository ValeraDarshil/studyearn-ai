// // ─────────────────────────────────────────────────────────────
// // StudyEarn AI — AI Service
// // ─────────────────────────────────────────────────────────────
// // Groq + OpenRouter ke saath saari communication yahan hoti hai
// // Controllers seedha AI APIs ko KABHI call nahi karte
// // Sirf is service ko call karte hain
// // ─────────────────────────────────────────────────────────────

// import { logger } from '../utils/logger.js';

// // ─────────────────────────────────────────────────────────────
// // AI TIMEOUT HELPER
// // Agar AI 30 seconds mein reply nahi deta → abort karo
// // Bina iske agar Groq/OpenRouter hang ho toh request
// // forever wait karti rahegi — server slow ho jaata
// // ─────────────────────────────────────────────────────────────
// const AI_TIMEOUT_MS = 30_000; // 30 seconds

// function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
//   const controller = new AbortController();
//   const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

//   return fetch(url, { ...options, signal: controller.signal })
//     .finally(() => clearTimeout(timer));
// }

// const GROQ_KEY       = process.env.GROQ_API_KEY       || '';
// const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';

// // ─────────────────────────────────────────────────────────────
// // SYSTEM PROMPT — Indian students ke liye tuned
// // ─────────────────────────────────────────────────────────────
// const SYSTEM_PROMPT = `You are StudyEarn AI — an expert academic tutor for Indian students (CBSE, ICSE, State boards, Class 8-12 and college).

// Rules:
// - Solve questions COMPLETELY, step-by-step, show ALL working.
// - If multiple questions exist, answer EACH ONE separately and fully with its number.
// - Math: write every calculation step. Show formula → substitution → answer.
// - Science: state the formula, substitute values, solve, and explain the concept.
// - Theory: structured explanation with key points and real examples.
// - Be thorough. Never skip steps. Indian exam style.`;

// // ─────────────────────────────────────────────────────────────
// // PRIVATE — Groq Text (primary, fast, free)
// // ─────────────────────────────────────────────────────────────
// export type ChatMessage = { role: 'user' | 'assistant'; content: string };

// async function groqText(userPrompt: string, history: ChatMessage[] = []): Promise<string> {
//   const MODELS = [
//     'llama-3.3-70b-versatile',
//     'llama-3.1-70b-versatile',
//     'mixtral-8x7b-32768',
//     'gemma2-9b-it',
//   ];

//   for (const model of MODELS) {
//     try {
//       logger.debug(`[Groq text] trying ${model}`);
//       const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Content-Type':  'application/json',
//           'Authorization': `Bearer ${GROQ_KEY}`,
//         },
//         body: JSON.stringify({
//           model,
//           messages: [
//             { role: 'system', content: SYSTEM_PROMPT },
//             ...history,
//             { role: 'user',   content: userPrompt },
//           ],
//           temperature: 0.4,
//           max_tokens:  4096,
//         }),
//       });

//       if (!res.ok) {
//         const err = await res.text();
//         logger.debug(`[Groq text] ${model} HTTP ${res.status}: ${err.substring(0, 80)}`);
//         continue;
//       }

//       const data   = await res.json();
//       const answer = data.choices?.[0]?.message?.content;
//       if (answer && answer.trim().length > 20) {
//         logger.info(`[Groq text] ✅ ${model}`);
//         return answer;
//       }
//     } catch (e: any) {
//       // AbortError = timeout ho gaya — next model try karo
//       logger.debug(`[Groq text] ${model} error: ${e.message}`);
//     }
//   }
//   throw new Error('Groq text: all models failed');
// }

// // ─────────────────────────────────────────────────────────────
// // PRIVATE — OpenRouter Text (fallback)
// // ─────────────────────────────────────────────────────────────
// async function openRouterText(userPrompt: string, history: ChatMessage[] = []): Promise<string> {
//   if (!OPENROUTER_KEY) throw new Error('OPENROUTER_API_KEY not set');

//   const MODELS = [
//     'meta-llama/llama-3.3-70b-instruct:free',
//     'deepseek/deepseek-r1-0528:free',
//     'qwen/qwen3-235b-a22b:free',
//     'google/gemma-3-27b-it:free',
//     'mistralai/mistral-small-3.1-24b-instruct:free',
//   ];

//   for (const model of MODELS) {
//     try {
//       logger.debug(`[OpenRouter text] trying ${model}`);
//       const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Content-Type':  'application/json',
//           'Authorization': `Bearer ${OPENROUTER_KEY}`,
//           'HTTP-Referer':  process.env.FRONTEND_URL || "https://studyearnai.tech" ||'https://studyearn-ai.vercel.app',
//           'X-Title':       'StudyEarn AI',
//         },
//         body: JSON.stringify({
//           model,
//           messages: [
//             { role: 'system', content: SYSTEM_PROMPT },
//             ...history,
//             { role: 'user',   content: userPrompt },
//           ],
//           temperature: 0.4,
//           max_tokens:  4096,
//         }),
//       });

//       if (!res.ok) {
//         const err = await res.text();
//         logger.debug(`[OpenRouter text] ${model} HTTP ${res.status}: ${err.substring(0, 80)}`);
//         continue;
//       }

//       const data   = await res.json();
//       const answer = data.choices?.[0]?.message?.content;
//       if (answer && answer.trim().length > 20) {
//         logger.info(`[OpenRouter text] ✅ ${model}`);
//         return answer;
//       }
//     } catch (e: any) {
//       logger.debug(`[OpenRouter text] ${model} error: ${e.message}`);
//     }
//   }
//   throw new Error('OpenRouter text: all models failed');
// }

// // ─────────────────────────────────────────────────────────────
// // PRIVATE — Vision helpers
// // ─────────────────────────────────────────────────────────────
// const BAD_VISION_PHRASES = [
//   "i don't see any image", "no image was provided", "i cannot see the image",
//   "no image has been", "image doesn't appear", "haven't received an image",
//   "i don't have access to", "no picture", "can't view", "unable to view",
//   "please share the question", "please provide the image", "please share the image",
//   "i'll be happy to assist once",
// ];

// function isBadVisionResponse(text: string): boolean {
//   const lower = text.toLowerCase();
//   return BAD_VISION_PHRASES.some(phrase => lower.includes(phrase));
// }

// function buildVisionPrompt(userPrompt: string): string {
//   const base = "You are an expert tutor. The image attached contains a question or problem from a student's exam or homework.";
//   const instruction = 'Read the image very carefully. Identify ALL questions, equations, diagrams, or problems in it. Then solve each one completely with step-by-step working. Show every calculation. Give the final answer clearly.';
//   if (userPrompt?.trim()) {
//     return `${base}\n\nStudent says: "${userPrompt}"\n\n${instruction}`;
//   }
//   return `${base}\n\n${instruction}`;
// }

// const VISION_MODELS = [
//   'qwen/qwen2.5-vl-72b-instruct:free',       // Best vision model
//   'qwen/qwen2.5-vl-7b-instruct:free',        // Faster Qwen
//   'meta-llama/llama-3.2-11b-vision-instruct:free',
//   'microsoft/phi-4-multimodal-instruct:free',
//   'google/gemini-2.0-flash-exp:free',         // Gemini vision
// ];

// async function callGroqVision(imageUrl: string, prompt: string): Promise<string> {
//   if (!GROQ_KEY) throw new Error('No Groq key');
//   const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
//     body: JSON.stringify({
//       model: 'meta-llama/llama-4-scout-17b-16e-instruct',
//       messages: [{ role: 'user', content: [
//         { type: 'image_url', image_url: { url: imageUrl } },
//         { type: 'text',      text: prompt },
//       ]}],
//       temperature: 0.2,
//       max_tokens:  4096,
//     }),
//   });
//   if (!res.ok) throw new Error(`Groq vision HTTP ${res.status}`);
//   const data   = await res.json();
//   const answer = data.choices?.[0]?.message?.content?.trim();
//   if (!answer || answer.length < 20 || isBadVisionResponse(answer)) {
//     throw new Error('Groq vision: bad response');
//   }
//   return answer;
// }

// async function callOpenRouterVision(model: string, imageUrl: string, prompt: string): Promise<string> {
//   if (!OPENROUTER_KEY) throw new Error('OPENROUTER_API_KEY not configured');
//   const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//       'Content-Type':  'application/json',
//       'Authorization': `Bearer ${OPENROUTER_KEY}`,
//       'HTTP-Referer':  process.env.FRONTEND_URL || 'https://studyearn-ai.vercel.app',
//       'X-Title':       'StudyEarn AI',
//     },
//     body: JSON.stringify({
//       model,
//       messages: [{ role: 'user', content: [
//         { type: 'text',      text: prompt },
//         { type: 'image_url', image_url: { url: imageUrl } },
//       ]}],
//       temperature: 0.2,
//       max_tokens:  4096,
//     }),
//   });
//   if (!res.ok) {
//     const errText = await res.text().catch(() => 'unknown error');
//     throw new Error(`HTTP ${res.status}: ${errText.substring(0, 120)}`);
//   }
//   const data   = await res.json();
//   const answer = data.choices?.[0]?.message?.content?.trim();
//   if (!answer || answer.length < 20)   throw new Error('Empty or too-short response');
//   if (isBadVisionResponse(answer))     throw new Error(`Model could not see image: "${answer.substring(0, 80)}"`);
//   return answer;
// }

// // ─────────────────────────────────────────────────────────────
// // PUBLIC API — Controllers in call karte hain
// // ─────────────────────────────────────────────────────────────

// /**
//  * Plain text question solve karo
//  * Chain: Groq → OpenRouter fallback
//  */
// export async function solveText(prompt: string, history: ChatMessage[] = []): Promise<string> {
//   if (GROQ_KEY) {
//     try { return await groqText(prompt, history); } catch {}
//     logger.warn('Text chain: Groq failed → OpenRouter fallback');
//   }
//   if (OPENROUTER_KEY) {
//     try { return await openRouterText(prompt, history); } catch {}
//   }
//   throw new Error('All text AI providers failed');
// }

// /**
//  * Image wala question solve karo
//  * Chain: Groq vision → 5 OpenRouter vision models → smart text fallback
//  * GUARANTEED kuch na kuch return karega — kabhi fail nahi hoga
//  */
// export async function solveWithVision(imageUrl: string, userPrompt: string): Promise<string> {
//   const visionPrompt = buildVisionPrompt(userPrompt);
//   const attempts: string[] = [];

//   // 1. Groq vision (fast jab kaam kare)
//   try {
//     const ans = await callGroqVision(imageUrl, visionPrompt);
//     logger.info('[Vision] ✅ Groq succeeded');
//     return ans;
//   } catch (e: any) {
//     attempts.push(`Groq: ${e.message}`);
//     logger.warn(`[Vision] Groq failed: ${e.message}`);
//   }

//   // 2. OpenRouter vision models (5 different models try karo)
//   for (const model of VISION_MODELS) {
//     try {
//       const ans = await callOpenRouterVision(model, imageUrl, visionPrompt);
//       logger.info(`[Vision] ✅ OpenRouter ${model} succeeded`);
//       return ans;
//     } catch (e: any) {
//       attempts.push(`${model}: ${e.message}`);
//       logger.warn(`[Vision] ${model} failed: ${e.message}`);
//     }
//   }

//   // 3. Smart text fallback — image nahi padh paye toh bhi helpful answer do
//   logger.warn('[Vision] All vision models failed — using smart text fallback');
//   const fallback = userPrompt?.trim()
//     ? `A student has an image with this question/request: "${userPrompt}"\n\nPlease provide a complete, detailed answer. If math/science, solve step-by-step.`
//     : `A student uploaded an exam question image. Please provide a comprehensive study guide with example problems for Indian school/college exams.`;

//   try {
//     const ans = await solveText(fallback);
//     return `Note: I could not read your image directly, but here is help based on your question:\n\n${ans}`;
//   } catch {}

//   return 'I was unable to process this image. Please try: (1) Re-uploading with better lighting, (2) Typing out the question manually, or (3) Taking a clearer screenshot.';
// }

// /**
//  * PPT ke liye slide content JSON generate karo
//  * Chain: Groq → OpenRouter fallback
//  */
// export async function generatePPTContent(system: string, user: string): Promise<string> {
//   const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'gemma2-9b-it'];

//   for (const model of GROQ_MODELS) {
//     try {
//       logger.debug(`[PPT Groq] trying ${model}`);
//       const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
//         body: JSON.stringify({
//           model,
//           messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
//           temperature: 0.3,
//           max_tokens:  3000,
//         }),
//       });
//       if (!res.ok) continue;
//       const data = await res.json();
//       const ans  = data.choices?.[0]?.message?.content;
//       if (ans && ans.length > 50) {
//         logger.info(`[PPT Groq] ✅ ${model}`);
//         return ans;
//       }
//     } catch (e: any) {
//       logger.debug(`[PPT Groq] ${model}: ${e.message}`);
//     }
//   }

//   if (!OPENROUTER_KEY) throw new Error('No OpenRouter key');

//   const OR_MODELS = [
//     'meta-llama/llama-3.3-70b-instruct:free',
//     'deepseek/deepseek-r1-0528:free',
//     'qwen/qwen3-235b-a22b:free',
//     'google/gemma-3-27b-it:free',
//   ];

//   for (const model of OR_MODELS) {
//     try {
//       logger.debug(`[PPT OR] trying ${model}`);
//       const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Content-Type':  'application/json',
//           'Authorization': `Bearer ${OPENROUTER_KEY}`,
//           'HTTP-Referer':  process.env.FRONTEND_URL || 'https://studyearn-ai.vercel.app',
//           'X-Title':       'StudyEarn AI',
//         },
//         body: JSON.stringify({
//           model,
//           messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
//           temperature: 0.3,
//           max_tokens:  3000,
//         }),
//       });
//       if (!res.ok) continue;
//       const data = await res.json();
//       const ans  = data.choices?.[0]?.message?.content;
//       if (ans && ans.length > 50) {
//         logger.info(`[PPT OR] ✅ ${model}`);
//         return ans;
//       }
//     } catch (e: any) {
//       logger.debug(`[PPT OR] ${model}: ${e.message}`);
//     }
//   }

//   throw new Error('PPT content generation: all providers failed');
// }


// ─────────────────────────────────────────────────────────────
// AI Study OS — Ultra AI Service (GPT-4 Level)
// Provider chain: NVIDIA NIM → Groq → OpenRouter
// Supports: streaming, vision, smart model routing
// ─────────────────────────────────────────────────────────────

import { Response } from 'express';
import { logger }   from '../utils/logger.js';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

const NVIDIA_KEY     = process.env.NVIDIA_API_KEY     || '';
const GROQ_KEY       = process.env.GROQ_API_KEY       || '';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const AI_TIMEOUT_MS  = 45_000;
const NVIDIA_BASE    = 'https://integrate.api.nvidia.com/v1';

// ── Model roster ──────────────────────────────────────────────
const NVIDIA_MODELS = {
  ultra:  'nvidia/llama-3.1-nemotron-ultra-253b-v1',
  math:   'deepseek-ai/deepseek-r1',
  coding: 'nvidia/llama-3.3-nemotron-super-49b-v1',
  fast:   'meta/llama-3.3-70b-instruct',
  stem:   'microsoft/phi-4',
  reason: 'qwen/qwq-32b',
};

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
];

const OR_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-r1-0528:free',
  'qwen/qwen3-235b-a22b:free',
  'google/gemma-3-27b-it:free',
  'mistralai/mistral-small-3.1-24b-instruct:free',
];

const VISION_MODELS = [
  'qwen/qwen2.5-vl-72b-instruct:free',
  'qwen/qwen2.5-vl-7b-instruct:free',
  'meta-llama/llama-3.2-11b-vision-instruct:free',
  'microsoft/phi-4-multimodal-instruct:free',
  'google/gemini-2.0-flash-exp:free',
];

// ── System prompts ────────────────────────────────────────────
const BASE_PROMPT = `You are AI Study OS — an ultra-intelligent personal tutor for Indian students (CBSE, ICSE, JEE, NEET, State boards, Class 8-12 and college).

You are as capable as GPT-4, Gemini Pro, and Claude. Your goal: give complete, accurate, deeply helpful answers.

RULES:
• Answer COMPLETELY — never truncate, never say "I'll leave this as exercise"
• For multiple questions: answer EACH with its number, fully
• Math: formula → substitution → every step → boxed final answer
• Coding: complete runnable code with inline comments + expected output
• Science: state law/formula → substitute → solve → real-world example
• If the student writes in Hinglish, reply in Hinglish naturally
• Indian exam style: thorough, structured, marks-worthy
• Be encouraging — build confidence, not just answer questions
• Think deeply before answering. Quality over speed.`;

const MATH_PROMPT   = BASE_PROMPT + '\n\nMATH MODE: Show formula → substitution → every step. Verify answer. Use proper notation.';
const CODING_PROMPT = BASE_PROMPT + '\n\nCODING MODE: Complete runnable code always. Comments on every line. Show output. Explain WHY.';
const SCIENCE_PROMPT = BASE_PROMPT + '\n\nSCIENCE MODE: State law/formula first. Substitute with units. Real-world example after.';

function getSystemPrompt(subjectMode?: string): string {
  if (subjectMode === 'math')    return MATH_PROMPT;
  if (subjectMode === 'coding')  return CODING_PROMPT;
  if (subjectMode === 'science') return SCIENCE_PROMPT;
  return BASE_PROMPT;
}

function pickNvidiaModel(subjectMode?: string): string {
  if (subjectMode === 'math')    return NVIDIA_MODELS.math;
  if (subjectMode === 'coding')  return NVIDIA_MODELS.coding;
  if (subjectMode === 'science') return NVIDIA_MODELS.stem;
  return NVIDIA_MODELS.ultra;
}

function fetchWithTimeout(url: string, options: RequestInit, ms = AI_TIMEOUT_MS): Promise<globalThis.Response> {
  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...options, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

// ─────────────────────────────────────────────────────────────
// Non-streaming text calls
// ─────────────────────────────────────────────────────────────
async function nvidiaText(msgs: ChatMessage[], sys: string, mode?: string): Promise<string> {
  if (!NVIDIA_KEY) throw new Error('No NVIDIA key');
  const tryModels = [pickNvidiaModel(mode), NVIDIA_MODELS.fast, NVIDIA_MODELS.reason];
  for (const model of tryModels) {
    try {
      const res = await fetchWithTimeout(`${NVIDIA_BASE}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${NVIDIA_KEY}` },
        body: JSON.stringify({ model, temperature: 0.4, max_tokens: 4096, messages: [{ role: 'system', content: sys }, ...msgs] }),
      }, 55_000);
      if (!res.ok) { logger.debug(`[NVIDIA] ${model} HTTP ${res.status}`); continue; }
      const data = await res.json();
      const ans  = data.choices?.[0]?.message?.content?.trim();
      if (ans && ans.length > 20) { logger.info(`[NVIDIA] ✅ ${model}`); return ans; }
    } catch (e: any) { logger.debug(`[NVIDIA] ${model}: ${e.message}`); }
  }
  throw new Error('NVIDIA: all models failed');
}

async function groqText(msgs: ChatMessage[], sys: string): Promise<string> {
  if (!GROQ_KEY) throw new Error('No Groq key');
  for (const model of GROQ_MODELS) {
    try {
      const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({ model, temperature: 0.4, max_tokens: 4096, messages: [{ role: 'system', content: sys }, ...msgs] }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const ans  = data.choices?.[0]?.message?.content?.trim();
      if (ans && ans.length > 20) { logger.info(`[Groq] ✅ ${model}`); return ans; }
    } catch (e: any) { logger.debug(`[Groq] ${model}: ${e.message}`); }
  }
  throw new Error('Groq: all models failed');
}

async function openRouterText(msgs: ChatMessage[], sys: string): Promise<string> {
  if (!OPENROUTER_KEY) throw new Error('No OpenRouter key');
  for (const model of OR_MODELS) {
    try {
      const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENROUTER_KEY}`, 'HTTP-Referer': process.env.FRONTEND_URL || 'https://studyearnai.tech', 'X-Title': 'AI Study OS' },
        body: JSON.stringify({ model, temperature: 0.4, max_tokens: 4096, messages: [{ role: 'system', content: sys }, ...msgs] }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const ans  = data.choices?.[0]?.message?.content?.trim();
      if (ans && ans.length > 20) { logger.info(`[OR] ✅ ${model}`); return ans; }
    } catch (e: any) { logger.debug(`[OR] ${model}: ${e.message}`); }
  }
  throw new Error('OpenRouter: all models failed');
}

// ─────────────────────────────────────────────────────────────
// Streaming helpers
// ─────────────────────────────────────────────────────────────
async function pipeStream(response: globalThis.Response, res: Response): Promise<void> {
  const reader  = response.body!.getReader();
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value, { stream: true }).split('\n').filter(l => l.trim());
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') { res.write('data: [DONE]\n\n'); return; }
        try {
          const delta = JSON.parse(data).choices?.[0]?.delta?.content;
          if (delta) res.write(`data: ${JSON.stringify({ token: delta })}\n\n`);
        } catch { /* skip malformed */ }
      }
    }
  } finally { reader.releaseLock(); }
}

async function nvidiaStream(msgs: ChatMessage[], sys: string, mode: string | undefined, res: Response): Promise<void> {
  if (!NVIDIA_KEY) throw new Error('No NVIDIA key');
  const response = await fetchWithTimeout(`${NVIDIA_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${NVIDIA_KEY}` },
    body: JSON.stringify({ model: pickNvidiaModel(mode), temperature: 0.4, max_tokens: 4096, stream: true, messages: [{ role: 'system', content: sys }, ...msgs] }),
  }, 60_000);
  if (!response.ok) throw new Error(`NVIDIA stream HTTP ${response.status}`);
  logger.info(`[NVIDIA stream] ✅ ${pickNvidiaModel(mode)}`);
  await pipeStream(response, res);
}

async function groqStream(msgs: ChatMessage[], sys: string, res: Response): Promise<void> {
  if (!GROQ_KEY) throw new Error('No Groq key');
  for (const model of GROQ_MODELS) {
    try {
      const response = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({ model, temperature: 0.4, max_tokens: 4096, stream: true, messages: [{ role: 'system', content: sys }, ...msgs] }),
      });
      if (!response.ok) continue;
      logger.info(`[Groq stream] ✅ ${model}`);
      await pipeStream(response, res);
      return;
    } catch (e: any) { logger.debug(`[Groq stream] ${model}: ${e.message}`); }
  }
  throw new Error('Groq stream: all failed');
}

async function openRouterStream(msgs: ChatMessage[], sys: string, res: Response): Promise<void> {
  if (!OPENROUTER_KEY) throw new Error('No OR key');
  for (const model of OR_MODELS.slice(0, 3)) {
    try {
      const response = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENROUTER_KEY}`, 'HTTP-Referer': process.env.FRONTEND_URL || 'https://studyearnai.tech', 'X-Title': 'AI Study OS' },
        body: JSON.stringify({ model, temperature: 0.4, max_tokens: 4096, stream: true, messages: [{ role: 'system', content: sys }, ...msgs] }),
      });
      if (!response.ok) continue;
      logger.info(`[OR stream] ✅ ${model}`);
      await pipeStream(response, res);
      return;
    } catch (e: any) { logger.debug(`[OR stream] ${model}: ${e.message}`); }
  }
  throw new Error('OpenRouter stream: all failed');
}

// ─────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────

/** Non-streaming: NVIDIA → Groq → OpenRouter */
export async function solveText(prompt: string, history: ChatMessage[] = [], subjectMode?: string): Promise<string> {
  const sys  = getSystemPrompt(subjectMode);
  const msgs = [...history, { role: 'user' as const, content: prompt }];
  if (NVIDIA_KEY)     { try { return await nvidiaText(msgs, sys, subjectMode); }       catch (e: any) { logger.warn(`NVIDIA→Groq: ${e.message}`); } }
  if (GROQ_KEY)       { try { return await groqText(msgs, sys); }                      catch (e: any) { logger.warn(`Groq→OR: ${e.message}`); } }
  if (OPENROUTER_KEY) { try { return await openRouterText(msgs, sys); }                catch (e: any) { logger.warn(`OR failed: ${e.message}`); } }
  throw new Error('All AI providers failed');
}

/** Streaming SSE: NVIDIA → Groq → OpenRouter */
export async function solveTextStream(prompt: string, history: ChatMessage[], subjectMode: string | undefined, res: Response): Promise<void> {
  const sys  = getSystemPrompt(subjectMode);
  const msgs = [...history, { role: 'user' as const, content: prompt }];
  if (NVIDIA_KEY)     { try { await nvidiaStream(msgs, sys, subjectMode, res); return; } catch (e: any) { logger.warn(`NVIDIA stream→Groq: ${e.message}`); } }
  if (GROQ_KEY)       { try { await groqStream(msgs, sys, res); return; }                catch (e: any) { logger.warn(`Groq stream→OR: ${e.message}`); } }
  if (OPENROUTER_KEY) { try { await openRouterStream(msgs, sys, res); return; }          catch (e: any) { logger.warn(`OR stream failed: ${e.message}`); } }
  throw new Error('All streaming providers failed');
}

/** Vision: Groq → OpenRouter vision models → text fallback */
export async function solveWithVision(imageUrl: string, userPrompt: string): Promise<string> {
  const BAD = ["i don't see any image","no image was provided","i cannot see","no picture","can't view","please provide the image"];
  const isBad = (t: string) => BAD.some(p => t.toLowerCase().includes(p));
  const vPrompt = userPrompt?.trim()
    ? `You are an expert tutor. Student says: "${userPrompt}". Read the image and solve completely step-by-step.`
    : 'You are an expert tutor. Read this exam/homework image and solve everything step-by-step with full working.';

  // Groq vision
  if (GROQ_KEY) {
    try {
      const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({ model: 'meta-llama/llama-4-scout-17b-16e-instruct', messages: [{ role: 'user', content: [{ type: 'image_url', image_url: { url: imageUrl } }, { type: 'text', text: vPrompt }] }], temperature: 0.2, max_tokens: 4096 }),
      });
      if (res.ok) {
        const data = await res.json();
        const ans  = data.choices?.[0]?.message?.content?.trim();
        if (ans && ans.length > 20 && !isBad(ans)) { logger.info('[Vision] ✅ Groq'); return ans; }
      }
    } catch (e: any) { logger.warn(`[Vision] Groq: ${e.message}`); }
  }

  // OpenRouter vision models
  for (const model of VISION_MODELS) {
    try {
      const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENROUTER_KEY}`, 'HTTP-Referer': process.env.FRONTEND_URL || 'https://studyearnai.tech', 'X-Title': 'AI Study OS' },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: [{ type: 'text', text: vPrompt }, { type: 'image_url', image_url: { url: imageUrl } }] }], temperature: 0.2, max_tokens: 4096 }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const ans  = data.choices?.[0]?.message?.content?.trim();
      if (ans && ans.length > 20 && !isBad(ans)) { logger.info(`[Vision] ✅ ${model}`); return ans; }
    } catch (e: any) { logger.warn(`[Vision] ${model}: ${e.message}`); }
  }

  // Text fallback
  try {
    const ans = await solveText(userPrompt?.trim() ? `Student has an image with this question: "${userPrompt}". Please answer completely.` : 'Student uploaded an exam image. Provide comprehensive study guide.');
    return `Note: Could not read your image directly, but here is help:\n\n${ans}`;
  } catch {}
  return 'Unable to process this image. Please try typing the question manually or upload a clearer image.';
}

/** PPT content generation */
export async function generatePPTContent(system: string, user: string): Promise<string> {
  const msgs: ChatMessage[] = [{ role: 'user', content: user }];
  if (NVIDIA_KEY) {
    try {
      const res = await fetchWithTimeout(`${NVIDIA_BASE}/chat/completions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${NVIDIA_KEY}` },
        body: JSON.stringify({ model: NVIDIA_MODELS.fast, messages: [{ role: 'system', content: system }, ...msgs], temperature: 0.3, max_tokens: 3000 }),
      });
      if (res.ok) { const d = await res.json(); const a = d.choices?.[0]?.message?.content; if (a && a.length > 50) return a; }
    } catch {}
  }
  for (const model of [...GROQ_MODELS.slice(0, 2)]) {
    try {
      if (!GROQ_KEY) break;
      const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` }, body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.3, max_tokens: 3000 }) });
      if (!res.ok) continue;
      const d = await res.json(); const a = d.choices?.[0]?.message?.content;
      if (a && a.length > 50) return a;
    } catch {}
  }
  for (const model of OR_MODELS.slice(0, 3)) {
    try {
      if (!OPENROUTER_KEY) break;
      const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENROUTER_KEY}`, 'HTTP-Referer': process.env.FRONTEND_URL || 'https://studyearnai.tech', 'X-Title': 'AI Study OS' }, body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.3, max_tokens: 3000 }) });
      if (!res.ok) continue;
      const d = await res.json(); const a = d.choices?.[0]?.message?.content;
      if (a && a.length > 50) return a;
    } catch {}
  }
  throw new Error('PPT: all providers failed');
}