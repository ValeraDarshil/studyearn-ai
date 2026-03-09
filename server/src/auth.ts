// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { User } from './models/User.model.js';
// import { Activity } from './models/Activity.model.js';
// import { connectDB } from './db.js';
// import { authLimiter } from './middleware/rateLimiter.js';
// import { validateSignup, validateLogin } from './middleware/validate.js';

// const router = express.Router();

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
// const JWT_EXPIRES = '7d';

// // ── GENERATE REFERRAL CODE ──────────────────────────────────────────────────
// function generateReferralCode(name: string, userId: string): string {
//   const namePart = name.substring(0, 3).toUpperCase();
//   const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
//   const idPart = userId.substring(userId.length - 3).toUpperCase();
//   return `${namePart}${randomPart}${idPart}`;
// }

// // ── GET DEFAULT REFERRER (First user ever created) ──────────────────────────
// async function getDefaultReferrer() {
//   try {
//     // Find the very first user (oldest createdAt)
//     const firstUser = await User.findOne()
//       .sort({ createdAt: 1 })
//       .select('_id referralCode name')
//       .limit(1)
//       .lean();
    
//     return firstUser;
//   } catch (error) {
//     console.error('Get default referrer error:', error);
//     return null;
//   }
// }

// // ── SIGNUP ───────────────────────────────────────────────────────────────────
// router.post('/signup', authLimiter, validateSignup, async (req, res) => {
//   try {
//     await connectDB();
    
//     const { name, email, password, referralCode } = req.body;

//     // Validate
//     if (!name || !email || !password) {
//       return res.status(400).json({ success: false, message: 'All fields required' });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({ success: false, message: 'Password must be 6+ characters' });
//     }

//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: 'Email already registered' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     let welcomeBonus = 100;
//     let referrerUser = null;
//     let isDefaultReferral = false;

//     // ✅ CHECK REFERRAL CODE (User provided)
//     if (referralCode && referralCode.trim()) {
//       referrerUser = await User.findOne({ referralCode: referralCode.toUpperCase().trim() });
//       if (referrerUser) {
//         welcomeBonus = 200; // 100 base + 100 bonus for using code
        
//         // Give bonus to referrer
//         referrerUser.points += 100;
//         await referrerUser.save();
        
//         // Log activity for referrer
//         await Activity.create({
//           userId: referrerUser._id,
//           action: 'referral',
//           details: `Referred ${name}`,
//           pointsEarned: 100,
//         });

//         console.log(`✅ Referral: ${referrerUser.email} earned 100 pts for referring ${email}`);
//       }
//     } 
//     // ✅ NO REFERRAL CODE - Auto-assign to first user (admin)
//     else {
//       const defaultReferrer = await getDefaultReferrer();
      
//       // Only assign if this is NOT the first user
//       if (defaultReferrer) {
//         referrerUser = await User.findById(defaultReferrer._id);
//         if (referrerUser) {
//           isDefaultReferral = true;
//           welcomeBonus = 100; // ✅ ONLY 100 pts (no bonus for auto-referral)
          
//           // Give bonus to admin (default referrer)
//           referrerUser.points += 100;
//           await referrerUser.save();
          
//           // Log activity for admin
//           await Activity.create({
//             userId: referrerUser._id,
//             action: 'referral',
//             details: `Auto-referred ${name}`,
//             pointsEarned: 100,
//           });

//           console.log(`✅ Auto-Referral: ${referrerUser.email} earned 100 pts (default referrer)`);
//         }
//       }
//     }

//     // ✅ Create user with STREAK = 1 (not 0)
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       points: welcomeBonus,
//       streak: 1, // ✅ START AT 1, NOT 0
//       referredBy: referrerUser ? referrerUser.referralCode : null,
//     });

//     // Generate referral code for new user
//     user.referralCode = generateReferralCode(user.name, user._id.toString());
//     await user.save();

//     // Log signup activity
//     await Activity.create({
//       userId: user._id,
//       action: 'signup',
//       details: isDefaultReferral 
//         ? 'Account created (auto-referred)' 
//         : referrerUser 
//           ? `Signed up via referral (${referralCode})` 
//           : 'Account created',
//       pointsEarned: welcomeBonus,
//     });

//     // Generate token
//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

//     // NO CACHE HEADERS
//     res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//     res.setHeader('Pragma', 'no-cache');
//     res.setHeader('Expires', '0');

//     res.json({
//       success: true,
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         points: user.points,
//         questionsLeft: user.questionsLeft,
//         streak: user.streak, // Will be 1
//       },
//       referralBonus: !isDefaultReferral && !!referrerUser, // Only true for manual referral
//     });

