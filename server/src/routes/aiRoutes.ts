// // ─────────────────────────────────────────────────────────────
// // StudyEarn AI — AI Routes
// // ─────────────────────────────────────────────────────────────
// // URL → Controller ka mapping sirf yahan hota hai
// // Logic controllers mein hai, yahan sirf wiring hai

// import { Router } from 'express';
// import multer from 'multer';
// import { askAI, solvePDF, watchAd, getQuota } from '../controllers/aiController.js';
// import { aiAskLimiter, pdfSolveLimiter } from '../middleware/rateLimiter.js';
// import { validateAskAI } from '../middleware/validate.js';

// const router = Router();
// const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// // POST /api/ai/ask — text ya image question bhejo
// router.post('/ask', aiAskLimiter, validateAskAI, askAI);

// // POST /api/ai/solve-pdf — PDF upload karke AI se solve karao
// router.post('/solve-pdf', pdfSolveLimiter, upload.single('file'), solvePDF);

// router.post('/watch-ad', watchAd);   // POST /api/ai/watch-ad
// router.get('/quota',     getQuota);   // GET  /api/ai/quota

// export default router;




// // ─────────────────────────────────────────────────────────────
// // StudyEarn AI — AI Routes
// // ─────────────────────────────────────────────────────────────
// // URL → Controller ka mapping sirf yahan hota hai
// // Logic controllers mein hai, yahan sirf wiring hai

// import { Router } from 'express';
// import multer from 'multer';
// import { askAI, solvePDF, watchAd, getQuota } from '../controllers/aiController.js';
// import { aiAskLimiter, pdfSolveLimiter } from '../middleware/rateLimiter.js';
// import { validateAskAI } from '../middleware/validate.js';
// import { authenticate } from '../middleware/authMiddleware.js';

// const router = Router();
// const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// // POST /api/ai/ask — text ya image question bhejo
// // authenticate: bina login ke koi bhi free AI calls nahi maar sakta
// router.post('/ask',       authenticate, aiAskLimiter, validateAskAI, askAI);

// // POST /api/ai/solve-pdf — PDF upload karke AI se solve karao
// router.post('/solve-pdf', authenticate, pdfSolveLimiter, upload.single('file'), solvePDF);

// // Watch ad + quota — bhi login required hona chahiye
// router.post('/watch-ad',  authenticate, watchAd);
// router.get('/quota',      authenticate, getQuota);

// export default router;


// ─────────────────────────────────────────────────────────────
// StudyEarn AI — AI Routes  (Fix #1: streaming route added)
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import multer    from 'multer';
import {
  askAI,
  askAIStream,          // ← NEW: SSE streaming controller
  solvePDF,
  watchAd,
  getQuota,
} from '../controllers/aiController.js';
import { aiAskLimiter, pdfSolveLimiter } from '../middleware/rateLimiter.js';
import { validateAskAI }                  from '../middleware/validate.js';
import { authenticate }                   from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

// ── Text / image question (non-streaming — still used for image+PDF) ──
router.post('/ask',        authenticate, aiAskLimiter, validateAskAI, askAI);

// ── SSE Streaming endpoint ─────────────────────────────────────────────
// Frontend connects here for text-only questions → tokens arrive word-by-word
// Image / PDF questions still go to /ask (vision doesn't support streaming yet)
router.post('/ask-stream', authenticate, aiAskLimiter, askAIStream);   // ← NEW

// ── PDF solve ─────────────────────────────────────────────────────────
router.post('/solve-pdf',  authenticate, pdfSolveLimiter, upload.single('file'), solvePDF);

// ── Quota & ads ───────────────────────────────────────────────────────
router.post('/watch-ad',   authenticate, watchAd);
router.get('/quota',       authenticate, getQuota);

export default router;