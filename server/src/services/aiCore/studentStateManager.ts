/**
 * AI Study OS — Student State Manager (Stage 5)
 * ─────────────────────────────────────────────────────────────
 * Detects the current learning state of a student from real DB data.
 *
 * States:
 *   NEW_USER   → account < 3 days old
 *   EXPLORING  → active but low completion / no quizzes
 *   LEARNING   → regular active study
 *   STUCK      → low quiz accuracy or not completing tasks
 *   IMPROVING  → rising scores and consistent sessions
 *   INACTIVE   → no activity for 3+ days
 *   ADVANCED   → long streak + high mastery
 *
 * Data sources used:
 *   StudentProfile.model → currentStreak, overallMasteryScore, weakTopics, createdAt
 *   Activity.model       → action, timestamp (field name in schema)
 */

import { StudentProfile } from '../../models/StudentProfile.model.js';
import { Activity }       from '../../models/Activity.model.js';
import { logger }         from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export type StudentState =
  | 'NEW_USER'
  | 'EXPLORING'
  | 'LEARNING'
  | 'STUCK'
  | 'IMPROVING'
  | 'INACTIVE'
  | 'ADVANCED';

export interface StudentStateData {
  userId:              string;
  currentState:        StudentState;
  confidence:          number;          // 0–1
  daysSinceLastLogin:  number;
  streakDays:          number;
  overallMastery:      number;          // 0–100
  quizAccuracy:        number;          // 0–1
  totalActivities:     number;
  isFirstSession:      boolean;
  weakTopics:          string[];
  strongTopics:        string[];
  recentSubjects:      string[];
  learningVelocity:    'fast' | 'normal' | 'slow';
  alerts:              StateAlert[];
  analyzedAt:          string;
}

export interface StateAlert {
  type:     'missed_days' | 'low_score' | 'weak_topic' | 'streak_broken' | 'milestone';
  message:  string;
  severity: 'low' | 'medium' | 'high';
}

// ── Thresholds ─────────────────────────────────────────────────
const T = {
  NEW_USER_DAYS:    3,
  INACTIVE_DAYS:    3,
  LOW_MASTERY:      40,
  HIGH_MASTERY:     72,
  ADVANCED_MASTERY: 80,
  ADVANCED_STREAK:  14,
  STUCK_AI_ASKS:    5,
} as const;

// ─────────────────────────────────────────────────────────────
// studentStateManager
// ─────────────────────────────────────────────────────────────
export const studentStateManager = {

  async getState(userId: string): Promise<StudentStateData> {
    logger.info({ userId }, '[StateManager] Analyzing student state');

    try {
      const [profile, totalActivities] = await Promise.all([
        StudentProfile.findOne({ userId }).lean(),
        Activity.countDocuments({ userId }),
      ]);

      // Get last activity — Activity uses 'timestamp' field (not createdAt)
      const lastActivity = await Activity.findOne({ userId })
        .sort({ timestamp: -1 })
        .lean();

      const now = new Date();

      const daysSinceLastLogin = lastActivity?.timestamp
        ? Math.floor((now.getTime() - new Date(lastActivity.timestamp).getTime()) / 86400000)
        : 999;

      const accountAgeDays = profile?.createdAt
        ? Math.floor((now.getTime() - new Date(profile.createdAt).getTime()) / 86400000)
        : 0;

      // Get recent activities (last 30) for velocity calculation
      const recentActivities = await Activity.find({ userId })
        .sort({ timestamp: -1 })
        .limit(30)
        .lean();

      // Count AI asks in recent activities
      const recentAIAskCount = recentActivities.filter(
        (a: any) => a.action === 'ask_question'
      ).length;

      const streakDays      = (profile as any)?.currentStreak ?? 0;
      const overallMastery  = (profile as any)?.overallMasteryScore ?? 0;
      const quizAccuracy    = (profile as any)?.quizHistory?.length > 0
        ? calculateQuizAccuracy((profile as any).quizHistory)
        : 0;

      const confidence        = Math.min(1, totalActivities / 20);
      const learningVelocity  = computeVelocity(recentActivities);
      const alerts            = detectAlerts(daysSinceLastLogin, overallMastery, streakDays, accountAgeDays);
      const currentState      = classifyState({
        accountAgeDays, daysSinceLastLogin, streakDays,
        overallMastery, quizAccuracy, recentAIAskCount, totalActivities,
      });

      const stateData: StudentStateData = {
        userId,
        currentState,
        confidence,
        daysSinceLastLogin,
        streakDays,
        overallMastery,
        quizAccuracy,
        totalActivities,
        isFirstSession:  totalActivities === 0,
        weakTopics:      (profile as any)?.weakTopics   ?? [],
        strongTopics:    (profile as any)?.strongTopics ?? [],
        recentSubjects:  extractRecentSubjects(recentActivities),
        learningVelocity,
        alerts,
        analyzedAt:      now.toISOString(),
      };

      logger.info(
        { userId, state: currentState, streak: streakDays, mastery: overallMastery },
        '[StateManager] State analysis complete'
      );

      return stateData;

    } catch (err: any) {
      logger.error({ userId, err: err.message }, '[StateManager] State analysis failed');
      throw err;
    }
  },

  async getQuickState(userId: string): Promise<StudentState> {
    try {
      const profile = await StudentProfile.findOne({ userId })
        .select('currentStreak overallMasteryScore createdAt')
        .lean();

      if (!profile) return 'NEW_USER';

      const lastActivity = await Activity.findOne({ userId })
        .sort({ timestamp: -1 })
        .select('timestamp')
        .lean();

      const daysSince = lastActivity?.timestamp
        ? Math.floor((Date.now() - new Date(lastActivity.timestamp).getTime()) / 86400000)
        : 999;

      if (daysSince >= T.INACTIVE_DAYS) return 'INACTIVE';

      const accountAgeDays = profile.createdAt
        ? Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / 86400000)
        : 0;

      if (accountAgeDays < T.NEW_USER_DAYS) return 'NEW_USER';

      const streak  = (profile as any).currentStreak ?? 0;
      const mastery = (profile as any).overallMasteryScore ?? 0;

      if (streak >= T.ADVANCED_STREAK && mastery >= T.ADVANCED_MASTERY) return 'ADVANCED';
      if (mastery < T.LOW_MASTERY && mastery > 0) return 'STUCK';

      return 'LEARNING';
    } catch (err: any) {
      logger.error({ userId, err: err.message }, '[StateManager] getQuickState failed');
      return 'EXPLORING';
    }
  },

  async isStudentStruggling(userId: string): Promise<boolean> {
    const state = await this.getQuickState(userId);
    return state === 'STUCK';
  },
};

