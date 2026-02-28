// import { createContext, useContext } from 'react';

// interface AppContextType {
//   points: number;
//   streak: number;
//   questionsLeft: number;
//   isLoggedIn: boolean;
//   userId: string;
//   loading: boolean; // ✅ ADD THIS
//   setIsLoggedIn: (v: boolean) => void;
//   addPoints: (amount: number) => void;
//   useQuestion: () => void;
//   resetProgress: () => void;
//   recentActivity: any[];
//   logActivity: (action: string, details: string, pointsEarned: number) => void;
//   userName: string;
// }

// export const AppContext = createContext<AppContextType>({
//   points: 0,
//   streak: 0,
//   questionsLeft: 5,
//   isLoggedIn: false,
//   userId: "",
//   loading: true, // ✅ ADD THIS
//   setIsLoggedIn: () => {},
//   addPoints: () => {},
//   useQuestion: () => {},
//   resetProgress: () => {},
//   recentActivity: [],
//   logActivity: () => {},
//   userName: '',
// });

// export const useApp = () => useContext(AppContext);

// claude ai //

import { createContext, useContext } from 'react';

export interface UserStats {
  totalQuestionsAsked: number;
  totalPPTsGenerated: number;
  totalPDFsConverted: number;
}

export interface AppContextType {
  points: number;
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
}

export const AppContext = createContext<AppContextType>({
  points: 0,
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
});

export const useApp = () => useContext(AppContext);