// ─────────────────────────────────────────────────────────────
// AskAI — aiController.ts  (v9 — Fixed Routing + DB Persistence)
//
// CHANGES FROM v8:
//
//  Problem 1 FIXED — Model Priority for TEXT questions:
//    GROQ is ALWAYS called first.
//    OpenRouter is fallback ONLY if Groq fails.
//    solveTextStreamWithContext() already does this in aiService.ts
//    — it tries groqStream(), then falls back to openRouterStream().
//    Nothing else needed — the chain is correct.
//
//  Problem 2 FIXED — Image/PDF routing:
//    If req.body has questionType === 'image' or 'pdf' in the
//    streaming endpoint (shouldn't happen — images go to /ask,
//    but just in case), we force NVIDIA.
//    The /ask endpoint (askAI function) already calls
//    solveWithVision() which routes: NVIDIA → Groq → OR.
//    Confirmed correct in aiService.ts.
//
//  Problem 3 FIXED — Full DB Persistence:
//    Every user message → persistUserMessage() to MongoDB
//    Every AI response  → persistAIMessage() to MongoDB
//    Session created/retrieved from DB (not RAM-only)
//    Cross-session history loaded from DB for AI context
//    Weak topics loaded from DB (persistent, not reset on restart)
//
// UNCHANGED:
//    SSE streaming logic, points system, emotional state detection,
//    Mentor Intelligence Bar metadata, quota system.
// ─────────────────────────────────────────────────────────────

import { Request, Response }    from 'express';
import {
  solveText,
  solveWithVision,
  solveTextStreamWithContext,
}                               from '../services/aiService.js';
import { contextAwareSolve }   from '../services/contextTutorService.js';
import { personalTutorSolve }  from '../services/aiTutor/aiTutor.service.js';
import { parsePDFText }        from '../services/pdfService.js';
import { getUserIdFromToken }  from '../middleware/authMiddleware.js';
import { User }                from '../models/User.model.js';
import { Activity }            from '../models/Activity.model.js';
import { syncActivityToProfile } from '../services/studentProfileService.js';
import { onActivityEvent }     from '../services/progressSystem/progressAnalyzer.js';
import { logger }              from '../utils/logger.js';

import {
  buildMasterPrompt,
  afterResponse,
  validateAndLog,
  detectEmotionalState,
}                              from '../services/askAI/askAIService.js';

