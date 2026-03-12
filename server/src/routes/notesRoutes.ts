/**
 * Notes Routes — /api/notes
 * GET    /              → My notes list
 * POST   /              → Create note
 * GET    /:id           → Single note (with version check)
 * GET    /:id/poll?v=N  → Real-time poll — returns note only if version > N
 * PUT    /:id           → Update content/title (increments version)
 * DELETE /:id           → Delete (owner only)
 * POST   /:id/share     → Share by username / make public
 * DELETE /:id/collab    → Remove collaborator
 * POST   /:id/comment   → Add comment
 * PUT    /:id/comment/:cid → Resolve/edit comment
 * DELETE /:id/comment/:cid → Delete comment
 * POST   /:id/react     → Toggle emoji reaction
 * POST   /:id/ai        → AI enhance (improve/summarize/expand/bullets/flashcards)
 * GET    /shared/:code  → View by share code
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import { Note } from '../models/Note.model.js';
import { User } from '../models/User.model.js';
import { Activity } from '../models/Activity.model.js';
import { connectDB } from '../config/db.js';
import { solveText } from '../services/aiService.js';
import { v4 as uuid } from 'uuid';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET!;

function authenticate(req: any, res: any, next: any) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'No token' });
  try {
    const d: any = jwt.verify(auth.slice(7), JWT_SECRET);
    req.userId = d.userId || d.id || d._id;
    next();
  } catch { res.status(401).json({ success: false, message: 'Invalid token' }); }
}

function genCode(): string { return Math.random().toString(36).slice(2, 8).toUpperCase(); }

function canView(note: any, userId: string) {
  return note.owner.toString() === userId ||
    note.collaborators?.some((c: any) => c.userId.toString() === userId) ||
    note.isPublic;
}
function canEdit(note: any, userId: string) {
  if (note.owner.toString() === userId) return true;
  const c = note.collaborators?.find((c: any) => c.userId.toString() === userId);
  return !!c?.canEdit;
}

// ── GET / ─────────────────────────────────────────────────────
router.get('/', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const notes = await Note.find({
      $or: [{ owner: req.userId }, { 'collaborators.userId': req.userId }],
      isArchived: false,
    }).sort({ isPinned: -1, updatedAt: -1 }).select('-content').lean();
    res.json({ success: true, notes });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ── POST / ────────────────────────────────────────────────────
router.post('/', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { title, content = '', format = 'rich', subject = 'General', emoji = '📝', color = 'blue', tags = [] } = req.body;
    if (!title?.trim()) return res.status(400).json({ success: false, message: 'Title required' });
    const user = await User.findById(req.userId).lean() as any;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const note = await Note.create({
      title: title.trim(), content, format, subject, emoji, color, tags,
      owner: req.userId, ownerName: user.name || 'Unknown',
      wordCount: content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length,
    });

    await User.findByIdAndUpdate(req.userId, { $inc: { points: 5, totalXP: 5 } });
    await Activity.create({ userId: req.userId, action: 'note_created', details: `Created note: ${title.trim()}`, pointsEarned: 5 });
    res.json({ success: true, note });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ── GET /:id ──────────────────────────────────────────────────
router.get('/:id', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const note = await Note.findById(req.params.id).lean() as any;
    if (!note) return res.status(404).json({ success: false, message: 'Not found' });
    if (!canView(note, req.userId)) return res.status(403).json({ success: false, message: 'Access denied' });
    if (note.owner.toString() !== req.userId)
      await Note.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    res.json({ success: true, note, isOwner: note.owner.toString() === req.userId, canEdit: canEdit(note, req.userId) });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ── GET /:id/poll?v=N — lightweight real-time poll ────────────
router.get('/:id/poll', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const clientVersion = parseInt(req.query.v as string) || 0;
    const note = await Note.findById(req.params.id).lean() as any;
    if (!note) return res.status(404).json({ success: false });
    if (!canView(note, req.userId)) return res.status(403).json({ success: false });
    // Only return full data if version changed
    if ((note.version || 0) <= clientVersion) {
      return res.json({ success: true, changed: false, version: note.version || 0 });
    }
    res.json({ success: true, changed: true, note, version: note.version || 0 });
  } catch { res.status(500).json({ success: false }); }
});

// ── PUT /:id ──────────────────────────────────────────────────
router.put('/:id', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const noteDoc = await Note.findById(req.params.id) as any;
    if (!noteDoc) return res.status(404).json({ success: false, message: 'Not found' });
    if (!canEdit(noteDoc, req.userId)) return res.status(403).json({ success: false, message: 'No edit permission' });

    const user = await User.findById(req.userId).lean() as any;
    const { title, content, format, subject, emoji, color, tags, isPinned } = req.body;

    if (title   !== undefined) noteDoc.title   = title.trim();
    if (content !== undefined) {
      noteDoc.content   = content;
      noteDoc.wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    }
    if (format  !== undefined) noteDoc.format  = format;
    if (subject !== undefined) noteDoc.subject = subject;
    if (emoji   !== undefined) noteDoc.emoji   = emoji;
    if (color   !== undefined) noteDoc.color   = color;
    if (tags    !== undefined) noteDoc.tags    = tags;
    if (isPinned !== undefined && noteDoc.owner.toString() === req.userId) noteDoc.isPinned = isPinned;

    noteDoc.lastEditBy = user?.name || 'Unknown';
    noteDoc.lastEditAt = new Date();
    noteDoc.version    = (noteDoc.version || 0) + 1;
    noteDoc.markModified('content');
    await noteDoc.save();
    res.json({ success: true, note: noteDoc.toObject(), version: noteDoc.version });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ── DELETE /:id ───────────────────────────────────────────────
router.delete('/:id', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const note = await Note.findById(req.params.id) as any;
    if (!note) return res.status(404).json({ success: false });
    if (note.owner.toString() !== req.userId) return res.status(403).json({ success: false, message: 'Owner only' });
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ success: false }); }
});

// ── POST /:id/share ───────────────────────────────────────────
router.post('/:id/share', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const note = await Note.findById(req.params.id) as any;
    if (!note) return res.status(404).json({ success: false, message: 'Not found' });
    if (note.owner.toString() !== req.userId) return res.status(403).json({ success: false, message: 'Owner only' });

    const { username, canEdit: allowEdit = false, makePublic = false } = req.body;

    if (!note.shareCode) {
      let code = genCode();
      while (await Note.findOne({ shareCode: code })) code = genCode();
      note.shareCode = code;
    }
    if (makePublic) note.isPublic = true;

    if (username?.trim()) {
      const target = await User.findOne({ name: { $regex: new RegExp(`^${username.trim()}$`, 'i') } }).lean() as any;
      if (!target) return res.status(404).json({ success: false, message: `User "${username}" not found` });
      if (target._id.toString() === req.userId) return res.status(400).json({ success: false, message: 'Cannot add yourself' });

      const already = note.collaborators?.some((c: any) => c.userId.toString() === target._id.toString());
      if (!already) {
        note.collaborators.push({ userId: target._id, name: target.name, canEdit: allowEdit, addedAt: new Date() });
        await User.findByIdAndUpdate(req.userId, { $inc: { points: 10, totalXP: 10 } });
        await Activity.create({ userId: req.userId, action: 'note_shared', details: `Shared "${note.title}" with ${target.name}`, pointsEarned: 10 });
      } else {
        // Update permission
        const idx = note.collaborators.findIndex((c: any) => c.userId.toString() === target._id.toString());
        if (idx >= 0) note.collaborators[idx].canEdit = allowEdit;
      }
    }

    note.markModified('collaborators');
    await note.save();
    res.json({ success: true, shareCode: note.shareCode, isPublic: note.isPublic, collaborators: note.collaborators });
  } catch { res.status(500).json({ success: false, message: 'Server error' }); }
});

// ── DELETE /:id/collab ────────────────────────────────────────
router.delete('/:id/collab', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { userId: removeId } = req.body;
    const note = await Note.findById(req.params.id) as any;
    if (!note) return res.status(404).json({ success: false });
    if (note.owner.toString() !== req.userId) return res.status(403).json({ success: false });
    note.collaborators = note.collaborators.filter((c: any) => c.userId.toString() !== removeId);
    note.markModified('collaborators');
    await note.save();
    res.json({ success: true, collaborators: note.collaborators });
  } catch { res.status(500).json({ success: false }); }
});

// ── POST /:id/comment ─────────────────────────────────────────
router.post('/:id/comment', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const note = await Note.findById(req.params.id) as any;
    if (!note) return res.status(404).json({ success: false });
    if (!canView(note, req.userId)) return res.status(403).json({ success: false });

    const user = await User.findById(req.userId).lean() as any;
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: 'Comment text required' });

    const comment = { id: uuid(), userId: req.userId, userName: user?.name || 'Unknown', text: text.trim(), createdAt: new Date().toISOString(), resolved: false };
    const comments: any[] = note.comments || [];
    comments.push(comment);
    note.comments = comments;
    note.version  = (note.version || 0) + 1;
    note.markModified('comments');
    await note.save();
    res.json({ success: true, comment, comments: note.comments });
  } catch { res.status(500).json({ success: false }); }
});

// ── DELETE /:id/comment/:cid ──────────────────────────────────
router.delete('/:id/comment/:cid', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const note = await Note.findById(req.params.id) as any;
    if (!note) return res.status(404).json({ success: false });
    const comments: any[] = note.comments || [];
    const idx = comments.findIndex((c: any) => c.id === req.params.cid);
    if (idx < 0) return res.status(404).json({ success: false });
    const isNoteOwner = note.owner.toString() === req.userId;
    const isCommentOwner = comments[idx].userId.toString() === req.userId;
    if (!isNoteOwner && !isCommentOwner) return res.status(403).json({ success: false });
    comments.splice(idx, 1);
    note.comments = comments;
    note.version  = (note.version || 0) + 1;
    note.markModified('comments');
    await note.save();
    res.json({ success: true, comments: note.comments });
  } catch { res.status(500).json({ success: false }); }
});

// ── POST /:id/react ───────────────────────────────────────────
router.post('/:id/react', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const note = await Note.findById(req.params.id) as any;
    if (!note) return res.status(404).json({ success: false });
    if (!canView(note, req.userId)) return res.status(403).json({ success: false });

    const user = await User.findById(req.userId).lean() as any;
    const { emoji } = req.body;
    if (!emoji) return res.status(400).json({ success: false });

    const reactions: any = note.reactions || {};
    if (!reactions[emoji]) reactions[emoji] = [];
    const idx = reactions[emoji].findIndex((r: any) => r.userId.toString() === req.userId);
    if (idx >= 0) {
      reactions[emoji].splice(idx, 1);                              // toggle off
      if (reactions[emoji].length === 0) delete reactions[emoji];
    } else {
      reactions[emoji].push({ userId: req.userId, name: user?.name || 'Unknown' }); // toggle on
    }
    note.reactions = reactions;
    note.version   = (note.version || 0) + 1;
    note.markModified('reactions');
    await note.save();
    res.json({ success: true, reactions: note.reactions });
  } catch { res.status(500).json({ success: false }); }
});

// ── POST /:id/ai ──────────────────────────────────────────────
router.post('/:id/ai', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const note = await Note.findById(req.params.id).lean() as any;
    if (!note) return res.status(404).json({ success: false });
    if (!canEdit(note, req.userId)) return res.status(403).json({ success: false });

    const rawText = (note.content || '').replace(/<[^>]*>/g, '').trim();
    if (!rawText) return res.status(400).json({ success: false, message: 'Note is empty' });

    const { mode = 'improve' } = req.body;

    const prompts: Record<string, string> = {
      improve:    `Improve and clean up these student notes. Fix grammar, improve clarity, organize content. Keep all key info. Return improved notes only:\n\n${rawText}`,
      summarize:  `Summarize these notes into key bullet points for exam revision. Be concise:\n\n${rawText}`,
      expand:     `Expand these notes with more detail and examples for Indian competitive exam prep:\n\n${rawText}`,
      bullets:    `Convert these notes into clear bullet points organized by topic:\n\n${rawText}`,
      flashcards: `Create 5-8 flashcard pairs from these notes. Format EXACTLY as JSON array:\n[{"q":"question","a":"answer"},...]\nReturn ONLY the JSON, no other text:\n\n${rawText}`,
      quiz:       `Generate 3 MCQs from these notes for self-testing. Format as JSON:\n[{"q":"question","opts":["A","B","C","D"],"ans":0},...]\nReturn ONLY JSON:\n\n${rawText}`,
    };

    const result = await solveText(prompts[mode] || prompts.improve, []);
    res.json({ success: true, result, mode });
  } catch { res.status(500).json({ success: false, message: 'AI error' }); }
});

// ── GET /shared/:code ─────────────────────────────────────────
router.get('/shared/:code', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const note = await Note.findOne({ shareCode: req.params.code.toUpperCase() }).lean() as any;
    if (!note) return res.status(404).json({ success: false, message: 'Not found' });
    if (!canView(note, req.userId)) return res.status(403).json({ success: false, message: 'Private note' });
    await Note.findByIdAndUpdate(note._id, { $inc: { viewCount: 1 } });
    res.json({ success: true, note, isOwner: note.owner.toString() === req.userId, canEdit: canEdit(note, req.userId) });
  } catch { res.status(500).json({ success: false }); }
});

export default router;