// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import authRoutes from "./auth.js";
// import userRoutes from "./user-routes.js";
// import leaderboardRoutes from "./leaderboard-routes.js";
// import Groq from "groq-sdk";
// import multer from "multer";
// import { PDFDocument } from "pdf-lib";
// import sharp from "sharp";
// import PptxGenJS from "pptxgenjs";
// import { connectDB } from "./db.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5003;

// /* ================= CORS ================= */

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://studyearn-ai.vercel.app",
//     ],
//     credentials: true,
//   })
// );

// app.use(express.json({ limit: "50mb" }));

// /* ================= GROQ ================= */

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// /* ================= MULTER ================= */

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 25 * 1024 * 1024 },
// });

// /* ================= PDF PARSER ================= */

// async function parsePDF(buffer: Buffer) {
//   const pdfParse: any = await import("pdf-parse");
//   return pdfParse(buffer);
// }

// /* ================= HEALTH ================= */

// app.get("/health", (_, res) => {
//   res.json({ status: "ok", port: PORT });
// });

// /* ================= ROUTES ================= */

// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/leaderboard", leaderboardRoutes);

// /* ================= ASK AI ================= */

// app.post("/api/ai/ask", async (req, res) => {
//   try {
//     const { prompt, image } = req.body;

//     if (!prompt && !image) {
//       return res.status(400).json({
//         success: false,
//         answer: "No question provided",
//       });
//     }

//     let messages: any[];

//     if (image && image.startsWith("data:image")) {
//       messages = [
//         {
//           role: "user",
//           content: [
//             {
//               type: "text",
//               text:
//                 prompt ||
//                 "Solve all questions step by step from this image.",
//             },
//             {
//               type: "image_url",
//               image_url: { url: image },
//             },
//           ],
//         },
//       ];
//     } else {
//       messages = [
//         {
//           role: "system",
//           content:
//             "You are an intelligent academic tutor. Solve step by step.",
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ];
//     }

//     const completion = await groq.chat.completions.create({
//       model: image
//         ? "llama-3.2-90b-vision-preview"
//         : "llama-3.3-70b-versatile",
//       messages,
//       temperature: 0.4,
//       max_tokens: 4096,
//     });

//     const answer =
//       completion.choices?.[0]?.message?.content || "No response";

//     res.json({ success: true, answer });

//   } catch (error: any) {
//     console.error("AI ERROR:", error);
//     res.status(500).json({
//       success: false,
//       answer: error.message,
//     });
//   }
// });

// /* ================= PDF QUESTION SOLVER ================= */

// app.post(
//   "/api/ai/solve-pdf",
//   upload.single("file"),
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ success: false });
//       }

//       const pdfData = await parsePDF(req.file.buffer);

//       const completion = await groq.chat.completions.create({
//         model: "llama-3.3-70b-versatile",
//         messages: [
//           {
//             role: "user",
//             content:
//               "Solve this question paper step by step:\n\n" +
//               pdfData.text,
//           },
//         ],
//         max_tokens: 4096,
//       });

//       const answer =
//         completion.choices?.[0]?.message?.content || "No response";

//       res.json({ success: true, answer });

//     } catch (error) {
//       console.error("PDF SOLVE ERROR:", error);
//       res.status(500).json({ success: false });
//     }
//   }
// );

// /* ================= PPT GENERATOR ================= */

// app.post("/api/ppt/generate", async (req, res) => {
//   try {
//     const { topic, slides } = req.body;

//     const pptx = new (PptxGenJS as any)();
//     pptx.layout = "LAYOUT_16x9";

//     slides.forEach((slide: any) => {
//       const s = pptx.addSlide();

//       s.addText(slide.title || "Slide", {
//         x: 0.5,
//         y: 0.5,
//         fontSize: 28,
//         bold: true,
//       });

//       const bullets = (slide.content || "")
//         .split("\n")
//         .filter((l: string) => l.trim())
//         .map((l: string) => ({
//           text: l,
//           options: { bullet: true },
//         }));

//       s.addText(bullets, {
//         x: 0.5,
//         y: 1.5,
//         fontSize: 18,
//       });
//     });

//     const buffer = await pptx.write("nodebuffer");

//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.presentationml.presentation"
//     );

//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=${topic}.pptx`
//     );

//     res.send(buffer);

//   } catch (error) {
//     console.error("PPT ERROR:", error);
//     res.status(500).json({ success: false });
//   }
// });

// /* ================= IMAGE → PDF ================= */

// app.post(
//   "/api/img-to-pdf",
//   upload.array("files"),
//   async (req: any, res) => {
//     try {
//       const pdfDoc = await PDFDocument.create();

//       for (const file of req.files) {
//         const img = await sharp(file.buffer).png().toBuffer();
//         const image = await pdfDoc.embedPng(img);

//         const page = pdfDoc.addPage([
//           image.width,
//           image.height,
//         ]);

//         page.drawImage(image, {
//           x: 0,
//           y: 0,
//           width: image.width,
//           height: image.height,
//         });
//       }

//       const pdfBytes = await pdfDoc.save();

//       res.setHeader("Content-Type", "application/pdf");
//       res.send(Buffer.from(pdfBytes));

//     } catch (error) {
//       console.error("IMG→PDF ERROR:", error);
//       res.status(500).json({ success: false });
//     }
//   }
// );

// /* ================= MERGE PDF ================= */

// app.post(
//   "/api/merge-pdf",
//   upload.array("files"),
//   async (req: any, res) => {
//     try {
//       const merged = await PDFDocument.create();

//       for (const file of req.files) {
//         const pdf = await PDFDocument.load(file.buffer);
//         const pages = await merged.copyPages(
//           pdf,
//           pdf.getPageIndices()
//         );
//         pages.forEach((p) => merged.addPage(p));
//       }

