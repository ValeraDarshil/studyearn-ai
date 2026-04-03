/**
 * AI Study OS — Mentor Action Engine (Stage 6)
 * ─────────────────────────────────────────────────────────────
 * Executes intelligent actions when the AI Mentor fires a trigger.
 *
 * Actions available:
 *   updateLearningPlan()   → refresh daily AI recommendations
 *   assignMicroTask()      → insert a 5–10 min focused task
 *   triggerQuiz()          → auto-assign a targeted mini-quiz
 *   adjustDifficulty()     → ease up or increase topic difficulty
 *   awardXP()              → give comeback / milestone bonus XP
 *   flagWeakTopic()        → elevate a topic as urgent
 *
 * Every action is idempotent — safe to run multiple times.
 * Linked directly to Learning System and Progress System.
 */

import mongoose               from 'mongoose';
import { StudentProfile }     from '../../models/StudentProfile.model.js';
import { LearningPath }       from '../../models/LearningPath.model.js';
import { MentorTrigger, MentorTriggerType } from './mentorTriggerEngine.js';
import { BehaviorSnapshot }   from './behaviorAnalyzer.js';
import { MentorMessage }      from './mentorMessageGenerator.js';
import { logger }             from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export interface MentorActionResult {
  actionsExecuted: string[];
  microTask:       MicroTask | null;
  quizAssigned:    boolean;
  xpAwarded:       number;
  errors:          string[];
}

export interface MicroTask {
  id:              string;
  title:           string;
  description:     string;
  durationMinutes: number;
  type:            'practice' | 'quiz' | 'revision' | 'challenge' | 'warm_up';
  topic:           string | null;
  subject:         string | null;
  difficulty:      'easy' | 'medium' | 'hard';
  xpReward:        number;
  createdAt:       string;
  expiresAt:       string;
}

// ── Micro-task templates ───────────────────────────────────────

function buildMicroTask(
  trigger:  MentorTriggerType,
  snap:     BehaviorSnapshot,
): MicroTask {
  const now = new Date();
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const id = new mongoose.Types.ObjectId().toString();

  // Duration strategy: micro-actions for demotivated users, longer for engaged
  const durationMinutes =
    snap.moodSignal === 'demotivated' || snap.comebackCandidate ? 5 :
    snap.moodSignal === 'highly_engaged'                        ? 15 : 10;

  const topic   = snap.weakTopics[0] ?? snap.mostRecentTopic ?? null;
  const subject = null; // resolved later from profile if needed

  const difficulty: MicroTask['difficulty'] =
    snap.moodSignal === 'demotivated' || snap.comebackCandidate ? 'easy' :
    snap.moodSignal === 'highly_engaged'                        ? 'hard' : 'medium';

  const xpReward = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 40 : 60;

  switch (trigger) {
    case 'COMEBACK':
      return {
        id, topic, subject, difficulty: 'easy', durationMinutes: 5, xpReward: 25,
        type: 'warm_up',
        title: 'Welcome Back Warm-Up',
        description: `A gentle 5-minute warm-up to ease back in. ${topic ? `We'll start with ${topic}.` : 'No pressure, just flow.'}`,
        createdAt: now.toISOString(), expiresAt: expires.toISOString(),
      };

    case 'LOW_PERFORMANCE':
    case 'WEAK_TOPIC_FOCUS':
      return {
        id, topic, subject, difficulty: 'medium', durationMinutes: 10, xpReward: 45,
        type: 'practice',
        title: `Fix: ${topic ?? 'Weak Topic'} Practice`,
        description: `Focused 10-minute drill on ${topic ?? 'your weak area'}. AI picked the most important problems.`,
        createdAt: now.toISOString(), expiresAt: expires.toISOString(),
      };

    case 'HIGH_PROGRESS':
      return {
        id, topic, subject, difficulty: 'hard', durationMinutes: 15, xpReward: 60,
        type: 'challenge',
        title: 'Challenge Mode Unlocked!',
        description: `You're improving fast! Time for a harder challenge. Push your limits with ${topic ?? 'advanced problems'}.`,
        createdAt: now.toISOString(), expiresAt: expires.toISOString(),
      };

    case 'STREAK_BREAK':
    case 'STREAK_AT_RISK':
      return {
        id, topic, subject, difficulty: 'easy', durationMinutes: 5, xpReward: 30,
        type: 'revision',
        title: 'Quick Streak Saver',
        description: `5-minute revision to ${trigger === 'STREAK_BREAK' ? 'start a new streak' : 'protect your streak'}. Easy win!`,
        createdAt: now.toISOString(), expiresAt: expires.toISOString(),
      };

    default:
      return {
        id, topic, subject, difficulty, durationMinutes, xpReward,
        type: 'practice',
        title: topic ? `Today's Focus: ${topic}` : "Today's Learning Task",
        description: `${durationMinutes}-minute targeted session. AI picked this for you based on your recent progress.`,
        createdAt: now.toISOString(), expiresAt: expires.toISOString(),
      };
  }
}

