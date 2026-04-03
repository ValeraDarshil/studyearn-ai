/**
 * AI Study OS — Streak Recovery System (Stage 7 — Retention Engine)
 * ─────────────────────────────────────────────────────────────
 * MOST IMPORTANT: Gives user ONE chance to recover a broken streak.
 *
 * Recovery Methods:
 *   1. Complete 1 quick task   (any activity)
 *   2. Solve 1 quiz
 *   3. Watch 1 lesson
 *
 * Flow:
 *   initiateRecovery()  →  store pending recovery in DB (24h window)
 *   completeRecovery()  →  verify task done → restore streak → award XP
 *   getRecoveryStatus() →  check if recovery is available/pending/used
 *
 * Rules:
 *   - Only 1 recovery chance per streak break
 *   - Recovery window: 24 hours after break detected
 *   - Restores streak to last known value
 */

import { User }                           from '../../models/User.model.js';
import { StudentProfile }                  from '../../models/StudentProfile.model.js';
import { streakManager }                   from './streakManager.js';
import { rewardTriggerSystem }             from './rewardTriggerSystem.js';
import { logger }                          from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export type RecoveryMethod = 'task' | 'quiz' | 'lesson';

export type RecoveryState =
  | 'not_needed'        // streak is fine
  | 'available'         // streak broken, recovery not started
  | 'pending'           // recovery task assigned, waiting for completion
  | 'completed'         // successfully recovered
  | 'expired'           // 24h window passed without completing
  | 'already_used';     // used this session already

export interface RecoveryTask {
  method:       RecoveryMethod;
  title:        string;
  description:  string;
  xpReward:     number;
  icon:         string;
}

export interface RecoveryStatus {
  userId:          string;
  state:           RecoveryState;
  previousStreak:  number;
  recoveryTask?:   RecoveryTask;
  expiresAt?:      string;
  completedAt?:    string;
  message:         string;
}

// Recovery stored in user doc as a mixed field
interface RecoveryRecord {
  state:           RecoveryState;
  previousStreak:  number;
  initiatedAt:     string;
  expiresAt:       string;
  completedAt?:    string;
  method?:         RecoveryMethod;
}

// ── Recovery Task Catalog ──────────────────────────────────────

const RECOVERY_TASKS: Record<RecoveryMethod, RecoveryTask> = {
  task: {
    method:      'task',
    title:       'Complete 1 Quick Task',
    description: 'Ask AI a question, use any study tool, or complete a study planner task',
    xpReward:    50,
    icon:        '⚡',
  },
  quiz: {
    method:      'quiz',
    title:       'Solve 1 Quick Quiz',
    description: 'Answer at least 3 questions in a Daily Challenge',
    xpReward:    60,
    icon:        '🧩',
  },
  lesson: {
    method:      'lesson',
    title:       'Complete 1 Lesson',
    description: 'Finish any coding lesson section in CodeLearn',
    xpReward:    55,
    icon:        '📚',
  },
};

function pickRecoveryTask(streak: number): RecoveryTask {
  // Pick easiest task for longer streaks (more to lose = easier recovery)
  if (streak >= 30) return RECOVERY_TASKS.task;
  if (streak >= 10) return RECOVERY_TASKS.quiz;
  return RECOVERY_TASKS.lesson;
}

// ── Core Functions ─────────────────────────────────────────────

/**
 * getRecoveryStatus — Check current recovery state for a user
 */
export async function getRecoveryStatus(userId: string): Promise<RecoveryStatus> {
  try {
    const user = await User.findById(userId).select('streak lastActive').lean() as any;
    if (!user) throw new Error(`User ${userId} not found`);

    const recovery: RecoveryRecord | null = user.streakRecovery ?? null;
    const now = new Date();

    // No recovery record — check if streak is broken
    if (!recovery) {
      const hoursSince = user.lastActive
        ? (now.getTime() - new Date(user.lastActive).getTime()) / 3600000
        : 9999;

      if (hoursSince > 48 && (user.streak ?? 0) > 0) {
        return {
          userId,
          state:          'available',
          previousStreak: user.streak,
          recoveryTask:   pickRecoveryTask(user.streak),
          message:        `Your ${user.streak}-day streak ended. You have 24h to recover it!`,
        };
      }

      return {
        userId,
        state:          'not_needed',
        previousStreak: user.streak ?? 0,
        message:        'Streak is healthy — no recovery needed',
      };
    }

    // Has a recovery record
    const expired = now > new Date(recovery.expiresAt);

    if (recovery.state === 'completed') {
      return {
        userId,
        state:           'completed',
        previousStreak:  recovery.previousStreak,
        completedAt:     recovery.completedAt,
        message:         'Streak successfully recovered! 🔥',
      };
    }

    if (expired || recovery.state === 'expired') {
      return {
        userId,
        state:          'expired',
        previousStreak: recovery.previousStreak,
        message:        'Recovery window expired. Start a new streak!',
      };
    }

    if (recovery.state === 'pending' || recovery.state === 'available') {
      return {
        userId,
        state:          recovery.state,
        previousStreak: recovery.previousStreak,
        recoveryTask:   pickRecoveryTask(recovery.previousStreak),
        expiresAt:      recovery.expiresAt,
        message:        `Complete 1 task to restore your ${recovery.previousStreak}-day streak`,
      };
    }

    return {
      userId,
      state:          'not_needed',
      previousStreak: user.streak ?? 0,
      message:        'No recovery available',
    };

  } catch (err) {
    logger.error({ userId, err }, '[StreakRecovery] getRecoveryStatus failed');
    throw err;
  }
}

