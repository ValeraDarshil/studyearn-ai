// import { Login } from "./pages/Login";
// import { Signup } from "./pages/Signup";
// import { ForgotPassword } from "./pages/ForgotPassword";
// import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
// import { useState, useEffect, useRef, useCallback } from "react";
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
// import { AppContext, UserStats } from "./context/AppContext";
// import {
//   getCurrentUser,
//   useQuestion as useQuestionAPI,
//   logActivity as logActivityAPI,
//   getRecentActivity,
//   getAchievements,
//   unlockAchievement,
// } from "./utils/user-api";
// import { ReferFriends } from "./pages/ReferFriends";
// import { QuizGenerator } from "./pages/QuizGenerator";
// import { StudyPlanner } from "./pages/StudyPlanner";
// import { DailyChallenge } from "./pages/DailyChallenge";
// import { Analytics } from "./pages/Analytics";
// import { FormulaSheet } from "./pages/FormulaSheet";
// import { StudyTools } from "./pages/StudyTools";
// import { CollabNotes } from "./pages/CollabNotes";
// import { ACHIEVEMENTS } from "./data/achievements";
// import { CursorSpotlight } from "./components/CursorSpotlight";

// // ── Achievement Toast Notification ───────────────────────────
// function AchievementToast({ achievement, onClose }: { achievement: any; onClose: () => void }) {
//   useEffect(() => {
//     const t = setTimeout(onClose, 4000);
//     return () => clearTimeout(t);
//   }, [onClose]);

//   return (
//     <div
//       className="fixed top-20 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl border border-yellow-500/40 max-w-xs"
//       style={{
//         background: "linear-gradient(135deg, rgba(10,17,40,0.97) 0%, rgba(20,10,40,0.97) 100%)",
//         boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(234,179,8,0.15)",
//         backdropFilter: "blur(20px)",
//         animation: "slideInRight 0.4s cubic-bezier(0.34,1.56,0.64,1)",
//       }}
//     >
//       <style>{`
//         @keyframes slideInRight {
//           from { opacity: 0; transform: translateX(60px) scale(0.8); }
//           to   { opacity: 1; transform: translateX(0) scale(1); }
//         }
//       `}</style>
//       <div className="text-3xl">{achievement.icon}</div>
//       <div className="flex-1 min-w-0">
//         <p className="text-[11px] font-semibold text-yellow-400 uppercase tracking-widest mb-0.5">🏆 Achievement Unlocked!</p>
//         <p className="text-sm font-bold text-white truncate">{achievement.name}</p>
//         <p className="text-[11px] text-slate-400 truncate">{achievement.desc}</p>
//         {achievement.reward > 0 && (
//           <p className="text-[11px] text-green-400 font-semibold mt-0.5">+{achievement.reward} bonus pts</p>
//         )}
//       </div>
//     </div>
//   );
// }

// function AppContent() {
//   const location = useLocation();
//   const [points, setPoints] = useState(0);
//   const [questionsLeft, setQuestionsLeft] = useState(15);
//   const [recentActivity, setRecentActivity] = useState<any[]>([]);
//   const [streak, setStreak] = useState(0);
//   const [totalXP, setTotalXP] = useState(0); // Never decreases — used for level
//   const [isPremium, setIsPremium] = useState(false);
//   const [premiumExpiresAt, setPremiumExpiresAt] = useState<string | null>(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userId, setUserId] = useState("");
//   const [userName, setUserName] = useState("");
//   const [loading, setLoading] = useState(true);

//   const [showStreakCelebration, setShowStreakCelebration] = useState(false);
//   const [celebrationStreak, setCelebrationStreak] = useState(0);

//   // Achievements state
//   const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
//   const [userStats, setUserStats] = useState<UserStats>({
//     totalQuestionsAsked: 0,
//     totalPPTsGenerated: 0,
//     totalPDFsConverted: 0,
//   });

//   // Toast queue — ek ek karke dikhao, sabhi achievements miss nahi hongi
//   const [toastQueue, setToastQueue] = useState<any[]>([]);
//   const [toastAchievement, setToastAchievement] = useState<any>(null);

//   // Refs to always have latest values in callbacks
//   const pointsRef    = useRef(points);
//   const streakRef    = useRef(streak);
//   const userStatsRef = useRef(userStats);
//   const unlockedRef  = useRef(unlockedAchievements);

