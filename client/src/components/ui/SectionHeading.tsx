import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';

interface Props {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  large?: boolean;
  className?: string;
  align?: 'left' | 'center';
  children?: ReactNode;
}

export function SectionHeading({ eyebrow, title, lede, large, className, align = 'left', children }: Props) {
  return (
    <Reveal className={cn('mb-10 md:mb-14', align === 'center' && 'mx-auto max-w-[640px] text-center', className)}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className={large ? 'h-section-lg' : 'h-section'}>{title}</h2>
      {lede && <p className={cn('lede mt-4 max-w-[560px]', align === 'center' && 'mx-auto')}>{lede}</p>}
      {children}
    </Reveal>
  );
}
