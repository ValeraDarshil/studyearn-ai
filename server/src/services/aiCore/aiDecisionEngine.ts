/**
 * AI Study OS — AI Decision Engine (Stage 5)
 * ─────────────────────────────────────────────────────────────
 * Analyzes student state + trigger → generates ordered action list.
 *
 * Smart filtering rules:
 *   'ask_ai'          → only buildAIContext + prepareTutor
 *   'lesson_complete' → progress update + insights
 *   'login'           → full run (background)
 *   'daily_cron'      → full maintenance
 */

import { StudentStateData, StudentState } from './studentStateManager.js';
import { OrchestrationTrigger }           from './aiOrchestrator.js';
import { logger }                         from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export type DecisionAction =
  | 'generateLearningPlan'
  | 'refreshDailyPlan'
  | 'updateProgress'
  | 'generateInsights'
  | 'triggerTutor'
  | 'prepareTutor'
  | 'adjustDifficulty'
  | 'boostDifficulty'
  | 'onboardStudent'
  | 'reengagementPlan'
  | 'suggestTopics'
  | 'celebrateMilestone'
  | 'challengeMode'
  | 'buildAIContext'
  | 'syncMemory';

export interface OrchestratorDecision {
  action:     DecisionAction;
  priority:   'critical' | 'high' | 'normal' | 'low';
  reason:     string;
  background: boolean;
  metadata?:  Record<string, unknown>;
}

export interface DecisionEngineInput {
  stateData:    StudentStateData;
  trigger:      OrchestrationTrigger;
  forceFullRun: boolean;
  contextOnly:  boolean;
}

// ─────────────────────────────────────────────────────────────
// aiDecisionEngine
// ─────────────────────────────────────────────────────────────
export const aiDecisionEngine = {

  async analyze(input: DecisionEngineInput): Promise<OrchestratorDecision[]> {
    const { stateData, trigger, forceFullRun, contextOnly } = input;
    const { userId, currentState } = stateData;

    logger.info({ userId, state: currentState, trigger }, '[DecisionEngine] Generating decisions');

    const decisions: OrchestratorDecision[] = [];

    // buildAIContext ALWAYS runs
    decisions.push({
      action:     'buildAIContext',
      priority:   'critical',
      reason:     'AI context must always be built for AskAI',
      background: false,
    });

    if (contextOnly) {
      logger.info({ userId }, '[DecisionEngine] contextOnly — stopping at buildAIContext');
      return decisions;
    }

    // Trigger-based decisions
    decisions.push(...getTriggerDecisions(trigger));

    // State-based decisions (skip for lightweight triggers unless forceFullRun)
    if (!isLightweightTrigger(trigger) || forceFullRun) {
      decisions.push(...getStateDecisions(currentState, stateData));
    }

    // Alert-driven decisions
    decisions.push(...getAlertDecisions(stateData));

    const ordered = sortByPriority(deduplicateDecisions(decisions));

    logger.info(
      { userId, count: ordered.length, actions: ordered.map(d => d.action) },
      '[DecisionEngine] Decisions generated'
    );

    return ordered;
  },
};

