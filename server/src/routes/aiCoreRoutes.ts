// ─────────────────────────────────────────────────────────────
// AI Study OS — AI Core Routes (Stage 5)
// Base: /api/ai-core
//
// Endpoints:
//  POST /api/ai-core/orchestrate        → Manual trigger orchestration
//  GET  /api/ai-core/state/:userId      → Get student state
//  GET  /api/ai-core/context            → Get fused AI context
//  POST /api/ai-core/invalidate-cache   → Force fresh orchestration
//  GET  /api/ai-core/health             → Health check
//
// File location: server/src/routes/aiCoreRoutes.ts
// ─────────────────────────────────────────────────────────────

import express, { Request, Response } from 'express';
import { authenticate, getUserIdFromToken } from '../middleware/authMiddleware.js';
import { logger }                     from '../utils/logger.js';
import {
  runAIOrchestration,
  getFusedContextForAI,
  invalidateOrchestrationCache,
  OrchestrationTrigger,
} from '../services/aiCore/aiOrchestrator.js';
import { studentStateManager }        from '../services/aiCore/studentStateManager.js';

const router = express.Router();

// ── All routes require authentication ──────────────────────────
router.use(authenticate);

// ─────────────────────────────────────────────────────────────
// POST /api/ai-core/orchestrate
// Manually trigger full AI orchestration for logged-in user
// Body: { trigger?: OrchestrationTrigger, force?: boolean }
// ─────────────────────────────────────────────────────────────
router.post('/orchestrate', async (req: Request, res: Response) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const trigger      = (req.body.trigger as OrchestrationTrigger) || 'manual';
    const forceFullRun = req.body.force === true;

    logger.info({ userId, trigger }, '[AICoreRoutes] Manual orchestration requested');

    const result = await runAIOrchestration(userId, {
      trigger,
      forceFullRun,
      contextOnly: false,
    });

    return res.json({
      success:      result.success,
      studentState: result.studentState,
      tasksRun:     result.tasksExecuted,
      executionMs:  result.executionMs,
      errors:       result.errors,
      triggeredAt:  result.triggeredAt,
      // Don't expose full fusedContext to client — it's for server use
      contextReady: !!result.fusedContext,
    });
  } catch (err: any) {
    logger.error({ userId, err: err.message }, '[AICoreRoutes] Orchestration failed');
    return res.status(500).json({ success: false, message: 'Orchestration failed: ' + err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/ai-core/state
// Returns the current student state + alerts
// ─────────────────────────────────────────────────────────────
router.get('/state', async (req: Request, res: Response) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const stateData = await studentStateManager.getState(userId);

    return res.json({
      success:            true,
      currentState:       stateData.currentState,
      confidence:         stateData.confidence,
      streakDays:         stateData.streakDays,
      overallMastery:     stateData.overallMastery,
      daysSinceLastLogin: stateData.daysSinceLastLogin,
      learningVelocity:   stateData.learningVelocity,
      weakTopics:         stateData.weakTopics,
      strongTopics:       stateData.strongTopics,
      alerts:             stateData.alerts,
      isFirstSession:     stateData.isFirstSession,
      analyzedAt:         stateData.analyzedAt,
    });
  } catch (err: any) {
    logger.error({ userId, err: err.message }, '[AICoreRoutes] getState failed');
    return res.status(500).json({ success: false, message: 'Failed to get student state' });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/ai-core/context
// Returns the fused AI context (for debugging / frontend display)
// ─────────────────────────────────────────────────────────────
router.get('/context', async (req: Request, res: Response) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const fusedCtx = await getFusedContextForAI(userId);

    if (!fusedCtx) {
      return res.json({ success: false, message: 'Context not available yet. Login again to trigger.' });
    }

    return res.json({
      success:             true,
      learningType:        fusedCtx.learningType,
      classLevel:          fusedCtx.classLevel,
      skillLevel:          fusedCtx.skillLevel,
      currentState:        fusedCtx.currentState,
      isStruggling:        fusedCtx.isStruggling,
      isImproving:         fusedCtx.isImproving,
      weakTopics:          fusedCtx.weakTopics,
      strongTopics:        fusedCtx.strongTopics,
      persistentWeakAreas: fusedCtx.persistentWeakAreas,
      overallMastery:      fusedCtx.overallMastery,
      streakDays:          fusedCtx.streakDays,
      recentQuestions:     fusedCtx.recentQuestions,
      sourcesSynced:       fusedCtx.sourcesSynced,
      fusedAt:             fusedCtx.fusedAt,
      // systemPromptPrefix hidden from client (server-only)
    });
  } catch (err: any) {
    logger.error({ userId, err: err.message }, '[AICoreRoutes] getContext failed');
    return res.status(500).json({ success: false, message: 'Failed to get AI context' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/ai-core/invalidate-cache
// Force a fresh orchestration on next request
// ─────────────────────────────────────────────────────────────
router.post('/invalidate-cache', async (req: Request, res: Response) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    invalidateOrchestrationCache(userId);
    logger.info({ userId }, '[AICoreRoutes] Cache invalidated');
    return res.json({ success: true, message: 'Cache cleared. Next request will run fresh orchestration.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/ai-core/health
// Health check — no auth required
// ─────────────────────────────────────────────────────────────
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success:   true,
    stage:     5,
    system:    'AI Orchestrator',
    status:    'operational',
    timestamp: new Date().toISOString(),
  });
});

export default router;