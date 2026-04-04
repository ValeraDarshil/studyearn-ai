/**
 * MentorIntelligenceBar — Stage 6 AskAI UI
 * ──────────────────────────────────────────
 * Surfaces the AI mentor's intelligence layer visually.
 * Shows: skill level, weak topics, active strategy, session memory.
 * Collapsible. Refreshes on every new conversation turn.
 */

import { useState, useEffect } from "react";
import {
  Brain, ChevronDown, TrendingUp, AlertTriangle,
  Zap, Target, BookOpen, Lightbulb, RefreshCw,
  Star, Trophy, ArrowRight, X,
} from "lucide-react";
import { getStudentProfile, type StudentProfile } from "../utils/brain-api";

// ─── Types ──────────────────────────────────────────────────
export type StrategyBadge =
  | "TEACH" | "STEP_BY_STEP" | "HINT" | "GUIDE"
  | "QUIZ"  | "FULL_SOLUTION" | "SHORT" | null;

export interface MentorState {
  intent:    string | null;
  strategy:  StrategyBadge;
  skillLevel: "beginner" | "intermediate" | "advanced" | null;
  turnCount:  number;
}

interface Props {
  mentorState:   MentorState;
  sessionTopics: string[];       // topics discussed this session
  mistakeTopics: string[];       // topics user struggled with
  isVisible:     boolean;
  onToggle:      () => void;
  turnCount:     number;
}

// ─── Strategy config ─────────────────────────────────────────
const STRATEGY_CONFIG: Record<NonNullable<StrategyBadge>, {
  label: string; color: string; bg: string; border: string; icon: any; tip: string;
}> = {
  TEACH:         { label: "Teaching",      color: "text-violet-300", bg: "bg-violet-500/10", border: "border-violet-500/25", icon: BookOpen,   tip: "Explaining concept with examples" },
  STEP_BY_STEP:  { label: "Step by Step",  color: "text-amber-300",  bg: "bg-amber-500/10",  border: "border-amber-500/25",  icon: Lightbulb,  tip: "Breaking problem into steps" },
  HINT:          { label: "Hint Mode",     color: "text-cyan-300",   bg: "bg-cyan-500/10",   border: "border-cyan-500/25",   icon: Zap,        tip: "Guiding you to find the answer" },
  GUIDE:         { label: "Guiding",       color: "text-green-300",  bg: "bg-green-500/10",  border: "border-green-500/25",  icon: Target,     tip: "Asking questions to help you think" },
  QUIZ:          { label: "Quiz Mode",     color: "text-pink-300",   bg: "bg-pink-500/10",   border: "border-pink-500/25",   icon: Star,       tip: "Testing your understanding" },
  FULL_SOLUTION: { label: "Full Solution", color: "text-blue-300",   bg: "bg-blue-500/10",   border: "border-blue-500/25",   icon: Trophy,     tip: "Comprehensive answer with depth" },
  SHORT:         { label: "Quick Answer",  color: "text-slate-300",  bg: "bg-slate-500/10",  border: "border-slate-500/25",  icon: ArrowRight, tip: "Direct and concise response" },
};

const SKILL_CONFIG = {
  beginner:     { label: "Beginner",     color: "text-green-400",  dot: "bg-green-400",  bar: "w-1/3"  },
  intermediate: { label: "Intermediate", color: "text-amber-400",  dot: "bg-amber-400",  bar: "w-2/3"  },
  advanced:     { label: "Advanced",     color: "text-violet-400", dot: "bg-violet-400", bar: "w-full" },
};

