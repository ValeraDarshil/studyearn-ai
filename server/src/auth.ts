import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './models/User.model';
import { Activity } from './models/Activity.model';
import { connectDB } from './db';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES = '7d';

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
router.post('/signup', async (req, res) => {
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
router.post('/login', async (req, res) => {
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

    // Log login
    await Activity.create({
      userId: user._id,
      action: 'login',
      details: 'Logged in',
      pointsEarned: 0,
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
        questionsLeft: user.questionsLeft,
        streak: user.streak,
      },
    });

    console.log(`✅ Login: ${email} (ID: ${user._id})`);
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

    res.json({ success: true, user });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

export default router;