/**
 * AI Study OS — Learning Engine (AI Brain Module)
 * ─────────────────────────────────────────────────────────────
 * Decides WHAT the student should do NEXT.
 *
 * This orchestrates the aiBrain layer's recommendation logic:
 *   1. Analyzes weak topics + activity score
 *   2. Checks the active learning path
 *   3. Considers coding level for coding learners
 *   4. Returns prioritized daily + weekly recommendations
 *
 * Differences from learningEngineService.ts (existing):
 *   - That file: generates and stores 7-day LearningPath objects (heavy)
 *   - This file:  produces quick, real-time recommendations (lightweight)
 *     that are used by the AI Brain API and AskAI context.
 *
 * Both work together — this feeds its output INTO the context
 * that learningEngineService uses to generate paths.
 */

import { buildStudentProfile }        from './studentProfileEngine.js';
import { getPriorityTopics, AnalyzedTopic } from './topicAnalyzer.js';
import { logger }                     from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export interface LearningRecommendation {
  id:          string;
  type:        'practice' | 'learn' | 'revision' | 'challenge' | 'rest' | 'coding';
  title:       string;          // "Today: Focus on Algebra"
  description: string;          // detailed action description
  subject:     string;
  topic:       string;
  estimatedMins: number;
  difficulty:  'beginner' | 'intermediate' | 'advanced';
  urgency:     'high' | 'medium' | 'low';
  reason:      string;          // why we're recommending this
}

