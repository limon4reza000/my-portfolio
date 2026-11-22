'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ProcessStep } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Reveal } from '../ui/Reveal';

/** Pause on the finished timeline before looping back to the first stage (ms). */
const END_HOLD_MS = 1600;
const FPS = 30;

const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');

/** ms → "HH:MM:SS" (or "HH:MM:SS:FF" with frames). */
function timecode(ms: number, frames = false) {
  const t = Math.max(0, ms) / 1000;
  const base = `${pad(t / 3600)}:${pad((t % 3600) / 60)}:${pad(t % 60)}`;
  return frames ? `${base}:${pad((t % 1) * FPS)}` : base;
}

/** Gap between timeline bars / stage cards (Tailwind gap-4). */
const COL_GAP = 16;

/**
 * Horizontal position (CSS) of a point inside an n-column grid with COL_GAP gaps:
 * `seg` = column index, `frac` = 0..1 progress across that column.
 */
function colLeft(seg: number, frac: number, n: number) {
  const totalGap = COL_GAP * (n - 1);
  return `calc(${(seg + frac) / n} * (100% - ${totalGap}px) + ${seg * COL_GAP}px)`;
}

type Status = 'done' | 'active' | 'next';

/**
 * Development Process — an auto-playing, editor-style timeline.
 *
 * - Each stage's play time comes from its `duration` (seconds, set in the seed); all bars are equally wide.
 * - A requestAnimationFrame loop moves the playhead and fills each clip; it writes styles
 *   straight to the DOM so React only re-renders when the active stage changes.
 * - Starts when the section scrolls into view, pauses while off-screen, loops at the end.
 * - Clicking a clip or card jumps to that stage; the play/pause button stops all motion
 *   (and it starts paused for visitors who prefer reduced motion).
 */
