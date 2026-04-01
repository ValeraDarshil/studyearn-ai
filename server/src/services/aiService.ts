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


// // ─────────────────────────────────────────────────────────────
// // StudyEarn AI — AI Service  (UPGRADED v4)
// // ─────────────────────────────────────────────────────────────
// // Text   → GROQ → OpenRouter  (unchanged, fast)
// // Image  → NVIDIA Vision (primary) → Groq Vision → OR Vision
// // PDF    → pdfService text extract → NVIDIA Text
// //          scanned PDF → NVIDIA Vision (page-by-page)
// // ─────────────────────────────────────────────────────────────

// import { logger } from '../utils/logger.js';

// // ─────────────────────────────────────────────────────────────
// // ENV KEYS
// // ─────────────────────────────────────────────────────────────
// const NVIDIA_KEY      = process.env.NVIDIA_API_KEY      || '';
// const GROQ_KEY        = process.env.GROQ_API_KEY        || '';
// const OPENROUTER_KEY  = process.env.OPENROUTER_API_KEY  || '';

// const AI_TIMEOUT_MS   = 45_000;
// const NVIDIA_BASE     = 'https://integrate.api.nvidia.com/v1';

// // ─────────────────────────────────────────────────────────────
// // MODEL ROSTERS
// // ─────────────────────────────────────────────────────────────

// // NVIDIA text models — subject-aware routing
// const NVIDIA_MODELS = {
//   ultra:   'meta/llama-3.1-405b-instruct',      // best quality
//   math:    'deepseek-ai/deepseek-r1',            // math/reasoning
//   coding:  'nvidia/llama-3.3-nemotron-super-49b-v1', // coding
//   fast:    'meta/llama-3.3-70b-instruct',        // fast fallback
//   stem:    'microsoft/phi-4',                    // science/STEM
// };

// // NVIDIA vision models (for images + scanned PDFs) — free tier
// const NVIDIA_VISION_MODELS = [
//   'meta/llama-3.2-11b-vision-instruct',          // best free vision
//   'microsoft/phi-3.5-vision-instruct',           // backup vision
// ];

// // Groq text models
// const GROQ_MODELS = [
//   'llama-3.3-70b-versatile',
//   'llama-3.1-70b-versatile',
//   'mixtral-8x7b-32768',
//   'gemma2-9b-it',
// ];

// // Groq vision model
// const GROQ_VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

// // OpenRouter text models (free)
// const OR_MODELS = [
//   'meta-llama/llama-3.3-70b-instruct:free',
//   'deepseek/deepseek-r1-0528:free',
//   'qwen/qwen3-235b-a22b:free',
//   'google/gemma-3-27b-it:free',
//   'mistralai/mistral-small-3.1-24b-instruct:free',
// ];

// // OpenRouter vision models (free)
// const OR_VISION_MODELS = [
//   'qwen/qwen2.5-vl-72b-instruct:free',
//   'qwen/qwen2.5-vl-7b-instruct:free',
//   'meta-llama/llama-3.2-11b-vision-instruct:free',
//   'microsoft/phi-4-multimodal-instruct:free',
//   'google/gemini-2.0-flash-exp:free',
// ];

// // ─────────────────────────────────────────────────────────────
// // SYSTEM PROMPTS
// // ─────────────────────────────────────────────────────────────
// const BASE_PROMPT = `You are StudyEarn AI — an expert academic tutor for Indian students (CBSE, ICSE, JEE, NEET, State boards, Class 8-12 and college).

// Your responses must be RICH and STRUCTURED like ChatGPT/Gemini/Claude:

// FORMATTING RULES (ALWAYS follow these):
// • Use **bold** for important terms, key answers, formulas, definitions
// • Use emojis naturally: 📌 for key points, 💡 for tips/insights, ⚠️ for warnings/cautions, ✅ for correct answers, ❌ for wrong approaches, 🔥 for important exam topics, 📐 for math, 💻 for coding, 🔬 for science
// • Use ## for section headings, ### for sub-headings
// • Use - bullet points for lists
// • Use numbered lists 1. 2. 3. for steps
// • Use > blockquote for important notes or warnings
// • Wrap ALL code in triple backticks with language: \`\`\`python ... \`\`\`
// • For warnings or dangerous concepts: start with ⚠️ **Warning:**
// • For most important points: use > **📌 Key Point:** inside a blockquote

// ANSWER RULES:
// • Answer COMPLETELY — never truncate, never say "I'll leave this as exercise"
// • For multiple questions: answer EACH with its number, fully
// • Math: formula → substitution → every step → **boxed final answer**
// • Coding: complete runnable code with inline comments + expected output
// • Science: state law/formula → substitute → solve → real-world example
// • If the student writes in Hinglish, reply in Hinglish naturally
// • Indian exam style: thorough, structured, marks-worthy
// • Be encouraging — add a motivational emoji at the end 🎯`;

// const MATH_PROMPT = BASE_PROMPT + '\n\n📐 **MATH MODE:** Show formula → substitution → every step. Verify answer. Use **bold** for final answer. Box the result.';
// const CODING_PROMPT = BASE_PROMPT + '\n\n💻 **CODING MODE:** Complete runnable code always. Comment every line. Show expected output. Explain WHY each part works.';
// const SCIENCE_PROMPT = BASE_PROMPT + '\n\n🔬 **SCIENCE MODE:** State law/formula first. Substitute with units. Real-world example after. Use diagrams in text if helpful.';

// const VISION_PROMPT = `You are StudyEarn AI — an expert tutor. A student has shared an image (exam paper, homework, diagram, or problem).

// FORMATTING RULES:
// • Use **bold** for important terms and answers
// • Use emojis: 📌 💡 ⚠️ ✅ ❌ 🔥 naturally
// • Use ## headings for sections
// • Wrap all code in triple backticks
// • Use numbered steps for solutions
// • Use > blockquote for key notes

// YOUR JOB:
// 1. READ the image carefully — identify ALL text, numbers, diagrams, equations
// 2. Solve EVERY question/problem you see, completely and step-by-step
// 3. If it's a diagram: explain what it shows, label all parts
// 4. If it's text/theory: summarize and explain key concepts
// 5. Be thorough — Indian exam style`;