//       const pdfBytes = await merged.save();

//       res.setHeader("Content-Type", "application/pdf");
//       res.send(Buffer.from(pdfBytes));

//     } catch (error) {
//       console.error("MERGE PDF ERROR:", error);
//       res.status(500).json({ success: false });
//     }
//   }
// );

// /* ================= START SERVER ================= */

// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on ${PORT}`);
//     console.log("✅ AI Ready");
//     console.log("✅ PPT Ready");
//     console.log("✅ PDF Tools Ready");
//   });
// });


// c;aude aii //


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./auth.js";
import userRoutes from "./user-routes.js";
import leaderboardRoutes from "./leaderboard-routes.js";
import Groq from "groq-sdk";
import multer from "multer";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import PptxGenJS from "pptxgenjs";
import { connectDB } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

/* ================= CORS ================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://studyearn-ai.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));

/* ================= GROQ ================= */

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ================= MULTER ================= */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

/* ================= PDF PARSER ================= */

async function parsePDF(buffer: Buffer) {
  const pdfParse: any = await import("pdf-parse");
  return pdfParse(buffer);
}

/* ================= HEALTH ================= */

app.get("/health", (_, res) => {
  res.json({ status: "ok", port: PORT });
});

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

/* ================= AI CONFIG ================= */

const GROQ_KEY        = process.env.GROQ_API_KEY || "";
const OPENROUTER_KEY  = process.env.OPENROUTER_API_KEY || "";

const SYSTEM_PROMPT = `You are StudyEarn AI — an expert academic tutor for Indian students (CBSE, ICSE, State boards, Class 8-12 and college).

Rules:
- Solve questions COMPLETELY, step-by-step, show ALL working.
- If multiple questions exist, answer EACH ONE separately and fully with its number.
- Math: write every calculation step. Show formula → substitution → answer.
- Science: state the formula, substitute values, solve, and explain the concept.
- Theory: structured explanation with key points and real examples.
- Be thorough. Never skip steps. Indian exam style.`;

// ─────────────────────────────────────────────────────────────────────────────
// GROQ — Text only (fast, free, reliable)
// ─────────────────────────────────────────────────────────────────────────────
async function groqText(userPrompt: string): Promise<string> {
  const MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
  ];
  for (const model of MODELS) {
    try {
      console.log(`  [Groq text] trying ${model}`);
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user",   content: userPrompt },
          ],
          temperature: 0.4,
          max_tokens: 4096,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.log(`  [Groq text] ${model} HTTP ${res.status}: ${err.substring(0, 80)}`);
        continue;
      }
      const data = await res.json();
      const answer = data.choices?.[0]?.message?.content;
      if (answer && answer.trim().length > 20) {
        console.log(`  [Groq text] ✅ ${model}`);
        return answer;
      }
    } catch (e: any) {
      console.log(`  [Groq text] ${model} error: ${e.message}`);
    }
  }
  throw new Error("Groq text: all models failed");
}

// ─────────────────────────────────────────────────────────────────────────────
// GROQ — Vision (image support, free tier)
// ─────────────────────────────────────────────────────────────────────────────
async function groqVision(imageUrl: string, userPrompt: string): Promise<string> {
  const MODELS = [
    "llama-3.2-11b-vision-preview",
    "llama-3.2-90b-vision-preview",
  ];
  const text = userPrompt?.trim()
    ? `${userPrompt}\n\nAnalyze the image carefully. Solve ALL questions shown, step-by-step with complete working.`
    : "Analyze this image carefully. Find ALL questions or problems and solve each one step-by-step with complete working shown.";

  for (const model of MODELS) {
    try {
      console.log(`  [Groq vision] trying ${model}`);
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [{
            role: "user",
            content: [
              { type: "text",      text },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          }],
          temperature: 0.3,
          max_tokens: 4096,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.log(`  [Groq vision] ${model} HTTP ${res.status}: ${err.substring(0, 100)}`);
        continue;
      }
      const data = await res.json();
      const answer = data.choices?.[0]?.message?.content;
      if (answer && answer.trim().length > 30) {
        console.log(`  [Groq vision] ✅ ${model}`);
        return answer;
      }
    } catch (e: any) {
      console.log(`  [Groq vision] ${model} error: ${e.message}`);
    }
  }
  throw new Error("Groq vision: all models failed");
}

