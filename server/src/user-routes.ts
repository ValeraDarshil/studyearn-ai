// import express from 'express';
// import jwt from 'jsonwebtoken';
// import { User } from './models/User.model';
// import { Activity } from './models/Activity.model';
// import { connectDB } from './db';

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
//     const { name, email } = req.body;

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
//     await user.save();

//     res.json({ 
//       success: true, 
//       user: {
//         name: user.name,
//         email: user.email,
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

import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from './models/User.model.js';
import { Activity } from './models/Activity.model.js';
import { connectDB } from './db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Middleware to verify token
async function authenticate(req: any, res: any, next: any) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

// ── ADD POINTS ───────────────────────────────────────────────────────────────
router.post('/add-points', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { points } = req.body;
    if (typeof points !== 'number' || points <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid points value' });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.points += points;
    await user.save();
    res.json({ success: true, points: user.points });
    console.log(`✅ Points added: ${user.email} +${points} → ${user.points}`);
  } catch (error) {
    console.error('Add points error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── USE QUESTION ─────────────────────────────────────────────────────────────
router.post('/use-question', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
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
    res.json({ success: true, questionsLeft: user.questionsLeft });
    console.log(`✅ Question used: ${user.email} → ${user.questionsLeft} left`);
  } catch (error) {
    console.error('Use question error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── LOG ACTIVITY ─────────────────────────────────────────────────────────────
router.post('/log-activity', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { action, details, pointsEarned } = req.body;
    await Activity.create({
      userId: req.userId,
      action,
      details,
      pointsEarned: pointsEarned || 0,
    });
    res.json({ success: true });
    console.log(`✅ Activity logged: ${action} - ${details}`);
  } catch (error) {
    console.error('Log activity error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET RECENT ACTIVITY ──────────────────────────────────────────────────────
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

// ── UPDATE PROFILE ───────────────────────────────────────────────────────────
router.post('/update-profile', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
    }

    user.name = name;
    user.email = email;
    await user.save();

    res.json({ 
      success: true, 
      user: {
        name: user.name,
        email: user.email,
      }
    });

    console.log(`✅ Profile updated: ${user.email}`);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── UPDATE STREAK ON LOGIN ───────────────────────────────────────────────────
router.post('/update-streak', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const lastActiveDate = user.lastActive ? new Date(user.lastActive).toISOString().split('T')[0] : null;

    let streakIncreased = false;
    
    if (lastActiveDate === today) {
      // Already logged in today, no change
      return res.json({ 
        success: true, 
        streak: user.streak,
        streakIncreased: false
      });
    } else if (lastActiveDate === yesterday) {
      // Logged in yesterday, continue streak
      user.streak += 1;
      streakIncreased = true;
    } else {
      // ✅ Streak broken - RESET TO 1 (not 0)
      user.streak = 1;
      streakIncreased = false;
    }

    user.lastActive = new Date();
    await user.save();

    res.json({ 
      success: true, 
      streak: user.streak,
      streakIncreased,
      isNewStreak: !lastActiveDate || lastActiveDate !== yesterday
    });

    console.log(`✅ Streak updated: ${user.email} → ${user.streak} days`);
  } catch (error) {
    console.error('Update streak error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GENERATE REFERRAL CODE ──────────────────────────────────────────────────
function generateReferralCode(name: string, userId: string): string {
  const namePart = name.substring(0, 3).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const idPart = userId.substring(userId.length - 3).toUpperCase();
  return `${namePart}${randomPart}${idPart}`;
}

// ── GET REFERRAL DATA ───────────────────────────────────────────────────────
router.get('/referral-data', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate referral code if doesn't exist
    if (!user.referralCode) {
      user.referralCode = generateReferralCode(user.name, user._id.toString());
      await user.save();
    }

    // Find all users referred by this user
    const referredUsers = await User.find({ referredBy: user.referralCode })
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const referredUsersFormatted = referredUsers.map(u => ({
      name: u.name,
      email: u.email,
      joinedAt: u.createdAt,
    }));

    res.json({
      success: true,
      referralCode: user.referralCode,
      referredUsers: referredUsersFormatted,
      totalReferrals: referredUsers.length,
      totalEarned: referredUsers.length * 100,
    });

    console.log(`✅ Referral data fetched: ${user.email} - ${referredUsers.length} referrals`);
  } catch (error) {
    console.error('Get referral data error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
