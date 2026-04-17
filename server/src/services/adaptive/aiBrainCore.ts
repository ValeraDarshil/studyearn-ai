/**
 * AI Study OS — AI Brain Core  (v2 — CENTRALIZED CONTROL LAYER)
 * ─────────────────────────────────────────────────────────────
 * THE single decision authority of AI Study OS.
 *
 * ARCHITECTURE CHANGE (v1 → v2):
 *   v1: aiBrainCore returned "recommendations" — other modules could
 *       override them. Strategy still decided in aiResponsePlanner.ts.
 *       Model still decided in aiModelRouter.ts independently.
 *       Result: distributed, inconsistent behavior.
 *
 *   v2: aiBrainCore returns a FinalDecision object that IS the law.
 *       aiResponsePlanner.ts → prompt builder only (reads FinalDecision)
 *       aiModelRouter.ts     → called BY brain core, not independently
 *       feedbackLoopEngine   → called BY brain core after every response
 *       No other module makes strategy, tone, or model decisions.
 *
 * PIPELINE (every AskAI turn):
 *
 *   User Input
 *       ↓
 *   [1] longTermMemoryEngine.getMemory()         — who is this student?
 *   [2] memoryRetrievalEngine.retrieve()         — what's relevant NOW?
 *       ↓ (parallel)
 *   [3] userStateInferenceEngine.infer()         — how are they feeling?
 *   [4] teachingLoopEngine.getState()            — what teaching phase?
 *       ↓
 *   [5] feedbackLoopEngine (prev turn)           — past strategy perf
 *       ↓
 *   [6] strategyScoringEngine.getBestStrategy()  — DATA-DRIVEN strategy
 *   [7] modelPerformanceTracker.getRoutingDecision() — best model
 *       ↓
 *   [8] Build FinalDecision (single source of truth)
 *       ↓
 *   Execution layer reads FinalDecision (planner, router, mentor)
 *       ↓
 *   [9]  afterResponse → teachingLoopEngine.advance()
 *   [10] strategyScoringEngine.recordOutcome()
 *   [11] longTermMemoryEngine.recordMistake() (if needed)
 */

import { longTermMemoryEngine }                               from './longTermMemoryEngine.js';
import { memoryRetrievalEngine }                              from './memoryRetrievalEngine.js';
import { userStateInferenceEngine, InferredUserState }        from './userStateInferenceEngine.js';
import { teachingLoopEngine, TeachingPhase }                  from './teachingLoopEngine.js';
import { strategyScoringEngine, TeachingStrategy }            from './strategyScoringEngine.js';
import { modelPerformanceTracker, RoutingDecision }           from './modelPerformanceTracker.js';
import { feedbackLoopEngine }                                 from './feedbackLoopEngine.js';
import { logger }                                             from '../../utils/logger.js';
import { metricsEngine, optimizationEngine }                  from './metricsEngine.js';

// ── Optimization cache: 5-min TTL per userId ─────────────────
const _optCache = new Map<string, { result: any; expiresAt: number }>();
const OPT_CACHE_TTL_MS = 5 * 60 * 1000;
async function getCachedOptimization(userId: string) {
  const cached = _optCache.get(userId);
  if (cached && Date.now() < cached.expiresAt) return cached.result;
  try {
    const result = await optimizationEngine.optimize(userId);
    _optCache.set(userId, { result, expiresAt: Date.now() + OPT_CACHE_TTL_MS });
    return result;
  } catch {
    return null;
  }
}

// ── Types ──────────────────────────────────────────────────────

export interface BrainInput {
  userId:          string;
  sessionId:       string;
  userMessage:     string;
  prevAiResponse?: string | null;
  prevStrategy?:   TeachingStrategy | null;
  topic:           string | null;
  subject:         string;
  turnCount:       number;
  retryCount:      number;
  masteryLevel:    number;             // 0–100, from studentProfile
  currentState:    string;             // STUCK | LEARNING | ADVANCED | etc.
  responseTimeMs?: number;
  // Optional frontend signals (merged with server-side inference)
  frontendComprehension?: number;      // 0–100
  frontendCognitiveLoad?: string;
}

/**
 * FinalDecision — THE single source of truth for every AskAI turn.
 *
 * All execution modules (planner, router, mentor) read ONLY this.
 * No module may override or supplement these decisions independently.
 */
export interface FinalDecision {
  // ── Core Strategy (data-driven via strategyScoringEngine) ────
  strategy:            TeachingStrategy;
  strategyScores:      Array<{ strategy: TeachingStrategy; score: number }>;
  strategyReason:      string;

