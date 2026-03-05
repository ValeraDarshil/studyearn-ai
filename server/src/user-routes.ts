// import express from 'express';
// import jwt from 'jsonwebtoken';
// import { User } from './models/User.model.js';
// import { Activity } from './models/Activity.model.js';
// import { connectDB } from './db.js';

// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// // Middleware to verify token
// async function authenticate(req: any, res: any, next: any) {
//   try {
//     const token = req.headers.authorization?.replace('Bearer ', '');
//     if (!token) {
//       return res.status(401).json({ success: false, message: 'No token provided' });
//     }
//     const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     res.status(401).json({ success: false, message: 'Invalid token' });
//   }
// }

// // ── ADD POINTS ───────────────────────────────────────────────────────────────
// router.post('/add-points', authenticate, async (req: any, res) => {
//   try {
//     await connectDB();
//     const { points } = req.body;
//     if (typeof points !== 'number' || points <= 0) {
//       return res.status(400).json({ success: false, message: 'Invalid points value' });
//     }
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
//     user.points += points;
//     await user.save();
//     res.json({ success: true, points: user.points });
//     console.log(`✅ Points added: ${user.email} +${points} → ${user.points}`);
//   } catch (error) {
//     console.error('Add points error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // ── USE QUESTION ─────────────────────────────────────────────────────────────
// router.post('/use-question', authenticate, async (req: any, res) => {
//   try {
//     await connectDB();
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
//     const today = new Date().toISOString().split('T')[0];
//     if (user.questionsDate !== today) {
//       user.questionsLeft = 5;
//       user.questionsDate = today;
//     }
//     if (user.questionsLeft <= 0) {
//       return res.json({ success: false, message: 'No questions left today', questionsLeft: 0 });
//     }
//     user.questionsLeft -= 1;
//     await user.save();
//     res.json({ success: true, questionsLeft: user.questionsLeft });
//     console.log(`✅ Question used: ${user.email} → ${user.questionsLeft} left`);
//   } catch (error) {
//     console.error('Use question error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // ── LOG ACTIVITY ─────────────────────────────────────────────────────────────
// router.post('/log-activity', authenticate, async (req: any, res) => {
//   try {
//     await connectDB();
//     const { action, details, pointsEarned } = req.body;
//     await Activity.create({
//       userId: req.userId,
//       action,
//       details,
//       pointsEarned: pointsEarned || 0,
//     });
//     res.json({ success: true });
//     console.log(`✅ Activity logged: ${action} - ${details}`);
//   } catch (error) {
//     console.error('Log activity error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // ── GET RECENT ACTIVITY ──────────────────────────────────────────────────────
// router.get('/activity', authenticate, async (req: any, res) => {
//   try {
//     await connectDB();
//     const activities = await Activity.find({ userId: req.userId })
//       .sort({ timestamp: -1 })
//       .limit(10)
//       .lean();
//     res.json({ success: true, activities });
//   } catch (error) {
//     console.error('Get activity error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // ── UPDATE PROFILE ───────────────────────────────────────────────────────────
// router.post('/update-profile', authenticate, async (req: any, res) => {
//   try {
//     await connectDB();
//     const { name, email, avatar } = req.body;

//     if (!name || !email) {
//       return res.status(400).json({ success: false, message: 'Name and email required' });
//     }

//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     if (email !== user.email) {
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ success: false, message: 'Email already in use' });
//       }
//     }

//     user.name = name;
//     user.email = email;
//     if (avatar !== undefined) (user as any).avatar = avatar;
//     await user.save();

//     res.json({ 
//       success: true, 
//       user: {
//         name: user.name,
//         email: user.email,
//         avatar: (user as any).avatar ?? null,
//       }
//     });

//     console.log(`✅ Profile updated: ${user.email}`);
//   } catch (error) {
//     console.error('Update profile error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // ── UPDATE STREAK ON LOGIN ───────────────────────────────────────────────────
// router.post('/update-streak', authenticate, async (req: any, res) => {
//   try {
//     await connectDB();
    
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const today = new Date().toISOString().split('T')[0];
//     const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
//     const lastActiveDate = user.lastActive ? new Date(user.lastActive).toISOString().split('T')[0] : null;

//     let streakIncreased = false;
    
//     if (lastActiveDate === today) {
//       // Already logged in today, no change
//       return res.json({ 
//         success: true, 
//         streak: user.streak,
//         streakIncreased: false
//       });
//     } else if (lastActiveDate === yesterday) {
//       // Logged in yesterday, continue streak
//       user.streak += 1;
//       streakIncreased = true;
//     } else {
//       // ✅ Streak broken - RESET TO 1 (not 0)
//       user.streak = 1;
//       streakIncreased = false;
//     }

//     user.lastActive = new Date();
//     await user.save();

//     res.json({ 
//       success: true, 
//       streak: user.streak,
//       streakIncreased,
//       isNewStreak: !lastActiveDate || lastActiveDate !== yesterday
//     });

