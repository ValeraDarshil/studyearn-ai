import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// ─── Types ────────────────────────────────────────────────────────────────────
interface TourStep {
  id: string;
  target: string;          // data-tour attribute value
  title: string;
  description: string;
  emoji: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  accentColor: string;
  glowColor: string;
}

// ─── Tour Steps ───────────────────────────────────────────────────────────────
const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    target: 'dashboard-welcome',
    title: 'Welcome to your Dashboard!',
    description: 'This is your command center. Track your progress, points, streak, and everything you\'ve achieved — all in one place.',
    emoji: '👋',
    position: 'bottom',
    accentColor: '#8b5cf6',
    glowColor: 'rgba(139,92,246,0.4)',
  },
  {
    id: 'ai-chat',
    target: 'quick-actions',
    title: 'Ask AI Anything 🧠',
    description: 'Stuck on a problem? Use Ask AI to get instant explanations, solve doubts, and learn faster than ever. It\'s like having a genius tutor 24/7!',
    emoji: '🤖',
    position: 'top',
    accentColor: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.4)',
  },
  {
    id: 'daily-challenge',
    target: 'dashboard-stats',
    title: 'Daily Challenges 🔥',
    description: 'Complete a new challenge every day and earn bonus points! Challenges keep your brain sharp and your streak alive.',
    emoji: '⚡',
    position: 'bottom',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.4)',
  },
  {
    id: 'streak',
    target: 'streak-badge',
    title: 'Maintain Your Streak 🏆',
    description: 'Log in every day to keep your streak alive. The longer your streak, the bigger your rewards. Consistency is your superpower!',
    emoji: '🔥',
    position: 'bottom',
    accentColor: '#f97316',
    glowColor: 'rgba(249,115,22,0.4)',
  },
  {
    id: 'finish',
    target: '',
    title: 'You\'re All Set!',
    description: 'The adventure begins now. Explore, learn, and level up. Your future self will thank you! 🚀',
    emoji: '🎉',
    position: 'center',
    accentColor: '#10b981',
    glowColor: 'rgba(16,185,129,0.4)',
  },
];

// ─── localStorage helpers ─────────────────────────────────────────────────────
const ONBOARDING_KEY = 'studyearn_onboarding_completed';
const ONBOARDING_USER_KEY = 'studyearn_onboarding_user';

export function hasCompletedOnboarding(userId: string): boolean {
  try {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    const storedUser = localStorage.getItem(ONBOARDING_USER_KEY);
    return completed === 'true' && storedUser === userId;
  } catch {
    return false;
  }
}

export function markOnboardingComplete(userId: string): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    localStorage.setItem(ONBOARDING_USER_KEY, userId);
  } catch {
    // silently fail
  }
}

// ─── Spotlight Overlay ────────────────────────────────────────────────────────
function SpotlightOverlay({
  targetRect,
  accentColor,
}: {
  targetRect: DOMRect | null;
  accentColor: string;
}) {
  const padding = 10;

  if (!targetRect) {
    // Full-screen dim for center steps
    return (
      <div
        className="fixed inset-0 z-[9990]"
        style={{ background: 'rgba(3,7,18,0.85)', backdropFilter: 'blur(4px)' }}
      />
    );
  }

  const x = targetRect.left - padding;
  const y = targetRect.top - padding;
  const w = targetRect.width + padding * 2;
  const h = targetRect.height + padding * 2;

  return (
    <>
      {/* Dark overlay with cutout using clip-path via SVG */}
      <svg
        className="fixed inset-0 z-[9990] pointer-events-none"
        style={{ width: '100vw', height: '100vh' }}
      >
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx="16"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(3,7,18,0.82)"
          mask="url(#spotlight-mask)"
          style={{ backdropFilter: 'blur(4px)' }}
        />
      </svg>

      {/* Glow ring around highlighted element */}
      <div
        className="fixed z-[9991] pointer-events-none"
        style={{
          left: x,
          top: y,
          width: w,
          height: h,
          borderRadius: 16,
          border: `2px solid ${accentColor}`,
          boxShadow: `0 0 0 4px ${accentColor}22, 0 0 30px ${accentColor}55, 0 0 60px ${accentColor}22`,
          animation: 'tourRingPulse 2s ease-in-out infinite',
        }}
      />
    </>
  );
}