// function getSystemPrompt(subjectMode?: string): string {
//   if (subjectMode === 'math')    return MATH_PROMPT;
//   if (subjectMode === 'coding')  return CODING_PROMPT;
//   if (subjectMode === 'science') return SCIENCE_PROMPT;
//   return BASE_PROMPT;
// }

// function pickNvidiaModel(subjectMode?: string): string {
//   if (subjectMode === 'math')    return NVIDIA_MODELS.math;
//   if (subjectMode === 'coding')  return NVIDIA_MODELS.coding;
//   if (subjectMode === 'science') return NVIDIA_MODELS.stem;
//   return NVIDIA_MODELS.ultra;
// }

// // ─────────────────────────────────────────────────────────────
// // FETCH HELPER
// // ─────────────────────────────────────────────────────────────
// function fetchWithTimeout(url: string, options: RequestInit, ms = AI_TIMEOUT_MS): Promise<Response> {
//   const ctrl = new AbortController();
//   const timer = setTimeout(() => ctrl.abort(), ms);
//   return fetch(url, { ...options, signal: ctrl.signal }).finally(() => clearTimeout(timer));
// }

// // ─────────────────────────────────────────────────────────────
// // TYPES
// // ─────────────────────────────────────────────────────────────
// export type ChatMessage = { role: 'user' | 'assistant'; content: string };

// // ─────────────────────────────────────────────────────────────
// // TEXT: NVIDIA (non-streaming)
// // ─────────────────────────────────────────────────────────────
// async function nvidiaText(msgs: ChatMessage[], sys: string, mode?: string): Promise<string> {
//   if (!NVIDIA_KEY) throw new Error('No NVIDIA key');
//   const tryModels = [pickNvidiaModel(mode), NVIDIA_MODELS.fast];
//   for (const model of tryModels) {
//     try {
//       const res = await fetchWithTimeout(`${NVIDIA_BASE}/chat/completions`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${NVIDIA_KEY}` },
//         body: JSON.stringify({
//           model,
//           temperature: 0.4,
//           max_tokens: 4096,
//           messages: [{ role: 'system', content: sys }, ...msgs],
//         }),
//       }, 55_000);
//       if (!res.ok) { logger.debug(`[NVIDIA] ${model} HTTP ${res.status}`); continue; }
//       const data = await res.json();
//       const ans = data.choices?.[0]?.message?.content?.trim();
//       if (ans && ans.length > 20) { logger.info(`[NVIDIA text] ✅ ${model}`); return ans; }
//     } catch (e: any) {
//       logger.debug(`[NVIDIA text] ${model}: ${e.message}`);
//     }
//   }
//   throw new Error('NVIDIA text: all models failed');
// }

// // ─────────────────────────────────────────────────────────────
// // TEXT: GROQ (non-streaming)
// // ─────────────────────────────────────────────────────────────
// async function groqText(msgs: ChatMessage[], sys: string): Promise<string> {
//   if (!GROQ_KEY) throw new Error('No Groq key');
//   for (const model of GROQ_MODELS) {
//     try {
//       const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
//         body: JSON.stringify({
//           model, temperature: 0.4, max_tokens: 4096,
//           messages: [{ role: 'system', content: sys }, ...msgs],
//         }),
//       });
//       if (!res.ok) continue;
//       const data = await res.json();
//       const ans = data.choices?.[0]?.message?.content?.trim();
//       if (ans && ans.length > 20) { logger.info(`[Groq text] ✅ ${model}`); return ans; }
//     } catch (e: any) {
//       logger.debug(`[Groq text] ${model}: ${e.message}`);
//     }
//   }
//   throw new Error('Groq: all models failed');
// }

// // ─────────────────────────────────────────────────────────────
// // TEXT: OPENROUTER (non-streaming)
// // ─────────────────────────────────────────────────────────────
// async function openRouterText(msgs: ChatMessage[], sys: string): Promise<string> {
//   if (!OPENROUTER_KEY) throw new Error('No OpenRouter key');
//   for (const model of OR_MODELS) {
//     try {
//       const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${OPENROUTER_KEY}`,
//           'HTTP-Referer': process.env.FRONTEND_URL || 'https://studyearnai.tech',
//           'X-Title': 'StudyEarn AI',
//         },
//         body: JSON.stringify({
//           model, temperature: 0.4, max_tokens: 4096,
//           messages: [{ role: 'system', content: sys }, ...msgs],
//         }),
//       });
//       if (!res.ok) continue;
//       const data = await res.json();
//       const ans = data.choices?.[0]?.message?.content?.trim();
//       if (ans && ans.length > 20) { logger.info(`[OR text] ✅ ${model}`); return ans; }
//     } catch (e: any) {
//       logger.debug(`[OR text] ${model}: ${e.message}`);
//     }
//   }
//   throw new Error('OpenRouter: all models failed');
// }

// // ─────────────────────────────────────────────────────────────
// // STREAMING HELPERS
// // ─────────────────────────────────────────────────────────────
// import type { Response as ExpressResponse } from 'express';

// async function pipeStream(response: Response, res: ExpressResponse): Promise<void> {
//   const reader = (response.body as any).getReader();
//   const decoder = new TextDecoder();
//   try {
//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;
//       const lines = decoder.decode(value, { stream: true }).split('\n').filter((l: string) => l.trim());
//       for (const line of lines) {
//         if (!line.startsWith('data: ')) continue;
//         const data = line.slice(6).trim();
//         if (data === '[DONE]') { res.write('data: [DONE]\n\n'); return; }
//         try {
//           const delta = JSON.parse(data).choices?.[0]?.delta?.content;
//           if (delta) res.write(`data: ${JSON.stringify({ token: delta })}\n\n`);
//         } catch { /* skip malformed */ }
//       }
//     }
//   } finally {
//     reader.releaseLock();
//   }
// }

