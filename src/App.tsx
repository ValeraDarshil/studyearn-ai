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
// import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
// import { AppContext, UserStats } from "./context/AppContext";
// import {
//   getCurrentUser,
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
// import { GoogleWelcome } from "./pages/GoogleWelcome";
// import { PointsHistory } from "./pages/PointsHistory";
// import CodeLearnHome from "./pages/codelearn/CodeLearnHome";
// import CoursePage from "./pages/codelearn/CoursePage";
// import CertificatePage from "./pages/codelearn/CertificatePage";
// import { OnboardingTour, hasCompletedOnboardingLocally, isNewAccount } from "./components/OnboardingTour";

// // ── Achievement Unlocked — Center Modal ──────────────────────
// function AchievementToast({ achievement, onClose }: { achievement: any; onClose: () => void }) {
//   const [visible, setVisible] = useState(true);

//   const handleClose = useCallback(() => {
//     setVisible(false);
//     setTimeout(onClose, 350); // wait for exit animation
//   }, [onClose]);

//   useEffect(() => {
//     const t = setTimeout(handleClose, 5000);
//     return () => clearTimeout(t);
//   }, [handleClose]);

//   const rarityColors: Record<string, { border: string; glow: string; badge: string; ring: string }> = {
//     common:    { border: "border-slate-400/40",  glow: "rgba(148,163,184,0.15)", badge: "bg-slate-500/20 text-slate-300",   ring: "#94a3b8" },
//     rare:      { border: "border-blue-400/50",   glow: "rgba(59,130,246,0.25)",  badge: "bg-blue-500/20 text-blue-300",    ring: "#3b82f6" },
//     epic:      { border: "border-purple-400/60", glow: "rgba(168,85,247,0.30)",  badge: "bg-purple-500/20 text-purple-300",ring: "#a855f7" },
//     legendary: { border: "border-yellow-400/70", glow: "rgba(234,179,8,0.35)",   badge: "bg-yellow-500/20 text-yellow-300",ring: "#eab308" },
//   };
//   const r = rarityColors[achievement.rarity || "common"];

//   return (
//     <>
//       <style>{`
//         @keyframes achBgIn    { from { opacity: 0 } to { opacity: 1 } }
//         @keyframes achBgOut   { from { opacity: 1 } to { opacity: 0 } }
//         @keyframes achCardIn  { from { opacity: 0; transform: scale(0.7) translateY(40px) } to { opacity: 1; transform: scale(1) translateY(0) } }
//         @keyframes achCardOut { from { opacity: 1; transform: scale(1) translateY(0) } to { opacity: 0; transform: scale(0.85) translateY(20px) } }
//         @keyframes achIconPop { 0% { transform: scale(0) rotate(-20deg) } 60% { transform: scale(1.3) rotate(5deg) } 100% { transform: scale(1) rotate(0deg) } }
//         @keyframes achShine   { from { left: -100% } to { left: 200% } }
//         @keyframes achPulse   { 0%,100% { box-shadow: 0 0 0 0 ${r.ring}40 } 50% { box-shadow: 0 0 0 16px ${r.ring}00 } }
//       `}</style>

//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 z-[200]"
//         style={{
//           background: "rgba(0,0,0,0.75)",
//           backdropFilter: "blur(8px)",
//           animation: visible ? "achBgIn 0.3s ease forwards" : "achBgOut 0.35s ease forwards",
//         }}
//         onClick={handleClose}
//       />

//       {/* Card */}
//       <div
//         className={`fixed z-[201] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[380px] rounded-3xl border ${r.border} overflow-hidden`}
//         style={{
//           background: "linear-gradient(145deg, rgba(10,12,28,0.98) 0%, rgba(15,8,35,0.98) 100%)",
//           boxShadow: `0 40px 80px rgba(0,0,0,0.8), 0 0 60px ${r.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
//           animation: visible
//             ? "achCardIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards"
//             : "achCardOut 0.35s cubic-bezier(0.4,0,0.2,1) forwards",
//         }}
//       >
//         {/* Shine sweep */}
//         <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
//           <div className="absolute top-0 bottom-0 w-16 skew-x-12 opacity-20"
//             style={{ background: "linear-gradient(90deg, transparent, white, transparent)", animation: "achShine 2s ease 0.6s forwards", left: "-100%" }} />
//         </div>

//         {/* Top glow bar */}
//         <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${r.ring}, transparent)` }} />

//         <div className="p-8 text-center">
//           <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5 ${r.badge}`}>
//             🏆 Achievement Unlocked
//           </div>

//           <div
//             className="text-6xl mb-4 mx-auto w-24 h-24 rounded-2xl flex items-center justify-center"
//             style={{
//               background: `radial-gradient(circle, ${r.glow.replace("0.3","0.15")} 0%, transparent 70%)`,
//               border: `2px solid ${r.ring}40`,
//               animation: "achIconPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both, achPulse 2s ease 1s infinite",
//             }}
//           >
//             {achievement.icon}
//           </div>

//           <div className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 ${r.badge}`}>
//             {achievement.rarity}
//           </div>

//           <h2 className="text-2xl font-black text-white mb-2">{achievement.name}</h2>
//           <p className="text-sm text-slate-400 mb-4 leading-relaxed">{achievement.desc}</p>

//           {achievement.reward > 0 && (
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 mb-5">
//               <span className="text-lg">⚡</span>
//               <span className="text-sm font-bold text-green-400">+{achievement.reward} Bonus Points Earned!</span>
//             </div>
//           )}

//           <button
//             onClick={handleClose}
//             className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-80"
//             style={{ background: `linear-gradient(135deg, ${r.ring}80, ${r.ring}40)`, border: `1px solid ${r.ring}50` }}
//           >
//             Awesome! 🎉
//           </button>
//         </div>

//         <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${r.ring}60, transparent)` }} />
//       </div>
//     </>
//   );
// }

// // ── Main App Component ────────────────────────────────────────
// function AppContent() {
//   const location = useLocation();

//   // ── Core state ───────────────────────────────────────────
//   const [points, setPoints]                 = useState(0);
//   const [questionsLeft, setQuestionsLeft]   = useState(15);
//   const [recentActivity, setRecentActivity] = useState<any[]>([]);
//   const [streak, setStreak]                 = useState(0);
//   const [totalXP, setTotalXP]               = useState(0);
//   const [isPremium, setIsPremium]           = useState(false);
//   const [premiumExpiresAt, setPremiumExpiresAt] = useState<string | null>(null);
//   const [isLoggedIn, setIsLoggedIn]         = useState(false);
//   const [userId, setUserId]                 = useState("");
//   const [userName, setUserName]             = useState("");
//   const [loading, setLoading]               = useState(true);

//   // ── Onboarding Tour ───────────────────────────────────────
//   const [showOnboarding, setShowOnboarding] = useState(false);

//   // ── Streak celebration ────────────────────────────────────
//   const [showStreakCelebration, setShowStreakCelebration] = useState(false);
//   const [celebrationStreak, setCelebrationStreak]         = useState(0);

//   // ── Achievements ─────────────────────────────────────────
//   const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
//   const [userStats, setUserStats] = useState<UserStats>({
//     totalQuestionsAsked: 0,
//     totalPPTsGenerated: 0,
//     totalPDFsConverted: 0,
//     totalQuizCompleted: 0,
//     totalChallengesCompleted: 0,
//     totalChallengesCorrect: 0,
//     totalNotesCreated: 0,
//     totalStudyToolsUsed: 0,
//     totalDaysActive: 0,
//     referrals: 0,
//     formulaBookmarksCount: 0,
//   });

//   // ── Achievement toast queue ───────────────────────────────
//   const [toastQueue, setToastQueue]           = useState<any[]>([]);
//   const [toastAchievement, setToastAchievement] = useState<any>(null);

//   // ── Refs — always latest values in callbacks ──────────────
//   const pointsRef    = useRef(points);
//   const streakRef    = useRef(streak);
//   const userStatsRef = useRef(userStats);
//   const unlockedRef  = useRef(unlockedAchievements);

//   useEffect(() => { pointsRef.current    = points;               }, [points]);
//   useEffect(() => { streakRef.current    = streak;               }, [streak]);
//   useEffect(() => { userStatsRef.current = userStats;            }, [userStats]);
//   useEffect(() => { unlockedRef.current  = unlockedAchievements; }, [unlockedAchievements]);

//   // ── Toast queue processor ─────────────────────────────────
//   // Achievements wait until tour is done
//   useEffect(() => {
//     if (!toastAchievement && toastQueue.length > 0 && !loading && !showOnboarding) {
//       const timer = setTimeout(() => {
//         setToastAchievement(toastQueue[0]);
//         setToastQueue(prev => prev.slice(1));
//       }, 400); // small gap between consecutive toasts
//       return () => clearTimeout(timer);
//     }
//   }, [toastAchievement, toastQueue, loading, showOnboarding]);

//   useEffect(() => { loadUserData(); }, []);

//   // ── Load user data from server ────────────────────────────
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

//         const premExpiry = (user as any).premiumExpiresAt;
//         const premActive = (user as any).isPremium === true && premExpiry && new Date(premExpiry) > new Date();
//         setIsPremium(!!premActive);
//         setPremiumExpiresAt(premExpiry || null);
//         setQuestionsLeft(user.questionsLeft);
//         setStreak(user.streak || 0);

//         // ── Onboarding Tour — ONLY for genuinely new users ────
//         // Layer 1 (DB): user.onboardingCompleted — permanent, cross-device
//         // Layer 2 (localStorage): instant check, prevents flicker on refresh
//         // Both must be false for tour to show.
//         const dbSaysDone    = !!(user as any).onboardingCompleted;
//         const localSaysDone = hasCompletedOnboardingLocally(user._id);
//         const shouldShowTour = !dbSaysDone && !localSaysDone;
//         if (shouldShowTour) {
//           setTimeout(() => setShowOnboarding(true), 1400);
//         }

//         getRecentActivity().then((d) => { if (d.success) setRecentActivity(d.activities); });

