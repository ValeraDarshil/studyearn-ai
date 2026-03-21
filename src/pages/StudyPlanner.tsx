/**
 * StudyEarn AI — Smart Study Planner
 * Exam date + subjects → AI generates daily timetable
 * Plan saved on SERVER — syncs across all devices 🌐
 */
import { useState, useEffect } from "react";
import { Calendar, BookOpen, Plus, Trash2, Sparkles, Clock, ChevronRight, CheckCircle, RotateCcw, Loader2, Target } from "lucide-react";
import { useApp } from "../context/AppContext";
import { API_URL } from "../utils/api";

interface StudyDay {
  date: string;
  day: string;
  tasks: string[];
  completed: boolean[];
}

interface SavedPlan {
  examName: string;
  examDate: string;
  subjects: string[];
  days: StudyDay[];
  createdAt: string;
}

function getDaysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0,0,0,0);
  const exam  = new Date(dateStr); exam.setHours(0,0,0,0);
  return Math.max(0, Math.round((exam.getTime() - today.getTime()) / 86400000));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

function authHeaders() {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` };
}

function parseTimetable(text: string, examDate: string): StudyDay[] {
  const today   = new Date(); today.setHours(0,0,0,0);
  const exam    = new Date(examDate); exam.setHours(0,0,0,0);
  const dayDiff = Math.max(1, Math.round((exam.getTime() - today.getTime()) / 86400000));
  const days: StudyDay[] = [];
  const blocks = text.split(/\n(?=Day\s*\d+|DAY\s*\d+|\*\*Day)/i).filter(b => b.trim());
  for (let i = 0; i < Math.min(blocks.length, dayDiff); i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    const tasks = blocks[i].split("\n")
      .map(l => l.replace(/^[-•*]\s*/, "").trim())
      .filter(l => l.length > 10 && !l.match(/^(Day|DAY)\s*\d+/i) && !l.startsWith("**Day"))
      .slice(0, 5);
    if (tasks.length > 0) {
      days.push({
        date: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
        day:  d.toLocaleDateString("en-IN", { weekday: "long" }),
        tasks,
        completed: new Array(tasks.length).fill(false),
      });
    }
  }
  return days;
}

export function StudyPlanner() {
  const { addPoints, logActivity } = useApp();
  const [examName, setExamName]   = useState("");
  const [examDate, setExamDate]   = useState("");
  const [subjects, setSubjects]   = useState<string[]>([""]);
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(true);
  const [error, setError]         = useState("");
  const [plan, setPlan]           = useState<SavedPlan | null>(null);
  const [activeDay, setActiveDay] = useState(0);

  // ── Load from server on mount ──────────────────────────────
  useEffect(() => {
    fetch(`${API_URL}/api/user/study-plan`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => { if (d.success && d.plan) setPlan(d.plan); })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  // ── Persist to server ──────────────────────────────────────
  const savePlan = async (p: SavedPlan) => {
    setPlan(p);
    fetch(`${API_URL}/api/user/study-plan`, {
      method: "POST", headers: authHeaders(), body: JSON.stringify({ plan: p }),
    }).catch(() => {});
  };

  // ── Generate ───────────────────────────────────────────────
  const generatePlan = async () => {
    if (!examName.trim()) { setError("Enter exam name!"); return; }
    if (!examDate)         { setError("Select exam date!"); return; }
    const validSubjects = subjects.filter(s => s.trim());
    if (!validSubjects.length) { setError("Add at least one subject!"); return; }
    const daysLeft = getDaysUntil(examDate);
    if (daysLeft < 1)  { setError("Exam date must be in the future!"); return; }
    if (daysLeft > 90) { setError("Exam must be within 90 days!"); return; }

    setError(""); setLoading(true);
    const prompt = `Create a ${daysLeft}-day study timetable for a student preparing for "${examName}" on ${new Date(examDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.

Subjects to cover: ${validSubjects.join(", ")}

Rules:
- Distribute subjects evenly across all ${daysLeft} days
- Each day should have 3-4 specific study tasks
- Include chapter names or topics (realistic for Indian students)
- Include approximate time per task (e.g., 1.5hr, 2hr)
- Last 2-3 days should be revision only
- Day before exam: light revision + rest

Format EXACTLY like this:
Day 1 (${new Date().toLocaleDateString("en-IN", { weekday: "long" })}):
- ${validSubjects[0]}: [specific chapter/topic] ([time])
- [Subject]: [topic] ([time])

Day 2:
- ...

Continue for all ${daysLeft} days.`;

    try {
      const res  = await fetch(`${API_URL}/api/ai/ask`, {
        method: "POST", headers: authHeaders(), body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!data.success) throw new Error("AI error");
      const days = parseTimetable(data.answer, examDate);
      if (!days.length) throw new Error("Could not generate plan. Please try again.");
      const newPlan: SavedPlan = { examName: examName.trim(), examDate, subjects: validSubjects, days, createdAt: new Date().toISOString() };
      await savePlan(newPlan);
      setActiveDay(0);
      addPoints(20);
      logActivity("study_plan_created", `Plan: ${examName} (${days.length} days)`, 20);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (dayIdx: number, taskIdx: number) => {
    if (!plan) return;
    const updated = {
      ...plan,
      days: plan.days.map((d, di) => {
        if (di !== dayIdx) return d;
        const comp = [...d.completed]; comp[taskIdx] = !comp[taskIdx];
        return { ...d, completed: comp };
      }),
    };
    savePlan(updated);
  };

  const clearPlan = () => {
    setPlan(null); setExamName(""); setExamDate(""); setSubjects([""]); setError("");
    fetch(`${API_URL}/api/user/study-plan`, { method: "DELETE", headers: authHeaders() }).catch(() => {});
  };

  const todayIdx   = plan ? Math.max(0, plan.days.findIndex(d => d.date === new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }))) : 0;
  const daysLeft   = plan ? getDaysUntil(plan.examDate) : 0;
  const totalTasks = plan?.days.reduce((s, d) => s + d.tasks.length, 0) ?? 0;
  const doneTasks  = plan?.days.reduce((s, d) => s + d.completed.filter(Boolean).length, 0) ?? 0;

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
    </div>
  );

  if (!plan) return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-purple-400" /> Study Planner
        </h1>
        <p className="text-sm text-slate-400 mt-1">Exam date + subjects → AI creates your perfect daily timetable</p>
      </div>

      <div className="rounded-2xl p-6 border border-white/10 bg-white/[0.02] space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Exam Name</label>
          <input value={examName} onChange={e => setExamName(e.target.value)}
            placeholder="e.g. CBSE Class 12 Boards, JEE Mains, NEET..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Exam Date</label>
          <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)}
            min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
            max={new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0]}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors [color-scheme:dark]" />
          {examDate && <p className="text-xs text-purple-300">📅 {getDaysUntil(examDate)} days left to prepare</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Subjects to Study</label>
          {subjects.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input value={s} onChange={e => { const u = [...subjects]; u[i] = e.target.value; setSubjects(u); }}
                placeholder={`Subject ${i + 1} (e.g. Physics)`}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors" />
              {subjects.length > 1 && (
                <button onClick={() => setSubjects(subjects.filter((_, j) => j !== i))}
                  className="px-3 rounded-xl border border-white/10 text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {subjects.length < 8 && (
            <button onClick={() => setSubjects([...subjects, ""])}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-purple-400 transition-colors px-1">
              <Plus className="w-3.5 h-3.5" /> Add another subject
            </button>
          )}
        </div>

        {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</div>}

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI generates personalized plan • Earn <strong className="text-purple-300">+20 pts</strong> • Syncs across all devices 🌐</span>
        </div>

        <button onClick={generatePlan} disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all glow-btn">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating your plan…</> : <><Sparkles className="w-5 h-5" /> Generate Study Plan <ChevronRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-400" /> {plan.examName}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Exam on {formatDate(plan.examDate)} • {daysLeft > 0 ? `${daysLeft} days left` : "Exam day! 🎯"}
          </p>
        </div>
        <button onClick={clearPlan}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/20 text-sm transition-colors self-start sm:self-auto">
          <RotateCcw className="w-3.5 h-3.5" /> New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Days Left",   value: daysLeft,   icon: Target,      color: "text-purple-400" },
          { label: "Total Tasks", value: totalTasks, icon: BookOpen,    color: "text-blue-400" },
          { label: "Completed",   value: doneTasks,  icon: CheckCircle, color: "text-green-400" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 border border-white/5 bg-white/[0.02] text-center space-y-1">
            <s.icon className={`w-5 h-5 mx-auto ${s.color}`} />
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {totalTasks > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Overall Progress</span><span>{Math.round((doneTasks / totalTasks) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${(doneTasks / totalTasks) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {plan.days.map((d, i) => {
          const allDone = d.completed.every(Boolean);
          const someD   = d.completed.some(Boolean);
          return (
            <button key={i} onClick={() => setActiveDay(i)}
              className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border text-xs transition-all
                ${activeDay === i ? "border-purple-500/50 bg-purple-500/10 text-white" : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10"}`}>
              <span className="font-bold text-[10px] uppercase tracking-wide">{d.day.slice(0,3)}</span>
              <span className="font-semibold">{i + 1}</span>
              {allDone ? <CheckCircle className="w-3 h-3 text-green-400" />
                : someD ? <div className="w-3 h-1 rounded-full bg-yellow-400/60" />
                : i === todayIdx ? <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                : <div className="w-1.5 h-1.5 rounded-full bg-white/10" />}
            </button>
          );
        })}
      </div>

      {plan.days[activeDay] && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">{plan.days[activeDay].day}</h3>
              <p className="text-xs text-slate-400">{plan.days[activeDay].date}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {plan.days[activeDay].completed.filter(Boolean).length}/{plan.days[activeDay].tasks.length} done
            </div>
          </div>
          <div className="p-4 space-y-2">
            {plan.days[activeDay].tasks.map((task, ti) => (
              <button key={ti} onClick={() => toggleTask(activeDay, ti)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all
                  ${plan.days[activeDay].completed[ti] ? "border-green-500/20 bg-green-500/5" : "border-white/5 bg-white/[0.02] hover:border-white/10"}`}>
                <div className={`w-5 h-5 rounded-md border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all
                  ${plan.days[activeDay].completed[ti] ? "border-green-500/50 bg-green-500/20" : "border-white/20"}`}>
                  {plan.days[activeDay].completed[ti] && <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
                </div>
                <span className={`text-sm leading-relaxed ${plan.days[activeDay].completed[ti] ? "text-slate-500 line-through" : "text-slate-300"}`}>
                  {task}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}