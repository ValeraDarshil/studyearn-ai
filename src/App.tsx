import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { AppContext } from "./context/AppContext";
import {
  getCurrentUser,
  updateUserPoints,
  useQuestion as useQuestionAPI,
  logActivity as logActivityAPI,
  getRecentActivity,
} from "./utils/user-api";
import { ReferFriends } from "./pages/ReferFriends";

// ✅ WRAPPER to check location before showing celebration
function AppContent() {
  const location = useLocation();
  const [points, setPoints] = useState(0);
  const [questionsLeft, setQuestionsLeft] = useState(5);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [celebrationStreak, setCelebrationStreak] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const user = await getCurrentUser();

      if (user) {
        setIsLoggedIn(true);
        setUserId(user._id);
        setPoints(user.points);
        setQuestionsLeft(user.questionsLeft);
        setStreak(user.streak || 0);

        getRecentActivity().then((activityData) => {
          if (activityData.success) {
            setRecentActivity(activityData.activities);
          }
        });

        // ✅ Check streak ONLY if logged in
        checkStreak().catch((err) =>
          console.error("Streak check failed:", err),
        );
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

  const checkStreak = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        "https://studyearn-backend.onrender.com/api/user/update-streak",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) return;

      const data = await res.json();
      if (data.success) {
        setStreak(data.streak);

        // ✅ ONLY show celebration if:
        // 1. Streak increased
        // 2. User is on /app route (dashboard area)
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
    setPoints((prev) => prev + amount);
    const result = await updateUserPoints(amount);
    if (result.success) {
      setPoints(result.points);
    }
  };

  const useQuestion = async () => {
    setQuestionsLeft((prev) => Math.max(0, prev - 1));
    const result = await useQuestionAPI();
    if (result.success) {
      setQuestionsLeft(result.questionsLeft);
    }
  };

  const logActivity = async (
    action: string,
    details: string,
    pointsEarned: number,
  ) => {
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

  // ✅ ONLY show celebration if on dashboard routes
  const shouldShowCelebration =
    showStreakCelebration && location.pathname.startsWith("/app");

  return (
    <>
      <LoadingScreen show={loading} />

      {/* ✅ Celebration ONLY in dashboard */}
      {shouldShowCelebration && (
        <StreakCelebration
          streak={celebrationStreak}
          show={true}
          onClose={() => setShowStreakCelebration(false)}
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
          resetProgress,
          recentActivity,
          logActivity,
          loading,
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