//         // ── Streak Celebration — delayed if tour is showing ───
//         // New users see tour first, then streak after tour completes
//         // Existing users see streak at normal timing
//         const streakDelay = shouldShowTour ? 0 : 1500; // tour users: streak fires via onTourComplete
//         const streakCelebration = sessionStorage.getItem("streakCelebration");
//         const loginBonus        = sessionStorage.getItem("loginBonus");
//         if (streakCelebration) {
//           const info = JSON.parse(streakCelebration);
//           setCelebrationStreak(info.currentStreak);
//           if (!shouldShowTour) setTimeout(() => setShowStreakCelebration(true), streakDelay);
//           sessionStorage.removeItem("streakCelebration");
//         }
//         if (loginBonus) sessionStorage.removeItem("loginBonus");

//         const streakInfoFromMe = (user as any)._streakInfo;
//         if (!streakCelebration && streakInfoFromMe?.streakIncreased) {
//           setCelebrationStreak(streakInfoFromMe.currentStreak);
//           setPoints(user.points);
//           setTotalXP((user as any).totalXP || user.points);
//           if (!shouldShowTour) setTimeout(() => setShowStreakCelebration(true), streakDelay);
//         }
//         if (!streakCelebration && !streakInfoFromMe?.streakIncreased) {
//           checkStreak().catch(console.error);
//         }

//         // ── Load achievements + check for newly eligible ──────
//         getAchievements().then((d) => {
//           if (d.success) {
//             const unlocked = d.unlockedAchievements || [];
//             const stats: UserStats = {
//               totalQuestionsAsked:      d.totalQuestionsAsked      || 0,
//               totalPPTsGenerated:       d.totalPPTsGenerated       || 0,
//               totalPDFsConverted:       d.totalPDFsConverted       || 0,
//               totalQuizCompleted:       d.totalQuizCompleted       || 0,
//               totalChallengesCompleted: d.totalChallengesCompleted  || 0,
//               totalChallengesCorrect:   d.totalChallengesCorrect   || 0,
//               totalNotesCreated:        d.totalNotesCreated        || 0,
//               totalStudyToolsUsed:      d.totalStudyToolsUsed      || 0,
//               totalDaysActive:          d.totalDaysActive          || 0,
//               referrals:                d.totalReferrals           || 0,
//               formulaBookmarksCount:    (d.formulaBookmarks || []).length,
//             };
//             setUnlockedAchievements(unlocked);
//             unlockedRef.current  = unlocked;
//             setUserStats(stats);
//             userStatsRef.current = stats;

//             setTimeout(() => {
//               checkAndUnlockAchievements({
//                 ...stats,
//                 points: user.points,
//                 streak: user.streak || 0,
//               });
//             }, 1800);
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
//   const checkAndUnlockAchievements = useCallback(async (
//     override?: Partial<UserStats & { points: number; streak: number }>
//   ) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const currentPoints   = override?.points ?? pointsRef.current;
//     const currentStreak   = override?.streak ?? streakRef.current;
//     const currentStats    = { ...userStatsRef.current, ...override };
//     const currentUnlocked = [...unlockedRef.current];

//     // Skip if no activity yet
//     const hasActivity = currentPoints > 0 || currentStreak > 0 ||
//       Object.values(currentStats).some(v => (v as number) > 0);
//     if (!hasActivity) return;

//     const statMap: Record<string, number> = {
//       totalQuestionsAsked:      currentStats.totalQuestionsAsked      || 0,
//       totalPPTsGenerated:       currentStats.totalPPTsGenerated       || 0,
//       totalPDFsConverted:       currentStats.totalPDFsConverted       || 0,
//       totalQuizCompleted:       currentStats.totalQuizCompleted       || 0,
//       totalChallengesCompleted: currentStats.totalChallengesCompleted  || 0,
//       totalChallengesCorrect:   currentStats.totalChallengesCorrect   || 0,
//       totalNotesCreated:        currentStats.totalNotesCreated        || 0,
//       totalStudyToolsUsed:      currentStats.totalStudyToolsUsed      || 0,
//       totalDaysActive:          currentStats.totalDaysActive          || 0,
//       referrals:                currentStats.referrals                || 0,
//       totalFormulaBookmarks:    currentStats.formulaBookmarksCount    || 0,
//       streak:                   currentStreak                         || 0,
//       points:                   currentPoints                         || 0,
//     };

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
//           if (result.rewardPoints > 0) {
//             setPoints(prev => prev + result.rewardPoints);
//             setTotalXP(prev => prev + result.rewardPoints);
//           }
//         }
//       } catch (e) {
//         console.error("unlock error", ach.id, e);
//       }
//     }

//     if (newlyUnlocked.length > 0) {
//       setToastQueue(prev => [...prev, ...newlyUnlocked]);
//     }
//   }, []);

//   // ── Streak check (Layer 3 safety net) ────────────────────
//   const checkStreak = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       const res = await fetch(`${import.meta.env.VITE_API_URL as string}/api/user/update-streak`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) return;
//       const data = await res.json();
//       if (data.success) {
//         setStreak(data.streak);
//         if (data.streakIncreased) {
//           setCelebrationStreak(data.streak);
//           setTimeout(() => setShowStreakCelebration(true), 1500);
//         }
//       }
//     } catch (err) {
//       console.error("Streak check error:", err);
//     }
//   };

//   // ── Points — update UI + check achievements ───────────────
//   const addPoints = async (amount: number) => {
//     const newPoints = pointsRef.current + amount;
//     setPoints(newPoints);
//     setTotalXP(prev => prev + amount);
//     checkAndUnlockAchievements({ points: newPoints });
//   };

//   // ── Question quota ────────────────────────────────────────
//   const useQuestion = () => {
//     setQuestionsLeft((prev) => Math.max(0, prev - 1));
//   };

//   // ── Activity log + auto-increment achievement counters ────
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

//     // Auto-increment counters for achievement tracking
//     setUserStats(prev => {
//       const next = { ...prev };
//       if (action === "quiz_completed")  next.totalQuizCompleted    = (prev.totalQuizCompleted    || 0) + 1;
//       if (action === "note_created")    next.totalNotesCreated     = (prev.totalNotesCreated     || 0) + 1;
//       if (action === "improve_notes" ||
//           action === "analyze_pdf")     next.totalStudyToolsUsed   = (prev.totalStudyToolsUsed   || 0) + 1;
//       return next;
//     });
//   };

//   // ── Quota refresh ─────────────────────────────────────────
//   const refreshQuota = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;
//     try {
//       const res  = await fetch(`${import.meta.env.VITE_API_URL as string}/api/ai/quota`, {
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
//     setQuestionsLeft(15);
//     setRecentActivity([]);
//   };

//   const shouldShowCelebration = showStreakCelebration && location.pathname.startsWith("/app") && !loading;

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

//       <PWAInstallPrompt />

//       {toastAchievement && location.pathname.startsWith("/app") && (
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
//           <Route path="/google-welcome" element={<GoogleWelcome />} />

//           {/* CodeLearn — public routes */}
//           <Route path="/codelearn" element={<CodeLearnHome />} />
//           <Route path="/codelearn/:language" element={<CoursePage />} />
//           <Route path="/codelearn/:language/certificate" element={<CertificatePage />} />

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
//             <Route path="points-history" element={<PointsHistory />} />
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

//         {/* ── Onboarding Tour — inside Provider so useApp() gets userName ── */}
//         {showOnboarding && !loading && location.pathname.startsWith("/app") && (
//           <OnboardingTour onComplete={() => {
//             setShowOnboarding(false);
//             // After tour ends, show streak celebration + achievements with delay
//             setTimeout(() => setShowStreakCelebration(prev => {
//               // Only show if it was queued (celebrationStreak > 0 means it was set)
//               return celebrationStreak > 0 ? true : prev;
//             }), 800);
//           }} />
//         )}
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
// import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
// import { AppContext, UserStats } from "./context/AppContext";
// import {
//   getCurrentUser,
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
// import { GoogleWelcome } from "./pages/GoogleWelcome";
// import { PointsHistory } from "./pages/PointsHistory";
// import CodeLearnHome from "./pages/codelearn/CodeLearnHome";
// import CoursePage from "./pages/codelearn/CoursePage";
// import CertificatePage from "./pages/codelearn/CertificatePage";
// import { OnboardingTour, hasCompletedOnboardingLocally } from "./components/OnboardingTour";

// // ── AI Study OS — New Pages ───────────────────────────────────
// import { Onboarding } from "./pages/Onboarding";
// import { BrainDashboard } from "./pages/BrainDashboard";

// // ── Achievement Unlocked — Center Modal ──────────────────────
// function AchievementToast({ achievement, onClose }: { achievement: any; onClose: () => void }) {
//   const [visible, setVisible] = useState(true);

//   const handleClose = useCallback(() => {
//     setVisible(false);
//     setTimeout(onClose, 350); // wait for exit animation
//   }, [onClose]);

//   useEffect(() => {
//     const t = setTimeout(handleClose, 5000);
//     return () => clearTimeout(t);
//   }, [handleClose]);

//   const rarityColors: Record<string, { border: string; glow: string; badge: string; ring: string }> = {
//     common:    { border: "border-slate-400/40",  glow: "rgba(148,163,184,0.15)", badge: "bg-slate-500/20 text-slate-300",   ring: "#94a3b8" },
//     rare:      { border: "border-blue-400/50",   glow: "rgba(59,130,246,0.25)",  badge: "bg-blue-500/20 text-blue-300",    ring: "#3b82f6" },
//     epic:      { border: "border-purple-400/60", glow: "rgba(168,85,247,0.30)",  badge: "bg-purple-500/20 text-purple-300",ring: "#a855f7" },
//     legendary: { border: "border-yellow-400/70", glow: "rgba(234,179,8,0.35)",   badge: "bg-yellow-500/20 text-yellow-300",ring: "#eab308" },
//   };
//   const r = rarityColors[achievement.rarity || "common"];

