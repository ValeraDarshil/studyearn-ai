// ✅ SINGLE SOURCE OF TRUTH for all achievements
// condition is checked on frontend using live user stats

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  desc: string;
  category: 'questions' | 'ppt' | 'pdf' | 'streak' | 'points' | 'social' | 'special' | 'quiz' | 'challenge' | 'notes' | 'codelearn';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stat: 'totalQuestionsAsked' | 'totalPPTsGenerated' | 'totalPDFsConverted' | 'streak' | 'points' | 'referrals' | 'totalQuizCompleted' | 'totalChallengesCompleted' | 'totalChallengesCorrect' | 'totalNotesCreated' | 'totalStudyToolsUsed' | 'totalFormulaBookmarks' | 'totalDaysActive';
  threshold: number;
  reward: number;
}

export const ACHIEVEMENTS: Achievement[] = [

  // ── ASK AI — QUESTIONS ────────────────────────────────────────────────
  { id: 'first_question',    icon: '🎓', name: 'First Step',        desc: 'Asked your very first AI question',      category: 'questions', rarity: 'common',    stat: 'totalQuestionsAsked', threshold: 1,    reward: 20  },
  { id: 'curious_mind',      icon: '🧠', name: 'Curious Mind',      desc: 'Asked 10 questions',                     category: 'questions', rarity: 'common',    stat: 'totalQuestionsAsked', threshold: 10,   reward: 30  },
  { id: 'knowledge_seeker',  icon: '📚', name: 'Knowledge Seeker',  desc: 'Asked 50 questions',                     category: 'questions', rarity: 'rare',      stat: 'totalQuestionsAsked', threshold: 50,   reward: 75  },
  { id: 'question_master',   icon: '🔬', name: 'Question Master',   desc: 'Asked 100 questions',                    category: 'questions', rarity: 'epic',      stat: 'totalQuestionsAsked', threshold: 100,  reward: 150 },
  { id: 'question_legend',   icon: '🌟', name: 'AI Legend',         desc: 'Asked 500 questions — true AI addict!',  category: 'questions', rarity: 'legendary', stat: 'totalQuestionsAsked', threshold: 500,  reward: 750 },

  // ── PPT GENERATOR ─────────────────────────────────────────────────────
  { id: 'first_ppt',   icon: '📊', name: 'Slide Maker',    desc: 'Created your first presentation',     category: 'ppt', rarity: 'common',    stat: 'totalPPTsGenerated', threshold: 1,  reward: 25  },
  { id: 'ppt_pro',     icon: '🎤', name: 'PPT Pro',        desc: 'Created 5 presentations',             category: 'ppt', rarity: 'rare',      stat: 'totalPPTsGenerated', threshold: 5,  reward: 60  },
  { id: 'ppt_master',  icon: '🏆', name: 'PPT Master',     desc: 'Created 20 presentations',            category: 'ppt', rarity: 'epic',      stat: 'totalPPTsGenerated', threshold: 20, reward: 200 },
  { id: 'ppt_legend',  icon: '🎬', name: 'Presentation God', desc: 'Created 50 presentations',         category: 'ppt', rarity: 'legendary', stat: 'totalPPTsGenerated', threshold: 50, reward: 500 },

  // ── PDF TOOLS ─────────────────────────────────────────────────────────
  { id: 'first_pdf',  icon: '📄', name: 'PDF Wizard',    desc: 'Used PDF tools for the first time',  category: 'pdf', rarity: 'common', stat: 'totalPDFsConverted', threshold: 1,  reward: 15 },
  { id: 'pdf_pro',    icon: '🗂️', name: 'PDF Pro',       desc: 'Used PDF tools 10 times',            category: 'pdf', rarity: 'rare',   stat: 'totalPDFsConverted', threshold: 10, reward: 50 },
  { id: 'pdf_master', icon: '📋', name: 'PDF Master',    desc: 'Used PDF tools 50 times',            category: 'pdf', rarity: 'epic',   stat: 'totalPDFsConverted', threshold: 50, reward: 200 },

  // ── STREAK ────────────────────────────────────────────────────────────
  { id: 'streak_3',   icon: '🔥', name: '3 Day Streak',    desc: 'Studied 3 days in a row',            category: 'streak', rarity: 'common',    stat: 'streak', threshold: 3,   reward: 30  },
  { id: 'streak_7',   icon: '⚡', name: 'Week Warrior',    desc: '7 day streak — one full week!',      category: 'streak', rarity: 'rare',      stat: 'streak', threshold: 7,   reward: 70  },
  { id: 'streak_14',  icon: '🌊', name: 'Fortnight Fire',  desc: '14 day streak — two weeks!',         category: 'streak', rarity: 'rare',      stat: 'streak', threshold: 14,  reward: 150 },
  { id: 'streak_30',  icon: '💫', name: 'Monthly Legend',  desc: '30 day streak — unstoppable!',       category: 'streak', rarity: 'epic',      stat: 'streak', threshold: 30,  reward: 500 },
  { id: 'streak_100', icon: '🌈', name: 'Century Streak',  desc: '100 day streak — absolute legend!',  category: 'streak', rarity: 'legendary', stat: 'streak', threshold: 100, reward: 2000 },

  // ── POINTS / XP ───────────────────────────────────────────────────────
  { id: 'points_100',   icon: '💡', name: 'Getting Started',  desc: 'Earned 100 points',          category: 'points', rarity: 'common',    stat: 'points', threshold: 100,   reward: 0    },
  { id: 'points_500',   icon: '💰', name: 'Point Collector',  desc: 'Earned 500 points',          category: 'points', rarity: 'common',    stat: 'points', threshold: 500,   reward: 0    },
  { id: 'points_1000',  icon: '💎', name: 'Diamond Student',  desc: 'Earned 1,000 points',        category: 'points', rarity: 'rare',      stat: 'points', threshold: 1000,  reward: 100  },
  { id: 'points_5000',  icon: '👑', name: 'Scholar King',     desc: 'Earned 5,000 points',        category: 'points', rarity: 'epic',      stat: 'points', threshold: 5000,  reward: 500  },
  { id: 'points_10000', icon: '🏅', name: 'Elite Scholar',    desc: 'Earned 10,000 points',       category: 'points', rarity: 'legendary', stat: 'points', threshold: 10000, reward: 1000 },
  { id: 'points_50000', icon: '🌠', name: 'StudyEarn God',    desc: 'Earned 50,000 points — wow!', category: 'points', rarity: 'legendary', stat: 'points', threshold: 50000, reward: 5000 },

  // ── QUIZ GENERATOR ────────────────────────────────────────────────────
  { id: 'first_quiz',      icon: '🎯', name: 'Quiz Starter',   desc: 'Completed your first quiz',      category: 'quiz', rarity: 'common',    stat: 'totalQuizCompleted', threshold: 1,   reward: 20  },
  { id: 'quiz_10',         icon: '📝', name: 'Quiz Taker',     desc: 'Completed 10 quizzes',           category: 'quiz', rarity: 'common',    stat: 'totalQuizCompleted', threshold: 10,  reward: 50  },
  { id: 'quiz_50',         icon: '🎲', name: 'Quiz Addict',    desc: 'Completed 50 quizzes',           category: 'quiz', rarity: 'rare',      stat: 'totalQuizCompleted', threshold: 50,  reward: 150 },
  { id: 'quiz_100',        icon: '🎰', name: 'Quiz Champion',  desc: 'Completed 100 quizzes',          category: 'quiz', rarity: 'epic',      stat: 'totalQuizCompleted', threshold: 100, reward: 400 },

  // ── DAILY CHALLENGE ───────────────────────────────────────────────────
  { id: 'first_challenge',      icon: '⚔️',  name: 'Challenger',      desc: 'Completed your first daily challenge',  category: 'challenge', rarity: 'common', stat: 'totalChallengesCompleted', threshold: 1,  reward: 25  },
  { id: 'challenge_7',          icon: '🛡️',  name: 'Weekly Fighter',  desc: 'Completed 7 daily challenges',          category: 'challenge', rarity: 'rare',   stat: 'totalChallengesCompleted', threshold: 7,  reward: 75  },
  { id: 'challenge_30',         icon: '🗡️',  name: 'Monthly Warrior', desc: 'Completed 30 daily challenges',         category: 'challenge', rarity: 'epic',   stat: 'totalChallengesCompleted', threshold: 30, reward: 300 },
  { id: 'challenge_correct_10', icon: '✅',  name: 'Sharp Mind',      desc: 'Got 10 daily challenges correct',       category: 'challenge', rarity: 'rare',   stat: 'totalChallengesCorrect',   threshold: 10, reward: 100 },
  { id: 'challenge_correct_50', icon: '🎖️', name: 'Genius',          desc: 'Got 50 daily challenges correct',       category: 'challenge', rarity: 'epic',   stat: 'totalChallengesCorrect',   threshold: 50, reward: 500 },

  // ── COLLAB NOTES ──────────────────────────────────────────────────────
  { id: 'first_note',   icon: '📓', name: 'Note Taker',    desc: 'Created your first collaborative note', category: 'notes', rarity: 'common', stat: 'totalNotesCreated', threshold: 1,  reward: 20  },
  { id: 'notes_10',     icon: '📒', name: 'Note Master',   desc: 'Created 10 notes',                     category: 'notes', rarity: 'rare',   stat: 'totalNotesCreated', threshold: 10, reward: 75  },

  // ── STUDY TOOLS ───────────────────────────────────────────────────────
  { id: 'first_study_tool', icon: '🔭', name: 'Tool User',      desc: 'Used AI Study Tools for the first time', category: 'special', rarity: 'common', stat: 'totalStudyToolsUsed', threshold: 1,  reward: 20  },
  { id: 'study_tools_10',   icon: '🔬', name: 'Research Pro',   desc: 'Used AI Study Tools 10 times',           category: 'special', rarity: 'rare',   stat: 'totalStudyToolsUsed', threshold: 10, reward: 80  },

  // ── FORMULA SHEET ─────────────────────────────────────────────────────
  { id: 'first_bookmark',   icon: '🔖', name: 'Bookmarker',      desc: 'Bookmarked your first formula',       category: 'special', rarity: 'common', stat: 'totalFormulaBookmarks', threshold: 1,  reward: 15  },
  { id: 'bookmarks_10',     icon: '📌', name: 'Formula Fan',     desc: 'Bookmarked 10 formulas',              category: 'special', rarity: 'rare',   stat: 'totalFormulaBookmarks', threshold: 10, reward: 50  },
  { id: 'bookmarks_25',     icon: '🗺️', name: 'Formula Master', desc: 'Bookmarked 25 formulas',              category: 'special', rarity: 'epic',   stat: 'totalFormulaBookmarks', threshold: 25, reward: 150 },

  // ── SOCIAL / REFERRAL ─────────────────────────────────────────────────
  { id: 'first_referral',   icon: '🤝', name: 'Connector',       desc: 'Referred your first friend',         category: 'social', rarity: 'common',    stat: 'referrals', threshold: 1,  reward: 50   },
  { id: 'referrals_5',      icon: '👥', name: 'Influencer',      desc: 'Referred 5 friends',                 category: 'social', rarity: 'rare',      stat: 'referrals', threshold: 5,  reward: 200  },
  { id: 'referrals_10',     icon: '🌐', name: 'Community Builder', desc: 'Referred 10 friends',             category: 'social', rarity: 'epic',      stat: 'referrals', threshold: 10, reward: 500  },
  { id: 'referrals_25',     icon: '🦁', name: 'Ambassador',      desc: 'Referred 25 friends — legend!',     category: 'social', rarity: 'legendary', stat: 'referrals', threshold: 25, reward: 2000 },

  // ── SPECIAL / MILESTONES ──────────────────────────────────────────────
  { id: 'days_active_7',   icon: '📅', name: 'Week Regular',    desc: 'Active on StudyEarn for 7 days',      category: 'special', rarity: 'common',    stat: 'totalDaysActive', threshold: 7,   reward: 50   },
  { id: 'days_active_30',  icon: '🗓️', name: 'Monthly Regular', desc: 'Active on StudyEarn for 30 days',    category: 'special', rarity: 'rare',      stat: 'totalDaysActive', threshold: 30,  reward: 200  },
  { id: 'days_active_100', icon: '🏛️', name: '100 Day Hero',    desc: 'Active on StudyEarn for 100 days',   category: 'special', rarity: 'epic',      stat: 'totalDaysActive', threshold: 100, reward: 1000 },
  { id: 'days_active_365', icon: '🌍', name: 'StudyEarn Veteran', desc: 'One full year on StudyEarn!',      category: 'special', rarity: 'legendary', stat: 'totalDaysActive', threshold: 365, reward: 5000 },

];

export const RARITY_STYLES = {
  common:    { border: 'border-slate-500/30',   bg: 'from-slate-500/10 to-slate-600/5',   badge: 'bg-slate-500/20 text-slate-300',    glow: '' },
  rare:      { border: 'border-blue-500/40',    bg: 'from-blue-500/10 to-cyan-500/5',     badge: 'bg-blue-500/20 text-blue-300',      glow: 'shadow-blue-500/10' },
  epic:      { border: 'border-purple-500/50',  bg: 'from-purple-500/10 to-pink-500/5',   badge: 'bg-purple-500/20 text-purple-300',  glow: 'shadow-purple-500/15' },
  legendary: { border: 'border-yellow-500/60',  bg: 'from-yellow-500/10 to-orange-500/5', badge: 'bg-yellow-500/20 text-yellow-300',  glow: 'shadow-yellow-500/20' },
};