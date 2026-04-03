/**
 * AI Study OS — Streak Manager (Stage 7 — Retention Engine)
 * ─────────────────────────────────────────────────────────────
 * Manages user streaks:
 *   - Calculate current streak
 *   - Detect streak break (lastActive > 24h)
 *   - Detect streak at risk (lastActive > 20h)
 *   - Update streak on activity
 *   - Persist streak to User model
 */

import { User }           from '../../models/User.model.js';
import { logger }         from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export interface StreakStatus {
  userId:         string;
  currentStreak:  number;
  lastActive:     Date | null;
  hoursSinceLast: number;
  isActive:       boolean;      // studied today
  isBroken:       boolean;      // > 48h gap  → streak reset
  isAtRisk:       boolean;      // 20–47h gap → warning
  hoursRemaining: number;       // hours until streak breaks (0 if broken)
  streakSavedToday: boolean;    // already did recovery task today
}

export interface StreakUpdateResult {
  success:        boolean;
  newStreak:      number;
  wasRestored:    boolean;      // came from broken state
  xpAwarded:      number;
  message:        string;
}

// ── Helpers ────────────────────────────────────────────────────

function getISTDateKey(date: Date): string {
  // IST = UTC+5:30
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().split('T')[0];
}

function hoursBetween(a: Date, b: Date): number {
  return Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60);
}

// ── Core Functions ─────────────────────────────────────────────

/**
 * getStreakStatus — Read-only snapshot of user's streak health
 */
export async function getStreakStatus(userId: string): Promise<StreakStatus> {
  try {
    const user = await User.findById(userId).select('streak lastActive').lean();

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    const now          = new Date();
    const lastActive   = user.lastActive ? new Date(user.lastActive) : null;
    const hoursSince   = lastActive ? hoursBetween(lastActive, now) : 9999;
    const todayKey     = getISTDateKey(now);
    const lastKey      = lastActive ? getISTDateKey(lastActive) : null;

    const isActive        = lastKey === todayKey;
    const isBroken        = hoursSince > 48;
    const isAtRisk        = !isActive && hoursSince >= 20 && hoursSince <= 48;
    const hoursUntilBreak = isBroken ? 0 : Math.max(0, 48 - hoursSince);

    return {
      userId,
      currentStreak:    user.streak ?? 0,
      lastActive,
      hoursSinceLast:   Math.round(hoursSince * 10) / 10,
      isActive,
      isBroken,
      isAtRisk,
      hoursRemaining:   Math.round(hoursUntilBreak * 10) / 10,
      streakSavedToday: isActive,
    };
  } catch (err) {
    logger.error({ userId, err }, '[StreakManager] getStreakStatus failed');
    throw err;
  }
}

/**
 * updateStreak — Called whenever user completes an activity.
 * Increments streak if new day, awards XP, handles restoration.
 */
export async function updateStreak(userId: string): Promise<StreakUpdateResult> {
  try {
    const user = await User.findById(userId).select('streak lastActive points totalXP');

    if (!user) throw new Error(`User ${userId} not found`);

    const now        = new Date();
    const lastActive = user.lastActive ? new Date(user.lastActive) : null;
    const hoursSince = lastActive ? hoursBetween(lastActive, now) : 9999;
    const todayKey   = getISTDateKey(now);
    const lastKey    = lastActive ? getISTDateKey(lastActive) : null;

    let newStreak    = user.streak ?? 0;
    let wasRestored  = false;
    let xpAwarded    = 0;
    let message      = '';

    if (lastKey === todayKey) {
      // Already active today — no change needed
      return {
        success: true,
        newStreak,
        wasRestored: false,
        xpAwarded: 0,
        message: 'Streak already updated today',
      };
    }

    if (hoursSince <= 48) {
      // Normal next-day continuation
      newStreak   = newStreak + 1;
      xpAwarded   = 10 + Math.min(newStreak * 2, 50); // bonus scales with streak
      message     = `Streak extended to ${newStreak} days! 🔥`;
    } else {
      // Streak broken — reset to 1
      wasRestored = false;
      newStreak   = 1;
      xpAwarded   = 5;
      message     = 'Starting fresh — new streak begun!';
    }

    // Persist
    user.streak     = newStreak;
    user.lastActive = now;
    (user as any).points   = (user as any).points + xpAwarded;
    (user as any).totalXP  = (user as any).totalXP + xpAwarded;
    await user.save();

    logger.info({ userId, newStreak, xpAwarded }, '[StreakManager] Streak updated');

    return { success: true, newStreak, wasRestored, xpAwarded, message };
  } catch (err) {
    logger.error({ userId, err }, '[StreakManager] updateStreak failed');
    return { success: false, newStreak: 0, wasRestored: false, xpAwarded: 0, message: 'Update failed' };
  }
}

/**
 * restoreStreak — Called by StreakRecoverySystem after recovery task completed.
 * Restores streak to previous value instead of resetting to 1.
 */
export async function restoreStreak(userId: string, previousStreak: number): Promise<StreakUpdateResult> {
  try {
    const user = await User.findById(userId).select('streak lastActive points totalXP');
    if (!user) throw new Error(`User ${userId} not found`);

    const restoredStreak = previousStreak; // restore to what it was
    const xpAwarded      = 50;             // recovery bonus XP

    user.streak     = restoredStreak;
    user.lastActive = new Date();
    (user as any).points  = (user as any).points + xpAwarded;
    (user as any).totalXP = (user as any).totalXP + xpAwarded;
    await user.save();

    logger.info({ userId, restoredStreak }, '[StreakManager] Streak restored');

    return {
      success:     true,
      newStreak:   restoredStreak,
      wasRestored: true,
      xpAwarded,
      message:     `Streak restored to ${restoredStreak} days! +${xpAwarded} XP 🔥`,
    };
  } catch (err) {
    logger.error({ userId, err }, '[StreakManager] restoreStreak failed');
    return { success: false, newStreak: 0, wasRestored: false, xpAwarded: 0, message: 'Restore failed' };
  }
}

/**
 * breakStreak — Explicitly marks a streak as broken (used by cron).
 */
export async function breakStreak(userId: string): Promise<void> {
  try {
    await User.findByIdAndUpdate(userId, { streak: 0 });
    logger.info({ userId }, '[StreakManager] Streak marked as broken');
  } catch (err) {
    logger.error({ userId, err }, '[StreakManager] breakStreak failed');
  }
}

export const streakManager = {
  getStreakStatus,
  updateStreak,
  restoreStreak,
  breakStreak,
};