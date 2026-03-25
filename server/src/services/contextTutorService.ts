/**
 * AI Study OS — Context-Aware AI Tutor Service
 * ─────────────────────────────────────────────────────────────
 * Wraps the existing aiService to inject student profile context.
 * The AI tutor now behaves like a real personal mentor:
 *
 *   - Beginner coder → simple explanations, basic examples
 *   - School student → class-appropriate, exam-focused
 *   - College student → deep technical explanations
 *   - Hinglish preference → responds in Hinglish
 *
 * Works with the existing Groq + OpenRouter chain.
 * Just upgrades the SYSTEM PROMPT dynamically per student.
 */

import { getTutorContext } from './studentProfileService.js';
import { updateTopicMastery } from './studentProfileService.js';
import { logger } from '../utils/logger.js';

// ── AI Constants (match existing aiService.ts) ────────────────
const GROQ_KEY       = process.env.GROQ_API_KEY       || '';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const AI_TIMEOUT_MS  = 30_000;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

// ── Build personalized system prompt ─────────────────────────
function buildContextPrompt(context: {
  learnerCategory: string;
  classLevel: string | null;
  tutorPersonality: string;
  weakTopics: string[];
  strongTopics: string[];
  recentMistakes: string[];
  learningSpeed: string;
  currentStreak: number;
  overallMasteryScore: number;
  preferredLanguage?: string;
}): string {
  const { learnerCategory, classLevel, tutorPersonality, weakTopics, recentMistakes, learningSpeed, preferredLanguage } = context;

  const personalityGuide = {
    simple:   'Use very simple language. Short sentences. Real-life examples. Avoid jargon. Explain like the student is 12 years old.',
    normal:   'Use clear, friendly language. Balance simplicity with accuracy. Include examples and analogies.',
    advanced: 'Use technical language appropriate for university level. Provide deep explanations, theory, and academic context.',
  }[tutorPersonality] || 'Use clear, friendly language.';

  const categoryContext = {
    school:  `The student is in ${classLevel || 'school'} (likely CBSE/ICSE/State board). Focus on exam-relevant explanations, formula-based solving, and board exam style.`,
    coding:  `The student is learning to code. Focus on practical coding explanations with code examples, common bugs, and debugging tips.`,
    college: `The student is a ${classLevel || 'college'} student. Focus on conceptual depth, technical accuracy, and linking theory to practice.`,
    self:    `The student is a self-learner. Be encouraging, practical, and help them understand the "why" behind concepts.`,
  }[learnerCategory] || '';

  const weakContext = weakTopics.length > 0
    ? `\nThe student struggles with: ${weakTopics.slice(0, 5).join(', ')}. When these topics come up, provide extra care and step-by-step explanations.`
    : '';

  const mistakeContext = recentMistakes.length > 0
    ? `\nRecent mistake areas: ${recentMistakes.slice(0, 3).join(', ')}. If asked about these, address common misconceptions proactively.`
    : '';

  const speedContext = learningSpeed === 'slow'
    ? '\nThis student learns at a slower pace. Break everything into very small steps. Repeat key points.'
    : learningSpeed === 'fast'
    ? '\nThis student is a fast learner. You can be concise and go slightly deeper.'
    : '';

  const languageContext = preferredLanguage === 'hinglish'
    ? '\nRespond in Hinglish (English mixed with Hindi written in English script). Be friendly and conversational like a dost explaining to a friend.'
    : '';

  return `You are AI Study OS Tutor — a personal AI mentor for Indian students.

${categoryContext}

Personality: ${personalityGuide}
${weakContext}
${mistakeContext}
${speedContext}
${languageContext}

Core Rules:
- Always solve questions completely, step by step. Never skip steps.
- If multiple questions exist, answer EACH one separately with its number.
- Math: formula → substitution → calculation → answer.
- Science: concept → formula → solution → explanation.
- Code: explain WHAT the code does, WHY it works, and show the output.
- Coding errors: explain the bug clearly and show the fix.
- Be encouraging. Never make the student feel stupid.
- Indian exam style: thorough, structured, marks-worthy answers.`;
}

// ── AI call with timeout ──────────────────────────────────────
async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

// ── Groq call ──────────────────────────────────────────────────
async function groqWithContext(
  userPrompt: string,
  systemPrompt: string,
  history: ChatMessage[]
): Promise<string> {
  const MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'];

  for (const model of MODELS) {
    try {
      const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          max_tokens:  4096,
          messages: [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user',   content: userPrompt },
          ],
        }),
      });
      if (!res.ok) { logger.debug(`[ContextTutor] Groq ${model} HTTP ${res.status}`); continue; }
      const data   = await res.json();
      const answer = data.choices?.[0]?.message?.content;
      if (answer && answer.trim().length > 20) { logger.info(`[ContextTutor] Groq ✅ ${model}`); return answer; }
    } catch (e: any) { logger.debug(`[ContextTutor] Groq ${model}: ${e.message}`); }
  }
  throw new Error('Groq: all models failed');
}

