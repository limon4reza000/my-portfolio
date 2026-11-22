import type { Experience } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Text } from './Text';

const KIND_LABEL: Record<string, string> = {
  education: 'Education',
  learning: 'Learning',
  experience: 'Experience',
  project: 'Project experience',
};

/** Description text: blank line = new paragraph, lines starting with "- " = bullet list. */
function RichDescription({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/);
  return (
    <div className="mt-2 space-y-2 text-[14px] leading-relaxed text-muted">
      {blocks.map((block, bi) => {
        const lines = block.split('\n');
        const bullets = lines.filter((l) => l.trim().startsWith('- '));
        const intro = lines.filter((l) => !l.trim().startsWith('- ')).join(' ').trim();
        return (
          <div key={bi}>
            {intro && (
              <p>
                <Text>{intro}</Text>
              </p>
            )}
            {bullets.length > 0 && (
              <ul className={cn('space-y-1', intro && 'mt-1.5')}>
                {bullets.map((b, li) => (
                  <li key={li} className="flex gap-2">
                    <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-lime" />
                    <span>
                      <Text>{b.trim().slice(2)}</Text>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Education & experience entries (reference style). Pure CSS hover: only the entry under the
 * pointer is highlighted (lime year + label, lime bar drawing top → bottom, bright title).
 * Keyboard users get the same highlight via :focus-visible (never stuck after a mouse click).
 */
export function ExperienceList({ experiences }: { experiences: Experience[] }) {
  const ease = 'transition-colors duration-300 ease-out';

  return (
    <ol>
      {experiences.map((e, i) => {
        return (
          <li key={e.id} className={cn(i > 0 && 'border-t border-hairline py-1.5', i === 0 && 'pb-1.5')}>
            {/* Hover / keyboard-focus target: the whole entry lights up (soft card + border). */}
            <div
              tabIndex={0}
              className={cn(
                'group -mx-3 grid cursor-default grid-cols-[64px_1fr] gap-3 rounded-xl px-3 py-4 outline-none sm:grid-cols-[72px_1fr] sm:gap-4',
                'transition-[background-color,box-shadow] duration-300 ease-out',
                'hover:bg-card hover:shadow-[inset_0_0_0_1px_#283238] focus-visible:bg-card focus-visible:shadow-[inset_0_0_0_1px_#283238]',
              )}
            >
            <div className="pt-0.5">
              {e.year && (
                <span className={cn('block font-display text-[16px] font-semibold text-muted group-hover:text-lime group-focus-visible:text-lime', ease)}>
                  <Text>{e.year}</Text>
                </span>
              )}
              <span
                className={cn('mt-1 block font-mono text-[9px] uppercase leading-tight tracking-[0.08em] text-muted/80 group-hover:text-lime/80 group-focus-visible:text-lime/80', ease)}
              >
                {KIND_LABEL[e.kind] ?? e.kind}
              </span>
            </div>
            {/* Lime side bar: draws in top → bottom when the entry becomes active, and slides out
                downward when it stops being active. Its space is always reserved, so nothing shifts. */}
            <div className="relative min-w-0 pl-[18px]">
              <span
                aria-hidden
                className={cn(
                  'pointer-events-none absolute inset-y-0 left-0 w-[2px] rounded-full bg-lime transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  'origin-bottom scale-y-0 group-hover:origin-top group-hover:scale-y-100 group-focus-visible:origin-top group-focus-visible:scale-y-100',
                )}
              />
              <p className={cn('font-display text-[17px] font-semibold leading-snug text-fg/85 group-hover:text-fg group-focus-visible:text-fg', ease)}>
                <Text>{e.title}</Text>
              </p>
              <p className="mt-1 flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2">
                {e.company && (
                  <span className="text-[13px] font-medium text-lime">
                    <Text>{e.company}</Text>
                  </span>
                )}
                {e.company && (
                  <span className="hidden text-muted/60 sm:inline" aria-hidden>
                    •
                  </span>
                )}
                <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                  <Text>{e.period}</Text>
                </span>
              </p>
              <div className="max-w-[520px] [&>div]:transition-colors [&>div]:duration-300 group-hover:[&>div]:text-fg/80 group-focus-visible:[&>div]:text-fg/80">
                <RichDescription text={e.description} />
              </div>
            </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
