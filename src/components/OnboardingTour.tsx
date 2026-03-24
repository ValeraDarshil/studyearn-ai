/**
 * OnboardingTour — New User Welcome Tour
 * Mobile-first, fully responsive, premium design.
 *
 * On mobile  → bottom sheet that slides up (full width, safe area aware)
 * On desktop → floating tooltip card anchored to highlighted element
 *
 * Persistence:
 *   1. DB  user.onboardingCompleted (cross-device, permanent)
 *   2. localStorage se_tour_done    (instant, no-flicker on refresh)
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { useApp } from "../context/AppContext";
import { completeOnboarding } from "../utils/user-api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  emoji: string;
  position: "top" | "bottom" | "center";
  accentColor: string;
  gradient: string;
}

// ─── Steps ───────────────────────────────────────────────────────────────────
const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    target: "dashboard-welcome",
    title: "__USERNAME__",
    description:
      "This is your command center. Track your progress, points, streak, and everything you've achieved — all in one place.",
    emoji: "👋",
    position: "bottom",
    accentColor: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
  },
  {
    id: "ai-chat",
    target: "quick-actions",
    title: "Ask AI Anything 🧠",
    description:
      "Stuck on a problem? Use Ask AI to get instant answers, solve doubts, and learn faster than ever — like a genius tutor 24/7!",
    emoji: "🤖",
    position: "top",
    accentColor: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  },
  {
    id: "daily-challenge",
    target: "dashboard-stats",
    title: "Daily Challenges ⚡",
    description:
      "Complete a new challenge every day and earn bonus points. Challenges keep your brain sharp and your streak alive!",
    emoji: "🔥",
    position: "bottom",
    accentColor: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
  },
  {
    id: "streak",
    target: "streak-badge",
    title: "Keep Your Streak 🏆",
    description:
      "Log in every day to keep your streak going. The longer your streak, the bigger your rewards. Consistency is your superpower!",
    emoji: "🔥",
    position: "bottom",
    accentColor: "#f97316",
    gradient: "linear-gradient(135deg, #f97316, #ea580c)",
  },
  {
    id: "finish",
    target: "",
    title: "You're All Set! 🎉",
    description:
      "The adventure begins now. Explore, learn, and level up every single day. Your future self will thank you!",
    emoji: "🚀",
    position: "center",
    accentColor: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
  },
];

// ─── Persistence helpers ──────────────────────────────────────────────────────
const LS_DONE = "se_tour_done";
const LS_USER = "se_tour_user";

export function hasCompletedOnboardingLocally(userId: string): boolean {
  try {
    return (
      localStorage.getItem(LS_DONE) === "1" &&
      localStorage.getItem(LS_USER) === userId
    );
  } catch {
    return false;
  }
}

function saveLocalCompletion(userId: string): void {
  try {
    localStorage.setItem(LS_DONE, "1");
    localStorage.setItem(LS_USER, userId);
  } catch {
    /* ignore */
  }
}

// ─── Hook: detect mobile ──────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return isMobile;
}

// ─── Spotlight Overlay ────────────────────────────────────────────────────────
function SpotlightOverlay({
  targetRect,
  accentColor,
  isMobile,
  onBackdropClick,
}: {
  targetRect: DOMRect | null;
  accentColor: string;
  isMobile: boolean;
  onBackdropClick: () => void;
}) {
  const PAD = isMobile ? 8 : 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // On mobile — just a solid dim, no spotlight cutout (element may be hidden behind sheet)
  if (isMobile || !targetRect) {
    return (
      <div
        onClick={onBackdropClick}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9990,
          background: "rgba(3,7,18,0.90)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />
    );
  }

  const x = Math.round(targetRect.left - PAD);
  const y = Math.round(targetRect.top - PAD);
  const w = Math.round(targetRect.width + PAD * 2);
  const h = Math.round(targetRect.height + PAD * 2);

  return (
    <>
      {/* Dark overlay with cutout */}
      <svg
        onClick={onBackdropClick}
        style={{
          position: "fixed",
          inset: 0,
          width: vw,
          height: vh,
          zIndex: 9990,
          overflow: "hidden",
          cursor: "default",
        }}
      >
        <defs>
          <mask id="tour-mask">
            <rect width={vw} height={vh} fill="white" />
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={14}
              ry={14}
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width={vw}
          height={vh}
          fill="rgba(3,7,18,0.84)"
          mask="url(#tour-mask)"
        />
      </svg>

      {/* Glowing ring */}
      <div
        style={{
          position: "fixed",
          left: x,
          top: y,
          width: w,
          height: h,
          borderRadius: 14,
          zIndex: 9991,
          pointerEvents: "none",
          border: `2px solid ${accentColor}`,
          boxShadow: `0 0 0 3px ${accentColor}20, 0 0 24px ${accentColor}60, 0 0 52px ${accentColor}30`,
          animation: "tourRingPulse 2s ease-in-out infinite",
        }}
      />
    </>
  );
}

