/**
 * AI Study OS — Teaching Loop Engine  (GAP 6 FIX + AI Evaluator)
 * ─────────────────────────────────────────────────────────────
 * The AI currently explains once or twice with no mastery check.
 * This engine implements a full iterative teaching loop:
 *
 *   Explain → Ask Check Question → Evaluate Answer
 *     ↓ wrong: change strategy, retry
 *     ↓ correct: move forward / mark mastered
 *
 * Teaching phases:
 *   'idle'         → not in a teaching loop yet
 *   'explaining'   → AI just gave an explanation
 *   'checking'     → AI asked a comprehension check question
 *   'retry'        → student got it wrong, AI is re-explaining
 *   'mastered'     → student demonstrated understanding
 *
 * Session state is kept in-memory per user (no DB needed — it's
 * per-conversation and resets when session ends).
 *
 * Integration:
 *   • askAIOrchestrator.ts  → call teachingLoopEngine.advance() per turn
 *   • aiResponsePlanner.ts  → read teachingPhase to inform strategy
 *   • aiBrainCore.ts        → inject phase into system prompt context
 */

import { strategyScoringEngine, TeachingStrategy } from './strategyScoringEngine.js';
import { AskAISession }                             from '../../models/AskAISession.model.js';
import { userStateInferenceEngine }                 from './userStateInferenceEngine.js';
import { logger }                                   from '../../utils/logger.js';
import { solveText }                                from '../aiService.js';

// ── Types ──────────────────────────────────────────────────────

export type TeachingPhase =
  | 'idle'
  | 'explaining'
  | 'checking'
  | 'retry'
  | 'mastered';

export interface TeachingLoopState {
  userId:          string;
  phase:           TeachingPhase;
  topic:           string | null;
  currentStrategy: TeachingStrategy;
  attemptCount:    number;       // how many times AI has tried to explain this
  checkQuestion:   string | null; // the comprehension check question pending
  lastStrategyUsed: TeachingStrategy[];
  masteredTopics:  string[];
  phaseStartedAt:  number;
  updatedAt:       number;
}

export interface LoopAdvanceInput {
  userId:      string;
  userMessage: string;      // student's latest message
  aiResponse:  string;      // the AI's previous response (already sent)
  topic:       string | null;
  strategy:    TeachingStrategy;
  turnCount:   number;
  retryCount:  number;
}

export interface LoopAdvanceResult {
  newPhase:           TeachingPhase;
  nextStrategy:       TeachingStrategy;
  shouldAskCheckQ:    boolean;      // AI should append a check question
  checkQuestion:      string | null;
  phaseChanged:       boolean;
  masteryAchieved:    boolean;
  strategyChanged:    boolean;
  reason:             string;
}

// ── Session state store ───────────────────────────────────────
const loopStates = new Map<string, TeachingLoopState>();
const LOOP_IDLE_TIMEOUT_MS = 10 * 60 * 1000;  // 10 min inactivity → reset

// ─────────────────────────────────────────────────────────────
// AI Evaluator Helper
// Calls solveText() with the same structured prompt as
// POST /api/ai/evaluate-answer — used internally when phase = 'checking'
// Falls back to regex result if AI call fails or times out.
// ─────────────────────────────────────────────────────────────
interface AIEvalResult {
  isCorrect:    boolean;
  partialCredit: boolean;
  confidence:   number;
  feedbackHint: string;
  source:       'ai';
}

async function evaluateWithAI(
  studentAnswer: string,
  checkQuestion: string | null,
  topic: string | null
): Promise<AIEvalResult | null> {
  try {
    const qText = (checkQuestion || '').slice(0, 400);
    const aText = (studentAnswer || '').slice(0, 400);
    const prompt =
      `You are evaluating a student answer. Be strict but fair.\n` +
      `Question: "${qText}"\n` +
      `Student answered: "${aText}"\n` +
      `Topic: ${topic || 'general'}, Subject: general\n` +
      `Reply ONLY with valid JSON, no markdown:\n` +
      `{"result":"correct","feedback":"one short line"}\n` +
      `result must be: correct | incorrect | partial`;

    const raw   = await solveText(prompt, [], 'general');
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean) as { result?: string; feedback?: string };

    const result = parsed.result || 'incorrect';
    return {
      isCorrect:    result === 'correct',
      partialCredit: result === 'partial',
      confidence:   result === 'correct' ? 0.92 : result === 'partial' ? 0.6 : 0.88,
      feedbackHint: parsed.feedback || '',
      source:       'ai',
    };
  } catch (err: any) {
    logger.warn({ err: err?.message }, '[TeachingLoop] AI evaluator failed — falling back to regex');
    return null; // null = caller should fall back to regex result
  }
}

