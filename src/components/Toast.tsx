/**
 * StudyEarn AI — Toast Notification System
 * Beautiful animated toasts for success, error, info, achievement, points
 */

import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import { CheckCircle, XCircle, Info, X, Zap, Trophy, Flame } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
export type ToastType = "success" | "error" | "info" | "points" | "achievement" | "streak";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, default 4000
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, "id">) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showPoints: (points: number, action?: string) => void;
  showAchievement: (title: string) => void;
  showStreak: (days: number, bonus: number) => void;
}

// ─────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ─────────────────────────────────────────────────────────────
// SINGLE TOAST COMPONENT
// ─────────────────────────────────────────────────────────────
const TOAST_STYLES: Record<ToastType, { bg: string; border: string; icon: JSX.Element; titleColor: string }> = {
  success:     { bg: "bg-[#0a1a0f]",   border: "border-green-500/30",  icon: <CheckCircle className="w-4 h-4 text-green-400" />,  titleColor: "text-green-300" },
  error:       { bg: "bg-[#1a0a0a]",   border: "border-red-500/30",    icon: <XCircle    className="w-4 h-4 text-red-400" />,     titleColor: "text-red-300" },
  info:        { bg: "bg-[#0a0f1a]",   border: "border-blue-500/30",   icon: <Info       className="w-4 h-4 text-blue-400" />,    titleColor: "text-blue-300" },
  points:      { bg: "bg-[#120a1a]",   border: "border-purple-500/30", icon: <Zap        className="w-4 h-4 text-purple-400" />,  titleColor: "text-purple-300" },
  achievement: { bg: "bg-[#1a1200]",   border: "border-yellow-500/30", icon: <Trophy     className="w-4 h-4 text-yellow-400" />, titleColor: "text-yellow-300" },
  streak:      { bg: "bg-[#1a0d00]",   border: "border-orange-500/30", icon: <Flame      className="w-4 h-4 text-orange-400" />, titleColor: "text-orange-300" },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const style = TOAST_STYLES[toast.type];

  useEffect(() => {
    // Enter
    const t1 = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss
    const dur = toast.duration ?? 4000;
    const t2 = setTimeout(() => handleDismiss(), dur);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleDismiss = () => {
    setLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      style={{
        transform: visible && !leaving ? "translateX(0) scale(1)" : "translateX(110%) scale(0.95)",
        opacity: visible && !leaving ? 1 : 0,
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
      }}
      className={`relative flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl min-w-[280px] max-w-[340px] ${style.bg} ${style.border}`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">{style.icon}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-tight ${style.titleColor}`}>{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-slate-600 hover:text-slate-300 transition-colors mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-[2px] rounded-b-xl ${
          toast.type === "success" ? "bg-green-500" :
          toast.type === "error"   ? "bg-red-500" :
          toast.type === "points"  ? "bg-purple-500" :
          toast.type === "achievement" ? "bg-yellow-500" :
          toast.type === "streak"  ? "bg-orange-500" :
          "bg-blue-500"
        }`}
        style={{
          animation: `shrink ${toast.duration ?? 4000}ms linear forwards`,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROVIDER — Wrap around your app root
// ─────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${counterRef.current++}`;
    setToasts(prev => [...prev.slice(-4), { ...toast, id }]); // max 5 visible
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const ctx: ToastContextValue = {
    showToast: addToast,
    showSuccess: (title, message) => addToast({ type: "success", title, message }),
    showError:   (title, message) => addToast({ type: "error",   title, message, duration: 5000 }),
    showInfo:    (title, message) => addToast({ type: "info",    title, message }),
    showPoints:  (points, action) => addToast({ type: "points",  title: `+${points} Points Earned! 🎉`, message: action, duration: 3000 }),
    showAchievement: (title) => addToast({ type: "achievement", title: `🏆 Achievement Unlocked!`, message: title, duration: 5000 }),
    showStreak: (days, bonus) => addToast({ type: "streak", title: `🔥 ${days} Day Streak!`, message: bonus > 10 ? `Bonus: +${bonus} pts 💪` : `+${bonus} daily login pts`, duration: 4000 }),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}

      {/* Toast container — fixed top-right */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <style>{`
          @keyframes shrink {
            from { width: 100%; }
            to   { width: 0%; }
          }
        `}</style>
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}