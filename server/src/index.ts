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

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 🔥 MEMORY STORAGE (Render Safe)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

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

/* ================= PPT ROUTE ================= */

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
        .filter((line: string) => line.trim())
        .map((line: string) => ({
          text: line,
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

  } catch (error: any) {
    console.error("PPT ERROR:", error);
    res.status(500).json({ success: false, message: "PPT failed" });
  }
});

/* ================= IMAGE → PDF ================= */

app.post(
  "/api/img-to-pdf",
  upload.array("files"),
  async (req: any, res) => {
    try {
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const imageBuffer = await sharp(file.buffer)
          .png()
          .toBuffer();

        const image = await pdfDoc.embedPng(imageBuffer);
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=converted.pdf"
      );

      res.send(Buffer.from(pdfBytes));

    } catch (error: any) {
      console.error("IMG→PDF ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Image to PDF failed",
      });
    }
  }
);

/* ================= MERGE PDF ================= */

app.post(
  "/api/merge-pdf",
  upload.array("files"),
  async (req: any, res) => {
    try {
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const pdf = await PDFDocument.load(file.buffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=merged.pdf"
      );

      res.send(Buffer.from(pdfBytes));

    } catch (error: any) {
      console.error("MERGE PDF ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Merge failed",
      });
    }
  }
);

/* ================= START SERVER ================= */

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ AI ready`);
    console.log(`✅ PPT ready`);
    console.log(`✅ PDF tools ready`);
  });
});