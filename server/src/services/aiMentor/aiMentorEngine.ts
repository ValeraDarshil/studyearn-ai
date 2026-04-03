/**
 * AI Study OS — AI Mentor Engine (Stage 6 — Main Controller)
 * ─────────────────────────────────────────────────────────────
 * Orchestrates the complete AI Mentor flow.
 *
 * Flow:
 *   getUserState  (studentStateManager)
 *       ↓
 *   analyzeBehavior  (behaviorAnalyzer)
 *       ↓
 *   detectTriggers   (mentorTriggerEngine)
 *       ↓
 *   shouldFireNow?   (timing check + anti-spam)
 *       ↓
 *   generateMessage  (mentorMessageGenerator)
 *       ↓
 *   executeActions   (mentorActionEngine)
 *       ↓
 *   persist session  (AIMentorSession model)
 *       ↓
 *   return MentorResult (sent to UI / notification)
 *
 * Called by:
 *   mentorScheduler.ts   → every 6h cron
 *   auth.ts              → on login
 *   progressRoutes.ts    → on lesson/quiz complete
 *   mentorRoutes.ts      → manual trigger (GET /api/mentor/check)
 */

import { AIMentorSession }         from '../../models/AIMentorSession.model.js';
import { behaviorAnalyzer, BehaviorSnapshot } from './behaviorAnalyzer.js';
import { mentorTriggerEngine, MentorTrigger } from './mentorTriggerEngine.js';
import { mentorMessageGenerator, MentorMessage, MentorPersonality } from './mentorMessageGenerator.js';
import { mentorActionEngine, MentorActionResult } from './mentorActionEngine.js';
import { logger }                  from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export interface MentorRunOptions {
  trigger?:         'login' | 'quiz_complete' | 'lesson_complete' | 'cron' | 'manual';
  forceRun?:        boolean;    // bypass timing check
  personalityOverride?: MentorPersonality;
}

export interface MentorResult {
  fired:       boolean;
  skippedReason?: string;

  // Populated if fired = true
  message?:    MentorMessage;
  actions?:    MentorActionResult;
  trigger?:    MentorTrigger;
  snapshot?:   BehaviorSnapshot;

  userId:      string;
  executedAt:  string;
  executionMs: number;
}

// ── Anti-spam helpers ──────────────────────────────────────────

function resetDailyCountIfNeeded(session: any): void {
  const today = new Date().toISOString().split('T')[0];
  if (session.dailyResetDate !== today) {
    session.dailyTriggerCount = 0;
    session.dailyResetDate    = today;
  }
}

// ── Progressive mentor level ────────────────────────────────────
// Level increases every 10 triggers → richer insights over time
function calcMentorLevel(totalTriggers: number): number {
  return Math.min(Math.floor(totalTriggers / 10) + 1, 10);
}

// ── Main Engine ────────────────────────────────────────────────

