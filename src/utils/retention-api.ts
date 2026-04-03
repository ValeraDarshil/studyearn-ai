/**
 * AI Study OS — Retention API (Stage 7 Frontend)
 * ─────────────────────────────────────────────────────────────
 * Frontend utility to communicate with the Retention Engine backend.
 */

const API_URL = import.meta.env.VITE_API_URL as string;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function req<T>(
  path:    string,
  method = 'GET',
  body?:   object,
): Promise<T> {
  const res = await fetch(`${API_URL}/api/retention${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) throw new Error(`Retention API ${method} ${path} → ${res.status}`);
  return res.json();
}

// ── Types ──────────────────────────────────────────────────────

export type UrgencyLevel       = 'none' | 'low' | 'medium' | 'high' | 'critical';
export type RecoveryState      = 'not_needed' | 'available' | 'pending' | 'completed' | 'expired' | 'already_used';
export type RecoveryMethod     = 'task' | 'quiz' | 'lesson';
export type ComebackIntensity  = 'none' | 'soft' | 'strong' | 'deep';
export type NotificationType   =
  | 'STREAK_ALERT' | 'COMEBACK' | 'ACHIEVEMENT' | 'REMINDER' | 'AI_MENTOR_MESSAGE';

export interface StreakStatus {
  userId:          string;
  currentStreak:   number;
  lastActive:      string | null;
  hoursSinceLast:  number;
  isActive:        boolean;
  isBroken:        boolean;
  isAtRisk:        boolean;
  hoursRemaining:  number;
  streakSavedToday: boolean;
}

export interface UrgencyReport {
  userId:       string;
  level:        UrgencyLevel;
  streakStatus: StreakStatus;
  message:      string;
  subMessage:   string;
  ctaText:      string;
  ctaAction:    string;
  hoursLeft:    number;
  shouldNotify: boolean;
  generatedAt:  string;
}

export interface RecoveryTask {
  method:       RecoveryMethod;
  title:        string;
  description:  string;
  xpReward:     number;
  icon:         string;
}

export interface RecoveryStatus {
  userId:         string;
  state:          RecoveryState;
  previousStreak: number;
  recoveryTask?:  RecoveryTask;
  expiresAt?:     string;
  completedAt?:   string;
  message:        string;
}

export interface ComebackTask {
  id:          string;
  title:       string;
  description: string;
  durationMin: number;
  type:        string;
  xpReward:    number;
}

export interface ComebackPlan {
  userId:       string;
  intensity:    ComebackIntensity;
  headline:     string;
  message:      string;
  subMessage:   string;
  tasks:        ComebackTask[];
  totalMinutes: number;
  totalXP:      number;
  ctaText:      string;
  isNewPlan:    boolean;
  generatedAt:  string;
}

export interface AppNotification {
  id:         string;
  userId:     string;
  type:       NotificationType;
  title:      string;
  message:    string;
  icon:       string;
  ctaText?:   string;
  ctaAction?: string;
  isRead:     boolean;
  createdAt:  string;
  expiresAt:  string;
}

export interface RetentionDashboard {
  streakStatus:    StreakStatus;
  urgency:         UrgencyReport;
  recovery:        RecoveryStatus;
  comeback:        ComebackPlan | null;
  notifications:   AppNotification[];
}

// ── API Functions ──────────────────────────────────────────────

/** Full retention dashboard — call once on login / app load */
export async function getRetentionStatus(): Promise<RetentionDashboard & { success: boolean }> {
  return req('/status');
}

/** Lightweight streak check — for navbar/header display */
export async function getStreakStatus(): Promise<{ success: boolean; streak: StreakStatus }> {
  return req('/streak');
}

/** Get urgency report with countdown */
export async function getUrgencyReport(): Promise<{ success: boolean; urgency: UrgencyReport }> {
  return req('/urgency');
}

/** Get recovery status */
export async function getRecoveryStatus(): Promise<{ success: boolean; recovery: RecoveryStatus }> {
  return req('/recovery');
}

/** Start recovery window (call when user sees broken streak) */
export async function startRecovery(): Promise<{ success: boolean; recovery: RecoveryStatus }> {
  return req('/recovery/start', 'POST');
}

/** Complete recovery task — method: 'task' | 'quiz' | 'lesson' */
export async function completeRecovery(method: RecoveryMethod): Promise<{
  success:   boolean;
  message:   string;
  xpAwarded: number;
  newStreak: number;
}> {
  return req('/recovery/complete', 'POST', { method });
}

/** Get comeback plan for inactive user */
export async function getComebackPlan(): Promise<{ success: boolean; comeback: ComebackPlan }> {
  return req('/comeback');
}

/** Get unread in-app notifications */
export async function getNotifications(): Promise<{
  success:       boolean;
  notifications: AppNotification[];
  count:         number;
}> {
  return req('/notifications');
}

/** Mark notifications as read. Pass ids[] to mark specific ones, or omit to mark all. */
export async function markNotificationsRead(ids?: string[]): Promise<{ success: boolean }> {
  return req('/notifications/read', 'POST', { ids });
}

/** Tell the backend user completed an activity (updates streak + checks recovery) */
export async function recordActivity(
  type: 'lesson' | 'quiz' | 'task' | 'ask_ai' | 'challenge',
): Promise<{
  success:         boolean;
  streakUpdated:   boolean;
  recoveryChecked: boolean;
  rewardResult:    { xpAwarded: number; celebrationMsg: string } | null;
}> {
  return req('/activity', 'POST', { type });
}

/** Manually run retention engine (called on login) */
export async function runRetentionEngine(trigger = 'login'): Promise<{
  success:           boolean;
  urgency:           UrgencyReport;
  recovery:          RecoveryStatus;
  comeback:          ComebackPlan | null;
  actionsTriggered:  string[];
  notificationSent:  boolean;
}> {
  return req('/run', 'POST', { trigger });
}