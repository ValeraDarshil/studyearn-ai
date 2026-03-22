// src/components/StreakCelebration.tsx
// Animated celebration when streak increases

import { useEffect, useState, useCallback } from 'react';
import Lottie from 'lottie-react';
import streakAnimation from '../assets/animations/streak-fire.json';

interface StreakCelebrationProps {
  streak: number;
  show: boolean;
  onClose: () => void;
}

export function StreakCelebration({ streak, show, onClose }: StreakCelebrationProps) {
  const [visible, setVisible] = useState(false);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    const timer = setTimeout(handleClose, 4000); // auto-close after 4s
    return () => clearTimeout(timer);
  }, [show, handleClose]);

  if (!show) return null;

  const getMessage = () => {
    if (streak === 1)   return "Great start! Come back tomorrow to keep it going!";
    if (streak >= 100)  return "Absolute legend! 100+ days of pure dedication! 🏅";
    if (streak >= 30)   return "One month strong! You're unstoppable! 🏆";
    if (streak >= 14)   return "Two weeks! You're on fire! Keep going! 💪";
    if (streak >= 7)    return "One full week! Amazing consistency! 🎉";
    return "Keep it up! Don't break the chain!";
  };

  return (
    <div
      className={`fixed inset-0 z-[150] flex items-center justify-center transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Card */}
      <div className={`relative z-10 glass rounded-3xl p-8 max-w-sm w-full mx-4 border border-orange-500/30 transform transition-all duration-300 ${
        visible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'
      }`}>

        {/* Fire animation */}
        <div className="flex justify-center mb-2">
          <Lottie
            animationData={streakAnimation}
            loop
            style={{ width: 130, height: 130 }}
          />
        </div>

        {/* Content */}
        <div className="text-center space-y-3">
          <div>
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-1">
              🔥 Streak Extended!
            </p>
            <h2 className="text-4xl font-black text-white">
              {streak} Day{streak !== 1 ? 's' : ''}
            </h2>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed">{getMessage()}</p>

          {/* Milestone badge */}
          {streak > 1 && streak % 7 === 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
              <span className="text-base">🏆</span>
              <span className="text-xs font-bold text-orange-400">
                {streak / 7} Week{streak / 7 > 1 ? 's' : ''} Milestone!
              </span>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={handleClose}
            className="w-full mt-2 py-3 rounded-2xl font-semibold text-sm text-white transition-all hover:opacity-80 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              boxShadow: '0 4px 20px rgba(249,115,22,0.3)',
            }}
          >
            Let's Go! 🔥
          </button>
        </div>
      </div>
    </div>
  );
}