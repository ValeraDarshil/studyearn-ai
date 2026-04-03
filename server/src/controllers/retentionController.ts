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
 *   POST /api/retention/recovery/complete → complete recovery task
 *   GET  /api/retention/comeback         → comeback plan
 *   GET  /api/retention/notifications    → unread notifications
 *   POST /api/retention/notifications/read → mark notifications read
 *   POST /api/retention/activity         → notify engine of activity done
 *   POST /api/retention/run              → manually run retention engine
 */

import { Request, Response, NextFunction } from 'express';
import { retentionEngine }                  from '../services/retentionEngine/retentionEngine.js';
import { streakManager }                    from '../services/retentionEngine/streakManager.js';
import { urgencyEngine }                    from '../services/retentionEngine/urgencyEngine.js';
import { streakRecoverySystem }             from '../services/retentionEngine/streakRecoverySystem.js';
import { comebackEngine }                   from '../services/retentionEngine/comebackEngine.js';
import { notificationEngine }               from '../services/retentionEngine/notificationEngine.js';
import { rewardTriggerSystem }              from '../services/retentionEngine/rewardTriggerSystem.js';
import { logger }                           from '../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// GET /api/retention/status
// Full retention dashboard — streak + urgency + recovery + comeback + notifications
// ─────────────────────────────────────────────────────────────
export async function getRetentionStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as string;
    const dashboard = await retentionEngine.getRetentionDashboard(userId);
    return res.json({ success: true, ...dashboard });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/retention/streak
// Streak status only (lighter endpoint for header/navbar)
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
// Called when user does any study activity — updates streak
// body: { activityType?: string }
// ─────────────────────────────────────────────────────────────
export async function updateStreak(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as string;
    const result = await streakManager.updateStreak(userId);
    return res.json({ ...result, success: true });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/retention/urgency
// Urgency report with countdown timer data
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
// Check recovery status — is recovery available? pending? expired?
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
// Initiate recovery session (opens 24h window)
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
// Complete recovery task → restore streak + award XP
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
    return res.json({ ...result });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/retention/comeback
// Get personalized comeback plan for inactive user
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
// Get unread in-app notifications for user
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
// Mark notifications as read
// body: { ids?: string[] }  — omit ids to mark ALL read
// ─────────────────────────────────────────────────────────────
export async function markNotificationsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as string;
    const { ids } = req.body ?? {};
    await notificationEngine.markNotificationsRead(userId, ids);
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/retention/activity
// Signal that user completed an activity → updates streak + checks recovery
// body: { type: 'lesson' | 'quiz' | 'task' | 'ask_ai' | 'challenge' }
// ─────────────────────────────────────────────────────────────
export async function recordActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as string;
    const { type } = req.body ?? {};

    const validTypes = ['lesson', 'quiz', 'task', 'ask_ai', 'challenge'];
    const activityType = validTypes.includes(type) ? type : 'task';

    const result = await retentionEngine.handleActivityCompleted(userId, activityType);
    return res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/retention/run
// Manually trigger the full retention engine (login/cron use)
// body: { trigger?: string, forceRun?: boolean }
// ─────────────────────────────────────────────────────────────
export async function runRetention(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as string;
    const { trigger = 'manual', forceRun = false, sendEmail = false } = req.body ?? {};

    const result = await retentionEngine.runRetentionEngine(userId, {
      trigger,
      forceRun,
      sendEmail,
    });

    return res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/retention/reward
// Manually trigger a reward for a specific event (used by other systems)
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