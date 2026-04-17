// ─────────────────────────────────────────────────────────────
// /api/comprehension — Comprehension Tracking Routes
// Endpoints:
//   POST /api/comprehension/event  → confusion/mastery event log karo
//   POST /api/comprehension/result → session ka final result store karo
// ─────────────────────────────────────────────────────────────
import express, { Request, Response } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { AskAISession } from '../models/AskAISession.model.js';

const router = express.Router();

// ── POST /api/comprehension/event ─────────────────────────────
// Body: { sessionId, eventType: 'confusion' | 'mastery', topic? }
// Updates confusionCount or masteryCount in AskAISession
router.post('/event', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { sessionId, eventType, topic } = req.body;

    if (!sessionId || !eventType) {
      return res.status(400).json({ success: false, message: 'sessionId and eventType are required' });
    }
    if (!['confusion', 'mastery'].includes(eventType)) {
      return res.status(400).json({ success: false, message: 'eventType must be "confusion" or "mastery"' });
    }

    const inc: Record<string, number> = {};
    if (eventType === 'confusion') inc.confusionCount = 1;
    if (eventType === 'mastery')   inc.masteryCount   = 1;

    const update: any = { $inc: inc };
    if (topic) {
      update.$addToSet = { detectedTopics: topic };
    }
    if (eventType === 'confusion' && topic) {
      update.$addToSet = { ...update.$addToSet, weakTopics: topic };
    }
    if (eventType === 'mastery' && topic) {
      update.$addToSet = { ...update.$addToSet, strongTopics: topic };
    }

    const session = await AskAISession.findOneAndUpdate(
      { _id: sessionId, userId },
      update,
      { new: true, select: 'confusionCount masteryCount detectedTopics' }
    );

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    return res.json({
      success: true,
      eventType,
      confusionCount: session.confusionCount,
      masteryCount: session.masteryCount,
    });
  } catch (err) {
    console.error('[comprehension/event]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/comprehension/result ───────────────────────────
// Body: { sessionId, finalSkillLevel?, weakTopics?, strongTopics?, summary? }
// Stores final comprehension result on session close
router.post('/result', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { sessionId, finalSkillLevel, weakTopics, strongTopics, summary } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'sessionId is required' });
    }

    const update: any = { lastMessageAt: new Date() };

    if (finalSkillLevel && ['beginner', 'intermediate', 'advanced'].includes(finalSkillLevel)) {
      update.finalSkillLevel = finalSkillLevel;
    }
    if (Array.isArray(weakTopics) && weakTopics.length > 0) {
      update.$addToSet = { weakTopics: { $each: weakTopics } };
    }
    if (Array.isArray(strongTopics) && strongTopics.length > 0) {
      update.$addToSet = {
        ...(update.$addToSet ?? {}),
        strongTopics: { $each: strongTopics },
      };
    }
    if (summary) {
      update.loopState = { summary, savedAt: new Date().toISOString() };
    }

    const session = await AskAISession.findOneAndUpdate(
      { _id: sessionId, userId },
      update,
      { new: true, select: 'finalSkillLevel weakTopics strongTopics confusionCount masteryCount' }
    );

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    return res.json({
      success: true,
      message: 'Comprehension result stored',
      finalSkillLevel: session.finalSkillLevel,
      weakTopics: session.weakTopics,
      strongTopics: session.strongTopics,
      confusionCount: session.confusionCount,
      masteryCount: session.masteryCount,
    });
  } catch (err) {
    console.error('[comprehension/result]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/stats', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const sessions = await AskAISession.find({ userId, deletedAt: null })
      .select('confusionCount masteryCount turnCount')
      .lean();
    const totalConfusion = sessions.reduce((s, x) => s + (x.confusionCount ?? 0), 0);
    const totalMastery   = sessions.reduce((s, x) => s + (x.masteryCount   ?? 0), 0);
    const totalTurns     = sessions.reduce((s, x) => s + (x.turnCount      ?? 0), 0);
    return res.json({ success: true,
      confusionCount: totalConfusion,
      masteryCount:   totalMastery,
      totalTurns,
      comprehensionRate: totalTurns > 0 ? Math.round((totalMastery / totalTurns) * 100) : 0,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;