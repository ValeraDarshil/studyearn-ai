/**
 * AI Study OS — Context-Aware AI Tutor Service (v3 — NVIDIA Powered)
 */

import { getTutorContext, updateTopicMastery } from './studentProfileService.js';
import { getAITutorContext } from './aiBrain/aiBrain.service.js';
import { solveText, ChatMessage as AIChatMessage } from './aiService.js';
import { logger } from '../utils/logger.js';

const GROQ_KEY       = process.env.GROQ_API_KEY       || '';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const AI_TIMEOUT_MS  = 30_000;

export type SubjectMode = 'auto' | 'math' | 'coding' | 'science' | 'general';
export type ChatMessage = { role: 'user' | 'assistant'; content: string };

// ─────────────────────────────────────────────────────────────
// 1. LANGUAGE DETECTOR
// Hinglish detect karo — Devanagari ya common Hindi words in English script
// ─────────────────────────────────────────────────────────────
function detectLanguage(text: string): 'hinglish' | 'english' {
  if (!text) return 'english';

  // Devanagari Unicode range
  if (/[\u0900-\u097F]/.test(text)) return 'hinglish';

  // Common Hinglish words (written in English script)
  const hinglishWords = [
    'kya', 'hai', 'mujhe', 'mera', 'tera', 'hota', 'karo', 'kaise',
    'batao', 'samjhao', 'matlab', 'kyun', 'kyunki', 'lekin', 'aur',
    'nahi', 'haan', 'theek', 'achha', 'yaar', 'bhai', 'dost',
    'isko', 'usko', 'woh', 'yeh', 'toh', 'bhi', 'sirf', 'abhi',
    'solve karo', 'bata do', 'help karo', 'explain karo', 'samajh',
    'mujhe samajh', 'ye kya', 'kya hota', 'kaise kare', 'kaise karta',
    'iska', 'uska', 'kaisa', 'kahan', 'kab', 'kitna', 'bahut',
  ];

  const lower = text.toLowerCase();
  const count = hinglishWords.filter(w => lower.includes(w)).length;
  return count >= 2 ? 'hinglish' : 'english';
}

// ─────────────────────────────────────────────────────────────
// 2. AUTO SUBJECT DETECTOR
// Question se subject guess karo jab mode = 'auto'
// ─────────────────────────────────────────────────────────────
function autoDetectSubject(question: string): SubjectMode {
  const q = question.toLowerCase();

  const codingScore = [
    'code', 'program', 'function', 'loop', 'array', 'string', 'variable',
    'class', 'object', 'python', 'javascript', 'java', 'c++', 'html', 'css',
    'react', 'node', 'api', 'database', 'sql', 'algorithm', 'data structure',
    'recursion', 'pointer', 'linked list', 'binary tree', 'sorting', 'stack',
    'queue', 'debug', 'error', 'syntax', 'compile', 'import', 'export',
    'async', 'git', 'terminal', 'runtime', 'output', 'input()', 'print(',
  ].filter(k => q.includes(k)).length;

  const mathScore = [
    'solve', 'calculate', 'equation', 'integral', 'derivative', 'limit',
    'matrix', 'vector', 'algebra', 'geometry', 'trigonometry', 'probability',
    'statistics', 'calculus', 'differentiation', 'integration', 'proof',
    'theorem', 'formula', 'quadratic', 'polynomial', 'logarithm', 'factorial',
    '∫', 'dx', '∑', 'sin', 'cos', 'tan', 'log', 'lim', 'sqrt',
    'find x', 'find the value', 'simplify', 'factorize', 'expand',
  ].filter(k => q.includes(k)).length;

  const scienceScore = [
    'physics', 'chemistry', 'biology', 'force', 'energy', 'velocity',
    'acceleration', 'newton', 'gravity', 'electric', 'magnetic', 'wave',
    'atom', 'molecule', 'reaction', 'bond', 'organic', 'cell', 'dna',
    'photosynthesis', 'respiration', 'evolution', 'ecosystem', 'thermodynamics',
    'optics', 'light', 'sound', 'pressure', 'temperature', 'heat',
  ].filter(k => q.includes(k)).length;

  const max = Math.max(codingScore, mathScore, scienceScore);
  if (max === 0)                return 'general';
  if (max === codingScore)      return 'coding';
  if (max === mathScore)        return 'math';
  return 'science';
}

