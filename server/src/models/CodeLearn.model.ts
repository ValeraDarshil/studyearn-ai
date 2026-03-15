/**
 * StudyEarn AI — CodeLearn Models (TypeScript)
 * ─────────────────────────────────────────────────────────────
 * 3 schemas:
 *   1. CodeProgress  — user ka per-language progress
 *   2. CodeSubmission — har code submission ka record
 *   3. CodeCertificate — completed language certificates
 */
import mongoose, { Schema, Document, Model } from 'mongoose';

// ── Interfaces ───────────────────────────────────────────────

export interface ISectionProgress {
  sectionId: string;
  weekNumber: number;
  sectionNumber: number;
  completed: boolean;
  quizScore: number | null;
  quizAttempts: number;
  xpEarned: number;
  completedAt: Date | null;
}

export interface ICodeProgress extends Document {
  userId: mongoose.Types.ObjectId;
  language: string;
  totalXP: number;
  currentStreak: number;
  lastActiveDate: string | null;
  currentWeek: number;
  currentSection: number;
  sections: ISectionProgress[];
  certificateIssued: boolean;
  certificateIssuedAt: Date | null;
  startedAt: Date;
  lastUpdatedAt: Date;
}

export interface ICodeSubmission extends Document {
  userId: mongoose.Types.ObjectId;
  language: string;
  sectionId: string;
  code: string;
  isCorrect: boolean;
  aiHintUsed: boolean;
  xpEarned: number;
  submittedAt: Date;
}

export interface ICodeCertificate extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  language: string;
  languageDisplayName: string;
  totalXP: number;
  certificateId: string;
  issuedAt: Date;
}

// ── 1. CODE PROGRESS ────────────────────────────────────────

const sectionProgressSchema = new Schema<ISectionProgress>({
  sectionId:     { type: String,  required: true },
  weekNumber:    { type: Number,  required: true },
  sectionNumber: { type: Number,  required: true },
  completed:     { type: Boolean, default: false },
  quizScore:     { type: Number,  default: null },
  quizAttempts:  { type: Number,  default: 0 },
  xpEarned:      { type: Number,  default: 0 },
  completedAt:   { type: Date,    default: null },
}, { _id: false });

const codeProgressSchema = new Schema<ICodeProgress>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  language: {
    type: String,
    required: true,
    enum: ['python', 'c', 'html', 'css', 'javascript'],
  },
  totalXP:         { type: Number,  default: 0 },
  currentStreak:   { type: Number,  default: 0 },
  lastActiveDate:  { type: String,  default: null },
  currentWeek:     { type: Number,  default: 1 },
  currentSection:  { type: Number,  default: 1 },
  sections:        { type: [sectionProgressSchema], default: [] },
  certificateIssued:   { type: Boolean, default: false },
  certificateIssuedAt: { type: Date,    default: null },
  startedAt:       { type: Date, default: Date.now },
  lastUpdatedAt:   { type: Date, default: Date.now },
}, { timestamps: false });

codeProgressSchema.index({ userId: 1, language: 1 }, { unique: true });

// ── 2. CODE SUBMISSION ──────────────────────────────────────

const codeSubmissionSchema = new Schema<ICodeSubmission>({
  userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  language:   { type: String,  required: true },
  sectionId:  { type: String,  required: true },
  code:       { type: String,  required: true },
  isCorrect:  { type: Boolean, default: false },
  aiHintUsed: { type: Boolean, default: false },
  xpEarned:   { type: Number,  default: 0 },
  submittedAt: { type: Date,   default: Date.now },
});

codeSubmissionSchema.index({ userId: 1, sectionId: 1 });

// ── 3. CERTIFICATE ──────────────────────────────────────────

const codeCertificateSchema = new Schema<ICodeCertificate>({
  userId:              { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName:            { type: String, required: true },
  language:            { type: String, required: true },
  languageDisplayName: { type: String, required: true },
  totalXP:             { type: Number, required: true },
  certificateId:       { type: String, unique: true, required: true },
  issuedAt:            { type: Date, default: Date.now },
});

codeCertificateSchema.index({ userId: 1, language: 1 });

// ── Exports ──────────────────────────────────────────────────

export const CodeProgress: Model<ICodeProgress> =
  mongoose.models.CodeProgress ||
  mongoose.model<ICodeProgress>('CodeProgress', codeProgressSchema);

export const CodeSubmission: Model<ICodeSubmission> =
  mongoose.models.CodeSubmission ||
  mongoose.model<ICodeSubmission>('CodeSubmission', codeSubmissionSchema);

export const CodeCertificate: Model<ICodeCertificate> =
  mongoose.models.CodeCertificate ||
  mongoose.model<ICodeCertificate>('CodeCertificate', codeCertificateSchema);