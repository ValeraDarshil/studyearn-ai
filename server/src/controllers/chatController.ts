// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Chat Controller
// ─────────────────────────────────────────────────────────────
// Conversations ka CRUD — GPT-style chat history
// ─────────────────────────────────────────────────────────────

import { Request, Response } from 'express';
import { Conversation } from '../models/Conversation.model.js';
import { connectDB } from '../config/db.js';
import { logger } from '../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// AI-powered title generator — Groq se smart 4-5 word title
// ─────────────────────────────────────────────────────────────
async function generateTitle(userMessage: string): Promise<string> {
  const GROQ_KEY = process.env.GROQ_API_KEY || '';
  if (!GROQ_KEY) return fallbackTitle(userMessage);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000); // 8 sec timeout

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Generate a short, smart chat title (3-5 words max) for a student's question.
Rules:
- Title must be TOPIC-BASED, not a copy of the question
- No quotes, no punctuation at end
- Be specific: "Newton's Laws of Motion" not "Physics Question"
- Examples:
  "hey what is AI?" → Artificial Intelligence Basics
  "solve x^2 + 5x + 6 = 0" → Quadratic Equation Solution
  "explain photosynthesis with diagram" → Photosynthesis Process Explained
  "what caused world war 2" → World War 2 Causes
  "help me with derivatives" → Calculus Derivatives Help
Respond with ONLY the title, nothing else.`
          },
          { role: 'user', content: userMessage.slice(0, 300) }
        ],
        temperature: 0.3,
        max_tokens: 20,
      }),
    });

    clearTimeout(timer);

    if (!res.ok) return fallbackTitle(userMessage);

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || '';
    // Clean up — remove quotes, extra punctuation
    const clean = raw.replace(/^["']|["']$/g, '').replace(/[.!?]$/, '').trim();
    if (clean.length > 0 && clean.length <= 60) return clean;
  } catch (e: any) {
    logger.debug('generateTitle error:', e.message);
  }
  return fallbackTitle(userMessage);
}

// Fallback: simple keyword extraction if AI fails
function fallbackTitle(text: string): string {
  const clean = text.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = clean.split(' ').filter(w => w.length > 2);
  const skip = new Set(['what', 'when', 'where', 'which', 'how', 'why', 'who', 'the', 'is', 'are', 'was', 'were', 'can', 'does', 'do', 'did', 'will', 'would', 'should', 'could', 'have', 'has', 'had', 'please', 'help', 'tell', 'explain', 'give', 'show', 'me', 'my', 'and', 'or', 'but', 'for', 'with', 'hey', 'hi', 'hello', 'okay', 'aab', 'mujhe', 'batao', 'kya']);
  const keywords = words.filter(w => !skip.has(w.toLowerCase())).slice(0, 5);
  return keywords.length >= 2 ? keywords.join(' ') : clean.slice(0, 50) || 'New Chat';
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

    // Generate smart AI title (async, but don't block conversation creation)
    const title = firstMessage ? await generateTitle(firstMessage) : 'New Chat';

    const convo = await Conversation.create({
      userId,
      title,
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
      if (firstUser?.content) convo.title = await generateTitle(firstUser.content);
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