// ─────────────────────────────────────────────────────────────
// AskAI.tsx  (v14 — Adaptive Teaching Loop + Personalization Engine)
//
// ROUTE: src/pages/AskAI.tsx
//
// NEW IN v13:
//   GAP #1 FIX — Real Feedback Loop (Comprehension Tracking)
//     • trackComprehension() called on every action button click
//     • awaitingTestAnswer flag: next student msg after "Test me"
//       is auto-evaluated → tracks correct/incorrect in real-time
//     • getAdaptiveStrategyHint() injected into every API request
//     • buildComprehensionContext() adds live session stats to prompt
//     • ComprehensionBadge shows session comprehension % live
//     • resetSessionComprehension() called on startNewChat()
//
//   GAP #2 FIX — Smart Semantic Memory (not context stuffing)
//     • retrieveRelevantMemories() replaces full history dump
//     • Only top 4 most-relevant past memories sent per request
//     • autoExtractAndStoreMemory() auto-indexes each exchange
//     • buildMemoryContext() creates ranked, compact context block
//     • resetSessionMemory() called on startNewChat()
//     • MemoryPulse badge shows live memory count
//
// PREVIOUSLY IN v12 (Frontend):
//   Improvement 2 — StyleChoiceCard: "Beginner / Real-world / Future"
//                   Student gets control over HOW they learn
//   Improvement 7 — WowMomentBadge: every 5 turns AI observes
//                   student's learning pattern — makes AI feel alive
//
// BACKEND (askAIService.ts + askAIDbService.ts):
//   Improvement 1 — Memory Surprise: specific past topic references
//   Improvement 3 — Micro-Learning Hook: curiosity engine after answers
//   Improvement 4 — Mood Tone Shift: urgent/confused/general detection
//   Improvement 5 — Growth Mirror: AI reflects student's progress
//   Improvement 6 — General → Learning Bridge: personalized connection
//   Improvement 8 — Identity: calm + sharp + aware academic companion
//   Improvement 9 — Adaptive Length: quick/detailed prompt detection
//   Improvement 10 — AI asks questions: branching conversation
// ─────────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Brain, Send, Zap, ImagePlus, FileText, X,
  Trash2, MessageSquare,
  ChevronLeft, MoreHorizontal, Check, Pencil,
  Mic, MicOff, Calculator, Code2, FlaskConical,
  BookOpen, ListOrdered, ChevronDown, Plus, Sparkles,
  Square,
  ThumbsUp, RotateCcw, Dumbbell,
  Copy, Pin, Search,
} from "lucide-react";
import { useVoiceInput }      from "../hooks/useVoiceInput";
import { useApp }             from "../context/AppContext";
import { API_URL }            from "../utils/api";
import { incrementAction }    from "../utils/user-api";
import { MarkdownRenderer }   from "../components/MarkdownRenderer";
import { trackProgressEvent } from "../utils/progress-api";
import { checkIsGeneral, fetchGeneralKnowledge, type GKData } from "../utils/general-api";
import { checkIsImageRequest, generateImage as generateAIImage, type ImageGenResult } from "../utils/image-api";
// v13: Gap #1 — Feedback Loop (Comprehension Tracking)
import {
  trackComprehension,
  trackTestResult,
  getSessionComprehensionStats,
  buildComprehensionContext,
  getAdaptiveStrategyHint,
  detectIfAIAskedQuestion,
  resetSessionComprehension,
} from "../utils/comprehension-api";
// v13: Gap #2 — Smart Semantic Memory
import {
  retrieveRelevantMemories,
  buildMemoryContext,
  autoExtractAndStoreMemory,
  resetSessionMemory,
  getSessionMemoryCount,
} from "../utils/smart-memory-api";
// v14: Gap #3 — Adaptive Teaching Loop
import { useAdaptiveTeaching } from "../hooks/useAdaptiveTeaching";
// v14: Gap #4 — Personalization Engine
import { usePersonalization }  from "../hooks/usePersonalization";
import {
  MentorIntelligenceBar,
  WeakTopicBanner,
  IntentBadge,
  type MentorState,
} from "../components/MentorIntelligenceBar";

// ─── Types ────────────────────────────────────────────────────
type Role        = "user" | "assistant";
type SubjectMode = "auto" | "math" | "coding" | "science" | "general";
type EmotionalState = "correct" | "confused" | "frustrated" | "motivated" | "neutral";

// v11/v12: AI-OS enrichment from backend orchestrator
interface AskAIEnrichment {
  recommendation?: {
    title:   string;
    message: string;
    action:  string;
    icon:    string;
    xp:      number;
  } | null;
  progressInsight?: string | null;
  hintMode?:        boolean;
  hintText?:        string | null;
  emotionalNudge?:  string | null;
  // v12: Improvement 5 — Growth Mirror
  growthMirror?: {
    grownTopics:  string[];
    strongTopics: string[];
    totalTurns:   number;
    sessionCount: number;
    message:      string;
  } | null;
  // v12: Improvement 7 — Dynamic Wow Observation (replaces hardcoded)
  wowObservation?: string | null;
}

// v12: Visual Brain segment type
interface VisualSegment {
  type:       'lead' | 'body' | 'key' | 'analogy' | 'formula' | 'warning' | 'hook' | 'heading';
  content:    string;
  highlights: string[];
  emoji?:     string;
}

interface ChatMsg {
  role:           Role;
  content:        string;
  imagePreview?:  string;
  fileName?:      string;
  fileType?:      "image" | "pdf";
  pointsAwarded?: number;
  isError?:       boolean;
  subjectMode?:   SubjectMode;
  visualBrain?:   VisualSegment[];  // v12: visual rendering instructions
  gkData?:        GKData;           // v12: general knowledge from Wikipedia
  imageGen?:      ImageGenResult;   // v12: generated image result
}
interface ConvoSummary {
  _id:           string;
  title:         string;
  lastMessageAt: string;
}

