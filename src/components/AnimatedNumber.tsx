import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  formatter?: (v: number) => string;
}

export function AnimatedNumber({ value, duration = 1200, className = '', prefix = '', suffix = '', formatter }: Props) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const startValRef = useRef<number>(0);

  useEffect(() => {
    cancelAnimationFrame(frameRef.current);
    startRef.current = performance.now();
    startValRef.current = display;

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValRef.current + (value - startValRef.current) * eased);
      setDisplay(current);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  const formatted = formatter ? formatter(display) : display.toLocaleString();
  return <span className={className}>{prefix}{formatted}{suffix}</span>;
}