// async function nvidiaStream(msgs: ChatMessage[], sys: string, mode: string | undefined, res: ExpressResponse): Promise<void> {
//   if (!NVIDIA_KEY) throw new Error('No NVIDIA key');
//   const response = await fetchWithTimeout(`${NVIDIA_BASE}/chat/completions`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${NVIDIA_KEY}` },
//     body: JSON.stringify({
//       model: pickNvidiaModel(mode),
//       temperature: 0.4, max_tokens: 4096, stream: true,
//       messages: [{ role: 'system', content: sys }, ...msgs],
//     }),
//   }, 60_000);
//   if (!response.ok) throw new Error(`NVIDIA stream HTTP ${response.status}`);
//   logger.info(`[NVIDIA stream] ✅ ${pickNvidiaModel(mode)}`);
//   await pipeStream(response, res);
// }

// async function groqStream(msgs: ChatMessage[], sys: string, res: ExpressResponse): Promise<void> {
//   if (!GROQ_KEY) throw new Error('No Groq key');
//   for (const model of GROQ_MODELS) {
//     try {
//       const response = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
//         body: JSON.stringify({ model, temperature: 0.4, max_tokens: 4096, stream: true, messages: [{ role: 'system', content: sys }, ...msgs] }),
//       });
//       if (!response.ok) continue;
//       logger.info(`[Groq stream] ✅ ${model}`);
//       await pipeStream(response, res);
//       return;
//     } catch (e: any) {
//       logger.debug(`[Groq stream] ${model}: ${e.message}`);
//     }
//   }
//   throw new Error('Groq stream: all failed');
// }

// async function openRouterStream(msgs: ChatMessage[], sys: string, res: ExpressResponse): Promise<void> {
//   if (!OPENROUTER_KEY) throw new Error('No OR key');
//   for (const model of OR_MODELS.slice(0, 3)) {
//     try {
//       const response = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${OPENROUTER_KEY}`,
//           'HTTP-Referer': process.env.FRONTEND_URL || 'https://studyearnai.tech',
//           'X-Title': 'StudyEarn AI',
//         },
//         body: JSON.stringify({ model, temperature: 0.4, max_tokens: 4096, stream: true, messages: [{ role: 'system', content: sys }, ...msgs] }),
//       });
//       if (!response.ok) continue;
//       logger.info(`[OR stream] ✅ ${model}`);
//       await pipeStream(response, res);
//       return;
//     } catch (e: any) {
//       logger.debug(`[OR stream] ${model}: ${e.message}`);
//     }
//   }
//   throw new Error('OpenRouter stream: all failed');
// }

// // ─────────────────────────────────────────────────────────────
// // VISION: NVIDIA (PRIMARY for images)
// // ─────────────────────────────────────────────────────────────
// async function nvidiaVision(imageUrl: string, userPrompt: string): Promise<string> {
//   if (!NVIDIA_KEY) throw new Error('No NVIDIA key');

//   const prompt = userPrompt?.trim()
//     ? `${VISION_PROMPT}\n\nStudent's question: "${userPrompt}"\n\nAnalyze the image and answer completely.`
//     : `${VISION_PROMPT}\n\nAnalyze this image completely. Identify and solve all questions/problems shown.`;

//   for (const model of NVIDIA_VISION_MODELS) {
//     try {
//       const res = await fetchWithTimeout(`${NVIDIA_BASE}/chat/completions`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${NVIDIA_KEY}` },
//         body: JSON.stringify({
//           model,
//           temperature: 0.2,
//           max_tokens: 4096,
//           messages: [{
//             role: 'user',
//             content: [
//               { type: 'image_url', image_url: { url: imageUrl } },
//               { type: 'text', text: prompt },
//             ],
//           }],
//         }),
//       }, 60_000);

//       if (!res.ok) { logger.debug(`[NVIDIA vision] ${model} HTTP ${res.status}`); continue; }
//       const data = await res.json();
//       const ans = data.choices?.[0]?.message?.content?.trim();
//       const BAD = ["i don't see", "no image", "cannot see", "no picture", "can't view", "please provide", "i'm unable to see", "not visible"];
//       if (ans && ans.length > 20 && !BAD.some(b => ans.toLowerCase().includes(b))) {
//         logger.info(`[NVIDIA vision] ✅ ${model}`);
//         return ans;
//       }
//     } catch (e: any) {
//       logger.warn(`[NVIDIA vision] ${model}: ${e.message}`);
//     }
//   }
//   throw new Error('NVIDIA vision: all models failed');
// }

// // ─────────────────────────────────────────────────────────────
// // VISION: GROQ (secondary)
// // ─────────────────────────────────────────────────────────────
// async function groqVision(imageUrl: string, userPrompt: string): Promise<string> {
//   if (!GROQ_KEY) throw new Error('No Groq key');

//   const prompt = userPrompt?.trim()
//     ? `Student's question: "${userPrompt}". Analyze the image and answer completely step-by-step.`
//     : 'Analyze this exam/homework image and solve everything step-by-step with full working.';

//   const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
//     body: JSON.stringify({
//       model: GROQ_VISION_MODEL,
//       messages: [{
//         role: 'user',
//         content: [
//           { type: 'image_url', image_url: { url: imageUrl } },
//           { type: 'text', text: prompt },
//         ],
//       }],
//       temperature: 0.2, max_tokens: 4096,
//     }),
//   });

//   if (!res.ok) throw new Error(`Groq vision HTTP ${res.status}`);
//   const data = await res.json();
//   const ans = data.choices?.[0]?.message?.content?.trim();
//   const BAD = ["i don't see", "no image", "cannot see", "no picture", "can't view", "please provide"];
//   if (!ans || ans.length < 20 || BAD.some(b => ans.toLowerCase().includes(b))) {
//     throw new Error('Groq vision: bad response');
//   }
//   logger.info(`[Groq vision] ✅`);
//   return ans;
// }

// // ─────────────────────────────────────────────────────────────
// // VISION: OPENROUTER (tertiary)
// // ─────────────────────────────────────────────────────────────
// async function openRouterVision(imageUrl: string, userPrompt: string): Promise<string> {
//   if (!OPENROUTER_KEY) throw new Error('No OR key');

