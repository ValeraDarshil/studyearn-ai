/**
 * AI Study OS — Mentor Message Generator (Stage 6)
 * ─────────────────────────────────────────────────────────────
 * Generates context-aware, personalized AI Mentor messages.
 *
 * Key features:
 *   - Mentor personality system (friendly / strict / motivational)
 *   - Context-aware per student state (beginner / struggling / advanced)
 *   - Hinglish support (if student prefers)
 *   - Micro-action framing ("bas 5 min" vs "1 hour")
 *   - Loss-trigger psychology ("your streak will break today")
 *   - Hook → Action → Reward loop language
 *   - Progressive intelligence (mentor evolves with usage days)
 */

import { BehaviorSnapshot, MoodSignal } from './behaviorAnalyzer.js';
import { MentorTrigger, MentorTriggerType } from './mentorTriggerEngine.js';
import { StudentProfile } from '../../models/StudentProfile.model.js';
import { logger }         from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export type MentorPersonality = 'friendly' | 'strict' | 'motivational';
export type MentorLanguage    = 'english'  | 'hinglish';

export interface MentorMessage {
  title:       string;       // short hook (shown in notification)
  body:        string;       // full message
  cta:         string;       // call-to-action button label
  taskHint:    string;       // micro-task hint ("Solve 3 quick problems")
  emoji:       string;       // leading emoji
  triggerType: MentorTriggerType;
  personality: MentorPersonality;
  language:    MentorLanguage;
  generatedAt: string;
}

// ── Message Templates ──────────────────────────────────────────
// Each trigger × personality × language combination

type TemplateCtx = {
  topic?:        string;
  streak?:       number;
  improvement?:  number;
  accuracy?:     number;
  daysMissed?:   number;
  weakTopic?:    string;
  strongTopic?:  string;
};

const TEMPLATES: Record<
  MentorTriggerType,
  Record<MentorPersonality, Record<MentorLanguage, (ctx: TemplateCtx) => Omit<MentorMessage, 'triggerType' | 'personality' | 'language' | 'generatedAt'>>>
