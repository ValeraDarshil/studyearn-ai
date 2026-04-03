/**
 * AI Study OS — AI Mentor Page (Stage 6)
 * ─────────────────────────────────────────────────────────────
 * Dark theme — matches BrainDashboard / Analytics / AskAI style.
 * Uses: glass, gradient-text, bg-slate-*, text-white, border-white/8
 *
 * Fully working:
 *   ✅ Mentor message display
 *   ✅ Micro-task with countdown timer
 *   ✅ Check Now button (calls /api/mentor/check)
 *   ✅ History tab (calls /api/mentor/messages)
 *   ✅ Personality selector (friendly / motivational / strict)
 *   ✅ Mark read / dismiss
 *   ✅ Complete task
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Bot, RefreshCw, Clock, CheckCircle2, ChevronRight,
  Zap, Star, Trophy, Flame, AlertTriangle, TrendingUp,
  BookOpen, Target, Smile, Award, Settings, History, MessageSquare,
} from 'lucide-react';
import { mentorApi, MentorState, MentorMessageData, MicroTask, MentorPersonality } from '../utils/mentor-api';
import { useApp } from '../context/AppContext';

// ── Trigger display config ─────────────────────────────────────
const TRIGGER_META: Record<string, { color: string; bgClass: string; borderClass: string; label: string; icon: any }> = {
  COMEBACK:          { color: 'text-orange-400',  bgClass: 'bg-orange-500/10',  borderClass: 'border-orange-500/20',  label: 'Comeback',        icon: Flame },
  STREAK_BREAK:      { color: 'text-red-400',     bgClass: 'bg-red-500/10',     borderClass: 'border-red-500/20',     label: 'Streak Break',    icon: AlertTriangle },
  STREAK_AT_RISK:    { color: 'text-amber-400',   bgClass: 'bg-amber-500/10',   borderClass: 'border-amber-500/20',   label: 'Streak at Risk',  icon: Flame },
  LOW_PERFORMANCE:   { color: 'text-purple-400',  bgClass: 'bg-purple-500/10',  borderClass: 'border-purple-500/20',  label: 'Low Performance', icon: TrendingUp },
  HIGH_PROGRESS:     { color: 'text-emerald-400', bgClass: 'bg-emerald-500/10', borderClass: 'border-emerald-500/20', label: 'High Progress',   icon: TrendingUp },
  INACTIVE_USER:     { color: 'text-blue-400',    bgClass: 'bg-blue-500/10',    borderClass: 'border-blue-500/20',    label: 'Inactive',        icon: Clock },
  DAILY_REMINDER:    { color: 'text-sky-400',     bgClass: 'bg-sky-500/10',     borderClass: 'border-sky-500/20',     label: 'Daily Reminder',  icon: BookOpen },
  GOAL_PENDING:      { color: 'text-slate-400',   bgClass: 'bg-slate-500/10',   borderClass: 'border-slate-500/20',   label: 'Goal Pending',    icon: Target },
  WEAK_TOPIC_FOCUS:  { color: 'text-pink-400',    bgClass: 'bg-pink-500/10',    borderClass: 'border-pink-500/20',    label: 'Weak Topic',      icon: BookOpen },
  MILESTONE_REACHED: { color: 'text-amber-400',   bgClass: 'bg-amber-500/10',   borderClass: 'border-amber-500/20',   label: 'Milestone',       icon: Trophy },
};

const DIFFICULTY_META = {
  easy:   { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  medium: { color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
  hard:   { color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20' },
};

const PERSONALITY_META: { id: MentorPersonality; label: string; emoji: string; desc: string; color: string; border: string; bg: string }[] = [
  { id: 'friendly',     label: 'Friendly',     emoji: '😊', desc: 'Warm & supportive',     color: 'text-sky-400',     border: 'border-sky-500/40',     bg: 'bg-sky-500/10' },
  { id: 'motivational', label: 'Motivational', emoji: '🔥', desc: 'High-energy & bold',    color: 'text-orange-400',  border: 'border-orange-500/40',  bg: 'bg-orange-500/10' },
  { id: 'strict',       label: 'Strict',       emoji: '⚡', desc: 'Direct & demanding',    color: 'text-violet-400',  border: 'border-violet-500/40',  bg: 'bg-violet-500/10' },
];

const LEVEL_TITLES = ['', 'Rookie', 'Explorer', 'Learner', 'Scholar', 'Achiever', 'Champion', 'Master', 'Expert', 'Elite', 'Legend'];

// ── Countdown Timer ────────────────────────────────────────────
function useTimer(mins: number) {
  const [secs, setSecs]     = useState(mins * 60);
  const [running, setRun]   = useState(false);
  const ref = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setSecs(s => { if (s <= 1) { setRun(false); clearInterval(ref.current!); return 0; } return s - 1; });
      }, 1000);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return { display: `${m}:${s}`, running, toggle: () => setRun(r => !r), reset: () => { setRun(false); setSecs(mins * 60); }, done: secs === 0 };
}

// ── Sub-components ─────────────────────────────────────────────

function MentorLevelBadge({ level }: { level: number }) {
  const pct = ((level - 1) / 9) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0"
        style={{ boxShadow: '0 4px 14px rgba(139,92,246,0.4)' }}>
        {level}
      </div>
      <div>
        <div className="text-sm font-bold text-white">
          Level {level} — <span className="gradient-text">{LEVEL_TITLES[level]}</span>
        </div>
        <div className="mt-1.5 h-1.5 w-36 rounded-full bg-slate-700 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-700"
            style={{ width: `${pct}%` }} />
        </div>
        <div className="text-[10px] text-slate-500 mt-1">
          {level < 10 ? `${10 - ((level - 1) % 10) - 1} sessions to next level` : 'Max level! 🏆'}
        </div>
      </div>
    </div>
  );
}

function MicroTaskCard({ task, onComplete }: { task: MicroTask; onComplete: () => void }) {
  const timer = useTimer(task.durationMinutes);
  const diff  = DIFFICULTY_META[task.difficulty];

  return (
    <div className="glass rounded-2xl p-5 border border-white/8 space-y-4">
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${diff.color} ${diff.bg} ${diff.border}`}>
          {task.difficulty} · {task.durationMinutes} min
        </span>
        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
          +{task.xpReward} XP
        </span>
      </div>

      <div>
        <h3 className="text-base font-bold text-white mb-1">{task.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{task.description}</p>
      </div>

      {/* Timer */}
      <div className={`rounded-xl px-4 py-3 flex items-center justify-between border ${timer.done ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-800/60 border-white/8'}`}>
        <div>
          <div className={`text-[10px] font-semibold uppercase tracking-widest mb-0.5 ${timer.done ? 'text-emerald-400' : 'text-slate-500'}`}>
            {timer.done ? '✅ Done!' : timer.running ? '⏱ Active' : '⏱ Timer'}
          </div>
          <div className={`text-3xl font-black tracking-widest ${timer.done ? 'text-emerald-400' : 'text-white'}`}
            style={{ fontVariantNumeric: 'tabular-nums' }}>
            {timer.display}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={timer.toggle}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              timer.running
                ? 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25'
                : 'bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30'
            }`}>
            {timer.running ? 'Pause' : 'Start'}
          </button>
          {!timer.running && (
            <button onClick={timer.reset}
              className="px-3 py-2 rounded-xl text-sm text-slate-400 border border-white/8 hover:border-white/20 hover:text-white transition-all">
              ↺
            </button>
          )}
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}>
        ✅ Mark Complete
      </button>
    </div>
  );
}

function MentorMessageCard({ msg, onStart, onDismiss }: {
  msg: MentorMessageData; onStart: () => void; onDismiss: () => void;
}) {
  const meta = TRIGGER_META[msg.triggerType] ?? TRIGGER_META['DAILY_REMINDER'];
  const MetaIcon = meta.icon;
  const time = new Date(msg.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`glass rounded-2xl p-5 border ${meta.borderClass} relative overflow-hidden`}>
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${meta.bgClass}`}
        style={{ background: `linear-gradient(90deg, transparent, currentColor, transparent)` }} />

      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{msg.emoji}</span>
          <div>
            <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${meta.color}`}>
              <MetaIcon className="w-3 h-3" />
              {meta.label}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">{time}</div>
          </div>
        </div>
        <button onClick={onDismiss}
          className="text-slate-600 hover:text-slate-400 transition-colors text-lg leading-none p-1">
          ×
        </button>
      </div>

      <h2 className="text-lg font-black text-white mb-2 leading-snug">{msg.title}</h2>
      <p className="text-sm text-slate-400 leading-relaxed mb-4">{msg.body}</p>

      {/* Task hint */}
      <div className="flex items-center gap-2 bg-slate-800/60 rounded-xl px-3 py-2.5 border border-white/8 mb-4">
        <Zap className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
        <span className="text-xs text-slate-300 font-medium">{msg.taskHint}</span>
      </div>

      {/* XP bonus */}
      {msg.xpAwarded > 0 && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 w-fit">
          <Star className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-amber-400">+{msg.xpAwarded} Bonus XP Awarded!</span>
        </div>
      )}

      <button
        onClick={onStart}
        className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2`}
        style={{ background: `linear-gradient(135deg, var(--btn-from), var(--btn-to))` }}
      >
        <style>{`.mentor-cta{background:linear-gradient(135deg,#6366f1,#8b5cf6)}`}</style>
        <span className="mentor-cta absolute inset-0 rounded-xl opacity-0" />
        <span>{msg.cta}</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* CTA with proper gradient */}
      <style>{`
        .mentor-msg-cta {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
        }
      `}</style>
    </div>
  );
}