//   const prompt = userPrompt?.trim()
//     ? `Student says: "${userPrompt}". Read the image and answer completely.`
//     : 'Read this exam/homework image and solve everything step-by-step.';

//   for (const model of OR_VISION_MODELS) {
//     try {
//       const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${OPENROUTER_KEY}`,
//           'HTTP-Referer': process.env.FRONTEND_URL || 'https://studyearnai.tech',
//           'X-Title': 'StudyEarn AI',
//         },
//         body: JSON.stringify({
//           model,
//           messages: [{
//             role: 'user',
//             content: [
//               { type: 'text', text: prompt },
//               { type: 'image_url', image_url: { url: imageUrl } },
//             ],
//           }],
//           temperature: 0.2, max_tokens: 4096,
//         }),
//       });
//       if (!res.ok) continue;
//       const data = await res.json();
//       const ans = data.choices?.[0]?.message?.content?.trim();
//       const BAD = ["i don't see", "no image", "cannot see", "no picture", "can't view", "please provide"];
//       if (ans && ans.length > 20 && !BAD.some(b => ans.toLowerCase().includes(b))) {
//         logger.info(`[OR vision] ✅ ${model}`);
//         return ans;
//       }
//     } catch (e: any) {
//       logger.warn(`[OR vision] ${model}: ${e.message}`);
//     }
//   }
//   throw new Error('OR vision: all models failed');
// }

// // ─────────────────────────────────────────────────────────────
// // PUBLIC API — solveText
// // NVIDIA → GROQ → OpenRouter  (text only)
// // ─────────────────────────────────────────────────────────────
// export async function solveText(prompt: string, history: ChatMessage[] = [], subjectMode?: string): Promise<string> {
//   const sys = getSystemPrompt(subjectMode);
//   const msgs: ChatMessage[] = [...history, { role: 'user', content: prompt }];

//   if (NVIDIA_KEY) {
//     try { return await nvidiaText(msgs, sys, subjectMode); }
//     catch (e: any) { logger.warn(`NVIDIA→Groq: ${e.message}`); }
//   }
//   if (GROQ_KEY) {
//     try { return await groqText(msgs, sys); }
//     catch (e: any) { logger.warn(`Groq→OR: ${e.message}`); }
//   }
//   if (OPENROUTER_KEY) {
//     try { return await openRouterText(msgs, sys); }
//     catch (e: any) { logger.warn(`OR failed: ${e.message}`); }
//   }
//   throw new Error('All AI providers failed');
// }

// // ─────────────────────────────────────────────────────────────
// // PUBLIC API — solveTextStream
// // Streaming SSE: NVIDIA → GROQ → OpenRouter
// // ─────────────────────────────────────────────────────────────
// export async function solveTextStream(
//   prompt: string,
//   history: ChatMessage[],
//   subjectMode: string | undefined,
//   res: ExpressResponse,
// ): Promise<void> {
//   const sys = getSystemPrompt(subjectMode);
//   const msgs: ChatMessage[] = [...history, { role: 'user', content: prompt }];

//   if (NVIDIA_KEY) {
//     try { await nvidiaStream(msgs, sys, subjectMode, res); return; }
//     catch (e: any) { logger.warn(`NVIDIA stream→Groq: ${e.message}`); }
//   }
//   if (GROQ_KEY) {
//     try { await groqStream(msgs, sys, res); return; }
//     catch (e: any) { logger.warn(`Groq stream→OR: ${e.message}`); }
//   }
//   if (OPENROUTER_KEY) {
//     try { await openRouterStream(msgs, sys, res); return; }
//     catch (e: any) { logger.warn(`OR stream failed: ${e.message}`); }
//   }
//   throw new Error('All streaming providers failed');
// }

// // ─────────────────────────────────────────────────────────────
// // PUBLIC API — solveWithVision
// // NVIDIA Vision (PRIMARY) → Groq Vision → OR Vision → text fallback
// // ─────────────────────────────────────────────────────────────
// export async function solveWithVision(imageUrl: string, userPrompt: string): Promise<string> {
//   // 1. NVIDIA Vision (best quality, our primary free model)
//   if (NVIDIA_KEY) {
//     try { return await nvidiaVision(imageUrl, userPrompt); }
//     catch (e: any) { logger.warn(`NVIDIA vision→Groq: ${e.message}`); }
//   }

//   // 2. Groq Vision (secondary)
//   if (GROQ_KEY) {
//     try { return await groqVision(imageUrl, userPrompt); }
//     catch (e: any) { logger.warn(`Groq vision→OR: ${e.message}`); }
//   }

//   // 3. OpenRouter Vision (tertiary)
//   if (OPENROUTER_KEY) {
//     try { return await openRouterVision(imageUrl, userPrompt); }
//     catch (e: any) { logger.warn(`OR vision failed: ${e.message}`); }
//   }

//   // 4. Text-only fallback
//   try {
//     const fallback = await solveText(
//       userPrompt?.trim()
//         ? `A student uploaded an image and asked: "${userPrompt}". Answer this question completely.`
//         : 'A student uploaded an exam/homework image. Provide a comprehensive study guide on common topics.'
//     );
//     return `⚠️ **Note:** Could not read image directly, but here is help:\n\n${fallback}`;
//   } catch { /* ignore */ }

//   return '❌ Unable to process this image. Please try uploading a clearer image or type the question manually.';
// }

// // ─────────────────────────────────────────────────────────────
// // PUBLIC API — solveWithVisionForPDF
// // For scanned PDFs: convert page to base64 image → NVIDIA vision
// // ─────────────────────────────────────────────────────────────
// export async function solveWithVisionForPDF(pageImageBase64: string, userPrompt: string, pageNum: number): Promise<string> {
//   const imageUrl = `data:image/jpeg;base64,${pageImageBase64}`;
//   const prompt = userPrompt?.trim()
//     ? `This is page ${pageNum} of a PDF. Student asks: "${userPrompt}". Analyze and answer completely.`
//     : `This is page ${pageNum} of a PDF. Extract all text, solve all questions shown, explain all diagrams.`;

//   logger.info(`[PDF Vision] Processing page ${pageNum}`);
//   return solveWithVision(imageUrl, prompt);
// }

