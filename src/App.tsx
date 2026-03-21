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

// ── Achievement Unlocked — Center Modal ──────────────────────
function AchievementToast({ achievement, onClose }: { achievement: any; onClose: () => void }) {
  const [visible, setVisible] = useState(true);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 350); // wait for exit animation
  }, [onClose]);

  useEffect(() => {
    const t = setTimeout(handleClose, 5000);
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

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200]"
        style={{
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)",
          animation: visible ? "achBgIn 0.3s ease forwards" : "achBgOut 0.35s ease forwards",
        }}
        onClick={handleClose}
      />

      {/* Card */}
      <div
        className={`fixed z-[201] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[380px] rounded-3xl border ${r.border} overflow-hidden`}
        style={{
          background: "linear-gradient(145deg, rgba(10,12,28,0.98) 0%, rgba(15,8,35,0.98) 100%)",
          boxShadow: `0 40px 80px rgba(0,0,0,0.8), 0 0 60px ${r.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
          animation: visible
            ? "achCardIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards"
            : "achCardOut 0.35s cubic-bezier(0.4,0,0.2,1) forwards",
        }}
      >
        {/* Shine sweep */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-0 bottom-0 w-16 skew-x-12 opacity-20"
            style={{ background: "linear-gradient(90deg, transparent, white, transparent)", animation: "achShine 2s ease 0.6s forwards", left: "-100%" }} />
        </div>

        {/* Top glow bar */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${r.ring}, transparent)` }} />

        <div className="p-8 text-center">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5 ${r.badge}`}>
            🏆 Achievement Unlocked
          </div>

          <div
            className="text-6xl mb-4 mx-auto w-24 h-24 rounded-2xl flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, ${r.glow.replace("0.3","0.15")} 0%, transparent 70%)`,
              border: `2px solid ${r.ring}40`,
              animation: "achIconPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both, achPulse 2s ease 1s infinite",
            }}
          >
            {achievement.icon}
          </div>

          <div className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 ${r.badge}`}>
            {achievement.rarity}
          </div>

          <h2 className="text-2xl font-black text-white mb-2">{achievement.name}</h2>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">{achievement.desc}</p>

          {achievement.reward > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 mb-5">
              <span className="text-lg">⚡</span>
              <span className="text-sm font-bold text-green-400">+{achievement.reward} Bonus Points Earned!</span>
            </div>
          )}

          <button
            onClick={handleClose}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-80"
            style={{ background: `linear-gradient(135deg, ${r.ring}80, ${r.ring}40)`, border: `1px solid ${r.ring}50` }}
          >
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

  // ── Core state ───────────────────────────────────────────
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

  // ── Streak celebration ────────────────────────────────────
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [celebrationStreak, setCelebrationStreak]         = useState(0);

  // ── Achievements ─────────────────────────────────────────
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalQuestionsAsked: 0,
    totalPPTsGenerated: 0,
    totalPDFsConverted: 0,
    totalQuizCompleted: 0,
    totalChallengesCompleted: 0,
    totalChallengesCorrect: 0,
    totalNotesCreated: 0,
    totalStudyToolsUsed: 0,
    totalDaysActive: 0,
    referrals: 0,
    formulaBookmarksCount: 0,
  });

  // ── Achievement toast queue ───────────────────────────────
  const [toastQueue, setToastQueue]           = useState<any[]>([]);
  const [toastAchievement, setToastAchievement] = useState<any>(null);

  // ── Refs — always latest values in callbacks ──────────────
  const pointsRef    = useRef(points);
  const streakRef    = useRef(streak);
  const userStatsRef = useRef(userStats);
  const unlockedRef  = useRef(unlockedAchievements);

  useEffect(() => { pointsRef.current    = points;               }, [points]);
  useEffect(() => { streakRef.current    = streak;               }, [streak]);
  useEffect(() => { userStatsRef.current = userStats;            }, [userStats]);
  useEffect(() => { unlockedRef.current  = unlockedAchievements; }, [unlockedAchievements]);

  // ── Toast queue processor ─────────────────────────────────
  useEffect(() => {
    if (!toastAchievement && toastQueue.length > 0 && !loading) {
      const timer = setTimeout(() => {
        setToastAchievement(toastQueue[0]);
        setToastQueue(prev => prev.slice(1));
      }, 400); // small gap between consecutive toasts
      return () => clearTimeout(timer);
    }
  }, [toastAchievement, toastQueue, loading]);

  useEffect(() => { loadUserData(); }, []);

  // ── Load user data from server ────────────────────────────
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

        getRecentActivity().then((d) => { if (d.success) setRecentActivity(d.activities); });

        // ── Streak Celebration — 3 layer guarantee ────────────
        const streakCelebration = sessionStorage.getItem("streakCelebration");
        const loginBonus        = sessionStorage.getItem("loginBonus");
        if (streakCelebration) {
          const info = JSON.parse(streakCelebration);
          setCelebrationStreak(info.currentStreak);
          setTimeout(() => setShowStreakCelebration(true), 1500);
          sessionStorage.removeItem("streakCelebration");
        }
        if (loginBonus) sessionStorage.removeItem("loginBonus");

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

        // ── Load achievements + check for newly eligible ──────
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
              checkAndUnlockAchievements({
                ...stats,
                points: user.points,
                streak: user.streak || 0,
              });
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

  // ── Check & unlock achievements ───────────────────────────
  const checkAndUnlockAchievements = useCallback(async (
    override?: Partial<UserStats & { points: number; streak: number }>
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const currentPoints   = override?.points ?? pointsRef.current;
    const currentStreak   = override?.streak ?? streakRef.current;
    const currentStats    = { ...userStatsRef.current, ...override };
    const currentUnlocked = [...unlockedRef.current];

    // Skip if no activity yet
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
      formulaBookmarksCount:    currentStats.formulaBookmarksCount    || 0,
      streak:                   currentStreak                         || 0,
      points:                   currentPoints                         || 0,
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

  // ── Streak check (Layer 3 safety net) ────────────────────
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
    } catch (err) {
      console.error("Streak check error:", err);
    }
  };

  // ── Points — update UI + check achievements ───────────────
  const addPoints = async (amount: number) => {
    const newPoints = pointsRef.current + amount;
    setPoints(newPoints);
    setTotalXP(prev => prev + amount);
    checkAndUnlockAchievements({ points: newPoints });
  };

  // ── Question quota ────────────────────────────────────────
  const useQuestion = () => {
    setQuestionsLeft((prev) => Math.max(0, prev - 1));
  };

  // ── Activity log + auto-increment achievement counters ────
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

    // Auto-increment counters for achievement tracking
    setUserStats(prev => {
      const next = { ...prev };
      if (action === "quiz_completed")  next.totalQuizCompleted    = (prev.totalQuizCompleted    || 0) + 1;
      if (action === "note_created")    next.totalNotesCreated     = (prev.totalNotesCreated     || 0) + 1;
      if (action === "improve_notes" ||
          action === "analyze_pdf")     next.totalStudyToolsUsed   = (prev.totalStudyToolsUsed   || 0) + 1;
      return next;
    });
  };

  // ── Quota refresh ─────────────────────────────────────────
  const refreshQuota = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL as string}/api/ai/quota`, {
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
    setQuestionsLeft(15);
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
          <Route path="/google-welcome" element={<GoogleWelcome />} />

          {/* CodeLearn — public routes */}
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
            <Route path="points-history" element={<PointsHistory />} />
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