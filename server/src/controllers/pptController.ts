// ─────────────────────────────────────────────────────────────
// StudyEarn AI — PPT Controller
// ─────────────────────────────────────────────────────────────
// Route handlers: POST /api/ppt/content, POST /api/ppt/generate
// ─────────────────────────────────────────────────────────────

import { Request, Response } from 'express';
import { generatePPTContent } from '../services/aiService.js';
import { buildPPTX, buildPPTPrompt, extractJSONArray } from '../services/pptService.js';
import { getUserIdFromToken } from '../middleware/authMiddleware.js';
import { User } from '../models/User.model.js';
import { Activity } from '../models/Activity.model.js';
import { logger } from '../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// PRIVATE HELPER — PPT generate karne pe points award karo
// ─────────────────────────────────────────────────────────────
async function handlePPTGenerated(req: Request): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) return;
  try {
    const user = await User.findById(userId);
    if (!user) return;
    const pts = 20;
    user.points                       += pts;
    (user as any).totalXP              = ((user as any).totalXP || 0) + pts;
    (user as any).totalPPTsGenerated   = ((user as any).totalPPTsGenerated || 0) + 1;
    await user.save();
    await Activity.create({ userId, action: 'generate_ppt', details: 'Generated a PPT presentation', pointsEarned: pts });
    logger.info(`PPT generated: ${user.email} | +${pts}pts`);
  } catch (err: any) {
    logger.error('handlePPTGenerated error:', err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ppt/content — AI se slide JSON generate karo
// ─────────────────────────────────────────────────────────────
export async function getPPTContent(req: Request, res: Response) {
  try {
    const { topic, style = 'simple', classLevel = '10' } = req.body;
    if (!topic?.trim()) return res.status(400).json({ success: false, message: 'Topic required' });

    logger.info(`PPT content: "${topic}" | style=${style} | level=${classLevel}`);

    const { system, user } = buildPPTPrompt(topic.trim(), classLevel, style);
    let rawText = '';
    let slides: any[] | null = null;

    // Try Groq first, then OpenRouter (providers ke liye loop)
    const providers = [
      () => generatePPTContent(system, user),
    ];

    for (const callFn of providers) {
      try {
        rawText = await callFn();
        slides  = extractJSONArray(rawText);
        if (slides && slides.length >= 3) break;
        logger.warn('Parsed 0 valid slides, trying next provider...');
      } catch (e: any) {
        logger.warn(`Provider failed: ${e.message}`);
      }
    }

    if (!slides || slides.length < 3) {
      logger.error('PPT: all providers failed. Raw:', rawText?.substring(0, 300));
      return res.status(500).json({ success: false, message: 'Could not generate slide content. Please try again.' });
    }

    // Normalize slide objects
    const normalized = slides
      .map((sl: any, i: number) => ({
        title:    String(sl.title   || sl.Title   || `Slide ${i + 1}`).trim(),
        content:  String(sl.content || sl.Content || sl.body || sl.Body || '').trim(),
        subtitle: sl.subtitle || sl.Subtitle || '',
      }))
      .filter((sl: any) => sl.title.length > 0);

    logger.info(`Generated ${normalized.length} slides`);
    res.json({ success: true, slides: normalized });
  } catch (err: any) {
    logger.error('PPT CONTENT ERROR:', err);
    res.status(500).json({ success: false, message: 'Failed to generate content. Please try again.' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/ppt/generate — PPTX file build karke download karo
// ─────────────────────────────────────────────────────────────
export async function generatePPT(req: Request, res: Response) {
  try {
    const { topic, slides, style = 'simple', classLevel = 'Student' } = req.body;

    if (!slides || slides.length === 0) {
      return res.status(400).json({ success: false, message: 'No slides provided' });
    }

    const buffer = await buildPPTX(slides, style, topic || 'Topic', classLevel);

    const safeFilename = (topic || 'presentation')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '_');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}_${style}.pptx"`);
    res.send(buffer);

    // Response bhej do, PHIR points award karo (fire-and-forget)
    handlePPTGenerated(req).catch(logger.error);
  } catch (error: any) {
    logger.error('PPT ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}