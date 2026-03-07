import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import os from "os";
import authRoutes from "./auth.js";
import userRoutes from "./user-routes.js";
import leaderboardRoutes from "./leaderboard-routes.js";
import Groq from "groq-sdk";
import multer from "multer";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import PptxGenJS from "pptxgenjs";
import { connectDB } from "./db.js";
import { User } from "./models/User.model.js";
import { Activity } from "./models/Activity.model.js";
import { Redemption } from "./models/Redemption.model.js";
import {
  globalLimiter,
  aiAskLimiter,
  pdfSolveLimiter,
  pptLimiter,
  fileToolsLimiter,
} from "./middleware/rateLimiter.js";
import {
  validateAskAI,
  validatePPTContent,
  validatePPTGenerate,
} from "./middleware/validate.js";

dotenv.config();

/* ================= STARTUP ENV CHECK ================= */
const REQUIRED_ENV = ["MONGODB_URI", "JWT_SECRET", "GROQ_API_KEY"];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
  console.error("   Please copy server/.env.example to server/.env and fill in all values.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= GLOBAL ERROR HANDLERS ================= */

// Catch unhandled promise rejections (prevents server crash)
process.on("unhandledRejection", (reason: any) => {
  console.error("❌ Unhandled Promise Rejection:", reason?.message || reason);
  // Don't exit — just log it
});

// Catch uncaught exceptions (prevents server crash)
process.on("uncaughtException", (err: Error) => {
  console.error("❌ Uncaught Exception:", err.message);
  console.error(err.stack);
  // Give time to finish pending requests before exit
  setTimeout(() => process.exit(1), 1000);
});

/* ================= CORS ================= */

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://studyearn-ai.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// Apply global rate limiter to ALL routes (safety net)
app.use(globalLimiter);

// Reduce JSON body limit from 50mb → 10mb (50mb was dangerously large)
app.use(express.json({ limit: "10mb" }));

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

// Auth routes get brute-force protection (applied inside auth.ts per route)
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

/* ================= SERVER-SIDE USER ACTIONS ================= */
// Points & question tracking are awarded/deducted by SERVER ONLY — no client trust needed.

const JWT_SECRET = process.env.JWT_SECRET!;

/** Extract userId from Bearer token. Returns null if missing/invalid. */
function getUserIdFromToken(req: any): string | null {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return null;
    const decoded = (jwt as any).verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

/**
 * Deduct 1 question from daily quota + award points.
 * Called after every successful AI response.
 */
async function handleQuestionUsed(req: any, pointsToAward = 15): Promise<{ questionsLeft: number; pointsAwarded: number } | null> {
  const userId = getUserIdFromToken(req);
  if (!userId) return null;
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const today = new Date().toISOString().split("T")[0];

    // ── Auto-expire premium if past expiry ──
    if ((user as any).isPremium && (user as any).premiumExpiresAt) {
      if (new Date((user as any).premiumExpiresAt) < new Date()) {
        (user as any).isPremium        = false;
        (user as any).premiumExpiresAt = null;
        console.log(`⏰ Premium auto-expired for ${user.email}`);
      }
    }
    const isPremiumActive = (user as any).isPremium === true;

    // Premium = 15 questions/day, Free = 5 questions/day
    const dailyLimit = isPremiumActive ? 15 : 5;
    if (user.questionsDate !== today) {
      user.questionsLeft = dailyLimit;
      user.questionsDate = today;
    }
    if (user.questionsLeft > 0) user.questionsLeft -= 1;

    // Premium users earn 2× points (XP also doubles — earned legitimately)
    if (isPremiumActive) pointsToAward = pointsToAward * 2;

    user.points += pointsToAward;
    (user as any).totalXP = ((user as any).totalXP || 0) + pointsToAward; // XP only increases
    (user as any).totalQuestionsAsked = ((user as any).totalQuestionsAsked || 0) + 1;
    await user.save();

    await Activity.create({ userId, action: "ask_question", details: "Asked AI a question", pointsEarned: pointsToAward });
    console.log(`✅ Question used: ${user.email} | left=${user.questionsLeft} | +${pointsToAward}pts`);
    return { questionsLeft: user.questionsLeft, pointsAwarded: pointsToAward };
  } catch (err: any) {
    console.error("handleQuestionUsed error:", err.message);
    return null;
  }
}

/** Award points for generating a PPT. Called after successful PPTX creation. */
async function handlePPTGenerated(req: any): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) return;
  try {
    const user = await User.findById(userId);
    if (!user) return;
    const pts = 20;
    user.points += pts;
    (user as any).totalXP = ((user as any).totalXP || 0) + pts; // XP only increases
    (user as any).totalPPTsGenerated = ((user as any).totalPPTsGenerated || 0) + 1;
    await user.save();
    await Activity.create({ userId, action: "generate_ppt", details: "Generated a PPT presentation", pointsEarned: pts });
    console.log(`✅ PPT generated: ${user.email} | +${pts}pts`);
  } catch (err: any) {
    console.error("handlePPTGenerated error:", err.message);
  }
}

