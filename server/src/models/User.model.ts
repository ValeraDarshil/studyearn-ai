/**
 * StudyEarn AI — User Model
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },

  // ── Gamification ──────────────────────────────────────────
  points:  { type: Number, default: 100 },
  totalXP: { type: Number, default: 100 }, // Never decreases — used for level
  streak:  { type: Number, default: 1 },
  lastActive: { type: Date, default: Date.now },

  // ── Daily Question Quota ──────────────────────────────────
  questionsLeft: { type: Number, default: 5 },
  questionsDate: { type: String, default: () => new Date().toISOString().split('T')[0] },

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

  createdAt: { type: Date, default: Date.now },

  // ── Premium Plan ──────────────────────────────────────────
  isPremium:          { type: Boolean, default: false },
  premiumExpiresAt:   { type: Date,    default: null },
  premiumActivatedAt: { type: Date,    default: null },

  // ── Study Planner — server-side, cross-device ─────────────
  // { examName, examDate, subjects, days: StudyDay[], createdAt }
  studyPlan: { type: mongoose.Schema.Types.Mixed, default: null },

  // ── Daily Challenge — server-side, cross-device ───────────
  // { date: 'YYYY-MM-DD', challenge: ChallengeData, result: ChallengeResult | null }
  dailyChallenge: { type: mongoose.Schema.Types.Mixed, default: null },
});

// Indexes for fast queries
userSchema.index({ email: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ points: -1 }); // Leaderboard sorting

export const User = mongoose.model('User', userSchema);