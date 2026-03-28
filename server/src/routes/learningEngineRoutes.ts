/**
 * AI Study OS — Learning Engine Routes (Stage 3)
 * ─────────────────────────────────────────────────────────────
 * Mount in index.ts:
 *   import learningRoutes from './routes/learningEngineRoutes.js';
 *   app.use('/api/learn', learningRoutes);
 *
 * All routes require authentication.
 *
 * Available endpoints:
 *   GET  /api/learn/plan        Full learning plan
 *   GET  /api/learn/daily       Today's daily schedule
 *   GET  /api/learn/path        Adaptive 7-day path
 *   GET  /api/learn/priorities  Priority topics
 *   GET  /api/learn/difficulty  Difficulty settings
 *   GET  /api/learn/recommend   Contextual recommendation
 *   POST /api/learn/quiz-done   Quiz completion trigger
 */

import { Router }     from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import rateLimit      from 'express-rate-limit';
import {
  getFullPlan,
  getDailySchedule,
  getAdaptiveLearningPath,
  getPriorityTopics,
  getDifficulty,
  getRecommendation,
  quizCompleted,
} from '../controllers/learningEngineController.js';

const router = Router();

// Heavy endpoints — 15 req/min
const heavyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max:      15,
  message:  { success: false, message: '⏳ Too many requests. Please wait a moment.' },
  keyGenerator: (req: any) => req.userId || req.ip,
});

// Standard endpoints — 60 req/min
const standardLimiter = rateLimit({
  windowMs: 60 * 1000,
  max:      60,
  message:  { success: false, message: '⏳ Too many requests.' },
  keyGenerator: (req: any) => req.userId || req.ip,
});

// All routes require auth
router.use(authenticate);

// ── Heavy endpoints ────────────────────────────────────────────
router.get('/plan',       heavyLimiter,    getFullPlan);
router.get('/path',       heavyLimiter,    getAdaptiveLearningPath);

// ── Standard endpoints ─────────────────────────────────────────
router.get('/daily',      standardLimiter, getDailySchedule);
router.get('/priorities', standardLimiter, getPriorityTopics);
router.get('/difficulty', standardLimiter, getDifficulty);
router.get('/recommend',  standardLimiter, getRecommendation);

// ── Event trigger endpoints ────────────────────────────────────
router.post('/quiz-done', standardLimiter, quizCompleted);

export default router;