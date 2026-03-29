/**
 * AI Study OS — Learn API Utility (Stage 3)
 * Frontend calls to /api/learn/* go through here.
 * src/utils/learn-api.ts
 */

const API_URL = import.meta.env.VITE_API_URL;

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function learnFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}/api/learn${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader() as Record<string, string>),
      ...((options.headers ?? {}) as Record<string, string>),
    },
  });
  return res.json();
}

// ── Types ──────────────────────────────────────────────────────

export interface DailyTask {
  id:           string;
  taskType:     'study' | 'practice' | 'quiz' | 'coding' | 'revision' | 'rest';
  title:        string;
  topic:        string;
  subject:      string;
  durationMins: number;
  priority:     'high' | 'medium' | 'low';
  xpReward:     number;
  description:  string;
  isCompleted:  boolean;
  icon:         string;
}

export interface DailyPlan {
  date:          string;
  greeting:      string;
  headline:      string;
  totalMins:     number;
  tasks:         DailyTask[];
  motivationMsg: string;
  streakStatus:  string;
  studyTip:      string;
  isRestDay:     boolean;
  categoryBadge: string;
}

export interface PriorityTopic {
  rank:          number;
  topic:         string;
  subject:       string;
  mastery:       number;
  urgencyScore:  number;
  urgency:       'critical' | 'high' | 'medium' | 'low';
  trend:         string;
  actionPlan:    string;
  estimatedMins: number;
  reason:        string;
}

export interface GeneratedPathStep {
  stepId:        string;
  dayNumber:     number;
  type:          string;
  title:         string;
  topic:         string;
  subject:       string;
  description:   string;
  estimatedMins: number;
  difficulty:    string;
  xpReward:      number;
  tipForStudent: string;
}

export interface GeneratedPath {
  title:           string;
  description:     string;
  learnerCategory: string;
  subject:         string;
  focusTopics:     string[];
  totalDays:       number;
  steps:           GeneratedPathStep[];
  adaptiveDiff:    string;
  weeklyGoalMins:  number;
}

export interface Recommendation {
  id:             string;
  type:           string;
  title:          string;
  message:        string;
  action:         string;
  topic:          string | null;
  subject:        string | null;
  urgency:        'high' | 'medium' | 'low';
  xpOpportunity:  number;
  icon:           string;
}

export interface RecommendationBundle {
  primary:   Recommendation;
  secondary: Recommendation[];
  context:   string;
}

export interface DifficultyItem {
  topic:   string;
  subject: string;
  decision: {
    level:       string;
    xpMultiplier:number;
    reason:      string;
    suggestion:  string;
  };
}

// ── API Functions ──────────────────────────────────────────────

/** Full learning plan (heavy — use on page load) */
export async function getFullLearningPlan(subject?: string): Promise<{
  success: boolean;
  plan: {
    dailyPlan: DailyPlan | null;
    learningPath: GeneratedPath | null;
    recommendations: RecommendationBundle | null;
  } | null;
}> {
  const q = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return learnFetch(`/plan${q}`);
}

/** Today's daily schedule (fast — home widget) */
export async function getDailyPlan(): Promise<{ success: boolean; plan: DailyPlan }> {
  return learnFetch('/daily');
}

/** 7-day adaptive learning path */
export async function getAdaptivePath(subject?: string): Promise<{ success: boolean; path: GeneratedPath }> {
  const q = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return learnFetch(`/path${q}`);
}

/** Top priority topics */
export async function getPriorityTopics(limit = 5): Promise<{
  success: boolean;
  topics: PriorityTopic[];
  count: number;
}> {
  return learnFetch(`/priorities?limit=${limit}`);
}

/** Difficulty settings per topic */
export async function getDifficultySettings(): Promise<{
  success: boolean;
  settings: DifficultyItem[];
  count: number;
}> {
  return learnFetch('/difficulty');
}

/** Contextual recommendation */
export async function getRecommendation(
  trigger: 'login' | 'after_quiz' | 'after_coding' | 'after_ai_tutor' | 'long_absence' | 'streak_milestone' | 'general' = 'login',
  topic?: string,
  subject?: string,
): Promise<{ success: boolean; bundle: RecommendationBundle | null }> {
  const params = new URLSearchParams({ trigger });
  if (topic)   params.set('topic', topic);
  if (subject) params.set('subject', subject);
  return learnFetch(`/recommend?${params.toString()}`);
}

/** Fire quiz-done event — triggers Stage 3 adaptive cycle */
export async function notifyQuizDone(data: {
  topic:   string;
  subject: string;
  score:   number;
}): Promise<{
  success:           boolean;
  recommendation:    Recommendation;
  updatedDifficulty: { level: string; reason: string } | null;
}> {
  return learnFetch('/quiz-done', { method: 'POST', body: JSON.stringify(data) });
}