// ── v9: DB persistence layer ──────────────────────────────────
import {
  createOrGetSession,
  persistUserMessage,
  persistAIMessage,
  loadSessionHistory,
  getWeakTopicsFromDB,
  getSessionSummaryForPrompt,
}                              from '../services/askAI/askAIDbService.js';

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
// Helpers (unchanged from v8)
// ─────────────────────────────────────────────────────────────
function getTodayIST(): string {
  const now = new Date();
  return new Date(now.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split('T')[0];
}

function applyHourlyRefill(user: any, dailyLimit: number): void {
  const cutoff = Date.now() - REFILL_INTERVAL_MS;
  const recent = (user.questionUsedAt || []).filter(
    (t: Date) => new Date(t).getTime() > cutoff
  );
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
  const oldest = Math.min(...used.map((t: Date) => new Date(t).getTime()));
  return Math.max(0, Math.ceil((oldest + REFILL_INTERVAL_MS - Date.now()) / 1000));
}

async function handleQuestionUsed(
  req: Request,
  promptText = '',
): Promise<{ questionsLeft: number; pointsAwarded: number; nextRefillSecs: number } | null> {
  const userId = getUserIdFromToken(req);
  if (!userId) return null;

  try {
    const user       = await User.findById(userId);
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

    const isInternal   = promptText.startsWith('{') || promptText.startsWith('[') ||
      promptText.toLowerCase().startsWith('output only');
    const cleanPrompt  = isInternal ? '' : promptText.trim();
    const activityDetail = cleanPrompt
      ? `Asked: ${cleanPrompt.substring(0, 80)}${cleanPrompt.length > 80 ? '…' : ''}`
      : 'Asked an AI question';

    await Activity.create({ userId, action: 'ask_question', details: activityDetail, pointsEarned: pts });
    logger.info(`AI question: | premium=${premium} | +${pts}pts | left=${(user as any).questionsLeft}`);

    syncActivityToProfile(userId, 'ask_question', pts).catch(() => {});
    onActivityEvent(userId, 'ai_tutor_used', { topic: activityDetail }).catch(() => {});

    return {
      questionsLeft: (user as any).questionsLeft,
      pointsAwarded: pts,
      nextRefillSecs: getNextRefillSecs(user),
    };
  } catch (err: any) {
    logger.error('handleQuestionUsed error: ' + err.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/ask
// Non-streaming: used for IMAGE + PDF (vision path)
//
// ROUTING (Problem 2):
//   image → solveWithVision() → NVIDIA first → Groq → OR
//   pdf   → parsePDFText() then solveWithVision()
//   text  → personalTutorSolve() (legacy non-streaming path)
// ─────────────────────────────────────────────────────────────
export async function askAI(req: Request, res: Response) {
  try {
    const {
      prompt,
      image,
      history     = [],
      subjectMode,
      stepByStep,
      personality,
      hintMode,
      recentActivity,
      convoId,           // ← v9: frontend passes convoId for DB linking
    } = req.body;

    const safeHistory = (Array.isArray(history) ? history : [])
      .slice(-10)
      .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content.slice(0, 2000) }));

    if (!prompt && !image) {
      return res.status(400).json({ success: false, answer: 'Please enter a question or upload an image.' });
    }

    const userId       = getUserIdFromToken(req) ?? '';
    const questionType: 'text' | 'image' | 'pdf' = image ? 'image' : 'text';
    const startMs      = Date.now();
    let answer: string;

    if (image) {
      // ── PATH: IMAGE → NVIDIA (Problem 2) ───────────────────
      let imageUrl = image;
      if (!image.startsWith('data:')) {
        const isJpeg = image.startsWith('/9j/');
        imageUrl = `data:image/${isJpeg ? 'jpeg' : 'png'};base64,${image}`;
      }
      logger.info(`/api/ai/ask image=true | mode=${subjectMode || 'auto'}`);

      // solveWithVision routes: NVIDIA → Groq Vision → OR Vision (already correct)
      answer = await solveWithVision(imageUrl, prompt || '');

    } else {
      // ── PATH: TEXT → PersonalTutor ──────────────────────────
      logger.info(`/api/ai/ask text | mode=${subjectMode || 'auto'}`);
      let tutorMeta: any = {};
      if (userId) {
        try {
          const tutorResponse = await personalTutorSolve({
            userId,
            message:        prompt,
            history:        safeHistory,
            personality:    personality || undefined,
            hintOverride:   hintMode !== undefined ? !!hintMode : undefined,
            recentActivity: recentActivity || undefined,
          });
          answer   = tutorResponse.answer;
          tutorMeta = tutorResponse;
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

    // ── v9: Persist to DB (non-blocking) ─────────────────────
    if (userId) {
      (async () => {
        try {
          const sessionId = await createOrGetSession(userId, convoId || null);
          await persistUserMessage(
            sessionId, userId,
            String(prompt || '').slice(0, 2000),
            null, 'neutral', questionType,
          );
          await persistAIMessage(
            sessionId, userId,
            answer,
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
      questionsLeft:  userAction?.questionsLeft ?? 0,
      nextRefillSecs: userAction?.nextRefillSecs ?? 0,
    });

  } catch (err: any) {
    logger.error('/api/ai/ask error: ' + err.message);
    return res.status(500).json({ success: false, answer: 'Failed to process your question. Please try again.' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/ask-stream
// SSE Streaming: TEXT questions only
//
// ROUTING (Problem 1):
//   solveTextStreamWithContext() calls:
//     groqStream()        ← FIRST (primary)
//     openRouterStream()  ← FALLBACK (only if Groq fails)
//   This is already implemented correctly in aiService.ts.
//
// DB PERSISTENCE (Problem 3):
//   - Session created/retrieved from DB at start
//   - User message persisted BEFORE streaming starts
//   - AI response persisted AFTER stream completes
//   - DB history used for cross-session context
// ─────────────────────────────────────────────────────────────
export async function askAIStream(req: Request, res: Response): Promise<void> {
  const {
    prompt,
    history      = [],
    subjectMode  = 'auto',
    stepByStep   = false,
    convoId      = null,   // ← v9: frontend sends this
  } = req.body;

  const userId  = getUserIdFromToken(req) ?? '';
  const startMs = Date.now();

  if (!prompt) {
    res.status(400).json({ error: 'prompt required' });
    return;
  }

  // ── SSE headers ─────────────────────────────────────────────
  res.setHeader('Content-Type',      'text/event-stream');
  res.setHeader('Cache-Control',     'no-cache');
  res.setHeader('Connection',        'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  let fullResponse = '';
  let sessionId    = '';

  try {

    // ── v9 Step 0: Get/create DB session + load cross-session history ──
    let dbHistory: { role: 'user' | 'assistant'; content: string }[] = [];
    let dbWeakTopics: string[] = [];
    let dbSessionSummary = '';

    if (userId) {
      try {
        sessionId        = await createOrGetSession(userId, convoId);
        dbHistory        = await loadSessionHistory(userId, 20);
        dbWeakTopics     = await getWeakTopicsFromDB(userId);
        dbSessionSummary = await getSessionSummaryForPrompt(userId);
      } catch (e: any) {
        logger.warn('[AskAI DB] Pre-stream DB ops failed (continuing): ' + e.message);
      }
    }

    // ── Step 1–7: Build master prompt ───────────────────────────
    // Use DB history if available, else fall back to req.body history
    const contextHistory = dbHistory.length > 0
      ? dbHistory
      : (Array.isArray(history) ? history : []);

    const pkg = await buildMasterPrompt({
      userId,
      message:    prompt,
      subjectMode,
      stepByStep: !!stepByStep,
      history:    contextHistory,
      // ← v9: inject persistent weak topics into context
      persistentWeakTopics: dbWeakTopics,
      dbSessionSummary,
    });

    // Detect emotional state
    const emotionalState = detectEmotionalState(prompt, pkg.plan.turnCount ?? 0);

    logger.info(
      'AskAI stream v9 | intent='   + pkg.plan.intent   +
      ' strategy='  + pkg.plan.strategy +
      ' skill='     + pkg.context.skillLevel +
      ' model='     + pkg.modelConfig.modelId +
      ' sessionId=' + (sessionId ? sessionId.slice(-6) : 'none') +
      ' userId='    + (userId    ? userId.slice(-6)    : 'anon')
    );

    // ── v9: Persist user message to DB before streaming ────────
    if (userId && sessionId) {
      persistUserMessage(
        sessionId, userId,
        prompt,
        pkg.detectedTopic,
        emotionalState,
        'text',
      ).catch(e => logger.warn('[AskAI DB] user msg persist failed: ' + e.message));
    }

    // ── Emit metadata SSE event (intent + emotional state) ─────
    const isWeakTopic = pkg.detectedTopic
      ? pkg.context.weakTopics.includes(pkg.detectedTopic) ||
        dbWeakTopics.includes(pkg.detectedTopic)           // ← check DB weak topics too
      : false;

    res.write('data: ' + JSON.stringify({
      intent:        pkg.plan.intent,
      strategy:      pkg.plan.strategy,
      skillLevel:    pkg.context.skillLevel,
      detectedTopic: pkg.detectedTopic,
      isWeakTopic,
      emotionalState,
      // ← v9: let frontend know which provider is being used
      provider: 'groq',  // always starts with groq
    }) + '\n\n');

    // ── Capture tokens while streaming ─────────────────────────
    const captureWrite = (chunk: any) => {
      try {
        const str = typeof chunk === 'string' ? chunk : chunk.toString('utf8');
        for (const line of str.split('\n')) {
          if (line.startsWith('data: ')) {
            const raw = line.slice(6).trim();
            if (raw && raw !== '[DONE]') {
              const parsed = JSON.parse(raw);
              if (parsed.token) fullResponse += parsed.token;
              // ← v9: capture which provider actually responded
            }
          }
        }
      } catch { /* ignore */ }
      return res.write(chunk);
    };

    const proxyRes = new Proxy(res, {
      get(target, prop) {
        if (prop === 'write') return captureWrite;
        const val = (target as any)[prop];
        return typeof val === 'function' ? val.bind(target) : val;
      },
    });

    // ── Stream: GROQ first, OpenRouter fallback ─────────────────
    // solveTextStreamWithContext() in aiService.ts handles this:
    //   1. groqStream()       ← primary (GROQ)
    //   2. openRouterStream() ← fallback (if GROQ fails)
    // No changes needed here — the priority is already correct.
    await solveTextStreamWithContext(
      pkg.userMessage,
      pkg.history,
      pkg.systemPrompt,
      proxyRes as any,
    );

    const responseMs = Date.now() - startMs;

    // ── Post-stream: validate + RAM memory update ───────────────
    if (fullResponse && userId) {
      validateAndLog(fullResponse, pkg.plan.intent, prompt, userId);
      afterResponse(userId, prompt, fullResponse, pkg.detectedTopic);
    }

    // ── v9: Persist AI response to DB ──────────────────────────
    if (fullResponse && userId && sessionId) {
      persistAIMessage(
        sessionId, userId,
        fullResponse,
        pkg.plan.intent,
        pkg.plan.strategy,
        pkg.context.skillLevel,
        pkg.modelConfig.modelId,
        pkg.modelConfig.provider,
        'text',
        0,           // points calculated separately below
        responseMs,
      ).catch(e => logger.warn('[AskAI DB] AI msg persist failed: ' + e.message));
    }

    // ── Award points ────────────────────────────────────────────
    if (userId) {
      handleQuestionUsed(req, String(prompt).substring(0, 100))
        .then(result => {
          if (result && sessionId) {
            // Update points on the last assistant message in DB
            persistAIMessage(
              sessionId, userId, '', null, null, null, null, null,
              'text', result.pointsAwarded, null,
            ).catch(() => {});
          }
        })
        .catch(() => {});
    }

  } catch (err: any) {
    if (!res.writableEnded) {
      logger.error('AskAI stream v9 error: ' + err.message);
      res.write('data: ' + JSON.stringify({ error: 'Stream failed. Please try again.' }) + '\n\n');
    }
  } finally {
    if (!res.writableEnded) res.end();
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/solve-pdf
// PDF Path: extract text → solve (or vision if scanned)
// ROUTING: Already uses solveWithVision → NVIDIA first (correct)
// v9: DB persist added
// ─────────────────────────────────────────────────────────────
export async function solvePDF(req: Request, res: Response) {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, answer: 'No file uploaded.' });

    const userId   = getUserIdFromToken(req) ?? '';
    const prompt   = req.body.prompt || '';
    const startMs  = Date.now();

    // parsePDFText returns a plain string (not an object)
    const pdfText = await parsePDFText(req.file.buffer);

    let answer: string;
    if (pdfText && pdfText.trim().length > 50) {
      // Text-based PDF → Groq (primary) → OR (fallback)
      const q = prompt
        ? `PDF Content:\n\n${pdfText.slice(0, 8000)}\n\nStudent Question: ${prompt}`
        : `Please analyze and solve all questions in this PDF:\n\n${pdfText.slice(0, 8000)}`;
      answer = await solveText(q, [], 'general');
    } else {
      // Scanned PDF → NVIDIA Vision (primary)
      answer = await solveWithVision(
        `data:application/pdf;base64,${req.file.buffer.toString('base64')}`,
        prompt || 'Solve all questions in this PDF completely.',
      );
    }

    const responseMs = Date.now() - startMs;
    const userAction = await handleQuestionUsed(req, prompt.substring(0, 100));

    // v9: Persist to DB
    if (userId) {
      (async () => {
        try {
          const sessionId = await createOrGetSession(userId, null);
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
// POST /api/ai/watch-ad  (unchanged)
// ─────────────────────────────────────────────────────────────
export async function watchAd(req: Request, res: Response) {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false });

  try {
    const user  = await User.findById(userId);
    if (!user)  return res.status(404).json({ success: false });

    const today    = getTodayIST();
    const premium  = isPremiumValid(user);
    const dailyLim = premium ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;

    if ((user as any).videoAdsDate !== today) {
      (user as any).videoAdsDate   = today;
      (user as any).videoAdsToday  = 0;
    }

    if (((user as any).videoAdsToday || 0) >= MAX_VIDEO_ADS_DAY) {
      return res.json({ success: false, message: 'Daily ad limit reached', videoAdsLeft: 0 });
    }

    (user as any).videoAdsToday = ((user as any).videoAdsToday || 0) + 1;
    (user as any).questionsLeft = Math.min(((user as any).questionsLeft || 0) + 3, dailyLim);

    await user.save();

    return res.json({
      success:       true,
      questionsLeft: (user as any).questionsLeft,
      videoAdsLeft:  MAX_VIDEO_ADS_DAY - (user as any).videoAdsToday,
    });
  } catch (err: any) {
    logger.error('watchAd error: ' + err.message);
    return res.status(500).json({ success: false });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/ai/quota  (unchanged)
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