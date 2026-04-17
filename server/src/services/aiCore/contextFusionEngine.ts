/**
 * AI Study OS — Context Fusion Engine  (v2 — Long-Term Memory Integration)
 * ─────────────────────────────────────────────────────────────
 * GAP 2 FIX: Replaced session-only memory dump with:
 *   • longTermMemoryEngine  — persistent student history
 *   • memoryRetrievalEngine — relevant-first (topK) retrieval
 *
 * Original fuse() logic fully preserved.
 * New memory layer ADDS to the systemPromptPrefix — no breaking changes.
 */

import { StudentStateData }                   from './studentStateManager.js';
import { aiMemoryStore, AIMemorySnapshot }    from './aiMemoryStore.js';
import { getBrainSnapshot, BrainSnapshot }    from '../aiBrain/aiBrain.service.js';
import { buildTutorContext }                  from '../aiTutor/tutorContextManager.js';
import { logger }                             from '../../utils/logger.js';

// ── GAP 2 NEW imports ─────────────────────────────────────────
import { longTermMemoryEngine }               from '../adaptive/longTermMemoryEngine.js';
import { memoryRetrievalEngine }              from '../adaptive/memoryRetrievalEngine.js';

// ── Types ──────────────────────────────────────────────────────

export interface FusedAIContext {
  userId:        string;

  learningType:  string;
  classLevel:    string | null;
  skillLevel:    string;

  currentState:    string;
  isStruggling:    boolean;
  isImproving:     boolean;
  isNewUser:       boolean;

  weakTopics:          string[];
  strongTopics:        string[];
  recentSubjects:      string[];
  persistentWeakAreas: string[];

  overallMastery:  number;
  streakDays:      number;
  learningSpeed:   string;

  recentQuestions:  string[];
  achievements:     string[];

  tutorPersonality:   string;
  systemPromptPrefix: string;

  // GAP 2: long-term memory additions
  longTermWeakConcepts:  string[];
  longTermStrongConcepts: string[];
  relevantMemoryBlock:   string;

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
    const [brainResult, memoryResult, tutorResult, ltmResult, retrievalResult] = await Promise.allSettled([
      getBrainSnapshot(userId),
      aiMemoryStore.getMemorySnapshot(userId),
      buildTutorContext(userId, 'context preparation'),
      // GAP 2: Long-term memory
      longTermMemoryEngine.getMemory(userId),
      // GAP 2: Relevant retrieval (use student state as query)
      memoryRetrievalEngine.retrieve({
        userId,
        queryText:    stateData.currentState,
        currentState: stateData.currentState,
        topK:         5,
      }),
    ]);

    const brain     = brainResult.status     === 'fulfilled' ? brainResult.value     : null;
    const memory    = memoryResult.status    === 'fulfilled' ? memoryResult.value    : null;
    const tutor     = tutorResult.status     === 'fulfilled' ? tutorResult.value     : null;
    const ltMemory  = ltmResult.status       === 'fulfilled' ? ltmResult.value       : null;
    const retrieval = retrievalResult.status === 'fulfilled' ? retrievalResult.value : null;

    const sourcesSynced: string[] = ['studentState'];
    if (brain)     sourcesSynced.push('aiBrain');
    if (memory)    sourcesSynced.push('aiMemory');
    if (tutor)     sourcesSynced.push('aiTutor');
    if (ltMemory)  sourcesSynced.push('longTermMemory');
    if (retrieval) sourcesSynced.push('memoryRetrieval');

    logger.info({ userId, sourcesSynced }, '[ContextFusion] Sources loaded');

    return buildFusedContext(userId, stateData, brain, memory, tutor, ltMemory, retrieval, sourcesSynced);
  },
};