export function Process({ steps }: { steps: ProcessStep[] }) {
  const durations = useMemo(() => steps.map((s) => Math.max(1, s.duration || 4) * 1000), [steps]);
  const starts = useMemo(() => durations.map((_, i) => durations.slice(0, i).reduce((a, b) => a + b, 0)), [durations]);
  const total = useMemo(() => durations.reduce((a, b) => a + b, 0), [durations]);

  const [active, setActive] = useState(0);
  const [finished, setFinished] = useState(false);

  // DOM targets painted every frame
  const sectionRef = useRef<HTMLElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const clipFillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const railFillRefs = useRef<(HTMLSpanElement | null)[]>([]); // phones: vertical progress under each dot

  // Animation state kept outside React to avoid 60fps re-renders
  const elapsed = useRef(0);
  const holdUntil = useRef(0);
  const inView = useRef(false);
  const playingRef = useRef(true);
  const activeRef = useRef(0);
  const finishedRef = useRef(false);

  const indexAt = useCallback(
    (t: number) => {
      for (let i = starts.length - 1; i >= 0; i--) if (t >= starts[i]) return i;
      return 0;
    },
    [starts],
  );

  const paint = useCallback(
    (t: number) => {
      // Equal-width segments: position = (segment index + progress inside it) / segment count.
      // Durations still control the timing; a longer stage just moves the playhead more slowly.
      const n = durations.length || 1;
      let seg = 0;
      for (let i = starts.length - 1; i >= 0; i--) if (t >= starts[i]) { seg = i; break; }
      const inSeg = durations[seg] ? Math.min(1, Math.max(0, (t - starts[seg]) / durations[seg])) : 0;
      if (playheadRef.current) playheadRef.current.style.left = t >= total ? '100%' : colLeft(seg, inSeg, n);
      durations.forEach((d, i) => {
        const local = `${Math.min(1, Math.max(0, (t - starts[i]) / d)) * 100}%`;
        const fill = clipFillRefs.current[i];
        if (fill) fill.style.width = local;
        const rail = railFillRefs.current[i];
        if (rail) rail.style.height = local;
      });
    },
    [durations, starts, total],
  );

  const goTo = useCallback(
    (i: number) => {
      elapsed.current = starts[i] ?? 0;
      finishedRef.current = false;
      setFinished(false);
      activeRef.current = i;
      setActive(i);
      paint(elapsed.current);
    },
    [paint, starts],
  );

  // Respect reduced-motion: start paused (the visitor can press play).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      playingRef.current = false;
    }
    paint(0);
  }, [paint]);

  // Only advance while the section is visible.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The animation loop.
  useEffect(() => {
    if (!total) return;
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(now - last, 100); // clamp so a backgrounded tab doesn't jump ahead
      last = now;

      if (playingRef.current && inView.current) {
        if (finishedRef.current) {
          if (now >= holdUntil.current) goTo(0); // loop
        } else {
          elapsed.current += dt;
          if (elapsed.current >= total) {
            elapsed.current = total;
            finishedRef.current = true;
            setFinished(true);
            holdUntil.current = now + END_HOLD_MS;
          } else {
            const idx = indexAt(elapsed.current);
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              setActive(idx);
            }
          }
          paint(elapsed.current);
        }
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [goTo, indexAt, paint, total]);


  const statusOf = (i: number): Status => (finished || i < active ? 'done' : i === active ? 'active' : 'next');
  const ticks = [...starts, total];

  return (
    <section ref={sectionRef} id="process" className="section border-t border-hairline">
      <div className="container-x">
        <Reveal className="mb-10 md:mb-14">
          <h2 className="h-section">Development Process</h2>
          <p className="mt-4 max-w-[560px] text-[17px] text-muted md:text-[18px]">
            {steps.length} clear stages on one timeline, from the first plan to a live deployment.
          </p>
        </Reveal>

        {/* ---------- Timeline (desktop) ----------
            Bars share the cards' grid (5 equal columns, 16px gaps), so each bar sits exactly
            above its card. Ruler marks and the playhead use the same column maths. */}
        <Reveal className="relative hidden lg:block">
          {/* Ruler: real timecodes at the start of each bar + a tick every second */}
          <div className="relative h-7">
            <div className="absolute inset-x-0 top-0 h-4 font-mono text-[11px]">
              {ticks.map((t, i) => {
                const isActiveStart = !finished && i === active;
                const last = i === ticks.length - 1;
                return (
                  <span
                    key={i}
                    className={cn(
                      'absolute top-0 whitespace-nowrap transition-colors duration-500',
                      isActiveStart ? 'font-semibold text-lime' : 'text-muted',
                    )}
                    style={{ left: last ? '100%' : colLeft(i, 0, steps.length), transform: last ? 'translateX(-100%)' : 'none' }}
                  >
                    {timecode(t)}
                  </span>
                );
              })}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-2.5" aria-hidden>
              {durations.flatMap((d, seg) => {
                const secs = Math.max(1, Math.round(d / 1000));
                const isLast = seg === durations.length - 1;
                return Array.from({ length: secs + (isLast ? 1 : 0) }, (_, k) => {
                  const boundary = k === 0 || k === secs;
                  return (
                    <span
                      key={`${seg}-${k}`}
                      className={cn('absolute bottom-0 w-px', boundary ? 'h-2.5 bg-muted/70' : 'h-1.5 bg-line')}
                      style={{ left: colLeft(seg, k / secs, steps.length) }}
                    />
                  );
                });
              })}
            </div>
          </div>

          {/* Bars: same grid as the cards below */}
          <div className="relative mt-2">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
              {steps.map((s, i) => {
                const status = statusOf(i);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Jump to stage ${i + 1}: ${s.title}`}
                    className={cn(
                      'relative h-9 min-w-0 overflow-hidden rounded-md border text-left font-mono text-[11px] uppercase tracking-[0.06em] transition-colors duration-500',
                      status === 'active' && 'border-lime/70',
                      status === 'done' && 'border-lime/25',
                      status === 'next' && 'border-line hover:border-[#3a4750]',
                    )}
                  >
                    <span className={cn('absolute inset-0 transition-colors duration-500', status === 'done' ? 'bg-lime/[0.16]' : 'bg-card')} aria-hidden />
                    <span
                      ref={(el) => {
                        clipFillRefs.current[i] = el;
                      }}
                      aria-hidden
                      className={cn('absolute inset-y-0 left-0 w-0', status === 'active' ? 'bg-lime/[0.12]' : 'bg-transparent')}
                    />
                    <span className="relative flex items-center gap-1.5 truncate px-3">
                      <span className="font-semibold text-lime">{pad(i + 1)}</span>
                      <span
                        className={cn(
                          'truncate transition-colors duration-500',
                          status === 'active' ? 'font-semibold text-fg' : status === 'done' ? 'text-muted' : 'text-muted/80',
                        )}
                      >
                        {s.title}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Playhead: pin handle + line, positioned with the same column maths */}
            <div ref={playheadRef} aria-hidden className="pointer-events-none absolute -bottom-1.5 -top-9 z-10 w-0" style={{ left: '0%' }}>
              <svg className="absolute -left-[6px] top-0 drop-shadow-[0_0_6px_rgba(183,243,107,0.6)]" width="12" height="14" viewBox="0 0 12 14" fill="#b7f36b">
                <path d="M2 0h8a2 2 0 0 1 2 2v6.2a1.5 1.5 0 0 1-.55 1.16L6 14 .55 9.36A1.5 1.5 0 0 1 0 8.2V2a2 2 0 0 1 2-2z" />
              </svg>
              <span className="absolute -left-px bottom-0 top-3 w-[2px] bg-lime shadow-[0_0_10px_rgba(183,243,107,0.55)]" />
            </div>
          </div>
        </Reveal>

        {/* ---------- Stage cards ---------- */}
        {/* Phones/tablets: all 5 cards stacked; the vertical rail animates and selects them in turn. Desktop: 5 cards in a row. */}
        <ol
          aria-label="Development stages"
          className="relative grid gap-0 lg:mt-4 lg:grid-cols-5 lg:gap-4"
        >
          {steps.map((s, i) => {
            const status = statusOf(i);
            return (
              <Reveal
                as="li"
                key={s.id}
                delay={i * 70}
                className="pb-4 last:pb-0 lg:pb-0"
              >
                {/* ----- Phones/tablets: vertical rail + card (reference mobile style) ----- */}
                <div className="grid grid-cols-[20px_1fr] gap-3 lg:hidden">
                  <div className="relative" aria-hidden>
                    <span
                      className={cn(
                        'absolute left-1/2 top-[24px] h-3 w-3 -translate-x-1/2 rounded-full transition-all duration-500',
                        status === 'next' ? 'bg-line' : 'bg-lime',
                        status === 'active' && 'shadow-[0_0_12px_rgba(183,243,107,0.75)]',
                      )}
                    />
                    {/* Track; the lime fill grows top→bottom while this stage plays (painted each frame). */}
                    <span
                      className={cn(
                        'absolute left-1/2 top-[42px] w-[2px] -translate-x-1/2 overflow-hidden rounded-full bg-line',
                        i < steps.length - 1 ? '-bottom-[18px]' : 'bottom-0',
                      )}
                    >
                      <span
                        ref={(el) => {
                          railFillRefs.current[i] = el;
                        }}
                        className="absolute inset-x-0 top-0 h-0 rounded-full bg-lime shadow-[0_0_8px_rgba(183,243,107,0.8)]"
                      />
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={status === 'active' ? 'step' : undefined}
                    className={cn(
                      'w-full rounded-2xl border p-4 text-left transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime',
                      status === 'active' && 'border-lime/40 bg-panel shadow-[0_14px_40px_-18px_rgba(183,243,107,0.35)]',
                      status === 'done' && 'border-hairline bg-panel/60',
                      status === 'next' && 'border-hairline bg-panel',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={cn(
                          'font-display text-[30px] font-semibold leading-none tracking-tight3 transition-colors duration-500',
                          status === 'active' ? 'text-lime' : status === 'done' ? 'text-lime/70' : 'text-lime/40',
                        )}
                      >
                        {pad(i + 1)}
                      </span>
                      <span
                        className={cn(
                          'font-mono text-[10px] uppercase tracking-[0.08em] transition-colors duration-500',
                          status === 'active' ? 'rounded-full bg-lime px-2.5 py-1 text-ink' : 'rounded-md border border-line px-2 py-1 text-muted',
                        )}
                      >
                        {status === 'active' ? 'In progress' : status === 'done' ? 'Done' : 'Up next'}
                      </span>
                    </div>
                    <h3
                      className={cn(
                        'mt-4 font-display text-[19px] font-medium tracking-tight2 transition-colors duration-500',
                        status === 'active' ? 'text-fg' : status === 'done' ? 'text-fg/70' : 'text-fg/80',
                      )}
                    >
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{s.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.tags.map((t) => (
                        <span key={t} className="rounded-[4px] border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 border-t border-hairline pt-3">
                      <p className="font-mono text-[10px] uppercase tracking-label text-muted">Outcome</p>
                      <p className={cn('mt-1 text-[14px] font-semibold', status === 'done' ? 'text-fg/70' : 'text-fg/90')}>{s.deliverable}</p>
                    </div>
                  </button>
                </div>

                {/* ----- Desktop card ----- */}
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={status === 'active' ? 'step' : undefined}
                  className={cn(
                    'relative hidden h-full w-full flex-col overflow-hidden rounded-2xl border bg-panel p-5 text-left transition-all duration-500 ease-out lg:flex',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime',
                    status === 'active' && 'border-lime shadow-[0_14px_40px_-16px_rgba(183,243,107,0.35)] lg:-translate-y-1',
                    status === 'done' && 'border-lime/20',
                    status === 'next' && 'border-hairline hover:border-line',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[12px] text-lime">{pad(i + 1)}</span>
                    <span
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-2 py-1 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors duration-500',
                        status === 'active' && 'bg-lime/[0.16] text-lime',
                        status === 'done' && 'bg-lime/[0.08] text-lime/80',
                        status === 'next' && 'bg-card text-muted',
                      )}
                    >
                      {status === 'done' ? (
                        <span aria-hidden>✓</span>
                      ) : (
                        <span className={cn('dot !h-1.5 !w-1.5', status === 'active' ? 'animate-pulse-dot bg-lime' : 'bg-muted')} />
                      )}
                      {status === 'active' ? 'In progress' : status === 'done' ? 'Done' : 'Up next'}
                    </span>
                  </div>

                  <h3
                    className={cn(
                      'mt-5 font-display text-[21px] font-medium tracking-tight2 transition-colors duration-500',
                      status === 'next' ? 'text-fg/80' : 'text-fg',
                    )}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <span key={t} className="rounded-md border border-line bg-card px-2 py-1 text-[12px]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-5">
                    <div
                      className={cn(
                        'rounded-xl border border-dashed p-3 transition-colors duration-500',
                        status === 'active' ? 'border-lime/40' : 'border-line',
                      )}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-label text-lime">Outcome</p>
                      <p className="mt-1 text-[13px] text-fg/90">{s.deliverable}</p>
                    </div>
                  </div>

                </button>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
