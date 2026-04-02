/**
 * AI Study OS — Context Fusion Engine (Stage 5)
 * ─────────────────────────────────────────────────────────────
 * Combines ALL AI systems into a single rich context packet
 * that gets injected into every AskAI call.
 *
 * Sources fused:
 *   1. AI Brain (BrainSnapshot)           → profile, plan, progress
 *   2. AI Memory (AIMemorySnapshot)       → past questions, weak areas
 *   3. Tutor Context (TutorContextPacket) → skill level, personality
 *   4. Student State (StudentStateData)   → current state from Stage 5
 *
 * Uses EXACT types from existing files:
 *   StudentIntelligenceProfile → learningType, classLevel, weakTopics,
 *                                currentStreak, overallMastery, tutorPersonality
 *   TutorContextPacket         → skillLevel, weakTopics, learnerType,
 *                                systemPromptBlock
 *   BrainSnapshot              → profile, dailyPlan (recommendations[])
 *
 * Output: FusedAIContext.systemPromptPrefix
 *   → Prepended to existing systemPromptBlock in aiController.ts
 */

import { StudentStateData }                   from './studentStateManager.js';
import { aiMemoryStore, AIMemorySnapshot }    from './aiMemoryStore.js';
import { getBrainSnapshot, BrainSnapshot }    from '../aiBrain/aiBrain.service.js';
import { buildTutorContext }                  from '../aiTutor/tutorContextManager.js';
import { logger }                             from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export interface FusedAIContext {
  userId:        string;

  // Student identity (from StudentIntelligenceProfile)
  learningType:  string;   // 'school' | 'coding' | 'college' | 'self'
  classLevel:    string | null;
  skillLevel:    string;   // 'beginner' | 'intermediate' | 'advanced'

  // Current state
  currentState:    string;
  isStruggling:    boolean;
  isImproving:     boolean;
  isNewUser:       boolean;

  // Knowledge context
  weakTopics:          string[];
  strongTopics:        string[];
  recentSubjects:      string[];
  persistentWeakAreas: string[];  // appeared 2+ times in recentMistakes

  // Performance
  overallMastery:  number;   // 0–100
  streakDays:      number;
  learningSpeed:   string;   // 'slow' | 'medium' | 'fast'

  // Memory
  recentQuestions:  string[];
  achievements:     string[];

  // Tutor
  tutorPersonality:   string;
  systemPromptPrefix: string;  // inject into Claude system prompt

  fusedAt:       string;
  sourcesSynced: string[];
}

// ─────────────────────────────────────────────────────────────
// contextFusionEngine
// ─────────────────────────────────────────────────────────────
export const contextFusionEngine = {

  async fuse(userId: string, stateData: StudentStateData): Promise<FusedAIContext> {
    logger.info({ userId }, '[ContextFusion] Starting context fusion');

    // Fetch all sources in parallel — gracefully degrade on failure
    const [brainResult, memoryResult, tutorResult] = await Promise.allSettled([
      getBrainSnapshot(userId),
      aiMemoryStore.getMemorySnapshot(userId),
      // buildTutorContext requires userMessage — use neutral placeholder
      buildTutorContext(userId, 'context preparation'),
    ]);

    const brain  = brainResult.status  === 'fulfilled' ? brainResult.value  : null;
    const memory = memoryResult.status === 'fulfilled' ? memoryResult.value : null;
    const tutor  = tutorResult.status  === 'fulfilled' ? tutorResult.value  : null;

    const sourcesSynced: string[] = ['studentState'];
    if (brain)  sourcesSynced.push('aiBrain');
    if (memory) sourcesSynced.push('aiMemory');
    if (tutor)  sourcesSynced.push('aiTutor');

    logger.info({ userId, sourcesSynced }, '[ContextFusion] Sources loaded');

    return buildFusedContext(userId, stateData, brain, memory, tutor, sourcesSynced);
  },
};

