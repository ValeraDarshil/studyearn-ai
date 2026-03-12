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

// ─────────────────────────────────────────────────────────────
// AUTH MIDDLEWARE
// ─────────────────────────────────────────────────────────────
async function authenticate(req: any, res: any, next: any) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
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
// ACHIEVEMENT DEFINITIONS — keep in sync with src/data/achievements.ts
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
    if (typeof points !== 'number' || points <= 0)
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
    await Activity.create({ userId: req.userId, action, details, pointsEarned: pointsEarned || 0 });
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

    const today     = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const lastDate  = user.lastActive ? new Date(user.lastActive).toISOString().split('T')[0] : null;

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

    const statValue = (user[achDef.stat] || 0) as number;
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

    const todayKey = new Date().toISOString().split('T')[0];
    const dc = user.dailyChallenge || {};

    const challenge = dc.date === todayKey ? (dc.challenge || null) : null;
    const result    = dc.date === todayKey ? (dc.result    || null) : null;

    // Build past 7 days history map from challengeHistory array
    const history: Record<string, { completed: boolean; correct: boolean }> = {};
    const histArr: any[] = user.challengeHistory || [];
    // Also include today if completed
    if (result?.completed) {
      history[todayKey] = { completed: true, correct: !!result.correct };
    }
    for (const h of histArr) {
      if (h.date) history[h.date] = { completed: !!h.completed, correct: !!h.correct };
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
    const todayKey = new Date().toISOString().split('T')[0];
    const user = await User.findById(req.userId).lean() as any;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // If already generated today, return existing (idempotent)
    const dc = user.dailyChallenge || {};
    if (dc.date === todayKey && dc.challenge) {
      return res.json({ success: true, challenge: dc.challenge, cached: true });
    }

    const { subject, topic, pts } = req.body;
    if (!subject || !topic) return res.status(400).json({ success: false, message: 'subject and topic required' });

    const prompt = `Generate 1 challenging MCQ about ${topic} for Indian students preparing for competitive exams.

Format EXACTLY:
[question text - make it genuinely challenging and interesting]
A) [option]
B) [option]
C) [option]
D) [option]
Answer: [A/B/C/D]
Explanation: [clear 1-2 sentence explanation of why the answer is correct]

Make the question thought-provoking, not trivial.`;

    const raw = await solveText(prompt, []);

    // Parse MCQ
    const lines = raw.split('\n').map((l: string) => l.trim()).filter(Boolean);
    const qLine = lines[0] || '';
    const opts  = ['A','B','C','D'].map(l => {
      const found = lines.find((ln: string) => ln.match(new RegExp(`^${l}[)\.]\s`)));
      return found ? found.replace(/^[A-D][).]\s*/, '') : '';
    });
    const ansLine = lines.find((l: string) => l.toLowerCase().startsWith('answer:')) || '';
    const ansLetter = ansLine.replace(/answer:\s*/i, '').trim().toUpperCase().charAt(0);
    const ansIdx = ['A','B','C','D'].indexOf(ansLetter);
    const expLine = lines.find((l: string) => l.toLowerCase().startsWith('explanation:')) || '';
    const explanation = expLine.replace(/explanation:\s*/i, '').trim();

    if (!qLine || opts.some((o: string) => !o) || ansIdx === -1) {
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
    const todayKey = new Date().toISOString().split('T')[0];

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

export default router;