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
          // Update context so ALL pages see fresh count
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
          // Auto-refresh quota from server when refill time is up
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
        // Update questionsLeft via context won't work directly, re-fetch quota
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome back, <span className="gradient-text">{firstName}</span> 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Ready to learn something new today?</p>
        </div>
        {/* ✅ ANIMATED STREAK BADGE */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-orange-500/20">
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
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 stagger-children">
        {/* Points */}
        <div className="glass glass-hover card-shine rounded-2xl p-4 animate-slide-up border border-purple-500/10 hover:border-purple-500/25 hover:-translate-y-1 transition-all duration-300 group">
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

        {/* Questions Today — full featured card */}
        <div className="glass glass-hover card-shine rounded-2xl p-4 animate-slide-up border border-blue-500/10 hover:border-blue-500/25 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Questions Today</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer" onClick={() => navigate('/app/ask')}>
              <Brain className="w-4 h-4 text-blue-400" />
            </div>
          </div>

          {/* Count + limit */}
          <div className="flex items-end gap-1 mb-2">
            <span className="text-2xl font-bold text-white">{questionsLeft}</span>
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

          {/* Bottom row: status + watch video button */}
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
      <div>
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
          {/* Header */}
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

          {/* Progress bar */}
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

          {/* Preview: show 4 most recent unlocked + next to unlock */}
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

          {/* View All CTA */}
          <button
            onClick={() => setShowAchievementsModal(true)}
            className="mt-3 w-full py-2 rounded-xl border border-white/5 text-xs text-slate-400 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/5 transition-all flex items-center justify-center gap-2"
          >
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            See all {ACHIEVEMENTS.length} achievements
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          ACHIEVEMENTS FULL MODAL — Premium animated overlay
      ═══════════════════════════════════════════════════════════════════ */}
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

            {/* Modal Header */}
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

            {/* Progress overview */}
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

            {/* Scrollable content */}
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
                            {/* Shimmer sweep on unlocked */}
                            {isUnlocked && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                            )}

                            <div className="flex items-start gap-3">
                              {/* Icon with glow ring on unlocked */}
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

            {/* Modal footer */}
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

      {/* ✅ STREAK CELEBRATION POPUP */}
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