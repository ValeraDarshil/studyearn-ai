/**
 * StudyEarn AI — Analytics Dashboard
 * Progress graphs, weak subjects tracker, study stats
 * Pure React — no external chart libraries
 * ✅ Fixed: All data from server activity feed (no localStorage)
 */
import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp, Brain, Presentation, FileText, Trophy,
  Flame, Target, Calendar, Award, ChevronUp, ChevronDown, Zap,
  BookOpen, HelpCircle, BarChart2
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getRecentActivity } from "../utils/user-api";
import { calculateLevel, getLevelTier, getLevelColor } from "../utils/level-utils";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface Activity {
  action: string;
  details: string;
  pointsEarned: number;
  timestamp: string;
}

interface DayStat {
  date: string;       // "Mon"
  fullDate: string;   // "10 Mar"
  points: number;
  questions: number;
  ppts: number;
  pdfs: number;
  challenges: number;
}

interface SubjectStat {
  subject: string;
  count: number;
  points: number;
  emoji: string;
  color: string;
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function getSubjectFromDetails(details: string): string {
  const lower = details.toLowerCase();
  if (lower.includes("math") || lower.includes("calculus") || lower.includes("algebra") || lower.includes("geometry")) return "Mathematics";
  if (lower.includes("physics") || lower.includes("mechanic") || lower.includes("optic")) return "Physics";
  if (lower.includes("chem") || lower.includes("organic") || lower.includes("reaction")) return "Chemistry";
  if (lower.includes("bio") || lower.includes("cell") || lower.includes("dna") || lower.includes("photosyn")) return "Biology";
  if (lower.includes("history") || lower.includes("war") || lower.includes("empire") || lower.includes("revolution")) return "History";
  if (lower.includes("geo") || lower.includes("climate") || lower.includes("country")) return "Geography";
  if (lower.includes("econ") || lower.includes("market") || lower.includes("gdp")) return "Economics";
  if (lower.includes("code") || lower.includes("program") || lower.includes("computer") || lower.includes("algorithm")) return "Computer Sci";
  if (lower.includes("english") || lower.includes("grammar") || lower.includes("literature")) return "English";
  if (lower.includes("reasoning") || lower.includes("puzzle") || lower.includes("logical")) return "Reasoning";
  return "General";
}

const SUBJECT_META: Record<string, { emoji: string; color: string }> = {
  "Mathematics":  { emoji: "📐", color: "bg-blue-500" },
  "Physics":      { emoji: "⚛️",  color: "bg-purple-500" },
  "Chemistry":    { emoji: "🧪", color: "bg-green-500" },
  "Biology":      { emoji: "🧬", color: "bg-emerald-500" },
  "History":      { emoji: "📜", color: "bg-amber-500" },
  "Geography":    { emoji: "🌍", color: "bg-cyan-500" },
  "Economics":    { emoji: "📊", color: "bg-pink-500" },
  "Computer Sci": { emoji: "💻", color: "bg-violet-500" },
  "English":      { emoji: "📝", color: "bg-orange-500" },
  "Reasoning":    { emoji: "🧩", color: "bg-red-500" },
  "General":      { emoji: "📚", color: "bg-slate-500" },
};

function getLast7Days(): DayStat[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date:     d.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 3),
      fullDate: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      points: 0, questions: 0, ppts: 0, pdfs: 0, challenges: 0,
    };
  });
}

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────
function BarChart({ data, maxVal, color = "bg-blue-500", height = 80 }: {
  data: number[]; maxVal: number; color?: string; height?: number;
}) {
  return (
    <div className="flex items-end gap-1 w-full" style={{ height }}>
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-sm relative overflow-hidden"
            style={{ height: maxVal > 0 ? `${Math.max(4, (val / maxVal) * height)}px` : "4px" }}>
            <div className={`absolute inset-0 ${color} opacity-80`} />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RadialProgress({ pct, size = 80, stroke = 8, color = "#6366f1", children }: {
  pct: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode;
}) {
  const r      = (size - stroke) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct, 100) / 100);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, trend, color }: {
  icon: any; label: string; value: string | number; sub?: string;
  trend?: { dir: "up" | "down" | "same"; val: string }; color: string;
}) {
  return (
    <div className="rounded-2xl p-5 border border-white/5 bg-white/[0.02] space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} bg-opacity-20`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${
          trend.dir === "up" ? "text-green-400" : trend.dir === "down" ? "text-red-400" : "text-slate-500"
        }`}>
          {trend.dir === "up" ? <ChevronUp className="w-3 h-3" /> : trend.dir === "down" ? <ChevronDown className="w-3 h-3" /> : null}
          {trend.val}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export function Analytics() {
  const { points, totalXP, streak, userStats, unlockedAchievements, userName } = useApp();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState<"overview" | "subjects" | "activity">("overview");

  // Load ALL activities (server returns last 50 — enough for 7-day + 30-day stats)
  useEffect(() => {
    getRecentActivity().then((d) => {
      if (d.success) setActivities(d.activities || []);
    }).finally(() => setLoading(false));
  }, []);

  // ── Derived stats ──────────────────────────────────────────
  const levelInfo  = calculateLevel(totalXP);
  const levelTier  = getLevelTier(levelInfo.currentLevel);
  const levelColor = getLevelColor(levelInfo.currentLevel);

  // ── Last 7 days breakdown — 100% from server activity feed ─
  // NO localStorage reads — daily_challenge action is already in the feed
  const weekStats = useMemo<DayStat[]>(() => {
    const days = getLast7Days();
    const now  = new Date(); now.setHours(23, 59, 59, 999);

    activities.forEach(act => {
      const actDate  = new Date(act.timestamp);
      // Calculate which day slot this activity belongs to (0 = 6 days ago, 6 = today)
      const actDay   = new Date(actDate); actDay.setHours(0, 0, 0, 0);
      const today    = new Date(); today.setHours(0, 0, 0, 0);
      const daysAgo  = Math.round((today.getTime() - actDay.getTime()) / 86400000);

      if (daysAgo < 0 || daysAgo > 6) return;
      const idx = 6 - daysAgo; // idx 6 = today, idx 0 = 6 days ago

      days[idx].points += act.pointsEarned || 0;

      switch (act.action) {
        case "ask_question":
        case "quiz_completed":
          days[idx].questions++;
          break;
        case "generate_ppt":
        case "ppt_generated":
          days[idx].ppts++;
          break;
        case "convert_pdf":
        case "pdf_tool":
          days[idx].pdfs++;
          break;
        case "daily_challenge":
          days[idx].challenges++;
          break;
      }
    });

    return days;
  }, [activities]);

  // ── Subject breakdown — from server activity ───────────────
  const subjectStats = useMemo<SubjectStat[]>(() => {
    const map: Record<string, SubjectStat> = {};
    activities.forEach(act => {
      if (!["ask_question", "quiz_completed", "ppt_generated", "generate_ppt", "daily_challenge"].includes(act.action)) return;
      const subj = getSubjectFromDetails(act.details);
      const meta = SUBJECT_META[subj] || SUBJECT_META["General"];
      if (!map[subj]) map[subj] = { subject: subj, count: 0, points: 0, ...meta };
      map[subj].count++;
      map[subj].points += act.pointsEarned || 0;
    });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [activities]);

  // ── Daily Challenge stats — from server activity feed ─────
  // action = "daily_challenge", details includes "Correct ✅" or "Incorrect ❌"
  const quizStats = useMemo(() => {
    const thirtyDaysAgo = Date.now() - 30 * 86400000;
    const sevenDaysAgo  = Date.now() - 7  * 86400000;

    const challenges = activities.filter(a =>
      a.action === "daily_challenge" &&
      new Date(a.timestamp).getTime() > thirtyDaysAgo
    );

    const total   = challenges.length;
    const correct = challenges.filter(a => a.details?.includes("Correct")).length;
    const week    = challenges.filter(a => new Date(a.timestamp).getTime() > sevenDaysAgo && a.details?.includes("Correct")).length;

    return {
      total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      streak7: week,
    };
  }, [activities]);

  const totalActions    = userStats.totalQuestionsAsked + userStats.totalPPTsGenerated + userStats.totalPDFsConverted;
  const maxWeekPoints   = Math.max(...weekStats.map(d => d.points), 1);
  const totalWeekPoints = weekStats.reduce((s, d) => s + d.points, 0);

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-blue-400" /> Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {userName ? `${userName.split(" ")[0]}'s` : "Your"} study progress & insights
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl glass border border-white/10 self-start sm:self-auto">
          <RadialProgress pct={levelInfo.progress} size={44} stroke={5}
            color={levelInfo.currentLevel >= 10 ? "#22c55e" : levelInfo.currentLevel >= 5 ? "#6366f1" : "#64748b"}>
            <span className="text-[10px] font-bold text-white">{levelInfo.currentLevel}</span>
          </RadialProgress>
          <div>
            <div className="text-xs text-slate-400">Level {levelInfo.currentLevel}</div>
            <div className="text-sm font-semibold text-white">{levelTier}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/5 w-fit">
        {(["overview", "subjects", "activity"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all
              ${activeTab === tab ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-5">

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={Zap} label="Total Points" value={points.toLocaleString()}
              sub={`Level ${levelInfo.currentLevel}`} color="from-purple-500 to-pink-500"
              trend={{ dir: totalWeekPoints > 0 ? "up" : "same", val: `+${totalWeekPoints} this week` }} />
            <StatCard icon={Flame} label="Day Streak" value={streak}
              sub="Keep it going!" color="from-orange-500 to-red-500"
              trend={{ dir: streak > 0 ? "up" : "same", val: streak >= 7 ? "🔥 On fire!" : `${7 - streak} more for bonus` }} />
            <StatCard icon={Brain} label="Questions Asked" value={userStats.totalQuestionsAsked}
              sub="AI questions" color="from-blue-500 to-cyan-500" />
            <StatCard icon={Trophy} label="Achievements" value={unlockedAchievements.length}
              sub="Badges earned" color="from-yellow-500 to-orange-500" />
          </div>

          {/* Weekly points chart */}
          <div className="rounded-2xl p-5 border border-white/10 bg-white/[0.02] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Points This Week</h3>
                <p className="text-xs text-slate-500 mt-0.5">Last 7 days — all activities combined</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">{totalWeekPoints}</div>
                <div className="text-xs text-slate-500">total pts</div>
              </div>
            </div>

            {loading ? (
              <div className="h-20 bg-white/[0.02] rounded-xl animate-pulse" />
            ) : (
              <div>
                <BarChart data={weekStats.map(d => d.points)} maxVal={maxWeekPoints} color="bg-blue-500" height={80} />
                <div className="flex gap-1 mt-1">
                  {weekStats.map((d, i) => (
                    <div key={i} className="flex-1 text-center">
                      <div className="text-[10px] text-slate-500">{d.date}</div>
                      {d.points > 0 && <div className="text-[9px] text-blue-400">{d.points}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action breakdown + Level progress */}
          <div className="grid sm:grid-cols-2 gap-4">

            {/* Action breakdown */}
            <div className="rounded-2xl p-5 border border-white/10 bg-white/[0.02] space-y-4">
              <h3 className="text-sm font-semibold text-white">Activity Breakdown</h3>
              {[
                { icon: Brain,        label: "AI Questions",     val: userStats.totalQuestionsAsked, color: "from-blue-500 to-cyan-500" },
                { icon: Presentation, label: "PPTs Created",     val: userStats.totalPPTsGenerated,  color: "from-purple-500 to-blue-500" },
                { icon: FileText,     label: "PDFs Converted",   val: userStats.totalPDFsConverted,  color: "from-cyan-500 to-teal-500" },
                { icon: HelpCircle,   label: "Daily Challenges", val: quizStats.total,               color: "from-orange-500 to-red-500" },
              ].map(item => {
                const maxVal = Math.max(userStats.totalQuestionsAsked, userStats.totalPPTsGenerated, userStats.totalPDFsConverted, quizStats.total, 1);
                return (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-400">{item.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-white">{item.val}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                        style={{ width: `${Math.round((item.val / maxVal) * 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Level progress */}
            <div className="rounded-2xl p-5 border border-white/10 bg-white/[0.02] space-y-4">
              <h3 className="text-sm font-semibold text-white">Level Progress</h3>
              <div className="flex items-center gap-4">
                <RadialProgress pct={levelInfo.progress} size={80} stroke={8}
                  color={levelInfo.currentLevel >= 30 ? "#a855f7" : levelInfo.currentLevel >= 10 ? "#22c55e" : "#6366f1"}>
                  <div className="text-base font-bold text-white">{levelInfo.currentLevel}</div>
                </RadialProgress>
                <div className="flex-1 space-y-2">
                  <div>
                    <div className="text-sm font-semibold text-white">{levelTier}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {levelInfo.currentXP} / {levelInfo.requiredXP} XP to next level
                    </div>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${levelColor} transition-all duration-700`}
                      style={{ width: `${levelInfo.progress}%` }} />
                  </div>
                  <div className="text-xs text-slate-500">
                    Need {levelInfo.requiredXP - levelInfo.currentXP} more XP
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                {[
                  { level: 5,  label: "Beginner+",   xp: 2500  },
                  { level: 10, label: "Intermediate", xp: 10000 },
                  { level: 20, label: "Advanced",     xp: 40000 },
                ].map(m => (
                  <div key={m.level} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Level {m.level} — {m.label}</span>
                    {totalXP >= m.xp
                      ? <span className="text-xs text-green-400">✅ Reached</span>
                      : <span className="text-xs text-slate-600">{(m.xp - totalXP).toLocaleString()} XP away</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Challenge stats */}
          {quizStats.total > 0 && (
            <div className="rounded-2xl p-5 border border-white/10 bg-white/[0.02]">
              <h3 className="text-sm font-semibold text-white mb-4">Daily Challenge Stats (Last 30 days)</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{quizStats.total}</div>
                  <div className="text-xs text-slate-500 mt-1">Attempted</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${quizStats.accuracy >= 70 ? "text-green-400" : quizStats.accuracy >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                    {quizStats.accuracy}%
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-400">{quizStats.streak7}</div>
                  <div className="text-xs text-slate-500 mt-1">Correct this week</div>
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Accuracy</span>
                  <span>{quizStats.correct}/{quizStats.total} correct</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${
                    quizStats.accuracy >= 70 ? "bg-green-500" : quizStats.accuracy >= 50 ? "bg-yellow-500" : "bg-red-500"
                  }`} style={{ width: `${quizStats.accuracy}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SUBJECTS TAB ──────────────────────────────────── */}
      {activeTab === "subjects" && (
        <div className="space-y-4">
          {loading ? (
            <div className="rounded-2xl p-12 border border-white/10 bg-white/[0.02] text-center">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : subjectStats.length === 0 ? (
            <div className="rounded-2xl p-12 border border-white/10 bg-white/[0.02] text-center">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No subject data yet.</p>
              <p className="text-slate-500 text-xs mt-1">Ask AI questions or take daily challenges to see your subject breakdown!</p>
            </div>
          ) : (
            <>
              <div className="rounded-2xl p-5 border border-white/10 bg-white/[0.02] space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Subject Breakdown</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Based on your questions & daily challenges</p>
                </div>
                {subjectStats.map((s, i) => {
                  const maxCount = subjectStats[0]?.count || 1;
                  const pct = Math.round((s.count / maxCount) * 100);
                  return (
                    <div key={s.subject} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{s.emoji}</span>
                          <span className="text-sm text-slate-300">{s.subject}</span>
                          {i === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300">Most studied</span>}
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-white">{s.count}x</span>
                          <span className="text-xs text-slate-500 ml-1.5">+{s.points}pts</span>
                        </div>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.color} opacity-70 transition-all duration-700`}
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {subjectStats.length >= 3 && (
                <div className="rounded-2xl p-5 border border-orange-500/20 bg-orange-500/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-400" />
                    <h3 className="text-sm font-semibold text-orange-300">Focus Areas</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    You've studied <strong className="text-white">{subjectStats[0].subject}</strong> the most.
                    Consider practicing more on <strong className="text-orange-300">
                      {subjectStats.slice(-2).map(s => s.subject).join(" & ")}
                    </strong> to balance your preparation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {subjectStats.slice(-3).map(s => (
                      <span key={s.subject} className="text-xs px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300">
                        {s.emoji} {s.subject} — {s.count} sessions
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── ACTIVITY TAB ──────────────────────────────────── */}
      {activeTab === "activity" && (
        <div className="space-y-4">

          {/* Heatmap — last 28 days from server */}
          <div className="rounded-2xl p-5 border border-white/10 bg-white/[0.02] space-y-3">
            <h3 className="text-sm font-semibold text-white">Activity Heatmap (Last 28 days)</h3>
            <div className="grid grid-cols-7 gap-1.5">
              {["S","M","T","W","T","F","S"].map((d,i) => (
                <div key={i} className="text-[10px] text-slate-600 text-center">{d}</div>
              ))}
              {Array.from({ length: 28 }, (_, i) => {
                const d = new Date(); d.setDate(d.getDate() - (27 - i));
                const key = d.toISOString().split("T")[0];
                const dayActs = activities.filter(a => new Date(a.timestamp).toISOString().split("T")[0] === key);
                const pts = dayActs.reduce((s, a) => s + (a.pointsEarned || 0), 0);
                const intensity = pts === 0 ? 0 : pts < 20 ? 1 : pts < 50 ? 2 : pts < 100 ? 3 : 4;
                const colors = ["bg-white/5", "bg-blue-500/20", "bg-blue-500/40", "bg-blue-500/70", "bg-blue-500"];
                const isToday = key === new Date().toISOString().split("T")[0];
                return (
                  <div key={i} title={`${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}: ${pts} pts`}
                    className={`h-6 rounded-md ${colors[intensity]} ${isToday ? "ring-1 ring-blue-400" : ""} transition-all`} />
                );
              })}
            </div>
            <div className="flex items-center gap-2 justify-end">
              <span className="text-[10px] text-slate-600">Less</span>
              {["bg-white/5","bg-blue-500/20","bg-blue-500/40","bg-blue-500/70","bg-blue-500"].map((c,i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
              ))}
              <span className="text-[10px] text-slate-600">More</span>
            </div>
          </div>

          {/* Recent activity feed */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            </div>
            <div className="divide-y divide-white/5">
              {loading ? (
                Array.from({length: 5}).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-4">
                    <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-white/5 rounded animate-pulse w-3/4" />
                      <div className="h-2.5 bg-white/5 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))
              ) : activities.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No activity yet — start studying!</p>
                </div>
              ) : (
                activities.slice(0, 20).map((act, i) => {
                  const icons: Record<string, { icon: any; color: string; bg: string }> = {
                    ask_question:    { icon: Brain,        color: "text-blue-400",   bg: "bg-blue-500/10"   },
                    quiz_completed:  { icon: HelpCircle,   color: "text-purple-400", bg: "bg-purple-500/10" },
                    ppt_generated:   { icon: Presentation, color: "text-purple-400", bg: "bg-purple-500/10" },
                    generate_ppt:    { icon: Presentation, color: "text-purple-400", bg: "bg-purple-500/10" },
                    pdf_tool:        { icon: FileText,     color: "text-cyan-400",   bg: "bg-cyan-500/10"   },
                    convert_pdf:     { icon: FileText,     color: "text-cyan-400",   bg: "bg-cyan-500/10"   },
                    daily_login:     { icon: Flame,        color: "text-orange-400", bg: "bg-orange-500/10" },
                    streak_bonus:    { icon: Award,        color: "text-yellow-400", bg: "bg-yellow-500/10" },
                    daily_challenge: { icon: Target,       color: "text-red-400",    bg: "bg-red-500/10"    },
                    study_plan_created: { icon: Calendar,  color: "text-green-400",  bg: "bg-green-500/10"  },
                  };
                  const meta = icons[act.action] || { icon: Zap, color: "text-green-400", bg: "bg-green-500/10" };
                  const Icon = meta.icon;
                  const timeAgo = (() => {
                    const diff = Date.now() - new Date(act.timestamp).getTime();
                    const m = Math.floor(diff / 60000);
                    if (m < 1)  return "just now";
                    if (m < 60) return `${m}m ago`;
                    const h = Math.floor(m / 60);
                    if (h < 24) return `${h}h ago`;
                    return `${Math.floor(h / 24)}d ago`;
                  })();
                  return (
                    <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                      <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${meta.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-300 truncate">{act.details || act.action}</p>
                        <p className="text-xs text-slate-600">{timeAgo}</p>
                      </div>
                      {act.pointsEarned > 0 && (
                        <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full flex-shrink-0">
                          +{act.pointsEarned}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}