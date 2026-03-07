import { createContext, useContext } from 'react';

export interface UserStats {
  totalQuestionsAsked: number;
  totalPPTsGenerated: number;
  totalPDFsConverted: number;
}

export interface AppContextType {
  points: number;
  totalXP: number;   // lifetime XP — used for level, never decreases
  isPremium: boolean;
  premiumExpiresAt: string | null;
  streak: number;
  questionsLeft: number;
  isLoggedIn: boolean;
  userId: string;
  loading: boolean;
  setIsLoggedIn: (v: boolean) => void;
  addPoints: (amount: number) => void;
  useQuestion: () => void;
  resetProgress: () => void;
  recentActivity: any[];
  logActivity: (action: string, details: string, pointsEarned: number) => void;
  userName: string;
  // ✅ Achievements
  unlockedAchievements: string[];
  userStats: UserStats;
  checkAndUnlockAchievements: (overrideStats?: Partial<UserStats & { points: number; streak: number }>) => void;
  setUnlockedAchievements: (ids: string[]) => void;
  setUserStats: (stats: UserStats) => void;
  setQuestionsLeft: (n: number) => void;
}

export const AppContext = createContext<AppContextType>({
  points: 0,
  totalXP: 0,
  isPremium: false,
  premiumExpiresAt: null,
  streak: 0,
  questionsLeft: 5,
  isLoggedIn: false,
  userId: '',
  loading: true,
  setIsLoggedIn: () => {},
  addPoints: () => {},
  useQuestion: () => {},
  resetProgress: () => {},
  recentActivity: [],
  logActivity: () => {},
  userName: '',
  unlockedAchievements: [],
  userStats: { totalQuestionsAsked: 0, totalPPTsGenerated: 0, totalPDFsConverted: 0 },
  checkAndUnlockAchievements: () => {},
  setUnlockedAchievements: () => {},
  setUserStats: () => {},
  setQuestionsLeft: () => {},
});

export const useApp = () => useContext(AppContext);