// ─────────────────────────────────────────────────────────────────────────────
// OPENROUTER — Vision (free models, fallback when Groq vision fails)
// These are the most reliable FREE vision models on OpenRouter in 2025
// ─────────────────────────────────────────────────────────────────────────────
async function openRouterVision(imageUrl: string, userPrompt: string): Promise<string> {
  if (!OPENROUTER_KEY) throw new Error("OPENROUTER_API_KEY not set");

  // Order: most reliable free vision models first
  const MODELS = [
    "meta-llama/llama-3.2-11b-vision-instruct:free",
    "qwen/qwen2.5-vl-72b-instruct:free",
    "google/gemma-3-27b-it:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "microsoft/phi-4-multimodal-instruct:free",
  ];

  const text = userPrompt?.trim()
    ? `${userPrompt}\n\nLook at this image carefully. Solve ALL questions or problems step-by-step with complete working.`
    : "Look at this image carefully. Find ALL questions or problems and solve each one completely, step-by-step, with all working shown.";

  const BAD_RESPONSES = [
    "i don't see", "no image", "cannot see", "no picture",
    "i cannot view", "not able to see", "no text", "blank",
  ];

  for (const model of MODELS) {
    try {
      console.log(`  [OpenRouter vision] trying ${model}`);
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${OPENROUTER_KEY}`,
          "HTTP-Referer":  "https://studyearn-ai.vercel.app",
          "X-Title":       "StudyEarn AI",
        },
        body: JSON.stringify({
          model,
          messages: [{
            role: "user",
            content: [
              { type: "text",      text },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          }],
          temperature: 0.3,
          max_tokens: 4096,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.log(`  [OpenRouter vision] ${model} HTTP ${res.status}: ${err.substring(0, 100)}`);
        continue;
      }
      const data = await res.json();
      const answer = data.choices?.[0]?.message?.content;
      if (answer && answer.trim().length > 30 &&
          !BAD_RESPONSES.some(b => answer.toLowerCase().includes(b))) {
        console.log(`  [OpenRouter vision] ✅ ${model}`);
        return answer;
      }
      console.log(`  [OpenRouter vision] ${model} gave unhelpful answer, trying next...`);
    } catch (e: any) {
      console.log(`  [OpenRouter vision] ${model} error: ${e.message}`);
    }
  }
  throw new Error("OpenRouter vision: all models failed");
}

// ─────────────────────────────────────────────────────────────────────────────
// OPENROUTER — Text fallback (when Groq text also fails)
// ─────────────────────────────────────────────────────────────────────────────
async function openRouterText(userPrompt: string): Promise<string> {
  if (!OPENROUTER_KEY) throw new Error("OPENROUTER_API_KEY not set");

  const MODELS = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "deepseek/deepseek-r1-0528:free",
    "qwen/qwen3-235b-a22b:free",
    "google/gemma-3-27b-it:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",
  ];

  for (const model of MODELS) {
    try {
      console.log(`  [OpenRouter text] trying ${model}`);
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${OPENROUTER_KEY}`,
          "HTTP-Referer":  "https://studyearn-ai.vercel.app",
          "X-Title":       "StudyEarn AI",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user",   content: userPrompt },
          ],
          temperature: 0.4,
          max_tokens: 4096,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.log(`  [OpenRouter text] ${model} HTTP ${res.status}: ${err.substring(0, 80)}`);
        continue;
      }
      const data = await res.json();
      const answer = data.choices?.[0]?.message?.content;
      if (answer && answer.trim().length > 20) {
        console.log(`  [OpenRouter text] ✅ ${model}`);
        return answer;
      }
    } catch (e: any) {
      console.log(`  [OpenRouter text] ${model} error: ${e.message}`);
    }
  }
  throw new Error("OpenRouter text: all models failed");
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER VISION — tries all vision providers in order
// Chain: Groq Vision → OpenRouter Vision → Text fallback with context
// ─────────────────────────────────────────────────────────────────────────────
async function solveWithVision(imageUrl: string, prompt: string): Promise<string> {
  const errors: string[] = [];

  // 1️⃣ Groq vision (fast, free, direct)
  if (GROQ_KEY) {
    try {
      return await groqVision(imageUrl, prompt);
    } catch (e: any) {
      errors.push(`Groq: ${e.message}`);
      console.log(`  Vision chain: Groq failed → trying OpenRouter`);
    }
  }

  // 2️⃣ OpenRouter vision (multiple free models)
  if (OPENROUTER_KEY) {
    try {
      return await openRouterVision(imageUrl, prompt);
    } catch (e: any) {
      errors.push(`OpenRouter: ${e.message}`);
      console.log(`  Vision chain: OpenRouter failed → text fallback`);
    }
  }

  // 3️⃣ Last resort — text model with the prompt as context
  console.log(`  Vision chain: all vision failed, using text fallback`);
  const fallbackPrompt = prompt?.trim()
    ? `A student uploaded an image and asked: "${prompt}"\n\nProvide a complete, step-by-step academic solution. Show all working clearly.`
    : `A student uploaded an image of an exam/homework question. They need help solving it. Provide a comprehensive guide covering the most common types of questions for Indian school/college students. Show step-by-step methods.`;

  if (GROQ_KEY) return await groqText(fallbackPrompt);
  if (OPENROUTER_KEY) return await openRouterText(fallbackPrompt);
  throw new Error(`All AI providers failed. Errors: ${errors.join(" | ")}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER TEXT — tries all text providers in order
// Chain: Groq Text → OpenRouter Text
// ─────────────────────────────────────────────────────────────────────────────
async function solveText(prompt: string): Promise<string> {
  if (GROQ_KEY) {
    try { return await groqText(prompt); } catch {}
    console.log("  Text chain: Groq failed → OpenRouter");
  }
  if (OPENROUTER_KEY) {
    try { return await openRouterText(prompt); } catch {}
  }
  throw new Error("All text AI providers failed");
}

/* ================= ASK AI (Image + Text) ================= */

app.post("/api/ai/ask", async (req, res) => {
  try {
    const { prompt, image } = req.body;
    if (!prompt && !image) {
      return res.status(400).json({ success: false, answer: "Please enter a question or upload an image." });
    }

    console.log(`\n📥 /api/ai/ask  image=${!!image}  prompt="${(prompt||"").substring(0,60)}"`);

    let answer: string;

    if (image) {
      // Ensure proper data URL format
      const imageUrl = image.startsWith("data:") ? image : `data:image/jpeg;base64,${image}`;
      answer = await solveWithVision(imageUrl, prompt || "");
    } else {
      answer = await solveText(prompt);
    }

    res.json({ success: true, answer });
  } catch (error: any) {
    console.error("❌ /api/ai/ask error:", error.message);
    res.status(500).json({ success: false, answer: "AI is temporarily unavailable. Please try again in a moment." });
  }
});

/* ================= PDF QUESTION SOLVER ================= */

app.post("/api/ai/solve-pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, answer: "No file uploaded." });

    const userPrompt = (req.body.prompt || "").trim();
    console.log(`\n📄 /api/ai/solve-pdf  size=${req.file.size}bytes`);

    // Extract text from PDF
    const pdfData = await parsePDF(req.file.buffer);
    const extracted = (pdfData.text || "").trim();

    if (!extracted || extracted.length < 20) {
      return res.json({
        success: false,
        answer: "❌ Could not extract text from this PDF. It appears to be a scanned or image-based PDF.\n\n**Solution:** Take a screenshot of the PDF pages and upload as an image instead — AI can then read and solve it directly.",
      });
    }

    console.log(`  Extracted ${extracted.length} chars from PDF`);

    // Truncate to fit model context (keep most important content)
    const MAX_CHARS = 14000;
    const text = extracted.length > MAX_CHARS
      ? extracted.substring(0, MAX_CHARS) + "\n\n[... rest of document truncated ...]"
      : extracted;

    const solvePrompt = userPrompt
      ? `The student says: "${userPrompt}"\n\nHere is the PDF content:\n\n${text}\n\nHelp the student as requested. Be complete and thorough.`
      : `Here is the content of a PDF document/question paper:\n\n${text}\n\nFind ALL questions in this document and solve each one completely, step-by-step with full working. Number your answers to match the original question numbers.`;

    const answer = await solveText(solvePrompt);
    res.json({ success: true, answer });

  } catch (error: any) {
    console.error("❌ /api/ai/solve-pdf error:", error.message);
    res.status(500).json({ success: false, answer: "Failed to process PDF. Please try again." });
  }
});


/* ================= PPT CONTENT GENERATOR ================= */
// Dedicated endpoint for generating slide content JSON
// Uses tighter prompts + aggressive JSON extraction + multi-provider fallback

function buildPPTPrompt(topic: string, classLevel: string, style: string): { system: string; user: string } {
  const levelMap: Record<string, string> = {
    "8":             "Class 8 (age 13-14, simple language, basic concepts)",
    "9":             "Class 9 (age 14-15, clear explanations, standard terms)",
    "10":            "Class 10 (CBSE/ICSE board level, exam-focused)",
    "11":            "Class 11 (advanced concepts, technical terms, board level)",
    "12":            "Class 12 (full board level, technical definitions, formulas)",
    "Undergraduate": "Undergraduate (university depth, academic language)",
    "Postgraduate":  "Postgraduate (advanced theories, research level)",
  };
  const level = levelMap[classLevel] || classLevel;

  const system = `You output ONLY valid JSON arrays. No explanation. No markdown. No text before or after. Start with [ and end with ].`;

  let slideList = "";
  let rules = "";
  let count = 6;

  if (style === "simple") {
    count = 6;
    slideList = `Slide 1: Title slide
Slide 2: Introduction
Slide 3: Key Concept 1
Slide 4: Key Concept 2
Slide 5: Key Takeaways
Slide 6: Conclusion`;
    rules = `Each slide: max 4 bullet points, max 12 words each. Simple language.`;
  } else if (style === "detailed") {
    count = 10;
    slideList = `Slide 1: Title
Slide 2: Overview & Background
Slide 3: Core Concept A
Slide 4: Core Concept B
Slide 5: Core Concept C
Slide 6: Key Definitions
Slide 7: Real-World Applications
Slide 8: Important Facts
Slide 9: Case Study / Example
Slide 10: Summary & Conclusion`;
    rules = `Each slide: 5-6 bullet points, 15-20 words each. Technical depth for ${level}.`;
  } else {
    count = 10;
    slideList = `Slide 1: Title (exciting hook)
Slide 2: Did You Know? (surprising facts)
Slide 3: The Big Picture
Slide 4: Deep Dive Part 1
Slide 5: Deep Dive Part 2
Slide 6: Deep Dive Part 3
Slide 7: Visual Concept
Slide 8: Real World Impact
Slide 9: Fun Facts & Myths vs Reality
Slide 10: Key Takeaways`;
    rules = `Start each bullet with a relevant emoji. Use vivid engaging language. 4-5 bullets per slide.`;
  }

  const user = `Create a ${count}-slide PowerPoint about "${topic}" for ${level}.

Slides:
${slideList}

Rules: ${rules}

Output this exact JSON structure (${count} objects):
[{"title":"...","content":"bullet1\nbullet2\nbullet3"}]`;

  return { system, user };
}

// Extract JSON array from any messy AI response
function extractJSONArray(text: string): any[] | null {
  if (!text) return null;

  // Strategy 1: clean and direct parse
  try {
    const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(clean);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}

  // Strategy 2: find first [ to last ]
  try {
    const start = text.indexOf("[");
    const end   = text.lastIndexOf("]");
    if (start !== -1 && end > start) {
      const parsed = JSON.parse(text.slice(start, end + 1));
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  // Strategy 3: fix common JSON issues and retry
  try {
    let fixed = text
      .replace(/```json/gi, "").replace(/```/g, "")
      .replace(/,\s*]/g, "]")           // trailing commas
      .replace(/,\s*}/g, "}")           // trailing commas in objects
      .replace(/[“”]/g, '"')  // smart quotes
      .replace(/[‘’]/g, "'")
      .trim();
    const start = fixed.indexOf("[");
    const end   = fixed.lastIndexOf("]");
    if (start !== -1 && end > start) {
      const parsed = JSON.parse(fixed.slice(start, end + 1));
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  // Strategy 4: extract individual slide objects with regex
  try {
    const objects: any[] = [];
    const objRegex = /\{[^{}]*"title"[^{}]*"content"[^{}]*\}/gs;
    const matches  = text.matchAll(objRegex);
    for (const m of matches) {
      try {
        const obj = JSON.parse(m[0]);
        if (obj.title && obj.content) objects.push(obj);
      } catch {}
    }
    if (objects.length >= 3) return objects;
  } catch {}

  return null;
}

async function callGroqForPPT(system: string, user: string): Promise<string> {
  // Use smaller, faster models for JSON tasks — they're more reliable for structured output
  const MODELS = ["llama-3.3-70b-versatile", "llama-3.1-70b-versatile", "gemma2-9b-it"];
  for (const model of MODELS) {
    try {
      console.log(`  [PPT Groq] ${model}`);
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user",   content: user   },
          ],
          temperature: 0.3,
          max_tokens:  3000,
        }),
      });
      if (!res.ok) { console.log(`  [PPT Groq] ${model} HTTP ${res.status}`); continue; }
      const data = await res.json();
      const ans  = data.choices?.[0]?.message?.content;
      if (ans && ans.length > 50) { console.log(`  [PPT Groq] ✅ ${model}`); return ans; }
    } catch(e: any) { console.log(`  [PPT Groq] ${model} err: ${e.message}`); }
  }
  throw new Error("Groq PPT: all models failed");
}

async function callOpenRouterForPPT(system: string, user: string): Promise<string> {
  if (!OPENROUTER_KEY) throw new Error("No OpenRouter key");
  const MODELS = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "deepseek/deepseek-r1-0528:free",
    "qwen/qwen3-235b-a22b:free",
    "google/gemma-3-27b-it:free",
  ];
  for (const model of MODELS) {
    try {
      console.log(`  [PPT OR] ${model}`);
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_KEY}`,
          "HTTP-Referer": "https://studyearn-ai.vercel.app",
          "X-Title": "StudyEarn AI",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user",   content: user   },
          ],
          temperature: 0.3,
          max_tokens:  3000,
        }),
      });
      if (!res.ok) { console.log(`  [PPT OR] ${model} HTTP ${res.status}`); continue; }
      const data = await res.json();
      const ans  = data.choices?.[0]?.message?.content;
      if (ans && ans.length > 50) { console.log(`  [PPT OR] ✅ ${model}`); return ans; }
    } catch(e: any) { console.log(`  [PPT OR] ${model} err: ${e.message}`); }
  }
  throw new Error("OpenRouter PPT: all models failed");
}

