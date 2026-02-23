import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'signup',
      'login',
      'ask_question',
      'generate_ppt',
      'convert_pdf',
      'referral',      // ✅ ADDED
      'streak_bonus',  // ✅ ADDED
      'daily_login',   // ✅ ADDED
    ],
  },
  details: {
    type: String,
    required: true,
  },
  pointsEarned: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

activitySchema.index({ userId: 1, timestamp: -1 });

export const Activity = mongoose.model('Activity', activitySchema);