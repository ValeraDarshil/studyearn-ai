// ─────────────────────────────────────────────────────────────
// AskAI — aiController.ts  (v18 — 3 critical bugs fixed)
//
// ROUTES HANDLED:
//   POST /api/ai/ask           → askAI()         (image / text non-stream)
//   POST /api/ai/ask-stream    → askAIStream()   (SSE streaming — main chat)
//   POST /api/ai/solve-pdf     → solvePDF()      (PDF upload & solve)
//   POST /api/ai/watch-ad      → watchAd()       (ad → quota refill)
//   GET  /api/ai/quota         → getQuota()      (remaining questions)
//   POST /api/ai/reset-session → resetSession()  (chat switch RAM clear)
//
// ─── WHAT CHANGED IN v18 ─────────────────────────────────────
//
// BUG FIX 1 (CRITICAL — quota bypass):
//   solvePDF() never called checkAndDeductQuota() — any authenticated
//   user could make unlimited AI requests via PDF at zero cost.
//   Fixed: checkAndDeductQuota() now called atomically at the top of
//   solvePDF() before ANY AI work begins, same as askAI() and askAIStream().
//
// BUG FIX 2 (HIGH — double feedback loop):
//   feedbackLoopEngine.processOutcome() was firing TWICE per turn for the
//   same previous turn:
//     (1) Controller called afterResponseWithBrain(prevTurn) BEFORE buildMasterPrompt()
//     (2) aiBrainCore.processRequest() step 2.4 called feedbackLoopEngine.processOutcome()
//         AGAIN with the same prevTurn data
//   Result: strategyScoringEngine.recordOutcome() ran 2× → usageCount and
//   successCount/failureCount inflated by 2×, biasing strategy selection.
//
//   Fix: Removed the CONTROLLER-SIDE pre-call to afterResponseWithBrain(prevTurn)
//   from ALL three paths (streaming, non-streaming text, image, PDF).
//   aiBrainCore.processRequest() step 2.4 is now the SINGLE place that
//   processes previous-turn feedback — it receives prevAiResponse + prevStrategy
//   and fires feedbackLoopEngine.processOutcome() exactly once per turn.
//
//   The post-response afterResponseWithBrain() call (for THIS turn's response)
//   is kept — it advances teachingLoop + records outcome for THIS turn.
//
// BUG FIX 3 (HIGH — text PDF bypasses Brain Core):
//   solvePDF() text-extractable branch (pdfText.length > 50) called
//   solveText() directly — no Brain Core, no feedback loop, no memory update,
//   no prevTurn saved. Adaptive learning was completely invisible for text PDFs.
//
//   Fixed: text PDF branch now runs the same full pipeline as the scanned PDF
//   branch: buildMasterPrompt() → solveText() → afterResponseWithBrain() →
//   prevTurnStore + DB save. All adaptive signals now fire for ALL PDF types.
//
// All v17 fixes (LRU eviction, atomic quota, auth guard, prompt injection
// sanitizer, image cross-turn learning) are carried forward unchanged.
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
// Prompt injection sanitizer — strips control chars and
// limits length of user-derived strings before system prompt injection.
function sanitizeForPrompt(input: string | null | undefined, maxLen = 80): string {
  if (!input) return '';
  return input
    .replace(/[^\w\s,.\-()]/g, '')   // allow only safe chars
    .replace(/\s+/g, ' ')            // collapse whitespace
    .trim()
    .slice(0, maxLen);
}

// ─────────────────────────────────────────────────────────────
// prevTurnStore — in-memory store for previous turn data.
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

// LRU eviction — prevents unbounded memory growth.
const PREV_TURN_MAX_SIZE = 5_000;
const prevTurnStore = new Map<string, PrevTurnData>();

