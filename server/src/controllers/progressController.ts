/**
 * AI Study OS — Progress Intelligence Controller (Stage 4 + Stage 6)
 * ─────────────────────────────────────────────────────────────
 * REST API endpoints for the AI Progress Intelligence System.
 *
 * Endpoints:
 *   GET  /api/progress/analysis    Full progress analysis
 *   GET  /api/progress/snapshot    Quick score + insights
 *   GET  /api/progress/insights    Insight cards only
 *   GET  /api/progress/score       Progress score only
 *   GET  /api/progress/weekly      Weekly AI report
 *   GET  /api/progress/trends      Trend analysis
 *   POST /api/progress/event       Activity event trigger
 *
 * Stage 6 additions:
 *   - AI Mentor trigger after quiz_done event
 *   - AI Mentor trigger after step_completed event
 */

import { Request, Response } from 'express';
import { getUserIdFromToken } from '../middleware/authMiddleware.js';
import {
  runProgressAnalysis,
  getProgressSnapshot,
  getInsightsOnly,
  getWeeklyReportOnly,
  onActivityEvent,
} from '../services/progressSystem/progressAnalyzer.js';
import { capturePerformance }     from '../services/progressSystem/performanceTracker.js';
import { calculateProgressScore } from '../services/progressSystem/progressScoreCalculator.js';
import { analyzeTrends }          from '../services/progressSystem/learningTrendAnalyzer.js';
import { logger }                 from '../utils/logger.js';

// ── Stage 6: AI Mentor ────────────────────────────────────────
import { aiMentorEngine } from '../services/aiMentor/aiMentorEngine.js';

// ─────────────────────────────────────────────────────────────
// GET /api/progress/analysis
// Full pipeline — dashboard initial load
// ─────────────────────────────────────────────────────────────
export async function getFullAnalysis(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  try {
    const analysis = await runProgressAnalysis(userId);
    if (!analysis) {
      res.json({
        success: false,
        code:    'NO_PROFILE',
        message: 'Complete onboarding first to get your progress analysis.',
      });
      return;
    }
    res.json({ success: true, analysis });
  } catch (err: any) {
    logger.error(`[ProgressController] getFullAnalysis: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to run progress analysis.' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/progress/snapshot
// Quick score + insights — for widgets (no weekly report)
// ─────────────────────────────────────────────────────────────
export async function getSnapshot(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  try {
    const snap = await getProgressSnapshot(userId);
    if (!snap) {
      res.json({ success: true, snapshot: null, message: 'No data yet — start learning to see your progress!' });
      return;
    }
    res.json({ success: true, ...snap });
  } catch (err: any) {
    logger.error(`[ProgressController] getSnapshot: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to get progress snapshot.' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/progress/insights
// Insight cards only — notification bell + insight panel
// ─────────────────────────────────────────────────────────────
export async function getInsights(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  try {
    const bundle = await getInsightsOnly(userId);
    if (!bundle) {
      res.json({ success: true, cards: [], unreadCount: 0, focusAlert: false });
      return;
    }
    res.json({
      success:      true,
      cards:        bundle.cards,
      primary:      bundle.primaryInsight,
      unreadCount:  bundle.unreadCount,
      focusAlert:   bundle.focusAlert,
      generatedAt:  bundle.generatedAt,
    });
  } catch (err: any) {
    logger.error(`[ProgressController] getInsights: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to get insights.' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/progress/score
// Progress score only — for score widget
// ─────────────────────────────────────────────────────────────
export async function getScore(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  try {
    const snap = await capturePerformance(userId);
    if (!snap) {
      res.json({ success: true, score: null });
      return;
    }
    const score = calculateProgressScore(snap);
    snap.progressScore = score.total;
    res.json({
      success: true,
      score:   score.total,
      tier:    score.tierLabel,
      icon:    score.tierIcon,
      trend:   score.trend,
      breakdown: score.breakdown,
      message: score.message,
      nextMilestone: score.nextMilestone,
    });
  } catch (err: any) {
    logger.error(`[ProgressController] getScore: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to get score.' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/progress/weekly
// Weekly AI progress report
// ─────────────────────────────────────────────────────────────
export async function getWeeklyReport(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  try {
    const report = await getWeeklyReportOnly(userId);
    if (!report) {
      res.json({ success: true, report: null, message: 'No weekly report yet — keep learning!' });
      return;
    }
    res.json({ success: true, report });
  } catch (err: any) {
    logger.error(`[ProgressController] getWeeklyReport: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to generate weekly report.' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/progress/trends
// Trend analysis only — for trend charts
// ─────────────────────────────────────────────────────────────
export async function getTrends(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  try {
    const snap = await capturePerformance(userId);
    if (!snap) {
      res.json({ success: true, trends: null });
      return;
    }
    const trends = analyzeTrends(snap);
    res.json({ success: true, trends });
  } catch (err: any) {
    logger.error(`[ProgressController] getTrends: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to get trends.' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/progress/event
// Activity event → triggers adaptive insight update
// Body: { eventType, topic?, subject?, score?, mode? }
// Called by: quiz system, coding system, AI tutor, learning steps
//
// Stage 6: After quiz_done / step_completed → AI Mentor check
// ─────────────────────────────────────────────────────────────
export async function trackEvent(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  const { eventType, topic, subject, score, mode } = req.body;

  const validEvents = ['quiz_done', 'ai_tutor_used', 'coding_done', 'login', 'step_completed'];
  if (!eventType || !validEvents.includes(eventType)) {
    res.status(400).json({
      success: false,
      message: `eventType must be one of: ${validEvents.join(', ')}`,
    });
    return;
  }

  try {
    const result = await onActivityEvent(userId, eventType, { topic, subject, score, mode });

    res.json({
      success:     true,
      insight:     result.insight,
      scoreUpdate: result.scoreUpdate,
    });

    // ── Stage 6: Trigger AI Mentor after quiz or lesson complete ──
    // Non-blocking — runs after response is already sent
    if (eventType === 'quiz_done' || eventType === 'step_completed' || eventType === 'coding_done') {
      const mentorTrigger = eventType === 'quiz_done' ? 'quiz_complete' : 'lesson_complete';
      setImmediate(() => {
        aiMentorEngine.runAIMentor(userId, { trigger: mentorTrigger as any }).catch((err: any) => {
          logger.warn({ userId, err }, '[ProgressController] Mentor trigger failed (non-critical)');
        });
      });
    }

  } catch (err: any) {
    logger.error(`[ProgressController] trackEvent: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to track event.' });
  }
}