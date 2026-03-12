import mongoose from 'mongoose';

/**
 * Note Model
 * - Owner creates note, can share with others via username
 * - Collaborators can view + edit
 * - AI Enhance: uses solveText to improve/summarize notes
 * - Points awarded on create + share
 */

const noteSchema = new mongoose.Schema({
  title:       { type: String, required: true, maxlength: 200 },
  content:     { type: String, default: '' },          // rich plain-text with markdown-lite
  subject:     { type: String, default: 'General' },
  emoji:       { type: String, default: '📝' },
  color:       { type: String, default: 'blue' },      // accent color key

  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  ownerName:   { type: String, default: '' },

  // Collaborators: array of { userId, name, canEdit }
  collaborators: [{
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name:     { type: String },
    canEdit:  { type: Boolean, default: false },
    addedAt:  { type: Date, default: Date.now },
  }],

  isPublic:    { type: Boolean, default: false },   // anyone with link can view
  shareCode:   { type: String, default: null, index: true, sparse: true }, // short code for sharing

  tags:        [{ type: String, maxlength: 30 }],
  isPinned:    { type: Boolean, default: false },
  isArchived:  { type: Boolean, default: false },

  // Edit history — last 5 edits
  lastEditBy:  { type: String, default: null },
  lastEditAt:  { type: Date, default: null },

  wordCount:   { type: Number, default: 0 },
  viewCount:   { type: Number, default: 0 },
}, {
  timestamps: true,
});

// Index for fast lookup
noteSchema.index({ owner: 1, createdAt: -1 });
noteSchema.index({ 'collaborators.userId': 1 });

export const Note = mongoose.model('Note', noteSchema);