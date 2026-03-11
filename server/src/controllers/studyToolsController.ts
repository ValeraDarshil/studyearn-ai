// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Study Tools Controller
// POST /api/study/improve-notes  → AI Notes Improver
// POST /api/study/analyze-pdf    → PDF Smart Analyzer
// ─────────────────────────────────────────────────────────────

import { Request, Response } from 'express';
import { solveText } from '../services/aiService.js';
import { parsePDFText } from '../services/pdfService.js';
import { getUserIdFromToken } from '../middleware/authMiddleware.js';
import { User } from '../models/User.model.js';
import { Activity } from '../models/Activity.model.js';
import { logger } from '../utils/logger.js';

const BASE_POINTS      = 5;
const PREMIUM_MULTI    = 2;

function isPremiumValid(user: any): boolean {
  if (!user.isPremium || !user.premiumExpiresAt) return false;
  if (new Date(user.premiumExpiresAt) < new Date()) {
    user.isPremium = false; user.premiumExpiresAt = null; return false;
  }
  return true;
}

async function awardPoints(req: Request, action: string, detail: string): Promise<number> {
  const userId = getUserIdFromToken(req);
  if (!userId) return 0;
  try {
    const user = await User.findById(userId);
    if (!user) return 0;
    const premium = isPremiumValid(user);
    const pts = premium ? BASE_POINTS * PREMIUM_MULTI : BASE_POINTS;
    user.points += pts;
    (user as any).totalXP = ((user as any).totalXP || 0) + pts;
    await user.save();
    await Activity.create({ userId, action, details: detail, pointsEarned: pts });
    return pts;
  } catch { return 0; }
}

// ─────────────────────────────────────────────────────────────
// NOTES IMPROVER MODES — prompts
// ─────────────────────────────────────────────────────────────
const NOTE_MODES: Record<string, { label: string; prompt: string }> = {
  simplify: {
    label: 'Simplify',
    prompt: `You are an expert educator. Rewrite the following student notes in very simple, easy-to-understand English. Use short sentences, common words, avoid jargon. Keep all important information but make it crystal clear for a student who is reading this topic for the first time.`,
  },
  summarize: {
    label: 'Summarize',
    prompt: `You are an expert educator. Create a concise summary of the following notes. Keep only the most important points. The summary should be 30-40% of the original length. Use clear, precise language.`,
  },
  structure: {
    label: 'Add Headings & Structure',
    prompt: `You are an expert educator. Reorganize and restructure the following notes by adding clear headings (##), subheadings (###), and organizing content logically. Group related ideas together. Make the structure easy to follow and scan quickly.`,
  },
  bullets: {
    label: 'Bullet Points',
    prompt: `You are an expert educator. Convert the following notes into well-organized bullet points. Use main bullets for major topics and sub-bullets for details. Every point should be concise — one idea per bullet. Use ✓ or → symbols where helpful.`,
  },
  examples: {
    label: 'Add Examples',
    prompt: `You are an expert educator. Take the following notes and add 1-2 real-world examples for each concept or idea. Examples should be relatable for Indian students (use Indian context where possible). Format: concept → then examples below it.`,
  },
  detailed: {
    label: 'Detailed Explanation',
    prompt: `You are an expert educator. Expand the following notes with detailed explanations for each point. Explain WHY and HOW, not just WHAT. Add context, reasoning, and deeper understanding. This should help a student truly understand, not just memorize.`,
  },
  hinglish: {
    label: 'Hinglish Explain',
    prompt: `You are a friendly Indian teacher. Explain the following notes in Hinglish (mix of Hindi and English, written in English script). Use casual, friendly language like you're explaining to a friend. Add "yaar", "dekho", "matlab", "basically" etc. naturally. Make it fun and easy to understand for Indian students.`,
  },
  mindmap: {
    label: 'Mind Map Format',
    prompt: `You are an expert educator. Convert the following notes into a mind map text format. Use this structure:
🎯 MAIN TOPIC
  ├── Branch 1
  │   ├── Sub-point
  │   └── Sub-point
  ├── Branch 2
  │   ├── Sub-point
  │   └── Sub-point
Keep it visual and hierarchical. Show connections between ideas clearly.`,
  },
  flashcards: {
    label: 'Flashcards',
    prompt: `You are an expert educator. Convert the following notes into study flashcards. Format each flashcard as:
**Q:** [Question]
**A:** [Answer]
---
Create 8-15 flashcards covering all key concepts. Questions should test understanding, not just memorization.`,
  },
};

// ─────────────────────────────────────────────────────────────
// POST /api/study/improve-notes
// ─────────────────────────────────────────────────────────────
export async function improveNotes(req: Request, res: Response) {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Login required' });

  const { notes, mode } = req.body;
  if (!notes?.trim()) return res.status(400).json({ success: false, message: 'Notes text is required' });
  if (notes.trim().length < 20) return res.status(400).json({ success: false, message: 'Notes too short — paste at least a paragraph' });

  const modeConfig = NOTE_MODES[mode] || NOTE_MODES['simplify'];

  const prompt = `${modeConfig.prompt}

Here are the student's notes:
---
${notes.trim()}
---

Provide the improved version now. Use markdown formatting (##, ###, **, -, etc.) where appropriate. Do not add any preamble like "Here is the improved version" — just output the result directly.`;

  try {
    logger.info(`[StudyTools] Notes improve: user=${userId} mode=${mode} len=${notes.length}`);
    const result = await solveText(prompt);
    const pts = await awardPoints(req, 'improve_notes', `Improved notes — mode: ${modeConfig.label}`);
    return res.json({ success: true, result, mode: modeConfig.label, pointsAwarded: pts });
  } catch (err: any) {
    logger.error('[StudyTools] improveNotes error:', err.message);
    return res.status(500).json({ success: false, message: 'AI service error. Please try again.' });
  }
}