// Reusable CTA button with proper gradient
function CTAButton({ onClick, children, disabled = false }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}
    >
      {children}
    </button>
  );
}

function MentorMessageCardFixed({ msg, onStart, onDismiss }: {
  msg: MentorMessageData; onStart: () => void; onDismiss: () => void;
}) {
  const meta = TRIGGER_META[msg.triggerType] ?? TRIGGER_META['DAILY_REMINDER'];
  const MetaIcon = meta.icon;
  const time = new Date(msg.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`glass rounded-2xl p-5 border ${meta.borderClass} relative`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{msg.emoji}</span>
          <div>
            <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${meta.color}`}>
              <MetaIcon className="w-3 h-3" />
              {meta.label}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">{time}</div>
          </div>
        </div>
        <button onClick={onDismiss}
          className="text-slate-600 hover:text-slate-400 transition-colors text-xl leading-none w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5">
          ×
        </button>
      </div>

      <h2 className="text-lg font-black text-white mb-2 leading-snug">{msg.title}</h2>
      <p className="text-sm text-slate-400 leading-relaxed mb-4">{msg.body}</p>

      <div className="flex items-center gap-2 bg-slate-800/60 rounded-xl px-3 py-2.5 border border-white/8 mb-4">
        <Zap className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
        <span className="text-xs text-slate-300 font-medium">{msg.taskHint}</span>
      </div>

      {msg.xpAwarded > 0 && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 w-fit">
          <Star className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-amber-400">+{msg.xpAwarded} Bonus XP Awarded!</span>
        </div>
      )}

      <CTAButton onClick={onStart}>
        {msg.cta} <ChevronRight className="w-4 h-4" />
      </CTAButton>
    </div>
  );
}

function HistoryFeed({ messages }: { messages: MentorMessageData[] }) {
  if (!messages.length) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-slate-400 text-sm">No mentor messages yet. Come back after studying!</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {messages.map((msg) => {
        const meta = TRIGGER_META[msg.triggerType] ?? TRIGGER_META['DAILY_REMINDER'];
        return (
          <div key={msg._id}
            className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
              msg.isRead ? 'border-white/5 bg-slate-800/20' : `${meta.borderClass} ${meta.bgClass}`
            }`}>
            <span className="text-xl flex-shrink-0 leading-none mt-0.5">{msg.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-${msg.isRead ? 'medium' : 'bold'} text-white truncate`}>{msg.title}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {new Date(msg.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                {msg.xpAwarded > 0 && <span className="text-amber-400 ml-2">+{msg.xpAwarded} XP</span>}
              </div>
            </div>
            {!msg.isRead && (
              <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${meta.color.replace('text-', 'bg-')}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function AIMentor() {
  const { userName } = useApp();
  const firstName = userName?.split(' ')[0] || 'there';

  const [state,       setState]     = useState<MentorState | null>(null);
  const [messages,    setMessages]  = useState<MentorMessageData[]>([]);
  const [loading,     setLoading]   = useState(true);
  const [checking,    setChecking]  = useState(false);
  const [taskDone,    setTaskDone]  = useState(false);
  const [pLoading,    setPLoading]  = useState(false);
  const [activeTab,   setActiveTab] = useState<'mentor' | 'history' | 'settings'>('mentor');
  const [toast,       setToast]     = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    try {
      const [s, m] = await Promise.all([
        mentorApi.getState(),
        mentorApi.getMessages(20),
      ]);
      setState(s);
      setMessages(m.messages ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCheck = async () => {
    setChecking(true);
    try {
      await mentorApi.check({ forceRun: true });
      await load();
      showToast('✅ AI Mentor checked your progress!');
    } catch {
      showToast('❌ Could not run mentor check', 'error');
    } finally {
      setChecking(false);
    }
  };

  const handleStart = async (msg: MentorMessageData) => {
    if (!msg.isRead) await mentorApi.markRead(msg._id).catch(() => {});
    await load();
    document.getElementById('micro-task')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDismiss = async (id: string) => {
    await mentorApi.dismiss(id).catch(() => {});
    await load();
  };

  const handleCompleteTask = async () => {
    await mentorApi.completeTask().catch(() => {});
    setTaskDone(true);
    showToast('🎉 Task complete! XP awarded!');
    setTimeout(() => { setTaskDone(false); load(); }, 2000);
  };

  const handlePersonality = async (p: MentorPersonality) => {
    setPLoading(true);
    try {
      await mentorApi.setPersonality(p);
      setState(prev => prev ? { ...prev, mentorPersonality: p } : prev);
      showToast(`Mentor style changed to ${p}!`);
    } catch {
      showToast('Failed to update personality', 'error');
    } finally {
      setPLoading(false);
    }
  };

  const latestMsg   = state?.latestMessage;
  const microTask   = state?.activeMicroTask;
  const unreadCount = state?.unreadCount ?? 0;
  const mentorLevel = state?.mentorLevel ?? 1;

  const TABS = [
    { id: 'mentor',   label: 'Mentor',   icon: Bot },
    { id: 'history',  label: 'History',  icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[999] px-4 py-3 rounded-xl text-sm font-semibold shadow-xl border
            ${toast.type === 'error'
              ? 'bg-red-500/15 border-red-500/30 text-red-300'
              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
            }`}
          style={{ backdropFilter: 'blur(12px)' }}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <Bot className="w-7 h-7 text-emerald-400" />
            AI Mentor
            {unreadCount > 0 && (
              <span className="text-xs font-bold bg-red-500 text-white rounded-full px-2 py-0.5 ml-1">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Hey {firstName}! Your proactive learning coach — always watching, always guiding.
          </p>
        </div>

        <button
          onClick={handleCheck}
          disabled={checking}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-50 self-start"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}
        >
          <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
          {checking ? 'Checking...' : 'Check Now'}
        </button>
      </div>

      {/* Mentor Level Card */}
      {!loading && state && (
        <div className="glass rounded-2xl p-4 border border-white/8">
          <MentorLevelBadge level={mentorLevel} />
        </div>
      )}

      {/* ── Tabs ───────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-slate-800/60 rounded-xl w-fit border border-white/5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {id === 'history' && messages.filter(m => !m.isRead).length > 0 && (
              <span className="text-[9px] font-bold bg-red-500 text-white rounded-full px-1.5 py-0.5">
                {messages.filter(m => !m.isRead).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Loading ─────────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">AI Mentor analyzing your progress...</p>
          </div>
        </div>
      )}

      {/* ── MENTOR TAB ─────────────────────────────────────── */}
      {!loading && activeTab === 'mentor' && (
        <div className="space-y-5">

          {/* Active message */}
          {latestMsg && !latestMsg.isDismissed ? (
            <MentorMessageCardFixed
              msg={latestMsg}
              onStart={() => handleStart(latestMsg)}
              onDismiss={() => handleDismiss(latestMsg._id)}
            />
          ) : (
            <div className="glass rounded-2xl p-10 border border-white/8 text-center">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">You're all caught up!</h3>
              <p className="text-sm text-slate-400 mb-6">
                No pending mentor messages. Keep studying and I'll check in soon.
              </p>
              <button
                onClick={handleCheck}
                disabled={checking}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}
              >
                {checking ? 'Checking...' : 'Run AI Check Now'}
              </button>
            </div>
          )}

          {/* Active micro-task */}
          {microTask && (
            <div id="micro-task">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Micro-Task</span>
              </div>
              {taskDone ? (
                <div className="glass rounded-2xl p-10 border border-emerald-500/20 text-center">
                  <div className="text-5xl mb-3">🎉</div>
                  <h3 className="text-lg font-bold text-emerald-400">Task Complete! XP Awarded!</h3>
                </div>
              ) : (
                <MicroTaskCard task={microTask} onComplete={handleCompleteTask} />
              )}
            </div>
          )}

          {/* Quick Stats */}
          {state && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Sessions', value: state.totalTriggersEver, icon: MessageSquare, color: 'text-blue-400' },
                { label: 'Tasks Done',     value: state.totalTasksCompleted, icon: CheckCircle2, color: 'text-emerald-400' },
                { label: 'Mentor Level',   value: `L${state.mentorLevel}`, icon: Award, color: 'text-violet-400' },
              ].map(s => (
                <div key={s.label} className="glass rounded-xl p-4 border border-white/8 text-center">
                  <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                  <div className="text-xl font-black text-white">{s.value}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── HISTORY TAB ─────────────────────────────────────── */}
      {!loading && activeTab === 'history' && (
        <div className="glass rounded-2xl p-5 border border-white/8">
          <div className="flex items-center gap-2 mb-5">
            <History className="w-5 h-5 text-slate-400" />
            <h3 className="text-base font-bold text-white">Message History</h3>
            <span className="text-xs text-slate-500 ml-auto">{messages.length} messages</span>
          </div>
          <HistoryFeed messages={messages} />
        </div>
      )}

      {/* ── SETTINGS TAB ─────────────────────────────────────── */}
      {!loading && activeTab === 'settings' && (
        <div className="space-y-4">

          {/* Personality selector */}
          <div className="glass rounded-2xl p-5 border border-white/8">
            <div className="flex items-center gap-2 mb-5">
              <Smile className="w-5 h-5 text-slate-400" />
              <h3 className="text-base font-bold text-white">Mentor Personality</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {PERSONALITY_META.map(p => {
                const isActive = state?.mentorPersonality === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => !pLoading && handlePersonality(p.id)}
                    disabled={pLoading}
                    className={`p-4 rounded-xl border text-center transition-all disabled:opacity-50 ${
                      isActive
                        ? `${p.border} ${p.bg}`
                        : 'border-white/8 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-2xl mb-2">{p.emoji}</div>
                    <div className={`text-xs font-bold mb-1 ${isActive ? p.color : 'text-white'}`}>{p.label}</div>
                    <div className="text-[10px] text-slate-500 leading-snug">{p.desc}</div>
                    {isActive && (
                      <div className={`text-[9px] font-bold uppercase tracking-widest mt-2 ${p.color}`}>Active</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* How it works */}
          <div className="glass rounded-2xl p-5 border border-violet-500/20 bg-violet-500/5">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-bold text-violet-300">How AI Mentor Works</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { icon: '⏰', text: 'Checks your activity every 6 hours automatically' },
                { icon: '🚫', text: 'Max 2 personalized messages per day (no spam)' },
                { icon: '🎯', text: 'Fires near your preferred study time (learns from habits)' },
                { icon: '📈', text: 'Gets smarter as your mentor level increases' },
                { icon: '⚡', text: 'Assigns micro-tasks based on weaknesses & mood' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-base leading-none mt-0.5 flex-shrink-0">{item.icon}</span>
                  <span className="text-xs text-slate-400 leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}