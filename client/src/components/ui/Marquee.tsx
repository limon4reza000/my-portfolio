import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  mask?: boolean;
  gapClass?: string;
}

/** Infinite horizontal loop. Content is rendered twice and translated -50%. */
export function Marquee({ children, duration = 40, reverse, className, mask = true, gapClass = 'gap-10' }: MarqueeProps) {
  const style = {
    '--marquee-duration': `${duration}s`,
    animationDirection: reverse ? 'reverse' : undefined,
  } as CSSProperties;

  return (
    <div className={cn('marquee overflow-hidden', mask && 'marquee-mask', className)}>
      <div className="flex w-max animate-marquee" style={style}>
        <div className={cn('flex shrink-0 items-center pr-10', gapClass)}>{children}</div>
        <div className={cn('flex shrink-0 items-center pr-10', gapClass)} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
