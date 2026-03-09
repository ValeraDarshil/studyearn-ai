/**
 * StudyEarn AI — User Routes
 * ─────────────────────────────────────────────────────────────
 * All authenticated user actions:
 *   POST /add-points          → Add points to user
 *   POST /use-question        → Decrement daily question count
 *   POST /log-activity        → Log an activity event
 *   GET  /activity            → Get recent activity feed
 *   POST /update-profile      → Update name, email, avatar
 *   POST /update-streak       → Update login streak
 *   GET  /referral-data       → Get referral code + referred users
 *   GET  /achievements        → Get unlocked achievements
 *   POST /unlock-achievement  → Unlock a new achievement (server validates threshold)
 *   POST /increment-action    → Increment question/ppt/pdf counters
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from './models/User.model.js';
import { Activity } from './models/Activity.model.js';
import { connectDB } from './config/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET!;

// ─────────────────────────────────────────────────────────────
// AUTH MIDDLEWARE
// ─────────────────────────────────────────────────────────────
async function authenticate(req: any, res: any, next: any) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

// ─────────────────────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────────────────────
function generateReferralCode(name: string, userId: string): string {
  const namePart   = name.substring(0, 3).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const idPart     = userId.substring(userId.length - 3).toUpperCase();
  return `${namePart}${randomPart}${idPart}`;
}

// ─────────────────────────────────────────────────────────────
// ACHIEVEMENT DEFINITIONS (mirrored from frontend)
// Server validates threshold before unlocking — client can't cheat
// Keep in sync with: src/data/achievements.ts
// ─────────────────────────────────────────────────────────────
const ACHIEVEMENT_MAP: Record<string, { stat: string; threshold: number; reward: number }> = {
  first_question:   { stat: 'totalQuestionsAsked', threshold: 1,    reward: 20  },
  curious_mind:     { stat: 'totalQuestionsAsked', threshold: 10,   reward: 30  },
  knowledge_seeker: { stat: 'totalQuestionsAsked', threshold: 50,   reward: 75  },
  question_master:  { stat: 'totalQuestionsAsked', threshold: 100,  reward: 150 },
  first_ppt:        { stat: 'totalPPTsGenerated',  threshold: 1,    reward: 25  },
  ppt_pro:          { stat: 'totalPPTsGenerated',  threshold: 5,    reward: 60  },
  ppt_master:       { stat: 'totalPPTsGenerated',  threshold: 20,   reward: 200 },
  first_pdf:        { stat: 'totalPDFsConverted',  threshold: 1,    reward: 15  },
  pdf_expert:       { stat: 'totalPDFsConverted',  threshold: 10,   reward: 50  },
  streak_3:         { stat: 'streak',              threshold: 3,    reward: 30  },
  streak_7:         { stat: 'streak',              threshold: 7,    reward: 70  },
  streak_30:        { stat: 'streak',              threshold: 30,   reward: 500 },
  points_500:       { stat: 'totalXP',             threshold: 500,  reward: 0   },
  points_1000:      { stat: 'totalXP',             threshold: 1000, reward: 100 },
  points_5000:      { stat: 'totalXP',             threshold: 5000, reward: 500 },
};

// ─────────────────────────────────────────────────────────────
// ADD POINTS — POST /api/user/add-points
// ─────────────────────────────────────────────────────────────
router.post('/add-points', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { points } = req.body;

    if (typeof points !== 'number' || points <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid points value' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.points += points;
    await user.save();

    console.log(`✅ Points: ${user.email} +${points} → ${user.points}`);
    res.json({ success: true, points: user.points });
  } catch (error) {
    console.error('Add points error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// USE QUESTION — POST /api/user/use-question
// ─────────────────────────────────────────────────────────────
router.post('/use-question', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const today = new Date().toISOString().split('T')[0];
    if (user.questionsDate !== today) {
      user.questionsLeft = 5;
      user.questionsDate = today;
    }

    if (user.questionsLeft <= 0) {
      return res.json({ success: false, message: 'No questions left today', questionsLeft: 0 });
    }

    user.questionsLeft -= 1;
    await user.save();

    console.log(`✅ Question used: ${user.email} → ${user.questionsLeft} left`);
    res.json({ success: true, questionsLeft: user.questionsLeft });
  } catch (error) {
    console.error('Use question error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// LOG ACTIVITY — POST /api/user/log-activity
// ─────────────────────────────────────────────────────────────
router.post('/log-activity', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { action, details, pointsEarned } = req.body;

    await Activity.create({ userId: req.userId, action, details, pointsEarned: pointsEarned || 0 });

    console.log(`✅ Activity: ${action} — ${details}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Log activity error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// GET ACTIVITY — GET /api/user/activity
// ─────────────────────────────────────────────────────────────
router.get('/activity', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const activities = await Activity.find({ userId: req.userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();
    res.json({ success: true, activities });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// UPDATE PROFILE — POST /api/user/update-profile
// ─────────────────────────────────────────────────────────────
router.post('/update-profile', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { name, email, avatar } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email required' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    user.name  = name;
    user.email = email;
    if (avatar !== undefined) (user as any).avatar = avatar;
    await user.save();

    console.log(`✅ Profile updated: ${user.email}`);
    res.json({
      success: true,
      user: { name: user.name, email: user.email, avatar: (user as any).avatar ?? null },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// UPDATE STREAK — POST /api/user/update-streak
// ─────────────────────────────────────────────────────────────
router.post('/update-streak', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const today     = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const lastDate  = user.lastActive ? new Date(user.lastActive).toISOString().split('T')[0] : null;

    if (lastDate === today) {
      return res.json({ success: true, streak: user.streak, streakIncreased: false });
    }

    let streakIncreased = false;
    if (lastDate === yesterday) {
      user.streak += 1;
      streakIncreased = true;
    } else {
      user.streak = 1; // Reset to 1, never 0
    }

    user.lastActive = new Date();
    await user.save();

    console.log(`✅ Streak: ${user.email} → ${user.streak} days`);
    res.json({ success: true, streak: user.streak, streakIncreased, isNewStreak: !lastDate || lastDate !== yesterday });
  } catch (error) {
    console.error('Update streak error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// REFERRAL DATA — GET /api/user/referral-data
// ─────────────────────────────────────────────────────────────
router.get('/referral-data', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.referralCode) {
      user.referralCode = generateReferralCode(user.name, user._id.toString());
      await user.save();
    }

    const referredUsers = await User.find({ referredBy: user.referralCode })
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Referral data: ${user.email} — ${referredUsers.length} referrals`);
    res.json({
      success:        true,
      referralCode:   user.referralCode,
      referredUsers:  referredUsers.map(u => ({ name: u.name, email: u.email, joinedAt: u.createdAt })),
      totalReferrals: referredUsers.length,
      totalEarned:    referredUsers.length * 100,
    });
  } catch (error) {
    console.error('Referral data error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// GET ACHIEVEMENTS — GET /api/user/achievements
// ─────────────────────────────────────────────────────────────
router.get('/achievements', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.userId).lean() as any;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({
      success:              true,
      unlockedAchievements: user.unlockedAchievements || [],
      totalQuestionsAsked:  user.totalQuestionsAsked  || 0,
      totalPPTsGenerated:   user.totalPPTsGenerated   || 0,
      totalPDFsConverted:   user.totalPDFsConverted   || 0,
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// UNLOCK ACHIEVEMENT — POST /api/user/unlock-achievement
// ─────────────────────────────────────────────────────────────
// 🔒 SERVER validates threshold — client pe bilkul trust nahi
// Koi bhi DevTools se cheat nahi kar sakta ab
// ─────────────────────────────────────────────────────────────
router.post('/unlock-achievement', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { achievementId } = req.body;

    if (!achievementId) {
      return res.status(400).json({ success: false, message: 'achievementId required' });
    }

    // Kya yeh achievement exist karti hai?
    const achDef = ACHIEVEMENT_MAP[achievementId];
    if (!achDef) {
      return res.status(400).json({ success: false, message: 'Unknown achievement' });
    }

    const user = await User.findById(req.userId) as any;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Already unlocked? Idempotent — as-is return karo
    if (user.unlockedAchievements.includes(achievementId)) {
      return res.json({ success: true, unlockedAchievements: user.unlockedAchievements, rewardPoints: 0 });
    }

    // ── SERVER-SIDE THRESHOLD CHECK ──────────────────────────
    // streak achievement ke liye user.streak, baaki ke liye DB field check karo
    const statValue = (user[achDef.stat] || 0) as number;
    if (statValue < achDef.threshold) {
      return res.status(403).json({
        success: false,
        message: `Achievement not earned yet. Need ${achDef.threshold} ${achDef.stat}, you have ${statValue}.`,
      });
    }

    // Threshold verified — unlock karo
    user.unlockedAchievements.push(achievementId);

    // Reward points award karo (server side — frontend pe updateUserPoints call mat karo)
    if (achDef.reward > 0) {
      user.points  = (user.points  || 0) + achDef.reward;
      user.totalXP = (user.totalXP || 0) + achDef.reward;
    }

    await user.save();
    console.log(`🏆 Achievement unlocked: ${user.email} → ${achievementId} (+${achDef.reward} pts)`);

    res.json({
      success:              true,
      unlockedAchievements: user.unlockedAchievements,
      rewardPoints:         achDef.reward,
    });
  } catch (error) {
    console.error('Unlock achievement error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// INCREMENT ACTION — POST /api/user/increment-action
// Body: { action: 'question' | 'ppt' | 'pdf' }
// ─────────────────────────────────────────────────────────────
router.post('/increment-action', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { action } = req.body;

    if (!['question', 'ppt', 'pdf'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action. Use: question, ppt, pdf' });
    }

    const user = await User.findById(req.userId) as any;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (action === 'question') user.totalQuestionsAsked = (user.totalQuestionsAsked || 0) + 1;
    if (action === 'ppt')      user.totalPPTsGenerated  = (user.totalPPTsGenerated  || 0) + 1;
    if (action === 'pdf')      user.totalPDFsConverted  = (user.totalPDFsConverted  || 0) + 1;

    await user.save();

    res.json({
      success:             true,
      totalQuestionsAsked: user.totalQuestionsAsked,
      totalPPTsGenerated:  user.totalPPTsGenerated,
      totalPDFsConverted:  user.totalPDFsConverted,
    });
  } catch (error) {
    console.error('Increment action error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;