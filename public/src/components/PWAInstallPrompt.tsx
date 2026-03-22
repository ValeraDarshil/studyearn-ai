// src/components/PWAInstallPrompt.tsx
// "Install App" banner — shows when browser supports PWA install

import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if already installed or dismissed
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show after 30 seconds — don't annoy immediately
      setTimeout(() => setShow(true), 30000);
    };

    window.addEventListener('beforeinstallprompt', handler as any);
    return () => window.removeEventListener('beforeinstallprompt', handler as any);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('pwa-prompt-dismissed', '1');
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-[300]
      glass rounded-2xl border border-purple-500/30 p-4 shadow-2xl
      animate-slide-up"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white mb-0.5">Install StudyEarn AI</p>
          <p className="text-xs text-slate-400">Add to home screen for faster access & offline use!</p>
        </div>
        <button onClick={handleDismiss} className="text-slate-500 hover:text-white transition-colors flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleInstall}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-white
            bg-gradient-to-r from-purple-600 to-purple-500 hover:opacity-90 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Install App
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400
            bg-white/5 hover:bg-white/10 transition-all"
        >
          Later
        </button>
      </div>
    </div>
  );
}