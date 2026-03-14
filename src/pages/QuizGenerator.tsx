/**
 * StudyEarn AI — AI Quiz Generator
 * Topic dalo → 10 MCQ milenge → Points earn karo
 */
import { useState } from "react";
import { Brain, CheckCircle, XCircle, RotateCcw, Trophy, Zap, ChevronRight, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { API_URL } from "../utils/api";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface Question {
  q: string;
  options: string[];
  answer: number; // 0-3 index
  explanation: string;
}

type QuizState = "setup" | "loading" | "playing" | "result";

// ─────────────────────────────────────────────────────────────
// SUBJECTS
// ─────────────────────────────────────────────────────────────
const SUBJECTS = [
  { label: "Mathematics",   emoji: "📐", color: "from-blue-500 to-cyan-500" },
  { label: "Physics",       emoji: "⚛️",  color: "from-purple-500 to-blue-500" },
  { label: "Chemistry",     emoji: "🧪", color: "from-green-500 to-teal-500" },
  { label: "Biology",       emoji: "🧬", color: "from-emerald-500 to-green-500" },
  { label: "History",       emoji: "📜", color: "from-amber-500 to-orange-500" },
  { label: "Geography",     emoji: "🌍", color: "from-cyan-500 to-blue-500" },
  { label: "Economics",     emoji: "📊", color: "from-pink-500 to-rose-500" },
  { label: "Computer Science", emoji: "💻", color: "from-violet-500 to-purple-500" },
];

const DIFFICULTIES = [
  { value: "easy",   label: "Easy",   emoji: "🟢", desc: "Class 8-9 level" },
  { value: "medium", label: "Medium", emoji: "🟡", desc: "Class 10-11 level" },
  { value: "hard",   label: "Hard",   emoji: "🔴", desc: "Class 12 / Competitive" },
];

// ─────────────────────────────────────────────────────────────
// PARSE AI response → Question[]
// Strategy 1: JSON array (preferred — structured, reliable)
// Strategy 2: Regex text parser (fallback)
// ─────────────────────────────────────────────────────────────

/** Strategy 1: parse JSON array from AI response */
function parseQuestionsJSON(text: string): Question[] | null {
  const attempts = [
    () => { const c = text.replace(/```json/gi,"").replace(/```/g,"").trim(); return JSON.parse(c); },
    () => { const s=text.indexOf("["),e=text.lastIndexOf("]"); if(s===-1||e<=s) return null; return JSON.parse(text.slice(s,e+1)); },
    () => { const f=text.replace(/,\s*]/g,"]").replace(/,\s*}/g,"}"); const s=f.indexOf("["),e=f.lastIndexOf("]"); if(s===-1||e<=s) return null; return JSON.parse(f.slice(s,e+1)); },
  ];
  for (const attempt of attempts) {
    try {
      const parsed = attempt();
      if (!Array.isArray(parsed) || parsed.length < 3) continue;
      const questions: Question[] = [];
      for (const item of parsed) {
        if (!item?.q || !Array.isArray(item.options) || item.options.length < 4) continue;
        const answer = typeof item.answer === "number"
          ? item.answer
          : "ABCD".indexOf(String(item.answer ?? "A").toUpperCase().trim()[0] ?? "A");
        questions.push({
          q: String(item.q).trim(),
          options: item.options.slice(0, 4).map((o: any) => String(o).trim()),
          answer: Math.max(0, Math.min(3, answer)),
          explanation: String(item.explanation || "See your textbook for details.").trim(),
        });
      }
      if (questions.length >= 3) return questions.slice(0, 10);
    } catch { continue; }
  }
  return null;
}