// ── Internal helpers ───────────────────────────────────────────

interface ClassifyInput {
  accountAgeDays:    number;
  daysSinceLastLogin: number;
  streakDays:        number;
  overallMastery:    number;
  quizAccuracy:      number;
  recentAIAskCount:  number;
  totalActivities:   number;
}

function classifyState(m: ClassifyInput): StudentState {
  if (m.accountAgeDays < T.NEW_USER_DAYS)         return 'NEW_USER';
  if (m.daysSinceLastLogin >= T.INACTIVE_DAYS)    return 'INACTIVE';

  if (
    m.streakDays >= T.ADVANCED_STREAK &&
    m.overallMastery >= T.ADVANCED_MASTERY
  ) return 'ADVANCED';

  if (
    (m.overallMastery > 0 && m.overallMastery < T.LOW_MASTERY) ||
    (m.quizAccuracy > 0 && m.quizAccuracy < 0.45) ||
    m.recentAIAskCount >= T.STUCK_AI_ASKS
  ) return 'STUCK';

  if (m.overallMastery >= T.HIGH_MASTERY && m.streakDays >= 3) return 'IMPROVING';

  if (m.totalActivities <= 2) return 'EXPLORING';

  return 'LEARNING';
}

function detectAlerts(
  daysSince:    number,
  mastery:      number,
  streak:       number,
  accountDays:  number
): StateAlert[] {
  const alerts: StateAlert[] = [];

  if (daysSince >= 2 && daysSince < T.INACTIVE_DAYS) {
    alerts.push({ type: 'missed_days', message: `Missed ${daysSince} days`, severity: 'medium' });
  }
  if (mastery > 0 && mastery < T.LOW_MASTERY) {
    alerts.push({ type: 'low_score', message: `Mastery ${mastery}% — needs help`, severity: 'high' });
  }
  if (streak === 0 && accountDays > T.NEW_USER_DAYS) {
    alerts.push({ type: 'streak_broken', message: 'Streak broken', severity: 'medium' });
  }
  if (streak === 7 || streak === 14 || streak === 30) {
    alerts.push({ type: 'milestone', message: `${streak}-day streak!`, severity: 'low' });
  }

  return alerts;
}

function extractRecentSubjects(activities: any[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const act of activities) {
    const sub = act.details?.split(' ')[0];
    if (sub && !seen.has(sub)) {
      seen.add(sub);
      result.push(sub);
      if (result.length >= 5) break;
    }
  }
  return result;
}

function computeVelocity(activities: any[]): 'fast' | 'normal' | 'slow' {
  const now     = Date.now();
  const last7   = activities.filter(
    a => (now - new Date(a.timestamp).getTime()) < 7 * 86400000
  );
  const perDay = last7.length / 7;
  if (perDay >= 3) return 'fast';
  if (perDay >= 1) return 'normal';
  return 'slow';
}

function calculateQuizAccuracy(quizHistory: any[]): number {
  if (!quizHistory?.length) return 0;
  const recent = quizHistory.slice(-20);
  const avg = recent.reduce((sum: number, q: any) => sum + (q.accuracy ?? q.score ?? 0), 0) / recent.length;
  return avg / 100; // normalize to 0–1
}