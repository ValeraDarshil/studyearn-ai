/**
 * AI Study OS — AI Learning Engine Service
 * ─────────────────────────────────────────────────────────────
 * Generates personalized learning paths, daily focus plans,
 * and adaptive recommendations for ALL learner types.
 *
 * School   → "Today's Focus: Algebra Practice"
 * Coding   → "Today's Focus: JavaScript Loops Training"
 * College  → "Today's Focus: Data Structures Revision"
 *
 * Uses Groq/OpenRouter (reuses existing aiService infrastructure).
 * Falls back to rule-based recommendations if AI call fails.
 */

import { StudentProfile, IStudentProfile } from '../models/StudentProfile.model.js';
import { LearningPath, IPathStep } from '../models/LearningPath.model.js';
import { logger } from '../utils/logger.js';

// ── Helpers ───────────────────────────────────────────────────
function getTodayIST(): string {
  const now = new Date();
  return new Date(now.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split('T')[0];
}

function addDays(date: string, n: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function uuid(): string {
  return Math.random().toString(36).substring(2, 10);
}

// ── AI call (reuses existing pattern from aiService) ─────────
const GROQ_KEY       = process.env.GROQ_API_KEY       || '';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const AI_TIMEOUT_MS  = 25_000;

async function callGroqJSON(prompt: string): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model:       'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens:  2048,
        messages: [
          {
            role:    'system',
            content: 'You are an AI education planner. Always respond with valid JSON only. No markdown, no explanation — just the raw JSON object.',
          },
          { role: 'user', content: prompt },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (err: any) {
    logger.debug(`[LearningEngine] Groq failed: ${err.message}`);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function callAIJSON(prompt: string): Promise<any> {
  try {
    return await callGroqJSON(prompt);
  } catch {
    // Fallback to OpenRouter
    if (!OPENROUTER_KEY) throw new Error('No AI keys available');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer':  process.env.FRONTEND_URL || 'https://studyearnai.tech',
        },
        body: JSON.stringify({
          model:       'meta-llama/llama-3.3-70b-instruct:free',
          temperature: 0.3,
          max_tokens:  2048,
          messages: [
            { role: 'system', content: 'You are an AI education planner. Always respond with valid JSON only.' },
            { role: 'user',   content: prompt },
          ],
        }),
        signal: controller.signal,
      });
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || '';
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } finally {
      clearTimeout(timer);
    }
  }
}

