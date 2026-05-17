/**
 * OnboardingTour — Premium New User Welcome Tour  (v2)
 *
 * FIXES (v2):
 *   1. Step 5 (finish) was rendering off-center on desktop because
 *      the previous step's targetRect was still stored in state.
 *      Fix: pos() now checks step.position === 'center' FIRST,
 *      before touching targetRect. Also setTarget(null) is called
 *      immediately when target is '' (finish step).
 *
 *   2. Step transitions were abrupt — card disappeared and reappeared
 *      with no animation. Fix: added a dedicated `transitioning` state.
 *      On Next click:
 *        a) card slides out (translateY + fade, 220ms)
 *        b) content swaps (idx updates)
 *        c) card slides in from opposite direction (translateY + fade, 280ms)
 *      The slide direction alternates: even→odd slides left, odd→even slides right,
 *      giving a clean page-flip feel between steps.
 *
 * Mobile  → Bottom sheet card with large illustration, premium glassmorphism
 * Desktop → Spotlight cutout + anchored tooltip card
 *
 * Sequence: Tour → Streak celebration → Achievement toasts (never overlap)
 *
 * Persistence:
 *   1. DB   user.onboardingCompleted  (cross-device, permanent)
 *   2. localStorage se_tour_done      (instant, no flicker on refresh)
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { completeOnboarding } from '../utils/user-api';

interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  accentDim: string;
  gradient: string;
  bgGlow: string;
  position: 'top' | 'bottom' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    target: 'dashboard-welcome',
    title: '__USERNAME__',
    description: "This is your command center. Track your progress, points, streak, and everything you've achieved — all in one place.",
    icon: '🏠',
    position: 'bottom',
    accentColor: '#a78bfa',
    accentDim: 'rgba(167,139,250,0.14)',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    bgGlow: 'rgba(139,92,246,0.22)',
  },
  {
    id: 'ai-chat',
    target: 'quick-actions',
    title: 'Ask AI Anything 🧠',
    description: "Stuck on a problem? Use Ask AI to get instant answers, solve doubts, and learn faster than ever — like a genius tutor available 24/7!",
    icon: '🤖',
    position: 'top',
    accentColor: '#60a5fa',
    accentDim: 'rgba(96,165,250,0.14)',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    bgGlow: 'rgba(59,130,246,0.22)',
  },
  {
    id: 'daily-challenge',
    target: 'dashboard-stats',
    title: 'Daily Challenges ⚡',
    description: 'Complete a new challenge every day and earn bonus points. Challenges keep your brain sharp and your streak alive!',
    icon: '🎯',
    position: 'bottom',
    accentColor: '#fbbf24',
    accentDim: 'rgba(251,191,36,0.14)',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    bgGlow: 'rgba(245,158,11,0.22)',
  },
  {
    id: 'streak',
    target: 'streak-badge',
    title: 'Keep Your Streak 🏆',
    description: 'Log in every single day to keep your streak alive. The longer your streak, the bigger your rewards. Consistency is your superpower!',
    icon: '🔥',
    position: 'bottom',
    accentColor: '#fb923c',
    accentDim: 'rgba(251,146,60,0.14)',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    bgGlow: 'rgba(249,115,22,0.22)',
  },
  {
    id: 'finish',
    target: '',
    title: "You're All Set! 🎉",
    description: "The adventure begins now. Explore every feature, learn something new every day, and level up. Your future self will thank you!",
    icon: '🚀',
    position: 'center',
    accentColor: '#34d399',
    accentDim: 'rgba(52,211,153,0.14)',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    bgGlow: 'rgba(16,185,129,0.22)',
  },
];

// ─── Persistence ───────────────────────────────────────────────────────────────
const LS_DONE = 'se_tour_done';
const LS_USER = 'se_tour_user';

export function hasCompletedOnboardingLocally(userId: string): boolean {
  try { return localStorage.getItem(LS_DONE) === '1' && localStorage.getItem(LS_USER) === userId; }
  catch { return false; }
}
function saveLocalCompletion(userId: string) {
  try { localStorage.setItem(LS_DONE, '1'); localStorage.setItem(LS_USER, userId); }
  catch { /* ignore */ }
}

