// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Chat Controller
// ─────────────────────────────────────────────────────────────
// Conversations ka CRUD — GPT-style chat history
// ─────────────────────────────────────────────────────────────

import { Request, Response } from 'express';
import { Conversation } from '../models/Conversation.model.js';
import { connectDB } from '../config/db.js';
import { logger } from '../utils/logger.js';

// Helper: Title generate karo from first user message
function makeTitle(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > 60 ? clean.slice(0, 57) + '…' : clean || 'New Chat';
}

// ─────────────────────────────────────────────────────────────
// GET /api/chat/conversations
// Last 30 days ki saari conversations (sidebar ke liye)
// ─────────────────────────────────────────────────────────────
export async function getConversations(req: Request, res: Response) {
  try {
    await connectDB();
    const userId = req.userId!;

    const conversations = await Conversation.find({
      userId,
      deletedAt: null,
    })
      .sort({ lastMessageAt: -1 })
      .select('title lastMessageAt createdAt')  // sirf sidebar ke liye zaruri fields
      .limit(100)
      .lean();

    res.json({ success: true, conversations });
  } catch (err: any) {
    logger.error('getConversations error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load conversations' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/chat/conversations/:id
// Ek specific conversation ke saare messages
// ─────────────────────────────────────────────────────────────
export async function getConversation(req: Request, res: Response) {
  try {
    await connectDB();
    const { id } = req.params;
    const userId = req.userId!;

    const convo = await Conversation.findOne({ _id: id, userId, deletedAt: null }).lean();
    if (!convo) return res.status(404).json({ success: false, message: 'Conversation not found' });

    res.json({ success: true, conversation: convo });
  } catch (err: any) {
    logger.error('getConversation error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load conversation' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/chat/conversations
// Naya conversation create karo (first message ke saath)
// ─────────────────────────────────────────────────────────────
export async function createConversation(req: Request, res: Response) {
  try {
    await connectDB();
    const userId = req.userId!;
    const { firstMessage } = req.body; // optional — title ke liye

    const convo = await Conversation.create({
      userId,
      title: firstMessage ? makeTitle(firstMessage) : 'New Chat',
      messages: [],
      lastMessageAt: new Date(),
    });

    res.json({ success: true, conversation: convo });
  } catch (err: any) {
    logger.error('createConversation error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to create conversation' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/chat/conversations/:id/messages
// Conversation mein messages append karo (user + assistant)
// aiController ask karne ke BAAD yeh call hota hai
// ─────────────────────────────────────────────────────────────
export async function appendMessages(req: Request, res: Response) {
  try {
    await connectDB();
    const { id } = req.params;
    const userId = req.userId!;
    const { messages } = req.body; // Array of { role, content, fileName?, fileType?, pointsAwarded?, isError? }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'messages array required' });
    }

    const convo = await Conversation.findOne({ _id: id, userId, deletedAt: null });
    if (!convo) return res.status(404).json({ success: false, message: 'Conversation not found' });

    // Sanitize & append messages
    for (const m of messages) {
      if (!m.role || !m.content) continue;
      convo.messages.push({
        role:          m.role,
        content:       m.content.slice(0, 20000), // max 20k chars per message
        fileName:      m.fileName      || null,
        fileType:      m.fileType      || null,
        pointsAwarded: m.pointsAwarded || null,
        isError:       m.isError       || false,
      } as any);
    }

    // Update title from first user message (if still default)
    if (convo.title === 'New Chat') {
      const firstUser = messages.find((m: any) => m.role === 'user');
      if (firstUser?.content) convo.title = makeTitle(firstUser.content);
    }

    convo.lastMessageAt = new Date();

    // Keep max 200 messages per conversation (prevent bloat)
    if (convo.messages.length > 200) {
      convo.messages = convo.messages.slice(-200) as any;
    }

    await convo.save();
    res.json({ success: true, title: convo.title });
  } catch (err: any) {
    logger.error('appendMessages error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to save messages' });
  }
}

// ─────────────────────────────────────────────────────────────
// PATCH /api/chat/conversations/:id/title
// Title rename karo
// ─────────────────────────────────────────────────────────────
export async function renameConversation(req: Request, res: Response) {
  try {
    await connectDB();
    const { id } = req.params;
    const userId = req.userId!;
    const { title } = req.body;

    if (!title?.trim()) return res.status(400).json({ success: false, message: 'Title required' });

    await Conversation.updateOne(
      { _id: id, userId, deletedAt: null },
      { title: title.trim().slice(0, 80) }
    );

    res.json({ success: true });
  } catch (err: any) {
    logger.error('renameConversation error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to rename' });
  }
}

// ─────────────────────────────────────────────────────────────
// DELETE /api/chat/conversations/:id
// Soft delete — sidebar se hatao
// ─────────────────────────────────────────────────────────────
export async function deleteConversation(req: Request, res: Response) {
  try {
    await connectDB();
    const { id } = req.params;
    const userId = req.userId!;

    await Conversation.updateOne(
      { _id: id, userId },
      { deletedAt: new Date() }
    );

    res.json({ success: true });
  } catch (err: any) {
    logger.error('deleteConversation error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete' });
  }
}