  // ── Teaching Control ─────────────────────────────────────────
  teachingMode:        boolean;
  teachingPhase:       TeachingPhase;
  shouldAskCheckQ:     boolean;
  checkQuestion:       string | null;

  // ── Difficulty + Tone (adaptive) ─────────────────────────────
  difficultyLevel:     'beginner' | 'intermediate' | 'advanced';
  tone:                'warm' | 'encouraging' | 'direct' | 'urgent' | 'celebratory';

  // ── Model Routing ─────────────────────────────────────────────
  modelPreference:     'fast' | 'balanced' | 'accurate';
  modelDecision:       RoutingDecision;

  // ── Follow-up + Retry ────────────────────────────────────────
  followUpRequired:    boolean;
  retryStrategy:       TeachingStrategy | null;

  // ── Student State Snapshot ───────────────────────────────────
  inferredState:       InferredUserState;
  weakTopics:          string[];
  strongTopics:        string[];
  masteredThisSession: string[];

  // ── Prompt Enrichment ─────────────────────────────────────────
  systemPromptAddition: string;
  memoryBlock:          string;

  // ── Metadata ──────────────────────────────────────────────────
  processedAt:          string;
  brainVersion:         'v2';
}

// ─────────────────────────────────────────────────────────────
// aiBrainCore — SINGLE DECISION AUTHORITY
// ─────────────────────────────────────────────────────────────
export const aiBrainCore = {

  /**
   * processRequest — main entry point for every AskAI turn.
   *
   * Returns a FinalDecision. ALL downstream modules must use this.
   * No other module independently computes strategy, model, or tone.
   */
  async processRequest(input: BrainInput): Promise<FinalDecision> {
    const {
      userId, sessionId, userMessage, prevAiResponse, prevStrategy,
      topic, subject, turnCount, retryCount, masteryLevel, currentState,
      responseTimeMs, frontendComprehension, frontendCognitiveLoad,
    } = input;

    const startMs = Date.now();
    logger.info({ userId, topic, turnCount, currentState }, '[BrainCore v2] Processing AskAI turn');

    // ── STEP 2.1: Retrieve Memory (parallel — fast path) ──────
    const [memoryResult, retrievalResult] = await Promise.allSettled([
      longTermMemoryEngine.getMemory(userId),
      memoryRetrievalEngine.retrieve({
        userId,
        queryText:    userMessage,
        currentState,
        topK:         5,            // only relevant context — no dumping
      }),
    ]);

    const memory    = memoryResult.status    === 'fulfilled' ? memoryResult.value    : null;
    const retrieval = retrievalResult.status === 'fulfilled' ? retrievalResult.value : null;

    // ── STEP 2.2: Analyze User State ──────────────────────────
    let inferredState = userStateInferenceEngine.infer({
      message:      userMessage,
      turnCount,
      retryCount,
      responseTimeMs,
      lastTopic:    teachingLoopEngine.getState(userId).topic,
      currentTopic: topic,
    });

    // Merge with frontend signals when available
    inferredState = userStateInferenceEngine.mergeWithFrontendSignals(
      inferredState,
      frontendComprehension,
      frontendCognitiveLoad,
    );

    // ── STEP 2.3: Get Teaching Phase ──────────────────────────
    // FIX 4B: Always use getStateAsync — it hits RAM cache first, DB only on
    // cache miss. Removes the turnCount <= 1 restriction so state is always
    // restored after cold start regardless of turn number.
    const loopState = await teachingLoopEngine.getStateAsync(userId);

    // ── STEP 2.4: Fetch Feedback History (prev turn feedback) ─
    // Close the loop: process what happened last turn BEFORE deciding this turn
    if (prevAiResponse && prevStrategy && turnCount > 1) {
      feedbackLoopEngine.processOutcome({
        userId, sessionId, userMessage,
        aiResponse:  prevAiResponse,
        strategy:    prevStrategy,
        topic, subject, turnCount, retryCount, responseTimeMs,
      }).catch((err: any) => {
        logger.warn({ userId, err: err.message }, '[BrainCore v2] Feedback processing failed (non-fatal)');
      });
    }

    // ── STEP 2.5: Strategy Scoring — CRITICAL (data-driven) ───
    // No hardcoded: if confused → simplify
    // Instead: score all strategies, pick highest-scoring
    const topStrategy = await strategyScoringEngine.getBestStrategy({
      userId,
      currentState,
      masteryLevel,
      confusionSignal:   inferredState.emotion === 'confused' || inferredState.needsReexplain,
      frustrationSignal: inferredState.emotion === 'frustrated',
      sessionStreak:     Math.max(0, turnCount - retryCount),
      lastStrategy:      prevStrategy ?? null,
    });

    // Apply optimizationEngine boosts from cache (no DB hit if cache warm)
    let finalStrategy: TeachingStrategy = topStrategy;
    try {
      const optResult = await getCachedOptimization(userId);
      if (optResult?.preferredStrategyBoosts) {
        const entries = Object.entries(optResult.preferredStrategyBoosts as Record<string, number>);
        if (entries.length > 0) {
          const [bestBoost, bestVal] = entries.sort((a, b) => b[1] - a[1])[0];
          if (bestVal >= 0.15) finalStrategy = bestBoost as TeachingStrategy;
        }
      }
    } catch { /* non-fatal — keep topStrategy */ }

    // Get top-5 strategy scores for logging + transparency
    let strategyScores: Array<{ strategy: TeachingStrategy; score: number }> = [];
    try {
      const topStrategies = await strategyScoringEngine.getTopStrategies({
        userId,
        currentState,
        masteryLevel,
        confusionSignal:   inferredState.emotion === 'confused',
        frustrationSignal: inferredState.emotion === 'frustrated',
        sessionStreak:     Math.max(0, turnCount - retryCount),
        lastStrategy:      prevStrategy ?? null,
      }, 5);
      strategyScores = topStrategies.map(s => ({ strategy: s.strategy, score: s.score }));
    } catch {
      strategyScores = [{ strategy: topStrategy, score: 1.0 }];
    }

    // ── STEP 2.6: Build FinalDecision (all decisions here) ────

    // Difficulty: mastery-driven + state-aware
    const difficultyLevel: FinalDecision['difficultyLevel'] =
      masteryLevel > 70 && inferredState.emotion !== 'confused' && currentState !== 'STUCK'
        ? 'advanced'
        : masteryLevel > 35 && inferredState.emotion !== 'overloaded'
        ? 'intermediate'
        : 'beginner';

    // Tone: emotional-state-driven (not hardcoded per intent)
    const tone: FinalDecision['tone'] =
      inferredState.emotion === 'frustrated'
        ? 'encouraging'
        : inferredState.emotion === 'confused' || inferredState.needsReexplain
        ? 'warm'
        : currentState === 'STUCK' || retryCount >= 2
        ? 'encouraging'
        : loopState.phase === 'mastered'
        ? 'celebratory'
        : userMessage.toLowerCase().match(/jaldi|fast|quick|exam|test kal|aaj exam/)
        ? 'urgent'
        : 'direct';

    // Model preference: Brain Core decides, not the router
    const modelPreference: FinalDecision['modelPreference'] =
      masteryLevel > 70 && currentState !== 'STUCK'
        ? 'accurate'
        : masteryLevel > 40
        ? 'balanced'
        : 'fast';

    // Model routing: Brain Core passes preference to tracker
    const isUrgent = tone === 'urgent' || currentState === 'STUCK' || inferredState.emotion === 'frustrated';
    const complexityTier = modelPreference === 'accurate' ? 'powerful' : modelPreference === 'balanced' ? 'balanced' : 'fast';
    const modelDecision = modelPerformanceTracker.getRoutingDecision(complexityTier, isUrgent);

    // Retry strategy: intelligent fallback if current strategy fails
    const retryStrategy = computeRetryStrategy(topStrategy, inferredState);

    // Weak / strong topics from long-term memory only
    const weakTopics         = memory?.weakConcepts.map(c => c.concept)   ?? [];
    const strongTopics       = memory?.strongConcepts.map(c => c.concept) ?? [];
    const masteredThisSession = teachingLoopEngine.getMasteredTopics(userId);

    const memoryBlock = retrieval?.promptBlock ?? '';

    const systemPromptAddition = buildSystemPromptAddition({
      inferredState,
      loopPhase:       loopState.phase,
      teachingHint:    teachingLoopEngine.getPhasePromptHint(userId),
      memoryBlock,
      weakTopics,
      strongTopics,
      strategy:        finalStrategy,
      tone,
      difficultyLevel,
    });

    const strategyReason = strategyScores[0]
      ? `${topStrategy} scored ${strategyScores[0].score.toFixed(2)} (data-driven)`
      : `${topStrategy} (default)`;

    logger.info(
      {
        userId,
        strategy:   finalStrategy,
        model:      modelDecision.modelId,
        phase:      loopState.phase,
        emotion:    inferredState.emotion,
        difficulty: difficultyLevel,
        tone,
        ms: Date.now() - startMs,
      },
      '[BrainCore v2] FinalDecision built',
    );

    return {
      strategy:            finalStrategy,
      strategyScores,
      strategyReason,
      teachingMode:        loopState.phase !== 'idle',
      teachingPhase:       loopState.phase,
      shouldAskCheckQ:     loopState.phase === 'checking',
      checkQuestion:       loopState.checkQuestion,
      difficultyLevel,
      tone,
      modelPreference,
      modelDecision,
      followUpRequired:    topStrategy !== 'QUIZ' && topStrategy !== 'SHORT' && loopState.phase !== 'checking',
      retryStrategy,
      inferredState,
      weakTopics,
      strongTopics,
      masteredThisSession,
      systemPromptAddition,
      memoryBlock,
      processedAt: new Date().toISOString(),
      brainVersion: 'v2',
    };
  },

  /**
   * afterResponse — call AFTER AI response is streamed.
   *
   * Steps 9–11: Advance teaching loop, update strategy scores, store memory.
   * This closes the adaptive learning cycle for this turn.
   */
  async afterResponse(
    userId:      string,
    sessionId:   string,
    userMessage: string,
    aiResponse:  string,
    decision:    FinalDecision,
    topic:       string | null,
    subject:     string,
    turnCount:   number,
    retryCount:  number,
    outcome?: { success: boolean; correctness?: number },
  ): Promise<void> {

    // STEP 9: Advance teaching phase
    try {
      await teachingLoopEngine.advance({
        userId, userMessage, aiResponse,
        topic, strategy: decision.strategy, turnCount, retryCount,
      });
    } catch (err: any) {
      logger.warn({ userId, err: err.message }, '[BrainCore v2] Teaching loop advance failed (non-fatal)');
    }

    // STEP 10: Record strategy outcome for future scoring
    // signature: recordOutcome(userId, strategy, success)
    if (outcome) {
      strategyScoringEngine.recordOutcome(
        userId,
        decision.strategy,
        outcome.success,
      ).catch((err: any) => {
        logger.warn({ userId, err: err.message }, '[BrainCore v2] Strategy record failed (non-fatal)');
      });
    }

    // STEP 11: Record mistakes in long-term memory
    // signature: recordMistake(userId, topic, subject, question, errorType?)
    if (outcome && !outcome.success && topic) {
      longTermMemoryEngine.recordMistake(
        userId,
        topic,
        subject,
        `Struggled with: ${topic} (strategy: ${decision.strategy})`,
        'conceptual',
      ).catch((err: any) => {
        logger.warn({ userId, err: err.message }, '[BrainCore v2] Memory record failed (non-fatal)');
      });
    }

    // STEP 12: Refresh metrics cache every 5th turn (fire-and-forget)
    if (turnCount % 5 === 0) {
      metricsEngine.computeForUser(userId)
        .then(() => {
          _optCache.delete(userId);
          logger.info({ userId }, '[BrainCore v2] Metrics refreshed, opt cache busted');
        })
        .catch((err: any) => {
          logger.warn({ userId, err: err.message }, '[BrainCore v2] Metrics refresh failed (non-fatal)');
        });
    }
  },

  /**
   * process() — backward-compatibility alias for processRequest().
   * Existing callers using the v1 API continue to work.
   * Returns FinalDecision which is a superset of the old BrainOutput interface.
   */
  async process(input: BrainInput): Promise<FinalDecision> {
    return this.processRequest(input);
  },
};

