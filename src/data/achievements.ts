// ✅ SINGLE SOURCE OF TRUTH for all achievements
// condition is checked on frontend using live user stats

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  desc: string;
  category: 'questions' | 'ppt' | 'pdf' | 'streak' | 'points' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  // What stat & threshold unlocks this
  stat: 'totalQuestionsAsked' | 'totalPPTsGenerated' | 'totalPDFsConverted' | 'streak' | 'points' | 'referrals';
  threshold: number;
  reward: number; // bonus points on unlock
}

export const ACHIEVEMENTS: Achievement[] = [
  // ── QUESTIONS ─────────────────────────────────────────────────────────
  {
    id: 'first_question',
    icon: '🎓',
    name: 'First Question',
    desc: 'Asked your very first question',
    category: 'questions',
    rarity: 'common',
    stat: 'totalQuestionsAsked',
    threshold: 1,
    reward: 20,
  },
  {
    id: 'curious_mind',
    icon: '🧠',
    name: 'Curious Mind',
    desc: 'Asked 10 questions',
    category: 'questions',
    rarity: 'common',
    stat: 'totalQuestionsAsked',
    threshold: 10,
    reward: 30,
  },
  {
    id: 'knowledge_seeker',
    icon: '📚',
    name: 'Knowledge Seeker',
    desc: 'Asked 50 questions',
    category: 'questions',
    rarity: 'rare',
    stat: 'totalQuestionsAsked',
    threshold: 50,
    reward: 75,
  },
  {
    id: 'question_master',
    icon: '🔬',
    name: 'Question Master',
    desc: 'Asked 100 questions',
    category: 'questions',
    rarity: 'epic',
    stat: 'totalQuestionsAsked',
    threshold: 100,
    reward: 150,
  },

  // ── PPT ───────────────────────────────────────────────────────────────
  {
    id: 'first_ppt',
    icon: '📊',
    name: 'Slide Maker',
    desc: 'Created your first presentation',
    category: 'ppt',
    rarity: 'common',
    stat: 'totalPPTsGenerated',
    threshold: 1,
    reward: 25,
  },
  {
    id: 'ppt_pro',
    icon: '🎤',
    name: 'PPT Pro',
    desc: 'Created 5 presentations',
    category: 'ppt',
    rarity: 'rare',
    stat: 'totalPPTsGenerated',
    threshold: 5,
    reward: 60,
  },
  {
    id: 'ppt_master',
    icon: '🏆',
    name: 'PPT Master',
    desc: 'Created 20 presentations',
    category: 'ppt',
    rarity: 'epic',
    stat: 'totalPPTsGenerated',
    threshold: 20,
    reward: 200,
  },

  // ── PDF ───────────────────────────────────────────────────────────────
  {
    id: 'first_pdf',
    icon: '📄',
    name: 'PDF Wizard',
    desc: 'Converted your first document',
    category: 'pdf',
    rarity: 'common',
    stat: 'totalPDFsConverted',
    threshold: 1,
    reward: 15,
  },
  {
    id: 'pdf_expert',
    icon: '🗂️',
    name: 'PDF Expert',
    desc: 'Converted 10 documents',
    category: 'pdf',
    rarity: 'rare',
    stat: 'totalPDFsConverted',
    threshold: 10,
    reward: 50,
  },

  // ── STREAK ───────────────────────────────────────────────────────────
  {
    id: 'streak_3',
    icon: '🔥',
    name: '3 Day Streak',
    desc: 'Maintained a 3 day streak',
    category: 'streak',
    rarity: 'common',
    stat: 'streak',
    threshold: 3,
    reward: 30,
  },
  {
    id: 'streak_7',
    icon: '⚡',
    name: 'Week Warrior',
    desc: 'Maintained a 7 day streak',
    category: 'streak',
    rarity: 'rare',
    stat: 'streak',
    threshold: 7,
    reward: 70,
  },
  {
    id: 'streak_30',
    icon: '💫',
    name: 'Monthly Legend',
    desc: 'Maintained a 30 day streak',
    category: 'streak',
    rarity: 'legendary',
    stat: 'streak',
    threshold: 30,
    reward: 500,
  },

  // ── POINTS ───────────────────────────────────────────────────────────
  {
    id: 'points_500',
    icon: '💰',
    name: 'Point Collector',
    desc: 'Earned 500 total points',
    category: 'points',
    rarity: 'common',
    stat: 'points',
    threshold: 500,
    reward: 0,
  },
  {
    id: 'points_1000',
    icon: '💎',
    name: 'Diamond Student',
    desc: 'Earned 1,000 total points',
    category: 'points',
    rarity: 'rare',
    stat: 'points',
    threshold: 1000,
    reward: 100,
  },
  {
    id: 'points_5000',
    icon: '👑',
    name: 'Scholar King',
    desc: 'Earned 5,000 total points',
    category: 'points',
    rarity: 'legendary',
    stat: 'points',
    threshold: 5000,
    reward: 500,
  },
];

export const RARITY_STYLES = {
  common:    { border: 'border-slate-500/30',   bg: 'from-slate-500/10 to-slate-600/5',   badge: 'bg-slate-500/20 text-slate-300',    glow: '' },
  rare:      { border: 'border-blue-500/40',    bg: 'from-blue-500/10 to-cyan-500/5',     badge: 'bg-blue-500/20 text-blue-300',      glow: 'shadow-blue-500/10' },
  epic:      { border: 'border-purple-500/50',  bg: 'from-purple-500/10 to-pink-500/5',   badge: 'bg-purple-500/20 text-purple-300',  glow: 'shadow-purple-500/15' },
  legendary: { border: 'border-yellow-500/60',  bg: 'from-yellow-500/10 to-orange-500/5', badge: 'bg-yellow-500/20 text-yellow-300',  glow: 'shadow-yellow-500/20' },
};