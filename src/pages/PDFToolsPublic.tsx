/**
 * StudyEarn AI — PUBLIC PDF Tools Page
 * PATH: src/pages/PDFToolsPublic.tsx
 * ─────────────────────────────────────────────────────────────
 * ✅ No login required — guests bhi use kar sakte hain
 * ✅ SEO-optimized — H1, meta title, trust badges, SEO paragraph
 * ✅ Promo banners — signup funnel for main platform
 * ✅ After-conversion popup — pushes guest to sign up
 * ✅ All 7 working tools: img→pdf, merge, split, compress,
 *    page numbers, watermark, rotate
 * ─────────────────────────────────────────────────────────────
 * ROUTE (add in App.tsx BEFORE /app protected route):
 *   import { PDFToolsPublic } from './pages/PDFToolsPublic';
 *   <Route path="/pdf-tools" element={<PDFToolsPublic />} />
 */

import { useRef, useState, useEffect } from "react";
import {
  FileText, Upload, Image, File, CheckCircle, X,
  Loader2, ArrowLeft, ChevronRight, Download, Edit3,
  Scissors, Minimize2, RotateCw, Hash, Droplets,
  Sparkles, Star, Gift, Brain, Trophy, Zap,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// API — No auth token for guest, attach if logged in
// ─────────────────────────────────────────────────────────────
const API_URL = (import.meta as any).env?.VITE_API_URL ?? "";

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function callPDF(endpoint: string, fd: FormData) {
  const res = await fetch(`${API_URL}/api/${endpoint}`, {
    method: "POST",
    headers: getAuthHeader(),
    body: fd,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `Error ${res.status}` }));
    throw new Error(err.message || `Server Error ${res.status}`);
  }
  return res;
}

const api = {
  imgToPDF:     async (files: File[]) => { const fd = new FormData(); files.forEach(f => fd.append("files", f)); return callPDF("img-to-pdf", fd); },
  mergePDF:     async (files: File[]) => { const fd = new FormData(); files.forEach(f => fd.append("files", f)); return callPDF("merge-pdf", fd); },
  splitPDF:     async (file: File, pages: string) => { const fd = new FormData(); fd.append("file", file); fd.append("pages", pages); return callPDF("split-pdf", fd); },
  compressPDF:  async (file: File) => { const fd = new FormData(); fd.append("file", file); return callPDF("compress-pdf", fd); },
  rotatePDF:    async (file: File, deg: number) => { const fd = new FormData(); fd.append("file", file); fd.append("degrees", String(deg)); return callPDF("rotate-pdf", fd); },
  pageNumbers:  async (file: File, pos: string) => { const fd = new FormData(); fd.append("file", file); fd.append("position", pos); return callPDF("pdf-page-numbers", fd); },
  watermark:    async (file: File, text: string) => { const fd = new FormData(); fd.append("file", file); fd.append("text", text); return callPDF("pdf-watermark", fd); },
};

// ─────────────────────────────────────────────────────────────
// TOOL CONFIG
// ─────────────────────────────────────────────────────────────
interface Tool {
  id: string;
  title: string;
  seoTitle: string;
  desc: string;
  icon: any;
  grad: string;
  accept: string;
  multi: boolean;
  extra?: "split" | "rotate" | "watermark" | "pagenum";
  filename: string;
  cat: "convert" | "organize" | "edit";
}

