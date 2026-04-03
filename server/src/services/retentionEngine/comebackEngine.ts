/**
 * AI Study OS — Comeback Engine (Stage 7 — Retention Engine)
 * ─────────────────────────────────────────────────────────────
 * Detects users inactive for 48h+ and creates personalized
 * comeback plans to re-engage them with minimal friction.
 *
 * Triggers:
 *   inactive > 48h   →  soft comeback (5-min plan)
 *   inactive > 72h   →  strong comeback (fresh start message)
 *   inactive > 7d    →  deep comeback (AI-generated plan)
 *
 * Output:
 *   ComebackPlan with message, tasks, and motivational content
 */

import { User }                from '../../models/User.model.js';
import { StudentProfile }      from '../../models/StudentProfile.model.js';
import { Activity }            from '../../models/Activity.model.js';
import { logger }              from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export type ComebackIntensity = 'none' | 'soft' | 'strong' | 'deep';

export interface ComebackTask {
  id:          string;
  title:       string;
  description: string;
  durationMin: number;
  type:        'ask_ai' | 'quiz' | 'lesson' | 'challenge' | 'review';
  xpReward:    number;
}

export interface ComebackPlan {
  userId:        string;
  intensity:     ComebackIntensity;
  headline:      string;
  message:       string;
  subMessage:    string;
  tasks:         ComebackTask[];
  totalMinutes:  number;
  totalXP:       number;
  ctaText:       string;
  isNewPlan:     boolean;       // freshly generated vs returning
  generatedAt:   string;
}

// ── Comeback Task Templates ────────────────────────────────────

const QUICK_TASKS: ComebackTask[] = [
  {
    id:          'ask_ai_1',
    title:       'Ask AI One Question',
    description: 'Pick any topic — ask the AI tutor one thing',
    durationMin: 2,
    type:        'ask_ai',
    xpReward:    10,
  },
  {
    id:          'quiz_mini',
    title:       'Quick Mini Quiz',
    description: '3-question quiz to warm up your brain',
    durationMin: 3,
    type:        'quiz',
    xpReward:    20,
  },
  {
    id:          'daily_challenge',
    title:       'Today\'s Daily Challenge',
    description: 'One challenge — fast and fun',
    durationMin: 5,
    type:        'challenge',
    xpReward:    30,
  },
];

function buildComebackTasks(intensity: ComebackIntensity, weakTopics: string[]): ComebackTask[] {
  if (intensity === 'soft') {
    return [QUICK_TASKS[0]]; // Just 1 easy task
  }

  if (intensity === 'strong') {
    return [QUICK_TASKS[0], QUICK_TASKS[2]]; // Ask AI + Challenge
  }

  // deep — build a 15-min restart plan
  const tasks: ComebackTask[] = [...QUICK_TASKS];
  if (weakTopics.length > 0) {
    tasks.push({
      id:          'weak_review',
      title:       `Review: ${weakTopics[0]}`,
      description: `You were working on ${weakTopics[0]} — pick up where you left off`,
      durationMin: 5,
      type:        'review',
      xpReward:    25,
    });
  }
  return tasks;
}

function buildMessages(
  intensity:     ComebackIntensity,
  userName:      string,
  daysMissed:    number,
  lastTopic:     string | null,
): { headline: string; message: string; subMessage: string; ctaText: string } {

  if (intensity === 'soft') {
    return {
      headline:   `Welcome back, ${userName}! 👋`,
      message:    "Let's restart with a 5-minute task",
      subMessage: "Small step. Big comeback. You've got this!",
      ctaText:    "Start 5 Min Task",
    };
  }

  if (intensity === 'strong') {
    return {
      headline:   `Miss you, ${userName}! 🌟`,
      message:    "We made a fresh plan for you",
      subMessage: `${daysMissed} days away — let's get back on track together!`,
      ctaText:    "See My Plan",
    };
  }

  // deep
  const topicStr = lastTopic ? ` You were studying ${lastTopic}.` : '';
  return {
    headline:   `Hey ${userName}, it's been a while 💙`,
    message:    "I noticed you missed some days. Let's get back on track.",
    subMessage: `${daysMissed} days away.${topicStr} I created a gentle restart plan just for you.`,
    ctaText:    "Start My Comeback",
  };
}