// ─────────────────────────────────────────────────────────────
// buildFusedContext — internal builder
// ─────────────────────────────────────────────────────────────
function buildFusedContext(
  userId:     string,
  stateData:  StudentStateData,
  brain:      any | null,
  memory:     AIMemorySnapshot | null,
  tutor:      any | null,
  ltMemory:   any | null,
  retrieval:  any | null,
  sourcesSynced: string[]
): FusedAIContext {

  // ── Identity ─────────────────────────────────────────────────
  const profile       = (brain as any)?.profile ?? null;
  const learningType  = profile?.learnerCategory   ?? tutor?.learnerType   ?? 'self';
  const classLevel    = profile?.classLevel        ?? tutor?.classLevel    ?? null;
  const skillLevel    = tutor?.skillLevel          ?? profile?.skillLevel  ?? 'intermediate';
  const tutorPersonality = profile?.tutorPersonality ?? tutor?.personality ?? 'mentor';

  // ── Current state ─────────────────────────────────────────────
  const { currentState, overallMastery, weakTopics: stateWeakTopics = [] } = stateData;
  const isStruggling = currentState === 'STUCK';
  const isImproving  = currentState === 'IMPROVING';
  const isNewUser    = currentState === 'NEW_USER';

  // ── Knowledge context ─────────────────────────────────────────
  const brainWeakTopics:   string[] = (brain as any)?.profile?.weakTopics   ?? [];
  const brainStrongTopics: string[] = (brain as any)?.profile?.strongTopics ?? [];
  const tutorWeakTopics:   string[] = tutor?.weakTopics ?? tutor?.criticalTopics ?? [];
  const memoryWeakTopics:  string[] = (memory?.weakTopics ?? []).map((w: any) => w.topic);

  const weakTopics   = dedupe([...stateWeakTopics, ...brainWeakTopics, ...tutorWeakTopics, ...memoryWeakTopics]).slice(0, 8);
  const strongTopics = dedupe(brainStrongTopics).slice(0, 6);

  const recentSubjects: string[] = (memory?.recentConversations ?? [])
    .map((c: any) => c.topic)
    .filter(Boolean)
    .slice(0, 5) as string[];

  // Persistent weak areas — appeared 2+ times in recentMistakes
  const mistakeCounts: Record<string, number> = {};
  for (const t of memoryWeakTopics) {
    mistakeCounts[t] = (mistakeCounts[t] ?? 0) + 1;
  }
  const persistentWeakAreas = Object.entries(mistakeCounts)
    .filter(([, count]) => count >= 2)
    .map(([t]) => t)
    .slice(0, 5);

  // ── Performance ───────────────────────────────────────────────
  const streakDays   = (brain as any)?.profile?.currentStreak ?? 0;
  const learningSpeed = (brain as any)?.profile?.learningSpeed ?? 'medium';

  // ── Memory ────────────────────────────────────────────────────
  const recentQuestions = (memory?.recentConversations ?? [])
    .map((c: any) => c.question)
    .filter(Boolean)
    .slice(0, 5) as string[];

  const achievements = (memory?.achievements ?? [])
    .map((a: any) => a.title)
    .filter(Boolean)
    .slice(0, 3) as string[];

  // ── GAP 2: Long-term memory fields ───────────────────────────
  const longTermWeakConcepts   = ltMemory?.weakConcepts?.map((c: any) => c.concept)   ?? [];
  const longTermStrongConcepts = ltMemory?.strongConcepts?.map((c: any) => c.concept) ?? [];
  const relevantMemoryBlock    = retrieval?.promptBlock ?? '';

  // ── Build system prompt prefix ────────────────────────────────
  const systemPromptPrefix = buildSystemPromptPrefix({
    learningType, classLevel, skillLevel, tutorPersonality,
    currentState, isStruggling, isImproving,
    weakTopics, strongTopics, persistentWeakAreas,
    overallMastery, streakDays, learningSpeed,
    recentQuestions, achievements,
    // GAP 2 additions
    longTermWeakConcepts,
    relevantMemoryBlock,
    ltMemoryBlock: ltMemory ? longTermMemoryEngine.buildMemoryPromptBlock(ltMemory) : '',
  });

  return {
    userId,
    learningType, classLevel, skillLevel,
    currentState, isStruggling, isImproving, isNewUser,
    weakTopics, strongTopics, recentSubjects, persistentWeakAreas,
    overallMastery: overallMastery ?? 0,
    streakDays, learningSpeed,
    recentQuestions, achievements,
    tutorPersonality, systemPromptPrefix,
    longTermWeakConcepts,
    longTermStrongConcepts,
    relevantMemoryBlock,
    fusedAt:       new Date().toISOString(),
    sourcesSynced,
  };
}

// ─────────────────────────────────────────────────────────────
// System prompt prefix builder
// ─────────────────────────────────────────────────────────────
function buildSystemPromptPrefix(data: {
  learningType:        string;
  classLevel:          string | null;
  skillLevel:          string;
  tutorPersonality:    string;
  currentState:        string;
  isStruggling:        boolean;
  isImproving:         boolean;
  weakTopics:          string[];
  strongTopics:        string[];
  persistentWeakAreas: string[];
  overallMastery:      number;
  streakDays:          number;
  learningSpeed:       string;
  recentQuestions:     string[];
  achievements:        string[];
  longTermWeakConcepts: string[];
  relevantMemoryBlock:  string;
  ltMemoryBlock:        string;
}): string {
  const lines: string[] = [];

  lines.push(`Student Type: ${data.learningType}${data.classLevel ? ` (${data.classLevel})` : ''}`);
  lines.push(`Skill Level: ${data.skillLevel} | Mastery: ${data.overallMastery}% | Streak: ${data.streakDays} days`);
  lines.push(`Learning State: ${data.currentState} | Speed: ${data.learningSpeed}`);

  if (data.weakTopics.length > 0) {
    lines.push(`Weak Topics: ${data.weakTopics.slice(0, 5).join(', ')}`);
  }
  if (data.strongTopics.length > 0) {
    lines.push(`Strong Topics: ${data.strongTopics.slice(0, 4).join(', ')}`);
  }
  if (data.persistentWeakAreas.length > 0) {
    lines.push(`⚠️ Persistent struggles: ${data.persistentWeakAreas.join(', ')}`);
  }
  if (data.isStruggling) {
    lines.push('🔴 Student is STUCK — use simpler explanations and extra encouragement.');
  }
  if (data.isImproving) {
    lines.push('🟢 Student is IMPROVING — acknowledge progress and gently increase challenge.');
  }
  if (data.recentQuestions.length > 0) {
    lines.push(`Recent questions: ${data.recentQuestions.slice(0, 3).join(' | ')}`);
  }
  if (data.achievements.length > 0) {
    lines.push(`Recent wins: ${data.achievements.join(', ')}`);
  }

  // GAP 2: Long-term memory additions
  if (data.ltMemoryBlock) {
    lines.push('');
    lines.push(data.ltMemoryBlock);
  }
  if (data.relevantMemoryBlock) {
    lines.push('');
    lines.push(data.relevantMemoryBlock);
  }

  return lines.join('\n');
}

function dedupe(arr: string[]): string[] {
  return [...new Set(arr.filter(Boolean))];
}