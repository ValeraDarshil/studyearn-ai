// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import axios from "axios";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: "25mb" }));

// const GROQ_KEY = process.env.GROQ_API_KEY!;
// const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY!;

// // ── GROQ: Text questions (primary - fast & free) ───────────────────────────
// const callGroq = async (prompt: string): Promise<string> => {
//   const models = [
//     "llama-3.3-70b-versatile",
//     "llama-3.1-70b-versatile",
//     "mixtral-8x7b-32768",
//     "gemma2-9b-it",
//   ];

//   for (const model of models) {
//     try {
//       console.log(`  🚀 Groq trying: ${model}`);
//       const res = await axios.post(
//         "https://api.groq.com/openai/v1/chat/completions",
//         {
//           model,
//           messages: [
//             {
//               role: "system",
//               content: "You are an expert educational AI tutor. Give clear, well-structured answers with proper explanations. Use numbered lists, bullet points where helpful. Be thorough but concise."
//             },
//             { role: "user", content: prompt }
//           ],
//           max_tokens: 1024,
//           temperature: 0.7,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${GROQ_KEY}`,
//             "Content-Type": "application/json",
//           },
//           timeout: 30000,
//         }
//       );
//       const answer = res.data.choices?.[0]?.message?.content;
//       if (answer) {
//         console.log(`  ✅ Groq SUCCESS: ${model}`);
//         return answer;
//       }
//     } catch (err: any) {
//       console.log(`  ❌ Groq ${model}: ${err.response?.status} - ${err.response?.data?.error?.message || err.message}`);
//     }
//   }
//   throw new Error("Groq: all models failed");
// };

// // ── OPENROUTER: Vision (image questions) ──────────────────────────────────
// const callVisionOpenRouter = async (prompt: string, image: string): Promise<string> => {
//   const VISION_MODELS = [
//     "google/gemma-3-27b-it:free",
//     "nvidia/nemotron-nano-12b-v2-vl:free",
//     "google/gemma-3-12b-it:free",
//   ];

//   for (const model of VISION_MODELS) {
//     try {
//       console.log(`  👁️ Vision trying: ${model}`);
//       const res = await axios.post(
//         "https://openrouter.ai/api/v1/chat/completions",
//         {
//           model,
//           messages: [{
//             role: "user",
//             content: [
//               {
//                 type: "text",
//                 text: prompt
//                   ? `${prompt}\n\nPlease analyze the image carefully and provide a detailed, step-by-step solution.`
//                   : "Look at this image carefully. If it contains a math problem, science question, or any academic question, solve it step by step with clear explanation."
//               },
//               { type: "image_url", image_url: { url: image } },
//             ]
//           }],
//           max_tokens: 1024,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${OPENROUTER_KEY}`,
//             "Content-Type": "application/json",
//             "HTTP-Referer": "http://localhost:5173",
//             "X-Title": "StudyEarn AI",
//           },
//           timeout: 40000,
//         }
//       );
//       const answer = res.data.choices?.[0]?.message?.content;
//       if (answer && !answer.toLowerCase().includes("i don't see an image") && !answer.toLowerCase().includes("no image")) {
//         console.log(`  ✅ Vision SUCCESS: ${model}`);
//         return answer;
//       }
//       console.log(`  ⚠️ ${model}: returned unhelpful answer, trying next...`);
//     } catch (err: any) {
//       console.log(`  ❌ Vision ${model}: ${err.response?.status}`);
//     }
//   }
//   throw new Error("Vision: all models failed");
// };

// // ── OPENROUTER: Text fallback ──────────────────────────────────────────────
// const callOpenRouterText = async (prompt: string): Promise<string> => {
//   const MODELS = [
//     "google/gemma-3-27b-it:free",
//     "meta-llama/llama-3.3-70b-instruct:free",
//     "nousresearch/hermes-3-llama-3.1-405b:free",
//   ];

