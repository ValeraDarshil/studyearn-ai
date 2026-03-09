// ─────────────────────────────────────────────────────────────
// StudyEarn AI — AI Controller
// ─────────────────────────────────────────────────────────────
// Route handlers: POST /api/ai/ask, POST /api/ai/solve-pdf
// Business logic → aiService mein hai
// ─────────────────────────────────────────────────────────────

import { Request, Response } from 'express';
import { solveText, solveWithVision } from '../services/aiService.js';
import { parsePDFText } from '../services/pdfService.js';
import { getUserIdFromToken } from '../middleware/authMiddleware.js';
import { User } from '../models/User.model.js';
import { Activity } from '../models/Activity.model.js';
import { logger } from '../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// PRIVATE HELPER — question deduct + points award
// Server-authoritative: client pe trust nahi karte
// ─────────────────────────────────────────────────────────────
async function handleQuestionUsed(
  req: Request,
  pointsToAward = 15,
): Promise<{ questionsLeft: number; pointsAwarded: number } | null> {
  const userId = getUserIdFromToken(req);
  if (!userId) return null;

  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const today = new Date().toISOString().split('T')[0];

    // Auto-expire premium if past expiry
    if ((user as any).isPremium && (user as any).premiumExpiresAt) {
      if (new Date((user as any).premiumExpiresAt) < new Date()) {
        (user as any).isPremium        = false;
        (user as any).premiumExpiresAt = null;
        logger.info(`Premium auto-expired for ${user.email}`);
      }
    }
    const isPremiumActive = (user as any).isPremium === true;

    // Premium = 15/day, Free = 5/day
    const dailyLimit = isPremiumActive ? 15 : 5;
    if (user.questionsDate !== today) {
      user.questionsLeft = dailyLimit;
      user.questionsDate = today;
    }
    if (user.questionsLeft > 0) user.questionsLeft -= 1;

    // Premium users 2x points
    if (isPremiumActive) pointsToAward = pointsToAward * 2;

    user.points                       += pointsToAward;
    (user as any).totalXP              = ((user as any).totalXP || 0) + pointsToAward;
    (user as any).totalQuestionsAsked  = ((user as any).totalQuestionsAsked || 0) + 1;
    await user.save();

    await Activity.create({ userId, action: 'ask_question', details: 'Asked AI a question', pointsEarned: pointsToAward });
    logger.info(`Question used: ${user.email} | left=${user.questionsLeft} | +${pointsToAward}pts`);

    return { questionsLeft: user.questionsLeft, pointsAwarded: pointsToAward };
  } catch (err: any) {
    logger.error('handleQuestionUsed error:', err.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/ask — text ya image question
// ─────────────────────────────────────────────────────────────
export async function askAI(req: Request, res: Response) {
  try {
    const { prompt, image } = req.body;
    if (!prompt && !image) {
      return res.status(400).json({ success: false, answer: 'Please enter a question or upload an image.' });
    }

    const imgSizeKB = image ? Math.round(image.length * 0.75 / 1024) : 0;
    logger.info(`/api/ai/ask  image=${!!image}(${imgSizeKB}KB)  prompt="${(prompt || '').substring(0, 60)}"`);

    let answer: string;

    if (image) {
      // Normalize image to proper data URL format
      let imageUrl: string;
      if (image.startsWith('data:')) {
        imageUrl = image;
      } else if (image.startsWith('/9j/') || image.startsWith('iVBOR')) {
        const isJpeg = image.startsWith('/9j/');
        imageUrl = `data:image/${isJpeg ? 'jpeg' : 'png'};base64,${image}`;
      } else {
        imageUrl = `data:image/jpeg;base64,${image}`;
      }

      if (imgSizeKB > 4000) logger.warn(`Large image: ${imgSizeKB}KB — may be slow`);
      answer = await solveWithVision(imageUrl, prompt || '');
    } else {
      answer = await solveText(prompt);
    }

    const userAction = await handleQuestionUsed(req, 15);

    res.json({
      success: true,
      answer,
      ...(userAction ? { questionsLeft: userAction.questionsLeft, pointsAwarded: userAction.pointsAwarded } : {}),
    });
  } catch (error: any) {
    logger.error('/api/ai/ask error:', error.message);
    res.status(500).json({ success: false, answer: 'AI is temporarily unavailable. Please try again in a moment.' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/solve-pdf — PDF upload karke AI se solve karao
// ─────────────────────────────────────────────────────────────
export async function solvePDF(req: Request, res: Response) {
  try {
    if (!req.file) return res.status(400).json({ success: false, answer: 'No file uploaded.' });

    const userPrompt = (req.body.prompt || '').trim();
    logger.info(`/api/ai/solve-pdf  size=${req.file.size}bytes`);

    const extracted = await parsePDFText(req.file.buffer);

    if (!extracted || extracted.length < 20) {
      return res.json({
        success: false,
        answer: '❌ Could not extract text from this PDF. It appears to be a scanned or image-based PDF.\n\n**Solution:** Take a screenshot of the PDF pages and upload as an image instead — AI can then read and solve it directly.',
      });
    }

    logger.info(`Extracted ${extracted.length} chars from PDF`);

    const MAX_CHARS = 14000;
    const text = extracted.length > MAX_CHARS
      ? extracted.substring(0, MAX_CHARS) + '\n\n[... rest of document truncated ...]'
      : extracted;

    const solvePrompt = userPrompt
      ? `The student says: "${userPrompt}"\n\nHere is the PDF content:\n\n${text}\n\nHelp the student as requested. Be complete and thorough.`
      : `Here is the content of a PDF document/question paper:\n\n${text}\n\nFind ALL questions in this document and solve each one completely, step-by-step with full working. Number your answers to match the original question numbers.`;

    const answer     = await solveText(solvePrompt);
    const userAction = await handleQuestionUsed(req, 15);

    res.json({
      success: true,
      answer,
      ...(userAction ? { questionsLeft: userAction.questionsLeft, pointsAwarded: userAction.pointsAwarded } : {}),
    });
  } catch (error: any) {
    logger.error('/api/ai/solve-pdf error:', error.message);
    res.status(500).json({ success: false, answer: 'Failed to process PDF. Please try again.' });
  }
}