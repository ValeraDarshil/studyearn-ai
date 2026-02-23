// New component: src/components/StreakCelebration.tsx
// Shows animated celebration when streak increases

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import streakAnimation from '../assets/animations/streak-fire.json';

interface StreakCelebrationProps {
  streak: number;
  show: boolean;
  onClose: () => void;
}

export function StreakCelebration({ streak, show, onClose }: StreakCelebrationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${
      visible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Celebration Card */}
      <div className={`relative z-10 glass rounded-3xl p-8 max-w-sm mx-4 border border-orange-500/30 transform transition-all duration-300 ${
        visible ? 'scale-100' : 'scale-90'
      }`}>
        
        {/* Animated Fire */}
        <div className="flex justify-center mb-4">
          <Lottie 
            animationData={streakAnimation}
            loop={true}
            style={{ width: 120, height: 120 }}
          />
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-3xl font-black gradient-text mb-2">
            🔥 {streak} Day Streak!
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            {streak === 1 
              ? "Great start! Come back tomorrow to keep it going!" 
              : streak >= 7 
              ? "Amazing! You're on fire! 🎉" 
              : "Keep it up! Don't break the chain!"}
          </p>
          
          {/* Milestone badges */}
          {streak % 7 === 0 && streak > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
              <span className="text-lg">🏆</span>
              <span className="text-sm font-semibold text-orange-400">
                {streak / 7} Week{streak / 7 > 1 ? 's' : ''} Milestone!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}