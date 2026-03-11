// ─────────────────────────────────────────────────────────────
// StudyEarn AI — AI Controller
// ─────────────────────────────────────────────────────────────
// Route handlers: POST /api/ai/ask, POST /api/ai/solve-pdf
// Business logic → aiService mein hai
// ─────────────────────────────────────────────────────────────

import { Request, Response } from 'express';
import { solveText, solveWithVision, ChatMessage } from '../services/aiService.js';
import { parsePDFText } from '../services/pdfService.js';
import { getUserIdFromToken } from '../middleware/authMiddleware.js';
import { User } from '../models/User.model.js';
import { Activity } from '../models/Activity.model.js';
import { logger } from '../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// PRIVATE HELPER — question deduct + points award
// Server-authoritative: client pe trust nahi karte
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// PREMIUM CONSTANTS — change here, applies everywhere
// ─────────────────────────────────────────────────────────────
const BASE_AI_POINTS      = 10;   // free = 10pts, premium = 20pts
const PREMIUM_MULTIPLIER  = 2;
const FREE_DAILY_LIMIT    = 15;   // 15 questions/day free
const PREMIUM_DAILY_LIMIT = 30;   // 30 questions/day premium (2x)
const REFILL_INTERVAL_MS  = 60 * 60 * 1000; // 1 hour in ms
const MAX_VIDEO_ADS_DAY   = 5;    // max 5 bonus questions via video/day

// ─────────────────────────────────────────────────────────────
// Midnight IST mein din badla ya nahi
// ─────────────────────────────────────────────────────────────
function getTodayIST(): string {
  // IST = UTC+5:30
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffset);
  return ist.toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

// ─────────────────────────────────────────────────────────────
// Hourly refill: questionUsedAt array check karo
// Jo timestamps 1hr se purane hain unhe remove karo aur
// questionsLeft ko recalculate karo
// ─────────────────────────────────────────────────────────────
function applyHourlyRefill(user: any, dailyLimit: number): void {
  const now = Date.now();
  const cutoff = now - REFILL_INTERVAL_MS;

  // Sirf last 1hr ke andar use hue questions count karo
  const recentUsed: Date[] = (user.questionUsedAt || [])
    .filter((t: Date) => new Date(t).getTime() > cutoff);

  user.questionUsedAt = recentUsed;

  // questionsLeft = dailyLimit - recentUsed (can't go below 0 or above limit)
  const used = recentUsed.length;
  user.questionsLeft = Math.max(0, Math.min(dailyLimit, dailyLimit - used));
}

function isPremiumValid(user: any): boolean {
  if (!user.isPremium) return false;
  if (!user.premiumExpiresAt) return false;
  if (new Date(user.premiumExpiresAt) < new Date()) {
    // expired — clear it in-place (caller must save)
    user.isPremium = false;
    user.premiumExpiresAt = null;
    return false;
  }
  return true;
}

// ─────────────────────────────────────────────────────────────
// Next refill time — seconds until oldest used question expires
// ─────────────────────────────────────────────────────────────
function getNextRefillSecs(user: any): number {
  const used: Date[] = user.questionUsedAt || [];
  if (used.length === 0) return 0;
  const oldest = Math.min(...used.map((t: Date) => new Date(t).getTime()));
  const refillAt = oldest + REFILL_INTERVAL_MS;
  return Math.max(0, Math.ceil((refillAt - Date.now()) / 1000));
}

