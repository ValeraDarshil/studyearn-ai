/**
 * StudyEarn AI — Daily Challenge
 * Roz ek special AI question → Bonus points earn karo
 * Resets at midnight — saved on SERVER (cross-device, no double-award) 🌐
 */
import { useState, useEffect } from "react";
import { Flame, CheckCircle, XCircle, Trophy, Clock, Zap, Loader2, Star } from "lucide-react";
import { useApp } from "../context/AppContext";
import { API_URL } from "../utils/api";
import { MarkdownRenderer } from "../components/MarkdownRenderer";

const DAILY_TOPICS = [
  { subject: "Mathematics",    topic: "a tricky algebra or calculus problem",           emoji: "📐", pts: 30 },
  { subject: "Physics",        topic: "an interesting mechanics or optics problem",     emoji: "⚛️",  pts: 30 },
  { subject: "Chemistry",      topic: "a challenging organic chemistry question",       emoji: "🧪", pts: 30 },
  { subject: "Biology",        topic: "a conceptual question about human body or cells",emoji: "🧬", pts: 30 },
  { subject: "History",        topic: "a fact-based question about Indian history",     emoji: "📜", pts: 25 },
  { subject: "Geography",      topic: "a tricky question about world or Indian geography", emoji: "🌍", pts: 25 },
  { subject: "Current Affairs",topic: "a question about Indian economy or science",     emoji: "📰", pts: 25 },
  { subject: "Reasoning",      topic: "a logical reasoning puzzle",                     emoji: "🧩", pts: 35 },
];

function getTodaysTopic() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return DAILY_TOPICS[dayOfYear % DAILY_TOPICS.length];
}

