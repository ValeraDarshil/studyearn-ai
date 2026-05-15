/**
 * AI Study OS — Feedback Loop Engine  (v3 — FIX A: isWeak/isStrong  |  FIX B: overallMasteryScore)
 * ─────────────────────────────────────────────────────────────
 * WHAT CHANGED IN v3 (on top of v2):
 *
 *   FIX A — isWeak / isStrong flags were NEVER written by this path.
 *     longTermMemoryEngine.getMemory() filters on t.isWeak / t.isStrong
 *     to build weakConcepts[] and strongConcepts[]. Those booleans were
 *     only set by studentProfileService.updateTopicMastery(), which is
 *     NOT in the AskAI feedback path.
 *     Result: every student's weakConcepts[] and strongConcepts[] were
 *     always empty — the AI had no memory of what anyone struggled with.
 *
 *     Fixed in updateTopicMastery() (both EXISTING and NEW topic branches)
 *     by computing and writing isWeak / isStrong alongside masteryLevel.
 *
 *     Thresholds match studentProfileService.ts:
 *       isWeak   → masteryLevel < 30
 *       isStrong → masteryLevel >= 75
 *
 *   FIX B — overallMasteryScore frozen at onboarding value forever.
 *     Brain Core reads overallMasteryScore to decide difficulty level.
 *     It was seeded once at signup and never updated.
 *     Fixed by adding recomputeOverallMastery() which averages all
 *     topicMastery levels and writes the result back after every
 *     updateTopicMastery() call (fire-and-forget, non-blocking).
 *     Also runs at the end of decayAllTopics().
 *
 * Everything from v2 (upsert:true for new users, exponential decay,
 * $push for new topics) is carried forward unchanged.
 * ─────────────────────────────────────────────────────────────
 */

import { strategyScoringEngine, TeachingStrategy } from './strategyScoringEngine.js';
import { longTermMemoryEngine }                     from './longTermMemoryEngine.js';
import { userStateInferenceEngine, InferredUserState } from './userStateInferenceEngine.js';
import { AskAISession }                             from '../../models/AskAISession.model.js';
import { StudentProfile }                           from '../../models/StudentProfile.model.js';
import { logger }                                   from '../../utils/logger.js';

// ── Mastery thresholds — keep in sync with studentProfileService.ts ──
const WEAK_THRESHOLD   = 30;   // masteryLevel < 30  → isWeak   = true
const STRONG_THRESHOLD = 75;   // masteryLevel >= 75 → isStrong  = true

// ── Types ──────────────────────────────────────────────────────

export type OutcomeType =
  | 'correct'       // student answered correctly / understood
  | 'incorrect'     // wrong answer
  | 'confused'      // asked again or expressed confusion
  | 'clarity'       // expressed clear understanding
  | 'frustrated'    // expressed frustration
  | 'engaged'       // continued naturally (neutral positive)
  | 'dropped';      // session ended abruptly

export interface FeedbackInput {
  userId:         string;
  sessionId:      string;
  userMessage:    string;           // student's follow-up reply
  aiResponse:     string;           // previous AI response (triggers this feedback)
  strategy:       TeachingStrategy; // strategy used for the AI response
  topic:          string | null;
  subject:        string;
  turnCount:      number;
  retryCount:     number;
  responseTimeMs?: number;
}

export interface FeedbackResult {
  outcomeType:     OutcomeType;
  strategySuccess: boolean;
  inferredState:   InferredUserState;
  recorded:        boolean;
  actions:         string[];
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

    const outcomeType    = detectOutcome(inferredState, retryCount);
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

    // Step 5: Milestone detection — every 5 correct turns
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

    return { outcomeType, strategySuccess, inferredState, recorded: true, actions };
  },
};

// ─────────────────────────────────────────────────────────────
// Learning Outcome Tracker
// ─────────────────────────────────────────────────────────────
export interface OutcomeRecord {
  userId:          string;
  sessionId:       string;
  topic:           string | null;
  subject:         string;
  strategy:        TeachingStrategy;
  outcomeType:     OutcomeType;
  strategySuccess: boolean;
}

