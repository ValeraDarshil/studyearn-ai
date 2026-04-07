// ─────────────────────────────────────────────────────────────
// AskAI — aiController.ts  (v11 — AI-OS Full Integration)
//
// ROUTES HANDLED:
//   POST /api/ai/ask           → askAI()         (image / text non-stream)
//   POST /api/ai/ask-stream    → askAIStream()   (SSE streaming — main chat)
//   POST /api/ai/solve-pdf     → solvePDF()      (PDF upload & solve)
//   POST /api/ai/watch-ad      → watchAd()       (ad → quota refill)
//   GET  /api/ai/quota         → getQuota()      (remaining questions)
//   POST /api/ai/reset-session → resetSession()  (chat switch RAM clear)
//
// WHAT'S NEW IN v11:
//   1. askAIOrchestrator wired — post-response enrichment pipeline:
//        learningRecommendationEngine → next-topic suggestions (every 3rd turn)
//        progressAnalyzer            → real-time mastery score update
//        hintGenerator               → socratic nudge when strategy=HINT
//        emotional nudge             → rotating encouragement for struggling students
//   2. detectTopicExpanded — 80+ topics (was 18), full Indian curriculum
//   3. Bug fixed: validateAskAI now applied to /ask-stream route (aiRoutes.ts)
//   4. Bug fixed: turnCount passed correctly to buildResponsePlan (askAIService.ts)
//   5. Enrichment emitted as final SSE chunk { enrichment: {...} }
//      Frontend reads this to show recommendation cards / nudges
// ─────────────────────────────────────────────────────────────

import { Request, Response }     from 'express';
import {
  solveText,
  solveWithVision,
  solveTextStreamWithContext,
}                                from '../services/aiService.js';
import { contextAwareSolve }    from '../services/contextTutorService.js';
import { personalTutorSolve }   from '../services/aiTutor/aiTutor.service.js';
import { parsePDFText }         from '../services/pdfService.js';
import { getUserIdFromToken }   from '../middleware/authMiddleware.js';
import { User }                 from '../models/User.model.js';
import { Activity }             from '../models/Activity.model.js';
import { syncActivityToProfile } from '../services/studentProfileService.js';
import { onActivityEvent }      from '../services/progressSystem/progressAnalyzer.js';
import { logger }               from '../utils/logger.js';

import {
  buildMasterPrompt,
  validateAndLog,
  detectEmotionalState,
}                               from '../services/askAI/askAIService.js';

// v11: AI-OS Orchestrator — post-response enrichment + expanded topic detection
import {
  runPostResponsePipeline,
  detectTopicExpanded,
}                               from '../services/askAI/askAIOrchestrator.js';

// v9: DB persistence layer
import {
  getOrCreateAskAISession,
  persistUserMessage,
  persistAIMessage,
  getWeakTopicsFromDB,
  getSessionSummaryForPrompt,
}                               from '../services/askAI/askAIDbService.js';

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const BASE_AI_POINTS      = 10;
const PREMIUM_MULTIPLIER  = 2;
const FREE_DAILY_LIMIT    = 15;
const PREMIUM_DAILY_LIMIT = 30;
const REFILL_INTERVAL_MS  = 60 * 60 * 1000;
const MAX_VIDEO_ADS_DAY   = 5;

