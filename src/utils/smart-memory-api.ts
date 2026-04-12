/**
 * smart-memory-api.ts
 * ─────────────────────────────────────────────────────────────
 * ROUTE: src/utils/smart-memory-api.ts
 *
 * GAP #2 FIX — Smart Semantic Memory (not context stuffing)
 *
 * What this does:
 *   1. Maintains a local in-memory semantic index of the conversation
 *   2. Retrieves only the MOST RELEVANT past memories for any query
 *   3. Ranks memories by: topic match + recency + importance
 *   4. Produces a compact, ranked context block (NOT a full dump)
 *   5. Also calls backend for long-term cross-session memories
 *
 * Key difference vs old approach:
 *   OLD: "Here are all 20 messages from your history" (noise)
 *   NEW: "Here are the 3 most relevant past interactions for THIS question"
 *
 * Backend endpoints this calls (you need to create these):
 *   POST /api/memory/store   — save a memory unit
 *   POST /api/memory/search  — semantic search over memories
 *   GET  /api/memory/profile — get student's long-term memory profile
 *
 * If backend is not ready, local in-session memory still works perfectly.
 * ─────────────────────────────────────────────────────────────
 */

const API_URL = import.meta.env.VITE_API_URL as string;

function authHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Types ────────────────────────────────────────────────────

export type MemoryType =
  | "concept_explained"     // AI explained a concept
  | "mistake_made"          // Student got something wrong
  | "concept_mastered"      // Student demonstrated understanding
  | "question_asked"        // Important question the student asked
  | "weakness_identified"   // AI detected a weak area
  | "strength_identified"   // AI detected a strong area
  | "style_preference"      // Student chose a learning style
  | "emotional_state";      // Student was confused/frustrated/motivated

export interface MemoryUnit {
  id:           string;
  type:         MemoryType;
  topic:        string;          // e.g. "recursion", "photosynthesis"
  subject:      string;          // e.g. "coding", "science", "math"
  summary:      string;          // compact 1-2 sentence summary
  keywords:     string[];        // extracted keywords for matching
  importance:   number;          // 1-5 (5 = most important)
  createdAt:    number;          // timestamp ms
  turnIndex:    number;          // which conversation turn
  convoId:      string | null;
}

export interface MemorySearchResult {
  memory:        MemoryUnit;
  relevanceScore: number;       // 0-1, how relevant to current query
  reason:        string;        // "topic match", "recent mistake", etc.
}

export interface StudentMemoryProfile {
  totalMemories:       number;
  topTopics:           string[];        // most discussed topics
  persistentWeaknesses: string[];       // topics consistently weak
  recentMistakes:      string[];        // last 5 mistakes
  learningStyle:       string | null;   // "beginner" | "real-world" | "future"
  preferredLanguage:   "english" | "hinglish";
  avgSessionLength:    number;          // turns per session
  lastActiveTopics:    string[];        // last 3 session topics
}

// ─── Local In-Session Memory Store ───────────────────────────
// Holds memories for the current session. Fast, no network needed.
// Backend stores memories long-term across sessions.

const sessionMemories: MemoryUnit[] = [];
let memoryIdCounter = 0;

// ─── Core Functions ───────────────────────────────────────────

/**
 * storeMemory — saves a memory unit (session + backend)
 *
 * Usage in AskAI.tsx:
 *   After each AI response, call this to store what was taught/learned.
 */
export async function storeMemory(
  params: Omit<MemoryUnit, "id" | "createdAt">
): Promise<MemoryUnit> {
  const memory: MemoryUnit = {
    ...params,
    id:        `mem_${++memoryIdCounter}_${Date.now()}`,
    createdAt: Date.now(),
  };

  // Save locally (always works)
  sessionMemories.push(memory);

  // Send to backend (fire-and-forget)
  try {
    await fetch(`${API_URL}/api/memory/store`, {
      method:  "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body:    JSON.stringify(memory),
    });
  } catch {
    // Silent fail — local memory still available
  }

  return memory;
}

/**
 * extractKeywords — pulls keywords from a text string
 * Simple keyword extractor — no NLP library needed.
 * Filters stop words, extracts meaningful terms.
 */