/** Award points for PDF tools. Called after successful PDF action. */
async function handlePDFAction(req: any, action: "img-to-pdf" | "merge-pdf"): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) return;
  try {
    const user = await User.findById(userId);
    if (!user) return;
    const pts = 10;
    user.points += pts;
    (user as any).totalXP = ((user as any).totalXP || 0) + pts; // XP only increases
    (user as any).totalPDFsConverted = ((user as any).totalPDFsConverted || 0) + 1;
    await user.save();
    await Activity.create({ userId, action: "convert_pdf", details: action === "img-to-pdf" ? "Converted images to PDF" : "Merged PDF files", pointsEarned: pts });
    console.log(`✅ PDF action (${action}): ${user.email} | +${pts}pts`);
  } catch (err: any) {
    console.error("handlePDFAction error:", err.message);
  }
}

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
// GROQ — Vision (image support, free tier)
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// VISION MODELS — Bulletproof image solving
// Strategy: Try best models first, skip broken ones, always get an answer
// ─────────────────────────────────────────────────────────────────────────────

// These are confirmed working free vision models (tested March 2025)
// Ordered by reliability for academic/math image questions
const VISION_MODELS = [
  "qwen/qwen2.5-vl-72b-instruct:free",          // Best: handles math, diagrams, text
  "meta-llama/llama-3.2-11b-vision-instruct:free", // Good fallback
  "google/gemma-3-27b-it:free",                  // Google vision model
  "mistralai/mistral-small-3.1-24b-instruct:free",// Mistral vision
  "microsoft/phi-4-multimodal-instruct:free",    // Microsoft multimodal
];

// Signs that the model did NOT actually see the image
const BAD_VISION_PHRASES = [
  "i don't see any image",
  "no image was provided",
  "i cannot see the image",
  "no image has been",
  "image doesn't appear",
  "haven't received an image",
  "i don't have access to",
  "no picture",
  "can't view",
  "unable to view",
  "please share the question",
  "please provide the image",
  "please share the image",
  "i'll be happy to assist once",
];

function isBadVisionResponse(text: string): boolean {
  const lower = text.toLowerCase();
  return BAD_VISION_PHRASES.some(phrase => lower.includes(phrase));
}

// Build the vision prompt — forces the model to read and solve
function buildVisionPrompt(userPrompt: string): string {
  const base = "You are an expert tutor. The image attached contains a question or problem from a student's exam or homework.";
  const instruction = "Read the image very carefully. Identify ALL questions, equations, diagrams, or problems in it. Then solve each one completely with step-by-step working. Show every calculation. Give the final answer clearly.";
  
  if (userPrompt?.trim()) {
    return `${base}

Student says: "${userPrompt}"

${instruction}`;
  }
  return `${base}

${instruction}`;
}

// Call OpenRouter vision with a specific model
async function callOpenRouterVisionModel(model: string, imageUrl: string, prompt: string): Promise<string> {
  if (!OPENROUTER_KEY) throw new Error("OPENROUTER_API_KEY not configured");

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
          { type: "text",      text: prompt },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      }],
      temperature: 0.2,
      max_tokens:  4096,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "unknown error");
    throw new Error(`HTTP ${res.status}: ${errText.substring(0, 120)}`);
  }

  const data = await res.json();
  const answer = data.choices?.[0]?.message?.content?.trim();

  if (!answer || answer.length < 20) {
    throw new Error("Empty or too-short response");
  }
  if (isBadVisionResponse(answer)) {
    throw new Error(`Model couldn't see image: "${answer.substring(0, 80)}"`);
  }

  return answer;
}