//   return (
//     <>
//       <style>{`
//         @keyframes achBgIn    { from { opacity: 0 } to { opacity: 1 } }
//         @keyframes achBgOut   { from { opacity: 1 } to { opacity: 0 } }
//         @keyframes achCardIn  { from { opacity: 0; transform: scale(0.7) translateY(40px) } to { opacity: 1; transform: scale(1) translateY(0) } }
//         @keyframes achCardOut { from { opacity: 1; transform: scale(1) translateY(0) } to { opacity: 0; transform: scale(0.85) translateY(20px) } }
//         @keyframes achIconPop { 0% { transform: scale(0) rotate(-20deg) } 60% { transform: scale(1.3) rotate(5deg) } 100% { transform: scale(1) rotate(0deg) } }
//         @keyframes achShine   { from { left: -100% } to { left: 200% } }
//         @keyframes achPulse   { 0%,100% { box-shadow: 0 0 0 0 ${r.ring}40 } 50% { box-shadow: 0 0 0 16px ${r.ring}00 } }
//       `}</style>

//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 z-[200]"
//         style={{
//           background: "rgba(0,0,0,0.75)",
//           backdropFilter: "blur(8px)",
//           animation: visible ? "achBgIn 0.3s ease forwards" : "achBgOut 0.35s ease forwards",
//         }}
//         onClick={handleClose}
//       />

//       {/* Card */}
//       <div
//         className={`fixed z-[201] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[380px] rounded-3xl border ${r.border} overflow-hidden`}
//         style={{
//           background: "linear-gradient(145deg, rgba(10,12,28,0.98) 0%, rgba(15,8,35,0.98) 100%)",
//           boxShadow: `0 40px 80px rgba(0,0,0,0.8), 0 0 60px ${r.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
//           animation: visible
//             ? "achCardIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards"
//             : "achCardOut 0.35s cubic-bezier(0.4,0,0.2,1) forwards",
//         }}
//       >
//         {/* Shine sweep */}
//         <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
//           <div className="absolute top-0 bottom-0 w-16 skew-x-12 opacity-20"
//             style={{ background: "linear-gradient(90deg, transparent, white, transparent)", animation: "achShine 2s ease 0.6s forwards", left: "-100%" }} />
//         </div>

//         {/* Top glow bar */}
//         <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${r.ring}, transparent)` }} />

//         <div className="p-8 text-center">
//           <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5 ${r.badge}`}>
//             🏆 Achievement Unlocked
//           </div>

//           <div
//             className="text-6xl mb-4 mx-auto w-24 h-24 rounded-2xl flex items-center justify-center"
//             style={{
//               background: `radial-gradient(circle, ${r.glow.replace("0.3","0.15")} 0%, transparent 70%)`,
//               border: `2px solid ${r.ring}40`,
//               animation: "achIconPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both, achPulse 2s ease 1s infinite",
//             }}
//           >
//             {achievement.icon}
//           </div>

//           <div className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 ${r.badge}`}>
//             {achievement.rarity}
//           </div>

//           <h2 className="text-2xl font-black text-white mb-2">{achievement.name}</h2>
//           <p className="text-sm text-slate-400 mb-4 leading-relaxed">{achievement.desc}</p>

//           {achievement.reward > 0 && (
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 mb-5">
//               <span className="text-lg">⚡</span>
//               <span className="text-sm font-bold text-green-400">+{achievement.reward} Bonus Points Earned!</span>
//             </div>
//           )}

//           <button
//             onClick={handleClose}
//             className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-80"
//             style={{ background: `linear-gradient(135deg, ${r.ring}80, ${r.ring}40)`, border: `1px solid ${r.ring}50` }}
//           >
//             Awesome! 🎉
//           </button>
//         </div>

//         <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${r.ring}60, transparent)` }} />
//       </div>
//     </>
//   );
// }

// // ── Main App Component ────────────────────────────────────────
// function AppContent() {
//   const location = useLocation();

//   // ── Core state ───────────────────────────────────────────
//   const [points, setPoints]                 = useState(0);
//   const [questionsLeft, setQuestionsLeft]   = useState(15);
//   const [recentActivity, setRecentActivity] = useState<any[]>([]);
//   const [streak, setStreak]                 = useState(0);
//   const [totalXP, setTotalXP]               = useState(0);
//   const [isPremium, setIsPremium]           = useState(false);
//   const [premiumExpiresAt, setPremiumExpiresAt] = useState<string | null>(null);
//   const [isLoggedIn, setIsLoggedIn]         = useState(false);
//   const [userId, setUserId]                 = useState("");
//   const [userName, setUserName]             = useState("");
//   const [loading, setLoading]               = useState(true);

//   // ── AI Study OS — Learner Onboarding ─────────────────────
//   // Shown once for new users: school/coding/college/self setup
//   const [showLearnerOnboarding, setShowLearnerOnboarding] = useState(false);

//   // ── Onboarding Tour ───────────────────────────────────────
//   const [showOnboarding, setShowOnboarding] = useState(false);

//   // ── Streak celebration ────────────────────────────────────
//   const [showStreakCelebration, setShowStreakCelebration] = useState(false);
//   const [celebrationStreak, setCelebrationStreak]         = useState(0);

//   // ── Achievements ─────────────────────────────────────────
//   const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
//   const [userStats, setUserStats] = useState<UserStats>({
//     totalQuestionsAsked: 0,
//     totalPPTsGenerated: 0,
//     totalPDFsConverted: 0,
//     totalQuizCompleted: 0,
//     totalChallengesCompleted: 0,
//     totalChallengesCorrect: 0,
//     totalNotesCreated: 0,
//     totalStudyToolsUsed: 0,
//     totalDaysActive: 0,
//     referrals: 0,
//     formulaBookmarksCount: 0,
//   });

//   // ── Achievement toast queue ───────────────────────────────
//   const [toastQueue, setToastQueue]           = useState<any[]>([]);
//   const [toastAchievement, setToastAchievement] = useState<any>(null);

//   // ── Refs — always latest values in callbacks ──────────────
//   const pointsRef    = useRef(points);
//   const streakRef    = useRef(streak);
//   const userStatsRef = useRef(userStats);
//   const unlockedRef  = useRef(unlockedAchievements);

//   useEffect(() => { pointsRef.current    = points;               }, [points]);
//   useEffect(() => { streakRef.current    = streak;               }, [streak]);
//   useEffect(() => { userStatsRef.current = userStats;            }, [userStats]);
//   useEffect(() => { unlockedRef.current  = unlockedAchievements; }, [unlockedAchievements]);

//   // ── Toast queue processor ─────────────────────────────────
//   useEffect(() => {
//     if (!toastAchievement && toastQueue.length > 0 && !loading && !showOnboarding) {
//       const timer = setTimeout(() => {
//         setToastAchievement(toastQueue[0]);
//         setToastQueue(prev => prev.slice(1));
//       }, 400);
//       return () => clearTimeout(timer);
//     }
//   }, [toastAchievement, toastQueue, loading, showOnboarding]);

//   useEffect(() => { loadUserData(); }, []);

//   // ── Load user data from server ────────────────────────────
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

//         const premExpiry = (user as any).premiumExpiresAt;
//         const premActive = (user as any).isPremium === true && premExpiry && new Date(premExpiry) > new Date();
//         setIsPremium(!!premActive);
//         setPremiumExpiresAt(premExpiry || null);
//         setQuestionsLeft(user.questionsLeft);
//         setStreak(user.streak || 0);

//         // ── AI Study OS: Learner Onboarding ──────────────────
//         // Show after product onboarding tour, for users without brain profile
//         // Check: does user have onboardingCompleted (product tour) AND no brain profile yet?
//         // We show learner onboarding if: product tour done + brain setup not done
//         // Brain setup is tracked by a localStorage key per user
//         const brainSetupDone = localStorage.getItem(`brain_setup_${user._id}`);
//         const productTourDone = !!(user as any).onboardingCompleted;
//         // Show learner onboarding only if product tour is done and brain setup isn't done
//         if (productTourDone && !brainSetupDone) {
//           setTimeout(() => setShowLearnerOnboarding(true), 2000);
//         }

//         // ── Onboarding Tour — ONLY for genuinely new users ────
//         const dbSaysDone    = !!(user as any).onboardingCompleted;
//         const localSaysDone = hasCompletedOnboardingLocally(user._id);
//         const shouldShowTour = !dbSaysDone && !localSaysDone;
//         if (shouldShowTour) {
//           setTimeout(() => setShowOnboarding(true), 1400);
//         }

//         getRecentActivity().then((d) => { if (d.success) setRecentActivity(d.activities); });

//         const streakDelay = shouldShowTour ? 0 : 1500;
//         const streakCelebration = sessionStorage.getItem("streakCelebration");
//         const loginBonus        = sessionStorage.getItem("loginBonus");
//         if (streakCelebration) {
//           const info = JSON.parse(streakCelebration);
//           setCelebrationStreak(info.currentStreak);
//           if (!shouldShowTour) setTimeout(() => setShowStreakCelebration(true), streakDelay);
//           sessionStorage.removeItem("streakCelebration");
//         }
//         if (loginBonus) sessionStorage.removeItem("loginBonus");

//         const streakInfoFromMe = (user as any)._streakInfo;
//         if (!streakCelebration && streakInfoFromMe?.streakIncreased) {
//           setCelebrationStreak(streakInfoFromMe.currentStreak);
//           setPoints(user.points);
//           setTotalXP((user as any).totalXP || user.points);
//           if (!shouldShowTour) setTimeout(() => setShowStreakCelebration(true), streakDelay);
//         }
//         if (!streakCelebration && !streakInfoFromMe?.streakIncreased) {
//           checkStreak().catch(console.error);
//         }

