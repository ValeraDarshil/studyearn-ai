// ─────────────────────────────────────────────────────────────
// StudyEarn AI — PPT Routes
// ─────────────────────────────────────────────────────────────

import { Router } from 'express';
import { getPPTContent, generatePPT } from '../controllers/pptController.js';
import { pptLimiter } from '../middleware/rateLimiter.js';
import { validatePPTContent, validatePPTGenerate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/ppt/content — AI se slide JSON generate karo
router.post('/content',  authenticate, pptLimiter, validatePPTContent,  getPPTContent);

// POST /api/ppt/generate — .pptx file build karke download karo
router.post('/generate', authenticate, pptLimiter, validatePPTGenerate, generatePPT);

export default router;