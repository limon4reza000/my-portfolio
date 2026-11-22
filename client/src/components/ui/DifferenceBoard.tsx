'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Comparison } from '@/lib/types';
import { cn } from '@/lib/utils';

type Side = 'typical' | 'mine';

const EASE = 'cubic-bezier(0.22,1,0.36,1)';

/**
 * "The difference" board (reference style): a segmented toggle switches every row between
 * the typical approach (✕, struck-through) and mine (✓, bold), with a staggered crossfade.
 * Starts on "typical" and flips to "mine" once when it scrolls into view; any tap takes over.
 */
export function DifferenceBoard({ comparisons }: { comparisons: Comparison[] }) {
  const [side, setSide] = useState<Side>('typical');
  const touched = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSide('mine');
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timer = setTimeout(() => !touched.current && setSide('mine'), 1100);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const choose = (s: Side) => {
    touched.current = true;
    setSide(s);
  };
  const mine = side === 'mine';

  return (
    <div ref={ref} className="flex h-full min-w-0 flex-col gap-[18px] rounded-[20px] bg-panel p-5 shadow-[inset_0_0_0_1px_#202a31] sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">The difference</span>
        <span className={cn('min-w-0 font-mono text-[11px] tracking-[0.06em] transition-colors duration-[400ms] sm:truncate', mine ? 'text-lime' : 'text-muted')}>
          {mine ? 'Same problem. Better solutions.' : 'Same problem. Flat result.'}
        </span>
      </div>

      {/* Segmented toggle */}
      <div role="group" aria-label="Compare approaches" className="relative flex rounded-full bg-ink p-1 shadow-[inset_0_0_0_1px_#202a31]">
        <span
          aria-hidden
          className="absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-full"
          style={{
            background: mine ? '#b7f36b' : '#3a4750',
            transform: mine ? 'translateX(100%)' : 'translateX(0)',
            transition: `transform 0.55s ${EASE}, background 0.4s ${EASE}`,
          }}
        />
        {(
          [
            ['typical', 'Common Approach'],
            ['mine', 'My Approach'],
          ] as const
        ).map(([key, label]) => {
          const active = side === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => choose(key)}
              className={cn(
                'relative z-[1] flex-1 whitespace-nowrap rounded-full px-3 py-2.5 text-center text-[14px] font-medium transition-colors duration-[400ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime sm:px-3.5',
                active ? (key === 'mine' ? 'text-ink' : 'text-fg') : 'text-muted hover:text-fg',
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Rows */}
      <ul className="flex flex-col">
        {comparisons.map((c, i) => {
          const delay = `${i * 60}ms`;
          return (
            <li
              key={c.id}
              className={cn('grid gap-2 py-[17px] sm:grid-cols-[132px_1fr] sm:items-center sm:gap-4', i > 0 && 'shadow-[inset_0_1px_0_0_#202a31]')}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">{c.label}</span>
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                    mine ? 'bg-lime text-ink' : 'bg-ink text-muted shadow-[inset_0_0_0_1px_#283238]',
                  )}
                  style={{ transition: `background 0.4s ${EASE} ${delay}, transform 0.5s ${EASE} ${delay}`, transform: mine ? 'scale(1)' : 'scale(0.92)' }}
                >
                  {mine ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  )}
                </span>
                {/* Both texts share one grid cell and crossfade */}
                <span className="relative grid min-w-0 flex-1">
                  <span
                    aria-hidden={mine}
                    className="text-[15px] leading-[1.35] text-muted line-through decoration-[rgba(146,155,159,0.5)] [grid-area:1/1]"
                    style={{
                      opacity: mine ? 0 : 1,
                      transform: mine ? 'translateY(-8px)' : 'translateY(0)',
                      transition: `opacity 0.4s ${EASE} ${delay}, transform 0.5s ${EASE} ${delay}`,
                    }}
                  >
                    {c.typical}
                  </span>
                  <span
                    aria-hidden={!mine}
                    className="font-display text-[16px] font-medium leading-[1.35] text-fg [grid-area:1/1] sm:text-[17px]"
                    style={{
                      opacity: mine ? 1 : 0,
                      transform: mine ? 'translateY(0)' : 'translateY(8px)',
                      transition: `opacity 0.4s ${EASE} ${delay}, transform 0.5s ${EASE} ${delay}`,
                    }}
                  >
                    {c.mine}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* CTA inside the board */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3.5 rounded-[14px] bg-ink p-[18px] shadow-[inset_0_0_0_1px_#202a31]">
        <span className="flex-[1_1_200px] font-display text-[17px] font-medium leading-[1.3] text-fg">Have an idea or an opportunity in mind?</span>
        <Link
          href="/#contact"
          className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-lime px-[18px] py-3 text-[14px] font-semibold text-ink transition-transform duration-[400ms] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:w-auto"
        >
          Get in Touch <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