function prevTurnSet(key: string, value: PrevTurnData): void {
  prevTurnStore.set(key, value);
  if (prevTurnStore.size > PREV_TURN_MAX_SIZE) {
    let evicted = 0;
    for (const k of prevTurnStore.keys()) {
      prevTurnStore.delete(k);
      if (++evicted >= 500) break;
    }
    logger.info(`[PrevTurnStore] Evicted 500 entries | size=${prevTurnStore.size}`);
  }
}

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
  const computedLeft = Math.max(0, Math.min(dailyLimit, dailyLimit - recent.length));
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

/**
 * checkAndDeductQuota — ATOMIC quota check + deduct.
 * Single atomic findOneAndUpdate with { questionsLeft: { $gt: 0 } } filter.
 * MongoDB guarantees only ONE request wins the decrement.
 */
async function checkAndDeductQuota(
  req: Request,
): Promise<{ allowed: false; questionsLeft: 0; nextRefillSecs: number } | { allowed: true; userId: string; isPremium: boolean }> {
  const userId = getUserIdFromToken(req);
  if (!userId) return { allowed: false, questionsLeft: 0, nextRefillSecs: 0 };

  try {
    const user = await User.findById(userId).lean();
    if (!user) return { allowed: false, questionsLeft: 0, nextRefillSecs: 0 };

    const premium    = isPremiumValid(user);
    const today      = getTodayIST();
    const dailyLimit = premium ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;

    if ((user as any).questionsDate !== today) {
      await User.findByIdAndUpdate(userId, {
        $set: {
          questionsDate:  today,
          questionUsedAt: [],
          questionsLeft:  dailyLimit,
          videoAdsToday:  0,
          videoAdsDate:   today,
        },
      });
    }

    const updated = await User.findOneAndUpdate(
      {
        _id:           userId,
        questionsLeft: { $gt: 0 },
      },
      {
        $inc: { questionsLeft: -1 },
        $push: { questionUsedAt: new Date() },
      },
      { new: true },
    );

    if (!updated) {
      const fresh = await User.findById(userId).lean();
      return {
        allowed:        false,
        questionsLeft:  0,
        nextRefillSecs: getNextRefillSecs(fresh),
      };
    }

    return {
      allowed:   true,
      userId,
      isPremium: premium,
    };
  } catch (err: any) {
    logger.error('checkAndDeductQuota error: ' + err.message);
    return { allowed: false, questionsLeft: 0, nextRefillSecs: 0 };
  }
}

/**
 * handleQuestionUsed — called AFTER AI response to log points + activity.
 * Quota is already deducted by checkAndDeductQuota() before the AI call.
 */
