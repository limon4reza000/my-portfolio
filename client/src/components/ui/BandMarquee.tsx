import type { CSSProperties } from 'react';

/**
 * Large scrolling word band, e.g. "LET’S WORK TOGETHER ✦" (reference style):
 * dark-grey display type on the page background, lime ✦ separators, edges faded out.
 * Space Grotesk 700 (reference: 88px; tuned down to 64px), -0.045em, colour #202a31,
 * star at 0.55em, 28px gaps, 12% edge fade. Scales down on smaller screens.
 */
export function BandMarquee({ text, reverse, duration = 40 }: { text: string; reverse?: boolean; duration?: number }) {
  const items = Array.from({ length: 4 });
  const mask = 'linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)';

  const group = (hidden?: boolean) => (
    <div className="flex shrink-0 items-center gap-7 pr-7" aria-hidden={hidden || undefined}>
      {items.map((_, i) => (
        <span key={i} className="flex items-center gap-7">
          <span className="whitespace-nowrap">{text}</span>
          <span aria-hidden className="inline-flex text-[0.55em] leading-none tracking-normal text-lime">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="marquee flex w-full overflow-hidden py-2 font-display text-[36px] font-bold uppercase leading-[1.15] tracking-[-0.045em] text-raised md:text-[48px] lg:text-[64px]"
      style={{ maskImage: mask, WebkitMaskImage: mask } as CSSProperties}
    >
      <span className="sr-only">{text}</span>
      <div
        className="flex shrink-0 animate-marquee"
        aria-hidden
        style={{ '--marquee-duration': `${duration}s`, animationDirection: reverse ? 'reverse' : undefined } as CSSProperties}
      >
        {group()}
        {group(true)}
      </div>
    </div>
  );
}
