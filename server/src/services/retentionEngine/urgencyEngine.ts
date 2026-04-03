/**
 * AI Study OS — Urgency Engine (Stage 7 — Retention Engine)
 * ─────────────────────────────────────────────────────────────
 * Detects time-sensitive situations and generates urgency messages.
 *
 * Triggers:
 *   lastActive > 20h  →  streakAtRisk = true
 *   lastActive > 36h  →  streakCritical = true
 *   lastActive > 48h  →  streakBroken = true
 *
 * Output:
 *   UrgencyReport with level, message, and countdown
 */

import { getStreakStatus, StreakStatus } from './streakManager.js';
import { logger }                        from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export type UrgencyLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface UrgencyReport {
  userId:       string;
  level:        UrgencyLevel;
  streakStatus: StreakStatus;
  message:      string;
  subMessage:   string;
  ctaText:      string;           // call-to-action button label
  ctaAction:    string;           // action type for frontend routing
  hoursLeft:    number;           // 0 if broken
  shouldNotify: boolean;
  generatedAt:  string;
}

// ── Message Templates ─────────────────────────────────────────

function buildUrgencyMessage(status: StreakStatus): {
  message: string;
  subMessage: string;
  ctaText: string;
  ctaAction: string;
} {
  const h = Math.floor(status.hoursRemaining);
  const m = Math.floor((status.hoursRemaining - h) * 60);
  const timeStr = h > 0 ? `${h}h ${m}m` : `${m} minutes`;

  if (status.isBroken) {
    return {
      message:    "Your streak ended 😔",
      subMessage: "Don't worry — one quick task and you're back on track!",
      ctaText:    "Restart My Streak",
      ctaAction:  "streak_recovery",
    };
  }

  if (status.isAtRisk && status.hoursRemaining <= 2) {
    return {
      message:    `⚠️ Your streak breaks in ${timeStr}!`,
      subMessage: `${status.currentStreak}-day streak at stake — save it now!`,
      ctaText:    "Save My Streak",
      ctaAction:  "streak_save",
    };
  }

  if (status.isAtRisk && status.hoursRemaining <= 6) {
    return {
      message:    `🔥 Streak alert — ${timeStr} left!`,
      subMessage: `Keep your ${status.currentStreak}-day streak alive!`,
      ctaText:    "Continue Learning",
      ctaAction:  "streak_save",
    };
  }

  if (status.isAtRisk) {
    return {
      message:    "Don't forget to study today!",
      subMessage: `Your ${status.currentStreak}-day streak is at risk.`,
      ctaText:    "Study Now",
      ctaAction:  "streak_save",
    };
  }

  return {
    message:    "Great work staying consistent!",
    subMessage: "Keep the streak going.",
    ctaText:    "Continue",
    ctaAction:  "continue",
  };
}

function calcLevel(status: StreakStatus): UrgencyLevel {
  if (status.isBroken)                             return 'critical';
  if (status.isAtRisk && status.hoursRemaining <= 2) return 'high';
  if (status.isAtRisk && status.hoursRemaining <= 6) return 'medium';
  if (status.isAtRisk)                              return 'low';
  return 'none';
}

// ── Main Export ────────────────────────────────────────────────

export async function checkUrgency(userId: string): Promise<UrgencyReport> {
  try {
    const status = await getStreakStatus(userId);
    const level  = calcLevel(status);
    const msgs   = buildUrgencyMessage(status);

    const shouldNotify = level === 'high' || level === 'critical' || level === 'medium';

    const report: UrgencyReport = {
      userId,
      level,
      streakStatus: status,
      message:      msgs.message,
      subMessage:   msgs.subMessage,
      ctaText:      msgs.ctaText,
      ctaAction:    msgs.ctaAction,
      hoursLeft:    status.hoursRemaining,
      shouldNotify,
      generatedAt:  new Date().toISOString(),
    };

    logger.info({ userId, level, hoursLeft: status.hoursRemaining }, '[UrgencyEngine] Report generated');
    return report;

  } catch (err) {
    logger.error({ userId, err }, '[UrgencyEngine] checkUrgency failed');
    throw err;
  }
}

/**
 * getBatchUrgency — Check multiple users at once (used by cron jobs)
 */
export async function getBatchUrgency(userIds: string[]): Promise<UrgencyReport[]> {
  const results = await Promise.allSettled(userIds.map(id => checkUrgency(id)));
  return results
    .filter((r): r is PromiseFulfilledResult<UrgencyReport> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter(r => r.level !== 'none');
}

export const urgencyEngine = {
  checkUrgency,
  getBatchUrgency,
};