export function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been",
    "have", "has", "had", "do", "does", "did", "will", "would",
    "can", "could", "should", "may", "might", "shall", "must",
    "and", "or", "but", "if", "then", "so", "yet", "for", "nor",
    "at", "by", "in", "of", "on", "to", "up", "as", "it", "its",
    "this", "that", "these", "those", "i", "you", "he", "she",
    "we", "they", "me", "him", "her", "us", "them", "my", "your",
    "his", "our", "their", "what", "which", "who", "how", "when",
    "where", "why", "all", "any", "both", "each", "more", "most",
    "other", "some", "such", "with", "about", "into", "through",
    "during", "before", "after", "above", "below", "between",
    "mein", "hai", "hain", "ka", "ki", "ke", "se", "ko", "ne",
    "jo", "kya", "aur", "ya", "toh", "bhi", "nahi", "koi",
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s_]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w))
    .slice(0, 10); // top 10 keywords
}

/**
 * computeRelevanceScore — scores how relevant a memory is to a query
 * Uses keyword overlap + recency + importance weighting.
 *
 * Returns 0-1 score.
 */
function computeRelevanceScore(
  memory:       MemoryUnit,
  queryKeywords: string[],
  queryTopic:   string | null,
  turnCount:    number
): number {
  let score = 0;

  // 1. Topic exact match (highest weight)
  if (
    queryTopic &&
    memory.topic.toLowerCase().includes(queryTopic.toLowerCase())
  ) {
    score += 0.4;
  }

  // 2. Keyword overlap
  const memKeywords   = new Set(memory.keywords);
  const overlapCount  = queryKeywords.filter(k => memKeywords.has(k)).length;
  const overlapScore  = queryKeywords.length > 0
    ? overlapCount / Math.max(queryKeywords.length, 1)
    : 0;
  score += overlapScore * 0.3;

  // 3. Recency (more recent = higher score)
  const ageInTurns    = turnCount - memory.turnIndex;
  const recencyScore  = Math.max(0, 1 - ageInTurns / 20); // decay over 20 turns
  score += recencyScore * 0.15;

  // 4. Importance multiplier
  const importanceBoost = (memory.importance - 1) / 4 * 0.15; // 0-0.15
  score += importanceBoost;

  // 5. Boost mistakes and weaknesses (they're most actionable)
  if (memory.type === "mistake_made" || memory.type === "weakness_identified") {
    score *= 1.25;
  }

  return Math.min(1, score);
}

/**
 * retrieveRelevantMemories — THE core function
 *
 * Given the current user query, returns only the TOP K most relevant memories.
 * This replaces the old "dump everything" approach.
 *
 * Usage in AskAI.tsx:
 *   const relevant = await retrieveRelevantMemories({
 *     query: userMessage,
 *     topic: detectedTopic,
 *     topK: 4,
 *     turnCount: messages.length,
 *   });
 *   const context = buildMemoryContext(relevant);
 *   // inject context into system prompt
 */
export async function retrieveRelevantMemories(params: {
  query:      string;
  topic?:     string | null;
  subject?:   string | null;
  topK?:      number;
  turnCount?: number;
  convoId?:   string | null;
}): Promise<MemorySearchResult[]> {
  const {
    query,
    topic     = null,
    topK      = 4,
    turnCount = 0,
    convoId   = null,
  } = params;

  const queryKeywords = extractKeywords(query);

  // Score all local session memories
  const scored: MemorySearchResult[] = sessionMemories.map(memory => {
    const score = computeRelevanceScore(memory, queryKeywords, topic, turnCount);
    let reason = "";

    if (topic && memory.topic.toLowerCase().includes(topic.toLowerCase())) {
      reason = "topic match";
    } else if (score > 0.5) {
      reason = "keyword match";
    } else if (memory.type === "mistake_made") {
      reason = "past mistake";
    } else if (memory.type === "weakness_identified") {
      reason = "known weakness";
    } else {
      reason = "related context";
    }

    return { memory, relevanceScore: score, reason };
  });

  // Sort by relevance, take top K
  const topLocal = scored
    .filter(r => r.relevanceScore > 0.1)  // min threshold
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, topK);

  // Also try backend for cross-session memories
  let backendResults: MemorySearchResult[] = [];
  try {
    const res = await fetch(`${API_URL}/api/memory/search`, {
      method:  "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body:    JSON.stringify({
        query,
        topic,
        keywords: queryKeywords,
        topK:     topK - topLocal.length,
        convoId,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.results)) {
        backendResults = data.results;
      }
    }
  } catch {
    // Use only local results if backend fails
  }

  // Merge, deduplicate, re-sort
  const all   = [...topLocal, ...backendResults];
  const seen  = new Set<string>();
  const final = all
    .filter(r => {
      if (seen.has(r.memory.id)) return false;
      seen.add(r.memory.id);
      return true;
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, topK);

  return final;
}