// ─────────────────────────────────────────────────────────────
// buildFusedContext
// ─────────────────────────────────────────────────────────────
function buildFusedContext(
  userId:       string,
  stateData:    StudentStateData,
  brain:        BrainSnapshot | null,
  memory:       AIMemorySnapshot | null,
  tutor:        any | null,
  sourcesSynced: string[]
): FusedAIContext {

  const profile = brain?.profile ?? null;

  // ── Identity ─────────────────────────────────────────────────
  // StudentIntelligenceProfile uses: learningType, classLevel, weakTopics,
  // strongTopics, currentStreak, overallMastery, tutorPersonality, learningSpeed
  const learningType   = profile?.learningType  ?? 'school';
  const classLevel     = profile?.classLevel    ?? null;
  const skillLevel     = tutor?.skillLevel      ?? deriveSkillLevel(profile?.overallMastery ?? 0);
  const tutorPersonality = profile?.tutorPersonality ?? 'normal';

  // ── Topics ───────────────────────────────────────────────────
  const brainWeakTopics   = profile?.weakTopics   ?? [];
  const stateWeakTopics   = stateData.weakTopics;
  const memoryWeakTopics  = (memory?.weakTopics ?? []).map(w => w.topic);

  // Merge + deduplicate weak topics from all sources
  const allWeakTopics = [...new Set([
    ...brainWeakTopics,
    ...stateWeakTopics,
    ...memoryWeakTopics,
  ])].slice(0, 8);

  // Persistent weak areas = appeared 2+ times in memory
  const persistentWeakAreas = (memory?.weakTopics ?? [])
    .filter(w => w.occurrences >= 2)
    .map(w => w.topic)
    .slice(0, 5);

  const strongTopics = profile?.strongTopics ?? stateData.strongTopics;

  // ── Performance ───────────────────────────────────────────────
  const overallMastery = profile?.overallMastery  ?? stateData.overallMastery;
  const streakDays     = profile?.currentStreak   ?? stateData.streakDays;
  const learningSpeed  = profile?.learningSpeed   ?? stateData.learningVelocity;

  // ── Memory ────────────────────────────────────────────────────
  const recentQuestions = (memory?.recentConversations ?? [])
    .slice(0, 3)
    .map(c => c.question);

  const achievements = (memory?.achievements ?? [])
    .slice(0, 3)
    .map(a => a.title);

  // ── Daily plan topics ─────────────────────────────────────────
  // DailyPlan has: date, greeting, focusMessage, recommendations[], motivationalNote
  const currentTopics = (brain?.dailyPlan?.recommendations ?? [])
    .slice(0, 3)
    .map((r: any) => r.topic ?? r.title ?? '')
    .filter(Boolean);

  // ── Build system prompt prefix ────────────────────────────────
  const systemPromptPrefix = buildSystemPromptPrefix({
    learningType,
    classLevel,
    skillLevel,
    currentState:    stateData.currentState,
    weakTopics:      allWeakTopics,
    persistentWeakAreas,
    strongTopics,
    currentTopics,
    recentQuestions,
    overallMastery,
    streakDays,
    tutorPersonality,
    isStruggling:    stateData.currentState === 'STUCK',
    isNewUser:       stateData.currentState === 'NEW_USER',
    learningVelocity: String(learningSpeed),
  });

  return {
    userId,
    learningType:       String(learningType),
    classLevel,
    skillLevel,
    currentState:       stateData.currentState,
    isStruggling:       stateData.currentState === 'STUCK',
    isImproving:        stateData.currentState === 'IMPROVING',
    isNewUser:          stateData.currentState === 'NEW_USER',
    weakTopics:         allWeakTopics,
    strongTopics,
    recentSubjects:     stateData.recentSubjects,
    persistentWeakAreas,
    overallMastery,
    streakDays,
    learningSpeed:      String(learningSpeed),
    recentQuestions,
    achievements,
    tutorPersonality,
    systemPromptPrefix,
    fusedAt:            new Date().toISOString(),
    sourcesSynced,
  };
}