// ─────────────────────────────────────────────────────────────
// PDF ANALYZER TYPES
// ─────────────────────────────────────────────────────────────
const PDF_ANALYSES: Record<string, { label: string; prompt: (text: string) => string }> = {
  summary: {
    label: 'Summary',
    prompt: (text) => `You are an expert academic summarizer. Read the following document and provide a comprehensive yet concise summary.

Structure your summary as:
## 📋 Overview
[2-3 sentence overview of what this document is about]

## 🎯 Main Topics Covered
[List the main topics/chapters covered]

## 📌 Key Takeaways
[5-8 most important points a student should remember]

## 💡 Why This Matters
[Brief explanation of the practical importance of this content]

Document content:
---
${text}
---`,
  },

  mcq: {
    label: 'MCQ Questions',
    prompt: (text) => `You are an expert exam question creator for Indian students (CBSE/JEE/NEET/University level). Based on the following document, create 15 high-quality Multiple Choice Questions (MCQs).

Format each question EXACTLY like this:
**Q1.** [Question text]
A) [Option]
B) [Option]
C) [Option]
D) [Option]
✅ **Answer: [Letter]) [Correct answer]**
💡 **Explanation:** [Brief 1-2 line explanation why this answer is correct]

---

Rules:
- Mix easy (30%), medium (50%), and hard (20%) questions
- Test understanding, not just memorization
- Make wrong options plausible (not obviously wrong)
- Cover different parts of the document

Document content:
---
${text}
---`,
  },

  important: {
    label: 'Important Topics',
    prompt: (text) => `You are an expert educator and exam coach. Identify and explain the most important topics from this document in detail.

For each important topic, use this format:

## 🔑 [Topic Name]
**Why it's important:** [1 line]
**Detailed Explanation:**
[Thorough explanation with depth — explain the concept completely]
**Key Points to Remember:**
- [Point 1]
- [Point 2]
- [Point 3]
**Common Exam Questions on This Topic:**
- [Example question 1]
- [Example question 2]

---

Identify 4-6 most important topics. Be thorough and student-friendly.

Document content:
---
${text}
---`,
  },

  flashcards: {
    label: 'Key Points & Flashcards',
    prompt: (text) => `You are an expert study coach. Create two things from this document:

## 📌 KEY POINTS (Quick Reference)
List 10-15 most important facts/concepts in bullet points. Keep each point short and memorable.

---

## 🃏 FLASHCARDS (For Active Recall)
Create 12-18 flashcards. Format:

**Q:** [Question]
**A:** [Answer]
---

Make flashcards test-worthy — suitable for last-minute exam revision.

Document content:
---
${text}
---`,
  },

  chapterwise: {
    label: 'Chapter-wise Breakdown',
    prompt: (text) => `You are an expert academic analyst. Break down this document chapter by chapter (or section by section if no chapters).

For each chapter/section:

## 📖 Chapter/Section [N]: [Title]
**What it's about:** [1-2 sentences]
**Main Concepts:**
[List all concepts covered]
**Important Formulas/Definitions** (if any):
[List them]
**Summary:**
[3-5 sentence summary of this section]
**Difficulty Level:** [Easy / Medium / Hard]
**Estimated Study Time:** [X minutes]

---

Be thorough. Cover every section of the document.

Document content:
---
${text}
---`,
  },

  qa: {
    label: 'Q&A Practice',
    prompt: (text) => `You are an expert exam coach. Create a comprehensive Q&A practice set from this document — both short answer and long answer questions.

## Short Answer Questions (2-3 marks)
[10 questions with answers — 2-4 sentences each]

Format:
**Q:** [Question]
**A:** [Short answer]

---

## Long Answer Questions (5-10 marks)
[5 questions with detailed answers]

Format:
**Q:** [Question]
**A:** [Detailed answer in paragraphs, with structure]

---

Questions should cover all major topics in the document.

Document content:
---
${text}
---`,
  },
};

// ─────────────────────────────────────────────────────────────
// POST /api/study/analyze-pdf
// ─────────────────────────────────────────────────────────────
export async function analyzePDF(req: Request, res: Response) {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Login required' });

  // multer sets req.file for PDF uploads
  const file = (req as any).file;
  const analysisType = req.body.type || 'summary';

  if (!file) return res.status(400).json({ success: false, message: 'PDF file is required' });

  const analysisConfig = PDF_ANALYSES[analysisType] || PDF_ANALYSES['summary'];

  try {
    // Extract text from PDF
    logger.info(`[StudyTools] PDF analyze: user=${userId} type=${analysisType} size=${file.size}`);

    const pdfText = await parsePDFText(file.buffer);
    if (!pdfText || pdfText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from this PDF. Make sure it\'s a text-based PDF (not a scanned image).',
      });
    }

    // Limit text to avoid token overflow (~12000 chars ≈ 3000 tokens)
    const truncated = pdfText.length > 12000
      ? pdfText.slice(0, 12000) + '\n\n[... document truncated for analysis ...]'
      : pdfText;

    const prompt = analysisConfig.prompt(truncated);

    const result = await solveText(prompt);
    const pts = await awardPoints(req, 'analyze_pdf', `PDF analyzed — type: ${analysisConfig.label}`);

    return res.json({
      success: true,
      result,
      type: analysisConfig.label,
      pageCount: Math.ceil(pdfText.length / 2000), // rough estimate
      pointsAwarded: pts,
    });
  } catch (err: any) {
    logger.error('[StudyTools] analyzePDF error:', err.message);
    return res.status(500).json({ success: false, message: 'Analysis failed. Please try again.' });
  }
}