// ─── Tooltip Card ─────────────────────────────────────────────────────────────
function TooltipCard({
  step,
  stepIndex,
  totalSteps,
  targetRect,
  onNext,
  onSkip,
  isLast,
}: {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  targetRect: DOMRect | null;
  onNext: () => void;
  onSkip: () => void;
  isLast: boolean;
}) {
  const CARD_W = 340;
  const CARD_H = 220; // approximate
  const padding = 20;
  const VIEWPORT_PAD = 16;

  function computePosition(): React.CSSProperties {
    // Center step — always centered
    if (step.position === 'center' || !targetRect) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: CARD_W,
      };
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top: number;
    let left: number;

    // Try preferred position, then auto-correct if off-screen
    switch (step.position) {
      case 'bottom':
        top = targetRect.bottom + padding;
        left = targetRect.left + targetRect.width / 2 - CARD_W / 2;
        break;
      case 'top':
        top = targetRect.top - CARD_H - padding;
        left = targetRect.left + targetRect.width / 2 - CARD_W / 2;
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2 - CARD_H / 2;
        left = targetRect.right + padding;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - CARD_H / 2;
        left = targetRect.left - CARD_W - padding;
        break;
    }

    // Clamp to viewport
    left = Math.max(VIEWPORT_PAD, Math.min(left, vw - CARD_W - VIEWPORT_PAD));
    top = Math.max(VIEWPORT_PAD, Math.min(top, vh - CARD_H - VIEWPORT_PAD));

    return {
      position: 'fixed',
      top,
      left,
      width: CARD_W,
    };
  }

  const posStyle = computePosition();

  return (
    <div
      className="z-[9999]"
      style={{
        ...posStyle,
        animation: 'tourCardIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
      }}
    >
      {/* Connector arrow — only if not center */}
      {step.position !== 'center' && targetRect && (
        <div
          style={{
            position: 'absolute',
            width: 12,
            height: 12,
            background: 'rgba(15,18,40,0.98)',
            border: `1px solid ${step.accentColor}33`,
            transform: 'rotate(45deg)',
            ...(step.position === 'bottom'
              ? { top: -6, left: '50%', marginLeft: -6, borderRight: 'none', borderBottom: 'none' }
              : step.position === 'top'
              ? { bottom: -6, left: '50%', marginLeft: -6, borderLeft: 'none', borderTop: 'none' }
              : step.position === 'right'
              ? { left: -6, top: '50%', marginTop: -6, borderRight: 'none', borderTop: 'none' }
              : { right: -6, top: '50%', marginTop: -6, borderLeft: 'none', borderBottom: 'none' }),
          }}
        />
      )}

      {/* Card */}
      <div
        style={{
          background: 'linear-gradient(145deg, rgba(10,12,28,0.98) 0%, rgba(15,10,35,0.98) 100%)',
          border: `1px solid ${step.accentColor}33`,
          borderRadius: 20,
          padding: '20px 22px',
          boxShadow: `0 32px 64px rgba(0,0,0,0.7), 0 0 0 1px ${step.accentColor}11, 0 0 40px ${step.glowColor}33`,
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Shine sweep */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: 60,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
            transform: 'skewX(-15deg)',
            animation: 'tourShine 3s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${step.accentColor}, transparent)`,
            opacity: 0.8,
          }}
        />

        {/* Step counter + emoji */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `${step.accentColor}18`,
                border: `1px solid ${step.accentColor}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              {step.emoji}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: step.accentColor,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Step {stepIndex + 1} of {totalSteps}
            </div>
          </div>

          {/* Skip */}
          <button
            onClick={onSkip}
            style={{
              fontSize: 11,
              color: 'rgba(148,163,184,0.6)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 6,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(148,163,184,1)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(148,163,184,0.6)')}
          >
            Skip tour
          </button>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: 8,
            lineHeight: 1.3,
            fontFamily: "'Syne', system-ui, sans-serif",
          }}
        >
          {step.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: 13.5,
            color: 'rgba(148,163,184,0.9)',
            lineHeight: 1.6,
            marginBottom: 18,
          }}
        >
          {step.description}
        </p>

        {/* Progress dots + button */}
        <div className="flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === stepIndex ? 20 : 6,
                  height: 6,
                  borderRadius: 9999,
                  background: i === stepIndex ? step.accentColor : 'rgba(148,163,184,0.2)',
                  transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              />
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={onNext}
            style={{
              background: `linear-gradient(135deg, ${step.accentColor}, ${step.accentColor}cc)`,
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: `0 4px 20px ${step.accentColor}44`,
              transition: 'all 0.2s ease',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
              e.currentTarget.style.boxShadow = `0 8px 28px ${step.accentColor}66`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = `0 4px 20px ${step.accentColor}44`;
            }}
          >
            {isLast ? '🚀 Start Learning' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main OnboardingTour Component ────────────────────────────────────────────
interface OnboardingTourProps {
  onComplete: () => void;
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const { userName, userId } = useApp();
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  const currentStep = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  // Personalize first step with user name
  const personalizedStep = {
    ...currentStep,
    title:
      stepIndex === 0
        ? `Welcome, ${userName || 'Explorer'}! 👋`
        : currentStep.title,
  };

  // Find and observe target element rect
  const updateRect = useCallback(() => {
    if (!currentStep.target) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${currentStep.target}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      // Scroll element into view smoothly
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setTargetRect(null);
    }
  }, [currentStep.target]);

  // Keep rect updated on scroll/resize
  useEffect(() => {
    updateRect();
    const onResize = () => updateRect();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', updateRect, true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateRect]);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleNext = () => {
    if (isLast) {
      handleComplete();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleComplete = () => {
    markOnboardingComplete(userId);
    setVisible(false);
    setTimeout(() => {
      onComplete();
      navigate('/app/dashboard');
    }, 300);
  };

  const handleSkip = () => {
    markOnboardingComplete(userId);
    setVisible(false);
    setTimeout(() => onComplete(), 300);
  };

  if (!visible) return null;

  return (
    <>
      {/* Keyframe styles */}
      <style>{`
        @keyframes tourCardIn {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes tourRingPulse {
          0%,100% { box-shadow: 0 0 0 4px ${currentStep.accentColor}22, 0 0 30px ${currentStep.accentColor}44, 0 0 60px ${currentStep.accentColor}11; }
          50%      { box-shadow: 0 0 0 8px ${currentStep.accentColor}33, 0 0 50px ${currentStep.accentColor}55, 0 0 80px ${currentStep.accentColor}22; }
        }
        @keyframes tourShine {
          0%   { left: -80px;    opacity: 0; }
          20%  { opacity: 1;                 }
          80%  { opacity: 1;                 }
          100% { left: calc(100% + 80px); opacity: 0; }
        }
      `}</style>

      {/* Spotlight / overlay */}
      <SpotlightOverlay targetRect={targetRect} accentColor={currentStep.accentColor} />

      {/* Tooltip card */}
      <TooltipCard
        step={personalizedStep}
        stepIndex={stepIndex}
        totalSteps={TOUR_STEPS.length}
        targetRect={targetRect}
        onNext={handleNext}
        onSkip={handleSkip}
        isLast={isLast}
      />
    </>
  );
}