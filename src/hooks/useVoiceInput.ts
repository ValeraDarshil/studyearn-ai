// ─────────────────────────────────────────────────────────────
// useVoiceInput — Web Speech API hook
// Hindi + English + Hinglish support
// Works on: Chrome, Edge, Android Chrome, iOS Safari (14.5+)
// ─────────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useEffect } from 'react';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'unsupported';

interface UseVoiceInputOptions {
  onTranscript: (text: string) => void;  // final text milne pe
  onInterim?:   (text: string) => void;  // real-time preview
  lang?: string;                          // default: 'hi-IN' (Hindi)
}

export function useVoiceInput({ onTranscript, onInterim, lang = 'hi-IN' }: UseVoiceInputOptions) {
  const [state,        setState]       = useState<VoiceState>('idle');
  const [interimText,  setInterimText] = useState('');
  const [error,        setError]       = useState('');
  const recognitionRef = useRef<any>(null);
  const accumulatedRef = useRef(''); // jo already type kiya hua hai usse preserve karo

  // Check support
  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSupported) setState('unsupported');
  }, [isSupported]);

  const startListening = useCallback((existingText = '') => {
    if (!isSupported) { setError('Voice input is not supported in this browser.'); return; }
    if (state === 'listening') return;

    accumulatedRef.current = existingText;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous     = true;   // jab tak stop na karo
    recognition.interimResults = true;   // real-time results
    recognition.lang           = lang;   // Hindi by default
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setState('listening');
      setError('');
      setInterimText('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final   = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      if (final) {
        accumulatedRef.current += final;
        onTranscript(accumulatedRef.current.trim());
      }

      setInterimText(interim);
      onInterim?.(interim);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        setError('No speech detected. Try again.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow mic access.');
      } else if (event.error === 'network') {
        setError('Network error. Check your connection.');
      } else {
        setError(`Error: ${event.error}`);
      }
      setState('idle');
    };

    recognition.onend = () => {
      setState('idle');
      setInterimText('');
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, state, lang, onTranscript, onInterim]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setState('idle');
    setInterimText('');
  }, []);

  const toggleListening = useCallback((existingText = '') => {
    if (state === 'listening') {
      stopListening();
    } else {
      startListening(existingText);
    }
  }, [state, startListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { recognitionRef.current?.stop(); };
  }, []);

  return {
    state,
    isListening:   state === 'listening',
    isUnsupported: state === 'unsupported',
    interimText,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
}