/**
 * AI Study OS — Streak Recovery UI (Stage 7)
 * ─────────────────────────────────────────────────────────────
 * Full-screen overlay / modal that shows when streak is broken.
 * Lets user pick ONE recovery task to restore their streak.
 *
 * Usage:
 *   <StreakRecoveryUI
 *     recovery={recoveryStatus}
 *     onComplete={(method) => handleRecovery(method)}
 *     onDismiss={() => setShowRecovery(false)}
 *   />
 */

import { useState } from 'react';
import { Flame, CheckCircle, X, Clock, Zap, BookOpen, Brain, Trophy } from 'lucide-react';
import type { RecoveryStatus, RecoveryMethod } from '../utils/retention-api';

interface Props {
  recovery:   RecoveryStatus;
  onComplete: (method: RecoveryMethod) => Promise<void>;
  onDismiss?: () => void;
}

const METHOD_CONFIG: Record<RecoveryMethod, {
  icon:    React.ReactNode;
  color:   string;
  border:  string;
  bg:      string;
}> = {
  task: {
    icon:   <Brain size={20} className="text-blue-400" />,
    color:  'text-blue-300',
    border: 'border-blue-500/30 hover:border-blue-400/60',
    bg:     'bg-blue-500/10 hover:bg-blue-500/15',
  },
  quiz: {
    icon:   <Trophy size={20} className="text-purple-400" />,
    color:  'text-purple-300',
    border: 'border-purple-500/30 hover:border-purple-400/60',
    bg:     'bg-purple-500/10 hover:bg-purple-500/15',
  },
  lesson: {
    icon:   <BookOpen size={20} className="text-cyan-400" />,
    color:  'text-cyan-300',
    border: 'border-cyan-500/30 hover:border-cyan-400/60',
    bg:     'bg-cyan-500/10 hover:bg-cyan-500/15',
  },
};

const ALL_METHODS: RecoveryMethod[] = ['task', 'quiz', 'lesson'];

const TASK_DATA: Record<RecoveryMethod, { title: string; description: string; duration: string; xp: number }> = {
  task: {
    title:       'Complete 1 Quick Task',
    description: 'Ask AI a question or use any study tool',
    duration:    '2 min',
    xp:          50,
  },
  quiz: {
    title:       'Solve 1 Quick Quiz',
    description: 'Answer 3 questions in Daily Challenge',
    duration:    '3 min',
    xp:          60,
  },
  lesson: {
    title:       'Complete 1 Lesson',
    description: 'Finish any section in CodeLearn',
    duration:    '5 min',
    xp:          55,
  },
};

export function StreakRecoveryUI({ recovery, onComplete, onDismiss }: Props) {
  const [selected,  setSelected]  = useState<RecoveryMethod | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);

  const previousStreak = recovery.previousStreak ?? 0;

  // Time left in recovery window
  const expiresAt   = recovery.expiresAt ? new Date(recovery.expiresAt) : null;
  const hoursLeft   = expiresAt
    ? Math.max(0, (expiresAt.getTime() - Date.now()) / 3600000)
    : 0;
  const timeLeftStr = hoursLeft > 1
    ? `${Math.floor(hoursLeft)}h ${Math.floor((hoursLeft % 1) * 60)}m`
    : `${Math.floor(hoursLeft * 60)}m`;

  const handleStart = async () => {
    if (!selected || loading) return;
    setLoading(true);
    try {
      await onComplete(selected);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="w-full max-w-sm bg-navy-900 border border-green-500/40 rounded-2xl overflow-hidden shadow-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-green-400 to-emerald-500" />
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 text-3xl">
              🔥
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Streak Restored!</h3>
            <p className="text-green-400 font-semibold text-lg mb-1">
              {previousStreak}-day streak saved!
            </p>
            <p className="text-white/60 text-sm mb-5">+50 XP earned for the comeback 💪</p>
            <button
              onClick={onDismiss}
              className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold transition-all active:scale-95"
            >
              Keep Going! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#0a1128] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

        {/* Fire gradient top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />

        {/* Header */}
        <div className="relative p-5 pb-3">
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={14} className="text-white/60" />
            </button>
          )}

          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-xl">
              🔥
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight">Save Your Streak</h3>
              <p className="text-white/50 text-xs">One task = streak restored</p>
            </div>
          </div>

          {/* Streak badge */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/25">
              <Flame size={14} className="text-orange-400" />
              <span className="text-orange-300 font-semibold text-sm">{previousStreak}-day streak</span>
            </div>
            {hoursLeft > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-white/40">
                <Clock size={11} />
                <span>{timeLeftStr} left</span>
              </div>
            )}
          </div>
        </div>

        {/* Task selection */}
        <div className="px-5 pb-2">
          <p className="text-white/50 text-xs mb-3 font-medium tracking-wide uppercase">
            Choose 1 task to recover:
          </p>
          <div className="space-y-2">
            {ALL_METHODS.map((method) => {
              const task   = TASK_DATA[method];
              const config = METHOD_CONFIG[method];
              const isSelected = selected === method;

              return (
                <button
                  key={method}
                  onClick={() => setSelected(method)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl border text-left
                    transition-all active:scale-[0.98]
                    ${config.border} ${config.bg}
                    ${isSelected ? 'ring-1 ring-white/20 scale-[1.01]' : ''}
                  `}
                >
                  {/* Method icon */}
                  <div className={`shrink-0 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center`}>
                    {config.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-white/80'}`}>
                      {task.title}
                    </p>
                    <p className="text-white/40 text-xs truncate">{task.description}</p>
                  </div>

                  {/* Right side: duration + xp */}
                  <div className="shrink-0 flex flex-col items-end gap-0.5">
                    <span className={`text-xs font-semibold ${config.color}`}>+{task.xp} XP</span>
                    <span className="text-white/30 text-xs">{task.duration}</span>
                  </div>

                  {/* Selected check */}
                  {isSelected && (
                    <CheckCircle size={16} className="shrink-0 text-green-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="p-5 pt-3">
          <button
            onClick={handleStart}
            disabled={!selected || loading}
            className={`
              w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2
              transition-all active:scale-95
              ${selected && !loading
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-400 hover:to-red-400'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
              }
            `}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Zap size={15} />
            )}
            {loading ? 'Saving streak...' : selected ? `Start Task →` : 'Select a task above'}
          </button>
          <p className="text-center text-white/30 text-xs mt-2">
            Complete the task to restore your streak 🔥
          </p>
        </div>
      </div>
    </div>
  );
}