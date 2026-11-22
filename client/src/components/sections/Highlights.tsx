'use client';

import { useCallback, useState } from 'react';
import type { Highlight, Visual } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Lightbox, type LightboxItem } from '../ui/Lightbox';
import { Reveal } from '../ui/Reveal';

/** Development Highlights (reference: "Results"): capabilities instead of statistics. */

type Size = 'xl' | 'lg' | 'md';
// Scale the big value down for longer words so it never overflows its card.
function valueSize(value: string, size: Size) {
  const long = value.length > 6;
  if (size === 'xl') return long ? 'text-[46px] sm:text-[72px] md:text-[80px] lg:text-[96px]' : 'text-[64px] sm:text-[96px] md:text-[104px] lg:text-[132px]';
  if (size === 'lg') return long ? 'text-[38px] md:text-[52px]' : 'text-[44px] md:text-[64px]';
  return long ? 'text-[34px] md:text-[44px]' : 'text-[38px] md:text-[52px]';
}

function HighlightCard({ h, size, accent, className }: { h?: Highlight; size: Size; accent?: boolean; className?: string }) {
  if (!h) return null;
  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-2xl border p-5 md:p-6',
        accent ? 'border-lime bg-lime text-ink' : 'border-hairline bg-panel',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={cn('font-mono text-[12px] uppercase tracking-label', accent ? 'text-ink' : 'text-muted')}>{h.label}</span>
        {h.tag && <span className="chip !py-1 !text-[11px]">{h.tag}</span>}
      </div>
      <div className="mt-4 md:mt-8">
        <p
          className={cn(
            'font-display font-semibold leading-[0.9] tracking-tightest',
            valueSize(h.value, size),
            !accent && (size === 'xl' ? 'text-lime' : 'text-fg'),
          )}
        >
          {h.value}
        </p>
        <p className={cn('mt-2 text-[14px] md:mt-3', accent ? 'text-[rgba(9,13,15,0.72)]' : 'text-muted')}>{h.description}</p>
        {h.chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2 md:mt-5">
            {h.chips.map((c) => (
              <span key={c} className="chip !px-2 !py-1 !text-[10px] sm:!px-3 sm:!py-1.5 sm:!text-[11px]">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Highlights({ highlights, visuals }: { highlights: Highlight[]; visuals: Visual[] }) {
  const get = (slot: string) => highlights.find((h) => h.slot === slot);
  const [active, setActive] = useState<LightboxItem | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <section id="highlights" className="section border-t border-hairline">
      <div className="container-x">
        <Reveal className="mb-10 md:mb-14">
          <p className="eyebrow mb-4">Development Highlights</p>
          <h2 className="h-section-lg max-w-[720px]">Capabilities that speak for the work</h2>
          <p className="lede mt-4">What I bring to every build: the features, practices and technical foundations behind it.</p>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <HighlightCard h={get('primary')} size="xl" className="h-full" />
          </Reveal>
          <div className="grid gap-4">
            <Reveal delay={60}>
              <HighlightCard h={get('side1')} size="lg" />
            </Reveal>
            <Reveal delay={120}>
              <HighlightCard h={get('side2')} size="lg" accent />
            </Reveal>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {(['row1', 'row2', 'row3'] as const).map((slot, i) => (
            <Reveal key={slot} delay={i * 60}>
              <HighlightCard h={get(slot)} size="md" className="h-full" />
            </Reveal>
          ))}
        </div>

        {visuals.length > 0 && (
          <Reveal className="mt-16">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-hairline pb-4">
              <span className="font-mono text-[12px] uppercase tracking-label text-fg">Development environment</span>
              <span className="font-mono text-[12px] text-muted">How I work</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {visuals.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActive({ title: v.title, image: v.image })}
                  className="group text-left focus-visible:outline-none"
                >
                  <div className="aspect-[600/380] overflow-hidden rounded-xl border border-hairline bg-card transition group-hover:border-line group-focus-visible:ring-2 group-focus-visible:ring-lime">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.image} alt={v.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <p className="mt-3 text-[14px] text-muted transition-colors group-hover:text-fg">{v.title}</p>
                </button>
              ))}
            </div>
          </Reveal>
        )}
      </div>
      <Lightbox item={active} onClose={close} />
    </section>
  );
}
