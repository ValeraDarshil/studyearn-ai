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
import { logger } from './utils/logger.js';
import crypto from 'crypto';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!; // kept for future use



const router = express.Router();



const JWT_SECRET = process.env.JWT_SECRET!;

const JWT_EXPIRES = '7d';
const JWT_OPTIONS = {
  algorithm: 'HS512' as const,
  issuer:    'studyearn-ai',
  audience:  'studyearn-users',
};



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

    logger.error({ err: error }, 'Get default referrer error');

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



    if (!password || password.length < 8 || !/\d/.test(password)) {
  return res.status(400).json({
    success: false,
    message: 'Password must be at least 8 characters and contain at least one number',
  });
}



    // Check if user exists

    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({ success: false, message: 'Email already registered' });

    }



    // Hash password

    const hashedPassword = await bcrypt.hash(password, 12);



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

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES, ...JWT_OPTIONS });



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




  } catch (error: any) {

    logger.error({ err: error }, 'Signup error');

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
    // Google OAuth users have no password — block email/password login for them
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'This account uses Google Sign In. Please use the "Continue with Google" button.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    }



    // Check daily reset — premium users get 15/day, free users get 5/day

    const today = new Date().toISOString().split('T')[0];

    const isPremiumNow = (user as any).isPremium === true

      && (user as any).premiumExpiresAt

      && new Date((user as any).premiumExpiresAt) > new Date();

    const dailyLimit = isPremiumNow ? 30 : 15;



    if (user.questionsDate !== today) {

      user.questionsLeft = dailyLimit;

      user.questionsDate = today;

      await user.save();

    } else if (isPremiumNow && user.questionsLeft < 30 && user.questionsLeft === 15) {

      // Edge case: user just bought premium today — upgrade their quota immediately

      user.questionsLeft = 30;

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

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES, ...JWT_OPTIONS });



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




  } catch (error) {

    logger.error({ err: error }, 'Login error');

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



    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS512'], issuer: 'studyearn-ai', audience: 'studyearn-users' }) as { userId: string };

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


    }



    // ── Auto-expire premium if past expiry date ──

    if ((user as any).isPremium && (user as any).premiumExpiresAt) {

      if (new Date((user as any).premiumExpiresAt) < new Date()) {

        (user as any).isPremium        = false;

        (user as any).premiumExpiresAt = null;

        logger.info(`Premium auto-expired for ${user.email}`);

      }

    }

    const isPremiumActive = (user as any).isPremium === true;

    const dailyLimit = isPremiumActive ? 30 : 15;



    // ── Fix questionsLeft if premium just activated ──

    const meToday = new Date().toISOString().split('T')[0];

    if (user.questionsDate !== meToday) {

      user.questionsLeft = dailyLimit;

      user.questionsDate = meToday;

    } else if (isPremiumActive && user.questionsLeft <= 15 && user.questionsLeft === 15) {

      // Premium just bought today — bump their quota

      user.questionsLeft = 30;

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




    res.json({ success: true, message: 'OTP sent to your email. Check your inbox (and spam folder).' });

  } catch (err: any) {

    logger.error({ err: err.message }, 'Forgot password error');

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

    logger.error({ err: err.message }, 'Verify OTP error');

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

      decoded = jwt.verify(resetToken, process.env.JWT_SECRET!, { algorithms: ['HS512'] });

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

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password          = hashedPassword;

    user.resetOtp          = null;

    user.resetOtpExpiresAt = null;

    user.resetOtpAttempts  = 0;

    await user.save();




    res.json({ success: true, message: 'Password reset successfully! You can now login with your new password.' });

  } catch (err: any) {

    logger.error({ err: err.message }, 'Reset password error');

    res.status(500).json({ success: false, message: 'Server error. Please try again.' });

  }

});




