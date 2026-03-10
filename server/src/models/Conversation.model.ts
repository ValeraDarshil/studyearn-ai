// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Conversation Model
// ─────────────────────────────────────────────────────────────
// Har conversation = ek chat session (GPT ki tarah)
// Messages array mein puri baat hoti hai
// ─────────────────────────────────────────────────────────────

import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role:    { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  // Only for user messages with file
  fileName:     { type: String, default: null },
  fileType:     { type: String, enum: ['image', 'pdf', null], default: null },
  // Only for assistant messages
  pointsAwarded: { type: Number, default: null },
  isError:       { type: Boolean, default: false },
}, { _id: false, timestamps: false });

const ConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User',
    required: true,
    index: true,
  },
  // Auto-generated title from first message (first 60 chars)
  title: { type: String, default: 'New Chat' },

  messages: [MessageSchema],

  // For sidebar grouping: "Today", "Yesterday", "Last 7 days", etc.
  lastMessageAt: { type: Date, default: Date.now },

  // Soft delete — user ne delete kiya toh hide karo
  deletedAt: { type: Date, default: null },

}, { timestamps: true });

// Index for fast user queries sorted by recent
ConversationSchema.index({ userId: 1, lastMessageAt: -1 });
// Auto-delete conversations older than 30 days
ConversationSchema.index({ lastMessageAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const Conversation = mongoose.model('Conversation', ConversationSchema);