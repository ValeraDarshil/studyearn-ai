/**
 * AI Study OS — Retention Controller (Stage 7)
 * ─────────────────────────────────────────────────────────────
 * Handles all HTTP requests for the Retention Engine.
 *
 * Routes:
 *   GET  /api/retention/status           → full dashboard snapshot
 *   GET  /api/retention/streak           → streak status only
 *   POST /api/retention/streak/update    → update streak on activity
 *   GET  /api/retention/urgency          → urgency report
 *   GET  /api/retention/recovery         → recovery status
 *   POST /api/retention/recovery/start   → initiate recovery window
 *   POST /api/retention/recovery/complete → complete recovery task
 *   GET  /api/retention/comeback         → comeback plan
 *   GET  /api/retention/notifications    → unread notifications
 *   POST /api/retention/notifications/read → mark notifications read
 *   POST /api/retention/activity         → notify engine of activity done
 *   POST /api/retention/run              → manually run retention engine
 *   POST /api/retention/reward           → trigger reward for event
 */

import { Request, Response, NextFunction }  from 'express';
import { retentionEngine }                  from '../services/retentionEngine/retentionEngine.js';
import { streakManager }                    from '../services/retentionEngine/streakManager.js';
import { urgencyEngine }                    from '../services/retentionEngine/urgencyEngine.js';
import { streakRecoverySystem }             from '../services/retentionEngine/streakRecoverySystem.js';
import { comebackEngine }                   from '../services/retentionEngine/comebackEngine.js';
import { notificationEngine }               from '../services/retentionEngine/notificationEngine.js';
import { rewardTriggerSystem }              from '../services/retentionEngine/rewardTriggerSystem.js';
// ── Stage 7 Advanced: Emotional AI on recovery success ────────
import { mergeEmotionalAIOnRecovery }       from '../services/retentionEngine/emotionalAIMerge.js';
import { logger }                           from '../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// GET /api/retention/status
// ─────────────────────────────────────────────────────────────
export async function getRetentionStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const userId    = req.userId as string;
    const dashboard = await retentionEngine.getRetentionDashboard(userId);
    return res.json({ success: true, ...dashboard });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/retention/streak
// ─────────────────────────────────────────────────────────────
export async function getStreakStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as string;
    const status = await streakManager.getStreakStatus(userId);
    return res.json({ success: true, streak: status });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/retention/streak/update
// ─────────────────────────────────────────────────────────────
export async function updateStreak(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as string;
    const result = await streakManager.updateStreak(userId);
    return res.json({
      success:     result.success,
      newStreak:   result.newStreak,
      wasRestored: result.wasRestored,
      xpAwarded:   result.xpAwarded,
      message:     result.message,
    });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/retention/urgency
// ─────────────────────────────────────────────────────────────
export async function getUrgencyReport(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as string;
    const report = await urgencyEngine.checkUrgency(userId);
    return res.json({ success: true, urgency: report });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/retention/recovery
// ─────────────────────────────────────────────────────────────
export async function getRecoveryStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as string;
    const status = await streakRecoverySystem.getRecoveryStatus(userId);
    return res.json({ success: true, recovery: status });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/retention/recovery/start
// ─────────────────────────────────────────────────────────────
export async function startRecovery(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as string;
    const status = await streakRecoverySystem.initiateRecovery(userId);
    return res.json({ success: true, recovery: status });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/retention/recovery/complete
// body: { method: 'task' | 'quiz' | 'lesson' }
// ─────────────────────────────────────────────────────────────
export async function completeRecovery(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as string;
    const { method } = req.body ?? {};

    const validMethods = ['task', 'quiz', 'lesson'];
    if (!validMethods.includes(method)) {
      return res.status(400).json({ success: false, error: 'Invalid method. Use: task, quiz, or lesson' });
    }

    const result = await streakRecoverySystem.completeRecovery(userId, method);

    // ── ADVANCED LAYER: On success → AI Mentor sends celebration ──
    // Fire-and-forget — does NOT block the HTTP response
    if (result.success) {
      mergeEmotionalAIOnRecovery(userId, result).catch((e: any) => {
        logger.warn({ userId, err: e?.message }, '[RetentionController] emotionalAI celebration failed');
      });
    }

    return res.json({
      success:   result.success,
      message:   result.message,
      xpAwarded: result.xpAwarded,
      newStreak: result.newStreak,
    });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/retention/comeback
// ─────────────────────────────────────────────────────────────
export async function getComebackPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as string;
    const plan   = await comebackEngine.generateComebackPlan(userId);
    return res.json({ success: true, comeback: plan });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/retention/notifications
// ─────────────────────────────────────────────────────────────
export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const userId        = req.userId as string;
    const notifications = await notificationEngine.getUnreadNotifications(userId);
    return res.json({ success: true, notifications, count: notifications.length });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/retention/notifications/read
// body: { ids?: string[] }  — omit to mark ALL read
// ─────────────────────────────────────────────────────────────
export async function markNotificationsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const userId  = req.userId as string;
    const { ids } = req.body ?? {};
    await notificationEngine.markNotificationsRead(userId, ids);
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/retention/activity
// body: { type: 'lesson' | 'quiz' | 'task' | 'ask_ai' | 'challenge' }
// ─────────────────────────────────────────────────────────────
export async function recordActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as string;
    const { type } = req.body ?? {};

    const validTypes   = ['lesson', 'quiz', 'task', 'ask_ai', 'challenge'];
    const activityType = validTypes.includes(type) ? type : 'task';

    const result = await retentionEngine.handleActivityCompleted(userId, activityType);
    return res.json({
      success:         true,
      streakUpdated:   result.streakUpdated,
      recoveryChecked: result.recoveryChecked,
      rewardResult:    result.rewardResult,
    });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/retention/run
// body: { trigger?: string, forceRun?: boolean }
// ─────────────────────────────────────────────────────────────
export async function runRetention(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as string;
    const { trigger = 'manual', forceRun = false, sendEmail = false } = req.body ?? {};

    const result = await retentionEngine.runRetentionEngine(userId, { trigger, forceRun, sendEmail });

    return res.json({
      success:          true,
      urgency:          result.urgency,
      recovery:         result.recovery,
      comeback:         result.comeback,
      actionsTriggered: result.actionsTriggered,
      notificationSent: result.notificationSent,
      executedAt:       result.executedAt,
      executionMs:      result.executionMs,
    });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/retention/reward
// body: { event: string, context?: object }
// ─────────────────────────────────────────────────────────────
export async function triggerReward(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as string;
    const { event, context = {} } = req.body ?? {};

    const validEvents = [
      'streak_maintained', 'streak_recovery', 'comeback_success',
      'task_completed', 'challenge_completed', 'daily_login', 'lesson_completed',
    ];

    if (!validEvents.includes(event)) {
      return res.status(400).json({ success: false, error: 'Invalid event type' });
    }

    const result = await rewardTriggerSystem.triggerReward(userId, event, context);
    return res.json({ success: result.success, reward: result });
  } catch (err) {
    next(err);
  }
}