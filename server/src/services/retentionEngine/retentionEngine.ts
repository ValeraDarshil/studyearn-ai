/**
 * AI Study OS — Retention Engine (Stage 7 — Main Controller)
 * ─────────────────────────────────────────────────────────────
 * Master controller for all retention systems.
 *
 * Full Flow:
 *   checkUserActivity
 *       ↓
 *   detectRisk (streakManager + urgencyEngine)
 *       ↓
 *   triggerRetentionAction
 *       ↓
 *   sendNotification (notificationEngine)
 *       ↓
 *   assignRecoveryTask (streakRecoverySystem)
 *       ↓
 *   triggerReward (rewardTriggerSystem)
 *
 * Called by:
 *   - auth.ts              → on every login
 *   - retentionRoutes.ts   → GET /api/retention/status
 *   - cronJob              → every 4h background sweep
 *   - activity events      → on lesson/quiz/task complete
 */

import { streakManager }                                from './streakManager.js';
import { urgencyEngine, UrgencyReport }                 from './urgencyEngine.js';
import { streakRecoverySystem, RecoveryStatus }         from './streakRecoverySystem.js';
import { comebackEngine, ComebackPlan }                 from './comebackEngine.js';
import { notificationEngine }                           from './notificationEngine.js';
import { rewardTriggerSystem }                          from './rewardTriggerSystem.js';
import { User }                                         from '../../models/User.model.js';
import { logger }                                       from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export type RetentionTrigger =
  | 'login'
  | 'activity_complete'
  | 'lesson_complete'
  | 'quiz_complete'
  | 'task_complete'
  | 'cron'
  | 'manual';

export interface RetentionRunOptions {
  trigger:       RetentionTrigger;
  forceRun?:     boolean;
  sendEmail?:    boolean;
}

export interface RetentionStatus {
  userId:          string;
  urgency:         UrgencyReport;
  recovery:        RecoveryStatus;
  comeback:        ComebackPlan | null;
  actionsTriggered: string[];
  notificationSent: boolean;
  executedAt:      string;
  executionMs:     number;
}

// ── Core Engine ────────────────────────────────────────────────

/**
 * runRetentionEngine — The main entry point.
 * Analyzes user state and takes appropriate retention actions.
 */
export async function runRetentionEngine(
  userId:  string,
  options: RetentionRunOptions,
): Promise<RetentionStatus> {
  const startMs = Date.now();
  const actionsTriggered: string[] = [];
  let notificationSent = false;
  let comeback: ComebackPlan | null = null;

  try {
    logger.info({ userId, trigger: options.trigger }, '[RetentionEngine] Run started');

    // ── Step 1: Check urgency / streak status ──────────────────
    const [urgency, recovery] = await Promise.all([
      urgencyEngine.checkUrgency(userId),
      streakRecoverySystem.getRecoveryStatus(userId),
    ]);

    // ── Step 2: Determine actions based on risk level ──────────

    if (options.trigger === 'login' || options.trigger === 'activity_complete') {
      // Update streak on activity
      const streakResult = await streakManager.updateStreak(userId);
      if (streakResult.success && streakResult.xpAwarded > 0) {
        actionsTriggered.push('streak_updated');

        // Check for streak milestone reward
        await rewardTriggerSystem.triggerStreakMilestoneReward(userId, streakResult.newStreak);
        if (streakResult.newStreak % 7 === 0) {
          actionsTriggered.push('milestone_reward');
        }
      }
    }

    // ── Step 3: Streak is broken — initiate recovery ──────────
    if (urgency.level === 'critical' && recovery.state === 'not_needed') {
      // First time detecting break — initiate recovery
      await streakRecoverySystem.initiateRecovery(userId);
      actionsTriggered.push('recovery_initiated');
    }

    // ── Step 4: Comeback detection ────────────────────────────
    const { should: shouldComeback } = await comebackEngine.shouldTriggerComeback(userId);
    if (shouldComeback) {
      comeback = await comebackEngine.generateComebackPlan(userId);
      actionsTriggered.push('comeback_plan_generated');
    }

    // ── Step 5: Send notification if needed ───────────────────
    if (urgency.shouldNotify || shouldComeback) {
      let notif;

      if (urgency.level === 'critical' || urgency.level === 'high') {
        // Streak alert
        notif = notificationEngine.buildStreakAlertNotification(
          userId,
          urgency.streakStatus.currentStreak,
          urgency.hoursLeft,
        );
      } else if (shouldComeback && comeback) {
        // Comeback notification
        const user = await User.findById(userId).select('name').lean() as any;
        const userName = user?.name?.split(' ')[0] ?? 'there';
        notif = notificationEngine.buildComebackNotification(
          userId,
          userName,
          Math.floor((urgency.streakStatus.hoursSinceLast ?? 0) / 24),
        );
      }

      if (notif) {
        const delivery = await notificationEngine.sendPersonalizedRetentionNotification(
          userId,
          notif.type,
          notif,
        );
        notificationSent = delivery.success;
        if (notificationSent) actionsTriggered.push('notification_sent');
      }
    }

    const executionMs = Date.now() - startMs;
    logger.info({ userId, actionsTriggered, executionMs }, '[RetentionEngine] Complete');

    return {
      userId,
      urgency,
      recovery,
      comeback,
      actionsTriggered,
      notificationSent,
      executedAt:  new Date().toISOString(),
      executionMs,
    };

  } catch (err) {
    logger.error({ userId, err }, '[RetentionEngine] Run failed');
    throw err;
  }
}

