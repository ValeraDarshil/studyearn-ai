/**
 * AI Study OS — AI Mentor Session Model (Stage 6)
 * ─────────────────────────────────────────────────────────────
 * Persists all AI Mentor activity per user:
 *   - Last trigger time (anti-spam)
 *   - Active micro-tasks
 *   - Message history
 *   - Mentor personality preference
 *   - Mentor level (progressive intelligence)
 *   - Daily trigger count (max 2/day rule)
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { MentorTriggerType }                  from '../services/aiMentor/mentorTriggerEngine.js';
import { MentorPersonality, MentorMessage }   from '../services/aiMentor/mentorMessageGenerator.js';
import { MicroTask }                          from '../services/aiMentor/mentorActionEngine.js';

// ── Stored message entry ──────────────────────────────────────
export interface IMentorMessageEntry {
  triggerType:  MentorTriggerType;
  title:        string;
  body:         string;
  cta:          string;
  emoji:        string;
  taskHint:     string;
  microTask:    MicroTask | null;
  quizAssigned: boolean;
  xpAwarded:    number;
  isRead:       boolean;
  isDismissed:  boolean;
  createdAt:    Date;
}

// ── Main Interface ────────────────────────────────────────────
export interface IAIMentorSession extends Document {
  userId:             mongoose.Types.ObjectId;

  // Anti-spam
  lastFiredAt:        Date | null;
  dailyTriggerCount:  number;
  dailyResetDate:     string;          // 'YYYY-MM-DD'

  // Personality / style
  mentorPersonality:  MentorPersonality;

  // Progressive intelligence: increases with each interaction
  mentorLevel:        number;          // 1–10

  // Message history (last 30)
  messages:           IMentorMessageEntry[];

  // Active micro-task (replaced each session)
  activeMicroTask:    MicroTask | null;

  // Stats
  totalTriggersEver:  number;
  totalTasksCompleted: number;

  createdAt:          Date;
  updatedAt:          Date;
}

// ── Schemas ───────────────────────────────────────────────────

const microTaskSchema = new Schema({
  id:              String,
  title:           String,
  description:     String,
  durationMinutes: Number,
  type:            String,
  topic:           { type: String, default: null },
  subject:         { type: String, default: null },
  difficulty:      String,
  xpReward:        Number,
  createdAt:       String,
  expiresAt:       String,
}, { _id: false });

const messageEntrySchema = new Schema<IMentorMessageEntry>({
  triggerType:  { type: String, required: true },
  title:        { type: String, required: true },
  body:         { type: String, required: true },
  cta:          { type: String, required: true },
  emoji:        { type: String, required: true },
  taskHint:     { type: String, required: true },
  microTask:    { type: microTaskSchema, default: null },
  quizAssigned: { type: Boolean, default: false },
  xpAwarded:    { type: Number,  default: 0 },
  isRead:       { type: Boolean, default: false },
  isDismissed:  { type: Boolean, default: false },
  createdAt:    { type: Date,    default: Date.now },
}, { _id: true });

const aiMentorSessionSchema = new Schema<IAIMentorSession>({
  userId: {
    type:     Schema.Types.ObjectId,
    ref:      'User',
    required: true,
    unique:   true,
  },

  lastFiredAt:        { type: Date,   default: null },
  dailyTriggerCount:  { type: Number, default: 0 },
  dailyResetDate:     { type: String, default: '' },

  mentorPersonality: {
    type:    String,
    enum:    ['friendly', 'strict', 'motivational'],
    default: 'motivational',
  },

  mentorLevel:         { type: Number, default: 1, min: 1, max: 10 },

  messages:            { type: [messageEntrySchema], default: [] },
  activeMicroTask:     { type: microTaskSchema, default: null },

  totalTriggersEver:   { type: Number, default: 0 },
  totalTasksCompleted: { type: Number, default: 0 },

}, { timestamps: true });

aiMentorSessionSchema.index({ userId: 1 }, { unique: true });
aiMentorSessionSchema.index({ lastFiredAt: -1 });

export const AIMentorSession: Model<IAIMentorSession> =
  mongoose.models.AIMentorSession ||
  mongoose.model<IAIMentorSession>('AIMentorSession', aiMentorSessionSchema);