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


/* ================= PPT GENERATOR ================= */

app.post("/api/ppt/generate", async (req, res) => {
  try {
    const { topic, slides } = req.body;

    const pptx = new (PptxGenJS as any)();
    pptx.layout = "LAYOUT_16x9";

    slides.forEach((slide: any) => {
      const s = pptx.addSlide();

      s.addText(slide.title || "Slide", {
        x: 0.5,
        y: 0.5,
        fontSize: 28,
        bold: true,
      });

      const bullets = (slide.content || "")
        .split("\n")
        .filter((l: string) => l.trim())
        .map((l: string) => ({
          text: l,
          options: { bullet: true },
        }));

      s.addText(bullets, {
        x: 0.5,
        y: 1.5,
        fontSize: 18,
      });
    });

    const buffer = await pptx.write("nodebuffer");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${topic}.pptx`
    );

    res.send(buffer);

  } catch (error) {
    console.error("PPT ERROR:", error);
    res.status(500).json({ success: false });
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