// ─────────────────────────────────────────────────────────────
// 3. SYSTEM PROMPT BUILDER
// All factors mila ke ek powerful system prompt banao
// ─────────────────────────────────────────────────────────────
function buildSystemPrompt(config: {
  detectedLanguage:  'english' | 'hinglish';
  subjectMode:       SubjectMode;
  stepByStep:        boolean;
  learnerCategory?:  string;
  classLevel?:       string | null;
  tutorPersonality?: string;
  weakTopics?:       string[];
  recentMistakes?:   string[];
  learningSpeed?:    string;
}): string {
  const {
    detectedLanguage, subjectMode, stepByStep,
    learnerCategory, classLevel, tutorPersonality,
    weakTopics, recentMistakes, learningSpeed,
  } = config;

  // ── Language Rule ─────────────────────────────────────────
  const langRule = detectedLanguage === 'hinglish'
    ? `🌐 LANGUAGE: Student ne Hinglish mein pucha hai. TU BHI HINGLISH MEIN JAWAB DE.
Matlab: English aur Hindi mix karo naturally. "matlab", "dekho", "basically", "yaar", "toh", "aur", "isliye" use karo.
Pure formal English mat use karo. Dost ki tarah samjhao.`
    : `🌐 LANGUAGE: Student asked in English. Reply in clear, professional English.`;

  // ── Subject Mode Instructions ─────────────────────────────
  const modeLabel = subjectMode === 'auto' ? autoDetectSubject('') : subjectMode;

  const subjectRules: Record<string, string> = {
    math: `📐 MATH MODE:
• Write formula first → substitute values → calculate → box the answer
• Show EVERY arithmetic step, no shortcuts
• If multiple parts (a, b, c) → solve EACH separately labeled
• Use proper notation: fractions, powers, roots
• Verify the answer at the end`,

    coding: `💻 CODING MODE:
• Always show COMPLETE, runnable code (no "..." truncation)
• Add inline comments explaining each important line
• Show expected output clearly labeled
• For bugs: show WRONG code first, then FIXED code with explanation
• Explain WHY the solution works, not just what it does
• Specify the language in code blocks`,

    science: `🔬 SCIENCE MODE:
• State the concept/law/principle first
• Write formula → substitute with units → solve → check units in answer
• Give a real-world example after solving
• For chemistry reactions: balance equations, explain what happens
• Diagrams in ASCII if helpful`,

    general: `📚 GENERAL MODE:
• Give structured, clear explanations
• Use bullet points for lists, numbered steps for processes
• Include a relevant example
• Summarize key points at the end`,
  };

  const subjectInstruction = subjectRules[subjectMode === 'auto' ? autoDetectSubject('general') : subjectMode]
    || subjectRules.general;

  // ── Step-by-Step Mode ─────────────────────────────────────
  const stepRule = stepByStep ? `

🪜 STEP-BY-STEP MODE (ACTIVE):
Structure your answer EXACTLY in this format:

**🎯 Understanding the Problem:**
[What exactly is being asked, in 1-2 lines]

**Step 1 — [Name]:** [First action + explanation]
**Step 2 — [Name]:** [Second action + explanation]
[...continue all steps...]

**✅ Final Answer:** [Clear answer, highlighted]

**💡 Key Concept:** [1-sentence explanation of the main idea used]` : '';

  // ── Student Profile ───────────────────────────────────────
  const categoryMap: Record<string, string> = {
    school:  `school student${classLevel ? ` — ${classLevel}` : ''}`,
    coding:  `coding learner${classLevel ? ` — ${classLevel}` : ''}`,
    college: `college student${classLevel ? ` — ${classLevel}` : ''}`,
    self:    'self-learner',
  };

  const personalityMap: Record<string, string> = {
    simple:   'Very simple language. Short sentences. Avoid jargon. Like explaining to a 12-year-old.',
    normal:   'Clear, friendly language. Balance simplicity with accuracy.',
    advanced: 'Technical language. Deep explanations. Academic context and theory.',
  };

  const profileLines: string[] = [];
  if (learnerCategory) {
    profileLines.push(`• Student: ${categoryMap[learnerCategory] || learnerCategory}`);
    profileLines.push(`• Style: ${personalityMap[tutorPersonality || 'normal']}`);
  }
  if (weakTopics?.length)    profileLines.push(`• Weak topics (extra care): ${weakTopics.slice(0, 4).join(', ')}`);
  if (recentMistakes?.length) profileLines.push(`• Common mistakes: ${recentMistakes.slice(0, 3).join(', ')}`);
  if (learningSpeed === 'slow') profileLines.push(`• Slow learner: Break into tiny steps. Repeat key points.`);
  if (learningSpeed === 'fast') profileLines.push(`• Fast learner: Be concise, can go deeper.`);

  const profileSection = profileLines.length > 0
    ? `\n👤 STUDENT PROFILE:\n${profileLines.join('\n')}\n`
    : '';

  return `You are AI Study OS Tutor — an intelligent personal tutor for Indian students.

${langRule}
${profileSection}
${subjectInstruction}
${stepRule}

📋 CORE RULES (always follow):
• Answer COMPLETELY. Never truncate, never say "I'll leave this as an exercise."
• If multiple questions → answer EACH with its number/letter.
• Be encouraging. Indian exam style: thorough, structured, marks-worthy.
• If student seems confused, start from the basics.`.trim();
}

