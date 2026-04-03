/**
 * AI Study OS — Notification Panel (Stage 7)
 * ─────────────────────────────────────────────────────────────
 * Slide-in notification panel showing:
 *   - AI Mentor messages
 *   - Streak alerts
 *   - Achievement unlocks
 *   - Comeback messages
 *   - Study reminders
 *
 * Usage:
 *   <NotificationPanel
 *     isOpen={showPanel}
 *     onClose={() => setShowPanel(false)}
 *     onCtaClick={(action) => handleAction(action)}
 *   />
 */

import { useState, useEffect, useCallback } from 'react';
import { X, Bell, BellOff, Flame, Trophy, Star, Brain, Clock, ChevronRight } from 'lucide-react';
import {
  getNotifications,
  markNotificationsRead,
} from '../../utils/retention-api';
import type { AppNotification, NotificationType } from '../../utils/retention-api';

interface Props {
  isOpen:      boolean;
  onClose:     () => void;
  onCtaClick:  (action: string) => void;
}

// ── Per-type styling ───────────────────────────────────────────

function getTypeStyle(type: NotificationType): {
  icon:   React.ReactNode;
  dot:    string;
  border: string;
  bg:     string;
} {
  switch (type) {
    case 'STREAK_ALERT':
      return {
        icon:   <Flame size={15} className="text-orange-400" />,
        dot:    'bg-orange-500',
        border: 'border-orange-500/20',
        bg:     'bg-orange-500/8',
      };
    case 'COMEBACK':
      return {
        icon:   <Star size={15} className="text-purple-400" />,
        dot:    'bg-purple-500',
        border: 'border-purple-500/20',
        bg:     'bg-purple-500/8',
      };
    case 'ACHIEVEMENT':
      return {
        icon:   <Trophy size={15} className="text-yellow-400" />,
        dot:    'bg-yellow-500',
        border: 'border-yellow-500/20',
        bg:     'bg-yellow-500/8',
      };
    case 'AI_MENTOR_MESSAGE':
      return {
        icon:   <Brain size={15} className="text-blue-400" />,
        dot:    'bg-blue-500',
        border: 'border-blue-500/20',
        bg:     'bg-blue-500/8',
      };
    case 'REMINDER':
    default:
      return {
        icon:   <Clock size={15} className="text-cyan-400" />,
        dot:    'bg-cyan-500',
        border: 'border-white/10',
        bg:     'bg-white/4',
      };
  }
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── Notification Card ──────────────────────────────────────────

function NotifCard({
  notif,
  onRead,
  onCta,
}: {
  notif:  AppNotification;
  onRead: (id: string) => void;
  onCta:  (action: string) => void;
}) {
  const style = getTypeStyle(notif.type);

  return (
    <div
      className={`
        relative flex gap-3 p-3.5 rounded-xl border transition-all
        ${style.border} ${style.bg}
        ${!notif.isRead ? 'opacity-100' : 'opacity-60'}
      `}
    >
      {/* Unread dot */}
      {!notif.isRead && (
        <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${style.dot}`} />
      )}

      {/* Icon */}
      <div className="shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
        {notif.icon ? (
          <span className="text-base">{notif.icon}</span>
        ) : (
          style.icon
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-3">
        <p className="text-white text-xs font-semibold leading-snug">{notif.title}</p>
        <p className="text-white/55 text-xs leading-snug mt-0.5 line-clamp-2">{notif.message}</p>

        <div className="mt-2 flex items-center gap-3">
          {/* Timestamp */}
          <span className="text-white/30 text-xs">{timeAgo(notif.createdAt)}</span>

          {/* CTA */}
          {notif.ctaText && notif.ctaAction && (
            <button
              onClick={() => {
                onRead(notif.id);
                onCta(notif.ctaAction!);
              }}
              className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              {notif.ctaText}
              <ChevronRight size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Panel ─────────────────────────────────────────────────

export function NotificationPanel({ isOpen, onClose, onCtaClick }: Props) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading,       setLoading]       = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      if (data.success) setNotifications(data.notifications);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  const handleRead = useCallback(async (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    await markNotificationsRead([id]).catch(() => {});
  }, []);

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    await markNotificationsRead().catch(() => {});
  };

  const handleCta = (action: string) => {
    onCtaClick(action);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[90vw] bg-[#080d1e] border-l border-white/8 shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/8">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-purple-400" />
            <span className="font-semibold text-white text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-purple-500 text-white text-xs font-bold min-w-[18px] text-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
            >
              <X size={14} className="text-white/70" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {loading ? (
            <div className="flex flex-col gap-2.5">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 rounded-xl bg-white/4 animate-pulse" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <BellOff size={36} className="text-white/20 mb-3" />
              <p className="text-white/40 text-sm font-medium">All caught up!</p>
              <p className="text-white/25 text-xs mt-1">No new notifications</p>
            </div>
          ) : (
            notifications.map(notif => (
              <NotifCard
                key={notif.id}
                notif={notif}
                onRead={handleRead}
                onCta={handleCta}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/8">
          <p className="text-center text-white/20 text-xs">
            Max 2 notifications per day
          </p>
        </div>
      </div>
    </>
  );
}

// ── Notification Bell Button (for navbar) ──────────────────────

export function NotificationBell({
  count,
  onClick,
}: {
  count:   number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center transition-all active:scale-95"
    >
      <Bell size={16} className="text-white/70" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center border border-[#080d1e]">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}