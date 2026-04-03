/**
 * AI Study OS — Streak Alert Popup (Stage 7)
 * ─────────────────────────────────────────────────────────────
 * Shows a floating alert when streak is at risk (< 6h left).
 * Auto-dismisses. Has live countdown timer.
 *
 * Usage:
 *   <StreakAlertPopup urgency={urgencyReport} onSaveStreak={() => navigate('/ask-ai')} />
 */

import { useState, useEffect, useCallback } from 'react';
import { X, Flame, Clock, Zap } from 'lucide-react';
import type { UrgencyReport, UrgencyLevel } from '../utils/retention-api';

interface Props {
  urgency:       UrgencyReport | null;
  onSaveStreak:  () => void;
  onDismiss?:    () => void;
}

// Hours left → countdown string
function formatCountdown(hoursLeft: number): string {
  if (hoursLeft <= 0) return '0m';
  const h = Math.floor(hoursLeft);
  const m = Math.floor((hoursLeft - h) * 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

// Urgency level → color scheme
function getLevelStyle(level: UrgencyLevel): {
  bg: string; border: string; badge: string; btn: string; pulse: string;
} {
  switch (level) {
    case 'critical':
      return {
        bg:     'bg-red-950/80',
        border: 'border-red-500/60',
        badge:  'bg-red-500/20 text-red-300',
        btn:    'bg-red-500 hover:bg-red-400',
        pulse:  'animate-pulse',
      };
    case 'high':
      return {
        bg:     'bg-orange-950/80',
        border: 'border-orange-500/50',
        badge:  'bg-orange-500/20 text-orange-300',
        btn:    'bg-orange-500 hover:bg-orange-400',
        pulse:  'animate-pulse',
      };
    default:
      return {
        bg:     'bg-navy-900/90',
        border: 'border-yellow-500/40',
        badge:  'bg-yellow-500/15 text-yellow-300',
        btn:    'bg-yellow-500 hover:bg-yellow-400 text-black',
        pulse:  '',
      };
  }
}

export function StreakAlertPopup({ urgency, onSaveStreak, onDismiss }: Props) {
  const [visible,    setVisible]    = useState(false);
  const [dismissed,  setDismissed]  = useState(false);
  const [hoursLeft,  setHoursLeft]  = useState(0);

  // Show popup when urgency becomes medium/high/critical
  useEffect(() => {
    if (!urgency) return;
    const shouldShow = ['medium', 'high', 'critical'].includes(urgency.level) && !dismissed;
    setVisible(shouldShow);
    setHoursLeft(urgency.hoursLeft ?? 0);
  }, [urgency, dismissed]);

  // Live countdown
  useEffect(() => {
    if (!visible || hoursLeft <= 0) return;
    const interval = setInterval(() => {
      setHoursLeft(h => Math.max(0, h - 1 / 3600)); // subtract 1 second worth
    }, 1000);
    return () => clearInterval(interval);
  }, [visible, hoursLeft]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    onDismiss?.();
  }, [onDismiss]);

  const handleSave = useCallback(() => {
    setVisible(false);
    onSaveStreak();
  }, [onSaveStreak]);

  if (!visible || !urgency) return null;

  const style    = getLevelStyle(urgency.level);
  const streak   = urgency.streakStatus?.currentStreak ?? 0;
  const isBroken = urgency.level === 'critical';
  const countdown = formatCountdown(hoursLeft);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm px-0">
      <div
        className={`
          relative rounded-2xl border backdrop-blur-xl shadow-2xl
          ${style.bg} ${style.border}
          overflow-hidden
        `}
      >
        {/* Glow bar at top */}
        <div className={`h-0.5 w-full ${isBroken ? 'bg-red-500' : 'bg-orange-400'} ${style.pulse}`} />

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl ${style.badge} ${style.pulse}`}>
              {isBroken ? '💔' : '🔥'}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-white text-sm leading-snug">
                  {urgency.message}
                </p>
              </div>
              <p className="text-xs text-white/60 leading-snug">
                {urgency.subMessage}
              </p>

              {/* Countdown badge */}
              {!isBroken && hoursLeft > 0 && (
                <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-semibold ${style.badge}`}>
                  <Clock size={11} />
                  {countdown} left
                </div>
              )}

              {/* Streak value */}
              {streak > 0 && (
                <div className="mt-1.5 flex items-center gap-1 text-xs text-white/50">
                  <Flame size={11} className="text-orange-400" />
                  {streak}-day streak
                </div>
              )}
            </div>

            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              className="shrink-0 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={12} className="text-white/70" />
            </button>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleSave}
            className={`
              mt-3 w-full py-2.5 rounded-xl font-semibold text-sm text-white
              flex items-center justify-center gap-2 transition-all active:scale-95
              ${style.btn}
            `}
          >
            <Zap size={14} />
            {urgency.ctaText}
          </button>
        </div>
      </div>
    </div>
  );
}