// ─────────────────────────────────────────────────────────────
// 1. GENERATE TODAY'S FOCUS PLAN
//    Analyzes the profile and returns today's top recommendation.
//    e.g. { title: "Today's Focus: Algebra Practice", ... }
// ─────────────────────────────────────────────────────────────
export async function generateTodayFocus(userId: string): Promise<{
  title: string;
  description: string;
  focusTopic: string;
  subject: string;
  estimatedMinutes: number;
  difficulty: string;
} | null> {
  try {
    const profile = await StudentProfile.findOne({ userId }).lean();
    if (!profile) return null;

    // Rule-based fallback (instant, no AI call needed for simple cases)
    const weakTopics  = profile.topicMastery.filter((t: any) => t.isWeak);
    const noAttempted = profile.topicMastery.length === 0;

    // Build AI prompt
    const prompt = `
You are an AI study planner for a ${profile.learnerCategory} learner.
Learner category: ${profile.learnerCategory}
Class level: ${profile.classLevel || 'Not specified'}
Primary subjects: ${profile.primarySubjects.join(', ') || 'General'}
Weak topics: ${weakTopics.map((t: any) => `${t.topic} (mastery: ${t.masteryLevel}%)`).join(', ') || 'None yet'}
Strong topics: ${profile.strongTopics.join(', ') || 'None yet'}
Recent mistakes: ${profile.recentMistakes.slice(0, 5).join(', ') || 'None'}
Overall mastery: ${profile.overallMasteryScore}%
Current streak: ${profile.currentStreak} days
Learning speed: ${profile.learningSpeed}

Based on this profile, generate today's focused study recommendation.
Return a JSON object with these exact keys:
{
  "title": "Today's Focus: [specific topic]",
  "description": "2-3 sentences explaining what to study and why",
  "focusTopic": "specific topic name",
  "subject": "subject name",
  "estimatedMinutes": 30,
  "difficulty": "beginner|intermediate|advanced"
}
`;

    try {
      const result = await callAIJSON(prompt);
      if (result?.title && result?.focusTopic) return result;
    } catch {
      // Rule-based fallback
    }

    // ── Rule-based fallback ───────────────────────────────────
    if (noAttempted) {
      const defaults: Record<string, { title: string; subject: string; topic: string }> = {
        school:  { title: "Today's Focus: Start with Mathematics", subject: 'Mathematics', topic: 'Basic Concepts' },
        coding:  { title: "Today's Focus: Begin Python Basics",    subject: 'Python',      topic: 'Variables & Data Types' },
        college: { title: "Today's Focus: Core Subject Concepts",  subject: 'General',     topic: 'Fundamentals' },
        self:    { title: "Today's Focus: Choose Your First Topic", subject: 'General',     topic: 'Introduction' },
      };
      const d = defaults[profile.learnerCategory] || defaults['self'];
      return {
        title:            d.title,
        description:      'Start your learning journey. Complete a quiz or ask the AI Tutor questions to unlock personalized recommendations.',
        focusTopic:       d.topic,
        subject:          d.subject,
        estimatedMinutes: 20,
        difficulty:       'beginner',
      };
    }

    // Fallback: prioritize worst weak topic
    const worst = weakTopics.sort((a: any, b: any) => a.masteryLevel - b.masteryLevel)[0];
    return {
      title:            `Today's Focus: ${worst.topic} Practice`,
      description:      `Your mastery in ${worst.topic} is ${worst.masteryLevel}%. Focus on this topic today to improve your score.`,
      focusTopic:       worst.topic,
      subject:          worst.subject,
      estimatedMinutes: 25,
      difficulty:       worst.masteryLevel < 20 ? 'beginner' : 'intermediate',
    };
  } catch (err: any) {
    logger.error(`[LearningEngine] generateTodayFocus: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 2. GENERATE PERSONALIZED LEARNING PATH (7-day)
//    Creates a full 7-day study plan tailored to the learner.
// ─────────────────────────────────────────────────────────────
export async function generateLearningPath(
  userId: string,
  options?: { subject?: string; forceRegenerate?: boolean }
): Promise<ILearningPathOutput | null> {
  try {
    const profile = await StudentProfile.findOne({ userId }).lean();
    if (!profile) return null;

    const today      = getTodayIST();
    const endDate    = addDays(today, 6);
    const subject    = options?.subject ?? profile.primarySubjects[0] ?? 'General';
    const weakTopics = profile.topicMastery
      .filter((t: any) => t.isWeak)
      .map((t: any) => `${t.topic} (${t.masteryLevel}%)`)
      .slice(0, 5);

    const prompt = `
You are an AI curriculum designer for a ${profile.learnerCategory} student.
Subject: ${subject}
Class/Level: ${profile.classLevel || 'Not specified'}
Weak topics: ${weakTopics.join(', ') || 'None yet'}
Strong topics: ${profile.strongTopics.join(', ') || 'None'}
Overall mastery: ${profile.overallMasteryScore}%
Learning speed: ${profile.learningSpeed}
Streak: ${profile.currentStreak} days
Learner type: ${profile.learnerCategory}

Generate a 7-day personalized learning plan for this student.
The plan should have 7 steps, one per day.
Each step should be appropriate for the learner type:
- school: concept + quiz + practice
- coding: coding exercise + project + quiz
- college: concept + advanced practice + revision
- self: flexible mix

Return JSON with this exact structure:
{
  "title": "Your 7-Day [Subject] Mastery Plan",
  "description": "Brief 1-sentence description",
  "steps": [
    {
      "stepId": "unique_id",
      "type": "learn_concept|practice_quiz|coding_exercise|revision|project|mock_test",
      "title": "Day 1: [specific activity]",
      "subject": "${subject}",
      "topic": "specific topic",
      "description": "2-3 sentences describing the activity",
      "estimatedMinutes": 30,
      "difficulty": "beginner|intermediate|advanced",
      "xpReward": 50
    }
  ]
}
Ensure exactly 7 steps. Make each day progressive (easy → harder).
`;

    let aiResult: any;
    try {
      aiResult = await callAIJSON(prompt);
    } catch {
      aiResult = buildRuleBasedPath(profile as any, subject, today);
    }

    if (!aiResult?.steps?.length) {
      aiResult = buildRuleBasedPath(profile as any, subject, today);
    }

    // ── Save to DB ──────────────────────────────────────────
    const steps: IPathStep[] = (aiResult.steps || []).map((s: any, i: number) => ({
      stepId:           s.stepId || uuid(),
      type:             s.type || 'learn_concept',
      title:            s.title || `Day ${i + 1}`,
      subject:          s.subject || subject,
      topic:            s.topic || 'General',
      description:      s.description || '',
      estimatedMinutes: s.estimatedMinutes || 25,
      difficulty:       s.difficulty || 'intermediate',
      isCompleted:      false,
      completedAt:      null,
      xpReward:         s.xpReward || 50,
    }));

    // Archive previous active paths
    await LearningPath.updateMany(
      { userId, status: 'active' },
      { $set: { status: 'archived' } }
    );

    const path = await LearningPath.create({
      userId,
      title:             aiResult.title || `Your 7-Day ${subject} Plan`,
      description:       aiResult.description || '',
      learnerCategory:   profile.learnerCategory,
      subject,
      focusTopics:       profile.weakTopics.slice(0, 3),
      weekNumber:        1,
      startDate:         today,
      endDate,
      steps,
      totalSteps:        steps.length,
      completedSteps:    0,
      progressPercent:   0,
      status:            'active',
      adaptiveDifficulty: profile.overallMasteryScore < 40 ? 'beginner' : profile.overallMasteryScore < 70 ? 'intermediate' : 'advanced',
      generatedByAI:     true,
      aiModel:           'llama-3.3-70b-versatile',
    });

    logger.info(`[LearningEngine] Generated path for ${userId}: ${path.title}`);
    return { path, steps };
  } catch (err: any) {
    logger.error(`[LearningEngine] generateLearningPath: ${err.message}`);
    return null;
  }
}

// ── Rule-based fallback path ──────────────────────────────────
function buildRuleBasedPath(
  profile: any,
  subject: string,
  today: string
): any {
  const cat = profile.learnerCategory;
  const topics = profile.weakTopics.length > 0
    ? profile.weakTopics.slice(0, 3)
    : ['Fundamentals', 'Core Concepts', 'Practice Problems'];

  const types: Record<string, string[]> = {
    school:  ['learn_concept', 'practice_quiz', 'revision', 'practice_quiz', 'revision', 'mock_test', 'rest_day'],
    coding:  ['learn_concept', 'coding_exercise', 'practice_quiz', 'coding_exercise', 'project', 'coding_exercise', 'mock_test'],
    college: ['learn_concept', 'practice_quiz', 'revision', 'practice_quiz', 'revision', 'mock_test', 'rest_day'],
    self:    ['learn_concept', 'practice_quiz', 'revision', 'coding_exercise', 'practice_quiz', 'project', 'mock_test'],
  };

  const dayTypes = types[cat] || types['self'];
  return {
    title:       `Your 7-Day ${subject} Plan`,
    description: `A structured 7-day plan to improve your ${subject} skills.`,
    steps: dayTypes.map((type, i) => ({
      stepId:           uuid(),
      type,
      title:            `Day ${i + 1}: ${type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
      subject,
      topic:            topics[i % topics.length],
      description:      `Practice ${topics[i % topics.length]} through ${type.replace(/_/g, ' ')}.`,
      estimatedMinutes: type === 'rest_day' ? 0 : 25,
      difficulty:       i < 2 ? 'beginner' : i < 5 ? 'intermediate' : 'advanced',
      xpReward:         50 + i * 10,
    })),
  };
}

