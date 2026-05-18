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

  const handleClose = useCallback(() => {
    setLeaving(true);
    setTimeout(onClose, 320);
  }, [onClose]);

  useEffect(() => {
    playAchievementSFX(achievement.rarity || 'common');
    const auto = setTimeout(handleClose, 5000);
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
          <button onClick={handleClose} style={{
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

// ─── Achievement SFX Engine — Web Audio API, zero external files ─────────────
// Each rarity has a completely different sonic character:
//   common    → soft bell chime (single sine tone, quick decay)
//   rare      → rising crystal arpeggio (3 ascending tones)
//   epic      → power chord hit + shimmer (sawtooth + reverb tail)
//   legendary → full cinematic fanfare (multi-layer orchestral swell)
function playAchievementSFX(rarity: string) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.01);

    const now = ctx.currentTime;

    if (rarity === 'common') {
      // Soft bell: single sine tone, fast attack, slow decay
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);
      g.gain.setValueAtTime(0.5, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(g); g.connect(masterGain);
      osc.start(now); osc.stop(now + 1.2);
    }

    else if (rarity === 'rare') {
      // Crystal arpeggio: 3 ascending sine tones with sparkle
      [[523.25, 0], [659.25, 0.12], [783.99, 0.24]].forEach(([freq, delay]) => {
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);
        g.gain.setValueAtTime(0, now + delay);
        g.gain.linearRampToValueAtTime(0.45, now + delay + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.9);
        osc.connect(g); g.connect(masterGain);
        osc.start(now + delay); osc.stop(now + delay + 0.9);
      });
      // High shimmer layer
      const shimmer = ctx.createOscillator();
      const sg = ctx.createGain();
      shimmer.type = 'triangle';
      shimmer.frequency.setValueAtTime(2093, now + 0.3);
      sg.gain.setValueAtTime(0.15, now + 0.3);
      sg.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
      shimmer.connect(sg); sg.connect(masterGain);
      shimmer.start(now + 0.3); shimmer.stop(now + 1.4);
    }

    else if (rarity === 'epic') {
      // Power chord: sawtooth root + fifth + octave, reverb-style echo
      const notes = [220, 329.63, 440, 554.37];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        // Slight detune for fatness
        osc.detune.setValueAtTime(i * 4, now);
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.2, now + 0.05);
        g.gain.setValueAtTime(0.2, now + 0.3);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        osc.connect(g); g.connect(masterGain);
        osc.start(now); osc.stop(now + 1.8);
      });
      // Metallic shimmer tail
      [[1760, 0.15], [2093, 0.25], [2637, 0.35]].forEach(([freq, delay]) => {
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + delay);
        g.gain.setValueAtTime(0.12, now + delay);
        g.gain.exponentialRampToValueAtTime(0.001, now + delay + 1.0);
        osc.connect(g); g.connect(masterGain);
        osc.start(now + delay); osc.stop(now + delay + 1.0);
      });
    }

    else {
      // LEGENDARY — cinematic multi-layer fanfare
      // Layer 1: Deep bass boom
      const bass = ctx.createOscillator();
      const bg   = ctx.createGain();
      bass.type = 'sine';
      bass.frequency.setValueAtTime(55, now);
      bass.frequency.exponentialRampToValueAtTime(110, now + 0.3);
      bg.gain.setValueAtTime(0.7, now);
      bg.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      bass.connect(bg); bg.connect(masterGain);
      bass.start(now); bass.stop(now + 0.8);

      // Layer 2: Heroic brass chord sweep
      [[261.63, 0.1], [329.63, 0.15], [392.00, 0.2], [523.25, 0.25]].forEach(([freq, delay]) => {
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq * 0.5, now + delay);
        osc.frequency.exponentialRampToValueAtTime(freq, now + delay + 0.15);
        g.gain.setValueAtTime(0, now + delay);
        g.gain.linearRampToValueAtTime(0.25, now + delay + 0.12);
        g.gain.setValueAtTime(0.25, now + delay + 0.5);
        g.gain.exponentialRampToValueAtTime(0.001, now + delay + 2.0);
        osc.connect(g); g.connect(masterGain);
        osc.start(now + delay); osc.stop(now + delay + 2.0);
      });

      // Layer 3: High glittering arpeggio cascade
      [[1046.5,0.35],[1318.5,0.45],[1567.98,0.55],[2093,0.65],[2637,0.75],[3136,0.85]].forEach(([freq, delay]) => {
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + delay);
        g.gain.setValueAtTime(0.18, now + delay);
        g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.8);
        osc.connect(g); g.connect(masterGain);
        osc.start(now + delay); osc.stop(now + delay + 0.8);
      });

      // Layer 4: Victory stab at peak
      [[523.25,0.5],[659.25,0.5],[783.99,0.5],[1046.5,0.5]].forEach(([freq, delay]) => {
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + delay);
        osc.detune.setValueAtTime(5, now + delay);
        g.gain.setValueAtTime(0.12, now + delay);
        g.gain.exponentialRampToValueAtTime(0.001, now + delay + 1.2);
        osc.connect(g); g.connect(masterGain);
        osc.start(now + delay); osc.stop(now + delay + 1.2);
      });

      // Layer 5: Noise burst for drama
      const bufSize   = ctx.sampleRate * 0.15;
      const buffer    = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data      = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
      const noise     = ctx.createBufferSource();
      const noiseGain = ctx.createGain();
      const noiseFilt = ctx.createBiquadFilter();
      noiseFilt.type            = 'bandpass';
      noiseFilt.frequency.value = 2000;
      noiseFilt.Q.value         = 0.5;
      noise.buffer = buffer;
      noiseGain.gain.setValueAtTime(0.4, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      noise.connect(noiseFilt); noiseFilt.connect(noiseGain); noiseGain.connect(masterGain);
      noise.start(now);

      // Layer 6: Choir-like sustained swell
      [[392.00,0.6],[523.25,0.6],[659.25,0.6]].forEach(([freq, delay]) => {
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);
        g.gain.setValueAtTime(0, now + delay);
        g.gain.linearRampToValueAtTime(0.2, now + delay + 0.4);
        g.gain.setValueAtTime(0.2, now + delay + 0.6);
        g.gain.exponentialRampToValueAtTime(0.001, now + delay + 2.5);
        osc.connect(g); g.connect(masterGain);
        osc.start(now + delay); osc.stop(now + delay + 2.5);
      });
    }

    // Auto-close AudioContext after all sounds finish
    const duration = rarity === 'legendary' ? 3.5 : rarity === 'epic' ? 2.2 : 1.6;
    setTimeout(() => ctx.close(), duration * 1000 + 200);
  } catch {
    // AudioContext blocked (no user gesture yet) — silently skip
  }
}
// ─────────────────────────────────────────────────────────────────────────────

