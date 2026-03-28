/**
 * AI Study OS — Learning Recommendation Engine (Stage 3)
 * ─────────────────────────────────────────────────────────────
 * Generates smart, contextual learning recommendations.
 *
 * This is the "notification brain" of the system.
 * It answers: "What should I suggest to THIS student right now?"
 *
 * Recommendation triggers:
 *   - After quiz completion    → "Practice this weak topic next"
 *   - After coding session     → "Try a harder problem now"
 *   - After long absence (3d+) → "Welcome back — catch up plan"
 *   - After streak milestone   → "You're on fire — challenge yourself"
 *   - Daily on login           → "Today's recommended tasks"
 *   - After AI Tutor session   → "Continue learning this topic"
 *
 * Unlike dailyLearningPlanner (which gives a schedule),
 * this engine gives CONTEXTUAL nudges — the right suggestion
 * at the right moment.
 */

import { StudentProfile }         from '../../models/StudentProfile.model.js';
import { getTopNPriorityTopics }  from './topicPriorityAnalyzer.js';
import { getOverallDifficulty }   from './difficultyAdapter.js';
import { logger }                 from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export type RecommendationTrigger =
  | 'login'           // user just logged in
  | 'after_quiz'      // just finished a quiz
  | 'after_coding'    // just finished a coding session
  | 'after_ai_tutor'  // just used AskAI
  | 'long_absence'    // hasn't studied in 3+ days
  | 'streak_milestone'// hit a streak milestone
  | 'low_activity'    // activity score dropped
  | 'mastery_jump'    // mastery jumped on a topic
  | 'general';        // default

export type RecommendationType =
  | 'practice_now'       // do this right now
  | 'next_topic'         // move to this topic next
  | 'take_quiz'          // test yourself
  | 'try_harder'         // increase difficulty
  | 'review_mistakes'    // go over errors
  | 'start_challenge'    // coding challenge
  | 'streak_keep'        // keep streak alive
  | 'comeback_plan'      // returning after absence
  | 'celebrate'          // milestone achieved
  | 'rest';              // take a break

export interface Recommendation {
  id:          string;
  type:        RecommendationType;
  trigger:     RecommendationTrigger;
  title:       string;
  message:     string;
  action:      string;        // CTA — what to do
  topic:       string | null;
  subject:     string | null;
  urgency:     'high' | 'medium' | 'low';
  xpOpportunity: number;      // XP they can earn by following this
  icon:        string;
  createdAt:   string;
}

export interface RecommendationBundle {
  primary:   Recommendation;          // most important one
  secondary: Recommendation[];        // 1–2 additional suggestions
  context:   string;                  // brief context message
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — getRecommendations
// ─────────────────────────────────────────────────────────────
export async function getRecommendations(
  userId:  string,
  trigger: RecommendationTrigger = 'general',
  meta?:   { topic?: string; subject?: string; score?: number; },
): Promise<RecommendationBundle | null> {
  try {
    const [profile, priorityTopics, diffDecision] = await Promise.all([
      StudentProfile.findOne({ userId })
        .select('learnerCategory currentStreak overallMasteryScore learningSpeed dailyLogs lastStudyDate weakTopics recentMistakes quizHistory')
        .lean() as any,
      getTopNPriorityTopics(userId, 3),
      getOverallDifficulty(userId),
    ]);

    if (!profile) return null;

    const category = profile.learnerCategory || 'self';
    const streak   = profile.currentStreak   || 0;
    const mastery  = profile.overallMasteryScore || 0;
    const speed    = profile.learningSpeed   || 'medium';

    // Check absence
    const daysSinceStudy = profile.lastStudyDate
      ? Math.floor((Date.now() - new Date(profile.lastStudyDate).getTime() + 5.5 * 3600000) / 86400000)
      : 999;

    // Auto-detect trigger if general
    const effectiveTrigger: RecommendationTrigger = trigger === 'general'
      ? autoDetectTrigger(streak, daysSinceStudy, mastery)
      : trigger;

    // Build primary recommendation
    const primary = buildPrimaryRecommendation(
      effectiveTrigger, profile, priorityTopics, diffDecision, meta, category, streak,
    );

    // Build secondary recommendations (2 extras)
    const secondary = buildSecondaryRecommendations(
      effectiveTrigger, priorityTopics, category, streak, mastery,
    ).filter(r => r.id !== primary.id);

    const context = buildContext(effectiveTrigger, streak, daysSinceStudy, mastery, priorityTopics);

    return { primary, secondary, context };
  } catch (err: any) {
    logger.error(`[RecommendationEngine] getRecommendations: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// getQuickRecommendation — single best suggestion (lightweight)
// Used in AskAI followup, dashboard widget, notification
// ─────────────────────────────────────────────────────────────
export async function getQuickRecommendation(
  userId: string,
  trigger: RecommendationTrigger = 'login',
): Promise<Recommendation | null> {
  const bundle = await getRecommendations(userId, trigger);
  return bundle?.primary || null;
}

// ─────────────────────────────────────────────────────────────
// afterQuizRecommendation — called right after quiz completes
// ─────────────────────────────────────────────────────────────
export async function afterQuizRecommendation(
  userId:  string,
  topic:   string,
  subject: string,
  score:   number,
): Promise<Recommendation> {
  const priorityTopics = await getTopNPriorityTopics(userId, 3);

  if (score >= 80) {
    // Great score → try harder or next topic
    const nextTopic = priorityTopics.find(t => t.topic !== topic);
    return buildRec({
      type:    'try_harder',
      trigger: 'after_quiz',
      title:   `🎉 Great score on ${topic}!`,
      message: `You scored ${score}% — you've got ${topic} down. ${nextTopic ? `Time to tackle ${nextTopic.topic} next!` : 'Try a harder challenge now!'}`,
      action:  nextTopic ? `Start ${nextTopic.topic}` : 'Try advanced problems',
      topic:   nextTopic?.topic || topic,
      subject: nextTopic?.subject || subject,
      urgency: 'low',
      xp:      60,
      icon:    '🏆',
    });
  }