> = {

  COMEBACK: {
    friendly: {
      english: (c) => ({
        emoji: '👋',
        title: 'We missed you!',
        body:  `Hey! It's been ${c.daysMissed ?? 'a few'} days. No worries — let's restart with something easy. Just 5 minutes today, that's all.`,
        cta:   'Start Easy Task',
        taskHint: '5-min warm-up challenge',
      }),
      hinglish: (c) => ({
        emoji: '👋',
        title: 'Wapas aa gaye! 😊',
        body:  `Koi baat nahi yaar, ${c.daysMissed ?? 'kuch'} din miss ho gaye. Chalo aaj bas 5 min ka easy task karte hain — fresh start!`,
        cta:   'Easy Task Shuru Karo',
        taskHint: '5 min ka warm-up',
      }),
    },
    strict: {
      english: (c) => ({
        emoji: '⚡',
        title: `${c.daysMissed ?? 'Several'} days missed. Time to fix that.`,
        body:  `You've been absent for ${c.daysMissed ?? 'too many'} days. Every day lost is progress lost. Let's do a quick 10-minute session — no excuses.`,
        cta:   'Start Now',
        taskHint: '10-min focused session',
      }),
      hinglish: (c) => ({
        emoji: '⚡',
        title: `${c.daysMissed ?? 'Kaafi'} din se gayab ho.`,
        body:  `Bhai, ${c.daysMissed ?? 'kaafi'} din se kuch nahi kiya. Ek 10 min ka session kar lo aaj — sirf itna kaafi hai.`,
        cta:   'Abhi Shuru Karo',
        taskHint: '10 min focused session',
      }),
    },
    motivational: {
      english: (c) => ({
        emoji: '🔥',
        title: 'Your comeback starts TODAY.',
        body:  `Champions come back stronger. You've been away for ${c.daysMissed ?? 'a few'} days — but today is a fresh page. One small win and the momentum begins again.`,
        cta:   'Begin My Comeback',
        taskHint: 'Quick 5-min win task',
      }),
      hinglish: (c) => ({
        emoji: '🔥',
        title: 'Aaj wapassi ka din hai!',
        body:  `Har champion kabhi na kabhi break leta hai — lekin wapas bhi aata hai. ${c.daysMissed ?? 'Kuch'} din baad today ka ek chota win le lo. Momentum wapas aa jaayega!`,
        cta:   'Comeback Shuru Karo',
        taskHint: 'Ek chota 5-min task',
      }),
    },
  },

  STREAK_BREAK: {
    friendly: {
      english: (c) => ({
        emoji: '💔',
        title: `Your ${c.streak}-day streak broke.`,
        body:  `Aww, your ${c.streak}-day streak got interrupted. That's okay! Let's start a new one right now. Even 5 minutes counts.`,
        cta:   'Start New Streak',
        taskHint: '5-min session to rebuild',
      }),
      hinglish: (c) => ({
        emoji: '💔',
        title: `${c.streak} din ki streak toot gayi.`,
        body:  `Arre yaar, ${c.streak} din ki streak break ho gayi. No worries! Abhi nayi streak shuru karte hain — bas 5 min do.`,
        cta:   'Nayi Streak Shuru Karo',
        taskHint: '5 min ka quick session',
      }),
    },
    strict: {
      english: (c) => ({
        emoji: '😤',
        title: `Streak broken. Don't let it stay broken.`,
        body:  `Your ${c.streak}-day streak is gone. Start a new one today — right now. Don't wait until tomorrow.`,
        cta:   'Rebuild Now',
        taskHint: '10-min discipline session',
      }),
      hinglish: (c) => ({
        emoji: '😤',
        title: 'Streak toot gayi. Ruko mat.',
        body:  `${c.streak} din ki mehnat waste mat karo. Aaj hi nayi streak start karo — abhi!`,
        cta:   'Abhi Shuru Karo',
        taskHint: '10 min discipline session',
      }),
    },
    motivational: {
      english: (c) => ({
        emoji: '⚡',
        title: 'Streaks break. Champions rebuild.',
        body:  `Your ${c.streak}-day streak broke, but your progress didn't. Every master has broken streaks. Today you restart — and this time you go further.`,
        cta:   'Restart My Journey',
        taskHint: 'Powerful 5-min restart',
      }),
      hinglish: (c) => ({
        emoji: '⚡',
        title: 'Streak toot gayi. Ab rebuild karo!',
        body:  `${c.streak} din ki streak break hui — lekin tumhari mehnat nahi. Aaj nayi shuruwat karo, aur is baar aur aage jao!`,
        cta:   'Nayi Journey Shuru Karo',
        taskHint: '5 min powerful restart',
      }),
    },
  },

  STREAK_AT_RISK: {
    friendly: {
      english: (c) => ({
        emoji: '⏰',
        title: `Don't lose your ${c.streak}-day streak today!`,
        body:  `You haven't studied yet today. Your ${c.streak}-day streak is at risk! Quick — just 5 minutes and it's safe.`,
        cta:   'Save My Streak',
        taskHint: '5-min streak saver',
      }),
      hinglish: (c) => ({
        emoji: '⏰',
        title: `${c.streak} din ki streak khatam hone wali hai!`,
        body:  `Aaj abhi tak padhai nahi ki! Sirf 5 min do aur streak safe ho jaayegi.`,
        cta:   'Streak Bachao',
        taskHint: '5 min streak saver',
      }),
    },
    strict: {
      english: (c) => ({
        emoji: '🔔',
        title: `${c.streak} days. Don't throw it away.`,
        body:  `You built a ${c.streak}-day streak. Don't waste it by skipping today. 10 minutes. Now.`,
        cta:   'Protect My Streak',
        taskHint: '10-min session',
      }),
      hinglish: (c) => ({
        emoji: '🔔',
        title: `${c.streak} din ki koi value nahi kya?`,
        body:  `Itne din ki mehnat ko aaj miss mat karo. 10 min nikaalo abhi.`,
        cta:   'Streak Protect Karo',
        taskHint: '10 min session',
      }),
    },
    motivational: {
      english: (c) => ({
        emoji: '🏆',
        title: `${c.streak} days strong — finish today too!`,
        body:  `You've been consistent for ${c.streak} days. That's not luck, that's discipline! Add one more day to this incredible streak.`,
        cta:   'Keep the Streak Alive',
        taskHint: 'Quick 5-min power session',
      }),
      hinglish: (c) => ({
        emoji: '🏆',
        title: `${c.streak} din — aaj bhi complete karo!`,
        body:  `${c.streak} din ki consistency — yeh luck nahi, discipline hai! Aaj bhi ek din aur add karo.`,
        cta:   'Streak Alive Rakho',
        taskHint: '5 min power session',
      }),
    },
  },

  LOW_PERFORMANCE: {
    friendly: {
      english: (c) => ({
        emoji: '📉',
        title: `Struggling with ${c.weakTopic ?? 'a topic'}? Let's fix it!`,
        body:  `Your recent scores dropped a bit — especially in ${c.weakTopic ?? 'a few topics'}. That's totally fixable! Let's tackle it with a focused 10-minute practice.`,
        cta:   'Fix It Now',
        taskHint: `10-min focused practice on ${c.weakTopic ?? 'weak topics'}`,
      }),
      hinglish: (c) => ({
        emoji: '📉',
        title: `${c.weakTopic ?? 'Kuch topics'} mein thoda struggle ho raha hai.`,
        body:  `Recent scores thode low hain — especially ${c.weakTopic ?? 'weak topics'} mein. Chalo milke fix karte hain! 10 min ka focused practice.`,
        cta:   'Fix Karo Abhi',
        taskHint: `${c.weakTopic ?? 'Weak topic'} practice — 10 min`,
      }),
    },
    strict: {
      english: (c) => ({
        emoji: '🎯',
        title: `Performance down. Time to work harder.`,
        body:  `Your accuracy dropped to ${c.accuracy ?? '?'}%. You know what to do — ${c.weakTopic ?? 'weak topics'} need immediate attention.`,
        cta:   'Practice Now',
        taskHint: `Drill on ${c.weakTopic ?? 'weak topics'} — 15 min`,
      }),
      hinglish: (c) => ({
        emoji: '🎯',
        title: 'Score gira hai. Mehnat badhaao.',
        body:  `Accuracy ${c.accuracy ?? '?'}% par aa gayi. ${c.weakTopic ?? 'Weak topics'} pe immediately kaam karo.`,
        cta:   'Abhi Practice Karo',
        taskHint: `${c.weakTopic ?? 'Weak topic'} drill — 15 min`,
      }),
    },
    motivational: {
      english: (c) => ({
        emoji: '💪',
        title: 'Low scores today = strength tomorrow.',
        body:  `Your scores dipped on ${c.weakTopic ?? 'some topics'}. But every struggle is just a lesson waiting to be learned. Let's turn this into your biggest improvement yet!`,
        cta:   'Turn It Around',
        taskHint: `Targeted 10-min practice`,
      }),
      hinglish: (c) => ({
        emoji: '💪',
        title: 'Aaj ka struggle kal ki strength hai.',
        body:  `${c.weakTopic ?? 'Kuch topics'} mein score dip hua. Lekin yeh sirf ek opportunity hai improve karne ki!`,
        cta:   'Improve Karo Abhi',
        taskHint: 'Targeted 10 min practice',
      }),
    },
  },

  HIGH_PROGRESS: {
    friendly: {
      english: (c) => ({
        emoji: '🎉',
        title: `Amazing! You improved ${c.improvement ?? '?'}% this week!`,
        body:  `Wow — your accuracy jumped by ${c.improvement ?? '?'}%! Your hard work is really paying off. Keep this momentum going!`,
        cta:   'Keep Going!',
        taskHint: 'Challenge mode — push further',
      }),
      hinglish: (c) => ({
        emoji: '🎉',
        title: `Wah! ${c.improvement ?? '?'}% improvement aaya!`,
        body:  `Kya baat hai — ${c.improvement ?? '?'}% accuracy badhi! Tumhari mehnat rang la rahi hai. Is momentum ko maintain karo!`,
        cta:   'Aur Aage Bado!',
        taskHint: 'Challenge mode unlock',
      }),
    },
    strict: {
      english: (c) => ({
        emoji: '✅',
        title: `Good. ${c.improvement ?? '?'}% up. Now do more.`,
        body:  `${c.improvement ?? '?'}% improvement noted. This is the standard. Don't drop it — push for more.`,
        cta:   'Level Up',
        taskHint: 'Advanced challenge session',
      }),
      hinglish: (c) => ({
        emoji: '✅',
        title: `Theek hai. ${c.improvement ?? '?'}% improve kiya. Aur karo.`,
        body:  `${c.improvement ?? '?'}% improvement — yeh toh standard hai. Ruko mat. Aur aage bado.`,
        cta:   'Aage Bado',
        taskHint: 'Advanced challenge',
      }),
    },
    motivational: {
      english: (c) => ({
        emoji: '🚀',
        title: `${c.improvement ?? '?'}% improvement — you're on FIRE! 🔥`,
        body:  `THIS is what growth looks like! You improved ${c.improvement ?? '?'}% — that's not small, that's transformational. Ready for the next level?`,
        cta:   'Take the Next Challenge',
        taskHint: 'Unlock harder level',
      }),
      hinglish: (c) => ({
        emoji: '🚀',
        title: `${c.improvement ?? '?'}% improvement — aag laga di! 🔥`,
        body:  `Yahi toh growth hoti hai! ${c.improvement ?? '?'}% improve kiya — small nahi, yeh transformational hai. Agli level ke liye ready ho?`,
        cta:   'Agli Level Lo',
        taskHint: 'Harder level unlock',
      }),
    },
  },

  INACTIVE_USER: {
    friendly: {
      english: (c) => ({
        emoji: '☕',
        title: 'Quick check-in — 5 mins?',
        body:  `You haven't been around for a bit. No pressure — just a quick 5-minute session to stay in the flow.`,
        cta:   'Do 5 Minutes',
        taskHint: '5-min easy task',
      }),
      hinglish: (c) => ({
        emoji: '☕',
        title: 'Chhota sa session karte hain?',
        body:  `Thodi der se kuch nahi kiya. Koi baat nahi — bas 5 min ka ek easy task. Stay in the flow!`,
        cta:   '5 Min Karo',
        taskHint: '5 min easy task',
      }),
    },
    strict: {
      english: () => ({
        emoji: '⏱️',
        title: 'You went quiet. Not acceptable.',
        body:  `You need to show up every day. Log in and complete at least 10 minutes. Today.`,
        cta:   'Log In Now',
        taskHint: '10-min mandatory session',
      }),
      hinglish: () => ({
        emoji: '⏱️',
        title: 'Kahan ho bhai? Roz aana padta hai.',
        body:  `Har roz thoda kuch karna zaroori hai. 10 min ka session complete karo. Abhi.`,
        cta:   'Abhi Login Karo',
        taskHint: '10 min mandatory session',
      }),
    },
    motivational: {
      english: () => ({
        emoji: '⚡',
        title: 'Your future self is waiting.',
        body:  `Every day you skip is a day your future self wishes you hadn't. 5 minutes is all it takes to keep the fire alive.`,
        cta:   'Keep the Fire',
        taskHint: '5-min re-engagement task',
      }),
      hinglish: () => ({
        emoji: '⚡',
        title: 'Tumhara future self wait kar raha hai.',
        body:  `Har din jo miss hota hai, future mein uska afsoos hota hai. Sirf 5 min do aaj — fire alive raho!`,
        cta:   'Fire Alive Rakho',
        taskHint: '5 min re-engagement',
      }),
    },
  },

  DAILY_REMINDER: {
    friendly: {
      english: (c) => ({
        emoji: '📚',
        title: `Ready for today's session?`,
        body:  `Hey! ${c.topic ? `You were working on ${c.topic} — let's continue.` : "Let's keep your learning streak going!"} Just 10 minutes is enough.`,
        cta:   "Let's Go",
        taskHint: '10-min daily session',
      }),
      hinglish: (c) => ({
        emoji: '📚',
        title: 'Aaj ki padhai shuru karein?',
        body:  `${c.topic ? `${c.topic} pe kaam ho raha tha — continue karte hain!` : 'Aaj bhi thodi padhai karte hain!'} Bas 10 min.`,
        cta:   'Shuru Karo',
        taskHint: '10 min daily session',
      }),
    },
    strict: {
      english: (c) => ({
        emoji: '🔔',
        title: 'Study time.',
        body:  `Daily study is non-negotiable. ${c.topic ? `Continue with ${c.topic}.` : "Open your learning plan and execute."}`,
        cta:   'Study Now',
        taskHint: 'Follow daily plan',
      }),
      hinglish: (c) => ({
        emoji: '🔔',
        title: 'Padhai ka time.',
        body:  `Roz padhai zaroori hai. ${c.topic ? `${c.topic} continue karo.` : 'Learning plan follow karo.'}`,
        cta:   'Abhi Padho',
        taskHint: 'Daily plan follow karo',
      }),
    },
    motivational: {
      english: (c) => ({
        emoji: '🌟',
        title: 'Another day, another win.',
        body:  `Small consistent actions build extraordinary results. ${c.topic ? `Today: ${c.topic}.` : "Today: keep the chain unbroken!"} You've got this.`,
        cta:   'Claim My Daily Win',
        taskHint: 'Daily consistency task',
      }),
      hinglish: (c) => ({
        emoji: '🌟',
        title: 'Ek aur din, ek aur jeet.',
        body:  `Chote chote kadam bade result dete hain. ${c.topic ? `Aaj: ${c.topic}.` : 'Aaj bhi chain mat todna!'} You've got this!`,
        cta:   'Aaj Ki Jeet Lo',
        taskHint: 'Daily consistency task',
      }),
    },
  },

  GOAL_PENDING: {
    friendly: {
      english: (c) => ({
        emoji: '🎯',
        title: `Your AI plan is waiting!`,
        body:  `You have pending tasks in your personalized learning plan. ${c.topic ? `Next up: ${c.topic}.` : 'Knock out one task today!'}`,
        cta:   'View My Plan',
        taskHint: 'Complete 1 pending goal',
      }),
      hinglish: (c) => ({
        emoji: '🎯',
        title: 'Tumhara AI plan wait kar raha hai!',
        body:  `Personalized plan mein pending tasks hain. ${c.topic ? `Next: ${c.topic}.` : 'Aaj ek task complete karo!'} `,
        cta:   'Plan Dekho',
        taskHint: '1 pending goal complete karo',
      }),
    },
    strict: {
      english: () => ({
        emoji: '📋',
        title: 'Pending goals. Complete them.',
        body:  `Your learning plan has unfinished items. Complete at least one today.`,
        cta:   'Complete a Goal',
        taskHint: 'Clear 1 pending goal',
      }),
      hinglish: () => ({
        emoji: '📋',
        title: 'Pending goals hain. Complete karo.',
        body:  `Learning plan mein unfinished items hain. Aaj ek complete karo.`,
        cta:   '1 Goal Complete Karo',
        taskHint: '1 pending goal clear',
      }),
    },
    motivational: {
      english: (c) => ({
        emoji: '✨',
        title: 'Your plan is your roadmap to success.',
        body:  `Every goal you complete brings you closer to mastery. ${c.topic ? `Next stop: ${c.topic}!` : "Let's keep moving forward!"}`,
        cta:   'Crush a Goal Today',
        taskHint: 'Complete 1 goal',
      }),
      hinglish: (c) => ({
        emoji: '✨',
        title: 'Plan tumhara success ka roadmap hai.',
        body:  `Har goal complete karna tumhe mastery ke kareeb laata hai. ${c.topic ? `Next: ${c.topic}!` : 'Aage bado!'}`,
        cta:   'Aaj Ek Goal Todo',
        taskHint: '1 goal complete karo',
      }),
    },
  },

  WEAK_TOPIC_FOCUS: {
    friendly: {
      english: (c) => ({
        emoji: '🔧',
        title: `Let's fix ${c.weakTopic ?? 'your weak spot'} today!`,
        body:  `AI detected that you're struggling with ${c.weakTopic ?? 'a topic'}. Quick 10-min focused session and it'll start to click!`,
        cta:   'Fix It Now',
        taskHint: `10-min practice: ${c.weakTopic ?? 'weak topic'}`,
      }),
      hinglish: (c) => ({
        emoji: '🔧',
        title: `${c.weakTopic ?? 'Weak topic'} fix karte hain aaj!`,
        body:  `AI ne detect kiya ki ${c.weakTopic ?? 'ek topic'} mein struggle hai. 10 min ka focused session karo — clear ho jaayega!`,
        cta:   'Fix Karo',
        taskHint: `${c.weakTopic ?? 'Weak topic'} — 10 min practice`,
      }),
    },
    strict: {
      english: (c) => ({
        emoji: '⚡',
        title: `${c.weakTopic ?? 'Weak topic'} — fix it today.`,
        body:  `${c.weakTopic ?? 'This topic'} keeps appearing in your weak areas. Ignore it no longer.`,
        cta:   'Practice Now',
        taskHint: `${c.weakTopic ?? 'Weak topic'} drill`,
      }),
      hinglish: (c) => ({
        emoji: '⚡',
        title: `${c.weakTopic ?? 'Weak topic'} — aaj fix karo.`,
        body:  `${c.weakTopic ?? 'Yeh topic'} bar bar weak area mein aa raha hai. Ab ignore mat karo.`,
        cta:   'Practice Karo',
        taskHint: `${c.weakTopic ?? 'Weak topic'} drill`,
      }),
    },
    motivational: {
      english: (c) => ({
        emoji: '🧠',
        title: `Turn ${c.weakTopic ?? 'weakness'} into your superpower!`,
        body:  `Every weak topic you conquer becomes your secret weapon. Today: ${c.weakTopic ?? 'your weak area'}. Let's flip it.`,
        cta:   'Conquer It',
        taskHint: `${c.weakTopic ?? 'Weak topic'} focused session`,
      }),
      hinglish: (c) => ({
        emoji: '🧠',
        title: `${c.weakTopic ?? 'Weakness'} ko superpower bana do!`,
        body:  `Jo topic aaj weak hai, kal woh tumhari strength ban sakti hai. Aaj: ${c.weakTopic ?? 'weak area'} — flip karo!`,
        cta:   'Conquer Karo',
        taskHint: `${c.weakTopic ?? 'Weak topic'} focused session`,
      }),
    },
  },

  MILESTONE_REACHED: {
    friendly: {
      english: (c) => ({
        emoji: '🏆',
        title: `Milestone reached: ${c.streak}-day streak!`,
        body:  `You just hit a ${c.streak}-day study streak! That's incredible consistency. Here's a bonus reward — keep it up!`,
        cta:   'Claim Reward',
        taskHint: 'Bonus challenge unlocked',
      }),
      hinglish: (c) => ({
        emoji: '🏆',
        title: `${c.streak} din ki streak! Milestone!`,
        body:  `${c.streak} din ki study streak complete! Yeh toh kamaal ki consistency hai. Bonus reward le lo!`,
        cta:   'Reward Lo',
        taskHint: 'Bonus challenge unlock',
      }),
    },
    strict: {
      english: (c) => ({
        emoji: '✅',
        title: `${c.streak} days. Good. Keep going.`,
        body:  `You reached a milestone. This is just the beginning. Don't stop now.`,
        cta:   'Keep Pushing',
        taskHint: 'Next level challenge',
      }),
      hinglish: (c) => ({
        emoji: '✅',
        title: `${c.streak} din. Achha. Ruko mat.`,
        body:  `Milestone reach kiya. Yeh toh shuruwat hai. Aage bado.`,
        cta:   'Aage Bado',
        taskHint: 'Next level challenge',
      }),
    },
    motivational: {
      english: (c) => ({
        emoji: '🌟',
        title: `${c.streak} DAYS! You're unstoppable! 🔥`,
        body:  `${c.streak} days of consistent learning — you're building something REAL. Most people quit. You didn't. That's who you are.`,
        cta:   'Keep Being Unstoppable',
        taskHint: 'Legendary challenge',
      }),
      hinglish: (c) => ({
        emoji: '🌟',
        title: `${c.streak} DIN! Koi nahi rok sakta! 🔥`,
        body:  `${c.streak} din ki consistent learning — yeh toh real growth hai. Log quit karte hain — tum nahi kiye. Yahi tumhari pehchaan hai!`,
        cta:   'Unstoppable Raho',
        taskHint: 'Legendary challenge',
      }),
    },
  },
};

