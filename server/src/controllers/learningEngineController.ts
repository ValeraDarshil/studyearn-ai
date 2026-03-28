/**
 * AI Study OS — Learning Engine Controller (Stage 3)
 * ─────────────────────────────────────────────────────────────
 * REST API endpoints for the Personal Learning Engine.
 *
 * Endpoints:
 *   GET  /api/learn/plan          Full learning plan (dashboard)
 *   GET  /api/learn/daily         Today's daily schedule
 *   GET  /api/learn/path          7-day adaptive learning path
 *   GET  /api/learn/priorities    Priority topics ranked
 *   GET  /api/learn/difficulty    Difficulty settings per topic
 *   GET  /api/learn/recommend     Contextual recommendation
 *   POST /api/learn/quiz-done     Adaptive trigger after quiz
 */

import { Request, Response } from 'express';
import { getUserIdFromToken } from '../middleware/authMiddleware.js';
import {
  getFullLearningPlan,
  getDailyPlanOnly,
  getPriorityTopicsForUser,
  getAdaptivePath,
  getContextualRecommendation,
  getDifficultySettings,
  onQuizComplete,
} from '../services/learningSystem/personalLearningEngine.js';
import { logger } from '../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// GET /api/learn/plan
// Full learning plan — used on dashboard initial load
// Heavy (runs all modules in parallel)
// ─────────────────────────────────────────────────────────────
export async function getFullPlan(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  const subject = req.query.subject as string | undefined;

  try {
    const plan = await getFullLearningPlan(userId, subject);

    if (!plan) {
      res.json({
        success: false,
        code:    'NO_PROFILE',
        message: 'Set up your AI Brain profile first to get a personalized learning plan.',
      });
      return;
    }

    res.json({ success: true, plan });
  } catch (err: any) {
    logger.error(`[LearnController] getFullPlan: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to generate learning plan.' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/learn/daily
// Today's daily schedule — fast, for home widget
// ─────────────────────────────────────────────────────────────
export async function getDailySchedule(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  try {
    const plan = await getDailyPlanOnly(userId);

    if (!plan) {
      res.json({
        success: true,
        plan: {
          date:         new Date().toISOString().split('T')[0],
          greeting:     "Welcome! Let's start learning.",
          headline:     'Set up your profile to get a personalized daily plan.',
          totalMins:    0,
          tasks:        [],
          motivationMsg:'Complete your AI Brain setup to unlock your daily study plan.',
          streakStatus: 'No streak yet — start today!',
          studyTip:     'Even 15 minutes a day compounds into mastery over time.',
          isRestDay:    false,
          categoryBadge:'📖 Learner',
        },
      });
      return;
    }

    res.json({ success: true, plan });
  } catch (err: any) {
    logger.error(`[LearnController] getDailySchedule: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to get daily schedule.' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/learn/path
// Adaptive 7-day learning path
// ─────────────────────────────────────────────────────────────
export async function getAdaptiveLearningPath(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  const subject = req.query.subject as string | undefined;

  try {
    const path = await getAdaptivePath(userId, subject);

    if (!path) {
      res.json({ success: false, message: 'Could not generate path. Complete onboarding first.' });
      return;
    }

    res.json({ success: true, path });
  } catch (err: any) {
    logger.error(`[LearnController] getAdaptiveLearningPath: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to generate path.' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/learn/priorities
// Priority topics ranked by urgency
// ─────────────────────────────────────────────────────────────
export async function getPriorityTopics(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  const limit = Math.min(parseInt(req.query.limit as string || '5', 10), 10);

  try {
    const topics = await getPriorityTopicsForUser(userId, limit);
    res.json({ success: true, topics, count: topics.length });
  } catch (err: any) {
    logger.error(`[LearnController] getPriorityTopics: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to get priority topics.' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/learn/difficulty
// Difficulty settings for all topics
// ─────────────────────────────────────────────────────────────
export async function getDifficulty(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  try {
    const settings = await getDifficultySettings(userId);
    res.json({ success: true, settings, count: settings.length });
  } catch (err: any) {
    logger.error(`[LearnController] getDifficulty: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to get difficulty settings.' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/learn/recommend
// Contextual recommendation for current moment
// ─────────────────────────────────────────────────────────────
export async function getRecommendation(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  const trigger = (req.query.trigger as string || 'login') as any;
  const topic   = req.query.topic   as string | undefined;
  const subject = req.query.subject as string | undefined;

  try {
    const bundle = await getContextualRecommendation(userId, trigger, { topic, subject });

    if (!bundle) {
      res.json({ success: true, bundle: null, message: 'No recommendations available yet.' });
      return;
    }

    res.json({ success: true, bundle });
  } catch (err: any) {
    logger.error(`[LearnController] getRecommendation: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to get recommendation.' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/learn/quiz-done
// Adaptive cycle trigger — called after every quiz
// Body: { topic, subject, score }
// ─────────────────────────────────────────────────────────────
export async function quizCompleted(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) { res.status(401).json({ success: false }); return; }

  const { topic, subject, score } = req.body;

  if (!topic || !subject || score === undefined) {
    res.status(400).json({ success: false, message: 'topic, subject, and score are required.' });
    return;
  }

  if (typeof score !== 'number' || score < 0 || score > 100) {
    res.status(400).json({ success: false, message: 'score must be a number between 0 and 100.' });
    return;
  }

  try {
    const result = await onQuizComplete(userId, topic, subject, score);
    res.json({
      success: true,
      recommendation:    result.recommendation,
      updatedDifficulty: result.updatedDifficulty,
    });
  } catch (err: any) {
    logger.error(`[LearnController] quizCompleted: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to process quiz completion.' });
  }
}