// ─────────────────────────────────────────────────────────────
// System Prompt Builder
// ─────────────────────────────────────────────────────────────
interface PromptParams {
  learningType:       string;
  classLevel:         string | null;
  skillLevel:         string;
  currentState:       string;
  weakTopics:         string[];
  persistentWeakAreas: string[];
  strongTopics:       string[];
  currentTopics:      string[];
  recentQuestions:    string[];
  overallMastery:     number;
  streakDays:         number;
  tutorPersonality:   string;
  isStruggling:       boolean;
  isNewUser:          boolean;
  learningVelocity:   string;
}

function buildSystemPromptPrefix(p: PromptParams): string {
  const lines: string[] = [
    '## AI Study OS — Student Context (Stage 5)',
    '',
    `**Learning Type:** ${formatLearningType(p.learningType)}` +
      (p.classLevel ? ` | ${p.classLevel}` : ''),
    `**Skill Level:** ${p.skillLevel} | **State:** ${p.currentState}`,
    `**Mastery:** ${p.overallMastery}% | **Streak:** ${p.streakDays} days | **Pace:** ${p.learningVelocity}`,
    '',
  ];

  if (p.currentTopics.length > 0) {
    lines.push(`**Currently Studying:** ${p.currentTopics.join(', ')}`);
  }

  if (p.weakTopics.length > 0) {
    lines.push(`**Weak Areas (needs extra attention):** ${p.weakTopics.join(', ')}`);
  }

  if (p.persistentWeakAreas.length > 0) {
    lines.push(`**Persistent Struggles (appeared 2+ times):** ${p.persistentWeakAreas.join(', ')}`);
    lines.push('→ Use simpler language and more examples for these topics.');
  }

  if (p.strongTopics.length > 0) {
    lines.push(`**Strong Areas:** ${p.strongTopics.join(', ')}`);
  }

  if (p.recentQuestions.length > 0) {
    lines.push('');
    lines.push('**Student recently asked:**');
    p.recentQuestions.forEach(q => lines.push(`  - "${q}"`));
    lines.push('→ Use this context to build connected explanations.');
  }

  lines.push('');
  lines.push('**Teaching Instructions:**');
  lines.push(buildTeachingInstructions(p));

  lines.push('');
  lines.push('---');
  lines.push('');

  return lines.join('\n');
}

function buildTeachingInstructions(p: PromptParams): string {
  const parts: string[] = [];

  // Personality-based instruction
  switch (p.tutorPersonality) {
    case 'simple':
      parts.push('Use very simple language. Avoid jargon. Use relatable daily-life examples.');
      break;
    case 'advanced':
      parts.push('Use technical language. Skip basics unless asked. Include edge cases and best practices.');
      break;
    default:
      parts.push('Balance simplicity with depth. Use practical examples.');
  }

  // State-based instruction
  if (p.isStruggling) {
    parts.push('Student is struggling — be extra patient. Break explanations into small steps. Add encouragement.');
  } else if (p.isNewUser) {
    parts.push('New student — be welcoming and exciting. Keep things simple and motivating.');
  }

  // Learning type instruction
  switch (p.learningType) {
    case 'coding':
      parts.push('Include code examples when relevant. Show runnable snippets with comments.');
      break;
    case 'school':
      parts.push('Use examples from school subjects. Relate concepts to textbook context.');
      break;
    case 'college':
      parts.push('Go deeper technically. Connect theory to real-world applications.');
      break;
  }

  if (p.persistentWeakAreas.length > 0) {
    parts.push(`Student has struggled repeatedly with: ${p.persistentWeakAreas.join(', ')}. Show extra patience here.`);
  }

  return parts.join(' ');
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function deriveSkillLevel(mastery: number): string {
  if (mastery >= 75) return 'advanced';
  if (mastery >= 45) return 'intermediate';
  return 'beginner';
}

function formatLearningType(type: string): string {
  const map: Record<string, string> = {
    school:  'School Student',
    coding:  'Coding Learner',
    college: 'College Student',
    self:    'Self-Learner',
  };
  return map[type] ?? type;
}