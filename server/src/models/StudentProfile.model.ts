/**
 * AI Study OS — Student Profile Model  (v2 — Adaptive Memory Fields)
 * ─────────────────────────────────────────────────────────────
 * GAP 1 FIX: Added `aiStrategyStats` — per-strategy success/failure
 *            counters used by strategyScoringEngine.ts
 *
 * GAP 2 FIX: Added `aiLongTermMemory` — persistent mistake log,
 *            milestones, and behavior patterns used by
 *            longTermMemoryEngine.ts
 *
 * GAP 5 FIX: Added `learningStyle` — persists detected learning style
 *            from usePersonalization.ts hook across sessions.
 *
 * All existing fields are UNCHANGED. Fields added at the bottom.
 * Fully backward compatible — new fields default to safe values.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

// ── Learner Types ─────────────────────────────────────────────
export type LearnerCategory =
  | 'school'
  | 'coding'
  | 'college'
  | 'self'

// ── Topic Mastery Record ──────────────────────────────────────
export interface ITopicMastery {
  topic: string;
  subject: string;
  category: LearnerCategory;
  masteryLevel: number;
  correctAttempts: number;
  totalAttempts: number;
  lastAttemptedAt: Date | null;
  isWeak: boolean;
  isStrong: boolean;
  trend: 'improving' | 'declining' | 'stable';
}

// ── Daily Study Log ──────────────────────────────────────────
export interface IDailyStudyLog {
  date: string;
  minutesStudied: number;
  questionsAsked: number;
  quizzesCompleted: number;
  codingSectionsCompleted: number;
  xpEarned: number;
  topicsCovered: string[];
}

// ── Quiz Performance ─────────────────────────────────────────
export interface IQuizPerformance {
  subject: string;
  topic: string;
  score: number;
  attemptedAt: Date;
  totalQuestions: number;
  correctAnswers: number;
}

// ── AI Recommendation ────────────────────────────────────────
export interface IAIRecommendation {
  type: 'topic_focus' | 'practice' | 'revision' | 'challenge' | 'rest';
  title: string;
  description: string;
  subject?: string;
  topic?: string;
  priority: 1 | 2 | 3;
  generatedAt: Date;
  expiresAt: Date;
  isCompleted: boolean;
}

// ── Weekly Insight ────────────────────────────────────────────
export interface IWeeklyInsight {
  weekKey: string;
  summary: string;
  topImprovedTopic: string | null;
  topWeakTopic: string | null;
  avgDailyMinutes: number;
  totalXPEarned: number;
  consistencyScore: number;
  generatedAt: Date;
}

// ── GAP 1: Strategy Stats ─────────────────────────────────────
export interface IStrategyStatEntry {
  successCount: number;
  failureCount: number;
  usageCount:   number;
  lastUsedAt:   string | null;
}

// ── GAP 2: Long-Term Memory ───────────────────────────────────
export interface IMistakeRecord {
  topic:       string;
  subject:     string;
  question:    string;
  errorType:   string;
  count:       number;
  firstSeenAt: string;
  lastSeenAt:  string;
}

export interface ILearningMilestone {
  type:        string;
  description: string;
  achievedAt:  string;
  value?:      number;
}

// ── Main interface ────────────────────────────────────────────
export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  learnerCategory: LearnerCategory;
  classLevel: string | null;
  primarySubjects: string[];
  preferredLanguage: 'english' | 'hinglish';
  topicMastery: ITopicMastery[];
  weakTopics: string[];
  strongTopics: string[];
  avgTimePerQuestion: number;
  learningSpeed: 'slow' | 'medium' | 'fast';
  totalStudyDays: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  overallMasteryScore: number;
  quizHistory: IQuizPerformance[];
  dailyLogs: IDailyStudyLog[];
  todayRecommendations: IAIRecommendation[];
  weeklyInsights: IWeeklyInsight[];
  recentMistakes: string[];
  tutorPersonality: 'simple' | 'normal' | 'advanced';
  // GAP 5: detected learning style persisted from frontend
  learningStyle: 'visual' | 'example' | 'theory' | 'practice' | 'unknown';
  // GAP 1: strategy stats (keyed by strategy name)
  aiStrategyStats: Record<string, IStrategyStatEntry>;
  // GAP 2: long-term memory
  aiLongTermMemory: {
    pastMistakes: IMistakeRecord[];
    milestones:   ILearningMilestone[];
    behaviorPattern?: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ── Sub-schemas ───────────────────────────────────────────────

const topicMasterySchema = new Schema<ITopicMastery>({
  topic:           { type: String, required: true },
  subject:         { type: String, required: true },
  category:        { type: String, enum: ['school', 'coding', 'college', 'self'], required: true },
  masteryLevel:    { type: Number, default: 0, min: 0, max: 100 },
  correctAttempts: { type: Number, default: 0 },
  totalAttempts:   { type: Number, default: 0 },
  lastAttemptedAt: { type: Date, default: null },
  isWeak:          { type: Boolean, default: false },
  isStrong:        { type: Boolean, default: false },
  trend:           { type: String, enum: ['improving', 'declining', 'stable'], default: 'stable' },
}, { _id: false });

const dailyStudyLogSchema = new Schema<IDailyStudyLog>({
  date:                        { type: String, required: true },
  minutesStudied:              { type: Number, default: 0 },
  questionsAsked:              { type: Number, default: 0 },
  quizzesCompleted:            { type: Number, default: 0 },
  codingSectionsCompleted:     { type: Number, default: 0 },
  xpEarned:                    { type: Number, default: 0 },
  topicsCovered:               { type: [String], default: [] },
}, { _id: false });

const quizPerformanceSchema = new Schema<IQuizPerformance>({
  subject:       { type: String, required: true },
  topic:         { type: String, required: true },
  score:         { type: Number, required: true },
  attemptedAt:   { type: Date, default: Date.now },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
}, { _id: false });

const aiRecommendationSchema = new Schema<IAIRecommendation>({
  type:        { type: String, enum: ['topic_focus', 'practice', 'revision', 'challenge', 'rest'], required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  subject:     { type: String, default: null },
  topic:       { type: String, default: null },
  priority:    { type: Number, enum: [1, 2, 3], default: 2 },
  generatedAt: { type: Date, default: Date.now },
  expiresAt:   { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
}, { _id: false });

const weeklyInsightSchema = new Schema<IWeeklyInsight>({
  weekKey:           { type: String, required: true },
  summary:           { type: String, required: true },
  topImprovedTopic:  { type: String, default: null },
  topWeakTopic:      { type: String, default: null },
  avgDailyMinutes:   { type: Number, default: 0 },
  totalXPEarned:     { type: Number, default: 0 },
  consistencyScore:  { type: Number, default: 0 },
  generatedAt:       { type: Date, default: Date.now },
}, { _id: false });

// ── GAP 2: Mistake record sub-schema ─────────────────────────
const mistakeRecordSchema = new Schema({
  topic:       { type: String, required: true },
  subject:     { type: String, default: '' },
  question:    { type: String, default: '' },
  errorType:   { type: String, default: 'unknown' },
  count:       { type: Number, default: 1 },
  firstSeenAt: { type: String, default: () => new Date().toISOString() },
  lastSeenAt:  { type: String, default: () => new Date().toISOString() },
}, { _id: false });

// ── GAP 2: Milestone sub-schema ───────────────────────────────
const milestoneSchema = new Schema({
  type:        { type: String, required: true },
  description: { type: String, required: true },
  achievedAt:  { type: String, default: () => new Date().toISOString() },
  value:       { type: Number, default: null },
}, { _id: false });

// ── Main Schema ───────────────────────────────────────────────
const studentProfileSchema = new Schema<IStudentProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  learnerCategory:    { type: String, enum: ['school', 'coding', 'college', 'self'], required: true },
  classLevel:         { type: String, default: null },
  primarySubjects:    { type: [String], default: [] },
  preferredLanguage:  { type: String, enum: ['english', 'hinglish'], default: 'english' },

  topicMastery:  { type: [topicMasterySchema], default: [] },
  weakTopics:    { type: [String], default: [] },
  strongTopics:  { type: [String], default: [] },

  avgTimePerQuestion: { type: Number, default: 60 },
  learningSpeed:      { type: String, enum: ['slow', 'medium', 'fast'], default: 'medium' },

  totalStudyDays:  { type: Number, default: 0 },
  currentStreak:   { type: Number, default: 0 },
  longestStreak:   { type: Number, default: 0 },
  lastStudyDate:   { type: String, default: null },

  overallMasteryScore: { type: Number, default: 0 },

  quizHistory:          { type: [quizPerformanceSchema], default: [] },
  dailyLogs:            { type: [dailyStudyLogSchema], default: [] },
  todayRecommendations: { type: [aiRecommendationSchema], default: [] },
  weeklyInsights:       { type: [weeklyInsightSchema], default: [] },

  recentMistakes:   { type: [String], default: [] },
  tutorPersonality: { type: String, enum: ['simple', 'normal', 'advanced'], default: 'normal' },

  // ── GAP 5: Detected learning style (persisted from frontend hook) ─
  learningStyle: {
    type:    String,
    enum:    ['visual', 'example', 'theory', 'practice', 'unknown'],
    default: 'unknown',
  },

  // ── GAP 1: Per-strategy scoring stats ────────────────────────
  aiStrategyStats: {
    type:    Schema.Types.Mixed,
    default: {},
  },

  // ── GAP 2: Long-term memory store ────────────────────────────
  aiLongTermMemory: {
    type: {
      pastMistakes:    { type: [mistakeRecordSchema], default: [] },
      milestones:      { type: [milestoneSchema],     default: [] },
      behaviorPattern: { type: Schema.Types.Mixed,    default: null },
    },
    default: { pastMistakes: [], milestones: [], behaviorPattern: null },
  },

}, { timestamps: true });

// ── Indexes ───────────────────────────────────────────────────
studentProfileSchema.index({ userId: 1 }, { unique: true });
studentProfileSchema.index({ 'topicMastery.isWeak': 1 });
studentProfileSchema.index({ overallMasteryScore: -1 });

// ── Export ────────────────────────────────────────────────────
export const StudentProfile: Model<IStudentProfile> =
  mongoose.models.StudentProfile ||
  mongoose.model<IStudentProfile>('StudentProfile', studentProfileSchema);