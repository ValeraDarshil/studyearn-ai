/**
 * AI Study OS — Retention Routes (Stage 7)
 * ─────────────────────────────────────────────────────────────
 * All routes require JWT authentication.
 *
 * GET  /api/retention/status              → full dashboard snapshot
 * GET  /api/retention/streak              → streak status only
 * POST /api/retention/streak/update       → record activity + update streak
 * GET  /api/retention/urgency             → urgency level + countdown
 * GET  /api/retention/recovery            → recovery status
 * POST /api/retention/recovery/start      → initiate recovery window
 * POST /api/retention/recovery/complete   → complete recovery task
 * GET  /api/retention/comeback            → comeback plan for inactive user
 * GET  /api/retention/notifications       → unread in-app notifications
 * POST /api/retention/notifications/read  → mark notifications as read
 * POST /api/retention/activity            → signal activity completed
 * POST /api/retention/run                 → manually trigger retention engine
 * POST /api/retention/reward              → trigger reward for event
 * GET  /api/retention/stream              → SSE real-time notification stream (Stage 7 Advanced)
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  getRetentionStatus,
  getStreakStatus,
  updateStreak,
  getUrgencyReport,
  getRecoveryStatus,
  startRecovery,
  completeRecovery,
  getComebackPlan,
  getNotifications,
  markNotificationsRead,
  recordActivity,
  runRetention,
  triggerReward,
} from '../controllers/retentionController.js';
// ── Stage 7 Advanced: SSE real-time push ─────────────────────
import { registerSSEConnection } from '../services/retentionEngine/notificationSSE.js';

const router = Router();

// ── All retention routes require auth ─────────────────────────
router.use(authenticate);

// ── Dashboard & Status ─────────────────────────────────────────
router.get('/status',              getRetentionStatus);
router.get('/streak',              getStreakStatus);
router.post('/streak/update',      updateStreak);
router.get('/urgency',             getUrgencyReport);

// ── Recovery System ────────────────────────────────────────────
router.get('/recovery',            getRecoveryStatus);
router.post('/recovery/start',     startRecovery);
router.post('/recovery/complete',  completeRecovery);

// ── Comeback Engine ────────────────────────────────────────────
router.get('/comeback',            getComebackPlan);

// ── Notifications ──────────────────────────────────────────────
router.get('/notifications',       getNotifications);
router.post('/notifications/read', markNotificationsRead);

// ── Activity & Rewards ─────────────────────────────────────────
router.post('/activity',           recordActivity);
router.post('/run',                runRetention);
router.post('/reward',             triggerReward);

// ── Stage 7 Advanced: Real-time SSE stream ────────────────────
// Frontend connects here ONCE → server pushes notifications instantly
router.get('/stream', (req: Request, res: Response) => {
  registerSSEConnection((req as any).userId, res, req);
});

export default router;