// ─────────────────────────────────────────────────────────────
// 4. AI CALL HELPERS
// ─────────────────────────────────────────────────────────────
function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

async function callGroq(messages: any[]): Promise<string> {
  const MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'];
  for (const model of MODELS) {
    try {
      const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({ model, temperature: 0.4, max_tokens: 4096, messages }),
      });
      if (!res.ok) continue;
      const data   = await res.json();
      const answer = data.choices?.[0]?.message?.content;
      if (answer && answer.trim().length > 20) { logger.info(`[ContextTutor] ✅ Groq ${model}`); return answer; }
    } catch (e: any) { logger.debug(`[ContextTutor] Groq ${model}: ${e.message}`); }
  }
  throw new Error('Groq: all models failed');
}

async function callOpenRouter(messages: any[]): Promise<string> {
  if (!OPENROUTER_KEY) throw new Error('No OPENROUTER_API_KEY');
  const MODELS = [
    'meta-llama/llama-3.3-70b-instruct:free',
    'deepseek/deepseek-r1-0528:free',
    'qwen/qwen3-235b-a22b:free',
    'google/gemma-3-27b-it:free',
  ];
  for (const model of MODELS) {
    try {
      const res = await fetchWithTimeout('https://openrouter.ai/api/v1/chat/completions', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENROUTER_KEY}`, 'HTTP-Referer': process.env.FRONTEND_URL || 'https://studyearnai.tech', 'X-Title': 'AI Study OS' },
        body: JSON.stringify({ model, temperature: 0.4, max_tokens: 4096, messages }),
      });
      if (!res.ok) continue;
      const data   = await res.json();
      const answer = data.choices?.[0]?.message?.content;
      if (answer && answer.trim().length > 20) { logger.info(`[ContextTutor] ✅ OR ${model}`); return answer; }
    } catch (e: any) { logger.debug(`[ContextTutor] OR ${model}: ${e.message}`); }
  }
  throw new Error('OpenRouter: all models failed');
}

// ─────────────────────────────────────────────────────────────
// 5. MAIN EXPORT — contextAwareSolve
// ─────────────────────────────────────────────────────────────
export async function contextAwareSolve(
  userId: string,
  userPrompt: string,
  history: ChatMessage[] = [],
  options?: {
    subjectMode?: SubjectMode;
    stepByStep?:  boolean;
  }
): Promise<string> {
  // Get student context (graceful fail)
  const context = await getTutorContext(userId).catch(() => null);

  // Auto detect language from the actual question text
  const detectedLanguage = detectLanguage(userPrompt);

  // Subject mode
  const subjectMode: SubjectMode = options?.subjectMode || 'auto';

  // Step-by-step
  const stepByStep = options?.stepByStep ?? false;

  // Build system prompt
  const systemPrompt = buildSystemPrompt({
    detectedLanguage,
    subjectMode,
    stepByStep,
    learnerCategory:  context?.learnerCategory,
    classLevel:       context?.classLevel,
    tutorPersonality: context?.tutorPersonality,
    weakTopics:       context?.weakTopics,
    recentMistakes:   context?.recentMistakes,
    learningSpeed:    context?.learningSpeed,
  });

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userPrompt },
  ];

  // Call AI — now powered by NVIDIA NIM (253B model) → Groq → OpenRouter
  let answer: string;
  try {
    // Pass the full system prompt + history as a single enriched call
    // solveText now routes to NVIDIA NIM automatically
    const fullPrompt = `[SYSTEM CONTEXT INJECTED]\n${systemPrompt}\n\n[USER QUESTION]\n${userPrompt}`;
    const chatHistory = history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
    answer = await solveText(userPrompt, chatHistory, subjectMode === 'auto' ? autoDetectSubject(userPrompt) : subjectMode);
  } catch (err: any) {
    logger.error(`[ContextTutor] All providers failed: ${err.message}`);
    answer = 'AI is temporarily unavailable. Please try again in a moment.';
  }

  // Update topic mastery in background (non-blocking)
  if (userId) {
    const detectedMode = subjectMode === 'auto' ? autoDetectSubject(userPrompt) : subjectMode;
    updateTopicFromQuestion(userId, userPrompt, detectedMode).catch(() => {});
  }

  return answer;
}

// ─────────────────────────────────────────────────────────────
// 6. TOPIC MASTERY AUTO-UPDATE (background)
// ─────────────────────────────────────────────────────────────
async function updateTopicFromQuestion(userId: string, question: string, mode: SubjectMode): Promise<void> {
  const q = question.toLowerCase();
  const topics = [
    { keys: ['algebra','equation','variable','polynomial'],           topic: 'Algebra',           subject: 'Mathematics' },
    { keys: ['calculus','integral','derivative','limit','∫','dx'],    topic: 'Calculus',           subject: 'Mathematics' },
    { keys: ['trigonometry','sin','cos','tan','angle','hypotenuse'],  topic: 'Trigonometry',       subject: 'Mathematics' },
    { keys: ['geometry','circle','triangle','area','volume','perimeter'], topic: 'Geometry',       subject: 'Mathematics' },
    { keys: ['statistics','probability','mean','median','mode'],      topic: 'Statistics',         subject: 'Mathematics' },
    { keys: ['matrix','vector','determinant','eigenvalue'],           topic: 'Linear Algebra',     subject: 'Mathematics' },
    { keys: ['newton','force','momentum','motion','velocity'],        topic: 'Laws of Motion',     subject: 'Physics' },
    { keys: ['energy','work','power','kinetic','potential'],          topic: 'Work & Energy',      subject: 'Physics' },
    { keys: ['electric','current','voltage','resistance','circuit'],  topic: 'Electricity',        subject: 'Physics' },
    { keys: ['wave','frequency','amplitude','sound','light','optic'], topic: 'Waves & Optics',     subject: 'Physics' },
    { keys: ['organic','carbon','hydrocarbon','functional group'],    topic: 'Organic Chemistry',  subject: 'Chemistry' },
    { keys: ['periodic table','element','atomic number','proton'],    topic: 'Periodic Table',     subject: 'Chemistry' },
    { keys: ['bond','ionic','covalent','molecular','valence'],        topic: 'Chemical Bonding',   subject: 'Chemistry' },
    { keys: ['loop','for loop','while loop','iteration'],             topic: 'Loops',              subject: 'Programming' },
    { keys: ['array','list','index','append','element'],              topic: 'Arrays & Lists',     subject: 'Programming' },
    { keys: ['function','def ','return','parameter','argument'],      topic: 'Functions',          subject: 'Programming' },
    { keys: ['recursion','recursive','base case','call stack'],       topic: 'Recursion',          subject: 'Programming' },
    { keys: ['class','object','inheritance','oop','encapsulation'],   topic: 'OOP',                subject: 'Programming' },
    { keys: ['linked list','node','next pointer','head'],             topic: 'Linked Lists',       subject: 'Data Structures' },
    { keys: ['binary tree','bst','traversal','root','leaf'],          topic: 'Trees',              subject: 'Data Structures' },
    { keys: ['sorting','bubble sort','merge sort','quick sort'],      topic: 'Sorting',            subject: 'Algorithms' },
    { keys: ['python','print(','def ','import numpy','import pandas'],topic: 'Python',             subject: 'Python' },
    { keys: ['javascript','console.log','const ','let ','async'],    topic: 'JavaScript',         subject: 'JavaScript' },
  ];

  for (const entry of topics) {
    if (entry.keys.some(k => q.includes(k))) {
      await updateTopicMastery(userId, {
        subject: entry.subject, topic: entry.topic,
        isCorrect: true, timeSpentSecs: 60, source: 'ai_tutor',
      });
      break;
    }
  }
}