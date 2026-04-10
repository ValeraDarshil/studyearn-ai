// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Conversation Model
// ─────────────────────────────────────────────────────────────

import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role:    { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  // User message file fields
  fileName:     { type: String, default: null },
  fileType:     { type: String, enum: ['image', 'pdf', null], default: null },
  // Assistant message fields
  pointsAwarded: { type: Number,  default: null },
  isError:       { type: Boolean, default: false },
  subjectMode:   { type: String,  default: null },
  // v12: imageGen and gkData — use Mixed type to avoid Mongoose nested-default issues
  // Mongoose doesn't allow default:null on nested type:{} objects
  imageGen: { type: mongoose.Schema.Types.Mixed, default: undefined },
  gkData:   { type: mongoose.Schema.Types.Mixed, default: undefined },
}, { _id: false, timestamps: false });

const ConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User',
    required: true,
    index: true,
  },
  title: { type: String, default: 'New Chat' },
  messages: [MessageSchema],
  lastMessageAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

ConversationSchema.index({ userId: 1, lastMessageAt: -1 });
ConversationSchema.index({ lastMessageAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const Conversation = mongoose.model('Conversation', ConversationSchema);