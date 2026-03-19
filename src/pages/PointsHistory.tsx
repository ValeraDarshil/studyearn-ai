/**
 * StudyEarn AI — Points History Page
 * Last 30 days ka detailed points breakdown
 */
import { useState, useEffect, useMemo } from "react";
import {
  Zap, Brain, Presentation, FileText, Trophy,
  Flame, Gift, BookOpen, Star, TrendingUp,
  Calendar, ChevronDown, ChevronUp, Filter,
  HelpCircle, NotebookPen, FlaskConical,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { AnimatedNumber } from "../components/AnimatedNumber";

const API_URL = import.meta.env.VITE_API_URL as string;

const ACTION_META: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  ask_question:       { label: "Ask AI",           icon: Brain,        color: "text-blue-400",    bg: "bg-blue-500/10"    },
  generate_ppt:       { label: "PPT Generated",    icon: Presentation, color: "text-purple-400",  bg: "bg-purple-500/10"  },
  ppt_generated:      { label: "PPT Generated",    icon: Presentation, color: "text-purple-400",  bg: "bg-purple-500/10"  },
  convert_pdf:        { label: "PDF Tool",          icon: FileText,     color: "text-cyan-400",    bg: "bg-cyan-500/10"    },
  pdf_tool:           { label: "PDF Tool",          icon: FileText,     color: "text-cyan-400",    bg: "bg-cyan-500/10"    },
  quiz_completed:     { label: "Quiz",              icon: HelpCircle,   color: "text-green-400",   bg: "bg-green-500/10"   },
  daily_challenge:    { label: "Daily Challenge",  icon: Flame,        color: "text-orange-400",  bg: "bg-orange-500/10"  },
  streak_bonus:       { label: "Streak Bonus",     icon: Flame,        color: "text-orange-400",  bg: "bg-orange-500/10"  },
  daily_login:        { label: "Daily Login",      icon: Calendar,     color: "text-yellow-400",  bg: "bg-yellow-500/10"  },
  referral:           { label: "Referral",         icon: Gift,         color: "text-pink-400",    bg: "bg-pink-500/10"    },
  signup:             { label: "Signup Bonus",     icon: Star,         color: "text-yellow-400",  bg: "bg-yellow-500/10"  },
  login:              { label: "Login Bonus",      icon: Calendar,     color: "text-slate-400",   bg: "bg-slate-500/10"   },
  note_created:       { label: "Notes",            icon: NotebookPen,  color: "text-indigo-400",  bg: "bg-indigo-500/10"  },
  note_shared:        { label: "Note Shared",      icon: NotebookPen,  color: "text-indigo-400",  bg: "bg-indigo-500/10"  },
  improve_notes:      { label: "Study Tools",      icon: FlaskConical, color: "text-teal-400",    bg: "bg-teal-500/10"    },
  analyze_pdf:        { label: "Study Tools",      icon: FlaskConical, color: "text-teal-400",    bg: "bg-teal-500/10"    },
  study_plan_created: { label: "Study Planner",   icon: BookOpen,     color: "text-emerald-400", bg: "bg-emerald-500/10" },
};

const getMeta = (action: string) =>
  ACTION_META[action] || { label: action.replace(/_/g, " "), icon: Zap, color: "text-slate-400", bg: "bg-slate-500/10" };

