import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Gift,
  Trophy,
  Zap,
  Star,
  TrendingUp,
  Target,
  Clock,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { achievements } from "../data/mockData";
import Lottie from "lottie-react";
import streakAnimation from "../assets/animations/streak-fire.json";

export function Rewards() {
  const navigate = useNavigate();
  const { points, streak, userId } = useApp();

  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  const withdrawalTarget = 5000;
  const progress = (points / withdrawalTarget) * 100;

  // ✅ CLICKABLE EARN METHODS with routes
  const earnMethods = [
    {
      icon: "💬",
      title: "Ask Questions",
      desc: "Earn 10 pts per question",
      pts: "10 pts",
      color: "from-blue-500/10 to-blue-600/10",
      route: "/app/ask",
      clickable: true,
    },
    {
      icon: "📊",
      title: "Generate PPT",
      desc: "Earn 25 pts per presentation",
      pts: "25 pts",
      color: "from-purple-500/10 to-purple-600/10",
      route: "/app/ppt",
      clickable: true,
    },
    {
      icon: "📄",
      title: "Use PDF Tools",
      desc: "Earn 5 pts per conversion",
      pts: "5 pts",
      color: "from-cyan-500/10 to-cyan-600/10",
      route: "/app/pdf",
      clickable: true,
    },
    {
      icon: "🔥",
      title: "Daily Streak",
      desc: "Bonus 50 pts for 7-day streak",
      pts: "50 pts",
      color: "from-orange-500/10 to-orange-600/10",
      route: null,
      clickable: false,
    },
    {
      icon: "👥",
      title: "Refer Friends",
      desc: "Earn 100 pts per referral",
      pts: "100 pts",
      color: "from-green-500/10 to-green-600/10",
      route: "/app/refer", // ✅ NEW PAGE
      clickable: true,
    },
    {
      icon: "🎯",
      title: "Daily Login",
      desc: "Earn 5 pts just for showing up",
      pts: "5 pts",
      color: "from-pink-500/10 to-pink-600/10",
      route: null,
      clickable: false,
    },
  ];

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const res = await fetch(
        "https://studyearn-backend.onrender.com/api/leaderboard/top?limit=3",
      );
      const data = await res.json();
      if (data.success) {
        setTopUsers(data.leaderboard);
      }
    } catch (err) {
      console.error("Leaderboard error:", err);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Gift className="w-6 h-6 text-pink-400" />
          My Rewards
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Track your points, streaks, and achievements
        </p>
      </div>

      {/* Points & Streak Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Big Points Card */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden">
          <div className="orb w-[200px] h-[200px] bg-purple-600 top-[-80px] right-[-80px]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-slate-400 font-medium">
                Total Points
              </span>
            </div>
            <div className="text-5xl font-black gradient-text mb-2">
              {points.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span>+340 this week</span>
            </div>
          </div>
        </div>

        {/* Animated Streak Card */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden">
          <div className="orb w-[200px] h-[200px] bg-orange-500 top-[-80px] right-[-80px]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Lottie
                animationData={streakAnimation}
                loop={true}
                style={{ width: 32, height: 32 }}
              />
              <span className="text-sm text-slate-400 font-medium">
                Current Streak
              </span>
            </div>
            <div className="text-5xl font-black gradient-text mb-2">
              {streak}
            </div>
            <div className="text-sm text-slate-400">
              day{streak !== 1 && "s"} in a row 🔥
            </div>
          </div>
        </div>
      </div>

      {/* Streak Progress Row */}
      <div className="glass rounded-2xl p-5 border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-red-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Lottie
                animationData={streakAnimation}
                loop={true}
                style={{ width: 40, height: 40 }}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {streak} Day Streak
                {streak >= 7 && <span className="text-sm">🏆</span>}
              </h3>
              <p className="text-sm text-slate-400">
                {streak === 0
                  ? "Start your streak today!"
                  : streak === 1
                    ? "Great start! Come back tomorrow!"
                    : streak < 7
                      ? `Keep going! ${7 - streak} days until bonus!`
                      : "Amazing! You earned the streak bonus! 🎉"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black gradient-text">
              {streak >= 7 ? "+50" : "—"}
            </div>
            <div className="text-xs text-slate-500">Bonus pts</div>
          </div>
        </div>

        {streak < 7 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Progress to 7-day bonus</span>
              <span>{streak}/7 days</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                style={{ width: `${(streak / 7) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Withdrawal Progress */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">
              Withdrawal Progress
            </h2>
          </div>
          <span className="text-sm font-bold gradient-text">
            {points.toLocaleString()} / {withdrawalTarget.toLocaleString()} pts
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden mb-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 progress-animate"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="text-xs text-slate-500">
          {withdrawalTarget - points > 0
            ? `${(withdrawalTarget - points).toLocaleString()} points until you can withdraw`
            : "You can withdraw now! 🎉"}
        </p>
      </div>

      {/* ✅ CLICKABLE Earn More Points */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Earn More Points
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {earnMethods.map((method) =>
            method.clickable ? (
              // ✅ CLICKABLE CARD
              <button
                key={method.title}
                onClick={() => navigate(method.route!)}
                className={`glass rounded-xl p-4 border border-white/5 hover:border-white/20 transition-all bg-gradient-to-br ${method.color} group cursor-pointer hover:scale-[1.02]`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{method.icon}</div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-semibold text-white mb-0.5 flex items-center gap-1">
                      {method.title}
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-xs text-slate-400">{method.desc}</div>
                  </div>
                  <div className="text-xs font-bold text-purple-400 flex-shrink-0">
                    {method.pts}
                  </div>
                </div>
              </button>
            ) : (
              // NON-CLICKABLE CARD (Auto rewards)
              <div
                key={method.title}
                className={`glass rounded-xl p-4 border border-white/5 transition-all bg-gradient-to-br ${method.color}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{method.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white mb-0.5">
                      {method.title}
                    </div>
                    <div className="text-xs text-slate-400">{method.desc}</div>
                  </div>
                  <div className="text-xs font-bold text-purple-400 flex-shrink-0">
                    {method.pts}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Achievements
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((badge) => (
            <div
              key={badge.id}
              className={`glass rounded-xl p-4 border transition-all ${
                badge.unlocked
                  ? "border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5 hover:border-purple-500/40"
                  : "border-white/5 opacity-40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl flex-shrink-0">{badge.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white mb-0.5">
                    {badge.name}
                  </div>
                  <p className="text-xs text-slate-500">{badge.description}</p>
                  {badge.unlocked && (
                    <span className="text-[10px] font-medium text-green-400">
                      ✓ Unlocked
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Leaderboard
          </h2>
          <a
            href="#/app/leaderboard"
            className="text-xs text-purple-400 flex items-center gap-1 hover:text-purple-300 transition-colors"
          >
            View all <ChevronRight className="w-3 h-3" />
          </a>
        </div>

        {loadingLeaderboard ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            Loading rankings...
          </div>
        ) : topUsers.length > 0 ? (
          <div className="space-y-2">
            {topUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    user.rank === 1
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                      : user.rank === 2
                        ? "bg-gradient-to-br from-slate-300 to-slate-400 text-white"
                        : "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
                  }`}
                >
                  {user.rank}
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {user.name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">
                    {user.name}
                  </div>
                </div>
                <span className="text-sm font-bold gradient-text">
                  {user.points.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">
            No rankings yet. Be the first!
          </div>
        )}

        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-slate-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">You</div>
              <div className="text-xs text-slate-500">
                Keep earning to climb!
              </div>
            </div>
            <span className="text-sm font-bold gradient-text">
              {points.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
