import { createContext, useContext } from 'react';

interface AppContextType {
  points: number;
  streak: number;
  questionsLeft: number;
  isLoggedIn: boolean;
  userId: string;
  loading: boolean; // ✅ ADD THIS
  setIsLoggedIn: (v: boolean) => void;
  addPoints: (amount: number) => void;
  useQuestion: () => void;
  resetProgress: () => void;
  recentActivity: any[];
  logActivity: (action: string, details: string, pointsEarned: number) => void;
  userName: string;
}

export const AppContext = createContext<AppContextType>({
  points: 0,
  streak: 0,
  questionsLeft: 5,
  isLoggedIn: false,
  userId: "",
  loading: true, // ✅ ADD THIS
  setIsLoggedIn: () => {},
  addPoints: () => {},
  useQuestion: () => {},
  resetProgress: () => {},
  recentActivity: [],
  logActivity: () => {},
  userName: '',
});

export const useApp = () => useContext(AppContext);