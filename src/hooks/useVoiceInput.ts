// ─────────────────────────────────────────────────────────────
// useVoiceInput — Web Speech API hook (Fixed & Reliable)
// Hindi + English + Hinglish support
// ─────────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useEffect } from 'react';

export type VoiceState = 'idle' | 'listening' | 'unsupported';

interface UseVoiceInputOptions {
  onTranscript: (text: string) => void;
  onInterim?:   (text: string) => void;
  lang?: string;
}

export function useVoiceInput({ onTranscript, onInterim, lang = 'en-IN' }: UseVoiceInputOptions) {
  const [state,       setState]       = useState<VoiceState>('idle');
  const [interimText, setInterimText] = useState('');
  const [error,       setError]       = useState('');

  const recognitionRef = useRef<any>(null);
  const accumulatedRef = useRef('');
  const isListeningRef = useRef(false);
  const langRef        = useRef(lang);

  useEffect(() => { langRef.current = lang; }, [lang]);

  useEffect(() => {
    const supported = typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    if (!supported) setState('unsupported');
  }, []);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    try { recognitionRef.current?.stop(); } catch {}
    recognitionRef.current = null;
    setState('idle');
    setInterimText('');
  }, []);

  const startListening = useCallback((existingText = '') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice input not supported. Use Chrome browser.');
      return;
    }

    try { recognitionRef.current?.stop(); } catch {}

    accumulatedRef.current = existingText ? existingText + ' ' : '';
    setError('');
    setInterimText('');

    const recognition = new SpeechRecognition();
    recognition.continuous     = false;
    recognition.interimResults = true;
    recognition.lang           = langRef.current;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListeningRef.current = true;
      setState('listening');
      setError('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final   = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += t + ' ';
        } else {
          interim += t;
        }
      }

      if (interim) {
        setInterimText(interim);
        onInterim?.(interim);
      }
      if (final.trim()) {
        accumulatedRef.current += final;
        onTranscript(accumulatedRef.current.trim());
        setInterimText('');
      }
    };

    recognition.onerror = (event: any) => {
      isListeningRef.current = false;
      setState('idle');
      setInterimText('');
      if (event.error === 'no-speech') setError('No speech detected. Try again.');
      else if (event.error === 'not-allowed' || event.error === 'permission-denied')
        setError('Mic permission denied. Allow mic in browser settings.');
      else if (event.error === 'network') setError('Network error. Check connection.');
      else if (event.error === 'audio-capture') setError('Microphone not found.');
      else if (event.error !== 'aborted') setError('Voice error: ' + event.error);
    };

    recognition.onend = () => {
      // Auto-restart if user didn't manually stop
      // This makes it feel like continuous mode but is more reliable
      if (isListeningRef.current) {
        try {
          recognitionRef.current = null;
          startListening(accumulatedRef.current.trim());
          return;
        } catch {}
      }
      isListeningRef.current = false;
      setState('idle');
      setInterimText('');
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setError('Could not start voice input. Try again.');
      setState('idle');
    }
  }, [onTranscript, onInterim]);

  const toggleListening = useCallback((existingText = '') => {
    if (isListeningRef.current) stopListening();
    else startListening(existingText);
  }, [startListening, stopListening]);

  useEffect(() => {
    return () => { try { recognitionRef.current?.stop(); } catch {} };
  }, []);

  return { state, isListening: state === 'listening', isUnsupported: state === 'unsupported',
           interimText, error, startListening, stopListening, toggleListening };
}