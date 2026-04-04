/**
 * AI Study OS — Emotional AI Merge (Stage 7 Advanced)
 * ─────────────────────────────────────────────────────────────
 * Merges Retention Engine urgency detection with AI Mentor
 * emotional message generation.
 *
 * BEFORE: Retention sends generic "Your streak ends in 2h!"
 * AFTER:  AI Mentor writes the notification body → personalized
 *         e.g. "Arjun, 7 din ki mehnat mat jaane do yaar! 🔥"
 *
 * USED BY:
 *   retentionEngine.ts     → mergeEmotionalAI() in Step 5
 *   retentionController.ts → mergeEmotionalAIOnRecovery() after completeRecovery
 */

import { runAIMentor }                          from '../aiMentor/aiMentorEngine.js';
import { notificationEngine, AppNotification, NotificationType } from './notificationEngine.js';
import { UrgencyReport }                        from './urgencyEngine.js';
import { RecoveryStatus }                       from './streakRecoverySystem.js';
import { logger }                               from '../../utils/logger.js';

// ── Map urgency level → Mentor trigger type ───────────────────
// We use forceRun + manual trigger to bypass timing check
const URGENCY_LEVELS_TO_NOTIFY = new Set(['critical', 'high', 'medium']);

// ─────────────────────────────────────────────────────────────
// mergeEmotionalAI
// Called inside retentionEngine.runRetentionEngine() at Step 5
// ─────────────────────────────────────────────────────────────
export async function mergeEmotionalAI(
  userId:         string,
  urgencyReport:  UrgencyReport,
  recoveryStatus: RecoveryStatus,
): Promise<{ mentorFired: boolean; mentorMessage: string | null; notifSent: boolean }> {

  const level = urgencyReport?.level ?? 'none';

  if (!URGENCY_LEVELS_TO_NOTIFY.has(level)) {
    return { mentorFired: false, mentorMessage: null, notifSent: false };
  }

  try {
    // ── 1. Run AI Mentor ──────────────────────────────────
    // forceRun: true bypasses the timing/schedule check
    // trigger: 'manual' so it doesn't log as a scheduled run
    const mentorResult = await runAIMentor(userId, {
      trigger:  'manual',
      forceRun: true,
    });

    if (!mentorResult?.fired || !mentorResult?.message) {
      logger.info({ userId, level }, '[EmotionalAIMerge] Mentor skipped — using generic notif');
      return { mentorFired: false, mentorMessage: null, notifSent: false };
    }

    const mentorMsg = mentorResult.message;

    // ── 2. Build AppNotification with Mentor's personalized body ──
    const notif = _buildEmotionalNotification(userId, mentorMsg, urgencyReport, recoveryStatus);

    // ── 3. Send via personalized notification engine ──────
    const delivery = await notificationEngine.sendPersonalizedRetentionNotification(
      userId,
      'AI_MENTOR_MESSAGE',
      notif,
    );

    logger.info(
      { userId, level, notifSent: delivery.success && !delivery.skipped },
      '[EmotionalAIMerge] Complete',
    );

    return {
      mentorFired:   true,
      mentorMessage: mentorMsg.body ?? null,
      notifSent:     delivery.success && !delivery.skipped,
    };

  } catch (err: any) {
    // Non-critical — retentionEngine falls back to generic notif
    logger.error({ userId, level, err }, '[EmotionalAIMerge] Failed — using generic fallback');
    return { mentorFired: false, mentorMessage: null, notifSent: false };
  }
}

// ─────────────────────────────────────────────────────────────
// mergeEmotionalAIOnRecovery
// Called in retentionController.ts after completeRecovery succeeds
// Sends a Mentor celebration message — fire-and-forget
// ─────────────────────────────────────────────────────────────
export async function mergeEmotionalAIOnRecovery(
  userId:         string,
  recoveryResult: { success: boolean; newStreak: number; xpAwarded: number; message: string },
): Promise<void> {
  if (!recoveryResult?.success) return;

  try {
    const mentorResult = await runAIMentor(userId, {
      trigger:  'manual',
      forceRun: true,
    });

    if (!mentorResult?.fired || !mentorResult?.message) return;

    const mentorMsg = mentorResult.message;

    const notif: AppNotification = {
      id:        `${userId}_recovery_celebrate_${Date.now()}`,
      userId,
      type:      'AI_MENTOR_MESSAGE' as NotificationType,
      title:     `🔥 Streak Restored — ${recoveryResult.newStreak} days!`,
      message:   mentorMsg.body ?? `Amazing! You recovered your streak. +${recoveryResult.xpAwarded} XP!`,
      icon:      '🔥',
      ctaText:   mentorMsg.cta ?? 'Keep Going',
      ctaAction: 'continue',
      isRead:    false,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 6 * 3600_000).toISOString(),
    };

    await notificationEngine.sendNotification(userId, notif, ['in_app']);

    logger.info(
      { userId, newStreak: recoveryResult.newStreak },
      '[EmotionalAIMerge] Recovery celebration sent',
    );
  } catch (err: any) {
    logger.error({ userId, err }, '[EmotionalAIMerge] mergeEmotionalAIOnRecovery failed');
  }
}

// ── Internal: Build AppNotification with Mentor message as body ──
function _buildEmotionalNotification(
  userId:         string,
  mentorMsg:      any,
  urgencyReport:  UrgencyReport,
  recoveryStatus: RecoveryStatus,
): AppNotification {
  const level             = urgencyReport.level;
  const streak            = urgencyReport.streakStatus?.currentStreak ?? 0;
  const isBroken          = urgencyReport.streakStatus?.isBroken ?? false;
  const recoveryAvailable = (recoveryStatus as any)?.state === 'available';

  const titleMap: Record<string, string> = {
    critical: isBroken ? `💔 Your streak ended` : `⚠️ Streak at risk!`,
    high:     `⚠️ ${streak}-day streak at risk!`,
    medium:   `🔥 Your AI Mentor says…`,
  };

  const ctaActionMap: Record<string, string> = {
    critical: recoveryAvailable ? 'streak_recovery' : 'continue',
    high:     'streak_save',
    medium:   'streak_save',
  };

  const ctaTextMap: Record<string, string> = {
    critical: recoveryAvailable ? '⚡ Recover My Streak' : 'Start Fresh',
    high:     '🔥 Save My Streak',
    medium:   'Study Now',
  };

  return {
    id:        `${userId}_emotional_${level}_${Date.now()}`,
    userId,
    type:      'AI_MENTOR_MESSAGE' as NotificationType,
    title:     titleMap[level]     ?? 'Your AI Mentor says…',
    message:   mentorMsg.body      ?? urgencyReport.message,   // ← personalized!
    icon:      isBroken ? '💔'    : (mentorMsg.emoji ?? '🔥'),
    ctaText:   ctaTextMap[level]   ?? 'Continue',
    ctaAction: ctaActionMap[level] ?? 'continue',
    isRead:    false,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 20 * 3600_000).toISOString(),
  };
}