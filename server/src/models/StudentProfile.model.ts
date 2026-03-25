/**
 * AI Study OS — Student Profile Model
 * ─────────────────────────────────────────────────────────────
 * The "AI Brain" of each learner.
 * Tracks topic mastery, weak/strong areas, learning speed,
 * quiz performance, coding progress, and study consistency
 * for ALL learner types: school / coding / college / self.
 *
 * This model is the single source of truth for the
 * AI Tutor, Learning Engine, and Progress Intelligence.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

// ── Learner Types ─────────────────────────────────────────────
export type LearnerCategory =
  | 'school'      // Class 1–12 (CBSE/ICSE/State)
  | 'coding'      // Coding learners (JS, Python, C, etc.)
  | 'college'     // UG / PG students
  | 'self'        // Self-learners / skill builders

// ── Topic Mastery Record ──────────────────────────────────────
export interface ITopicMastery {
  topic: string;            // e.g. "Algebra", "Loops", "Data Structures"
  subject: string;          // e.g. "Math", "Python", "Physics"
  category: LearnerCategory;
  masteryLevel: number;     // 0–100 (0=not started, 100=mastered)
  correctAttempts: number;
  totalAttempts: number;
  lastAttemptedAt: Date | null;
  isWeak: boolean;          // masteryLevel < 40
  isStrong: boolean;        // masteryLevel >= 80
  trend: 'improving' | 'declining' | 'stable';
}

// ── Daily Study Log ──────────────────────────────────────────
export interface IDailyStudyLog {
  date: string;             // 'YYYY-MM-DD' IST
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
  score: number;            // 0–100
  attemptedAt: Date;
  totalQuestions: number;
  correctAnswers: number;
}

// ── AI Recommendation ────────────────────────────────────────
export interface IAIRecommendation {
  type: 'topic_focus' | 'practice' | 'revision' | 'challenge' | 'rest';
  title: string;            // e.g. "Today's Focus: Algebra Practice"
  description: string;
  subject?: string;
  topic?: string;
  priority: 1 | 2 | 3;    // 1 = high
  generatedAt: Date;
  expiresAt: Date;          // next day
  isCompleted: boolean;
}

// ── Weekly Insight ────────────────────────────────────────────
export interface IWeeklyInsight {
  weekKey: string;          // 'YYYY-WW'
  summary: string;          // AI-generated summary text
  topImprovedTopic: string | null;
  topWeakTopic: string | null;
  avgDailyMinutes: number;
  totalXPEarned: number;
  consistencyScore: number; // 0–100 (days active / 7 * 100)
  generatedAt: Date;
}

// ── Main Interface ────────────────────────────────────────────
export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;

  // Learner identity
  learnerCategory: LearnerCategory;
  classLevel: string | null;    // e.g. "Class 10", "B.Tech 2nd Year", null for self
  primarySubjects: string[];    // subjects the learner focuses on
  preferredLanguage: 'english' | 'hinglish';

  // Topic intelligence
  topicMastery: ITopicMastery[];
  weakTopics: string[];          // quick-access list (derived)
  strongTopics: string[];        // quick-access list (derived)

  // Learning speed (auto-measured)
  avgTimePerQuestion: number;    // seconds
  learningSpeed: 'slow' | 'medium' | 'fast';

  // Consistency
  totalStudyDays: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;  // 'YYYY-MM-DD'

  // Performance aggregates
  overallMasteryScore: number;   // 0–100, weighted average
  quizHistory: IQuizPerformance[];

  // Activity log (last 365 days — GitHub-style heatmap)
  dailyLogs: IDailyStudyLog[];

  // AI outputs
  todayRecommendations: IAIRecommendation[];
  weeklyInsights: IWeeklyInsight[];

  // Context for AI Tutor
  recentMistakes: string[];      // last 10 mistake topics
  tutorPersonality: 'simple' | 'normal' | 'advanced'; // auto-set from learnerCategory

  createdAt: Date;
  updatedAt: Date;
}

// ── Topic Mastery Schema ──────────────────────────────────────
const topicMasterySchema = new Schema<ITopicMastery>({
  topic:           { type: String, required: true },
  subject:         { type: String, required: true },
  category:        { type: String, required: true },
  masteryLevel:    { type: Number, default: 0, min: 0, max: 100 },
  correctAttempts: { type: Number, default: 0 },
  totalAttempts:   { type: Number, default: 0 },
  lastAttemptedAt: { type: Date, default: null },
  isWeak:          { type: Boolean, default: false },
  isStrong:        { type: Boolean, default: false },
  trend:           { type: String, enum: ['improving', 'declining', 'stable'], default: 'stable' },
}, { _id: false });

// ── Daily Log Schema ──────────────────────────────────────────
const dailyStudyLogSchema = new Schema<IDailyStudyLog>({
  date:                      { type: String, required: true },
  minutesStudied:            { type: Number, default: 0 },
  questionsAsked:            { type: Number, default: 0 },
  quizzesCompleted:          { type: Number, default: 0 },
  codingSectionsCompleted:   { type: Number, default: 0 },
  xpEarned:                  { type: Number, default: 0 },
  topicsCovered:             { type: [String], default: [] },
}, { _id: false });

// ── Quiz Performance Schema ───────────────────────────────────
const quizPerformanceSchema = new Schema<IQuizPerformance>({
  subject:         { type: String, required: true },
  topic:           { type: String, required: true },
  score:           { type: Number, required: true, min: 0, max: 100 },
  attemptedAt:     { type: Date, default: Date.now },
  totalQuestions:  { type: Number, required: true },
  correctAnswers:  { type: Number, required: true },
}, { _id: false });

// ── AI Recommendation Schema ──────────────────────────────────
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

// ── Weekly Insight Schema ─────────────────────────────────────
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

  // Keep last 50 quiz results
  quizHistory: { type: [quizPerformanceSchema], default: [] },

  // Keep last 365 day logs
  dailyLogs: { type: [dailyStudyLogSchema], default: [] },

  // Today's AI plan (refreshes daily)
  todayRecommendations: { type: [aiRecommendationSchema], default: [] },

  // Last 8 weekly insights
  weeklyInsights: { type: [weeklyInsightSchema], default: [] },

  recentMistakes:   { type: [String], default: [] },
  tutorPersonality: { type: String, enum: ['simple', 'normal', 'advanced'], default: 'normal' },

}, { timestamps: true });

// ── Indexes ───────────────────────────────────────────────────
studentProfileSchema.index({ userId: 1 }, { unique: true });
studentProfileSchema.index({ 'topicMastery.isWeak': 1 });
studentProfileSchema.index({ overallMasteryScore: -1 });

// ── Export ────────────────────────────────────────────────────
export const StudentProfile: Model<IStudentProfile> =
  mongoose.models.StudentProfile ||
  mongoose.model<IStudentProfile>('StudentProfile', studentProfileSchema);