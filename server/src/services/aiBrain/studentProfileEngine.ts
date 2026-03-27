/**
 * AI Study OS — Student Profile Engine
 * ─────────────────────────────────────────────────────────────
 * The "Student Intelligence Profile" builder.
 *
 * What it does:
 *   1. Builds a rich, real-time snapshot of any student
 *   2. Computes activityScore, codingLevel, studyTime
 *   3. Auto-detects learningType from behavior data
 *   4. Exposes a normalized profile for the rest of AI Brain
 *
 * Used by: aiBrain.service.ts → context builder, learning engine
 *
 * NOTE: This engine READS from existing StudentProfile model
 * and ENRICHES it with derived intelligence — it does NOT
 * duplicate the storage layer. Single source of truth stays
 * in StudentProfile.model.ts.
 */

import { StudentProfile } from '../../models/StudentProfile.model.js';
import { logger } from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export type LearningType = 'school' | 'coding' | 'college' | 'self';
export type CodingLevel  = 'none' | 'beginner' | 'intermediate' | 'advanced';
export type ActivityTier = 'inactive' | 'low' | 'moderate' | 'active' | 'power';

export interface StudentIntelligenceProfile {
  userId:           string;
  learningType:     LearningType;       // school / coding / college / self
  codingLevel:      CodingLevel;        // none → advanced
  weakTopics:       string[];           // topics with mastery < 40%
  strongTopics:     string[];           // topics with mastery >= 80%
  recentMistakes:   string[];           // last 10 failed topics
  studyTimeMinutes: number;             // total minutes studied (all time)
  avgDailyMinutes:  number;             // 7-day rolling average
  activityScore:    number;             // 0–100 overall engagement score
  activityTier:     ActivityTier;       // label for activityScore range
  learningSpeed:    'slow' | 'medium' | 'fast';
  currentStreak:    number;             // consecutive study days
  overallMastery:   number;             // 0–100 overall mastery score
  quizAccuracy:     number;             // % correct across all quizzes
  totalQuizzes:     number;
  topSubject:       string | null;      // best-performing subject
  weakestSubject:   string | null;      // lowest-performing subject
  preferredLanguage:'english' | 'hinglish';
  tutorPersonality: 'simple' | 'normal' | 'advanced';
  classLevel:       string | null;
  lastActiveDate:   string | null;
  profileAge:       number;             // days since profile created
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — buildStudentProfile
// ─────────────────────────────────────────────────────────────
export async function buildStudentProfile(userId: string): Promise<StudentIntelligenceProfile | null> {
  try {
    const raw = await StudentProfile.findOne({ userId }).lean() as any;
    if (!raw) return null;

    // ── Derive activity score (0–100) ─────────────────────
    const last7Days = getLastNDates(7);
    const recentLogs = (raw.dailyLogs || []).filter((d: any) => last7Days.includes(d.date));
    const avgDailyMinutes = recentLogs.length > 0
      ? Math.round(recentLogs.reduce((s: number, d: any) => s + (d.minutesStudied || 0), 0) / 7)
      : 0;

    const totalStudyMinutes = (raw.dailyLogs || [])
      .reduce((s: number, d: any) => s + (d.minutesStudied || 0), 0);

    // Activity score formula:
    //   streak (max 30pts) + avg daily mins (max 30pts) + mastery (max 20pts) + quizzes (max 20pts)
    const streakScore   = Math.min(30, raw.currentStreak * 3);
    const minuteScore   = Math.min(30, avgDailyMinutes * 1.5);
    const masteryScore  = Math.min(20, (raw.overallMasteryScore || 0) * 0.2);
    const quizScore     = Math.min(20, (raw.quizHistory?.length || 0) * 2);
    const activityScore = Math.round(streakScore + minuteScore + masteryScore + quizScore);

    const activityTier = computeActivityTier(activityScore);

    // ── Coding level from topic mastery ──────────────────
    const codingTopics = (raw.topicMastery || []).filter((t: any) =>
      ['Programming', 'Python', 'JavaScript', 'Data Structures', 'Algorithms'].includes(t.subject)
    );
    const codingLevel = deriveCodingLevel(raw.learnerCategory, codingTopics);

    // ── Best / worst subjects ─────────────────────────────
    const subjectMap: Record<string, { total: number; count: number }> = {};
    for (const t of (raw.topicMastery || [])) {
      if (!subjectMap[t.subject]) subjectMap[t.subject] = { total: 0, count: 0 };
      subjectMap[t.subject].total += t.masteryLevel;
      subjectMap[t.subject].count += 1;
    }
    const subjectAvgs = Object.entries(subjectMap).map(([sub, v]) => ({
      subject: sub,
      avg:     Math.round(v.total / v.count),
    }));
    subjectAvgs.sort((a, b) => b.avg - a.avg);
    const topSubject     = subjectAvgs[0]?.subject || null;
    const weakestSubject = subjectAvgs[subjectAvgs.length - 1]?.subject || null;

    // ── Quiz accuracy ────────────────────────────────────
    const quizHistory: any[] = raw.quizHistory || [];
    const quizAccuracy = quizHistory.length > 0
      ? Math.round(quizHistory.reduce((s: number, q: any) => s + (q.score || 0), 0) / quizHistory.length)
      : 0;

    // ── Profile age (days since creation) ────────────────
    const profileAge = raw.createdAt
      ? Math.floor((Date.now() - new Date(raw.createdAt).getTime()) / 86400000)
      : 0;

    return {
      userId,
      learningType:     raw.learnerCategory as LearningType,
      codingLevel,
      weakTopics:       raw.weakTopics   || [],
      strongTopics:     raw.strongTopics || [],
      recentMistakes:   raw.recentMistakes || [],
      studyTimeMinutes: totalStudyMinutes,
      avgDailyMinutes,
      activityScore,
      activityTier,
      learningSpeed:    raw.learningSpeed || 'medium',
      currentStreak:    raw.currentStreak || 0,
      overallMastery:   raw.overallMasteryScore || 0,
      quizAccuracy,
      totalQuizzes:     quizHistory.length,
      topSubject,
      weakestSubject,
      preferredLanguage: raw.preferredLanguage || 'english',
      tutorPersonality:  raw.tutorPersonality || 'normal',
      classLevel:        raw.classLevel || null,
      lastActiveDate:    raw.lastStudyDate || null,
      profileAge,
    };
  } catch (err: any) {
    logger.error(`[ProfileEngine] buildStudentProfile: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// getCompactProfile — lightweight version for AI context injection
// Returns only fields needed for system prompt building.
// ─────────────────────────────────────────────────────────────
export async function getCompactProfile(userId: string): Promise<{
  learningType: LearningType;
  weakTopics:   string[];
  recentMistakes: string[];
  learningSpeed: string;
  tutorPersonality: string;
  classLevel: string | null;
  currentStreak: number;
  overallMastery: number;
  activityScore: number;
} | null> {
  const p = await buildStudentProfile(userId);
  if (!p) return null;
  return {
    learningType:     p.learningType,
    weakTopics:       p.weakTopics,
    recentMistakes:   p.recentMistakes,
    learningSpeed:    p.learningSpeed,
    tutorPersonality: p.tutorPersonality,
    classLevel:       p.classLevel,
    currentStreak:    p.currentStreak,
    overallMastery:   p.overallMastery,
    activityScore:    p.activityScore,
  };
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function getLastNDates(n: number): string[] {
  const dates: string[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(Date.now() + 5.5 * 60 * 60 * 1000 - i * 86400000);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function computeActivityTier(score: number): ActivityTier {
  if (score >= 80) return 'power';
  if (score >= 60) return 'active';
  if (score >= 35) return 'moderate';
  if (score >= 10) return 'low';
  return 'inactive';
}

function deriveCodingLevel(
  category: string,
  codingTopics: any[]
): CodingLevel {
  if (!['coding', 'college', 'self'].includes(category) && codingTopics.length === 0) {
    return 'none';
  }
  if (codingTopics.length === 0) return 'beginner';
  const avgMastery = codingTopics.reduce((s, t) => s + t.masteryLevel, 0) / codingTopics.length;
  if (avgMastery >= 75) return 'advanced';
  if (avgMastery >= 45) return 'intermediate';
  return 'beginner';
}