app.post("/api/ppt/content", async (req, res) => {
  try {
    const { topic, style = "simple", classLevel = "10" } = req.body;
    if (!topic?.trim()) return res.status(400).json({ success: false, message: "Topic required" });

    console.log(`\n📊 PPT content: "${topic}" | style=${style} | level=${classLevel}`);

    const { system, user } = buildPPTPrompt(topic.trim(), classLevel, style);
    let rawText = "";
    let slides: any[] | null = null;

    // Try Groq first, then OpenRouter
    const providers = [
      () => callGroqForPPT(system, user),
      () => callOpenRouterForPPT(system, user),
    ];

    for (const callFn of providers) {
      try {
        rawText = await callFn();
        slides  = extractJSONArray(rawText);
        if (slides && slides.length >= 3) break;
        console.log("  Parsed 0 valid slides, trying next provider...");
      } catch(e: any) {
        console.log(`  Provider failed: ${e.message}`);
      }
    }

    if (!slides || slides.length < 3) {
      console.error("PPT: all providers failed. Raw:", rawText?.substring(0, 300));
      return res.status(500).json({ success: false, message: "Could not generate slide content. Please try again." });
    }

    // Normalize slide objects
    const normalized = slides.map((sl: any, i: number) => ({
      title:   String(sl.title || sl.Title || `Slide ${i + 1}`).trim(),
      content: String(sl.content || sl.Content || sl.body || sl.Body || "").trim(),
      subtitle: sl.subtitle || sl.Subtitle || "",
    })).filter((sl: any) => sl.title.length > 0);

    console.log(`  ✅ Generated ${normalized.length} slides`);
    res.json({ success: true, slides: normalized });

  } catch(err: any) {
    console.error("PPT CONTENT ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to generate content. Please try again." });
  }
});

