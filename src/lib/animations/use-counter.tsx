'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface UseCounterOptions {
  end: number;
  duration?: number;
  start?: number;
  enableScrollTrigger?: boolean;
}

export function useCounter({
  end,
  duration = 2000,
  start = 0,
  enableScrollTrigger = true
}: UseCounterOptions) {
  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  const animateCounter = useCallback(() => {
    let startTime: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * (end - start) + start));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [duration, end, start]);

  useEffect(() => {
    if (!enableScrollTrigger) {
      // Start animation immediately
      animateCounter();
      return;
    }

    // Use Intersection Observer for scroll trigger
    const element = elementRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            animateCounter();
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [hasAnimated, enableScrollTrigger, animateCounter]);

  return { count, ref: elementRef };
}

interface CountUpProps {
  end: number;
  duration?: number;
  start?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  enableScrollTrigger?: boolean;
}

export function CountUp({
  end,
  duration = 2000,
  start = 0,
  suffix = '',
  prefix = '',
  className = '',
  enableScrollTrigger = true
}: CountUpProps) {
  const { count, ref } = useCounter({ end, duration, start, enableScrollTrigger });

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
