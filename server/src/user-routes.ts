/**
 * StudyEarn AI — User Routes
 * ─────────────────────────────────────────────────────────────
 *   POST /add-points               → Add points to user
 *   POST /use-question             → Decrement daily question count
 *   POST /log-activity             → Log an activity event
 *   GET  /activity                 → Get recent activity feed
 *   POST /update-profile           → Update name, email, avatar
 *   POST /update-streak            → Update login streak
 *   GET  /referral-data            → Get referral code + referred users
 *   GET  /achievements             → Get unlocked achievements
 *   POST /unlock-achievement       → Unlock a new achievement (server validates)
 *   POST /increment-action         → Increment question/ppt/pdf counters
 *   GET  /study-plan               → Get saved study plan
 *   POST /study-plan               → Save study plan
 *   DELETE /study-plan             → Delete study plan
 *   GET  /daily-challenge          → Get today's challenge + result
 *   POST /daily-challenge          → Save generated challenge question
 *   POST /daily-challenge/result   → Submit answer + award points server-side
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from './models/User.model.js';
import { Activity } from './models/Activity.model.js';
import { connectDB } from './config/db.js';
import { solveText } from './services/aiService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET!;

// IST-aware date key — avoids UTC midnight mismatch for Indian users
function getISTDateKey(): string {
  const now = new Date();
  // IST = UTC + 5:30
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate   = new Date(now.getTime() + istOffset);
  return istDate.toISOString().split('T')[0];
}

// ─────────────────────────────────────────────────────────────
// AUTH MIDDLEWARE
// ─────────────────────────────────────────────────────────────
async function authenticate(req: any, res: any, next: any) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS512', 'HS256'] }) as { userId: string };
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
// ACHIEVEMENT DEFINITIONS — keep in sync with src/data/achievements.ts
// v3: All new achievement IDs added. Server validates every unlock.
// ─────────────────────────────────────────────────────────────
const ACHIEVEMENT_MAP: Record<string, { stat: string; threshold: number; reward: number }> = {

  // ── Questions ──────────────────────────────────────────────
  first_question:    { stat: 'totalQuestionsAsked', threshold: 1,    reward: 20   },
  curious_mind:      { stat: 'totalQuestionsAsked', threshold: 10,   reward: 30   },
  q_25:              { stat: 'totalQuestionsAsked', threshold: 25,   reward: 50   },
  knowledge_seeker:  { stat: 'totalQuestionsAsked', threshold: 50,   reward: 75   },
  q_75:              { stat: 'totalQuestionsAsked', threshold: 75,   reward: 100  },
  question_master:   { stat: 'totalQuestionsAsked', threshold: 100,  reward: 150  },
  q_200:             { stat: 'totalQuestionsAsked', threshold: 200,  reward: 250  },
  q_300:             { stat: 'totalQuestionsAsked', threshold: 300,  reward: 350  },
  q_400:             { stat: 'totalQuestionsAsked', threshold: 400,  reward: 500  },
  question_legend:   { stat: 'totalQuestionsAsked', threshold: 500,  reward: 750  },
  q_750:             { stat: 'totalQuestionsAsked', threshold: 750,  reward: 1000 },
  q_1000:            { stat: 'totalQuestionsAsked', threshold: 1000, reward: 2000 },

  // ── PPT Generator ──────────────────────────────────────────
  first_ppt:         { stat: 'totalPPTsGenerated',  threshold: 1,    reward: 25   },
  ppt_3:             { stat: 'totalPPTsGenerated',  threshold: 3,    reward: 40   },
  ppt_pro:           { stat: 'totalPPTsGenerated',  threshold: 5,    reward: 60   },
  ppt_10:            { stat: 'totalPPTsGenerated',  threshold: 10,   reward: 120  },
  ppt_master:        { stat: 'totalPPTsGenerated',  threshold: 20,   reward: 200  },
  ppt_35:            { stat: 'totalPPTsGenerated',  threshold: 35,   reward: 350  },
  ppt_legend:        { stat: 'totalPPTsGenerated',  threshold: 50,   reward: 500  },

  // ── PDF Tools ──────────────────────────────────────────────
  first_pdf:         { stat: 'totalPDFsConverted',  threshold: 1,    reward: 15   },
  pdf_5:             { stat: 'totalPDFsConverted',  threshold: 5,    reward: 30   },
  pdf_pro:           { stat: 'totalPDFsConverted',  threshold: 10,   reward: 60   },
  pdf_25:            { stat: 'totalPDFsConverted',  threshold: 25,   reward: 120  },
  pdf_master:        { stat: 'totalPDFsConverted',  threshold: 50,   reward: 200  },
  pdf_100:           { stat: 'totalPDFsConverted',  threshold: 100,  reward: 500  },

  // ── Streak ─────────────────────────────────────────────────
  streak_3:          { stat: 'streak',              threshold: 3,    reward: 30   },
  streak_7:          { stat: 'streak',              threshold: 7,    reward: 70   },
  streak_14:         { stat: 'streak',              threshold: 14,   reward: 150  },
  streak_21:         { stat: 'streak',              threshold: 21,   reward: 250  },
  streak_30:         { stat: 'streak',              threshold: 30,   reward: 500  },
  streak_60:         { stat: 'streak',              threshold: 60,   reward: 1000 },
  streak_100:        { stat: 'streak',              threshold: 100,  reward: 2000 },
  streak_365:        { stat: 'streak',              threshold: 365,  reward: 10000},

  // ── Points ─────────────────────────────────────────────────
  points_100:        { stat: 'points',              threshold: 100,   reward: 0    },
  pts_250:           { stat: 'points',              threshold: 250,   reward: 0    },
  points_500:        { stat: 'points',              threshold: 500,   reward: 0    },
  points_1000:       { stat: 'points',              threshold: 1000,  reward: 100  },
  pts_2500:          { stat: 'points',              threshold: 2500,  reward: 200  },
  points_5000:       { stat: 'points',              threshold: 5000,  reward: 500  },
  points_10000:      { stat: 'points',              threshold: 10000, reward: 1000 },
  pts_25000:         { stat: 'points',              threshold: 25000, reward: 2500 },
  points_50000:      { stat: 'points',              threshold: 50000, reward: 5000 },

  // ── Quiz Generator ─────────────────────────────────────────
  first_quiz:        { stat: 'totalQuizCompleted',  threshold: 1,    reward: 20   },
  quiz_5:            { stat: 'totalQuizCompleted',  threshold: 5,    reward: 35   },
  quiz_10:           { stat: 'totalQuizCompleted',  threshold: 10,   reward: 50   },
  quiz_25:           { stat: 'totalQuizCompleted',  threshold: 25,   reward: 100  },
  quiz_50:           { stat: 'totalQuizCompleted',  threshold: 50,   reward: 150  },
  quiz_100:          { stat: 'totalQuizCompleted',  threshold: 100,  reward: 400  },
  quiz_200:          { stat: 'totalQuizCompleted',  threshold: 200,  reward: 1000 },

  // ── Daily Challenge ────────────────────────────────────────
  first_challenge:       { stat: 'totalChallengesCompleted', threshold: 1,   reward: 25   },
  challenge_7:           { stat: 'totalChallengesCompleted', threshold: 7,   reward: 75   },
  challenge_15:          { stat: 'totalChallengesCompleted', threshold: 15,  reward: 120  },
  challenge_30:          { stat: 'totalChallengesCompleted', threshold: 30,  reward: 300  },
  challenge_50:          { stat: 'totalChallengesCompleted', threshold: 50,  reward: 500  },
  challenge_100:         { stat: 'totalChallengesCompleted', threshold: 100, reward: 1500 },
  challenge_correct_5:   { stat: 'totalChallengesCorrect',   threshold: 5,   reward: 40   },
  challenge_correct_10:  { stat: 'totalChallengesCorrect',   threshold: 10,  reward: 100  },
  challenge_correct_25:  { stat: 'totalChallengesCorrect',   threshold: 25,  reward: 200  },
  challenge_correct_50:  { stat: 'totalChallengesCorrect',   threshold: 50,  reward: 500  },
  challenge_correct_100: { stat: 'totalChallengesCorrect',   threshold: 100, reward: 1500 },

  // ── Collab Notes ───────────────────────────────────────────
  first_note:        { stat: 'totalNotesCreated',   threshold: 1,    reward: 20   },
  notes_5:           { stat: 'totalNotesCreated',   threshold: 5,    reward: 40   },
  notes_10:          { stat: 'totalNotesCreated',   threshold: 10,   reward: 75   },
  notes_25:          { stat: 'totalNotesCreated',   threshold: 25,   reward: 200  },
  notes_50:          { stat: 'totalNotesCreated',   threshold: 50,   reward: 500  },

  // ── Study Tools ────────────────────────────────────────────
  first_study_tool:  { stat: 'totalStudyToolsUsed', threshold: 1,   reward: 20   },
  study_tools_5:     { stat: 'totalStudyToolsUsed', threshold: 5,   reward: 40   },
  study_tools_10:    { stat: 'totalStudyToolsUsed', threshold: 10,  reward: 80   },
  study_tools_25:    { stat: 'totalStudyToolsUsed', threshold: 25,  reward: 200  },
  study_tools_50:    { stat: 'totalStudyToolsUsed', threshold: 50,  reward: 500  },

  // ── Formula Sheet ──────────────────────────────────────────
  first_bookmark:    { stat: 'totalFormulaBookmarks', threshold: 1,  reward: 15   },
  bookmarks_5:       { stat: 'totalFormulaBookmarks', threshold: 5,  reward: 30   },
  bookmarks_10:      { stat: 'totalFormulaBookmarks', threshold: 10, reward: 50   },
  bookmarks_25:      { stat: 'totalFormulaBookmarks', threshold: 25, reward: 150  },
  bookmarks_50:      { stat: 'totalFormulaBookmarks', threshold: 50, reward: 400  },

  // ── Social / Referral ──────────────────────────────────────
  first_referral:    { stat: 'totalReferrals',       threshold: 1,   reward: 50   },
  referrals_3:       { stat: 'totalReferrals',       threshold: 3,   reward: 100  },
  referrals_5:       { stat: 'totalReferrals',       threshold: 5,   reward: 200  },
  referrals_10:      { stat: 'totalReferrals',       threshold: 10,  reward: 500  },
  referrals_25:      { stat: 'totalReferrals',       threshold: 25,  reward: 2000 },
  referrals_50:      { stat: 'totalReferrals',       threshold: 50,  reward: 5000 },

  // ── Days Active ────────────────────────────────────────────
  days_active_1:     { stat: 'totalDaysActive',      threshold: 1,   reward: 10   },
  days_active_7:     { stat: 'totalDaysActive',      threshold: 7,   reward: 50   },
  days_active_14:    { stat: 'totalDaysActive',      threshold: 14,  reward: 100  },
  days_active_30:    { stat: 'totalDaysActive',      threshold: 30,  reward: 200  },
  days_active_60:    { stat: 'totalDaysActive',      threshold: 60,  reward: 500  },
  days_active_100:   { stat: 'totalDaysActive',      threshold: 100, reward: 1000 },
  days_active_180:   { stat: 'totalDaysActive',      threshold: 180, reward: 2500 },
  days_active_365:   { stat: 'totalDaysActive',      threshold: 365, reward: 5000 },
};

// ─────────────────────────────────────────────────────────────
// ADD POINTS — POST /api/user/add-points
// ─────────────────────────────────────────────────────────────
router.post('/add-points', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { points } = req.body;
    const MAX_POINTS_PER_CALL = 500; // Legit max is ~50 (premium AI). Cap prevents abuse.
    if (typeof points !== 'number' || points <= 0 || points > MAX_POINTS_PER_CALL)
      return res.status(400).json({ success: false, message: 'Invalid points value' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.points += points;
    await user.save();
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
    if (user.questionsDate !== today) { user.questionsLeft = 15; user.questionsDate = today; } // 15 = free daily limit
    if (user.questionsLeft <= 0)
      return res.json({ success: false, message: 'No questions left today', questionsLeft: 0 });

    user.questionsLeft -= 1;
    await user.save();
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
    // Sanitize inputs — prevent DB bloat and injection
    const VALID_ACTIONS = ['ask_question','ppt_generated','pdf_converted','quiz_completed',
      'challenge_completed','note_created','study_tool_used','formula_bookmarked',
      'streak_bonus','login_bonus','achievement_unlocked','referral_bonus','improve_notes','analyze_pdf'];
    const safeAction  = VALID_ACTIONS.includes(action) ? action : 'other';
    const safeDetails = typeof details === 'string' ? details.substring(0, 200) : '';
    const safePoints  = typeof pointsEarned === 'number' && pointsEarned >= 0 && pointsEarned <= 500
      ? pointsEarned : 0;
    await Activity.create({ userId: req.userId, action: safeAction, details: safeDetails, pointsEarned: safePoints });
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
    // 50 activities — enough for 7-day weekly chart + 30-day challenge stats in Analytics
    const activities = await Activity.find({ userId: req.userId }).sort({ timestamp: -1 }).limit(200).lean();
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
    if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    user.name = name; user.email = email;
    if (avatar !== undefined) (user as any).avatar = avatar;
    await user.save();
    res.json({ success: true, user: { name: user.name, email: user.email, avatar: (user as any).avatar ?? null } });
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

    // IST-aware dates — Indian users get correct day boundary
    const toIST = (d: Date) => new Date(d.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split('T')[0];
    const today     = toIST(new Date());
    const yesterday = toIST(new Date(Date.now() - 86400000));
    const lastDate  = user.lastActive ? toIST(new Date(user.lastActive)) : null;

    if (lastDate === today) return res.json({ success: true, streak: user.streak, streakIncreased: false });

    let streakIncreased = false;
    if (lastDate === yesterday) { user.streak += 1; streakIncreased = true; }
    else { user.streak = 1; }

    user.lastActive = new Date();
    await user.save();
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
      .select('name email createdAt').sort({ createdAt: -1 }).lean();

    res.json({
      success: true,
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
      success:                  true,
      unlockedAchievements:     user.unlockedAchievements     || [],
      // ── Stats for achievement checking ──
      totalQuestionsAsked:      user.totalQuestionsAsked      || 0,
      totalPPTsGenerated:       user.totalPPTsGenerated       || 0,
      totalPDFsConverted:       user.totalPDFsConverted       || 0,
      totalQuizCompleted:       user.totalQuizCompleted       || 0,
      totalChallengesCompleted: user.totalChallengesCompleted  || 0,
      totalChallengesCorrect:   user.totalChallengesCorrect   || 0,
      totalNotesCreated:        user.totalNotesCreated        || 0,
      totalStudyToolsUsed:      user.totalStudyToolsUsed      || 0,
      totalDaysActive:          user.totalDaysActive          || 0,
      totalReferrals:           user.totalReferrals           || 0,
      formulaBookmarks:         user.formulaBookmarks         || [],
      // ── For profile display ──
      totalXP:                  user.totalXP                  || 0,
      streak:                   user.streak                   || 0,
      points:                   user.points                   || 0,
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// UNLOCK ACHIEVEMENT — POST /api/user/unlock-achievement
// 🔒 Server validates threshold — client can't cheat
// ─────────────────────────────────────────────────────────────
router.post('/unlock-achievement', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { achievementId } = req.body;
    if (!achievementId) return res.status(400).json({ success: false, message: 'achievementId required' });

    const achDef = ACHIEVEMENT_MAP[achievementId];
    if (!achDef) return res.status(400).json({ success: false, message: 'Unknown achievement' });

    const user = await User.findById(req.userId) as any;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.unlockedAchievements.includes(achievementId))
      return res.json({ success: true, unlockedAchievements: user.unlockedAchievements, rewardPoints: 0 });

    // Compute stat value — some stats are derived from arrays/sub-queries
    let statValue: number;
    if (achDef.stat === 'totalFormulaBookmarks') {
      statValue = (user.formulaBookmarks || []).length;
    } else if (achDef.stat === 'totalReferrals') {
      statValue = await User.countDocuments({ referredBy: user.referralCode });
    } else {
      statValue = (user[achDef.stat] || 0) as number;
    }

    if (statValue < achDef.threshold) {
      return res.status(403).json({
        success: false,
        message: `Not earned yet. Need ${achDef.threshold} ${achDef.stat}, you have ${statValue}.`,
      });
    }

    user.unlockedAchievements.push(achievementId);
    if (achDef.reward > 0) {
      user.points  = (user.points  || 0) + achDef.reward;
      user.totalXP = (user.totalXP || 0) + achDef.reward;
    }
    await user.save();
    res.json({ success: true, unlockedAchievements: user.unlockedAchievements, rewardPoints: achDef.reward });
  } catch (error) {
    console.error('Unlock achievement error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// INCREMENT ACTION — POST /api/user/increment-action
// ─────────────────────────────────────────────────────────────
router.post('/increment-action', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { action } = req.body;
    if (!['question', 'ppt', 'pdf'].includes(action))
      return res.status(400).json({ success: false, message: 'Invalid action' });

    const user = await User.findById(req.userId) as any;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (action === 'question') user.totalQuestionsAsked = (user.totalQuestionsAsked || 0) + 1;
    if (action === 'ppt')      user.totalPPTsGenerated  = (user.totalPPTsGenerated  || 0) + 1;
    if (action === 'pdf')      user.totalPDFsConverted  = (user.totalPDFsConverted  || 0) + 1;
    await user.save();

    res.json({
      success: true,
      totalQuestionsAsked: user.totalQuestionsAsked,
      totalPPTsGenerated:  user.totalPPTsGenerated,
      totalPDFsConverted:  user.totalPDFsConverted,
    });
  } catch (error) {
    console.error('Increment action error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═════════════════════════════════════════════════════════════
// STUDY PLAN — Server-side persistence (cross-device sync)
// ═════════════════════════════════════════════════════════════

// GET /api/user/study-plan
router.get('/study-plan', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.userId).lean() as any;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, plan: user.studyPlan || null });
  } catch (error) {
    console.error('Get study plan error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/user/study-plan
router.post('/study-plan', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { plan } = req.body;
    if (!plan?.examName || !plan?.examDate || !plan?.days)
      return res.status(400).json({ success: false, message: 'Invalid plan data' });

    await User.findByIdAndUpdate(req.userId, { studyPlan: plan });
    res.json({ success: true });
  } catch (error) {
    console.error('Save study plan error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/user/study-plan
router.delete('/study-plan', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    await User.findByIdAndUpdate(req.userId, { studyPlan: null });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete study plan error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═════════════════════════════════════════════════════════════
// DAILY CHALLENGE — Server-side persistence
// Prevents double-award across devices, resets at midnight
// ═════════════════════════════════════════════════════════════

// GET /api/user/daily-challenge
router.get('/daily-challenge', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.userId).lean() as any;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const todayKey = getISTDateKey();
    const dc = user.dailyChallenge || {};

    const challenge = dc.date === todayKey ? (dc.challenge || null) : null;
    const result    = dc.date === todayKey ? (dc.result    || null) : null;

    // Build history map: start from challengeHistory array (persisted)
    const history: Record<string, { completed: boolean; correct: boolean }> = {};

    // Layer 1: challengeHistory array (from markModified saves going forward)
    const histArr: any[] = user.challengeHistory || [];
    for (const h of histArr) {
      if (h.date) history[h.date] = { completed: !!h.completed, correct: !!h.correct };
    }

    // Layer 2: Backfill from Activity records (catches all historical data)
    // This ensures history works even for challenges done before challengeHistory was tracked
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentChallenges = await Activity.find({
      userId:    req.userId,
      action:    'daily_challenge',
      timestamp: { $gte: sevenDaysAgo },
    }).sort({ timestamp: 1 }).lean() as any[];

    for (const act of recentChallenges) {
      // Convert activity timestamp to IST date key
      const actTime   = new Date(act.timestamp).getTime() + (5.5 * 60 * 60 * 1000);
      const dateKey   = new Date(actTime).toISOString().split('T')[0];
      // Only set if not already in challengeHistory (don't overwrite)
      if (!history[dateKey]) {
        const correct = typeof act.details === 'string' && act.details.includes('Correct');
        history[dateKey] = { completed: true, correct };
      }
    }

    // Layer 3: Today's live result (most accurate)
    if (result?.completed) {
      history[todayKey] = { completed: true, correct: !!result.correct };
    }

    res.json({ success: true, challenge, result, todayKey, history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/user/daily-challenge/generate  — AI generates challenge (NO quota used)
router.post('/daily-challenge/generate', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const todayKey = getISTDateKey();
    const user = await User.findById(req.userId).lean() as any;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // If already generated today, return existing (idempotent) — unless force=true
    const dc = user.dailyChallenge || {};
    const force = req.body.force === true;
    if (!force && dc.date === todayKey && dc.challenge) {
      return res.json({ success: true, challenge: dc.challenge, cached: true });
    }

    const { subject, topic, pts } = req.body;
    if (!subject || !topic) return res.status(400).json({ success: false, message: 'subject and topic required' });

    // Use JSON format — much more reliable across all models including DeepSeek/Qwen
    const prompt = `You are a quiz generator. Generate 1 MCQ about "${topic}" for Indian competitive exam students.

Return ONLY a valid JSON object. No explanation, no markdown, no code fences, no text before or after the JSON:
{"q":"question text here","opts":["option A text","option B text","option C text","option D text"],"ans":0,"exp":"brief explanation"}

Rules:
- "ans" is the 0-based index of the correct option (0=A, 1=B, 2=C, 3=D)
- All 4 options must be different and plausible
- Question must be specific to ${topic}
- Return ONLY the JSON object, nothing else`;

    const raw = await solveText(prompt, []);

    // Strip everything outside the JSON object
    const cleaned = raw
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/<\/think>/gi, '')
      .replace(/^[\s\S]*?(\{)/, '$1')   // everything before first {
      .replace(/(\})[\s\S]*$/, '$1')    // everything after last }
      .replace(/\*\*/g, '')
      .trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback: try to extract JSON with regex
      const match = raw.match(/\{[^{}]*"q"[^{}]*"opts"[^{}]*\}/s);
      if (!match) {
        console.error('[Daily Challenge] Parse failed. Raw:', raw.substring(0, 400));
        return res.status(500).json({ success: false, message: 'Could not parse AI response. Try again.' });
      }
      try { parsed = JSON.parse(match[0]); }
      catch {
        console.error('[Daily Challenge] Fallback parse failed.');
        return res.status(500).json({ success: false, message: 'Could not parse AI response. Try again.' });
      }
    }

    const qLine = (parsed.q || '').trim();
    const opts: string[] = Array.isArray(parsed.opts) ? parsed.opts.map((o: any) => String(o).trim()) : [];
    const ansIdx: number = typeof parsed.ans === 'number' ? parsed.ans : -1;
    const explanation = (parsed.exp || '').trim();

    if (!qLine || opts.length !== 4 || opts.some((o: string) => !o) || ansIdx < 0 || ansIdx > 3) {
      console.error('[Daily Challenge] Invalid structure. Parsed:', JSON.stringify(parsed));
      return res.status(500).json({ success: false, message: 'Could not parse AI response. Try again.' });
    }

    const challenge = {
      date: todayKey, question: qLine, options: opts,
      answer: ansIdx, explanation, subject, pts: pts || 25,
    };

    // Save challenge to DB (no result yet)
    const userDoc = await User.findById(req.userId) as any;
    const existingResult = userDoc.dailyChallenge?.date === todayKey ? (userDoc.dailyChallenge?.result || null) : null;
    userDoc.dailyChallenge = { date: todayKey, challenge, result: existingResult };
    userDoc.markModified('dailyChallenge');
    await userDoc.save();

    res.json({ success: true, challenge });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// POST /api/user/daily-challenge  — save generated question
