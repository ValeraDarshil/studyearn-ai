/**
 * AI Study OS — Daily Learning Planner (Stage 3)
 * ─────────────────────────────────────────────────────────────
 * Generates the student's EXACT schedule for TODAY.
 *
 * This is what the user sees on the dashboard every morning:
 *   "📅 Your Learning Plan for Today"
 *   ├── 20 min — Algebra Practice (High Priority)
 *   ├── 15 min — JavaScript Loops Exercise (Medium)
 *   └── 10 min — Quick Quiz: Physics
 *
 * It combines:
 *   - TopicPriorityAnalyzer  → which topics to cover today
 *   - DifficultyAdapter      → what level for each task
 *   - Activity history       → did student study yesterday? adjust load
 *   - Streak data            → is student on a roll or returning?
 *   - Time of day hints      → morning = learn, evening = revise
 *
 * Output is designed to be shown directly in the UI.
 */

import { StudentProfile }             from '../../models/StudentProfile.model.js';
import { getTopNPriorityTopics }      from './topicPriorityAnalyzer.js';
import { getOverallDifficulty }       from './difficultyAdapter.js';
import { logger }                     from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export type TaskType = 'study' | 'practice' | 'quiz' | 'coding' | 'revision' | 'rest';

export interface DailyTask {
  id:           string;
  taskType:     TaskType;
  title:        string;
  topic:        string;
  subject:      string;
  durationMins: number;
  priority:     'high' | 'medium' | 'low';
  xpReward:     number;
  description:  string;
  isCompleted:  boolean;
  icon:         string;               // emoji icon for UI
}

