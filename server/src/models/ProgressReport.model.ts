/**
 * AI Study OS — Progress Report Model
 * ─────────────────────────────────────────────────────────────
 * Stores AI-generated progress intelligence reports.
 * Weekly insights, performance alerts, improvement suggestions.
 *
 * Examples:
 *   "Your focus dropped in the last 7 days"
 *   "Math performance improved by 18%"
 *   "You are improving in JavaScript"
 *   "Physics needs more practice"
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export type ReportPeriod = 'daily' | 'weekly' | 'monthly';
export type AlertType = 'improvement' | 'decline' | 'streak' | 'milestone' | 'warning';

export interface IPerformanceAlert {
  type: AlertType;
  title: string;           // e.g. "Math performance improved by 18%"
  description: string;
  subject?: string;
  topic?: string;
  changePercent?: number;  // +18 or -12
  generatedAt: Date;
  isRead: boolean;
}

export interface ISubjectBreakdown {
  subject: string;
  masteryStart: number;   // score at period start
  masteryEnd: number;     // score at period end
  change: number;         // masteryEnd - masteryStart
  quizzesTaken: number;
  avgScore: number;
  timeSpentMinutes: number;
  topicsCovered: string[];
  weakTopics: string[];
}

export interface IProgressReport extends Document {
  userId: mongoose.Types.ObjectId;
  period: ReportPeriod;
  periodKey: string;       // 'YYYY-MM-DD' daily | 'YYYY-WW' weekly | 'YYYY-MM' monthly

  // Headline summary (AI-generated)
  headline: string;        // e.g. "Good week! You improved in 3 subjects."
  summaryText: string;     // 2–3 sentence AI narrative

  // Performance metrics for period
  totalStudyMinutes: number;
  totalQuestionsAsked: number;
  totalQuizzesTaken: number;
  totalXPEarned: number;
  avgDailyMinutes: number;
  consistencyScore: number;  // 0–100

  // Streak data
  streakAtEnd: number;
  maxStreakThisPeriod: number;

  // Subject-level breakdown
  subjectBreakdowns: ISubjectBreakdown[];

  // AI-generated alerts
  alerts: IPerformanceAlert[];

  // AI suggestions (next steps)
  suggestions: string[];    // e.g. ["Focus more on Algebra", "Try advanced Python exercises"]

  // Overall scores
  overallScoreStart: number;
  overallScoreEnd: number;
  overallChange: number;

  generatedByAI: boolean;
  generatedAt: Date;
  createdAt: Date;
}

const performanceAlertSchema = new Schema<IPerformanceAlert>({
  type:          { type: String, enum: ['improvement', 'decline', 'streak', 'milestone', 'warning'], required: true },
  title:         { type: String, required: true },
  description:   { type: String, required: true },
  subject:       { type: String, default: null },
  topic:         { type: String, default: null },
  changePercent: { type: Number, default: null },
  generatedAt:   { type: Date, default: Date.now },
  isRead:        { type: Boolean, default: false },
}, { _id: false });

const subjectBreakdownSchema = new Schema<ISubjectBreakdown>({
  subject:            { type: String, required: true },
  masteryStart:       { type: Number, default: 0 },
  masteryEnd:         { type: Number, default: 0 },
  change:             { type: Number, default: 0 },
  quizzesTaken:       { type: Number, default: 0 },
  avgScore:           { type: Number, default: 0 },
  timeSpentMinutes:   { type: Number, default: 0 },
  topicsCovered:      { type: [String], default: [] },
  weakTopics:         { type: [String], default: [] },
}, { _id: false });

const progressReportSchema = new Schema<IProgressReport>({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  period:    { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  periodKey: { type: String, required: true },

  headline:    { type: String, required: true },
  summaryText: { type: String, required: true },

  totalStudyMinutes:    { type: Number, default: 0 },
  totalQuestionsAsked:  { type: Number, default: 0 },
  totalQuizzesTaken:    { type: Number, default: 0 },
  totalXPEarned:        { type: Number, default: 0 },
  avgDailyMinutes:      { type: Number, default: 0 },
  consistencyScore:     { type: Number, default: 0 },

  streakAtEnd:          { type: Number, default: 0 },
  maxStreakThisPeriod:  { type: Number, default: 0 },

  subjectBreakdowns: { type: [subjectBreakdownSchema], default: [] },
  alerts:            { type: [performanceAlertSchema], default: [] },
  suggestions:       { type: [String], default: [] },

  overallScoreStart: { type: Number, default: 0 },
  overallScoreEnd:   { type: Number, default: 0 },
  overallChange:     { type: Number, default: 0 },

  generatedByAI: { type: Boolean, default: true },
  generatedAt:   { type: Date, default: Date.now },

}, { timestamps: { createdAt: true, updatedAt: false } });

progressReportSchema.index({ userId: 1, period: 1, periodKey: -1 });
progressReportSchema.index({ userId: 1, generatedAt: -1 });

export const ProgressReport: Model<IProgressReport> =
  mongoose.models.ProgressReport ||
  mongoose.model<IProgressReport>('ProgressReport', progressReportSchema);