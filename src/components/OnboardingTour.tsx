/**
 * OnboardingTour — Premium New User Welcome Tour
 *
 * Mobile  → Full-screen modal with step illustration + bottom sheet card
 * Desktop → Spotlight cutout + floating tooltip anchored to element
 *
 * Persistence:
 *   1. DB  user.onboardingCompleted  (cross-device, permanent)
 *   2. localStorage se_tour_done     (instant, no flicker on refresh)
 */
import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { completeOnboarding } from '../utils/user-api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  emoji: string;
  illustration: string; // big emoji shown on mobile full-screen
  accentColor: string;
  accentColorDim: string;
  gradient: string;
  bgGradient: string;   // subtle background tint per step
  position: 'top' | 'bottom' | 'center';
}

// ─── Tour Steps ───────────────────────────────────────────────────────────────
const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    target: 'dashboard-welcome',
    title: '__USERNAME__',
    description: "This is your command center. Track your progress, points, streak, and everything you've achieved — all in one place.",
    emoji: '👋',
    illustration: '🏠',
    position: 'bottom',
    accentColor: '#8b5cf6',
    accentColorDim: 'rgba(139,92,246,0.15)',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    bgGradient: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.18) 0%, transparent 70%)',
  },
  {
    id: 'ai-chat',
    target: 'quick-actions',
    title: 'Ask AI Anything 🧠',
    description: "Stuck on a problem? Use Ask AI to get instant answers, solve doubts, and learn faster than ever — like a genius tutor 24/7!",
    emoji: '🤖',
    illustration: '🧠',
    position: 'top',
    accentColor: '#3b82f6',
    accentColorDim: 'rgba(59,130,246,0.15)',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    bgGradient: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.18) 0%, transparent 70%)',
  },
  {
    id: 'daily-challenge',
    target: 'dashboard-stats',
    title: 'Daily Challenges ⚡',
    description: 'Complete a new challenge every day and earn bonus points. Challenges keep your brain sharp and your streak alive!',
    emoji: '⚡',
    illustration: '🎯',
    position: 'bottom',
    accentColor: '#f59e0b',
    accentColorDim: 'rgba(245,158,11,0.15)',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    bgGradient: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.18) 0%, transparent 70%)',
  },
  {
    id: 'streak',
    target: 'streak-badge',
    title: 'Keep Your Streak 🏆',
    description: 'Log in every day to keep your streak going. The longer your streak, the bigger your rewards. Consistency is your superpower!',
    emoji: '🔥',
    illustration: '🔥',
    position: 'bottom',
    accentColor: '#f97316',
    accentColorDim: 'rgba(249,115,22,0.15)',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    bgGradient: 'radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.18) 0%, transparent 70%)',
  },
  {
    id: 'finish',
    target: '',
    title: "You're All Set! 🎉",
    description: "The adventure begins now. Explore, learn, and level up every single day. Your future self will thank you!",
    emoji: '🚀',
    illustration: '🚀',
    position: 'center',
    accentColor: '#10b981',
    accentColorDim: 'rgba(16,185,129,0.15)',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    bgGradient: 'radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.20) 0%, transparent 70%)',
  },
];

// ─── Persistence helpers ──────────────────────────────────────────────────────
const LS_DONE = 'se_tour_done';
const LS_USER = 'se_tour_user';

export function hasCompletedOnboardingLocally(userId: string): boolean {
  try {
    return localStorage.getItem(LS_DONE) === '1' && localStorage.getItem(LS_USER) === userId;
  } catch { return false; }
}

function saveLocalCompletion(userId: string): void {
  try {
    localStorage.setItem(LS_DONE, '1');
    localStorage.setItem(LS_USER, userId);
  } catch { /* ignore */ }
}

// ─── Detect mobile ────────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isMobile;
}