/* ================= PPT GENERATOR ================= */

// ─────────────────────────────────────────────────────────────────────────────
// THEME DEFINITIONS
// Each theme has a full design system: colors, fonts, layouts
// ─────────────────────────────────────────────────────────────────────────────

const THEMES = {

  // ── SIMPLE: Midnight Executive — clean, minimal, white on deep navy ────────
  simple: {
    bg:          "0F1B35",   // deep navy
    bgLight:     "162040",   // slightly lighter navy for alt slides
    accent:      "4A90E2",   // clean blue accent
    accentLight: "7BB3F0",   // lighter blue
    textPrimary: "FFFFFF",
    textSecondary: "B8C8E0",
    textMuted:   "6B8AB0",
    cardBg:      "1C2A48",
    cardBorder:  "2D3F60",
    titleFont:   "Calibri",
    bodyFont:    "Calibri",
  },

  // ── DETAILED: Charcoal Professional — dark with purple-blue gradient feel ──
  detailed: {
    bg:          "1A1A2E",   // dark navy-purple
    bgLight:     "16213E",
    accent:      "7C3AED",   // vivid purple
    accentLight: "A78BFA",   // lavender
    accentAlt:   "3B82F6",   // blue
    textPrimary: "FFFFFF",
    textSecondary: "C4B5FD",
    textMuted:   "7B7FA8",
    cardBg:      "252545",
    cardBorder:  "3D3D6B",
    titleFont:   "Cambria",
    bodyFont:    "Calibri",
  },

  // ── CREATIVE: Coral Energy — vibrant, engaging, orange-coral with dark bg ──
  creative: {
    bg:          "1C1C2E",   // very dark navy
    bgLight:     "252538",
    accent:      "F97316",   // vibrant orange
    accentLight: "FB923C",
    accentAlt:   "8B5CF6",   // purple complement
    accentAlt2:  "06B6D4",   // cyan complement
    textPrimary: "FFFFFF",
    textSecondary: "FED7AA",  // warm cream
    textMuted:   "94A3B8",
    cardBg:      "2D2B42",
    cardBorder:  "4C4870",
    titleFont:   "Trebuchet MS",
    bodyFont:    "Calibri",
  },
};

