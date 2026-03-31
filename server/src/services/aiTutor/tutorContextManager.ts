/**
 * AI Study OS — Tutor Context Manager
 * ─────────────────────────────────────────────────────────────
 * Assembles the COMPLETE tutor context for every AI call.
 * Combines: AI Brain data + Memory + Mode + Personality.
 *
 * This is the "briefing packet" the AI tutor reads before
 * answering. The richer this packet, the better the answer.
 *
 * Output example (injected as system prompt):
 * ┌──────────────────────────────────────────────────────────┐
 * │ STUDENT: Coding learner, beginner, prefers Hinglish      │
 * │ MASTERY: 38% overall | Streak: 5 days                    │
 * │ WEAK:    Loops (22%), Recursion (18%)                    │
 * │ MEMORY:  Studied Arrays yesterday, 3 questions today     │
 * │ MODE:    Coding mode — provide complete runnable code    │
 * │ PERSONALITY: Friendly coding mentor                      │
 * └──────────────────────────────────────────────────────────┘
 */

import { getAITutorContext }              from '../aiBrain/aiBrain.service.js';
import { buildMemoryContext }             from './aiMemoryEngine.js';
import { detectLearningMode,
         getModeInstructions,
         LearningMode,
         ModeDetectionResult }            from './learningModeDetector.js';
import { logger }                         from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export type TutorPersonality =
  | 'friendly'    // warm, encouraging, uses emojis lightly
  | 'strict'      // no nonsense, direct, exam-focused
  | 'mentor'      // coding mentor style, reviews code, gives best practices
  | 'coach'       // pushes student, motivational, goal-oriented

export interface TutorContextPacket {
  // Identity
  learnerType:        string;
  skillLevel:         string;     // beginner / intermediate / advanced
  preferredLanguage:  string;
  tutorPersonality:   TutorPersonality;
  classLevel:         string | null;

  // Intelligence
  weakTopics:         string[];
  criticalTopics:     string[];
  overallMastery:     number;
  currentStreak:      number;
  learningSpeed:      string;
  codingLevel:        string;

  // Mode
  learningMode:       LearningMode;
  hintMode:           boolean;
  modeConfidence:     number;

  // Memory
  recentTopics:       string[];
  lastStudiedTopic:   string | null;
  recentLanguages:    string[];
  consecutiveWrong:   number;
  continuationHint:   string | null;

  // Full system prompt block (ready to use)
  systemPromptBlock:  string;
}

// ── Personality definitions ────────────────────────────────────
const PERSONALITY_PROMPTS: Record<TutorPersonality, string> = {
  friendly: `🎓 TUTOR PERSONALITY: Friendly & Encouraging
• Use a warm, supportive tone. Celebrate small wins.
• Light use of emojis to make learning feel fun.
• Say things like "Great question!", "You're almost there!", "Let's figure this out together."
• Never make the student feel bad for not knowing something.`,

  strict: `📋 TUTOR PERSONALITY: Strict & Exam-Focused
• Be direct and concise. No fluff.
• Focus on exam-worthy answers. Mark-scheme format.
• Skip motivation — go straight to content.
• Correct mistakes firmly but fairly.`,

  mentor: `💻 TUTOR PERSONALITY: Coding Mentor
• Review code like a senior engineer. Point out best practices.
• Explain not just HOW but WHY — industry standards matter.
• Suggest improvements even beyond what was asked.
• Use phrases like "In production you'd want to...", "A cleaner approach is..."`,

  coach: `🏆 TUTOR PERSONALITY: Performance Coach
• Push the student to think before giving answers.
• Ask "What have you tried so far?" before solving.
• Set mini-goals: "By end of today, you should understand X."
• Keep energy high: "You've got this!", "One more push!"`,
};

// ── Skill level derivation ────────────────────────────────────
function deriveSkillLevel(mastery: number, codingLevel: string): string {
  if (codingLevel === 'advanced' || mastery >= 75) return 'advanced';
  if (codingLevel === 'intermediate' || mastery >= 45) return 'intermediate';
  return 'beginner';
}