// ─────────────────────────────────────────────────────────────
// Retry Strategy Selector (pure function — no I/O)
// ─────────────────────────────────────────────────────────────
function computeRetryStrategy(
  current: TeachingStrategy,
  state:   InferredUserState,
): TeachingStrategy | null {
  if (!state.needsReexplain && state.emotion !== 'frustrated') return null;

  const retryMap: Partial<Record<TeachingStrategy, TeachingStrategy>> = {
    'TEACH':         'SIMPLIFY',
    'SIMPLIFY':      'STEP_BY_STEP',
    'STEP_BY_STEP':  'GUIDE',
    'GUIDE':         'ENCOURAGE',
    'HINT':          'TEACH',
    'CHALLENGE':     'TEACH',
    'QUIZ':          'ENCOURAGE',
    'FULL_SOLUTION': 'STEP_BY_STEP',
    'SHORT':         'TEACH',
    'ENCOURAGE':     'SIMPLIFY',
  };
  return retryMap[current] ?? 'ENCOURAGE';
}

// ─────────────────────────────────────────────────────────────
// System Prompt Builder — concise, targeted, no context flood
// ─────────────────────────────────────────────────────────────
interface PromptBuildInput {
  inferredState:   InferredUserState;
  loopPhase:       TeachingPhase;
  teachingHint:    string;
  memoryBlock:     string;
  weakTopics:      string[];
  strongTopics:    string[];
  strategy:        TeachingStrategy;
  tone:            FinalDecision['tone'];
  difficultyLevel: FinalDecision['difficultyLevel'];
}

