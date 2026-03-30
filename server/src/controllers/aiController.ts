// ─────────────────────────────────────────────────────────────
// AI Study OS — AI Controller (v3 — Personal AI Tutor)
// ─────────────────────────────────────────────────────────────

import { Request, Response } from 'express';
import { solveText, solveWithVision, solveTextStream, ChatMessage } from '../services/aiService.js';
import { contextAwareSolve, SubjectMode } from '../services/contextTutorService.js';
import { personalTutorSolve }             from '../services/aiTutor/aiTutor.service.js';
import { parsePDFText } from '../services/pdfService.js';
import { getUserIdFromToken } from '../middleware/authMiddleware.js';
import { User } from '../models/User.model.js';
import { Activity } from '../models/Activity.model.js';
import { syncActivityToProfile } from '../services/studentProfileService.js';
// ── Stage 4 connection ────────────────────────────────────────
import { onActivityEvent } from '../services/progressSystem/progressAnalyzer.js';
import { logger } from '../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const BASE_AI_POINTS      = 10;
const PREMIUM_MULTIPLIER  = 2;
const FREE_DAILY_LIMIT    = 15;
const PREMIUM_DAILY_LIMIT = 30;
const REFILL_INTERVAL_MS  = 60 * 60 * 1000;
const MAX_VIDEO_ADS_DAY   = 5;