// // ─────────────────────────────────────────────────────────────
// // PUBLIC API — generatePPTContent (unchanged)
// // ─────────────────────────────────────────────────────────────
// export async function generatePPTContent(system: string, user: string): Promise<string> {
//   const msgs: ChatMessage[] = [{ role: 'user', content: user }];

//   if (NVIDIA_KEY) {
//     try {
//       const res = await fetchWithTimeout(`${NVIDIA_BASE}/chat/completions`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${NVIDIA_KEY}` },
//         body: JSON.stringify({
//           model: NVIDIA_MODELS.fast,
//           messages: [{ role: 'system', content: system }, ...msgs],
//           temperature: 0.3, max_tokens: 3000,
//         }),
//       });
//       if (res.ok) {
//         const d = await res.json();
//         const a = d.choices?.[0]?.message?.content;
//         if (a && a.length > 50) return a;
//       }
//     } catch { /* fall through */ }
//   }

//   if (GROQ_KEY) {
//     for (const model of GROQ_MODELS.slice(0, 2)) {
//       try {
//         const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
//           body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.3, max_tokens: 3000 }),
//         });
//         if (!res.ok) continue;
//         const d = await res.json();
//         const a = d.choices?.[0]?.message?.content;
//         if (a && a.length > 50) return a;
//       } catch { /* try next */ }
//     }
//   }

//   if (OPENROUTER_KEY) {
//     for (const model of OR_MODELS.slice(0, 3)) {
//       try {
//         const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${OPENROUTER_KEY}`,
//             'HTTP-Referer': process.env.FRONTEND_URL || 'https://studyearnai.tech',
//             'X-Title': 'StudyEarn AI',
//           },
//           body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.3, max_tokens: 3000 }),
//         });
//         if (!res.ok) continue;
//         const d = await res.json();
//         const a = d.choices?.[0]?.message?.content;
//         if (a && a.length > 50) return a;
//       } catch { /* try next */ }
//     }
//   }

//   throw new Error('PPT: all providers failed');
// }






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
// StudyEarn AI — AI Service  (UPGRADED v4)
// ─────────────────────────────────────────────────────────────
// Text   → GROQ → OpenRouter  (unchanged, fast)
// Image  → NVIDIA Vision (primary) → Groq Vision → OR Vision
// PDF    → pdfService text extract → NVIDIA Text
//          scanned PDF → NVIDIA Vision (page-by-page)
// ─────────────────────────────────────────────────────────────
 
import { logger } from '../utils/logger.js';
 
// ─────────────────────────────────────────────────────────────
// ENV KEYS
// ─────────────────────────────────────────────────────────────
const NVIDIA_KEY      = process.env.NVIDIA_API_KEY      || '';
const GROQ_KEY        = process.env.GROQ_API_KEY        || '';
const OPENROUTER_KEY  = process.env.OPENROUTER_API_KEY  || '';
 
const AI_TIMEOUT_MS   = 45_000;
const NVIDIA_BASE     = 'https://integrate.api.nvidia.com/v1';
 
// ─────────────────────────────────────────────────────────────
// MODEL ROSTERS
// ─────────────────────────────────────────────────────────────
 
// NVIDIA text models — subject-aware routing
const NVIDIA_MODELS = {
  ultra:   'meta/llama-3.1-405b-instruct',      // best quality
  math:    'deepseek-ai/deepseek-r1',            // math/reasoning
  coding:  'nvidia/llama-3.3-nemotron-super-49b-v1', // coding
  fast:    'meta/llama-3.3-70b-instruct',        // fast fallback
  stem:    'microsoft/phi-4',                    // science/STEM
};
 
// NVIDIA vision models (for images + scanned PDFs) — free tier
const NVIDIA_VISION_MODELS = [
  'meta/llama-3.2-11b-vision-instruct',          // best free vision
  'microsoft/phi-3.5-vision-instruct',           // backup vision
];
 
// Groq text models
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
];
 
// Groq vision model
const GROQ_VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';
 
// OpenRouter text models (free)
const OR_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-r1-0528:free',
  'qwen/qwen3-235b-a22b:free',
  'google/gemma-3-27b-it:free',
  'mistralai/mistral-small-3.1-24b-instruct:free',
];
 
// OpenRouter vision models (free)
const OR_VISION_MODELS = [
  'qwen/qwen2.5-vl-72b-instruct:free',
  'qwen/qwen2.5-vl-7b-instruct:free',
  'meta-llama/llama-3.2-11b-vision-instruct:free',
  'microsoft/phi-4-multimodal-instruct:free',
  'google/gemini-2.0-flash-exp:free',
];
 
// ─────────────────────────────────────────────────────────────
// SYSTEM PROMPTS
// ─────────────────────────────────────────────────────────────
const BASE_PROMPT = `You are StudyEarn AI — an expert academic tutor for Indian students (CBSE, ICSE, JEE, NEET, Class 8-12 and college).
 
STRICT FORMATTING RULES — follow these exactly every time:
 
1. STRUCTURE: Use ## for main sections, ### for sub-sections
2. BULLETS: Use - for bullet lists (dash + space). Never use • or * for bullets.
3. NUMBERED STEPS: Use 1. 2. 3. format (number + dot + space)
4. BOLD: **bold** for key terms, definitions, formulas, answers
5. CODE: Always wrap code in triple backticks with language name:
   \`\`\`python
   code here
   \`\`\`
6. CALLOUTS: Use > for important notes: > **Note:** text here
7. EMOJIS: Use naturally — 📌 key points, 💡 tips, ⚠️ warnings, ✅ correct, ❌ wrong, 🔥 exam topics
 
ANSWER QUALITY RULES:
- Answer COMPLETELY. Never say "left as exercise" or truncate.
- For multiple questions: number each answer clearly.
- Math: show formula → substitute values → every step → **final answer**
- Code: complete runnable code + comments + expected output
- Science: state law → formula → solve → real example
- Reply in Hinglish naturally if student writes in Hinglish
- Indian board exam style — thorough, structured, marks-worthy
 
END OF EVERY ANSWER — always add this section:
 
---
💬 **Want to explore more?**
- [Specific follow-up 1 — related concept or common confusion on this exact topic]
- [Specific follow-up 2 — harder extension or next logical step]
- [Specific follow-up 3 — practice problems or real-world application]
 
Keep follow-ups SPECIFIC to what was just answered. 🎯\`;
 
const MATH_PROMPT = BASE_PROMPT + '\n\n📐 **MATH MODE:** Show formula → substitution → every step. Verify answer. Use **bold** for final answer. Box the result.';
const CODING_PROMPT = BASE_PROMPT + '\n\n💻 **CODING MODE:** Complete runnable code always. Comment every line. Show expected output. Explain WHY each part works.';
const SCIENCE_PROMPT = BASE_PROMPT + '\n\n🔬 **SCIENCE MODE:** State law/formula first. Substitute with units. Real-world example after. Use diagrams in text if helpful.';
 
const VISION_PROMPT = `You are StudyEarn AI — an expert tutor. A student has shared an image (exam paper, homework, diagram, or problem).
 