// ── Main export ────────────────────────────────────────────────

export async function generateMentorMessage(
  snap:         BehaviorSnapshot,
  trigger:      MentorTrigger,
  personality?: MentorPersonality,
): Promise<MentorMessage> {

  try {
    // Fetch mentor style preference (default: motivational)
    const profile = await StudentProfile.findOne({ userId: snap.userId })
      .select('preferredLanguage tutorPersonality')
      .lean();

    const lang: MentorLanguage = (profile?.preferredLanguage ?? 'english') as MentorLanguage;
    const style: MentorPersonality = personality ?? 'motivational';

    const ctx: TemplateCtx = {
      topic:       snap.mostRecentTopic ?? undefined,
      streak:      snap.currentStreak,
      improvement: trigger.context.improvement,
      accuracy:    Math.round(snap.recentAccuracy * 100),
      daysMissed:  Math.floor(snap.daysSinceLastLogin),
      weakTopic:   snap.weakTopics[0] ?? trigger.context.weakTopics?.[0],
      strongTopic: snap.strongTopics[0],
    };

    const templateGroup = TEMPLATES[trigger.type];
    if (!templateGroup) throw new Error(`No template for trigger: ${trigger.type}`);

    const byPersonality = templateGroup[style] ?? templateGroup['motivational'];
    const byLang        = byPersonality[lang]  ?? byPersonality['english'];

    const partial = byLang(ctx);

    return {
      ...partial,
      triggerType: trigger.type,
      personality: style,
      language:    lang,
      generatedAt: new Date().toISOString(),
    };

  } catch (err) {
    logger.error({ userId: snap.userId, err }, '[MentorMessageGenerator] Failed');
    throw err;
  }
}

export const mentorMessageGenerator = { generateMentorMessage };