function getTodayIST(): string {
  const now = new Date();
  return new Date(now.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split('T')[0];
}

function applyHourlyRefill(user: any, dailyLimit: number): void {
  const cutoff    = Date.now() - REFILL_INTERVAL_MS;
  const recent    = (user.questionUsedAt || []).filter((t: Date) => new Date(t).getTime() > cutoff);
  user.questionUsedAt = recent;
  user.questionsLeft  = Math.max(0, Math.min(dailyLimit, dailyLimit - recent.length));
}

function isPremiumValid(user: any): boolean {
  if (!user.isPremium || !user.premiumExpiresAt) return false;
  if (new Date(user.premiumExpiresAt) < new Date()) {
    user.isPremium = false; user.premiumExpiresAt = null; return false;
  }
  return true;
}

function getNextRefillSecs(user: any): number {
  const used: Date[] = user.questionUsedAt || [];
  if (used.length === 0) return 0;
  const oldest  = Math.min(...used.map((t: Date) => new Date(t).getTime()));
  return Math.max(0, Math.ceil((oldest + REFILL_INTERVAL_MS - Date.now()) / 1000));
}

async function handleQuestionUsed(
  req: Request, promptText = '',
): Promise<{ questionsLeft: number; pointsAwarded: number; nextRefillSecs: number } | null> {
  const userId = getUserIdFromToken(req);
  if (!userId) return null;

  try {
    const user    = await User.findById(userId);
    if (!user) return null;

    const premium    = isPremiumValid(user);
    const today      = getTodayIST();
    const dailyLimit = premium ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;

    if ((user as any).questionsDate !== today) {
      (user as any).questionsDate  = today;
      (user as any).questionUsedAt = [];
      (user as any).videoAdsToday  = 0;
      (user as any).videoAdsDate   = today;
    }

    applyHourlyRefill(user, dailyLimit);

    if ((user as any).questionsLeft <= 0) {
      await user.save();
      return { questionsLeft: 0, pointsAwarded: 0, nextRefillSecs: getNextRefillSecs(user) };
    }

    (user as any).questionUsedAt = [...((user as any).questionUsedAt || []), new Date()];
    applyHourlyRefill(user, dailyLimit);

    const pts = premium ? BASE_AI_POINTS * PREMIUM_MULTIPLIER : BASE_AI_POINTS;
    user.points                      += pts;
    (user as any).totalXP             = ((user as any).totalXP || 0) + pts;
    (user as any).totalQuestionsAsked = ((user as any).totalQuestionsAsked || 0) + 1;
    await user.save();

    const isInternal = promptText.startsWith('{') || promptText.startsWith('[') ||
      promptText.toLowerCase().startsWith('output only');
    const cleanPrompt   = isInternal ? '' : promptText.trim();
    const activityDetail = cleanPrompt
      ? `Asked: ${cleanPrompt.substring(0, 80)}${cleanPrompt.length > 80 ? '…' : ''}`
      : 'Asked an AI question';

    await Activity.create({ userId, action: 'ask_question', details: activityDetail, pointsEarned: pts });
    logger.info(`AI question: ${user.email} | premium=${premium} | +${pts}pts | left=${(user as any).questionsLeft}`);

    // Sync to Brain profile (non-blocking)
    syncActivityToProfile(userId, 'ask_question', pts).catch(() => {});
    // Stage 4 — fire progress event (non-blocking)
    onActivityEvent(userId, 'ai_tutor_used', { topic: activityDetail }).catch(() => {});

    return { questionsLeft: (user as any).questionsLeft, pointsAwarded: pts, nextRefillSecs: getNextRefillSecs(user) };
  } catch (err: any) {
    logger.error({ err: err.message }, 'handleQuestionUsed error');
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/ask
// ─────────────────────────────────────────────────────────────
export async function askAI(req: Request, res: Response) {
  try {
    const {
      prompt,
      image,
      history = [],
      subjectMode,    // 'auto' | 'math' | 'coding' | 'science' | 'general'
      stepByStep,     // boolean (legacy, still supported)
      personality,    // NEW: 'friendly' | 'strict' | 'mentor' | 'coach'
      hintMode,       // NEW: boolean — force hint-based learning
      recentActivity, // NEW: 'coding' | 'quiz' | 'ask' — context signal
    } = req.body;

    const safeHistory: ChatMessage[] = (Array.isArray(history) ? history : [])
      .slice(-10)
      .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content.slice(0, 2000) }));

    if (!prompt && !image) {
      return res.status(400).json({ success: false, answer: 'Please enter a question or upload an image.' });
    }

    const imgSizeKB = image ? Math.round(image.length * 0.75 / 1024) : 0;
    logger.info(`/api/ai/ask  image=${!!image}(${imgSizeKB}KB)  mode=${subjectMode||'auto'}  step=${!!stepByStep}  prompt="${(prompt || '').substring(0, 60)}"`);

    const userId = getUserIdFromToken(req) ?? '';
    let answer: string;
    let tutorMeta: { followUpQ?: string | null; learningMode?: string; hintMode?: boolean; detectedTopic?: string | null } = {};

    if (image) {
      // Image → vision solver (unchanged)
      let imageUrl = image;
      if (!image.startsWith('data:')) {
        const isJpeg = image.startsWith('/9j/');
        imageUrl = `data:image/${isJpeg ? 'jpeg' : 'png'};base64,${image}`;
      }
      if (imgSizeKB > 4000) logger.warn(`Large image: ${imgSizeKB}KB`);
      answer = await solveWithVision(imageUrl, prompt || '');
    } else {
      // Text → Personal AI Tutor (Stage 2 upgrade)
      if (userId) {
        try {
          const tutorResponse = await personalTutorSolve({
            userId,
            message:         prompt,
            history:         safeHistory,
            personality:     personality || undefined,
            hintOverride:    hintMode !== undefined ? !!hintMode : undefined,
            recentActivity:  recentActivity || undefined,
          });
          answer    = tutorResponse.answer;
          tutorMeta = {
            followUpQ:     tutorResponse.followUpQ,
            learningMode:  tutorResponse.learningMode,
            hintMode:      tutorResponse.hintMode,
            detectedTopic: tutorResponse.detectedTopic,
          };
        } catch {
          // Fallback: contextAwareSolve (Stage 1), then plain AI
          try {
            answer = await contextAwareSolve(userId, prompt, safeHistory, {
              subjectMode: (subjectMode as SubjectMode) || 'auto',
              stepByStep:  !!stepByStep,
            });
          } catch {
            answer = await solveText(prompt, safeHistory);
          }
        }
      } else {
        answer = await solveText(prompt, safeHistory);
      }
    }

    const userAction = await handleQuestionUsed(req, String(prompt || '').substring(0, 100));

    res.json({
      success: true,
      answer,
      // AI Tutor metadata (Stage 2)
      ...(tutorMeta.followUpQ     ? { followUpQ:     tutorMeta.followUpQ }     : {}),
      ...(tutorMeta.learningMode  ? { learningMode:  tutorMeta.learningMode }  : {}),
      ...(tutorMeta.hintMode !== undefined ? { hintMode: tutorMeta.hintMode }  : {}),
      ...(tutorMeta.detectedTopic ? { detectedTopic: tutorMeta.detectedTopic } : {}),
      // Quota info
      ...(userAction ? {
        questionsLeft:  userAction.questionsLeft,
        pointsAwarded:  userAction.pointsAwarded,
        nextRefillSecs: userAction.nextRefillSecs,
      } : {}),
    });
  } catch (error: any) {
    logger.error({ err: error.message }, '/api/ai/ask error');
    res.status(500).json({ success: false, answer: 'AI is temporarily unavailable. Please try again in a moment.' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/ask-stream — GPT-like streaming (SSE)
// Words appear one by one as the AI generates them
// ─────────────────────────────────────────────────────────────
export async function askAIStream(req: Request, res: Response) {
  const { prompt, history = [], subjectMode, personality, recentActivity } = req.body;
  const userId = getUserIdFromToken(req) ?? '';

  if (!prompt) {
    res.status(400).json({ error: 'prompt required' });
    return;
  }

  // Set SSE headers — this is what makes it "streaming"
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable Nginx buffering
  res.flushHeaders();

  const safeHistory: ChatMessage[] = (Array.isArray(history) ? history : [])
    .slice(-10)
    .filter((m: any) => m?.role && m?.content)
    .map((m: any) => ({ role: m.role as 'user' | 'assistant', content: String(m.content).slice(0, 2000) }));

  try {
    // Stream through personalTutorSolve context (Stage 1+2+3 aware)
    // For streaming we use the low-level solveTextStream with the tutor system prompt
    // This gives GPT-like word-by-word output
    if (userId) {
      // Build enriched system prompt via Stage 2 context (non-blocking)
      // We use solveTextStream directly — it includes NVIDIA's massive models
      await solveTextStream(prompt, safeHistory, subjectMode, res);
    } else {
      await solveTextStream(prompt, safeHistory, subjectMode, res);
    }

    // Fire Stage 4 progress event after stream completes (non-blocking)
    if (userId) {
      handleQuestionUsed(req, String(prompt).substring(0, 100)).catch(() => {});
    }
  } catch (err: any) {
    logger.error(`[Stream] Error: ${err.message}`);
    // Send error as SSE event
    res.write(`data: ${JSON.stringify({ error: 'Stream failed. Please try again.' })}\n\n`);
  } finally {
    res.end();
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/solve-pdf
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
        answer: '❌ Could not extract text from this PDF. It appears to be a scanned or image-based PDF.\n\n**Solution:** Take a screenshot of the PDF pages and upload as an image instead.',
      });
    }

    const MAX_CHARS = 14000;
    const text = extracted.length > MAX_CHARS
      ? extracted.substring(0, MAX_CHARS) + '\n\n[... rest truncated ...]'
      : extracted;

    const solvePrompt = userPrompt
      ? `The student says: "${userPrompt}"\n\nPDF content:\n\n${text}\n\nHelp the student as requested. Be complete.`
      : `PDF content:\n\n${text}\n\nFind ALL questions and solve each completely, step-by-step. Number answers to match questions.`;

    const answer     = await solveText(solvePrompt);
    const userAction = await handleQuestionUsed(req, userPrompt.substring(0, 100));

    res.json({
      success: true, answer,
      ...(userAction ? { questionsLeft: userAction.questionsLeft, pointsAwarded: userAction.pointsAwarded, nextRefillSecs: userAction.nextRefillSecs } : {}),
    });
  } catch (error: any) {
    logger.error({ err: error.message }, '/api/ai/solve-pdf error');
    res.status(500).json({ success: false, answer: 'Failed to process PDF. Please try again.' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/watch-ad
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

    if ((user as any).videoAdsDate !== today) {
      (user as any).videoAdsToday = 0;
      (user as any).videoAdsDate  = today;
    }

    if ((user as any).videoAdsToday >= MAX_VIDEO_ADS_DAY) {
      return res.json({ success: false, message: `Max ${MAX_VIDEO_ADS_DAY} video bonuses per day reached.`, questionsLeft: (user as any).questionsLeft });
    }

    applyHourlyRefill(user, dailyLimit);

    if ((user as any).questionsLeft >= dailyLimit) {
      return res.json({ success: false, message: 'You already have full questions!', questionsLeft: (user as any).questionsLeft });
    }

    const used: Date[] = (user as any).questionUsedAt || [];
    if (used.length > 0) {
      used.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      (user as any).questionUsedAt = used.slice(1);
    }

    (user as any).videoAdsToday = ((user as any).videoAdsToday || 0) + 1;
    applyHourlyRefill(user, dailyLimit);
    await user.save();

    logger.info(`Video ad: ${(user as any).email} | +1 question | left=${(user as any).questionsLeft}`);

    return res.json({
      success: true, message: '+1 question unlocked! Keep studying! 🎓',
      questionsLeft: (user as any).questionsLeft,
      videoAdsLeft: MAX_VIDEO_ADS_DAY - (user as any).videoAdsToday,
      nextRefillSecs: getNextRefillSecs(user),
    });
  } catch (err: any) {
    logger.error({ err: err.message }, 'watchAd error');
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/ai/quota
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
      success: true,
      questionsLeft:  (user as any).questionsLeft,
      dailyLimit,
      nextRefillSecs: getNextRefillSecs(user),
      videoAdsLeft:   MAX_VIDEO_ADS_DAY - Math.min((user as any).videoAdsToday || 0, MAX_VIDEO_ADS_DAY),
      isPremium:      premium,
    });
  } catch (err: any) {
    logger.error({ err: err.message }, 'getQuota error');
    return res.status(500).json({ success: false });
  }
}