export interface DailyPlanOutput {
  date:          string;              // YYYY-MM-DD IST
  greeting:      string;             // personalized welcome message
  headline:      string;             // "Today's focus: Algebra + Loops"
  totalMins:     number;             // total planned study time
  tasks:         DailyTask[];
  motivationMsg: string;
  streakStatus:  string;             // streak-based message
  studyTip:      string;             // daily learning tip
  isRestDay:     boolean;            // suggest rest if overworked
  categoryBadge: string;             // "📚 School Learner" etc.
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — generateDailyPlan
// ─────────────────────────────────────────────────────────────
export async function generateDailyPlan(userId: string): Promise<DailyPlanOutput | null> {
  try {
    const [profile, priorityTopics, diffDecision] = await Promise.all([
      StudentProfile.findOne({ userId })
        .select('learnerCategory learningSpeed currentStreak dailyLogs overallMasteryScore primarySubjects lastStudyDate')
        .lean() as any,
      getTopNPriorityTopics(userId, 3),
      getOverallDifficulty(userId),
    ]);

    if (!profile) return null;

    const today      = getTodayIST();
    const category   = profile.learnerCategory || 'self';
    const speed      = profile.learningSpeed   || 'medium';
    const streak     = profile.currentStreak   || 0;
    const mastery    = profile.overallMasteryScore || 0;

    // Check if student studied yesterday (affects workload)
    const yesterday = getYesterdayIST();
    const logs      = profile.dailyLogs || [];
    const studiedYesterday = logs.some((d: any) => d.date === yesterday && (d.minutesStudied > 0 || d.questionsAsked > 0));
    const studiedToday     = logs.some((d: any) => d.date === today && (d.minutesStudied > 0 || d.questionsAsked > 0));

    // Detect if it's a rest day (7-day streak → suggest lighter day)
    const isRestDay = streak > 0 && streak % 7 === 0 && studiedYesterday && !studiedToday;

    // Base task load depending on learner speed
    const maxTasks = speed === 'slow' ? 2 : speed === 'fast' ? 4 : 3;

    // Build tasks
    const tasks: DailyTask[] = isRestDay
      ? buildRestDayTasks(category)
      : buildStudyTasks(priorityTopics, category, diffDecision.level, maxTasks, speed);

    const totalMins = tasks.reduce((s, t) => s + t.durationMins, 0);

    return {
      date:          today,
      greeting:      buildGreeting(streak, studiedToday, category),
      headline:      buildHeadline(priorityTopics, isRestDay),
      totalMins,
      tasks,
      motivationMsg: buildMotivation(mastery, streak, studiedYesterday),
      streakStatus:  buildStreakStatus(streak, studiedToday),
      studyTip:      getDailyTip(today),
      isRestDay,
      categoryBadge: getCategoryBadge(category),
    };
  } catch (err: any) {
    logger.error(`[DailyLearningPlanner] generateDailyPlan: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// TASK BUILDERS
// ─────────────────────────────────────────────────────────────
function buildStudyTasks(
  topics:    any[],
  category:  string,
  diff:      string,
  maxTasks:  number,
  speed:     string,
): DailyTask[] {
  const tasks: DailyTask[] = [];

  // Task 1 — Primary weak topic (always first, highest priority)
  if (topics[0]) {
    const t = topics[0];
    const mins = speed === 'slow' ? 30 : speed === 'fast' ? 20 : 25;
    tasks.push({
      id:           genId(),
      taskType:     category === 'coding' ? 'coding' : 'study',
      title:        category === 'coding'
        ? `Code Practice: ${t.topic}`
        : `Study: ${t.topic}`,
      topic:        t.topic,
      subject:      t.subject,
      durationMins: mins,
      priority:     'high',
      xpReward:     50,
      description:  t.actionPlan,
      isCompleted:  false,
      icon:         category === 'coding' ? '💻' : '📖',
    });
  }

  // Task 2 — Practice/Quiz on second topic
  if (topics[1] && maxTasks >= 2) {
    const t = topics[1];
    const mins = speed === 'slow' ? 20 : 15;
    tasks.push({
      id:           genId(),
      taskType:     'quiz',
      title:        `Quick Quiz: ${t.topic}`,
      topic:        t.topic,
      subject:      t.subject,
      durationMins: mins,
      priority:     'medium',
      xpReward:     35,
      description:  `Test your knowledge of ${t.topic}. Focus on the areas where you previously lost marks.`,
      isCompleted:  false,
      icon:         '🎯',
    });
  }

  // Task 3 — Revision on third topic or strongest topic
  if (maxTasks >= 3) {
    const revTopic = topics[2] || topics[0];
    if (revTopic) {
      tasks.push({
        id:           genId(),
        taskType:     'revision',
        title:        `Revision: ${revTopic.topic} Key Points`,
        topic:        revTopic.topic,
        subject:      revTopic.subject,
        durationMins: 10,
        priority:     'low',
        xpReward:     20,
        description:  `Quick 10-minute revision of key formulas, concepts, or code patterns in ${revTopic.topic}. Use notes or flashcards.`,
        isCompleted:  false,
        icon:         '🔄',
      });
    }
  }

  // Task 4 — Coding challenge for fast learners
  if (maxTasks >= 4 && category === 'coding' && topics[0]) {
    const t = topics[0];
    tasks.push({
      id:           genId(),
      taskType:     'practice',
      title:        `Challenge: Advanced ${t.topic}`,
      topic:        t.topic,
      subject:      t.subject,
      durationMins: 20,
      priority:     'medium',
      xpReward:     60,
      description:  `Push yourself with a harder ${t.topic} problem. This is your bonus challenge for today.`,
      isCompleted:  false,
      icon:         '⚡',
    });
  }

  return tasks;
}

function buildRestDayTasks(category: string): DailyTask[] {
  return [
    {
      id:           genId(),
      taskType:     'revision',
      title:        'Light Revision — 15 Min',
      topic:        'General',
      subject:      'General',
      durationMins: 15,
      priority:     'low',
      xpReward:     25,
      description:  "You've been studying hard! Today is a light day. Just do a quick review of your notes — no pressure.",
      isCompleted:  false,
      icon:         '☀️',
    },
  ];
}

// ─────────────────────────────────────────────────────────────
// MESSAGE BUILDERS
// ─────────────────────────────────────────────────────────────
function buildGreeting(streak: number, studiedToday: boolean, category: string): string {
  if (studiedToday) return `Great, you've already started today! Keep the momentum going 🚀`;
  if (streak >= 30) return `🏆 ${streak}-day streak! You're in legendary territory!`;
  if (streak >= 14) return `🔥 ${streak} days strong! You're building something special.`;
  if (streak >= 7)  return `⭐ One full week of learning! You should be proud.`;
  if (streak >= 3)  return `💪 ${streak} days in a row — habit is forming!`;
  if (streak === 0) return `👋 Welcome back! Today is a great day to restart your streak.`;
  return `Good to see you! Ready for today's learning plan?`;
}

function buildHeadline(topics: any[], isRestDay: boolean): string {
  if (isRestDay) return `Today: Light Revision Day — You Earned It! ☀️`;
  if (topics.length === 0) return `Today: Start Your Learning Journey`;
  const names = topics.slice(0, 2).map(t => t.topic);
  return `Today's Focus: ${names.join(' + ')}`;
}

function buildMotivation(mastery: number, streak: number, studiedYesterday: boolean): string {
  if (mastery >= 80) return `Your mastery is at ${mastery}% — you're in the top tier. Push for 90!`;
  if (mastery >= 60) return `At ${mastery}% mastery, you're well above average. Keep your momentum!`;
  if (streak >= 5)   return `A ${streak}-day streak means your brain is actively forming new pathways. Trust the process.`;
  if (!studiedYesterday) return `Every day you study puts you ahead of 90% of people who don't. Today matters.`;
  return `Consistency beats talent. You're already proving that by showing up every day.`;
}

function buildStreakStatus(streak: number, studiedToday: boolean): string {
  if (studiedToday && streak > 0) return `🔥 Day ${streak} — streak active!`;
  if (studiedToday)               return `✅ You've studied today — streak started!`;
  if (streak > 0)                 return `⚡ Your ${streak}-day streak is waiting — complete today's plan!`;
  return `🎯 Start today to begin your streak!`;
}

function getDailyTip(date: string): string {
  // Rotate tips based on day of week
  const day = new Date(date).getDay();
  const tips = [
    'The best study session is a short one that actually happens.',              // Sun
    'Start with the hardest topic when your mind is fresh.',                     // Mon
    'After studying, take a 10-min walk — it boosts memory consolidation.',     // Tue
    'Teach a concept to an imaginary student. You\'ll know what you don\'t.',   // Wed
    'Spaced repetition works: review yesterday\'s content for 5 min today.',    // Thu
    'Use the Pomodoro method: 25 min study, 5 min break.',                      // Fri
    'Review the week\'s hardest topics before sleeping — sleep consolidates.',  // Sat
  ];
  return tips[day] || tips[0];
}

function getCategoryBadge(category: string): string {
  const badges: Record<string, string> = {
    school:  '📚 School Learner',
    coding:  '💻 Coding Learner',
    college: '🎓 College Student',
    self:    '🌱 Self Learner',
  };
  return badges[category] || '📖 Learner';
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function getTodayIST(): string {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().split('T')[0];
}

function getYesterdayIST(): string {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000 - 86400000).toISOString().split('T')[0];
}

function genId(): string {
  return Math.random().toString(36).substring(2, 10);
}