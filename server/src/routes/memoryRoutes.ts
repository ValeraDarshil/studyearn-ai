// ─────────────────────────────────────────────────────────────
// /api/memory — Smart Long-Term Memory Routes
// Endpoints:
//   POST /api/memory/store   → mistake store karo
//   POST /api/memory/search  → past mistakes search karo
//   GET  /api/memory/profile → full memory profile lo
// ─────────────────────────────────────────────────────────────
import express, { Request, Response } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { StudentProfile } from '../models/StudentProfile.model.js';

const router = express.Router();

// ── POST /api/memory/store ────────────────────────────────────
// Body: { topic, subject, question, errorType }
// Stores or increments a mistake record in aiLongTermMemory.pastMistakes
router.post('/store', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { topic, subject = '', question = '', errorType = 'unknown' } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, message: 'topic is required' });
    }

    const profile = await StudentProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'StudentProfile not found' });
    }

    const mistakes: any[] = profile.aiLongTermMemory?.pastMistakes ?? [];

    // Check if same topic+errorType already exists → increment count
    const existing = mistakes.find(
      (m: any) => m.topic === topic && m.errorType === errorType
    );

    if (existing) {
      existing.count += 1;
      existing.lastSeenAt = new Date().toISOString();
      if (question) existing.question = question;
    } else {
      // Keep max 50 mistakes — drop oldest if full
      if (mistakes.length >= 50) {
        mistakes.sort((a: any, b: any) => new Date(a.lastSeenAt).getTime() - new Date(b.lastSeenAt).getTime());
        mistakes.splice(0, 1);
      }
      mistakes.push({
        topic,
        subject,
        question,
        errorType,
        count: 1,
        firstSeenAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
      });
    }

    await StudentProfile.updateOne(
      { userId },
      { $set: { 'aiLongTermMemory.pastMistakes': mistakes } }
    );

    return res.json({ success: true, message: 'Memory stored', count: existing?.count ?? 1 });
  } catch (err) {
    console.error('[memory/store]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/memory/search ───────────────────────────────────
// Body: { topic?, subject?, errorType?, limit? }
// Returns matching mistake records from aiLongTermMemory.pastMistakes
router.post('/search', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { topic, subject, errorType, limit = 10 } = req.body;

    const profile = await StudentProfile.findOne({ userId }).lean();
    if (!profile) {
      return res.status(404).json({ success: false, message: 'StudentProfile not found' });
    }

    let mistakes: any[] = (profile as any).aiLongTermMemory?.pastMistakes ?? [];

    if (topic) {
      mistakes = mistakes.filter((m: any) =>
        m.topic.toLowerCase().includes(topic.toLowerCase())
      );
    }
    if (subject) {
      mistakes = mistakes.filter((m: any) =>
        m.subject?.toLowerCase().includes(subject.toLowerCase())
      );
    }
    if (errorType) {
      mistakes = mistakes.filter((m: any) => m.errorType === errorType);
    }

    // Sort by most recent first
    mistakes.sort((a: any, b: any) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime());
    mistakes = mistakes.slice(0, Math.min(limit, 50));

    return res.json({ success: true, results: mistakes, total: mistakes.length });
  } catch (err) {
    console.error('[memory/search]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /api/memory/profile ───────────────────────────────────
// Returns full aiLongTermMemory object: pastMistakes + milestones + behaviorPattern
router.get('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const profile = await StudentProfile.findOne({ userId })
      .select('aiLongTermMemory weakTopics strongTopics overallMasteryScore')
      .lean();

    if (!profile) {
      return res.status(404).json({ success: false, message: 'StudentProfile not found' });
    }

    return res.json({
      success: true,
      memory: (profile as any).aiLongTermMemory ?? { pastMistakes: [], milestones: [], behaviorPattern: null },
      weakTopics: (profile as any).weakTopics ?? [],
      strongTopics: (profile as any).strongTopics ?? [],
      overallMasteryScore: (profile as any).overallMasteryScore ?? 0,
    });
  } catch (err) {
    console.error('[memory/profile]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;