/**
 * AI Study OS — Mentor API (Stage 6 Frontend)
 * ─────────────────────────────────────────────────────────────
 * Frontend utility to communicate with AI Mentor backend.
 */

const BASE = '/api/mentor';

async function req<T>(
  path:    string,
  method = 'GET',
  body?:   object,
): Promise<T> {
  const token = localStorage.getItem('token');
  const res   = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) throw new Error(`Mentor API error: ${res.status}`);
  return res.json();
}

// ── Types ──────────────────────────────────────────────────────

export type MentorPersonality = 'friendly' | 'strict' | 'motivational';
export type TriggerType =
  | 'INACTIVE_USER' | 'STREAK_BREAK' | 'STREAK_AT_RISK'
  | 'LOW_PERFORMANCE' | 'HIGH_PROGRESS' | 'DAILY_REMINDER'
  | 'GOAL_PENDING' | 'COMEBACK' | 'WEAK_TOPIC_FOCUS' | 'MILESTONE_REACHED';

export interface MicroTask {
  id:              string;
  title:           string;
  description:     string;
  durationMinutes: number;
  type:            string;
  topic:           string | null;
  difficulty:      'easy' | 'medium' | 'hard';
  xpReward:        number;
  expiresAt:       string;
}

export interface MentorMessageData {
  _id:          string;
  triggerType:  TriggerType;
  title:        string;
  body:         string;
  cta:          string;
  emoji:        string;
  taskHint:     string;
  microTask:    MicroTask | null;
  quizAssigned: boolean;
  xpAwarded:    number;
  isRead:       boolean;
  isDismissed:  boolean;
  createdAt:    string;
}

export interface MentorState {
  hasActiveMessage:  boolean;
  latestMessage:     MentorMessageData | null;
  activeMicroTask:   MicroTask | null;
  mentorLevel:       number;
  mentorPersonality: MentorPersonality;
  unreadCount:       number;
  lastFiredAt:       string | null;
  totalTriggersEver: number;
  totalTasksCompleted: number;
}

// ── API Methods ────────────────────────────────────────────────

export const mentorApi = {
  getState:         ()                               => req<MentorState & { success: boolean }>('/state'),
  check:            (opts?: { forceRun?: boolean; personality?: string }) =>
                                                        req('/check', 'POST', opts ?? {}),
  markRead:         (id: string)                     => req(`/message/${id}/read`, 'POST'),
  dismiss:          (id: string)                     => req(`/message/${id}/dismiss`, 'POST'),
  completeTask:     ()                               => req('/task/complete', 'POST'),
  setPersonality:   (personality: MentorPersonality) => req('/personality', 'PUT', { personality }),
  getMessages:      (limit = 20, unreadOnly = false) =>
    req<{ success: boolean; messages: MentorMessageData[] }>(`/messages?limit=${limit}&unreadOnly=${unreadOnly}`),
};