// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Rewards Controller
// ─────────────────────────────────────────────────────────────
// Reward tiers, redemption, premium polling job
// ─────────────────────────────────────────────────────────────

import { Request, Response } from 'express';
import { getUserIdFromToken } from '../middleware/authMiddleware.js';
import { User } from '../models/User.model.js';
import { Activity } from '../models/Activity.model.js';
import { Redemption } from '../models/Redemption.model.js';
import { logger } from '../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// REWARD TIERS — single source of truth
// ─────────────────────────────────────────────────────────────
export const REWARD_TIERS = [
  // ✅ tier_1000 — desc fixed: 30/day (premium actual limit), not 10
  { id: 'tier_1000',  title: '7-Day Premium',       desc: '30 AI questions/day • 2× points & XP • Premium badge',      pointsCost: 1000,  type: 'premium',  icon: '⚡', available: true  },
  // ✅ New in-app premium rewards — no paise, no external vouchers
  { id: 'tier_2000',  title: 'Exclusive Avatar Pack', desc: 'Unlock 5 rare animated avatars for your profile',           pointsCost: 2000,  type: 'premium',  icon: '🎭', available: false },
  { id: 'tier_3000',  title: '30-Day Premium',        desc: '30 AI questions/day • 2× points & XP • Premium badge',      pointsCost: 3000,  type: 'premium',  icon: '👑', available: false },
  { id: 'tier_500',   title: 'Quiz Boost Day',         desc: 'Unlimited AI quizzes for 24 hours — test prep mode',        pointsCost: 500,   type: 'premium',  icon: '🧪', available: false },
  { id: 'tier_5000',  title: '90-Day Premium',         desc: '3 months of 30 AI questions/day • 2× points — best value!', pointsCost: 5000,  type: 'premium',  icon: '💎', available: false },
];

// ─────────────────────────────────────────────────────────────
// PRIVATE — Premium eligibility fraud check
// ─────────────────────────────────────────────────────────────
async function checkPremiumEligibility(userId: string): Promise<{ ok: boolean; reason?: string }> {
  try {
    const user = await User.findById(userId);
    if (!user) return { ok: false, reason: 'User not found' };

    const activities = await Activity.find({ userId }).sort({ createdAt: -1 }).limit(200).lean();

    // Rule 1: At least 5 real study actions
    const realActions = ['ask_question', 'generate_ppt', 'convert_pdf', 'daily_challenge', 'quiz_completed', 'study_plan_created'];
    const realCount   = activities.filter((a: any) => realActions.includes(a.action)).length;
    if (realCount < 5) return { ok: false, reason: 'Not enough genuine study activity. Keep using the app and try again.' };

    // Rule 2: No rapid farming — max 300 pts in any 10-min window
    const sorted = [...activities].sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    for (let i = 0; i < sorted.length; i++) {
      const windowStart = new Date((sorted[i] as any).createdAt).getTime();
      const windowPts   = sorted
        .filter((a: any) => { const t = new Date((a as any).createdAt).getTime(); return t >= windowStart && t <= windowStart + 10 * 60 * 1000; })
        .reduce((sum: number, a: any) => sum + (a.pointsEarned || 0), 0);
      if (windowPts > 300) return { ok: false, reason: 'Suspicious rapid point activity detected. Please use the app naturally.' };
    }

    // Rule 3: Account at least 2 hours old
    const ageMs = Date.now() - new Date((user as any).createdAt).getTime();
    if (ageMs < 2 * 60 * 60 * 1000) return { ok: false, reason: 'Account too new. Use the app for at least 2 hours before redeeming.' };

    // Rule 4: At least 2 different action types
    const uniqueActions = new Set(activities.map((a: any) => a.action));
    if (uniqueActions.size < 2) return { ok: false, reason: 'Points earned from too few features. Use more of the app.' };

    return { ok: true };
  } catch (err: any) {
    logger.error('Fraud check error:', err.message);
    return { ok: false, reason: 'Verification failed. Please try again.' };
  }
}

// ─────────────────────────────────────────────────────────────
// BACKGROUND JOB — Premium polling (5 min interval)
// index.ts startup pe call karo, phir setInterval
// ─────────────────────────────────────────────────────────────
export async function processPendingPremiums(): Promise<void> {
  try {
    const now     = new Date();
    const pending = await Redemption.find({
      rewardId:    'tier_1000',
      status:      'pending',
      eligibleAt:  { $lte: now },
    }).lean();

    if (pending.length === 0) return;
    logger.info(`Premium polling: ${pending.length} redemption(s) to process`);

    for (const red of pending) {
      try {
        const rec = await Redemption.findById((red as any)._id);
        if (!rec || rec.status !== 'pending') continue;

        const check = await checkPremiumEligibility((red as any).userId.toString());
        if (!check.ok) {
          rec.status    = 'rejected';
          rec.adminNote = `Auto-rejected: ${check.reason}`;
          await rec.save();
          const u = await User.findById((red as any).userId);
          if (u) { u.points += (red as any).pointsCost; await u.save(); }
          logger.info(`Premium REJECTED for ${(red as any).userEmail}: ${check.reason}`);
        } else {
          rec.status = 'fulfilled';
          await rec.save();
          const u = await User.findById((red as any).userId);
          if (u) {
            const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            (u as any).isPremium          = true;
            (u as any).premiumExpiresAt   = expiry;
            (u as any).premiumActivatedAt = new Date();

            // ✅ Turant questionsLeft = 30 kar do (premium limit) — user ko wait nahi karna chahiye
            const today = new Date().toISOString().split('T')[0];
            u.questionsLeft = 30;
            u.questionsDate = today;

            await u.save();
            logger.info(`Premium ACTIVATED for ${u.email} — expires ${expiry.toISOString()} | questionsLeft set to 30`);
          }
        }
      } catch (err: any) {
        logger.error(`Premium processing error for ${(red as any).userEmail}:`, err.message);
      }
    }
  } catch (err: any) {
    logger.error('Premium polling error:', err.message);
  }
}