// ─────────────────────────────────────────────────────────────
// POST /api/auth/google — Google OAuth Sign In / Sign Up
// Frontend sends: { idToken: "google-id-token" }
// Backend verifies with Google, creates/finds user, returns JWT
// ─────────────────────────────────────────────────────────────
router.post('/google', authLimiter, async (req, res) => {
  try {
    await connectDB();

    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Google token required' });
    }

    // ── Verify Google token via userinfo endpoint ────────────
    // We use access_token (from useGoogleLogin) + userInfo sent from frontend
    // Double verification: access_token validates with Google, userInfo provides data
    let payload: any;
    const { userInfo } = req.body;

    try {
      // Verify the access token is valid by calling Google userinfo
      const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!googleRes.ok) throw new Error('Invalid token');
      payload = await googleRes.json();
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid Google token. Please try again.' });
    }

    if (!payload?.email) {
      return res.status(401).json({ success: false, message: 'Could not get email from Google account.' });
    }

    const googleId = payload.sub;
    const email    = payload.email;
    const googleName = payload.name || userInfo?.name;
    const cleanEmail = email.toLowerCase().trim();

    // ── Find existing user ────────────────────────────────────
    let user: any = await User.findOne({
      $or: [{ googleId }, { email: cleanEmail }],
    });

    let isNewUser = false;

    if (!user) {
      // ── NEW USER — create account ─────────────────────────
      isNewUser = true;
      const displayName = googleName || cleanEmail.split('@')[0];

      user = new User({
        name:         displayName,
        email:        cleanEmail,
        password:     null,       // Google users have no password
        googleId,
        points:       100,        // Welcome bonus
        totalXP:      100,
        questionsLeft: 15,
        streak:       1,
        lastActive:   new Date(),
      });

      // Generate referral code
      await user.save(); // save first to get _id
      user.referralCode = generateReferralCode(user.name, user._id.toString());
      await user.save();

      // Log signup activity
      await Activity.create({
        userId:       user._id,
        action:       'signup',
        details:      `Signed up with Google (${cleanEmail})`,
        pointsEarned: 100,
      });

    } else {
      // ── EXISTING USER — link Google ID if not already ─────
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    // ── Update streak + daily login ──────────────────────────
    // NOTE: updateStreakOnLogin() already calls user.save() internally
    // Do NOT call user.save() again here — causes Mongoose VersionError
    const streakInfo = await updateStreakOnLogin(user);

    // Log login activity (skip for new users — already logged signup)
    if (!isNewUser) {
      await Activity.create({
        userId:       user._id,
        action:       'login',
        details:      `Logged in with Google`,
        pointsEarned: streakInfo.bonusPoints,
      });
    }

    // ── Generate JWT ─────────────────────────────────────────
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES, ...JWT_OPTIONS }
    );

    // ── Premium check ─────────────────────────────────────────
    const premExp = user.premiumExpiresAt;
    const isPremium = user.isPremium === true && premExp && new Date(premExp) > new Date();
    if (user.isPremium && !isPremium) {
      user.isPremium = false;
      user.premiumExpiresAt = null;
      await user.save();
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.json({
      success:    true,
      token,
      isNewUser,
      streakInfo,
      user: {
        _id:           user._id,
        name:          user.name,
        email:         user.email,
        points:        user.points,
        totalXP:       user.totalXP || user.points,
        questionsLeft: user.questionsLeft,
        streak:        user.streak,
        isPremium:     isPremium || false,
        premiumExpiresAt: user.premiumExpiresAt || null,
        avatar:        user.avatar || null,
        googleId:      user.googleId || null,
      },
    });

  } catch (error: any) {
    logger.error({ err: error }, 'Google auth error: ' + (error?.message || String(error)));
    return res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + (error?.message || 'Unknown error'),
    });
  }
});


// ─────────────────────────────────────────────────────────────
// POST /api/auth/google/apply-referral
// Google signup ke baad referral code apply karne ke liye
// skipMode: true = auto-assign default referrer (first user = admin)
// ─────────────────────────────────────────────────────────────
router.post('/google/apply-referral', async (req: any, res) => {
  try {
    await connectDB();

    // Auth check
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const token = authHeader.split(' ')[1];
    let userId: string;
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET, { algorithms: ['HS512'], issuer: 'studyearn-ai', audience: 'studyearn-users' });
      userId = decoded.userId;
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const user = await User.findById(userId) as any;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Already has referral — don't double apply
    if (user.referredBy) {
      return res.json({ success: true, bonusPoints: 0, message: 'Already applied' });
    }

    const { referralCode, skipMode } = req.body;
    const code = (referralCode || '').trim().toUpperCase();

    let referrer: any = null;
    let bonusForUser = 0;

    if (code) {
      // ── Manual code entered ───────────────────────────────
      if (user.referralCode === code) {
        return res.status(400).json({ success: false, message: "You can't use your own referral code!" });
      }
      referrer = await User.findOne({ referralCode: code }) as any;
      if (!referrer) {
        return res.status(404).json({ success: false, message: 'Invalid referral code. Please check and try again.' });
      }
      bonusForUser = 100; // Extra 100 pts bonus for using referral code

    } else if (skipMode) {
      // ── Skip — auto assign to first user (admin/owner) ────
      referrer = await getDefaultReferrer() as any;
      bonusForUser = 0; // No bonus for user when skipping
    }

    if (!referrer) {
      return res.json({ success: true, bonusPoints: 0 });
    }

    // Apply referral
    if (bonusForUser > 0) {
      user.points  = (user.points  || 0) + bonusForUser;
      user.totalXP = (user.totalXP || 0) + bonusForUser;
    }
    user.referredBy = referrer.referralCode || code;
    await user.save();

    // ✅ Give +100 pts to referrer (THIS is the fix — was missing before)
    referrer.points  = (referrer.points  || 0) + 100;
    referrer.totalXP = (referrer.totalXP || 0) + 100;
    await referrer.save();

    // Log activity for referrer
    await Activity.create({
      userId:       referrer._id,
      action:       'referral',
      details:      `${user.name} joined via Google ${code ? '(referral code)' : '(auto-referral)'}`,
      pointsEarned: 100,
    });

    // Log activity for user if they got bonus
    if (bonusForUser > 0) {
      await Activity.create({
        userId:       user._id,
        action:       'referral',
        details:      `Referral bonus applied — code ${code}`,
        pointsEarned: bonusForUser,
      });
    }

    logger.info(`Referral applied: ${user.email} → ${referrer.email}, referrer +100 pts`);
    return res.json({ success: true, bonusPoints: bonusForUser });

  } catch (error: any) {
    logger.error('Apply referral error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

export default router;