// ─── Main Component ──────────────────────────────────────────
export function MentorIntelligenceBar({
  mentorState, sessionTopics, mistakeTopics, isVisible, onToggle, turnCount,
}: Props) {
  const [profile, setProfile]   = useState<StudentProfile | null>(null);
  const [loading, setLoading]   = useState(false);

  // Load student profile once on mount
  useEffect(() => {
    setLoading(true);
    getStudentProfile()
      .then(d => { if (d.success) setProfile(d.profile); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const skill = mentorState.skillLevel ?? profile?.tutorPersonality as any ?? "intermediate";
  const skillCfg = SKILL_CONFIG[skill as keyof typeof SKILL_CONFIG] ?? SKILL_CONFIG.intermediate;

  const allWeakTopics = [...new Set([
    ...(profile?.weakTopics ?? []),
    ...mistakeTopics,
  ])].slice(0, 4);

  const strongTopics = (profile?.strongTopics ?? []).slice(0, 3);
  const strategy = mentorState.strategy;
  const stratCfg = strategy ? STRATEGY_CONFIG[strategy] : null;

  // Don't show before first message
  if (turnCount === 0 && !profile) return null;

  return (
    <div className="border-b border-white/5 flex-shrink-0">
      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/[0.02] transition-colors group"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            AI Mentor Intelligence
          </span>
          {turnCount > 0 && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Turn {turnCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-200 ${isVisible ? "" : "rotate-180"}`}
        />
      </button>

      {/* Panel content */}
      {isVisible && (
        <div className="px-4 pb-3 grid grid-cols-2 sm:grid-cols-4 gap-2">

          {/* Skill Level */}
          <div className="rounded-xl border border-white/6 bg-white/[0.02] p-2.5">
            <p className="text-[9px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Your Level
            </p>
            {loading ? (
              <div className="h-4 w-20 rounded bg-white/[0.04] animate-pulse" />
            ) : (
              <>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${skillCfg.dot}`} />
                  <span className={`text-xs font-semibold ${skillCfg.color}`}>{skillCfg.label}</span>
                </div>
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full ${skillCfg.bar} ${skillCfg.dot} rounded-full transition-all duration-500`} />
                </div>
              </>
            )}
          </div>

          {/* Active Strategy */}
          <div className="rounded-xl border border-white/6 bg-white/[0.02] p-2.5">
            <p className="text-[9px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              AI Strategy
            </p>
            {stratCfg ? (
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${stratCfg.bg} border ${stratCfg.border} w-fit`}>
                <stratCfg.icon className={`w-2.5 h-2.5 ${stratCfg.color}`} />
                <span className={`text-[10px] font-semibold ${stratCfg.color}`}>{stratCfg.label}</span>
              </div>
            ) : (
              <span className="text-[10px] text-slate-600">Analyzing…</span>
            )}
            {stratCfg && (
              <p className="text-[9px] text-slate-600 mt-1">{stratCfg.tip}</p>
            )}
          </div>

          {/* Weak Topics */}
          <div className="rounded-xl border border-white/6 bg-white/[0.02] p-2.5">
            <p className="text-[9px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
              Focus Areas
            </p>
            {allWeakTopics.length === 0 ? (
              <span className="text-[10px] text-slate-600">No weak areas yet</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {allWeakTopics.map(t => (
                  <span
                    key={t}
                    className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/8 border border-amber-500/15 text-amber-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Strong Topics / Session */}
          <div className="rounded-xl border border-white/6 bg-white/[0.02] p-2.5">
            <p className="text-[9px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5 text-green-500" />
              {sessionTopics.length > 0 ? "This Session" : "Strengths"}
            </p>
            {(sessionTopics.length > 0 ? sessionTopics : strongTopics).length === 0 ? (
              <span className="text-[10px] text-slate-600">Ask your first question!</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {(sessionTopics.length > 0 ? sessionTopics.slice(0, 3) : strongTopics).map(t => (
                  <span
                    key={t}
                    className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/8 border border-green-500/15 text-green-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Weak Topic Reminder Banner ───────────────────────────────
// Shown at top of chat when user asks about a known weak topic
interface WeakTopicBannerProps {
  topic: string;
  onDismiss: () => void;
}

export function WeakTopicBanner({ topic, onDismiss }: WeakTopicBannerProps) {
  return (
    <div className="mx-4 mt-3 flex items-center gap-3 px-3 py-2 rounded-xl bg-amber-500/8 border border-amber-500/15 animate-fade-in">
      <RefreshCw className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
      <p className="text-xs text-amber-300 flex-1">
        <span className="font-semibold">Revisiting {topic}</span>
        {" — "}you've found this tricky before. The AI will explain it differently this time.
      </p>
      <button onClick={onDismiss} className="text-amber-500 hover:text-amber-300">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Intent Badge (shown in loading state) ────────────────────
interface IntentBadgeProps {
  intent: string;
}

const INTENT_LABELS: Record<string, { label: string; color: string }> = {
  EXPLAIN:    { label: "Explaining",    color: "text-violet-400" },
  SOLVE:      { label: "Solving",       color: "text-blue-400"   },
  DEBUG:      { label: "Debugging",     color: "text-red-400"    },
  GUIDE:      { label: "Guiding",       color: "text-green-400"  },
  QUIZ:       { label: "Quizzing",      color: "text-pink-400"   },
  FOLLOWUP:   { label: "Continuing",    color: "text-slate-400"  },
  CONCEPTUAL: { label: "Deep dive",     color: "text-cyan-400"   },
  GENERAL:    { label: "Thinking",      color: "text-slate-400"  },
};

export function IntentBadge({ intent }: IntentBadgeProps) {
  const cfg = INTENT_LABELS[intent] ?? INTENT_LABELS.GENERAL;
  return (
    <span className={`text-[10px] font-semibold ${cfg.color} flex items-center gap-1`}>
      <span className="w-1 h-1 rounded-full bg-current animate-pulse inline-block" />
      {cfg.label}…
    </span>
  );
}