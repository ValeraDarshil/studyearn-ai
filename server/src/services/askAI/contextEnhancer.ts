// ─────────────────────────────────────────────────────────────
// AskAI — contextEnhancer.ts
// Pulls data from: AI Brain (via Orchestrator), Tutor Context.
// Builds a rich CONTEXT BLOCK injected into every prompt.
// All imports are dynamic (lazy) so this never hard-crashes.
// ─────────────────────────────────────────────────────────────

import { getMemorySummary } from './conversationMemoryEngine.js';
import { logger }           from '../../utils/logger.js';

export type LearningState = 'struggling' | 'improving' | 'excelling' | 'unknown';

export interface EnhancedContext {
  skillLevel:     'beginner' | 'intermediate' | 'advanced';
  weakTopics:     string[];
  strongTopics:   string[];
  currentGoal:    string;
  learningState:  LearningState;
  recentActivity: string;
  sessionSummary: string;
  contextBlock:   string;
}

function normaliseSkill(raw?: string): EnhancedContext['skillLevel'] {
  if (!raw) return 'intermediate';
  const s = raw.toLowerCase();
  if (s === 'beginner') return 'beginner';
  if (s === 'advanced') return 'advanced';
  return 'intermediate';
}

function normaliseState(raw?: string): LearningState {
  if (!raw) return 'unknown';
  const s = raw.toUpperCase();
  if (s === 'STUCK')     return 'struggling';
  if (s === 'IMPROVING') return 'improving';
  if (s === 'EXCELLING' || s === 'ACTIVE') return 'excelling';
  return 'unknown';
}

export async function buildEnhancedContext(
  userId:  string,
  message: string,
): Promise<EnhancedContext> {

  let skillLevel:    EnhancedContext['skillLevel'] = 'intermediate';
  let weakTopics:    string[]     = [];
  let strongTopics:  string[]     = [];
  const currentGoal    = '';
  let learningState: LearningState = 'unknown';
  let recentActivity = '';

  // Layer 1: Stage 5 Orchestrator
  if (userId) {
    try {
      const { getFusedContextForAI } = await import('../aiCore/aiOrchestrator.js');
      const fused = await getFusedContextForAI(userId);
      if (fused) {
        skillLevel    = normaliseSkill(fused.skillLevel);
        weakTopics    = (fused.weakTopics   ?? []).slice(0, 6);
        strongTopics  = (fused.strongTopics ?? []).slice(0, 6);
        learningState = normaliseState(fused.currentState);
      }
    } catch (e: any) {
      logger.warn('contextEnhancer: orchestrator failed — ' + (e?.message ?? e));
    }
  }

  // Layer 2: Tutor Context Manager
  if (userId) {
    try {
      const { buildTutorContext } = await import('../aiTutor/tutorContextManager.js');
      const tutorCtx = await buildTutorContext(userId, message, 'ask', undefined);
      if (tutorCtx) {
        if (tutorCtx.skillLevel && skillLevel === 'intermediate') {
          skillLevel = normaliseSkill(tutorCtx.skillLevel);
        }
        if (tutorCtx.learningMode) recentActivity = tutorCtx.learningMode;
        const tutorWeak: string[] = tutorCtx.weakTopics ?? tutorCtx.criticalTopics ?? [];
        for (const t of tutorWeak) {
          if (!weakTopics.includes(t)) weakTopics.push(t);
        }
      }
    } catch (e: any) {
      logger.warn('contextEnhancer: tutor context failed — ' + (e?.message ?? e));
    }
  }

  // Layer 3: In-session memory
  const sessionSummary = userId ? getMemorySummary(userId) : '';

  // Build prompt-ready context block
  const lines: string[] = [
    '╔═══ STUDENT CONTEXT ════════════════════════════╗',
    `  Skill Level    : ${skillLevel.toUpperCase()}`,
  ];

  if (weakTopics.length > 0)
    lines.push(`  Weak Topics     : ${weakTopics.slice(0, 4).join(', ')}`);
  if (strongTopics.length > 0)
    lines.push(`  Strong Topics   : ${strongTopics.slice(0, 4).join(', ')}`);
  if (learningState !== 'unknown')
    lines.push(`  Learning State  : ${learningState.toUpperCase()}`);
  if (recentActivity)
    lines.push(`  Recent Activity : ${recentActivity}`);
  if (sessionSummary)
    lines.push(`  Session Memory  : ${sessionSummary}`);

  lines.push('╚════════════════════════════════════════════════╝');
  lines.push('');
  lines.push(
    'USE THIS CONTEXT: Naturally reference the student\'s history. ' +
    'If they struggled with a related topic, acknowledge it briefly. ' +
    'Adapt depth to skill level. Never say the word "context" to the student.'
  );

  return {
    skillLevel,
    weakTopics:     weakTopics.slice(0, 6),
    strongTopics:   strongTopics.slice(0, 6),
    currentGoal,
    learningState,
    recentActivity,
    sessionSummary,
    contextBlock:   lines.join('\n'),
  };
}