/**
 * AI Study OS — Learning Path Model
 * ─────────────────────────────────────────────────────────────
 * Stores AI-generated personalized learning paths for each learner.
 * Each path is dynamic — the AI updates it as the learner progresses.
 *
 * School   → Study plans, revision schedules, concept practice
 * Coding   → Exercises, project suggestions, skill progression
 * College  → Concept breakdown, advanced quizzes, practice roadmaps
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export type PathStatus = 'active' | 'completed' | 'paused' | 'archived';
export type StepType =
  | 'learn_concept'
  | 'practice_quiz'
  | 'coding_exercise'
  | 'revision'
  | 'project'
  | 'mock_test'
  | 'rest_day';

export interface IPathStep {
  stepId: string;
  type: StepType;
  title: string;
  subject: string;
  topic: string;
  description: string;
  estimatedMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isCompleted: boolean;
  completedAt: Date | null;
  xpReward: number;
  // For coding steps
  codeLanguage?: string;
  // For quizzes
  quizTopic?: string;
  quizDifficulty?: string;
}

export interface ILearningPath extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;             // e.g. "Your 7-Day Algebra Mastery Plan"
  description: string;
  learnerCategory: string;
  subject: string;           // primary subject of this path
  focusTopics: string[];     // topics this path targets
  weekNumber: number;        // which week this plan is for
  startDate: string;         // 'YYYY-MM-DD'
  endDate: string;

  steps: IPathStep[];
  totalSteps: number;
  completedSteps: number;
  progressPercent: number;

  status: PathStatus;
  adaptiveDifficulty: 'beginner' | 'intermediate' | 'advanced';

  // AI metadata
  generatedByAI: boolean;
  aiModel: string;
  generatedAt: Date;
  lastAdaptedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const pathStepSchema = new Schema<IPathStep>({
  stepId:           { type: String, required: true },
  type:             { type: String, required: true },
  title:            { type: String, required: true },
  subject:          { type: String, required: true },
  topic:            { type: String, required: true },
  description:      { type: String, required: true },
  estimatedMinutes: { type: Number, default: 20 },
  difficulty:       { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  isCompleted:      { type: Boolean, default: false },
  completedAt:      { type: Date, default: null },
  xpReward:         { type: Number, default: 25 },
  codeLanguage:     { type: String, default: null },
  quizTopic:        { type: String, default: null },
  quizDifficulty:   { type: String, default: null },
}, { _id: false });

const learningPathSchema = new Schema<ILearningPath>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  title:            { type: String, required: true },
  description:      { type: String, required: true },
  learnerCategory:  { type: String, required: true },
  subject:          { type: String, required: true },
  focusTopics:      { type: [String], default: [] },
  weekNumber:       { type: Number, default: 1 },
  startDate:        { type: String, required: true },
  endDate:          { type: String, required: true },

  steps:            { type: [pathStepSchema], default: [] },
  totalSteps:       { type: Number, default: 0 },
  completedSteps:   { type: Number, default: 0 },
  progressPercent:  { type: Number, default: 0 },

  status:               { type: String, enum: ['active', 'completed', 'paused', 'archived'], default: 'active' },
  adaptiveDifficulty:   { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },

  generatedByAI:  { type: Boolean, default: true },
  aiModel:        { type: String, default: '' },
  generatedAt:    { type: Date, default: Date.now },
  lastAdaptedAt:  { type: Date, default: Date.now },

}, { timestamps: true });

learningPathSchema.index({ userId: 1, status: 1 });
learningPathSchema.index({ userId: 1, startDate: -1 });

export const LearningPath: Model<ILearningPath> =
  mongoose.models.LearningPath ||
  mongoose.model<ILearningPath>('LearningPath', learningPathSchema);