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
  // User message file fields
  fileName:     { type: String, default: null },
  fileType:     { type: String, enum: ['image', 'pdf', null], default: null },
  // Assistant message fields
  pointsAwarded: { type: Number,  default: null },
  isError:       { type: Boolean, default: false },
  subjectMode:   { type: String,  default: null },
  // v12: Image generation result (SVG stored, base64 NOT stored to save space)
  imageGen: {
    type: {
      success:    Boolean,
      provider:   String,
      prompt:     String,
      isSvg:      Boolean,
      svgContent: String,  // SVG markup (text — small size)
      imageUrl:   String,  // External URL if available
      imageB64:   String,  // null always (not stored)
      error:      String,
    },
    default: null,
    _id: false,
  },
  // v12: General knowledge data from Wikipedia
  gkData: {
    type: {
      isGeneral:    Boolean,
      title:        String,
      summary:      String,
      imageUrl:     String,
      imageCaption: String,
      wikiUrl:      String,
      type:         String,
      keyFacts:     [String],
    },
    default: null,
    _id: false,
  },
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