const TOOLS: Tool[] = [
  {
    id: "img-pdf", title: "Images → PDF", seoTitle: "Image to PDF Converter — Free Online",
    desc: "JPG / PNG / WEBP images ko ek PDF mein instantly convert karo",
    icon: Image, grad: "from-green-500 to-emerald-600",
    accept: "image/jpeg,image/png,image/webp,image/gif", multi: true,
    filename: "images-converted", cat: "convert",
  },
  {
    id: "merge-pdf", title: "Merge PDFs", seoTitle: "Merge PDF Files Free Online",
    desc: "Multiple PDF files ko ek document mein combine karo",
    icon: FileText, grad: "from-pink-500 to-rose-600",
    accept: "application/pdf,.pdf", multi: true,
    filename: "merged", cat: "organize",
  },
  {
    id: "split-pdf", title: "Split PDF", seoTitle: "Split PDF Online Free — Extract Pages",
    desc: "PDF se specific pages extract karo (e.g. 1,3,5-7)",
    icon: Scissors, grad: "from-purple-500 to-violet-600",
    accept: "application/pdf,.pdf", multi: false, extra: "split",
    filename: "split", cat: "organize",
  },
  {
    id: "compress-pdf", title: "Compress PDF", seoTitle: "Compress PDF Online Free — Reduce File Size",
    desc: "PDF size reduce karo bina quality khone ke",
    icon: Minimize2, grad: "from-cyan-500 to-blue-600",
    accept: "application/pdf,.pdf", multi: false,
    filename: "compressed", cat: "edit",
  },
  {
    id: "rotate-pdf", title: "Rotate PDF", seoTitle: "Rotate PDF Pages Free Online",
    desc: "PDF pages ko 90°, 180° ya 270° rotate karo",
    icon: RotateCw, grad: "from-amber-500 to-orange-600",
    accept: "application/pdf,.pdf", multi: false, extra: "rotate",
    filename: "rotated", cat: "edit",
  },
  {
    id: "page-numbers", title: "Add Page Numbers", seoTitle: "Add Page Numbers to PDF Free Online",
    desc: "Har PDF page pe automatically page number stamp karo",
    icon: Hash, grad: "from-indigo-500 to-violet-600",
    accept: "application/pdf,.pdf", multi: false, extra: "pagenum",
    filename: "numbered", cat: "edit",
  },
  {
    id: "watermark", title: "Watermark PDF", seoTitle: "Add Watermark to PDF Free Online",
    desc: "PDF pe custom watermark text add karo diagonally",
    icon: Droplets, grad: "from-rose-500 to-pink-600",
    accept: "application/pdf,.pdf", multi: false, extra: "watermark",
    filename: "watermarked", cat: "edit",
  },
];

const CATS = [
  { id: "convert",  label: "Convert",  emoji: "🔄" },
  { id: "organize", label: "Organize", emoji: "📂" },
  { id: "edit",     label: "Edit",     emoji: "✏️" },
] as const;

const STEPS: Record<string, string[]> = {
  "img-pdf":      ["Uploading images…",  "Processing…",       "Building PDF…",    "Finishing…"],
  "merge-pdf":    ["Uploading PDFs…",    "Loading files…",    "Merging pages…",   "Finishing…"],
  "split-pdf":    ["Uploading PDF…",     "Reading pages…",    "Extracting…",      "Finishing…"],
  "compress-pdf": ["Uploading PDF…",     "Analyzing…",        "Compressing…",     "Finishing…"],
  "rotate-pdf":   ["Uploading PDF…",     "Reading pages…",    "Rotating…",        "Finishing…"],
  "page-numbers": ["Uploading PDF…",     "Reading pages…",    "Stamping numbers…","Finishing…"],
  "watermark":    ["Uploading PDF…",     "Reading pages…",    "Adding watermark…","Finishing…"],
};

function download(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name.endsWith(".pdf") ? name : `${name}.pdf`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────

function TopBanner({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative rounded-xl mb-5 overflow-hidden"
      style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.08))", border: "1px solid rgba(124,58,237,0.3)" }}>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">🚀 StudyEarn AI — Free AI Platform for Students</p>
            <p className="text-[11px] text-slate-400 truncate">Ask AI • PPT Generator • Quiz • Daily Rewards — 100% Free</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a href="/signup"
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            Free Signup →
          </a>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PromoPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1e1b4b,#0f172a,#1e1b4b)", border: "1px solid rgba(139,92,246,0.4)" }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10">
          <X className="w-5 h-5" />
        </button>
        <div className="p-6 space-y-5">
          <div className="flex justify-center">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold"
              style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.4)" }}>
              ✨ FREE SIGNUP BONUS
            </span>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-extrabold text-white">
              PDF tool pasand aya? 😍<br />
              <span style={{ color: "#a78bfa" }}>Aur bhi powerful tools hain!</span>
            </h3>
            <p className="text-sm text-slate-400">Free account banao — AI study assistant, PPT generator, quiz maker + real rewards!</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Brain, label: "Ask AI — unlimited", color: "#818cf8" },
              { icon: Sparkles, label: "AI PPT Generator", color: "#f472b6" },
              { icon: Zap, label: "Quiz Generator", color: "#fb923c" },
              { icon: Gift, label: "Earn Real Rewards", color: "#4ade80" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 p-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                <span className="text-xs text-slate-300 font-medium">{label}</span>
              </div>
            ))}
          </div>
          <a href="/signup"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm text-white"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            <Sparkles className="w-4 h-4" /> Create Free Account — Get 50 Bonus Points 🎁
          </a>
          <button onClick={onClose} className="w-full text-xs text-slate-600 hover:text-slate-400 transition-colors py-1">
            Maybe later — stay on PDF tools
          </button>
        </div>
      </div>
    </div>
  );
}