// ── Types for return value ────────────────────────────────────
interface ILearningPathOutput {
  path: any;
  steps: IPathStep[];
}

// ─────────────────────────────────────────────────────────────
// 3. COMPLETE A PATH STEP
//    Called when user marks a step done.
// ─────────────────────────────────────────────────────────────
export async function completeLearningStep(
  userId: string,
  pathId: string,
  stepId: string
): Promise<{ xpEarned: number; progressPercent: number; isPathComplete: boolean } | null> {
  try {
    const path = await LearningPath.findOne({ _id: pathId, userId });
    if (!path) return null;

    const step = path.steps.find(s => s.stepId === stepId);
    if (!step || step.isCompleted) return null;

    step.isCompleted  = true;
    step.completedAt  = new Date();
    path.completedSteps += 1;
    path.progressPercent = Math.round((path.completedSteps / path.totalSteps) * 100);

    if (path.completedSteps >= path.totalSteps) {
      path.status = 'completed';
    }

    await path.save();

    logger.info(`[LearningEngine] Step ${stepId} completed for user ${userId}`);
    return {
      xpEarned:        step.xpReward,
      progressPercent: path.progressPercent,
      isPathComplete:  path.status === 'completed',
    };
  } catch (err: any) {
    logger.error(`[LearningEngine] completeLearningStep: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 4. GET ACTIVE LEARNING PATH FOR USER
// ─────────────────────────────────────────────────────────────
export async function getActiveLearningPath(userId: string) {
  try {
    return await LearningPath.findOne({ userId, status: 'active' })
      .sort({ createdAt: -1 })
      .lean();
  } catch (err: any) {
    logger.error(`[LearningEngine] getActivePath: ${err.message}`);
    return null;
  }
}