//   useEffect(() => { pointsRef.current    = points;               }, [points]);
//   useEffect(() => { streakRef.current    = streak;               }, [streak]);
//   useEffect(() => { userStatsRef.current = userStats;            }, [userStats]);
//   useEffect(() => { unlockedRef.current  = unlockedAchievements; }, [unlockedAchievements]);

//   // Toast queue processor — jab current toast close ho toh agla dikhao
//   useEffect(() => {
//     if (!toastAchievement && toastQueue.length > 0) {
//       setToastAchievement(toastQueue[0]);
//       setToastQueue(prev => prev.slice(1));
//     }
//   }, [toastAchievement, toastQueue]);

//   useEffect(() => { loadUserData(); }, []);

//   const loadUserData = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) { setLoading(false); return; }

//     try {
//       const user = await getCurrentUser();
//       if (user) {
//         setIsLoggedIn(true);
//         setUserId(user._id);
//         setUserName(user.name || "");
//         setPoints(user.points);
//         setTotalXP((user as any).totalXP || user.points);

//         // Premium status — check if active
//         const premExpiry = (user as any).premiumExpiresAt;
//         const premActive = (user as any).isPremium === true && premExpiry && new Date(premExpiry) > new Date();
//         setIsPremium(!!premActive);
//         setPremiumExpiresAt(premExpiry || null);
//         setQuestionsLeft(user.questionsLeft);
//         setStreak(user.streak || 0);

//         getRecentActivity().then((d) => { if (d.success) setRecentActivity(d.activities); });

//         // ── Streak Celebration — 3 layer guarantee ─────────────────
//         // Layer 1: sessionStorage se (login page ne store kiya tha — same device, same browser)
//         const streakCelebration = sessionStorage.getItem("streakCelebration");
//         const loginBonus = sessionStorage.getItem("loginBonus");
//         if (streakCelebration) {
//           const info = JSON.parse(streakCelebration);
//           setCelebrationStreak(info.currentStreak);
//           setTimeout(() => setShowStreakCelebration(true), 1500);
//           sessionStorage.removeItem("streakCelebration");
//         }
//         if (loginBonus) {
//           sessionStorage.removeItem("loginBonus");
//         }

//         // Layer 2: /me response mein streakInfo — works on ANY device/browser
//         // Server ne /me pe hi streak update kar diya aur response mein bheja
//         const streakInfoFromMe = (user as any)._streakInfo;
//         if (!streakCelebration && streakInfoFromMe?.streakIncreased) {
//           setCelebrationStreak(streakInfoFromMe.currentStreak);
//           // Points bhi update karo (server ne bonus already diya)
//           setPoints(user.points);
//           setTotalXP((user as any).totalXP || user.points);
//           setTimeout(() => setShowStreakCelebration(true), 1500);
//         }

//         // Layer 3: /update-streak endpoint — safety net (only if layers 1+2 missed)
//         if (!streakCelebration && !streakInfoFromMe?.streakIncreased) {
//           checkStreak().catch(console.error);
//         }

//         // Load achievements from server, then check for newly eligible ones
//         getAchievements().then((d) => {
//           if (d.success) {
//             const unlocked = d.unlockedAchievements || [];
//             const stats = {
//               totalQuestionsAsked: d.totalQuestionsAsked || 0,
//               totalPPTsGenerated:  d.totalPPTsGenerated  || 0,
//               totalPDFsConverted:  d.totalPDFsConverted  || 0,
//             };
//             setUnlockedAchievements(unlocked);
//             unlockedRef.current = unlocked;
//             setUserStats(stats);
//             userStatsRef.current = stats;

//             // Check with fresh server data + current points
//             setTimeout(() => {
//               checkAndUnlockAchievements({
//                 ...stats,
//                 points: user.points,
//                 streak: user.streak || 0,
//               });
//             }, 500);
//           }
//         });
//       } else {
//         localStorage.removeItem("token");
//         setIsLoggedIn(false);
//       }
//     } catch (error) {
//       console.error("Load user error:", error);
//       localStorage.removeItem("token");
//       setIsLoggedIn(false);
//     } finally {
//       setTimeout(() => setLoading(false), 1000);
//     }
//   };