function BottomPromo() {
  return (
    <div className="mt-6 rounded-2xl overflow-hidden"
      style={{ background: "linear-gradient(135deg,#1e1b4b,#0f172a,#1a1040)", border: "1px solid rgba(124,58,237,0.3)" }}>
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm">PDF tools sirf shuruat hai! ✨</h3>
            <p className="text-xs text-slate-400 mt-0.5">StudyEarn AI pe free signup karo — AI assistant, PPT generator, quiz, daily rewards aur bahut kuch!</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          {["🤖 Ask AI — unlimited", "📊 AI PPT Generator", "🧠 Smart Quiz Generator",
            "🏆 Leaderboard + Rewards", "📅 Study Planner", "🎁 50 points on signup"].map(t => (
            <div key={t} className="flex items-center gap-1.5 text-slate-400">{t}</div>
          ))}
        </div>
        <a href="/signup"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white"
          style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
          <Star className="w-4 h-4" /> Create Free Account Now
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export function PDFToolsPublic() {
  const fileRef   = useRef<HTMLInputElement>(null);
  const isLoggedIn = !!localStorage.getItem("token");

  const [tool, setTool]         = useState<Tool | null>(null);
  const [cat,  setCat]          = useState<"convert" | "organize" | "edit">("convert");
  const [files, setFiles]       = useState<File[]>([]);
  const [drag,  setDrag]        = useState(false);
  const [busy,  setBusy]        = useState(false);
  const [stepIdx, setStepIdx]   = useState(0);
  const [result, setResult]     = useState<{ url: string; info?: string } | null>(null);
  const [error,  setError]      = useState("");
  const [fname,  setFname]      = useState("");
  const [banner, setBanner]     = useState(true);
  const [popup,  setPopup]      = useState(false);

  // Extra configs
  const [splitPages, setSplitPages]   = useState("1-5");
  const [rotateDeg,  setRotateDeg]    = useState<90 | 180 | 270>(90);
  const [wmText,     setWmText]       = useState("CONFIDENTIAL");
  const [pnPos,      setPnPos]        = useState<"bottom-center" | "bottom-right">("bottom-center");

  useEffect(() => {
    if (tool) document.title = `${tool.seoTitle} | StudyEarn AI`;
    else document.title = "Free PDF Tools Online — Image to PDF, Merge, Compress & More | StudyEarn AI";
    return () => { document.title = "StudyEarn AI – Free AI Study Tool for Students"; };
  }, [tool]);

  const addFiles = (fl: FileList | null) => {
    if (!fl || !tool) return;
    setError("");
    const arr = Array.from(fl);
    if (!tool.multi) { setFiles([arr[0]]); return; }
    setFiles(prev => Array.from(new Map([...prev, ...arr].map(f => [f.name + f.size, f])).values()));
  };

  const reset = () => { setTool(null); setFiles([]); setBusy(false); setStepIdx(0); setResult(null); setError(""); setFname(""); };

  const pick = (t: Tool) => { setTool(t); setFiles([]); setResult(null); setError(""); setFname(t.filename); };

  const fmt = (b: number) => b < 1048576 ? `${(b / 1024).toFixed(1)}KB` : `${(b / 1048576).toFixed(1)}MB`;

  const convert = async () => {
    if (!tool || !files.length) return;
    if (tool.id === "merge-pdf" && files.length < 2) { setError("Kam se kam 2 PDF files chahiye merge karne ke liye."); return; }
    setBusy(true); setError(""); setStepIdx(0);
    const steps = STEPS[tool.id] ?? STEPS["img-pdf"];
    const iv = setInterval(() => setStepIdx(s => s < steps.length - 1 ? s + 1 : s), 900);
    try {
      let res: Response;
      switch (tool.id) {
        case "img-pdf":      res = await api.imgToPDF(files); break;
        case "merge-pdf":    res = await api.mergePDF(files); break;
        case "split-pdf":    res = await api.splitPDF(files[0], splitPages); break;
        case "compress-pdf": res = await api.compressPDF(files[0]); break;
        case "rotate-pdf":   res = await api.rotatePDF(files[0], rotateDeg); break;
        case "page-numbers": res = await api.pageNumbers(files[0], pnPos); break;
        case "watermark":    res = await api.watermark(files[0], wmText); break;
        default: throw new Error("Unknown tool");
      }
      clearInterval(iv);
      let info: string | undefined;
      if (tool.id === "compress-pdf") {
        const s = res.headers.get("X-Savings-Percent") ?? "0";
        const o = res.headers.get("X-Original-Size")   ?? "0";
        const c = res.headers.get("X-Compressed-Size") ?? "0";
        if (s !== "0") info = `${o}KB → ${c}KB  (${s}% saved 🎉)`;
      }
      setResult({ url: URL.createObjectURL(await res.blob()), info });
      if (!isLoggedIn) setTimeout(() => setPopup(true), 2500);
    } catch (e: any) {
      clearInterval(iv);
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      clearInterval(iv);
      setBusy(false);
    }
  };

  const steps = tool ? (STEPS[tool.id] ?? STEPS["img-pdf"]) : [];

  return (
    <>
      {popup && <PromoPopup onClose={() => setPopup(false)} />}

      <div className="min-h-screen" style={{ background: "#0a0a0f" }}>

        {/* ── Header ─────────────────────────────────────── */}
        <header className="sticky top-0 z-40 border-b"
          style={{ background: "rgba(10,10,15,0.92)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 font-extrabold text-sm text-white">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              StudyEarn AI
            </a>
            <div className="flex items-center gap-2">
              {isLoggedIn
                ? <a href="/app/pdf" className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }}>
                    Dashboard →
                  </a>
                : <>
                    <a href="/login" className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">Login</a>
                    <a href="/signup" className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                      Free Signup 🎁
                    </a>
                  </>}
            </div>
          </div>
        </header>

        {/* ── Main ───────────────────────────────────────── */}
        <main className="max-w-4xl mx-auto px-4 py-6">

          {/* Top promo banner — only guests */}
          {!isLoggedIn && banner && <TopBanner onClose={() => setBanner(false)} />}

          {/* ── Tool Grid ──────────────────────────────── */}
          {!tool && (
            <div className="space-y-5">
              {/* SEO H1 */}
              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-cyan-400" /> Free PDF Tools Online
                </h1>
                <p className="text-sm text-slate-400">
                  Image to PDF, Merge, Compress, Split, Watermark & more — free, no login required, no watermark added
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["✅ 100% Free","🔒 No Login Required","⚡ Fast & Secure","🚫 No Watermark Added","📱 Mobile Friendly"].map(b => (
                    <span key={b} className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                      style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.07)" }}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Category tabs */}
              <div className="flex gap-2">
                {CATS.map(c => (
                  <button key={c.id} onClick={() => setCat(c.id)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={cat === c.id
                      ? { background: "rgba(124,58,237,0.2)", color: "#c4b5fd", border: "1px solid rgba(124,58,237,0.4)" }
                      : { color: "#64748b", border: "1px solid transparent" }}>
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>

              {/* Tool cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {TOOLS.filter(t => t.cat === cat).map(t => (
                  <button key={t.id} onClick={() => pick(t)}
                    className="rounded-2xl p-5 text-left border transition-all group relative overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                      style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.07),rgba(79,70,229,0.04))" }} />
                    <div className="relative flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.grad} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        <t.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <h3 className="font-bold text-white text-sm">{t.title}</h3>
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 ml-auto flex-shrink-0 transition-colors" />
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Bottom promo — guests only */}
              {!isLoggedIn && <BottomPromo />}

              {/* SEO paragraph */}
              <div className="p-5 rounded-2xl space-y-3"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <h2 className="text-sm font-bold text-white">About StudyEarn AI Free PDF Tools</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  StudyEarn AI provides free online PDF tools — no download, no installation, no signup required.
                  Convert images to PDF, merge multiple PDFs, compress large files, split documents, rotate pages,
                  add page numbers, watermarks and more. All tools work on mobile and desktop.
                  Your files are processed securely and not stored on our servers.
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  StudyEarn AI is also a free AI-powered study platform for Indian students — unlimited AI questions,
                  PPT generator, quiz creator, study planner, and real rewards. Perfect for JEE, NEET, UPSC, and board exams.
                </p>
              </div>
            </div>
          )}

          {/* ── Active Tool ──────────────────────────────── */}
          {tool && (
            <div className="space-y-4">

              {/* Breadcrumb */}
              <div className="flex items-center gap-2">
                <button onClick={reset} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" /> PDF Tools
                </button>
                <span className="text-slate-700">/</span>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${tool.grad} flex items-center justify-center`}>
                    <tool.icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-white font-semibold">{tool.title}</span>
                </div>
              </div>

              {/* SEO H1 */}
              <div>
                <h1 className="text-xl font-extrabold text-white">{tool.seoTitle}</h1>
                <p className="text-xs text-slate-500 mt-0.5">Free • No login • No watermark added • Works on all devices</p>
              </div>

              {/* Extra configs */}
              {tool.extra === "split" && !result && (
                <div className="rounded-xl p-4 border space-y-2"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
                  <label className="text-xs font-semibold text-slate-400">Konse pages extract karne hain?</label>
                  <input value={splitPages} onChange={e => setSplitPages(e.target.value)}
                    placeholder="e.g. 1,3,5-7  ya  all"
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <p className="text-xs text-slate-600">"1-5" = pages 1 to 5 &nbsp;·&nbsp; "1,3,7" = specific &nbsp;·&nbsp; "all" = sab</p>
                </div>
              )}

              {tool.extra === "rotate" && !result && (
                <div className="rounded-xl p-4 border space-y-2"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
                  <label className="text-xs font-semibold text-slate-400">Rotation angle:</label>
                  <div className="flex gap-2">
                    {([90, 180, 270] as const).map(d => (
                      <button key={d} onClick={() => setRotateDeg(d)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all"
                        style={rotateDeg === d
                          ? { borderColor: "rgba(124,58,237,0.5)", background: "rgba(124,58,237,0.15)", color: "white" }
                          : { borderColor: "rgba(255,255,255,0.08)", color: "#64748b" }}>
                        {d}°
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {tool.extra === "watermark" && !result && (
                <div className="rounded-xl p-4 border space-y-2"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
                  <label className="text-xs font-semibold text-slate-400">Watermark text:</label>
                  <input value={wmText} onChange={e => setWmText(e.target.value.slice(0, 30))}
                    placeholder="e.g. CONFIDENTIAL, DRAFT"
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <p className="text-xs text-slate-600">Max 30 characters • Diagonal pe stamp hoga</p>
                </div>
              )}

              {tool.extra === "pagenum" && !result && (
                <div className="rounded-xl p-4 border space-y-2"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
                  <label className="text-xs font-semibold text-slate-400">Position:</label>
                  <div className="flex gap-2">
                    {[{ v: "bottom-center", l: "Bottom Center" }, { v: "bottom-right", l: "Bottom Right" }].map(o => (
                      <button key={o.v} onClick={() => setPnPos(o.v as any)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all"
                        style={pnPos === o.v
                          ? { borderColor: "rgba(124,58,237,0.5)", background: "rgba(124,58,237,0.15)", color: "white" }
                          : { borderColor: "rgba(255,255,255,0.08)", color: "#64748b" }}>
                        {o.l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload zone */}
              {!result && (
                <div
                  onDragOver={e => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
                  onClick={() => fileRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all"
                  style={drag
                    ? { borderColor: "rgba(124,58,237,0.7)", background: "rgba(124,58,237,0.06)" }
                    : { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.01)" }}>
                  <input ref={fileRef} type="file" multiple={tool.multi} accept={tool.accept} className="hidden"
                    onChange={e => addFiles(e.target.files)} />
                  <Upload className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-white mb-1">
                    {drag ? "Drop karo!" : "Drag & drop ya click karo"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {tool.multi ? "Multiple files" : "1 file"} •{" "}
                    {tool.accept.split(",").map(a => a.split("/").pop()?.replace(".","")?.toUpperCase()).filter(Boolean).join(" / ")}
                  </p>
                  <p className="text-[11px] mt-2.5 font-medium" style={{ color: "#4ade80" }}>
                    ✅ No login required · Files not stored on server
                  </p>
                </div>
              )}

              {/* File list */}
              {files.length > 0 && !result && (
                <div className="rounded-2xl border overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
                  <div className="px-4 py-3 border-b flex items-center justify-between"
                    style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <span className="text-xs font-medium text-slate-400">{files.length} file{files.length > 1 ? "s" : ""} selected</span>
                    <button onClick={() => setFiles([])} className="text-xs text-slate-600 hover:text-red-400 transition-colors">Clear all</button>
                  </div>
                  <div className="divide-y max-h-44 overflow-y-auto" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3">
                        {f.type.includes("pdf")
                          ? <File className="w-4 h-4 text-red-400 flex-shrink-0" />
                          : <Image className="w-4 h-4 text-green-400 flex-shrink-0" />}
                        <span className="flex-1 text-sm text-slate-300 truncate">{f.name}</span>
                        <span className="text-xs text-slate-600 flex-shrink-0">{fmt(f.size)}</span>
                        <button onClick={() => setFiles(p => p.filter((_, j) => j !== i))}
                          className="text-slate-600 hover:text-red-400 transition-colors ml-1 flex-shrink-0">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="text-sm text-red-400 rounded-xl px-4 py-3"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  ❌ {error}
                </div>
              )}

              {/* Convert button */}
              {files.length > 0 && !result && !busy && (
                <button onClick={convert}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg,#3b82f6,#7c3aed)" }}>
                  <tool.icon className="w-4 h-4" />
                  {tool.title} — Convert Now (Free)
                </button>
              )}

              {/* Progress */}
              {busy && (
                <div className="rounded-2xl border p-10 text-center space-y-4"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                  <div>
                    <p className="text-white font-semibold text-sm">{steps[stepIdx] ?? "Processing…"}</p>
                    <p className="text-xs text-slate-500 mt-1">{files.length} file{files.length > 1 ? "s" : ""} processing…</p>
                  </div>
                  <div className="h-1.5 rounded-full max-w-xs mx-auto overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${((stepIdx + 1) / steps.length) * 100}%`, background: "linear-gradient(90deg,#3b82f6,#7c3aed)" }} />
                  </div>
                </div>
              )}

              {/* Success + Download */}
              {result && (
                <div className="rounded-2xl border p-6 space-y-5"
                  style={{ background: "rgba(34,197,94,0.05)", borderColor: "rgba(34,197,94,0.2)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(34,197,94,0.15)" }}>
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Done! Ready to Download ✅</h3>
                      {result.info && <p className="text-xs text-green-400 mt-0.5">{result.info}</p>}
                    </div>
                  </div>

                  {/* Custom filename */}
                  <div className="rounded-xl p-4 border space-y-2"
                    style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-xs font-semibold text-slate-300">File ka naam set karo:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input value={fname}
                        onChange={e => setFname(e.target.value.replace(/[^a-zA-Z0-9\-_ ]/g, ""))}
                        className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }} />
                      <span className="text-sm text-slate-500 flex-shrink-0">.pdf</span>
                    </div>
                  </div>

                  <button onClick={() => download(result.url, fname || tool.filename)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white"
                    style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}>
                    <Download className="w-4 h-4" />
                    Download: {(fname || tool.filename)}.pdf
                  </button>

                  {/* Post-download promo — guests only */}
                  {!isLoggedIn && (
                    <div className="rounded-xl p-4 space-y-3"
                      style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs font-bold text-white">Signup karo aur +10 points earn karo is conversion ke liye! 🎁</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Logged-in users ko har PDF conversion pe points milte hain. Plus AI tools, PPT generator & daily rewards!</p>
                      <a href="/signup"
                        className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-bold text-white"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                        <Star className="w-3.5 h-3.5" /> Create Free Account
                      </a>
                    </div>
                  )}

                  <button onClick={reset} className="w-full text-xs text-slate-600 hover:text-white transition-colors py-1">
                    ← Convert another file
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* ── Footer ─────────────────────────────────────── */}
        <footer className="mt-12 border-t py-6" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-600">© 2026 StudyEarn AI — Free PDF Tools & AI Study Platform for Students</p>
            <div className="flex gap-4 text-xs text-slate-600">
              <a href="/"        className="hover:text-slate-400 transition-colors">Home</a>
              <a href="/signup"  className="hover:text-slate-400 transition-colors">Free Signup</a>
              <a href="/login"   className="hover:text-slate-400 transition-colors">Login</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default PDFToolsPublic;