async function handleQuestionUsed(
  req: Request,
): Promise<{ questionsLeft: number; pointsAwarded: number; nextRefillSecs: number } | null> {
  const userId = getUserIdFromToken(req);
  if (!userId) return null;

  try {
    const user    = await User.findById(userId);
    if (!user) return null;

    const premium    = isPremiumValid(user);
    const today      = getTodayIST();
    const dailyLimit = premium ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;

    // ── Midnight IST reset ──────────────────────────────────
    if ((user as any).questionsDate !== today) {
      (user as any).questionsDate   = today;
      (user as any).questionUsedAt  = [];
      (user as any).videoAdsToday   = 0;
      (user as any).videoAdsDate    = today;
    }

    // ── Apply hourly refill ─────────────────────────────────
    applyHourlyRefill(user, dailyLimit);

    if ((user as any).questionsLeft <= 0) {
      await user.save();
      return { questionsLeft: 0, pointsAwarded: 0, nextRefillSecs: getNextRefillSecs(user) };
    }

    // ── Deduct 1 question ───────────────────────────────────
    (user as any).questionUsedAt = [...((user as any).questionUsedAt || []), new Date()];
    applyHourlyRefill(user, dailyLimit); // recalculate after push

    // ── Points ──────────────────────────────────────────────
    const pts = premium ? BASE_AI_POINTS * PREMIUM_MULTIPLIER : BASE_AI_POINTS;
    user.points                       += pts;
    (user as any).totalXP              = ((user as any).totalXP || 0) + pts;
    (user as any).totalQuestionsAsked  = ((user as any).totalQuestionsAsked || 0) + 1;

    await user.save();

    await Activity.create({ userId, action: 'ask_question', details: 'Asked AI a question', pointsEarned: pts });
    logger.info(`AI question: ${user.email} | premium=${premium} | +${pts}pts | left=${(user as any).questionsLeft}`);

    return {
      questionsLeft:   (user as any).questionsLeft,
      pointsAwarded:   pts,
      nextRefillSecs:  getNextRefillSecs(user),
    };
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
    const { prompt, image, history = [] } = req.body;
    // Sanitize history — only last 10 messages, only user/assistant roles
    const safeHistory: ChatMessage[] = (Array.isArray(history) ? history : [])
      .slice(-10)
      .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content.slice(0, 2000) }));
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
      answer = await solveText(prompt, safeHistory);
    }

    const userAction = await handleQuestionUsed(req);

    res.json({
      success: true,
      answer,
      ...(userAction ? {
        questionsLeft:  userAction.questionsLeft,
        pointsAwarded:  userAction.pointsAwarded,
        nextRefillSecs: userAction.nextRefillSecs,
      } : {}),
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
    const userAction = await handleQuestionUsed(req);

    res.json({
      success: true,
      answer,
      ...(userAction ? {
        questionsLeft:  userAction.questionsLeft,
        pointsAwarded:  userAction.pointsAwarded,
        nextRefillSecs: userAction.nextRefillSecs,
      } : {}),
    });
  } catch (error: any) {
    logger.error('/api/ai/solve-pdf error:', error.message);
    res.status(500).json({ success: false, answer: 'Failed to process PDF. Please try again.' });
  }
}
// ─────────────────────────────────────────────────────────────
// POST /api/ai/watch-ad — fake video ad → +1 question
// ─────────────────────────────────────────────────────────────
export async function watchAd(req: Request, res: Response) {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Login required' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const premium    = isPremiumValid(user);
    const today      = getTodayIST();
    const dailyLimit = premium ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;

    // Reset if new day
    if ((user as any).videoAdsDate !== today) {
      (user as any).videoAdsToday = 0;
      (user as any).videoAdsDate  = today;
    }

    // Max 5 video ads per day
    if ((user as any).videoAdsToday >= MAX_VIDEO_ADS_DAY) {
      return res.json({
        success: false,
        message: `Max ${MAX_VIDEO_ADS_DAY} video bonuses per day reached. Come back tomorrow!`,
        questionsLeft: (user as any).questionsLeft,
      });
    }

    // Already at full quota?
    applyHourlyRefill(user, dailyLimit);
    if ((user as any).questionsLeft >= dailyLimit) {
      return res.json({
        success: false,
        message: 'You already have full questions! No need to watch an ad.',
        questionsLeft: (user as any).questionsLeft,
      });
    }

    // Grant +1 question by removing the oldest questionUsedAt entry
    const used: Date[] = (user as any).questionUsedAt || [];
    if (used.length > 0) {
      // Remove oldest used timestamp → effectively refills 1 question
      used.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      (user as any).questionUsedAt = used.slice(1);
    }

    (user as any).videoAdsToday = ((user as any).videoAdsToday || 0) + 1;
    applyHourlyRefill(user, dailyLimit);

    await user.save();

    logger.info(`Video ad: ${(user as any).email} | +1 question | left=${(user as any).questionsLeft}`);

    return res.json({
      success:       true,
      message:       '+1 question unlocked! Keep studying! 🎓',
      questionsLeft: (user as any).questionsLeft,
      videoAdsLeft:  MAX_VIDEO_ADS_DAY - (user as any).videoAdsToday,
      nextRefillSecs: getNextRefillSecs(user),
    });
  } catch (err: any) {
    logger.error('watchAd error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/ai/quota — current quota status (for page load)
// ─────────────────────────────────────────────────────────────
export async function getQuota(req: Request, res: Response) {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false });

    const premium    = isPremiumValid(user);
    const today      = getTodayIST();
    const dailyLimit = premium ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;

    if ((user as any).questionsDate !== today) {
      (user as any).questionsDate  = today;
      (user as any).questionUsedAt = [];
      (user as any).videoAdsToday  = 0;
      (user as any).videoAdsDate   = today;
      await user.save();
    }

    applyHourlyRefill(user, dailyLimit);
    await user.save();

    return res.json({
      success:        true,
      questionsLeft:  (user as any).questionsLeft,
      dailyLimit,
      nextRefillSecs: getNextRefillSecs(user),
      videoAdsLeft:   MAX_VIDEO_ADS_DAY - Math.min((user as any).videoAdsToday || 0, MAX_VIDEO_ADS_DAY),
      isPremium:      premium,
    });
  } catch (err: any) {
    logger.error('getQuota error:', err.message);
    return res.status(500).json({ success: false });
  }
}