//         getAchievements().then((d) => {
//           if (d.success) {
//             const unlocked = d.unlockedAchievements || [];
//             const stats: UserStats = {
//               totalQuestionsAsked:      d.totalQuestionsAsked      || 0,
//               totalPPTsGenerated:       d.totalPPTsGenerated       || 0,
//               totalPDFsConverted:       d.totalPDFsConverted       || 0,
//               totalQuizCompleted:       d.totalQuizCompleted       || 0,
//               totalChallengesCompleted: d.totalChallengesCompleted  || 0,
//               totalChallengesCorrect:   d.totalChallengesCorrect   || 0,
//               totalNotesCreated:        d.totalNotesCreated        || 0,
//               totalStudyToolsUsed:      d.totalStudyToolsUsed      || 0,
//               totalDaysActive:          d.totalDaysActive          || 0,
//               referrals:                d.totalReferrals           || 0,
//               formulaBookmarksCount:    (d.formulaBookmarks || []).length,
//             };
//             setUnlockedAchievements(unlocked);
//             unlockedRef.current  = unlocked;
//             setUserStats(stats);
//             userStatsRef.current = stats;

//             setTimeout(() => {
//               checkAndUnlockAchievements({
//                 ...stats,
//                 points: user.points,
//                 streak: user.streak || 0,
//               });
//             }, 1800);
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
//   const checkAndUnlockAchievements = useCallback(async (
//     override?: Partial<UserStats & { points: number; streak: number }>
//   ) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const currentPoints   = override?.points ?? pointsRef.current;
//     const currentStreak   = override?.streak ?? streakRef.current;
//     const currentStats    = { ...userStatsRef.current, ...override };
//     const currentUnlocked = [...unlockedRef.current];

//     const hasActivity = currentPoints > 0 || currentStreak > 0 ||
//       Object.values(currentStats).some(v => (v as number) > 0);
//     if (!hasActivity) return;

//     const statMap: Record<string, number> = {
//       totalQuestionsAsked:      currentStats.totalQuestionsAsked      || 0,
//       totalPPTsGenerated:       currentStats.totalPPTsGenerated       || 0,
//       totalPDFsConverted:       currentStats.totalPDFsConverted       || 0,
//       totalQuizCompleted:       currentStats.totalQuizCompleted       || 0,
//       totalChallengesCompleted: currentStats.totalChallengesCompleted  || 0,
//       totalChallengesCorrect:   currentStats.totalChallengesCorrect   || 0,
//       totalNotesCreated:        currentStats.totalNotesCreated        || 0,
//       totalStudyToolsUsed:      currentStats.totalStudyToolsUsed      || 0,
//       totalDaysActive:          currentStats.totalDaysActive          || 0,
//       referrals:                currentStats.referrals                || 0,
//       totalFormulaBookmarks:    currentStats.formulaBookmarksCount    || 0,
//       streak:                   currentStreak                         || 0,
//       points:                   currentPoints                         || 0,
//     };

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
//           if (result.rewardPoints > 0) {
//             setPoints(prev => prev + result.rewardPoints);
//             setTotalXP(prev => prev + result.rewardPoints);
//           }
//         }
//       } catch (e) {
//         console.error("unlock error", ach.id, e);
//       }
//     }

//     if (newlyUnlocked.length > 0) {
//       setToastQueue(prev => [...prev, ...newlyUnlocked]);
//     }
//   }, []);

//   // ── Streak check (Layer 3 safety net) ────────────────────
//   const checkStreak = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       const res = await fetch(`${import.meta.env.VITE_API_URL as string}/api/user/update-streak`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) return;
//       const data = await res.json();
//       if (data.success) {
//         setStreak(data.streak);
//         if (data.streakIncreased) {
//           setCelebrationStreak(data.streak);
//           setTimeout(() => setShowStreakCelebration(true), 1500);
//         }
//       }
//     } catch (err) {
//       console.error("Streak check error:", err);
//     }
//   };

//   // ── Points — update UI + check achievements ───────────────
//   const addPoints = async (amount: number) => {
//     const newPoints = pointsRef.current + amount;
//     setPoints(newPoints);
//     setTotalXP(prev => prev + amount);
//     checkAndUnlockAchievements({ points: newPoints });
//   };

//   // ── Question quota ────────────────────────────────────────
//   const useQuestion = () => {
//     setQuestionsLeft((prev) => Math.max(0, prev - 1));
//   };

//   // ── Activity log + auto-increment achievement counters ────
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

//     setUserStats(prev => {
//       const next = { ...prev };
//       if (action === "quiz_completed")  next.totalQuizCompleted    = (prev.totalQuizCompleted    || 0) + 1;
//       if (action === "note_created")    next.totalNotesCreated     = (prev.totalNotesCreated     || 0) + 1;
//       if (action === "improve_notes" ||
//           action === "analyze_pdf")     next.totalStudyToolsUsed   = (prev.totalStudyToolsUsed   || 0) + 1;
//       return next;
//     });
//   };

//   // ── Quota refresh ─────────────────────────────────────────
//   const refreshQuota = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;
//     try {
//       const res  = await fetch(`${import.meta.env.VITE_API_URL as string}/api/ai/quota`, {
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
//     setQuestionsLeft(15);
//     setRecentActivity([]);
//   };

//   const shouldShowCelebration = showStreakCelebration && location.pathname.startsWith("/app") && !loading;

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

//       <PWAInstallPrompt />

//       {toastAchievement && location.pathname.startsWith("/app") && (
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
//           <Route path="/google-welcome" element={<GoogleWelcome />} />

//           {/* ── AI Study OS: Learner Onboarding ── */}
//           <Route path="/onboarding" element={<Onboarding />} />

//           {/* CodeLearn — public routes */}
//           <Route path="/codelearn" element={<CodeLearnHome />} />
//           <Route path="/codelearn/:language" element={<CoursePage />} />
//           <Route path="/codelearn/:language/certificate" element={<CertificatePage />} />

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
//             <Route path="points-history" element={<PointsHistory />} />
//             <Route path="quiz" element={<QuizGenerator />} />
//             <Route path="planner" element={<StudyPlanner />} />
//             <Route path="challenge" element={<DailyChallenge />} />
//             <Route path="analytics" element={<Analytics />} />
//             <Route path="formulas" element={<FormulaSheet />} />
//             <Route path="study-tools" element={<StudyTools />} />
//             <Route path="notes" element={<CollabNotes />} />
//             <Route path="notes/shared/:code" element={<CollabNotes />} />
//             {/* ── AI Study OS: Brain Dashboard ── */}
//             <Route path="brain" element={<BrainDashboard />} />
//           </Route>
//         </Routes>

//         {/* ── Onboarding Tour — inside Provider so useApp() gets userName ── */}
//         {showOnboarding && !loading && location.pathname.startsWith("/app") && (
//           <OnboardingTour onComplete={() => {
//             setShowOnboarding(false);
//             setTimeout(() => setShowStreakCelebration(prev => {
//               return celebrationStreak > 0 ? true : prev;
//             }), 800);
//             // After product tour completes, check if learner onboarding needed
//             setTimeout(() => {
//               const brainSetupDone = localStorage.getItem(`brain_setup_${userId}`);
//               if (!brainSetupDone) setShowLearnerOnboarding(true);
//             }, 1500);
//           }} />
//         )}

//         {/* ── AI Study OS: Inline Learner Onboarding Modal ── */}
//         {showLearnerOnboarding && !loading && !showOnboarding && location.pathname.startsWith("/app") && (
//           <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
//             <div className="w-full max-w-2xl bg-slate-950 rounded-3xl border border-slate-700 overflow-y-auto max-h-[90vh]">
//               <Onboarding
//                 onComplete={() => {
//                   // Mark brain setup done in localStorage
//                   if (userId) localStorage.setItem(`brain_setup_${userId}`, '1');
//                   setShowLearnerOnboarding(false);
//                 }}
//               />
//             </div>
//           </div>
//         )}
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
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { AppContext, UserStats } from "./context/AppContext";
import {
  getCurrentUser,
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
import { GoogleWelcome } from "./pages/GoogleWelcome";
import { PointsHistory } from "./pages/PointsHistory";
import CodeLearnHome from "./pages/codelearn/CodeLearnHome";
import CoursePage from "./pages/codelearn/CoursePage";
import CertificatePage from "./pages/codelearn/CertificatePage";
import { OnboardingTour, hasCompletedOnboardingLocally } from "./components/OnboardingTour";

// ── AI Study OS — New Pages ───────────────────────────────────
import { Onboarding } from "./pages/Onboarding";
import { BrainDashboard } from "./pages/BrainDashboard";

// ── Stage 6: AI Mentor ────────────────────────────────────────
import AIMentor from "./pages/AIMentor";

// ── Stage 7: Retention Engine ─────────────────────────────────
import { useRetention } from "./hooks/useRetention";
import { StreakAlertPopup } from "./components/retention/StreakAlertPopup";
import { StreakRecoveryUI } from "./components/retention/StreakRecoveryUI";
import { ComebackScreen } from "./components/retention/ComebackScreen";
import { NotificationPanel } from "./components/retention/NotificationPanel";

// ── Achievement Unlocked — Center Modal ──────────────────────

// AchievementCornerPill — non-intrusive corner notification for non-dashboard pages.
// Appears bottom-right, small, does not block the user's work.
// Still plays SFX. Auto-dismisses in 5s.
function AchievementCornerPill({ achievement, onClose }: { achievement: any; onClose: () => void }) {
  const [leaving, setLeaving] = useState(false);

  const rarityAccent: Record<string, { color: string; bg: string; border: string }> = {
    common:    { color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.20)' },
    rare:      { color: '#60a5fa', bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.25)'  },
    epic:      { color: '#c084fc', bg: 'rgba(168,85,247,0.10)',  border: 'rgba(168,85,247,0.28)'  },
    legendary: { color: '#fbbf24', bg: 'rgba(234,179,8,0.10)',   border: 'rgba(234,179,8,0.30)'   },
  };
  const r = rarityAccent[achievement.rarity || 'common'];

  const handleClose = useCallback((manual = false) => {
    if (manual) playAchievementCloseSFX(); // X button → ending SFX
    setLeaving(true);
    setTimeout(onClose, 320);
  }, [onClose]);

  useEffect(() => {
    // Corner pill uses Web Audio generated SFX (rarity-based, non-intrusive)
    playCornerPillSFX(achievement.rarity || 'common');
    const auto = setTimeout(() => handleClose(false), 5000);
    return () => clearTimeout(auto);
  }, [handleClose]);

  return (
    <>
      <style>{`
        @keyframes pillIn  { from { transform:translateX(120%); opacity:0; } to { transform:translateX(0); opacity:1; } }
        @keyframes pillOut { from { transform:translateX(0); opacity:1; } to { transform:translateX(120%); opacity:0; } }
        @keyframes pillShine { 0%{left:-80px;opacity:0} 15%{opacity:1} 85%{opacity:1} 100%{left:200%;opacity:0} }
        @keyframes pillCountdown { from{width:100%} to{width:0%} }
      `}</style>
      <div style={{
        position: 'fixed', bottom: '24px', right: '20px', zIndex: 9999,
        width: '300px', borderRadius: '16px',
        background: 'linear-gradient(135deg,rgba(10,8,28,0.97),rgba(15,10,36,0.97))',
        border: `1px solid ${r.border}`,
        boxShadow: `0 16px 48px rgba(0,0,0,0.7),0 0 24px ${r.bg}`,
        overflow: 'hidden',
        animation: leaving
          ? 'pillOut 0.32s cubic-bezier(0.4,0,1,1) forwards'
          : 'pillIn  0.42s cubic-bezier(0.34,1.2,0.64,1) forwards',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ height:'2px', background:`linear-gradient(90deg,transparent,${r.color},transparent)` }} />
        <div style={{
          position:'absolute', top:0, bottom:0, width:'60px', pointerEvents:'none',
          background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)',
          transform:'skewX(-12deg)', animation:'pillShine 2.2s ease 0.3s forwards', left:'-80px'
        }} />
        <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 14px 12px 16px' }}>
          <div style={{
            width:'44px', height:'44px', borderRadius:'12px', flexShrink:0,
            background:r.bg, border:`1px solid ${r.border}`,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px',
          }}>{achievement.icon}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:r.color, marginBottom:'3px' }}>
              Achievement Unlocked
            </div>
            <div style={{ fontSize:'13px', fontWeight:700, color:'#f1f5f9', lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {achievement.name}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'3px' }}>
              <span style={{ fontSize:'10px', fontWeight:600, padding:'1px 7px', borderRadius:'20px', background:r.bg, color:r.color, border:`1px solid ${r.border}`, textTransform:'uppercase', letterSpacing:'.05em' }}>
                {achievement.rarity}
              </span>
              {achievement.reward > 0 && (
                <span style={{ fontSize:'11px', color:'#4ade80', fontWeight:600 }}>+{achievement.reward} pts</span>
              )}
            </div>
          </div>
          <button onClick={() => handleClose(true)} style={{
            flexShrink:0, width:'24px', height:'24px', borderRadius:'50%',
            background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.10)',
            color:'rgba(148,163,184,0.6)', cursor:'pointer', fontSize:'13px',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>x</button>
        </div>
        <div style={{ height:'2px', background:'rgba(255,255,255,0.05)' }}>
          <div style={{ height:'100%', background:r.color, animation:'pillCountdown 5s linear forwards' }} />
        </div>
      </div>
    </>
  );
}

