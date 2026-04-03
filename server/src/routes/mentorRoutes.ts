/**
 * AI Study OS — Mentor Routes (Stage 6)
 * ─────────────────────────────────────────────────────────────
 * REST API for AI Mentor features.
 *
 * GET  /api/mentor/state              → get current mentor state
 * POST /api/mentor/check              → manual trigger check
 * POST /api/mentor/message/:id/read   → mark message read
 * POST /api/mentor/message/:id/dismiss→ dismiss message
 * POST /api/mentor/task/complete      → complete active micro-task
 * PUT  /api/mentor/personality        → change mentor personality
 * GET  /api/mentor/messages           → get message history
 * POST /api/mentor/admin/run-job      → admin: run scheduler job manually
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate }      from '../middleware/authMiddleware.js';
import { aiMentorEngine }    from '../services/aiMentor/aiMentorEngine.js';
import { AIMentorSession }   from '../models/AIMentorSession.model.js';
import { mentorScheduler }   from '../services/aiMentor/mentorScheduler.js';
import { logger }            from '../utils/logger.js';

const router = Router();

// ── Middleware: all routes require auth ────────────────────────
router.use(authenticate);

// ─────────────────────────────────────────────────────────────
// GET /api/mentor/state
// Returns current mentor state + unread message count
// ─────────────────────────────────────────────────────────────
router.get('/state', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;  // ✅ FIX: was (req as any).user.id
    const state  = await aiMentorEngine.getMentorState(userId);

    if (!state) {
      return res.json({
        success:           true,
        hasActiveMessage:  false,
        latestMessage:     null,
        activeMicroTask:   null,
        unreadCount:       0,
        mentorLevel:       1,
        mentorPersonality: 'motivational',
      });
    }

    return res.json({ success: true, ...state });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/mentor/check
// Manually runs AI Mentor for current user
// body: { forceRun?: boolean, personality?: string }
// ─────────────────────────────────────────────────────────────
router.post('/check', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;  // ✅ FIX: was (req as any).user.id
    const { forceRun, personality } = req.body ?? {};

    const result = await aiMentorEngine.runAIMentor(userId, {
      trigger:             'manual',
      forceRun:            !!forceRun,
      personalityOverride: personality,
    });

    return res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/mentor/message/:id/read
// ─────────────────────────────────────────────────────────────
router.post('/message/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId    = req.userId as string;  // ✅ FIX: was (req as any).user.id
    const messageId = String(req.params.id);
    await aiMentorEngine.markMessageRead(userId, messageId);
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/mentor/message/:id/dismiss
// ─────────────────────────────────────────────────────────────
router.post('/message/:id/dismiss', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId    = req.userId as string;  // ✅ FIX: was (req as any).user.id
    const messageId = String(req.params.id);
    await aiMentorEngine.dismissMessage(userId, messageId);
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/mentor/task/complete
// Mark active micro-task as completed
// ─────────────────────────────────────────────────────────────
router.post('/task/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;  // ✅ FIX: was (req as any).user.id
    await aiMentorEngine.completeMicroTask(userId);
    return res.json({ success: true, message: 'Task completed! XP awarded.' });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// PUT /api/mentor/personality
// body: { personality: 'friendly' | 'strict' | 'motivational' }
// ─────────────────────────────────────────────────────────────
router.put('/personality', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId          = req.userId as string;  // ✅ FIX: was (req as any).user.id
    const { personality } = req.body ?? {};

    if (!['friendly', 'strict', 'motivational'].includes(personality)) {
      return res.status(400).json({ success: false, error: 'Invalid personality value' });
    }

    await aiMentorEngine.updateMentorPersonality(userId, personality);
    return res.json({ success: true, personality });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/mentor/messages?limit=10&unreadOnly=false
// ─────────────────────────────────────────────────────────────
router.get('/messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId     = req.userId as string;  // ✅ FIX: was (req as any).user.id
    const limit      = Math.min(parseInt(String(req.query.limit ?? '20')), 50);
    const unreadOnly = req.query.unreadOnly === 'true';

    const session = await AIMentorSession.findOne({ userId }, { messages: 1 }).lean();
    if (!session) return res.json({ success: true, messages: [] });

    let messages = (session.messages as any[]).reverse(); // newest first
    if (unreadOnly) messages = messages.filter((m: any) => !m.isRead && !m.isDismissed);
    messages = messages.slice(0, limit);

    return res.json({ success: true, messages });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/mentor/admin/run-job
// Admin-only: manually trigger a scheduler job
// body: { job: 'inactive' | 'reminder' | 'streak' | 'reset' }
// ─────────────────────────────────────────────────────────────
router.post('/admin/run-job', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { job } = req.body ?? {};
    const jobs    = mentorScheduler.manualJobs;

    switch (job) {
      case 'inactive': await jobs.runInactiveCheck();        break;
      case 'reminder': await jobs.runDailyReminder();        break;
      case 'streak':   await jobs.runStreakAtRiskCheck();     break;
      case 'reset':    await jobs.resetDailyTriggerCounts(); break;
      default:
        return res.status(400).json({ success: false, error: 'Unknown job' });
    }

    return res.json({ success: true, job, ranAt: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
});

export default router;