// ── Core Function ──────────────────────────────────────────────

export async function generateComebackPlan(userId: string): Promise<ComebackPlan> {
  try {
    const [user, profile, recentActivity] = await Promise.all([
      User.findById(userId).select('name lastActive').lean() as any,
      StudentProfile.findOne({ userId }).lean() as any,
      Activity.find({ userId }).sort({ timestamp: -1 }).limit(1).lean(),
    ]);

    if (!user) throw new Error(`User ${userId} not found`);

    const now        = new Date();
    const lastActive = user.lastActive ? new Date(user.lastActive) : null;
    const hoursSince = lastActive ? (now.getTime() - lastActive.getTime()) / 3600000 : 9999;
    const daysMissed = Math.floor(hoursSince / 24);

    // Determine intensity
    let intensity: ComebackIntensity = 'none';
    if      (hoursSince > 7 * 24) intensity = 'deep';
    else if (hoursSince > 72)     intensity = 'strong';
    else if (hoursSince > 48)     intensity = 'soft';

    if (intensity === 'none') {
      return {
        userId,
        intensity:    'none',
        headline:     'Keep going!',
        message:      'You\'re on track — no comeback needed!',
        subMessage:   '',
        tasks:        [],
        totalMinutes: 0,
        totalXP:      0,
        ctaText:      'Continue',
        isNewPlan:    false,
        generatedAt:  now.toISOString(),
      };
    }

    const weakTopics: string[]  = profile?.weakTopics ?? [];
    const lastTopic: string | null =
      profile?.dailyLogs?.at?.(-1)?.topicsCovered?.[0] ?? null;
    const userName  = user.name?.split(' ')[0] ?? 'there';

    const tasks    = buildComebackTasks(intensity, weakTopics);
    const messages = buildMessages(intensity, userName, daysMissed, lastTopic);

    const totalMinutes = tasks.reduce((s, t) => s + t.durationMin, 0);
    const totalXP      = tasks.reduce((s, t) => s + t.xpReward, 0);

    const plan: ComebackPlan = {
      userId,
      intensity,
      headline:     messages.headline,
      message:      messages.message,
      subMessage:   messages.subMessage,
      tasks,
      totalMinutes,
      totalXP,
      ctaText:      messages.ctaText,
      isNewPlan:    true,
      generatedAt:  now.toISOString(),
    };

    logger.info({ userId, intensity, daysMissed }, '[ComebackEngine] Plan generated');
    return plan;

  } catch (err) {
    logger.error({ userId, err }, '[ComebackEngine] generateComebackPlan failed');
    throw err;
  }
}

/**
 * shouldTriggerComeback — Quick check without generating full plan
 */
export async function shouldTriggerComeback(userId: string): Promise<{
  should: boolean;
  intensity: ComebackIntensity;
  hoursSince: number;
}> {
  try {
    const user = await User.findById(userId).select('lastActive').lean() as any;
    if (!user) return { should: false, intensity: 'none', hoursSince: 0 };

    const now        = new Date();
    const lastActive = user.lastActive ? new Date(user.lastActive) : null;
    const hoursSince = lastActive ? (now.getTime() - lastActive.getTime()) / 3600000 : 9999;

    let intensity: ComebackIntensity = 'none';
    if      (hoursSince > 7 * 24) intensity = 'deep';
    else if (hoursSince > 72)     intensity = 'strong';
    else if (hoursSince > 48)     intensity = 'soft';

    return { should: intensity !== 'none', intensity, hoursSince };
  } catch (err) {
    logger.error({ userId, err }, '[ComebackEngine] shouldTriggerComeback failed');
    return { should: false, intensity: 'none', hoursSince: 0 };
  }
}

export const comebackEngine = {
  generateComebackPlan,
  shouldTriggerComeback,
};