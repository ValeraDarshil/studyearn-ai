// ─────────────────────────────────────────────────────────────
// AskAI — aiController.ts  (v16 — FIX 1/2/3 + image cross-turn learning)
//
// ROUTES HANDLED:
//   POST /api/ai/ask           → askAI()         (image / text non-stream)
//   POST /api/ai/ask-stream    → askAIStream()   (SSE streaming — main chat)
//   POST /api/ai/solve-pdf     → solvePDF()      (PDF upload & solve)
//   POST /api/ai/watch-ad      → watchAd()       (ad → quota refill)
//   GET  /api/ai/quota         → getQuota()      (remaining questions)
//   POST /api/ai/reset-session → resetSession()  (chat switch RAM clear)
//
// ─── WHAT CHANGED IN v15 ─────────────────────────────────────
//
// FIX 1 (CRITICAL — audit Issue #1):
//   TEXT path in POST /api/ai/ask previously called personalTutorSolve()
//   which bypassed aiBrainCore entirely. It is now replaced with the SAME
//   pipeline as the streaming path:
//     buildMasterPrompt() → solveText() → afterResponseWithBrain()
//   FinalDecision is always built. feedbackLoop, strategy scoring, and
//   memory updates now fire for ALL non-streaming text requests.
//
// FIX 2 (CRITICAL — audit Issue #2):
//   strategyScoringEngine.ts and feedbackLoopEngine.ts both had
//   { upsert: false } in their findOneAndUpdate calls, causing silent
//   failures for new users. Changed to { upsert: true } with default
//   document structure so new users immediately start building a profile.
//   (See strategyScoringEngine.ts and feedbackLoopEngine.ts)
//
// FIX 3 (STABILITY — audit Issue #3):
//   prevTurnStore (in-memory Map) is still used as primary fast-path cache,
//   but DB persistence was already added in Fix B. This release adds an
//   explicit $set write with upsert:true after every streaming turn so the
//   DB record is always authoritative even on first turn of a new session.
//
// FIX 4 (v16 — image cross-turn learning):
//   Image path had prevAiResponse hardcoded null. Brain Core had no prior
//   context for image sessions — strategy scoring never fired between turns.
//   Fixed: prevTurn loaded from RAM store + DB cold-start fallback (same
//   as text path). Turn saved to prevTurnStore + DB after each response.
//
// All other fixes (FIX A/B, image/PDF Brain Core, model routing) are
// carried forward unchanged from v14.
// ─────────────────────────────────────────────────────────────

import { Request, Response }     from 'express';
import {
  solveText,
  solveWithVision,
  solveTextStreamWithContext,
}                                from '../services/aiService.js';
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
  afterResponseWithBrain,
}                               from '../services/askAI/askAIService.js';

// v11: AI-OS Orchestrator — post-response enrichment + expanded topic detection
import {
  runPostResponsePipeline,
  detectTopicExpanded,
}                               from '../services/askAI/askAIOrchestrator.js';

// v12: Visual Brain — analyzes response and returns visual rendering instructions
import { analyzeWithVisualBrain } from '../services/askAI/visualBrain.js';

// v13: Gap #7 — model performance tracking
import {
  recordModelSuccess,
  recordModelFailure,
  recordQualityPenalty,
} from '../services/askAI/aiModelRouter.js';

// v13: Gap #8 — quality label for logging
import { getQualityLabel } from '../services/askAI/responseValidator.js';

// v9: DB persistence layer
import {
  getOrCreateAskAISession,
  persistUserMessage,
  persistAIMessage,
  getWeakTopicsFromDB,
  getSessionSummaryForPrompt,
}                               from '../services/askAI/askAIDbService.js';

// Brain Core for image/PDF/text paths
import { aiBrainCore }          from '../services/adaptive/aiBrainCore.js';
import type { TeachingStrategy } from '../services/adaptive/strategyScoringEngine.js';

// Fix A: masteryLevel from DB
import { StudentProfile }       from '../models/StudentProfile.model.js';

// Fix B: prevTurn DB persistence
import { AskAISession }         from '../models/AskAISession.model.js';