// ─── Mobile detect ─────────────────────────────────────────────────────────────
function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return m;
}

// ─── Desktop overlay with spotlight cutout ─────────────────────────────────────
function DesktopOverlay({ targetRect, accentColor, onClose }: {
  targetRect: DOMRect | null; accentColor: string; onClose: () => void;
}) {
  const vw = window.innerWidth, vh = window.innerHeight;
  const PAD = 12;
  if (!targetRect) {
    return <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9990, background: 'rgba(3,7,18,0.85)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }} />;
  }
  const x = Math.round(targetRect.left - PAD), y = Math.round(targetRect.top - PAD);
  const w = Math.round(targetRect.width + PAD * 2), h = Math.round(targetRect.height + PAD * 2);
  return (
    <>
      <svg onClick={onClose} style={{ position: 'fixed', inset: 0, width: vw, height: vh, zIndex: 9990, overflow: 'hidden', cursor: 'default' }}>
        <defs><mask id="tour-mask"><rect width={vw} height={vh} fill="white" /><rect x={x} y={y} width={w} height={h} rx={14} ry={14} fill="black" /></mask></defs>
        <rect width={vw} height={vh} fill="rgba(3,7,18,0.84)" mask="url(#tour-mask)" />
      </svg>
      <div style={{ position: 'fixed', left: x, top: y, width: w, height: h, borderRadius: 14, zIndex: 9991, pointerEvents: 'none', border: `2px solid ${accentColor}`, boxShadow: `0 0 0 4px ${accentColor}25, 0 0 32px ${accentColor}60`, animation: 'tourRingPulse 2s ease-in-out infinite' }} />
    </>
  );
}

