/**
 * AI Study OS — Brain API Utility
 * ─────────────────────────────────────────────────────────────
 * All frontend calls to /api/brain/* go through here.
 * Drop this in: src/utils/brain-api.ts
 */

const API_URL = import.meta.env.VITE_API_URL;

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function brainFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}/api/brain${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...(options.headers ?? {}),
    },
  });
  return res.json();
}

// ── Types ──────────────────────────────────────────────────────
export type LearnerCategory = 'school' | 'coding' | 'college' | 'self';

export interface TopicMastery {
  topic: string;
  subject: string;
  masteryLevel: number;
  isWeak: boolean;
  isStrong: boolean;
  trend: 'improving' | 'declining' | 'stable';
  totalAttempts: number;
  lastAttemptedAt: string | null;
}

export interface StudentProfile {
  learnerCategory: LearnerCategory;
  classLevel: string | null;
  primarySubjects: string[];
  preferredLanguage: 'english' | 'hinglish';
  topicMastery: TopicMastery[];
  weakTopics: string[];
  strongTopics: string[];
  learningSpeed: 'slow' | 'medium' | 'fast';
  currentStreak: number;
  longestStreak: number;
  totalStudyDays: number;
  overallMasteryScore: number;
  recentMistakes: string[];
  tutorPersonality: 'simple' | 'normal' | 'advanced';
}

export interface TodayFocus {
  title: string;
  description: string;
  focusTopic: string;
  subject: string;
  estimatedMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LearningStep {
  stepId: string;
  type: string;
  title: string;
  subject: string;
  topic: string;
  description: string;
  estimatedMinutes: number;
  difficulty: string;
  isCompleted: boolean;
  completedAt: string | null;
  xpReward: number;
}

export interface LearningPath {
  _id: string;
  title: string;
  description: string;
  learnerCategory: string;
  subject: string;
  steps: LearningStep[];
  totalSteps: number;
  completedSteps: number;
  progressPercent: number;
  status: string;
  startDate: string;
  endDate: string;
}

export interface PerformanceAlert {
  type: 'improvement' | 'decline' | 'streak' | 'milestone' | 'warning';
  title: string;
  description: string;
  subject?: string;
  topic?: string;
  changePercent?: number;
  generatedAt: string;
  isRead: boolean;
}

export interface WeeklyReport {
  headline: string;
  summaryText: string;
  totalStudyMinutes: number;
  totalQuestionsAsked: number;
  totalQuizzesTaken: number;
  totalXPEarned: number;
  avgDailyMinutes: number;
  consistencyScore: number;
  streakAtEnd: number;
  overallScoreEnd: number;
  overallChange: number;
  alerts: PerformanceAlert[];
  suggestions: string[];
  subjectBreakdowns: {
    subject: string;
    masteryEnd: number;
    change: number;
    quizzesTaken: number;
  }[];
  generatedAt: string;
}

export interface HeatmapDay {
  date: string;
  count: number;
}

// ── API functions ──────────────────────────────────────────────

export async function setupLearnerProfile(data: {
  learnerCategory: LearnerCategory;
  classLevel?: string;
  primarySubjects?: string[];
  preferredLanguage?: 'english' | 'hinglish';
}) {
  return brainFetch('/setup', { method: 'POST', body: JSON.stringify(data) });
}

export async function getStudentProfile(): Promise<{ success: boolean; profile: StudentProfile }> {
  return brainFetch('/profile');
}

export async function getHeatmapData(): Promise<{ success: boolean; heatmap: HeatmapDay[] }> {
  return brainFetch('/heatmap');
}

export async function getTodayFocus(): Promise<{ success: boolean; focus: TodayFocus }> {
  return brainFetch('/today-focus');
}

export async function getLearningPath(subject?: string, forceRegenerate?: boolean): Promise<{ success: boolean; path: LearningPath; isNew: boolean }> {
  return brainFetch('/learning-path', {
    method: 'POST',
    body: JSON.stringify({ subject, forceRegenerate }),
  });
}

export async function completeLearningStep(pathId: string, stepId: string) {
  return brainFetch('/complete-step', {
    method: 'POST',
    body: JSON.stringify({ pathId, stepId }),
  });
}

export async function getWeeklyReport(): Promise<{ success: boolean; report: WeeklyReport }> {
  return brainFetch('/weekly-report');
}

export async function getAlerts(): Promise<{ success: boolean; alerts: PerformanceAlert[]; count: number }> {
  return brainFetch('/alerts');
}

export async function submitQuizResult(data: {
  subject: string;
  topic: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpentSecs?: number;
}) {
  return brainFetch('/quiz-result', { method: 'POST', body: JSON.stringify(data) });
}