// ─────────────────────────────────────────────────────────────
// Private Helpers
// ─────────────────────────────────────────────────────────────
function getTodayIST(): string {
  const now = new Date();
  return new Date(now.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split('T')[0];
}

function applyHourlyRefill(user: any, dailyLimit: number): void {
  const cutoff = Date.now() - REFILL_INTERVAL_MS;
  const recent = (user.questionUsedAt || []).filter(
    (t: Date) => new Date(t).getTime() > cutoff,
  );
  user.questionUsedAt = recent;
  user.questionsLeft  = Math.max(0, Math.min(dailyLimit, dailyLimit - recent.length));
}

function isPremiumValid(user: any): boolean {
  if (!user?.isPremium || !user?.premiumExpiresAt) return false;
  if (new Date(user.premiumExpiresAt) < new Date()) {
    user.isPremium        = false;
    user.premiumExpiresAt = null;
    return false;
  }
  return true;
}

function getNextRefillSecs(user: any): number {
  const used: Date[] = user.questionUsedAt || [];
  if (used.length === 0) return 0;
  const oldest = Math.min(...used.map((t: Date) => new Date(t).getTime()));
  return Math.max(0, Math.ceil((oldest + REFILL_INTERVAL_MS - Date.now()) / 1000));
}

async function handleQuestionUsed(
  req:        Request,
  promptText = '',
): Promise<{ questionsLeft: number; pointsAwarded: number; nextRefillSecs: number } | null> {
  const userId = getUserIdFromToken(req);
  if (!userId) return null;

  try {
    const user = await User.findById(userId);
    if (!user)  return null;

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

    const pts                         = premium ? BASE_AI_POINTS * PREMIUM_MULTIPLIER : BASE_AI_POINTS;
    user.points                      += pts;
    (user as any).totalXP             = ((user as any).totalXP || 0) + pts;
    (user as any).totalQuestionsAsked = ((user as any).totalQuestionsAsked || 0) + 1;
    await user.save();

    const isInternal     = promptText.startsWith('{') || promptText.startsWith('[') ||
      promptText.toLowerCase().startsWith('output only');
    const cleanPrompt    = isInternal ? '' : promptText.trim();
    const activityDetail = cleanPrompt
      ? `Asked: ${cleanPrompt.substring(0, 80)}${cleanPrompt.length > 80 ? '…' : ''}`
      : 'Asked an AI question';

    await Activity.create({ userId, action: 'ask_question', details: activityDetail, pointsEarned: pts });
    logger.info(`AI question | premium=${premium} | +${pts}pts | left=${(user as any).questionsLeft}`);

    syncActivityToProfile(userId, 'ask_question', pts).catch(() => {});
    onActivityEvent(userId, 'ai_tutor_used', { topic: activityDetail }).catch(() => {});

    return {
      questionsLeft:  (user as any).questionsLeft,
      pointsAwarded:  pts,
      nextRefillSecs: getNextRefillSecs(user),
    };
  } catch (err: any) {
    logger.error('handleQuestionUsed error: ' + err.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/ask
// Non-streaming: IMAGE (vision) + legacy text path
// ─────────────────────────────────────────────────────────────
export async function askAI(req: Request, res: Response) {
  try {
    const {
      prompt,
      image,
      history      = [],
      subjectMode,
      stepByStep,
      personality,
      hintMode,
      recentActivity,
      convoId,
    } = req.body;

    const safeHistory = (Array.isArray(history) ? history : [])
      .slice(-10)
      .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content.slice(0, 2000) }));

    if (!prompt && !image) {
      return res.status(400).json({ success: false, answer: 'Please enter a question or upload an image.' });
    }

    const userId                                   = getUserIdFromToken(req) ?? '';
    const questionType: 'text' | 'image' | 'pdf'  = image ? 'image' : 'text';
    const startMs                                  = Date.now();
    let answer: string;

    if (image) {
      // IMAGE → NVIDIA vision (primary) → Groq Vision → OR Vision
      let imageUrl = image;
      if (!image.startsWith('data:')) {
        const isJpeg = image.startsWith('/9j/');
        imageUrl     = `data:image/${isJpeg ? 'jpeg' : 'png'};base64,${image}`;
      }
      logger.info(`/api/ai/ask image=true | mode=${subjectMode || 'auto'}`);
      answer = await solveWithVision(imageUrl, prompt || '');
    } else {
      // TEXT → personalTutorSolve → contextAwareSolve → solveText (fallback chain)
      logger.info(`/api/ai/ask text | mode=${subjectMode || 'auto'}`);
      if (userId) {
        try {
          const tutorResponse = await personalTutorSolve({
            userId,
            message:        prompt,
            history:        safeHistory,
            personality:    personality  || undefined,
            hintOverride:   hintMode !== undefined ? !!hintMode : undefined,
            recentActivity: recentActivity || undefined,
          });
          answer = tutorResponse.answer;
        } catch {
          try {
            answer = await contextAwareSolve(userId, prompt, safeHistory, {
              subjectMode: subjectMode || 'auto',
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

    const responseMs = Date.now() - startMs;
    const userAction = await handleQuestionUsed(req, String(prompt || '').substring(0, 100));
    const pts        = userAction?.pointsAwarded ?? (isPremiumValid(await User.findById(userId).lean()) ? 20 : 10);

    // Persist to DB (non-blocking)
    if (userId) {
      (async () => {
        try {
          const sessionId = await getOrCreateAskAISession(userId, convoId || null);
          await persistUserMessage(
            sessionId, userId,
            String(prompt || '').slice(0, 2000),
            null, 'neutral', questionType,
          );
          await persistAIMessage(
            sessionId, userId, answer,
            null, null, null,
            image ? 'nvidia-vision' : null,
            image ? 'nvidia'        : null,
            questionType, pts, responseMs,
          );
        } catch (e: any) {
          logger.warn('[AskAI DB] Non-streaming persist failed: ' + e.message);
        }
      })();
    }

    return res.json({
      success:        true,
      answer,
      pointsAwarded:  pts,
      questionsLeft:  userAction?.questionsLeft  ?? 0,
      nextRefillSecs: userAction?.nextRefillSecs ?? 0,
    });

  } catch (err: any) {
    logger.error('/api/ai/ask error: ' + err.message);
    return res.status(500).json({ success: false, answer: 'Failed to process your question. Please try again.' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/ask-stream
// SSE Streaming — main AskAI chat endpoint
//
// SSE chunk types (in order):
//   1. metadata  { intent, strategy, skillLevel, detectedTopic,
//                  subject, isWeakTopic, emotionalState, provider }
//   2. tokens    { token: "..." }   (one per LLM token)
//   3. done      { done: true }
//   4. enrichment { enrichment: { recommendation, progressInsight,
//                                 hintMode, hintText, emotionalNudge } }
// ─────────────────────────────────────────────────────────────
export async function askAIStream(req: Request, res: Response): Promise<void> {
  const {
    prompt,
    history     = [],
    subjectMode = 'auto',
    stepByStep  = false,
    convoId     = null,
  } = req.body;

  const userId  = getUserIdFromToken(req) ?? '';
  const startMs = Date.now();

  if (!prompt) {
    res.status(400).json({ error: 'prompt required' });
    return;
  }

  res.setHeader('Content-Type',      'text/event-stream');
  res.setHeader('Cache-Control',     'no-cache');
  res.setHeader('Connection',        'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  let fullResponse = '';
  let sessionId    = '';

  try {
    // DB setup: session + weak topics (non-blocking on failure)
    let dbWeakTopics:    string[] = [];
    let dbSessionSummary          = '';

    if (userId) {
      try {
        sessionId        = await getOrCreateAskAISession(userId, convoId);
        dbWeakTopics     = await getWeakTopicsFromDB(userId);
        dbSessionSummary = await getSessionSummaryForPrompt(userId);
      } catch (e: any) {
        logger.warn('[AskAI DB] Pre-stream setup failed (continuing): ' + e.message);
      }
    }

    // Frontend history = source of truth for current chat (v10 fix)
    const contextHistory = (Array.isArray(history) ? history : [])
      .filter((m: any) => m.role && m.content && typeof m.content === 'string')
      .slice(-20);

    // Build master prompt via full AI-OS pipeline
    const pkg = await buildMasterPrompt({
      userId,
      message:              prompt,
      subjectMode,
      stepByStep:           !!stepByStep,
      history:              contextHistory,
      persistentWeakTopics: dbWeakTopics,
      dbSessionSummary,
    });

    const emotionalState = detectEmotionalState(prompt, pkg.plan.turnCount ?? 0);

    // v11: expanded topic detection — 80+ topics, Indian curriculum
    const expandedTopic = detectTopicExpanded(prompt, subjectMode);
    const finalTopic    = expandedTopic.topic ?? pkg.detectedTopic;
    const finalSubject  = expandedTopic.subject;

    logger.info(
      'AskAI v11 | intent='  + pkg.plan.intent +
      ' skill='   + pkg.context.skillLevel +
      ' model='   + pkg.modelConfig.modelId +
      ' topic='   + (finalTopic   ?? 'none') +
      ' subject=' + (finalSubject ?? 'none') +
      ' emotion=' + emotionalState +
      ' convoId=' + (convoId ? String(convoId).slice(-6) : 'new') +
      ' turns='   + contextHistory.length,
    );

    // Persist user message (fire-and-forget)
    if (userId && sessionId) {
      persistUserMessage(
        sessionId, userId, prompt,
        finalTopic, emotionalState, 'text',
      ).catch(() => {});
    }

    // SSE chunk 1: metadata (Mentor Intelligence Bar reads this)
    const isWeakTopic = finalTopic
      ? pkg.context.weakTopics.includes(finalTopic) || dbWeakTopics.includes(finalTopic)
      : false;

    res.write('data: ' + JSON.stringify({
      intent:        pkg.plan.intent,
      strategy:      pkg.plan.strategy,
      skillLevel:    pkg.context.skillLevel,
      detectedTopic: finalTopic,
      subject:       finalSubject,
      isWeakTopic,
      emotionalState,
      provider:      'groq',
    }) + '\n\n');

    // SSE token capture proxy — builds fullResponse while streaming
    const captureWrite = (chunk: any) => {
      try {
        const str = typeof chunk === 'string' ? chunk : chunk.toString('utf8');
        for (const line of str.split('\n')) {
          if (line.startsWith('data: ')) {
            const raw = line.slice(6).trim();
            if (raw && raw !== '[DONE]') {
              const parsed = JSON.parse(raw);
              if (parsed.token) fullResponse += parsed.token;
            }
          }
        }
      } catch { /* ignore parse errors */ }
      return res.write(chunk);
    };

    const proxyRes = new Proxy(res, {
      get(target, prop) {
        if (prop === 'write') return captureWrite;
        const val = (target as any)[prop];
        return typeof val === 'function' ? val.bind(target) : val;
      },
    });

    // Stream: GROQ (primary) → OpenRouter (fallback) — handled inside aiService.ts
    await solveTextStreamWithContext(
      pkg.userMessage, pkg.history, pkg.systemPrompt, proxyRes as any,
    );

    const responseMs = Date.now() - startMs;

    // Validate + persist AI message (fire-and-forget)
    if (fullResponse && userId) {
      validateAndLog(fullResponse, pkg.plan.intent, prompt, userId);
    }

    if (fullResponse && userId && sessionId) {
      persistAIMessage(
        sessionId, userId, fullResponse,
        pkg.plan.intent, pkg.plan.strategy, pkg.context.skillLevel,
        pkg.modelConfig.modelId, pkg.modelConfig.provider,
        'text', 0, responseMs,
      ).catch(() => {});
    }

    // Deduct quota + award points (fire-and-forget)
    if (userId) {
      handleQuestionUsed(req, String(prompt).substring(0, 100)).catch(() => {});
    }

    // ── v11: AI-OS Enrichment Pipeline ────────────────────────
    // Runs AFTER stream ends — student already has their response
    // Connects: learningSystem + progressSystem + hintGenerator + emotional nudge
    // Emits final SSE chunk with enrichment data for the frontend to display
    if (userId && fullResponse) {
      runPostResponsePipeline({
        userId,
        prompt,
        aiResponse:    fullResponse,
        emotionalState,
        detectedTopic: finalTopic,
        intent:        pkg.plan.intent,
        strategy:      pkg.plan.strategy,
        turnCount:     pkg.plan.turnCount ?? 0,
        subjectMode,
      }).then(enrichment => {
        if (res.writableEnded) return;
        const hasData =
          enrichment.recommendation  ||
          enrichment.progressInsight  ||
          enrichment.hintMode         ||
          enrichment.emotionalNudge;
        if (hasData) {
          res.write('data: ' + JSON.stringify({ enrichment }) + '\n\n');
        }
      }).catch(() => { /* enrichment failure never blocks the stream */ });
    }

  } catch (err: any) {
    if (!res.writableEnded) {
      logger.error('AskAI v11 stream error: ' + err.message);
      res.write('data: ' + JSON.stringify({ error: 'Stream failed. Please try again.' }) + '\n\n');
    }
  } finally {
    if (!res.writableEnded) res.end();
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/solve-pdf
// PDF upload → AI solve
// Text PDF → Groq, Scanned PDF → NVIDIA Vision
// ─────────────────────────────────────────────────────────────
export async function solvePDF(req: Request, res: Response) {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, answer: 'No file uploaded.' });

    const userId  = getUserIdFromToken(req) ?? '';
    const prompt  = req.body.prompt || '';
    const startMs = Date.now();

    const pdfText = await parsePDFText(req.file.buffer);
    let answer: string;

    if (pdfText && pdfText.trim().length > 50) {
      const q = prompt
        ? `PDF Content:\n\n${pdfText.slice(0, 8000)}\n\nStudent Question: ${prompt}`
        : `Please analyze and solve all questions in this PDF:\n\n${pdfText.slice(0, 8000)}`;
      answer = await solveText(q, [], 'general');
    } else {
      answer = await solveWithVision(
        `data:application/pdf;base64,${req.file.buffer.toString('base64')}`,
        prompt || 'Solve all questions in this PDF completely.',
      );
    }

    const responseMs = Date.now() - startMs;
    const userAction = await handleQuestionUsed(req, prompt.substring(0, 100));

    if (userId) {
      (async () => {
        try {
          const sessionId = await getOrCreateAskAISession(userId, null);
          await persistUserMessage(
            sessionId, userId,
            prompt || `[PDF: ${req.file!.originalname}]`,
            null, 'neutral', 'pdf',
          );
          await persistAIMessage(
            sessionId, userId, answer,
            'SOLVE', 'FULL_SOLUTION', null,
            'nvidia-vision', 'nvidia', 'pdf',
            userAction?.pointsAwarded ?? 0, responseMs,
          );
        } catch (e: any) {
          logger.warn('[AskAI DB] PDF persist failed: ' + e.message);
        }
      })();
    }

    return res.json({
      success:        true,
      answer,
      pointsAwarded:  userAction?.pointsAwarded  ?? 0,
      questionsLeft:  userAction?.questionsLeft   ?? 0,
      nextRefillSecs: userAction?.nextRefillSecs  ?? 0,
    });

  } catch (err: any) {
    logger.error('/api/ai/solve-pdf error: ' + err.message);
    return res.status(500).json({ success: false, answer: 'Failed to process PDF. Please try again.' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/watch-ad
// Watch video ad → +3 questions to quota
// ─────────────────────────────────────────────────────────────
export async function watchAd(req: Request, res: Response) {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false });

  try {
    const user = await User.findById(userId);
    if (!user)  return res.status(404).json({ success: false });

    const today    = getTodayIST();
    const premium  = isPremiumValid(user);
    const dailyLim = premium ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;

    if ((user as any).videoAdsDate !== today) {
      (user as any).videoAdsDate  = today;
      (user as any).videoAdsToday = 0;
    }

    if (((user as any).videoAdsToday || 0) >= MAX_VIDEO_ADS_DAY) {
      return res.json({ success: false, message: 'Daily ad limit reached', videoAdsLeft: 0 });
    }

    (user as any).videoAdsToday = ((user as any).videoAdsToday || 0) + 1;
    (user as any).questionsLeft = Math.min(((user as any).questionsLeft || 0) + 3, dailyLim);

    await user.save();

    return res.json({
      success:      true,
      questionsLeft: (user as any).questionsLeft,
      videoAdsLeft:  MAX_VIDEO_ADS_DAY - (user as any).videoAdsToday,
    });
  } catch (err: any) {
    logger.error('watchAd error: ' + err.message);
    return res.status(500).json({ success: false });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/ai/quota
// Returns remaining question quota for current user
// ─────────────────────────────────────────────────────────────
export async function getQuota(req: Request, res: Response) {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false });

  try {
    const user = await User.findById(userId);
    if (!user)  return res.status(404).json({ success: false });

    const premium    = isPremiumValid(user);
    const today      = getTodayIST();
    const dailyLimit = premium ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;

    if ((user as any).questionsDate !== today) {
      (user as any).questionsDate  = today;
      (user as any).questionUsedAt = [];
    }
    applyHourlyRefill(user, dailyLimit);
    await user.save();

    return res.json({
      success:        true,
      questionsLeft:  (user as any).questionsLeft,
      dailyLimit,
      isPremium:      premium,
      nextRefillSecs: getNextRefillSecs(user),
      videoAdsLeft:   Math.max(0, MAX_VIDEO_ADS_DAY - ((user as any).videoAdsToday || 0)),
    });
  } catch (err: any) {
    logger.error('getQuota error: ' + err.message);
    return res.status(500).json({ success: false });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/reset-session
// Called by frontend when user switches chat in sidebar.
// Clears in-process RAM memory for this user so old context
// doesn't bleed into the next chat's first question.
// ─────────────────────────────────────────────────────────────
export async function resetSession(req: Request, res: Response) {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false });

  try {
    const { clearSession } = await import('../services/askAI/conversationMemoryEngine.js');
    clearSession(userId);
    logger.info(`[AskAI] Session RAM cleared | userId=${userId.slice(-6)} | convoId=${req.body.convoId || 'none'}`);
    return res.json({ success: true });
  } catch (err: any) {
    logger.error('resetSession error: ' + err.message);
    return res.status(500).json({ success: false });
  }
}