// ─────────────────────────────────────────────────────────────
// FIX 2: prevTurnStore — in-memory store for previous turn data.
// Used to score the PREVIOUS strategy using the CURRENT message as
// a reaction signal, and to pass prevAiResponse into the pipeline
// so feedbackLoopEngine.processOutcome() fires from turn 2 onward.
// key = userId + ':' + (convoId || 'default')
// ─────────────────────────────────────────────────────────────
interface PrevTurnData {
  aiResponse:    string;
  strategy:      string;
  topic:         string | null;
  subject:       string;
  sessionId:     string;
  finalDecision: any;
  turnCount:     number;
}
const prevTurnStore = new Map<string, PrevTurnData>();

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
  // Compute what questionsLeft should be from usage history
  const computedLeft = Math.max(0, Math.min(dailyLimit, dailyLimit - recent.length));
  // Only override if computed is HIGHER (natural refill) or current is undefined
  // This preserves bonus questions granted by watchAd
  const current = user.questionsLeft ?? 0;
  user.questionsLeft = Math.max(current, computedLeft);
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
// Non-streaming: IMAGE (vision) + TEXT path
//
// FIX 1 (v15): TEXT path now goes through Brain Core via
// buildMasterPrompt() → solveText() → afterResponseWithBrain()
// exactly like the streaming path. personalTutorSolve() is removed.
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
    let sessionId = '';

    if (image) {
      // ── IMAGE PATH — Brain Core first → solveWithVision with context ──
      let imageUrl = image;
      if (!image.startsWith('data:')) {
        const isJpeg = image.startsWith('/9j/');
        imageUrl     = `data:image/${isJpeg ? 'jpeg' : 'png'};base64,${image}`;
      }
      logger.info(`/api/ai/ask image=true | mode=${subjectMode || 'auto'}`);

      // Fix A: Read masteryLevel from StudentProfile DB before Brain Core call
      let resolvedMastery = 50;
      if (userId) {
        try {
          const profileSnap = await StudentProfile
            .findOne({ userId })
            .select('overallMasteryScore')
            .lean();
          if (profileSnap?.overallMasteryScore != null) {
            resolvedMastery = profileSnap.overallMasteryScore;
          }
        } catch {
          // non-fatal — keep default 50
        }
      }

      // Step 1: Brain Core decides strategy/tone/difficulty for this image query
      //
      // FIX #3 (v16): Load prevTurn from RAM store — same pattern as text/stream paths.
      // Previously prevAiResponse was hardcoded null so Brain Core had no prior context,
      // strategy scoring never fired between image turns, and adaptive learning was broken.
      const imgPrevTurnKey = userId ? `${userId}:${convoId || 'default'}` : '';
      let imgPrevTurn = imgPrevTurnKey ? prevTurnStore.get(imgPrevTurnKey) : undefined;

      // Cold-start DB fallback — recovers prevTurn after server restart
      if (!imgPrevTurn && userId) {
        try {
          if (!sessionId) {
            sessionId = await getOrCreateAskAISession(userId, convoId || null).catch(() => '');
          }
          const savedSession = await AskAISession
            .findOne({ userId })
            .sort({ lastMessageAt: -1 })
            .select('lastAiResponse lastStrategy lastTopic lastSubject turnCount')
            .lean();
          if (savedSession?.lastAiResponse && (savedSession.turnCount ?? 0) > 0) {
            imgPrevTurn = {
              aiResponse:    savedSession.lastAiResponse,
              strategy:      (savedSession as any).lastStrategy ?? 'TEACH',
              topic:         (savedSession as any).lastTopic    ?? null,
              subject:       (savedSession as any).lastSubject  ?? subjectMode ?? 'auto',
              sessionId:     String(savedSession._id),
              finalDecision: null,
              turnCount:     savedSession.turnCount ?? 1,
            };
            if (imgPrevTurnKey) prevTurnStore.set(imgPrevTurnKey, imgPrevTurn);
          }
        } catch {
          // non-fatal
        }
      }

      // Score PREVIOUS strategy using current image prompt as reaction signal
      if (imgPrevTurn && userId) {
        const imgReaction = detectEmotionalState(prompt || '', imgPrevTurn.turnCount);
        afterResponseWithBrain(
          userId,
          imgPrevTurn.sessionId,
          prompt || '',
          imgPrevTurn.aiResponse,
          imgPrevTurn.topic,
          imgPrevTurn.subject,
          imgPrevTurn.turnCount,
          0,
          imgPrevTurn.finalDecision,
          imgReaction === 'correct'
            ? { success: true,  correctness: 1.0 }
            : imgReaction === 'confused' || imgReaction === 'frustrated'
            ? { success: false, correctness: 0.0 }
            : undefined,
        ).catch(() => {});
      }

      let brainDecision: any = null;
      try {
        if (!sessionId && userId) {
          sessionId = await getOrCreateAskAISession(userId, convoId || null).catch(() => '');
        }
        brainDecision = await aiBrainCore.processRequest({
          userId:          userId || 'anonymous',
          sessionId:       sessionId || 'image-session',
          userMessage:     prompt || 'Solve this image question.',
          prevAiResponse:  imgPrevTurn?.aiResponse ?? null,   // FIX #3: was always null
          prevStrategy:    (imgPrevTurn?.strategy as TeachingStrategy) ?? null,   // FIX #3: was always null
          topic:           null,
          subject:         subjectMode || 'auto',
          turnCount:       safeHistory.length,
          retryCount:      0,
          masteryLevel:    resolvedMastery,
          currentState:    'LEARNING',
        });
      } catch (err: any) {
        logger.warn('[AskAI] Image Brain Core failed (continuing): ' + err.message);
      }

      // Step 2: Build system prompt addition from Brain Core decision
      const brainContextNote = brainDecision?.systemPromptAddition
        ? `\n\n=== AI BRAIN CORE DIRECTIVES ===\n${brainDecision.systemPromptAddition}\n=== END DIRECTIVES ===`
        : '';

      // Step 3: Solve with vision — pass Brain Core context as part of the prompt
      const enhancedPrompt = (prompt || '') + brainContextNote;
      answer = await solveWithVision(imageUrl, enhancedPrompt);

      // Step 4: afterResponseWithBrain — fires feedback loop for THIS image turn
      if (userId && brainDecision) {
        afterResponseWithBrain(
          userId,
          sessionId,
          prompt || '',
          answer,
          null,
          subjectMode || 'auto',
          safeHistory.length,
          0,
          brainDecision,
          undefined,
        ).catch(() => {});
      }

      // FIX #3: Save this image turn to prevTurnStore + DB
      // so the NEXT turn (image or text) can score this strategy correctly.
      if (userId && answer && imgPrevTurnKey) {
        const imgNewPrevTurn: PrevTurnData = {
          aiResponse:    answer,
          strategy:      brainDecision?.strategy ?? 'TEACH',
          topic:         null,
          subject:       subjectMode || 'auto',
          sessionId,
          finalDecision: brainDecision,
          turnCount:     safeHistory.length,
        };
        prevTurnStore.set(imgPrevTurnKey, imgNewPrevTurn);

        if (sessionId && brainDecision?.strategy) {
          AskAISession.findByIdAndUpdate(
            sessionId,
            {
              $set: {
                lastAiResponse: answer.slice(0, 3000),
                lastStrategy:   brainDecision.strategy,
                lastTopic:      null,
                lastSubject:    subjectMode ?? null,
              },
            },
            { upsert: true },
          ).catch(() => {});
        }
      }

    } else {
      // ── FIX 1 (v15): TEXT PATH — Brain Core via buildMasterPrompt ──
      // Previously called personalTutorSolve() which bypassed Brain Core entirely.
      // Now uses the exact same pipeline as askAIStream() so FinalDecision,
      // strategy scoring, feedback loop, and memory all fire on this path.
      logger.info(`/api/ai/ask text (Brain Core) | mode=${subjectMode || 'auto'}`);

      if (userId) {
        try {
          sessionId = await getOrCreateAskAISession(userId, convoId || null);
        } catch {
          // non-fatal
        }
      }

      // Load prevTurn from RAM (fast path) or DB (cold-start recovery)
      const prevTurnKey = userId ? `${userId}:${convoId || 'default'}` : '';
      let prevTurn = prevTurnKey ? prevTurnStore.get(prevTurnKey) : undefined;

      if (!prevTurn && userId && sessionId) {
        try {
          const savedSession = await AskAISession
            .findOne({ userId })
            .sort({ lastMessageAt: -1 })
            .select('lastAiResponse lastStrategy lastTopic lastSubject turnCount')
            .lean();
          if (savedSession?.lastAiResponse && (savedSession.turnCount ?? 0) > 0) {
            prevTurn = {
              aiResponse:    savedSession.lastAiResponse,
              strategy:      (savedSession as any).lastStrategy   ?? 'TEACH',
              topic:         (savedSession as any).lastTopic      ?? null,
              subject:       (savedSession as any).lastSubject    ?? subjectMode ?? 'auto',
              sessionId:     String(savedSession._id),
              finalDecision: null,
              turnCount:     savedSession.turnCount ?? 1,
            };
            if (prevTurnKey) prevTurnStore.set(prevTurnKey, prevTurn);
          }
        } catch {
          // non-fatal
        }
      }

      // Score the PREVIOUS strategy using the current prompt as the reaction signal
      if (prevTurn && userId) {
        const reactionSignal = detectEmotionalState(prompt, prevTurn.turnCount);
        afterResponseWithBrain(
          userId,
          prevTurn.sessionId,
          prompt,
          prevTurn.aiResponse,
          prevTurn.topic,
          prevTurn.subject,
          prevTurn.turnCount,
          0,
          prevTurn.finalDecision,
          reactionSignal === 'correct'
            ? { success: true,  correctness: 1.0 }
            : reactionSignal === 'confused' || reactionSignal === 'frustrated'
            ? { success: false, correctness: 0.0 }
            : undefined,
        ).catch(() => {});
      }

      // Build the master prompt — same as streaming path
      let pkg: any;
      try {
        pkg = await buildMasterPrompt({
          userId,
          message:     prompt,
          subjectMode: subjectMode || 'auto',
          stepByStep:  !!stepByStep,
          history:     safeHistory,
          prevAiResponse: prevTurn?.aiResponse ?? null,
          prevStrategy:   prevTurn?.strategy   ?? null,
        });
        answer = await solveText(pkg.userMessage, pkg.history, pkg.systemPrompt);
      } catch (buildErr: any) {
        // Safety fallback — if Brain Core fails, still answer the student
        logger.warn('[AskAI] Text Brain Core failed, falling back to plain solveText: ' + buildErr.message);
        answer = await solveText(prompt, safeHistory);
        pkg = null;
      }

      // afterResponseWithBrain — fires feedback loop + strategy scoring
      if (userId && answer && pkg) {
        const expandedTopic = detectTopicExpanded(prompt, subjectMode || 'auto');
        const finalTopic    = expandedTopic.topic ?? pkg.detectedTopic;
        const finalSubject  = expandedTopic.subject;

        afterResponseWithBrain(
          userId,
          sessionId,
          prompt,
          answer,
          finalTopic,
          finalSubject ?? subjectMode ?? 'auto',
          safeHistory.length,
          0,
          pkg.finalDecision,
          undefined,
        ).catch(() => {});

        // Store this turn in prevTurnStore + DB so next turn's feedback fires correctly
        if (prevTurnKey) {
          const newPrevTurn: PrevTurnData = {
            aiResponse:    answer,
            strategy:      pkg.plan?.strategy ?? 'TEACH',
            topic:         finalTopic,
            subject:       finalSubject ?? subjectMode ?? 'auto',
            sessionId,
            finalDecision: pkg.finalDecision,
            turnCount:     pkg.plan?.turnCount ?? safeHistory.length,
          };
          prevTurnStore.set(prevTurnKey, newPrevTurn);

          // FIX 3: Persist to DB with upsert:true so cold-start recovery always works
          if (sessionId && pkg.plan?.strategy) {
            AskAISession.findByIdAndUpdate(
              sessionId,
              {
                $set: {
                  lastAiResponse: answer.slice(0, 3000),
                  lastStrategy:   pkg.plan.strategy,
                  lastTopic:      finalTopic   ?? null,
                  lastSubject:    finalSubject ?? subjectMode ?? null,
                },
              },
              { upsert: true },
            ).catch(() => {});
          }
        }
      }
    }

    const responseMs = Date.now() - startMs;
    const userAction = await handleQuestionUsed(req, String(prompt || '').substring(0, 100));
    const pts        = userAction?.pointsAwarded ?? (isPremiumValid(await User.findById(userId).lean()) ? 20 : 10);

    // Persist to DB (non-blocking)
    if (userId) {
      (async () => {
        try {
          const sid = sessionId || await getOrCreateAskAISession(userId, convoId || null);
          await persistUserMessage(
            sid, userId,
            String(prompt || '').slice(0, 2000),
            null, 'neutral', questionType,
          );
          await persistAIMessage(
            sid, userId, answer,
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
// UNCHANGED from v14 except Fix 3: upsert:true on prevTurn DB write
// ─────────────────────────────────────────────────────────────
export async function askAIStream(req: Request, res: Response): Promise<void> {
  const {
    prompt,
    history              = [],
    subjectMode          = 'auto',
    stepByStep           = false,
    convoId              = null,
    smartMemoryContext   = '',
    comprehensionContext = '',
    adaptiveHint         = '',
    teachingContext      = '',
    personalizationContext = '',
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

  const prevTurnKey = userId ? `${userId}:${convoId || 'default'}` : '';

  try {
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

    // Fix B Part 3: Load prevTurn from RAM; fall back to DB on cold start
    let prevTurn = prevTurnKey ? prevTurnStore.get(prevTurnKey) : undefined;

    if (!prevTurn && userId && sessionId) {
      try {
        const savedSession = await AskAISession
          .findOne({ userId })
          .sort({ lastMessageAt: -1 })
          .select('lastAiResponse lastStrategy lastTopic lastSubject turnCount')
          .lean();
        if (savedSession?.lastAiResponse && (savedSession.turnCount ?? 0) > 0) {
          prevTurn = {
            aiResponse:    savedSession.lastAiResponse,
            strategy:      (savedSession as any).lastStrategy   ?? 'TEACH',
            topic:         (savedSession as any).lastTopic      ?? null,
            subject:       (savedSession as any).lastSubject    ?? subjectMode,
            sessionId:     String(savedSession._id),
            finalDecision: null,
            turnCount:     savedSession.turnCount ?? 1,
          };
          if (prevTurnKey) prevTurnStore.set(prevTurnKey, prevTurn);
        }
      } catch {
        // non-fatal
      }
    }

    // Score the PREVIOUS strategy using current prompt as reaction signal
    if (prevTurn && userId) {
      const reactionSignal = detectEmotionalState(prompt, prevTurn.turnCount);
      afterResponseWithBrain(
        userId,
        prevTurn.sessionId,
        prompt,
        prevTurn.aiResponse,
        prevTurn.topic,
        prevTurn.subject,
        prevTurn.turnCount,
        0,
        prevTurn.finalDecision,
        reactionSignal === 'correct'
          ? { success: true,  correctness: 1.0 }
          : reactionSignal === 'confused' || reactionSignal === 'frustrated'
          ? { success: false, correctness: 0.0 }
          : undefined,
      ).catch(() => {});
    }

    const contextHistory = (Array.isArray(history) ? history : [])
      .filter((m: any) => m.role && m.content && typeof m.content === 'string')
      .slice(-20);

    const pkg = await buildMasterPrompt({
      userId,
      message:              prompt,
      subjectMode,
      stepByStep:           !!stepByStep,
      history:              contextHistory,
      persistentWeakTopics: dbWeakTopics,
      dbSessionSummary,
      smartMemoryContext,
      comprehensionContext,
      adaptiveHint,
      teachingContext,
      personalizationContext,
      prevAiResponse: prevTurn?.aiResponse ?? null,
      prevStrategy:   prevTurn?.strategy   ?? null,
    });

    const emotionalState = detectEmotionalState(prompt, pkg.plan.turnCount ?? 0);

    const expandedTopic = detectTopicExpanded(prompt, subjectMode);
    const finalTopic    = expandedTopic.topic ?? pkg.detectedTopic;
    const finalSubject  = expandedTopic.subject;

    logger.info(
      'AskAI v15 | intent='  + pkg.plan.intent +
      ' skill='   + pkg.context.skillLevel +
      ' model='   + pkg.modelConfig.modelId +
      ' topic='   + (finalTopic   ?? 'none') +
      ' subject=' + (finalSubject ?? 'none') +
      ' emotion=' + emotionalState +
      ' convoId=' + (convoId ? String(convoId).slice(-6) : 'new') +
      ' turns='   + contextHistory.length,
    );

    if (userId && sessionId) {
      persistUserMessage(
        sessionId, userId, prompt,
        finalTopic, emotionalState, 'text',
      ).catch(() => {});
    }

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

    await solveTextStreamWithContext(
      pkg.userMessage, pkg.history, pkg.systemPrompt, proxyRes as any,
    );

    const responseMs = Date.now() - startMs;

    if (fullResponse && userId) {
      const validation = validateAndLog(fullResponse, pkg.plan.intent, prompt, userId);
      if (validation.pedagogyScore !== undefined) {
        if (validation.pedagogyScore < 40) {
          recordQualityPenalty(pkg.modelConfig.modelId, 2);
          logger.warn(`[Router] Quality penalty x2 | model=${pkg.modelConfig.modelId} pedagogy=${validation.pedagogyScore} quality=${getQualityLabel(validation)}`);
        } else if (validation.pedagogyScore >= 80) {
          recordModelSuccess(pkg.modelConfig.modelId, Date.now() - startMs);
        }
      }
      if (!validation.isValid) {
        recordQualityPenalty(pkg.modelConfig.modelId, 1);
      }
    }

    if (fullResponse && userId && sessionId) {
      persistAIMessage(
        sessionId, userId, fullResponse,
        pkg.plan.intent, pkg.plan.strategy, pkg.context.skillLevel,
        pkg.modelConfig.modelId, pkg.modelConfig.provider,
        'text', 0, responseMs,
      ).catch(() => {});
    }

    if (userId) {
      handleQuestionUsed(req, String(prompt).substring(0, 100)).catch(() => {});
    }

    // Store this turn's data into prevTurnStore for the next turn's feedback scoring
    if (userId && fullResponse && prevTurnKey) {
      prevTurnStore.set(prevTurnKey, {
        aiResponse:    fullResponse,
        strategy:      pkg.plan.strategy,
        topic:         finalTopic,
        subject:       finalSubject ?? subjectMode,
        sessionId,
        finalDecision: pkg.finalDecision,
        turnCount:     pkg.plan.turnCount ?? contextHistory.length,
      });

      // FIX 3: upsert:true ensures DB record exists even on first turn of a new session
      if (sessionId && pkg.plan?.strategy) {
        AskAISession.findByIdAndUpdate(
          sessionId,
          {
            $set: {
              lastAiResponse: fullResponse.slice(0, 3000),
              lastStrategy:   pkg.plan.strategy,
              lastTopic:      finalTopic   ?? null,
              lastSubject:    finalSubject ?? subjectMode ?? null,
            },
          },
          { upsert: true },  // FIX 3: was missing upsert — new sessions had no DB record
        ).catch(() => {});
      }
    }

    // v11: AI-OS Enrichment Pipeline
    if (userId && fullResponse) {
      runPostResponsePipeline({
        userId,
        sessionId,
        prompt,
        aiResponse:    fullResponse,
        emotionalState,
        detectedTopic: finalTopic,
        intent:        pkg.plan.intent,
        strategy:      pkg.plan.strategy,
        turnCount:     pkg.plan.turnCount ?? 0,
        subjectMode,
        prevAiResponse: prevTurn?.aiResponse ?? null,
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
      }).catch(() => {});
    }

    // v12: Visual Brain
    if (fullResponse && fullResponse.length > 100) {
      analyzeWithVisualBrain(fullResponse, subjectMode).then(brain => {
        if (res.writableEnded || !brain.rawUsed || !brain.segments.length) return;
        res.write('data: ' + JSON.stringify({ visualBrain: brain.segments }) + '\n\n');
      }).catch(() => {});
    }

  } catch (err: any) {
    if (!res.writableEnded) {
      logger.error('AskAI v15 stream error: ' + err.message);
      res.write('data: ' + JSON.stringify({ error: 'Stream failed. Please try again.' }) + '\n\n');
    }
  } finally {
    if (!res.writableEnded) res.end();
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/solve-pdf
// PDF upload → AI solve (unchanged from v14)
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
      // Scanned PDF — Brain Core first, then solveWithVision with context
      let pdfBrainDecision: any = null;
      let pdfSessionId          = '';
      try {
        if (userId) {
          pdfSessionId = await getOrCreateAskAISession(userId, null).catch(() => '');
        }

        let resolvedMastery = 50;
        if (userId) {
          try {
            const profileSnap = await StudentProfile
              .findOne({ userId })
              .select('overallMasteryScore')
              .lean();
            if (profileSnap?.overallMasteryScore != null) {
              resolvedMastery = profileSnap.overallMasteryScore;
            }
          } catch {
            // non-fatal
          }
        }

        pdfBrainDecision = await aiBrainCore.processRequest({
          userId:          userId || 'anonymous',
          sessionId:       pdfSessionId || 'pdf-session',
          userMessage:     prompt || 'Solve all questions in this PDF completely.',
          prevAiResponse:  null,
          prevStrategy:    null,
          topic:           null,
          subject:         'general',
          turnCount:       0,
          retryCount:      0,
          masteryLevel:    resolvedMastery,
          currentState:    'LEARNING',
        });
      } catch (err: any) {
        logger.warn('[AskAI] PDF Brain Core failed (continuing): ' + err.message);
      }

      const brainContextNote = pdfBrainDecision?.systemPromptAddition
        ? `\n\n=== AI BRAIN CORE DIRECTIVES ===\n${pdfBrainDecision.systemPromptAddition}\n=== END DIRECTIVES ===`
        : '';

      const enhancedPdfPrompt = (prompt || 'Solve all questions in this PDF completely.') + brainContextNote;
      answer = await solveWithVision(
        `data:application/pdf;base64,${req.file.buffer.toString('base64')}`,
        enhancedPdfPrompt,
      );

      if (userId && pdfBrainDecision) {
        afterResponseWithBrain(
          userId,
          pdfSessionId,
          prompt || `[PDF: ${req.file.originalname}]`,
          answer,
          null,
          'general',
          0,
          0,
          pdfBrainDecision,
          undefined,
        ).catch(() => {});
      }
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

    // Give exactly +1 question (capped at dailyLimit)
    // We directly increment questionsLeft without touching questionUsedAt
    // so applyHourlyRefill does not interfere with the bonus question
    const currentLeft = (user as any).questionsLeft || 0;
    (user as any).questionsLeft = Math.min(currentLeft + 1, dailyLim);

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
// GET /api/ai/quota
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
    // Reset video ads daily
    if ((user as any).videoAdsDate !== today) {
      (user as any).videoAdsDate  = today;
      (user as any).videoAdsToday = 0;
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
// POST /api/ai/evaluate-answer  (v13)
// ─────────────────────────────────────────────────────────────
export async function evaluateAnswer(req: Request, res: Response) {
  try {
    const { question, answer, topic, subject } = req.body;

    if (!answer?.trim()) {
      return res.json({ success: true, result: 'skipped', feedback: '' });
    }

    const qText = (question || '').slice(0, 400);
    const aText = (answer   || '').slice(0, 400);
    const prompt =
      `You are evaluating a student answer. Be strict but fair.\n` +
      `Question: "${qText}"\n` +
      `Student answered: "${aText}"\n` +
      `Topic: ${topic || 'general'}, Subject: ${subject || 'general'}\n` +
      `Reply ONLY with valid JSON, no markdown:\n` +
      `{"result":"correct","feedback":"one short line"}\n` +
      `result must be: correct | incorrect | partial`;

    const raw    = await solveText(prompt, [], 'general');
    const clean  = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.json({
      success:  true,
      result:   parsed.result   || 'skipped',
      feedback: parsed.feedback || '',
    });
  } catch (err: any) {
    logger.warn('evaluateAnswer error (non-critical): ' + err.message);
    return res.json({ success: true, result: 'skipped', feedback: '' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/reset-session
// ─────────────────────────────────────────────────────────────
export async function resetSession(req: Request, res: Response) {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false });

  try {
    const { clearSession } = await import('../services/askAI/conversationMemoryEngine.js');
    clearSession(userId);

    const convoId = req.body.convoId;
    if (convoId) {
      prevTurnStore.delete(`${userId}:${convoId}`);
    } else {
      for (const key of prevTurnStore.keys()) {
        if (key.startsWith(`${userId}:`)) prevTurnStore.delete(key);
      }
    }

    logger.info(`[AskAI] Session RAM cleared | userId=${userId.slice(-6)} | convoId=${req.body.convoId || 'none'}`);
    return res.json({ success: true });
  } catch (err: any) {
    logger.error('resetSession error: ' + err.message);
    return res.status(500).json({ success: false });
  }
}