router.post('/daily-challenge', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { challenge } = req.body;
    const todayKey = new Date().toISOString().split('T')[0];

    if (!challenge?.question || challenge.date !== todayKey)
      return res.status(400).json({ success: false, message: 'Invalid challenge data' });

    const user = await User.findById(req.userId) as any;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Keep existing result if already answered today
    const existingResult = user.dailyChallenge?.date === todayKey ? (user.dailyChallenge?.result || null) : null;
    user.dailyChallenge  = { date: todayKey, challenge, result: existingResult };
    user.markModified('dailyChallenge');
    await user.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Save daily challenge error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/user/daily-challenge/result  — submit answer (server awards points)
router.post('/daily-challenge/result', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { selectedIdx, challengeDate } = req.body;
    const todayKey = getISTDateKey();

    if (challengeDate !== todayKey)
      return res.status(400).json({ success: false, message: 'Challenge date mismatch' });

    const user = await User.findById(req.userId) as any;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const dc = user.dailyChallenge;
    if (!dc || dc.date !== todayKey || !dc.challenge)
      return res.status(400).json({ success: false, message: 'No challenge found for today. Load it first.' });

    // Already submitted? Return existing result — no double award
    if (dc.result?.completed)
      return res.json({ success: true, result: dc.result, alreadySubmitted: true });

    const challenge = dc.challenge;
    const correct   = selectedIdx === challenge.answer;

    // Premium check
    const premExp = user.premiumExpiresAt;
    const premium = user.isPremium === true && premExp && new Date(premExp) > new Date();
    if (user.isPremium && !premium) { user.isPremium = false; user.premiumExpiresAt = null; }

    // Points: free = challenge.pts (or 10% on wrong), premium = 2x
    const basePts   = correct ? challenge.pts : Math.round(challenge.pts * 0.1);
    const ptsEarned = premium ? basePts * 2 : basePts;

    const result = { date: todayKey, completed: true, correct, ptsEarned };

    user.points  = (user.points  || 0) + ptsEarned;
    user.totalXP = (user.totalXP || 0) + ptsEarned;
    user.dailyChallenge = { ...dc, result };

    // Save challengeHistory for 7-day tracker (single save)
    const histEntry = { date: todayKey, completed: true, correct };
    const existingHist: any[] = user.challengeHistory || [];
    const filteredHist = existingHist.filter((h: any) => h.date !== todayKey);
    user.challengeHistory = [...filteredHist, histEntry].slice(-30); // keep last 30 days

    // markModified required for Mongoose Mixed type fields — without this, changes are NOT saved
    user.markModified('dailyChallenge');
    user.markModified('challengeHistory');
    await user.save(); // single save — both dailyChallenge + challengeHistory

    await Activity.create({
      userId:       req.userId,
      action:       'daily_challenge',
      details:      `Daily Challenge: ${challenge.subject} — ${correct ? 'Correct ✅' : 'Incorrect ❌'}`,
      pointsEarned: ptsEarned,
    });

    res.json({ success: true, result, ptsEarned });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// FORMULA SHEET BOOKMARKS — cross-device sync
// GET  /api/user/formula-bookmarks  → fetch saved bookmark IDs
// POST /api/user/formula-bookmarks  → replace entire bookmark list
// ─────────────────────────────────────────────────────────────
router.get('/formula-bookmarks', authenticate, async (req: any, res) => {
  try {
    const user = await User.findById(req.userId).select('formulaBookmarks').lean() as any;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, bookmarks: user.formulaBookmarks || [] });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/formula-bookmarks', authenticate, async (req: any, res) => {
  try {
    const { bookmarks } = req.body;
    if (!Array.isArray(bookmarks)) {
      return res.status(400).json({ success: false, message: 'bookmarks must be an array' });
    }
    // Sanitize: only strings, max 500 bookmarks
    const clean = bookmarks.filter((b: any) => typeof b === 'string').slice(0, 500);
    await User.findByIdAndUpdate(req.userId, { formulaBookmarks: clean });
    res.json({ success: true, count: clean.length });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/user/complete-onboarding
// Marks onboarding tour as done in DB — persists across devices & refreshes
// ─────────────────────────────────────────────────────────────
router.post('/complete-onboarding', authenticate, async (req: any, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { onboardingCompleted: true });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;