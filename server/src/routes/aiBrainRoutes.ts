/**
 * AI Study OS — AI Brain Routes (Extended)
 * ─────────────────────────────────────────────────────────────
 * New routes for the AI Brain system.
 *
 * Mount in index.ts:
 *   import aiBrainRoutes from './routes/aiBrainRoutes.js';
 *   app.use('/api/aibrain', aiBrainRoutes);
 *
 * All routes require authentication.
 * Heavy AI endpoints have their own rate limiter.
 *
 * Available endpoints:
 *   GET /api/aibrain/snapshot         Full brain dashboard data
 *   GET /api/aibrain/daily-plan       Today's learning plan
 *   GET /api/aibrain/topic-analysis   Topic weakness analysis
 *   GET /api/aibrain/insights         Live progress insights
 *   GET /api/aibrain/context          AI context packet
 *   GET /api/aibrain/summary          Compact summary string
 *   GET /api/aibrain/weak-actions     Priority actions for weak topics
 *   GET /api/aibrain/priority-topics  Top N topics needing attention
 */

import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';
import {
  getSnapshot,
  getTodayPlan,
  getTopicAnalysis,
  getInsights,
  getContext,
  getSummary,
  getWeakActions,
  getPriorityTopics,
} from '../controllers/aiBrainController.js';

const router = Router();

// ── Rate limiters ─────────────────────────────────────────────

// Heavy snapshot endpoint: max 20 req/min
const snapshotLimiter = rateLimit({
  windowMs: 60 * 1000,
  max:      20,
  message:  { success: false, message: '⏳ Too many requests. Please wait a moment.' },
  keyGenerator: (req: any) => req.userId || req.ip,
});

// Standard brain endpoints: max 60 req/min
const standardLimiter = rateLimit({
  windowMs: 60 * 1000,
  max:      60,
  message:  { success: false, message: '⏳ Too many requests.' },
  keyGenerator: (req: any) => req.userId || req.ip,
});

// All brain routes require auth
router.use(authenticate);

// ── Heavy endpoints ───────────────────────────────────────────
router.get('/snapshot',        snapshotLimiter, getSnapshot);       // Full brain data
router.get('/daily-plan',      snapshotLimiter, getTodayPlan);      // Today's learning plan

// ── Standard endpoints ────────────────────────────────────────
router.get('/topic-analysis',  standardLimiter, getTopicAnalysis);  // Topic intelligence
router.get('/insights',        standardLimiter, getInsights);       // Live insights
router.get('/context',         standardLimiter, getContext);        // AI context packet
router.get('/summary',         standardLimiter, getSummary);        // Compact summary
router.get('/weak-actions',    standardLimiter, getWeakActions);    // Weakness action plan
router.get('/priority-topics', standardLimiter, getPriorityTopics); // Top priority topics

export default router;