// ── Personality auto-selection ────────────────────────────────
function autoSelectPersonality(
  learnerType: string,
  codingLevel: string,
  overallMastery: number,
  userPreference?: TutorPersonality,
): TutorPersonality {
  if (userPreference) return userPreference;
  if (learnerType === 'coding') return 'mentor';
  if (overallMastery < 35)     return 'friendly';  // struggling → be gentle
  if (learnerType === 'college') return 'strict';
  return 'friendly';
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — buildTutorContext
// ─────────────────────────────────────────────────────────────
export async function buildTutorContext(
  userId:          string,
  userMessage:     string,
  recentActivity?: string,
  personalityPref?: TutorPersonality,
): Promise<TutorContextPacket | null> {
  try {
    // Fetch AI Brain context + memory in parallel
    const [brainCtx, memory] = await Promise.all([
      getAITutorContext(userId).catch(() => null),
      buildMemoryContext(userId).catch(() => ({
        recentTopics: [], lastStudiedTopic: null, todayQuestionsCount: 0,
        recentLanguages: [], lastQuizScore: null, consecutiveCorrect: 0,
        consecutiveWrong: 0, sessionInsight: '', continuationHint: null,
        memoryPromptBlock: '',
      })),
    ]);

    // Detect learning mode from user's message
    const modeResult: ModeDetectionResult = detectLearningMode(
      userMessage,
      brainCtx?.learnerType || 'self',
      recentActivity,
    );

    // Derive skill level
    const skillLevel = deriveSkillLevel(
      brainCtx?.contextSummary ? (parseInt(brainCtx.contextSummary.match(/mastery: (\d+)/)?.[1] || '0')) : 0,
      brainCtx?.contextSummary ? 'intermediate' : 'beginner',
    );

    // Auto-select personality
    const personality = autoSelectPersonality(
      brainCtx?.learnerType || 'self',
      'intermediate',
      0,
      personalityPref,
    );

    const weakTopics    = brainCtx?.weakTopics    || [];
    const criticalTopics = brainCtx?.contextSummary?.includes('Critical') ? weakTopics.slice(0, 2) : [];
    const learnerType   = brainCtx?.learnerType   || 'self';
    const codingLevel   = 'intermediate'; // derived from brain
    const learningSpeed = brainCtx?.learningSpeed || 'medium';
    const overallMastery = 0;
    const currentStreak = 0;
    const classLevel    = null;
    const preferredLang = 'english';

    // ── Build the full system prompt block ────────────────
    const systemPromptBlock = buildSystemPromptBlock({
      learnerType,
      skillLevel,
      preferredLang,
      personality,
      classLevel,
      weakTopics,
      criticalTopics,
      overallMastery,
      currentStreak,
      learningSpeed,
      codingLevel,
      modeResult,
      memory,
      brainContextSummary: brainCtx?.contextSummary || '',
    });

    return {
      learnerType,
      skillLevel,
      preferredLanguage: preferredLang,
      tutorPersonality:  personality,
      classLevel,
      weakTopics,
      criticalTopics,
      overallMastery,
      currentStreak,
      learningSpeed,
      codingLevel,
      learningMode:     modeResult.mode,
      hintMode:         modeResult.hintMode,
      modeConfidence:   modeResult.confidence,
      recentTopics:     memory.recentTopics,
      lastStudiedTopic: memory.lastStudiedTopic,
      recentLanguages:  memory.recentLanguages,
      consecutiveWrong: memory.consecutiveWrong,
      continuationHint: memory.continuationHint,
      systemPromptBlock,
    };
  } catch (err: any) {
    logger.error(`[TutorContextManager] buildTutorContext: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// buildSystemPromptBlock — the final assembled system prompt
// ─────────────────────────────────────────────────────────────
// function buildSystemPromptBlock(config: {
//   learnerType:         string;
//   skillLevel:          string;
//   preferredLang:       string;
//   personality:         TutorPersonality;
//   classLevel:          string | null;
//   weakTopics:          string[];
//   criticalTopics:      string[];
//   overallMastery:      number;
//   currentStreak:       number;
//   learningSpeed:       string;
//   codingLevel:         string;
//   modeResult:          ModeDetectionResult;
//   memory:              any;
//   brainContextSummary: string;
// }): string {
//   const {
//     learnerType, skillLevel, preferredLang, personality, classLevel,
//     weakTopics, criticalTopics, overallMastery, currentStreak,
//     learningSpeed, codingLevel, modeResult, memory, brainContextSummary,
//   } = config;

//   const sections: string[] = [];

//   // ── 1. Identity & Role ────────────────────────────────
//   sections.push(`You are AI Study OS Personal Tutor — an intelligent, adaptive AI tutor for Indian students.`);

//   // ── 2. Personality ────────────────────────────────────
//   sections.push(PERSONALITY_PROMPTS[personality]);

//   // ── 3. Student Profile ────────────────────────────────
//   const profileLines = [
//     `• Type: ${learnerType} learner${classLevel ? ` — ${classLevel}` : ''}`,
//     `• Skill level: ${skillLevel}`,
//     `• Learning speed: ${learningSpeed}`,
//     learnerType === 'coding' ? `• Coding level: ${codingLevel}` : null,
//     overallMastery > 0 ? `• Overall mastery: ${overallMastery}%` : null,
//     currentStreak > 0  ? `• Study streak: ${currentStreak} days` : null,
//   ].filter(Boolean);
//   sections.push(`👤 STUDENT PROFILE:\n${profileLines.join('\n')}`);

//   // ── 4. AI Brain Intelligence ──────────────────────────
//   if (brainContextSummary) {
//     sections.push(`🧠 AI BRAIN INTELLIGENCE:\n${brainContextSummary}`);
//   }

//   // ── 5. Weak Topics (critical attention) ───────────────
//   if (criticalTopics.length > 0) {
//     sections.push(`🚨 CRITICAL WEAK AREAS (extra care needed): ${criticalTopics.join(', ')}\n• When these topics come up, explain very carefully from basics.`);
//   } else if (weakTopics.length > 0) {
//     sections.push(`⚠️ WEAK TOPICS (student struggles here): ${weakTopics.slice(0, 3).join(', ')}\n• Be extra patient and use examples when these arise.`);
//   }

//   // ── 6. Memory ─────────────────────────────────────────
//   if (memory.memoryPromptBlock) {
//     sections.push(memory.memoryPromptBlock);
//   }

//   // ── 7. Learning Mode ──────────────────────────────────
//   sections.push(getModeInstructions(modeResult.mode, modeResult.hintMode));

//   // ── 8. Language rule ──────────────────────────────────
//   if (preferredLang === 'hinglish') {
//     sections.push(`🌐 LANGUAGE: Student prefers Hinglish. Mix Hindi + English naturally. Use "matlab", "dekho", "basically", "toh", "aur". Dost ki tarah samjhao.`);
//   } else {
//     sections.push(`🌐 LANGUAGE: Reply in clear, professional English.`);
//   }

//   // ── 9. Learning speed adaptations ────────────────────
//   if (learningSpeed === 'slow') {
//     sections.push(`⏱️ PACE: Student is a slow learner. Break every concept into tiny steps. Repeat key points. Use more examples than usual.`);
//   } else if (learningSpeed === 'fast') {
//     sections.push(`⚡ PACE: Student learns fast. Be concise. Add advanced details and edge cases. Skip basics unless asked.`);
//   }

//   // ── 10. Core rules (always last) ──────────────────────
//   sections.push(`📋 CORE RULES:
// • Answer COMPLETELY. Never truncate or say "I'll leave this as an exercise."
// • If multiple questions → answer EACH with its number.
// • Be encouraging. This is an Indian student — exam-style, thorough answers.
// • Adapt complexity to the skill level above.`);

//   return sections.join('\n\n');
// }

function buildSystemPromptBlock(config: {
  learnerType:         string;
  skillLevel:          string;
  preferredLang:       string;
  personality:         TutorPersonality;
  classLevel:          string | null;
  weakTopics:          string[];
  criticalTopics:      string[];
  overallMastery:      number;
  currentStreak:       number;
  learningSpeed:       string;
  codingLevel:         string;
  modeResult:          ModeDetectionResult;
  memory:              any;
  brainContextSummary: string;
}): string {
  const {
    learnerType, skillLevel, preferredLang, personality, classLevel,
    weakTopics, criticalTopics, overallMastery, currentStreak,
    learningSpeed, codingLevel, modeResult, memory, brainContextSummary,
  } = config;
 
  const sections: string[] = [];
 
  // 1. Identity
  sections.push(
    `You are StudyEarn AI — an ultra-intelligent personal tutor for Indian students (CBSE, ICSE, JEE, NEET, State boards, Class 8-12 and college). You are as capable as ChatGPT, Gemini, and Claude.`
  );
 
  // 2. FORMATTING RULES — sabse important, ALWAYS follow karo
  sections.push(`🎨 MANDATORY RESPONSE FORMATTING — follow these in EVERY response:
 
**MARKDOWN (always use):**
• **bold** → important terms, key answers, formulas, final answers, definitions
• *italic* → emphasis, subject names
• \`inline code\` → variable names, short snippets, commands
• ## heading → main sections, ### → sub-sections
• - bullet points → lists of items
• 1. 2. 3. → sequential steps (ALWAYS for solutions)
• > blockquote → important notes, key rules, warnings
• \`\`\`language\\ncode\\n\`\`\` → ALL code blocks (always specify language)
 
**EMOJIS (mandatory, use naturally every response):**
📌 key points/definitions   💡 tips/tricks/insights
⚠️ warnings/common mistakes  ✅ correct answers
❌ wrong approaches          🔥 important exam topics
📐 math                      💻 coding
🔬 science                   🎯 final answer/goal
🚀 advanced concepts         🧠 concept explanations
 
**STRUCTURE (every answer must have this):**
• Brief intro line
• Body with **headers**, bullet points OR numbered steps
• Summary / Final Answer in **bold**
• Closing emoji 🎯 or 🚀
 
**SUBJECT-SPECIFIC:**
• Math → formula first → step-by-step numbered → **Final Answer: X** in bold
• Code → explanation → complete runnable \`\`\`lang block → expected output
• Science → law/formula → substitution with units → real example
• Never write a wall of plain text — always break it up with structure`);
 
  // 3. Personality
  sections.push(PERSONALITY_PROMPTS[personality]);
 
  // 4. Student Profile
  const profileLines = [
    `• Type: ${learnerType} learner${classLevel ? ` — ${classLevel}` : ''}`,
    `• Skill level: ${skillLevel}`,
    `• Learning speed: ${learningSpeed}`,
    learnerType === 'coding' ? `• Coding level: ${codingLevel}` : null,
    overallMastery > 0 ? `• Overall mastery: ${overallMastery}%` : null,
    currentStreak > 0  ? `• Study streak: ${currentStreak} days 🔥` : null,
  ].filter(Boolean);
  sections.push(`👤 STUDENT PROFILE:\n${profileLines.join('\n')}`);
 
  // 5. AI Brain Intelligence
  if (brainContextSummary) {
    sections.push(`🧠 AI BRAIN INTELLIGENCE:\n${brainContextSummary}`);
  }
 
  // 6. Weak Topics
  if (criticalTopics.length > 0) {
    sections.push(`🚨 CRITICAL WEAK AREAS (extra care needed): ${criticalTopics.join(', ')}\n• Explain carefully from basics. Use extra examples.`);
  } else if (weakTopics.length > 0) {
    sections.push(`⚠️ WEAK TOPICS: ${weakTopics.slice(0, 3).join(', ')}\n• Be extra patient. Use step-by-step with examples.`);
  }
 
  // 7. Memory
  if (memory.memoryPromptBlock) {
    sections.push(memory.memoryPromptBlock);
  }
 
  // 8. Learning Mode
  sections.push(getModeInstructions(modeResult.mode, modeResult.hintMode));
 
  // 9. Language
  if (preferredLang === 'hinglish') {
    sections.push(`🌐 LANGUAGE: Hinglish mein jawab de — Hindi + English naturally mix karo. "matlab", "dekho", "basically", "toh", "aur", "yaar" use karo. Dost ki tarah. BUT formatting (bold, bullets, code blocks, emojis) zaroor use karo even in Hinglish!`);
  } else {
    sections.push(`🌐 LANGUAGE: Clear, professional English.`);
  }
 
  // 10. Pace
  if (learningSpeed === 'slow') {
    sections.push(`⏱️ PACE: Slow learner. Break everything into tiny numbered steps. Repeat key points. Extra examples.`);
  } else if (learningSpeed === 'fast') {
    sections.push(`⚡ PACE: Fast learner. Efficient but still format properly. Add advanced details.`);
  }
 
  // 11. Core rules
  sections.push(`📋 CORE RULES:
• Answer COMPLETELY — never truncate, never say "I'll leave this as an exercise"
• Multiple questions → answer EACH numbered, fully
• ALWAYS use markdown formatting — bold, bullets, headings, code blocks
• ALWAYS use emojis naturally
• Be encouraging — Indian exam style, thorough, marks-worthy`);
 
  return sections.join('\n\n');
}