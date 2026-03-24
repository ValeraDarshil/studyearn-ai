/**
 * OnboardingTour — New User Welcome Tour
 * FIX 1: No useNavigate() — was breaking HashRouter on complete
 * FIX 2: Spotlight renders correctly (SVG mask with proper viewport sizing)
 * FIX 3: New-user detection via server createdAt (< 10 min) = ground truth
 */
import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';

interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  emoji: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  accentColor: string;
  glowColor: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    target: 'dashboard-welcome',
    title: '__USERNAME__',
    description: "This is your command center. Track your progress, points, streak, and everything you've achieved — all in one place.",
    emoji: '👋',
    position: 'bottom',
    accentColor: '#8b5cf6',
    glowColor: 'rgba(139,92,246,0.5)',
  },
  {
    id: 'ai-chat',
    target: 'quick-actions',
    title: 'Ask AI Anything 🧠',
    description: "Stuck on a problem? Use Ask AI to get instant explanations, solve doubts, and learn faster than ever. It's like having a genius tutor 24/7!",
    emoji: '🤖',
    position: 'top',
    accentColor: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.5)',
  },
  {
    id: 'daily-challenge',
    target: 'dashboard-stats',
    title: 'Daily Challenges ⚡',
    description: 'Complete a new challenge every day and earn bonus points! Challenges keep your brain sharp and your streak alive.',
    emoji: '🔥',
    position: 'bottom',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.5)',
  },
  {
    id: 'streak',
    target: 'streak-badge',
    title: 'Keep Your Streak Alive 🏆',
    description: 'Log in every day to keep your streak going. The longer your streak, the bigger your rewards. Consistency is your superpower!',
    emoji: '🔥',
    position: 'bottom',
    accentColor: '#f97316',
    glowColor: 'rgba(249,115,22,0.5)',
  },
  {
    id: 'finish',
    target: '',
    title: "You're All Set! 🎉",
    description: "The adventure begins now. Explore, learn, and level up. Your future self will thank you! 🚀",
    emoji: '🎉',
    position: 'center',
    accentColor: '#10b981',
    glowColor: 'rgba(16,185,129,0.5)',
  },
];

// ─── Persistence helpers ──────────────────────────────────────────────────────
const LS_DONE = 'se_tour_done';
const LS_USER = 'se_tour_user';

export function hasCompletedOnboarding(userId: string): boolean {
  try {
    return localStorage.getItem(LS_DONE) === '1' && localStorage.getItem(LS_USER) === userId;
  } catch { return false; }
}

export function markOnboardingComplete(userId: string): void {
  try {
    localStorage.setItem(LS_DONE, '1');
    localStorage.setItem(LS_USER, userId);
  } catch { /* ignore */ }
}

// Ground-truth new-user check: account must be < 10 minutes old
export function isNewAccount(createdAt: string | Date | undefined): boolean {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() < 10 * 60 * 1000;
}

// ─── Spotlight ────────────────────────────────────────────────────────────────
function SpotlightOverlay({
  targetRect, accentColor, onBackdropClick,
}: { targetRect: DOMRect | null; accentColor: string; onBackdropClick: () => void }) {
  const PAD = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (!targetRect) {
    return (
      <div
        onClick={onBackdropClick}
        style={{
          position: 'fixed', inset: 0, zIndex: 9990,
          background: 'rgba(3,7,18,0.88)',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          cursor: 'default',
        }}
      />
    );
  }

  const x = Math.round(targetRect.left - PAD);
  const y = Math.round(targetRect.top  - PAD);
  const w = Math.round(targetRect.width  + PAD * 2);
  const h = Math.round(targetRect.height + PAD * 2);

  return (
    <>
      <svg
        onClick={onBackdropClick}
        style={{ position: 'fixed', inset: 0, width: vw, height: vh, zIndex: 9990, cursor: 'default', overflow: 'hidden' }}
      >
        <defs>
          <mask id="tour-mask">
            <rect width={vw} height={vh} fill="white" />
            <rect x={x} y={y} width={w} height={h} rx={14} ry={14} fill="black" />
          </mask>
        </defs>
        <rect width={vw} height={vh} fill="rgba(3,7,18,0.86)" mask="url(#tour-mask)" />
      </svg>
      <div
        style={{
          position: 'fixed', left: x, top: y, width: w, height: h,
          borderRadius: 14, zIndex: 9991, pointerEvents: 'none',
          border: `2px solid ${accentColor}`,
          boxShadow: `0 0 0 3px ${accentColor}22, 0 0 22px ${accentColor}66, 0 0 48px ${accentColor}33`,
          animation: 'tourRingPulse 2s ease-in-out infinite',
        }}
      />
    </>
  );
}