  if (score < 50) {
    // Poor score → review mistakes
    return buildRec({
      type:    'review_mistakes',
      trigger: 'after_quiz',
      title:   `${topic} needs more practice`,
      message: `You scored ${score}% on ${topic}. Let's go over the mistakes and understand where you went wrong.`,
      action:  `Review ${topic} with AI Tutor`,
      topic,
      subject,
      urgency: 'high',
      xp:      40,
      icon:    '📝',
    });
  }

  // Average score → practice more
  return buildRec({
    type:    'practice_now',
    trigger: 'after_quiz',
    title:   `Keep practicing ${topic}`,
    message: `${score}% is decent — but ${topic} can go higher. A focused 15-min practice session will push you past 80%.`,
    action:  `Practice ${topic}`,
    topic,
    subject,
    urgency: 'medium',
    xp:      45,
    icon:    '🎯',
  });
}

// ─────────────────────────────────────────────────────────────
// BUILDERS
// ─────────────────────────────────────────────────────────────
function buildPrimaryRecommendation(
  trigger:        RecommendationTrigger,
  profile:        any,
  priorityTopics: any[],
  diffDecision:   any,
  meta:           any,
  category:       string,
  streak:         number,
): Recommendation {
  const topTopic  = priorityTopics[0];
  const mastery   = profile.overallMasteryScore || 0;

  switch (trigger) {
    case 'long_absence':
      return buildRec({
        type:    'comeback_plan',
        trigger,
        title:   '👋 Welcome back! Let\'s catch up.',
        message: topTopic
          ? `You were last working on ${topTopic.topic}. Let's do a quick 15-min review to get back in the zone.`
          : `It's been a few days. Let's ease back in with a light revision session.`,
        action:  `Start catch-up review`,
        topic:   topTopic?.topic || null,
        subject: topTopic?.subject || null,
        urgency: 'high',
        xp:      30,
        icon:    '🔄',
      });

    case 'streak_milestone':
      return buildRec({
        type:    'celebrate',
        trigger,
        title:   `🔥 ${streak}-day streak — amazing!`,
        message: `You've studied ${streak} days in a row. To celebrate, try a challenge that pushes your limits today.`,
        action:  `Take today's challenge`,
        topic:   topTopic?.topic || null,
        subject: topTopic?.subject || null,
        urgency: 'low',
        xp:      100,
        icon:    '🏆',
      });

    case 'after_coding':
      return buildRec({
        type:    'next_topic',
        trigger,
        title:   `Nice coding session! What's next?`,
        message: topTopic
          ? `You just practiced coding. Next up: ${topTopic.topic} — your top weak area that needs attention.`
          : `Great work! Consider taking a quiz to test what you just learned.`,
        action:  `Practice ${topTopic?.topic || 'next topic'}`,
        topic:   topTopic?.topic || null,
        subject: topTopic?.subject || null,
        urgency: 'medium',
        xp:      50,
        icon:    '💻',
      });

    case 'after_ai_tutor':
      return buildRec({
        type:    'take_quiz',
        trigger,
        title:   `Test what you just learned!`,
        message: meta?.topic
          ? `You just studied ${meta.topic} with the AI Tutor. Now test yourself — take a quick quiz to lock it in.`
          : `Great AI session! Reinforce your learning with a short quiz.`,
        action:  `Take a quiz`,
        topic:   meta?.topic || topTopic?.topic || null,
        subject: meta?.subject || topTopic?.subject || null,
        urgency: 'medium',
        xp:      40,
        icon:    '🎯',
      });

    case 'low_activity':
      return buildRec({
        type:    'streak_keep',
        trigger,
        title:   `Your activity score is dropping`,
        message: `You haven't been as active lately. Even a 15-min session today will keep you on track. Don't lose momentum!`,
        action:  `Start 15-min session`,
        topic:   topTopic?.topic || null,
        subject: topTopic?.subject || null,
        urgency: 'high',
        xp:      35,
        icon:    '⚡',
      });

    // login & general
    default:
      return buildRec({
        type:    'practice_now',
        trigger,
        title:   topTopic
          ? `Today: Focus on ${topTopic.topic}`
          : `Start your learning session`,
        message: topTopic
          ? `${topTopic.topic} is your top priority right now. ${topTopic.reason}`
          : `Open today's learning plan and start with your first task.`,
        action:  topTopic ? `Practice ${topTopic.topic}` : `View learning plan`,
        topic:   topTopic?.topic || null,
        subject: topTopic?.subject || null,
        urgency: topTopic ? (topTopic.urgency === 'critical' ? 'high' : 'medium') : 'medium',
        xp:      50,
        icon:    category === 'coding' ? '💻' : '📚',
      });
  }
}