export async function runAIMentor(
  userId:  string,
  options: MentorRunOptions = {},
): Promise<MentorResult> {

  const start = Date.now();

  try {
    // ── 1. Get or create mentor session ─────────────────────
    let session = await AIMentorSession.findOne({ userId });
    if (!session) {
      session = await AIMentorSession.create({ userId });
    }

    // ── 2. Analyze behavior ──────────────────────────────────
    const snapshot = await behaviorAnalyzer.analyzeBehavior(userId);

    // ── 3. Detect triggers ───────────────────────────────────
    const triggers = mentorTriggerEngine.detectTriggers(snapshot);

    if (!triggers.length) {
      return {
        fired:         false,
        skippedReason: 'No triggers detected',
        userId,
        executedAt:    new Date().toISOString(),
        executionMs:   Date.now() - start,
      };
    }

    const primaryTrigger = triggers[0]; // highest priority

    // ── 4. Timing check (skip if not forceRun) ───────────────
    if (!options.forceRun) {
      resetDailyCountIfNeeded(session);

      // Max 2 triggers per day
      if (session.dailyTriggerCount >= 2) {
        return {
          fired:         false,
          skippedReason: 'Daily trigger limit reached (2/day)',
          userId,
          executedAt:    new Date().toISOString(),
          executionMs:   Date.now() - start,
        };
      }

      // Timing / preferred hour check
      const shouldFire = mentorTriggerEngine.shouldFireNow(snapshot, session.lastFiredAt);
      if (!shouldFire) {
        return {
          fired:         false,
          skippedReason: 'Not optimal timing',
          userId,
          executedAt:    new Date().toISOString(),
          executionMs:   Date.now() - start,
        };
      }
    }

    // ── 5. Generate message ──────────────────────────────────
    const personality = options.personalityOverride ?? session.mentorPersonality;
    const message = await mentorMessageGenerator.generateMentorMessage(
      snapshot,
      primaryTrigger,
      personality,
    );

    // ── 6. Execute actions ───────────────────────────────────
    const actions = await mentorActionEngine.executeMentorActions(
      userId,
      snapshot,
      primaryTrigger,
      message,
    );

    // ── 7. Persist to session ────────────────────────────────
    session.lastFiredAt       = new Date();
    session.dailyTriggerCount = (session.dailyTriggerCount ?? 0) + 1;
    session.totalTriggersEver = (session.totalTriggersEver ?? 0) + 1;
    session.mentorLevel       = calcMentorLevel(session.totalTriggersEver);
    session.activeMicroTask   = actions.microTask;

    // Push to message history (keep last 30)
    const msgEntry = {
      triggerType:  message.triggerType,
      title:        message.title,
      body:         message.body,
      cta:          message.cta,
      emoji:        message.emoji,
      taskHint:     message.taskHint,
      microTask:    actions.microTask,
      quizAssigned: actions.quizAssigned,
      xpAwarded:    actions.xpAwarded,
      isRead:       false,
      isDismissed:  false,
      createdAt:    new Date(),
    };
    session.messages.push(msgEntry as any);
    if (session.messages.length > 30) {
      session.messages = session.messages.slice(-30) as any;
    }

    await session.save();

    logger.info({
      userId,
      trigger:  primaryTrigger.type,
      mentorLevel: session.mentorLevel,
      fired:    true,
    }, '[AIMentorEngine] Mentor fired');

    return {
      fired:      true,
      message,
      actions,
      trigger:    primaryTrigger,
      snapshot,
      userId,
      executedAt: new Date().toISOString(),
      executionMs: Date.now() - start,
    };

  } catch (err) {
    logger.error({ userId, err }, '[AIMentorEngine] Error');
    return {
      fired:         false,
      skippedReason: `Error: ${(err as any).message}`,
      userId,
      executedAt:    new Date().toISOString(),
      executionMs:   Date.now() - start,
    };
  }
}

// ── Helper: get current mentor state for a user ────────────────

export async function getMentorState(userId: string) {
  const session = await AIMentorSession.findOne({ userId }).lean();
  if (!session) return null;

  const unreadMessages = (session.messages as any[]).filter((m: any) => !m.isRead && !m.isDismissed);
  const latestMessage  = unreadMessages[unreadMessages.length - 1] ?? null;

  return {
    hasActiveMessage:   !!latestMessage,
    latestMessage,
    activeMicroTask:    session.activeMicroTask,
    mentorLevel:        session.mentorLevel,
    mentorPersonality:  session.mentorPersonality,
    unreadCount:        unreadMessages.length,
    lastFiredAt:        session.lastFiredAt,
    totalTriggersEver:  session.totalTriggersEver,
    totalTasksCompleted: session.totalTasksCompleted,
  };
}

// ── Helper: mark message as read / dismissed ──────────────────

export async function markMessageRead(userId: string, messageId: string): Promise<void> {
  await AIMentorSession.updateOne(
    { userId, 'messages._id': messageId },
    { $set: { 'messages.$.isRead': true } },
  );
}

export async function dismissMessage(userId: string, messageId: string): Promise<void> {
  await AIMentorSession.updateOne(
    { userId, 'messages._id': messageId },
    { $set: { 'messages.$.isDismissed': true } },
  );
}

// ── Helper: mark micro-task completed ────────────────────────

export async function completeMicroTask(userId: string): Promise<void> {
  await AIMentorSession.updateOne(
    { userId },
    {
      $set: { activeMicroTask: null },
      $inc: { totalTasksCompleted: 1 },
    },
  );
}

// ── Helper: update mentor personality ─────────────────────────

export async function updateMentorPersonality(
  userId:      string,
  personality: MentorPersonality,
): Promise<void> {
  await AIMentorSession.updateOne(
    { userId },
    { $set: { mentorPersonality: personality } },
    { upsert: true },
  );
}

export const aiMentorEngine = {
  runAIMentor,
  getMentorState,
  markMessageRead,
  dismissMessage,
  completeMicroTask,
  updateMentorPersonality,
};