type ThemeKey = keyof typeof THEMES;

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function makeShadow() {
  return { type: "outer" as const, blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.25 };
}

function parseLines(content: string): string[] {
  return content.split("\n")
    .map((l: string) => l.replace(/^[-•*▸→]\s*/, "").trim())
    .filter((l: string) => l.length > 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

// TITLE SLIDE — full-screen dramatic hero
function addTitleSlide(pptx: any, slide: any, theme: any, topic: string, classLevel: string, themeKey: ThemeKey) {
  const s = pptx.addSlide();
  s.background = { color: theme.bg };

  // Large decorative shape — top-left corner block
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 4.5, h: 5.625,
    fill: { color: theme.accent, transparency: 85 },
    line: { color: theme.accent, transparency: 85 },
  });

  // Bottom accent bar
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 5.1, w: 10, h: 0.525,
    fill: { color: theme.accent, transparency: 60 },
    line: { color: theme.accent, transparency: 60 },
  });

  // Accent left bar
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: 1.4, w: 0.12, h: 2.8,
    fill: { color: theme.accent },
    line: { color: theme.accent },
  });

  // Topic / Main Title
  s.addText(slide.title || topic, {
    x: 0.9, y: 1.5, w: 8.3, h: 1.8,
    fontSize: 44, bold: true, color: theme.textPrimary,
    fontFace: theme.titleFont, align: "left", valign: "middle",
    margin: 0,
  });

  // Subtitle
  const subtitle = slide.subtitle || `A Comprehensive ${themeKey === "simple" ? "Overview" : "Presentation"}`;
  s.addText(subtitle, {
    x: 0.9, y: 3.35, w: 8.0, h: 0.6,
    fontSize: 18, color: theme.accentLight || theme.accent,
    fontFace: theme.bodyFont, align: "left", margin: 0,
  });

  // Class level badge
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.9, y: 4.2, w: 2.2, h: 0.45,
    fill: { color: theme.cardBg },
    line: { color: theme.cardBorder },
    shadow: makeShadow(),
  });
  s.addText(classLevel, {
    x: 0.9, y: 4.2, w: 2.2, h: 0.45,
    fontSize: 13, color: theme.textSecondary,
    fontFace: theme.bodyFont, align: "center", valign: "middle", margin: 0,
  });
}

// CONTENT SLIDE — standard layout with left accent bar
function addContentSlide(pptx: any, slideData: any, theme: any, slideNum: number) {
  const s = pptx.addSlide();
  s.background = { color: slideNum % 2 === 0 ? theme.bg : theme.bgLight };

  // Top header bar
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.0,
    fill: { color: theme.accent, transparency: 88 },
    line: { color: theme.accent, transparency: 88 },
  });

  // Slide number dot
  s.addShape(pptx.shapes.OVAL, {
    x: 9.1, y: 0.2, w: 0.6, h: 0.6,
    fill: { color: theme.accent },
    line: { color: theme.accent },
  });
  s.addText(String(slideNum), {
    x: 9.1, y: 0.2, w: 0.6, h: 0.6,
    fontSize: 11, bold: true, color: "FFFFFF",
    fontFace: theme.bodyFont, align: "center", valign: "middle", margin: 0,
  });

  // Title
  s.addText(slideData.title, {
    x: 0.5, y: 0.1, w: 8.4, h: 0.8,
    fontSize: 26, bold: true, color: theme.textPrimary,
    fontFace: theme.titleFont, align: "left", valign: "middle", margin: 0,
  });

  // Left accent bar
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.4, y: 1.2, w: 0.08, h: 4.1,
    fill: { color: theme.accent },
    line: { color: theme.accent },
  });

  // Content area
  const lines = parseLines(slideData.content || "");
  const bullets = lines.map((text: string, i: number) => ({
    text,
    options: {
      bullet: true,
      breakLine: i < lines.length - 1,
      fontSize: 15,
      color: i === 0 ? theme.textPrimary : theme.textSecondary,
      bold: i === 0,
      paraSpaceAfter: 8,
    },
  }));

  s.addText(bullets.length > 0 ? bullets : [{ text: slideData.content || "", options: { fontSize: 15, color: theme.textSecondary } }], {
    x: 0.65, y: 1.2, w: 8.9, h: 4.1, valign: "top",
  });
}

// TWO-COLUMN SLIDE — for detailed style variety
function addTwoColumnSlide(pptx: any, slideData: any, theme: any, slideNum: number) {
  const s = pptx.addSlide();
  s.background = { color: slideNum % 2 === 0 ? theme.bg : theme.bgLight };

  // Header
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.0,
    fill: { color: theme.accent, transparency: 88 },
    line: { color: theme.accent, transparency: 88 },
  });
  s.addText(slideData.title, {
    x: 0.5, y: 0.1, w: 9.0, h: 0.8,
    fontSize: 26, bold: true, color: theme.textPrimary,
    fontFace: theme.titleFont, align: "left", valign: "middle", margin: 0,
  });

  const lines = parseLines(slideData.content || "");
  const mid = Math.ceil(lines.length / 2);
  const leftLines = lines.slice(0, mid);
  const rightLines = lines.slice(mid);

  // Left column card
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.4, y: 1.15, w: 4.3, h: 4.1,
    fill: { color: theme.cardBg },
    line: { color: theme.cardBorder },
    shadow: makeShadow(),
  });
  // Left accent top
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.4, y: 1.15, w: 4.3, h: 0.08,
    fill: { color: theme.accent },
    line: { color: theme.accent },
  });

  const leftBullets = leftLines.map((text: string, i: number) => ({
    text, options: { bullet: true, breakLine: i < leftLines.length - 1, fontSize: 13, color: theme.textSecondary, paraSpaceAfter: 6 },
  }));
  s.addText(leftBullets.length > 0 ? leftBullets : [{ text: "", options: { fontSize: 13 } }], {
    x: 0.6, y: 1.35, w: 3.9, h: 3.75, valign: "top",
  });

  // Right column card
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.3, y: 1.15, w: 4.3, h: 4.1,
    fill: { color: theme.cardBg },
    line: { color: theme.cardBorder },
    shadow: makeShadow(),
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.3, y: 1.15, w: 4.3, h: 0.08,
    fill: { color: (theme as any).accentAlt || theme.accent },
    line: { color: (theme as any).accentAlt || theme.accent },
  });

  const rightBullets = rightLines.map((text: string, i: number) => ({
    text, options: { bullet: true, breakLine: i < rightLines.length - 1, fontSize: 13, color: theme.textSecondary, paraSpaceAfter: 6 },
  }));
  s.addText(rightBullets.length > 0 ? rightBullets : [{ text: "", options: { fontSize: 13 } }], {
    x: 5.5, y: 1.35, w: 3.9, h: 3.75, valign: "top",
  });
}