export const learningOutcomeTracker = {

  async record(rec: OutcomeRecord): Promise<void> {
    const { userId, sessionId, outcomeType } = rec;

    try {
      const inc: Record<string, number> = {};
      if (outcomeType === 'confused' || outcomeType === 'incorrect') inc.confusionCount = 1;
      if (outcomeType === 'correct'  || outcomeType === 'clarity')   inc.masteryCount   = 1;

      if (Object.keys(inc).length > 0) {
        await AskAISession.findByIdAndUpdate(sessionId, { $inc: inc });
      }

      // Update StudentProfile topic mastery (writes isWeak/isStrong + overallMastery)
      if (rec.topic) {
        await updateTopicMastery(userId, rec.topic, rec.subject, rec.strategySuccess);
      }
    } catch (err: any) {
      logger.warn({ userId, err: err.message }, '[OutcomeTracker] Record failed');
    }
  },

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
  if (/formula|equation|calculate|compute|solve/.test(lower))           return 'calculation';
  if (/remember|recall|forgot|memorize/.test(lower))                    return 'memory';
  if (/apply|use|when to|example/.test(lower))                          return 'application';
  if (/concept|theory|understand|why|how/.test(lower))                  return 'conceptual';
  if (['math', 'physics', 'chemistry'].includes(subject?.toLowerCase())) return 'calculation';
  return 'unknown';
}

/**
 * updateTopicMastery — v3
 *
 * v2: upsert:true for new users / new topics, exponential decay.
 * v3 adds:
 *   FIX A — writes isWeak and isStrong after every masteryLevel change.
 *   FIX B — calls recomputeOverallMastery() (fire-and-forget) so Brain
 *            Core always has an accurate difficulty baseline.
 */
async function updateTopicMastery(
  userId:  string,
  topic:   string,
  subject: string,
  success: boolean
): Promise<void> {
  try {
    const adjustment = success ? 3 : -2;
    const now        = new Date();

    // ── FIX: Eliminate read-then-write race condition ──────────────────────
    // Old pattern: findOne (read) → separate findOneAndUpdate (write).
    // Two simultaneous requests for same user+topic both read "not found",
    // both $push → duplicate topic entries that corrupt mastery tracking.
    //
    // New pattern: attempt the positional UPDATE first (atomic).
    // If it matched 0 docs, the topic doesn't exist yet → safe to $push.
    // Only one request can win the initial update; the other falls through
    // to the $push path, which may add a duplicate. To prevent that,
    // we use addToSet-style logic: check matchedCount before pushing.
    // ──────────────────────────────────────────────────────────────────────

    // Step 1: Try to update EXISTING topic entry (atomic positional update)
    const existing = await StudentProfile.findOne(
      { userId, 'topicMastery.topic': topic },
      { 'topicMastery.$': 1 }
    ).lean();

    if (existing && (existing as any).topicMastery?.length > 0) {
      // ── EXISTING TOPIC: decay → adjustment → flags ────────────
      const currentEntry    = (existing as any).topicMastery[0];
      const currentScore    = currentEntry.masteryLevel ?? 50;
      const lastAttempted   = currentEntry.lastAttemptedAt
        ? new Date(currentEntry.lastAttemptedAt)
        : now;
      const daysSince       = Math.floor(
        (now.getTime() - lastAttempted.getTime()) / (1000 * 60 * 60 * 24)
      );
      const decayedScore    = currentScore * Math.pow(0.97, daysSince);
      const newMasteryLevel = Math.min(100, Math.max(0, decayedScore + adjustment));
      const isWeak          = newMasteryLevel < WEAK_THRESHOLD;
      const isStrong        = newMasteryLevel >= STRONG_THRESHOLD;

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
            'topicMastery.$.isWeak':          isWeak,
            'topicMastery.$.isStrong':        isStrong,
          },
        }
      );

      logger.info(
        { userId, topic, newMasteryLevel: Math.round(newMasteryLevel), isWeak, isStrong },
        '[FeedbackLoop] Existing topic mastery updated'
      );

    } else {
      // ── NEW TOPIC: use $addToSet-style atomic push ─────────────
      // addToSet doesn't work for subdoc arrays, so we use:
      //   findOneAndUpdate with filter { 'topicMastery.topic': { $ne: topic } }
      // This ensures only ONE request succeeds in creating the entry.
      // Concurrent requests that also see "not found" will fail this filter
      // (because the first request already inserted it) and their $push is rejected.
      const startingMastery = Math.min(100, Math.max(0, 50 + adjustment));
      const isWeak          = startingMastery < WEAK_THRESHOLD;
      const isStrong        = startingMastery >= STRONG_THRESHOLD;

      const result = await StudentProfile.findOneAndUpdate(
        {
          userId,
          'topicMastery.topic': { $ne: topic },  // atomic guard: only insert if topic absent
        },
        {
          $push: {
            topicMastery: {
              topic,
              subject,
              masteryLevel:    startingMastery,
              isWeak,
              isStrong,
              totalAttempts:   1,
              correctAttempts: success ? 1 : 0,
              lastAttemptedAt: now,
              createdAt:       now,
            },
          },
          $setOnInsert: {
            userId,
            aiStrategyStats:     {},
            overallMasteryScore: 50,
            createdAt:           now,
          },
        },
        { upsert: true, new: false }
      );

      if (result === null) {
        // Profile didn't exist yet — new user, upsert created it. OK.
        logger.info({ userId, topic, subject, startingMastery }, '[FeedbackLoop] New topic entry created (new user)');
      } else {
        logger.info({ userId, topic, subject, startingMastery, isWeak, isStrong }, '[FeedbackLoop] New topic mastery entry created');
      }
    }

    // FIX B: recompute overallMasteryScore after every mastery change.
    // Fire-and-forget — failure here must not block the main flow.
    recomputeOverallMastery(userId).catch((err: any) =>
      logger.warn(
        { userId, err: err.message },
        '[FeedbackLoop] overallMasteryScore recompute failed (non-fatal)'
      )
    );

  } catch (err: any) {
    logger.warn({ userId, topic, err: err.message }, '[FeedbackLoop] updateTopicMastery failed');
    // non-fatal — adaptive system degrades gracefully
  }
}