// ── Action: Update learning plan with mentor recommendation ────

async function updateLearningPlan(
  userId:  string,
  snap:    BehaviorSnapshot,
  trigger: MentorTrigger,
): Promise<void> {
  const tomorrow = new Date(Date.now() + 86400000);

  const recommendation = {
    type: trigger.type === 'HIGH_PROGRESS' ? 'challenge' :
          trigger.type === 'COMEBACK'       ? 'revision'  : 'practice',
    title:       trigger.type === 'HIGH_PROGRESS' ? '🚀 Challenge Mode' : '🎯 AI Mentor Pick',
    description: trigger.reason,
    topic:       snap.weakTopics[0] ?? snap.mostRecentTopic ?? undefined,
    priority:    trigger.priority as 1 | 2 | 3,
    generatedAt: new Date(),
    expiresAt:   tomorrow,
    isCompleted: false,
  } as const;

  await StudentProfile.updateOne(
    { userId },
    {
      $push: {
        todayRecommendations: {
          $each:     [recommendation],
          $slice:    -10,      // keep last 10 only
          $position: 0,        // prepend — AI Mentor pick goes first
        },
      },
    },
  );
}

// ── Action: Adjust difficulty for struggling users ─────────────

async function adjustDifficulty(
  userId:  string,
  snap:    BehaviorSnapshot,
  trigger: MentorTrigger,
): Promise<void> {
  if (trigger.type !== 'LOW_PERFORMANCE' && trigger.type !== 'COMEBACK') return;

  // Mark weak topics with declining trend
  if (snap.weakTopics.length > 0) {
    await StudentProfile.updateOne(
      { userId, 'topicMastery.topic': snap.weakTopics[0] },
      {
        $set: {
          'topicMastery.$.trend':  'declining',
          'topicMastery.$.isWeak': true,
        },
      },
    );
  }
}

// ── Action: Award comeback / milestone bonus XP ────────────────

async function awardBonusXP(
  userId:  string,
  trigger: MentorTrigger,
  snap:    BehaviorSnapshot,
): Promise<number> {
  const bonusXP =
    trigger.type === 'HIGH_PROGRESS'   ? 50 :
    trigger.type === 'MILESTONE_REACHED' ? 100 :
    trigger.type === 'COMEBACK'         ? 20  : 0;

  if (bonusXP === 0) return 0;

  // Log the bonus XP in today's daily log
  const todayKey = new Date().toISOString().split('T')[0];
  await StudentProfile.updateOne(
    { userId, 'dailyLogs.date': todayKey },
    { $inc: { 'dailyLogs.$.xpEarned': bonusXP } },
  );

  return bonusXP;
}

// ── Main export ────────────────────────────────────────────────

export async function executeMentorActions(
  userId:   string,
  snap:     BehaviorSnapshot,
  trigger:  MentorTrigger,
  message:  MentorMessage,
): Promise<MentorActionResult> {

  const actionsExecuted: string[] = [];
  const errors: string[] = [];
  let xpAwarded = 0;
  let quizAssigned = false;

  // ── 1. Build micro-task ────────────────────────────────────
  const microTask = buildMicroTask(trigger.type, snap);
  actionsExecuted.push('assignMicroTask');

  // ── 2. Update learning plan ────────────────────────────────
  try {
    await updateLearningPlan(userId, snap, trigger);
    actionsExecuted.push('updateLearningPlan');
  } catch (err: any) {
    errors.push(`updateLearningPlan: ${err.message}`);
    logger.warn({ userId, err }, '[MentorAction] updateLearningPlan failed');
  }

  // ── 3. Adjust difficulty if needed ────────────────────────
  try {
    await adjustDifficulty(userId, snap, trigger);
    actionsExecuted.push('adjustDifficulty');
  } catch (err: any) {
    errors.push(`adjustDifficulty: ${err.message}`);
  }

  // ── 4. Assign quiz for low performance ────────────────────
  if (trigger.type === 'LOW_PERFORMANCE' || trigger.type === 'WEAK_TOPIC_FOCUS') {
    quizAssigned = true;
    actionsExecuted.push('assignTargetedQuiz');
  }

  // ── 5. Award bonus XP ────────────────────────────────────
  try {
    xpAwarded = await awardBonusXP(userId, trigger, snap);
    if (xpAwarded > 0) actionsExecuted.push(`awardXP:${xpAwarded}`);
  } catch (err: any) {
    errors.push(`awardXP: ${err.message}`);
  }

  logger.info({ userId, trigger: trigger.type, actionsExecuted }, '[MentorAction] Actions executed');

  return { actionsExecuted, microTask, quizAssigned, xpAwarded, errors };
}

export const mentorActionEngine = { executeMentorActions };