// ── OpenRouter fallback ───────────────────────────────────────
async function openRouterWithContext(
  userPrompt: string,
  systemPrompt: string,
  history: ChatMessage[]
): Promise<string> {
  if (!OPENROUTER_KEY) throw new Error('OPENROUTER_API_KEY not set');
  const MODELS = [
    'meta-llama/llama-3.3-70b-instruct:free',
    'deepseek/deepseek-r1-0528:free',
    'qwen/qwen3-235b-a22b:free',
  ];

  for (const model of MODELS) {
    try {
      const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer':  process.env.FRONTEND_URL || 'https://studyearnai.tech',
          'X-Title':       'AI Study OS',
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          max_tokens:  4096,
          messages: [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user',   content: userPrompt },
          ],
        }),
      });
      if (!res.ok) { logger.debug(`[ContextTutor] OR ${model} HTTP ${res.status}`); continue; }
      const data   = await res.json();
      const answer = data.choices?.[0]?.message?.content;
      if (answer && answer.trim().length > 20) return answer;
    } catch (e: any) { logger.debug(`[ContextTutor] OR ${model}: ${e.message}`); }
  }
  throw new Error('OpenRouter: all models failed');
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — Context-Aware Ask AI
//
// Drop-in replacement for the existing `solveText()` in aiService.
// Accepts userId to inject profile context.
// Falls back to generic prompt if no profile found.
// ─────────────────────────────────────────────────────────────
export async function contextAwareSolve(
  userId: string,
  userPrompt: string,
  history: ChatMessage[] = []
): Promise<string> {
  // Get student context
  const context = await getTutorContext(userId);

  // Build personalized system prompt
  const systemPrompt = context
    ? buildContextPrompt(context as any)
    : buildGenericPrompt();

  // Call AI
  let answer: string;
  try {
    answer = await groqWithContext(userPrompt, systemPrompt, history);
  } catch {
    answer = await openRouterWithContext(userPrompt, systemPrompt, history);
  }

  // ── Auto-detect topic from question and update mastery ────
  // (Async, non-blocking — doesn't slow down the response)
  if (context) {
    detectAndUpdateTopicAsync(userId, userPrompt, context);
  }

  return answer;
}

// ── Detect topic from question (best-effort, async) ──────────
async function detectAndUpdateTopicAsync(
  userId: string,
  question: string,
  context: any
): Promise<void> {
  // Simple keyword matching — no extra AI call needed
  const topicKeywords: Record<string, { topic: string; subject: string }> = {
    // Math
    'algebra': { topic: 'Algebra', subject: 'Mathematics' },
    'equation': { topic: 'Equations', subject: 'Mathematics' },
    'calculus': { topic: 'Calculus', subject: 'Mathematics' },
    'trigonometry': { topic: 'Trigonometry', subject: 'Mathematics' },
    'geometry': { topic: 'Geometry', subject: 'Mathematics' },
    'statistics': { topic: 'Statistics', subject: 'Mathematics' },
    // Physics
    'newton': { topic: 'Laws of Motion', subject: 'Physics' },
    'force': { topic: 'Forces', subject: 'Physics' },
    'velocity': { topic: 'Motion', subject: 'Physics' },
    'electricity': { topic: 'Electricity', subject: 'Physics' },
    // Chemistry
    'organic': { topic: 'Organic Chemistry', subject: 'Chemistry' },
    'periodic table': { topic: 'Periodic Table', subject: 'Chemistry' },
    'bond': { topic: 'Chemical Bonding', subject: 'Chemistry' },
    // Coding
    'loop': { topic: 'Loops', subject: 'Programming' },
    'array': { topic: 'Arrays', subject: 'Programming' },
    'function': { topic: 'Functions', subject: 'Programming' },
    'recursion': { topic: 'Recursion', subject: 'Programming' },
    'pointer': { topic: 'Pointers', subject: 'Programming' },
    'class': { topic: 'Classes & OOP', subject: 'Programming' },
    'python': { topic: 'Python Basics', subject: 'Python' },
    'javascript': { topic: 'JavaScript Basics', subject: 'JavaScript' },
    'async': { topic: 'Async Programming', subject: 'JavaScript' },
    // Data Structures
    'linked list': { topic: 'Linked Lists', subject: 'Data Structures' },
    'binary tree': { topic: 'Binary Trees', subject: 'Data Structures' },
    'graph': { topic: 'Graphs', subject: 'Data Structures' },
    'sorting': { topic: 'Sorting Algorithms', subject: 'Algorithms' },
  };

  const q = question.toLowerCase();
  for (const [keyword, meta] of Object.entries(topicKeywords)) {
    if (q.includes(keyword)) {
      await updateTopicMastery(userId, {
        subject:        meta.subject,
        topic:          meta.topic,
        isCorrect:      true, // assume engagement = positive signal
        timeSpentSecs:  60,
        source:         'ai_tutor',
      });
      break; // Only update first matched topic per question
    }
  }
}

// ── Generic prompt (fallback when no profile exists) ──────────
function buildGenericPrompt(): string {
  return `You are AI Study OS Tutor — an expert academic tutor for Indian students (CBSE, ICSE, State boards, Class 1–12, college, and coding learners).

Rules:
- Solve questions COMPLETELY, step-by-step. Show ALL working.
- If multiple questions exist, answer EACH ONE separately with its number.
- Math: formula → substitution → calculation → answer.
- Science: concept → formula → solution → explanation.
- Code: explain what it does, show output, fix bugs clearly.
- Be thorough. Never skip steps. Indian exam style.`;
}