FORMATTING RULES:
• Use **bold** for important terms and answers
• Use emojis: 📌 💡 ⚠️ ✅ ❌ 🔥 naturally
• Use ## headings for sections
• Wrap all code in triple backticks
• Use numbered steps for solutions
• Use > blockquote for key notes
 
YOUR JOB:
1. READ the image carefully — identify ALL text, numbers, diagrams, equations
2. Solve EVERY question/problem you see, completely and step-by-step
3. If it's a diagram: explain what it shows, label all parts
4. If it's text/theory: summarize and explain key concepts
5. Be thorough — Indian exam style`;
 
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
 
// ─────────────────────────────────────────────────────────────
// FETCH HELPER
// ─────────────────────────────────────────────────────────────
function fetchWithTimeout(url: string, options: RequestInit, ms = AI_TIMEOUT_MS): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...options, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}
 
// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
export type ChatMessage = { role: 'user' | 'assistant'; content: string };
 
// ─────────────────────────────────────────────────────────────
// TEXT: NVIDIA (non-streaming)
// ─────────────────────────────────────────────────────────────
async function nvidiaText(msgs: ChatMessage[], sys: string, mode?: string): Promise<string> {
  if (!NVIDIA_KEY) throw new Error('No NVIDIA key');
  const tryModels = [pickNvidiaModel(mode), NVIDIA_MODELS.fast];
  for (const model of tryModels) {
    try {
      const res = await fetchWithTimeout(`${NVIDIA_BASE}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${NVIDIA_KEY}` },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          max_tokens: 4096,
          messages: [{ role: 'system', content: sys }, ...msgs],
        }),
      }, 55_000);
      if (!res.ok) { logger.debug(`[NVIDIA] ${model} HTTP ${res.status}`); continue; }
      const data = await res.json();
      const ans = data.choices?.[0]?.message?.content?.trim();
      if (ans && ans.length > 20) { logger.info(`[NVIDIA text] ✅ ${model}`); return ans; }
    } catch (e: any) {
      logger.debug(`[NVIDIA text] ${model}: ${e.message}`);
    }
  }
  throw new Error('NVIDIA text: all models failed');
}
 
// ─────────────────────────────────────────────────────────────
// TEXT: GROQ (non-streaming)
// ─────────────────────────────────────────────────────────────
async function groqText(msgs: ChatMessage[], sys: string): Promise<string> {
  if (!GROQ_KEY) throw new Error('No Groq key');
  for (const model of GROQ_MODELS) {
    try {
      const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({
          model, temperature: 0.4, max_tokens: 4096,
          messages: [{ role: 'system', content: sys }, ...msgs],
        }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const ans = data.choices?.[0]?.message?.content?.trim();
      if (ans && ans.length > 20) { logger.info(`[Groq text] ✅ ${model}`); return ans; }
    } catch (e: any) {
      logger.debug(`[Groq text] ${model}: ${e.message}`);
    }
  }
  throw new Error('Groq: all models failed');
}
 
// ─────────────────────────────────────────────────────────────
// TEXT: OPENROUTER (non-streaming)
// ─────────────────────────────────────────────────────────────
async function openRouterText(msgs: ChatMessage[], sys: string): Promise<string> {
  if (!OPENROUTER_KEY) throw new Error('No OpenRouter key');
  for (const model of OR_MODELS) {
    try {
      const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer': process.env.FRONTEND_URL || 'https://studyearnai.tech',
          'X-Title': 'StudyEarn AI',
        },
        body: JSON.stringify({
          model, temperature: 0.4, max_tokens: 4096,
          messages: [{ role: 'system', content: sys }, ...msgs],
        }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const ans = data.choices?.[0]?.message?.content?.trim();
      if (ans && ans.length > 20) { logger.info(`[OR text] ✅ ${model}`); return ans; }
    } catch (e: any) {
      logger.debug(`[OR text] ${model}: ${e.message}`);
    }
  }
  throw new Error('OpenRouter: all models failed');
}
 
// ─────────────────────────────────────────────────────────────
// STREAMING HELPERS
// ─────────────────────────────────────────────────────────────
import type { Response as ExpressResponse } from 'express';
 
async function pipeStream(response: Response, res: ExpressResponse): Promise<void> {
  const reader = (response.body as any).getReader();
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value, { stream: true }).split('\n').filter((l: string) => l.trim());
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') { res.write('data: [DONE]\n\n'); (res as any).flush?.(); return; }
        try {
          const delta = JSON.parse(data).choices?.[0]?.delta?.content;
          if (delta) { res.write(`data: ${JSON.stringify({ token: delta })}\n\n`); (res as any).flush?.(); }
        } catch { /* skip malformed */ }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
 
async function nvidiaStream(msgs: ChatMessage[], sys: string, mode: string | undefined, res: ExpressResponse): Promise<void> {
  if (!NVIDIA_KEY) throw new Error('No NVIDIA key');
  const response = await fetchWithTimeout(`${NVIDIA_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${NVIDIA_KEY}` },
    body: JSON.stringify({
      model: pickNvidiaModel(mode),
      temperature: 0.4, max_tokens: 4096, stream: true,
      messages: [{ role: 'system', content: sys }, ...msgs],
    }),
  }, 60_000);
  if (!response.ok) throw new Error(`NVIDIA stream HTTP ${response.status}`);
  logger.info(`[NVIDIA stream] ✅ ${pickNvidiaModel(mode)}`);
  await pipeStream(response, res);
}
 
async function groqStream(msgs: ChatMessage[], sys: string, res: ExpressResponse): Promise<void> {
  if (!GROQ_KEY) throw new Error('No Groq key');
  for (const model of GROQ_MODELS) {
    try {
      const response = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({ model, temperature: 0.4, max_tokens: 4096, stream: true, messages: [{ role: 'system', content: sys }, ...msgs] }),
      });
      if (!response.ok) continue;
      logger.info(`[Groq stream] ✅ ${model}`);
      await pipeStream(response, res);
      return;
    } catch (e: any) {
      logger.debug(`[Groq stream] ${model}: ${e.message}`);
    }
  }
  throw new Error('Groq stream: all failed');
}
 
async function openRouterStream(msgs: ChatMessage[], sys: string, res: ExpressResponse): Promise<void> {
  if (!OPENROUTER_KEY) throw new Error('No OR key');
  for (const model of OR_MODELS.slice(0, 3)) {
    try {
      const response = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer': process.env.FRONTEND_URL || 'https://studyearnai.tech',
          'X-Title': 'StudyEarn AI',
        },
        body: JSON.stringify({ model, temperature: 0.4, max_tokens: 4096, stream: true, messages: [{ role: 'system', content: sys }, ...msgs] }),
      });
      if (!response.ok) continue;
      logger.info(`[OR stream] ✅ ${model}`);
      await pipeStream(response, res);
      return;
    } catch (e: any) {
      logger.debug(`[OR stream] ${model}: ${e.message}`);
    }
  }
  throw new Error('OpenRouter stream: all failed');
}
 
// ─────────────────────────────────────────────────────────────
// VISION: NVIDIA (PRIMARY for images)
// ─────────────────────────────────────────────────────────────
async function nvidiaVision(imageUrl: string, userPrompt: string): Promise<string> {
  if (!NVIDIA_KEY) throw new Error('No NVIDIA key');
 
  const prompt = userPrompt?.trim()
    ? `${VISION_PROMPT}\n\nStudent's question: "${userPrompt}"\n\nAnalyze the image and answer completely.`
    : `${VISION_PROMPT}\n\nAnalyze this image completely. Identify and solve all questions/problems shown.`;
 
  for (const model of NVIDIA_VISION_MODELS) {
    try {
      const res = await fetchWithTimeout(`${NVIDIA_BASE}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${NVIDIA_KEY}` },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: 4096,
          messages: [{
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: imageUrl } },
              { type: 'text', text: prompt },
            ],
          }],
        }),
      }, 60_000);
 
      if (!res.ok) { logger.debug(`[NVIDIA vision] ${model} HTTP ${res.status}`); continue; }
      const data = await res.json();
      const ans = data.choices?.[0]?.message?.content?.trim();
      const BAD = ["i don't see", "no image", "cannot see", "no picture", "can't view", "please provide", "i'm unable to see", "not visible"];
      if (ans && ans.length > 20 && !BAD.some(b => ans.toLowerCase().includes(b))) {
        logger.info(`[NVIDIA vision] ✅ ${model}`);
        return ans;
      }
    } catch (e: any) {
      logger.warn(`[NVIDIA vision] ${model}: ${e.message}`);
    }
  }
  throw new Error('NVIDIA vision: all models failed');
}
 
