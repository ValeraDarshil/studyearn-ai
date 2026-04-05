// ─────────────────────────────────────────────────────────────
// AskAI — AskAISession.model.ts  (v9 — Full DB Persistence)
//
// WHY THIS EXISTS:
//   conversationMemoryEngine.ts stores data in RAM (Map).
//   RAM = lost on server restart, lost after 30min TTL, lost
//   when user comes back next day. This model fixes all of that.
//
// WHAT GETS STORED:
//   - Every single message (user + AI) with metadata
//   - Detected topics per message
//   - Emotional state at time of message
//   - Skill level at time of message
//   - Intent + strategy used for AI response
//   - Weak topics accumulated over ALL sessions (not just RAM)
//   - Strong topics accumulated over ALL sessions
//   - Session-level stats (turns, confusion count, mastery count)
//   - Timestamps for everything (30-day TTL via MongoDB)
//
// TTL: Messages older than 30 days auto-deleted by MongoDB
//      (same as Conversation model — consistent behavior)
// ─────────────────────────────────────────────────────────────

import mongoose, { Schema, Document } from 'mongoose';

// ─────────────────────────────────────────────────────────────
// Sub-schemas
// ─────────────────────────────────────────────────────────────

// One message inside a session
const AskAIMessageSchema = new Schema({
  role:           { type: String, enum: ['user', 'assistant'], required: true },
  content:        { type: String, required: true },

  // Metadata — only populated for user messages
  detectedTopic:  { type: String, default: null },
  emotionalState: {
    type:    String,
    enum:    ['correct', 'confused', 'frustrated', 'motivated', 'neutral'],
    default: 'neutral',
  },

  // Metadata — only populated for assistant messages
  intent:         { type: String, default: null },   // EXPLAIN / SOLVE / DEBUG etc.
  strategy:       { type: String, default: null },   // TEACH / STEP_BY_STEP / QUIZ etc.
  skillLevel:     { type: String, default: null },   // beginner / intermediate / advanced
  modelUsed:      { type: String, default: null },   // e.g. "groq/llama-3.3-70b-versatile"
  providerUsed:   { type: String, default: null },   // "groq" | "openrouter" | "nvidia"
  questionType:   {
    type:    String,
    enum:    ['text', 'image', 'pdf'],
    default: 'text',
  },
  pointsAwarded:  { type: Number, default: 0 },
  responseMs:     { type: Number, default: null },   // latency tracking

  createdAt: { type: Date, default: Date.now },
}, { _id: true });


// One ASKAI session = one "conversation" in the sidebar
// A session contains many messages
const AskAISessionSchema = new Schema({

  // ── Identity ────────────────────────────────────────────────
  userId: {
    type:     Schema.Types.ObjectId,
    ref:      'User',
    required: true,
    index:    true,
  },

  // Auto-title from first user message (first 60 chars)
  title: { type: String, default: 'New Chat' },

  // ── Messages ────────────────────────────────────────────────
  messages: { type: [AskAIMessageSchema], default: [] },

  // ── Session-level intelligence ──────────────────────────────
  // Aggregated from ALL messages in this session
  detectedTopics: { type: [String], default: [] },   // topics discussed
  weakTopics:     { type: [String], default: [] },   // where student showed confusion
  strongTopics:   { type: [String], default: [] },   // where student showed mastery

  // Skill level at the END of this session (may have changed during session)
  finalSkillLevel: {
    type:    String,
    enum:    ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate',
  },

  // ── Session stats ───────────────────────────────────────────
  turnCount:       { type: Number, default: 0 },     // number of user turns
  confusionCount:  { type: Number, default: 0 },     // how many times student was confused
  masteryCount:    { type: Number, default: 0 },     // how many times student got it right
  imageCount:      { type: Number, default: 0 },     // image/PDF questions count
  textCount:       { type: Number, default: 0 },     // text questions count

  // ── Subject modes used in this session ──────────────────────
  subjectModes: { type: [String], default: [] },

  // ── Timing ──────────────────────────────────────────────────
  lastMessageAt: { type: Date, default: Date.now },
  sessionStartAt: { type: Date, default: Date.now },

  // ── Soft delete ─────────────────────────────────────────────
  deletedAt: { type: Date, default: null },

}, { timestamps: true });

// ── Indexes ──────────────────────────────────────────────────
// Fast lookup: all sessions for a user, sorted newest first
AskAISessionSchema.index({ userId: 1, lastMessageAt: -1 });

// TTL: auto-delete sessions older than 30 days (same as Conversation model)
AskAISessionSchema.index(
  { lastMessageAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 }
);

// ── Export ───────────────────────────────────────────────────
export interface IAskAIMessage {
  role:           'user' | 'assistant';
  content:        string;
  detectedTopic?: string | null;
  emotionalState?: string;
  intent?:        string | null;
  strategy?:      string | null;
  skillLevel?:    string | null;
  modelUsed?:     string | null;
  providerUsed?:  string | null;
  questionType?:  'text' | 'image' | 'pdf';
  pointsAwarded?: number;
  responseMs?:    number | null;
  createdAt?:     Date;
}

export interface IAskAISession extends Document {
  userId:          mongoose.Types.ObjectId;
  title:           string;
  messages:        IAskAIMessage[];
  detectedTopics:  string[];
  weakTopics:      string[];
  strongTopics:    string[];
  finalSkillLevel: 'beginner' | 'intermediate' | 'advanced';
  turnCount:       number;
  confusionCount:  number;
  masteryCount:    number;
  imageCount:      number;
  textCount:       number;
  subjectModes:    string[];
  lastMessageAt:   Date;
  sessionStartAt:  Date;
  deletedAt:       Date | null;
}

export const AskAISession = mongoose.models.AskAISession ||
  mongoose.model<IAskAISession>('AskAISession', AskAISessionSchema);