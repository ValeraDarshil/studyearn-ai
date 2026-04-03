/**
 * AI Study OS — Mentor Trigger Engine (Stage 6)
 * ─────────────────────────────────────────────────────────────
 * Evaluates behavior snapshots and decides which trigger(s)
 * the AI Mentor should fire — and at what priority.
 *
 * Trigger types:
 *   INACTIVE_USER     → no activity for > 24h
 *   STREAK_BREAK      → streak was broken
 *   STREAK_AT_RISK    → hasn't studied today (streak in danger)
 *   LOW_PERFORMANCE   → accuracy dropped > 15%
 *   HIGH_PROGRESS     → accuracy improved > 15%
 *   DAILY_REMINDER    → daily nudge at preferred time
 *   GOAL_PENDING      → AI recommendations not completed
 *   COMEBACK          → inactive 3+ days, needs easy win
 *   WEAK_TOPIC_FOCUS  → persistent weak topic detected
 *   MILESTONE_REACHED → streak / mastery milestones
 *
 * Anti-spam: max 2 triggers/day per user.
 * Priority system: only highest-priority triggers proceed.
 */

import { BehaviorSnapshot } from './behaviorAnalyzer.js';
import { StudentProfile }   from '../../models/StudentProfile.model.js';

// ── Types ──────────────────────────────────────────────────────

export type MentorTriggerType =
  | 'INACTIVE_USER'
  | 'STREAK_BREAK'
  | 'STREAK_AT_RISK'
  | 'LOW_PERFORMANCE'
  | 'HIGH_PROGRESS'
  | 'DAILY_REMINDER'
  | 'GOAL_PENDING'
  | 'COMEBACK'
  | 'WEAK_TOPIC_FOCUS'
  | 'MILESTONE_REACHED';

export interface MentorTrigger {
  type:      MentorTriggerType;
  priority:  1 | 2 | 3;   // 1 = highest (fires first)
  reason:    string;
  context:   Record<string, any>;
}

// Priority map — lower number = higher priority
const PRIORITY_MAP: Record<MentorTriggerType, 1 | 2 | 3> = {
  COMEBACK:          1,
  STREAK_BREAK:      1,
  LOW_PERFORMANCE:   1,
  INACTIVE_USER:     2,
  STREAK_AT_RISK:    2,
  WEAK_TOPIC_FOCUS:  2,
  HIGH_PROGRESS:     2,
  MILESTONE_REACHED: 2,
  GOAL_PENDING:      3,
  DAILY_REMINDER:    3,
};

// ── Trigger Detection ──────────────────────────────────────────

export function detectTriggers(snap: BehaviorSnapshot): MentorTrigger[] {
  const triggers: MentorTrigger[] = [];

  // COMEBACK (highest priority — 3+ days gone)
  if (snap.comebackCandidate) {
    triggers.push({
      type:    'COMEBACK',
      priority: 1,
      reason:  `User inactive for ${Math.floor(snap.daysSinceLastLogin)} days`,
      context: { daysSinceLastLogin: snap.daysSinceLastLogin },
    });
    return pickTopTriggers(triggers); // Only comeback fires — don't overwhelm
  }

  // STREAK_BREAK
  if (snap.streakBroken) {
    triggers.push({
      type:    'STREAK_BREAK',
      priority: 1,
      reason:  `Streak broken after ${snap.currentStreak} days`,
      context: { previousStreak: snap.currentStreak },
    });
  }

  // LOW_PERFORMANCE
  if (snap.performanceDrop) {
    triggers.push({
      type:    'LOW_PERFORMANCE',
      priority: 1,
      reason:  `Accuracy dropped from ${Math.round(snap.previousAccuracy * 100)}% to ${Math.round(snap.recentAccuracy * 100)}%`,
      context: {
        recentAccuracy:   snap.recentAccuracy,
        previousAccuracy: snap.previousAccuracy,
        weakTopics:       snap.weakTopics.slice(0, 3),
      },
    });
  }

  // INACTIVE_USER (24h–72h, not comeback)
  if (snap.isInactive && !snap.comebackCandidate) {
    triggers.push({
      type:    'INACTIVE_USER',
      priority: 2,
      reason:  `No activity for ${Math.round(snap.hoursSinceLastLogin)} hours`,
      context: { hoursSinceLastLogin: snap.hoursSinceLastLogin },
    });
  }

  // STREAK_AT_RISK (active but not studied today)
  if (!snap.streakBroken && snap.streakAtRisk && snap.currentStreak >= 2) {
    triggers.push({
      type:    'STREAK_AT_RISK',
      priority: 2,
      reason:  `${snap.currentStreak}-day streak at risk — not studied today`,
      context: { currentStreak: snap.currentStreak },
    });
  }

  // WEAK_TOPIC_FOCUS
  if (snap.weakTopics.length > 0 && !snap.isInactive) {
    triggers.push({
      type:    'WEAK_TOPIC_FOCUS',
      priority: 2,
      reason:  `Persistent weak topic: ${snap.weakTopics[0]}`,
      context: { weakTopics: snap.weakTopics.slice(0, 3) },
    });
  }

  // HIGH_PROGRESS (celebrate!)
  if (snap.highImprovement) {
    triggers.push({
      type:    'HIGH_PROGRESS',
      priority: 2,
      reason:  `Accuracy improved from ${Math.round(snap.previousAccuracy * 100)}% to ${Math.round(snap.recentAccuracy * 100)}%`,
      context: {
        improvement: Math.round((snap.recentAccuracy - snap.previousAccuracy) * 100),
        strongTopics: snap.strongTopics.slice(0, 3),
      },
    });
  }

  // GOAL_PENDING (soft nudge when nothing else fires)
  if (triggers.length === 0) {
    triggers.push({
      type:    'GOAL_PENDING',
      priority: 3,
      reason:  'Daily check-in — pending learning goals',
      context: {
        mostRecentTopic: snap.mostRecentTopic,
        avgSessionMinutes: snap.avgSessionMinutes,
      },
    });
  }

  return pickTopTriggers(triggers);
}

// Keep only the top 2 triggers by priority (anti-spam)
function pickTopTriggers(triggers: MentorTrigger[]): MentorTrigger[] {
  return triggers
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 2);
}

// ── Should mentor fire right now? (timing check) ────────────────

export function shouldFireNow(
  snap:        BehaviorSnapshot,
  lastFiredAt: Date | null,
): boolean {
  const now = new Date();

  // Never fired before → go ahead
  if (!lastFiredAt) return true;

  const hoursSinceFired = (now.getTime() - lastFiredAt.getTime()) / (1000 * 60 * 60);

  // Anti-spam: max 1 trigger per 8 hours
  if (hoursSinceFired < 8) return false;

  // Prefer sending near the user's preferred active hour
  const { preferredHour, confidence } = snap.activeHours;
  if (confidence > 0.3) {
    const currentHour = now.getHours();
    const diff = Math.abs(currentHour - preferredHour);
    // Fire if within 1 hour of preferred time
    if (diff > 1 && diff < 23) return false;
  }

  return true;
}

export const mentorTriggerEngine = { detectTriggers, shouldFireNow };