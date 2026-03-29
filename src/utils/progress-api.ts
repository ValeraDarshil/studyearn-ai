/**
 * AI Study OS — Progress API Utility (Stage 4)
 * Frontend calls to /api/progress/* go through here.
 * src/utils/progress-api.ts
 */

const API_URL = import.meta.env.VITE_API_URL;

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function progressFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}/api/progress${path}`, {
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

export type ScoreTier = 'elite' | 'advanced' | 'on_track' | 'developing' | 'needs_support';

export interface ProgressScore {
  total:     number;
  tier:      ScoreTier;
  tierLabel: string;
  tierIcon:  string;
  breakdown: {
    consistency:  number;
    performance:  number;
    activity:     number;
    improvement:  number;
    completion:   number;
  };
  trend:         'up' | 'down' | 'stable';
  message:       string;
  nextMilestone: number;
}

export interface InsightCard {
  id:       string;
  type:     string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  icon:     string;
  title:    string;
  message:  string;
  action:   string | null;
  topic:    string | null;
  subject:  string | null;
  metric:   string | null;
  isRead:   boolean;
}

export interface SubjectTrend {
  subject:    string;
  direction:  string;
  statement:  string;
  isAlert:    boolean;
}

export interface TrendReport {
  subjectTrends:        SubjectTrend[];
  topImprovement:       SubjectTrend | null;
  topDecline:           SubjectTrend | null;
  focusTrend:           string;
  consistencyTrend:     string;
  codingTrend:          string | null;
  quizTrend:            string;
  isReturningAfterBreak:boolean;
  isOnMomentum:         boolean;
  isStrugglingFocus:    boolean;
  allStatements:        string[];
}

export interface WeeklyProgressReport {
  weekKey:          string;
  period:           string;
  progressScore:    number;
  scoreTier:        string;
  scoreIcon:        string;
  totalStudyHours:  number;
  avgDailyMins:     number;
  activeDays:       number;
  totalQuizzes:     number;
  quizAccuracy:     number;
  totalXP:          number;
  bestSubject:      string | null;
  worstSubject:     string | null;
  subjectSummary:   { subject: string; change: string; status: string }[];
  codingSessions:   number;
  headline:         string;
  summaryText:      string;
  suggestions:      string[];
  topInsights:      { icon: string; message: string }[];
  nextWeekFocus:    { topic: string; subject: string; action: string }[];
  focusLevel:       string;
  streak:           number;
}

// ── API Functions ──────────────────────────────────────────────

/** Full progress analysis (heavy — dashboard load) */
export async function getFullProgressAnalysis(): Promise<{
  success: boolean;
  analysis: {
    snapshot:     any;
    score:        ProgressScore;
    scoreTip:     string;
    trends:       TrendReport;
    insights:     { cards: InsightCard[]; primaryInsight: InsightCard; focusAlert: boolean };
    weeklyReport: WeeklyProgressReport | null;
    brainSummary: string | null;
  } | null;
}> {
  return progressFetch('/analysis');
}

/** Quick snapshot — score + insights (fast widget) */
export async function getProgressSnapshot(): Promise<{
  success:  boolean;
  score:    ProgressScore;
  insights: { cards: InsightCard[]; primaryInsight: InsightCard; focusAlert: boolean };
}> {
  return progressFetch('/snapshot');
}

/** Insight cards only (notification bell) */
export async function getInsightCards(): Promise<{
  success:     boolean;
  cards:       InsightCard[];
  primary:     InsightCard;
  unreadCount: number;
  focusAlert:  boolean;
}> {
  return progressFetch('/insights');
}

/** Progress score widget */
export async function getProgressScore(): Promise<{
  success:       boolean;
  score:         number;
  tier:          string;
  icon:          string;
  trend:         string;
  breakdown:     ProgressScore['breakdown'];
  message:       string;
  nextMilestone: number;
}> {
  return progressFetch('/score');
}

/** Weekly AI report */
export async function getWeeklyProgressReport(): Promise<{
  success: boolean;
  report:  WeeklyProgressReport | null;
}> {
  return progressFetch('/weekly');
}

/** Trend analysis */
export async function getTrendReport(): Promise<{
  success: boolean;
  trends:  TrendReport | null;
}> {
  return progressFetch('/trends');
}

/** Fire activity event — triggers Stage 4 adaptive update */
export async function trackProgressEvent(
  eventType: 'quiz_done' | 'ai_tutor_used' | 'coding_done' | 'login' | 'step_completed',
  meta?: { topic?: string; subject?: string; score?: number; mode?: string },
): Promise<{
  success:     boolean;
  insight:     InsightCard | null;
  scoreUpdate: number | null;
}> {
  return progressFetch('/event', {
    method: 'POST',
    body: JSON.stringify({ eventType, ...meta }),
  });
}