async function handleQuestionUsed(
  req:        Request,
  promptText = '',
): Promise<{ questionsLeft: number; pointsAwarded: number; nextRefillSecs: number } | null> {
  const userId = getUserIdFromToken(req);
  if (!userId) return null;

  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const premium = isPremiumValid(user);
    const pts     = premium ? BASE_AI_POINTS * PREMIUM_MULTIPLIER : BASE_AI_POINTS;

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

    Activity.create({ userId, action: 'ask_question', details: activityDetail, pointsEarned: pts }).catch(() => {});
    logger.info(`AI question | premium=${premium} | +${pts}pts | left=${(user as any).questionsLeft}`);
    syncActivityToProfile(userId, 'ask_question', pts).catch(() => {});
    onActivityEvent(userId, 'ai_tutor_used', { topic: activityDetail }).catch(() => {});

    return {
      questionsLeft:  (user as any).questionsLeft ?? 0,
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

    // Auth guard
    const userId = getUserIdFromToken(req) ?? '';
    if (!userId) {
      return res.status(401).json({ success: false, answer: 'Please log in to use AI features.' });
    }

    // Atomic quota check BEFORE AI call
    const quotaResult = await checkAndDeductQuota(req);
    if (!quotaResult.allowed) {
      return res.status(429).json({
        success:        false,
        answer:         'You have used all your questions for today. Watch an ad or wait for the next refill.',
        questionsLeft:  0,
        nextRefillSecs: quotaResult.nextRefillSecs,
      });
    }

    const questionType: 'text' | 'image' | 'pdf'  = image ? 'image' : 'text';
    const startMs                                  = Date.now();
    let answer: string;
    let sessionId = '';

    if (image) {
      // ── IMAGE PATH ──
      let imageUrl = image;
      if (!image.startsWith('data:')) {
        const isJpeg = image.startsWith('/9j/');
        imageUrl     = `data:image/${isJpeg ? 'jpeg' : 'png'};base64,${image}`;
      }
      logger.info(`/api/ai/ask image=true | mode=${subjectMode || 'auto'}`);

      let resolvedMastery = 50;
      try {
        const profileSnap = await StudentProfile
          .findOne({ userId })
          .select('overallMasteryScore')
          .lean();
        if (profileSnap?.overallMasteryScore != null) {
          resolvedMastery = profileSnap.overallMasteryScore;
        }
      } catch { /* non-fatal */ }

      const imgPrevTurnKey = `${userId}:${convoId || 'default'}`;
      let imgPrevTurn = prevTurnStore.get(imgPrevTurnKey);

      // Cold-start DB fallback
      if (!imgPrevTurn) {
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
            prevTurnSet(imgPrevTurnKey, imgPrevTurn);
          }
        } catch { /* non-fatal */ }
      }

      // ── BUG FIX 2: REMOVED pre-call to afterResponseWithBrain(imgPrevTurn) here.
      // aiBrainCore.processRequest() step 2.4 handles previous-turn feedback
      // internally — calling it here too caused double scoring. ──

      let brainDecision: any = null;
      try {
        if (!sessionId) {
          sessionId = await getOrCreateAskAISession(userId, convoId || null).catch(() => '');
        }
        brainDecision = await aiBrainCore.processRequest({
          userId:          userId || 'anonymous',
          sessionId:       sessionId || 'image-session',
          userMessage:     prompt || 'Solve this image question.',
          prevAiResponse:  imgPrevTurn?.aiResponse ?? null,
          prevStrategy:    (imgPrevTurn?.strategy as TeachingStrategy) ?? null,
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

      const brainContextNote = brainDecision?.systemPromptAddition
        ? `\n\n=== AI BRAIN CORE DIRECTIVES ===\n${brainDecision.systemPromptAddition}\n=== END DIRECTIVES ===`
        : '';

      const enhancedPrompt = (prompt || '') + brainContextNote;
      answer = await solveWithVision(imageUrl, enhancedPrompt);

      // afterResponseWithBrain for THIS turn's response
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

      // Save this image turn to prevTurnStore + DB
      if (userId && answer) {
        const imgNewPrevTurn: PrevTurnData = {
          aiResponse:    answer,
          strategy:      brainDecision?.strategy ?? 'TEACH',
          topic:         null,
          subject:       subjectMode || 'auto',
          sessionId,
          finalDecision: brainDecision,
          turnCount:     safeHistory.length,
        };
        prevTurnSet(imgPrevTurnKey, imgNewPrevTurn);

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
      // ── TEXT PATH — Brain Core via buildMasterPrompt ──
      logger.info(`/api/ai/ask text (Brain Core) | mode=${subjectMode || 'auto'}`);

      if (userId) {
        try {
          sessionId = await getOrCreateAskAISession(userId, convoId || null);
        } catch { /* non-fatal */ }
      }

      const prevTurnKey = `${userId}:${convoId || 'default'}`;
      let prevTurn = prevTurnStore.get(prevTurnKey);

      if (!prevTurn && sessionId) {
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
            prevTurnSet(prevTurnKey, prevTurn);
          }
        } catch { /* non-fatal */ }
      }

      // ── BUG FIX 2: REMOVED pre-call to afterResponseWithBrain(prevTurn) here.
      // aiBrainCore.processRequest() step 2.4 handles this internally. ──

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
        logger.warn('[AskAI] Text Brain Core failed, falling back to plain solveText: ' + buildErr.message);
        answer = await solveText(prompt, safeHistory);
        pkg = null;
      }

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
          prevTurnSet(prevTurnKey, newPrevTurn);

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
    const pts        = userAction?.pointsAwarded ?? (quotaResult.isPremium ? 20 : 10);

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

  // Auth + quota check BEFORE flushHeaders()
  if (!userId) {
    res.status(401).json({ error: 'Please log in to use AI features.' });
    return;
  }

  const quotaResult = await checkAndDeductQuota(req);
  if (!quotaResult.allowed) {
    res.status(429).json({
      error:          'You have used all your questions for today. Watch an ad or wait for the next refill.',
      questionsLeft:  0,
      nextRefillSecs: quotaResult.nextRefillSecs,
    });
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
    let realTurnCount = 0;

    if (userId) {
      try {
        sessionId        = await getOrCreateAskAISession(userId, convoId);
        dbWeakTopics     = await getWeakTopicsFromDB(userId);
        dbSessionSummary = await getSessionSummaryForPrompt(userId);

        const sessionDoc = await AskAISession.findById(sessionId).select('turnCount').lean();
        realTurnCount = (sessionDoc as any)?.turnCount ?? 0;
      } catch (e: any) {
        logger.warn('[AskAI DB] Pre-stream setup failed (continuing): ' + e.message);
      }
    }

    // Load prevTurn from RAM; fall back to DB on cold start
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
          if (prevTurnKey) prevTurnSet(prevTurnKey, prevTurn);
        }
      } catch { /* non-fatal */ }
    }

    // ── BUG FIX 2: REMOVED pre-call to afterResponseWithBrain(prevTurn) here.
    // aiBrainCore.processRequest() step 2.4 handles previous-turn feedback
    // internally via feedbackLoopEngine.processOutcome(). Calling it here too
    // caused double scoring — strategy stats were inflated 2× per turn. ──

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

    // Override pkg.plan.turnCount with the real DB value
    if (realTurnCount > 0 && pkg?.plan) {
      pkg.plan.turnCount = realTurnCount;
    }

    const emotionalState = detectEmotionalState(prompt, pkg.plan.turnCount ?? 0);

    const expandedTopic = detectTopicExpanded(prompt, subjectMode);
    const finalTopic    = expandedTopic.topic ?? pkg.detectedTopic;
    const finalSubject  = expandedTopic.subject;

    logger.info(
      'AskAI v18 | intent='  + pkg.plan.intent +
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

      AskAISession.findByIdAndUpdate(
        sessionId,
        { $inc: { turnCount: 1 } }
      ).catch(() => {});
    }

    if (userId) {
      handleQuestionUsed(req, String(prompt).substring(0, 100)).catch(() => {});
    }

    // Store this turn for next turn's feedback scoring
    if (userId && fullResponse && prevTurnKey) {
      prevTurnSet(prevTurnKey, {
        aiResponse:    fullResponse,
        strategy:      pkg.plan.strategy,
        topic:         finalTopic,
        subject:       finalSubject ?? subjectMode,
        sessionId,
        finalDecision: pkg.finalDecision,
        turnCount:     pkg.plan.turnCount ?? contextHistory.length,
      });

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
          { upsert: true },
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
      logger.error('AskAI v18 stream error: ' + err.message);
      res.write('data: ' + JSON.stringify({ error: 'Stream failed. Please try again.' }) + '\n\n');
    }
  } finally {
    if (!res.writableEnded) res.end();
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/solve-pdf  (v18 — 3 bugs fixed)
//
// BUG FIX 1: checkAndDeductQuota() now called at top — PDF requests
//   no longer bypass quota.
//
// BUG FIX 2: Removed pre-call to afterResponseWithBrain(pdfPrevTurn)
//   before aiBrainCore.processRequest() — same double-fire fix as
//   other paths. Brain Core step 2.4 handles it internally.
//
// BUG FIX 3: Text-extractable PDF branch (pdfText.length > 50) now
//   runs full Brain Core pipeline instead of raw solveText().
//   buildMasterPrompt() → solveText() → afterResponseWithBrain()
//   → prevTurnStore + DB save. All adaptive signals fire for ALL PDFs.
// ─────────────────────────────────────────────────────────────
export async function solvePDF(req: Request, res: Response) {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, answer: 'No file uploaded.' });

    const userId  = getUserIdFromToken(req) ?? '';
    const prompt  = req.body.prompt || '';
    const startMs = Date.now();

    // ── BUG FIX 1: Atomic quota check BEFORE any AI work ──────────────────────
    // Previously missing entirely from solvePDF(). Any authenticated user could
    // make unlimited AI requests via PDF upload at zero cost.
    const quotaResult = await checkAndDeductQuota(req);
    if (!quotaResult.allowed) {
      return res.status(429).json({
        success:        false,
        answer:         'You have used all your questions for today. Watch an ad or wait for the next refill.',
        questionsLeft:  0,
        nextRefillSecs: quotaResult.nextRefillSecs,
      });
    }
    // ── End quota fix ──────────────────────────────────────────────────────────

    const pdfText = await parsePDFText(req.file.buffer);
    let answer: string;
    let pdfSessionId = '';

    // Shared prevTurn setup for both PDF paths
    const pdfPrevTurnKey = userId ? `${userId}:pdf-session` : '';
    let pdfPrevTurn = pdfPrevTurnKey ? prevTurnStore.get(pdfPrevTurnKey) : undefined;

    if (userId) {
      try {
        pdfSessionId = await getOrCreateAskAISession(userId, null).catch(() => '');
      } catch { /* non-fatal */ }
    }

    // DB cold-start fallback for prevTurn
    if (!pdfPrevTurn && userId && pdfSessionId) {
      try {
        const savedSession = await AskAISession
          .findOne({ userId })
          .sort({ lastMessageAt: -1 })
          .select('lastAiResponse lastStrategy lastTopic lastSubject turnCount')
          .lean();
        if (savedSession?.lastAiResponse && (savedSession.turnCount ?? 0) > 0) {
          pdfPrevTurn = {
            aiResponse:    savedSession.lastAiResponse,
            strategy:      (savedSession as any).lastStrategy ?? 'TEACH',
            topic:         (savedSession as any).lastTopic    ?? null,
            subject:       (savedSession as any).lastSubject  ?? 'general',
            sessionId:     String(savedSession._id),
            finalDecision: null,
            turnCount:     savedSession.turnCount ?? 1,
          };
          if (pdfPrevTurnKey) prevTurnSet(pdfPrevTurnKey, pdfPrevTurn);
        }
      } catch { /* non-fatal */ }
    }

    // ── BUG FIX 2: REMOVED pre-call to afterResponseWithBrain(pdfPrevTurn) here.
    // aiBrainCore.processRequest() step 2.4 handles previous-turn feedback. ──

    if (pdfText && pdfText.trim().length > 50) {
      // ── BUG FIX 3: TEXT PDF — now runs full Brain Core pipeline ──────────────
      // Previously: raw solveText() call — no Brain Core, no feedback loop,
      // no memory updates, no adaptive behavior for text-extractable PDFs.
      // Now: same pipeline as scanned PDF + non-streaming text path.
      logger.info(`/api/ai/solve-pdf text-extractable | mode=general`);

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
        } catch { /* non-fatal */ }
      }

      // Build a combined question: PDF content + student's prompt
      const pdfQuestion = prompt
        ? `PDF Content:\n\n${pdfText.slice(0, 8000)}\n\nStudent Question: ${prompt}`
        : `Please analyze and solve all questions in this PDF:\n\n${pdfText.slice(0, 8000)}`;

      let pkg: any;
      try {
        pkg = await buildMasterPrompt({
          userId,
          message:        pdfQuestion,
          subjectMode:    'general',
          stepByStep:     false,
          history:        [],
          prevAiResponse: pdfPrevTurn?.aiResponse ?? null,
          prevStrategy:   pdfPrevTurn?.strategy   ?? null,
          masteryLevel:   resolvedMastery,
        });
        answer = await solveText(pkg.userMessage, pkg.history, pkg.systemPrompt);
      } catch (buildErr: any) {
        // Safety fallback — Brain Core fail on PDF is non-fatal
        logger.warn('[AskAI] Text PDF Brain Core failed, falling back: ' + buildErr.message);
        answer = await solveText(pdfQuestion, [], 'general');
        pkg = null;
      }

      // afterResponseWithBrain for THIS turn
      if (userId && answer && pkg) {
        afterResponseWithBrain(
          userId,
          pdfSessionId,
          pdfQuestion.slice(0, 200),
          answer,
          null,
          'general',
          pdfPrevTurn?.turnCount ?? 0,
          0,
          pkg.finalDecision,
          undefined,
        ).catch(() => {});

        // Save this turn to prevTurnStore + DB
        if (pdfPrevTurnKey) {
          prevTurnSet(pdfPrevTurnKey, {
            aiResponse:    answer,
            strategy:      pkg.plan?.strategy ?? 'TEACH',
            topic:         null,
            subject:       'general',
            sessionId:     pdfSessionId,
            finalDecision: pkg.finalDecision,
            turnCount:     (pdfPrevTurn?.turnCount ?? 0) + 1,
          });

          if (pdfSessionId && pkg.plan?.strategy) {
            AskAISession.findByIdAndUpdate(
              pdfSessionId,
              {
                $set: {
                  lastAiResponse: answer.slice(0, 3000),
                  lastStrategy:   pkg.plan.strategy,
                  lastTopic:      null,
                  lastSubject:    'general',
                },
              },
              { upsert: true },
            ).catch(() => {});
          }
        }
      }

    } else {
      // ── SCANNED PDF — Brain Core + vision ────────────────────────────────────
      logger.info(`/api/ai/solve-pdf scanned | mode=general`);

      let pdfBrainDecision: any = null;

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
        } catch { /* non-fatal */ }
      }

      try {
        pdfBrainDecision = await aiBrainCore.processRequest({
          userId:          userId || 'anonymous',
          sessionId:       pdfSessionId || 'pdf-session',
          userMessage:     prompt || 'Solve all questions in this PDF completely.',
          prevAiResponse:  pdfPrevTurn?.aiResponse ?? null,
          prevStrategy:    (pdfPrevTurn?.strategy as any) ?? null,
          topic:           null,
          subject:         'general',
          turnCount:       pdfPrevTurn?.turnCount ?? 0,
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
          pdfPrevTurn?.turnCount ?? 0,
          0,
          pdfBrainDecision,
          undefined,
        ).catch(() => {});
      }

      if (userId && answer && pdfPrevTurnKey) {
        prevTurnSet(pdfPrevTurnKey, {
          aiResponse:    answer,
          strategy:      pdfBrainDecision?.strategy ?? 'TEACH',
          topic:         null,
          subject:       'general',
          sessionId:     pdfSessionId,
          finalDecision: pdfBrainDecision,
          turnCount:     (pdfPrevTurn?.turnCount ?? 0) + 1,
        });
        if (pdfSessionId && pdfBrainDecision?.strategy) {
          AskAISession.findByIdAndUpdate(
            pdfSessionId,
            { $set: {
              lastAiResponse: answer.slice(0, 3000),
              lastStrategy:   pdfBrainDecision.strategy,
              lastTopic:      null,
              lastSubject:    'general',
            }},
            { upsert: true },
          ).catch(() => {});
        }
      }
    }

    const responseMs = Date.now() - startMs;
    const userAction = await handleQuestionUsed(req, prompt.substring(0, 100));

    if (userId) {
      (async () => {
        try {
          const sid = pdfSessionId || await getOrCreateAskAISession(userId, null);
          await persistUserMessage(
            sid, userId,
            prompt || `[PDF: ${req.file!.originalname}]`,
            null, 'neutral', 'pdf',
          );
          await persistAIMessage(
            sid, userId, answer,
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
// POST /api/ai/evaluate-answer
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