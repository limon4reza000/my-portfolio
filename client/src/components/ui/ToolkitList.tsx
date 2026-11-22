'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { TechItem } from '@/config/techStack';
import { cn } from '@/lib/utils';

/** Number of small segments in each progress bar. */
const SEGMENTS = 24;
/** Per-segment delay of the left → right fill; the % counter runs for the same total time. */
const SEGMENT_STEP_MS = 20;
const SEGMENT_FADE_MS = 120;
const FILL_MS = SEGMENTS * SEGMENT_STEP_MS + SEGMENT_FADE_MS; // ≈ 600ms
/** Natural ease used for the card lift. */
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

interface Props {
  /** Data from src/config/techStack.ts — no values are hard-coded here. */
  items: TechItem[];
  /** Official logos rendered on the server: `brand` (idle, colour) and `mono` (active, on the lime box). */
  icons: { brand: ReactNode; mono: ReactNode }[];
}

const clampPct = (n: number) => Math.min(100, Math.max(0, n));

/** Counts 0 → target while mounted (ease-out), in sync with the bar fill. */
function CountUp({ target, delay = 0 }: { target: number; delay?: number }) {
  const [value, setValue] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / FILL_MS);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => (raf.current = requestAnimationFrame(tick)), delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf.current);
    };
  }, [target, delay]);
  return <>{value}%</>;
}

/**
 * Interactive tech-stack cards (reference style).
 *  Idle:   icon on a dark box · description · "—" · dark bar.
 *  Active: lime icon box · description swaps to the level (if any) · % counts up from 0 ·
 *          bar lights up left → right to the exact percentage, then everything holds.
 *  Desktop = hover (card also lifts) and keyboard Tab focus.
 *  Touch screens (no hover): every card plays the animation automatically, one after another,
 *  when the toolkit scrolls into view, and then stays in that filled state.
 *  No percentage → highlight only (no counter, no bar). No level → description stays.
 */