/** Strategy 2: regex text parser (fallback) */
function parseQuestionsRegex(text: string): Question[] {
  const questions: Question[] = [];
  const blocks = text.split(/\n(?=\*{0,2}Q?\s*\d+[\.)\s])/i).filter(b => b.trim());
  for (const block of blocks) {
    try {
      const lines = block.trim().split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length < 5) continue;
      const qLine = lines[0].replace(/^\*{0,2}Q?\s*\d+[\.)\s]+\*{0,2}\s*/i,"").replace(/\*+/g,"").trim();
      if (!qLine) continue;
      const optLines: { letter: string; text: string }[] = [];
      lines.forEach(line => {
        const m = line.replace(/\*+/g,"").match(/^\(?([A-D])[\.)\-\s]\s*(.+)/i);
        if (m) optLines.push({ letter: m[1].toUpperCase(), text: m[2].trim() });
      });
      if (optLines.length < 4) continue;
      optLines.sort((a,b) => "ABCD".indexOf(a.letter)-"ABCD".indexOf(b.letter));
      const opts = optLines.map(o => o.text);
      let answerIdx = 0;
      for (const line of lines) {
        if (!/^\*{0,2}(correct\s+)?answer\s*[:\-]/i.test(line.replace(/\*+/g,""))) continue;
        const m = line.replace(/^.*?[:\-]\s*/i,"").trim().match(/^([A-D])/i);
        if (m) { answerIdx = "ABCD".indexOf(m[1].toUpperCase()); break; }
      }
      let explanation = "See your textbook for details.";
      for (const line of lines) {
        if (!/^\*{0,2}explanation\s*[:\-]/i.test(line.replace(/\*+/g,""))) continue;
        const t = line.replace(/^.*?[:\-]\s*/i,"").trim();
        if (t.length > 5) { explanation = t; break; }
      }
      questions.push({ q: qLine, options: opts, answer: answerIdx, explanation });
    } catch { continue; }
  }
  return questions.slice(0, 10);
}