function buildSystemPromptAddition(input: PromptBuildInput): string {
  const {
    inferredState, teachingHint, memoryBlock,
    weakTopics, strongTopics, strategy, tone, difficultyLevel,
  } = input;

  const lines: string[] = [];

  // Student state (only shown when non-neutral — no noise)
  if (inferredState.emotion !== 'neutral') {
    lines.push(
      `[STUDENT STATE] ${inferredState.emotion.toUpperCase()} ` +
      `(confidence: ${Math.round(inferredState.confusionScore * 100)}%)`,
    );
  }

  // Authoritative strategy
  lines.push(`[STRATEGY] ${strategy}`);

  const strategyHints: Partial<Record<TeachingStrategy, string>> = {
    'SIMPLIFY':      'Break this to simplest possible level. Plain language. No jargon.',
    'STEP_BY_STEP':  'Number each step. One concept per step. Never skip steps.',
    'HINT':          'Give a hint only — do NOT reveal full answer. Let student think.',
    'CHALLENGE':     'Student is ready for harder content. Push with a more complex angle.',
    'ENCOURAGE':     'Be warm FIRST. Acknowledge struggle, THEN explain.',
    'QUIZ':          'End response with a comprehension-check question.',
    'GUIDE':         'Ask guiding questions to lead student to the answer themselves.',
    'SHORT':         'Brief and direct. 2–4 lines max.',
    'TEACH':         'Full concept explanation with one concrete real-world example.',
    'FULL_SOLUTION': 'Complete solution. Show every step. Leave nothing implicit.',
  };

  const hint = strategyHints[strategy];
  if (hint) lines.push(`Strategy guidance: ${hint}`);

  // Tone directive
  const toneHints: Record<FinalDecision['tone'], string> = {
    'warm':         '[TONE] Warm and patient — student is confused. Be a calm guide.',
    'encouraging':  '[TONE] Encouraging — student is struggling. Start with acknowledgment.',
    'direct':       '[TONE] Clear and direct — student is focused. No padding.',
    'urgent':       '[TONE] Fast and efficient — exam mode. Key points only.',
    'celebratory':  '[TONE] Celebratory — student has mastered this! Then offer the next step.',
  };
  lines.push(toneHints[tone]);

  // Difficulty directive
  const difficultyNotes: Record<FinalDecision['difficultyLevel'], string> = {
    beginner:     '[LEVEL] Beginner — simple words, daily-life analogies, no assumed knowledge.',
    intermediate: '[LEVEL] Intermediate — moderate complexity, some prior knowledge assumed.',
    advanced:     '[LEVEL] Advanced — can handle technical depth and edge cases.',
  };
  lines.push(difficultyNotes[difficultyLevel]);

  // Teaching phase hint
  if (teachingHint) lines.push(teachingHint);

  // Relevant memory (only what's useful for THIS turn)
  if (memoryBlock) lines.push(memoryBlock);

  // Weak topics (max 3 — no context flood)
  if (weakTopics.length > 0) {
    lines.push(`[ATTENTION] Student struggles with: ${weakTopics.slice(0, 3).join(', ')}. Be extra clear.`);
  }

  // Strong topics — avoid over-explaining
  if (strongTopics.length > 0) {
    lines.push(`[NOTE] Student knows: ${strongTopics.slice(0, 3).join(', ')}. Don't over-explain.`);
  }

  // Re-explain flag
  if (inferredState.needsReexplain) {
    lines.push("[REEXPLAIN] Student didn't understand. Use a DIFFERENT approach — new analogy, new angle.");
  }

  return lines.join('\n');
}