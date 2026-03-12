/**
 * Notes Routes — /api/notes
 *
 *   GET    /                  → My notes (owned + collaborated)
 *   POST   /                  → Create note
 *   GET    /:id               → Get single note (owner or collaborator)
 *   PUT    /:id               → Update note content/title
 *   DELETE /:id               → Delete note (owner only)
 *   POST   /:id/share         → Generate share code + add collaborator by username
 *   DELETE /:id/collaborator  → Remove collaborator
 *   POST   /:id/ai-enhance    → AI improves/summarizes the note
 *   GET    /shared/:code      → View note by share code (public)
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import { Note } from '../models/Note.model.js';
import { User } from '../models/User.model.js';
import { Activity } from '../models/Activity.model.js';
import { connectDB } from '../config/db.js';
import { solveText } from '../services/aiService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET!;

// ── Auth middleware ───────────────────────────────────────────
function authenticate(req: any, res: any, next: any) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'No token' });
  try {
    const decoded: any = jwt.verify(auth.slice(7), JWT_SECRET);
    req.userId = decoded.userId || decoded.id || decoded._id;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

// ── Generate short share code ─────────────────────────────────
function genShareCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

// ── GET / — all my notes ──────────────────────────────────────
router.get('/', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const notes = await Note.find({
      $or: [
        { owner: req.userId },
        { 'collaborators.userId': req.userId },
      ],
      isArchived: false,
    })
      .sort({ isPinned: -1, updatedAt: -1 })
      .select('-content')   // exclude heavy content from list
      .lean();

    res.json({ success: true, notes });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST / — create note ──────────────────────────────────────
router.post('/', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { title, content = '', subject = 'General', emoji = '📝', color = 'blue', tags = [] } = req.body;
    if (!title?.trim()) return res.status(400).json({ success: false, message: 'Title required' });

    const user = await User.findById(req.userId).lean() as any;
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const note = await Note.create({
      title: title.trim(),
      content,
      subject,
      emoji,
      color,
      tags,
      owner:     req.userId,
      ownerName: user.name || 'Unknown',
      wordCount: content.split(/\s+/).filter(Boolean).length,
    });

    // +5 pts for creating a note
    await User.findByIdAndUpdate(req.userId, { $inc: { points: 5, totalXP: 5 } });
    await Activity.create({
      userId: req.userId, action: 'note_created',
      details: `Created note: ${title.trim()}`, pointsEarned: 5,
    });

    res.json({ success: true, note });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /:id — single note ────────────────────────────────────
router.get('/:id', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const note = await Note.findById(req.params.id).lean() as any;
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    const isOwner = note.owner.toString() === req.userId;
    const isCollab = note.collaborators?.some((c: any) => c.userId.toString() === req.userId);
    if (!isOwner && !isCollab && !note.isPublic)
      return res.status(403).json({ success: false, message: 'Access denied' });

    // Increment view count (not for owner)
    if (!isOwner) {
      await Note.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    }

    res.json({ success: true, note, isOwner, canEdit: isOwner || isCollab });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── PUT /:id — update note ────────────────────────────────────
router.put('/:id', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const note = await Note.findById(req.params.id) as any;
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    const isOwner = note.owner.toString() === req.userId;
    const collab  = note.collaborators?.find((c: any) => c.userId.toString() === req.userId);
    if (!isOwner && !collab?.canEdit)
      return res.status(403).json({ success: false, message: 'No edit permission' });

    const user = await User.findById(req.userId).lean() as any;
    const { title, content, subject, emoji, color, tags, isPinned } = req.body;

    if (title    !== undefined) note.title    = title.trim();
    if (content  !== undefined) { note.content = content; note.wordCount = content.split(/\s+/).filter(Boolean).length; }
    if (subject  !== undefined) note.subject  = subject;
    if (emoji    !== undefined) note.emoji    = emoji;
    if (color    !== undefined) note.color    = color;
    if (tags     !== undefined) note.tags     = tags;
    if (isPinned !== undefined && isOwner) note.isPinned = isPinned;

    note.lastEditBy = user?.name || 'Unknown';
    note.lastEditAt = new Date();
    await note.save();

    res.json({ success: true, note });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── DELETE /:id — delete note (owner only) ────────────────────
router.delete('/:id', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const note = await Note.findById(req.params.id) as any;
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    if (note.owner.toString() !== req.userId)
      return res.status(403).json({ success: false, message: 'Only owner can delete' });

    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /:id/share — share with username ─────────────────────
router.post('/:id/share', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const note = await Note.findById(req.params.id) as any;
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    if (note.owner.toString() !== req.userId)
      return res.status(403).json({ success: false, message: 'Only owner can share' });

    const { username, canEdit = false, makePublic = false } = req.body;

    // Generate share code if not exists
    if (!note.shareCode) {
      let code = genShareCode();
      // Ensure unique
      while (await Note.findOne({ shareCode: code })) { code = genShareCode(); }
      note.shareCode = code;
    }

    if (makePublic) {
      note.isPublic = true;
    }

    // Add collaborator by username if provided
    if (username?.trim()) {
      const targetUser = await User.findOne({
        name: { $regex: new RegExp(`^${username.trim()}$`, 'i') }
      }).lean() as any;

      if (!targetUser) return res.status(404).json({ success: false, message: `User "${username}" not found` });
      if (targetUser._id.toString() === req.userId)
        return res.status(400).json({ success: false, message: 'Cannot add yourself' });

      const alreadyAdded = note.collaborators?.some((c: any) => c.userId.toString() === targetUser._id.toString());
      if (!alreadyAdded) {
        note.collaborators.push({ userId: targetUser._id, name: targetUser.name, canEdit, addedAt: new Date() });

        // +10 pts for sharing
        await User.findByIdAndUpdate(req.userId, { $inc: { points: 10, totalXP: 10 } });
        await Activity.create({
          userId: req.userId, action: 'note_shared',
          details: `Shared note "${note.title}" with ${targetUser.name}`, pointsEarned: 10,
        });
      }
    }

    await note.save();
    res.json({ success: true, shareCode: note.shareCode, isPublic: note.isPublic, collaborators: note.collaborators });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── DELETE /:id/collaborator — remove collaborator ────────────
router.delete('/:id/collaborator', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const { userId: removeId } = req.body;
    const note = await Note.findById(req.params.id) as any;
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    if (note.owner.toString() !== req.userId)
      return res.status(403).json({ success: false, message: 'Only owner can remove collaborators' });

    note.collaborators = note.collaborators.filter((c: any) => c.userId.toString() !== removeId);
    await note.save();
    res.json({ success: true, collaborators: note.collaborators });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /:id/ai-enhance — AI improves note ───────────────────
router.post('/:id/ai-enhance', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const note = await Note.findById(req.params.id) as any;
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    const isOwner = note.owner.toString() === req.userId;
    const collab  = note.collaborators?.find((c: any) => c.userId.toString() === req.userId);
    if (!isOwner && !collab?.canEdit) return res.status(403).json({ success: false, message: 'No permission' });
    if (!note.content?.trim()) return res.status(400).json({ success: false, message: 'Note is empty' });

    const { mode = 'improve' } = req.body; // improve | summarize | expand | bullets

    const prompts: Record<string, string> = {
      improve:   `Improve and clean up these student notes. Fix grammar, improve clarity, organize content better. Keep all key information. Return only the improved notes:\n\n${note.content}`,
      summarize: `Summarize these notes into key points for exam revision. Use bullet points. Be concise:\n\n${note.content}`,
      expand:    `Expand these notes with more detail and examples. Add relevant context that would help an Indian student preparing for exams:\n\n${note.content}`,
      bullets:   `Convert these notes into clear bullet points organized by topic:\n\n${note.content}`,
    };

    const enhanced = await solveText(prompts[mode] || prompts.improve, []);

    res.json({ success: true, enhanced });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /shared/:code — public view by share code ─────────────
router.get('/shared/:code', authenticate, async (req: any, res) => {
  try {
    await connectDB();
    const note = await Note.findOne({ shareCode: req.params.code.toUpperCase() }).lean() as any;
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    const isOwner  = note.owner.toString() === req.userId;
    const isCollab = note.collaborators?.some((c: any) => c.userId.toString() === req.userId);
    if (!note.isPublic && !isOwner && !isCollab)
      return res.status(403).json({ success: false, message: 'This note is private' });

    await Note.findByIdAndUpdate(note._id, { $inc: { viewCount: 1 } });
    res.json({ success: true, note, isOwner, canEdit: isOwner || isCollab });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;