// ─────────────────────────────────────────────────────────────
// Trigger Rules
// ─────────────────────────────────────────────────────────────
function getTriggerDecisions(trigger: OrchestrationTrigger): OrchestratorDecision[] {
  switch (trigger) {
    case 'login':
      return [
        { action: 'refreshDailyPlan', priority: 'high',   reason: 'Login — refresh daily plan',   background: false },
        { action: 'syncMemory',       priority: 'normal', reason: 'Login — sync AI memory',        background: true  },
      ];
    case 'lesson_complete':
      return [
        { action: 'updateProgress',   priority: 'high',   reason: 'Lesson done — update progress', background: false },
        { action: 'generateInsights', priority: 'normal', reason: 'Post-lesson insights',           background: true  },
      ];
    case 'quiz_complete':
      return [
        { action: 'updateProgress',   priority: 'high',   reason: 'Quiz done — update scores',     background: false },
        { action: 'generateInsights', priority: 'high',   reason: 'Quiz result insights',           background: false },
      ];
    case 'ask_ai':
      return [
        { action: 'prepareTutor',     priority: 'critical', reason: 'AskAI — need tutor context',  background: false },
      ];
    case 'progress_check':
      return [
        { action: 'generateInsights', priority: 'high',   reason: 'Progress check requested',      background: false },
        { action: 'updateProgress',   priority: 'high',   reason: 'Refresh progress data',          background: false },
      ];
    case 'daily_cron':
      return [
        { action: 'generateLearningPlan', priority: 'high',   reason: 'Daily plan refresh',        background: true },
        { action: 'updateProgress',       priority: 'high',   reason: 'Daily progress sync',       background: true },
        { action: 'generateInsights',     priority: 'normal', reason: 'Daily insights',            background: true },
        { action: 'syncMemory',           priority: 'low',    reason: 'Daily memory cleanup',      background: true },
      ];
    case 'manual':
      return [
        { action: 'generateLearningPlan', priority: 'high',   reason: 'Manual run',               background: false },
        { action: 'generateInsights',     priority: 'normal', reason: 'Manual insights',           background: false },
      ];
    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────
// State Rules
// ─────────────────────────────────────────────────────────────
function getStateDecisions(
  state:     StudentState,
  stateData: StudentStateData
): OrchestratorDecision[] {
  switch (state) {
    case 'NEW_USER':
      return [
        { action: 'generateLearningPlan', priority: 'critical', reason: 'New user — create initial plan',     background: false },
        { action: 'onboardStudent',        priority: 'high',    reason: 'New user onboarding',                background: false },
        { action: 'prepareTutor',          priority: 'high',    reason: 'Prepare tutor for new user',         background: false },
      ];
    case 'EXPLORING':
      return [
        { action: 'suggestTopics',         priority: 'high',   reason: 'Guide student to right topics',       background: false },
        { action: 'prepareTutor',          priority: 'normal', reason: 'Light tutor context',                 background: true  },
      ];
    case 'LEARNING':
      return [
        { action: 'refreshDailyPlan',      priority: 'high',   reason: 'Active learner — keep plan fresh',   background: false },
        { action: 'updateProgress',        priority: 'normal', reason: 'Update progress',                    background: true  },
      ];
    case 'STUCK':
      return [
        { action: 'triggerTutor',          priority: 'critical', reason: `Stuck — mastery ${stateData.overallMastery}%`, background: false, metadata: { weakTopics: stateData.weakTopics } },
        { action: 'adjustDifficulty',      priority: 'high',   reason: 'Reduce difficulty for stuck student', background: false, metadata: { direction: 'decrease' } },
        { action: 'generateInsights',      priority: 'high',   reason: 'Support insights for stuck student',  background: false },
      ];
    case 'IMPROVING':
      return [
        { action: 'generateInsights',      priority: 'high',   reason: 'Motivational insights',              background: false },
        { action: 'boostDifficulty',       priority: 'normal', reason: 'Student ready for harder content',   background: true, metadata: { direction: 'increase' } },
        { action: 'celebrateMilestone',    priority: 'normal', reason: 'Celebrate improvement',              background: true  },
      ];
    case 'INACTIVE':
      return [
        { action: 'reengagementPlan',      priority: 'critical', reason: `Inactive ${stateData.daysSinceLastLogin} days`, background: false, metadata: { daysMissed: stateData.daysSinceLastLogin } },
        { action: 'generateInsights',      priority: 'high',   reason: 'Comeback motivation insights',       background: false },
      ];
    case 'ADVANCED':
      return [
        { action: 'challengeMode',         priority: 'high',   reason: 'Advanced student — challenge content', background: false },
        { action: 'generateInsights',      priority: 'normal', reason: 'Advanced performance insights',       background: true  },
        { action: 'boostDifficulty',       priority: 'normal', reason: 'Keep advanced student challenged',    background: true, metadata: { direction: 'increase', level: 'max' } },
      ];
    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────
// Alert Rules
// ─────────────────────────────────────────────────────────────
function getAlertDecisions(stateData: StudentStateData): OrchestratorDecision[] {
  const decisions: OrchestratorDecision[] = [];
  for (const alert of stateData.alerts) {
    if (alert.type === 'milestone') {
      decisions.push({ action: 'celebrateMilestone', priority: 'normal', reason: alert.message, background: true });
    }
  }
  return decisions;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function isLightweightTrigger(trigger: OrchestrationTrigger): boolean {
  return trigger === 'ask_ai' || trigger === 'lesson_complete' || trigger === 'quiz_complete';
}

function deduplicateDecisions(decisions: OrchestratorDecision[]): OrchestratorDecision[] {
  const seen = new Set<DecisionAction>();
  return decisions.filter(d => {
    if (seen.has(d.action)) return false;
    seen.add(d.action);
    return true;
  });
}

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, normal: 2, low: 3 };

function sortByPriority(decisions: OrchestratorDecision[]): OrchestratorDecision[] {
  return [...decisions].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}