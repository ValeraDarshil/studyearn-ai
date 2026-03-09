// ─────────────────────────────────────────────────────────────
// StudyEarn AI — AI Routes
// ─────────────────────────────────────────────────────────────
// URL → Controller ka mapping sirf yahan hota hai
// Logic controllers mein hai, yahan sirf wiring hai

import { Router } from 'express';
import multer from 'multer';
import { askAI, solvePDF } from '../controllers/aiController.js';
import { aiAskLimiter, pdfSolveLimiter } from '../middleware/rateLimiter.js';
import { validateAskAI } from '../middleware/validate.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// POST /api/ai/ask — text ya image question bhejo
router.post('/ask', aiAskLimiter, validateAskAI, askAI);

// POST /api/ai/solve-pdf — PDF upload karke AI se solve karao
router.post('/solve-pdf', pdfSolveLimiter, upload.single('file'), solvePDF);

export default router;