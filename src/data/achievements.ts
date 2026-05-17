// ✅ SINGLE SOURCE OF TRUTH for all achievements  (v2 — expanded)
//
// WHAT CHANGED (v2):
//   — Questions: 1,10,25,50,75,100,200,300,400,500,750,1000 (was 1,10,50,100,500)
//   — PPT: 1,3,5,10,20,35,50 (was 1,5,20,50)
//   — PDF: 1,5,10,25,50,100 (was 1,10,50)
//   — Streak: 3,7,14,21,30,60,100,365 (was 3,7,14,30,100) + yearly
//   — Points: 100,250,500,1000,2500,5000,10000,25000,50000 (finer steps)
//   — Quiz: 1,5,10,25,50,100,200 (was 1,10,50,100)
//   — Challenge: 1,7,15,30,50,100 correct + completions (finer)
//   — Notes: 1,5,10,25,50
//   — Referral: 1,3,5,10,25,50 (was 1,5,10,25)
//   — Study Tools + Formula bookmarks: finer steps
//   — Days Active: 1,7,14,30,60,100,180,365
//   — NEW: Login streak extras, perfect week/month, early bird milestones

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

  // ── ASK AI — QUESTIONS ────────────────────────────────────────────────────
  // Dense milestones: 1 → 10 → 25 → 50 → 75 → 100 → 200 → 300 → 400 → 500 → 750 → 1000
  { id: 'q_1',    icon: '🎓', name: 'First Step',        desc: 'Asked your very first AI question — the journey begins!',   category: 'questions', rarity: 'common',    stat: 'totalQuestionsAsked', threshold: 1,    reward: 20   },
  { id: 'q_10',   icon: '🧠', name: 'Curious Mind',      desc: 'Asked 10 questions — curiosity is your superpower.',        category: 'questions', rarity: 'common',    stat: 'totalQuestionsAsked', threshold: 10,   reward: 30   },
  { id: 'q_25',   icon: '📖', name: 'Eager Learner',     desc: 'Asked 25 questions — you\'re on a roll!',                  category: 'questions', rarity: 'common',    stat: 'totalQuestionsAsked', threshold: 25,   reward: 50   },
  { id: 'q_50',   icon: '📚', name: 'Knowledge Seeker',  desc: 'Asked 50 questions — halfway to a hundred!',               category: 'questions', rarity: 'rare',      stat: 'totalQuestionsAsked', threshold: 50,   reward: 75   },
  { id: 'q_75',   icon: '🔍', name: 'Deep Diver',        desc: 'Asked 75 questions — nothing stops your curiosity.',       category: 'questions', rarity: 'rare',      stat: 'totalQuestionsAsked', threshold: 75,   reward: 100  },
  { id: 'q_100',  icon: '🔬', name: 'Question Master',   desc: 'Asked 100 questions — you\'re unstoppable!',               category: 'questions', rarity: 'epic',      stat: 'totalQuestionsAsked', threshold: 100,  reward: 150  },
  { id: 'q_200',  icon: '🌌', name: 'AI Explorer',       desc: 'Asked 200 questions — deep into the knowledge universe.',  category: 'questions', rarity: 'epic',      stat: 'totalQuestionsAsked', threshold: 200,  reward: 250  },
  { id: 'q_300',  icon: '⚗️', name: 'Research Scholar',  desc: 'Asked 300 questions — a true scholar at work.',            category: 'questions', rarity: 'epic',      stat: 'totalQuestionsAsked', threshold: 300,  reward: 350  },
  { id: 'q_400',  icon: '🔭', name: 'Knowledge Hunter',  desc: 'Asked 400 questions — relentlessly seeking answers.',      category: 'questions', rarity: 'epic',      stat: 'totalQuestionsAsked', threshold: 400,  reward: 500  },
  { id: 'q_500',  icon: '🌟', name: 'AI Addict',         desc: 'Asked 500 questions — completely addicted to learning!',   category: 'questions', rarity: 'legendary', stat: 'totalQuestionsAsked', threshold: 500,  reward: 750  },
  { id: 'q_750',  icon: '🚀', name: 'Astro Learner',     desc: 'Asked 750 questions — shooting for the stars!',            category: 'questions', rarity: 'legendary', stat: 'totalQuestionsAsked', threshold: 750,  reward: 1000 },
  { id: 'q_1000', icon: '👑', name: 'AI Legend',         desc: 'Asked 1000 questions — an absolute AI legend!',            category: 'questions', rarity: 'legendary', stat: 'totalQuestionsAsked', threshold: 1000, reward: 2000 },

  // ── PPT GENERATOR ──────────────────────────────────────────────────────────
  // 1, 3, 5, 10, 20, 35, 50
  { id: 'ppt_1',  icon: '📊', name: 'Slide Maker',       desc: 'Created your first presentation — showtime!',              category: 'ppt', rarity: 'common',    stat: 'totalPPTsGenerated', threshold: 1,  reward: 25  },
  { id: 'ppt_3',  icon: '🖼️', name: 'Deck Builder',      desc: 'Created 3 presentations — slides are your thing.',        category: 'ppt', rarity: 'common',    stat: 'totalPPTsGenerated', threshold: 3,  reward: 40  },
  { id: 'ppt_5',  icon: '🎤', name: 'PPT Pro',           desc: 'Created 5 presentations — a natural presenter.',          category: 'ppt', rarity: 'rare',      stat: 'totalPPTsGenerated', threshold: 5,  reward: 60  },
  { id: 'ppt_10', icon: '🎞️', name: 'Slide Artist',      desc: 'Created 10 presentations — you make slides look easy.',   category: 'ppt', rarity: 'rare',      stat: 'totalPPTsGenerated', threshold: 10, reward: 120 },
  { id: 'ppt_20', icon: '🏆', name: 'PPT Master',        desc: 'Created 20 presentations — mastery unlocked!',            category: 'ppt', rarity: 'epic',      stat: 'totalPPTsGenerated', threshold: 20, reward: 200 },
  { id: 'ppt_35', icon: '🎭', name: 'Stage Director',    desc: 'Created 35 presentations — directing every stage.',       category: 'ppt', rarity: 'epic',      stat: 'totalPPTsGenerated', threshold: 35, reward: 350 },
  { id: 'ppt_50', icon: '🎬', name: 'Presentation God',  desc: 'Created 50 presentations — a true PPT legend!',           category: 'ppt', rarity: 'legendary', stat: 'totalPPTsGenerated', threshold: 50, reward: 500 },

  // ── PDF TOOLS ──────────────────────────────────────────────────────────────
  // 1, 5, 10, 25, 50, 100
  { id: 'pdf_1',   icon: '📄', name: 'PDF Starter',      desc: 'Used PDF tools for the first time.',                      category: 'pdf', rarity: 'common',    stat: 'totalPDFsConverted', threshold: 1,   reward: 15  },
  { id: 'pdf_5',   icon: '📑', name: 'PDF User',         desc: 'Used PDF tools 5 times — getting the hang of it!',       category: 'pdf', rarity: 'common',    stat: 'totalPDFsConverted', threshold: 5,   reward: 30  },
  { id: 'pdf_10',  icon: '🗂️', name: 'PDF Pro',          desc: 'Used PDF tools 10 times — a reliable pro.',              category: 'pdf', rarity: 'rare',      stat: 'totalPDFsConverted', threshold: 10,  reward: 60  },
  { id: 'pdf_25',  icon: '📋', name: 'Document Expert',  desc: 'Used PDF tools 25 times — documents fear you.',          category: 'pdf', rarity: 'rare',      stat: 'totalPDFsConverted', threshold: 25,  reward: 120 },
  { id: 'pdf_50',  icon: '🗄️', name: 'PDF Master',       desc: 'Used PDF tools 50 times — mastery complete!',            category: 'pdf', rarity: 'epic',      stat: 'totalPDFsConverted', threshold: 50,  reward: 200 },
  { id: 'pdf_100', icon: '🏗️', name: 'PDF Architect',    desc: 'Used PDF tools 100 times — you built an empire of docs.', category: 'pdf', rarity: 'legendary', stat: 'totalPDFsConverted', threshold: 100, reward: 500 },

  // ── STREAK ─────────────────────────────────────────────────────────────────
  // 3, 7, 14, 21, 30, 60, 100, 365
  { id: 'streak_3',   icon: '🔥', name: '3 Day Streak',     desc: 'Studied 3 days in a row — habit forming!',             category: 'streak', rarity: 'common',    stat: 'streak', threshold: 3,   reward: 30   },
  { id: 'streak_7',   icon: '⚡', name: 'Week Warrior',     desc: '7 day streak — a full week of learning!',              category: 'streak', rarity: 'rare',      stat: 'streak', threshold: 7,   reward: 70   },
  { id: 'streak_14',  icon: '🌊', name: 'Fortnight Fire',   desc: '14 day streak — two weeks, no breaks!',                category: 'streak', rarity: 'rare',      stat: 'streak', threshold: 14,  reward: 150  },
  { id: 'streak_21',  icon: '🎯', name: 'Habit Builder',    desc: '21 day streak — science says you\'ve built a habit!',  category: 'streak', rarity: 'epic',      stat: 'streak', threshold: 21,  reward: 250  },
  { id: 'streak_30',  icon: '💫', name: 'Monthly Legend',   desc: '30 day streak — a full month, unstoppable!',           category: 'streak', rarity: 'epic',      stat: 'streak', threshold: 30,  reward: 500  },
  { id: 'streak_60',  icon: '🌙', name: 'Two Month Titan',  desc: '60 day streak — two months of pure dedication.',       category: 'streak', rarity: 'epic',      stat: 'streak', threshold: 60,  reward: 1000 },
  { id: 'streak_100', icon: '🌈', name: 'Century Streak',   desc: '100 day streak — absolutely legendary!',               category: 'streak', rarity: 'legendary', stat: 'streak', threshold: 100, reward: 2000 },
  { id: 'streak_365', icon: '☀️', name: 'Year Champion',    desc: '365 day streak — one full year, you\'re a god!',       category: 'streak', rarity: 'legendary', stat: 'streak', threshold: 365, reward: 10000},

  // ── POINTS / XP ────────────────────────────────────────────────────────────
  // 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000
  { id: 'pts_100',   icon: '💡', name: 'Getting Started',   desc: 'Earned your first 100 points — just the beginning!',   category: 'points', rarity: 'common',    stat: 'points', threshold: 100,   reward: 0    },
  { id: 'pts_250',   icon: '🪙', name: 'Rising Star',       desc: 'Earned 250 points — rising through the ranks.',        category: 'points', rarity: 'common',    stat: 'points', threshold: 250,   reward: 0    },
  { id: 'pts_500',   icon: '💰', name: 'Point Collector',   desc: 'Earned 500 points — stacking up nicely!',              category: 'points', rarity: 'common',    stat: 'points', threshold: 500,   reward: 0    },
  { id: 'pts_1000',  icon: '💎', name: 'Diamond Student',   desc: 'Earned 1,000 points — diamond level reached!',         category: 'points', rarity: 'rare',      stat: 'points', threshold: 1000,  reward: 100  },
  { id: 'pts_2500',  icon: '🏅', name: 'High Achiever',     desc: 'Earned 2,500 points — seriously impressive!',          category: 'points', rarity: 'rare',      stat: 'points', threshold: 2500,  reward: 200  },
  { id: 'pts_5000',  icon: '👑', name: 'Scholar King',      desc: 'Earned 5,000 points — royalty status!',                category: 'points', rarity: 'epic',      stat: 'points', threshold: 5000,  reward: 500  },
  { id: 'pts_10000', icon: '🏆', name: 'Elite Scholar',     desc: 'Earned 10,000 points — the elite of the elite!',       category: 'points', rarity: 'legendary', stat: 'points', threshold: 10000, reward: 1000 },
  { id: 'pts_25000', icon: '🌟', name: 'StudyEarn Legend',  desc: 'Earned 25,000 points — a living legend!',              category: 'points', rarity: 'legendary', stat: 'points', threshold: 25000, reward: 2500 },
  { id: 'pts_50000', icon: '🌠', name: 'StudyEarn God',     desc: 'Earned 50,000 points — no one can touch you!',         category: 'points', rarity: 'legendary', stat: 'points', threshold: 50000, reward: 5000 },

  // ── QUIZ GENERATOR ─────────────────────────────────────────────────────────
  // 1, 5, 10, 25, 50, 100, 200
  { id: 'quiz_1',   icon: '🎯', name: 'Quiz Starter',      desc: 'Completed your first quiz — the test has begun!',       category: 'quiz', rarity: 'common',    stat: 'totalQuizCompleted', threshold: 1,   reward: 20  },
  { id: 'quiz_5',   icon: '📝', name: 'Quiz Taker',        desc: 'Completed 5 quizzes — warming up nicely.',             category: 'quiz', rarity: 'common',    stat: 'totalQuizCompleted', threshold: 5,   reward: 35  },
  { id: 'quiz_10',  icon: '📋', name: 'Quiz Regular',      desc: 'Completed 10 quizzes — testing is your thing!',        category: 'quiz', rarity: 'common',    stat: 'totalQuizCompleted', threshold: 10,  reward: 50  },
  { id: 'quiz_25',  icon: '🎲', name: 'Quiz Enthusiast',   desc: 'Completed 25 quizzes — addicted to being tested!',     category: 'quiz', rarity: 'rare',      stat: 'totalQuizCompleted', threshold: 25,  reward: 100 },
  { id: 'quiz_50',  icon: '🃏', name: 'Quiz Addict',       desc: 'Completed 50 quizzes — you love a challenge!',         category: 'quiz', rarity: 'rare',      stat: 'totalQuizCompleted', threshold: 50,  reward: 150 },
  { id: 'quiz_100', icon: '🎰', name: 'Quiz Champion',     desc: 'Completed 100 quizzes — champion status!',             category: 'quiz', rarity: 'epic',      stat: 'totalQuizCompleted', threshold: 100, reward: 400 },
  { id: 'quiz_200', icon: '🧬', name: 'Quiz Mastermind',   desc: 'Completed 200 quizzes — an absolute quiz mastermind!', category: 'quiz', rarity: 'legendary', stat: 'totalQuizCompleted', threshold: 200, reward: 1000},

  // ── DAILY CHALLENGE ────────────────────────────────────────────────────────
  // Completions: 1, 7, 15, 30, 50, 100
  // Correct:     5, 10, 25, 50, 100
  { id: 'ch_1',         icon: '⚔️',  name: 'Challenger',       desc: 'Completed your first daily challenge — fight on!',    category: 'challenge', rarity: 'common', stat: 'totalChallengesCompleted', threshold: 1,   reward: 25  },
  { id: 'ch_7',         icon: '🛡️',  name: 'Weekly Fighter',   desc: 'Completed 7 daily challenges — a true fighter.',      category: 'challenge', rarity: 'rare',   stat: 'totalChallengesCompleted', threshold: 7,   reward: 75  },
  { id: 'ch_15',        icon: '🗡️',  name: 'Battle Ready',     desc: 'Completed 15 daily challenges — always battle ready.', category: 'challenge', rarity: 'rare',  stat: 'totalChallengesCompleted', threshold: 15,  reward: 120 },
  { id: 'ch_30',        icon: '🏹',  name: 'Monthly Warrior',  desc: 'Completed 30 daily challenges — a warrior\'s spirit!', category: 'challenge', rarity: 'epic',  stat: 'totalChallengesCompleted', threshold: 30,  reward: 300 },
  { id: 'ch_50',        icon: '⚜️',  name: 'Elite Warrior',    desc: 'Completed 50 challenges — elite forces only!',        category: 'challenge', rarity: 'epic',   stat: 'totalChallengesCompleted', threshold: 50,  reward: 500 },
  { id: 'ch_100',       icon: '🎖️',  name: 'Challenge Legend', desc: 'Completed 100 challenges — absolute legend!',         category: 'challenge', rarity: 'legendary', stat: 'totalChallengesCompleted', threshold: 100, reward: 1500},
  { id: 'chc_5',        icon: '✅',  name: 'Sharp Shooter',    desc: 'Got 5 daily challenges correct — sharp!',             category: 'challenge', rarity: 'common', stat: 'totalChallengesCorrect',   threshold: 5,   reward: 40  },
  { id: 'chc_10',       icon: '🎯',  name: 'Sharp Mind',       desc: 'Got 10 daily challenges correct — laser precision.',  category: 'challenge', rarity: 'rare',   stat: 'totalChallengesCorrect',   threshold: 10,  reward: 100 },
  { id: 'chc_25',       icon: '🧩',  name: 'Problem Solver',   desc: 'Got 25 challenges correct — a natural problem solver.', category: 'challenge', rarity: 'rare', stat: 'totalChallengesCorrect',   threshold: 25,  reward: 200 },
  { id: 'chc_50',       icon: '🏆',  name: 'Genius',           desc: 'Got 50 daily challenges correct — certified genius!', category: 'challenge', rarity: 'epic',   stat: 'totalChallengesCorrect',   threshold: 50,  reward: 500 },
  { id: 'chc_100',      icon: '🌠',  name: 'Galaxy Brain',     desc: 'Got 100 challenges correct — galaxy-level IQ!',       category: 'challenge', rarity: 'legendary', stat: 'totalChallengesCorrect', threshold: 100, reward: 1500},

  // ── COLLAB NOTES ───────────────────────────────────────────────────────────
  // 1, 5, 10, 25, 50
  { id: 'note_1',  icon: '📓', name: 'Note Taker',         desc: 'Created your first collaborative note — ideas captured!', category: 'notes', rarity: 'common', stat: 'totalNotesCreated', threshold: 1,  reward: 20  },
  { id: 'note_5',  icon: '📒', name: 'Note Keeper',        desc: 'Created 5 notes — building your knowledge base.',        category: 'notes', rarity: 'common', stat: 'totalNotesCreated', threshold: 5,  reward: 40  },
  { id: 'note_10', icon: '📔', name: 'Note Master',        desc: 'Created 10 notes — your very own knowledge vault.',      category: 'notes', rarity: 'rare',   stat: 'totalNotesCreated', threshold: 10, reward: 75  },
  { id: 'note_25', icon: '📗', name: 'Scribe',             desc: 'Created 25 notes — a dedicated scribe of knowledge.',    category: 'notes', rarity: 'epic',   stat: 'totalNotesCreated', threshold: 25, reward: 200 },
  { id: 'note_50', icon: '📘', name: 'Note Legend',        desc: 'Created 50 notes — you\'ve written a library!',         category: 'notes', rarity: 'legendary', stat: 'totalNotesCreated', threshold: 50, reward: 500},

  // ── STUDY TOOLS ────────────────────────────────────────────────────────────
  { id: 'tool_1',  icon: '🔭', name: 'Tool User',          desc: 'Used AI Study Tools for the first time.',               category: 'special', rarity: 'common', stat: 'totalStudyToolsUsed', threshold: 1,  reward: 20  },
  { id: 'tool_5',  icon: '🔬', name: 'Research Starter',   desc: 'Used AI Study Tools 5 times — research mode on!',       category: 'special', rarity: 'common', stat: 'totalStudyToolsUsed', threshold: 5,  reward: 40  },
  { id: 'tool_10', icon: '⚙️', name: 'Research Pro',       desc: 'Used AI Study Tools 10 times — a true researcher.',     category: 'special', rarity: 'rare',   stat: 'totalStudyToolsUsed', threshold: 10, reward: 80  },
  { id: 'tool_25', icon: '🧪', name: 'Lab Expert',         desc: 'Used AI Study Tools 25 times — lab coat required!',     category: 'special', rarity: 'epic',   stat: 'totalStudyToolsUsed', threshold: 25, reward: 200 },
  { id: 'tool_50', icon: '🛸', name: 'Tool Master',        desc: 'Used AI Study Tools 50 times — completely tool-savvy.', category: 'special', rarity: 'legendary', stat: 'totalStudyToolsUsed', threshold: 50, reward: 500},

  // ── FORMULA SHEET ──────────────────────────────────────────────────────────
  { id: 'form_1',  icon: '🔖', name: 'Bookmarker',         desc: 'Bookmarked your first formula — smart move!',           category: 'special', rarity: 'common', stat: 'totalFormulaBookmarks', threshold: 1,  reward: 15  },
  { id: 'form_5',  icon: '📎', name: 'Formula Fan',        desc: 'Bookmarked 5 formulas — building your sheet.',          category: 'special', rarity: 'common', stat: 'totalFormulaBookmarks', threshold: 5,  reward: 30  },
  { id: 'form_10', icon: '📌', name: 'Formula Keeper',     desc: 'Bookmarked 10 formulas — a handy reference sheet.',     category: 'special', rarity: 'rare',   stat: 'totalFormulaBookmarks', threshold: 10, reward: 50  },
  { id: 'form_25', icon: '🗺️', name: 'Formula Master',    desc: 'Bookmarked 25 formulas — the formula king!',            category: 'special', rarity: 'epic',   stat: 'totalFormulaBookmarks', threshold: 25, reward: 150 },
  { id: 'form_50', icon: '📐', name: 'Formula Legend',     desc: 'Bookmarked 50 formulas — a complete formula encyclopedia!', category: 'special', rarity: 'legendary', stat: 'totalFormulaBookmarks', threshold: 50, reward: 400},

  // ── SOCIAL / REFERRAL ──────────────────────────────────────────────────────
  // 1, 3, 5, 10, 25, 50
  { id: 'ref_1',  icon: '🤝', name: 'Connector',           desc: 'Referred your first friend — sharing is caring!',       category: 'social', rarity: 'common',    stat: 'referrals', threshold: 1,  reward: 50   },
  { id: 'ref_3',  icon: '👫', name: 'Friend Bringer',      desc: 'Referred 3 friends — the group is growing!',           category: 'social', rarity: 'common',    stat: 'referrals', threshold: 3,  reward: 100  },
  { id: 'ref_5',  icon: '👥', name: 'Influencer',          desc: 'Referred 5 friends — you\'re an influencer now!',      category: 'social', rarity: 'rare',      stat: 'referrals', threshold: 5,  reward: 200  },
  { id: 'ref_10', icon: '🌐', name: 'Community Builder',   desc: 'Referred 10 friends — building a real community!',     category: 'social', rarity: 'epic',      stat: 'referrals', threshold: 10, reward: 500  },
  { id: 'ref_25', icon: '🦁', name: 'Ambassador',          desc: 'Referred 25 friends — a true StudyEarn ambassador!',   category: 'social', rarity: 'legendary', stat: 'referrals', threshold: 25, reward: 2000 },
  { id: 'ref_50', icon: '🌍', name: 'StudyEarn Evangelist', desc: 'Referred 50 friends — you\'ve changed 50 lives!',     category: 'social', rarity: 'legendary', stat: 'referrals', threshold: 50, reward: 5000 },

  // ── DAYS ACTIVE ────────────────────────────────────────────────────────────
  // 1, 7, 14, 30, 60, 100, 180, 365
  { id: 'days_1',   icon: '👣', name: 'First Day',          desc: 'Active on StudyEarn for 1 day — welcome aboard!',      category: 'special', rarity: 'common',    stat: 'totalDaysActive', threshold: 1,   reward: 10   },
  { id: 'days_7',   icon: '📅', name: 'Week Regular',       desc: 'Active on StudyEarn for 7 days — a solid week!',       category: 'special', rarity: 'common',    stat: 'totalDaysActive', threshold: 7,   reward: 50   },
  { id: 'days_14',  icon: '🗒️', name: 'Fortnight Scholar',  desc: 'Active for 14 days — two weeks in the books!',        category: 'special', rarity: 'rare',      stat: 'totalDaysActive', threshold: 14,  reward: 100  },
  { id: 'days_30',  icon: '🗓️', name: 'Monthly Regular',    desc: 'Active for 30 days — a whole month of learning!',     category: 'special', rarity: 'rare',      stat: 'totalDaysActive', threshold: 30,  reward: 200  },
  { id: 'days_60',  icon: '🏋️', name: 'Dedicated Scholar',  desc: 'Active for 60 days — dedication is your middle name.', category: 'special', rarity: 'epic',     stat: 'totalDaysActive', threshold: 60,  reward: 500  },
  { id: 'days_100', icon: '🏛️', name: '100 Day Hero',       desc: 'Active on StudyEarn for 100 days — a true hero!',     category: 'special', rarity: 'epic',      stat: 'totalDaysActive', threshold: 100, reward: 1000 },
  { id: 'days_180', icon: '🌗', name: 'Half Year Legend',   desc: 'Active for 180 days — half a year of knowledge!',     category: 'special', rarity: 'legendary', stat: 'totalDaysActive', threshold: 180, reward: 2500 },
  { id: 'days_365', icon: '🌍', name: 'StudyEarn Veteran',  desc: 'One full year on StudyEarn — a true veteran!',        category: 'special', rarity: 'legendary', stat: 'totalDaysActive', threshold: 365, reward: 5000 },

];

export const RARITY_STYLES = {
  common:    { border: 'border-slate-500/30',   bg: 'from-slate-500/10 to-slate-600/5',   badge: 'bg-slate-500/20 text-slate-300',    glow: '' },
  rare:      { border: 'border-blue-500/40',    bg: 'from-blue-500/10 to-cyan-500/5',     badge: 'bg-blue-500/20 text-blue-300',      glow: 'shadow-blue-500/10' },
  epic:      { border: 'border-purple-500/50',  bg: 'from-purple-500/10 to-pink-500/5',   badge: 'bg-purple-500/20 text-purple-300',  glow: 'shadow-purple-500/15' },
  legendary: { border: 'border-yellow-500/60',  bg: 'from-yellow-500/10 to-orange-500/5', badge: 'bg-yellow-500/20 text-yellow-300',  glow: 'shadow-yellow-500/20' },
};