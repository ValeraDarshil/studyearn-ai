/**
 * AI Study OS — Learning Path Generator (Stage 3)
 * ─────────────────────────────────────────────────────────────
 * Generates personalized LEARNING ROADMAPS for each student.
 *
 * This is different from the existing learningEngineService.ts:
 *   learningEngineService → stores 7-day LearningPath in MongoDB
 *   THIS file → generates the LOGIC behind what goes IN that path.
 *
 * It uses:
 *   - TopicPriorityAnalyzer → which topics to cover
 *   - DifficultyAdapter     → what difficulty for each step
 *   - Student type          → school / coding / college / self
 *
 * The output of this file feeds INTO learningEngineService.ts
 * to persist the final path.
 *
 * Path templates per learner type:
 *   school  → concept → practice → quiz → revision
 *   coding  → concept → code exercise → mini project → quiz
 *   college → concept → advanced problem → revision → mock test
 *   self    → flexible mix based on weak topics
 */

import { StudentProfile }                    from '../../models/StudentProfile.model.js';
import { getTopNPriorityTopics, PrioritizedTopic } from './topicPriorityAnalyzer.js';
import { getOverallDifficulty, DifficultyLevel }   from './difficultyAdapter.js';
import { logger }                            from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export type StepType =
  | 'learn_concept'
  | 'practice_quiz'
  | 'coding_exercise'
  | 'revision'
  | 'project'
  | 'mock_test'
  | 'doubt_clearing';

export interface GeneratedStep {
  stepId:         string;
  dayNumber:      number;         // 1–7
  type:           StepType;
  title:          string;
  topic:          string;
  subject:        string;
  description:    string;
  estimatedMins:  number;
  difficulty:     DifficultyLevel;
  xpReward:       number;
  tipForStudent:  string;         // motivational tip
}