//     console.log(`✅ Signup: ${email} - ${welcomeBonus} pts - Streak: 1`);
//   } catch (error: any) {
//     console.error('Signup error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // ── LOGIN ────────────────────────────────────────────────────────────────────
// router.post('/login', authLimiter, validateLogin, async (req, res) => {
//   try {
//     await connectDB();
    
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: 'Email and password required' });
//     }

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ success: false, message: 'Invalid credentials' });
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: 'Invalid credentials' });
//     }

//     // Check daily reset
//     const today = new Date().toISOString().split('T')[0];
//     if (user.questionsDate !== today) {
//       user.questionsLeft = 5;
//       user.questionsDate = today;
//       await user.save();
//     }

//     // Log login
//     await Activity.create({
//       userId: user._id,
//       action: 'login',
//       details: 'Logged in',
//       pointsEarned: 0,
//     });

//     // Generate token
//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

//     // NO CACHE HEADERS
//     res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//     res.setHeader('Pragma', 'no-cache');
//     res.setHeader('Expires', '0');

//     res.json({
//       success: true,
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         points: user.points,
//         questionsLeft: user.questionsLeft,
//         streak: user.streak,
//       },
//     });

//     console.log(`✅ Login: ${email} (ID: ${user._id})`);
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // ── VERIFY TOKEN (get user data) ─────────────────────────────────────────────
// router.get('/me', async (req, res) => {
//   try {
//     await connectDB();
    
//     const token = req.headers.authorization?.replace('Bearer ', '');
//     if (!token) {
//       return res.status(401).json({ success: false, message: 'No token provided' });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
//     const user = await User.findById(decoded.userId).select('-password');
    
//     if (!user) {
//       return res.status(401).json({ success: false, message: 'User not found' });
//     }

//     // NO CACHE HEADERS
//     res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//     res.setHeader('Pragma', 'no-cache');
//     res.setHeader('Expires', '0');

//     res.json({ success: true, user });
//   } catch (error) {
//     res.status(401).json({ success: false, message: 'Invalid token' });
//   }
// });

// export default router;

// Clear Version //

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './models/User.model.js';
import { Activity } from './models/Activity.model.js';
import { connectDB } from './config/db.js';
import { authLimiter } from './middleware/rateLimiter.js';
import { validateSignup, validateLogin } from './middleware/validate.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES = '7d';

// ─────────────────────────────────────────────────────────────
// HELPER — Auto update streak + award daily login bonus
// Called on every successful login automatically
// ─────────────────────────────────────────────────────────────
async function updateStreakOnLogin(user: any): Promise<{ streak: number; streakIncreased: boolean; bonusPoints: number }> {
  const today     = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const lastDate  = user.lastActive ? new Date(user.lastActive).toISOString().split('T')[0] : null;

  // Already logged in today — skip
  if (lastDate === today) {
    return { streak: user.streak, streakIncreased: false, bonusPoints: 0 };
  }

  let streakIncreased = false;
  let bonusPoints     = 10; // Base daily login bonus (every day)

  if (lastDate === yesterday) {
    user.streak    += 1;
    streakIncreased = true;
    // Milestone bonuses
    if (user.streak === 7)                        bonusPoints = 50;  // 🔥 1 week
    else if (user.streak === 14)                  bonusPoints = 100; // 💪 2 weeks
    else if (user.streak === 30)                  bonusPoints = 250; // 🏆 1 month
    else if (user.streak > 30 && user.streak % 7 === 0) bonusPoints = 75;  // every week after
  } else {
    user.streak = 1; // Broken — reset to 1 (never 0)
  }

  user.points    += bonusPoints;
  user.lastActive = new Date();
  await user.save();

  await Activity.create({
    userId:       user._id,
    action:       'daily_login',
    details:      streakIncreased ? `Day ${user.streak} streak! 🔥` : 'Daily login bonus',
    pointsEarned: bonusPoints,
  });

  console.log(`✅ Streak: ${user.email} → ${user.streak} days (+${bonusPoints} pts)`);
  return { streak: user.streak, streakIncreased, bonusPoints };
}

// ── GENERATE REFERRAL CODE ──────────────────────────────────────────────────
function generateReferralCode(name: string, userId: string): string {
  const namePart = name.substring(0, 3).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const idPart = userId.substring(userId.length - 3).toUpperCase();
  return `${namePart}${randomPart}${idPart}`;
}

// ── GET DEFAULT REFERRER (First user ever created) ──────────────────────────
async function getDefaultReferrer() {
  try {
    // Find the very first user (oldest createdAt)
    const firstUser = await User.findOne()
      .sort({ createdAt: 1 })
      .select('_id referralCode name')
      .limit(1)
      .lean();
    
    return firstUser;
  } catch (error) {
    console.error('Get default referrer error:', error);
    return null;
  }
}