export function ToolkitList({ items, icons }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Touch screens: reveal every card once when the list scrolls into view, then keep it.
  const listRef = useRef<HTMLUListElement>(null);
  const [revealAll, setRevealAll] = useState(false);
  useEffect(() => {
    if (canHover || revealAll || !listRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setRevealAll(true);
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(listRef.current);
    return () => io.disconnect();
  }, [canHover, revealAll]);

  return (
    <ul ref={listRef} className="flex flex-1 flex-col justify-between gap-2" onMouseLeave={() => canHover && setActive(null)}>
      {items.map((t, i) => {
        // lifted = hovered / keyboard-focused (full effect incl. lift); on = any "shown" state
        const lifted = active === i;
        const on = lifted || revealAll;
        // On touch screens the cards fill one after another
        const cardDelay = revealAll && !lifted ? i * 110 : 0;
        const hasPct = typeof t.percentage === 'number';
        const pct = hasPct ? clampPct(t.percentage!) : 0;
        const filled = Math.round((pct / 100) * SEGMENTS);
        return (
          <li key={t.name}>
            <div
              data-tech-card
              role="button"
              tabIndex={0}
              aria-pressed={lifted}
              aria-label={`${t.name}: ${t.description}${t.level ? `, ${t.level}` : ''}${hasPct ? `, ${pct}%` : ''}`}
              onMouseEnter={() => canHover && setActive(i)}
              // Keyboard focus only (taps/clicks also focus, but are handled by onClick / hover).
              onFocus={(e) => e.currentTarget.matches(':focus-visible') && setActive(i)}
              onBlur={() => setActive((a) => (a === i ? null : a))}
              className={cn(
                'relative cursor-default rounded-[10px] border px-3 py-2.5 outline-none will-change-transform motion-reduce:!transform-none',
                lifted
                  ? 'z-10 -translate-y-[5px] scale-[1.02] border-lime/60 bg-raised shadow-[0_10px_28px_-12px_rgba(183,243,107,0.45),0_0_0_1px_rgba(183,243,107,0.12)]'
                  : on
                    ? 'translate-y-0 scale-100 border-lime/30 bg-card'
                    : 'translate-y-0 scale-100 border-line bg-ink',
              )}
              style={{
                transition: `transform 200ms ${EASE}, border-color 220ms ease-out, background-color 220ms ease-out, box-shadow 220ms ease-out`,
                transitionDelay: cardDelay ? `0ms, ${cardDelay}ms, ${cardDelay}ms, ${cardDelay}ms` : undefined,
              }}
            >
              <div className="flex items-center gap-3">
                {/* Icon box: dark → lime (with glow); colour logo → dark logo */}
                <span
                  className={cn(
                    'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-[background-color,box-shadow,transform] duration-[220ms] ease-out motion-reduce:!transform-none',
                    lifted ? 'scale-[1.08] bg-lime text-ink shadow-[0_0_18px_rgba(183,243,107,0.5)]' : on ? 'scale-100 bg-lime text-ink' : 'scale-100 bg-card',
                  )}
                  style={{ transitionDelay: `${cardDelay}ms` }}
                >
                  <span className={cn('transition-opacity duration-200 ease-out', on ? 'opacity-0' : 'opacity-100')} style={{ transitionDelay: `${cardDelay}ms` }}>{icons[i]?.brand}</span>
                  <span className={cn('absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-out', on ? 'opacity-100' : 'opacity-0')} style={{ transitionDelay: `${cardDelay}ms` }}>
                    {icons[i]?.mono}
                  </span>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold leading-tight">{t.name}</span>
                  {/* Description → level (only if a level is provided) */}
                  <span className="relative mt-0.5 block h-[16px] overflow-hidden">
                    <span
                      className={cn(
                        'absolute inset-0 truncate text-[12px] leading-[16px] text-muted transition-[transform,opacity] duration-[220ms] ease-out',
                        on && t.level ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100',
                      )}
                      style={{ transitionDelay: `${cardDelay}ms` }}
                    >
                      {t.description}
                    </span>
                    {t.level && (
                      <span
                        className={cn(
                          'absolute inset-0 truncate font-mono text-[11px] font-semibold uppercase leading-[16px] tracking-[0.08em] text-lime transition-[transform,opacity] duration-[220ms] ease-out',
                          on ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
                        )}
                        style={{ transitionDelay: `${cardDelay}ms` }}
                      >
                        {t.level}
                      </span>
                    )}
                  </span>
                </span>

                {/* "—" when idle; the percentage counts up while active (only if provided) */}
                <span className={cn('shrink-0 font-mono text-[12px] font-semibold tabular-nums', on && hasPct ? 'text-fg' : 'text-muted')}>
                  {on && hasPct ? <CountUp key={`${t.name}-${lifted ? 'hover' : 'reveal'}`} target={pct} delay={cardDelay} /> : '—'}
                </span>
              </div>

              {/* Segmented bar — only when a percentage is provided */}
              {hasPct && (
                <div
                  className="mt-2.5 flex h-[3px] gap-[2px]"
                  role="meter"
                  aria-label={`${t.name} skill level`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                >
                  {Array.from({ length: SEGMENTS }, (_, s) => {
                    const lit = on && s < filled;
                    return (
                      <span
                        key={s}
                        className={cn(
                          'flex-1 rounded-full transition-[background-color,box-shadow] ease-out motion-reduce:transition-none',
                          lit ? 'bg-lime shadow-[0_0_5px_rgba(183,243,107,0.55)]' : 'bg-line',
                        )}
                        style={{
                          transitionDuration: `${SEGMENT_FADE_MS}ms`,
                          // left → right while filling; everything resets at once when the card is left
                          transitionDelay: lit ? `${cardDelay + s * SEGMENT_STEP_MS}ms` : '0ms',
                          transitionTimingFunction: EASE,
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