/**
 * getRetentionDashboard — Full status snapshot for frontend dashboard widget
 */
export async function getRetentionDashboard(userId: string): Promise<{
  streakStatus:    Awaited<ReturnType<typeof streakManager.getStreakStatus>>;
  urgency:         UrgencyReport;
  recovery:        RecoveryStatus;
  comeback:        ComebackPlan | null;
  notifications:   Awaited<ReturnType<typeof notificationEngine.getUnreadNotifications>>;
}> {
  const [streakStatus, urgency, recovery, notifications] = await Promise.all([
    streakManager.getStreakStatus(userId),
    urgencyEngine.checkUrgency(userId),
    streakRecoverySystem.getRecoveryStatus(userId),
    notificationEngine.getUnreadNotifications(userId),
  ]);

  let comeback: ComebackPlan | null = null;
  const { should } = await comebackEngine.shouldTriggerComeback(userId);
  if (should) {
    comeback = await comebackEngine.generateComebackPlan(userId);
  }

  return { streakStatus, urgency, recovery, comeback, notifications };
}

/**
 * handleActivityCompleted — Call this from any activity controller
 * (lesson done, quiz done, task done, ask AI, etc.)
 */
export async function handleActivityCompleted(
  userId:       string,
  activityType: 'lesson' | 'quiz' | 'task' | 'ask_ai' | 'challenge',
): Promise<{
  streakUpdated:   boolean;
  recoveryChecked: boolean;
  rewardResult:    Awaited<ReturnType<typeof rewardTriggerSystem.triggerReward>> | null;
}> {
  try {
    // 1. Update streak
    const streakResult = await streakManager.updateStreak(userId);

    // 2. Check if this completes a recovery task
    const recovery = await streakRecoverySystem.getRecoveryStatus(userId);
    let recoveryChecked = false;

    if (recovery.state === 'available' || recovery.state === 'pending') {
      // Map activity to recovery method
      const methodMap: Record<string, 'task' | 'quiz' | 'lesson'> = {
        lesson:    'lesson',
        quiz:      'quiz',
        challenge: 'quiz',
        task:      'task',
        ask_ai:    'task',
      };
      const method = methodMap[activityType] ?? 'task';
      await streakRecoverySystem.completeRecovery(userId, method);
      recoveryChecked = true;
    }

    // 3. Trigger activity reward
    const rewardMap: Record<string, Parameters<typeof rewardTriggerSystem.triggerReward>[1]> = {
      lesson:    'lesson_completed',
      quiz:      'task_completed',
      challenge: 'challenge_completed',
      task:      'task_completed',
      ask_ai:    'task_completed',
    };

    const rewardResult = await rewardTriggerSystem.triggerReward(userId, rewardMap[activityType] ?? 'task_completed', {
      streakValue: streakResult.newStreak,
    });

    return {
      streakUpdated:   streakResult.success,
      recoveryChecked,
      rewardResult,
    };

  } catch (err) {
    logger.error({ userId, activityType, err }, '[RetentionEngine] handleActivityCompleted failed');
    return { streakUpdated: false, recoveryChecked: false, rewardResult: null };
  }
}

export const retentionEngine = {
  runRetentionEngine,
  getRetentionDashboard,
  handleActivityCompleted,
};