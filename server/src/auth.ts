import express from 'express';

import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import { User } from './models/User.model.js';

import { Activity } from './models/Activity.model.js';

import { connectDB } from './config/db.js';

import { authLimiter } from './middleware/rateLimiter.js';

import { validateSignup, validateLogin } from './middleware/validate.js';
import { otpLimiter } from './middleware/rateLimiter.js';
import { sendOTPEmail } from './services/emailService.js';
import crypto from 'crypto';



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



    // Check daily reset — premium users get 15/day, free users get 5/day

    const today = new Date().toISOString().split('T')[0];

    const isPremiumNow = (user as any).isPremium === true

      && (user as any).premiumExpiresAt

      && new Date((user as any).premiumExpiresAt) > new Date();

    const dailyLimit = isPremiumNow ? 10 : 5;



    if (user.questionsDate !== today) {

      user.questionsLeft = dailyLimit;

      user.questionsDate = today;

      await user.save();

    } else if (isPremiumNow && user.questionsLeft < 10 && user.questionsLeft === 5) {

      // Edge case: user just bought premium today — upgrade their quota immediately

      user.questionsLeft = 10;

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

      console.log(`✅ XP migrated for ${user.email}: totalXP = ${user.points}`);

    }



    // ── Auto-expire premium if past expiry date ──

    if ((user as any).isPremium && (user as any).premiumExpiresAt) {

      if (new Date((user as any).premiumExpiresAt) < new Date()) {

        (user as any).isPremium        = false;

        (user as any).premiumExpiresAt = null;

        console.info(`Premium auto-expired for ${user.email}`);

      }

    }

    const isPremiumActive = (user as any).isPremium === true;

    const dailyLimit = isPremiumActive ? 10 : 5;



    // ── Fix questionsLeft if premium just activated ──

    const meToday = new Date().toISOString().split('T')[0];

    if (user.questionsDate !== meToday) {

      user.questionsLeft = dailyLimit;

      user.questionsDate = meToday;

    } else if (isPremiumActive && user.questionsLeft <= 5 && user.questionsLeft === 5) {

      // Premium just bought today — bump their quota

      user.questionsLeft = 10;

    }



    // ── Check streak on /me — ensures animation works on any device/browser ──

    // Yeh important hai kyunki agar user direct URL pe aaye (na ki login page se)

    // toh sessionStorage nahi hoga — /me se fresh streak state milti hai

    const today     = new Date().toISOString().split('T')[0];

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const lastDate  = user.lastActive ? new Date(user.lastActive).toISOString().split('T')[0] : null;

    let streakIncreased = false;

    let bonusPoints = 0;



    if (lastDate !== today) {

      // Day change hua hai — streak update karo

      bonusPoints = 10;

      if (lastDate === yesterday) {

        user.streak   += 1;

        streakIncreased = true;

        if (user.streak === 7)  bonusPoints = 50;

        else if (user.streak === 14) bonusPoints = 100;

        else if (user.streak === 30) bonusPoints = 250;

        else if (user.streak > 30 && user.streak % 7 === 0) bonusPoints = 75;

      } else if (lastDate !== today) {

        user.streak = 1; // reset

      }

      user.points    += bonusPoints;

      (user as any).totalXP = ((user as any).totalXP || 0) + bonusPoints;

      user.lastActive = new Date();

    }



    // Single save for all mutations above

    await user.save();



    res.json({

      success: true,

      user,

      // Frontend uses this to show streak animation on ANY device

      streakInfo: streakIncreased ? {

        streakIncreased: true,

        currentStreak: user.streak,

        bonusPoints,

      } : null,

    });

  } catch (error) {

    res.status(401).json({ success: false, message: 'Invalid token' });

  }

});



// ─────────────────────────────────────────────────────────────

// POST /api/auth/forgot-password — OTP email bhejo

// ─────────────────────────────────────────────────────────────

