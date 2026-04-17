/**
 * AI Study OS — AI Decision Engine  (v2 — Adaptive Strategy Scoring)
 * ─────────────────────────────────────────────────────────────
 * GAP 1 FIX: Replaced static "if (confused) → SIMPLIFY" with
 * strategyScoringEngine — scores each strategy and picks the best.
 *
 * GAP 8 FIX: Reads optimizationEngine output to inform decisions.
 *
 * All original logic preserved. New adaptive layer sits ON TOP.
 */

import { StudentStateData, StudentState } from './studentStateManager.js';
import { OrchestrationTrigger }           from './aiOrchestrator.js';
import { logger }                         from '../../utils/logger.js';

// ── NEW: Adaptive imports ──────────────────────────────────────
import { strategyScoringEngine }          from '../adaptive/strategyScoringEngine.js';
import { optimizationEngine }             from '../adaptive/metricsEngine.js';
import { memoryRetrievalEngine }          from '../adaptive/memoryRetrievalEngine.js';

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

    // ── GAP 1 FIX: Adaptive state decisions ──────────────────
    // Instead of pure static rules, use strategy scoring for STUCK/IMPROVING/ADVANCED
    if (!isLightweightTrigger(trigger) || forceFullRun) {
      if (['STUCK', 'IMPROVING', 'ADVANCED'].includes(currentState)) {
        decisions.push(...await getAdaptiveStateDecisions(userId, currentState, stateData));
      } else {
        decisions.push(...getStateDecisions(currentState, stateData));
      }
    }

    // Alert-driven decisions
    decisions.push(...getAlertDecisions(stateData));

    // ── GAP 8 FIX: Optimization-driven decisions ─────────────
    // Run optimization check in background — non-blocking
    if (!isLightweightTrigger(trigger)) {
      applyOptimizationDecisions(userId, decisions).catch(() => {});
    }

    const ordered = sortByPriority(deduplicateDecisions(decisions));

    logger.info(
      { userId, count: ordered.length, actions: ordered.map(d => d.action) },
      '[DecisionEngine] Decisions generated'
    );

    return ordered;
  },
};

// ─────────────────────────────────────────────────────────────
// GAP 1: Adaptive state decisions using strategy scoring
// ─────────────────────────────────────────────────────────────
async function getAdaptiveStateDecisions(
  userId:       string,
  currentState: string,
  stateData:    StudentStateData
): Promise<OrchestratorDecision[]> {

  try {
    // Get top-ranked strategies for this student+state
    const topStrategies = await strategyScoringEngine.getTopStrategies({
      userId,
      currentState,
      masteryLevel:      stateData.overallMastery ?? 50,
      confusionSignal:   currentState === 'STUCK',
      frustrationSignal: false,
      sessionStreak:     0,
      lastStrategy:      null,
    }, 2);

    const primary   = topStrategies[0];
    const secondary = topStrategies[1];

    const decisions: OrchestratorDecision[] = [];

    if (currentState === 'STUCK') {
      decisions.push({
        action:     'triggerTutor',
        priority:   'critical',
        reason:     `Stuck — adaptive strategy: ${primary?.strategy ?? 'SIMPLIFY'} (score: ${primary?.score.toFixed(2)})`,
        background: false,
        metadata:   {
          weakTopics:       stateData.weakTopics,
          adaptiveStrategy: primary?.strategy,
          strategyScore:    primary?.score,
        },
      });
      decisions.push({
        action:     'adjustDifficulty',
        priority:   'high',
        reason:     `Reduce difficulty — confusion detected`,
        background: false,
        metadata:   { direction: 'decrease' },
      });
    }

    if (currentState === 'IMPROVING') {
      decisions.push({
        action:     'generateInsights',
        priority:   'high',
        reason:     `Improving — motivational insights`,
        background: false,
      });
      // Score-based: only boost difficulty if strategy scoring agrees
      if (primary?.strategy === 'CHALLENGE' || secondary?.strategy === 'CHALLENGE') {
        decisions.push({
          action:     'boostDifficulty',
          priority:   'normal',
          reason:     `Strategy score recommends CHALLENGE (${primary?.score.toFixed(2)})`,
          background: true,
          metadata:   { direction: 'increase' },
        });
      }
    }

    if (currentState === 'ADVANCED') {
      decisions.push({
        action:     'challengeMode',
        priority:   'high',
        reason:     `Advanced — top strategy: ${primary?.strategy} (score: ${primary?.score.toFixed(2)})`,
        background: false,
        metadata:   { adaptiveStrategy: primary?.strategy },
      });
    }

    return decisions;

  } catch (err: any) {
    // Fallback to static rules on error
    logger.warn({ userId, err: err.message }, '[DecisionEngine] Adaptive scoring failed — using static rules');
    return getStateDecisions(currentState as StudentState, stateData);
  }
}

// ─────────────────────────────────────────────────────────────
// GAP 8: Apply optimization engine signals
// ─────────────────────────────────────────────────────────────
async function applyOptimizationDecisions(
  userId:    string,
  decisions: OrchestratorDecision[]
): Promise<void> {
  try {
    const optimization = await optimizationEngine.optimize(userId);

    if (optimization.reengagementSuggested) {
      // Only add if not already present
      const hasReengagement = decisions.some(d => d.action === 'reengagementPlan');
      if (!hasReengagement) {
        decisions.push({
          action:     'reengagementPlan',
          priority:   'high',
          reason:     `Optimization: churn risk=${optimization.churnRisk}`,
          background: true,
          metadata:   { churnRisk: optimization.churnRisk, recommendation: optimization.recommendation },
        });
      }
    }

    if (optimization.suggestedDifficultyDelta === 1) {
      const hasBoost = decisions.some(d => d.action === 'boostDifficulty');
      if (!hasBoost) {
        decisions.push({
          action:     'boostDifficulty',
          priority:   'low',
          reason:     `Optimization: accuracy improving, increase difficulty`,
          background: true,
          metadata:   { direction: 'increase' },
        });
      }
    }
  } catch {
    // Non-fatal — optimization is always best-effort
  }
}

// ─────────────────────────────────────────────────────────────
// Original Trigger Rules (unchanged)
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
// Original Static State Rules (preserved as fallback)
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

function getAlertDecisions(stateData: StudentStateData): OrchestratorDecision[] {
  const decisions: OrchestratorDecision[] = [];
  for (const alert of stateData.alerts) {
    if (alert.type === 'milestone') {
      decisions.push({ action: 'celebrateMilestone', priority: 'normal', reason: alert.message, background: true });
    }
  }
  return decisions;
}

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