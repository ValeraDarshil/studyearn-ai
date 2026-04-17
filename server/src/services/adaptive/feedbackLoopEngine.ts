/**
 * AI Study OS — Feedback Loop Engine  (v2 — FIX 2: upsert:true for new users)
 * ─────────────────────────────────────────────────────────────
 * WHAT CHANGED IN v2:
 *   updateTopicMastery() had a conditional write that silently skipped
 *   topic creation for new users. The existing entry query used an
 *   array-match approach that only updated if the topic already existed.
 *   For new users, no topic entry existed → nothing was written.
 *
 *   Fixed by splitting the write into two paths:
 *     1. If topic entry exists → update it (same as before, with decay)
 *     2. If topic entry does NOT exist → push a new entry ($push)
 *        with sensible starting values so the profile is built from
 *        the very first question.
 *
 * Everything else is unchanged from the original.
 * ─────────────────────────────────────────────────────────────
 */

import { strategyScoringEngine, TeachingStrategy } from './strategyScoringEngine.js';
import { longTermMemoryEngine }                     from './longTermMemoryEngine.js';
import { userStateInferenceEngine, InferredUserState } from './userStateInferenceEngine.js';
import { AskAISession }                             from '../../models/AskAISession.model.js';
import { StudentProfile }                           from '../../models/StudentProfile.model.js';
import { logger }                                   from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export type OutcomeType =
  | 'correct'       // student answered correctly / understood
  | 'incorrect'     // wrong answer
  | 'confused'      // asked again or expressed confusion
  | 'clarity'       // expressed clear understanding
  | 'frustrated'    // expressed frustration
  | 'engaged'       // continued naturally (neutral positive)
  | 'dropped';      // session ended abruptly (short session)

export interface FeedbackInput {
  userId:        string;
  sessionId:     string;
  userMessage:   string;        // the student's follow-up reply
  aiResponse:    string;        // the previous AI response (triggers this feedback)
  strategy:      TeachingStrategy; // strategy that was used for the AI response
  topic:         string | null;
  subject:       string;
  turnCount:     number;
  retryCount:    number;
  responseTimeMs?: number;
}

export interface FeedbackResult {
  outcomeType:    OutcomeType;
  strategySuccess: boolean;
  inferredState:  InferredUserState;
  recorded:       boolean;
  actions:        string[];  // what the engine did
}

// ─────────────────────────────────────────────────────────────
// feedbackLoopEngine
// ─────────────────────────────────────────────────────────────
export const feedbackLoopEngine = {

  /**
   * processOutcome — main entry point.
   * Called after every student reply to a previous AI response.
   */
  async processOutcome(input: FeedbackInput): Promise<FeedbackResult> {
    const {
      userId, sessionId, userMessage, aiResponse,
      strategy, topic, subject, turnCount, retryCount, responseTimeMs,
    } = input;

    const actions: string[] = [];

    // Step 1: Infer outcome from user's reply
    const inferredState = userStateInferenceEngine.infer({
      message:      userMessage,
      turnCount,
      retryCount,
      responseTimeMs,
      lastTopic:    topic,
      currentTopic: topic,
    });

    const outcomeType   = detectOutcome(inferredState, retryCount);
    const strategySuccess = isStrategySuccess(outcomeType);

    logger.info(
      { userId, strategy, outcomeType, strategySuccess },
      '[FeedbackLoop] Outcome detected'
    );

    // Step 2: Update strategy score
    try {
      await strategyScoringEngine.recordOutcome(userId, strategy, strategySuccess);
      actions.push(`strategy_score_updated(${strategy}:${strategySuccess ? 'success' : 'fail'})`);
    } catch (err: any) {
      logger.warn({ err: err.message }, '[FeedbackLoop] Strategy score update failed');
    }

    // Step 3: Record mistake if wrong/confused on a topic
    if (topic && (outcomeType === 'incorrect' || outcomeType === 'confused')) {
      try {
        const errorType = inferErrorType(userMessage, subject);
        await longTermMemoryEngine.recordMistake(userId, topic, subject, userMessage, errorType);
        actions.push(`mistake_recorded(${topic})`);
      } catch (err: any) {
        logger.warn({ err: err.message }, '[FeedbackLoop] Mistake record failed');
      }
    }

    // Step 4: Record learning outcome in session
    try {
      await learningOutcomeTracker.record({
        userId, sessionId, topic, subject, strategy, outcomeType, strategySuccess,
      });
      actions.push('outcome_tracked');
    } catch (err: any) {
      logger.warn({ err: err.message }, '[FeedbackLoop] Outcome tracking failed');
    }

    // Step 5: Milestone detection — 5 correct in a row → record milestone
    if (strategySuccess && turnCount > 0 && turnCount % 5 === 0) {
      try {
        await longTermMemoryEngine.recordMilestone(
          userId, 'streak',
          `Answered ${turnCount} questions correctly in this session`,
          turnCount
        );
        actions.push(`milestone_recorded(streak:${turnCount})`);
      } catch {
        // non-fatal
      }
    }

    return {
      outcomeType,
      strategySuccess,
      inferredState,
      recorded: true,
      actions,
    };
  },
};