/**
 * buildMemoryContext — converts retrieved memories into a prompt-ready string
 *
 * Output example:
 *   "RELEVANT MEMORY:
 *    [1] (topic match, importance 4) Student made a mistake with recursion base case 2 turns ago.
 *    [2] (keyword match) Explained 'for loops' vs 'while loops' — student understood well.
 *    [3] (known weakness) Student struggles with pointer arithmetic in C."
 */
export function buildMemoryContext(results: MemorySearchResult[]): string {
  if (results.length === 0) return "";

  const lines = results.map((r, i) => {
    const tag = `[${i + 1}] (${r.reason}, importance ${r.memory.importance}/5)`;
    return `${tag} ${r.memory.summary}`;
  });

  return "RELEVANT MEMORY FROM PAST INTERACTIONS:\n" + lines.join("\n");
}

/**
 * autoExtractAndStoreMemory — analyzes an AI response + student action
 * and automatically creates memory units. Call after each exchange.
 *
 * Usage in AskAI.tsx:
 *   After AI response + student action, call:
 *   autoExtractAndStoreMemory({
 *     aiResponse, userQuestion, topic, subject, turnIndex, convoId,
 *     comprehensionAction: "understood" | "reexplain" | ...
 *   });
 */
export async function autoExtractAndStoreMemory(params: {
  aiResponse:          string;
  userQuestion:        string;
  topic:               string | null;
  subject:             string;
  turnIndex:           number;
  convoId:             string | null;
  comprehensionAction?: string;  // from feedback loop
}): Promise<void> {
  const {
    aiResponse,
    userQuestion,
    topic,
    subject,
    turnIndex,
    convoId,
    comprehensionAction,
  } = params;

  const topicStr = topic || extractKeywords(userQuestion)[0] || "general";

  // Determine memory type and importance based on comprehension action
  if (comprehensionAction === "reexplain") {
    await storeMemory({
      type:      "mistake_made",
      topic:     topicStr,
      subject,
      summary:   `Student needed re-explanation of "${topicStr}". Question: "${userQuestion.slice(0, 80)}..."`,
      keywords:  extractKeywords(userQuestion + " " + topicStr),
      importance: 4,
      turnIndex,
      convoId,
    });
  }

  if (comprehensionAction === "understood") {
    await storeMemory({
      type:      "concept_mastered",
      topic:     topicStr,
      subject,
      summary:   `Student understood "${topicStr}" (clicked understood). "${userQuestion.slice(0, 60)}..."`,
      keywords:  extractKeywords(userQuestion + " " + topicStr),
      importance: 2,
      turnIndex,
      convoId,
    });
  }

  // Always store concepts explained by AI (importance based on response length)
  const importance = aiResponse.length > 800 ? 3 : 2;
  await storeMemory({
    type:      "concept_explained",
    topic:     topicStr,
    subject,
    summary:   `Explained "${topicStr}" to student. Q: "${userQuestion.slice(0, 60)}..."`,
    keywords:  extractKeywords(aiResponse.slice(0, 200) + " " + topicStr),
    importance,
    turnIndex,
    convoId,
  });
}

/**
 * getStudentMemoryProfile — fetches long-term profile from backend
 */
export async function getStudentMemoryProfile(): Promise<StudentMemoryProfile | null> {
  try {
    const res  = await fetch(`${API_URL}/api/memory/profile`, {
      headers: authHeader(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.profile : null;
  } catch {
    return null;
  }
}

/**
 * getSessionMemoryCount — how many memories stored this session
 */
export function getSessionMemoryCount(): number {
  return sessionMemories.length;
}

/**
 * resetSessionMemory — call this on startNewChat()
 */
export function resetSessionMemory(): void {
  sessionMemories.length = 0;
  memoryIdCounter        = 0;
}

/**
 * getSessionMemories — get all memories from current session
 * Useful for debugging or showing a "memory panel" to the user.
 */
export function getSessionMemories(): MemoryUnit[] {
  return [...sessionMemories];
}