//   // ── Check & unlock achievements ───────────────────────────
//   // Server validates threshold — sirf eligible achievements unlock hongi
//   const checkAndUnlockAchievements = useCallback(async (
//     override?: Partial<UserStats & { points: number; streak: number }>
//   ) => {
//     const currentPoints   = override?.points ?? pointsRef.current;
//     const currentStreak   = override?.streak ?? streakRef.current;
//     const currentStats    = { ...userStatsRef.current, ...override };
//     const currentUnlocked = [...unlockedRef.current];

//     const statMap: Record<string, number> = {
//       totalQuestionsAsked: currentStats.totalQuestionsAsked || 0,
//       totalPPTsGenerated:  currentStats.totalPPTsGenerated  || 0,
//       totalPDFsConverted:  currentStats.totalPDFsConverted  || 0,
//       streak: currentStreak || 0,
//       points: currentPoints || 0,
//     };

//     // Collect all newly eligible achievements
//     const toUnlock = ACHIEVEMENTS.filter(ach => {
//       if (currentUnlocked.includes(ach.id)) return false;
//       const val = statMap[ach.stat] ?? 0;
//       return val >= ach.threshold;
//     });

//     if (toUnlock.length === 0) return;

//     const newlyUnlocked: any[] = [];

//     for (const ach of toUnlock) {
//       try {
//         const result = await unlockAchievement(ach.id);
//         if (result.success) {
//           unlockedRef.current = result.unlockedAchievements;
//           setUnlockedAchievements(result.unlockedAchievements);
//           newlyUnlocked.push(ach);

//           // Server already awards reward points — update UI to reflect
//           if (result.rewardPoints > 0) {
//             setPoints(prev => prev + result.rewardPoints);
//             setTotalXP(prev => prev + result.rewardPoints);
//           }
//         }
//       } catch (e) {
//         console.error("unlock error", ach.id, e);
//       }
//     }

//     // Toast queue — sabhi achievements ek ek karke dikhao (4s gap)
//     if (newlyUnlocked.length > 0) {
//       setToastQueue(prev => [...prev, ...newlyUnlocked]);
//     }
//   }, []);

//   const checkStreak = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const API_URL = import.meta.env.VITE_API_URL;
//       const res = await fetch(`${API_URL}/api/user/update-streak`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) return;
//       const data = await res.json();
//       if (data.success) {
//         setStreak(data.streak);
//         // ✅ Agar streak increase hua — kisi bhi device/browser pe animation dikhaao
//         // Yeh ensures karta hai ki agar session storage miss ho toh bhi kaam kare
//         if (data.streakIncreased) {
//           setCelebrationStreak(data.streak);
//           setTimeout(() => setShowStreakCelebration(true), 1500);
//         }
//       }
//     } catch (err) {
//       console.error("Streak check error:", err);
//     }
//   };

//   const addPoints = async (amount: number) => {
//     // Update UI immediately
//     const newPoints = pointsRef.current + amount;
//     setPoints(newPoints);
//     setTotalXP(prev => prev + amount); // XP never decreases
//     // Server handles actual DB update in /api/ai/ask — no extra call needed
//     checkAndUnlockAchievements({ points: newPoints });
//   };

//   const useQuestion = () => {
//     // Only update UI — server handles actual deduction in /api/ai/ask
//     setQuestionsLeft((prev) => Math.max(0, prev - 1));
//   };

//   const logActivity = async (action: string, details: string, pointsEarned: number) => {
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

//   // ── Refresh quota only (lightweight — no full reload) ──────
//   const refreshQuota = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) return;
//     try {
//       const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/quota`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success && data.questionsLeft !== undefined) {
//         setQuestionsLeft(data.questionsLeft);
//       }
//     } catch {}
//   };

//   const resetProgress = () => {
//     setPoints(0);
//     setQuestionsLeft(5);
//     setRecentActivity([]);
//   };

//   const shouldShowCelebration = showStreakCelebration && location.pathname.startsWith("/app");

//   return (
//     <>
//       <CursorSpotlight />
//       <LoadingScreen show={loading} />

//       {shouldShowCelebration && (
//         <StreakCelebration
//           streak={celebrationStreak}
//           show={true}
//           onClose={() => setShowStreakCelebration(false)}
//         />
//       )}

//       {/* Achievement Toast — queue se ek ek karke aata hai */}
//       {toastAchievement && (
//         <AchievementToast
//           achievement={toastAchievement}
//           onClose={() => setToastAchievement(null)}
//         />
//       )}

