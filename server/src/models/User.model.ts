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
//     default: 100, // Welcome bonus
//   },
//   questionsLeft: {
//     type: Number,
//     default: 5,
//   },
//   questionsDate: {
//     type: String,
//     default: () => new Date().toISOString().split('T')[0], // YYYY-MM-DD
//   },
//   streak: {
//     type: Number,
//     default: 1, // ✅ START AT 1, NOT 0
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
// });

// // Index for faster queries
// userSchema.index({ email: 1 });
// userSchema.index({ referralCode: 1 });

// export const User = mongoose.model('User', userSchema);

// calude ai //

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 100,
  },
  questionsLeft: {
    type: Number,
    default: 5,
  },
  questionsDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
  streak: {
    type: Number,
    default: 1,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  referredBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // ✅ ACHIEVEMENTS - array of unlocked achievement IDs
  unlockedAchievements: {
    type: [String],
    default: [],
  },
  // Track counts for achievements
  totalQuestionsAsked: {
    type: Number,
    default: 0,
  },
  totalPPTsGenerated: {
    type: Number,
    default: 0,
  },
  totalPDFsConverted: {
    type: Number,
    default: 0,
  },
});

userSchema.index({ email: 1 });
userSchema.index({ referralCode: 1 });

export const User = mongoose.model('User', userSchema);