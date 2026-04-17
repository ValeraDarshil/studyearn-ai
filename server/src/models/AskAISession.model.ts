// ─────────────────────────────────────────────────────────────
// AskAI — AskAISession.model.ts  (v10)
// linkedConvoId added — Conversation model se link
// ─────────────────────────────────────────────────────────────

import mongoose, { Schema, Document } from 'mongoose';

const AskAIMessageSchema = new Schema({
  role:           { type: String, enum: ['user', 'assistant'], required: true },
  content:        { type: String, required: true },
  detectedTopic:  { type: String, default: null },
  emotionalState: { type: String, enum: ['correct', 'confused', 'frustrated', 'motivated', 'neutral'], default: 'neutral' },
  intent:         { type: String, default: null },
  strategy:       { type: String, default: null },
  skillLevel:     { type: String, default: null },
  modelUsed:      { type: String, default: null },
  providerUsed:   { type: String, default: null },
  questionType:   { type: String, enum: ['text', 'image', 'pdf'], default: 'text' },
  pointsAwarded:  { type: Number, default: 0 },
  responseMs:     { type: Number, default: null },
  createdAt:      { type: Date, default: Date.now },
}, { _id: true });

const AskAISessionSchema = new Schema({
  userId: {
    type:     Schema.Types.ObjectId,
    ref:      'User',
    required: true,
    index:    true,
  },

  // ← v10 NEW: Conversation model ke saath link
  // Frontend sidebar ka convoId yahan store hota hai
  linkedConvoId: {
    type:    Schema.Types.ObjectId,
    ref:     'Conversation',
    default: null,
    index:   true,
  },

  title:           { type: String, default: 'New Chat' },
  messages:        { type: [AskAIMessageSchema], default: [] },
  detectedTopics:  { type: [String], default: [] },
  weakTopics:      { type: [String], default: [] },
  strongTopics:    { type: [String], default: [] },
  finalSkillLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  turnCount:       { type: Number, default: 0 },
  confusionCount:  { type: Number, default: 0 },
  masteryCount:    { type: Number, default: 0 },
  imageCount:      { type: Number, default: 0 },
  textCount:       { type: Number, default: 0 },
  subjectModes:    { type: [String], default: [] },
  lastMessageAt:   { type: Date, default: Date.now },
  sessionStartAt:  { type: Date, default: Date.now },
  deletedAt:       { type: Date, default: null },
  // Teaching loop state — persisted so it survives restarts / cold starts
  loopState:       { type: Schema.Types.Mixed, default: null },

  // Fix B: prevTurn persistence — survives cold starts / serverless restarts
  lastAiResponse: { type: String,  default: null },
  lastStrategy:   { type: String,  default: null },
  lastTopic:      { type: String,  default: null },
  lastSubject:    { type: String,  default: null },

}, { timestamps: true });

AskAISessionSchema.index({ userId: 1, lastMessageAt: -1 });
AskAISessionSchema.index({ linkedConvoId: 1 });
// 30-day auto-delete
AskAISessionSchema.index({ lastMessageAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

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
  linkedConvoId:   mongoose.Types.ObjectId | null;
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