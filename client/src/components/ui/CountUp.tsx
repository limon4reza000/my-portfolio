'use client';

import { useEffect, useRef, useState } from 'react';
import { parseCountable } from '@/lib/utils';

/** Animates "0" -> value (e.g. "2K+", "95%") when scrolled into view. */
export function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const parsed = parseCountable(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!parsed || !ref.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setN(parsed.number);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(parsed.number * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  if (!parsed) return <span>{value}</span>;
  return (
    <span ref={ref} aria-label={value}>
      {parsed.prefix}
      {n.toFixed(parsed.decimals)}
      {parsed.suffix}
    </span>
  );
}