//   for (const model of MODELS) {
//     try {
//       console.log(`  🔄 OpenRouter trying: ${model}`);
//       const res = await axios.post(
//         "https://openrouter.ai/api/v1/chat/completions",
//         {
//           model,
//           messages: [
//             {
//               role: "system",
//               content: "You are an expert educational AI tutor. Give clear, well-structured answers."
//             },
//             { role: "user", content: prompt }
//           ],
//           max_tokens: 1024,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${OPENROUTER_KEY}`,
//             "Content-Type": "application/json",
//             "HTTP-Referer": "http://localhost:5173",
//           },
//           timeout: 35000,
//         }
//       );
//       const answer = res.data.choices?.[0]?.message?.content;
//       if (answer) {
//         console.log(`  ✅ OpenRouter SUCCESS: ${model}`);
//         return answer;
//       }
//     } catch (err: any) {
//       console.log(`  ❌ OR ${model}: ${err.response?.status}`);
//     }
//   }
//   throw new Error("OpenRouter: all models failed");
// };

// // ── Rate limiter ───────────────────────────────────────────────────────────
// const requestTracker = new Map<string, { count: number; resetTime: number }>();
// const checkRateLimit = (userId: string): boolean => {
//   const now = Date.now();
//   const data = requestTracker.get(userId);
//   if (!data || now > data.resetTime) {
//     requestTracker.set(userId, { count: 1, resetTime: now + 3600000 });
//     return true;
//   }
//   if (data.count >= 30) return false;
//   data.count++;
//   return true;
// };

// // ── MAIN ENDPOINT ──────────────────────────────────────────────────────────
// app.post("/api/ai", async (req, res) => {
//   const { prompt, image, userId } = req.body;

//   if (!prompt && !image) {
//     return res.json({ success: false, answer: "Please enter a question!" });
//   }

//   const uid = userId || "anonymous";
//   if (!checkRateLimit(uid)) {
//     return res.json({ success: false, answer: "Rate limit reached (30/hour). Please wait." });
//   }

//   console.log(`\n📥 [${uid}] image:${!!image} | "${prompt?.substring(0, 50)}"`);

//   try {
//     let answer: string;

//     if (image) {
//       // IMAGE QUESTION: Try vision models → fallback to Groq with description
//       try {
//         answer = await callVisionOpenRouter(prompt || "", image);
//       } catch {
//         console.log("  ⚠️ All vision failed → Groq fallback");
//         // Groq can't see image, but give best text answer
//         const fallbackPrompt = `A student uploaded an image of a question and typed: "${prompt || 'solve this'}". 
// This appears to be an academic/exam question. Please provide a comprehensive, educational answer covering the most likely topic. 
// If it mentions statistics, solve using normal distribution. If math, show step-by-step workings.`;
//         answer = await callGroq(fallbackPrompt);
//       }
//     } else {
//       // TEXT QUESTION: Groq primary → OpenRouter fallback
//       try {
//         answer = await callGroq(prompt);
//       } catch {
//         console.log("  ⚠️ Groq failed → OpenRouter fallback");
//         answer = await callOpenRouterText(prompt);
//       }
//     }

//     res.json({ success: true, answer });

//   } catch (err: any) {
//     console.log("  💀 ALL FAILED:", err.message);
//     res.json({
//       success: false,
//       answer: "AI is temporarily unavailable. Please try again in a moment.",
//     });
//   }
// });

// app.get("/health", (req, res) => res.json({
//   status: "ok",
//   groq: !!GROQ_KEY ? "✅" : "❌ missing - get from console.groq.com",
//   openrouter: !!OPENROUTER_KEY ? "✅" : "❌ missing",
// }));

// app.listen(5000, () => {
//   console.log("🚀 AI Server → http://localhost:5000");
//   console.log("  Groq:        ", GROQ_KEY ? "✅ Ready" : "❌ MISSING → console.groq.com");
//   console.log("  OpenRouter:  ", OPENROUTER_KEY ? "✅ Ready" : "❌ MISSING");
// });