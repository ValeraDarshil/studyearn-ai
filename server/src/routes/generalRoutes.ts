import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { isGeneralKnowledgeQuestion, getGeneralKnowledge } from '../services/askAI/generalKnowledgeService.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.get('/check', authenticate, async (req: any, res: any) => {
  const q = String(req.query?.q || '').trim();
  if (!q) return res.json({ isGeneral: false });
  return res.json({ isGeneral: isGeneralKnowledgeQuestion(q) });
});

router.post('/fetch', authenticate, async (req: any, res: any) => {
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ success: false, error: 'prompt required' });
  }
  try {
    const result = await getGeneralKnowledge(prompt.trim());
    return res.json({ success: true, data: result });
  } catch (e: any) {
    logger.error('[General Route] ' + e.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch' });
  }
});

export default router;