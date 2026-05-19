import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Presentation, FileText, Gift, TrendingUp, Zap, ArrowRight, Clock, Lock, Trophy, X, ChevronRight, Star, CheckCircle, Play, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { API_URL } from '../utils/api';
import { ACHIEVEMENTS, RARITY_STYLES } from '../data/achievements';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { calculateLevel, getLevelTier, getLevelColor } from '../utils/level-utils';
import Lottie from 'lottie-react';
import streakAnimation from '../assets/animations/streak-fire.json';

// ─── GlitchNumber — cyberpunk digit scramble + SFX on value change ──────────
// Plays 8 frames of random digit scramble (40ms each = ~320ms total),
// with cyan/pink ghost layers offset on X-axis, plus a scan-line sweep.
// SFX: glitch stutter noise burst + rising digital beep, timed to match visuals.
// Only triggers when `value` prop changes — zero effect on static renders.

// Glitch SFX — user-provided audio, embedded as base64 (no external file needed)
const GLITCH_SFX_B64 = "data:audio/mpeg;base64,SUQzBAAAAAAKQVRYWFgAAAASAAADbWFqb3JfYnJhbmQAaXNvbQBUWFhYAAAAEwAAA21pbm9yX3ZlcnNpb24ANTEyAFRYWFgAAAAkAAADY29tcGF0aWJsZV9icmFuZHMAaXNvbWlzbzJhdmMxbXA0MQBUWFhYAAAABgAAA0h3ADEAVFhYWAAACAwAAANMdk1ldGFJbmZvAHsiZGF0YSI6eyJhZHNUZW1wbGF0ZUlkIjoiIiwiYXBwVmVyc2lvbiI6IjE3LjYuMCIsImJ1c2luZXNzQ29tcG9uZW50SWQiOiIiLCJidXNpbmVzc1RlbXBsYXRlSWQiOiIiLCJjYXBhYmlsaXR5TmFtZSI6InNvdW5kX2VmZmVjdF83MDIxMzAwOTUzNTg0MjU3MDI2IiwiY2FwYWJpbGl0eV9lZmZlY3RfaWQiOiJ7XCJzb3VuZF9lZmZlY3RcIjpcIjcwMjEzMDA5NTM1ODQyNTcwMjZcIn0iLCJjb21tZXJjaWFsX3BhcmFtcyI6e30sImRyYWZ0SW5mbyI6eyJzb3VuZElkIjoiNzAyMTMwMDk1MzU4NDI1NzAyNiIsInZpZGVvTWF0ZXJpYWxJZCI6IjcyMzQ2NzA2ODM4OTA5MTI1MTcifSwiZWRpdFNvdXJjZSI6IiIsImVkaXRUeXBlIjoiZWRpdCIsImVudGVyRnJvbSI6Im5ldyIsImV4cG9ydFR5cGUiOiJleHBvcnQiLCJleHRlbmRUZW1wbGF0ZUlkIjoiIiwiZXh0ZW5kVGVtcGxhdGVUeXBlIjowLCJmaWx0ZXJJZCI6IiIsImdyZWVuc2NyZWVuTGF5b3V0VHlwZSI6IiIsImluZm9TdGlja2VySWQiOiIiLCJsYXVuY2hNb2RlIjoibGF1bmNoIiwibGF1bmNoX2VudGVyX2Zyb20iOiJlbnRlcl9sYXVuY2giLCJsb2NrX2NudF9saXN0IjoiIiwibW92aWUzZFRleHRUZW1wbGF0ZUlkIjoiIiwib3JpZ2luYWxfdm9sdW1lIjoxMDAsIm9zIjoiYW5kcm9pZCIsInByb2R1Y3QiOiJ2aWN1dCIsInJlZ2lvbiI6IklOIiwic2xvd01vdGlvbiI6Im5vbmUiLCJzb3VyY2VfcGxhdGZvcm0iOiJtb2JpbGVfMiIsInN0aWNrZXJJZCI6IiIsInRlbXBs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MwJcamiGIVW3wFSbCPrD//vgRD4ACK5lTuZvAAERbpo/zeAAIr4LHZnMAASVQaODO4AAVthr6vzSwyym8zule9x2MrmfRNAy3LcQFEWcw64UTclvLcageA4ZcRs1teNEqNyGnxF24HL4fbhnKZh2lvQ1Ty6Uy+kno1BD+vzKWrPooAiosVONxy8avS/q8MqZpUqi0A/MxmVU1a1aqxSWXKDPWed+RyJ21duJBMAzTaMHVJBTlOa2SggLOZh29VjOERitzHVMLM//hr/+eM0VrVHJIJFA1LxcKjcbsUNIUkQSdJRYNELXKBosoIrswMIdOBGYAUEBgaVhEtTKVVCMqsAVVMWkEIFqrWLWl1V4qNpDPGgCepFZd7UE+UqgYd3IzRNabIwsv6rlkrKXCChW6rpxk7WlbYqyqUuku5iTbqYQ6u5woq9FNNw7RTkSYDDL+uzDspl0Nt0XixF3YFgKHuUEBXuRO3A8cghuDyy2KUdG8T9NedFrLluBXjT400M0ERgF2X97jGYbp3+lEq+tyXyKVOhchyUxKvUmLkGxWZlszKpdlhGrOOFLRciUXypqStDttPKfz3N0tmmqX8e5yF9XYv1aWz+WdNa7vlarKc//////////////////6iSbbkbSTSVVSyoAAC9wsejbiaAAJPnDNGgWCsBlmDB4PKxCmUqBdYWBi7TA4iAoABB0zQcdZIimJdUDMTU9Uzy6wjA/LtJpJZp9JWs+TwZcXtibjLWZmLNXkwcUCPKWIvhlK5AUl+lIrmSdVnYqyFiadih0CNBbNElDqkUdp2ZW3FgMna1DUSf1lbzVEPZbNSCJvV6LjrP9BsbfZxAgTQIFWda/OLRhpLzEAmbxT8IxFdN8qhDkhw3lTR/B83ml0CQfR/aobP8nalBN46pcaOtDMM1pl/cf5rcprfa1U136bv/up2xO81Z1e3Z//+lva7jrL8u8//+moO/////////////////9zv/////////////////WNZwIHhvNVjkMAAdOrgra8zmJolGBIFjQPAoACgCEgwQBijBgaDznLtViSjERRj4uQRFQVVlElqBEJFII6FvlVyUEON6DmL2WFX8hNT7R5UJS6etO9KphTO1B1iM1lSsLAkhSQClbk31QLOVjTAmmwP+xVdbQaKJMrU4hL/N3ctGFTaXTIAzadqELWblsU0j9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VVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UGTfh/QJKkJrKRtwAAANIAAAAQCIAwagAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAAB/gAAACAAADSAAAAEAAAH+AAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAH+AAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";
let glitchAudioCache: HTMLAudioElement | null = null;

