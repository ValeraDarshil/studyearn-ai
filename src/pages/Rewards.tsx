/**
 * StudyEarn AI — Rewards Page v2
 * Real redemption system: 5 tiers, history, delivery info
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Gift, Trophy, Zap, Star, TrendingUp, Target,
  Clock, ChevronRight, ArrowRight, CheckCircle,
  X, Loader2, History, AlertCircle, Sparkles,
  CreditCard, ShoppingBag,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import Lottie from "lottie-react";
import streakAnimation from "../assets/animations/streak-fire.json";
import { ACHIEVEMENTS, RARITY_STYLES } from "../data/achievements";
import { AnimatedNumber } from "../components/AnimatedNumber";

const API = import.meta.env.VITE_API_URL;

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface Tier {
  id: string;
  title: string;
  desc: string;
  pointsCost: number;
  type: "premium" | "voucher" | "giftcard";
  icon: string;
  available?: boolean;
}

interface Redemption {
  _id: string;
  rewardTitle: string;
  pointsCost: number;
  status: "pending" | "processing" | "fulfilled" | "rejected";
  deliveryInfo: string;
  createdAt: string;
  adminNote?: string;
}

// ─────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Redemption["status"] }) {
  const map = {
    pending:    { color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",  label: "⏳ Pending" },
    processing: { color: "bg-blue-500/15 text-blue-400 border-blue-500/20",        label: "🔄 Processing" },
    fulfilled:  { color: "bg-green-500/15 text-green-400 border-green-500/20",     label: "✅ Fulfilled" },
    rejected:   { color: "bg-red-500/15 text-red-400 border-red-500/20",           label: "❌ Rejected" },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${s.color}`}>
      {s.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export function Rewards() {
  const navigate  = useNavigate();
  const { points, streak, userId, unlockedAchievements, userStats, addPoints, isPremium, premiumExpiresAt } = useApp();

  const [tiers,      setTiers]      = useState<Tier[]>([]);
  const [history,    setHistory]    = useState<Redemption[]>([]);
  const [topUsers,   setTopUsers]   = useState<any[]>([]);
  const [activeTab,  setActiveTab]  = useState<"earn" | "redeem" | "history" | "achievements">("earn");
  const [loadingLB,  setLoadingLB]  = useState(true);

  // Premium status polling
  const [hasPending,        setHasPending]        = useState(false);
  const [pendingCreatedAt,  setPendingCreatedAt]   = useState<string | null>(null);
  const [premiumJustActivated, setPremiumJustActivated] = useState(false);

  // Redemption modal state
  const [selectedTier,   setSelectedTier]   = useState<Tier | null>(null);
  const [deliveryInfo,   setDeliveryInfo]   = useState("");
  const [redeeming,      setRedeeming]      = useState(false);
  const [redeemResult,   setRedeemResult]   = useState<{ success: boolean; message: string } | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadTiers();
    loadLeaderboard();
    if (token) {
      loadHistory();
      checkRewardStatus();
    }
  }, []);

  // ✅ Poll every 30s when there's a pending redemption
  useEffect(() => {
    if (!hasPending || !token) return;
    const interval = setInterval(() => {
      checkRewardStatus();
    }, 30_000);
    return () => clearInterval(interval);
  }, [hasPending, token]);

  const checkRewardStatus = async () => {
    try {
      const res  = await fetch(`${API}/api/rewards/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) return;

      setHasPending(data.hasPendingRedemption);
      if (data.pendingRedemption?.createdAt) {
        setPendingCreatedAt(data.pendingRedemption.createdAt);
      }

      // ✅ Premium just activated! Show celebration
      if (data.isPremium && !isPremium) {
        setPremiumJustActivated(true);
        loadHistory(); // refresh to show fulfilled status
        setTimeout(() => setPremiumJustActivated(false), 8000);
      }
    } catch {}
  };

  const loadTiers = async () => {
    try {
      const res  = await fetch(`${API}/api/rewards/tiers`);
      const data = await res.json();
      if (data.success) setTiers(data.tiers);
    } catch {}
  };

  const loadHistory = async () => {
    try {
      const res  = await fetch(`${API}/api/rewards/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setHistory(data.history);
    } catch {}
  };

  const loadLeaderboard = async () => {
    try {
      const res  = await fetch(`${API}/api/leaderboard/top?limit=3`);
      const data = await res.json();
      if (data.success) setTopUsers(data.leaderboard);
    } catch {} finally { setLoadingLB(false); }
  };

  const handleRedeem = async () => {
    if (!selectedTier) return;
    if (selectedTier.type !== "premium" && !deliveryInfo.trim()) {
      setRedeemResult({ success: false, message: "Please enter your UPI ID / email to receive the reward." });
      return;
    }
    setRedeeming(true); setRedeemResult(null);
    try {
      const res  = await fetch(`${API}/api/rewards/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rewardId: selectedTier.id, deliveryInfo }),
      });
      const data = await res.json();
      setRedeemResult({ success: data.success, message: data.message });
      if (data.success) {
        // ✅ Start polling immediately after redemption
        setHasPending(true);
        setPendingCreatedAt(new Date().toISOString());
        loadHistory();
        setDeliveryInfo("");
        // Check status after 1s to get pendingRedemption details
        setTimeout(checkRewardStatus, 1000);
      }
    } catch {
      setRedeemResult({ success: false, message: "Something went wrong. Please try again." });
    } finally { setRedeeming(false); }
  };

  const closeModal = () => {
    setSelectedTier(null); setDeliveryInfo(""); setRedeemResult(null);
  };

  // ── Derived ─────────────────────────────────────────────
  const nextTier     = tiers.find(t => t.pointsCost > points);
  const ptsToNext    = nextTier ? nextTier.pointsCost - points : 0;
  const topTier      = tiers[tiers.length - 1];
  const overallPct   = topTier ? Math.min((points / topTier.pointsCost) * 100, 100) : 0;
  const pendingCount = history.filter(h => ["pending","processing"].includes(h.status)).length;

  const EARN_METHODS = [
    { icon: "💬", title: "Ask AI",           desc: "10 pts per question",  pts: "+10", route: "/app/ask",       color: "from-blue-500/10 to-blue-600/10" },
    { icon: "📊", title: "Generate PPT",     desc: "20 pts per PPT",       pts: "+20", route: "/app/ppt",       color: "from-purple-500/10 to-purple-600/10" },
    { icon: "📄", title: "PDF Tools",        desc: "10 pts per action",    pts: "+10", route: "/app/pdf",       color: "from-cyan-500/10 to-cyan-600/10" },
    { icon: "🧪", title: "AI Quiz",          desc: "5 pts per correct",    pts: "+5",  route: "/app/quiz",      color: "from-violet-500/10 to-violet-600/10" },
    { icon: "🎯", title: "Daily Challenge",  desc: "Up to 35 pts/day",     pts: "+35", route: "/app/challenge", color: "from-orange-500/10 to-orange-600/10" },
    { icon: "👥", title: "Refer Friends",    desc: "100 pts per referral", pts: "+100",route: "/app/refer",     color: "from-green-500/10 to-green-600/10" },
    { icon: "📅", title: "Study Planner",    desc: "20 pts per plan",      pts: "+20", route: "/app/planner",   color: "from-teal-500/10 to-teal-600/10" },
    { icon: "🔥", title: "7-Day Streak",     desc: "50 bonus pts",         pts: "+50", route: null,             color: "from-red-500/10 to-red-600/10" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Gift className="w-6 h-6 text-pink-400" /> Rewards
        </h1>
        <p className="text-sm text-slate-400 mt-1">Earn points, unlock rewards, redeem real prizes</p>
      </div>

      {/* Points + Streak cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6 relative overflow-hidden border border-white/5">
          <div className="orb w-[200px] h-[200px] bg-purple-600 top-[-80px] right-[-80px]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-slate-400 font-medium">Total Points</span>
            </div>
            <div className="text-5xl font-black gradient-text mb-1">
              <AnimatedNumber value={points} />
            </div>
            {nextTier && (
              <p className="text-xs text-slate-500 mt-1">
                <span className="text-purple-300 font-semibold">{ptsToNext.toLocaleString()} pts</span> until {nextTier.icon} {nextTier.title}
              </p>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 relative overflow-hidden border border-white/5">
          <div className="orb w-[200px] h-[200px] bg-orange-500 top-[-80px] right-[-80px]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Lottie animationData={streakAnimation} loop style={{ width: 28, height: 28 }} />
              <span className="text-sm text-slate-400 font-medium">Day Streak</span>
            </div>
            <div className="text-5xl font-black gradient-text mb-1">{streak}</div>
            <p className="text-xs text-slate-500">
              {streak < 7 ? `${7 - streak} more days for 🔥 +50 pts bonus!` : "Amazing! Streak bonus earned 🏆"}
            </p>
          </div>
        </div>
      </div>

      {/* Progress towards tiers */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-white">Reward Progress</span>
          </div>
          <span className="text-xs text-slate-500">{points.toLocaleString()} pts</span>
        </div>
        {/* Tier dots */}
        <div className="relative mb-2">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
              style={{ width: `${overallPct}%` }} />
          </div>
          {tiers.map((t, i) => {
            const pos = (t.pointsCost / (topTier?.pointsCost || 1)) * 100;
            const done = points >= t.pointsCost;
            return (
              <div key={t.id} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${pos}%` }}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px]
                  ${done ? "bg-purple-500 border-purple-400" : "bg-slate-800 border-slate-600"}`}>
                  {done ? "✓" : ""}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-4">
          {tiers.map(t => (
            <div key={t.id} className="text-center flex-1">
              <div className={`text-base ${points >= t.pointsCost ? "grayscale-0" : "grayscale opacity-40"}`}>{t.icon}</div>
              <div className={`text-[9px] mt-0.5 ${points >= t.pointsCost ? "text-purple-300" : "text-slate-600"}`}>
                {t.pointsCost >= 1000 ? `${t.pointsCost/1000}k` : t.pointsCost}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/5 w-fit">
        {([
          { id: "earn",         label: "Earn" },
          { id: "redeem",       label: `Redeem${points >= 1000 ? " 🎁" : ""}` },
          { id: "history",      label: `History${pendingCount > 0 ? ` (${pendingCount})` : ""}` },
          { id: "achievements", label: `Badges ${unlockedAchievements.length}/${ACHIEVEMENTS.length}` },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap
              ${activeTab === tab.id ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── EARN TAB ─────────────────────────────────────── */}
      {activeTab === "earn" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EARN_METHODS.map(m => (
            m.route ? (
              <button key={m.title} onClick={() => navigate(m.route!)}
                className={`glass rounded-xl p-4 text-left border border-white/5 hover:border-white/15 bg-gradient-to-br ${m.color} hover:-translate-y-0.5 transition-all group`}>
                <div className="text-2xl mb-2">{m.icon}</div>
                <div className="text-sm font-bold text-white mb-0.5 flex items-center gap-1">
                  {m.title}
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs text-slate-500">{m.desc}</div>
                <div className="text-sm font-black text-purple-400 mt-2">{m.pts}</div>
              </button>
            ) : (
              <div key={m.title}
                className={`glass rounded-xl p-4 border border-white/5 bg-gradient-to-br ${m.color}`}>
                <div className="text-2xl mb-2">{m.icon}</div>
                <div className="text-sm font-bold text-white mb-0.5">{m.title}</div>
                <div className="text-xs text-slate-500">{m.desc}</div>
                <div className="text-sm font-black text-purple-400 mt-2">{m.pts}</div>
              </div>
            )
          ))}
        </div>
      )}

      {/* ── REDEEM TAB ───────────────────────────────────── */}
      {activeTab === "redeem" && (
        <div className="space-y-4">

          {/* ✅ Premium just activated celebration */}
          {premiumJustActivated && (
            <div className="rounded-2xl p-4 border border-yellow-500/30 bg-yellow-500/10 text-center animate-pulse">
              <div className="text-2xl mb-1">🎉</div>
              <p className="text-yellow-300 font-bold text-sm">Premium Activated!</p>
              <p className="text-yellow-400/70 text-xs mt-0.5">Reload the page to see your 10 questions/day & 2× points!</p>
            </div>
          )}

          {/* ✅ Active premium banner */}
          {isPremium && !premiumJustActivated && (
            <div className="rounded-2xl p-4 border border-purple-500/30 bg-purple-500/10 flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-purple-300 font-bold text-sm">Premium Active</p>
                <p className="text-purple-400/70 text-xs">
                  Expires: {premiumExpiresAt ? new Date(premiumExpiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  {" "}• 10 questions/day • 2× points ⚡
                </p>
              </div>
            </div>
          )}

          {/* ✅ Pending redemption countdown */}
          {hasPending && !isPremium && (
            <div className="rounded-2xl p-4 border border-orange-500/30 bg-orange-500/10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <p className="text-orange-300 font-bold text-sm">Premium Verification In Progress</p>
              </div>
              <p className="text-orange-400/70 text-xs">
                We're verifying your activity. Plan activates automatically within 30 minutes.
                {pendingCreatedAt && (() => {
                  const elapsed = Math.floor((Date.now() - new Date(pendingCreatedAt).getTime()) / 60000);
                  const remaining = Math.max(0, 30 - elapsed);
                  return remaining > 0 ? ` (~${remaining} min remaining)` : " Any moment now...";
                })()}
              </p>
            </div>
          )}

          <p className="text-xs text-slate-500">
            Click a reward to redeem. Points are deducted immediately. Premium activates within 30 minutes after verification.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiers.map(tier => {
              const isAvailable = (tier as any).available !== false; // tier_1000 only
              const canAfford = points >= tier.pointsCost;
              const canRedeem = isAvailable && canAfford;
              return (
                <div key={tier.id}
                  className={`rounded-2xl p-5 border transition-all relative overflow-hidden
                    ${canRedeem
                      ? "glass border-white/10 hover:border-purple-500/30 hover:-translate-y-0.5 cursor-pointer"
                      : isAvailable
                        ? "border-white/5 bg-white/[0.01] opacity-60 cursor-not-allowed"
                        : "border-white/5 bg-white/[0.01] cursor-not-allowed"}`}
                  onClick={() => canRedeem && setSelectedTier(tier)}>

                  {/* Coming Soon overlay for unavailable tiers */}
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl z-10"
                      style={{ background: "rgba(5,8,20,0.75)", backdropFilter: "blur(2px)" }}>
                      <div className="text-center px-3">
                        <div className="text-2xl mb-1">🔒</div>
                        <p className="text-xs font-bold text-slate-300">Coming Soon</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Stay tuned!</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{tier.icon}</span>
                    {isAvailable && canAfford && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 font-semibold">
                        Available ✓
                      </span>
                    )}
                    {isAvailable && !canAfford && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-500 font-semibold">
                        Locked
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{tier.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{tier.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-black ${canAfford && isAvailable ? "gradient-text" : "text-slate-600"}`}>
                      {tier.pointsCost.toLocaleString()} pts
                    </span>
                    {isAvailable && !canAfford && (
                      <span className="text-[10px] text-slate-600">
                        Need {(tier.pointsCost - points).toLocaleString()} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {tiers.length === 0 && (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
              <Loader2 className="w-6 h-6 text-slate-600 animate-spin mx-auto mb-2" />
              <p className="text-sm text-slate-500">Loading rewards…</p>
            </div>
          )}
        </div>
      )}

      {/* ── HISTORY TAB ──────────────────────────────────── */}
      {activeTab === "history" && (
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-10 text-center">
              <History className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No redemptions yet.</p>
              <p className="text-slate-600 text-xs mt-1">Redeem a reward to see history here.</p>
            </div>
          ) : (
            history.map(item => (
              <div key={item._id} className="glass rounded-xl p-4 border border-white/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold text-white">{item.rewardTitle}</span>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-xs text-slate-500">
                      {item.pointsCost.toLocaleString()} pts •{" "}
                      {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    {item.deliveryInfo && (
                      <p className="text-xs text-slate-600 mt-1">Delivery: {item.deliveryInfo}</p>
                    )}
                    {item.adminNote && (
                      <p className="text-xs text-blue-400 mt-1">📝 {item.adminNote}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── ACHIEVEMENTS TAB ─────────────────────────────── */}
      {activeTab === "achievements" && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map(ach => {
            const unlocked = unlockedAchievements.includes(ach.id);
            const styles   = RARITY_STYLES[ach.rarity];
            const statMap: Record<string, number> = {
              totalQuestionsAsked: userStats.totalQuestionsAsked,
              totalPPTsGenerated:  userStats.totalPPTsGenerated,
              totalPDFsConverted:  userStats.totalPDFsConverted,
              streak, points,
            };
            const val  = statMap[ach.stat] || 0;
            const prog = Math.min(100, Math.round((val / ach.threshold) * 100));
            return (
              <div key={ach.id}
                className={`relative glass rounded-xl p-4 border transition-all duration-300 overflow-hidden
                  ${unlocked ? `bg-gradient-to-br ${styles.bg} ${styles.border} hover:scale-[1.02]` : "border-white/5 hover:border-white/10"}`}>
                <div className="flex items-start gap-3">
                  <div className={`text-2xl flex-shrink-0 ${unlocked ? "" : "grayscale opacity-40"}`}>{ach.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span className={`text-xs font-bold ${unlocked ? "text-white" : "text-slate-500"}`}>{ach.name}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-semibold uppercase ${styles.badge}`}>{ach.rarity}</span>
                    </div>
                    <p className={`text-[10px] leading-snug ${unlocked ? "text-slate-400" : "text-slate-600"}`}>{ach.desc}</p>
                    {!unlocked && (
                      <div className="mt-1.5">
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-slate-600 to-slate-500"
                            style={{ width: `${prog}%` }} />
                        </div>
                        <span className="text-[9px] text-slate-600">{val}/{ach.threshold}</span>
                      </div>
                    )}
                    {unlocked && <span className="text-[9px] font-semibold text-green-400">✓ Unlocked{ach.reward > 0 ? ` · +${ach.reward}pts` : ""}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leaderboard preview (always visible at bottom) */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" /> Top Learners
          </h2>
          <button onClick={() => navigate("/app/leaderboard")}
            className="text-xs text-purple-400 flex items-center gap-1 hover:text-purple-300 transition-colors">
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {loadingLB ? (
          <div className="text-center py-6 text-slate-500 text-sm">Loading…</div>
        ) : topUsers.length > 0 ? (
          <div className="space-y-2">
            {topUsers.map(user => (
              <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black
                  ${user.rank === 1 ? "bg-yellow-400 text-black" : user.rank === 2 ? "bg-slate-300 text-black" : "bg-orange-600 text-white"}`}>
                  {user.rank}
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {user.name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{user.name}</div>
                </div>
                <span className="text-sm font-black gradient-text">{user.points.toLocaleString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-slate-500 text-sm">No rankings yet.</p>
        )}
        <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-purple-500/10 flex items-center gap-3">
          <Clock className="w-4 h-4 text-slate-500" />
          <div className="flex-1">
            <div className="text-sm font-medium text-white">You</div>
            <div className="text-xs text-slate-500">Keep earning to climb!</div>
          </div>
          <span className="text-sm font-black gradient-text">{points.toLocaleString()}</span>
        </div>
      </div>

      {/* ── REDEMPTION MODAL ─────────────────────────────── */}
      {selectedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="w-full max-w-md glass rounded-2xl border border-white/10 p-6 space-y-5">

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl mb-1">{selectedTier.icon}</div>
                <h3 className="text-lg font-bold text-white">{selectedTier.title}</h3>
                <p className="text-sm text-slate-400">{selectedTier.desc}</p>
              </div>
              <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cost */}
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 flex items-center justify-between">
              <span className="text-sm text-slate-400">Points to deduct:</span>
              <span className="text-lg font-black gradient-text">{selectedTier.pointsCost.toLocaleString()} pts</span>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 flex items-center justify-between">
              <span className="text-sm text-slate-400">Your balance after:</span>
              <span className={`text-lg font-black ${points - selectedTier.pointsCost >= 0 ? "text-green-400" : "text-red-400"}`}>
                {(points - selectedTier.pointsCost).toLocaleString()} pts
              </span>
            </div>

            {/* Delivery info (not needed for premium) */}
            {selectedTier.type !== "premium" && !redeemResult?.success && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                  {selectedTier.type === "voucher" ? "UPI ID / Paytm number:" : "Email for gift card:"}
                </label>
                <input value={deliveryInfo} onChange={e => setDeliveryInfo(e.target.value)}
                  placeholder={selectedTier.type === "voucher" ? "e.g. 9876543210@paytm" : "e.g. yourname@gmail.com"}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/40 transition-colors" />
                <p className="text-[11px] text-slate-600">We'll send the reward to this address within 2–3 business days.</p>
              </div>
            )}

            {/* Result message */}
            {redeemResult && (
              <div className={`rounded-xl p-3 flex items-start gap-2 text-sm
                ${redeemResult.success ? "bg-green-500/10 border border-green-500/20 text-green-300" : "bg-red-500/10 border border-red-500/20 text-red-300"}`}>
                {redeemResult.success ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                {redeemResult.message}
              </div>
            )}

            {/* Action buttons */}
            {!redeemResult?.success && (
              <button onClick={handleRedeem} disabled={redeeming}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {redeeming ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : <><Sparkles className="w-4 h-4" /> Confirm Redemption</>}
              </button>
            )}
            {redeemResult?.success && (
              <button onClick={() => { closeModal(); setActiveTab("history"); }}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-all">
                View in History →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}