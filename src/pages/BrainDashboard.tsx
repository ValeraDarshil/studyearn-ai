/**
 * AI Study OS — Brain Dashboard Page
 * ─────────────────────────────────────────────────────────────
 * The central AI-powered dashboard showing:
 *   1. Today's Focus (AI daily plan)
 *   2. 7-Day Learning Path with progress
 *   3. Topic Mastery — weak/strong subjects heatmap
 *   4. Weekly Progress Report & Insights
 *   5. Performance Alerts
 *   6. GitHub-style Activity Heatmap
 *
 * Drop this in: src/pages/BrainDashboard.tsx
 * Register in App.tsx: <Route path="/app/brain" element={<BrainDashboard />} />
 *
 * Uses existing: glass, gradient-text CSS classes from the project.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Target, TrendingUp, Zap, CheckCircle2, Clock, RefreshCw,
  ChevronRight, AlertTriangle, ArrowUp, ArrowDown, Minus, Calendar,
  BookOpen, Code2, GraduationCap, Star, BarChart2, Flame, Trophy,
  Sparkles, Play, Lock
} from 'lucide-react';
import {
  getStudentProfile, getTodayFocus, getLearningPath,
  getWeeklyReport, getAlerts, getHeatmapData,
  completeLearningStep,
  type StudentProfile, type TodayFocus, type LearningPath,
  type WeeklyReport, type PerformanceAlert, type HeatmapDay,
} from '../utils/brain-api';
import { useApp } from '../context/AppContext';

// ── Helpers ────────────────────────────────────────────────────
const CATEGORY_META = {
  school:  { icon: BookOpen, label: 'School Student', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  coding:  { icon: Code2,    label: 'Coding Learner',  color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  college: { icon: GraduationCap, label: 'College Student', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
  self:    { icon: Brain,    label: 'Self Learner',     color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
};

const ALERT_META = {
  improvement: { icon: ArrowUp,     color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  decline:     { icon: ArrowDown,   color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20' },
  streak:      { icon: Flame,       color: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/20' },
  milestone:   { icon: Trophy,      color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
  warning:     { icon: AlertTriangle, color: 'text-yellow-400',bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
};

const DIFFICULTY_COLORS = {
  beginner:     'text-emerald-400 bg-emerald-500/10',
  intermediate: 'text-amber-400 bg-amber-500/10',
  advanced:     'text-red-400 bg-red-500/10',
};

const STEP_TYPE_ICONS: Record<string, string> = {
  learn_concept:    '📖',
  practice_quiz:    '🧠',
  coding_exercise:  '💻',
  revision:         '🔁',
  project:          '🚀',
  mock_test:        '📝',
  rest_day:         '😴',
};

// Activity heatmap intensity
function getHeatmapColor(count: number): string {
  if (count === 0) return 'bg-slate-800';
  if (count <= 2)  return 'bg-violet-900';
  if (count <= 5)  return 'bg-violet-700';
  if (count <= 8)  return 'bg-violet-500';
  return 'bg-violet-400';
}

// Last 26 weeks of dates (182 days)
function buildHeatmapGrid(data: HeatmapDay[]): { date: string; count: number }[] {
  const map: Record<string, number> = {};
  data.forEach(d => { map[d.date] = d.count; });
  const grid = [];
  for (let i = 181; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().split('T')[0];
    grid.push({ date: key, count: map[key] ?? 0 });
  }
  return grid;
}

// ── Main Component ─────────────────────────────────────────────
export function BrainDashboard() {
  const navigate = useNavigate();
  const { userName } = useApp();
  const firstName = userName?.trim().split(' ')[0] || 'Learner';

  const [profile,    setProfile]    = useState<StudentProfile | null>(null);
  const [focus,      setFocus]      = useState<TodayFocus | null>(null);
  const [path,       setPath]       = useState<LearningPath | null>(null);
  const [report,     setReport]     = useState<WeeklyReport | null>(null);
  const [alerts,     setAlerts]     = useState<PerformanceAlert[]>([]);
  const [heatmap,    setHeatmap]    = useState<HeatmapDay[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [genPath,    setGenPath]    = useState(false);
  const [activeTab,  setActiveTab]  = useState<'overview' | 'path' | 'mastery' | 'insights'>('overview');

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, fRes, pathRes, rRes, aRes, hRes] = await Promise.all([
        getStudentProfile(),
        getTodayFocus(),
        getLearningPath(),
        getWeeklyReport(),
        getAlerts(),
        getHeatmapData(),
      ]);
      if (pRes.success)    setProfile(pRes.profile);
      if (fRes.success)    setFocus(fRes.focus);
      if (pathRes.success) setPath(pathRes.path);
      if (rRes.success)    setReport(rRes.report);
      if (aRes.success)    setAlerts(aRes.alerts);
      if (hRes.success)    setHeatmap(hRes.heatmap);
    } catch (e) {
      console.error('[BrainDashboard] load error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleGeneratePath = async () => {
    setGenPath(true);
    try {
      const res = await getLearningPath(profile?.primarySubjects[0], true);
      if (res.success) setPath(res.path);
    } finally {
      setGenPath(false);
    }
  };

  const handleCompleteStep = async (stepId: string) => {
    if (!path) return;
    const res = await completeLearningStep(path._id, stepId);
    if (res.success) {
      setPath(prev => prev ? {
        ...prev,
        completedSteps:  res.completedSteps ?? prev.completedSteps + 1,
        progressPercent: res.progressPercent ?? prev.progressPercent,
        steps: prev.steps.map(s => s.stepId === stepId ? { ...s, isCompleted: true, completedAt: new Date().toISOString() } : s),
      } : prev);
    }
  };

  const catMeta = profile ? CATEGORY_META[profile.learnerCategory] : null;
  const heatGrid = buildHeatmapGrid(heatmap);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading your AI Study OS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <Brain className="w-7 h-7 text-violet-400" />
            AI Brain — <span className="gradient-text">{firstName}</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Your personalized learning intelligence system</p>
        </div>
        {catMeta && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${catMeta.bg} ${catMeta.border}`}>
            <catMeta.icon className={`w-4 h-4 ${catMeta.color}`} />
            <span className={`text-sm font-medium ${catMeta.color}`}>{catMeta.label}</span>
            {profile?.classLevel && <span className="text-slate-500 text-sm">· {profile.classLevel}</span>}
          </div>
        )}
      </div>

      {/* ── Stat Strip ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Mastery Score', value: `${profile?.overallMasteryScore ?? 0}%`, icon: Target,    color: 'text-violet-400' },
          { label: 'Study Streak',  value: `${profile?.currentStreak ?? 0} days`,   icon: Flame,     color: 'text-orange-400' },
          { label: 'Weak Topics',   value: `${profile?.weakTopics?.length ?? 0}`,   icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Study Days',    value: `${profile?.totalStudyDays ?? 0}`,        icon: Calendar,  color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-slate-400 text-xs">{s.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-slate-800/60 rounded-xl w-fit">
        {([
          { id: 'overview', label: 'Overview' },
          { id: 'path',     label: '7-Day Plan' },
          { id: 'mastery',  label: 'Mastery' },
          { id: 'insights', label: 'Insights' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          TAB: OVERVIEW
      ════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">

          {/* Today's Focus */}
          {focus && (
            <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-slate-900 to-slate-900 p-6">
              <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-2 text-violet-400 text-sm font-medium mb-3">
                  <Sparkles className="w-4 h-4" />
                  AI-Generated Daily Focus
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{focus.title}</h2>
                <p className="text-slate-400 text-sm mb-4">{focus.description}</p>
                <div className="flex flex-wrap gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[focus.difficulty as keyof typeof DIFFICULTY_COLORS] || DIFFICULTY_COLORS.intermediate}`}>
                    {focus.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium text-slate-400 bg-slate-800">
                    <Clock className="w-3 h-3 inline mr-1" />{focus.estimatedMinutes} min
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium text-violet-400 bg-violet-500/10">
                    {focus.subject}
                  </span>
                </div>
                <button
                  onClick={() => navigate('/app/ask')}
                  className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all"
                >
                  <Play className="w-4 h-4" /> Start with AI Tutor <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-violet-400" /> Performance Alerts
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {alerts.slice(0, 4).map((alert, i) => {
                  const meta = ALERT_META[alert.type];
                  const Icon = meta.icon;
                  return (
                    <div key={i} className={`p-4 rounded-xl border ${meta.bg} ${meta.border}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg ${meta.bg} border ${meta.border} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${meta.color}`} />
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">{alert.title}</div>
                          <div className="text-slate-400 text-xs mt-0.5">{alert.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Activity Heatmap */}
          <div className="glass rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-violet-400" /> Study Activity
              </h3>
              <span className="text-slate-400 text-xs">Last 26 weeks</span>
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {Array.from({ length: 26 }, (_, w) => (
                  <div key={w} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }, (_, d) => {
                      const idx = w * 7 + d;
                      const cell = heatGrid[idx];
                      return (
                        <div
                          key={d}
                          title={cell ? `${cell.date}: ${cell.count} activities` : ''}
                          className={`w-3 h-3 rounded-sm ${cell ? getHeatmapColor(cell.count) : 'bg-slate-800'} transition-colors`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
              <span>Less</span>
              {['bg-slate-800','bg-violet-900','bg-violet-700','bg-violet-500','bg-violet-400'].map(c => (
                <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          TAB: 7-DAY LEARNING PATH
      ════════════════════════════════════════════════════ */}
      {activeTab === 'path' && (
        <div className="space-y-4">
          {path ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg">{path.title}</h3>
                  <p className="text-slate-400 text-sm mt-0.5">{path.description}</p>
                </div>
                <button
                  onClick={handleGeneratePath}
                  disabled={genPath}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${genPath ? 'animate-spin' : ''}`} />
                  {genPath ? 'Generating...' : 'Regenerate'}
                </button>
              </div>

              {/* Progress bar */}
              <div className="glass rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-slate-400">{path.completedSteps} of {path.totalSteps} steps</span>
                  <span className="text-violet-400 font-medium">{path.progressPercent}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-700"
                    style={{ width: `${path.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {path.steps.map((step, i) => (
                  <div
                    key={step.stepId}
                    className={`p-4 rounded-xl border transition-all ${
                      step.isCompleted
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : i === path.completedSteps
                        ? 'bg-violet-500/10 border-violet-500/30'
                        : 'bg-slate-800/40 border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                        step.isCompleted ? 'bg-emerald-500/20' : 'bg-slate-700'
                      }`}>
                        {step.isCompleted ? '✅' : (STEP_TYPE_ICONS[step.type] || '📌')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-semibold text-sm ${step.isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                            {step.title}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${DIFFICULTY_COLORS[step.difficulty as keyof typeof DIFFICULTY_COLORS] || DIFFICULTY_COLORS.intermediate}`}>
                            {step.difficulty}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-1">{step.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span><Clock className="w-3 h-3 inline mr-1" />{step.estimatedMinutes} min</span>
                          <span><Zap className="w-3 h-3 inline mr-1 text-yellow-400" />{step.xpReward} XP</span>
                        </div>
                      </div>
                      {!step.isCompleted && i <= path.completedSteps && (
                        <button
                          onClick={() => handleCompleteStep(step.stepId)}
                          className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-all flex items-center gap-1 flex-shrink-0"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Done
                        </button>
                      )}
                      {!step.isCompleted && i > path.completedSteps && (
                        <div className="flex items-center gap-1 text-slate-600 text-xs flex-shrink-0">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-violet-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">No Learning Path Yet</h3>
              <p className="text-slate-400 text-sm mb-6">Generate your personalized 7-day study plan powered by AI.</p>
              <button
                onClick={handleGeneratePath}
                disabled={genPath}
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all disabled:opacity-60 flex items-center gap-2 mx-auto"
              >
                {genPath ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate My 7-Day Plan</>}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          TAB: TOPIC MASTERY
      ════════════════════════════════════════════════════ */}
      {activeTab === 'mastery' && (
        <div className="space-y-6">
          {/* Weak topics */}
          {profile && profile.weakTopics.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Needs Attention
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {profile.topicMastery.filter(t => t.isWeak).map(t => (
                  <div key={t.topic} className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">{t.topic}</span>
                      <span className="text-red-400 text-sm font-bold">{t.masteryLevel}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${t.masteryLevel}%` }} />
                    </div>
                    <div className="text-slate-500 text-xs mt-1">{t.subject} · {t.totalAttempts} attempts</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strong topics */}
          {profile && profile.strongTopics.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" /> Strong Areas
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {profile.topicMastery.filter(t => t.isStrong).map(t => (
                  <div key={t.topic} className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">{t.topic}</span>
                      <div className="flex items-center gap-2">
                        {t.trend === 'improving' && <ArrowUp className="w-3 h-3 text-emerald-400" />}
                        <span className="text-emerald-400 text-sm font-bold">{t.masteryLevel}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${t.masteryLevel}%` }} />
                    </div>
                    <div className="text-slate-500 text-xs mt-1">{t.subject} · {t.totalAttempts} attempts</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All topics */}
          {profile && profile.topicMastery.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-violet-400" /> All Topics
              </h3>
              <div className="space-y-2">
                {[...profile.topicMastery]
                  .sort((a, b) => b.masteryLevel - a.masteryLevel)
                  .map(t => (
                  <div key={t.topic} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                    <div className="w-24 text-xs text-slate-400 flex-shrink-0">{t.subject}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm">{t.topic}</span>
                        <div className="flex items-center gap-2">
                          {t.trend === 'improving' && <ArrowUp className="w-3 h-3 text-emerald-400" />}
                          {t.trend === 'declining' && <ArrowDown className="w-3 h-3 text-red-400" />}
                          {t.trend === 'stable' && <Minus className="w-3 h-3 text-slate-500" />}
                          <span className="text-slate-400 text-sm">{t.masteryLevel}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            t.isStrong ? 'bg-emerald-500' :
                            t.isWeak   ? 'bg-red-500' :
                            'bg-violet-500'
                          }`}
                          style={{ width: `${t.masteryLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile && profile.topicMastery.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No topic data yet.</p>
              <p className="text-slate-500 text-sm mt-1">Ask the AI Tutor questions or take quizzes to build your mastery map.</p>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          TAB: WEEKLY INSIGHTS
      ════════════════════════════════════════════════════ */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {report ? (
            <>
              {/* Headline */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 via-slate-900 to-slate-900 border border-violet-500/20">
                <div className="text-violet-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> AI Weekly Report
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{report.headline}</h2>
                <p className="text-slate-400 text-sm">{report.summaryText}</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Study Minutes', value: report.totalStudyMinutes, icon: Clock, color: 'text-blue-400' },
                  { label: 'Quizzes Taken', value: report.totalQuizzesTaken, icon: BookOpen, color: 'text-purple-400' },
                  { label: 'XP Earned',     value: report.totalXPEarned,    icon: Zap,     color: 'text-yellow-400' },
                  { label: 'Consistency',   value: `${report.consistencyScore}%`, icon: Target, color: 'text-emerald-400' },
                ].map(s => (
                  <div key={s.label} className="glass rounded-xl p-4 border border-slate-700/50">
                    <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
                    <div className="text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-slate-400 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Overall change */}
              <div className="flex items-center gap-4 p-4 rounded-xl glass border border-slate-700/50">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${report.overallChange >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                  {report.overallChange >= 0
                    ? <ArrowUp className="w-5 h-5 text-emerald-400" />
                    : <ArrowDown className="w-5 h-5 text-red-400" />}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Overall Mastery</div>
                  <div className="text-slate-400 text-xs">
                    {report.overallScoreEnd}% this week
                    {report.overallChange !== 0 && (
                      <span className={report.overallChange > 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {' '}({report.overallChange > 0 ? '+' : ''}{report.overallChange}%)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {report.suggestions.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400" /> AI Suggestions
                  </h3>
                  <div className="space-y-2">
                    {report.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50">
                        <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-violet-400 text-xs font-bold">{i + 1}</span>
                        </div>
                        <p className="text-slate-300 text-sm">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No weekly report yet.</p>
              <p className="text-slate-500 text-sm mt-1">Study for a few days to unlock your first AI-generated weekly insight.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}