/**
 * AI Study OS — Brain Routes
 * ─────────────────────────────────────────────────────────────
 * Mount in index.ts:
 *   import brainRoutes from './routes/brainRoutes.js';
 *   app.use('/api/brain', brainRoutes);
 */

import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';
import {
  setupProfile,
  getProfile,
  getHeatmap,
  getTodayFocus,
  getLearningPath,
  completeStep,
  getWeeklyReport,
  getAlerts,
  submitQuizResult,
} from '../controllers/brainController.js';

const router = Router();

// Rate limiter for AI-heavy endpoints
const brainAILimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: '⏳ Too many requests. Please slow down.' },
});

// All brain routes require authentication
router.use(authenticate);

// ── Profile setup & retrieval ─────────────────────────────────
router.post('/setup',   setupProfile);    // POST /api/brain/setup
router.get('/profile',  getProfile);      // GET  /api/brain/profile
router.get('/heatmap',  getHeatmap);      // GET  /api/brain/heatmap

// ── AI Learning Engine ────────────────────────────────────────
router.get('/today-focus',      brainAILimiter, getTodayFocus);     // GET  /api/brain/today-focus
router.post('/learning-path',   brainAILimiter, getLearningPath);   // POST /api/brain/learning-path
router.post('/complete-step',   completeStep);                       // POST /api/brain/complete-step

// ── Progress Intelligence ─────────────────────────────────────
router.get('/weekly-report',  brainAILimiter, getWeeklyReport);    // GET  /api/brain/weekly-report
router.get('/alerts',         getAlerts);                           // GET  /api/brain/alerts
router.post('/quiz-result',   submitQuizResult);                    // POST /api/brain/quiz-result

export default router;