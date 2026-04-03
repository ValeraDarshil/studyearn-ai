/**
 * AI Study OS — Reward Trigger System (Stage 7 — Retention Engine)
 * ─────────────────────────────────────────────────────────────
 * Triggers XP/point rewards for retention-related events.
 *
 * Reward Events:
 *   streak_maintained   → +10–60 XP (scales with streak)
 *   streak_recovery     → +50 XP
 *   comeback_success    → +30 XP
 *   task_completed      → +10 XP
 *   challenge_completed → +25–50 XP
 *
 * Integrates with:
 *   - User model (points, totalXP)
 *   - Gamification system (achievements)
 */

import { User }    from '../../models/User.model.js';
import { Activity } from '../../models/Activity.model.js';
import { logger }  from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export type RewardEventType =
  | 'streak_maintained'
  | 'streak_recovery'
  | 'comeback_success'
  | 'task_completed'
  | 'challenge_completed'
  | 'daily_login'
  | 'lesson_completed';

export interface RewardContext {
  streakValue?: number;
  xpBonus?:     number;
  taskTitle?:   string;
  challengeId?: string;
}

export interface RewardResult {
  success:       boolean;
  event:         RewardEventType;
  xpAwarded:     number;
  newPoints:     number;
  newTotalXP:    number;
  badgeUnlocked: string | null;
  message:       string;
  celebrationMsg: string;
}

// ── XP Calculation ─────────────────────────────────────────────

function calcXP(event: RewardEventType, ctx: RewardContext): number {
  switch (event) {
    case 'streak_maintained': {
      const streak = ctx.streakValue ?? 1;
      // Base 10 + streak bonus (max 60)
      return Math.min(10 + streak * 2, 60);
    }
    case 'streak_recovery':     return ctx.xpBonus ?? 50;
    case 'comeback_success':    return 30;
    case 'task_completed':      return 10;
    case 'challenge_completed': return ctx.xpBonus ?? 25;
    case 'daily_login':         return 5;
    case 'lesson_completed':    return 15;
    default:                    return 10;
  }
}

function buildCelebration(event: RewardEventType, xp: number, ctx: RewardContext): string {
  switch (event) {
    case 'streak_maintained':
      return `🔥 +${xp} XP for keeping your ${ctx.streakValue}-day streak alive!`;
    case 'streak_recovery':
      return `⚡ +${xp} XP for saving your streak! You're unstoppable!`;
    case 'comeback_success':
      return `🎉 +${xp} XP for coming back! Welcome home!`;
    case 'task_completed':
      return `✅ +${xp} XP — Task complete!`;
    case 'challenge_completed':
      return `🏆 +${xp} XP — Challenge crushed!`;
    case 'daily_login':
      return `👋 +${xp} XP — Daily login bonus!`;
    case 'lesson_completed':
      return `📚 +${xp} XP — Lesson complete!`;
    default:
      return `+${xp} XP earned!`;
  }
}

// ── Badge Logic ────────────────────────────────────────────────

function checkRetentionBadge(event: RewardEventType, streakValue: number): string | null {
  if (event === 'streak_recovery')                      return 'streak_saver';
  if (event === 'comeback_success')                     return 'comeback_king';
  if (event === 'streak_maintained' && streakValue >= 7)  return 'week_warrior';
  if (event === 'streak_maintained' && streakValue >= 30) return 'monthly_master';
  return null;
}

// ── Core Function ──────────────────────────────────────────────

export async function triggerReward(
  userId: string,
  event:  RewardEventType,
  ctx:    RewardContext = {},
): Promise<RewardResult> {
  try {
    const user = await User.findById(userId).select('points totalXP streak unlockedAchievements');
    if (!user) throw new Error(`User ${userId} not found`);

    const xpAwarded = calcXP(event, ctx);
    const badge     = checkRetentionBadge(event, ctx.streakValue ?? (user as any).streak ?? 0);

    // Award XP
    (user as any).points  = ((user as any).points  ?? 0) + xpAwarded;
    (user as any).totalXP = ((user as any).totalXP ?? 0) + xpAwarded;

    // Unlock badge if new
    if (badge) {
      const existing: string[] = (user as any).unlockedAchievements ?? [];
      if (!existing.includes(badge)) {
        (user as any).unlockedAchievements = [...existing, badge];
      }
    }

    await user.save();

    // Log activity
    await Activity.create({
      userId,
      action:      'streak_bonus',
      details:     `Retention reward: ${event} (+${xpAwarded} XP)`,
      pointsEarned: xpAwarded,
      timestamp:   new Date(),
    }).catch(() => {}); // non-fatal

    const celebration = buildCelebration(event, xpAwarded, ctx);

    logger.info({ userId, event, xpAwarded, badge }, '[RewardTrigger] Reward given');

    return {
      success:       true,
      event,
      xpAwarded,
      newPoints:     (user as any).points,
      newTotalXP:    (user as any).totalXP,
      badgeUnlocked: badge,
      message:       `${event} reward granted`,
      celebrationMsg: celebration,
    };

  } catch (err) {
    logger.error({ userId, event, err }, '[RewardTrigger] triggerReward failed');
    return {
      success:       false,
      event,
      xpAwarded:     0,
      newPoints:     0,
      newTotalXP:    0,
      badgeUnlocked: null,
      message:       'Reward failed',
      celebrationMsg: '',
    };
  }
}

/**
 * triggerStreakMilestoneReward — Special rewards for streak milestones
 */
export async function triggerStreakMilestoneReward(userId: string, streak: number): Promise<RewardResult | null> {
  const MILESTONES = [3, 7, 14, 21, 30, 60, 100];
  if (!MILESTONES.includes(streak)) return null;

  const bonusXP = streak >= 30 ? 200 : streak >= 14 ? 100 : streak >= 7 ? 50 : 25;

  return triggerReward(userId, 'streak_maintained', {
    streakValue: streak,
    xpBonus:     bonusXP,
  });
}

export const rewardTriggerSystem = {
  triggerReward,
  triggerStreakMilestoneReward,
};