// ─────────────────────────────────────────────────────────────
// teachingLoopEngine
// ─────────────────────────────────────────────────────────────
export const teachingLoopEngine = {

  /**
   * getState — returns current loop state for a user.
   */
  getState(userId: string): TeachingLoopState {
    const existing = loopStates.get(userId);
    if (existing && (Date.now() - existing.updatedAt) < LOOP_IDLE_TIMEOUT_MS) {
      return existing;
    }
    return buildInitialState(userId);
  },

  /**
   * getStateAsync — like getState but also checks MongoDB if not in memory.
   * Use on first turn of a session to restore state after restart / cold start.
   */
  async getStateAsync(userId: string): Promise<TeachingLoopState> {
    const existing = loopStates.get(userId);
    if (existing && (Date.now() - existing.updatedAt) < LOOP_IDLE_TIMEOUT_MS) {
      return existing;
    }
    try {
      const session = await AskAISession
        .findOne({ userId })
        .sort({ lastMessageAt: -1 })
        .select('loopState')
        .lean();
      if (session?.loopState) {
        const restored = { ...(session.loopState as TeachingLoopState), updatedAt: Date.now() };
        loopStates.set(userId, restored);
        logger.info({ userId }, '[TeachingLoop] State restored from DB');
        return restored;
      }
    } catch (err: any) {
      logger.warn({ userId, err: err.message }, '[TeachingLoop] DB state load failed — using initial state');
    }
    return buildInitialState(userId);
  },

  /**
   * advance — main entry point. Called AFTER AI responds, with
   * the student's reply. Updates state and returns guidance for
   * what the AI should do next.
   */
  async advance(input: LoopAdvanceInput): Promise<LoopAdvanceResult> {
    const { userId, userMessage, aiResponse, topic, strategy, turnCount, retryCount } = input;

    const state     = this.getState(userId);
    const prevPhase = state.phase;

    // Infer student's state from their reply
    const inferred = userStateInferenceEngine.infer({
      message:      userMessage,
      turnCount,
      retryCount,
      lastTopic:    state.topic,
      currentTopic: topic,
    });

    let nextPhase    = state.phase;
    let nextStrategy = strategy;
    let shouldAskCheckQ = false;
    let masteryAchieved = false;
    let reason = '';

    // ── Phase transitions ────────────────────────────────────

    switch (state.phase) {

      case 'idle':
      case 'explaining': {
        if (inferred.masterySignal && !inferred.needsReexplain) {
          nextPhase = 'checking';
          shouldAskCheckQ = true;
          reason = 'Understanding signal → moving to check';
        } else if (inferred.needsReexplain || retryCount >= 2) {
          nextPhase    = 'retry';
          nextStrategy = await pickAlternativeStrategy(userId, strategy, state, 'STUCK', 40);
          reason = `Confusion detected → retry with ${nextStrategy}`;
        } else {
          nextPhase = 'explaining';
          reason = 'Continuing explanation phase';
        }
        break;
      }

      case 'checking': {
        // ── Step 1: regex baseline ────────────────────────────
        const regexResult = answerEvaluator.evaluate(userMessage, state.checkQuestion);

        // ── Step 2: AI evaluation ─────────────────────────────
        const aiResult = await evaluateWithAI(userMessage, state.checkQuestion, topic);

        // ── Step 3: Merge — AI wins if available, else regex ──
        const evaluation = aiResult ?? regexResult;

        logger.info(
          { userId, source: aiResult ? 'ai' : 'regex', isCorrect: evaluation.isCorrect, confidence: evaluation.confidence },
          '[TeachingLoop] checking phase evaluation'
        );

        if (evaluation.isCorrect) {
          nextPhase       = 'mastered';
          masteryAchieved = true;
          reason = `Correct answer (${aiResult ? 'AI' : 'regex'}) → mastery achieved`;
          if (topic) state.masteredTopics.push(topic);
        } else if (evaluation.partialCredit) {
          // Partial — re-explain but softer, not full STUCK penalty
          nextPhase    = 'retry';
          nextStrategy = await pickAlternativeStrategy(userId, strategy, state, 'STUCK', 50);
          reason = `Partial answer (${aiResult ? 'AI' : 'regex'}) → gentle retry with ${nextStrategy}`;
        } else {
          nextPhase    = 'retry';
          nextStrategy = await pickAlternativeStrategy(userId, strategy, state, 'STUCK', 30);
          reason = `Wrong answer (${aiResult ? 'AI' : 'regex'}) → retry with ${nextStrategy}`;
        }
        break;
      }

      case 'retry': {
        if (inferred.masterySignal) {
          nextPhase = 'checking';
          shouldAskCheckQ = true;
          reason = 'Understanding after retry → check again';
        } else if (state.attemptCount >= 3) {
          nextStrategy = 'SIMPLIFY';
          reason = `Max retries (${state.attemptCount}) → force SIMPLIFY`;
        } else {
          reason = 'Continuing retry phase';
        }
        break;
      }

      case 'mastered': {
        nextPhase = 'idle';
        reason = 'Topic mastered → reset to idle for next topic';
        break;
      }
    }

    // Update strategy history
    if (!state.lastStrategyUsed.includes(strategy)) {
      state.lastStrategyUsed.push(strategy);
    }

    // Update state
    const newState: TeachingLoopState = {
      ...state,
      phase:           nextPhase,
      topic:           topic ?? state.topic,
      currentStrategy: nextStrategy,
      attemptCount:    nextPhase === 'retry' ? state.attemptCount + 1 : 0,
      checkQuestion:   shouldAskCheckQ ? buildCheckQuestion(topic, aiResponse) : state.checkQuestion,
      updatedAt:       Date.now(),
    };

    loopStates.set(userId, newState);
    // FIX 4C+D: Await the DB write so state persists durably.
    // FIX 4D: RAM map is always updated above — current session keeps working
    // even if the DB write fails.
    try {
      await AskAISession.findOneAndUpdate(
        { userId },
        { $set: { loopState: newState } },
        { sort: { lastMessageAt: -1 }, new: false },
      );
    } catch (err: any) {
      logger.warn({ userId, err: err.message }, '[TeachingLoop] DB state persist failed (non-fatal)');
      // RAM already updated above — current session continues normally
    }

    const result: LoopAdvanceResult = {
      newPhase:    nextPhase,
      nextStrategy,
      shouldAskCheckQ,
      checkQuestion: newState.checkQuestion,
      phaseChanged:    nextPhase !== prevPhase,
      masteryAchieved,
      strategyChanged: nextStrategy !== strategy,
      reason,
    };

    logger.info(
      { userId, prevPhase, nextPhase, nextStrategy, masteryAchieved },
      '[TeachingLoop] Phase advanced'
    );

    return result;
  },

  /**
   * resetTopic — call when student switches to a new topic.
   */
  resetTopic(userId: string, newTopic: string): void {
    const state = this.getState(userId);
    loopStates.set(userId, {
      ...state,
      phase:           'idle',
      topic:           newTopic,
      attemptCount:    0,
      checkQuestion:   null,
      updatedAt:       Date.now(),
    });
  },

  /**
   * getMasteredTopics — for context injection.
   */
  getMasteredTopics(userId: string): string[] {
    return loopStates.get(userId)?.masteredTopics ?? [];
  },

  /**
   * getPhasePromptHint — returns a short instruction for the AI prompt
   * based on the current teaching phase.
   */
  getPhasePromptHint(userId: string): string {
    const phase = loopStates.get(userId)?.phase ?? 'idle';
    switch (phase) {
      case 'explaining': return 'You are in the EXPLANATION phase. Give a clear, structured explanation.';
      case 'checking':   return 'You are in the CHECK phase. End your response with a comprehension question.';
      case 'retry':      return 'Previous explanation did not work. Use a completely different approach — simpler, with a real-world example.';
      case 'mastered':   return 'Student has mastered this topic. Acknowledge and move forward.';
      default:           return '';
    }
  },
};