// ─────────────────────────────────────────────────────────────
// Learning Outcome Tracker
// ─────────────────────────────────────────────────────────────
export interface OutcomeRecord {
  userId:         string;
  sessionId:      string;
  topic:          string | null;
  subject:        string;
  strategy:       TeachingStrategy;
  outcomeType:    OutcomeType;
  strategySuccess: boolean;
}

export const learningOutcomeTracker = {

  /**
   * record — persists outcome to AskAISession for analysis.
   */
  async record(rec: OutcomeRecord): Promise<void> {
    const { userId, sessionId, outcomeType } = rec;

    try {
      const inc: Record<string, number> = {};

      if (outcomeType === 'confused' || outcomeType === 'incorrect') {
        inc.confusionCount = 1;
      }
      if (outcomeType === 'correct' || outcomeType === 'clarity') {
        inc.masteryCount = 1;
      }

      if (Object.keys(inc).length > 0) {
        await AskAISession.findByIdAndUpdate(sessionId, { $inc: inc });
      }

      // Also update StudentProfile topic mastery incrementally
      if (rec.topic) {
        await updateTopicMastery(userId, rec.topic, rec.subject, rec.strategySuccess);
      }

    } catch (err: any) {
      logger.warn({ userId, err: err.message }, '[OutcomeTracker] Record failed');
    }
  },

  /**
   * getSessionStats — returns outcomes for a session.
   */
  async getSessionStats(sessionId: string): Promise<{
    confusionCount: number;
    masteryCount:   number;
    turnCount:      number;
    successRate:    number;
  }> {
    try {
      const session = await AskAISession.findById(sessionId)
        .select('confusionCount masteryCount turnCount')
        .lean();

      const confusion = (session as any)?.confusionCount ?? 0;
      const mastery   = (session as any)?.masteryCount   ?? 0;
      const turns     = (session as any)?.turnCount      ?? 1;

      return {
        confusionCount: confusion,
        masteryCount:   mastery,
        turnCount:      turns,
        successRate:    mastery / Math.max(1, turns),
      };
    } catch {
      return { confusionCount: 0, masteryCount: 0, turnCount: 0, successRate: 0 };
    }
  },
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function detectOutcome(state: InferredUserState, retryCount: number): OutcomeType {
  if (state.masterySignal && !state.needsReexplain) return 'clarity';
  if (state.emotion === 'frustrated')               return 'frustrated';
  if (state.emotion === 'confused')                 return 'confused';
  if (state.needsReexplain || retryCount >= 2)      return 'confused';
  if (state.confusionScore > 0.5)                   return 'confused';
  if (state.frustrationScore > 0.5)                 return 'frustrated';
  if (state.masterySignal)                          return 'correct';
  return 'engaged';
}

function isStrategySuccess(outcome: OutcomeType): boolean {
  return outcome === 'correct' || outcome === 'clarity' || outcome === 'engaged';
}

function inferErrorType(
  message: string,
  subject: string
): 'conceptual' | 'calculation' | 'memory' | 'application' | 'unknown' {
  const lower = message.toLowerCase();
  if (/formula|equation|calculate|compute|solve/.test(lower))  return 'calculation';
  if (/remember|recall|forgot|memorize/.test(lower))           return 'memory';
  if (/apply|use|when to|example/.test(lower))                 return 'application';
  if (/concept|theory|understand|why|how/.test(lower))         return 'conceptual';
  if (['math', 'physics', 'chemistry'].includes(subject.toLowerCase())) return 'calculation';
  return 'unknown';
}

/**
 * updateTopicMastery — FIX 2 (v2)
 *
 * Original code used a two-step approach:
 *   1. Query for existing topic entry
 *   2. If found: update it; if not found: SKIP
 *
 * The skip for missing topics meant new users never built a topic mastery
 * profile. Fixed by:
 *   - If topic entry EXISTS → update in-place with decay (same logic)
 *   - If topic entry DOES NOT EXIST → push a new entry with starting values
 *
 * This also handles new users who have no StudentProfile at all, via
 * upsert:true on the outer document write.
 */
async function updateTopicMastery(
  userId:  string,
  topic:   string,
  subject: string,
  success: boolean
): Promise<void> {
  try {
    const adjustment = success ? 3 : -2;

    // Check if this topic entry already exists in the user's profile
    const existingProfile = await StudentProfile.findOne(
      { userId, 'topicMastery.topic': topic },
      { 'topicMastery.$': 1 }
    ).lean();

    if (existingProfile && (existingProfile as any).topicMastery?.length > 0) {
      // ── EXISTING TOPIC: apply decay then adjustment ──────────
      const currentEntry = (existingProfile as any).topicMastery[0];
      const currentScore: number = currentEntry.masteryLevel ?? 50;
      const lastAttempted: Date  = currentEntry.lastAttemptedAt
        ? new Date(currentEntry.lastAttemptedAt)
        : new Date();

      const now = new Date();
      const daysSinceLastAttempt = Math.floor(
        (now.getTime() - lastAttempted.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Apply exponential decay (3% per day) then add adjustment
      const decayedScore    = currentScore * Math.pow(0.97, daysSinceLastAttempt);
      const newMasteryLevel = Math.min(100, Math.max(0, decayedScore + adjustment));

      await StudentProfile.findOneAndUpdate(
        { userId, 'topicMastery.topic': topic },
        {
          $inc: {
            'topicMastery.$.totalAttempts': 1,
            ...(success ? { 'topicMastery.$.correctAttempts': 1 } : {}),
          },
          $set: {
            'topicMastery.$.masteryLevel':    newMasteryLevel,
            'topicMastery.$.lastAttemptedAt': now,
          },
        }
      );
    } else {
      // ── FIX 2: NEW TOPIC (or new user) — create the entry ────
      // Use $push to add the topic entry. upsert:true on the outer
      // document ensures a new StudentProfile is created if one
      // doesn't exist yet (covers brand-new signups).
      const startingMastery = Math.min(100, Math.max(0, 50 + adjustment));

      await StudentProfile.findOneAndUpdate(
        { userId },
        {
          $push: {
            topicMastery: {
              topic,
              subject,
              masteryLevel:    startingMastery,
              totalAttempts:   1,
              correctAttempts: success ? 1 : 0,
              lastAttemptedAt: new Date(),
              createdAt:       new Date(),
            },
          },
          // Initialize top-level profile fields for new documents
          $setOnInsert: {
            userId,
            aiStrategyStats:     {},
            overallMasteryScore: 50,
            createdAt:           new Date(),
          },
        },
        {
          upsert: true,  // FIX 2: was missing — new users had no profile created
          new:    false,
        }
      );

      logger.info({ userId, topic, subject }, '[FeedbackLoop] New topic mastery entry created');
    }
  } catch (err: any) {
    logger.warn({ userId, topic, err: err.message }, '[FeedbackLoop] updateTopicMastery failed');
    // non-fatal — adaptive system degrades gracefully
  }
}

/**
 * decayAllTopics — Nightly decay function.
 * Applies forgetting curve to all stale topics for a user.
 * Called by the nightly cron in index.js for every user.
 * Only decays topics not attempted in 7+ days.
 */
export async function decayAllTopics(userId: string): Promise<void> {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const profile = await StudentProfile.findOne({ userId })
      .select('topicMastery')
      .lean();

    if (!profile || !(profile as any).topicMastery?.length) return;

    const staleTopics = ((profile as any).topicMastery as any[]).filter(
      (t) => !t.lastAttemptedAt || new Date(t.lastAttemptedAt) < sevenDaysAgo
    );

    for (const t of staleTopics) {
      const lastAttempted = t.lastAttemptedAt ? new Date(t.lastAttemptedAt) : sevenDaysAgo;
      const daysSince = Math.floor(
        (now.getTime() - lastAttempted.getTime()) / (1000 * 60 * 60 * 24)
      );
      const currentScore: number = t.masteryLevel ?? 50;
      const decayedScore = Math.min(100, Math.max(0, currentScore * Math.pow(0.97, daysSince)));

      await StudentProfile.findOneAndUpdate(
        { userId, 'topicMastery.topic': t.topic },
        { $set: { 'topicMastery.$.masteryLevel': decayedScore } }
      );
    }

    logger.info({ userId, decayedCount: staleTopics.length }, '[FeedbackLoop] decayAllTopics complete');
  } catch (err: any) {
    logger.warn({ err: err.message }, '[FeedbackLoop] decayAllTopics failed');
  }
}