interface Activity {
  _id: string;
  action: string;
  details: string;
  pointsEarned: number;
  timestamp: string;
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function getDayLabel(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  const today    = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const actDay   = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (actDay.getTime() === today.getTime())    return "Today";
  if (actDay.getTime() === yesterday.getTime()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
}

function getDayKey(ts: string) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function PointsHistory() {
  const { points } = useApp();
  const [activities, setActivities]     = useState<Activity[]>([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState("all");
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${API_URL}/api/user/activity`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const cutoff = Date.now() - 30 * 86400000;
          setActivities(
            d.activities.filter((a: Activity) =>
              new Date(a.timestamp).getTime() > cutoff && a.pointsEarned > 0
            )
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Auto-expand today + yesterday
  useEffect(() => {
    if (activities.length > 0) {
      const now = new Date();
      const y   = new Date(now.getTime() - 86400000);
      setExpandedDays(new Set([
        getDayKey(now.toISOString()),
        getDayKey(y.toISOString()),
      ]));
    }
  }, [activities]);

  const filterOptions = useMemo(() => {
    const seen = new Set<string>();
    const opts = [{ value: "all", label: "All" }];
    activities.forEach(a => {
      if (!seen.has(a.action)) {
        seen.add(a.action);
        opts.push({ value: a.action, label: getMeta(a.action).label });
      }
    });
    return opts;
  }, [activities]);

  const filtered = useMemo(() =>
    filter === "all" ? activities : activities.filter(a => a.action === filter),
    [activities, filter]
  );

  // Group by day
  const grouped = useMemo(() => {
    const map = new Map<string, { label: string; acts: Activity[]; total: number }>();
    filtered.forEach(a => {
      const key   = getDayKey(a.timestamp);
      const label = getDayLabel(a.timestamp);
      if (!map.has(key)) map.set(key, { label, acts: [], total: 0 });
      const entry = map.get(key)!;
      entry.acts.push(a);
      entry.total += a.pointsEarned;
    });
    return map;
  }, [filtered]);

  const totalEarned = useMemo(() => activities.reduce((s, a) => s + a.pointsEarned, 0), [activities]);
  const topSource   = useMemo(() => {
    const map: Record<string, number> = {};
    activities.forEach(a => { map[a.action] = (map[a.action] || 0) + a.pointsEarned; });
    const top = Object.entries(map).sort((a, b) => b[1] - a[1])[0];
    return top ? getMeta(top[0]).label : "—";
  }, [activities]);

  const toggleDay = (key: string) =>
    setExpandedDays(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-400" /> Points History
        </h1>
        <p className="text-sm text-slate-400 mt-1">Last 30 days ka detailed breakdown</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Points",   value: points,           icon: Zap,       color: "text-yellow-400",  bg: "bg-yellow-500/10"  },
          { label: "Earned (30d)",   value: totalEarned,      icon: TrendingUp, color: "text-green-400",  bg: "bg-green-500/10"   },
          { label: "Transactions",   value: activities.length, icon: Star,      color: "text-purple-400", bg: "bg-purple-500/10"  },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass rounded-2xl p-4 border border-white/5 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-0.5">{label}</div>
              <div className="text-xl font-bold text-white"><AnimatedNumber value={value} /></div>
            </div>
          </div>
        ))}
        <div className="glass rounded-2xl p-4 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Top Source</div>
            <div className="text-sm font-bold text-white truncate">{topSource}</div>
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        {filterOptions.map(opt => (
          <button key={opt.value} onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
              filter === opt.value
                ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
            }`}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/5">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading history...</p>
        </div>
      ) : grouped.size === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/5">
          <Zap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">No points earned in last 30 days</p>
          <p className="text-slate-600 text-xs mt-1">Ask AI, generate PPTs, or complete challenges!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...grouped.entries()].map(([key, { label, acts, total }]) => {
            const isExpanded = expandedDays.has(key);
            const isToday    = label === "Today";
            return (
              <div key={key} className="glass rounded-2xl border border-white/5 overflow-hidden">
                {/* Day header */}
                <button onClick={() => toggleDay(key)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isToday ? "bg-green-400 shadow-sm shadow-green-400/50" : "bg-white/20"}`} />
                    <span className="text-sm font-semibold text-white">{label}</span>
                    <span className="text-xs text-slate-600 bg-white/[0.03] px-2 py-0.5 rounded-full">
                      {acts.length} {acts.length === 1 ? "event" : "events"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs font-bold text-yellow-400">+{total}</span>
                    </div>
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                      : <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                    }
                  </div>
                </button>

                {/* Individual activities */}
                {isExpanded && (
                  <div className="border-t border-white/[0.06]">
                    {acts.map((act, idx) => {
                      const meta = getMeta(act.action);
                      const Icon = meta.icon;
                      return (
                        <div key={act._id}
                          className={`flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors ${
                            idx < acts.length - 1 ? "border-b border-white/[0.04]" : ""
                          }`}>
                          {/* Icon */}
                          <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-4 h-4 ${meta.color}`} />
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`text-xs font-semibold ${meta.color}`}>{meta.label}</span>
                              <span className="text-[10px] text-slate-600">{formatTime(act.timestamp)}</span>
                            </div>
                            <p className="text-sm text-slate-300 truncate">{act.details}</p>
                          </div>

                          {/* Points */}
                          <div className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs font-bold text-yellow-400">+{act.pointsEarned}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && activities.length > 0 && (
        <p className="text-center text-xs text-slate-600 pb-4">
          Showing last 30 days • {activities.length} point-earning events
        </p>
      )}
    </div>
  );
}