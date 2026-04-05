// ─────────────────────────────────────────────────────────────
// AskAI — conversationMemoryEngine.ts
// Stores conversation context in-process per user session.
// Tracks: last 10 messages, learning context, and user mistakes.
// ─────────────────────────────────────────────────────────────

export interface MemoryMessage {
  role:       'user' | 'assistant';
  content:    string;
  timestamp:  number;
  topic?:     string;
  wasCorrect?: boolean;   // for quiz/problem contexts
}

export interface ConversationMemory {
  userId:          string;
  sessionMessages: MemoryMessage[];
  detectedTopics:  string[];
  mistakeTopics:   string[];    // topics where user showed confusion
  strongTopics:    string[];    // topics user understood well
  lastActivity:    number;
  turnCount:       number;
}

// In-process store — keyed by userId
const memoryStore = new Map<string, ConversationMemory>();

const MAX_MESSAGES       = 10;
const SESSION_TTL_MS     = 30 * 60 * 1000;  // 30-min session TTL

// ── Mistake-detection keywords ─────────────────────────────────
const CONFUSION_SIGNALS = [
  'i don\'t understand', 'i dont understand', "i'm confused", 'confused',
  'not getting it', 'can you explain again', 'still not clear',
  'what does that mean', 'i\'m lost', 'help me understand',
  'samajh nahi', 'samajh nahi aaya', 'kya matlab', 'phir se batao',
];

const MASTERY_SIGNALS = [
  'got it', 'i understand', 'makes sense', 'that\'s clear', 'perfect',
  'thank you', 'i see', 'now i get it', 'samajh gaya', 'samajh gayi',
  'ab samajh aaya', 'clear hai',
];

// ─────────────────────────────────────────────────────────────
// getOrCreate
// ─────────────────────────────────────────────────────────────
export function getOrCreateMemory(userId: string): ConversationMemory {
  const existing = memoryStore.get(userId);
  const now      = Date.now();

  // Session expired → reset
  if (existing && now - existing.lastActivity > SESSION_TTL_MS) {
    memoryStore.delete(userId);
  }

  if (!memoryStore.has(userId)) {
    const fresh: ConversationMemory = {
      userId,
      sessionMessages: [],
      detectedTopics:  [],
      mistakeTopics:   [],
      strongTopics:    [],
      lastActivity:    now,
      turnCount:       0,
    };
    memoryStore.set(userId, fresh);
    // v10: DB history load removed — frontend sends correct chat history
    return fresh;
  }

  return memoryStore.get(userId)!;
}

// ─────────────────────────────────────────────────────────────
// addMessage
// ─────────────────────────────────────────────────────────────
export function addMessage(
  userId:  string,
  role:    'user' | 'assistant',
  content: string,
  topic?:  string,
): void {
  const mem = getOrCreateMemory(userId);

  // Detect confusion or mastery from user messages
  if (role === 'user') {
    const lower = content.toLowerCase();
    if (CONFUSION_SIGNALS.some(s => lower.includes(s)) && topic) {
      if (!mem.mistakeTopics.includes(topic)) mem.mistakeTopics.push(topic);
      // Remove from strong if it was there
      mem.strongTopics = mem.strongTopics.filter(t => t !== topic);
    }
    if (MASTERY_SIGNALS.some(s => lower.includes(s)) && topic) {
      if (!mem.strongTopics.includes(topic)) mem.strongTopics.push(topic);
    }

    if (topic && !mem.detectedTopics.includes(topic)) {
      mem.detectedTopics.push(topic);
    }
    mem.turnCount++;
  }

  mem.sessionMessages.push({ role, content, timestamp: Date.now(), topic });

  // Keep only last N messages
  if (mem.sessionMessages.length > MAX_MESSAGES) {
    mem.sessionMessages = mem.sessionMessages.slice(-MAX_MESSAGES);
  }

  mem.lastActivity = Date.now();
  memoryStore.set(userId, mem);
}

// ─────────────────────────────────────────────────────────────
// getRecentHistory  (for API history array)
// ─────────────────────────────────────────────────────────────
export function getRecentHistory(
  userId: string,
  limit = 10,
): { role: 'user' | 'assistant'; content: string }[] {
  const mem = getOrCreateMemory(userId);
  return mem.sessionMessages
    .slice(-limit)
    .map(m => ({ role: m.role, content: m.content }));
}

// ─────────────────────────────────────────────────────────────
// getMemorySummary  (for prompt injection)
// ─────────────────────────────────────────────────────────────
export function getMemorySummary(userId: string): string {
  const mem = getOrCreateMemory(userId);
  const parts: string[] = [];

  if (mem.turnCount > 0) {
    parts.push(`This is turn #${mem.turnCount + 1} in this session.`);
  }
  if (mem.mistakeTopics.length > 0) {
    parts.push(`Student struggled with: ${mem.mistakeTopics.slice(-3).join(', ')}.`);
  }
  if (mem.strongTopics.length > 0) {
    parts.push(`Student understood well: ${mem.strongTopics.slice(-3).join(', ')}.`);
  }
  if (mem.detectedTopics.length > 0) {
    parts.push(`Topics discussed this session: ${mem.detectedTopics.slice(-5).join(', ')}.`);
  }

  return parts.join(' ');
}

// ─────────────────────────────────────────────────────────────
// clearSession  (on new chat)
// ─────────────────────────────────────────────────────────────
export function clearSession(userId: string): void {
  memoryStore.delete(userId);
}

// ─────────────────────────────────────────────────────────────
// getMistakeTopics
// ─────────────────────────────────────────────────────────────
export function getMistakeTopics(userId: string): string[] {
  return getOrCreateMemory(userId).mistakeTopics;
}