//       <AppContext.Provider
//         value={{
//           points,
//           totalXP,
//           isPremium,
//           premiumExpiresAt,
//           streak,
//           questionsLeft,
//           setQuestionsLeft,
//           refreshQuota,
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
//           unlockedAchievements,
//           userStats,
//           checkAndUnlockAchievements,
//           setUnlockedAchievements,
//           setUserStats,
//         }}
//       >
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />

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
//             <Route path="quiz" element={<QuizGenerator />} />
//             <Route path="planner" element={<StudyPlanner />} />
//             <Route path="challenge" element={<DailyChallenge />} />
//             <Route path="analytics" element={<Analytics />} />
//             <Route path="formulas" element={<FormulaSheet />} />
//             <Route path="study-tools" element={<StudyTools />} />
//             <Route path="notes" element={<CollabNotes />} />
//             <Route path="notes/shared/:code" element={<CollabNotes />} />
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





import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ForgotPassword } from "./pages/ForgotPassword";
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
  useQuestion as useQuestionAPI,
  logActivity as logActivityAPI,
  getRecentActivity,
  getAchievements,
  unlockAchievement,
} from "./utils/user-api";
import { ReferFriends } from "./pages/ReferFriends";
import { QuizGenerator } from "./pages/QuizGenerator";
import { StudyPlanner } from "./pages/StudyPlanner";
import { DailyChallenge } from "./pages/DailyChallenge";
import { Analytics } from "./pages/Analytics";
import { FormulaSheet } from "./pages/FormulaSheet";
import { StudyTools } from "./pages/StudyTools";
import { CollabNotes } from "./pages/CollabNotes";
import { ACHIEVEMENTS } from "./data/achievements";
import { CursorSpotlight } from "./components/CursorSpotlight";

// ── CodeLearn Pages ───────────────────────────────────────────
import CodeLearnHome from "./pages/codelearn/CodeLearnHome";
import CoursePage from "./pages/codelearn/CoursePage";
import CertificatePage from "./pages/codelearn/CertificatePage";