// ─── Tooltip Card ─────────────────────────────────────────────────────────────
function TooltipCard({
  step, stepIndex, totalSteps, targetRect, onNext, onSkip, isLast,
}: {
  step: TourStep; stepIndex: number; totalSteps: number;
  targetRect: DOMRect | null; onNext: () => void; onSkip: () => void; isLast: boolean;
}) {
  const CARD_W = 340;
  const APPROX_H = 230;
  const GAP = 16;
  const EDGE = 12;

  function getCardStyle(): React.CSSProperties {
    if (step.position === 'center' || !targetRect) {
      return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: CARD_W, zIndex: 9999 };
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let top: number, left: number;
    switch (step.position) {
      case 'bottom': top = targetRect.bottom + GAP; left = targetRect.left + targetRect.width/2 - CARD_W/2; break;
      case 'top':    top = targetRect.top - APPROX_H - GAP; left = targetRect.left + targetRect.width/2 - CARD_W/2; break;
      case 'right':  top = targetRect.top + targetRect.height/2 - APPROX_H/2; left = targetRect.right + GAP; break;
      default:       top = targetRect.top + targetRect.height/2 - APPROX_H/2; left = targetRect.left - CARD_W - GAP;
    }
    left = Math.max(EDGE, Math.min(left, vw - CARD_W - EDGE));
    top  = Math.max(EDGE, Math.min(top,  vh - APPROX_H - EDGE));
    return { position: 'fixed', top, left, width: CARD_W, zIndex: 9999 };
  }

  return (
    <div style={{ ...getCardStyle(), animation: 'tourCardIn 0.42s cubic-bezier(0.34,1.56,0.64,1) both' }}>
      <div style={{
        background: 'linear-gradient(145deg, rgba(10,12,30,0.99) 0%, rgba(16,10,38,0.99) 100%)',
        border: `1.5px solid ${step.accentColor}40`,
        borderRadius: 20, padding: '20px 22px 18px',
        boxShadow: `0 28px 56px rgba(0,0,0,0.78), 0 0 52px ${step.glowColor}22`,
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        overflow: 'hidden', position: 'relative',
      }}>
        {/* Top accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${step.accentColor}, transparent)`,
        }} />
        {/* Shine */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, width: 70, pointerEvents: 'none',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.035), transparent)',
          transform: 'skewX(-12deg)', animation: 'tourShine 3.5s ease-in-out 0.5s infinite',
        }} />

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, fontSize: 18,
              background: `${step.accentColor}18`, border: `1px solid ${step.accentColor}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{step.emoji}</div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: step.accentColor }}>
              Step {stepIndex + 1} of {totalSteps}
            </span>
          </div>
          <button
            onClick={onSkip}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'rgba(148,163,184,0.55)', padding: '4px 8px', borderRadius: 6, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.55)')}
          >Skip tour</button>
        </div>

        <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3, fontFamily: "'Syne', system-ui, sans-serif" }}>
          {step.title}
        </h3>
        <p style={{ margin: '0 0 18px', fontSize: 13.5, color: 'rgba(148,163,184,0.88)', lineHeight: 1.65 }}>
          {step.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Dots */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} style={{
                height: 6, borderRadius: 9999,
                width: i === stepIndex ? 22 : 6,
                background: i === stepIndex ? step.accentColor : 'rgba(148,163,184,0.18)',
                transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
              }} />
            ))}
          </div>
          {/* CTA */}
          <button
            onClick={onNext}
            style={{
              background: `linear-gradient(135deg, ${step.accentColor}, ${step.accentColor}bb)`,
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '10px 20px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.01em',
              boxShadow: `0 4px 18px ${step.accentColor}44`, transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)'; e.currentTarget.style.boxShadow = `0 8px 28px ${step.accentColor}66`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 18px ${step.accentColor}44`; }}
          >
            {isLast ? '🚀 Start Learning' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function OnboardingTour({ onComplete }: { onComplete: () => void }) {
  const { userName, userId } = useApp();
  const [stepIndex, setStepIndex]   = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted]       = useState(false);

  const step   = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  const displayStep: TourStep = {
    ...step,
    title: step.title === '__USERNAME__' ? `Welcome, ${userName || 'Explorer'}! 👋` : step.title,
  };

  const measureTarget = useCallback(() => {
    if (!step.target) { setTargetRect(null); return; }
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) { setTargetRect(null); return; }
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => setTargetRect(el.getBoundingClientRect()), 350);
  }, [step.target]);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 120); return () => clearTimeout(t); }, []);
  useEffect(() => {
    measureTarget();
    window.addEventListener('resize', measureTarget);
    return () => window.removeEventListener('resize', measureTarget);
  }, [measureTarget]);

  const finish = useCallback(() => {
    markOnboardingComplete(userId);
    setMounted(false);
    // FIX: Do NOT call navigate() — user is already on /app/dashboard.
    // Calling navigate() with HashRouter was causing "No routes matched" error.
    setTimeout(() => onComplete(), 250);
  }, [userId, onComplete]);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes tourCardIn    { from { opacity:0; transform:scale(0.86) translateY(16px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes tourRingPulse { 0%,100%{box-shadow:0 0 0 3px ${step.accentColor}22,0 0 20px ${step.accentColor}55;} 50%{box-shadow:0 0 0 7px ${step.accentColor}33,0 0 42px ${step.accentColor}66;} }
        @keyframes tourShine     { 0%{left:-90px;opacity:0;} 15%{opacity:1;} 85%{opacity:1;} 100%{left:calc(100% + 90px);opacity:0;} }
      `}</style>
      <SpotlightOverlay targetRect={targetRect} accentColor={step.accentColor} onBackdropClick={finish} />
      <TooltipCard
        step={displayStep} stepIndex={stepIndex} totalSteps={TOUR_STEPS.length}
        targetRect={targetRect} onNext={() => { if (isLast) finish(); else setStepIndex(i => i + 1); }}
        onSkip={finish} isLast={isLast}
      />
    </>
  );
}