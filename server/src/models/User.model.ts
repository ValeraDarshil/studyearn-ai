// // calude ai //

// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   points: {
//     type: Number,
//     default: 100,
//   },
//   questionsLeft: {
//     type: Number,
//     default: 5,
//   },
//   questionsDate: {
//     type: String,
//     default: () => new Date().toISOString().split('T')[0],
//   },
//   streak: {
//     type: Number,
//     default: 1,
//   },
//   lastActive: {
//     type: Date,
//     default: Date.now,
//   },
//   referralCode: {
//     type: String,
//     unique: true,
//     sparse: true,
//   },
//   referredBy: {
//     type: String,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   // ✅ AVATAR - selected avatar ID
//   avatar: {
//     type: String,
//     default: null,
//   },
//   // ✅ ACHIEVEMENTS - array of unlocked achievement IDs
//   unlockedAchievements: {
//     type: [String],
//     default: [],
//   },
//   // Track counts for achievements
//   totalQuestionsAsked: {
//     type: Number,
//     default: 0,
//   },
//   totalPPTsGenerated: {
//     type: Number,
//     default: 0,
//   },
//   totalPDFsConverted: {
//     type: Number,
//     default: 0,
//   },
// });

// userSchema.index({ email: 1 });
// userSchema.index({ referralCode: 1 });

// export const User = mongoose.model('User', userSchema);


// Clear Version //

/**
 * StudyEarn AI — User Model
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String, required: true, trim: true,
  },
  email: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
  },
  password: {
    type: String, required: true,
  },

  // ── Gamification ──────────────────────────────────────────
  points: {
    type: Number, default: 100,
  },
  streak: {
    type: Number, default: 1, // Always starts at 1, never 0
  },
  lastActive: {
    type: Date, default: Date.now,
  },

  // ── Daily Question Quota ──────────────────────────────────
  questionsLeft: {
    type: Number, default: 5,
  },
  questionsDate: {
    type: String, default: () => new Date().toISOString().split('T')[0],
  },

  // ── Referral System ───────────────────────────────────────
  referralCode: {
    type: String, unique: true, sparse: true,
  },
  referredBy: {
    type: String, default: null,
  },

  // ── Profile ───────────────────────────────────────────────
  avatar: {
    type: String, default: null,
  },

  // ── Achievements ──────────────────────────────────────────
  unlockedAchievements: {
    type: [String], default: [],
  },

  // ── Action Counters (for achievement tracking) ────────────
  totalQuestionsAsked: {
    type: Number, default: 0,
  },
  totalPPTsGenerated: {
    type: Number, default: 0,
  },
  totalPDFsConverted: {
    type: Number, default: 0,
  },

  createdAt: {
    type: Date, default: Date.now,
  },

  // ── Premium Plan ──────────────────────────────────────────
  isPremium: {
    type: Boolean, default: false,
  },
  premiumExpiresAt: {
    type: Date, default: null,
  },
  premiumActivatedAt: {
    type: Date, default: null,
  },
});

// Indexes for fast queries
userSchema.index({ email: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ points: -1 }); // For leaderboard sorting

export const User = mongoose.model('User', userSchema);