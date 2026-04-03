/**
 * AI Study OS — Comeback Screen (Stage 7)
 * ─────────────────────────────────────────────────────────────
 * Full-screen welcome-back overlay for users inactive 48h+.
 * Shows personalized plan and motivational message.
 *
 * Usage:
 *   <ComebackScreen
 *     plan={comebackPlan}
 *     onStartTask={(taskId) => handleTask(taskId)}
 *     onDismiss={() => setShowComeback(false)}
 *   />
 */

import { useState } from 'react';
import { X, Play, Zap, Clock, Star, ChevronRight } from 'lucide-react';
import type { ComebackPlan, ComebackTask } from '../utils/retention-api';

interface Props {
  plan:        ComebackPlan;
  onStartTask: (task: ComebackTask) => void;
  onDismiss:   () => void;
}

const TASK_TYPE_ICON: Record<string, string> = {
  ask_ai:    '🤖',
  quiz:      '🧩',
  lesson:    '📚',
  challenge: '⚡',
  review:    '🔁',
};

const INTENSITY_GRADIENT: Record<string, string> = {
  soft:   'from-blue-600 to-indigo-600',
  strong: 'from-purple-600 to-pink-600',
  deep:   'from-violet-600 to-fuchsia-600',
  none:   'from-gray-600 to-gray-700',
};

export function ComebackScreen({ plan, onStartTask, onDismiss }: Props) {
  const [selectedTask, setSelectedTask] = useState<ComebackTask | null>(
    plan.tasks.length === 1 ? plan.tasks[0] : null,
  );

  const gradient = INTENSITY_GRADIENT[plan.intensity] ?? INTENSITY_GRADIENT.soft;

  const handleStart = () => {
    if (!selectedTask) return;
    onStartTask(selectedTask);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-[#0a1128] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

        {/* Gradient hero banner */}
        <div className={`bg-gradient-to-br ${gradient} p-5 relative overflow-hidden`}>
          {/* Background sparkle */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}
          />

          {/* Close */}
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors"
          >
            <X size={14} className="text-white/80" />
          </button>

          {/* Emoji + headline */}
          <div className="relative">
            <div className="text-4xl mb-3">
              {plan.intensity === 'deep'   ? '💙'
               : plan.intensity === 'strong' ? '🌟'
               : '👋'}
            </div>
            <h2 className="text-xl font-bold text-white leading-tight mb-1">
              {plan.headline}
            </h2>
            <p className="text-white/80 text-sm leading-snug">{plan.message}</p>
          </div>

          {/* Stats row */}
          <div className="relative mt-4 flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/20 text-white/80 text-xs">
              <Clock size={11} />
              {plan.totalMinutes} min plan
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/20 text-white/80 text-xs">
              <Zap size={11} />
              +{plan.totalXP} XP waiting
            </div>
          </div>
        </div>

        {/* Sub-message */}
        {plan.subMessage && (
          <div className="px-5 pt-4 pb-0">
            <p className="text-white/50 text-sm leading-relaxed">{plan.subMessage}</p>
          </div>
        )}

        {/* Task list */}
        {plan.tasks.length > 0 && (
          <div className="px-5 pt-4 pb-2">
            <p className="text-white/40 text-xs uppercase tracking-wider font-medium mb-3">
              Your comeback plan:
            </p>

            <div className="space-y-2">
              {plan.tasks.map((task) => {
                const isSelected = selectedTask?.id === task.id;
                return (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl border text-left
                      transition-all active:scale-[0.98]
                      ${isSelected
                        ? 'border-purple-500/50 bg-purple-500/10 ring-1 ring-purple-500/20'
                        : 'border-white/8 bg-white/4 hover:border-white/15 hover:bg-white/6'
                      }
                    `}
                  >
                    <span className="text-xl shrink-0">{TASK_TYPE_ICON[task.type] ?? '📌'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium leading-tight">{task.title}</p>
                      <p className="text-white/40 text-xs truncate mt-0.5">{task.description}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-0.5 ml-2">
                      <span className="text-xs font-semibold text-purple-300">+{task.xpReward} XP</span>
                      <span className="text-white/30 text-xs">{task.durationMin}m</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="p-5 pt-3">
          {plan.tasks.length > 0 ? (
            <button
              onClick={handleStart}
              disabled={!selectedTask}
              className={`
                w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2
                transition-all active:scale-95
                ${selectedTask
                  ? `bg-gradient-to-r ${gradient} text-white hover:opacity-90`
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
                }
              `}
            >
              <Play size={14} />
              {selectedTask ? `${plan.ctaText} →` : 'Select a task above'}
            </button>
          ) : (
            <button
              onClick={onDismiss}
              className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-gradient-to-r ${gradient} text-white hover:opacity-90 transition-all active:scale-95`}
            >
              {plan.ctaText}
              <ChevronRight size={15} />
            </button>
          )}

          <button
            onClick={onDismiss}
            className="mt-2 w-full py-2 text-center text-white/30 hover:text-white/50 text-xs transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}