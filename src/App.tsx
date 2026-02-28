// import { Login } from "./pages/Login";
// import { Signup } from "./pages/Signup";
// import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { LandingPage } from "./pages/LandingPage";
// import { Dashboard } from "./pages/Dashboard";
// import { AskAI } from "./pages/AskAI";
// import { PPTGenerator } from "./pages/PPTGenerator";
// import { PDFTools } from "./pages/PDFTools";
// import { Rewards } from "./pages/Rewards";
// import { Leaderboard } from "./pages/Leaderboard";
// import { Profile } from "./pages/Profile";
// import { DashboardLayout } from "./components/DashboardLayout";
// import { ProtectedRoute } from "./components/ProtectedRoute";
// import { LoadingScreen } from "./components/LoadingScreen";
// import { StreakCelebration } from "./components/StreakCelebration";
// import { AppContext } from "./context/AppContext";
// import {
//   getCurrentUser,
//   updateUserPoints,
//   useQuestion as useQuestionAPI,
//   logActivity as logActivityAPI,
//   getRecentActivity,
// } from "./utils/user-api";
// import { ReferFriends } from "./pages/ReferFriends";

// // ✅ WRAPPER to check location before showing celebration
// function AppContent() {
//   const location = useLocation();
//   const [points, setPoints] = useState(0);
//   const [questionsLeft, setQuestionsLeft] = useState(5);
//   const [recentActivity, setRecentActivity] = useState<any[]>([]);
//   const [streak, setStreak] = useState(0);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userId, setUserId] = useState("");
//   const [userName, setUserName] = useState("");
//   const [loading, setLoading] = useState(true);

//   const [showStreakCelebration, setShowStreakCelebration] = useState(false);
//   const [celebrationStreak, setCelebrationStreak] = useState(0);

//   useEffect(() => {
//     loadUserData();
//   }, []);

//   const loadUserData = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const user = await getCurrentUser();

//       if (user) {
//         setIsLoggedIn(true);
//         setUserId(user._id);
//         setUserName(user.name || "");
//         setPoints(user.points);
//         setQuestionsLeft(user.questionsLeft);
//         setStreak(user.streak || 0);

//         getRecentActivity().then((activityData) => {
//           if (activityData.success) {
//             setRecentActivity(activityData.activities);
//           }
//         });

//         // ✅ Check streak ONLY if logged in
//         checkStreak().catch((err) =>
//           console.error("Streak check failed:", err),
//         );
//       } else {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setIsLoggedIn(false);
//       }
//     } catch (error) {
//       console.error("Load user error:", error);
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       setIsLoggedIn(false);
//     } finally {
//       setTimeout(() => setLoading(false), 1000);
//     }
//   };

//   const checkStreak = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const res = await fetch(
//         "https://studyearn-backend.onrender.com/api/user/update-streak",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       if (!res.ok) return;

//       const data = await res.json();
//       if (data.success) {
//         setStreak(data.streak);

//         // ✅ ONLY show celebration if:
//         // 1. Streak increased
//         // 2. User is on /app route (dashboard area)
//         if (data.streakIncreased && location.pathname.startsWith("/app")) {
//           setCelebrationStreak(data.streak);
//           setTimeout(() => setShowStreakCelebration(true), 1500);
//         }
//       }
//     } catch (err) {
//       console.error("Streak check error:", err);
//     }
//   };

//   const addPoints = async (amount: number) => {
//     setPoints((prev) => prev + amount);
//     const result = await updateUserPoints(amount);
//     if (result.success) {
//       setPoints(result.points);
//     }
//   };

//   const useQuestion = async () => {
//     setQuestionsLeft((prev) => Math.max(0, prev - 1));
//     const result = await useQuestionAPI();
//     if (result.success) {
//       setQuestionsLeft(result.questionsLeft);
//     }
//   };

//   const logActivity = async (
//     action: string,
//     details: string,
//     pointsEarned: number,
//   ) => {
//     const newActivity = {
//       _id: Date.now().toString(),
//       action,
//       details,
//       pointsEarned,
//       timestamp: new Date().toISOString(),
//     };
//     setRecentActivity((prev) => [newActivity, ...prev].slice(0, 10));
//     await logActivityAPI(action, details, pointsEarned);
//   };

//   const resetProgress = () => {
//     setPoints(0);
//     setQuestionsLeft(5);
//     setRecentActivity([]);
//   };

//   // ✅ ONLY show celebration if on dashboard routes
//   const shouldShowCelebration =
//     showStreakCelebration && location.pathname.startsWith("/app");

//   return (
//     <>
//       <LoadingScreen show={loading} />

//       {/* ✅ Celebration ONLY in dashboard */}
//       {shouldShowCelebration && (
//         <StreakCelebration
//           streak={celebrationStreak}
//           show={true}
//           onClose={() => setShowStreakCelebration(false)}
//         />
//       )}

