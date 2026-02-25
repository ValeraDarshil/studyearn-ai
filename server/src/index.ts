import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth.js';
import userRoutes from './user-routes.js';
import leaderboardRoutes from './leaderboard-routes.js';
import Groq from 'groq-sdk';
import { upload } from './upload.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import * as PptxGenJS from 'pptxgenjs';
import { connectDB } from './db.js';


// ✅ Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://studyearn-ai.vercel.app'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // allow temporarily
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT || 5003;

// ✅ Initialize GROQ
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// ✅ Storage setup
const OUTPUT_DIR = path.join(__dirname, '..', 'uploads', 'output');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
app.use('/downloads', express.static(OUTPUT_DIR));

/* ================= HEALTH ================= */

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Unified Server (GROQ)', port: PORT });
});

/* ================= ROUTES ================= */

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

/* ================= AI ROUTE ================= */

app.post('/api/ai/ask', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.json({
        success: false,
        answer: 'Please provide a question'
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.json({
        success: false,
        answer: 'AI service not configured'
      });
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000
    });

    const answer =
      completion.choices?.[0]?.message?.content || 'No response from AI';

    res.json({ success: true, answer });

  } catch (error: any) {
    console.error('AI ERROR:', error);
    res.status(500).json({
      success: false,
      answer: error.message || 'AI request failed'
    });
  }
});

/* ================= PPT GENERATION ================= */

app.post('/api/ppt/generate', async (req, res) => {
  try {
    const { topic, slides } = req.body;

    if (!topic || !slides?.length) {
      return res.status(400).json({
        success: false,
        message: 'Topic and slides required'
      });
    }

    const pptx = new (PptxGenJS as any)();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'StudyEarn AI';
    pptx.title = topic;

    const titleSlide = pptx.addSlide();
    titleSlide.background = { fill: '0F172A' };
    titleSlide.addText(topic, {
      x: 0.5,
      y: 2.5,
      w: 9,
      h: 2,
      fontSize: 44,
      bold: true,
      color: 'FFFFFF',
      align: 'center'
    });

    slides.forEach((slide: any) => {
      const contentSlide = pptx.addSlide();
      contentSlide.background = { fill: '1E293B' };

      contentSlide.addText(slide.title, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 0.8,
        fontSize: 32,
        bold: true,
        color: 'FFFFFF'
      });

      const bulletPoints = slide.content
        .split('\n')
        .filter((line: string) => line.trim());

      contentSlide.addText(bulletPoints, {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 4,
        fontSize: 18,
        color: 'E2E8F0',
        bullet: true,
        lineSpacing: 28
      });
    });

    const filename =
      `${topic.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pptx`;

    const filepath = path.join(OUTPUT_DIR, filename);

    await pptx.writeFile({ fileName: filepath });

    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? `https://${req.get('host')}`
        : `http://localhost:${PORT}`;

    res.json({
      success: true,
      url: `${baseUrl}/downloads/${filename}`,
      filename
    });

  } catch (error: any) {
    console.error('PPT ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'PPT generation failed'
    });
  }
});

/* ================= IMAGE → PDF ================= */

app.post('/api/img-to-pdf', upload.array('files', 20), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files?.length) {
      return res.json({ success: false, message: 'No files uploaded' });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      if (file.mimetype.startsWith('image/')) {
        const imgBuffer = await sharp(file.path)
          .rotate()
          .flatten({ background: '#ffffff' })
          .jpeg({ quality: 90 })
          .toBuffer();

        const img = await pdfDoc.embedJpg(imgBuffer);
        const page = pdfDoc.addPage([img.width, img.height]);

        page.drawImage(img, {
          x: 0,
          y: 0,
          width: img.width,
          height: img.height
        });
      }

      if (file.mimetype === 'application/pdf') {
        const donorPdf = await PDFDocument.load(
          fs.readFileSync(file.path)
        );

        const pages = await pdfDoc.copyPages(
          donorPdf,
          donorPdf.getPageIndices()
        );

        pages.forEach(p => pdfDoc.addPage(p));
      }

      fs.unlinkSync(file.path);
    }

    const filename = `converted-${Date.now()}.pdf`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    fs.writeFileSync(outputPath, await pdfDoc.save());

    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? `https://${req.get('host')}`
        : `http://localhost:${PORT}`;

    res.json({
      success: true,
      url: `${baseUrl}/downloads/${filename}`
    });

  } catch (error: any) {
    console.error('IMG→PDF ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Conversion failed'
    });
  }
});

/* ================= MERGE PDF ================= */

app.post('/api/merge-pdf', upload.array('files', 20), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Upload at least 2 PDFs'
      });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      if (file.mimetype !== 'application/pdf') {
        fs.unlinkSync(file.path);
        return res.status(400).json({
          success: false,
          message: `${file.originalname} is not a PDF`
        });
      }

      const pdf = await PDFDocument.load(
        fs.readFileSync(file.path)
      );

      const pages = await mergedPdf.copyPages(
        pdf,
        pdf.getPageIndices()
      );

      pages.forEach(p => mergedPdf.addPage(p));

      fs.unlinkSync(file.path);
    }

    const filename = `merged-${Date.now()}.pdf`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    fs.writeFileSync(outputPath, await mergedPdf.save());

    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? `https://${req.get('host')}`
        : `http://localhost:${PORT}`;

    res.json({
      success: true,
      url: `${baseUrl}/downloads/${filename}`
    });

  } catch (error: any) {
    console.error('MERGE ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Merge failed'
    });
  }
});

/* ================= START SERVER ================= */

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ AI /api/ai/ask`);
    console.log(`✅ PPT /api/ppt/generate`);
    console.log(`✅ PDF /api/img-to-pdf`);
  });
});