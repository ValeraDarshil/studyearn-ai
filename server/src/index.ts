import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./auth.js";
import userRoutes from "./user-routes.js";
import leaderboardRoutes from "./leaderboard-routes.js";
import Groq from "groq-sdk";
import { upload } from "./upload.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import PptxGenJS from "pptxgenjs";
import { connectDB } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

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

const PORT = process.env.PORT || 5003;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const OUTPUT_DIR = path.join(__dirname, "..", "uploads", "output");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
app.use("/downloads", express.static(OUTPUT_DIR));

/* ================= HEALTH ================= */

app.get("/health", (req, res) => {
  res.json({ status: "ok", port: PORT });
});

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

/* ================= AI ROUTE ================= */

app.post("/api/ai/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.json({
        success: false,
        answer: "Please provide a question",
      });
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const answer =
      completion.choices?.[0]?.message?.content || "No response";

    res.json({ success: true, answer });
  } catch (error: any) {
    console.error("AI ERROR:", error);
    res.status(500).json({
      success: false,
      answer: error.message || "AI failed",
    });
  }
});

/* ================= PPT GENERATION ================= */

app.post("/api/ppt/generate", async (req, res) => {
  try {
    const { topic, slides } = req.body;

    if (!topic || !slides || !Array.isArray(slides)) {
      return res.status(400).json({
        success: false,
        message: "Invalid topic or slides",
      });
    }

    const pptx = new (PptxGenJS as any)();

    pptx.layout = "LAYOUT_16x9";
    pptx.author = "StudyEarn AI";
    pptx.title = topic;

    slides.forEach((slide: any) => {
      const s = pptx.addSlide();

      // Background
      s.background = { fill: "0F172A" };

      // Title
      s.addText(slide.title || "Slide", {
        x: 0.5,
        y: 0.4,
        w: 9,
        h: 0.8,
        fontSize: 28,
        bold: true,
        color: "FFFFFF",
      });

      // Convert content safely into bullet objects
      const bulletPoints = (slide.content || "")
        .split("\n")
        .filter((line: string) => line.trim() !== "")
        .map((line: string) => ({
          text: line.trim(),
          options: { bullet: true },
        }));

      s.addText(bulletPoints, {
        x: 0.7,
        y: 1.5,
        w: 8.5,
        h: 4.5,
        fontSize: 18,
        color: "E2E8F0",
        lineSpacing: 28,
      });
    });

    // 🔥 Render-safe: generate buffer
    const buffer = await pptx.write("nodebuffer");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${topic.replace(/\s+/g, "_")}.pptx`
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );

    res.send(buffer);

  } catch (error: any) {
    console.error("PPT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "PPT generation failed",
    });
  }
});

/* ================= START SERVER ================= */

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ AI route ready`);
    console.log(`✅ PPT route ready`);
  });
});