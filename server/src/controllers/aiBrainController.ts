/**
 * AI Study OS — AI Brain Controller (Extended API)
 * ─────────────────────────────────────────────────────────────
 * New REST endpoints that expose the AI Brain system.
 *
 * These endpoints EXTEND the existing brainController.ts —
 * they do NOT replace it. All existing routes still work.
 *
 * New endpoints provided:
 *   GET  /api/aibrain/snapshot       Full brain data for dashboard
 *   GET  /api/aibrain/daily-plan     Today's personalized learning plan
 *   GET  /api/aibrain/topic-analysis Detailed topic intelligence
 *   GET  /api/aibrain/insights       Live progress insights
 *   GET  /api/aibrain/context        AI context packet (for AskAI)
 *   GET  /api/aibrain/summary        Compact student summary string
 *   GET  /api/aibrain/weak-actions   Priority actions for weak topics
 */

import { Request, Response } from 'express';
import { getUserIdFromToken } from '../middleware/authMiddleware.js';
import {
  getBrainSnapshot,
  getAITutorContext,
  getStudentSummary,
  getDailyPlan,
  getWeakTopicActions,
  getLiveProgressInsights,
  getTopicIntelligence,
  getPriorityFocusTopics,
} from '../services/aiBrain/aiBrain.service.js';
import { logger } from '../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// GET /api/aibrain/snapshot
// Full brain snapshot — used by the Brain Dashboard page.
// Heavy operation (runs all sub-modules in parallel).
// ─────────────────────────────────────────────────────────────
export async function getSnapshot(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  try {
    const snapshot = await getBrainSnapshot(userId);

    if (!snapshot) {
      res.json({
        success: false,
        message: 'Brain profile not set up yet. Complete onboarding first.',
        code: 'NO_PROFILE',
      });
      return;
    }

    res.json({ success: true, snapshot });
  } catch (err: any) {
    logger.error(`[AIBrainController] getSnapshot: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to generate brain snapshot' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/aibrain/daily-plan
// Today's personalized learning plan with recommendations.
// Used by Dashboard "Today's Focus" card.
// ─────────────────────────────────────────────────────────────
export async function getTodayPlan(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  try {
    const plan = await getDailyPlan(userId);

    if (!plan) {
      res.json({
        success: true,
        plan: {
          date: new Date().toISOString().split('T')[0],
          greeting: 'Welcome! Let\'s start learning.',
          focusMessage: 'Complete your profile setup to get personalized recommendations.',
          recommendations: [],
          motivationalNote: 'Every expert was once a beginner. Start today!',
          studyGoalMins: 20,
        },
      });
      return;
    }

    res.json({ success: true, plan });
  } catch (err: any) {
    logger.error(`[AIBrainController] getTodayPlan: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to generate daily plan' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/aibrain/topic-analysis
// Detailed topic intelligence — weak/critical/strong breakdown.
// Used by Brain Dashboard topic cards and progress pages.
// ─────────────────────────────────────────────────────────────
export async function getTopicAnalysis(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  try {
    const analysis = await getTopicIntelligence(userId);

    if (!analysis) {
      res.json({
        success: true,
        analysis: {
          critical: [], weak: [], atRisk: [], strong: [],
          summary: {
            totalTopicsTracked: 0, criticalCount: 0, weakCount: 0,
            atRiskCount: 0, strongCount: 0,
            weakestSubject: null, mostImproved: null, mostDeclined: null,
          },
        },
        message: 'No topic data yet. Take some quizzes to build your profile.',
      });
      return;
    }

    res.json({ success: true, analysis });
  } catch (err: any) {
    logger.error(`[AIBrainController] getTopicAnalysis: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to analyze topics' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/aibrain/insights
// Live progress insights — real-time without DB write.
// Used in notification bell, dashboard header messages.
// ─────────────────────────────────────────────────────────────
export async function getInsights(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  try {
    const insights = await getLiveProgressInsights(userId);
    res.json({ success: true, insights, count: insights.length });
  } catch (err: any) {
    logger.error(`[AIBrainController] getInsights: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to get insights' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/aibrain/context
// AI context packet — used internally by AskAI.
// Can also be fetched by frontend to preview what AI knows.
// ─────────────────────────────────────────────────────────────
export async function getContext(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  try {
    const context = await getAITutorContext(userId);

    if (!context) {
      res.json({
        success: true,
        context: null,
        message: 'Set up your brain profile to enable personalized AI context.',
      });
      return;
    }

    res.json({ success: true, context });
  } catch (err: any) {
    logger.error(`[AIBrainController] getContext: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to build AI context' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/aibrain/summary
// Compact string summary — for debugging and lightweight use.
// ─────────────────────────────────────────────────────────────
export async function getSummary(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  try {
    const summary = await getStudentSummary(userId);
    res.json({ success: true, summary });
  } catch (err: any) {
    logger.error(`[AIBrainController] getSummary: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to get summary' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/aibrain/weak-actions
// Top priority actions for weak topics.
// Used in "What to do next?" card.
// ─────────────────────────────────────────────────────────────
export async function getWeakActions(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  const limit = Math.min(parseInt(req.query.limit as string || '3', 10), 5);

  try {
    const actions = await getWeakTopicActions(userId, limit);
    res.json({ success: true, actions, count: actions.length });
  } catch (err: any) {
    logger.error(`[AIBrainController] getWeakActions: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to get weak topic actions' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/aibrain/priority-topics
// Top N priority focus topics right now.
// ─────────────────────────────────────────────────────────────
export async function getPriorityTopics(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  const limit = Math.min(parseInt(req.query.limit as string || '3', 10), 5);

  try {
    const topics = await getPriorityFocusTopics(userId, limit);
    res.json({ success: true, topics, count: topics.length });
  } catch (err: any) {
    logger.error(`[AIBrainController] getPriorityTopics: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to get priority topics' });
  }
}