function playGlitchSFX() {
  try {
    // Reuse cached Audio object — avoids re-decoding base64 on every trigger
    if (!glitchAudioCache) {
      glitchAudioCache = new Audio(GLITCH_SFX_B64);
      glitchAudioCache.volume = 0.6;
    }
    // Always rewind and play fresh
    glitchAudioCache.currentTime = 0;
    glitchAudioCache.play().catch(() => {
      // Autoplay blocked — silently skip
    });
  } catch {
    // Audio not supported — silently skip
  }
}

function GlitchNumber({ value, className = '' }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(value);
  const [glitching, setGlitching] = useState(false);
  const [scanActive, setScanActive] = useState(false);
  const prevRef = useRef(value);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (value === prevRef.current) return;
    prevRef.current = value;

    // Clear any running scramble
    if (frameRef.current) clearInterval(frameRef.current);

    setGlitching(true);
    setScanActive(true);

    // Fire SFX in sync with visual glitch start
    playGlitchSFX();

    let frame = 0;
    const TOTAL = 8;
    frameRef.current = setInterval(() => {
      frame++;
      if (frame < TOTAL) {
        // Random 1–2 digit number in the same visual range
        setDisplay(Math.floor(Math.random() * 9) + Math.max(1, value - 3));
      } else {
        clearInterval(frameRef.current!);
        setDisplay(value);
        setGlitching(false);
        // Scan line finishes naturally via CSS animation
        setTimeout(() => setScanActive(false), 420);
      }
    }, 40);

    return () => { if (frameRef.current) clearInterval(frameRef.current); };
  }, [value]);

  return (
    <span className={`glitch-num-wrapper ${className}`} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Scan line sweep */}
      {scanActive && (
        <span style={{
          position: 'absolute', left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg,transparent,rgba(56,189,248,0.7),transparent)',
          animation: 'glitch-scan 0.42s ease-out forwards',
          pointerEvents: 'none', zIndex: 10,
        }} />
      )}

      {/* Cyan ghost — top half */}
      {glitching && (
        <span aria-hidden style={{
          position: 'absolute', left: 0, top: 0,
          color: '#38bdf8',
          clipPath: 'polygon(0 0,100% 0,100% 40%,0 40%)',
          animation: 'glitch-top 0.32s steps(1) forwards',
          fontWeight: 'inherit', fontSize: 'inherit',
          pointerEvents: 'none',
        }}>{display}</span>
      )}

      {/* Pink ghost — bottom half */}
      {glitching && (
        <span aria-hidden style={{
          position: 'absolute', left: 0, top: 0,
          color: '#f472b6',
          clipPath: 'polygon(0 62%,100% 62%,100% 100%,0 100%)',
          animation: 'glitch-bot 0.32s steps(1) forwards',
          fontWeight: 'inherit', fontSize: 'inherit',
          pointerEvents: 'none',
        }}>{display}</span>
      )}

      {/* Real number */}
      <span style={{
        display: 'inline-block',
        animation: glitching ? 'glitch-shake 0.32s steps(1) forwards' : 'none',
        fontFamily: glitching ? "'Courier New', monospace" : 'inherit',
      }}>{display}</span>

      <style>{`
        @keyframes glitch-shake {
          0%   { transform: translate(0,0); }
          15%  { transform: translate(-3px,1px); }
          30%  { transform: translate(2px,-1px); }
          45%  { transform: translate(-2px,2px); }
          60%  { transform: translate(3px,-1px); }
          75%  { transform: translate(-1px,1px); }
          100% { transform: translate(0,0); }
        }
        @keyframes glitch-top {
          0%   { transform:translate(-4px,0); opacity:1; }
          33%  { transform:translate(4px,0);  opacity:0.8; }
          66%  { transform:translate(-2px,0); opacity:0.6; }
          100% { transform:translate(0,0);    opacity:0; }
        }
        @keyframes glitch-bot {
          0%   { transform:translate(4px,0);  opacity:1; }
          33%  { transform:translate(-4px,0); opacity:0.8; }
          66%  { transform:translate(2px,0);  opacity:0.6; }
          100% { transform:translate(0,0);    opacity:0; }
        }
        @keyframes glitch-scan {
          0%   { top:0;    opacity:0.9; }
          100% { top:100%; opacity:0; }
        }
      `}</style>
    </span>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export function Dashboard() {
  const { points, totalXP, streak, questionsLeft, setQuestionsLeft, refreshQuota, recentActivity, userName, unlockedAchievements, userStats, isPremium, premiumExpiresAt } = useApp();
  const firstName = userName ? userName.trim().split(" ")[0] : "Student";
  const navigate = useNavigate();
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [nextRefillSecs, setNextRefillSecs] = useState(0);
  const [videoAdsLeft,   setVideoAdsLeft]   = useState(5);
  const [watchingAd,     setWatchingAd]     = useState(false);
  const [adCountdown,    setAdCountdown]    = useState(0);
  const [showAdModal,    setShowAdModal]    = useState(false);
  const refillTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const levelInfo = calculateLevel(totalXP);
  const levelTier = getLevelTier(levelInfo.currentLevel);
  const levelColor = getLevelColor(levelInfo.currentLevel);
  const dailyLimit = isPremium ? 30 : 15;
  const questionsUsed = dailyLimit - questionsLeft;

  // Fetch quota on mount — gets fresh questionsLeft from server
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${API_URL}/api/ai/quota`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          if (d.questionsLeft !== undefined) setQuestionsLeft(d.questionsLeft);
          setNextRefillSecs(d.nextRefillSecs || 0);
          setVideoAdsLeft(d.videoAdsLeft ?? 5);
        }
      })
      .catch(() => {});
  }, []);  // eslint-disable-line

  // Countdown timer — auto-refresh quota when timer hits zero
  useEffect(() => {
    if (refillTimerRef.current) clearInterval(refillTimerRef.current);
    if (nextRefillSecs <= 0) return;
    refillTimerRef.current = setInterval(() => {
      setNextRefillSecs(p => {
        if (p <= 1) {
          clearInterval(refillTimerRef.current!);
          const token = localStorage.getItem('token');
          if (token) {
            fetch(`${API_URL}/api/ai/quota`, { headers: { Authorization: `Bearer ${token}` } })
              .then(r => r.json())
              .then(d => {
                if (d.success) {
                  if (d.questionsLeft !== undefined) setQuestionsLeft(d.questionsLeft);
                  setNextRefillSecs(d.nextRefillSecs || 0);
                  setVideoAdsLeft(d.videoAdsLeft ?? 5);
                }
              })
              .catch(() => {});
          }
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => { if (refillTimerRef.current) clearInterval(refillTimerRef.current); };
  }, [nextRefillSecs]);

  const fmtTime = (secs: number) => `${Math.floor(secs/60)}m ${secs%60}s`;

  const handleWatchAd = async () => {
    if (watchingAd || videoAdsLeft <= 0) return;
    setShowAdModal(true);
    setWatchingAd(true);
    setAdCountdown(15);
    const timer = setInterval(() => {
      setAdCountdown(p => { if (p <= 1) { clearInterval(timer); return 0; } return p - 1; });
    }, 1000);
    await new Promise(r => setTimeout(r, 15000));
    clearInterval(timer);
    try {
      const token = localStorage.getItem('token');
      const res  = await fetch(`${API_URL}/api/ai/watch-ad`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setVideoAdsLeft(data.videoAdsLeft ?? 0);
        setNextRefillSecs(data.nextRefillSecs || 0);
        const q = await fetch(`${API_URL}/api/ai/quota`, { headers: { Authorization: `Bearer ${token}` } });
        const qd = await q.json();
        if (qd.success) {
          if (qd.questionsLeft !== undefined) setQuestionsLeft(qd.questionsLeft);
          setNextRefillSecs(qd.nextRefillSecs || 0);
          setVideoAdsLeft(qd.videoAdsLeft ?? 0);
        }
      }
    } catch {}
    setWatchingAd(false);
    setAdCountdown(0);
    setShowAdModal(false);
  };

  const quickActions = [
    { icon: Brain, label: 'Ask AI', desc: 'Get instant answers', path: '/app/ask', gradient: 'from-blue-500 to-blue-600', glow: 'hover:shadow-blue-500/20' },
    { icon: Presentation, label: 'Generate PPT', desc: 'Create presentations', path: '/app/ppt', gradient: 'from-purple-500 to-purple-600', glow: 'hover:shadow-purple-500/20' },
    { icon: FileText, label: 'PDF Tools', desc: 'Convert documents', path: '/app/pdf', gradient: 'from-cyan-500 to-cyan-600', glow: 'hover:shadow-cyan-500/20' },
    { icon: Gift, label: 'Rewards', desc: 'View your points', path: '/app/rewards', gradient: 'from-pink-500 to-pink-600', glow: 'hover:shadow-pink-500/20' },
  ];

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getActivityIcon = (action: string) => {
    if (action.includes('ask') || action.includes('question')) return { Icon: Brain, color: 'bg-blue-500/10', iconColor: 'text-blue-400' };
    if (action.includes('ppt') || action.includes('presentation')) return { Icon: Presentation, color: 'bg-purple-500/10', iconColor: 'text-purple-400' };
    if (action.includes('pdf')) return { Icon: FileText, color: 'bg-cyan-500/10', iconColor: 'text-cyan-400' };
    return { Icon: Zap, color: 'bg-green-500/10', iconColor: 'text-green-400' };
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Welcome */}
      <div data-tour="dashboard-welcome" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome back, <span className="gradient-text">{firstName}</span> 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Ready to learn something new today?</p>
        </div>
        <div data-tour="streak-badge" className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-orange-500/20">
          <Lottie 
            animationData={streakAnimation}
            loop={true}
            style={{ width: 32, height: 32 }}
          />
          <span className="text-sm font-semibold text-orange-300">{streak} Day Streak!</span>
        </div>
      </div>

      {/* Premium Active Banner */}
      {isPremium && (
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl border border-yellow-500/30 animate-slide-up"
          style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.08), rgba(251,146,60,0.06))' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'rgba(234,179,8,0.15)' }}>⚡</div>
            <div>
              <p className="text-sm font-bold text-yellow-300">Premium Active — 2× Points on Everything!</p>
              <p className="text-xs text-yellow-400/70 mt-0.5">
                All AI, PPT, PDF actions earn double points
                {premiumExpiresAt && ` • Expires ${new Date(premiumExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
              </p>
            </div>
          </div>
          <span className="text-yellow-400 text-xs font-bold px-2 py-1 rounded-lg border border-yellow-500/30 hidden sm:block"
            style={{ background: 'rgba(234,179,8,0.1)' }}>2× XP</span>
        </div>
      )}

      {/* Stats Row */}
      <div data-tour="dashboard-stats" className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 stagger-children">
        {/* Points */}
        <div onClick={() => navigate("/app/points-history")} className="glass glass-hover card-shine rounded-2xl p-4 animate-slide-up border border-purple-500/10 hover:border-purple-500/25 hover:-translate-y-1 transition-all duration-300 group cursor-pointer" title="View Points History">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-medium">Total Points</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Gift className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            <AnimatedNumber value={points} className="count-animate" />
          </div>
          <div className="w-full h-0.5 mt-3 rounded-full bg-gradient-to-r from-purple-500/40 to-transparent" />
        </div>

        {/* Questions Today — Glitch counter card */}
        <div className="glass glass-hover card-shine rounded-2xl p-4 animate-slide-up border border-blue-500/10 hover:border-blue-500/25 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Questions Today</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer" onClick={() => navigate('/app/ask')}>
              <Brain className="w-4 h-4 text-blue-400" />
            </div>
          </div>

          {/* ── GlitchNumber replaces plain {questionsLeft} ── */}
          <div className="flex items-end gap-1 mb-2">
            <span className="text-2xl font-bold text-white">
              <GlitchNumber value={questionsLeft} />
            </span>
            <span className="text-sm text-slate-500 font-normal mb-0.5">/{dailyLimit} left</span>
            {nextRefillSecs > 0 && questionsLeft < dailyLimit && (
              <span className="ml-auto text-[10px] text-blue-300 font-medium flex items-center gap-1 mb-0.5">
                <Clock className="w-2.5 h-2.5" />+1 in {fmtTime(nextRefillSecs)}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mb-2">
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.max(0, Math.min(100, (questionsLeft / dailyLimit) * 100))}%`,
                background: questionsLeft > Math.floor(dailyLimit * 0.4)
                  ? 'linear-gradient(90deg,#3b82f6,#8b5cf6)'
                  : questionsLeft > 0
                    ? 'linear-gradient(90deg,#f59e0b,#f97316)'
                    : '#ef4444'
              }}
            />
          </div>

          {/* Bottom row */}
          <div className="flex items-center gap-2">
            {questionsLeft >= dailyLimit ? (
              <span className="text-[10px] text-green-400 flex items-center gap-1">✓ Full quota</span>
            ) : (
              <span className="text-[10px] text-slate-600">Refills every hour</span>
            )}
            {videoAdsLeft > 0 && questionsLeft < dailyLimit && (
              <button
                onClick={handleWatchAd}
                disabled={watchingAd}
                className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-green-300 border border-green-500/25 bg-green-500/10 hover:bg-green-500/20 transition-all disabled:opacity-50"
              >
                <Play className="w-2.5 h-2.5" />
                {watchingAd ? `Watching… ${adCountdown}s` : `Watch Video +1Q`}
              </button>
            )}
          </div>
        </div>

        {/* Streak — clickable */}
        <div
          className="glass card-shine rounded-2xl p-4 animate-slide-up border border-orange-500/10 hover:border-orange-500/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer group"
          onClick={() => setShowStreakCelebration(true)}
          title="🔥 Click to celebrate!"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-medium">Day Streak</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Lottie animationData={streakAnimation} loop style={{ width: 28, height: 28 }} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            <AnimatedNumber value={streak} />
          </div>
          <div className="w-full h-0.5 mt-3 rounded-full bg-gradient-to-r from-orange-500/40 to-transparent" />
        </div>

        {/* Level */}
        <div className="glass glass-hover card-shine rounded-2xl p-4 animate-slide-up border border-green-500/10 hover:border-green-500/25 hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-medium">Current Level</span>
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            <AnimatedNumber value={levelInfo.currentLevel} />
          </div>
          <div className="w-full h-0.5 mt-3 rounded-full bg-gradient-to-r from-green-500/40 to-transparent" />
        </div>
      </div>

      {/* Quick Actions */}
      <div data-tour="quick-actions">
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 stagger-children">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className={`relative glass card-shine rounded-2xl p-4 group cursor-pointer border border-white/5 hover:border-white/15 hover:-translate-y-1 hover:shadow-xl ${action.glow} transition-all duration-300 overflow-hidden animate-slide-up text-left`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                <action.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="relative text-sm md:text-base font-semibold text-white mb-0.5">{action.label}</h3>
              <p className="relative text-[11px] md:text-xs text-slate-500">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity + Achievements */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        
        {/* Recent Activity */}
        <div className="glass rounded-2xl p-4 sm:p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              <Zap className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No activity yet. Start earning points!
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity) => {
                const { Icon, color, iconColor } = getActivityIcon(activity.action);
                return (
                  <div key={activity._id} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors min-w-0 overflow-hidden">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon className={`w-4 h-4 ${iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-sm text-slate-300 truncate max-w-full">{activity.details}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{formatTime(activity.timestamp)}</p>
                    </div>
                    {activity.pointsEarned > 0 && (
                      <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs font-semibold text-yellow-400">+{activity.pointsEarned}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Achievements — compact preview card */}
        <div className="glass rounded-2xl p-4 sm:p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <h2 className="text-lg font-semibold text-white">Achievements</h2>
            </div>
            <button
              onClick={() => setShowAchievementsModal(true)}
              className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors group px-2 py-1 rounded-lg hover:bg-purple-500/10"
            >
              View All <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500">{unlockedAchievements.length} unlocked</span>
              <span className="text-slate-500">{ACHIEVEMENTS.length - unlockedAchievements.length} remaining</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700 progress-animate"
                style={{ width: `${Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {(() => {
              const statMap: Record<string, number> = {
                totalQuestionsAsked: userStats.totalQuestionsAsked,
                totalPPTsGenerated:  userStats.totalPPTsGenerated,
                totalPDFsConverted:  userStats.totalPDFsConverted,
                streak, points,
              };
              const unlocked = ACHIEVEMENTS.filter(a => unlockedAchievements.includes(a.id));
              const locked   = ACHIEVEMENTS.filter(a => !unlockedAchievements.includes(a.id));
              const sortedLocked = locked.sort((a, b) => {
                const pa = (statMap[a.stat] || 0) / a.threshold;
                const pb = (statMap[b.stat] || 0) / b.threshold;
                return pb - pa;
              });
              const preview = [
                ...unlocked.slice(-2),
                ...sortedLocked.slice(0, 2),
              ].slice(0, 4);

              return preview.map((ach, idx) => {
                const isUnlocked = unlockedAchievements.includes(ach.id);
                const styles = RARITY_STYLES[ach.rarity];
                const currentVal = statMap[ach.stat] || 0;
                const progress = Math.min(100, Math.round((currentVal / ach.threshold) * 100));
                return (
                  <div
                    key={ach.id}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all duration-200 min-w-0 overflow-hidden
                      ${isUnlocked
                        ? `bg-gradient-to-r ${styles.bg} ${styles.border}`
                        : 'bg-white/[0.01] border-white/5'}`}
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className={`text-lg flex-shrink-0 ${isUnlocked ? '' : 'grayscale opacity-40'}`}>
                      {isUnlocked ? ach.icon : <Lock className="w-3.5 h-3.5 text-slate-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-xs font-semibold truncate min-w-0 ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{ach.name}</span>
                        <span className={`text-[8px] px-1 py-0.5 rounded-full uppercase font-bold flex-shrink-0 ${styles.badge}`}>{ach.rarity}</span>
                      </div>
                      {!isUnlocked && (
                        <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600" style={{ width: `${progress}%` }} />
                        </div>
                      )}
                    </div>
                    {isUnlocked
                      ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      : <span className="text-[10px] text-slate-600 flex-shrink-0">{currentVal}/{ach.threshold}</span>
                    }
                  </div>
                );
              });
            })()}
          </div>

          <button
            onClick={() => setShowAchievementsModal(true)}
            className="mt-3 w-full py-2 rounded-xl border border-white/5 text-xs text-slate-400 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/5 transition-all flex items-center justify-center gap-2"
          >
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            See all {ACHIEVEMENTS.length} achievements
          </button>
        </div>
      </div>

      {/* ACHIEVEMENTS FULL MODAL */}
      {showAchievementsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(3,7,18,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowAchievementsModal(false); }}
        >
          <style>{`
            @keyframes modalSlideUp {
              from { opacity: 0; transform: translateY(40px) scale(0.96); }
              to   { opacity: 1; transform: translateY(0)    scale(1); }
            }
            @keyframes achCardIn {
              from { opacity: 0; transform: translateY(16px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .modal-enter  { animation: modalSlideUp 0.45s cubic-bezier(0.34,1.2,0.64,1) both; }
            .ach-card-in  { animation: achCardIn 0.35s cubic-bezier(0.34,1.2,0.64,1) both; }
          `}</style>

          <div className="modal-enter glass rounded-3xl border border-white/10 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 60px rgba(139,92,246,0.1)' }}>

            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-display">All Achievements</h2>
                  <p className="text-xs text-slate-400">
                    <span className="text-purple-400 font-semibold">{unlockedAchievements.length}</span> unlocked · <span className="text-slate-500">{ACHIEVEMENTS.length - unlockedAchievements.length} remaining</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAchievementsModal(false)}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>{Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100)}% complete</span>
                <span>{unlockedAchievements.length}/{ACHIEVEMENTS.length}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 progress-animate"
                  style={{ width: `${Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">
              {(['questions','ppt','pdf','streak','points'] as const).map(category => {
                const categoryAchs = ACHIEVEMENTS.filter(a => a.category === category);
                const categoryLabels: Record<string, string> = {
                  questions: '🧠 Questions',
                  ppt:       '📊 Presentations',
                  pdf:       '📄 PDF Tools',
                  streak:    '🔥 Streaks',
                  points:    '💰 Points',
                };
                const statMap: Record<string, number> = {
                  totalQuestionsAsked: userStats.totalQuestionsAsked,
                  totalPPTsGenerated:  userStats.totalPPTsGenerated,
                  totalPDFsConverted:  userStats.totalPDFsConverted,
                  streak, points,
                };
                return (
                  <div key={category}>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{categoryLabels[category]}</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {categoryAchs.map((ach, idx) => {
                        const isUnlocked = unlockedAchievements.includes(ach.id);
                        const styles = RARITY_STYLES[ach.rarity];
                        const currentVal = statMap[ach.stat] || 0;
                        const progress = Math.min(100, Math.round((currentVal / ach.threshold) * 100));
                        return (
                          <div
                            key={ach.id}
                            className={`ach-card-in relative p-4 rounded-2xl border transition-all duration-300 overflow-hidden group
                              ${isUnlocked
                                ? `bg-gradient-to-br ${styles.bg} ${styles.border} ${styles.glow ? `shadow-lg ${styles.glow}` : ''}`
                                : 'bg-white/[0.015] border-white/5 opacity-70'
                              }`}
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            {isUnlocked && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                            )}

                            <div className="flex items-start gap-3">
                              <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                                ${isUnlocked
                                  ? `bg-gradient-to-br ${styles.bg} border ${styles.border}`
                                  : 'bg-white/5 border border-white/5'}`}>
                                {isUnlocked
                                  ? <span className="filter drop-shadow-lg">{ach.icon}</span>
                                  : <Lock className="w-5 h-5 text-slate-600" />
                                }
                                {isUnlocked && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-navy-900 flex items-center justify-center">
                                    <CheckCircle className="w-2.5 h-2.5 text-white" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <h4 className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{ach.name}</h4>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${styles.badge}`}>{ach.rarity}</span>
                                </div>
                                <p className={`text-xs leading-snug ${isUnlocked ? 'text-slate-300' : 'text-slate-600'}`}>{ach.desc}</p>

                                {!isUnlocked && (
                                  <div className="mt-2">
                                    <div className="flex justify-between text-[10px] text-slate-600 mb-1">
                                      <span>Progress</span>
                                      <span>{currentVal}/{ach.threshold}</span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                                      <div
                                        className="h-full rounded-full bg-gradient-to-r from-slate-600 to-slate-500 transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {isUnlocked && ach.reward > 0 && (
                                  <div className="flex items-center gap-1 mt-1.5">
                                    <Zap className="w-3 h-3 text-yellow-400" />
                                    <span className="text-xs font-semibold text-yellow-400">+{ach.reward} bonus pts earned</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-4 border-t border-white/5 flex-shrink-0 flex items-center justify-between">
              <span className="text-xs text-slate-500">Keep earning to unlock more achievements!</span>
              <button
                onClick={() => setShowAchievementsModal(false)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level Progress */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              Level Progress
              <span className={`text-sm px-2 py-0.5 rounded-full bg-gradient-to-r ${levelColor} text-white`}>
                {levelTier}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Level {levelInfo.currentLevel} → Level {levelInfo.currentLevel + 1}
            </p>
          </div>
          <span className="text-sm font-bold gradient-text">
            {levelInfo.currentXP} / {levelInfo.requiredXP} XP
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${levelColor} progress-animate`}
            style={{ width: `${levelInfo.progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {levelInfo.requiredXP - levelInfo.currentXP} XP until next level
        </p>
      </div>

      {/* STREAK CELEBRATION POPUP */}
      {showStreakCelebration && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300"
          onClick={() => setShowStreakCelebration(false)}
        >
          <div 
            className="glass rounded-3xl p-8 max-w-md mx-4 text-center border border-orange-500/30 animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <Lottie 
              animationData={streakAnimation}
              loop={true}
              style={{ width: 100, height: 100, margin: '0 auto' }}
            />
            <h2 className="text-3xl font-bold text-white mt-4 mb-2">
              🔥 {streak} Day Streak!
            </h2>
            <p className="text-slate-400 mb-6">
              {streak >= 7 
                ? 'Amazing! Keep the momentum going!' 
                : `${7 - streak} more days to unlock bonus rewards!`}
            </p>
            <button
              onClick={() => setShowStreakCelebration(false)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Keep Going! 💪
            </button>
          </div>
        </div>
      )}
    </div>
  );
}