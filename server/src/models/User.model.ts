/**
 * StudyEarn AI — User Model
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

  name:     { type: String, required: true, trim: true },

  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },

  password: { type: String, default: null }, // null for Google OAuth users



  // ── Gamification ──────────────────────────────────────────

  points:  { type: Number, default: 100 },

  totalXP: { type: Number, default: 100 }, // Never decreases — used for level

  streak:  { type: Number, default: 1 },

  lastActive: { type: Date, default: Date.now },



  // ── Daily Question Quota (Hourly Refill System) ─────────────
  questionsLeft: { type: Number, default: 15 },
  questionsDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  // Timestamps of each question used — for hourly refill tracking
  // Each entry = ISO timestamp when question was consumed
  questionUsedAt: { type: [Date], default: [] },
  // Video ad usage today — max 5 per day
  videoAdsToday:  { type: Number, default: 0 },
  videoAdsDate:   { type: String, default: () => new Date().toISOString().split('T')[0] },



  // ── Referral System ───────────────────────────────────────

  referralCode: { type: String, unique: true, sparse: true },

  referredBy:   { type: String, default: null },



  // ── Profile ───────────────────────────────────────────────

  avatar: { type: String, default: null },



  // ── Achievements ──────────────────────────────────────────

  unlockedAchievements: { type: [String], default: [] },



  // ── Action Counters ───────────────────────────────────────

  totalQuestionsAsked: { type: Number, default: 0 },

  totalPPTsGenerated:  { type: Number, default: 0 },

  totalPDFsConverted:  { type: Number, default: 0 },

  // ── New achievement counters ───────────────────────────────
  totalQuizCompleted:        { type: Number, default: 0 },
  totalChallengesCompleted:  { type: Number, default: 0 },
  totalChallengesCorrect:    { type: Number, default: 0 },
  totalNotesCreated:         { type: Number, default: 0 },
  totalStudyToolsUsed:       { type: Number, default: 0 },
  totalDaysActive:           { type: Number, default: 0 },
  lastDayActiveKey:          { type: String, default: null },  // IST date key for dedup



  createdAt: { type: Date, default: Date.now },



  // ── Premium Plan ──────────────────────────────────────────

  isPremium:          { type: Boolean, default: false },

  premiumExpiresAt:   { type: Date,    default: null },

  premiumActivatedAt: { type: Date,    default: null },

  // ── Forgot Password OTP ───────────────────────────────────
  resetOtp:          { type: String,  default: null }, // hashed 6-digit OTP
  resetOtpExpiresAt: { type: Date,    default: null }, // expires in 10 min
  resetOtpAttempts:  { type: Number,  default: 0    }, // max 5 wrong attempts



  // ── Study Planner — server-side, cross-device ─────────────

  // { examName, examDate, subjects, days: StudyDay[], createdAt }

  studyPlan: { type: mongoose.Schema.Types.Mixed, default: null },



  // ── Daily Challenge — server-side, cross-device ───────────

  // { date: 'YYYY-MM-DD', challenge: ChallengeData, result: ChallengeResult | null }

  dailyChallenge:        { type: mongoose.Schema.Types.Mixed, default: null },
  challengeHistory:      { type: [mongoose.Schema.Types.Mixed], default: [] },

  // ── Formula Sheet Bookmarks ───────────────────────────────
  // Array of formula IDs e.g. ['p1', 'p2', 'c5'] — cross-device sync
  formulaBookmarks: { type: [String], default: [] },

  // ── Onboarding Tour ───────────────────────────────────────
  onboardingCompleted: { type: Boolean, default: false },

  // ── AI Study OS — Brain Setup ─────────────────────────────
  // true jab user ne learner category setup kar li ho (school/coding/college/self)
  // Yeh DB mein save hota hai — localStorage pe depend nahi karte
  // Isse bar bar onboarding nahi aata login karne par
  brainSetupCompleted: { type: Boolean, default: false },

  // ── Stage 7: Retention Engine ─────────────────────────────
 
  // Streak Recovery System
  // Stores one-chance recovery session when streak is broken.
  // Schema: {
  //   state:           'available' | 'pending' | 'completed' | 'expired'
  //   previousStreak:  number
  //   initiatedAt:     ISO string
  //   expiresAt:       ISO string (24h window)
  //   completedAt?:    ISO string
  //   method?:         'task' | 'quiz' | 'lesson'
  // }
  streakRecovery: { type: mongoose.Schema.Types.Mixed, default: null },
 
  // Notification Engine
  // Stores in-app notifications + daily send counter (max 2/day).
  // Schema: {
  //   notifications:  AppNotification[]   (max 20 kept, expired auto-pruned)
  //   sentToday:      number
  //   lastSentDate:   'YYYY-MM-DD' (IST)
  //   lastSentAt:     ISO string | null
  // }
  notificationRecord: { type: mongoose.Schema.Types.Mixed, default: null },
});



// Indexes for fast queries
// email + referralCode already indexed via unique:true in schema
userSchema.index({ points: -1 }); // Leaderboard sorting



export const User = mongoose.model('User', userSchema);