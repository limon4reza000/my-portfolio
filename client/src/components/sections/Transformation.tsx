'use client';

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Reveal } from '../ui/Reveal';

interface Props {
  before: string;
  after: string;
  eyebrow?: string;
  title?: string;
  lede?: string;
  /** Render without its own <section> wrapper (when embedded in another section). */
  embedded?: boolean;
}

/** Before/after drag comparison (reference: "Channel Transformation"). */
export function Transformation({
  before,
  after,
  eyebrow = 'Project Evolution',
  title = 'Same project. A better build.',
  lede = 'Drag the slider to compare the first version with the improved one.',
  embedded,
}: Props) {
  const [pos, setPos] = useState(50);
  const wrap = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    update(e.clientX);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => dragging.current && update(e.clientX);
  const onUp = () => (dragging.current = false);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5));
    if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5));
  };

  return (
    <div className={embedded ? '' : 'section border-t border-hairline'}>
      <div className="container-x grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2 className="h-section">{title}</h2>
          <p className="lede mt-4">{lede}</p>
          <p className="mt-8 font-mono text-[12px] text-fg">← Drag to compare →</p>
        </Reveal>

        <Reveal delay={100}>
          <div
            ref={wrap}
            className="relative aspect-[1200/760] cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-line bg-card"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={after} alt="After" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top" />
            <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={before} alt="Before" draggable={false} className="absolute inset-0 h-full w-full object-cover object-top" />
            </div>

            <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-[rgba(9,13,15,0.72)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.06em] backdrop-blur">
              Before
            </div>
            <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-lime px-3 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink">
              After
            </div>

            <div className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-lime" style={{ left: `${pos}%` }}>
              <button
                type="button"
                role="slider"
                aria-label="Before and after comparison"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(pos)}
                onKeyDown={onKey}
                className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-lime text-[14px] font-bold text-ink shadow-[0_8px_30px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime/40"
              >
                ‹›
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