// ─── MOBILE TOUR CARD ──────────────────────────────────────────────────────────
function MobileCard({ step, stepIndex, total, onNext, onSkip, isLast, phase }: {
  step: TourStep; stepIndex: number; total: number;
  onNext: () => void; onSkip: () => void; isLast: boolean;
  // phase: 'in' | 'out' controls the slide animation
  phase: 'in' | 'idle' | 'out';
}) {
  const slideY = phase === 'out' ? '110%' : phase === 'in' ? '0%' : '0%';
  const opacity = phase === 'out' ? 0 : 1;

  return (
    <>
      {/* Backdrop */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9990,
        background: 'rgba(2,5,15,0.80)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        opacity: phase === 'out' ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }} />

      {/* Ambient glow */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: '55%',
        zIndex: 9991, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 100%, ${step.bgGlow} 0%, transparent 70%)`,
        opacity: phase === 'out' ? 0 : 1,
        transition: 'opacity 0.5s ease, background 0.4s ease',
      }} />

      {/* Card wrapper */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0,
        zIndex: 9999,
        transform: `translateY(${slideY})`,
        opacity,
        transition: phase === 'in'
          ? 'transform 0.48s cubic-bezier(0.32,1.18,0.64,1), opacity 0.3s ease'
          : 'transform 0.28s cubic-bezier(0.4,0,1,1), opacity 0.22s ease',
      }}>
        <div style={{
          margin: '0 8px',
          marginBottom: 'max(10px, env(safe-area-inset-bottom, 10px))',
          borderRadius: 32, padding: 2,
          background: `linear-gradient(170deg, ${step.accentColor}60, transparent 60%)`,
        }}>
          <div style={{
            borderRadius: 30, overflow: 'hidden',
            background: 'linear-gradient(175deg, rgba(16,12,40,0.98) 0%, rgba(8,6,22,0.99) 100%)',
            border: `1px solid ${step.accentColor}30`,
            boxShadow: `0 -8px 60px ${step.bgGlow}, 0 40px 80px rgba(0,0,0,0.9)`,
            position: 'relative',
          }}>
            <div style={{ height: 3, background: step.gradient, width: '100%' }} />
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 120,
              background: `radial-gradient(ellipse at 50% 0%, ${step.bgGlow} 0%, transparent 100%)`,
              pointerEvents: 'none',
            }} />

            <div style={{ padding: '18px 20px 22px', position: 'relative' }}>
              {/* TOP ROW */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{
                  width: 58, height: 58, borderRadius: 18, flexShrink: 0,
                  background: step.accentDim, border: `1.5px solid ${step.accentColor}45`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                  boxShadow: `0 0 24px ${step.bgGlow}, inset 0 1px 0 rgba(255,255,255,0.10)`,
                }}>
                  {step.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: step.accentColor, marginBottom: 7 }}>
                    Step {stepIndex + 1} of {total}
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {Array.from({ length: total }).map((_, i) => (
                      <div key={i} style={{
                        flex: 1, height: 4, borderRadius: 9999,
                        background: i <= stepIndex ? step.accentColor : 'rgba(255,255,255,0.10)',
                        boxShadow: i === stepIndex ? `0 0 8px ${step.accentColor}` : 'none',
                        transition: 'background 0.4s ease',
                      }} />
                    ))}
                  </div>
                </div>
                <button onClick={onSkip} style={{
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 50, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  color: 'rgba(148,163,184,0.80)', padding: '7px 15px', flexShrink: 0,
                  WebkitTapHighlightColor: 'transparent',
                }}>Skip</button>
              </div>

              <h2 style={{
                margin: '0 0 10px', fontSize: 24, fontWeight: 900,
                color: '#f8fafc', lineHeight: 1.18,
                fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: '-0.025em',
              }}>{step.title}</h2>

              <p style={{ margin: '0 0 22px', fontSize: 14.5, color: 'rgba(148,163,184,0.90)', lineHeight: 1.65 }}>
                {step.description}
              </p>

              {/* FOOTER */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {Array.from({ length: total }).map((_, i) => (
                    <div key={i} style={{
                      borderRadius: 9999, height: 7,
                      width: i === stepIndex ? 22 : 7,
                      background: i === stepIndex ? step.accentColor : i < stepIndex ? `${step.accentColor}55` : 'rgba(255,255,255,0.12)',
                      transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                      boxShadow: i === stepIndex ? `0 0 8px ${step.accentColor}90` : 'none',
                    }} />
                  ))}
                </div>
                <button onClick={onNext} style={{
                  flex: 1, background: step.gradient, color: '#fff', border: 'none',
                  borderRadius: 18, padding: '16px 0', fontSize: 15.5, fontWeight: 800,
                  cursor: 'pointer', letterSpacing: '0.01em',
                  boxShadow: `0 6px 28px ${step.bgGlow}, inset 0 1px 0 rgba(255,255,255,0.20)`,
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}>
                  {isLast ? '🚀 Start Learning' : 'Next →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── DESKTOP TOOLTIP CARD ──────────────────────────────────────────────────────
function DesktopCard({ step, stepIndex, total, targetRect, onNext, onSkip, isLast, slideDir }: {
  step: TourStep; stepIndex: number; total: number;
  targetRect: DOMRect | null; onNext: () => void; onSkip: () => void; isLast: boolean;
  // slideDir: 'left' | 'right' — which direction this card enters from
  slideDir: 'left' | 'right';
}) {
  const W = 370, H = 250, GAP = 18, EDGE = 14;

  function pos(): React.CSSProperties {
    // ── FIX 1: Check position === 'center' BEFORE using targetRect ──
    // Previously targetRect from previous step was still in state when
    // finish step rendered, causing it to anchor near the last spotlight.
    if (step.position === 'center' || !targetRect) {
      return {
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: W, zIndex: 9999,
      };
    }
    const vw = window.innerWidth, vh = window.innerHeight;
    let top  = step.position === 'bottom' ? targetRect.bottom + GAP : targetRect.top - H - GAP;
    let left = targetRect.left + targetRect.width / 2 - W / 2;
    left = Math.max(EDGE, Math.min(left, vw - W - EDGE));
    top  = Math.max(EDGE, Math.min(top,  vh - H - EDGE));
    return { position: 'fixed', top, left, width: W, zIndex: 9999 };
  }

  const posStyle = pos();
  // For center, the transform is already set. For anchored cards, add entrance animation.
  const isCentered = step.position === 'center' || !targetRect;

  return (
    <div style={{
      ...posStyle,
      // Override transform for centered card — entrance handled by keyframe
      transform: isCentered ? undefined : posStyle.transform,
      animation: isCentered
        ? 'tourCenterIn 0.42s cubic-bezier(0.34,1.2,0.64,1) both'
        : slideDir === 'left'
          ? 'tourSlideLeft 0.38s cubic-bezier(0.34,1.2,0.64,1) both'
          : 'tourSlideRight 0.38s cubic-bezier(0.34,1.2,0.64,1) both',
    }}>
      {/* Arrow — hidden for center */}
      {!isCentered && targetRect && (
        <div style={{
          position: 'absolute', left: '50%', marginLeft: -7, width: 14, height: 14,
          background: 'rgba(10,8,28,0.99)', border: `1.5px solid ${step.accentColor}35`,
          transform: 'rotate(45deg)', zIndex: 1,
          ...(step.position === 'bottom'
            ? { top: -7, borderRight: 'none', borderBottom: 'none' }
            : { bottom: -7, borderLeft: 'none', borderTop: 'none' }),
        }} />
      )}

      <div style={{
        background: 'linear-gradient(145deg, rgba(10,8,28,0.99), rgba(15,10,36,0.99))',
        border: `1.5px solid ${step.accentColor}35`, borderRadius: 22,
        padding: '22px 24px 20px', overflow: 'hidden', position: 'relative',
        boxShadow: `0 32px 64px rgba(0,0,0,0.8), 0 0 60px ${step.bgGlow}`,
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      }}>
        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${step.accentColor}, transparent)` }} />
        {/* Inner glow */}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${step.bgGlow} 0%, transparent 65%)`, pointerEvents: 'none' }} />
        {/* Shine sweep */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, width: 80, pointerEvents: 'none', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)', transform: 'skewX(-12deg)', animation: 'tourShine 3.5s ease-in-out 0.6s infinite' }} />

        <div style={{ position: 'relative' }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, fontSize: 22, background: step.accentDim, border: `1.5px solid ${step.accentColor}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 18px ${step.bgGlow}` }}>
                {step.icon}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: step.accentColor, marginBottom: 5 }}>
                  Step {stepIndex + 1} of {total}
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: total }).map((_, i) => (
                    <div key={i} style={{ flex: 1, width: 12, height: 3, borderRadius: 9999, background: i <= stepIndex ? step.accentColor : 'rgba(255,255,255,0.10)', transition: 'background 0.4s ease' }} />
                  ))}
                </div>
              </div>
            </div>
            <button onClick={onSkip}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 50, cursor: 'pointer', fontSize: 11, color: 'rgba(148,163,184,0.65)', padding: '5px 13px', fontWeight: 500 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = '#94a3b8'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(148,163,184,0.65)'; }}>
              Skip tour
            </button>
          </div>

          <h3 style={{ margin: '0 0 9px', fontSize: 18.5, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2, fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: '-0.02em' }}>
            {step.title}
          </h3>
          <p style={{ margin: '0 0 20px', fontSize: 13.5, color: 'rgba(148,163,184,0.88)', lineHeight: 1.65 }}>
            {step.description}
          </p>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} style={{ height: 6, borderRadius: 9999, width: i === stepIndex ? 22 : 6, background: i === stepIndex ? step.accentColor : i < stepIndex ? `${step.accentColor}50` : 'rgba(255,255,255,0.12)', transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)' }} />
              ))}
            </div>
            <button onClick={onNext}
              style={{ background: step.gradient, color: '#fff', border: 'none', borderRadius: 14, padding: '11px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 22px ${step.bgGlow}`, transition: 'all 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)'; e.currentTarget.style.boxShadow = `0 10px 32px ${step.bgGlow}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 22px ${step.bgGlow}`; }}>
              {isLast ? '🚀 Start Learning' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export function OnboardingTour({ onComplete }: { onComplete: () => void }) {
  const { userName, userId } = useApp();
  const isMobile = useIsMobile();

  const [idx, setIdx]           = useState(0);
  const [targetRect, setTarget] = useState<DOMRect | null>(null);

  // ── FIX 2: Transition state machine ──
  // 'in'   = card is entering (animate in)
  // 'idle' = card fully visible
  // 'out'  = card is exiting (animate out)
  const [phase, setPhase]       = useState<'in' | 'idle' | 'out'>('in');
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left');
  const transitioning           = useRef(false);

  const step   = TOUR_STEPS[idx];
  const isLast = idx === TOUR_STEPS.length - 1;

  const display: TourStep = {
    ...step,
    title: step.title === '__USERNAME__'
      ? `Welcome, ${userName || 'Explorer'}! 👋`
      : step.title,
  };

  const measureTarget = useCallback(() => {
    // ── FIX 1: Clear targetRect immediately for center steps ──
    if (!step.target || isMobile) { setTarget(null); return; }
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) { setTarget(null); return; }
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => setTarget(el.getBoundingClientRect()), 350);
  }, [step.target, isMobile]);

  // Initial entrance
  useEffect(() => {
    const t = setTimeout(() => setPhase('idle'), 220);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    measureTarget();
    window.addEventListener('resize', measureTarget);
    return () => window.removeEventListener('resize', measureTarget);
  }, [measureTarget]);

  const finish = useCallback(() => {
    if (transitioning.current) return;
    transitioning.current = true;
    setPhase('out');
    saveLocalCompletion(userId);
    completeOnboarding().catch(() => {});
    setTimeout(() => { transitioning.current = false; onComplete(); }, 320);
  }, [userId, onComplete]);

  const next = useCallback(() => {
    if (isLast)               { finish(); return; }
    if (transitioning.current) return;
    transitioning.current = true;

    // Alternate slide direction for page-flip feel
    const dir = idx % 2 === 0 ? 'left' : 'right';

    // 1. Slide out
    setPhase('out');

    setTimeout(() => {
      // 2. Swap content
      setIdx(i => i + 1);
      setSlideDir(dir);
      // Clear targetRect immediately so center step doesn't flash in wrong pos
      setTarget(null);

      // 3. Slide in
      requestAnimationFrame(() => {
        setPhase('in');
        setTimeout(() => {
          setPhase('idle');
          transitioning.current = false;
        }, 380);
      });
    }, 240);
  }, [isLast, finish, idx]);

  return (
    <>
      <style>{`
        @keyframes tourCenterIn {
          from { opacity:0; transform:translate(-50%,-50%) scale(0.88); }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
        }
        @keyframes tourSlideLeft {
          from { opacity:0; transform:translateX(32px) scale(0.96); }
          to   { opacity:1; transform:translateX(0)    scale(1); }
        }
        @keyframes tourSlideRight {
          from { opacity:0; transform:translateX(-32px) scale(0.96); }
          to   { opacity:1; transform:translateX(0)     scale(1); }
        }
        @keyframes tourRingPulse {
          0%,100%{ box-shadow:0 0 0 4px ${step.accentColor}22,0 0 24px ${step.accentColor}55; }
          50%    { box-shadow:0 0 0 8px ${step.accentColor}33,0 0 48px ${step.accentColor}70; }
        }
        @keyframes tourShine {
          0%   { left:-100px; opacity:0; }
          15%  { opacity:1; }
          85%  { opacity:1; }
          100% { left:calc(100%+100px); opacity:0; }
        }
      `}</style>

      {isMobile ? (
        <MobileCard
          step={display} stepIndex={idx} total={TOUR_STEPS.length}
          onNext={next} onSkip={finish} isLast={isLast} phase={phase}
        />
      ) : (
        <>
          <DesktopOverlay
            targetRect={step.position === 'center' ? null : targetRect}
            accentColor={step.accentColor}
            onClose={finish}
          />
          {phase !== 'out' && (
            <DesktopCard
              step={display} stepIndex={idx} total={TOUR_STEPS.length}
              targetRect={step.position === 'center' ? null : targetRect}
              onNext={next} onSkip={finish} isLast={isLast}
              slideDir={slideDir}
            />
          )}
        </>
      )}
    </>
  );
}