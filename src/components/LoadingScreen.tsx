// New component: src/components/LoadingScreen.tsx
// Premium loading animation on app startup

import Lottie from 'lottie-react';
import { Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  show: boolean;
}

export function LoadingScreen({ show }: LoadingScreenProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      {/* Animated Orbs */}
      <div className="orb w-[500px] h-[500px] bg-blue-500 top-[-200px] left-[-100px] fixed" />
      <div className="orb w-[400px] h-[400px] bg-purple-600 bottom-[-150px] right-[-150px] fixed" />
      
      {/* Content */}
      <div className="relative z-10 text-center">
        
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Brand */}
        <h1 className="text-4xl font-black text-white mb-2">
          StudyEarn <span className="gradient-text">AI</span>
        </h1>
        <p className="text-slate-400 text-sm mb-8">Loading your learning hub...</p>

        {/* Loading Bar */}
        <div className="w-64 h-2 rounded-full bg-white/10 overflow-hidden mx-auto">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 progress-animate" 
               style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
}