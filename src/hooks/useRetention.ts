/**
 * AI Study OS — useRetention Hook (Stage 7)
 * ─────────────────────────────────────────────────────────────
 * Central React hook for the Retention Engine.
 * Handles all state, API calls, and side effects for:
 *   - Streak status & urgency
 *   - Recovery system
 *   - Comeback plan
 *   - Notifications
 *
 * Usage in Dashboard / Layout:
 *   const retention = useRetention();
 *   <StreakAlertPopup urgency={retention.urgency} onSaveStreak={retention.handleSaveStreak} />
 *   <StreakRecoveryUI recovery={retention.recovery} onComplete={retention.handleCompleteRecovery} />
 *   <ComebackScreen plan={retention.comeback} onStartTask={retention.handleStartComebackTask} />
 *   <NotificationPanel isOpen={retention.showPanel} onClose={retention.closePanel} />
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getRetentionStatus,
  runRetentionEngine,
  completeRecovery,
  recordActivity,
  getNotifications,
} from '../utils/retention-api';
import type {
  UrgencyReport,
  RecoveryStatus,
  ComebackPlan,
  AppNotification,
  RecoveryMethod,
  ComebackTask,
} from '../utils/retention-api';

interface RetentionState {
  // Data
  urgency:       UrgencyReport | null;
  recovery:      RecoveryStatus | null;
  comeback:      ComebackPlan | null;
  notifications: AppNotification[];
  notifCount:    number;

  // UI state
  showAlertPopup:    boolean;
  showRecoveryUI:    boolean;
  showComebackScreen: boolean;
  showNotifPanel:    boolean;

  // Status
  loading:     boolean;
  initialized: boolean;

  // Actions
  handleSaveStreak:          () => void;
  handleCompleteRecovery:    (method: RecoveryMethod) => Promise<void>;
  handleStartComebackTask:   (task: ComebackTask) => void;
  handleRecordActivity:      (type: 'lesson' | 'quiz' | 'task' | 'ask_ai' | 'challenge') => Promise<void>;
  openNotifPanel:            () => void;
  closeNotifPanel:           () => void;
  closeAlertPopup:           () => void;
  closeRecoveryUI:           () => void;
  closeComebackScreen:       () => void;
  refresh:                   () => Promise<void>;
}

export function useRetention(isLoggedIn: boolean): RetentionState {
  const navigate = useNavigate();

  const [urgency,       setUrgency]       = useState<UrgencyReport | null>(null);
  const [recovery,      setRecovery]      = useState<RecoveryStatus | null>(null);
  const [comeback,      setComeback]      = useState<ComebackPlan | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const [showAlertPopup,     setShowAlertPopup]     = useState(false);
  const [showRecoveryUI,     setShowRecoveryUI]     = useState(false);
  const [showComebackScreen, setShowComebackScreen] = useState(false);
  const [showNotifPanel,     setShowNotifPanel]     = useState(false);

  const [loading,     setLoading]     = useState(false);
  const [initialized, setInitialized] = useState(false);

  // ── Load retention data on login ──────────────────────────
  const init = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoading(true);

    try {
      // Run engine first (updates streak, detects risk, sends notifs)
      const engineResult = await runRetentionEngine('login');

      setUrgency(engineResult.urgency ?? null);
      setRecovery(engineResult.recovery ?? null);
      setComeback(engineResult.comeback ?? null);

      // Fetch unread notifications
      const notifData = await getNotifications();
      if (notifData.success) {
        setNotifications(notifData.notifications);
      }

      // Decide which UI to show (priority order)
      if (engineResult.recovery?.state === 'available' || engineResult.recovery?.state === 'pending') {
        setShowRecoveryUI(true);
      } else if (engineResult.comeback && engineResult.comeback.intensity !== 'none') {
        setShowComebackScreen(true);
      } else if (engineResult.urgency?.level === 'high' || engineResult.urgency?.level === 'critical') {
        setShowAlertPopup(true);
      } else if (engineResult.urgency?.level === 'medium') {
        // Small alert only
        setShowAlertPopup(true);
      }

    } catch {
      // Non-fatal — retention is an enhancement, not critical path
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && !initialized) {
      init();
    }
    if (!isLoggedIn) {
      setInitialized(false);
    }
  }, [isLoggedIn, initialized, init]);

  // ── Refresh (call after any activity) ────────────────────
  const refresh = useCallback(async () => {
    try {
      const data = await getRetentionStatus();
      setUrgency(data.urgency);
      setRecovery(data.recovery);
      setComeback(data.comeback);
      setNotifications(data.notifications);
    } catch {
      // silent
    }
  }, []);

  // ── Actions ───────────────────────────────────────────────

  const handleSaveStreak = useCallback(() => {
    setShowAlertPopup(false);
    // If recovery available, show recovery UI
    if (recovery?.state === 'available' || recovery?.state === 'pending') {
      setShowRecoveryUI(true);
    } else {
      navigate('/ask-ai');
    }
  }, [recovery, navigate]);

  const handleCompleteRecovery = useCallback(async (method: RecoveryMethod) => {
    await completeRecovery(method);
    await refresh();
    // Keep RecoveryUI open — success state shown inside it
  }, [refresh]);

  const handleStartComebackTask = useCallback((task: ComebackTask) => {
    setShowComebackScreen(false);
    // Route to appropriate page based on task type
    const routes: Record<string, string> = {
      ask_ai:    '/ask-ai',
      quiz:      '/daily-challenge',
      lesson:    '/codelearn',
      challenge: '/daily-challenge',
      review:    '/ask-ai',
    };
    navigate(routes[task.type] ?? '/ask-ai');
  }, [navigate]);

  const handleRecordActivity = useCallback(async (
    type: 'lesson' | 'quiz' | 'task' | 'ask_ai' | 'challenge',
  ) => {
    try {
      await recordActivity(type);
      await refresh();
    } catch {
      // silent
    }
  }, [refresh]);

  const openNotifPanel  = useCallback(() => setShowNotifPanel(true), []);
  const closeNotifPanel = useCallback(() => setShowNotifPanel(false), []);
  const closeAlertPopup = useCallback(() => setShowAlertPopup(false), []);
  const closeRecoveryUI = useCallback(() => setShowRecoveryUI(false), []);
  const closeComebackScreen = useCallback(() => setShowComebackScreen(false), []);

  return {
    urgency,
    recovery,
    comeback,
    notifications,
    notifCount: notifications.filter(n => !n.isRead).length,

    showAlertPopup,
    showRecoveryUI,
    showComebackScreen,
    showNotifPanel,

    loading,
    initialized,

    handleSaveStreak,
    handleCompleteRecovery,
    handleStartComebackTask,
    handleRecordActivity,
    openNotifPanel,
    closeNotifPanel,
    closeAlertPopup,
    closeRecoveryUI,
    closeComebackScreen,
    refresh,
  };
}