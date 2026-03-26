/**
 * AI Study OS — AI Brain Controller
 * ─────────────────────────────────────────────────────────────
 * FIX: brainSetupCompleted DB mein save hota hai —
 * baar baar login pe onboarding nahi aata.
 */

import { Request, Response } from 'express';
import { getUserIdFromToken } from '../middleware/authMiddleware.js';
import {
  getOrCreateProfile,
  updateLearnerCategory,
  getProfileSummary,
  getHeatmapData,
  updateTopicMastery,
  syncActivityToProfile,
} from '../services/studentProfileService.js';
import {
  generateTodayFocus,
  generateLearningPath,
  getActiveLearningPath,
  completeLearningStep,
} from '../services/learningEngineService.js';
import {
  generateWeeklyReport,
  getUnreadAlerts,
  getLatestReport,
  generateQuizAlert,
} from '../services/progressIntelService.js';
import { User } from '../models/User.model.js';
import { logger } from '../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// POST /api/brain/setup
// ─────────────────────────────────────────────────────────────
export async function setupProfile(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const { learnerCategory, classLevel, primarySubjects, preferredLanguage } = req.body;

  if (!['school', 'coding', 'college', 'self'].includes(learnerCategory)) {
    res.status(400).json({ success: false, message: 'Invalid learnerCategory' });
    return;
  }

  try {
    await updateLearnerCategory(userId, learnerCategory, classLevel, primarySubjects, preferredLanguage);

    const profile = await getOrCreateProfile(userId, {
      learnerCategory,
      classLevel,
      primarySubjects,
      preferredLanguage,
    });

    // ✅ KEY FIX: DB mein permanently save karo
    // Yeh field /api/auth/me response mein aayegi
    // Frontend isko check karta hai — localStorage pe depend nahi karte
    // Isse chahe koi bhi device ya browser pe login kare, onboarding dobara nahi aayega
    await User.findByIdAndUpdate(userId, {
      brainSetupCompleted: true,
      onboardingCompleted: true,
    });

    res.json({ success: true, message: 'Profile set up successfully', profile });
  } catch (err: any) {
    logger.error(`[BrainController] setup: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to set up profile' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/brain/profile
// ─────────────────────────────────────────────────────────────
export async function getProfile(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    res.status(401).json({ success: false });
    return;
  }

  try {
    let profile: any = await getProfileSummary(userId);

    if (!profile) {
      profile = await getOrCreateProfile(userId);
    }

    res.json({ success: true, profile });
  } catch (err: any) {
    logger.error(`[BrainController] getProfile: ${err.message}`);
    res.status(500).json({ success: false, message: 'Failed to get profile' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/brain/heatmap
// ─────────────────────────────────────────────────────────────
export async function getHeatmap(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    res.status(401).json({ success: false });
    return;
  }

  try {
    const data = await getHeatmapData(userId);
    res.json({ success: true, heatmap: data });
  } catch (err: any) {
    logger.error(`[BrainController] getHeatmap: ${err.message}`);
    res.status(500).json({ success: false });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/brain/today-focus
// ─────────────────────────────────────────────────────────────
export async function getTodayFocus(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    res.status(401).json({ success: false });
    return;
  }

  try {
    const focus = await generateTodayFocus(userId);

    if (!focus) {
      res.json({
        success: true,
        focus: {
          title: "Today's Focus: Start Learning!",
          description: 'Complete your profile setup to get personalized recommendations.',
          focusTopic: 'Getting Started',
          subject: 'General',
          estimatedMinutes: 15,
          difficulty: 'beginner',
        },
      });
      return;
    }

    res.json({ success: true, focus });
  } catch (err: any) {
    logger.error(`[BrainController] todayFocus: ${err.message}`);
    res.status(500).json({ success: false });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/brain/learning-path
// ─────────────────────────────────────────────────────────────
export async function getLearningPath(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    res.status(401).json({ success: false });
    return;
  }

  const { subject, forceRegenerate } = req.body;

  try {
    if (!forceRegenerate) {
      const existing = await getActiveLearningPath(userId);
      if (existing) {
        res.json({ success: true, path: existing, isNew: false });
        return;
      }
    }

    const result = await generateLearningPath(userId, { subject, forceRegenerate });

    if (!result) {
      res.status(500).json({ success: false, message: 'Failed to generate learning path' });
      return;
    }

    res.json({ success: true, path: result.path, isNew: true });
  } catch (err: any) {
    logger.error(`[BrainController] getLearningPath: ${err.message}`);
    res.status(500).json({ success: false });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/brain/complete-step
// ─────────────────────────────────────────────────────────────
export async function completeStep(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    res.status(401).json({ success: false });
    return;
  }

  const { pathId, stepId } = req.body;

  if (!pathId || !stepId) {
    res.status(400).json({ success: false, message: 'pathId and stepId required' });
    return;
  }

  try {
    const result = await completeLearningStep(userId, pathId, stepId);

    if (!result) {
      res.status(404).json({ success: false, message: 'Step not found or already completed' });
      return;
    }

    await User.findByIdAndUpdate(userId, {
      $inc: { points: result.xpEarned, totalXP: result.xpEarned },
    });

    res.json({ success: true, ...result });
  } catch (err: any) {
    logger.error(`[BrainController] completeStep: ${err.message}`);
    res.status(500).json({ success: false });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/brain/weekly-report
// ─────────────────────────────────────────────────────────────
export async function getWeeklyReport(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    res.status(401).json({ success: false });
    return;
  }

  try {
    let report = await getLatestReport(userId, 'weekly');

    if (!report) {
      report = await generateWeeklyReport(userId);
    }

    res.json({ success: true, report });
  } catch (err: any) {
    logger.error(`[BrainController] weeklyReport: ${err.message}`);
    res.status(500).json({ success: false });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/brain/alerts
// ─────────────────────────────────────────────────────────────
export async function getAlerts(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    res.status(401).json({ success: false });
    return;
  }

  try {
    const alerts = await getUnreadAlerts(userId);
    res.json({ success: true, alerts, count: alerts.length });
  } catch (err: any) {
    logger.error(`[BrainController] getAlerts: ${err.message}`);
    res.status(500).json({ success: false });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/brain/quiz-result
// ─────────────────────────────────────────────────────────────
export async function submitQuizResult(req: Request, res: Response): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    res.status(401).json({ success: false });
    return;
  }

  const { subject, topic, score, totalQuestions, correctAnswers, timeSpentSecs } = req.body;

  if (!subject || !topic || score === undefined) {
    res.status(400).json({ success: false, message: 'subject, topic, score required' });
    return;
  }

  try {
    await updateTopicMastery(userId, {
      subject,
      topic,
      isCorrect: correctAnswers >= Math.ceil(totalQuestions * 0.6),
      timeSpentSecs: timeSpentSecs ?? 60,
      source: 'quiz',
    });

    await syncActivityToProfile(userId, 'quiz_completed', 20);

    const alert = await generateQuizAlert(userId, topic, subject, score);

    res.json({ success: true, alert, masteryUpdated: true });
  } catch (err: any) {
    logger.error(`[BrainController] quizResult: ${err.message}`);
    res.status(500).json({ success: false });
  }
}