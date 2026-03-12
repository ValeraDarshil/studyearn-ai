import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title:       { type: String, required: true, maxlength: 200 },
  content:     { type: String, default: '' },
  format:      { type: String, enum: ['rich', 'markdown', 'flashcards'], default: 'rich' },
  subject:     { type: String, default: 'General' },
  emoji:       { type: String, default: '📝' },
  color:       { type: String, default: 'blue' },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  ownerName:   { type: String, default: '' },
  collaborators: [{
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name:    { type: String },
    canEdit: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now },
  }],
  isPublic:   { type: Boolean, default: false },
  shareCode:  { type: String, default: null, index: true, sparse: true },
  tags:       [{ type: String, maxlength: 30 }],
  isPinned:   { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  version:    { type: Number, default: 0 },
  lastEditBy: { type: String, default: null },
  lastEditAt: { type: Date, default: null },
  comments:   { type: mongoose.Schema.Types.Mixed, default: [] },
  reactions:  { type: mongoose.Schema.Types.Mixed, default: {} },
  wordCount:  { type: Number, default: 0 },
  viewCount:  { type: Number, default: 0 },
}, { timestamps: true });

noteSchema.index({ owner: 1, createdAt: -1 });
noteSchema.index({ 'collaborators.userId': 1 });

export const Note = mongoose.model('Note', noteSchema);