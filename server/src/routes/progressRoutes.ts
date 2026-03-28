/**
 * AI Study OS — Progress Intelligence Routes (Stage 4)
 * ─────────────────────────────────────────────────────────────
 * Mount in index.ts:
 *   import progressRoutes from './routes/progressRoutes.js';
 *   app.use('/api/progress', progressRoutes);
 *
 * All routes require authentication.
 *
 * Available endpoints:
 *   GET  /api/progress/analysis   Full progress pipeline
 *   GET  /api/progress/snapshot   Score + insights (fast)
 *   GET  /api/progress/insights   Insight cards only
 *   GET  /api/progress/score      Progress score widget
 *   GET  /api/progress/weekly     Weekly AI report
 *   GET  /api/progress/trends     Trend analysis
 *   POST /api/progress/event      Activity event trigger
 */

import { Router }       from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import rateLimit        from 'express-rate-limit';
import {
  getFullAnalysis,
  getSnapshot,
  getInsights,
  getScore,
  getWeeklyReport,
  getTrends,
  trackEvent,
} from '../controllers/progressController.js';

const router = Router();

// Heavy endpoints — full pipeline — 10 req/min
const heavyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max:      10,
  message:  { success: false, message: '⏳ Too many requests. Please wait.' },
  keyGenerator: (req: any) => req.userId || req.ip,
});

// Standard endpoints — 60 req/min
const standardLimiter = rateLimit({
  windowMs: 60 * 1000,
  max:      60,
  message:  { success: false, message: '⏳ Too many requests.' },
  keyGenerator: (req: any) => req.userId || req.ip,
});

router.use(authenticate);

// Heavy — runs full analysis pipeline
router.get('/analysis', heavyLimiter,    getFullAnalysis);
router.get('/weekly',   heavyLimiter,    getWeeklyReport);

// Standard — partial data fetches
router.get('/snapshot', standardLimiter, getSnapshot);
router.get('/insights', standardLimiter, getInsights);
router.get('/score',    standardLimiter, getScore);
router.get('/trends',   standardLimiter, getTrends);

// Event trigger
router.post('/event',   standardLimiter, trackEvent);

export default router;