// ─── Subject Mode Config ──────────────────────────────────────
const SUBJECT_MODES: {
  id:     SubjectMode;
  label:  string;
  icon:   any;
  color:  string;
  bg:     string;
  border: string;
  desc:   string;
}[] = [
  { id: "auto",    label: "Auto",    icon: Sparkles,    color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30", desc: "AI picks the best mode"  },
  { id: "math",    label: "Math",    icon: Calculator,  color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/30",   desc: "Step-by-step solving"    },
  { id: "coding",  label: "Coding",  icon: Code2,       color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/30",  desc: "Code with output"        },
  { id: "science", label: "Science", icon: FlaskConical,color: "text-cyan-400",   bg: "bg-cyan-500/10",   border: "border-cyan-500/30",   desc: "Formulas + examples"     },
  { id: "general", label: "General", icon: BookOpen,    color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/30",  desc: "Clear explanations"      },
];

// ─── Helpers ──────────────────────────────────────────────────
async function compressImage(base64: string, maxPx = 1600): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale  = Math.min(1, maxPx / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
}

function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${localStorage.getItem("token") || ""}` };
}

function groupByDate(convos: ConvoSummary[]) {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yest  = new Date(today); yest.setDate(yest.getDate() - 1);
  const week  = new Date(today); week.setDate(week.getDate() - 7);
  const groups = [
    { label: "Today",       items: [] as ConvoSummary[] },
    { label: "Yesterday",   items: [] as ConvoSummary[] },
    { label: "Last 7 days", items: [] as ConvoSummary[] },
    { label: "Older",       items: [] as ConvoSummary[] },
  ];
  for (const c of convos) {
    const d = new Date(c.lastMessageAt);
    if (d >= today)     groups[0].items.push(c);
    else if (d >= yest) groups[1].items.push(c);
    else if (d >= week) groups[2].items.push(c);
    else                groups[3].items.push(c);
  }
  return groups.filter(g => g.items.length > 0);
}

// ─── Mode badge ───────────────────────────────────────────────
function ModeBadge({ mode }: { mode?: SubjectMode }) {
  if (!mode || mode === "auto") return null;
  const m = SUBJECT_MODES.find(s => s.id === mode);
  if (!m) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${m.bg} ${m.color} border ${m.border} mb-1.5`}>
      <m.icon className="w-2.5 h-2.5" />
      {m.label} Mode
    </span>
  );
}

// ─── Emotional Toast ──────────────────────────────────────────
// Shows a brief feedback message when AI detects student's emotion.
// Appears for 3s then fades out.
function EmotionalToast({
  state,
  onDismiss,
}: { state: EmotionalState; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3200);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const configs: Record<Exclude<EmotionalState, "neutral">, { msg: string; classes: string }> = {
    correct:    { msg: "Nice! 🔥 You got it!",                  classes: "bg-green-500/15  border-green-500/30  text-green-300"  },
    confused:   { msg: "No worries — let's try a new angle 🔄", classes: "bg-amber-500/15  border-amber-500/30  text-amber-300"  },
    frustrated: { msg: "You've got this! Break it down 💪",      classes: "bg-blue-500/15   border-blue-500/30   text-blue-300"   },
    motivated:  { msg: "Love the energy! 🚀 Let's go!",          classes: "bg-purple-500/15 border-purple-500/30 text-purple-300" },
  };

  if (state === "neutral") return null;
  const { msg, classes } = configs[state];

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl border text-xs font-semibold shadow-lg animate-fade-in-up ${classes}`}>
      {msg}
    </div>
  );
}

// ─── v11: Enrichment Card ─────────────────────────────────────
// Shows after stream ends: next-topic recommendation, progress
// insight, or hint nudge — from the AI-OS orchestrator pipeline.
function EnrichmentCard({
  enrichment,
  onDismiss,
}: {
  enrichment: AskAIEnrichment;
  onDismiss: () => void;
}) {
  if (!enrichment.recommendation && !enrichment.progressInsight && !enrichment.emotionalNudge) return null;
  // Note: growthMirror and wowObservation are handled by dedicated components

  return (
    <div className="mt-3 space-y-2">
      {/* Emotional nudge for frustrated/confused students */}
      {enrichment.emotionalNudge && (
        <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl border border-blue-500/20 bg-blue-500/8 text-blue-300 text-xs leading-relaxed">
          <span className="mt-0.5 flex-shrink-0">💙</span>
          <span>{enrichment.emotionalNudge}</span>
          <button onClick={onDismiss} className="ml-auto flex-shrink-0 text-blue-400/60 hover:text-blue-300 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Progress insight */}
      {enrichment.progressInsight && (
        <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl border border-violet-500/20 bg-violet-500/8 text-violet-300 text-xs leading-relaxed">
          <span className="mt-0.5 flex-shrink-0">📊</span>
          <span>{enrichment.progressInsight}</span>
        </div>
      )}

      {/* Next-topic recommendation */}
      {enrichment.recommendation && (
        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-amber-500/8">
          <span className="text-base flex-shrink-0">{enrichment.recommendation.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-amber-300 text-xs font-semibold truncate">{enrichment.recommendation.title}</p>
            <p className="text-amber-300/70 text-[11px] truncate">{enrichment.recommendation.message}</p>
          </div>
          <span className="flex-shrink-0 text-[10px] font-semibold text-amber-400 bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 rounded-full">
            +{enrichment.recommendation.xp} XP
          </span>
          <button onClick={onDismiss} className="flex-shrink-0 text-amber-400/60 hover:text-amber-300 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── v11: Hint Banner ─────────────────────────────────────────
// Shows when AI chose HINT/GUIDE strategy — socratic nudge
function HintBanner({ text, onDismiss }: { text: string; onDismiss: () => void }) {
  return (
    <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl border border-cyan-500/25 bg-cyan-500/8 text-cyan-300 text-xs leading-relaxed mt-2">
      <Zap className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" />
      <span>{text}</span>
      <button onClick={onDismiss} className="ml-auto flex-shrink-0 text-cyan-400/60 hover:text-cyan-300 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Image Result Card (v12 — Feature 2) ────────────────────
// Shows generated image/diagram inline in chat
// Supports: base64 PNG, URL, SVG diagrams
// Handles: expired base64 (not stored in DB) with regenerate prompt
function ImageResultCard({ result, prompt }: { result: ImageGenResult; prompt: string }) {
  const [downloaded, setDownloaded] = useState(false);

  // Error case
  if (!result.success) {
    return (
      <div className="mt-1 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-300 text-sm">
        ⚠️ {result.error || "Image generation failed. Please try again."}
      </div>
    );
  }

  // Base64 image was not stored in DB
  if (!result.imageB64 && !result.imageUrl && !result.svgContent) {
    return (
      <div className="mt-1 px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-300 text-sm space-y-1.5">
        <p className="font-semibold">🖼️ Image not available</p>
        <p className="text-amber-300/70 text-xs">This image was generated before storage was enabled. Ask again to regenerate!</p>
        <p className="text-slate-500 text-[11px] font-mono">Prompt: {prompt.slice(0, 80)}…</p>
      </div>
    );
  }

  const handleDownload = async () => {
    const filename = `studyearn-${Date.now()}`;

    if (result.imageB64) {
      // Real image from NVIDIA FLUX / Pollinations → download as PNG
      const a = document.createElement("a");
      a.href = `data:image/png;base64,${result.imageB64}`;
      a.download = `${filename}.png`;
      a.click();
    } else if (result.imageUrl) {
      window.open(result.imageUrl, "_blank");
    } else if (result.svgContent) {
      // SVG → convert to PNG using canvas, then download
      try {
        const svgBlob = new Blob([result.svgContent], { type: "image/svg+xml;charset=utf-8" });
        const svgUrl  = URL.createObjectURL(svgBlob);
        const img     = new Image();

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("SVG load failed"));
          img.src = svgUrl;
        });

        const canvas = document.createElement("canvas");
        canvas.width  = 1200;
        canvas.height = 900;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(svgUrl);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${filename}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }, "image/png");
      } catch {
        // Fallback: download as SVG if canvas conversion fails
        const blob = new Blob([result.svgContent], { type: "image/svg+xml" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href     = url;
        a.download = `${filename}.svg`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const providerLabel = result.provider?.includes("svg")          ? "SVG Diagram"    :
                        result.provider?.includes("nvidia")        ? "NVIDIA FLUX"    :
                        result.provider?.includes("pollinations")   ? "Pollinations AI" :
                        result.provider?.includes("huggingface")    ? "HuggingFace AI" :
                        "AI Generated";

  return (
    <div className="mt-1 mb-2">
      {/* Provider badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-violet-500/30 bg-violet-500/8 text-violet-300">
          🎨 {providerLabel}
        </span>
        <span className="text-[10px] text-slate-600 truncate">{prompt.slice(0, 50)}</span>
      </div>

      {/* Image display */}
      {result.isSvg && result.svgContent ? (
        <div
          className="w-full max-w-2xl rounded-xl overflow-hidden border border-white/10 bg-white"
          style={{ maxHeight: "500px" }}
          dangerouslySetInnerHTML={{ __html: result.svgContent }}
        />
      ) : (
        <img
          src={result.imageB64
            ? `data:image/png;base64,${result.imageB64}`
            : result.imageUrl}
          alt={prompt}
          className="w-full max-w-2xl rounded-xl border border-white/10 object-contain"
          style={{ maxHeight: "500px", background: "#0a0f1e" }}
        />
      )}

      {/* Download button */}
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all active:scale-95"
        >
          {downloaded ? "✓ Saved!" : "⬇ Download PNG"}
        </button>
        <span className="text-[10px] text-slate-600">via {result.provider}</span>
      </div>
    </div>
  );
}

// ─── General Knowledge Card (v12 — Feature 3) ──────────────
// Shown when student asks a "who is / what is" general question.
// Data comes from Wikipedia — FREE, unlimited, no API key.
// Includes: image, key facts, wiki link.
function GKCard({ data }: { data: GKData }) {
  const typeEmoji: Record<string, string> = {
    person:  "👤",
    place:   "🌍",
    concept: "💡",
    event:   "📅",
    unknown: "🔍",
  };
  const emoji = typeEmoji[data.type] || "🔍";
  const typeColor: Record<string, string> = {
    person:  "text-violet-300 border-violet-500/30 bg-violet-500/8",
    place:   "text-teal-300 border-teal-500/30 bg-teal-500/8",
    concept: "text-blue-300 border-blue-500/30 bg-blue-500/8",
    event:   "text-amber-300 border-amber-500/30 bg-amber-500/8",
    unknown: "text-slate-300 border-slate-500/30 bg-slate-500/8",
  };
  const badgeCls = typeColor[data.type] || typeColor.unknown;

  return (
    <div className="mt-1 mb-2">
      {/* Header with type badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badgeCls}`}>
          {emoji} {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
        </span>
        <h2 className="text-white font-bold text-base">{data.title}</h2>
      </div>

      {/* Image + summary side by side on desktop */}
      <div className="flex gap-4 items-start">
        {data.imageUrl && (
          <div className="flex-shrink-0">
            <img
              src={data.imageUrl}
              alt={data.imageCaption || data.title}
              className="w-24 h-28 object-cover rounded-xl border border-white/10 shadow-lg"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">
            {data.summary}
          </p>
        </div>
      </div>

      {/* Key facts */}
      {data.keyFacts.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Key Facts</p>
          {data.keyFacts.slice(0, 3).map((fact, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
              <span className="text-violet-400 flex-shrink-0 mt-0.5">◆</span>
              <span className="leading-relaxed">{fact}</span>
            </div>
          ))}
        </div>
      )}

      {/* Wikipedia link */}
      {data.wikiUrl && (
        <div className="mt-3">
          <a
            href={data.wikiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
            </svg>
            Read more on Wikipedia ↗
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Style Choice Card (Improvement 2) ──────────────────────
// Shows after AI explains a concept — gives student control
// over HOW they want to learn: beginner / real-world / future
// This turns passive reading into active learning choice.
function StyleChoiceCard({ onChoice }: { onChoice: (prompt: string) => void }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const choices = [
    { label: "🎓 Beginner friendly",  prompt: "Isko aur simple way mein samjhao — jaise main pehli baar sun raha hoon." },
    { label: "🌍 Real-world example", prompt: "Ek real-world example do jo daily life se relate kare — ekdum relatable." },
    { label: "🚀 Future impact",       prompt: "Batao yeh topic future mein kaise kaam aayega aur main isko kyun seekhun." },
  ];

  return (
    <div className="mt-3 pt-2.5 border-t border-white/5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] text-slate-500 font-medium">Isko kis style mein samajhna chahoge?</p>
        <button onClick={() => setDismissed(true)} className="text-slate-700 hover:text-slate-500 transition-colors">
          <X className="w-3 h-3" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {choices.map(c => (
          <button
            key={c.label}
            onClick={() => { onChoice(c.prompt); setDismissed(true); }}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] border border-white/8 text-slate-400 hover:text-white hover:bg-violet-500/10 hover:border-violet-500/25 transition-all active:scale-95"
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Wow Moment Toast (Improvement 7) ────────────────────────
// Shows a brief AI observation about student's learning pattern
// Triggers every 5-6 exchanges — makes AI feel alive + aware
function WowMomentBadge({ text, onDismiss }: { text: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="mt-2 flex items-start gap-2 px-3 py-2 rounded-xl border border-yellow-500/20 bg-yellow-500/8 text-yellow-300 text-xs leading-relaxed animate-fade-in-up">
      <span className="flex-shrink-0 mt-0.5">✨</span>
      <span className="flex-1">{text}</span>
      <button onClick={onDismiss} className="flex-shrink-0 text-yellow-500/60 hover:text-yellow-300 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}


// ─── v13: Comprehension Badge ─────────────────────────────────
// Live session comprehension % shown in header.
function ComprehensionBadge({ rate, total }: { rate: number; total: number }) {
  if (total === 0) return null;
  const color =
    rate >= 75 ? "text-emerald-400 border-emerald-500/25 bg-emerald-500/8" :
    rate >= 50 ? "text-amber-400 border-amber-500/25 bg-amber-500/8" :
                 "text-red-400 border-red-500/25 bg-red-500/8";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${color}`}>
      🧠 {rate}%
    </span>
  );
}

// ─── v13: Memory Pulse Badge ──────────────────────────────────
function MemoryPulseBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-violet-500/25 bg-violet-500/8 text-violet-400">
      💾 {count}
    </span>
  );
}

// ─── Growth Mirror Card (v12 — Improvement 5) ───────────────
// Shows at start of first AI response in a session.
// Visible proof of student's actual progress — NOT generic.
// Data comes from real DB session history via SSE enrichment.
function GrowthMirrorCard({
  data,
  onDismiss,
}: {
  data: NonNullable<AskAIEnrichment["growthMirror"]>;
  onDismiss: () => void;
}) {
  return (
    <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/8 animate-fade-in-up">
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mt-0.5">
        <span className="text-sm">📈</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-emerald-300 text-xs font-semibold mb-0.5">Your Growth Mirror</p>
        <p className="text-emerald-200/80 text-xs leading-relaxed">{data.message}</p>
        {data.grownTopics.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {data.grownTopics.slice(0, 3).map(t => (
              <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                ✓ {t}
              </span>
            ))}
          </div>
        )}
        {data.totalTurns > 0 && (
          <p className="text-emerald-400/50 text-[10px] mt-1.5">
            {data.totalTurns} questions across {data.sessionCount} session{data.sessionCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>
      <button onClick={onDismiss} className="flex-shrink-0 text-emerald-500/50 hover:text-emerald-300 transition-colors mt-0.5">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Action Buttons ───────────────────────────────────────────
// Shown below EVERY completed AI response (not while streaming).
// "Samajh aaya 👍" / "Dubara samjhao 🔁" / "Test me 🧠"
function ActionButtons({
  onAction,
}: { onAction: (type: "understood" | "reexplain" | "testme") => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-white/5">
      <button
        onClick={() => onAction("understood")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 hover:border-green-500/35 transition-all active:scale-95"
      >
        <ThumbsUp className="w-3 h-3" />
        Samajh aaya 👍
      </button>
      <button
        onClick={() => onAction("reexplain")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/35 transition-all active:scale-95"
      >
        <RotateCcw className="w-3 h-3" />
        Dubara samjhao 🔁
      </button>
      <button
        onClick={() => onAction("testme")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/35 transition-all active:scale-95"
      >
        <Dumbbell className="w-3 h-3" />
        Test me 🧠
      </button>
    </div>
  );
}

// ─── User Bubble ──────────────────────────────────────────────
function UserBubble({
  msg,
  onEdit,
}: {
  msg:    ChatMsg;
  onEdit: (content: string) => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const [copied,      setCopied]      = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const bubbleRef  = useRef<HTMLDivElement>(null);

  function handleCopy() {
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  // Click/tap outside the entire bubble+actions area → hide actions
  useEffect(() => {
    if (!showActions) return;
    function handler(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      // Agar click bubble ya actions ke andar hua → ignore
      if (bubbleRef.current?.contains(target)) return;
      if (actionsRef.current?.contains(target)) return;
      setShowActions(false);
    }
    // Delay taaki current tap/click already process ho jaye
    const t = setTimeout(() => {
      document.addEventListener("click",     handler);
      document.addEventListener("touchstart", handler, { passive: true });
    }, 150);
    return () => {
      clearTimeout(t);
      document.removeEventListener("click",      handler);
      document.removeEventListener("touchstart",  handler);
    };
  }, [showActions]);

  return (
    <div className="flex justify-end group/user">
      <div className="max-w-[75%] space-y-2">
        {msg.imagePreview && (
          <div className="flex justify-end">
            <img src={msg.imagePreview} alt="uploaded"
              className="max-h-48 rounded-2xl border border-white/10 object-contain bg-black/20" />
          </div>
        )}
        {msg.fileName && !msg.imagePreview && (
          <div className="flex justify-end">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
              <FileText className="w-3.5 h-3.5" />
              <span className="max-w-[180px] truncate">{msg.fileName}</span>
            </div>
          </div>
        )}
        {msg.content && (
          <div className="relative">

            {/* Action buttons — always rendered, shown via state OR hover */}
            <div
              ref={actionsRef}
              className={`flex justify-end gap-1.5 mb-1.5 transition-opacity duration-150 ${
                showActions
                  ? "opacity-100"
                  : "opacity-0 group-hover/user:opacity-100 pointer-events-none group-hover/user:pointer-events-auto"
              }`}
            >
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={() => { handleCopy(); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0f1120] border border-white/10 text-[10px] font-medium text-slate-300 hover:text-white hover:border-white/20 active:scale-95 transition-all shadow-lg"
              >
                {copied
                  ? <><Check className="w-3 h-3 text-green-400" /> Copied</>
                  : <><Copy className="w-3 h-3" /> Copy</>
                }
              </button>
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={() => { setShowActions(false); onEdit(msg.content); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0f1120] border border-white/10 text-[10px] font-medium text-slate-300 hover:text-white hover:border-white/20 active:scale-95 transition-all shadow-lg"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
            </div>

            {/* Bubble — tap toggles actions */}
            <div
              ref={bubbleRef}
              onClick={() => setShowActions(prev => !prev)}
              className="bg-gradient-to-br from-violet-600/30 to-blue-600/20 border border-violet-500/25 rounded-2xl rounded-tr-sm px-4 py-3 cursor-pointer select-none active:opacity-80 transition-opacity"
            >
              <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

// ─── AI Bubble ────────────────────────────────────────────────
function AIBubble({
  msg,
  isPremium,
  isStreaming = false,
  isLast = false,
  onQuickAction,
  onStyleChoice,
}: {
  msg:           ChatMsg;
  isPremium:     boolean;
  isStreaming?:  boolean;
  isLast?:       boolean;
  onQuickAction: (type: "understood" | "reexplain" | "testme") => void;
  onStyleChoice: (prompt: string) => void;
}) {
  const [copied,      setCopied]      = useState(false);
  const [showCopy,    setShowCopy]    = useState(false);
  const modeConfig = SUBJECT_MODES.find(s => s.id === (msg.subjectMode || "auto"));

  function handleCopy() {
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  // Click outside → hide copy button
  useEffect(() => {
    if (!showCopy) return;
    const handler = () => setShowCopy(false);
    const t = setTimeout(() => document.addEventListener("click", handler), 100);
    return () => { clearTimeout(t); document.removeEventListener("click", handler); };
  }, [showCopy]);

  return (
    <div className="w-full group/ai">
      {/* Mode badge — no avatar, full width response */}
      {msg.subjectMode && msg.subjectMode !== "auto" && (
        <div className="mb-1.5"><ModeBadge mode={msg.subjectMode} /></div>
      )}

      {/* AI response — clean, no box, no border */}
      <div
        className={`w-full ${msg.isError ? "text-red-300" : "text-white"}`}
        onClick={() => { if (!isStreaming && !msg.isError && msg.content) setShowCopy(p => !p); }}
      >
        {msg.isError
          ? <p className="text-sm leading-relaxed">{msg.content}</p>
          : msg.imageGen
            ? (
              <div>
                <p className="text-sm text-slate-300 mb-2">{msg.content}</p>
                <ImageResultCard result={msg.imageGen} prompt={msg.imageGen.prompt} />
              </div>
            )
            : msg.gkData
              ? <GKCard data={msg.gkData} />
              : <MarkdownRenderer content={msg.content} visualBrain={msg.visualBrain} />}
        {isStreaming && (
          <span className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 animate-pulse align-middle" />
        )}
      </div>

      {!!msg.pointsAwarded && (
        <div className="mt-1">
          <span className="text-xs font-medium text-green-400">
            +{msg.pointsAwarded} pts ✓{isPremium && msg.pointsAwarded > 10 ? " ⚡" : ""}
          </span>
        </div>
      )}

      {/* Copy button */}
      {!isStreaming && !msg.isError && msg.content && (
        <div className={`transition-all duration-150 pt-0.5 ${
          showCopy ? "opacity-100" : "opacity-0 group-hover/ai:opacity-100"
        }`}>
          <button
            onClick={e => { e.stopPropagation(); handleCopy(); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/8 text-[10px] font-medium text-slate-500 hover:text-slate-200 hover:bg-white/[0.08] hover:border-white/15 active:scale-95 transition-all"
          >
            {copied
              ? <><Check className="w-3 h-3 text-green-400" /> Copied!</>
              : <><Copy className="w-3 h-3" /> Copy</>
            }
          </button>
        </div>
      )}

      {/* Action Buttons — last completed AI message only */}
      {isLast && !isStreaming && !msg.isError && msg.content && (
        <>
          <ActionButtons onAction={onQuickAction} />
          {(msg.content.includes("📖") || msg.content.includes("EXPLANATION") ||
            msg.content.toLowerCase().includes("let me explain") ||
            msg.content.length > 300) && (
            <StyleChoiceCard onChoice={onStyleChoice} />
          )}
        </>
      )}
    </div>
  );
}

// ─── ConvoItem ────────────────────────────────────────────────
// Reusable sidebar conversation item — used in both grouped
// view and search results view. Supports highlight of matched text.
function ConvoItem({
  c, activeId, menuOpenId, renamingId, renameValue, searchQuery,
  longPressTimer, onLoad, onMenuToggle, onMenuOpen,
  onRenameStart, onRenameChange, onRenameConfirm, onRenameCancel, onDelete,
}: {
  c:               ConvoSummary;
  activeId:        string | null;
  menuOpenId:      string | null;
  renamingId:      string | null;
  renameValue:     string;
  searchQuery:     string;
  longPressTimer:  React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  onLoad:          () => void;
  onMenuToggle:    () => void;
  onMenuOpen:      () => void;
  onRenameStart:   () => void;
  onRenameChange:  (v: string) => void;
  onRenameConfirm: () => void;
  onRenameCancel:  () => void;
  onDelete:        () => void;
}) {
  // Highlight matched text in title
  function HighlightTitle() {
    if (!searchQuery) return <span className="flex-1 truncate">{c.title}</span>;
    const idx = c.title.toLowerCase().indexOf(searchQuery);
    if (idx === -1) return <span className="flex-1 truncate">{c.title}</span>;
    return (
      <span className="flex-1 truncate">
        {c.title.slice(0, idx)}
        <mark className="bg-blue-500/30 text-blue-200 rounded px-0.5 not-italic">
          {c.title.slice(idx, idx + searchQuery.length)}
        </mark>
        {c.title.slice(idx + searchQuery.length)}
      </span>
    );
  }

  return (
    <div className="relative group/item">
      {renamingId === c._id ? (
        <div className="flex items-center gap-1 px-2 py-1">
          <input value={renameValue} onChange={e => onRenameChange(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") onRenameConfirm(); if (e.key === "Escape") onRenameCancel(); }}
            autoFocus className="flex-1 bg-white/[0.06] border border-blue-500/30 rounded-lg px-2 py-1.5 text-xs text-white outline-none" />
          <button onClick={onRenameConfirm} className="text-green-400 hover:text-green-300 p-1"><Check className="w-3.5 h-3.5" /></button>
          <button onClick={onRenameCancel} className="text-slate-500 hover:text-slate-300 p-1"><X className="w-3.5 h-3.5" /></button>
        </div>
      ) : (
        <button
          onClick={onLoad}
          onMouseDown={() => { longPressTimer.current = setTimeout(onMenuOpen, 600); }}
          onMouseUp={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
          onMouseLeave={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
          onTouchStart={() => { longPressTimer.current = setTimeout(onMenuOpen, 600); }}
          onTouchEnd={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
          className={`w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition-all group/btn ${
            activeId === c._id
              ? "bg-white/[0.07] text-white border border-white/10"
              : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
          }`}>
          <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-slate-600 group-hover/btn:text-slate-400" />
          <HighlightTitle />
          <span onClick={e => { e.stopPropagation(); onMenuToggle(); }}
            className={`p-0.5 rounded transition-opacity flex-shrink-0 ${menuOpenId === c._id ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"}`}>
            <MoreHorizontal className="w-3.5 h-3.5 text-slate-500 hover:text-white" />
          </span>
        </button>
      )}

      {/* Context menu */}
      {menuOpenId === c._id && renamingId !== c._id && (
        <div className="absolute right-2 top-9 z-50 bg-[#0f1120] border border-white/10 rounded-xl shadow-2xl overflow-hidden w-40 py-1"
          onClick={e => e.stopPropagation()}>
          <button onClick={onRenameStart}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors">
            <Pencil className="w-3.5 h-3.5" /> Rename
          </button>
          <div className="h-px bg-white/[0.06] mx-3" />
          <button onClick={onDelete}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Mode Selector Bar ────────────────────────────────────────
function ModeSelector({
  selected, onChange,
}: { selected: SubjectMode; onChange: (m: SubjectMode) => void }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
      {SUBJECT_MODES.map(m => {
        const active = selected === m.id;
        return (
          <button key={m.id} onClick={() => onChange(m.id)} title={m.desc}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border flex-shrink-0 ${
              active
                ? `${m.bg} ${m.color} ${m.border}`
                : "bg-white/[0.03] text-slate-500 border-white/5 hover:text-slate-300 hover:bg-white/[0.05]"
            }`}>
            <m.icon className="w-3 h-3" />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Suggestions per mode ─────────────────────────────────────
const MODE_SUGGESTIONS: Record<SubjectMode, string[]> = {
  auto:    ["Explain photosynthesis with diagram", "Solve: ∫x²dx from 0 to 1", "Write a Python function to reverse a string", "What is Newton's 3rd Law? Give examples"],
  math:    ["Solve: 2x² + 5x - 3 = 0", "Integrate ∫sin(x)cos(x)dx", "Find the derivative of x³ln(x)", "Prove that √2 is irrational"],
  coding:  ["Write a binary search in Python", "Explain Big O notation with examples", "Debug: why does my loop run infinitely?", "Difference between stack and queue with code"],
  science: ["Explain photosynthesis step by step", "What is Newton's 2nd law with examples?", "How does DNA replication work?", "Explain Ohm's law with a circuit example"],
  general: ["Explain the French Revolution briefly", "What causes inflation?", "How does the internet work?", "Difference between communism and socialism"],
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export function AskAI() {
  const {
    questionsLeft, setQuestionsLeft, useQuestion, addPoints, userId,
    logActivity, isPremium, checkAndUnlockAchievements, userStats, setUserStats,
  } = useApp();

  // ── Mode & Step-by-step ──────────────────────────────────
  const [subjectMode, setSubjectMode] = useState<SubjectMode>("auto");
  const [stepByStep,  setStepByStep]  = useState(false);
  const [showModeBar, setShowModeBar] = useState(true);

  // ── Sidebar ──────────────────────────────────────────────
  const [convos,        setConvos]        = useState<ConvoSummary[]>([]);
  const [activeId,      setActiveId]      = useState<string | null>(null);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [renamingId,    setRenamingId]    = useState<string | null>(null);
  const [renameValue,   setRenameValue]   = useState("");
  const [menuOpenId,    setMenuOpenId]    = useState<string | null>(null);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  // ── v10: Long-press for sidebar context menu ─────────────
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Chat ─────────────────────────────────────────────────
  const [messages,    setMessages]    = useState<ChatMsg[]>([]);
  const [question,    setQuestion]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  // ── v10: Edit mode state ──────────────────────────────────
  const [isEditing,         setIsEditing]         = useState(false);
  const [editOriginalMsgs,  setEditOriginalMsgs]  = useState<ChatMsg[]>([]);

  // ── Streaming ────────────────────────────────────────────
  const [isStreaming,      setIsStreaming]      = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  // ── Mentor Intelligence (Stage 6) ────────────────────────
  const [mentorState, setMentorState] = useState<MentorState>({
    intent: null, strategy: null, skillLevel: null, turnCount: 0,
  });
  const [sessionTopics,   setSessionTopics]   = useState<string[]>([]);
  const [mistakeTopics,   setMistakeTopics]   = useState<string[]>([]);
  const [weakTopicBanner, setWeakTopicBanner] = useState<string | null>(null);
  const [showMentorBar,   setShowMentorBar]   = useState(true);

  // ── Emotional State (v8 NEW) ─────────────────────────────
  const [emotionalState,    setEmotionalState]    = useState<EmotionalState>("neutral");
  const [showEmotionalToast, setShowEmotionalToast] = useState(false);

  // ── v12: Wow Moment (Improvement 7) ─────────────────────
  const [wowMoment,     setWowMoment]     = useState<string | null>(null);
  const [showWowMoment, setShowWowMoment] = useState(false);

  // ── v12: Visual Brain state ───────────────────────────
  // Maps message content hash → visual segments from brain
  const [visualBrainMap, setVisualBrainMap] = useState<Record<string, VisualSegment[]>>({});

  // ── v11: AI-OS Enrichment state ──────────────────────────
  const [enrichment,     setEnrichment]     = useState<AskAIEnrichment | null>(null);
  const [showHintBanner, setShowHintBanner] = useState(false);
  const [hintText,       setHintText]       = useState<string | null>(null);

  // ── v12: Growth Mirror state (Improvement 5) ─────────────
  const [growthMirror,     setGrowthMirror]     = useState<AskAIEnrichment["growthMirror"]>(null);
  const [showGrowthMirror, setShowGrowthMirror] = useState(false);

  // ── v13: Gap #1 — Comprehension Tracking state ──────────────
  const [comprehensionRate,       setComprehensionRate]       = useState(100);
  const [comprehensionTotal,      setComprehensionTotal]      = useState(0);
  const [awaitingTestAnswer,      setAwaitingTestAnswer]      = useState(false);
  const [pendingTestTopic,        setPendingTestTopic]        = useState<string | null>(null);
  const [lastComprehensionAction, setLastComprehensionAction] = useState<string | null>(null);

  // ── v13: Gap #2 — Smart Memory state ─────────────────────────
  const [sessionMemoryCount, setSessionMemoryCount] = useState(0);

  // ── Comeback Nudge (v8 NEW) ──────────────────────────────
  const [showComebackNudge, setShowComebackNudge] = useState(false);
  const comebackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── File ─────────────────────────────────────────────────
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileType,     setFileType]     = useState<"image" | "pdf" | null>(null);
  const [previewSrc,   setPreviewSrc]   = useState<string | null>(null);
  const [isDragging,   setIsDragging]   = useState(false);
  const [voiceLang,    setVoiceLang]    = useState<"hi-IN" | "en-IN">("en-IN");

  // ── Voice ─────────────────────────────────────────────────
  const { isListening, isUnsupported, interimText, error: voiceError, toggleListening } = useVoiceInput({
    lang: voiceLang,
    onTranscript: (text) => {
      setQuestion(text);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
      }
    },
  });

  // ── v14: Gap #3 — Adaptive Teaching Loop ────────────────────
  const {
    cycle:                  teachingCycle,
    startTeachingCycle,
    markExplainDone,
    recordCheckQuestion,
    markStudentPassed,
    markStudentFailed,
    resetCycle:             resetTeachingCycle,
    completeCycle:          completeTeachingCycle,
    getTeachingInstructions,
    shouldStartCycle,
    isStudentAnsweringCheck,
    getTeachingStats,
  } = useAdaptiveTeaching();

  // ── v14: Gap #4 — Personalization Engine ─────────────────────
  const {
    profile:                personaProfile,
    recordStyleChoice,
    recordComprehensionAction: recordPersonaAction,
    recordTestResult:       recordPersonaTestResult,
    recordTurn,
    buildPersonalizationContext,
    getSkillLevelForSubject,
    resetPersonalization,
    getPersonalizationSummary,
  } = usePersonalization();

  // ── Quota ─────────────────────────────────────────────────
  const [nextRefillSecs, setNextRefillSecs] = useState(0);
  const [videoAdsLeft,   setVideoAdsLeft]   = useState(5);
  const [watchingAd,     setWatchingAd]     = useState(false);
  const [adCountdown,    setAdCountdown]    = useState(0);
  const refillTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fileRef     = useRef<HTMLInputElement>(null);
  const convoIdRef  = useRef<string | null>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const withUserRef = useRef<ChatMsg[]>([]);

  // ── Fetch conversations ──────────────────────────────────
  const fetchConvos = useCallback(async () => {
    setLoadingConvos(true);
    try {
      const res  = await fetch(`${API_URL}/api/chat`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setConvos(data.conversations);
    } catch {}
    finally { setLoadingConvos(false); }
  }, []);

  useEffect(() => { fetchConvos(); }, [fetchConvos]);

  // ── v10: Close sidebar context menu on outside click ────
  useEffect(() => {
    if (!menuOpenId) return;
    const handler = () => setMenuOpenId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuOpenId]);

  // ── Fetch quota ──────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_URL}/api/ai/quota`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setQuestionsLeft(d.questionsLeft);
          setNextRefillSecs(d.nextRefillSecs || 0);
          setVideoAdsLeft(d.videoAdsLeft ?? 5);
        }
      })
      .catch(() => {});
  }, []);

  // ── Refill countdown ────────────────────────────────────
  useEffect(() => {
    if (refillTimerRef.current) clearInterval(refillTimerRef.current);
    if (nextRefillSecs <= 0) return;
    refillTimerRef.current = setInterval(() => {
      setNextRefillSecs(prev => {
        if (prev <= 1) {
          clearInterval(refillTimerRef.current!);
          fetch(`${API_URL}/api/ai/quota`, { headers: authHeaders() })
            .then(r => r.json())
            .then(d => { if (d.success) { setQuestionsLeft(d.questionsLeft); setNextRefillSecs(d.nextRefillSecs || 0); } })
            .catch(() => {});
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (refillTimerRef.current) clearInterval(refillTimerRef.current); };
  }, [nextRefillSecs]);

  // ── Auto scroll ──────────────────────────────────────────
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading, streamingContent]);

  // ── Auto resize textarea ─────────────────────────────────
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (!question) { ta.style.height = "32px"; return; }
    requestAnimationFrame(() => {
      if (!ta) return;
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    });
  }, [question]);

  // ── Close menu on outside click ──────────────────────────
  useEffect(() => {
    if (!menuOpenId) return;
    const close = () => setMenuOpenId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpenId]);

  // ── Cleanup abort on unmount ──────────────────────────────
  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  // ── Comeback nudge — 5min inactivity trigger (v8 NEW) ────
  useEffect(() => {
    if (!messages.length || loading || isStreaming) return;
    if (comebackTimerRef.current) clearTimeout(comebackTimerRef.current);
    comebackTimerRef.current = setTimeout(() => {
      setShowComebackNudge(true);
    }, 5 * 60 * 1000); // 5 minutes
    return () => { if (comebackTimerRef.current) clearTimeout(comebackTimerRef.current); };
  }, [messages, loading, isStreaming]);

  // ─────────────────────────────────────────────────────────
  // API helpers
  // ─────────────────────────────────────────────────────────
  async function loadConversation(id: string) {
    setActiveId(id); convoIdRef.current = id; setSidebarOpen(false);
    // ── v9 FIX: Server-side RAM memory reset karo ──────────────
    // Jab user kisi purani chat pe click karta hai, server ke RAM mein
    // galat session hota hai. Yeh call us session ko clear karta hai.
    fetch(`${API_URL}/api/ai/reset-session`, {
      method:  "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body:    JSON.stringify({ convoId: id }),
    }).catch(() => {});
    try {
      const res  = await fetch(`${API_URL}/api/chat/${id}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setMessages(data.conversation.messages.map((m: any) => ({
          role:          m.role,
          content:       m.content,
          fileName:      m.fileName      || undefined,
          fileType:      m.fileType      || undefined,
          pointsAwarded: m.pointsAwarded || undefined,
          isError:       m.isError       || false,
          subjectMode:   m.subjectMode   || undefined,
          // v12: restore image gen and GK data from DB
          imageGen:      m.imageGen      || undefined,
          gkData:        m.gkData        || undefined,
        })));
      }
    } catch {}
  }

  async function createNewConvo(firstMessage?: string): Promise<string | null> {
    try {
      const res  = await fetch(`${API_URL}/api/chat`, {
        method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ firstMessage }),
      });
      const data = await res.json();
      if (data.success) {
        const c: ConvoSummary = { _id: data.conversation._id, title: data.conversation.title, lastMessageAt: data.conversation.lastMessageAt };
        setConvos(prev => [c, ...prev]);
        setActiveId(data.conversation._id);
        return data.conversation._id;
      }
    } catch {}
    return null;
  }

  async function saveMessages(convoId: string, msgs: ChatMsg[]) {
    try {
      const res = await fetch(`${API_URL}/api/chat/${convoId}/messages`, {
        method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs.map(m => {
          // For imageGen: send base64 to server — server will compress it (512px JPEG ~80KB)
          // SVG stored as-is (small text), base64 compressed by server before DB storage
          let imageGenToStore: any = null;
          if (m.imageGen) {
            imageGenToStore = {
              success:    m.imageGen.success,
              provider:   m.imageGen.provider,
              prompt:     m.imageGen.prompt,
              isSvg:      m.imageGen.isSvg     || false,
              svgContent: m.imageGen.svgContent || null,
              imageUrl:   m.imageGen.imageUrl   || null,
              imageB64:   m.imageGen.imageB64   || null, // send to server for compression
              error:      m.imageGen.error || null,
            };
          }
          return {
            role:          m.role,
            content:       m.content,
            fileName:      m.fileName      || null,
            fileType:      m.fileType      || null,
            pointsAwarded: m.pointsAwarded || null,
            isError:       m.isError       || false,
            subjectMode:   m.subjectMode   || null,
            imageGen:      imageGenToStore,
            gkData:        m.gkData        || null,
          };
        }) }),
      });
      const data = await res.json();
      if (data.success && data.title) {
        setConvos(prev => prev.map(c => c._id === convoId ? { ...c, title: data.title, lastMessageAt: new Date().toISOString() } : c));
      }
    } catch {}
  }

  async function handleDeleteConvo(id: string) {
    setMenuOpenId(null);
    try { await fetch(`${API_URL}/api/chat/${id}`, { method: "DELETE", headers: authHeaders() }); } catch {}
    setConvos(prev => prev.filter(c => c._id !== id));
    if (activeId === id) { setActiveId(null); convoIdRef.current = null; setMessages([]); }
  }

  async function handleRename(id: string) {
    const title = renameValue.trim();
    if (!title) { setRenamingId(null); return; }
    try {
      await fetch(`${API_URL}/api/chat/${id}/title`, {
        method: "PATCH", headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      setConvos(prev => prev.map(c => c._id === id ? { ...c, title } : c));
    } catch {}
    setRenamingId(null);
  }

  // ─────────────────────────────────────────────────────────
  // File handlers
  // ─────────────────────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    const isImg = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImg && !isPdf) { alert("Only images and PDF files are supported."); return; }
    setUploadedFile(file); setFileType(isImg ? "image" : "pdf");
    if (isImg) { const r = new FileReader(); r.onloadend = () => setPreviewSrc(r.result as string); r.readAsDataURL(file); }
    else setPreviewSrc(null);
    textareaRef.current?.focus();
  }, []);

  const removeFile = () => { setUploadedFile(null); setFileType(null); setPreviewSrc(null); if (fileRef.current) fileRef.current.value = ""; };

  function startNewChat() {
    abortRef.current?.abort();
    setActiveId(null); convoIdRef.current = null; setMessages([]);
    setQuestion(""); removeFile(); setSidebarOpen(false); setIsEditing(false); setEditOriginalMsgs([]);
    setIsStreaming(false); setStreamingContent("");
    setMentorState({ intent: null, strategy: null, skillLevel: null, turnCount: 0 });
    setSessionTopics([]); setMistakeTopics([]); setWeakTopicBanner(null);
    setEmotionalState("neutral"); setShowEmotionalToast(false);
    setWowMoment(null); setShowWowMoment(false);
    setGrowthMirror(null); setShowGrowthMirror(false);
    setShowComebackNudge(false);
    setEnrichment(null); setShowHintBanner(false); setHintText(null);
    // v13: Reset feedback loop + memory on new chat
    setComprehensionRate(100); setComprehensionTotal(0);
    setAwaitingTestAnswer(false); setPendingTestTopic(null); setLastComprehensionAction(null);
    setSessionMemoryCount(0);
    resetSessionComprehension();
    resetSessionMemory();
    // v14: Reset teaching cycle + personalization
    resetTeachingCycle();
    resetPersonalization();
    textareaRef.current?.focus();
  }

  // ── Stop generation ──────────────────────────────────────
  function handleStop() {
    abortRef.current?.abort();
    setMessages(prev => {
      const updated = [...prev];
      const lastIdx = updated.length - 1;
      if (updated[lastIdx]?.role === "assistant") {
        const existing = updated[lastIdx].content;
        updated[lastIdx] = {
          ...updated[lastIdx],
          content: existing ? existing + " ▪" : "Generation stopped.",
        };
      }
      return updated;
    });
    setIsStreaming(false);
    setStreamingContent("");
    setLoading(false);
    setLoadingStep("");
  }

  // ── Watch Ad ─────────────────────────────────────────────
  const handleWatchAd = async () => {
    if (watchingAd || videoAdsLeft <= 0) return;
    setWatchingAd(true); setAdCountdown(15);
    const timer = setInterval(() => setAdCountdown(p => { if (p <= 1) { clearInterval(timer); return 0; } return p - 1; }), 1000);
    await new Promise(r => setTimeout(r, 15000)); clearInterval(timer);
    try {
      const res  = await fetch(`${API_URL}/api/ai/watch-ad`, { method: "POST", headers: authHeaders() });
      const data = await res.json();
      if (data.success) { setQuestionsLeft(data.questionsLeft); setVideoAdsLeft(data.videoAdsLeft ?? 0); if (data.nextRefillSecs !== undefined) setNextRefillSecs(data.nextRefillSecs); }
    } catch {}
    setWatchingAd(false); setAdCountdown(0);
  };

  // ── v9 FIX: Full history bhejo — last 20 messages ──────────
  // Pehle sirf 10 messages aur images/files filter hoti thi.
  // Ab poori chat history (last 20) bhejte hain taaki AI ko
  // purani chat ka pura context mile jab user continue kare.
  const buildHistory = () =>
    messages
      .filter(m => !m.isError && !m.imagePreview && !m.fileName)
      .slice(-20)
      .map(m => ({ role: m.role as "user" | "assistant", content: m.content }));

  // ─────────────────────────────────────────────────────────
  // Edit Message Handler (v10 NEW)
  // User message pe Edit click karo → textarea mein load ho
  // aur messages truncate ho jaaye us message tak
  // ─────────────────────────────────────────────────────────
  const handleEditMessage = useCallback((content: string) => {
    // Save original messages so cancel can restore them
    setEditOriginalMsgs(messages);

    const idx = messages.findLastIndex(m => m.role === "user" && m.content === content);
    if (idx !== -1) {
      setMessages(prev => prev.slice(0, idx));
    }
    setIsEditing(true);
    setQuestion(content);
    setTimeout(() => {
      textareaRef.current?.focus();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
      }
    }, 50);
  }, [messages]);

  // Cancel edit — restore original messages + clear textarea
  const handleCancelEdit = useCallback(() => {
    setMessages(editOriginalMsgs);
    setQuestion("");
    setIsEditing(false);
    setEditOriginalMsgs([]);
    if (textareaRef.current) textareaRef.current.style.height = "32px";
  }, [editOriginalMsgs]);

  // ─────────────────────────────────────────────────────────
  // Quick Action Handler (v8 NEW)
  // Called when user clicks action buttons below AI response
  // ─────────────────────────────────────────────────────────
  const handleQuickAction = useCallback((type: "understood" | "reexplain" | "testme") => {
    const lastAiMsg = [...messages].reverse().find(m => m.role === "assistant");

    // v13: Gap #1 — Track comprehension action in feedback loop
    const lastTopic = sessionTopics[sessionTopics.length - 1] || null;
    trackComprehension({
      action:    type,
      topic:     lastTopic,
      subject:   subjectMode,
      convoId:   convoIdRef.current,
      turnIndex: mentorState.turnCount,
    }).then(() => {
      const stats = getSessionComprehensionStats();
      setComprehensionRate(stats.comprehensionRate);
      setComprehensionTotal(stats.totalInteractions);
    });

    // v14: Gap #4 — Record action in personalization engine
    recordPersonaAction(type);

    // v14: Gap #3 — Teaching cycle phase transitions on action clicks
    if (type === "understood") {
      // If we were in checking phase, student understood without test
      if (teachingCycle.phase === "checking") {
        markStudentPassed();
        setTimeout(() => completeTeachingCycle(), 3000);
      }
    } else if (type === "reexplain") {
      // Student needs re-explanation — trigger teaching cycle re-explain
      if (teachingCycle.phase === "checking" || teachingCycle.phase === "explaining") {
        markStudentFailed();
      } else if (teachingCycle.phase === "idle" && lastTopic) {
        // Start a new re-explain cycle
        startTeachingCycle(lastTopic, subjectMode);
      }
    }

    // v13: If "testme", set flag so next student msg is treated as test answer
    if (type === "testme") {
      setAwaitingTestAnswer(true);
      setPendingTestTopic(lastTopic);
      // v14: Move teaching cycle to checking phase
      if (teachingCycle.phase === "explaining" || teachingCycle.phase === "idle") {
        markExplainDone(mentorState.turnCount);
      }
    } else {
      setAwaitingTestAnswer(false);
    }
    setLastComprehensionAction(type);

    const prompts: Record<typeof type, string> = {
      understood: "Got it! Samajh aaya 👍 Aage batao.",
      reexplain:  "Please explain this again using a completely different example or analogy. Mujhe naya tarika se samjhao.",
      testme:     "Quiz me on what you just explained. Give me 1 question to test my understanding.",
    };

    setQuestion(prompts[type]);
    setShowComebackNudge(false);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  }, [messages, sessionTopics, subjectMode, mentorState.turnCount]);

  // ─────────────────────────────────────────────────────────
  // Style Choice Handler (v12 NEW — Improvement 2)
  // When student picks a learning style from StyleChoiceCard
  // ─────────────────────────────────────────────────────────
  const handleStyleChoice = useCallback((prompt: string) => {
    // v14: Gap #4 — Record style choice in personalization engine
    recordStyleChoice(prompt);
    setQuestion(prompt);
    setShowComebackNudge(false);
    setTimeout(() => { textareaRef.current?.focus(); }, 50);
  }, [recordStyleChoice]);

  // ─────────────────────────────────────────────────────────
  // SEND
  // ─────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = question.trim();
    if ((!text && !uploadedFile) || loading || isStreaming) return;

    // Dismiss comeback nudge
    setShowComebackNudge(false);
    // v11: Clear previous enrichment cards on new message
    setEnrichment(null);
    setShowHintBanner(false);
    setHintText(null);

    // v13: Gap #1 — If awaitingTestAnswer, evaluate student's reply as test answer
    // The AI previously asked a test question → this message is the student's answer.
    // We send it to backend for evaluation, then track result in comprehension system.
    if (awaitingTestAnswer && text && !uploadedFile) {
      const evalTopic = pendingTestTopic;
      setAwaitingTestAnswer(false);
      setPendingTestTopic(null);
      // Fire-and-forget: ask backend to evaluate if this answer is correct
      // Backend receives the student's answer + the last AI message (which had the question)
      const lastAiContent = [...messages].reverse().find(m => m.role === "assistant")?.content || "";
      fetch(`${API_URL}/api/ai/evaluate-answer`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}`, "Content-Type": "application/json" },
        body:    JSON.stringify({
          question:    lastAiContent.slice(0, 500),
          answer:      text,
          topic:       evalTopic,
          subject:     subjectMode,
          convoId:     convoIdRef.current,
        }),
      })
      .then(r => r.json())
      .then(d => {
        if (d.success && d.result) {
          trackTestResult({
            topic:        evalTopic,
            subject:      subjectMode,
            convoId:      convoIdRef.current,
            result:       d.result,
            questionText: lastAiContent.slice(0, 200),
            answerText:   text.slice(0, 200),
          }).then(() => {
            const stats = getSessionComprehensionStats();
            setComprehensionRate(stats.comprehensionRate);
            setComprehensionTotal(stats.totalInteractions);
          });

          // v14: Gap #3 — Update teaching cycle based on test result
          if (d.result === "correct") {
            markStudentPassed();
            setTimeout(() => completeTeachingCycle(), 3000);
          } else if (d.result === "incorrect") {
            markStudentFailed();
          }

          // v14: Gap #4 — Record test result in personalization engine
          recordPersonaTestResult(d.result, subjectMode);
        }
      })
      .catch(() => {
        // Graceful fail — evaluation optional
      });
    }

    const userMsg: ChatMsg = {
      role: "user", content: text,
      imagePreview: previewSrc || undefined,
      fileName: uploadedFile?.name,
      fileType: fileType || undefined,
    };
    const withUser = [...messages, userMsg];
    setMessages(withUser);
    withUserRef.current = withUser;
    setQuestion("");
    setIsEditing(false);
    setEditOriginalMsgs([]);
    if (textareaRef.current) textareaRef.current.style.height = "32px";
    setLoading(true);

    const currentFile    = uploadedFile;
    const currentType    = fileType;
    const currentPreview = previewSrc;
    removeFile();

    let convoId = convoIdRef.current;
    if (!convoId) {
      convoId = await createNewConvo(text || currentFile?.name);
      if (convoId) convoIdRef.current = convoId;
    }

    // ── PATH IMG: AI Image Generation ───────────────────────
    // IMPORTANT: Check for image requests BEFORE GK check
    // "Create a beautiful nature image" → image gen, NOT Wikipedia
    if (!currentType && text) {
      const isImgReq = await checkIsImageRequest(text);
      if (isImgReq) {
        setLoadingStep("🎨 Generating your image…");
        try {
          const imgResult = await generateAIImage(text);

          let statusText: string;
          if (!imgResult.success) {
            statusText = "⚠️ Image generation failed — all providers tried. Please try again or rephrase your request.";
          } else if (imgResult.isSvg) {
            statusText = "📐 Here's your diagram! You can download it using the button below.";
          } else {
            statusText = "🎨 Here's your generated image! Download it below.";
          }

          const imgMsg: ChatMsg = {
            role:      "assistant",
            content:   statusText,
            imageGen:  imgResult,
            subjectMode,
          };
          const finalMsgs = [...withUserRef.current, imgMsg];
          setMessages(finalMsgs);
          if (convoId) {
            await saveMessages(convoId, [userMsg, imgMsg]);
            fetchConvos();
          }
          setLoading(false);
          setLoadingStep("");
          textareaRef.current?.focus();
          return;
        } catch (imgErr) {
          const errMsg: ChatMsg = {
            role:    "assistant",
            content: "⚠️ Image generation service is temporarily unavailable. Please try again in a moment.",
            isError: true,
            subjectMode,
          };
          const finalMsgs = [...withUserRef.current, errMsg];
          setMessages(finalMsgs);
          setLoading(false);
          setLoadingStep("");
          textareaRef.current?.focus();
          return;
        }
      }
    }

    // ── PATH GK: General Knowledge (Wikipedia — free, no quota) ──
    // Only runs if NOT an image generation request
    if (!currentType && text && !uploadedFile) {
      const isGK = await checkIsGeneral(text);
      if (isGK) {
        setLoadingStep("🌍 Fetching from Wikipedia…");
        try {
          const gkResult = await fetchGeneralKnowledge(text);
          if (gkResult && gkResult.summary) {
            const gkMsg: ChatMsg = {
              role: "assistant",
              content: gkResult.summary,
              gkData: gkResult,
              subjectMode,
            };
            const finalMsgs = [...withUserRef.current, gkMsg];
            setMessages(finalMsgs);
            if (convoId) { await saveMessages(convoId, [userMsg, gkMsg]); fetchConvos(); }
            setLoading(false); setLoadingStep(""); textareaRef.current?.focus();
            return;
          }
        } catch { /* If GK fails, fall through to normal AI */ }
        setLoadingStep("");
      }
    }

    // ── PATH A: Image or PDF (non-streaming) ─────────────
    if (currentType) {
      try {
        const headers = authHeaders();
        let result: { success: boolean; answer: string; pointsAwarded?: number; questionsLeft?: number; nextRefillSecs?: number };

        if (currentType === "pdf" && currentFile) {
          setLoadingStep("Extracting PDF text…");
          const form = new FormData(); form.append("file", currentFile); if (text) form.append("prompt", text);
          const res = await fetch(`${API_URL}/api/ai/solve-pdf`, { method: "POST", headers, body: form });
          result = await res.json();
        } else {
          setLoadingStep("Compressing image…");
          const imageData = await compressImage(currentPreview!, 1600);
          setLoadingStep("AI is analyzing image…");
          const res = await fetch(`${API_URL}/api/ai/ask`, {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: text || undefined, image: imageData, history: [], userId, subjectMode: "auto", stepByStep: false }),
          });
          result = await res.json();
        }

        const aiMsg: ChatMsg = {
          role: "assistant",
          content: result.answer || "No answer received. Please try again.",
          isError: !result.success,
          subjectMode,
        };
        if (result.success) {
          const pts = result.pointsAwarded ?? (isPremium ? 20 : 10);
          aiMsg.pointsAwarded = pts;
          addPoints(pts);
          if (result.questionsLeft !== undefined) setQuestionsLeft(result.questionsLeft); else useQuestion();
          if (result.nextRefillSecs !== undefined) setNextRefillSecs(result.nextRefillSecs);
          const newTotal = (userStats.totalQuestionsAsked || 0) + 1;
          setUserStats({ ...userStats, totalQuestionsAsked: newTotal });
          incrementAction("question");
          checkAndUnlockAchievements({ totalQuestionsAsked: newTotal });
          trackProgressEvent("ai_tutor_used", { mode: subjectMode }).catch(() => {});
          // Real-time Recent Activity update (image/non-stream path)
          const actLabelImg = text.trim().length > 60
            ? `Asked: ${text.trim().slice(0, 60)}...`
            : `Asked: ${text.trim()}`;
          logActivity('ask_question', actLabelImg, pts).catch(() => {});
        }
        const finalMsgs = [...withUserRef.current, aiMsg];
        setMessages(finalMsgs);
        if (convoId) { await saveMessages(convoId, [userMsg, aiMsg]); fetchConvos(); }
      } catch {
        setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please check your internet and try again.", isError: true }]);
      } finally {
        setLoading(false); setLoadingStep(""); textareaRef.current?.focus();
      }
      return;
    }

    // ── Quota check — only for AI streaming (not image gen / GK) ──
    if (questionsLeft <= 0) {
      setMessages(prev => [...prev, {
        role: "assistant" as const,
        content: "⏳ Daily question limit reached. Watch an ad to get more questions, or wait for the hourly refill.",
        isError: true,
        subjectMode,
      }]);
      setLoading(false);
      setLoadingStep("");
      return;
    }

    // ── PATH B: Text → SSE Streaming ────────────────────
    const modeLabels: Record<SubjectMode, string> = {
      auto:    "AI is thinking…",
      math:    "📐 Solving step by step…",
      coding:  "💻 Writing code…",
      science: "🔬 Analyzing…",
      general: "📚 Explaining…",
    };
    setLoadingStep(
      stepByStep ? "🪜 Building step-by-step solution…"
                 : (modeLabels[subjectMode] || "AI is thinking…")
    );
    setIsStreaming(false);
    setStreamingContent("");

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    let accumulated  = "";
    let finalPoints  = isPremium ? 20 : 10;
    let firstToken   = true;

    try {
      // v13: Gap #1 & #2 — Build enriched request body BEFORE fetching
      // Retrieves top-4 semantic memories + live comprehension context
      const v13LastTopic      = sessionTopics[sessionTopics.length - 1] || null;
      const v13Memories       = await retrieveRelevantMemories({
        query:     text,
        topic:     v13LastTopic,
        subject:   subjectMode,
        topK:      4,
        turnCount: mentorState.turnCount,
        convoId:   convoIdRef.current,
      });
      const v13MemoryContext  = buildMemoryContext(v13Memories);
      const v13CompStats      = getSessionComprehensionStats();
      const v13CompContext    = buildComprehensionContext(v13CompStats);
      const v13AdaptHint      = getAdaptiveStrategyHint(v13CompStats);

      const res = await fetch(`${API_URL}/api/ai/ask-stream`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          prompt:               text,
          history:              buildHistory(),
          userId,
          subjectMode,
          stepByStep,
          personality:          "friendly",
          recentActivity:       subjectMode === "coding" ? "coding" : "ask",
          convoId:              convoIdRef.current,
          // v13 NEW fields
          smartMemoryContext:   v13MemoryContext,    // top relevant past memories
          comprehensionContext: v13CompContext,      // live session stats
          adaptiveHint:         v13AdaptHint,        // how AI should adjust
          // v14 NEW fields
          teachingContext:      getTeachingInstructions().contextSummary,  // teaching phase
          personalizationContext: buildPersonalizationContext(),           // student persona
        }),
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const raw = trimmed.slice(5).trim();
          if (raw === "[DONE]") { reader.cancel(); break; }

          try {
            const parsed = JSON.parse(raw);

            // Token chunk
            if (parsed.token) {
              accumulated += parsed.token;

              if (firstToken) {
                firstToken = false;
                setLoading(false);
                setLoadingStep("");
                setMessages([...withUserRef.current, { role: "assistant", content: "", subjectMode }]);
                setIsStreaming(true);
              }

              setStreamingContent(accumulated);
              setMessages(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                if (updated[lastIdx]?.role === "assistant") {
                  updated[lastIdx] = { ...updated[lastIdx], content: accumulated };
                }
                return updated;
              });
            }

            // Points / quota
            if (parsed.pointsAwarded)              finalPoints = parsed.pointsAwarded;
            if (parsed.questionsLeft !== undefined) setQuestionsLeft(parsed.questionsLeft);
            if (parsed.nextRefillSecs !== undefined) setNextRefillSecs(parsed.nextRefillSecs);

            // Mentor intelligence metadata (Stage 6)
            if (parsed.intent || parsed.strategy || parsed.skillLevel) {
              setMentorState(prev => ({
                intent:     parsed.intent    ?? prev.intent,
                strategy:   parsed.strategy  ?? prev.strategy,
                skillLevel: parsed.skillLevel ?? prev.skillLevel,
                turnCount:  prev.turnCount,
              }));
            }
            if (parsed.detectedTopic) {
              setSessionTopics(prev =>
                prev.includes(parsed.detectedTopic) ? prev : [...prev, parsed.detectedTopic]
              );
              setMistakeTopics(prev => {
                if (parsed.isWeakTopic && !prev.includes(parsed.detectedTopic)) {
                  setWeakTopicBanner(parsed.detectedTopic);
                  return [...prev, parsed.detectedTopic];
                }
                return prev;
              });
            }

            // ── Emotional state (v8 NEW) ──────────────────
            if (parsed.emotionalState && parsed.emotionalState !== "neutral") {
              setEmotionalState(parsed.emotionalState);
              setShowEmotionalToast(true);
            }

            // ── v11/v12: AI-OS Enrichment chunk ──────────
            // Arrives AFTER stream ends — shows recommendations,
            // progress insights, hint nudges, emotional nudges,
            // growth mirror (Imp 5), wow observation (Imp 7)
            // ── v12: Visual Brain segments ────────────────────
            if (parsed.visualBrain && Array.isArray(parsed.visualBrain)) {
              // Attach visual brain directly to the last AI message
              setMessages(prev => {
                const updated = [...prev];
                const aiIdx = updated.length - 1;
                if (updated[aiIdx]?.role === "assistant") {
                  updated[aiIdx] = { ...updated[aiIdx], visualBrain: parsed.visualBrain };
                }
                return updated;
              });
            }

            if (parsed.enrichment) {
              const e: AskAIEnrichment = parsed.enrichment;
              setEnrichment(e);
              if (e.hintMode && e.hintText) {
                setHintText(e.hintText);
                setShowHintBanner(true);
              }
              // v12: Growth Mirror — show if data exists
              if (e.growthMirror && e.growthMirror.message) {
                setGrowthMirror(e.growthMirror);
                setShowGrowthMirror(true);
              }
              // v12: Dynamic Wow Observation — replaces hardcoded messages
              if (e.wowObservation) {
                setTimeout(() => {
                  setWowMoment(e.wowObservation!);
                  setShowWowMoment(true);
                }, 1500);
              }
            }

            if (parsed.error) throw new Error(parsed.error);
          } catch {
            // Skip malformed SSE lines
          }
        }
      }

      // Stream finished
      const finalContent = accumulated || "No answer received. Please try again.";
      const aiMsg: ChatMsg = {
        role:          "assistant",
        content:       finalContent,
        subjectMode,
        pointsAwarded: finalPoints,
      };

      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (updated[lastIdx]?.role === "assistant") updated[lastIdx] = aiMsg;
        return updated;
      });

      if (accumulated) {
        addPoints(finalPoints);
        useQuestion();
        const newTotal = (userStats.totalQuestionsAsked || 0) + 1;
        setUserStats({ ...userStats, totalQuestionsAsked: newTotal });
        incrementAction("question");
        checkAndUnlockAchievements({ totalQuestionsAsked: newTotal });
        trackProgressEvent("ai_tutor_used", { mode: subjectMode }).catch(() => {});
        setMentorState(prev => ({ ...prev, turnCount: prev.turnCount + 1 }));

        // Real-time Recent Activity update
        // logActivity() optimistically prepends to recentActivity in context
        // so Dashboard shows the new entry instantly without page refresh.
        const actLabel = text.trim().length > 60
          ? `Asked: ${text.trim().slice(0, 60)}\u2026`
          : `Asked: ${text.trim()}`;
        logActivity('ask_question', actLabel, finalPoints).catch(() => {});

        // ── v12: Wow Moment (Improvement 7) ─────────────────
        // Now DYNAMIC — driven by SSE enrichment.wowObservation
        // which contains real user-specific observations from DB.
        // Hardcoded generic messages removed. SSE block handles it.
      }

      if (convoId) {
        saveMessages(convoId, [userMsg, aiMsg]).then(() => fetchConvos()).catch(() => {});
      }

      // v13: Gap #2 — Auto-index this exchange into semantic memory
      if (accumulated) {
        const v13Topic = sessionTopics[sessionTopics.length - 1] || null;
        autoExtractAndStoreMemory({
          aiResponse:          finalContent,
          userQuestion:        text,
          topic:               v13Topic,
          subject:             subjectMode,
          turnIndex:           mentorState.turnCount,
          convoId:             convoId,
          comprehensionAction: lastComprehensionAction || undefined,
        }).then(() => {
          setSessionMemoryCount(getSessionMemoryCount());
        }).catch(() => {});

        // Check if AI asked a test question → flag next student msg as test answer
        if (lastComprehensionAction === "testme" && detectIfAIAskedQuestion(finalContent)) {
          setAwaitingTestAnswer(true);
          setPendingTestTopic(v13Topic);
        }
        // Clear last action after processing
        setLastComprehensionAction(null);

        // v14: Gap #3 — Auto-detect if AI response is an explanation → start teaching cycle
        if (shouldStartCycle(finalContent, v13Topic, subjectMode)) {
          startTeachingCycle(v13Topic || "topic", subjectMode);
        }

        // v14: Gap #3 — If AI response contains a check question, record it
        if (teachingCycle.phase === "explaining" || teachingCycle.phase === "re_explaining") {
          if (detectIfAIAskedQuestion(finalContent)) {
            recordCheckQuestion(finalContent.slice(-200));
            markExplainDone(mentorState.turnCount + 1);
          }
        }

        // v14: Gap #4 — Record turn in personalization engine
        recordTurn();
      }

    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (updated[lastIdx]?.role === "assistant" && !updated[lastIdx].content) {
          updated[lastIdx] = { role: "assistant", content: "Connection error. Please check your internet and try again.", isError: true };
        } else {
          updated.push({ role: "assistant", content: "Connection error. Please check your internet and try again.", isError: true });
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
      setLoading(false);
      setLoadingStep("");
      textareaRef.current?.focus();
    }
  };

  const canSend = (!!question.trim() || !!uploadedFile) && questionsLeft > 0 && !loading && !isStreaming;
  const hasChat = messages.length > 0;
  const grouped = groupByDate(convos);

  // ── Search filter — case-insensitive title match ──────────
  const searchTrimmed   = searchQuery.trim().toLowerCase();
  const filteredConvos  = searchTrimmed
    ? convos.filter(c => c.title.toLowerCase().includes(searchTrimmed))
    : null; // null = not searching, show grouped view
  const currentMode = SUBJECT_MODES.find(m => m.id === subjectMode)!;

  // ─────────────────────────────────────────────────────────
  // SIDEBAR
  // ─────────────────────────────────────────────────────────
  const sidebar = (
    <div className="flex flex-col h-full">

      {/* Top: New Chat + Search */}
      <div className="p-3 flex-shrink-0 space-y-2">
        <button onClick={startNewChat}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-blue-500/20 text-sm font-semibold text-white hover:from-blue-500/25 hover:to-purple-500/25 transition-all">
          <Plus className="w-4 h-4 text-blue-400" /> New Chat
        </button>

        {/* Search box */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
          searchFocused
            ? "border-blue-500/40 bg-blue-500/5"
            : "border-white/8 bg-white/[0.02] hover:border-white/12"
        }`}>
          <Search className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${searchFocused ? "text-blue-400" : "text-slate-600"}`} />
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onKeyDown={e => { if (e.key === "Escape") { setSearchQuery(""); searchRef.current?.blur(); } }}
            placeholder="Search chats…"
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-600 outline-none"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}
              className="text-slate-600 hover:text-slate-300 transition-colors flex-shrink-0">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {loadingConvos ? (
          <div className="space-y-2 px-1 pt-2">{[1,2,3].map(i => <div key={i} className="h-9 rounded-lg bg-white/[0.03] animate-pulse" />)}</div>

        ) : filteredConvos !== null ? (
          /* ── SEARCH RESULTS VIEW ── */
          filteredConvos.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Search className="w-7 h-7 text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-600">No chats found for<br />
                <span className="text-slate-500 font-medium">"{searchQuery}"</span>
              </p>
            </div>
          ) : (
            <div className="pt-1">
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-3 mb-1">
                {filteredConvos.length} result{filteredConvos.length !== 1 ? "s" : ""}
              </p>
              {filteredConvos.map(c => (
                <ConvoItem
                  key={c._id}
                  c={c}
                  activeId={activeId}
                  menuOpenId={menuOpenId}
                  renamingId={renamingId}
                  renameValue={renameValue}
                  searchQuery={searchTrimmed}
                  longPressTimer={longPressTimer}
                  onLoad={() => { setSearchQuery(""); loadConversation(c._id); }}
                  onMenuToggle={() => setMenuOpenId(prev => prev === c._id ? null : c._id)}
                  onMenuOpen={() => setMenuOpenId(c._id)}
                  onRenameStart={() => { setMenuOpenId(null); setRenamingId(c._id); setRenameValue(c.title); }}
                  onRenameChange={setRenameValue}
                  onRenameConfirm={() => handleRename(c._id)}
                  onRenameCancel={() => setRenamingId(null)}
                  onDelete={() => handleDeleteConvo(c._id)}
                />
              ))}
            </div>
          )

        ) : convos.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageSquare className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <p className="text-xs text-slate-600">No conversations yet.<br />Start chatting!</p>
          </div>

        ) : (
          /* ── NORMAL GROUPED VIEW ── */
          <div className="space-y-4 pt-1">
            {grouped.map(group => (
              <div key={group.label}>
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-3 mb-1">{group.label}</p>
                {group.items.map(c => (
                  <ConvoItem
                    key={c._id}
                    c={c}
                    activeId={activeId}
                    menuOpenId={menuOpenId}
                    renamingId={renamingId}
                    renameValue={renameValue}
                    searchQuery=""
                    longPressTimer={longPressTimer}
                    onLoad={() => loadConversation(c._id)}
                    onMenuToggle={() => setMenuOpenId(prev => prev === c._id ? null : c._id)}
                    onMenuOpen={() => setMenuOpenId(c._id)}
                    onRenameStart={() => { setMenuOpenId(null); setRenamingId(c._id); setRenameValue(c.title); }}
                    onRenameChange={setRenameValue}
                    onRenameConfirm={() => handleRename(c._id)}
                    onRenameCancel={() => setRenamingId(null)}
                    onDelete={() => handleDeleteConvo(c._id)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="flex absolute inset-0">

      {/* Emotional Toast (v8 NEW) */}
      {showEmotionalToast && (
        <EmotionalToast
          state={emotionalState}
          onDismiss={() => { setShowEmotionalToast(false); setEmotionalState("neutral"); }}
        />
      )}

      {/* Wow Moment Badge (v12 NEW — Improvement 7) */}
      {showWowMoment && wowMoment && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
          <WowMomentBadge
            text={wowMoment}
            onDismiss={() => { setShowWowMoment(false); setWowMoment(null); }}
          />
        </div>
      )}

      {/* Comeback Nudge (v8 NEW) */}
      {showComebackNudge && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-300 text-xs font-semibold shadow-lg flex items-center gap-2">
          <span>😈 Aaj ka streak miss ho jayega!</span>
          <button onClick={() => { setShowComebackNudge(false); textareaRef.current?.focus(); }}
            className="ml-1 text-orange-400 hover:text-orange-200 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 w-64 border-r border-white/8 flex flex-col overflow-hidden transition-all duration-300 fixed md:static top-0 left-0 h-full z-50 md:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ background: "rgba(5, 8, 22, 0.98)", backdropFilter: "blur(20px)" }}>
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/8 flex-shrink-0">
          <span className="text-sm font-semibold text-white flex items-center gap-2"><Brain className="w-4 h-4 text-blue-400" /> Ask AI</span>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
        </div>
        {sidebar}
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: "#060914" }}>

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setSidebarOpen(true)}>
              <MessageSquare className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-blue-400 hidden md:block" />
                {activeId ? (convos.find(c => c._id === activeId)?.title || "Chat") : "New Chat"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Step-by-step toggle */}
            <button onClick={() => setStepByStep(p => !p)} title="Step-by-step mode"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                stepByStep
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                  : "bg-white/[0.03] border-white/10 text-slate-500 hover:text-slate-300"
              }`}>
              <ListOrdered className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Steps</span>
            </button>

            {/* v13: Comprehension badge — shows live session % */}
            <ComprehensionBadge rate={comprehensionRate} total={comprehensionTotal} />

            {/* v13: Memory pulse badge — shows indexed memory count */}
            <MemoryPulseBadge count={sessionMemoryCount} />

            {/* Questions left */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${questionsLeft > 0 ? "border-blue-500/20 bg-blue-500/5 text-blue-300" : "border-red-500/20 bg-red-500/5 text-red-300"}`}>
              <Zap className="w-3 h-3" />
              {questionsLeft}/{isPremium ? 30 : 15}
              {isPremium && <span className="text-yellow-300 ml-0.5">⚡</span>}
              {questionsLeft <= 0 && nextRefillSecs > 0 && <span className="text-[10px] text-slate-500 ml-1">{Math.floor(nextRefillSecs/60)}m</span>}
            </div>

            {/* New chat */}
            <button onClick={startNewChat} title="New chat"
              className="hidden md:flex p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all items-center gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mode bar */}
        <div className={`flex-shrink-0 border-b border-white/5 transition-all overflow-hidden ${showModeBar ? "max-h-16" : "max-h-0"}`}>
          <div className="px-4 py-2">
            <ModeSelector selected={subjectMode} onChange={setSubjectMode} />
          </div>
        </div>

        {/* Mentor Intelligence Bar */}
        <MentorIntelligenceBar
          mentorState={mentorState}
          sessionTopics={sessionTopics}
          mistakeTopics={mistakeTopics}
          isVisible={showMentorBar}
          onToggle={() => setShowMentorBar(p => !p)}
          turnCount={mentorState.turnCount}
          // v14: pass personalization summary for display
          learningStyle={personaProfile.learningStyle}
          cognitiveLoad={personaProfile.cognitiveLoad}
          teachingPhase={teachingCycle.phase}
          masteredTopics={teachingCycle.masteredTopics}
        />

        {/* Weak Topic Banner */}
        {weakTopicBanner && (
          <WeakTopicBanner
            topic={weakTopicBanner}
            onDismiss={() => setWeakTopicBanner(null)}
          />
        )}

        {/* v14: Gap #3 — Teaching Cycle Phase Banner */}
        {teachingCycle.phase === "re_explaining" && (
          <div className="mx-4 mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/8 border border-blue-500/15 animate-fade-in">
            <span className="text-sm flex-shrink-0">🔄</span>
            <p className="text-xs text-blue-300 flex-1">
              <span className="font-semibold">Different angle — attempt {teachingCycle.retryCount}/{teachingCycle.maxRetries}</span>
              {" "}AI is explaining this a new way using <span className="text-blue-200">{teachingCycle.nextStrategy}</span> approach.
            </p>
          </div>
        )}
        {teachingCycle.phase === "mastered" && (
          <div className="mx-4 mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/8 border border-emerald-500/15 animate-fade-in">
            <span className="text-sm flex-shrink-0">✅</span>
            <p className="text-xs text-emerald-300 flex-1">
              <span className="font-semibold">{teachingCycle.topic} — mastered!</span>
              {" "}You got it in {teachingCycle.retryCount === 0 ? "one go" : `${teachingCycle.retryCount + 1} attempts`}. 🎉
            </p>
          </div>
        )}
        {teachingCycle.phase === "giving_up" && (
          <div className="mx-4 mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/8 border border-amber-500/15 animate-fade-in">
            <span className="text-sm flex-shrink-0">📌</span>
            <p className="text-xs text-amber-300 flex-1">
              <span className="font-semibold">{teachingCycle.topic}</span> — saved for later review. Moving forward!
            </p>
          </div>
        )}

        {/* v14: Gap #4 — Cognitive overload warning */}
        {personaProfile.cognitiveLoad === "overloaded" && (
          <div className="mx-4 mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/8 border border-red-500/15 animate-fade-in">
            <span className="text-sm flex-shrink-0">🧠</span>
            <p className="text-xs text-red-300 flex-1">
              Looks like a lot at once — AI is switching to simpler mode for you.
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 px-4 py-5" style={{ minHeight: 0 }}>

          {/* v12: Growth Mirror Card (Improvement 5) — shown when enrichment arrives */}
          {showGrowthMirror && growthMirror && hasChat && (
            <GrowthMirrorCard
              data={growthMirror}
              onDismiss={() => { setShowGrowthMirror(false); setGrowthMirror(null); }}
            />
          )}

          {!hasChat && (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${currentMode.bg} ${currentMode.border}`}>
                <currentMode.icon className={`w-6 h-6 ${currentMode.color}`} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white mb-1">
                  {subjectMode === "auto" ? "Ask anything" : `${currentMode.label} Mode`}
                </h2>
                <p className="text-xs text-slate-500">
                  {currentMode.desc}
                  {stepByStep && <span className="text-amber-400 ml-1">• Step-by-step ON</span>}
                </p>
              </div>
              <div className="w-full max-w-md grid sm:grid-cols-2 gap-2">
                {MODE_SUGGESTIONS[subjectMode].map(q => (
                  <button key={q} onClick={() => { setQuestion(q); textareaRef.current?.focus(); }}
                    className="text-left p-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.04] transition-all group">
                    <span className={`${currentMode.color} mr-1.5 group-hover:mr-2 transition-all`}>→</span>{q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => {
            const isLastMsg       = i === messages.length - 1;
            const isLastAssistant = msg.role === "assistant" && isLastMsg;
            return msg.role === "user"
              ? <UserBubble key={i} msg={msg} onEdit={handleEditMessage} />
              : <AIBubble
                  key={i}
                  msg={msg}
                  isPremium={isPremium}
                  isStreaming={isStreaming && isLastAssistant}
                  isLast={isLastAssistant}
                  onQuickAction={handleQuickAction}
                  onStyleChoice={handleStyleChoice}
                />;
          })}

          {/* v11: Hint Banner — shows when AI chose HINT/GUIDE strategy */}
          {showHintBanner && hintText && !isStreaming && (
            <div className="px-1">
              <HintBanner
                text={hintText}
                onDismiss={() => { setShowHintBanner(false); setHintText(null); }}
              />
            </div>
          )}

          {/* v11: Enrichment Card — recommendation / insight / nudge */}
          {enrichment && !isStreaming && (
            <div className="px-1">
              <EnrichmentCard
                enrichment={enrichment}
                onDismiss={() => setEnrichment(null)}
              />
            </div>
          )}

          {/* Loading dots */}
          {loading && (
            <div className="flex gap-3 items-start w-full">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-gradient-to-br ${
                currentMode.id === "math"    ? "from-blue-500 to-blue-600"    :
                currentMode.id === "coding"  ? "from-green-500 to-emerald-600" :
                currentMode.id === "science" ? "from-cyan-500 to-cyan-600"    :
                "from-purple-500 to-blue-600"
              }`}>
                <currentMode.icon className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex-1 flex items-center gap-3 pt-1">
                <div className="flex gap-1">
                  {[0, 150, 300].map(d => (
                    <span key={d}
                      className={`w-1.5 h-1.5 rounded-full animate-bounce ${
                        currentMode.id === "math"    ? "bg-blue-400"  :
                        currentMode.id === "coding"  ? "bg-green-400" :
                        currentMode.id === "science" ? "bg-cyan-400"  : "bg-blue-400"
                      }`}
                      style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
                {mentorState.intent
                  ? <IntentBadge intent={mentorState.intent} />
                  : <span className="text-xs text-slate-500">{loadingStep || "AI is thinking…"}</span>
                }
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input box */}
        <div className="flex-shrink-0 p-3 border-t border-white/8">

          {/* Mode/step indicator strip */}
          {(stepByStep || subjectMode !== "auto") && (
            <div className="flex items-center gap-2 mb-2 px-1">
              {subjectMode !== "auto" && (
                <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${currentMode.bg} ${currentMode.color} border ${currentMode.border}`}>
                  <currentMode.icon className="w-2.5 h-2.5" />
                  {currentMode.label} Mode
                </span>
              )}
              {stepByStep && (
                <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <ListOrdered className="w-2.5 h-2.5" />
                  Step-by-step ON
                </span>
              )}
              <button onClick={() => { setSubjectMode("auto"); setStepByStep(false); }} className="text-[10px] text-slate-600 hover:text-slate-400 ml-auto">reset</button>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-2">
            {/* ── v13: Awaiting test answer banner ── */}
            {awaitingTestAnswer && !isEditing && (
              <div className="flex items-center justify-between px-1 py-1.5 mb-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px]">🧠</span>
                  <span className="text-[11px] text-purple-300 font-medium">Test mode — type your answer</span>
                  <span className="text-[10px] text-purple-500 hidden sm:inline">· AI will evaluate your response</span>
                </div>
                <button
                  onClick={() => { setAwaitingTestAnswer(false); setPendingTestTopic(null); }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-[11px] text-slate-300 hover:text-white hover:bg-white/[0.10] transition-all"
                >
                  <X className="w-3 h-3" /> Skip
                </button>
              </div>
            )}

            {/* ── Edit mode cancel banner ── */}
            {isEditing && (
              <div className="flex items-center justify-between px-1 py-1.5 mb-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-1.5">
                  <Pencil className="w-3 h-3 text-amber-400 flex-shrink-0" />
                  <span className="text-[11px] text-amber-300 font-medium">Editing message</span>
                  <span className="text-[10px] text-amber-500 hidden sm:inline">· Press Esc or click Cancel</span>
                </div>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-[11px] text-slate-300 hover:text-white hover:bg-white/[0.10] transition-all"
                >
                  <X className="w-3 h-3" /> Cancel
                </button>
              </div>
            )}
            {/* File preview */}
            {uploadedFile && (
              <div className="flex items-center gap-2 px-1 py-1 mb-2 rounded-xl bg-white/[0.03] border border-white/10">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${fileType === "pdf" ? "bg-red-500/15" : "bg-blue-500/15"}`}>
                  {fileType === "pdf" ? <FileText className="w-3 h-3 text-red-400" /> : <ImagePlus className="w-3 h-3 text-blue-400" />}
                </div>
                {previewSrc && <img src={previewSrc} alt="preview" className="h-7 w-7 rounded object-cover border border-white/10" />}
                <span className="text-xs text-slate-300 flex-1 truncate">{uploadedFile.name}</span>
                <button onClick={removeFile} className="text-slate-500 hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
              </div>
            )}

            <div className="flex items-end gap-2"
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>

              <button onClick={() => fileRef.current?.click()} title="Upload image or PDF"
                className={`p-1.5 rounded-lg border transition-all flex-shrink-0 mb-0.5 ${isDragging ? "border-blue-500/50 text-blue-400" : "border-white/10 text-slate-500 hover:text-blue-400 hover:border-blue-500/20"}`}>
                <ImagePlus className="w-4 h-4" />
              </button>

              {!isUnsupported && (
                <div className="relative flex-shrink-0 mb-0.5">
                  <button onClick={() => toggleListening(question)} title={isListening ? "Stop recording" : "Voice input"}
                    className={`p-1.5 rounded-lg border transition-all ${isListening ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-white/10 text-slate-500 hover:text-purple-400 hover:border-purple-500/20"}`}>
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isListening && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                  </button>
                </div>
              )}

              <textarea
                ref={textareaRef}
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Escape" && isEditing) { handleCancelEdit(); return; }
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
                placeholder={
                  isListening               ? (interimText || "🎤 Listening… speak now")
                  : awaitingTestAnswer       ? "Type your answer here… AI will evaluate it 🧠"
                  : questionsLeft <= 0      ? "Daily limit reached…"
                  : fileType === "pdf"      ? "What to do with this PDF? (optional)"
                  : fileType === "image"    ? "Describe what to solve (optional)…"
                  : stepByStep              ? "Ask anything — I'll solve it step by step…"
                  : subjectMode === "math"    ? "Enter your math problem…"
                  : subjectMode === "coding"  ? "Ask your coding question…"
                  : subjectMode === "science" ? "Ask your science question…"
                  : hasChat                 ? "Ask a follow-up…"
                  : "Ask anything… Hinglish ya English, dono chalega 😊"
                }
                disabled={questionsLeft <= 0 || (loading && !isStreaming)}
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-slate-600 resize-none focus:outline-none text-sm leading-relaxed py-1.5 disabled:opacity-40"
                style={{ minHeight: "32px", maxHeight: "160px" }}
              />

              {/* Stop button */}
              {isStreaming ? (
                <button onClick={handleStop}
                  className="p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all flex-shrink-0 mb-0.5"
                  title="Stop generating">
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              ) : (
                <button onClick={handleSend} disabled={!canSend}
                  className={`p-2 rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all flex-shrink-0 mb-0.5 glow-btn bg-gradient-to-br ${
                    subjectMode === "math"    ? "from-blue-500 to-blue-600"    :
                    subjectMode === "coding"  ? "from-green-500 to-emerald-600" :
                    subjectMode === "science" ? "from-cyan-500 to-cyan-600"    :
                    "from-blue-500 to-purple-600"
                  }`}>
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-1.5 px-1">
            <p className="text-[10px] text-slate-700">
              Earn {isPremium ? "20" : "10"} pts per question • History saved 30 days
            </p>
            <div className="flex items-center gap-1.5">
              {voiceError && <span className="text-[10px] text-red-400">{voiceError}</span>}
              {isListening && (
                <span className="text-[10px] text-red-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />Recording…
                </span>
              )}
              {isStreaming && (
                <span className="text-[10px] text-blue-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />Streaming…
                </span>
              )}
              {!isUnsupported && (
                <button onClick={() => setVoiceLang(l => l === "hi-IN" ? "en-IN" : "hi-IN")}
                  className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors px-1.5 py-0.5 rounded border border-white/5 hover:border-white/10">
                  🎤 {voiceLang === "hi-IN" ? "HI" : "EN"}
                </button>
              )}
              <button onClick={() => setShowModeBar(p => !p)}
                className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors px-1.5 py-0.5 rounded border border-white/5 hover:border-white/10 flex items-center gap-1">
                <ChevronDown className={`w-2.5 h-2.5 transition-transform ${showModeBar ? "" : "rotate-180"}`} />
                Modes
              </button>
            </div>
          </div>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*,.webp,application/pdf" className="hidden"
        onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
    </div>
  );
}