// ─────────────────────────────────────────────────────────────
// VISION: GROQ (secondary)
// ─────────────────────────────────────────────────────────────
async function groqVision(imageUrl: string, userPrompt: string): Promise<string> {
  if (!GROQ_KEY) throw new Error('No Groq key');
 
  const prompt = userPrompt?.trim()
    ? `Student's question: "${userPrompt}". Analyze the image and answer completely step-by-step.`
    : 'Analyze this exam/homework image and solve everything step-by-step with full working.';
 
  const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({
      model: GROQ_VISION_MODEL,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: imageUrl } },
          { type: 'text', text: prompt },
        ],
      }],
      temperature: 0.2, max_tokens: 4096,
    }),
  });
 
  if (!res.ok) throw new Error(`Groq vision HTTP ${res.status}`);
  const data = await res.json();
  const ans = data.choices?.[0]?.message?.content?.trim();
  const BAD = ["i don't see", "no image", "cannot see", "no picture", "can't view", "please provide"];
  if (!ans || ans.length < 20 || BAD.some(b => ans.toLowerCase().includes(b))) {
    throw new Error('Groq vision: bad response');
  }
  logger.info(`[Groq vision] ✅`);
  return ans;
}
 
// ─────────────────────────────────────────────────────────────
// VISION: OPENROUTER (tertiary)
// ─────────────────────────────────────────────────────────────
async function openRouterVision(imageUrl: string, userPrompt: string): Promise<string> {
  if (!OPENROUTER_KEY) throw new Error('No OR key');
 
  const prompt = userPrompt?.trim()
    ? `Student says: "${userPrompt}". Read the image and answer completely.`
    : 'Read this exam/homework image and solve everything step-by-step.';
 
  for (const model of OR_VISION_MODELS) {
    try {
      const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer': process.env.FRONTEND_URL || 'https://studyearnai.tech',
          'X-Title': 'StudyEarn AI',
        },
        body: JSON.stringify({
          model,
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          }],
          temperature: 0.2, max_tokens: 4096,
        }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const ans = data.choices?.[0]?.message?.content?.trim();
      const BAD = ["i don't see", "no image", "cannot see", "no picture", "can't view", "please provide"];
      if (ans && ans.length > 20 && !BAD.some(b => ans.toLowerCase().includes(b))) {
        logger.info(`[OR vision] ✅ ${model}`);
        return ans;
      }
    } catch (e: any) {
      logger.warn(`[OR vision] ${model}: ${e.message}`);
    }
  }
  throw new Error('OR vision: all models failed');
}
 
