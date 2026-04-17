/**
 * AI Study OS — Brain Routes
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
  updateLearningStyle,
} from '../controllers/brainController.js';

const router = Router();

const brainAILimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: '⏳ Too many requests. Please slow down.' },
});

router.use(authenticate);

// ── Profile setup & retrieval ─────────────────────────────────
router.post('/setup',   setupProfile);
router.get('/profile',  getProfile);
router.get('/heatmap',  getHeatmap);

// ── AI Learning Engine ────────────────────────────────────────
router.get('/today-focus',      brainAILimiter, getTodayFocus);
router.post('/learning-path',   brainAILimiter, getLearningPath);
router.post('/complete-step',   completeStep);

// ── Progress Intelligence ─────────────────────────────────────
router.get('/weekly-report',  brainAILimiter, getWeeklyReport);
router.get('/alerts',         getAlerts);
router.post('/quiz-result',   submitQuizResult);

// ── Learning Style Persistence ────────────────────────────────
router.patch('/learning-style', updateLearningStyle);   // PATCH /api/brain/learning-style

export default router;