//       <AppContext.Provider
//         value={{
//           points,
//           streak,
//           questionsLeft,
//           isLoggedIn,
//           setIsLoggedIn,
//           addPoints,
//           useQuestion,
//           userId,
//           userName,
//           resetProgress,
//           recentActivity,
//           logActivity,
//           loading,
//         }}
//       >
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />

//           <Route
//             path="/app"
//             element={
//               <ProtectedRoute>
//                 <DashboardLayout />
//               </ProtectedRoute>
//             }
//           >
//             <Route index element={<Dashboard />} />
//             <Route path="ask" element={<AskAI />} />
//             <Route path="ppt" element={<PPTGenerator />} />
//             <Route path="pdf" element={<PDFTools />} />
//             <Route path="rewards" element={<Rewards />} />
//             <Route path="leaderboard" element={<Leaderboard />} />
//             <Route path="profile" element={<Profile />} />
//             <Route path="refer" element={<ReferFriends />} />
//           </Route>
//         </Routes>
//       </AppContext.Provider>
//     </>
//   );
// }

// export function App() {
//   return (
//     <HashRouter>
//       <AppContent />
//     </HashRouter>
//   );
// }

// claude ai //

import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { AskAI } from "./pages/AskAI";
import { PPTGenerator } from "./pages/PPTGenerator";
import { PDFTools } from "./pages/PDFTools";
import { Rewards } from "./pages/Rewards";
import { Leaderboard } from "./pages/Leaderboard";
import { Profile } from "./pages/Profile";
import { DashboardLayout } from "./components/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoadingScreen } from "./components/LoadingScreen";
import { StreakCelebration } from "./components/StreakCelebration";
import { AppContext, UserStats } from "./context/AppContext";
import {
  getCurrentUser,
  updateUserPoints,
  useQuestion as useQuestionAPI,
  logActivity as logActivityAPI,
  getRecentActivity,
  getAchievements,
  unlockAchievement,
} from "./utils/user-api";
import { ReferFriends } from "./pages/ReferFriends";
import { ACHIEVEMENTS } from "./data/achievements";
import { CursorSpotlight } from "./components/CursorSpotlight";