function AchievementToast({ achievement, onClose }: { achievement: any; onClose: () => void }) {
  const [visible, setVisible] = useState(true);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 350);
  }, [onClose]);

  useEffect(() => {
    // Fire SFX immediately when toast mounts
    playAchievementSFX(achievement.rarity || 'common');
    const t = setTimeout(handleClose, 6000);
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
        onClick={handleClose}
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
          <button onClick={handleClose} className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-80"
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
    if (newlyUnlocked.length > 0) setToastQueue(prev => [...prev, ...newlyUnlocked]);
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

      {toastAchievement && location.pathname.startsWith("/app") && (
        (location.pathname === "/app" || location.pathname === "/app/")
          ? <AchievementToast achievement={toastAchievement} onClose={() => setToastAchievement(null)} />
          : <AchievementCornerPill achievement={toastAchievement} onClose={() => setToastAchievement(null)} />
      )}

      <AppContext.Provider
        value={{
          points, totalXP, isPremium, premiumExpiresAt, streak, questionsLeft,
          setQuestionsLeft, refreshQuota, isLoggedIn, setIsLoggedIn, addPoints,
          useQuestion, userId, userName, resetProgress, recentActivity, logActivity,
          loading, unlockedAchievements, userStats, checkAndUnlockAchievements,
          setUnlockedAchievements, setUserStats,
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

          <Route path="/app" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
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