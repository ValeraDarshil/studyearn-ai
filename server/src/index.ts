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

/* ================= ASK AI ================= */

app.post("/api/ai/ask", async (req, res) => {
  try {
    const { prompt, image } = req.body;

    if (!prompt && !image) {
      return res.status(400).json({
        success: false,
        answer: "No question provided",
      });
    }

    let messages: any[];

    if (image && image.startsWith("data:image")) {
      messages = [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                prompt ||
                "Solve all questions step by step from this image.",
            },
            {
              type: "image_url",
              image_url: { url: image },
            },
          ],
        },
      ];
    } else {
      messages = [
        {
          role: "system",
          content:
            "You are an intelligent academic tutor. Solve step by step.",
        },
        {
          role: "user",
          content: prompt,
        },
      ];
    }

    const completion = await groq.chat.completions.create({
      model: image
        ? "llama-3.2-90b-vision-preview"
        : "llama-3.3-70b-versatile",
      messages,
      temperature: 0.4,
      max_tokens: 4096,
    });

    const answer =
      completion.choices?.[0]?.message?.content || "No response";

    res.json({ success: true, answer });

  } catch (error: any) {
    console.error("AI ERROR:", error);
    res.status(500).json({
      success: false,
      answer: error.message,
    });
  }
});

/* ================= PDF QUESTION SOLVER ================= */

app.post(
  "/api/ai/solve-pdf",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false });
      }

      const pdfData = await parsePDF(req.file.buffer);

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content:
              "Solve this question paper step by step:\n\n" +
              pdfData.text,
          },
        ],
        max_tokens: 4096,
      });

      const answer =
        completion.choices?.[0]?.message?.content || "No response";

      res.json({ success: true, answer });

    } catch (error) {
      console.error("PDF SOLVE ERROR:", error);
      res.status(500).json({ success: false });
    }
  }
);

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
