import { cn } from '@/lib/utils';

/** Pill with a status dot: lime + pulse when available, red when not. */
export function Availability({ available, text, className }: { available: boolean; text: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-line bg-card/80 px-3 py-1.5 text-[13px] font-medium text-fg',
        className,
      )}
    >
      <span className={cn('dot', available ? 'animate-pulse-dot bg-lime' : 'bg-danger')} />
      {text}
    </span>
  );
}
