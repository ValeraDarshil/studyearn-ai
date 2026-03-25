/**
 * AI Study OS — Student Profile Service
 * ─────────────────────────────────────────────────────────────
 * The "AI Student Brain" — central intelligence engine.
 *
 * Responsibilities:
 *   1. Create/get a student's intelligence profile
 *   2. Update topic mastery after quiz/AI/coding events
 *   3. Sync GitHub-style activity into the profile
 *   4. Auto-classify weak/strong topics
 *   5. Compute learning speed and overall mastery score
 *   6. Update daily study logs (used for heatmap)
 *   7. Manage streak tracking inside profile
 */

import { StudentProfile, IStudentProfile, ITopicMastery, LearnerCategory } from '../models/StudentProfile.model.js';
import { logger } from '../utils/logger.js';

// ── Mastery thresholds ────────────────────────────────────────
const WEAK_THRESHOLD   = 40;
const STRONG_THRESHOLD = 80;

// ── Default tutor personality by category ────────────────────
const TUTOR_PERSONALITY: Record<LearnerCategory, 'simple' | 'normal' | 'advanced'> = {
  school:  'simple',
  coding:  'normal',
  college: 'advanced',
  self:    'normal',
};

// ── Helpers ───────────────────────────────────────────────────
function getTodayIST(): string {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().split('T')[0];
}