export interface GeneratedPath {
  title:          string;
  description:    string;
  learnerCategory:string;
  subject:        string;
  focusTopics:    string[];
  totalDays:      number;
  steps:          GeneratedStep[];
  adaptiveDiff:   DifficultyLevel;
  weeklyGoalMins: number;         // total study time goal for the week
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — generatePath
// Creates a 7-day personalized learning path structure
// ─────────────────────────────────────────────────────────────
export async function generatePath(
  userId:  string,
  subject?: string,
): Promise<GeneratedPath | null> {
  try {
    const [profile, priorityTopics, diffDecision] = await Promise.all([
      StudentProfile.findOne({ userId })
        .select('learnerCategory primarySubjects overallMasteryScore learningSpeed currentStreak')
        .lean() as any,
      getTopNPriorityTopics(userId, 4),
      getOverallDifficulty(userId),
    ]);

    if (!profile) return null;

    const category  = profile.learnerCategory || 'self';
    const speed     = profile.learningSpeed   || 'medium';
    const mastery   = profile.overallMasteryScore || 0;
    const streak    = profile.currentStreak   || 0;

    // Determine subject — priority topic's subject OR user-chosen
    const targetSubject = subject
      || priorityTopics[0]?.subject
      || profile.primarySubjects?.[0]
      || 'General';

    // Topics to cover — top 3 priority topics
    const focusTopics = priorityTopics.map(t => t.topic).slice(0, 3);

    // Get the step template for this learner type
    const stepTemplate = getStepTemplate(category, focusTopics, diffDecision.level);

    // Build all 7 steps
    const steps: GeneratedStep[] = stepTemplate.map((template, i) => {
      const topic   = focusTopics[i % focusTopics.length] || 'Core Concepts';
      const xp      = computeXP(template.type, diffDecision.level, template.mins);

      return {
        stepId:        generateId(),
        dayNumber:     i + 1,
        type:          template.type,
        title:         buildStepTitle(template.type, topic, i + 1, category),
        topic,
        subject:       targetSubject,
        description:   buildStepDescription(template.type, topic, category, diffDecision.level),
        estimatedMins: adjustMinsForSpeed(template.mins, speed),
        difficulty:    diffDecision.level,
        xpReward:      Math.round(xp * diffDecision.xpMultiplier),
        tipForStudent: buildStepTip(template.type, topic, streak, i),
      };
    });

    const weeklyGoalMins = steps.reduce((s, step) => s + step.estimatedMins, 0);

    return {
      title:          buildPathTitle(category, targetSubject, focusTopics[0]),
      description:    buildPathDescription(category, mastery, focusTopics),
      learnerCategory: category,
      subject:        targetSubject,
      focusTopics,
      totalDays:      7,
      steps,
      adaptiveDiff:   diffDecision.level,
      weeklyGoalMins,
    };
  } catch (err: any) {
    logger.error(`[LearningPathGenerator] generatePath: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// getNextStep — what should the student do NEXT (single step)
// Used by the daily planner for today's immediate task
// ─────────────────────────────────────────────────────────────
export async function getNextStep(
  userId: string,
): Promise<GeneratedStep | null> {
  const path = await generatePath(userId);
  return path?.steps[0] || null;
}

// ─────────────────────────────────────────────────────────────
// STEP TEMPLATES PER LEARNER TYPE
// ─────────────────────────────────────────────────────────────
interface StepTemplate { type: StepType; mins: number; }

function getStepTemplate(
  category:    string,
  focusTopics: string[],
  difficulty:  DifficultyLevel,
): StepTemplate[] {
  const isAdvanced = difficulty === 'hard' || difficulty === 'advanced';

  const templates: Record<string, StepTemplate[]> = {
    school: [
      { type: 'learn_concept',   mins: 20 },
      { type: 'practice_quiz',   mins: 15 },
      { type: 'revision',        mins: 15 },
      { type: 'practice_quiz',   mins: 20 },
      { type: 'doubt_clearing',  mins: 15 },
      { type: 'mock_test',       mins: 25 },
      { type: 'revision',        mins: 10 },
    ],
    coding: [
      { type: 'learn_concept',   mins: 20 },
      { type: 'coding_exercise', mins: 30 },
      { type: 'coding_exercise', mins: 25 },
      { type: 'practice_quiz',   mins: 15 },
      { type: 'project',         mins: isAdvanced ? 45 : 30 },
      { type: 'coding_exercise', mins: 30 },
      { type: 'mock_test',       mins: 20 },
    ],
    college: [
      { type: 'learn_concept',   mins: 30 },
      { type: 'practice_quiz',   mins: 20 },
      { type: 'revision',        mins: 20 },
      { type: 'practice_quiz',   mins: 25 },
      { type: 'doubt_clearing',  mins: 20 },
      { type: 'mock_test',       mins: isAdvanced ? 40 : 30 },
      { type: 'revision',        mins: 15 },
    ],
    self: [
      { type: 'learn_concept',   mins: 20 },
      { type: 'practice_quiz',   mins: 15 },
      { type: 'coding_exercise', mins: 25 },
      { type: 'revision',        mins: 15 },
      { type: 'practice_quiz',   mins: 20 },
      { type: 'project',         mins: 30 },
      { type: 'mock_test',       mins: 20 },
    ],
  };

  return templates[category] || templates.self;
}

// ─────────────────────────────────────────────────────────────
// BUILDERS
// ─────────────────────────────────────────────────────────────
function buildStepTitle(type: StepType, topic: string, day: number, category: string): string {
  const titles: Record<StepType, string> = {
    learn_concept:   `Day ${day}: Learn ${topic}`,
    practice_quiz:   `Day ${day}: Quiz — ${topic}`,
    coding_exercise: `Day ${day}: Code ${topic}`,
    revision:        `Day ${day}: Revise ${topic}`,
    project:         `Day ${day}: Build with ${topic}`,
    mock_test:       `Day ${day}: Mock Test — ${topic}`,
    doubt_clearing:  `Day ${day}: Clear Doubts — ${topic}`,
  };
  return titles[type] || `Day ${day}: ${topic}`;
}

function buildStepDescription(
  type:     StepType,
  topic:    string,
  category: string,
  diff:     DifficultyLevel,
): string {
  const isCoding = category === 'coding';

  const descriptions: Partial<Record<StepType, string>> = {
    learn_concept:   `Study the core concepts of ${topic}. ${diff === 'beginner' ? 'Focus on understanding the basics.' : 'Go deep into the theory and real-world applications.'}`,
    practice_quiz:   `Test your understanding of ${topic} with targeted practice questions. Aim for at least 70% accuracy.`,
    coding_exercise: `Write code using ${topic}. ${diff === 'beginner' ? 'Start with simple examples.' : 'Tackle challenging problems that test edge cases.'}`,
    revision:        `Review everything you've learned about ${topic}. Use flashcards or notes. Focus on what felt unclear.`,
    project:         `Build a small project that uses ${topic}. Real projects cement learning better than theory alone.`,
    mock_test:       `Take a full timed test on ${topic}. Simulate exam conditions — no notes, no hints.`,
    doubt_clearing:  `List your biggest confusions about ${topic} and get them resolved. Ask the AI Tutor targeted questions.`,
  };

  return descriptions[type] || `Practice ${topic} with focus and consistency.`;
}

function buildStepTip(type: StepType, topic: string, streak: number, index: number): string {
  const tips = [
    `Focus on understanding, not memorizing. ${topic} will click once you see the pattern.`,
    streak > 0 ? `${streak}-day streak! Keep going — consistency is everything.` : `Every session builds your skill. Don't break the chain!`,
    `If you get stuck on ${topic}, break it into smaller pieces.`,
    `Explaining ${topic} to yourself out loud is one of the best learning techniques.`,
    `Done is better than perfect. Complete the task first, optimize later.`,
  ];
  return tips[index % tips.length];
}

function buildPathTitle(category: string, subject: string, topTopic?: string): string {
  const titles: Record<string, string> = {
    school:  `Your 7-Day ${subject} Mastery Plan`,
    coding:  `Your 7-Day ${topTopic || subject} Coding Journey`,
    college: `Your 7-Day ${subject} Academic Plan`,
    self:    `Your 7-Day Personal ${subject} Learning Plan`,
  };
  return titles[category] || `Your 7-Day ${subject} Learning Plan`;
}

function buildPathDescription(
  category:    string,
  mastery:     number,
  focusTopics: string[],
): string {
  const topicList = focusTopics.slice(0, 2).join(' and ');
  if (mastery < 30) {
    return `A structured plan to build your foundation in ${topicList}. Starting from the basics and progressing step by step.`;
  }
  if (mastery < 65) {
    return `A targeted plan to strengthen your understanding of ${topicList} and push your mastery higher.`;
  }
  return `An advanced plan to deepen your expertise in ${topicList} with challenging problems and projects.`;
}

function adjustMinsForSpeed(baseMins: number, speed: string): number {
  if (speed === 'slow') return Math.round(baseMins * 1.3);
  if (speed === 'fast') return Math.round(baseMins * 0.85);
  return baseMins;
}

function computeXP(type: StepType, diff: DifficultyLevel, mins: number): number {
  const baseByType: Record<StepType, number> = {
    learn_concept:   30,
    practice_quiz:   40,
    coding_exercise: 50,
    revision:        25,
    project:         75,
    mock_test:       60,
    doubt_clearing:  20,
  };
  const diffMultiplier: Record<DifficultyLevel, number> = {
    beginner: 0.8, easy: 0.9, medium: 1.0, hard: 1.2, advanced: 1.5,
  };
  return Math.round(baseByType[type] * diffMultiplier[diff]);
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}