function getTodayKey(): string {
  // Use local date (IST) not UTC — prevents date mismatch at midnight
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const dd   = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function authHeaders() {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` };
}

interface ChallengeData {
  date: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  subject: string;
  pts: number;
}

interface ChallengeResult {
  date: string;
  completed: boolean;
  correct: boolean;
  ptsEarned: number;
}

function parseMCQ(text: string): { question: string; options: string[]; answer: number; explanation: string } | null {
  try {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const qLine = lines[0]?.replace(/^\*{0,2}Q?\s*\d*[.)s]*\*{0,2}\s*/i, "").replace(/\*+/g, "").trim() || "";
    if (!qLine || qLine.length < 5) return null;

    const optLines: { letter: string; text: string }[] = [];
    lines.forEach(line => {
      const m = line.replace(/\*+/g, "").match(/^\(?([A-D])[.)\\-\s]\s*(.+)/i);
      if (m) optLines.push({ letter: m[1].toUpperCase(), text: m[2].trim() });
    });
    if (optLines.length < 4) return null;
    optLines.sort((a, b) => "ABCD".indexOf(a.letter) - "ABCD".indexOf(b.letter));
    const opts = optLines.map(o => o.text);

    let answer = 0;
    for (const line of lines) {
      if (!/^\*{0,2}(correct\s+)?answer\s*[:\-]/i.test(line.replace(/\*+/g, ""))) continue;
      const lm = line.replace(/^.*?[:\-]\s*/i, "").trim().match(/^([A-D])/i);
      if (lm) { answer = "ABCD".indexOf(lm[1].toUpperCase()); break; }
    }

    let explanation = "Check your textbook.";
    for (const line of lines) {
      if (!/^\*{0,2}explanation\s*[:\-]/i.test(line.replace(/\*+/g, ""))) continue;
      const t = line.replace(/^.*?[:\-]\s*/i, "").trim();
      if (t.length > 5) { explanation = t; break; }
    }

    return { question: qLine, options: opts, answer, explanation };
  } catch { return null; }
}

export function DailyChallenge() {
  const { addPoints, streak } = useApp();
  const todayTopic = getTodaysTopic();
  const todayKey   = getTodayKey();

  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [history,   setHistory]   = useState<Record<string, { completed: boolean; correct: boolean }>>({});
  const [result, setResult]       = useState<ChallengeResult | null>(null);
  const [fetching, setFetching]   = useState(true);
  const [loading, setLoading]     = useState(false);
  const [selected, setSelected]   = useState<number | null>(null);
  const [revealed, setRevealed]   = useState(false);
  const [error, setError]         = useState("");
  const [timeLeft, setTimeLeft]   = useState("");

  // Countdown to midnight
  useEffect(() => {
    const tick = () => {
      const now  = new Date();
      const next = new Date(now); next.setDate(now.getDate() + 1); next.setHours(0,0,0,0);
      const diff = next.getTime() - now.getTime();
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setTimeLeft(`${h}:${m}:${s}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  // ── Load from server on mount ──────────────────────────────
  useEffect(() => {
    fetch(`${API_URL}/api/user/daily-challenge`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          if (d.challenge) setChallenge(d.challenge);
          if (d.history)  setHistory(d.history);
          if (d.result?.completed) {
            setResult(d.result);
            if (d.challenge) {
              setSelected(d.result.correct ? d.challenge.answer : -1);
              setRevealed(true);
            }
          }
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  // ── Load today's challenge question — server generates, NO quota used ──
  const loadChallenge = async (force = false) => {
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API_URL}/api/user/daily-challenge/generate`, {
        method:  "POST",
        headers: authHeaders(),
        body:    JSON.stringify({
          subject: todayTopic.subject,
          topic:   todayTopic.topic,
          pts:     todayTopic.pts,
          force,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Could not generate question. Please try again.");
      setChallenge(data.challenge);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Submit answer (server awards points) ──────────────────
  const handleAnswer = async (idx: number) => {
    if (revealed || !challenge) return;
    setSelected(idx);
    setRevealed(true);

    try {
      const res  = await fetch(`${API_URL}/api/user/daily-challenge/result`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ selectedIdx: idx, challengeDate: todayKey }),
      });
      const data = await res.json();

      if (data.success && !data.alreadySubmitted) {
        setResult(data.result);
        // Update UI points — server already saved to DB
        addPoints(data.ptsEarned);
      } else if (data.result) {
        setResult(data.result);
      }
    } catch {
      // Fallback: compute locally if server fails
      const correct   = idx === challenge.answer;
      const ptsEarned = correct ? challenge.pts : Math.round(challenge.pts * 0.1);
      setResult({ date: todayKey, completed: true, correct, ptsEarned });
      setHistory(prev => ({ ...prev, [todayKey]: { completed: true, correct } }));
    }
  };

  // ── Past 7 days — from server history ─────────────────────
  const past7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    // Use local date — consistent with getTodayKey() and server IST handling
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, "0");
    const dd   = String(d.getDate()).padStart(2, "0");
    const key     = `${yyyy}-${mm}-${dd}`;
    const isToday = key === todayKey;
    // Use server history for past days, local result for today
    const h       = history[key];
    const done    = isToday ? !!result?.completed : !!h?.completed;
    const correct = isToday ? !!result?.correct   : !!h?.correct;
    return { key, isToday, done, correct, day: d.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 2) };
  });

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-400" /> Daily Challenge
          </h1>
          <p className="text-sm text-slate-400 mt-1">Roz ek special question → Bonus points earn karo 🔥</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-orange-500/20 text-sm self-start">
          <Clock className="w-4 h-4 text-orange-400 flex-shrink-0" />
          <div className="text-center">
            <div className="text-xs text-slate-500 leading-none mb-0.5">Next challenge</div>
            <div className="font-mono font-bold text-orange-300">{timeLeft}</div>
          </div>
        </div>
      </div>

      {/* 7-day streak tracker */}
      <div className="rounded-2xl p-4 border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400">This week</span>
          <span className="text-xs text-orange-300 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> {streak} day streak
          </span>
        </div>
        <div className="flex gap-2">
          {past7.map(d => (
            <div key={d.key} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-slate-600">{d.day}</span>
              <div className={`w-full h-8 rounded-lg flex items-center justify-center transition-all
                ${d.done && d.correct  ? "bg-green-500/20 border border-green-500/30"
                  : d.done             ? "bg-red-500/20 border border-red-500/30"
                  : d.isToday          ? "bg-orange-500/10 border border-orange-500/30"
                  : "bg-white/[0.03] border border-white/5"}`}>
                {d.done
                  ? d.correct
                    ? <CheckCircle className="w-4 h-4 text-green-400" />
                    : <XCircle    className="w-4 h-4 text-red-400" />
                  : d.isToday
                    ? <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                    : <div className="w-2 h-2 rounded-full bg-white/10" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's challenge card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 bg-gradient-to-r from-orange-500/10 to-red-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{todayTopic.emoji}</span>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Today's Subject</p>
              <p className="font-semibold text-white">{todayTopic.subject}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Reward</p>
            <p className="font-bold text-orange-300 flex items-center gap-1 justify-end">
              <Zap className="w-3.5 h-3.5" /> +{todayTopic.pts} pts
            </p>
          </div>
        </div>

        <div className="p-5 space-y-4">

          {/* Not loaded yet */}
          {!challenge && !loading && (
            <div className="text-center space-y-4 py-4">
              <div className="text-4xl">{todayTopic.emoji}</div>
              <div>
                <p className="text-white font-semibold">Ready for today's challenge?</p>
                <p className="text-sm text-slate-400 mt-1">
                  Answer correctly → earn <strong className="text-orange-300">+{todayTopic.pts} pts</strong>
                </p>
              </div>
              {error && (
                <div className="space-y-2">
                  <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-center">{error}</div>
                  <button onClick={() => loadChallenge(true)}
                    className="w-full py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium hover:bg-orange-500/20 transition-all">
                    🔄 Regenerate Question
                  </button>
                </div>
              )}
              <button onClick={loadChallenge}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm hover:opacity-90 transition-all glow-btn mx-auto">
                <Flame className="w-4 h-4" /> Start Challenge
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-8 space-y-3">
              <Loader2 className="w-8 h-8 text-orange-400 animate-spin mx-auto" />
              <p className="text-sm text-slate-400">AI is crafting today's challenge…</p>
            </div>
          )}

          {challenge && !loading && (
            <div className="space-y-4">
              <p className="text-white font-semibold text-base leading-relaxed">{challenge.question}</p>

              <div className="space-y-2">
                {challenge.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrect  = i === challenge.answer;
                  let style = "border-white/5 bg-white/[0.02] text-slate-300 hover:border-white/10 hover:bg-white/[0.04]";
                  if (revealed) {
                    if (isCorrect)       style = "border-green-500/50 bg-green-500/10 text-green-300";
                    else if (isSelected) style = "border-red-500/50 bg-red-500/10 text-red-300";
                    else                 style = "border-white/5 bg-white/[0.01] text-slate-500";
                  }
                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={revealed}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${style}`}>
                      <span className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold
                        ${revealed && isCorrect ? "bg-green-500/20 text-green-400"
                          : revealed && isSelected ? "bg-red-500/20 text-red-400"
                          : "bg-white/5 text-slate-500"}`}>
                        {"ABCD"[i]}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {revealed && isCorrect  && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                      {revealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {revealed && result && (
                <div className="space-y-3">
                  <div className={`rounded-xl px-4 py-3 text-sm border ${
                    result.correct ? "bg-green-500/5 border-green-500/20 text-green-200" : "bg-red-500/5 border-red-500/20 text-red-200"}`}>
                    <span className="font-semibold">
                      {result.correct ? "✅ Correct! " : `❌ Wrong. Correct answer: ${["A","B","C","D"][challenge.answer]}. `}
                    </span>
                    <MarkdownRenderer content={challenge.explanation} />
                  </div>

                  <div className={`rounded-xl px-4 py-3 flex items-center gap-3 border ${
                    result.correct ? "bg-orange-500/10 border-orange-500/20" : "bg-white/[0.02] border-white/5"}`}>
                    {result.correct ? <Trophy className="w-5 h-5 text-orange-400 flex-shrink-0" /> : <Star className="w-5 h-5 text-slate-500 flex-shrink-0" />}
                    <div>
                      <p className={`font-semibold text-sm ${result.correct ? "text-orange-300" : "text-slate-400"}`}>
                        {result.correct ? `+${result.ptsEarned} pts earned! 🎉` : `+${result.ptsEarned} pt for trying`}
                      </p>
                      <p className="text-xs text-slate-500">
                        {result.correct ? "Come back tomorrow for another challenge!" : "You'll get it next time 💪"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 justify-center pt-1">
                    <Clock className="w-3.5 h-3.5" /> Next challenge in {timeLeft}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}