/**
 * initiateRecovery — Call when streak break is detected.
 * Opens a 24h recovery window.
 */
export async function initiateRecovery(userId: string): Promise<RecoveryStatus> {
  try {
    const user = await User.findById(userId).select('streak lastActive') as any;
    if (!user) throw new Error(`User ${userId} not found`);

    const existing: RecoveryRecord | null = user.streakRecovery ?? null;

    // Don't overwrite a pending/completed recovery
    if (existing && ['pending', 'completed'].includes(existing.state)) {
      return getRecoveryStatus(userId);
    }

    const previousStreak = user.streak ?? 0;
    const now            = new Date();
    const expiresAt      = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const record: RecoveryRecord = {
      state:          'available',
      previousStreak,
      initiatedAt:    now.toISOString(),
      expiresAt:      expiresAt.toISOString(),
    };

    user.streakRecovery = record;
    user.streak         = 0; // temporarily reset so user sees it's broken
    await user.save();

    logger.info({ userId, previousStreak }, '[StreakRecovery] Recovery initiated');

    return {
      userId,
      state:          'available',
      previousStreak,
      recoveryTask:   pickRecoveryTask(previousStreak),
      expiresAt:      expiresAt.toISOString(),
      message:        `Complete 1 task to restore your ${previousStreak}-day streak!`,
    };

  } catch (err) {
    logger.error({ userId, err }, '[StreakRecovery] initiateRecovery failed');
    throw err;
  }
}

/**
 * completeRecovery — Called when user finishes the recovery task.
 * Restores streak and awards bonus XP.
 */
export async function completeRecovery(userId: string, method: RecoveryMethod): Promise<{
  success: boolean;
  message: string;
  xpAwarded: number;
  newStreak: number;
}> {
  try {
    const user = await User.findById(userId) as any;
    if (!user) throw new Error(`User ${userId} not found`);

    const recovery: RecoveryRecord | null = user.streakRecovery ?? null;

    if (!recovery) {
      return { success: false, message: 'No recovery session found', xpAwarded: 0, newStreak: user.streak };
    }

    if (recovery.state === 'completed') {
      return { success: false, message: 'Recovery already completed', xpAwarded: 0, newStreak: user.streak };
    }

    if (new Date() > new Date(recovery.expiresAt)) {
      recovery.state = 'expired';
      user.streakRecovery = recovery;
      await user.save();
      return { success: false, message: 'Recovery window expired', xpAwarded: 0, newStreak: user.streak };
    }

    // Restore streak
    const task       = RECOVERY_TASKS[method];
    const xpAwarded  = task.xpReward;

    const restoreResult = await streakManager.restoreStreak(userId, recovery.previousStreak);

    // Mark recovery done
    recovery.state       = 'completed';
    recovery.completedAt = new Date().toISOString();
    recovery.method      = method;

    // Re-fetch user after restoreStreak saved it
    const updatedUser = await User.findById(userId) as any;
    if (updatedUser) {
      updatedUser.streakRecovery = recovery;
      await updatedUser.save();
    }

    // Trigger reward
    await rewardTriggerSystem.triggerReward(userId, 'streak_recovery', {
      streakValue: recovery.previousStreak,
      xpBonus:     xpAwarded,
    });

    logger.info({ userId, method, xpAwarded, newStreak: restoreResult.newStreak }, '[StreakRecovery] Completed');

    return {
      success:   true,
      message:   `🔥 Streak restored to ${recovery.previousStreak} days! +${xpAwarded} XP`,
      xpAwarded,
      newStreak: restoreResult.newStreak,
    };

  } catch (err) {
    logger.error({ userId, err }, '[StreakRecovery] completeRecovery failed');
    return { success: false, message: 'Recovery failed', xpAwarded: 0, newStreak: 0 };
  }
}

export const streakRecoverySystem = {
  getRecoveryStatus,
  initiateRecovery,
  completeRecovery,
};