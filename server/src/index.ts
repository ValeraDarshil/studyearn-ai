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
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import PptxGenJS from 'pptxgenjs';
import { connectDB } from './db.js';

dotenv.config();

const app = express();

// ✅ CORS - Allow Vercel
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://studyearn-ai.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT || 5003;

// ✅ Initialize GROQ (NOT Gemini!)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Storage setup
const OUTPUT_DIR = path.join(process.cwd(), 'uploads', 'output');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
app.use('/downloads', express.static(OUTPUT_DIR));

// ================= HEALTH CHECK =================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Unified Server (GROQ)', port: PORT });
});

// ================= AUTH & USER ROUTES =================
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// ================= AI ROUTE (GROQ) =================
app.post('/api/ai/ask', async (req, res) => {
  try {
    const { prompt, image } = req.body;

    if (!prompt && !image) {
      return res.json({
        success: false,
        answer: 'Please provide a question or image',
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.json({
        success: false,
        answer: 'AI service not configured. Please add GROQ_API_KEY.',
      });
    }

    // ✅ GROQ doesn't support images, so text-only
    if (image) {
      return res.json({
        success: false,
        answer: 'Image analysis not supported yet. Please type your question.',
      });
    }

    // ✅ Use GROQ with llama model
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile', // Fast and good!
      temperature: 0.7,
      max_tokens: 2000,
    });

    const answer = completion.choices[0]?.message?.content || 'No response from AI';

    res.json({
      success: true,
      answer: answer,
    });

  } catch (error) {
    console.error('AI ERROR:', error);
    res.status(500).json({
      success: false,
      answer: error.message || 'AI request failed. Please try again.',
    });
  }
});

// ================= PPT GENERATION =================
app.post('/api/ppt/generate', async (req, res) => {
  try {
    const { topic, slides } = req.body;

    if (!topic || !slides || slides.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Topic and slides required',
      });
    }

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'StudyEarn AI';
    pptx.title = topic;

    // Title slide
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
      align: 'center',
    });

    // Content slides
    slides.forEach((slide) => {
      const contentSlide = pptx.addSlide();
      contentSlide.background = { fill: '1E293B' };

      // Title
      contentSlide.addText(slide.title, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 0.8,
        fontSize: 32,
        bold: true,
        color: 'FFFFFF',
      });

      // Content
      const bulletPoints = slide.content.split('\n').filter(line => line.trim());
      contentSlide.addText(bulletPoints, {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 4,
        fontSize: 18,
        color: 'E2E8F0',
        bullet: true,
        lineSpacing: 28,
      });
    });

    const filename = `${topic.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pptx`;
    const filepath = path.join(OUTPUT_DIR, filename);

    await pptx.writeFile({ fileName: filepath });

    const baseUrl = process.env.NODE_ENV === 'production'
      ? `https://${req.get('host')}`
      : `http://localhost:${PORT}`;

    res.json({
      success: true,
      url: `${baseUrl}/downloads/${filename}`,
      filename: filename,
    });

  } catch (error) {
    console.error('PPT ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'PPT generation failed',
    });
  }
});

// ================= IMAGE/PDF CONVERSION =================
app.post('/api/img-to-pdf', upload.array('files', 20), async (req, res) => {
  try {
    const files = req.files;
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
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });

      } else if (file.mimetype === 'application/pdf') {
        const donorPdf = await PDFDocument.load(fs.readFileSync(file.path));
        const pages = await pdfDoc.copyPages(donorPdf, donorPdf.getPageIndices());
        pages.forEach(p => pdfDoc.addPage(p));
      }

      fs.unlinkSync(file.path);
    }

    const filename = `converted-${Date.now()}.pdf`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(outputPath, await pdfDoc.save());

    const baseUrl = process.env.NODE_ENV === 'production'
      ? `https://${req.get('host')}`
      : `http://localhost:${PORT}`;

    res.json({
      success: true,
      url: `${baseUrl}/downloads/${filename}`,
    });

  } catch (error) {
    console.error('IMG→PDF ERROR:', error);
    res.status(500).json({ success: false, message: 'Conversion failed' });
  }
});

// ================= MERGE PDF =================
app.post('/api/merge-pdf', upload.array('files', 20), async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Upload at least 2 PDFs',
      });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      if (file.mimetype !== 'application/pdf') {
        fs.unlinkSync(file.path);
        return res.status(400).json({
          success: false,
          message: `${file.originalname} is not a PDF`,
        });
      }

      const pdf = await PDFDocument.load(fs.readFileSync(file.path));
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(p => mergedPdf.addPage(p));

      fs.unlinkSync(file.path);
    }

    const filename = `merged-${Date.now()}.pdf`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(outputPath, await mergedPdf.save());

    const baseUrl = process.env.NODE_ENV === 'production'
      ? `https://${req.get('host')}`
      : `http://localhost:${PORT}`;

    res.json({
      success: true,
      url: `${baseUrl}/downloads/${filename}`,
    });

  } catch (error) {
    console.error('MERGE ERROR:', error);
    res.status(500).json({ success: false, message: 'Merge failed' });
  }
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Unified Server running on http://localhost:${PORT}`);
    console.log(`✅ Using GROQ AI (llama-3.3-70b-versatile)`);
    console.log(`✅ Auth: /api/auth`);
    console.log(`✅ AI: /api/ai/ask`);
    console.log(`✅ PPT: /api/ppt/generate`);
    console.log(`✅ PDF: /api/img-to-pdf, /api/merge-pdf`);
  });
});