// Call Groq vision — kept as first try but don't rely on it
async function callGroqVisionModel(imageUrl: string, prompt: string): Promise<string> {
  if (!GROQ_KEY) throw new Error("No Groq key");

  // Only llama-3.2-11b-vision-preview still somewhat works; 90b is deprecated
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.2-11b-vision-preview",
      messages: [{
        role: "user",
        content: [
          { type: "text",      text: prompt },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      }],
      temperature: 0.2,
      max_tokens:  4096,
    }),
  });

  if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
  const data = await res.json();
  const answer = data.choices?.[0]?.message?.content?.trim();
  if (!answer || answer.length < 20 || isBadVisionResponse(answer)) {
    throw new Error("Groq vision gave bad/empty response");
  }
  return answer;
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER VISION SOLVER
// Tries: Groq → 5 OpenRouter models → Smart text fallback
// GUARANTEED to return SOMETHING useful — never fails silently
// ─────────────────────────────────────────────────────────────────────────────
async function solveWithVision(imageUrl: string, userPrompt: string): Promise<string> {
  const visionPrompt = buildVisionPrompt(userPrompt);
  const attempts: string[] = [];

  // 1️⃣ Try Groq first (fast when it works)
  try {
    console.log("  [Vision] Trying Groq...");
    const ans = await callGroqVisionModel(imageUrl, visionPrompt);
    console.log("  [Vision] ✅ Groq succeeded");
    return ans;
  } catch (e: any) {
    attempts.push(`Groq: ${e.message}`);
    console.log(`  [Vision] Groq failed: ${e.message}`);
  }

  // 2️⃣ Try all OpenRouter vision models
  for (const model of VISION_MODELS) {
    try {
      console.log(`  [Vision] Trying OpenRouter ${model}...`);
      const ans = await callOpenRouterVisionModel(model, imageUrl, visionPrompt);
      console.log(`  [Vision] ✅ OpenRouter ${model} succeeded`);
      return ans;
    } catch (e: any) {
      attempts.push(`${model}: ${e.message}`);
      console.log(`  [Vision] ${model} failed: ${e.message}`);
    }
  }

  // 3️⃣ Smart text fallback — extract what we can and solve analytically
  console.log("  [Vision] All vision models failed — using smart text fallback");
  console.log("  [Vision] Failed attempts:", attempts.join(" | "));

  const fallback = userPrompt?.trim()
    ? `A student has an image with this question/request: "${userPrompt}"

Please provide a complete, detailed answer to this question. If it's a math or science problem, solve it step-by-step showing all working. If it seems like an MCQ, explain the concept and give the answer with full explanation.`
    : `A student uploaded an image of an exam/homework question but I cannot read the image directly.

Please provide a comprehensive study guide covering the most common types of questions in Indian school/college exams. Cover: Mathematics (algebra, calculus, geometry), Physics, Chemistry, and Biology. Show example problems with step-by-step solutions.`;

  try {
    if (GROQ_KEY) {
      const ans = await groqText(fallback);
      return `Note: I could not read your image directly, but here is help based on your question:\n\n${ans}`;
    }
  } catch {}

  try {
    if (OPENROUTER_KEY) {
      const ans = await openRouterText(fallback);
      return `Note: I could not read your image directly, but here is help based on your question:\n\n${ans}`;
    }
  } catch {}

  return "I was unable to process this image. Please try: (1) Re-uploading with better lighting, (2) Typing out the question manually, or (3) Taking a clearer screenshot.";
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

app.post("/api/ai/ask", aiAskLimiter, validateAskAI, async (req, res) => {
  try {
    const { prompt, image } = req.body;
    if (!prompt && !image) {
      return res.status(400).json({ success: false, answer: "Please enter a question or upload an image." });
    }

    const imgSizeKB = image ? Math.round(image.length * 0.75 / 1024) : 0;
    console.log(`\n📥 /api/ai/ask  image=${!!image}(${imgSizeKB}KB)  prompt="${(prompt||"").substring(0,60)}"`);

    let answer: string;

    if (image) {
      // Normalize image to proper data URL format
      let imageUrl: string;
      if (image.startsWith("data:")) {
        imageUrl = image;
      } else if (image.startsWith("/9j/") || image.startsWith("iVBOR")) {
        // Raw base64 — detect format
        const isJpeg = image.startsWith("/9j/");
        imageUrl = `data:image/${isJpeg ? "jpeg" : "png"};base64,${image}`;
      } else {
        imageUrl = `data:image/jpeg;base64,${image}`;
      }

      // Warn if image is very large (>4MB after decode) — may cause issues
      if (imgSizeKB > 4000) {
        console.log(`  ⚠️ Large image: ${imgSizeKB}KB — may be slow`);
      }

      answer = await solveWithVision(imageUrl, prompt || "");
    } else {
      answer = await solveText(prompt);
    }

    // ── Server-side: deduct question + award points (fire-and-forget) ──
    const userAction = await handleQuestionUsed(req, 15);

    res.json({
      success: true,
      answer,
      // Return updated values so frontend stays in sync without extra API call
      ...(userAction ? { questionsLeft: userAction.questionsLeft, pointsAwarded: userAction.pointsAwarded } : {}),
    });
  } catch (error: any) {
    console.error("❌ /api/ai/ask error:", error.message);
    res.status(500).json({ success: false, answer: "AI is temporarily unavailable. Please try again in a moment." });
  }
});

/* ================= PDF QUESTION SOLVER ================= */

app.post("/api/ai/solve-pdf", pdfSolveLimiter, upload.single("file"), async (req, res) => {
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

    // ── Server-side: deduct question + award points ──────────
    const userAction = await handleQuestionUsed(req, 15);

    res.json({
      success: true,
      answer,
      ...(userAction ? { questionsLeft: userAction.questionsLeft, pointsAwarded: userAction.pointsAwarded } : {}),
    });

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

app.post("/api/ppt/content", pptLimiter, validatePPTContent, async (req, res) => {
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

app.post("/api/ppt/generate", pptLimiter, validatePPTGenerate, async (req, res) => {
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

    // ── Server-side: award PPT points (after response sent) ──
    handlePPTGenerated(req).catch(console.error);

  } catch (error: any) {
    console.error("PPT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


/* ================= IMAGE → PDF ================= */

// A4 dimensions in points (72pt = 1 inch)
const A4_W = 595, A4_H = 842;

function fitToA4(w: number, h: number) {
  const r = Math.min(A4_W / w, A4_H / h);
  return { w: w * r, h: h * r };
}

app.post(
  "/api/img-to-pdf",
  fileToolsLimiter,
  upload.array("files", 20),
  async (req: any, res) => {
    const startTime = Date.now();
    try {
      const files: Express.Multer.File[] = req.files || [];
      if (!files.length) return res.status(400).json({ success: false, message: "No files uploaded" });

      // ✅ SPEED FIX 1: Process ALL images in parallel simultaneously
      const processedImages = await Promise.all(
        files.map(async (file) => {
          // ✅ SPEED FIX 2: JPEG is 3-5x faster than PNG for photos
          const jpegBuf = await sharp(file.buffer)
            .rotate()                          // auto-orient from EXIF
            .jpeg({ quality: 92, mozjpeg: true })
            .toBuffer();

          const meta = await sharp(jpegBuf).metadata();
          return { buffer: jpegBuf, width: meta.width!, height: meta.height! };
        })
      );

      const pdfDoc = await PDFDocument.create();

      for (const { buffer, width, height } of processedImages) {
        const image   = await pdfDoc.embedJpg(buffer);
        const fitted  = fitToA4(width, height);
        const page    = pdfDoc.addPage([A4_W, A4_H]);
        const x       = (A4_W - fitted.w) / 2;
        const y       = (A4_H - fitted.h) / 2;
        page.drawImage(image, { x, y, width: fitted.w, height: fitted.h });
      }

      // ✅ SPEED FIX 3: objectsPerTick=50 makes save() much faster for large PDFs
      const pdfBytes = await pdfDoc.save({ objectsPerTick: 50 });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=converted.pdf");
      res.send(Buffer.from(pdfBytes));

      console.log(`✅ IMG→PDF: ${files.length} files in ${Date.now() - startTime}ms`);
      handlePDFAction(req, "img-to-pdf").catch(console.error);

    } catch (error: any) {
      console.error("IMG→PDF ERROR:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

/* ================= MERGE PDF ================= */

app.post(
  "/api/merge-pdf",
  fileToolsLimiter,
  upload.array("files", 20),
  async (req: any, res) => {
    const startTime = Date.now();
    try {
      const files: Express.Multer.File[] = req.files || [];
      if (!files || files.length < 2)
        return res.status(400).json({ success: false, message: "Upload at least 2 PDF files" });

      const merged = await PDFDocument.create();

      // ✅ SPEED FIX: Load all PDFs in parallel, then merge in order
      const loadedPDFs = await Promise.all(
        files.map(f => PDFDocument.load(f.buffer, { ignoreEncryption: true }))
      );

      for (const pdf of loadedPDFs) {
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }

      const pdfBytes = await merged.save({ objectsPerTick: 50 });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=merged.pdf");
      res.send(Buffer.from(pdfBytes));

      console.log(`✅ MERGE-PDF: ${files.length} files in ${Date.now() - startTime}ms`);
      handlePDFAction(req, "merge-pdf").catch(console.error);

    } catch (error: any) {
      console.error("MERGE PDF ERROR:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

/* ================= SPLIT PDF ================= */
app.post("/api/split-pdf", fileToolsLimiter, upload.single("file"), async (req: any, res) => {
  const startTime = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const { pages } = req.body; // e.g. "1,3,5-7" or "all"
    const srcDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const total  = srcDoc.getPageCount();

    // Parse page selection
    let pageIndices: number[] = [];
    if (!pages || pages === "all") {
      pageIndices = Array.from({ length: total }, (_, i) => i);
    } else {
      for (const part of pages.split(",")) {
        const trimmed = part.trim();
        if (trimmed.includes("-")) {
          const [s, e] = trimmed.split("-").map((n: string) => parseInt(n.trim()) - 1);
          for (let i = s; i <= Math.min(e, total - 1); i++) pageIndices.push(i);
        } else {
          const idx = parseInt(trimmed) - 1;
          if (idx >= 0 && idx < total) pageIndices.push(idx);
        }
      }
    }
    if (!pageIndices.length) return res.status(400).json({ success: false, message: "No valid pages selected" });

    const newDoc = await PDFDocument.create();
    const copied = await newDoc.copyPages(srcDoc, pageIndices);
    copied.forEach(p => newDoc.addPage(p));

    const pdfBytes = await newDoc.save({ objectsPerTick: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=split.pdf");
    res.send(Buffer.from(pdfBytes));
    console.log(`✅ SPLIT-PDF: ${pageIndices.length}/${total} pages in ${Date.now() - startTime}ms`);
    handlePDFAction(req, "img-to-pdf").catch(console.error);
  } catch (err: any) {
    console.error("SPLIT PDF ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= COMPRESS PDF ================= */
app.post("/api/compress-pdf", fileToolsLimiter, upload.single("file"), async (req: any, res) => {
  const startTime = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const srcDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    // Re-save with compression — pdf-lib removes duplicates and compresses streams
    const pdfBytes = await srcDoc.save({ useObjectStreams: true, objectsPerTick: 50 });

    const originalKB  = Math.round(req.file.buffer.length / 1024);
    const compressedKB = Math.round(pdfBytes.length / 1024);
    const savings = Math.max(0, Math.round((1 - compressedKB / originalKB) * 100));

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=compressed.pdf");
    res.setHeader("X-Original-Size", originalKB.toString());
    res.setHeader("X-Compressed-Size", compressedKB.toString());
    res.setHeader("X-Savings-Percent", savings.toString());
    res.send(Buffer.from(pdfBytes));
    console.log(`✅ COMPRESS-PDF: ${originalKB}KB → ${compressedKB}KB (${savings}% saved) in ${Date.now() - startTime}ms`);
    handlePDFAction(req, "img-to-pdf").catch(console.error);
  } catch (err: any) {
    console.error("COMPRESS PDF ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= ROTATE PDF ================= */
app.post("/api/rotate-pdf", fileToolsLimiter, upload.single("file"), async (req: any, res) => {
  const startTime = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const degrees = parseInt(req.body.degrees || "90"); // 90, 180, 270
    if (![90, 180, 270].includes(degrees))
      return res.status(400).json({ success: false, message: "Degrees must be 90, 180, or 270" });

    const srcDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const pages  = srcDoc.getPages();
    pages.forEach(page => {
      const current = page.getRotation().angle;
      page.setRotation({ type: 0, angle: (current + degrees) % 360 } as any);
    });

    const pdfBytes = await srcDoc.save({ objectsPerTick: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=rotated.pdf");
    res.send(Buffer.from(pdfBytes));
    console.log(`✅ ROTATE-PDF: ${degrees}° in ${Date.now() - startTime}ms`);
    handlePDFAction(req, "img-to-pdf").catch(console.error);
  } catch (err: any) {
    console.error("ROTATE PDF ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= ADD PAGE NUMBERS ================= */
app.post("/api/pdf-page-numbers", fileToolsLimiter, upload.single("file"), async (req: any, res) => {
  const startTime = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const { StandardFonts, rgb, degrees } = await import("pdf-lib");
    const srcDoc  = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const font    = await srcDoc.embedFont(StandardFonts.Helvetica);
    const pages   = srcDoc.getPages();
    const total   = pages.length;
    const position = req.body.position || "bottom-center"; // bottom-center, bottom-right

    pages.forEach((page, i) => {
      const { width, height } = page.getSize();
      const text = `${i + 1} / ${total}`;
      const fontSize = 10;
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      let x = (width - textWidth) / 2; // center
      if (position === "bottom-right") x = width - textWidth - 30;

      page.drawText(text, {
        x, y: 20,
        size: fontSize,
        font,
        color: rgb(0.4, 0.4, 0.4),
        opacity: 0.8,
      });
    });

    const pdfBytes = await srcDoc.save({ objectsPerTick: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=numbered.pdf");
    res.send(Buffer.from(pdfBytes));
    console.log(`✅ PAGE-NUMBERS: ${total} pages in ${Date.now() - startTime}ms`);
    handlePDFAction(req, "img-to-pdf").catch(console.error);
  } catch (err: any) {
    console.error("PAGE NUMBERS ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= WATERMARK PDF ================= */
app.post("/api/pdf-watermark", fileToolsLimiter, upload.single("file"), async (req: any, res) => {
  const startTime = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const { StandardFonts, rgb, degrees } = await import("pdf-lib");
    const text    = (req.body.text || "CONFIDENTIAL").toUpperCase().slice(0, 30);
    const srcDoc  = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const font    = await srcDoc.embedFont(StandardFonts.HelveticaBold);
    const pages   = srcDoc.getPages();

    pages.forEach(page => {
      const { width, height } = page.getSize();
      const fontSize   = Math.min(width / text.length * 1.5, 60);
      const textWidth  = font.widthOfTextAtSize(text, fontSize);
      const x = (width - textWidth) / 2;
      const y = (height - fontSize) / 2;

      page.drawText(text, {
        x, y,
        size: fontSize,
        font,
        color: rgb(0.75, 0.75, 0.75),
        opacity: 0.25,
        rotate: degrees(45),
      });
    });

    const pdfBytes = await srcDoc.save({ objectsPerTick: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=watermarked.pdf");
    res.send(Buffer.from(pdfBytes));
    console.log(`✅ WATERMARK: "${text}" on ${pages.length} pages in ${Date.now() - startTime}ms`);
    handlePDFAction(req, "img-to-pdf").catch(console.error);
  } catch (err: any) {
    console.error("WATERMARK ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= WORD/PPT/EXCEL → PDF (LibreOffice) ================= */
import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);

async function convertWithLibreOffice(inputBuffer: Buffer, originalName: string): Promise<Buffer> {
  const tmpDir   = fs.mkdtempSync(path.join(os.tmpdir(), "lo-"));
  const inputPath = path.join(tmpDir, originalName);
  const outName   = originalName.replace(/\.[^.]+$/, ".pdf");
  const outPath   = path.join(tmpDir, outName);

  try {
    fs.writeFileSync(inputPath, inputBuffer);
    await execAsync(
      `libreoffice --headless --convert-to pdf --outdir "${tmpDir}" "${inputPath}"`,
      { timeout: 30000 }
    );
    if (!fs.existsSync(outPath)) throw new Error("LibreOffice conversion failed — output not found");
    return fs.readFileSync(outPath);
  } finally {
    // Cleanup temp files
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }
}

// Word → PDF
app.post("/api/word-to-pdf", fileToolsLimiter, upload.single("file"), async (req: any, res) => {
  const startTime = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const allowed = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/msword","application/vnd.oasis.opendocument.text"];
    if (!allowed.some(t => req.file.mimetype.includes(t) || req.file.originalname.match(/\.(docx|doc|odt)$/i)))
      return res.status(400).json({ success: false, message: "Please upload a Word (.docx, .doc) file" });

    const pdfBuffer = await convertWithLibreOffice(req.file.buffer, req.file.originalname);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=converted.pdf");
    res.send(pdfBuffer);
    console.log(`✅ WORD→PDF: ${req.file.originalname} in ${Date.now() - startTime}ms`);
    handlePDFAction(req, "img-to-pdf").catch(console.error);
  } catch (err: any) {
    console.error("WORD→PDF ERROR:", err.message);
    res.status(500).json({ success: false, message: "Conversion failed: " + err.message });
  }
});

// PPT → PDF
app.post("/api/ppt-to-pdf", fileToolsLimiter, upload.single("file"), async (req: any, res) => {
  const startTime = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const pdfBuffer = await convertWithLibreOffice(req.file.buffer, req.file.originalname);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=converted.pdf");
    res.send(pdfBuffer);
    console.log(`✅ PPT→PDF: ${req.file.originalname} in ${Date.now() - startTime}ms`);
    handlePDFAction(req, "img-to-pdf").catch(console.error);
  } catch (err: any) {
    console.error("PPT→PDF ERROR:", err.message);
    res.status(500).json({ success: false, message: "Conversion failed: " + err.message });
  }
});

// Excel → PDF
app.post("/api/excel-to-pdf", fileToolsLimiter, upload.single("file"), async (req: any, res) => {
  const startTime = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const pdfBuffer = await convertWithLibreOffice(req.file.buffer, req.file.originalname);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=converted.pdf");
    res.send(pdfBuffer);
    console.log(`✅ EXCEL→PDF: ${req.file.originalname} in ${Date.now() - startTime}ms`);
    handlePDFAction(req, "img-to-pdf").catch(console.error);
  } catch (err: any) {
    console.error("EXCEL→PDF ERROR:", err.message);
    res.status(500).json({ success: false, message: "Conversion failed: " + err.message });
  }
});

/* ================= PREMIUM FRAUD CHECK ================= */
async function checkPremiumEligibility(userId: string): Promise<{ ok: boolean; reason?: string }> {
  try {
    const user = await User.findById(userId);
    if (!user) return { ok: false, reason: "User not found" };

    const activities = await Activity.find({ userId }).sort({ createdAt: -1 }).limit(200).lean();

    // Rule 1: At least 5 real study actions
    const realActions = ["ask_question", "generate_ppt", "convert_pdf", "daily_challenge", "quiz_completed", "study_plan_created"];
    const realCount = activities.filter((a: any) => realActions.includes(a.action)).length;
    if (realCount < 5)
      return { ok: false, reason: "Not enough genuine study activity. Keep using the app and try again." };

    // Rule 2: No rapid farming — max 300 pts in any 10-min window
    const sorted = [...activities].sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    for (let i = 0; i < sorted.length; i++) {
      const windowStart = new Date((sorted[i] as any).createdAt).getTime();
      const windowPts = sorted
        .filter((a: any) => {
          const t = new Date((a as any).createdAt).getTime();
          return t >= windowStart && t <= windowStart + 10 * 60 * 1000;
        })
        .reduce((sum: number, a: any) => sum + (a.pointsEarned || 0), 0);
      if (windowPts > 300)
        return { ok: false, reason: "Suspicious rapid point activity detected. Please use the app naturally." };
    }

    // Rule 3: Account at least 2 hours old
    const ageMs = Date.now() - new Date((user as any).createdAt).getTime();
    if (ageMs < 2 * 60 * 60 * 1000)
      return { ok: false, reason: "Account too new. Use the app for at least 2 hours before redeeming." };

    // Rule 4: At least 2 different action types used
    const uniqueActions = new Set(activities.map((a: any) => a.action));
    if (uniqueActions.size < 2)
      return { ok: false, reason: "Points earned from too few features. Use more of the app." };

    return { ok: true };
  } catch (err: any) {
    console.error("Fraud check error:", err.message);
    return { ok: false, reason: "Verification failed. Please try again." };
  }
}

/* ================= REWARDS — TIERS & REDEMPTION ================= */

const REWARD_TIERS = [
  { id: "tier_1000",  title: "7-Day Premium",     desc: "15 AI questions/day • 2× points on all actions • Premium badge", pointsCost: 1000,  type: "premium",  icon: "⚡" },
  { id: "tier_2500",  title: "₹10 Paytm Voucher", desc: "UPI/Paytm cash voucher",                                         pointsCost: 2500,  type: "voucher",  icon: "💳" },
  { id: "tier_5000",  title: "₹25 Amazon GC",      desc: "Amazon India gift card",                                         pointsCost: 5000,  type: "giftcard", icon: "🎁" },
  { id: "tier_10000", title: "₹50 Amazon GC",       desc: "Amazon India gift card",                                         pointsCost: 10000, type: "giftcard", icon: "🎁" },
  { id: "tier_25000", title: "₹150 Amazon GC",      desc: "Amazon India gift card",                                         pointsCost: 25000, type: "giftcard", icon: "💎" },
];

app.get("/api/rewards/tiers", (_req, res) => {
  res.json({ success: true, tiers: REWARD_TIERS });
});

app.get("/api/rewards/status", async (req: any, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ success: false, message: "Login required" });
    const user  = await User.findById(userId).lean();
    if (!user)  return res.status(404).json({ success: false });
    const expiresAt  = (user as any).premiumExpiresAt;
    const isPremium  = (user as any).isPremium === true && expiresAt && new Date(expiresAt) > new Date();
    const daysLeft   = isPremium ? Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000) : 0;
    const pending    = await Redemption.findOne({ userId, status: { $in: ["pending", "processing"] } }).lean();
    res.json({ success: true, isPremium, premiumExpiresAt: expiresAt || null, daysLeft, hasPendingRedemption: !!pending, pendingRedemption: pending || null });
  } catch (err: any) { res.status(500).json({ success: false, message: err.message }); }
});

app.post("/api/rewards/redeem", async (req: any, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ success: false, message: "Login required" });
    const { rewardId, deliveryInfo } = req.body;
    if (!rewardId) return res.status(400).json({ success: false, message: "rewardId required" });
    const tier = REWARD_TIERS.find(t => t.id === rewardId);
    if (!tier)  return res.status(400).json({ success: false, message: "Invalid reward" });
    const user = await User.findById(userId);
    if (!user)  return res.status(404).json({ success: false, message: "User not found" });

    if (user.points < tier.pointsCost)
      return res.status(400).json({ success: false, message: `Not enough points. Need ${tier.pointsCost}, you have ${user.points}.` });

    if (tier.type === "premium" && (user as any).isPremium === true) {
      const exp = new Date((user as any).premiumExpiresAt);
      if (exp > new Date())
        return res.status(400).json({ success: false, message: `You already have an active Premium plan (expires ${exp.toLocaleDateString("en-IN")}).` });
    }

    const existing = await Redemption.findOne({ userId, status: { $in: ["pending", "processing"] } });
    if (existing)
      return res.status(400).json({ success: false, message: "You already have a pending redemption. Please wait for it to be processed." });

    // Deduct from spendable points ONLY — XP stays untouched
    user.points -= tier.pointsCost;
    await user.save();

    const redemption = await Redemption.create({
      userId, userName: user.name, userEmail: user.email,
      rewardId: tier.id, rewardTitle: tier.title, pointsCost: tier.pointsCost,
      deliveryInfo: deliveryInfo || "", status: "pending",
    });

    await Activity.create({ userId, action: "referral", details: `Redeemed: ${tier.title} (${tier.pointsCost} pts)`, pointsEarned: 0 });
    console.log(`✅ REDEEM submitted: ${user.email} → ${tier.title}`);

    if (tier.type === "premium") {
      const redemptionId = (redemption._id as any).toString();
      setTimeout(async () => {
        try {
          console.log(`🔍 30-min fraud check for ${user.email}...`);
          const rec = await Redemption.findById(redemptionId);
          if (!rec || rec.status !== "pending") return;
          const check = await checkPremiumEligibility(userId);
          if (!check.ok) {
            rec.status = "rejected";
            rec.adminNote = `Auto-rejected: ${check.reason}`;
            await rec.save();
            const u = await User.findById(userId);
            if (u) { u.points += tier.pointsCost; await u.save(); }
            console.log(`❌ Premium REJECTED for ${user.email}: ${check.reason}`);
          } else {
            rec.status = "fulfilled";
            await rec.save();
            const u = await User.findById(userId);
            if (u) {
              const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
              (u as any).isPremium          = true;
              (u as any).premiumExpiresAt   = expiry;
              (u as any).premiumActivatedAt = new Date();
              await u.save();
              console.log(`🌟 Premium ACTIVATED for ${u.email} — expires ${expiry.toISOString()}`);
            }
          }
        } catch (err: any) { console.error("Premium activation error:", err.message); }
      }, 30 * 60 * 1000);
    }

    res.json({
      success: true,
      message: tier.type === "premium"
        ? "Premium plan requested! Verifying your account activity. Plan activates in ~30 minutes. ✅"
        : `Successfully redeemed ${tier.title}! We'll process it within 2–3 business days.`,
      redemptionId: (redemption._id as any).toString(),
      pointsRemaining: user.points,
    });
  } catch (err: any) {
    console.error("REDEEM ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/rewards/history", async (req: any, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ success: false, message: "Login required" });
    const history = await Redemption.find({ userId }).sort({ createdAt: -1 }).limit(20).lean();
    res.json({ success: true, history });
  } catch (err: any) { res.status(500).json({ success: false, message: err.message }); }
});

/* ================= GLOBAL EXPRESS ERROR HANDLER ================= */
// This catches ANY error thrown inside route handlers (last middleware)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Express error:", err.message);
  console.error(err.stack);

  // CORS error
  if (err.message?.startsWith("CORS:")) {
    return res.status(403).json({ success: false, message: "Not allowed by CORS policy." });
  }

  // Rate limit error (already handled by rateLimiter, but just in case)
  if (err.status === 429) {
    return res.status(429).json({ success: false, message: "Too many requests. Please slow down." });
  }

  // Default: 500 internal server error
  res.status(500).json({
    success: false,
    message: "An internal server error occurred. Please try again.",
  });
});

/* ================= START SERVER ================= */

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
    console.log("✅ AI Ready");
    console.log("✅ PPT Ready");
    console.log("✅ PDF Tools Ready");
  });
});