// STAT / HIGHLIGHT SLIDE — big callout numbers, for creative/detailed
function addHighlightSlide(pptx: any, slideData: any, theme: any) {
  const s = pptx.addSlide();
  s.background = { color: theme.bg };

  // Bold full-width accent strip at top
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.3,
    fill: { color: theme.accent },
    line: { color: theme.accent },
  });
  s.addText(slideData.title, {
    x: 0.5, y: 0.05, w: 9.0, h: 1.2,
    fontSize: 30, bold: true, color: "FFFFFF",
    fontFace: theme.titleFont, align: "left", valign: "middle", margin: 0,
  });

  // 3-card grid for key points
  const lines = parseLines(slideData.content || "");
  const cards = lines.slice(0, 6);
  const cols = Math.min(3, cards.length);
  const cardW = cols === 3 ? 2.9 : cols === 2 ? 4.0 : 8.0;
  const startX = cols === 3 ? 0.4 : cols === 2 ? 1.0 : 1.0;
  const gapX = cols === 3 ? 0.45 : 1.0;

  cards.forEach((text: string, i: number) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = startX + col * (cardW + gapX);
    const y = 1.6 + row * 1.9;

    s.addShape(pptx.shapes.RECTANGLE, {
      x, y, w: cardW, h: 1.65,
      fill: { color: theme.cardBg },
      line: { color: theme.cardBorder },
      shadow: makeShadow(),
    });
    // Left accent
    const accentColors = [theme.accent, (theme as any).accentAlt || theme.accent, (theme as any).accentAlt2 || theme.accent];
    s.addShape(pptx.shapes.RECTANGLE, {
      x, y, w: 0.1, h: 1.65,
      fill: { color: accentColors[i % 3] },
      line: { color: accentColors[i % 3] },
    });
    s.addText(text, {
      x: x + 0.2, y, w: cardW - 0.2, h: 1.65,
      fontSize: 12, color: theme.textSecondary, fontFace: theme.bodyFont,
      align: "left", valign: "middle", wrap: true, margin: 8,
    });
  });
}

// CONCLUSION SLIDE — strong closing with summary
function addConclusionSlide(pptx: any, slideData: any, theme: any, topic: string) {
  const s = pptx.addSlide();
  s.background = { color: theme.bg };

  // Full decorative right-side panel
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 6.5, y: 0, w: 3.5, h: 5.625,
    fill: { color: theme.accent, transparency: 80 },
    line: { color: theme.accent, transparency: 80 },
  });

  // Top label
  s.addText("SUMMARY", {
    x: 0.5, y: 0.4, w: 5.5, h: 0.4,
    fontSize: 11, bold: true, color: theme.accentLight || theme.accent,
    fontFace: theme.bodyFont, charSpacing: 6, margin: 0,
  });

  // Topic name as heading
  s.addText(topic, {
    x: 0.5, y: 0.85, w: 5.5, h: 0.9,
    fontSize: 32, bold: true, color: theme.textPrimary,
    fontFace: theme.titleFont, align: "left", margin: 0,
  });

  // Divider
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 1.8, w: 3.5, h: 0.05,
    fill: { color: theme.accent },
    line: { color: theme.accent },
  });

  // Summary bullets
  const lines = parseLines(slideData.content || "");
  const bullets = lines.map((text: string, i: number) => ({
    text,
    options: { bullet: true, breakLine: i < lines.length - 1, fontSize: 14, color: theme.textSecondary, paraSpaceAfter: 8 },
  }));
  s.addText(bullets.length > 0 ? bullets : [{ text: slideData.content || "", options: { fontSize: 14, color: theme.textSecondary } }], {
    x: 0.5, y: 2.0, w: 5.7, h: 3.3, valign: "top",
  });

  // Right panel: "Thank You" text
  s.addText("Thank\nYou", {
    x: 6.6, y: 1.8, w: 3.0, h: 2.5,
    fontSize: 42, bold: true, color: "FFFFFF",
    fontFace: theme.titleFont, align: "center", valign: "middle",
    margin: 0,
  });
  s.addText("Keep Learning! 🚀", {
    x: 6.6, y: 4.3, w: 3.0, h: 0.6,
    fontSize: 13, color: theme.textSecondary,
    fontFace: theme.bodyFont, align: "center", margin: 0,
  });
}