router.post('/forgot-password', otpLimiter, async (req, res) => {

  try {

    await connectDB();

    const { email } = req.body;

    if (!email) return res.status(400).json({ success: false, message: 'Email required' });



    const user = await User.findOne({ email: email.toLowerCase().trim() });



    // Always return success — don't reveal if email exists (security)

    if (!user) {

      return res.json({ success: true, message: 'If this email is registered, an OTP has been sent.' });

    }



    // Generate 6-digit OTP

    const otp = String(Math.floor(100000 + Math.random() * 900000));



    // Hash OTP before storing (never store plain OTP)

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');



    // Store hashed OTP + expiry (10 min) + reset attempts

    (user as any).resetOtp          = hashedOtp;

    (user as any).resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    (user as any).resetOtpAttempts  = 0;

    await user.save();



    // Send OTP email

    const sent = await sendOTPEmail(user.email, user.name, otp);

    if (!sent) {

      return res.status(500).json({ success: false, message: 'Failed to send OTP email. Please try again.' });

    }



    console.log(`✅ OTP sent to ${user.email}`);

    res.json({ success: true, message: 'OTP sent to your email. Check your inbox (and spam folder).' });

  } catch (err: any) {

    console.error('Forgot password error:', err.message);

    res.status(500).json({ success: false, message: 'Server error. Please try again.' });

  }

});



// ─────────────────────────────────────────────────────────────

// POST /api/auth/verify-otp — OTP verify karo (without resetting yet)

// Frontend uses this to confirm OTP before showing new password field

// ─────────────────────────────────────────────────────────────

router.post('/verify-otp', async (req, res) => {

  try {

    await connectDB();

    const { email, otp } = req.body;

    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP required' });



    const user = await User.findOne({ email: email.toLowerCase().trim() }) as any;

    if (!user || !user.resetOtp) {

      return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Request a new one.' });

    }



    // Expired?

    if (new Date(user.resetOtpExpiresAt) < new Date()) {

      user.resetOtp = null; user.resetOtpExpiresAt = null; user.resetOtpAttempts = 0;

      await user.save();

      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });

    }



    // Too many wrong attempts?

    if (user.resetOtpAttempts >= 5) {

      user.resetOtp = null; user.resetOtpExpiresAt = null; user.resetOtpAttempts = 0;

      await user.save();

      return res.status(400).json({ success: false, message: 'Too many wrong attempts. Please request a new OTP.' });

    }



    // Check OTP

    const hashedInput = crypto.createHash('sha256').update(otp.trim()).digest('hex');

    if (hashedInput !== user.resetOtp) {

      user.resetOtpAttempts += 1;

      await user.save();

      const left = 5 - user.resetOtpAttempts;

      return res.status(400).json({ success: false, message: `Wrong OTP. ${left} attempt${left === 1 ? '' : 's'} left.` });

    }



    // ✅ OTP correct — return a short-lived reset token (5 min)

    // We keep resetOtp in DB until password is actually reset

    const resetToken = jwt.sign(

      { userId: user._id.toString(), purpose: 'reset_password' },

      process.env.JWT_SECRET!,

      { expiresIn: '5m' }

    );



    res.json({ success: true, resetToken, message: 'OTP verified. You can now set a new password.' });

  } catch (err: any) {

    console.error('Verify OTP error:', err.message);

    res.status(500).json({ success: false, message: 'Server error. Please try again.' });

  }

});



// ─────────────────────────────────────────────────────────────

// POST /api/auth/reset-password — Naya password set karo

// ─────────────────────────────────────────────────────────────

router.post('/reset-password', async (req, res) => {

  try {

    await connectDB();

    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {

      return res.status(400).json({ success: false, message: 'Reset token and new password required' });

    }

    if (newPassword.length < 6) {

      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    }



    // Verify reset token

    let decoded: any;

    try {

      decoded = jwt.verify(resetToken, process.env.JWT_SECRET!);

    } catch {

      return res.status(400).json({ success: false, message: 'Reset session expired. Please request a new OTP.' });

    }



    if (decoded.purpose !== 'reset_password') {

      return res.status(400).json({ success: false, message: 'Invalid reset token.' });

    }



    const user = await User.findById(decoded.userId) as any;

    if (!user || !user.resetOtp) {

      return res.status(400).json({ success: false, message: 'Reset session expired. Please request a new OTP.' });

    }



    // Hash new password and save

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password          = hashedPassword;

    user.resetOtp          = null;

    user.resetOtpExpiresAt = null;

    user.resetOtpAttempts  = 0;

    await user.save();



    console.log(`✅ Password reset: ${user.email}`);

    res.json({ success: true, message: 'Password reset successfully! You can now login with your new password.' });

  } catch (err: any) {

    console.error('Reset password error:', err.message);

    res.status(500).json({ success: false, message: 'Server error. Please try again.' });

  }

});



export default router;