// ── Achievement Toast Notification ───────────────────────────
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
  const [questionsLeft, setQuestionsLeft] = useState(15);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0); // Never decreases — used for level
  const [isPremium, setIsPremium] = useState(false);
  const [premiumExpiresAt, setPremiumExpiresAt] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [celebrationStreak, setCelebrationStreak] = useState(0);

  // Achievements state
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalQuestionsAsked: 0,
    totalPPTsGenerated: 0,
    totalPDFsConverted: 0,
  });

  // Toast queue — ek ek karke dikhao, sabhi achievements miss nahi hongi
  const [toastQueue, setToastQueue] = useState<any[]>([]);
  const [toastAchievement, setToastAchievement] = useState<any>(null);

  // Refs to always have latest values in callbacks
  const pointsRef    = useRef(points);
  const streakRef    = useRef(streak);
  const userStatsRef = useRef(userStats);
  const unlockedRef  = useRef(unlockedAchievements);

  useEffect(() => { pointsRef.current    = points;               }, [points]);
  useEffect(() => { streakRef.current    = streak;               }, [streak]);
  useEffect(() => { userStatsRef.current = userStats;            }, [userStats]);
  useEffect(() => { unlockedRef.current  = unlockedAchievements; }, [unlockedAchievements]);

  // Toast queue processor — jab current toast close ho toh agla dikhao
  useEffect(() => {
    if (!toastAchievement && toastQueue.length > 0) {
      setToastAchievement(toastQueue[0]);
      setToastQueue(prev => prev.slice(1));
    }
  }, [toastAchievement, toastQueue]);

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
        setTotalXP((user as any).totalXP || user.points);

        // Premium status — check if active
        const premExpiry = (user as any).premiumExpiresAt;
        const premActive = (user as any).isPremium === true && premExpiry && new Date(premExpiry) > new Date();
        setIsPremium(!!premActive);
        setPremiumExpiresAt(premExpiry || null);
        setQuestionsLeft(user.questionsLeft);
        setStreak(user.streak || 0);

        getRecentActivity().then((d) => { if (d.success) setRecentActivity(d.activities); });

        // ── Streak Celebration — 3 layer guarantee ─────────────────
        const streakCelebration = sessionStorage.getItem("streakCelebration");
        const loginBonus = sessionStorage.getItem("loginBonus");
        if (streakCelebration) {
          const info = JSON.parse(streakCelebration);
          setCelebrationStreak(info.currentStreak);
          setTimeout(() => setShowStreakCelebration(true), 1500);
          sessionStorage.removeItem("streakCelebration");
        }
        if (loginBonus) {
          sessionStorage.removeItem("loginBonus");
        }

        const streakInfoFromMe = (user as any)._streakInfo;
        if (!streakCelebration && streakInfoFromMe?.streakIncreased) {
          setCelebrationStreak(streakInfoFromMe.currentStreak);
          setPoints(user.points);
          setTotalXP((user as any).totalXP || user.points);
          setTimeout(() => setShowStreakCelebration(true), 1500);
        }

        if (!streakCelebration && !streakInfoFromMe?.streakIncreased) {
          checkStreak().catch(console.error);
        }

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
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Load user error:", error);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  // ── Check & unlock achievements ───────────────────────────
  const checkAndUnlockAchievements = useCallback(async (
    override?: Partial<UserStats & { points: number; streak: number }>
  ) => {
    const currentPoints   = override?.points ?? pointsRef.current;
    const currentStreak   = override?.streak ?? streakRef.current;
    const currentStats    = { ...userStatsRef.current, ...override };
    const currentUnlocked = [...unlockedRef.current];

    const statMap: Record<string, number> = {
      totalQuestionsAsked: currentStats.totalQuestionsAsked || 0,
      totalPPTsGenerated:  currentStats.totalPPTsGenerated  || 0,
      totalPDFsConverted:  currentStats.totalPDFsConverted  || 0,
      streak: currentStreak || 0,
      points: currentPoints || 0,
    };

    const toUnlock = ACHIEVEMENTS.filter(ach => {
      if (currentUnlocked.includes(ach.id)) return false;
      const val = statMap[ach.stat] ?? 0;
      return val >= ach.threshold;
    });

    if (toUnlock.length === 0) return;

    const newlyUnlocked: any[] = [];

    for (const ach of toUnlock) {
      try {
        const result = await unlockAchievement(ach.id);
        if (result.success) {
          unlockedRef.current = result.unlockedAchievements;
          setUnlockedAchievements(result.unlockedAchievements);
          newlyUnlocked.push(ach);

          if (result.rewardPoints > 0) {
            setPoints(prev => prev + result.rewardPoints);
            setTotalXP(prev => prev + result.rewardPoints);
          }
        }
      } catch (e) {
        console.error("unlock error", ach.id, e);
      }
    }

    if (newlyUnlocked.length > 0) {
      setToastQueue(prev => [...prev, ...newlyUnlocked]);
    }
  }, []);

  const checkStreak = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/user/update-streak`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setStreak(data.streak);
        if (data.streakIncreased) {
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
    setTotalXP(prev => prev + amount);
    checkAndUnlockAchievements({ points: newPoints });
  };

  const useQuestion = () => {
    setQuestionsLeft((prev) => Math.max(0, prev - 1));
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

  const refreshQuota = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/quota`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.questionsLeft !== undefined) {
        setQuestionsLeft(data.questionsLeft);
      }
    } catch {}
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

      {toastAchievement && (
        <AchievementToast
          achievement={toastAchievement}
          onClose={() => setToastAchievement(null)}
        />
      )}

      <AppContext.Provider
        value={{
          points,
          totalXP,
          isPremium,
          premiumExpiresAt,
          streak,
          questionsLeft,
          setQuestionsLeft,
          refreshQuota,
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
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ── CodeLearn Public Routes (no login needed to browse) ── */}
          <Route path="/codelearn" element={<CodeLearnHome />} />
          <Route path="/codelearn/:language" element={<CoursePage />} />
          <Route path="/codelearn/:language/certificate" element={<CertificatePage />} />

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
            <Route path="quiz" element={<QuizGenerator />} />
            <Route path="planner" element={<StudyPlanner />} />
            <Route path="challenge" element={<DailyChallenge />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="formulas" element={<FormulaSheet />} />
            <Route path="study-tools" element={<StudyTools />} />
            <Route path="notes" element={<CollabNotes />} />
            <Route path="notes/shared/:code" element={<CollabNotes />} />
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