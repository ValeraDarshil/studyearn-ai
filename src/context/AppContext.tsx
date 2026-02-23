// import { createContext, useContext } from 'react';

// interface AppContextType {
//   points: number;
//   streak: number;
//   questionsLeft: number;
//   isLoggedIn: boolean;
//   userId: string;
//   setIsLoggedIn: (v: boolean) => void;
//   addPoints: (amount: number) => void;
//   useQuestion: () => void;
// }

// export const AppContext = createContext<AppContextType>({
//   points: 0,
//   streak: 0,
//   questionsLeft: 5,
//   isLoggedIn: false,
//   userId: "",
//   setIsLoggedIn: () => {},
//   addPoints: () => {},
//   useQuestion: () => {},
// });

// export const useApp = () => useContext(AppContext);


// ---------- calude ai ------------ //

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
});

export const useApp = () => useContext(AppContext);