// ─────────────────────────────────────────────────────────────
// AskAI — aiRoutes.ts  (v11 — clean, Bug #6 fixed)
//
// ALL ROUTES:
//   POST /api/ai/ask           — text / image question (non-streaming)
//   POST /api/ai/ask-stream    — SSE streaming (main chat)
//   POST /api/ai/solve-pdf     — PDF upload → AI solve
//   POST /api/ai/watch-ad      — watch ad → +3 quota
//   GET  /api/ai/quota         — get remaining questions
//   POST /api/ai/reset-session — chat switch → RAM clear
//
// Bug #6 FIXED: validateAskAI middleware added to /ask-stream
//   (was missing — streaming endpoint had no input validation)
// ─────────────────────────────────────────────────────────────

import { Router } from 'express';
import multer     from 'multer';

import {
  askAI,
  askAIStream,
  solvePDF,
  watchAd,
  getQuota,
  resetSession,
} from '../controllers/aiController.js';

import { aiAskLimiter, pdfSolveLimiter } from '../middleware/rateLimiter.js';
import { validateAskAI }                  from '../middleware/validate.js';
import { authenticate }                   from '../middleware/authMiddleware.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 25 * 1024 * 1024 },   // 25 MB
});

// Text / image question (non-streaming — images + PDFs use this)
router.post('/ask',           authenticate, aiAskLimiter, validateAskAI, askAI);

// SSE Streaming for text questions — main chat endpoint
// Bug #6 fix: validateAskAI added (was missing before v11)
router.post('/ask-stream',    authenticate, aiAskLimiter, validateAskAI, askAIStream);

// PDF file upload → AI solve
router.post('/solve-pdf',     authenticate, pdfSolveLimiter, upload.single('file'), solvePDF);

// Watch a video ad → refill +3 questions
router.post('/watch-ad',      authenticate, watchAd);

// Get remaining question quota
router.get('/quota',          authenticate, getQuota);

// Chat switch → clear RAM memory for this user
router.post('/reset-session', authenticate, resetSession);

export default router;