// ─── Mobile Bottom Sheet ──────────────────────────────────────────────────────
function MobileSheet({
  step,
  stepIndex,
  totalSteps,
  onNext,
  onSkip,
  isLast,
  show,
}: {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
  isLast: boolean;
  show: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        // Slide up from bottom
        transform: show ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.42s cubic-bezier(0.34, 1.26, 0.64, 1)",
        // Safe area for phones with home indicator
        paddingBottom: "env(safe-area-inset-bottom, 16px)",
      }}
    >
      {/* Sheet card */}
      <div
        style={{
          background:
            "linear-gradient(170deg, rgba(12,10,35,0.99) 0%, rgba(8,6,24,0.99) 100%)",
          borderRadius: "28px 28px 0 0",
          border: "1.5px solid rgba(255,255,255,0.08)",
          borderBottom: "none",
          boxShadow: `0 -20px 60px rgba(0,0,0,0.7), 0 -1px 0 ${step.accentColor}30`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Top accent glow line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${step.accentColor} 50%, transparent 100%)`,
            opacity: 0.9,
          }}
        />

        {/* Drag handle pill */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 14,
            paddingBottom: 4,
          }}
        >
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 9999,
              background: "rgba(255,255,255,0.12)",
            }}
          />
        </div>

        <div style={{ padding: "12px 24px 24px" }}>
          {/* Step badge row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            {/* Left: emoji + step label */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Emoji circle */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  fontSize: 22,
                  background: `${step.accentColor}18`,
                  border: `1.5px solid ${step.accentColor}35`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 16px ${step.accentColor}25`,
                }}
              >
                {step.emoji}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: step.accentColor,
                    marginBottom: 2,
                  }}
                >
                  Step {stepIndex + 1} of {totalSteps}
                </div>
                {/* Mini progress bar under label */}
                <div
                  style={{
                    width: 80,
                    height: 3,
                    borderRadius: 9999,
                    background: "rgba(255,255,255,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${((stepIndex + 1) / totalSteps) * 100}%`,
                      height: "100%",
                      borderRadius: 9999,
                      background: step.accentColor,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Skip */}
            <button
              onClick={onSkip}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 9999,
                cursor: "pointer",
                fontSize: 12,
                color: "rgba(148,163,184,0.7)",
                padding: "6px 14px",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
            >
              Skip
            </button>
          </div>

          {/* Title */}
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: 22,
              fontWeight: 800,
              color: "#f1f5f9",
              lineHeight: 1.25,
              fontFamily: "'Syne', system-ui, sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            {step.title}
          </h2>

          {/* Description */}
          <p
            style={{
              margin: "0 0 24px",
              fontSize: 14.5,
              color: "rgba(148,163,184,0.85)",
              lineHeight: 1.65,
            }}
          >
            {step.description}
          </p>

          {/* Dot indicators + CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Dots */}
            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 7,
                    borderRadius: 9999,
                    width: i === stepIndex ? 26 : 7,
                    background:
                      i === stepIndex
                        ? step.accentColor
                        : i < stepIndex
                          ? `${step.accentColor}50`
                          : "rgba(148,163,184,0.15)",
                    transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                />
              ))}
            </div>

            {/* CTA button — full-width feel on narrow screens */}
            <button
              onClick={onNext}
              style={{
                background: step.gradient,
                color: "#fff",
                border: "none",
                borderRadius: 16,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.01em",
                boxShadow: `0 6px 24px ${step.accentColor}50`,
                transition: "all 0.2s ease",
                minWidth: 140,
                // Tap highlight off
                WebkitTapHighlightColor: "transparent",
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = "scale(0.96)";
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {isLast ? "🚀 Start Learning" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Desktop Tooltip Card ─────────────────────────────────────────────────────
function DesktopCard({
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
  const CARD_W = 360;
  const APPROX_H = 240;
  const GAP = 18;
  const EDGE = 14;

  function getStyle(): React.CSSProperties {
    if (step.position === "center" || !targetRect) {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: CARD_W,
        zIndex: 9999,
      };
    }
    const vw = window.innerWidth,
      vh = window.innerHeight;
    let top: number, left: number;
    if (step.position === "bottom") {
      top = targetRect.bottom + GAP;
      left = targetRect.left + targetRect.width / 2 - CARD_W / 2;
    } else {
      top = targetRect.top - APPROX_H - GAP;
      left = targetRect.left + targetRect.width / 2 - CARD_W / 2;
    }
    left = Math.max(EDGE, Math.min(left, vw - CARD_W - EDGE));
    top = Math.max(EDGE, Math.min(top, vh - APPROX_H - EDGE));
    return { position: "fixed", top, left, width: CARD_W, zIndex: 9999 };
  }

  return (
    <div
      style={{
        ...getStyle(),
        animation: "tourCardIn 0.44s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
    >
      {/* Arrow pointer — only if anchored to element */}
      {targetRect && step.position !== "center" && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            marginLeft: -7,
            width: 14,
            height: 14,
            background: "rgba(12,10,35,0.99)",
            border: `1.5px solid ${step.accentColor}35`,
            transform: "rotate(45deg)",
            zIndex: 1,
            ...(step.position === "bottom"
              ? { top: -7, borderRight: "none", borderBottom: "none" }
              : { bottom: -7, borderLeft: "none", borderTop: "none" }),
          }}
        />
      )}

      <div
        style={{
          background:
            "linear-gradient(145deg, rgba(10,8,28,0.99) 0%, rgba(15,10,36,0.99) 100%)",
          border: `1.5px solid ${step.accentColor}35`,
          borderRadius: 22,
          padding: "22px 24px 20px",
          boxShadow: `
          0 32px 64px rgba(0,0,0,0.75),
          0 0 0 1px ${step.accentColor}0d,
          0 0 60px ${step.accentColor}18
        `,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Top glow bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${step.accentColor}, transparent)`,
          }}
        />

        {/* Shine sweep */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 80,
            pointerEvents: "none",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
            transform: "skewX(-12deg)",
            animation: "tourShine 3.5s ease-in-out 0.6s infinite",
          }}
        />

        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                fontSize: 20,
                background: `${step.accentColor}18`,
                border: `1.5px solid ${step.accentColor}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 16px ${step.accentColor}22`,
              }}
            >
              {step.emoji}
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: step.accentColor,
                  marginBottom: 3,
                }}
              >
                Step {stepIndex + 1} of {totalSteps}
              </div>
              {/* Mini progress bar */}
              <div
                style={{
                  width: 72,
                  height: 3,
                  borderRadius: 9999,
                  background: "rgba(255,255,255,0.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${((stepIndex + 1) / totalSteps) * 100}%`,
                    height: "100%",
                    borderRadius: 9999,
                    background: step.accentColor,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={onSkip}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 9999,
              cursor: "pointer",
              fontSize: 11,
              color: "rgba(148,163,184,0.6)",
              padding: "5px 12px",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "rgba(148,163,184,0.95)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.color = "rgba(148,163,184,0.6)";
            }}
          >
            Skip tour
          </button>
        </div>

        {/* Title */}
        <h3
          style={{
            margin: "0 0 9px",
            fontSize: 18,
            fontWeight: 800,
            color: "#f1f5f9",
            lineHeight: 1.25,
            fontFamily: "'Syne', system-ui, sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          {step.title}
        </h3>

        {/* Description */}
        <p
          style={{
            margin: "0 0 20px",
            fontSize: 13.5,
            color: "rgba(148,163,184,0.88)",
            lineHeight: 1.65,
          }}
        >
          {step.description}
        </p>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Dots */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 6,
                  borderRadius: 9999,
                  width: i === stepIndex ? 24 : 6,
                  background:
                    i === stepIndex
                      ? step.accentColor
                      : i < stepIndex
                        ? `${step.accentColor}45`
                        : "rgba(148,163,184,0.15)",
                  transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              />
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={onNext}
            style={{
              background: step.gradient,
              color: "#fff",
              border: "none",
              borderRadius: 14,
              padding: "11px 22px",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.01em",
              boxShadow: `0 4px 20px ${step.accentColor}45`,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.04)";
              e.currentTarget.style.boxShadow = `0 10px 32px ${step.accentColor}65`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = `0 4px 20px ${step.accentColor}45`;
            }}
          >
            {isLast ? "🚀 Start Learning" : "Next →"}
          </button>
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
  const [show, setShow] = useState(false); // drives slide-up / fade-in
  const stepRef = useRef(stepIndex);
  stepRef.current = stepIndex;

  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  const displayStep: TourStep = {
    ...step,
    title:
      step.title === "__USERNAME__"
        ? `Welcome, ${userName || "Explorer"}! 👋`
        : step.title,
  };

  // Measure + scroll target element into view
  const measureTarget = useCallback(() => {
    if (!step.target) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) {
      setTargetRect(null);
      return;
    }
    if (!isMobile) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    setTimeout(() => setTargetRect(el.getBoundingClientRect()), 350);
  }, [step.target, isMobile]);

  // Show on mount with small delay for dashboard to render
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Re-measure on step change + resize
  useEffect(() => {
    measureTarget();
    window.addEventListener("resize", measureTarget);
    return () => window.removeEventListener("resize", measureTarget);
  }, [measureTarget]);

  const finish = useCallback(() => {
    saveLocalCompletion(userId);
    completeOnboarding().catch(() => {});
    setShow(false);
    setTimeout(() => onComplete(), isMobile ? 380 : 250);
  }, [userId, onComplete, isMobile]);

  const handleNext = useCallback(() => {
    if (isLast) {
      finish();
      return;
    }
    // Briefly hide to re-animate card on step change
    setShow(false);
    setTimeout(() => {
      setStepIndex((i) => i + 1);
      setShow(true);
    }, 180);
  }, [isLast, finish]);

  return (
    <>
      <style>{`
        @keyframes tourCardIn {
          from { opacity:0; transform:scale(0.88) translateY(14px); }
          to   { opacity:1; transform:scale(1)    translateY(0);    }
        }
        @keyframes tourRingPulse {
          0%,100% { box-shadow:0 0 0 3px ${step.accentColor}20, 0 0 22px ${step.accentColor}50; }
          50%      { box-shadow:0 0 0 7px ${step.accentColor}30, 0 0 44px ${step.accentColor}65; }
        }
        @keyframes tourShine {
          0%   { left:-100px; opacity:0; }
          15%  { opacity:1; }
          85%  { opacity:1; }
          100% { left:calc(100% + 100px); opacity:0; }
        }
        @keyframes tourFadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
      `}</style>

      {/* Overlay */}
      <SpotlightOverlay
        targetRect={targetRect}
        accentColor={step.accentColor}
        isMobile={isMobile}
        onBackdropClick={finish}
      />

      {/* Mobile: bottom sheet */}
      {isMobile && (
        <MobileSheet
          step={displayStep}
          stepIndex={stepIndex}
          totalSteps={TOUR_STEPS.length}
          onNext={handleNext}
          onSkip={finish}
          isLast={isLast}
          show={show}
        />
      )}

      {/* Desktop: floating tooltip */}
      {!isMobile && show && (
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
  );
}