export async function fixStuckRedemptions(): Promise<void> {
  try {
    const stuck = await Redemption.find({ status: 'pending', rewardId: 'tier_1000', eligibleAt: null });
    if (stuck.length === 0) return;
    const pastTime = new Date(Date.now() - 1000);
    for (const r of stuck) { (r as any).eligibleAt = pastTime; await r.save(); }
    logger.info(`Fixed ${stuck.length} stuck pending premium redemption(s)`);
  } catch (err: any) {
    logger.error('fixStuckRedemptions error:', err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// ROUTE HANDLERS
// ─────────────────────────────────────────────────────────────

export async function getRewardTiers(_req: Request, res: Response) {
  res.json({ success: true, tiers: REWARD_TIERS });
}

export async function getRewardStatus(req: Request, res: Response) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Login required' });

    const user   = await User.findById(userId).lean();
    if (!user)   return res.status(404).json({ success: false });

    const expiresAt = (user as any).premiumExpiresAt;
    const isPremium = (user as any).isPremium === true && expiresAt && new Date(expiresAt) > new Date();
    const daysLeft  = isPremium ? Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000) : 0;
    const pending   = await Redemption.findOne({ userId, status: { $in: ['pending', 'processing'] } }).lean();

    res.json({ success: true, isPremium, premiumExpiresAt: expiresAt || null, daysLeft, hasPendingRedemption: !!pending, pendingRedemption: pending || null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function redeemReward(req: Request, res: Response) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Login required' });

    const { rewardId, deliveryInfo } = req.body;
    if (!rewardId) return res.status(400).json({ success: false, message: 'rewardId required' });

    const tier = REWARD_TIERS.find(t => t.id === rewardId);
    if (!tier)  return res.status(400).json({ success: false, message: 'Invalid reward' });

    // ✅ Only tier_1000 (7-Day Premium) is currently available
    if (!tier.available) {
      return res.status(400).json({ success: false, message: 'This reward is Coming Soon! Stay tuned 🚀' });
    }

    const user = await User.findById(userId);
    if (!user)  return res.status(404).json({ success: false, message: 'User not found' });

    if (user.points < tier.pointsCost) {
      return res.status(400).json({ success: false, message: `Not enough points. Need ${tier.pointsCost}, you have ${user.points}.` });
    }
    if (tier.type === 'premium' && (user as any).isPremium === true) {
      const exp = new Date((user as any).premiumExpiresAt);
      if (exp > new Date()) {
        return res.status(400).json({ success: false, message: `You already have an active Premium plan (expires ${exp.toLocaleDateString('en-IN')}).` });
      }
    }

    const existing = await Redemption.findOne({ userId, status: { $in: ['pending', 'processing'] } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have a pending redemption. Please wait for it to be processed.' });
    }

    // Sirf spendable points deduct karo — XP untouched
    user.points -= tier.pointsCost;
    await user.save();

    const redemption = await Redemption.create({
      userId, userName: user.name, userEmail: user.email,
      rewardId: tier.id, rewardTitle: tier.title, pointsCost: tier.pointsCost,
      deliveryInfo: deliveryInfo || '', status: 'pending',
    });

    await Activity.create({ userId, action: 'referral', details: `Redeemed: ${tier.title} (${tier.pointsCost} pts)`, pointsEarned: 0 });

    if (tier.type === 'premium') {
      (redemption as any).eligibleAt = new Date(Date.now() + 30 * 60 * 1000);
      await redemption.save();
      logger.info(`Premium queued for ${user.email}`);
    }

    logger.info(`REDEEM submitted: ${user.email} → ${tier.title}`);
    res.json({
      success: true,
      message: tier.type === 'premium'
        ? 'Premium plan requested! Verifying your account activity. Plan activates in ~30 minutes. ✅'
        : `Successfully redeemed ${tier.title}! We'll process it within 2–3 business days.`,
      redemptionId:    (redemption._id as any).toString(),
      pointsRemaining: user.points,
    });
  } catch (err: any) {
    logger.error('REDEEM ERROR:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getRewardHistory(req: Request, res: Response) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Login required' });
    const history = await Redemption.find({ userId }).sort({ createdAt: -1 }).limit(20).lean();
    res.json({ success: true, history });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}