/** Main parser — tries JSON first, falls back to regex */
function parseQuestions(text: string): Question[] {
  const fromJSON = parseQuestionsJSON(text);
  if (fromJSON && fromJSON.length >= 3) return fromJSON;
  return parseQuestionsRegex(text);
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export function QuizGenerator() {
  const { addPoints, logActivity, questionsLeft, useQuestion, isPremium } = useApp();

  const [state, setState]           = useState<QuizState>("setup");
  const [topic, setTopic]           = useState("");
  const [subject, setSubject]       = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions]   = useState<Question[]>([]);
  const [current, setCurrent]       = useState(0);
  const [selected, setSelected]     = useState<number | null>(null);
  const [answers, setAnswers]       = useState<(number | null)[]>([]);
  const [showExp, setShowExp]       = useState(false);
  const [error, setError]           = useState("");

  // ── Generate Quiz ──────────────────────────────────────────
  const generateQuiz = async () => {
    const finalTopic = topic.trim() || subject;
    if (!finalTopic) { setError("Please enter a topic or select a subject!"); return; }
    if (questionsLeft <= 0) { setError("No questions left today! Come back tomorrow."); return; }

    setError("");
    setState("loading");

    const token = localStorage.getItem("token");
    // JSON prompt — structured, reliable parsing
    const prompt = `You are a quiz generator. Output ONLY a valid JSON array. No explanation, no markdown, no text before or after. Start with [ and end with ].

Generate 10 multiple choice questions about "${finalTopic}" at ${difficulty} difficulty for Indian students (CBSE/ICSE).

Required JSON structure (10 objects):
[
  {
    "q": "Question text here?",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "answer": 0,
    "explanation": "One sentence explaining why option A is correct."
  }
]

Rules:
- "answer" is the 0-based index of the correct option (0=A, 1=B, 2=C, 3=D)
- All 4 options must be plausible but only one correct
- Questions must be factually accurate for ${difficulty} level
- Explanation must clearly state WHY the answer is correct
- Output the JSON array now, nothing else`;

    try {
      let parsed: Question[] = [];

      // Up to 2 attempts — if JSON parse fails, retry with regex-friendly prompt
      for (let attempt = 1; attempt <= 2 && parsed.length < 3; attempt++) {
        const retryPrompt = attempt === 1 ? prompt : prompt.replace(
          "Output ONLY a valid JSON array.",
          "Output ONLY a valid JSON array. This is attempt 2 — ensure valid JSON."
        );

        const res = await fetch(`${API_URL}/api/ai/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ prompt: retryPrompt }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.answer || "AI error");
        parsed = parseQuestions(data.answer);
      }

      if (parsed.length < 3) throw new Error("Could not generate questions. Please try again.");

      useQuestion();
      setQuestions(parsed);
      setAnswers(new Array(parsed.length).fill(null));
      setCurrent(0);
      setSelected(null);
      setShowExp(false);
      setState("playing");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setState("setup");
    }
  };

  // ── Answer selection ───────────────────────────────────────
  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExp(true);
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
  };

  // ── Next question ──────────────────────────────────────────
  const handleNext = () => {
    if (current + 1 >= questions.length) {
      // Calculate score and award points
      const correct = answers.filter((a, i) => a === questions[i]?.answer).length;
      const basePts = correct * 5; // 5 pts per correct answer
      // ✅ Premium users get 1.5x points on quiz
      const pts = isPremium ? basePts * 2 : basePts;
      if (pts > 0) {
        addPoints(pts);
        logActivity("quiz_completed", `Quiz: ${topic || subject} (${correct}/${questions.length})${isPremium ? " ⚡" : ""}`, pts);
      }
      setState("result");
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExp(false);
    }
  };

  const reset = () => {
    setState("setup");
    setTopic(""); setSubject(""); setDifficulty("medium");
    setQuestions([]); setAnswers([]); setCurrent(0);
    setSelected(null); setShowExp(false); setError("");
  };

  // ── Score calculation ──────────────────────────────────────
  const score     = answers.filter((a, i) => a === questions[i]?.answer).length;
  const totalPts  = score * 5;
  const pct       = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const grade     = pct >= 90 ? "🏆 Excellent!" : pct >= 70 ? "🎉 Good Job!" : pct >= 50 ? "📚 Keep Practicing" : "💪 Try Again";

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-400" /> AI Quiz Generator
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Topic dalo → 10 MCQ milenge → 5 pts per correct answer
        </p>
      </div>

      {/* ── SETUP ─────────────────────────────────────────── */}
      {state === "setup" && (
        <div className="space-y-5">

          {/* Subject quick-select */}
          <div className="rounded-2xl p-5 border border-white/10 bg-white/[0.02] space-y-3">
            <p className="text-sm font-medium text-slate-300">Quick select subject:</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SUBJECTS.map(s => (
                <button key={s.label} onClick={() => { setSubject(s.label); setTopic(""); }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-medium transition-all
                    ${subject === s.label
                      ? "border-blue-500/50 bg-blue-500/10 text-white"
                      : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10 hover:text-white"}`}>
                  <span className="text-xl">{s.emoji}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom topic */}
          <div className="rounded-2xl p-5 border border-white/10 bg-white/[0.02] space-y-3">
            <p className="text-sm font-medium text-slate-300">Or enter a custom topic:</p>
            <input
              value={topic}
              onChange={e => { setTopic(e.target.value); setSubject(""); }}
              placeholder="e.g. Photosynthesis, Quadratic Equations, French Revolution..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Difficulty */}
          <div className="rounded-2xl p-5 border border-white/10 bg-white/[0.02] space-y-3">
            <p className="text-sm font-medium text-slate-300">Difficulty:</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {DIFFICULTIES.map(d => (
                <button key={d.value} onClick={() => setDifficulty(d.value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-medium transition-all
                    ${difficulty === d.value
                      ? "border-purple-500/50 bg-purple-500/10 text-white"
                      : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10 hover:text-white"}`}>
                  <span className="text-lg">{d.emoji}</span>
                  <span>{d.label}</span>
                  <span className="text-slate-500 text-[10px]">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Points info */}
          <div className="flex items-center gap-2 text-xs text-slate-500 px-1">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Uses 1 daily question • Earn up to <strong className="text-purple-300">50 pts</strong> (5 pts × 10 correct)</span>
          </div>

          <button onClick={generateQuiz}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all glow-btn">
            <Brain className="w-5 h-5" />
            Generate Quiz
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── LOADING ───────────────────────────────────────── */}
      {state === "loading" && (
        <div className="rounded-2xl p-12 border border-white/10 bg-white/[0.02] text-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto" />
          <div>
            <p className="text-white font-semibold">AI is crafting your quiz…</p>
            <p className="text-xs text-slate-500 mt-1">Generating 10 questions on {topic || subject}</p>
          </div>
          <div className="flex justify-center gap-1">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400"
                style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />
            ))}
          </div>
        </div>
      )}

      {/* ── PLAYING ───────────────────────────────────────── */}
      {state === "playing" && questions[current] && (
        <div className="space-y-4">

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${((current) / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {current + 1} / {questions.length}
            </span>
          </div>

          {/* Score tracker */}
          <div className="flex gap-1 flex-wrap">
            {questions.map((_, i) => (
              <div key={i} className={`w-5 h-5 rounded-md text-[9px] font-bold flex items-center justify-center transition-all
                ${i < current
                  ? answers[i] === questions[i].answer
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                  : i === current
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                    : "bg-white/5 text-slate-600 border border-white/5"}`}>
                {i + 1}
              </div>
            ))}
          </div>

          {/* Question card */}
          <div className="rounded-2xl p-6 border border-white/10 bg-white/[0.02] space-y-5">
            <p className="text-white font-semibold text-base leading-relaxed">
              {questions[current].q}
            </p>

            {/* Options */}
            <div className="space-y-2">
              {questions[current].options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect  = i === questions[current].answer;
                const revealed   = selected !== null;

                let style = "border-white/5 bg-white/[0.02] text-slate-300 hover:border-white/10 hover:bg-white/[0.04]";
                if (revealed) {
                  if (isCorrect)        style = "border-green-500/50 bg-green-500/10 text-green-300";
                  else if (isSelected)  style = "border-red-500/50 bg-red-500/10 text-red-300";
                  else                  style = "border-white/5 bg-white/[0.01] text-slate-500";
                }

                return (
                  <button key={i} onClick={() => handleSelect(i)} disabled={revealed}
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

            {/* Explanation */}
            {showExp && (
              <div className={`rounded-xl px-4 py-3 text-sm border ${
                selected === questions[current].answer
                  ? "bg-green-500/5 border-green-500/20 text-green-200"
                  : "bg-red-500/5 border-red-500/20 text-red-200"}`}>
                <span className="font-semibold">
                  {selected === questions[current].answer ? "✅ Correct! " : "❌ Wrong. "}
                </span>
                {questions[current].explanation}
              </div>
            )}
          </div>

          {/* Next button */}
          {selected !== null && (
            <button onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-all">
              {current + 1 >= questions.length ? "See Results 🏆" : "Next Question →"}
            </button>
          )}
        </div>
      )}

      {/* ── RESULT ────────────────────────────────────────── */}
      {state === "result" && (
        <div className="rounded-2xl p-8 border border-white/10 bg-white/[0.02] text-center space-y-6 animate-slide-up">

          {/* Score circle */}
          <div className="relative w-28 h-28 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8"/>
              <circle cx="50" cy="50" r="42" fill="none"
                stroke={pct >= 70 ? "#22c55e" : pct >= 50 ? "#eab308" : "#ef4444"}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{pct}%</span>
              <span className="text-xs text-slate-400">{score}/{questions.length}</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{grade}</h2>
            <p className="text-slate-400 text-sm mt-1">
              {score} correct out of {questions.length} questions
            </p>
          </div>

          {/* Points earned */}
          {totalPts > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-semibold">
              <Trophy className="w-4 h-4" /> +{totalPts} points earned!
            </div>
          )}

          {/* Answer breakdown */}
          <div className="grid grid-cols-10 gap-1.5 mx-auto max-w-xs">
            {questions.map((q, i) => (
              <div key={i}
                className={`h-6 rounded flex items-center justify-center text-[9px] font-bold
                  ${answers[i] === q.answer ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {i + 1}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={reset}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
              <RotateCcw className="w-4 h-4" /> Try Another Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}