// ── Achievement Toast Notification ──────────────────────────────────────────
function AchievementToast({ achievement, onClose }: { achievement: any; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed top-20 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl border border-yellow-500/40 max-w-xs"
      style={{
        background: "linear-gradient(135deg, rgba(10,17,40,0.97) 0%, rgba(20,10,40,0.97) 100%)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(234,179,8,0.15)",
        backdropFilter: "blur(20px)",
        animation: "slideInRight 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px) scale(0.8); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
      <div className="text-3xl">{achievement.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-yellow-400 uppercase tracking-widest mb-0.5">🏆 Achievement Unlocked!</p>
        <p className="text-sm font-bold text-white truncate">{achievement.name}</p>
        <p className="text-[11px] text-slate-400 truncate">{achievement.desc}</p>
        {achievement.reward > 0 && (
          <p className="text-[11px] text-green-400 font-semibold mt-0.5">+{achievement.reward} bonus pts</p>
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const [points, setPoints] = useState(0);
  const [questionsLeft, setQuestionsLeft] = useState(5);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [celebrationStreak, setCelebrationStreak] = useState(0);

  // ✅ Achievements state
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalQuestionsAsked: 0,
    totalPPTsGenerated: 0,
    totalPDFsConverted: 0,
  });
  const [toastAchievement, setToastAchievement] = useState<any>(null);

  // Use refs to always have latest values in callbacks
  const pointsRef = useRef(points);
  const streakRef = useRef(streak);
  const userStatsRef = useRef(userStats);
  const unlockedRef = useRef(unlockedAchievements);

  useEffect(() => { pointsRef.current = points; }, [points]);
  useEffect(() => { streakRef.current = streak; }, [streak]);
  useEffect(() => { userStatsRef.current = userStats; }, [userStats]);
  useEffect(() => { unlockedRef.current = unlockedAchievements; }, [unlockedAchievements]);

  useEffect(() => { loadUserData(); }, []);

  const loadUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    try {
      const user = await getCurrentUser();
      if (user) {
        setIsLoggedIn(true);
        setUserId(user._id);
        setUserName(user.name || "");
        setPoints(user.points);
        setQuestionsLeft(user.questionsLeft);
        setStreak(user.streak || 0);

        getRecentActivity().then((d) => { if (d.success) setRecentActivity(d.activities); });
        checkStreak().catch(console.error);

        // Load achievements from server, then immediately check for any newly eligible ones
        getAchievements().then((d) => {
          if (d.success) {
            const unlocked = d.unlockedAchievements || [];
            const stats = {
              totalQuestionsAsked: d.totalQuestionsAsked || 0,
              totalPPTsGenerated:  d.totalPPTsGenerated  || 0,
              totalPDFsConverted:  d.totalPDFsConverted  || 0,
            };
            setUnlockedAchievements(unlocked);
            unlockedRef.current = unlocked;
            setUserStats(stats);
            userStatsRef.current = stats;

            // 🔑 KEY FIX: check right now with fresh server data + current points
            // Use a small delay so pointsRef is populated first
            setTimeout(() => {
              checkAndUnlockAchievements({
                ...stats,
                points: user.points,
                streak: user.streak || 0,
              });
            }, 500);
          }
        });
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Load user error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  // ✅ Check & unlock achievements — bulletproof, checks ALL eligible at once
  const checkAndUnlockAchievements = useCallback(async (
    override?: Partial<UserStats & { points: number; streak: number }>
  ) => {
    const currentPoints = override?.points ?? pointsRef.current;
    const currentStreak = override?.streak ?? streakRef.current;
    const currentStats  = { ...userStatsRef.current, ...override };
    const currentUnlocked = [...unlockedRef.current];

    const statMap: Record<string, number> = {
      totalQuestionsAsked: currentStats.totalQuestionsAsked || 0,
      totalPPTsGenerated:  currentStats.totalPPTsGenerated  || 0,
      totalPDFsConverted:  currentStats.totalPDFsConverted  || 0,
      streak: currentStreak || 0,
      points: currentPoints || 0,
    };

    // Collect all newly eligible achievements (not yet unlocked)
    const toUnlock = ACHIEVEMENTS.filter(ach => {
      if (currentUnlocked.includes(ach.id)) return false;
      const val = statMap[ach.stat] ?? 0;
      return val >= ach.threshold;
    });

    if (toUnlock.length === 0) return;

    // Unlock all of them sequentially
    let lastToast = null;
    let bonusPoints = 0;

    for (const ach of toUnlock) {
      try {
        const result = await unlockAchievement(ach.id);
        if (result.success) {
          // Update ref immediately so next iteration sees it
          unlockedRef.current = result.unlockedAchievements;
          setUnlockedAchievements(result.unlockedAchievements);
          lastToast = ach;
          if (ach.reward > 0) bonusPoints += ach.reward;
        }
      } catch (e) {
        console.error("unlock error", ach.id, e);
      }
    }

    // Show toast for the last (most impressive) unlocked achievement
    if (lastToast) setToastAchievement(lastToast);

    // Award all bonus points in one shot
    if (bonusPoints > 0) {
      setPoints(prev => prev + bonusPoints);
      updateUserPoints(bonusPoints);
    }
  }, []);

  const checkStreak = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("https://studyearn-backend.onrender.com/api/user/update-streak", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setStreak(data.streak);
        if (data.streakIncreased && location.pathname.startsWith("/app")) {
          setCelebrationStreak(data.streak);
          setTimeout(() => setShowStreakCelebration(true), 1500);
        }
      }
    } catch (err) {
      console.error("Streak check error:", err);
    }
  };

  const addPoints = async (amount: number) => {
    const newPoints = pointsRef.current + amount;
    setPoints(newPoints);
    const result = await updateUserPoints(amount);
    if (result.success) {
      setPoints(result.points);
      // Check point-based achievements
      checkAndUnlockAchievements({ points: result.points });
    }
  };

  const useQuestion = async () => {
    setQuestionsLeft((prev) => Math.max(0, prev - 1));
    const result = await useQuestionAPI();
    if (result.success) setQuestionsLeft(result.questionsLeft);
  };

  const logActivity = async (action: string, details: string, pointsEarned: number) => {
    const newActivity = {
      _id: Date.now().toString(),
      action,
      details,
      pointsEarned,
      timestamp: new Date().toISOString(),
    };
    setRecentActivity((prev) => [newActivity, ...prev].slice(0, 10));
    await logActivityAPI(action, details, pointsEarned);
  };

  const resetProgress = () => {
    setPoints(0);
    setQuestionsLeft(5);
    setRecentActivity([]);
  };

  const shouldShowCelebration = showStreakCelebration && location.pathname.startsWith("/app");

  return (
    <>
      <CursorSpotlight />
      <LoadingScreen show={loading} />

      {shouldShowCelebration && (
        <StreakCelebration
          streak={celebrationStreak}
          show={true}
          onClose={() => setShowStreakCelebration(false)}
        />
      )}

      {/* ✅ Achievement Toast */}
      {toastAchievement && (
        <AchievementToast
          achievement={toastAchievement}
          onClose={() => setToastAchievement(null)}
        />
      )}

      <AppContext.Provider
        value={{
          points,
          streak,
          questionsLeft,
          isLoggedIn,
          setIsLoggedIn,
          addPoints,
          useQuestion,
          userId,
          userName,
          resetProgress,
          recentActivity,
          logActivity,
          loading,
          unlockedAchievements,
          userStats,
          checkAndUnlockAchievements,
          setUnlockedAchievements,
          setUserStats,
        }}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="ask" element={<AskAI />} />
            <Route path="ppt" element={<PPTGenerator />} />
            <Route path="pdf" element={<PDFTools />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="refer" element={<ReferFriends />} />
          </Route>
        </Routes>
      </AppContext.Provider>
    </>
  );
}

export function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}