// ── SIGNUP ───────────────────────────────────────────────────────────────────
router.post('/signup', authLimiter, validateSignup, async (req, res) => {
  try {
    await connectDB();
    
    const { name, email, password, referralCode } = req.body;

    // Validate
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be 6+ characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let welcomeBonus = 100;
    let referrerUser = null;
    let isDefaultReferral = false;

    // ✅ CHECK REFERRAL CODE (User provided)
    if (referralCode && referralCode.trim()) {
      referrerUser = await User.findOne({ referralCode: referralCode.toUpperCase().trim() });
      if (referrerUser) {
        welcomeBonus = 200; // 100 base + 100 bonus for using code
        
        // Give bonus to referrer
        referrerUser.points += 100;
        await referrerUser.save();
        
        // Log activity for referrer
        await Activity.create({
          userId: referrerUser._id,
          action: 'referral',
          details: `Referred ${name}`,
          pointsEarned: 100,
        });

        console.log(`✅ Referral: ${referrerUser.email} earned 100 pts for referring ${email}`);
      }
    } 
    // ✅ NO REFERRAL CODE - Auto-assign to first user (admin)
    else {
      const defaultReferrer = await getDefaultReferrer();
      
      // Only assign if this is NOT the first user
      if (defaultReferrer) {
        referrerUser = await User.findById(defaultReferrer._id);
        if (referrerUser) {
          isDefaultReferral = true;
          welcomeBonus = 100; // ✅ ONLY 100 pts (no bonus for auto-referral)
          
          // Give bonus to admin (default referrer)
          referrerUser.points += 100;
          await referrerUser.save();
          
          // Log activity for admin
          await Activity.create({
            userId: referrerUser._id,
            action: 'referral',
            details: `Auto-referred ${name}`,
            pointsEarned: 100,
          });

          console.log(`✅ Auto-Referral: ${referrerUser.email} earned 100 pts (default referrer)`);
        }
      }
    }

    // ✅ Create user with STREAK = 1 (not 0)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      points: welcomeBonus,
      streak: 1, // ✅ START AT 1, NOT 0
      referredBy: referrerUser ? referrerUser.referralCode : null,
    });

    // Generate referral code for new user
    user.referralCode = generateReferralCode(user.name, user._id.toString());
    await user.save();

    // Log signup activity
    await Activity.create({
      userId: user._id,
      action: 'signup',
      details: isDefaultReferral 
        ? 'Account created (auto-referred)' 
        : referrerUser 
          ? `Signed up via referral (${referralCode})` 
          : 'Account created',
      pointsEarned: welcomeBonus,
    });

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    // NO CACHE HEADERS
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        totalXP: (user as any).totalXP || user.points,
        questionsLeft: user.questionsLeft,
        streak: user.streak, // Will be 1
      },
      referralBonus: !isDefaultReferral && !!referrerUser, // Only true for manual referral
    });

    console.log(`✅ Signup: ${email} - ${welcomeBonus} pts - Streak: 1`);
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── LOGIN ────────────────────────────────────────────────────────────────────
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  try {
    await connectDB();
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check daily reset
    const today = new Date().toISOString().split('T')[0];
    if (user.questionsDate !== today) {
      user.questionsLeft = 5;
      user.questionsDate = today;
      await user.save();
    }

    // ── Auto-update streak + award daily login bonus ──────────
    const { streak, streakIncreased, bonusPoints } = await updateStreakOnLogin(user);

    // Log login activity
    await Activity.create({
      userId:       user._id,
      action:       'login',
      details:      'Logged in',
      pointsEarned: 0,
    });

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.json({
      success: true,
      token,
      user: {
        _id:           user._id,
        name:          user.name,
        email:         user.email,
        points:        user.points,      // Already updated with bonus
        totalXP:       (user as any).totalXP || user.points,
        questionsLeft: user.questionsLeft,
        streak,
        isPremium:        (user as any).isPremium || false,
        premiumExpiresAt: (user as any).premiumExpiresAt || null,
      },
      // Frontend can use these to show a celebration toast
      streakInfo: {
        streakIncreased,
        bonusPoints,
        currentStreak: streak,
      },
    });

    console.log(`✅ Login: ${user.email} | streak=${streak} | bonus=+${bonusPoints}pts`);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── VERIFY TOKEN (get user data) ─────────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    await connectDB();
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // NO CACHE HEADERS
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // ── Auto-migrate: seed totalXP for existing users ──
    if (!(user as any).totalXP && user.points > 0) {
      (user as any).totalXP = user.points;
      await user.save();
      console.log(`✅ XP migrated for ${user.email}: totalXP = ${user.points}`);
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

export default router;