function buildSecondaryRecommendations(
  trigger:        RecommendationTrigger,
  priorityTopics: any[],
  category:       string,
  streak:         number,
  mastery:        number,
): Recommendation[] {
  const secondary: Recommendation[] = [];

  if (priorityTopics[1]) {
    const t = priorityTopics[1];
    secondary.push(buildRec({
      type:    'next_topic',
      trigger,
      title:   `Also: Practice ${t.topic}`,
      message: `${t.topic} is your #2 priority. ${t.actionPlan}`,
      action:  `Start ${t.topic}`,
      topic:   t.topic,
      subject: t.subject,
      urgency: 'medium',
      xp:      40,
      icon:    '📖',
    }));
  }

  if (streak === 0) {
    secondary.push(buildRec({
      type:    'streak_keep',
      trigger,
      title:   `Start a streak today!`,
      message: `Study for just 15 minutes and begin your learning streak. Small habits compound over time.`,
      action:  `Study 15 min`,
      topic:   null,
      subject: null,
      urgency: 'medium',
      xp:      25,
      icon:    '🔥',
    }));
  }

  if (category === 'coding' && mastery > 40) {
    secondary.push(buildRec({
      type:    'start_challenge',
      trigger,
      title:   `Try today's coding challenge`,
      message: `Coding challenges build problem-solving instinct. Try one to push your limits.`,
      action:  `Open Daily Challenge`,
      topic:   null,
      subject: 'Programming',
      urgency: 'low',
      xp:      75,
      icon:    '⚡',
    }));
  }

  return secondary.slice(0, 2);
}

function buildContext(
  trigger:        RecommendationTrigger,
  streak:         number,
  daysSince:      number,
  mastery:        number,
  priorityTopics: any[],
): string {
  if (trigger === 'long_absence') return `You've been away for ${daysSince} days. Let's get you back on track.`;
  if (trigger === 'streak_milestone') return `${streak}-day streak achieved! You're in the top tier of learners.`;
  if (priorityTopics.length > 0) {
    return `Based on your ${mastery}% mastery score and ${priorityTopics.length} topics needing attention.`;
  }
  return `Personalized for your learning profile.`;
}

function autoDetectTrigger(streak: number, daysSince: number, mastery: number): RecommendationTrigger {
  if (daysSince >= 3)                     return 'long_absence';
  if ([3, 7, 14, 30, 50, 100].includes(streak)) return 'streak_milestone';
  return 'login';
}

// ─────────────────────────────────────────────────────────────
// FACTORY HELPER
// ─────────────────────────────────────────────────────────────
function buildRec(data: {
  type: RecommendationType; trigger: RecommendationTrigger;
  title: string; message: string; action: string;
  topic: string | null; subject: string | null;
  urgency: 'high' | 'medium' | 'low'; xp: number; icon: string;
}): Recommendation {
  return {
    id:             Math.random().toString(36).substring(2, 10),
    type:           data.type,
    trigger:        data.trigger,
    title:          data.title,
    message:        data.message,
    action:         data.action,
    topic:          data.topic,
    subject:        data.subject,
    urgency:        data.urgency,
    xpOpportunity:  data.xp,
    icon:           data.icon,
    createdAt:      new Date().toISOString(),
  };
}