// ─────────────────────────────────────────────────────────────
// PUBLIC API — solveText
// NVIDIA → GROQ → OpenRouter  (text only)
// ─────────────────────────────────────────────────────────────
export async function solveText(prompt: string, history: ChatMessage[] = [], subjectMode?: string): Promise<string> {
  const sys = getSystemPrompt(subjectMode);
  const msgs: ChatMessage[] = [...history, { role: 'user', content: prompt }];
 
  if (GROQ_KEY) {
    try { return await groqText(msgs, sys); }
    catch (e: any) { logger.warn(`Groq→OR: ${e.message}`); }
  }
  if (OPENROUTER_KEY) {
    try { return await openRouterText(msgs, sys); }
    catch (e: any) { logger.warn(`OR failed: ${e.message}`); }
  }
  throw new Error('All AI providers failed');
}
 
// ─────────────────────────────────────────────────────────────
// PUBLIC API — solveTextStream
// Streaming SSE: NVIDIA → GROQ → OpenRouter
// ─────────────────────────────────────────────────────────────
export async function solveTextStream(
  prompt: string,
  history: ChatMessage[],
  subjectMode: string | undefined,
  res: ExpressResponse,
): Promise<void> {
  const sys = getSystemPrompt(subjectMode);
  const msgs: ChatMessage[] = [...history, { role: 'user', content: prompt }];
 
  if (GROQ_KEY) {
    try { await groqStream(msgs, sys, res); return; }
    catch (e: any) { logger.warn(`Groq stream→OR: ${e.message}`); }
  }
  if (OPENROUTER_KEY) {
    try { await openRouterStream(msgs, sys, res); return; }
    catch (e: any) { logger.warn(`OR stream failed: ${e.message}`); }
  }
  throw new Error('All streaming providers failed');
}
 
// ─────────────────────────────────────────────────────────────
// PUBLIC API — solveWithVision
// NVIDIA Vision (PRIMARY) → Groq Vision → OR Vision → text fallback
// ─────────────────────────────────────────────────────────────
export async function solveWithVision(imageUrl: string, userPrompt: string): Promise<string> {
  // 1. NVIDIA Vision (best quality, our primary free model)
  if (NVIDIA_KEY) {
    try { return await nvidiaVision(imageUrl, userPrompt); }
    catch (e: any) { logger.warn(`NVIDIA vision→Groq: ${e.message}`); }
  }
 
  // 2. Groq Vision (secondary)
  if (GROQ_KEY) {
    try { return await groqVision(imageUrl, userPrompt); }
    catch (e: any) { logger.warn(`Groq vision→OR: ${e.message}`); }
  }
 
  // 3. OpenRouter Vision (tertiary)
  if (OPENROUTER_KEY) {
    try { return await openRouterVision(imageUrl, userPrompt); }
    catch (e: any) { logger.warn(`OR vision failed: ${e.message}`); }
  }
 
  // 4. Text-only fallback
  try {
    const fallback = await solveText(
      userPrompt?.trim()
        ? `A student uploaded an image and asked: "${userPrompt}". Answer this question completely.`
        : 'A student uploaded an exam/homework image. Provide a comprehensive study guide on common topics.'
    );
    return `⚠️ **Note:** Could not read image directly, but here is help:\n\n${fallback}`;
  } catch { /* ignore */ }
 
  return '❌ Unable to process this image. Please try uploading a clearer image or type the question manually.';
}
 
// ─────────────────────────────────────────────────────────────
// PUBLIC API — solveWithVisionForPDF
// For scanned PDFs: convert page to base64 image → NVIDIA vision
// ─────────────────────────────────────────────────────────────
export async function solveWithVisionForPDF(pageImageBase64: string, userPrompt: string, pageNum: number): Promise<string> {
  const imageUrl = `data:image/jpeg;base64,${pageImageBase64}`;
  const prompt = userPrompt?.trim()
    ? `This is page ${pageNum} of a PDF. Student asks: "${userPrompt}". Analyze and answer completely.`
    : `This is page ${pageNum} of a PDF. Extract all text, solve all questions shown, explain all diagrams.`;
 
  logger.info(`[PDF Vision] Processing page ${pageNum}`);
  return solveWithVision(imageUrl, prompt);
}
 
// ─────────────────────────────────────────────────────────────
// PUBLIC API — generatePPTContent (unchanged)
// ─────────────────────────────────────────────────────────────
export async function generatePPTContent(system: string, user: string): Promise<string> {
  const msgs: ChatMessage[] = [{ role: 'user', content: user }];
 
  if (NVIDIA_KEY) {
    try {
      const res = await fetchWithTimeout(`${NVIDIA_BASE}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${NVIDIA_KEY}` },
        body: JSON.stringify({
          model: NVIDIA_MODELS.fast,
          messages: [{ role: 'system', content: system }, ...msgs],
          temperature: 0.3, max_tokens: 3000,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        const a = d.choices?.[0]?.message?.content;
        if (a && a.length > 50) return a;
      }
    } catch { /* fall through */ }
  }
 
  if (GROQ_KEY) {
    for (const model of GROQ_MODELS.slice(0, 2)) {
      try {
        const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
          body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.3, max_tokens: 3000 }),
        });
        if (!res.ok) continue;
        const d = await res.json();
        const a = d.choices?.[0]?.message?.content;
        if (a && a.length > 50) return a;
      } catch { /* try next */ }
    }
  }
 
  if (OPENROUTER_KEY) {
    for (const model of OR_MODELS.slice(0, 3)) {
      try {
        const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENROUTER_KEY}`,
            'HTTP-Referer': process.env.FRONTEND_URL || 'https://studyearnai.tech',
            'X-Title': 'StudyEarn AI',
          },
          body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.3, max_tokens: 3000 }),
        });
        if (!res.ok) continue;
        const d = await res.json();
        const a = d.choices?.[0]?.message?.content;
        if (a && a.length > 50) return a;
      } catch { /* try next */ }
    }
  }
 
  throw new Error('PPT: all providers failed');
}