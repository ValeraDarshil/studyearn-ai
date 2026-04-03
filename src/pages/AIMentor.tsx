/**
 * AI Study OS — AI Mentor Page (Stage 6)
 * ─────────────────────────────────────────────────────────────
 * Full AI Mentor dashboard with:
 *   - Live mentor message panel (hook → action → reward)
 *   - Active micro-task card with timer
 *   - Mentor personality selector
 *   - Message history feed
 *   - Notification badges
 *   - Progressive mentor level display
 *   - Smart notification panel
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { mentorApi, MentorState, MentorMessageData, MicroTask, MentorPersonality } from '../utils/mentor-api';

// ── Trigger display config ─────────────────────────────────────
const TRIGGER_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  COMEBACK:         { color: '#f97316', bg: '#fff7ed', label: 'Comeback' },
  STREAK_BREAK:     { color: '#ef4444', bg: '#fef2f2', label: 'Streak Break' },
  STREAK_AT_RISK:   { color: '#f59e0b', bg: '#fffbeb', label: 'Streak at Risk' },
  LOW_PERFORMANCE:  { color: '#8b5cf6', bg: '#f5f3ff', label: 'Low Performance' },
  HIGH_PROGRESS:    { color: '#10b981', bg: '#ecfdf5', label: 'High Progress' },
  INACTIVE_USER:    { color: '#6366f1', bg: '#eef2ff', label: 'Inactive' },
  DAILY_REMINDER:   { color: '#0ea5e9', bg: '#f0f9ff', label: 'Daily Reminder' },
  GOAL_PENDING:     { color: '#64748b', bg: '#f8fafc', label: 'Goal Pending' },
  WEAK_TOPIC_FOCUS: { color: '#ec4899', bg: '#fdf2f8', label: 'Weak Topic' },
  MILESTONE_REACHED:{ color: '#f59e0b', bg: '#fffbeb', label: 'Milestone' },
};

const DIFFICULTY_COLORS = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };

// ── Personality config ─────────────────────────────────────────
const PERSONALITIES: { id: MentorPersonality; label: string; emoji: string; desc: string }[] = [
  { id: 'friendly',     label: 'Friendly',     emoji: '😊', desc: 'Warm & supportive, always encouraging' },
  { id: 'motivational', label: 'Motivational', emoji: '🔥', desc: 'High-energy, celebrates every win' },
  { id: 'strict',       label: 'Strict',       emoji: '⚡', desc: 'Direct & demanding, no excuses' },
];

// ── Mentor Level Titles ────────────────────────────────────────
const LEVEL_TITLES = [
  '', 'Rookie', 'Explorer', 'Learner', 'Scholar', 'Achiever',
  'Champion', 'Master', 'Expert', 'Elite', 'Legend',
];

// ── Countdown Timer Hook ───────────────────────────────────────
function useCountdown(durationMinutes: number) {
  const [seconds, setSeconds]   = useState(durationMinutes * 60);
  const [running, setRunning]   = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) { setRunning(false); clearInterval(intervalRef.current!); return 0; }
          return s - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const toggle = () => setRunning((r) => !r);
  const reset  = () => { setRunning(false); setSeconds(durationMinutes * 60); };

  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');

  return { display: `${m}:${s}`, running, toggle, reset, done: seconds === 0 };
}

// ── Sub-components ─────────────────────────────────────────────

function MentorLevelBadge({ level }: { level: number }) {
  const pct = ((level - 1) / 9) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, fontWeight: 800, color: '#fff',
        boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
      }}>
        {level}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
          Mentor Level {level} — {LEVEL_TITLES[level]}
        </div>
        <div style={{
          marginTop: 4, height: 6, width: 140, borderRadius: 999,
          background: '#e2e8f0', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            borderRadius: 999, transition: 'width 0.6s ease',
          }} />
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
          {level < 10 ? `${10 - (level - 1) % 10 - 1} more sessions to next level` : 'Maximum level reached!'}
        </div>
      </div>
    </div>
  );
}

function MicroTaskCard({
  task,
  onComplete,
}: {
  task:       MicroTask;
  onComplete: () => void;
}) {
  const timer = useCountdown(task.durationMinutes);
  const diffColor = DIFFICULTY_COLORS[task.difficulty];

  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      border: '2px solid #e2e8f0', padding: 24,
      boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
          color: diffColor, background: `${diffColor}18`,
          padding: '3px 10px', borderRadius: 99,
        }}>
          {task.difficulty} · {task.durationMinutes} min
        </span>
        <span style={{
          fontSize: 13, fontWeight: 700, color: '#f59e0b',
          background: '#fffbeb', padding: '3px 10px', borderRadius: 99,
        }}>
          +{task.xpReward} XP
        </span>
      </div>

      <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
        {task.title}
      </h3>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
        {task.description}
      </p>

      {/* Timer */}
      <div style={{
        background: timer.done ? '#ecfdf5' : '#f8fafc',
        borderRadius: 16, padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, border: `1px solid ${timer.done ? '#d1fae5' : '#e2e8f0'}`,
      }}>
        <div>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 2 }}>
            {timer.done ? '✅ Time Complete!' : timer.running ? '⏱ Session Active' : '⏱ Timer'}
          </div>
          <div style={{
            fontSize: 32, fontWeight: 900, letterSpacing: 2,
            color: timer.done ? '#10b981' : '#0f172a',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {timer.display}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={timer.toggle}
            style={{
              padding: '10px 18px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: timer.running ? '#fef2f2' : '#6366f1', fontWeight: 700, fontSize: 13,
              color: timer.running ? '#ef4444' : '#fff',
              transition: 'all 0.2s',
            }}
          >
            {timer.running ? 'Pause' : 'Start'}
          </button>
          {!timer.running && (
            <button
              onClick={timer.reset}
              style={{
                padding: '10px 14px', borderRadius: 12, border: '1px solid #e2e8f0',
                background: '#fff', cursor: 'pointer', fontSize: 13, color: '#64748b',
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Complete button */}
      <button
        onClick={onComplete}
        style={{
          width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'translateY(0)'; }}
      >
        ✅ Mark Task Complete
      </button>
    </div>
  );
}

function MentorMessageCard({
  msg,
  onStart,
  onDismiss,
}: {
  msg:       MentorMessageData;
  onStart:   () => void;
  onDismiss: () => void;
}) {
  const cfg  = TRIGGER_CONFIG[msg.triggerType] ?? TRIGGER_CONFIG['DAILY_REMINDER'];
  const time = new Date(msg.createdAt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: 24,
      border: `2px solid ${cfg.color}30`,
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Accent stripe */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}99)`,
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>{msg.emoji}</span>
          <div>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
              color: cfg.color, background: cfg.bg, padding: '2px 8px', borderRadius: 99,
            }}>
              {cfg.label}
            </span>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{time}</div>
          </div>
        </div>
        <button
          onClick={onDismiss}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 18, color: '#94a3b8', padding: 4, lineHeight: 1,
          }}
          title="Dismiss"
        >
          ×
        </button>
      </div>

      <h2 style={{ margin: '0 0 10px', fontSize: 19, fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
        {msg.title}
      </h2>
      <p style={{ margin: '0 0 16px', fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
        {msg.body}
      </p>

      {/* Task hint */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#f8fafc', borderRadius: 10, padding: '10px 14px',
        marginBottom: 18, border: '1px solid #e2e8f0',
      }}>
        <span style={{ fontSize: 14 }}>💡</span>
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{msg.taskHint}</span>
      </div>

      {/* XP badge if applicable */}
      {msg.xpAwarded > 0 && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#fffbeb', border: '1px solid #fde68a',
          borderRadius: 99, padding: '4px 12px', marginBottom: 16,
        }}>
          <span>⭐</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#b45309' }}>
            +{msg.xpAwarded} Bonus XP Awarded!
          </span>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onStart}
        style={{
          width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
          background: `linear-gradient(135deg, ${cfg.color} 0%, ${cfg.color}cc 100%)`,
          color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer',
          boxShadow: `0 4px 14px ${cfg.color}40`,
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'translateY(0)'; }}
      >
        {msg.cta} →
      </button>
    </div>
  );
}

function PersonalitySelector({
  current,
  onChange,
  loading,
}: {
  current:  MentorPersonality;
  onChange: (p: MentorPersonality) => void;
  loading:  boolean;
}) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 12, letterSpacing: 0.5 }}>
        🧠 MENTOR PERSONALITY
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {PERSONALITIES.map((p) => (
          <button
            key={p.id}
            onClick={() => !loading && onChange(p.id)}
            style={{
              padding: '12px 8px', borderRadius: 14, cursor: loading ? 'wait' : 'pointer',
              border: `2px solid ${current === p.id ? '#6366f1' : '#e2e8f0'}`,
              background: current === p.id ? '#eef2ff' : '#fff',
              transition: 'all 0.2s',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>{p.emoji}</div>
            <div style={{
              fontSize: 12, fontWeight: 700,
              color: current === p.id ? '#4f46e5' : '#374151',
            }}>
              {p.label}
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2, lineHeight: 1.3 }}>
              {p.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageHistoryFeed({ messages }: { messages: MentorMessageData[] }) {
  if (!messages.length) {
    return (
      <div style={{
        textAlign: 'center', padding: '40px 20px',
        color: '#94a3b8', fontSize: 14,
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
        No mentor messages yet. Come back tomorrow!
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {messages.map((msg) => {
        const cfg = TRIGGER_CONFIG[msg.triggerType] ?? TRIGGER_CONFIG['DAILY_REMINDER'];
        return (
          <div
            key={msg._id}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '14px 16px', borderRadius: 14,
              background: msg.isRead ? '#f8fafc' : cfg.bg,
              border: `1px solid ${msg.isRead ? '#e2e8f0' : cfg.color + '30'}`,
              opacity: msg.isDismissed ? 0.5 : 1,
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0 }}>{msg.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 14, fontWeight: msg.isRead ? 500 : 700,
                color: '#0f172a', marginBottom: 2,
              }}>
                {msg.title}
              </div>
              <div style={{
                fontSize: 12, color: '#94a3b8',
              }}>
                {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                })}
                {msg.xpAwarded > 0 && ` · +${msg.xpAwarded} XP`}
              </div>
            </div>
            {!msg.isRead && (
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: cfg.color, flexShrink: 0, marginTop: 6,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Page Component ────────────────────────────────────────

export default function AIMentorPage() {
  const [state,            setState]           = useState<MentorState | null>(null);
  const [messages,         setMessages]        = useState<MentorMessageData[]>([]);
  const [loading,          setLoading]         = useState(true);
  const [checking,         setChecking]        = useState(false);
  const [personalityLoading, setPersonalityLoading] = useState(false);
  const [taskCompleted,    setTaskCompleted]   = useState(false);
  const [activeTab,        setActiveTab]       = useState<'mentor' | 'history' | 'settings'>('mentor');
  const [toast,            setToast]           = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    try {
      const [stateRes, msgsRes] = await Promise.all([
        mentorApi.getState(),
        mentorApi.getMessages(20),
      ]);
      setState(stateRes);
      setMessages(msgsRes.messages ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCheck = async () => {
    setChecking(true);
    try {
      await mentorApi.check({ forceRun: true });
      await load();
      showToast('✅ AI Mentor checked your progress!');
    } catch {
      showToast('❌ Could not run mentor check');
    } finally {
      setChecking(false);
    }
  };

  const handleDismiss = async (id: string) => {
    await mentorApi.dismiss(id);
    await load();
  };

  const handleStart = async (msg: MentorMessageData) => {
    if (!msg.isRead) await mentorApi.markRead(msg._id);
    await load();
    // If there's a micro-task, scroll to it
    document.getElementById('micro-task-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCompleteTask = async () => {
    await mentorApi.completeTask();
    setTaskCompleted(true);
    showToast('🎉 Task complete! XP awarded!');
    setTimeout(() => { setTaskCompleted(false); load(); }, 2000);
  };

  const handlePersonality = async (p: MentorPersonality) => {
    setPersonalityLoading(true);
    try {
      await mentorApi.setPersonality(p);
      setState((prev) => prev ? { ...prev, mentorPersonality: p } : prev);
      showToast(`Mentor style changed to ${p}!`);
    } finally {
      setPersonalityLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────

  const latestMsg   = state?.latestMessage ?? null;
  const microTask   = state?.activeMicroTask ?? null;
  const unreadCount = state?.unreadCount ?? 0;
  const mentorLevel = state?.mentorLevel ?? 1;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f0f9ff 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '24px 16px 80px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* ── Toast ──────────────────────────────────────────── */}
        {toast && (
          <div style={{
            position: 'fixed', top: 24, right: 24, zIndex: 9999,
            background: '#0f172a', color: '#fff', padding: '12px 20px',
            borderRadius: 14, fontSize: 14, fontWeight: 600,
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            animation: 'slideIn 0.3s ease',
          }}>
            {toast}
          </div>
        )}

        {/* ── Header ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{
                margin: 0, fontSize: 28, fontWeight: 900, color: '#0f172a',
                letterSpacing: -0.5,
              }}>
                🤖 AI Mentor
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
                Your proactive learning coach — always watching, always guiding.
              </p>
            </div>

            {/* Unread badge + check button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {unreadCount > 0 && (
                <div style={{
                  background: '#ef4444', color: '#fff', borderRadius: 99,
                  width: 28, height: 28, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 13, fontWeight: 800,
                }}>
                  {unreadCount}
                </div>
              )}
              <button
                onClick={handleCheck}
                disabled={checking}
                style={{
                  padding: '10px 18px', borderRadius: 12, border: 'none',
                  background: checking ? '#e2e8f0' : '#6366f1',
                  color: checking ? '#94a3b8' : '#fff',
                  fontWeight: 700, fontSize: 13, cursor: checking ? 'wait' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {checking ? '⏳ Checking...' : '🔄 Check Now'}
              </button>
            </div>
          </div>

          {/* Mentor Level */}
          {!loading && state && (
            <div style={{
              marginTop: 20, background: '#fff', borderRadius: 16,
              padding: '16px 20px', border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <MentorLevelBadge level={mentorLevel} />
            </div>
          )}
        </div>

        {/* ── Tabs ───────────────────────────────────────────── */}
        <div style={{
          display: 'flex', gap: 4, background: '#f1f5f9',
          borderRadius: 14, padding: 4, marginBottom: 24,
        }}>
          {(['mentor', 'history', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
                background: activeTab === tab ? '#fff' : 'transparent',
                color: activeTab === tab ? '#4f46e5' : '#64748b',
                fontWeight: activeTab === tab ? 700 : 500,
                fontSize: 13, cursor: 'pointer',
                boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s', textTransform: 'capitalize',
              }}
            >
              {tab === 'mentor'   ? '🤖 Mentor'  : ''}
              {tab === 'history'  ? '📋 History' : ''}
              {tab === 'settings' ? '⚙️ Settings' : ''}
            </button>
          ))}
        </div>

        {/* ── Loading ─────────────────────────────────────────── */}
        {loading && (
          <div style={{
            textAlign: 'center', padding: '60px 0',
            color: '#94a3b8', fontSize: 15,
          }}>
            <div style={{
              fontSize: 40, marginBottom: 16,
              animation: 'spin 1s linear infinite',
              display: 'inline-block',
            }}>⚙️</div>
            <div>AI Mentor is analyzing your progress...</div>
          </div>
        )}

        {/* ── Mentor Tab ─────────────────────────────────────── */}
        {!loading && activeTab === 'mentor' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Active Message */}
            {latestMsg && !latestMsg.isDismissed ? (
              <MentorMessageCard
                msg={latestMsg}
                onStart={() => handleStart(latestMsg)}
                onDismiss={() => handleDismiss(latestMsg._id)}
              />
            ) : (
              <div style={{
                background: '#fff', borderRadius: 20, padding: '40px 24px',
                border: '2px dashed #e2e8f0', textAlign: 'center',
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                  You're all caught up!
                </h3>
                <p style={{ margin: '0 0 20px', fontSize: 14, color: '#64748b' }}>
                  No pending mentor messages. Keep studying and I'll check in soon.
                </p>
                <button
                  onClick={handleCheck}
                  disabled={checking}
                  style={{
                    padding: '12px 24px', borderRadius: 12, border: 'none',
                    background: '#6366f1', color: '#fff',
                    fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  }}
                >
                  {checking ? 'Checking...' : 'Run AI Check Now'}
                </button>
              </div>
            )}

            {/* Active Micro-Task */}
            {microTask && (
              <div id="micro-task-section">
                <div style={{
                  fontSize: 13, fontWeight: 700, color: '#64748b',
                  marginBottom: 10, letterSpacing: 0.5,
                }}>
                  ⚡ ACTIVE MICRO-TASK
                </div>
                {taskCompleted ? (
                  <div style={{
                    background: '#ecfdf5', borderRadius: 20, padding: '40px 24px',
                    textAlign: 'center', border: '2px solid #d1fae5',
                  }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                    <h3 style={{ margin: 0, color: '#065f46', fontWeight: 800, fontSize: 18 }}>
                      Task Complete! XP Awarded!
                    </h3>
                  </div>
                ) : (
                  <MicroTaskCard
                    task={microTask}
                    onComplete={handleCompleteTask}
                  />
                )}
              </div>
            )}

            {/* Quick Stats */}
            {state && (
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                gap: 10,
              }}>
                {[
                  { label: 'Total Sessions', value: state.totalTriggersEver, emoji: '📊' },
                  { label: 'Tasks Done', value: state.totalTasksCompleted, emoji: '✅' },
                  { label: 'Mentor Level', value: `L${state.mentorLevel}`, emoji: '⭐' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: '#fff', borderRadius: 16, padding: '16px 12px',
                      border: '1px solid #e2e8f0', textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{stat.emoji}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>{stat.value}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── History Tab ─────────────────────────────────────── */}
        {!loading && activeTab === 'history' && (
          <div style={{
            background: '#fff', borderRadius: 20, padding: 20,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
              📋 Message History
            </h3>
            <MessageHistoryFeed messages={messages} />
          </div>
        )}

        {/* ── Settings Tab ─────────────────────────────────────── */}
        {!loading && activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Personality selector */}
            <div style={{
              background: '#fff', borderRadius: 20, padding: 24,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}>
              <PersonalitySelector
                current={state?.mentorPersonality ?? 'motivational'}
                onChange={handlePersonality}
                loading={personalityLoading}
              />
            </div>

            {/* Info card */}
            <div style={{
              background: '#eef2ff', borderRadius: 20, padding: 20,
              border: '1px solid #c7d2fe',
            }}>
              <div style={{ fontWeight: 700, color: '#3730a3', marginBottom: 8, fontSize: 14 }}>
                🧠 How AI Mentor Works
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: '#4338ca', lineHeight: 1.8 }}>
                <li>Checks your activity every 6 hours automatically</li>
                <li>Sends max 2 personalized messages per day (no spam)</li>
                <li>Fires at your preferred study time (learned from your habits)</li>
                <li>Gets smarter as your mentor level increases</li>
                <li>Assigns micro-tasks based on your weaknesses &amp; mood</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}