function getWeekKey(): string {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

// ─────────────────────────────────────────────────────────────
// 1. GET OR CREATE PROFILE
//    Called during onboarding or first-time usage.
// ─────────────────────────────────────────────────────────────
export async function getOrCreateProfile(
  userId: string,
  options?: {
    learnerCategory?: LearnerCategory;
    classLevel?: string;
    primarySubjects?: string[];
    preferredLanguage?: 'english' | 'hinglish';
  }
): Promise<IStudentProfile> {
  try {
    let profile = await StudentProfile.findOne({ userId });
    if (profile) return profile;

    const category = options?.learnerCategory ?? 'self';
    profile = await StudentProfile.create({
      userId,
      learnerCategory:   category,
      classLevel:        options?.classLevel ?? null,
      primarySubjects:   options?.primarySubjects ?? [],
      preferredLanguage: options?.preferredLanguage ?? 'english',
      tutorPersonality:  TUTOR_PERSONALITY[category],
    });

    logger.info(`[ProfileService] Created new profile for ${userId} (${category})`);
    return profile;
  } catch (err: any) {
    logger.error(`[ProfileService] getOrCreate failed: ${err.message}`);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// 2. UPDATE TOPIC MASTERY
//    Called after: quiz attempt, AI Q&A, code section, challenge.
//
//    isCorrect:       was the answer / quiz correct?
//    timeSpentSecs:   how long did the student take?
// ─────────────────────────────────────────────────────────────
export async function updateTopicMastery(
  userId: string,
  payload: {
    subject: string;
    topic: string;
    isCorrect: boolean;
    timeSpentSecs?: number;
    source: 'quiz' | 'ai_tutor' | 'coding' | 'challenge';
  }
): Promise<void> {
  try {
    const profile = await StudentProfile.findOne({ userId });
    if (!profile) return;

    const { subject, topic, isCorrect, timeSpentSecs = 60 } = payload;
    const now = new Date();
    const today = getTodayIST();

    // ── Find or create topic entry ──────────────────────────
    let entry = profile.topicMastery.find(
      t => t.topic.toLowerCase() === topic.toLowerCase() && t.subject === subject
    );

    if (!entry) {
      const newEntry: ITopicMastery = {
        topic,
        subject,
        category: profile.learnerCategory,
        masteryLevel: 0,
        correctAttempts: 0,
        totalAttempts: 0,
        lastAttemptedAt: null,
        isWeak: false,
        isStrong: false,
        trend: 'stable',
      };
      profile.topicMastery.push(newEntry);
      entry = profile.topicMastery[profile.topicMastery.length - 1];
    }

    const prevMastery = entry.masteryLevel;

    // ── Update attempts ──────────────────────────────────────
    entry.totalAttempts   += 1;
    entry.correctAttempts += isCorrect ? 1 : 0;
    entry.lastAttemptedAt  = now;

    // ── Mastery formula ──────────────────────────────────────
    // Weighted: recent performance matters more
    // Base = (correct / total) * 100, then smooth with EMA
    const rawAccuracy = (entry.correctAttempts / entry.totalAttempts) * 100;
    const ema = 0.7 * rawAccuracy + 0.3 * prevMastery;
    entry.masteryLevel = Math.round(Math.min(100, Math.max(0, ema)));

    // ── Trend ──────────────────────────────────────────────
    const delta = entry.masteryLevel - prevMastery;
    if      (delta > 2)  entry.trend = 'improving';
    else if (delta < -2) entry.trend = 'declining';
    else                 entry.trend = 'stable';

    // ── Weak / Strong flags ───────────────────────────────
    entry.isWeak   = entry.masteryLevel < WEAK_THRESHOLD;
    entry.isStrong = entry.masteryLevel >= STRONG_THRESHOLD;

    // ── Update quick-access lists ──────────────────────────
    profile.weakTopics   = profile.topicMastery.filter(t => t.isWeak).map(t => t.topic);
    profile.strongTopics = profile.topicMastery.filter(t => t.isStrong).map(t => t.topic);

    // ── Recent mistakes ────────────────────────────────────
    if (!isCorrect) {
      profile.recentMistakes = [topic, ...profile.recentMistakes.filter(t => t !== topic)].slice(0, 10);
    }

    // ── Overall mastery score (weighted average) ──────────
    const mastery = profile.topicMastery;
    if (mastery.length > 0) {
      profile.overallMasteryScore = Math.round(
        mastery.reduce((sum, t) => sum + t.masteryLevel, 0) / mastery.length
      );
    }

    // ── Learning speed ─────────────────────────────────────
    const prevAvg = profile.avgTimePerQuestion;
    profile.avgTimePerQuestion = Math.round(0.8 * prevAvg + 0.2 * timeSpentSecs);
    if      (profile.avgTimePerQuestion < 30) profile.learningSpeed = 'fast';
    else if (profile.avgTimePerQuestion > 90) profile.learningSpeed = 'slow';
    else                                      profile.learningSpeed = 'medium';

    // ── Daily log update ───────────────────────────────────
    let log = profile.dailyLogs.find(d => d.date === today);
    if (!log) {
      profile.dailyLogs.push({ date: today, minutesStudied: 0, questionsAsked: 0, quizzesCompleted: 0, codingSectionsCompleted: 0, xpEarned: 0, topicsCovered: [] });
      log = profile.dailyLogs[profile.dailyLogs.length - 1];
    }
    if (!log.topicsCovered.includes(topic)) log.topicsCovered.push(topic);
    if (payload.source === 'quiz')    log.quizzesCompleted   += 1;
    if (payload.source === 'ai_tutor') log.questionsAsked    += 1;
    if (payload.source === 'coding')  log.codingSectionsCompleted += 1;
    log.minutesStudied += Math.round(timeSpentSecs / 60);

    // Keep only last 365 days
    if (profile.dailyLogs.length > 365) {
      profile.dailyLogs = profile.dailyLogs.slice(-365);
    }

    await profile.save();
  } catch (err: any) {
    logger.error(`[ProfileService] updateTopicMastery: ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────
// 3. SYNC ACTIVITY (GitHub-style heatmap integration)
//    Called from existing Activity model hooks.
//    Translates Activity actions → daily log entries.
// ─────────────────────────────────────────────────────────────
export async function syncActivityToProfile(
  userId: string,
  action: string,
  xpEarned: number = 0,
  details: string = ''
): Promise<void> {
  try {
    const profile = await StudentProfile.findOne({ userId });
    if (!profile) return;

    const today = getTodayIST();
    let log = profile.dailyLogs.find(d => d.date === today);
    if (!log) {
      profile.dailyLogs.push({ date: today, minutesStudied: 0, questionsAsked: 0, quizzesCompleted: 0, codingSectionsCompleted: 0, xpEarned: 0, topicsCovered: [] });
      log = profile.dailyLogs[profile.dailyLogs.length - 1];
    }

    log.xpEarned += xpEarned;

    // Map actions to counters
    if (action === 'ask_question')          log.questionsAsked += 1;
    if (action === 'quiz_completed')        log.quizzesCompleted += 1;
    if (action === 'daily_challenge')       log.quizzesCompleted += 1;

    // Streak tracking
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = new Date(yesterday.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (profile.lastStudyDate !== today) {
      if (profile.lastStudyDate === yKey) {
        profile.currentStreak += 1;
      } else if (profile.lastStudyDate !== today) {
        profile.currentStreak = 1;
      }
      profile.longestStreak  = Math.max(profile.longestStreak, profile.currentStreak);
      profile.totalStudyDays += 1;
      profile.lastStudyDate   = today;
    }

    await profile.save();
  } catch (err: any) {
    logger.error(`[ProfileService] syncActivity: ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────
// 4. GET CONTEXT FOR AI TUTOR
//    Returns a context object the AI uses to personalize answers.
// ─────────────────────────────────────────────────────────────
export async function getTutorContext(userId: string): Promise<{
  learnerCategory: string;
  classLevel: string | null;
  tutorPersonality: string;
  weakTopics: string[];
  strongTopics: string[];
  recentMistakes: string[];
  learningSpeed: string;
  currentStreak: number;
  overallMasteryScore: number;
} | null> {
  try {
    const profile = await StudentProfile.findOne({ userId })
      .select('learnerCategory classLevel tutorPersonality weakTopics strongTopics recentMistakes learningSpeed currentStreak overallMasteryScore')
      .lean();

    if (!profile) return null;
    return profile as any;
  } catch (err: any) {
    logger.error(`[ProfileService] getTutorContext: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 5. UPDATE LEARNER CATEGORY / ONBOARDING
//    Called when user completes onboarding or changes profile.
// ─────────────────────────────────────────────────────────────
export async function updateLearnerCategory(
  userId: string,
  category: LearnerCategory,
  classLevel?: string,
  primarySubjects?: string[],
  preferredLanguage?: 'english' | 'hinglish'
): Promise<void> {
  try {
    await StudentProfile.findOneAndUpdate(
      { userId },
      {
        learnerCategory:   category,
        tutorPersonality:  TUTOR_PERSONALITY[category],
        ...(classLevel        && { classLevel }),
        ...(primarySubjects   && { primarySubjects }),
        ...(preferredLanguage && { preferredLanguage }),
      },
      { upsert: true, new: true }
    );
    logger.info(`[ProfileService] Updated category for ${userId} → ${category}`);
  } catch (err: any) {
    logger.error(`[ProfileService] updateLearnerCategory: ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────
// 6. GET PROFILE SUMMARY (for dashboard)
// ─────────────────────────────────────────────────────────────
export async function getProfileSummary(userId: string) {
  try {
    const profile = await StudentProfile.findOne({ userId })
      .select('-quizHistory -dailyLogs') // exclude heavy arrays
      .lean();
    return profile;
  } catch (err: any) {
    logger.error(`[ProfileService] getProfileSummary: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 7. GET HEATMAP DATA (last 365 days — GitHub-style)
//    Returns array of { date, count } for the frontend heatmap.
// ─────────────────────────────────────────────────────────────
export async function getHeatmapData(userId: string): Promise<{ date: string; count: number }[]> {
  try {
    const profile = await StudentProfile.findOne({ userId })
      .select('dailyLogs')
      .lean();

    if (!profile) return [];

    return profile.dailyLogs.map((log: any) => ({
      date:  log.date,
      count: log.questionsAsked + log.quizzesCompleted + log.codingSectionsCompleted,
    }));
  } catch (err: any) {
    logger.error(`[ProfileService] getHeatmapData: ${err.message}`);
    return [];
  }
}