// ─── Desktop Spotlight Overlay ────────────────────────────────────────────────
function DesktopOverlay({
  targetRect, accentColor, onBackdropClick,
}: { targetRect: DOMRect | null; accentColor: string; onBackdropClick: () => void }) {
  const PAD = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (!targetRect) {
    return (
      <div onClick={onBackdropClick} style={{
        position: 'fixed', inset: 0, zIndex: 9990,
        background: 'rgba(3,7,18,0.85)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      }} />
    );
  }

  const x = Math.round(targetRect.left - PAD);
  const y = Math.round(targetRect.top - PAD);
  const w = Math.round(targetRect.width + PAD * 2);
  const h = Math.round(targetRect.height + PAD * 2);

  return (
    <>
      <svg onClick={onBackdropClick} style={{
        position: 'fixed', inset: 0, width: vw, height: vh,
        zIndex: 9990, overflow: 'hidden', cursor: 'default',
      }}>
        <defs>
          <mask id="tour-mask">
            <rect width={vw} height={vh} fill="white" />
            <rect x={x} y={y} width={w} height={h} rx={14} ry={14} fill="black" />
          </mask>
        </defs>
        <rect width={vw} height={vh} fill="rgba(3,7,18,0.84)" mask="url(#tour-mask)" />
      </svg>
      <div style={{
        position: 'fixed', left: x, top: y, width: w, height: h,
        borderRadius: 14, zIndex: 9991, pointerEvents: 'none',
        border: `2px solid ${accentColor}`,
        boxShadow: `0 0 0 4px ${accentColor}20, 0 0 28px ${accentColor}60, 0 0 60px ${accentColor}25`,
        animation: 'tourRingPulse 2s ease-in-out infinite',
      }} />
    </>
  );
}

// ─── Mobile Full-Screen Tour Modal ────────────────────────────────────────────
function MobileTourModal({
  step, stepIndex, totalSteps, onNext, onSkip, isLast, visible,
}: {
  step: TourStep; stepIndex: number; totalSteps: number;
  onNext: () => void; onSkip: () => void; isLast: boolean; visible: boolean;
}) {
  return (
    <>
      {/* Full screen backdrop — light blur so dashboard is faintly visible */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9990,
        background: 'rgba(3,7,18,0.78)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        transition: 'opacity 0.3s ease',
        opacity: visible ? 1 : 0,
      }} />

      {/* Modal container — slides up from bottom */}
      <div style={{
        position: 'fixed',
        left: 0, right: 0, bottom: 0,
        zIndex: 9999,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.45s cubic-bezier(0.34, 1.20, 0.64, 1)',
      }}>
        <div style={{
          margin: '0 10px',
          marginBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
          borderRadius: 28,
          overflow: 'hidden',
          /* The card itself */
          background: 'linear-gradient(175deg, rgba(14,11,36,0.98) 0%, rgba(9,7,25,0.99) 100%)',
          border: `1.5px solid ${step.accentColor}35`,
          boxShadow: `
            0 -4px 0 0 ${step.accentColor},
            0 0 60px ${step.accentColor}30,
            0 24px 80px rgba(0,0,0,0.9)
          `,
          position: 'relative',
        }}>

          {/* Coloured top stripe */}
          <div style={{
            height: 4, width: '100%',
            background: step.gradient,
          }} />

          {/* Per-step bg tint */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: step.bgGradient, opacity: 0.6,
          }} />

          <div style={{ position: 'relative', padding: '20px 20px 24px' }}>

            {/* Top row: illustration + step counter + skip */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>

              {/* Left: big emoji badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16, fontSize: 26,
                  background: step.accentColorDim,
                  border: `1.5px solid ${step.accentColor}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 20px ${step.accentColor}30, inset 0 1px 0 rgba(255,255,255,0.08)`,
                  flexShrink: 0,
                }}>
                  {step.illustration}
                </div>

                <div>
                  {/* Step label */}
                  <div style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: step.accentColor,
                    marginBottom: 5,
                  }}>
                    Step {stepIndex + 1} of {totalSteps}
                  </div>
                  {/* Progress bar */}
                  <div style={{
                    width: 90, height: 4, borderRadius: 9999,
                    background: 'rgba(255,255,255,0.08)', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 9999,
                      background: step.gradient,
                      width: `${((stepIndex + 1) / totalSteps) * 100}%`,
                      transition: 'width 0.5s cubic-bezier(0.34,1.2,0.64,1)',
                      boxShadow: `0 0 8px ${step.accentColor}80`,
                    }} />
                  </div>
                </div>
              </div>

              {/* Skip button */}
              <button
                onClick={onSkip}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 50, cursor: 'pointer',
                  fontSize: 12, fontWeight: 600,
                  color: 'rgba(148,163,184,0.75)',
                  padding: '7px 16px',
                  WebkitTapHighlightColor: 'transparent',
                  flexShrink: 0,
                }}
                onTouchStart={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(148,163,184,1)'; }}
                onTouchEnd={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(148,163,184,0.75)'; }}
              >
                Skip
              </button>
            </div>

            {/* Title */}
            <h2 style={{
              margin: '0 0 10px', fontSize: 23, fontWeight: 800,
              color: '#f8fafc', lineHeight: 1.2,
              fontFamily: "'Syne', system-ui, sans-serif",
              letterSpacing: '-0.02em',
            }}>
              {step.title}
            </h2>

            {/* Description */}
            <p style={{
              margin: '0 0 22px', fontSize: 14.5,
              color: 'rgba(148,163,184,0.88)', lineHeight: 1.65,
            }}>
              {step.description}
            </p>

            {/* Bottom row: dots + CTA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>

              {/* Progress dots */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div key={i} style={{
                    height: 6, borderRadius: 9999,
                    width: i === stepIndex ? 24 : 6,
                    background: i === stepIndex
                      ? step.accentColor
                      : i < stepIndex
                      ? `${step.accentColor}55`
                      : 'rgba(255,255,255,0.12)',
                    transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                    boxShadow: i === stepIndex ? `0 0 6px ${step.accentColor}` : 'none',
                  }} />
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={onNext}
                style={{
                  background: step.gradient,
                  color: '#fff', border: 'none',
                  borderRadius: 16, padding: '15px 0',
                  fontSize: 15, fontWeight: 800,
                  cursor: 'pointer', letterSpacing: '0.01em',
                  flex: 1, maxWidth: 190,
                  boxShadow: `0 6px 24px ${step.accentColor}55, inset 0 1px 0 rgba(255,255,255,0.18)`,
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onTouchStart={e => {
                  e.currentTarget.style.transform = 'scale(0.96)';
                  e.currentTarget.style.boxShadow = `0 2px 12px ${step.accentColor}40`;
                }}
                onTouchEnd={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = `0 6px 24px ${step.accentColor}55, inset 0 1px 0 rgba(255,255,255,0.18)`;
                }}
              >
                {isLast ? '🚀 Start Learning' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Desktop Tooltip Card ─────────────────────────────────────────────────────
function DesktopCard({
  step, stepIndex, totalSteps, targetRect, onNext, onSkip, isLast,
}: {
  step: TourStep; stepIndex: number; totalSteps: number;
  targetRect: DOMRect | null; onNext: () => void; onSkip: () => void; isLast: boolean;
}) {
  const CARD_W = 360, APPROX_H = 245, GAP = 18, EDGE = 14;

  function getStyle(): React.CSSProperties {
    if (step.position === 'center' || !targetRect) {
      return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: CARD_W, zIndex: 9999 };
    }
    const vw = window.innerWidth, vh = window.innerHeight;
    let top: number, left: number;
    if (step.position === 'bottom') {
      top = targetRect.bottom + GAP;
      left = targetRect.left + targetRect.width / 2 - CARD_W / 2;
    } else {
      top = targetRect.top - APPROX_H - GAP;
      left = targetRect.left + targetRect.width / 2 - CARD_W / 2;
    }
    left = Math.max(EDGE, Math.min(left, vw - CARD_W - EDGE));
    top = Math.max(EDGE, Math.min(top, vh - APPROX_H - EDGE));
    return { position: 'fixed', top, left, width: CARD_W, zIndex: 9999 };
  }

  return (
    <div style={{ ...getStyle(), animation: 'tourCardIn 0.44s cubic-bezier(0.34,1.56,0.64,1) both' }}>
      {/* Arrow */}
      {targetRect && step.position !== 'center' && (
        <div style={{
          position: 'absolute', left: '50%', marginLeft: -7,
          width: 14, height: 14,
          background: 'rgba(12,10,35,0.99)',
          border: `1.5px solid ${step.accentColor}35`,
          transform: 'rotate(45deg)', zIndex: 1,
          ...(step.position === 'bottom'
            ? { top: -7, borderRight: 'none', borderBottom: 'none' }
            : { bottom: -7, borderLeft: 'none', borderTop: 'none' }),
        }} />
      )}
      <div style={{
        background: 'linear-gradient(145deg, rgba(10,8,28,0.99) 0%, rgba(15,10,36,0.99) 100%)',
        border: `1.5px solid ${step.accentColor}35`,
        borderRadius: 22, padding: '22px 24px 20px',
        boxShadow: `0 32px 64px rgba(0,0,0,0.75), 0 0 0 1px ${step.accentColor}0d, 0 0 60px ${step.accentColor}18`,
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${step.accentColor}, transparent)` }} />
        <div style={{ position: 'absolute', inset: 0, background: step.bgGradient, opacity: 0.5, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, width: 80, pointerEvents: 'none', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)', transform: 'skewX(-12deg)', animation: 'tourShine 3.5s ease-in-out 0.6s infinite' }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, fontSize: 21, background: step.accentColorDim, border: `1.5px solid ${step.accentColor}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${step.accentColor}25` }}>
                {step.emoji}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: step.accentColor, marginBottom: 4 }}>
                  Step {stepIndex + 1} of {totalSteps}
                </div>
                <div style={{ width: 72, height: 3, borderRadius: 9999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%`, height: '100%', borderRadius: 9999, background: step.gradient, transition: 'width 0.4s ease' }} />
                </div>
              </div>
            </div>
            <button onClick={onSkip} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9999, cursor: 'pointer', fontSize: 11, color: 'rgba(148,163,184,0.6)', padding: '5px 12px', fontWeight: 500 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = 'rgba(148,163,184,0.95)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(148,163,184,0.6)'; }}>
              Skip tour
            </button>
          </div>
          <h3 style={{ margin: '0 0 9px', fontSize: 18, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.25, fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: '-0.01em' }}>
            {step.title}
          </h3>
          <p style={{ margin: '0 0 20px', fontSize: 13.5, color: 'rgba(148,163,184,0.88)', lineHeight: 1.65 }}>
            {step.description}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} style={{ height: 6, borderRadius: 9999, width: i === stepIndex ? 24 : 6, background: i === stepIndex ? step.accentColor : i < stepIndex ? `${step.accentColor}45` : 'rgba(148,163,184,0.15)', transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)' }} />
              ))}
            </div>
            <button onClick={onNext}
              style={{ background: step.gradient, color: '#fff', border: 'none', borderRadius: 14, padding: '11px 22px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.01em', boxShadow: `0 4px 20px ${step.accentColor}45`, transition: 'all 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)'; e.currentTarget.style.boxShadow = `0 10px 32px ${step.accentColor}65`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 20px ${step.accentColor}45`; }}>
              {isLast ? '🚀 Start Learning' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function OnboardingTour({ onComplete }: { onComplete: () => void }) {
  const { userName, userId } = useApp();
  const isMobile = useIsMobile();

  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [visible, setVisible] = useState(false);

  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  const displayStep: TourStep = {
    ...step,
    title: step.title === '__USERNAME__'
      ? `Welcome, ${userName || 'Explorer'}! 👋`
      : step.title,
  };

  // Measure target element for desktop spotlight
  const measureTarget = useCallback(() => {
    if (!step.target || isMobile) { setTargetRect(null); return; }
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) { setTargetRect(null); return; }
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => setTargetRect(el.getBoundingClientRect()), 350);
  }, [step.target, isMobile]);

  // Mount — show after brief delay so dashboard renders first
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    measureTarget();
    window.addEventListener('resize', measureTarget);
    return () => window.removeEventListener('resize', measureTarget);
  }, [measureTarget]);

  const finish = useCallback(() => {
    saveLocalCompletion(userId);
    completeOnboarding().catch(() => {});
    setVisible(false);
    setTimeout(() => onComplete(), 400);
  }, [userId, onComplete]);

  const handleNext = useCallback(() => {
    if (isLast) { finish(); return; }
    // Animate out, switch step, animate in
    setVisible(false);
    setTimeout(() => {
      setStepIndex(i => i + 1);
      setTimeout(() => setVisible(true), 60);
    }, 200);
  }, [isLast, finish]);

  return (
    <>
      <style>{`
        @keyframes tourCardIn {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes tourRingPulse {
          0%,100% { box-shadow: 0 0 0 3px ${step.accentColor}20, 0 0 22px ${step.accentColor}55; }
          50%      { box-shadow: 0 0 0 7px ${step.accentColor}32, 0 0 44px ${step.accentColor}70; }
        }
        @keyframes tourShine {
          0%   { left: -100px; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { left: calc(100% + 100px); opacity: 0; }
        }
      `}</style>

      {/* ── Mobile full-screen modal ─────────────────────── */}
      {isMobile && (
        <MobileTourModal
          step={displayStep}
          stepIndex={stepIndex}
          totalSteps={TOUR_STEPS.length}
          onNext={handleNext}
          onSkip={finish}
          isLast={isLast}
          visible={visible}
        />
      )}

      {/* ── Desktop spotlight + tooltip ──────────────────── */}
      {!isMobile && (
        <>
          <DesktopOverlay
            targetRect={targetRect}
            accentColor={step.accentColor}
            onBackdropClick={finish}
          />
          {visible && (
            <DesktopCard
              step={displayStep}
              stepIndex={stepIndex}
              totalSteps={TOUR_STEPS.length}
              targetRect={targetRect}
              onNext={handleNext}
              onSkip={finish}
              isLast={isLast}
            />
          )}
        </>
      )}
    </>
  );
}