export interface DailyPlan {
  date:            string;
  greeting:        string;     // personalized greeting
  focusMessage:    string;     // main message of the day
  recommendations: LearningRecommendation[];
  motivationalNote:string;
  studyGoalMins:   number;     // suggested study time today
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — generateDailyPlan
// ─────────────────────────────────────────────────────────────
export async function generateDailyPlan(userId: string): Promise<DailyPlan | null> {
  try {
    const [profile, priorityTopics] = await Promise.all([
      buildStudentProfile(userId),
      getPriorityTopics(userId, 3),
    ]);

    if (!profile) return null;

    const today = new Date(Date.now() + 5.5 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    const recommendations = buildRecommendations(profile, priorityTopics);

    const greeting     = buildGreeting(profile.currentStreak, profile.activityTier);
    const focusMessage = buildFocusMessage(profile, priorityTopics);
    const motivationalNote = buildMotivation(profile);
    const studyGoalMins = computeStudyGoal(profile);

    return {
      date: today,
      greeting,
      focusMessage,
      recommendations,
      motivationalNote,
      studyGoalMins,
    };
  } catch (err: any) {
    logger.error(`[LearningEngine(Brain)] generateDailyPlan: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// getNextAction — single best action for the student right now
// Used in AskAI context injection ("Today you should practice X")
// ─────────────────────────────────────────────────────────────
export async function getNextAction(userId: string): Promise<{
  title:   string;
  subject: string;
  topic:   string;
  reason:  string;
} | null> {
  const plan = await generateDailyPlan(userId);
  if (!plan || plan.recommendations.length === 0) return null;

  const top = plan.recommendations[0];
  return {
    title:   top.title,
    subject: top.subject,
    topic:   top.topic,
    reason:  top.reason,
  };
}

// ─────────────────────────────────────────────────────────────
// getWeaknessActions — top actions targeting weak topics only
// ─────────────────────────────────────────────────────────────
export async function getWeaknessActions(
  userId: string,
  limit = 3
): Promise<LearningRecommendation[]> {
  const [profile, topics] = await Promise.all([
    buildStudentProfile(userId),
    getPriorityTopics(userId, limit),
  ]);
  if (!profile || topics.length === 0) return [];

  return topics.map((t, i) => ({
    id:          `weakness_${i}`,
    type:        ('practice' as const),
    title:       `Practice ${t.topic}`,
    description: t.action,
    subject:     t.subject,
    topic:       t.topic,
    estimatedMins: profile.learningSpeed === 'slow' ? 30 : 20,
    difficulty:  (t.mastery < 30 ? 'beginner' : 'intermediate') as any,
    urgency:     (t.priority === 1 ? 'high' : t.priority === 2 ? 'medium' : 'low') as any,
    reason:      `Mastery is only ${t.mastery}% — needs urgent practice`,
  }));
}

// ─────────────────────────────────────────────────────────────
// BUILDERS
// ─────────────────────────────────────────────────────────────
function buildRecommendations(
  profile: any,
  priorityTopics: AnalyzedTopic[]
): LearningRecommendation[] {
  const recs: LearningRecommendation[] = [];

  // 1. Top priority: weakest topic
  if (priorityTopics.length > 0) {
    const top = priorityTopics[0];
    recs.push({
      id:          'rec_primary',
      type:        profile.learningType === 'coding' ? 'coding' : 'practice',
      title:       `Today: Focus on ${top.topic}`,
      description: top.action,
      subject:     top.subject,
      topic:       top.topic,
      estimatedMins: getMinsForSpeed(profile.learningSpeed, 25),
      difficulty:  getMasteryDifficulty(top.mastery),
      urgency:     top.priority === 1 ? 'high' : 'medium',
      reason:      `${top.topic} mastery is ${top.mastery}% — ${top.trend === 'declining' ? 'declining, act now' : 'needs improvement'}`,
    });
  }

  // 2. Second: revision of a strong topic (to maintain it)
  if (profile.strongTopics?.length > 0) {
    const strong = profile.strongTopics[0];
    recs.push({
      id:          'rec_revision',
      type:        'revision',
      title:       `Quick revision: ${strong}`,
      description: `You're strong in ${strong}. A 10-min revision keeps the mastery high.`,
      subject:     'General',
      topic:       strong,
      estimatedMins: 10,
      difficulty:  'intermediate',
      urgency:     'low',
      reason:      `Maintain mastery in your strong topic ${strong}`,
    });
  }

  // 3. Third: learner-type-specific bonus rec
  const bonusRec = buildBonusRecommendation(profile, priorityTopics);
  if (bonusRec) recs.push(bonusRec);

  // 4. If no topics yet — starter task
  if (recs.length === 0) {
    recs.push({
      id:          'rec_starter',
      type:        'learn',
      title:       'Start with a quiz to build your profile',
      description: 'Complete a quick quiz so the AI Brain can understand your strengths and weaknesses.',
      subject:     'General',
      topic:       'Introduction',
      estimatedMins: 10,
      difficulty:  'beginner',
      urgency:     'medium',
      reason:      'Your AI profile needs data to give personalized recommendations',
    });
  }

  return recs;
}

function buildBonusRecommendation(
  profile: any,
  priorityTopics: AnalyzedTopic[]
): LearningRecommendation | null {
  const type = profile.learningType;
  const second = priorityTopics[1];

  if (type === 'coding' && profile.codingLevel !== 'none') {
    return {
      id:          'rec_coding_challenge',
      type:        'challenge',
      title:       second ? `Code a mini-project using ${second.topic}` : 'Daily Coding Challenge',
      description: second
        ? `Apply ${second.topic} in a small coding exercise. Building > reading.`
        : 'Solve today\'s coding challenge to sharpen your skills.',
      subject:     'Programming',
      topic:       second?.topic || 'General',
      estimatedMins: getMinsForSpeed(profile.learningSpeed, 30),
      difficulty:  profile.codingLevel === 'advanced' ? 'advanced' : 'intermediate',
      urgency:     'medium',
      reason:      'Coding learners improve fastest by building, not just reading',
    };
  }

  if (type === 'school' && second) {
    return {
      id:          'rec_quiz',
      type:        'practice',
      title:       `Take a quiz on ${second.topic}`,
      description: `A short quiz on ${second.topic} will help the AI identify your exact weak points.`,
      subject:     second.subject,
      topic:       second.topic,
      estimatedMins: 15,
      difficulty:  getMasteryDifficulty(second.mastery),
      urgency:     'medium',
      reason:      `Quiz data improves AI recommendations accuracy`,
    };
  }

  if (type === 'college' && priorityTopics.length >= 2) {
    const t = priorityTopics[1];
    return {
      id:          'rec_deep_dive',
      type:        'learn',
      title:       `Deep dive: ${t.topic} theory`,
      description: `Review ${t.topic} from first principles. College-level mastery requires conceptual depth.`,
      subject:     t.subject,
      topic:       t.topic,
      estimatedMins: 40,
      difficulty:  'advanced',
      urgency:     'medium',
      reason:      `${t.topic} needs conceptual reinforcement (mastery: ${t.mastery}%)`,
    };
  }

  return null;
}

function buildGreeting(streak: number, tier: string): string {
  if (streak >= 30)  return `🔥 ${streak}-day streak! You're unstoppable!`;
  if (streak >= 14)  return `🌟 Amazing — ${streak} days strong! Keep it up!`;
  if (streak >= 7)   return `💪 One full week of studying! Great discipline!`;
  if (streak >= 3)   return `🚀 ${streak} days in a row — building a great habit!`;
  if (streak === 1)  return `👋 Welcome back! Day 1 of your new streak!`;
  if (tier === 'power' || tier === 'active') return `Good to see you! Ready to learn?`;
  return `Welcome back! Let's get back on track today!`;
}

function buildFocusMessage(profile: any, priorityTopics: AnalyzedTopic[]): string {
  if (priorityTopics.length === 0) {
    return `Today's goal: Complete a quiz to start building your AI learning profile.`;
  }

  const top    = priorityTopics[0];
  const typeMap: Record<string, string> = {
    school:  `Today's Focus: ${top.topic} practice (${top.subject})`,
    coding:  `Today's Focus: Build something with ${top.topic}`,
    college: `Today's Focus: Master ${top.topic} concepts`,
    self:    `Today's Focus: Level up your ${top.topic} skills`,
  };

  return typeMap[profile.learningType] || `Today's Focus: ${top.topic}`;
}

function buildMotivation(profile: any): string {
  const notes = [
    profile.currentStreak > 0
      ? `You've studied ${profile.currentStreak} days straight — that's real dedication.`
      : `Today is a great day to restart your streak!`,
    profile.overallMastery > 60
      ? `Your overall mastery is ${profile.overallMastery}% — you're doing well!`
      : `Every session improves your mastery. Keep going!`,
    `Consistency beats intensity. Even 20 minutes today counts.`,
  ];
  return notes[Math.floor(Math.random() * notes.length)];
}

function computeStudyGoal(profile: any): number {
  const base = profile.learningSpeed === 'slow' ? 30
    : profile.learningSpeed === 'fast' ? 45 : 35;

  // Increase for high-urgency state
  const bonus = (profile.weakTopics?.length || 0) >= 3 ? 10 : 0;
  return base + bonus;
}

function getMinsForSpeed(speed: string, base: number): number {
  if (speed === 'slow') return base + 10;
  if (speed === 'fast') return base - 5;
  return base;
}

function getMasteryDifficulty(mastery: number): 'beginner' | 'intermediate' | 'advanced' {
  if (mastery < 30) return 'beginner';
  if (mastery < 65) return 'intermediate';
  return 'advanced';
}