//     console.log(`✅ Streak updated: ${user.email} → ${user.streak} days`);
//   } catch (error) {
//     console.error('Update streak error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // ── GENERATE REFERRAL CODE ──────────────────────────────────────────────────
// function generateReferralCode(name: string, userId: string): string {
//   const namePart = name.substring(0, 3).toUpperCase();
//   const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
//   const idPart = userId.substring(userId.length - 3).toUpperCase();
//   return `${namePart}${randomPart}${idPart}`;
// }

// // ── GET REFERRAL DATA ───────────────────────────────────────────────────────
// router.get('/referral-data', authenticate, async (req: any, res) => {
//   try {
//     await connectDB();
    
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     // Generate referral code if doesn't exist
//     if (!user.referralCode) {
//       user.referralCode = generateReferralCode(user.name, user._id.toString());
//       await user.save();
//     }

//     // Find all users referred by this user
//     const referredUsers = await User.find({ referredBy: user.referralCode })
//       .select('name email createdAt')
//       .sort({ createdAt: -1 })
//       .lean();

//     const referredUsersFormatted = referredUsers.map(u => ({
//       name: u.name,
//       email: u.email,
//       joinedAt: u.createdAt,
//     }));

//     res.json({
//       success: true,
//       referralCode: user.referralCode,
//       referredUsers: referredUsersFormatted,
//       totalReferrals: referredUsers.length,
//       totalEarned: referredUsers.length * 100,
//     });

//     console.log(`✅ Referral data fetched: ${user.email} - ${referredUsers.length} referrals`);
//   } catch (error) {
//     console.error('Get referral data error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// export default router;

// // ── GET ACHIEVEMENTS ──────────────────────────────────────────────────────────
// router.get('/achievements', authenticate, async (req: any, res) => {
//   try {
//     await connectDB();
//     const user = await User.findById(req.userId).lean() as any;
//     if (!user) return res.status(404).json({ success: false, message: 'User not found' });

//     res.json({
//       success: true,
//       unlockedAchievements: user.unlockedAchievements || [],
//       totalQuestionsAsked: user.totalQuestionsAsked || 0,
//       totalPPTsGenerated: user.totalPPTsGenerated || 0,
//       totalPDFsConverted: user.totalPDFsConverted || 0,
//     });
//   } catch (error) {
//     console.error('Get achievements error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // ── UNLOCK ACHIEVEMENT ────────────────────────────────────────────────────────
// router.post('/unlock-achievement', authenticate, async (req: any, res) => {
//   try {
//     await connectDB();
//     const { achievementId } = req.body;
//     if (!achievementId) return res.status(400).json({ success: false, message: 'achievementId required' });

//     const user = await User.findById(req.userId) as any;
//     if (!user) return res.status(404).json({ success: false, message: 'User not found' });

//     if (!user.unlockedAchievements.includes(achievementId)) {
//       user.unlockedAchievements.push(achievementId);
//       await user.save();
//       console.log(`🏆 Achievement unlocked: ${user.email} → ${achievementId}`);
//     }

//     res.json({ success: true, unlockedAchievements: user.unlockedAchievements });
//   } catch (error) {
//     console.error('Unlock achievement error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // ── INCREMENT ACTION COUNT (questions/ppts/pdfs) ──────────────────────────────
// router.post('/increment-action', authenticate, async (req: any, res) => {
//   try {
//     await connectDB();
//     const { action } = req.body; // 'question' | 'ppt' | 'pdf'

//     const user = await User.findById(req.userId) as any;
//     if (!user) return res.status(404).json({ success: false, message: 'User not found' });

//     if (action === 'question') user.totalQuestionsAsked = (user.totalQuestionsAsked || 0) + 1;
//     if (action === 'ppt') user.totalPPTsGenerated = (user.totalPPTsGenerated || 0) + 1;
//     if (action === 'pdf') user.totalPDFsConverted = (user.totalPDFsConverted || 0) + 1;

//     await user.save();

//     res.json({
//       success: true,
//       totalQuestionsAsked: user.totalQuestionsAsked,
//       totalPPTsGenerated: user.totalPPTsGenerated,
//       totalPDFsConverted: user.totalPDFsConverted,
//     });
//   } catch (error) {
//     console.error('Increment action error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// Clearner Version //

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
 *   POST /unlock-achievement  → Unlock a new achievement
 *   POST /increment-action    → Increment question/ppt/pdf counters
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from './models/User.model.js';
import { Activity } from './models/Activity.model.js';
import { connectDB } from './db.js';

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
router.post('/unlock-achievement', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { achievementId } = req.body;

    if (!achievementId) {
      return res.status(400).json({ success: false, message: 'achievementId required' });
    }

    const user = await User.findById(req.userId) as any;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.unlockedAchievements.includes(achievementId)) {
      user.unlockedAchievements.push(achievementId);
      await user.save();
      console.log(`🏆 Achievement unlocked: ${user.email} → ${achievementId}`);
    }

    res.json({ success: true, unlockedAchievements: user.unlockedAchievements });
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