// ─── Achievement SFX — user-provided audio, embedded as base64 ───────────────
// Full_Achivements_SFX     → plays when FULL toast opens (claimed achievement)
// Achievements_Ending_SFX  → reserved for future manual use
// Corner pill              → Web Audio generated SFX (rarity-based, non-intrusive)
const ACH_OPEN_SFX  = "data:audio/mpeg;base64,SUQzBAAAAAAMblRYWFgAAAASAAADbWFqb3JfYnJhbmQAaXNvbQBUWFhYAAAAEwAAA21pbm9yX3ZlcnNpb24ANTEyAFRYWFgAAAAkAAADY29tcGF0aWJsZV9icmFuZHMAaXNvbWlzbzJhdmMxbXA0MQBUWFhYAAAABgAAA0h3ADEAVFhYWAAACjkAAANMdk1ldGFJbmZvAHsiZGF0YSI6eyJhZHNUZW1wbGF0ZUlkIjoiIiwiYXBwVmVyc2lvbiI6IjE3LjYuMCIsImJ1c2luZXNzQ29tcG9uZW50SWQiOiIiLCJidXNpbmVzc1RlbXBsYXRlSWQiOiIiLCJjYXBhYmlsaXR5TmFtZSI6InNvdW5kX2VmZmVjdF82ODMwNDQzNDIyMTk3NzQ1NjY2LHNvdW5kX2VmZmVjdF83MDU1MTU1MDA3ODgwNzQyOTEzLHNvdW5kX2VmZmVjdF82OTk1ODM1MjMzNjY0NzYzOTA1LHNvdW5kX2VmZmVjdF83MzgwMDYzNzYzMzY3OTcwODU1LHNvdW5kX2VmZmVjdF82OTQwNjU5MDMwOTQ3NzkyODk3LHNvdW5kX2VmZmVjdF83NTE3MTA5MTMwODQwNDI2NTMzIiwiY2FwYWJpbGl0eV9lZmZlY3RfaWQiOiJ7XCJzb3VuZF9lZmZlY3RcIjpcIjY5NDA2NTkwMzA5NDc3OTI4OTcsNzA1NTE1NTAwNzg4MDc0MjkxMyw3MzgwMDYzNzYzMzY3OTcwODU1XCJ9IiwiY29tbWVyY2lhbF9wYXJhbXMiOnt9LCJkcmFmdEluZm8iOnsic291bmRJZCI6IjczODAwNjM3NjMzNjc5NzA4NTUsIDY4MzA0NDM0MjIxOTc3NDU2NjYsIDY5OTU4MzUyMzM2NjQ3NjM5MDUsIDcwNTUxNTUwMDc4ODA3NDI5MTMsIDc1MTcxMDkxMzA4NDA0MjY1MzMsIDY5NDA2NTkwMzA5NDc3OTI4OTciLCJ2aWRlb01hdGVyaWFsSWQiOiIxMDAwMTA2NTU3In0sImVkaXRTb3VyY2UiOiIiLCJlZGl0VHlwZSI6ImVkaXQiLCJlbnRlckZyb20iOiJuZXciLCJleHBvcnRUeXBlIjoiZXhwb3J0IiwiZXh0ZW5kVGVtcGxhdGVJZCI6IiIsImV4dGVuZFRlbXBsYXRlVHlwZSI6MCwiZmlsdGVySWQiOiIiLCJncmVlbnNjcmVlbkxheW91dFR5cGUiOiIiLCJpbmZvU3RpY2tlcklkIjoiIiwibGF1bmNoTW9kZSI6ImxhdW5jaCIsImxhdW5jaF9lbnRlcl9mcm9tIjoiZW50ZXJfbGF1bmNoIiwibG9ja19jbnRfbGlzdCI6IiIsIm1vdmllM2RUZXh0VGVtcGxhdGVJZCI6IiIsIm9yaWdpbmFsX3ZvbHVtZSI6MTAwLCJvcyI6ImFuZHJvaWQiLCJwcm9kdWN0IjoidmljdXQiLCJyZWdpb24iOiJJTiIsInNsb3dNb3Rpb24iOiJub25lIiwic291cmNlX3BsYXRmb3JtIjoibW9iaWxlXzIiLCJzdGlja2VySWQiOiIiLCJ0ZW1wbGF0ZUlkIjoiIiwidGV4dFNwZWNpYWxFZmZlY3QiOiIiLCJ0aGVtZV9wYXJhbXMiOiJbXSIsInRyYW5zZmVyTWV0aG9kIjoiIiwidHJhbnNpdGlvbnMiOiIiLCJ1c2VkX3VnY190aW1icmVfaW5mbyI6IntcInRleHRfdG9fc3BlZWNoXCI6W10sXCJ2b2ljZV9jb252ZXJzaW9uXCI6W119IiwidmlkZW9BbmltYXRpb24iOiIiLCJ2aWRlb0VmZmVjdElkIjoiIiwidmlkZW9JZCI6Ijk4Yjg4OTUxLTNhZDMtNDc4Zi1hYjY1LWQ2NjU4N2U4MzQzYiJ9LCJzb3VyY2VfdHlwZSI6InZpY3V0In0AVFhYWAAAADIAAANhaWdjX2luZm8AeyJhaWdjX2xhYmVsX3R5cGUiOjAsInNvdXJjZV9pbmZvIjoiIn0AVFhYWAAAABMAAANiaXRyYXRlADEwMDAwMDAwMABUWFhYAAAAEgAAA21heHJhdGUAMzAwMDAwMDAAVFhYWAAAABIAAAN0ZV9pc19yZWVuY29kZQAxAFRTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAADxAAJHQAAEBgoNERQWGhwgIiQnKSwuMTY5PkFFSExRVVpeYWVobG5xdHZ6fH+DhYmMkJOVmpygo6WprLCytbm7v8HEx8nMz9LV19rd4OPl6evs7Ozt7e7u7+/v8PDx8fLy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K0BiYQ+dgpAZQN86Ufh5XbNmshKKKeDCAU4KRATolBKmUrfl+SoSZNQVnl34VB4w4pXOwN62sNi6TEFNRTMuMTAwqqqqqqqqSIMAAJbQS8kz+tRV7llg0HEBQgDgAAAL/dH/UVBt/phhVXJlK2MBELHXTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVX/+2BE+AkSkj1BUGkeAFDniEoFJXxDfHMHIIBk6HYMYOQkCc1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBE8o/whgDBsAAACBkjeEoIA6AAAAH+AAAAIAAAP8AAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAH+AAAAIAAAP8AAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVV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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+1Bk/AHzeyXCUekycAAADSAAAAEHJFcHJgBsAAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAf4AAAAgAAA0gAAABAAAB/gAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAAB/gAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=";
const ACH_CLOSE_SFX = "data:audio/mpeg;base64,SUQzBAAAAAAKOFRYWFgAAAASAAADbWFqb3JfYnJhbmQAaXNvbQBUWFhYAAAAEwAAA21pbm9yX3ZlcnNpb24ANTEyAFRYWFgAAAAkAAADY29tcGF0aWJsZV9icmFuZHMAaXNvbWlzbzJhdmMxbXA0MQBUWFhYAAAABgAAA0h3ADEAVFhYWAAACAMAAANMdk1ldGFJbmZvAHsiZGF0YSI6eyJhZHNUZW1wbGF0ZUlkIjoiIiwiYXBwVmVyc2lvbiI6IjE3LjYuMCIsImJ1c2luZXNzQ29tcG9uZW50SWQiOiIiLCJidXNpbmVzc1RlbXBsYXRlSWQiOiIiLCJjYXBhYmlsaXR5TmFtZSI6InNvdW5kX2VmZmVjdF83MzgwMDYzNzYzMzY3OTcwODU1IiwiY2FwYWJpbGl0eV9lZmZlY3RfaWQiOiJ7XCJzb3VuZF9lZmZlY3RcIjpcIjczODAwNjM3NjMzNjc5NzA4NTVcIn0iLCJjb21tZXJjaWFsX3BhcmFtcyI6e30sImRyYWZ0SW5mbyI6eyJzb3VuZElkIjoiNzM4MDA2Mzc2MzM2Nzk3MDg1NSIsInZpZGVvTWF0ZXJpYWxJZCI6IjEwMDAxMDY1NTcifSwiZWRpdFNvdXJjZSI6IiIsImVkaXRUeXBlIjoiZWRpdCIsImVudGVyRnJvbSI6Im5ldyIsImV4cG9ydFR5cGUiOiJleHBvcnQiLCJleHRlbmRUZW1wbGF0ZUlkIjoiIiwiZXh0ZW5kVGVtcGxhdGVUeXBlIjowLCJmaWx0ZXJJZCI6IiIsImdyZWVuc2NyZWVuTGF5b3V0VHlwZSI6IiIsImluZm9TdGlja2VySWQiOiIiLCJsYXVuY2hNb2RlIjoibGF1bmNoIiwibGF1bmNoX2VudGVyX2Zyb20iOiJlbnRlcl9sYXVuY2giLCJsb2NrX2NudF9saXN0IjoiIiwibW92aWUzZFRleHRUZW1wbGF0ZUlkIjoiIiwib3JpZ2luYWxfdm9sdW1lIjoxMDAsIm9zIjoiYW5kcm9pZCIsInByb2R1Y3QiOiJ2aWN1dCIsInJlZ2lvbiI6IklOIiwic2xvd01vdGlvbiI6Im5vbmUiLCJzb3VyY2VfcGxhdGZvcm0iOiJtb2JpbGVfMiIsInN0aWNrZXJJZCI6IiIsInRlbXBsYXRlSWQiOiIi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8uMkGGEyMidGSh2KwlevSrS6mLS8yStgVTnpggoaLYx8RexRzRVd3k0Oj3tlQCdCbv1XdImHeGms79aG/vuZ6/////pqkjTkjkkiQABSIcX1RkvQyygq2SqBX5c2hgSsBZQTk0KcjJUZEbD00UqiRefOpIYOuOJZReFPRerV5DPCZC1LK6q1/Vvb12aXOBmkTKv9zjwVYWb///3f//V7bv6brWo9KNtEpLKvAKARJIiRnkjj0QJmBgIYBQKgqIhEeO4SBoCiKVOg0Jv///RVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVV//twZPmA9MNCRmssHjoAAA0gAAABEbzHE6yw00AAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7QGTwgfMVMULp6RtwAAANIAAAAQTQIwUjDEoAAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAf4AAAAgAAA0gAAABAAAB/gAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAAB/gAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=";

