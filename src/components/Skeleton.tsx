/**
 * StudyEarn AI — Skeleton Loading Components
 * Smooth shimmer loaders for AI answer, dashboard cards, leaderboard rows
 */

// ── Base shimmer block ─────────────────────────────────────────────────────
function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-white/5 relative overflow-hidden ${className}`}
      style={{ isolation: "isolate" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
          animation: "shimmer 1.6s ease-in-out infinite",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}

// ── Inject keyframe once ──────────────────────────────────────────────────
let shimmerInjected = false;
function ensureShimmerCSS() {
  if (shimmerInjected) return;
  shimmerInjected = true;
  const style = document.createElement("style");
  style.textContent = `@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`;
  document.head.appendChild(style);
}
if (typeof window !== "undefined") ensureShimmerCSS();

// ─────────────────────────────────────────────────────────────
// AI ANSWER SKELETON — shown while AI is thinking
// ─────────────────────────────────────────────────────────────
export function AskAISkeleton({ step = "Thinking…" }: { step?: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
      {/* Header */}
      <div className="px-6 py-3 border-b border-white/5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center gap-3">
        <div className="w-4 h-4 rounded-full bg-blue-500/30 animate-pulse" />
        <Shimmer className="h-4 w-20" />
        <div className="ml-auto flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full bg-blue-400"
            style={{ animation: "pulse 1s ease-in-out infinite" }}
          />
          <span className="text-xs text-blue-400 animate-pulse">{step}</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-3">
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-[92%]" />
        <Shimmer className="h-4 w-[85%]" />
        <div className="h-2" />
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-[78%]" />
        <div className="h-2" />
        {/* Fake code block */}
        <div className="rounded-xl border border-white/5 p-4 space-y-2">
          <Shimmer className="h-3 w-[60%]" />
          <Shimmer className="h-3 w-[75%]" />
          <Shimmer className="h-3 w-[45%]" />
        </div>
        <Shimmer className="h-4 w-[88%]" />
        <Shimmer className="h-4 w-[70%]" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD STAT CARD SKELETON
// ─────────────────────────────────────────────────────────────
export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-8 w-8 rounded-xl" />
      </div>
      <Shimmer className="h-8 w-24" />
      <Shimmer className="h-3 w-32" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LEADERBOARD ROW SKELETON
// ─────────────────────────────────────────────────────────────
export function LeaderboardRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
      <Shimmer className="h-6 w-6 rounded-lg flex-shrink-0" />
      <Shimmer className="h-9 w-9 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-4 w-32" />
        <Shimmer className="h-3 w-20" />
      </div>
      <Shimmer className="h-6 w-16 rounded-full" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ACTIVITY FEED SKELETON
// ─────────────────────────────────────────────────────────────
export function ActivitySkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/5">
          <Shimmer className="h-8 w-8 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-3 w-40" />
            <Shimmer className="h-3 w-24" />
          </div>
          <Shimmer className="h-5 w-14 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PPT SLIDE PREVIEW SKELETON
// ─────────────────────────────────────────────────────────────
export function PPTSlideSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-2 aspect-video flex flex-col justify-between">
          <Shimmer className="h-3 w-3/4" />
          <div className="space-y-1.5 flex-1 py-1">
            <Shimmer className="h-2 w-full" />
            <Shimmer className="h-2 w-5/6" />
            <Shimmer className="h-2 w-4/6" />
          </div>
          <Shimmer className="h-2 w-1/3" />
        </div>
      ))}
    </div>
  );
}