// ─────────────────────────────────────────────────────────────
// Answer Evaluator
// ─────────────────────────────────────────────────────────────
export interface AnswerEvaluation {
  isCorrect:    boolean;
  confidence:   number;   // 0–1
  partialCredit: boolean;
  feedbackHint: string;
  source:       'regex';
}

export const answerEvaluator = {

  /**
   * evaluate — lightweight heuristic answer checker (regex baseline).
   * Used as fallback when AI evaluator fails.
   */
  evaluate(studentAnswer: string, checkQuestion: string | null): AnswerEvaluation {
    const lower = studentAnswer.toLowerCase();

    const correctSignals = [
      /\b(yes|correct|right|exactly|true|indeed)\b/i,
      /\b(samajh gaya|samajh gayi|sahi hai|bilkul)\b/i,
      /\b(the answer is|it is|it's|that's|that is)\b/i,
    ];
    const negativeSignals = [
      /\b(no|wrong|incorrect|not sure|i don'?t know|idk)\b/i,
      /\b(confused|don'?t understand|still not)\b/i,
      /\b(nahi|galat|pata nahi)\b/i,
    ];

    const correctMatches  = correctSignals.filter(p => p.test(lower)).length;
    const negativeMatches = negativeSignals.filter(p => p.test(lower)).length;
    const isSubstantive   = studentAnswer.trim().length > 30;

    let isCorrect     = false;
    let confidence    = 0.5;
    let partialCredit = false;

    if (negativeMatches > 0) {
      isCorrect  = false;
      confidence = 0.7;
    } else if (correctMatches >= 2 || (correctMatches >= 1 && isSubstantive)) {
      isCorrect  = true;
      confidence = 0.75;
    } else if (isSubstantive && correctMatches === 0 && negativeMatches === 0) {
      isCorrect     = false;
      partialCredit = true;
      confidence    = 0.5;
    }

    const feedbackHint = isCorrect
      ? 'Student appears to have understood. Acknowledge and move forward.'
      : partialCredit
        ? 'Student attempted but may have partial understanding. Clarify the gap.'
        : 'Student appears stuck. Switch strategy entirely.';

    return { isCorrect, confidence, partialCredit, feedbackHint, source: 'regex' };
  },
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
async function pickAlternativeStrategy(
  userId:          string,
  currentStrat:    TeachingStrategy,
  state:           TeachingLoopState,
  currentStateKey: string,
  masteryLevel:    number
): Promise<TeachingStrategy> {
  const excluded = state.lastStrategyUsed;
  const top = await strategyScoringEngine.getTopStrategies({
    userId,
    currentState:      currentStateKey,
    masteryLevel,
    confusionSignal:   true,
    frustrationSignal: false,
    sessionStreak:     0,
    lastStrategy:      currentStrat,
  }, 5);
  const alternative = top.find(s => !excluded.includes(s.strategy));
  return alternative?.strategy ?? 'SIMPLIFY';
}

function buildCheckQuestion(topic: string | null, aiResponse: string): string {
  if (!topic) {
    return 'Can you explain this concept back to me in your own words?';
  }
  const sentences = aiResponse.split(/[.!?]/).filter(s => s.trim().length > 20);
  const key = sentences.slice(-2).join(' ').trim().slice(0, 80);
  return `Quick check: ${key ? `Based on what I explained about ${topic}` : `About ${topic}`}, can you tell me what you understood?`;
}

function buildInitialState(userId: string): TeachingLoopState {
  return {
    userId,
    phase:            'idle',
    topic:            null,
    currentStrategy:  'TEACH',
    attemptCount:     0,
    checkQuestion:    null,
    lastStrategyUsed: [],
    masteredTopics:   [],
    phaseStartedAt:   Date.now(),
    updatedAt:        Date.now(),
  };
}