// Preload both achievement audio files immediately — eliminates first-play delay.
let achOpenAudio:  HTMLAudioElement | null = null;
let achCloseAudio: HTMLAudioElement | null = null;
try {
  achOpenAudio = new Audio(ACH_OPEN_SFX);
  achOpenAudio.volume  = 0.7;
  achOpenAudio.preload = 'auto';
  achOpenAudio.load();
} catch { /* skip */ }
try {
  achCloseAudio = new Audio(ACH_CLOSE_SFX);
  achCloseAudio.volume  = 0.7;
  achCloseAudio.preload = 'auto';
  achCloseAudio.load();
} catch { /* skip */ }

function playAchievementSFX(_rarity?: string) {
  try {
    if (!achOpenAudio) { achOpenAudio = new Audio(ACH_OPEN_SFX); achOpenAudio.volume = 0.7; }
    achOpenAudio.currentTime = 0;
    achOpenAudio.play().catch(() => {});
  } catch { /* silently skip */ }
}

function playAchievementCloseSFX() {
  try {
    if (!achCloseAudio) { achCloseAudio = new Audio(ACH_CLOSE_SFX); achCloseAudio.volume = 0.7; }
    achCloseAudio.currentTime = 0;
    achCloseAudio.play().catch(() => {});
  } catch { /* silently skip */ }
}
// ─────────────────────────────────────────────────────────────────────────────

// playCornerPillSFX — Web Audio generated, rarity-based (for corner pill only)
// common: soft bell | rare: crystal arpeggio | epic: power chord | legendary: fanfare
function playCornerPillSFX(rarity: string) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.45, ctx.currentTime);
    master.connect(ctx.destination);
    const now = ctx.currentTime;

    if (rarity === 'common') {
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);
      g.gain.setValueAtTime(0.5, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(g); g.connect(master);
      osc.start(now); osc.stop(now + 1.2);
      setTimeout(() => ctx.close(), 1500);
    } else if (rarity === 'rare') {
      [[523.25,0],[659.25,0.12],[783.99,0.24]].forEach(([freq,delay]) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now+delay);
        g.gain.setValueAtTime(0,now+delay);
        g.gain.linearRampToValueAtTime(0.45, now+delay+0.04);
        g.gain.exponentialRampToValueAtTime(0.001, now+delay+0.9);
        osc.connect(g); g.connect(master);
        osc.start(now+delay); osc.stop(now+delay+0.9);
      });
      const sh = ctx.createOscillator(), sg = ctx.createGain();
      sh.type = 'triangle'; sh.frequency.setValueAtTime(2093, now+0.3);
      sg.gain.setValueAtTime(0.15, now+0.3);
      sg.gain.exponentialRampToValueAtTime(0.001, now+1.4);
      sh.connect(sg); sg.connect(master);
      sh.start(now+0.3); sh.stop(now+1.4);
      setTimeout(() => ctx.close(), 1700);
    } else if (rarity === 'epic') {
      [220,329.63,440,554.37].forEach((freq,i) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(i*4, now);
        g.gain.setValueAtTime(0,now);
        g.gain.linearRampToValueAtTime(0.2, now+0.05);
        g.gain.setValueAtTime(0.2, now+0.3);
        g.gain.exponentialRampToValueAtTime(0.001, now+1.8);
        osc.connect(g); g.connect(master);
        osc.start(now); osc.stop(now+1.8);
      });
      [[1760,0.15],[2093,0.25],[2637,0.35]].forEach(([freq,delay]) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now+delay);
        g.gain.setValueAtTime(0.12, now+delay);
        g.gain.exponentialRampToValueAtTime(0.001, now+delay+1.0);
        osc.connect(g); g.connect(master);
        osc.start(now+delay); osc.stop(now+delay+1.0);
      });
      setTimeout(() => ctx.close(), 2500);
    } else {
      // legendary
      const bass = ctx.createOscillator(), bg = ctx.createGain();
      bass.type = 'sine';
      bass.frequency.setValueAtTime(55, now);
      bass.frequency.exponentialRampToValueAtTime(110, now+0.3);
      bg.gain.setValueAtTime(0.7, now); bg.gain.exponentialRampToValueAtTime(0.001, now+0.8);
      bass.connect(bg); bg.connect(master); bass.start(now); bass.stop(now+0.8);
      [[261.63,0.1],[329.63,0.15],[392,0.2],[523.25,0.25]].forEach(([freq,delay]) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq*0.5, now+delay);
        osc.frequency.exponentialRampToValueAtTime(freq, now+delay+0.15);
        g.gain.setValueAtTime(0,now+delay);
        g.gain.linearRampToValueAtTime(0.25, now+delay+0.12);
        g.gain.setValueAtTime(0.25, now+delay+0.5);
        g.gain.exponentialRampToValueAtTime(0.001, now+delay+2.0);
        osc.connect(g); g.connect(master); osc.start(now+delay); osc.stop(now+delay+2.0);
      });
      [[1046.5,0.35],[1318.5,0.45],[1568,0.55],[2093,0.65],[2637,0.75],[3136,0.85]].forEach(([freq,delay]) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now+delay);
        g.gain.setValueAtTime(0.18, now+delay);
        g.gain.exponentialRampToValueAtTime(0.001, now+delay+0.8);
        osc.connect(g); g.connect(master); osc.start(now+delay); osc.stop(now+delay+0.8);
      });
      [[392,0.6],[523.25,0.6],[659.25,0.6]].forEach(([freq,delay]) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now+delay);
        g.gain.setValueAtTime(0,now+delay);
        g.gain.linearRampToValueAtTime(0.2, now+delay+0.4);
        g.gain.setValueAtTime(0.2, now+delay+0.6);
        g.gain.exponentialRampToValueAtTime(0.001, now+delay+2.5);
        osc.connect(g); g.connect(master); osc.start(now+delay); osc.stop(now+delay+2.5);
      });
      setTimeout(() => ctx.close(), 3800);
    }
  } catch { /* silently skip */ }
}

