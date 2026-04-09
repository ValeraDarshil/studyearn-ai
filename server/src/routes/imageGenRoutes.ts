import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { generateImage, isImageGenRequest } from '../services/askAI/imageGenService.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.post('/check', authenticate, (req: any, res: any) => {
  const { prompt } = req.body || {};
  if (!prompt) return res.json({ isImageRequest: false });
  return res.json({ isImageRequest: isImageGenRequest(String(prompt)) });
});

router.post('/generate', authenticate, async (req: any, res: any) => {
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ success: false, error: 'prompt required' });
  }
  try {
    const result = await generateImage(prompt.trim());
    return res.json(result);
  } catch (e: any) {
    logger.error('[ImageGen Route] ' + e.message);
    return res.status(500).json({ success: false, error: 'Image generation failed', provider: 'error', prompt });
  }
});

export default router;