// TABLE OF CONTENTS slide (for detailed style)
function addTOCSlide(pptx: any, slides: any[], theme: any) {
  const s = pptx.addSlide();
  s.background = { color: theme.bgLight };

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.1,
    fill: { color: theme.accent },
    line: { color: theme.accent },
  });
  s.addText("Table of Contents", {
    x: 0.5, y: 0.05, w: 9, h: 1.0,
    fontSize: 30, bold: true, color: "FFFFFF",
    fontFace: theme.titleFont, align: "left", valign: "middle", margin: 0,
  });

  // List slides as TOC entries (skip title and toc itself)
  const entries = slides.slice(2, slides.length - 1); // skip title, toc, conclusion
  const cols = 2;
  entries.forEach((sl: any, i: number) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = 0.5 + col * 4.75;
    const y = 1.35 + row * 0.75;

    s.addShape(pptx.shapes.RECTANGLE, {
      x, y, w: 4.5, h: 0.62,
      fill: { color: theme.cardBg },
      line: { color: theme.cardBorder },
      shadow: { type: "outer" as const, blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.2 },
    });
    s.addShape(pptx.shapes.RECTANGLE, {
      x, y, w: 0.45, h: 0.62,
      fill: { color: theme.accent },
      line: { color: theme.accent },
    });
    s.addText(String(i + 1), {
      x, y, w: 0.45, h: 0.62,
      fontSize: 14, bold: true, color: "FFFFFF",
      fontFace: theme.bodyFont, align: "center", valign: "middle", margin: 0,
    });
    s.addText(sl.title || `Section ${i + 1}`, {
      x: x + 0.55, y, w: 3.85, h: 0.62,
      fontSize: 13, color: theme.textSecondary, fontFace: theme.bodyFont,
      align: "left", valign: "middle", margin: 0,
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PPT BUILDER
// ─────────────────────────────────────────────────────────────────────────────
function buildPPTX(pptx: any, slides: any[], style: ThemeKey, topic: string, classLevel: string) {
  const theme = THEMES[style] || THEMES.simple;
  const T = theme as any;

  if (style === "simple") {
    // SIMPLE: clean 6-slide deck — title, 4 content, conclusion
    addTitleSlide(pptx, slides[0], T, topic, classLevel, "simple");
    slides.slice(1, slides.length - 1).forEach((sl, i) => {
      addContentSlide(pptx, sl, T, i + 2);
    });
    addConclusionSlide(pptx, slides[slides.length - 1], T, topic);

  } else if (style === "detailed") {
    // DETAILED: 10-slide — title, toc, content mix (two-col + regular), conclusion
    addTitleSlide(pptx, slides[0], T, topic, classLevel, "detailed");
    addTOCSlide(pptx, slides, T);
    slides.slice(2, slides.length - 1).forEach((sl, i) => {
      // Alternate layouts for variety
      if (i % 3 === 1 && parseLines(sl.content || "").length >= 6) {
        addTwoColumnSlide(pptx, sl, T, i + 3);
      } else if (i % 3 === 2) {
        addHighlightSlide(pptx, sl, T);
      } else {
        addContentSlide(pptx, sl, T, i + 3);
      }
    });
    addConclusionSlide(pptx, slides[slides.length - 1], T, topic);

  } else {
    // CREATIVE: 10-slide — title, highlight cards, mixed layouts, conclusion
    addTitleSlide(pptx, slides[0], T, topic, classLevel, "creative");
    slides.slice(1, slides.length - 1).forEach((sl, i) => {
      if (i % 3 === 0) {
        addHighlightSlide(pptx, sl, T);
      } else if (i % 3 === 1) {
        addTwoColumnSlide(pptx, sl, T, i + 2);
      } else {
        addContentSlide(pptx, sl, T, i + 2);
      }
    });
    addConclusionSlide(pptx, slides[slides.length - 1], T, topic);
  }
}

app.post("/api/ppt/generate", async (req, res) => {
  try {
    const { topic, slides, style = "simple", classLevel = "Student" } = req.body;

    if (!slides || slides.length === 0) {
      return res.status(400).json({ success: false, message: "No slides provided" });
    }

    const pptx = new (PptxGenJS as any)();
    pptx.layout  = "LAYOUT_16x9";
    pptx.author  = "StudyEarn AI";
    pptx.title   = topic || "Presentation";
    pptx.subject = `${style} presentation for ${classLevel}`;

    buildPPTX(pptx, slides, style as ThemeKey, topic || "Topic", classLevel);

    const buffer = await pptx.write("nodebuffer");

    const safeFilename = (topic || "presentation").replace(/[^a-zA-Z0-9\s-]/g, "").trim().replace(/\s+/g, "_");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}_${style}.pptx"`);
    res.send(buffer);

  } catch (error: any) {
    console.error("PPT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


/* ================= IMAGE → PDF ================= */

app.post(
  "/api/img-to-pdf",
  upload.array("files"),
  async (req: any, res) => {
    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of req.files) {
        const img = await sharp(file.buffer).png().toBuffer();
        const image = await pdfDoc.embedPng(img);

        const page = pdfDoc.addPage([
          image.width,
          image.height,
        ]);

        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();

      res.setHeader("Content-Type", "application/pdf");
      res.send(Buffer.from(pdfBytes));

    } catch (error) {
      console.error("IMG→PDF ERROR:", error);
      res.status(500).json({ success: false });
    }
  }
);

/* ================= MERGE PDF ================= */

app.post(
  "/api/merge-pdf",
  upload.array("files"),
  async (req: any, res) => {
    try {
      const merged = await PDFDocument.create();

      for (const file of req.files) {
        const pdf = await PDFDocument.load(file.buffer);
        const pages = await merged.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        pages.forEach((p) => merged.addPage(p));
      }

      const pdfBytes = await merged.save();

      res.setHeader("Content-Type", "application/pdf");
      res.send(Buffer.from(pdfBytes));

    } catch (error) {
      console.error("MERGE PDF ERROR:", error);
      res.status(500).json({ success: false });
    }
  }
);

/* ================= START SERVER ================= */

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
    console.log("✅ AI Ready");
    console.log("✅ PPT Ready");
    console.log("✅ PDF Tools Ready");
  });
});