function AchievementToast({ achievement, onClose }: { achievement: any; onClose: () => void }) {
  const [visible, setVisible] = useState(true);

  // Track the open audio so we can stop it on manual close
  const openAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleClose = useCallback((manual = false) => {
    // If user clicked "Awesome" — stop the open SFX and play ending SFX
    if (manual && openAudioRef.current) {
      openAudioRef.current.pause();
      openAudioRef.current.currentTime = 0;
      playAchievementCloseSFX();
    }
    setVisible(false);
    setTimeout(onClose, 350);
  }, [onClose]);

  useEffect(() => {
    // Play open SFX and keep reference so we can stop it on manual close
    try {
      if (!achOpenAudio) {
        achOpenAudio = new Audio(ACH_OPEN_SFX);
        achOpenAudio.volume = 0.7;
      }
      achOpenAudio.currentTime = 0;
      achOpenAudio.play().catch(() => {});
      openAudioRef.current = achOpenAudio;
    } catch { /* skip */ }
    // Auto-close — full SFX plays out naturally, no ending SFX
    const t = setTimeout(() => handleClose(false), 6000);
    return () => clearTimeout(t);
  }, [handleClose]);

  const rarityColors: Record<string, { border: string; glow: string; badge: string; ring: string }> = {
    common:    { border: "border-slate-400/40",  glow: "rgba(148,163,184,0.15)", badge: "bg-slate-500/20 text-slate-300",   ring: "#94a3b8" },
    rare:      { border: "border-blue-400/50",   glow: "rgba(59,130,246,0.25)",  badge: "bg-blue-500/20 text-blue-300",    ring: "#3b82f6" },
    epic:      { border: "border-purple-400/60", glow: "rgba(168,85,247,0.30)",  badge: "bg-purple-500/20 text-purple-300",ring: "#a855f7" },
    legendary: { border: "border-yellow-400/70", glow: "rgba(234,179,8,0.35)",   badge: "bg-yellow-500/20 text-yellow-300",ring: "#eab308" },
  };
  const r = rarityColors[achievement.rarity || "common"];

  return (
    <>
      <style>{`
        @keyframes achBgIn    { from { opacity: 0 } to { opacity: 1 } }
        @keyframes achBgOut   { from { opacity: 1 } to { opacity: 0 } }
        @keyframes achCardIn  { from { opacity: 0; transform: scale(0.7) translateY(40px) } to { opacity: 1; transform: scale(1) translateY(0) } }
        @keyframes achCardOut { from { opacity: 1; transform: scale(1) translateY(0) } to { opacity: 0; transform: scale(0.85) translateY(20px) } }
        @keyframes achIconPop { 0% { transform: scale(0) rotate(-20deg) } 60% { transform: scale(1.3) rotate(5deg) } 100% { transform: scale(1) rotate(0deg) } }
        @keyframes achShine   { from { left: -100% } to { left: 200% } }
        @keyframes achPulse   { 0%,100% { box-shadow: 0 0 0 0 ${r.ring}40 } 50% { box-shadow: 0 0 0 16px ${r.ring}00 } }
      `}</style>

      <div
        className="fixed inset-0 z-[200]"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", animation: visible ? "achBgIn 0.3s ease forwards" : "achBgOut 0.35s ease forwards" }}
        onClick={() => handleClose(false)}
      />

      <div
        className={`fixed z-[201] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[380px] rounded-3xl border ${r.border} overflow-hidden`}
        style={{
          background: "linear-gradient(145deg, rgba(10,12,28,0.98) 0%, rgba(15,8,35,0.98) 100%)",
          boxShadow: `0 40px 80px rgba(0,0,0,0.8), 0 0 60px ${r.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
          animation: visible ? "achCardIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" : "achCardOut 0.35s cubic-bezier(0.4,0,0.2,1) forwards",
        }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-0 bottom-0 w-16 skew-x-12 opacity-20"
            style={{ background: "linear-gradient(90deg, transparent, white, transparent)", animation: "achShine 2s ease 0.6s forwards", left: "-100%" }} />
        </div>
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${r.ring}, transparent)` }} />
        <div className="p-8 text-center">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5 ${r.badge}`}>
            🏆 Achievement Unlocked
          </div>
          <div className="text-6xl mb-4 mx-auto w-24 h-24 rounded-2xl flex items-center justify-center"
            style={{ background: `radial-gradient(circle, ${r.glow.replace("0.3","0.15")} 0%, transparent 70%)`, border: `2px solid ${r.ring}40`, animation: "achIconPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both, achPulse 2s ease 1s infinite" }}>
            {achievement.icon}
          </div>
          <div className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 ${r.badge}`}>{achievement.rarity}</div>
          <h2 className="text-2xl font-black text-white mb-2">{achievement.name}</h2>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">{achievement.desc}</p>
          {achievement.reward > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 mb-5">
              <span className="text-lg">⚡</span>
              <span className="text-sm font-bold text-green-400">+{achievement.reward} Bonus Points Earned!</span>
            </div>
          )}
          <button onClick={() => handleClose(true)} className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-80"
            style={{ background: `linear-gradient(135deg, ${r.ring}80, ${r.ring}40)`, border: `1px solid ${r.ring}50` }}>
            Awesome! 🎉
          </button>
        </div>
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${r.ring}60, transparent)` }} />
      </div>
    </>
  );
}

// ── Main App Component ────────────────────────────────────────
function AppContent() {
  const location = useLocation();

  const [points, setPoints]                 = useState(0);
  const [questionsLeft, setQuestionsLeft]   = useState(15);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [streak, setStreak]                 = useState(0);
  const [totalXP, setTotalXP]               = useState(0);
  const [isPremium, setIsPremium]           = useState(false);
  const [premiumExpiresAt, setPremiumExpiresAt] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn]         = useState(false);
  const [userId, setUserId]                 = useState("");
  const [userName, setUserName]             = useState("");
  const [loading, setLoading]               = useState(true);

  // ── AI Study OS — Learner Onboarding ─────────────────────
  const [showLearnerOnboarding, setShowLearnerOnboarding] = useState(false);

  // ── Onboarding Tour ───────────────────────────────────────
  const [showOnboarding, setShowOnboarding] = useState(false);

  // ── Streak celebration ────────────────────────────────────
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [celebrationStreak, setCelebrationStreak]         = useState(0);

  // ── Achievements ─────────────────────────────────────────
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalQuestionsAsked: 0, totalPPTsGenerated: 0, totalPDFsConverted: 0,
    totalQuizCompleted: 0, totalChallengesCompleted: 0, totalChallengesCorrect: 0,
    totalNotesCreated: 0, totalStudyToolsUsed: 0, totalDaysActive: 0,
    referrals: 0, formulaBookmarksCount: 0,
  });

  const [toastQueue, setToastQueue]             = useState<any[]>([]);
  const [toastAchievement, setToastAchievement] = useState<any>(null);
  const [pendingAchievements, setPendingAchievements] = useState<any[]>([]);
  const [claimedAchievement,  setClaimedAchievement]  = useState<any>(null);

  const pointsRef    = useRef(points);
  const streakRef    = useRef(streak);
  const userStatsRef = useRef(userStats);
  const unlockedRef  = useRef(unlockedAchievements);

  useEffect(() => { pointsRef.current    = points;               }, [points]);
  useEffect(() => { streakRef.current    = streak;               }, [streak]);
  useEffect(() => { userStatsRef.current = userStats;            }, [userStats]);
  useEffect(() => { unlockedRef.current  = unlockedAchievements; }, [unlockedAchievements]);

  useEffect(() => {
    if (!toastAchievement && toastQueue.length > 0 && !loading && !showOnboarding) {
      const timer = setTimeout(() => {
        setToastAchievement(toastQueue[0]);
        setToastQueue(prev => prev.slice(1));
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [toastAchievement, toastQueue, loading, showOnboarding]);

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

        const premExpiry = (user as any).premiumExpiresAt;
        const premActive = (user as any).isPremium === true && premExpiry && new Date(premExpiry) > new Date();
        setIsPremium(!!premActive);
        setPremiumExpiresAt(premExpiry || null);
        setQuestionsLeft(user.questionsLeft);
        setStreak(user.streak || 0);

        const brainSetupDone  = !!(user as any).brainSetupCompleted;
        const productTourDone = !!(user as any).onboardingCompleted;

        if (productTourDone && !brainSetupDone) {
          setTimeout(() => setShowLearnerOnboarding(true), 2000);
        }

        const dbSaysDone    = !!(user as any).onboardingCompleted;
        const localSaysDone = hasCompletedOnboardingLocally(user._id);
        const shouldShowTour = !dbSaysDone && !localSaysDone;
        if (shouldShowTour) {
          setTimeout(() => setShowOnboarding(true), 1400);
        }

        getRecentActivity().then((d) => { if (d.success) setRecentActivity(d.activities); });

        // Stage 4 — fire login progress event (non-blocking)
        import("./utils/progress-api").then(({ trackProgressEvent }) => {
          trackProgressEvent("login").catch(() => {});
        }).catch(() => {});

        const streakDelay = shouldShowTour ? 0 : 1500;
        const streakCelebration = sessionStorage.getItem("streakCelebration");
        const loginBonus        = sessionStorage.getItem("loginBonus");
        if (streakCelebration) {
          const info = JSON.parse(streakCelebration);
          setCelebrationStreak(info.currentStreak);
          if (!shouldShowTour) setTimeout(() => setShowStreakCelebration(true), streakDelay);
          sessionStorage.removeItem("streakCelebration");
        }
        if (loginBonus) sessionStorage.removeItem("loginBonus");

        const streakInfoFromMe = (user as any)._streakInfo;
        if (!streakCelebration && streakInfoFromMe?.streakIncreased) {
          setCelebrationStreak(streakInfoFromMe.currentStreak);
          setPoints(user.points);
          setTotalXP((user as any).totalXP || user.points);
          if (!shouldShowTour) setTimeout(() => setShowStreakCelebration(true), streakDelay);
        }
        if (!streakCelebration && !streakInfoFromMe?.streakIncreased) {
          checkStreak().catch(console.error);
        }

        getAchievements().then((d) => {
          if (d.success) {
            const unlocked = d.unlockedAchievements || [];
            const stats: UserStats = {
              totalQuestionsAsked:      d.totalQuestionsAsked      || 0,
              totalPPTsGenerated:       d.totalPPTsGenerated       || 0,
              totalPDFsConverted:       d.totalPDFsConverted       || 0,
              totalQuizCompleted:       d.totalQuizCompleted       || 0,
              totalChallengesCompleted: d.totalChallengesCompleted  || 0,
              totalChallengesCorrect:   d.totalChallengesCorrect   || 0,
              totalNotesCreated:        d.totalNotesCreated        || 0,
              totalStudyToolsUsed:      d.totalStudyToolsUsed      || 0,
              totalDaysActive:          d.totalDaysActive          || 0,
              referrals:                d.totalReferrals           || 0,
              formulaBookmarksCount:    (d.formulaBookmarks || []).length,
            };
            setUnlockedAchievements(unlocked);
            unlockedRef.current  = unlocked;
            setUserStats(stats);
            userStatsRef.current = stats;
            setTimeout(() => {
              checkAndUnlockAchievements({ ...stats, points: user.points, streak: user.streak || 0 });
            }, 1800);
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

  const checkAndUnlockAchievements = useCallback(async (
    override?: Partial<UserStats & { points: number; streak: number }>
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const currentPoints   = override?.points ?? pointsRef.current;
    const currentStreak   = override?.streak ?? streakRef.current;
    const currentStats    = { ...userStatsRef.current, ...override };
    const currentUnlocked = [...unlockedRef.current];
    const hasActivity = currentPoints > 0 || currentStreak > 0 ||
      Object.values(currentStats).some(v => (v as number) > 0);
    if (!hasActivity) return;
    const statMap: Record<string, number> = {
      totalQuestionsAsked:      currentStats.totalQuestionsAsked      || 0,
      totalPPTsGenerated:       currentStats.totalPPTsGenerated       || 0,
      totalPDFsConverted:       currentStats.totalPDFsConverted       || 0,
      totalQuizCompleted:       currentStats.totalQuizCompleted       || 0,
      totalChallengesCompleted: currentStats.totalChallengesCompleted  || 0,
      totalChallengesCorrect:   currentStats.totalChallengesCorrect   || 0,
      totalNotesCreated:        currentStats.totalNotesCreated        || 0,
      totalStudyToolsUsed:      currentStats.totalStudyToolsUsed      || 0,
      totalDaysActive:          currentStats.totalDaysActive          || 0,
      referrals:                currentStats.referrals                || 0,
      totalFormulaBookmarks:    currentStats.formulaBookmarksCount    || 0,
      streak:                   currentStreak                         || 0,
      points:                   currentPoints                         || 0,
    };
    const toUnlock = ACHIEVEMENTS.filter(ach => {
      if (currentUnlocked.includes(ach.id)) return false;
      return (statMap[ach.stat] ?? 0) >= ach.threshold;
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
      } catch (e) { console.error("unlock error", ach.id, e); }
    }
    if (newlyUnlocked.length > 0) {
      setToastQueue(prev => [...prev, ...newlyUnlocked]);
      setPendingAchievements(prev => [...prev, ...newlyUnlocked]);
    }
  }, []);

  const checkStreak = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${import.meta.env.VITE_API_URL as string}/api/user/update-streak`, {
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
    } catch (err) { console.error("Streak check error:", err); }
  };

  const addPoints = async (amount: number) => {
    const newPoints = pointsRef.current + amount;
    setPoints(newPoints);
    setTotalXP(prev => prev + amount);
    checkAndUnlockAchievements({ points: newPoints });
  };

  const useQuestion = () => setQuestionsLeft((prev) => Math.max(0, prev - 1));

  const logActivity = async (action: string, details: string, pointsEarned: number) => {
    const newActivity = { _id: Date.now().toString(), action, details, pointsEarned, timestamp: new Date().toISOString() };
    setRecentActivity((prev) => [newActivity, ...prev].slice(0, 10));
    await logActivityAPI(action, details, pointsEarned);
    setUserStats(prev => {
      const next = { ...prev };
      if (action === "quiz_completed")  next.totalQuizCompleted    = (prev.totalQuizCompleted    || 0) + 1;
      if (action === "note_created")    next.totalNotesCreated     = (prev.totalNotesCreated     || 0) + 1;
      if (action === "improve_notes" || action === "analyze_pdf") next.totalStudyToolsUsed = (prev.totalStudyToolsUsed || 0) + 1;
      return next;
    });
  };

  const refreshQuota = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL as string}/api/ai/quota`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success && data.questionsLeft !== undefined) setQuestionsLeft(data.questionsLeft);
    } catch {}
  };

  const resetProgress = () => { setPoints(0); setQuestionsLeft(15); setRecentActivity([]); };

  const shouldShowCelebration = showStreakCelebration && location.pathname.startsWith("/app") && !loading;

  // ── Stage 7: Retention Engine Hook ───────────────────────
  const retention = useRetention(isLoggedIn);

  const handleRetentionCta = (action: string) => {
    if (action === "streak_save" || action === "streak_recovery") {
      retention.handleSaveStreak();
    } else if (action === "comeback") {
      retention.closeComebackScreen();
    } else if (action === "achievements") {
      window.location.hash = "/app/profile";
    } else if (action === "mentor") {
      window.location.hash = "/app/mentor";
    } else {
      window.location.hash = "/app";
    }
  };

  return (
    <>
      <CursorSpotlight />
      <LoadingScreen show={loading} />

      {shouldShowCelebration && (
        <StreakCelebration streak={celebrationStreak} show={true} onClose={() => setShowStreakCelebration(false)} />
      )}

      <PWAInstallPrompt />

      {/* Corner pill — subtle, non-intrusive, fires on any page */}
      {toastAchievement && location.pathname.startsWith("/app") && (
        <AchievementCornerPill achievement={toastAchievement} onClose={() => setToastAchievement(null)} />
      )}

      {/* Full dramatic toast — only fires when user CLAIMS from notification bell */}
      {claimedAchievement && location.pathname.startsWith("/app") && (
        <AchievementToast achievement={claimedAchievement} onClose={() => setClaimedAchievement(null)} />
      )}

      <AppContext.Provider
        value={{
          points, totalXP, isPremium, premiumExpiresAt, streak, questionsLeft,
          setQuestionsLeft, refreshQuota, isLoggedIn, setIsLoggedIn, addPoints,
          useQuestion, userId, userName, resetProgress, recentActivity, logActivity,
          loading, unlockedAchievements, userStats, checkAndUnlockAchievements,
          setUnlockedAchievements, setUserStats,
          pendingAchievements,
          setPendingAchievements: (achs: any[]) => setPendingAchievements(achs),
        }}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/google-welcome" element={<GoogleWelcome />} />

          {/* AI Study OS — Standalone Onboarding route */}
          <Route path="/onboarding" element={<Onboarding />} />

          {/* CodeLearn — public routes */}
          <Route path="/codelearn" element={<CodeLearnHome />} />
          <Route path="/codelearn/:language" element={<CoursePage />} />
          <Route path="/codelearn/:language/certificate" element={<CertificatePage />} />

          <Route path="/app" element={<ProtectedRoute><DashboardLayout onClaimAchievement={(ach: any) => setClaimedAchievement(ach)} /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="ask"         element={<AskAI />} />
            <Route path="ppt"         element={<PPTGenerator />} />
            <Route path="pdf"         element={<PDFTools />} />
            <Route path="rewards"     element={<Rewards />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="profile"     element={<Profile />} />
            <Route path="refer"       element={<ReferFriends />} />
            <Route path="points-history" element={<PointsHistory />} />
            <Route path="quiz"        element={<QuizGenerator />} />
            <Route path="planner"     element={<StudyPlanner />} />
            <Route path="challenge"   element={<DailyChallenge />} />
            <Route path="analytics"   element={<Analytics />} />
            <Route path="formulas"    element={<FormulaSheet />} />
            <Route path="study-tools" element={<StudyTools />} />
            <Route path="notes"       element={<CollabNotes />} />
            <Route path="notes/shared/:code" element={<CollabNotes />} />
            {/* AI Study OS — Brain Dashboard */}
            <Route path="brain"       element={<BrainDashboard />} />
            {/* ── Stage 6: AI Mentor ───────────────────────── */}
            <Route path="mentor"      element={<AIMentor />} />
          </Route>
        </Routes>

        {/* ── Product Onboarding Tour ───────────────────────── */}
        {showOnboarding && !loading && location.pathname.startsWith("/app") && (
          <OnboardingTour onComplete={() => {
            setShowOnboarding(false);
            setTimeout(() => setShowStreakCelebration(prev => celebrationStreak > 0 ? true : prev), 800);
          }} />
        )}

        {/* ── AI Study OS: Learner Onboarding Modal ────────── */}
        {showLearnerOnboarding && !loading && !showOnboarding && location.pathname.startsWith("/app") && (
          <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-slate-950 rounded-3xl border border-slate-700 overflow-y-auto max-h-[90vh]">
              <Onboarding
                onComplete={() => {
                  setShowLearnerOnboarding(false);
                }}
              />
            </div>
          </div>
        )}

        {/* ── Stage 7: Retention Engine UI ─────────────────── */}
        {/* Only show inside /app routes, not on login/landing */}
        {location.pathname.startsWith("/app") && !loading && (
          <>
            {/* 1. Streak Alert Popup — floats at bottom when streak at risk */}
            {retention.showAlertPopup && (
              <StreakAlertPopup
                urgency={retention.urgency}
                onSaveStreak={retention.handleSaveStreak}
                onDismiss={retention.closeAlertPopup}
              />
            )}

            {/* 2. Streak Recovery UI — full modal when streak is broken */}
            {retention.showRecoveryUI && retention.recovery && (
              <StreakRecoveryUI
                recovery={retention.recovery}
                onComplete={retention.handleCompleteRecovery}
                onDismiss={retention.closeRecoveryUI}
              />
            )}

            {/* 3. Comeback Screen — for users back after 48h+ */}
            {retention.showComebackScreen && retention.comeback && retention.comeback.intensity !== "none" && (
              <ComebackScreen
                plan={retention.comeback}
                onStartTask={retention.handleStartComebackTask}
                onDismiss={retention.closeComebackScreen}
              />
            )}

            {/* 4. Notification Panel — slide-in from right */}
            <NotificationPanel
              isOpen={retention.showNotifPanel}
              onClose={retention.closeNotifPanel}
              onCtaClick={handleRetentionCta}
            />
          </>
        )}
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