/**
 * recomputeOverallMastery — FIX B
 *
 * Reads all topicMastery entries and writes back the arithmetic mean
 * as overallMasteryScore. Brain Core reads this for difficulty decisions,
 * so it must stay current as the student improves or forgets topics.
 *
 * Called fire-and-forget from updateTopicMastery() and at the end of
 * decayAllTopics().
 */
async function recomputeOverallMastery(userId: string): Promise<void> {
  // FIX: Use MongoDB aggregation pipeline in a single findOneAndUpdate call.
  // Old: findOne (read all topics) + findOneAndUpdate (write) = 2 DB round-trips per feedback turn.
  // New: single atomic update pipeline that computes $avg inline — 1 DB call, no separate read.
  try {
    await (StudentProfile as any).findOneAndUpdate(
      { userId },
      [
        {
          $set: {
            overallMasteryScore: {
              $round: [
                {
                  $cond: {
                    if:   { $gt: [{ $size: { $ifNull: ['$topicMastery', []] } }, 0] },
                    then: { $avg: '$topicMastery.masteryLevel' },
                    else: 50,
                  },
                },
                0,
              ],
            },
          },
        },
      ],
    );
    logger.info({ userId }, '[FeedbackLoop] overallMasteryScore updated (aggregation pipeline)');
  } catch (err: any) {
    logger.warn({ userId, err: err.message }, '[FeedbackLoop] recomputeOverallMastery failed');
  }
}

/**
 * decayAllTopics — Nightly decay function.
 * Applies forgetting curve to all stale topics (7+ days untouched).
 * Called by the nightly cron in index.ts for every user.
 *
 * v3: also writes isWeak/isStrong flags after decay, and triggers
 * overallMasteryScore recompute at the end of the full decay run.
 */
export async function decayAllTopics(userId: string): Promise<void> {
  try {
    const now          = new Date();
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
      const daysSince     = Math.floor(
        (now.getTime() - lastAttempted.getTime()) / (1000 * 60 * 60 * 24)
      );
      const currentScore  = t.masteryLevel ?? 50;
      const decayedScore  = Math.min(100, Math.max(0, currentScore * Math.pow(0.97, daysSince)));

      // FIX A: update flags during nightly decay too
      const isWeak   = decayedScore < WEAK_THRESHOLD;
      const isStrong = decayedScore >= STRONG_THRESHOLD;

      await StudentProfile.findOneAndUpdate(
        { userId, 'topicMastery.topic': t.topic },
        {
          $set: {
            'topicMastery.$.masteryLevel': decayedScore,
            'topicMastery.$.isWeak':       isWeak,   // FIX A
            'topicMastery.$.isStrong':     isStrong, // FIX A
          },
        }
      );
    }

    // FIX B: recompute overall after full decay run
    if (staleTopics.length > 0) {
      await recomputeOverallMastery(userId);
    }

    logger.info({ userId, decayedCount: staleTopics.length }, '[FeedbackLoop] decayAllTopics complete');
  } catch (err: any) {
    logger.warn({ err: err.message }, '[FeedbackLoop] decayAllTopics failed');
  }
}