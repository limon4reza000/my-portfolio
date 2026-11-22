import type { Comparison, Profile, Stat } from '@/lib/types';
import { cn } from '@/lib/utils';
import { DifferenceBoard } from '../ui/DifferenceBoard';
import { Reveal } from '../ui/Reveal';

interface Props {
  profile: Profile & { whyImage?: string };
  pillars: Stat[];
  comparisons: Comparison[];
}

/**
 * "Why Work With Me?" (reference: "Why me?").
 * Left: photo card (public/assets/why.*) with a glass name tag + badge, then four tiles.
 * Right: the toggleable "difference" board.
 */
export function Approach({ profile, pillars, comparisons }: Props) {
  return (
    <section id="approach" className="section border-t border-hairline">
      <div className="container-x">
        <Reveal className="mx-auto mb-10 max-w-[640px] text-center md:mb-14">
          <h2 className="h-section">Why Work With Me?</h2>
          <p className="lede mx-auto mt-4 max-w-[480px]">How I work on every project: what I focus on, and what that changes.</p>
        </Reveal>

        <div className="grid items-stretch gap-3 lg:grid-cols-[0.72fr_1.28fr] lg:gap-4">
          {/* Left: photo card + tiles */}
          <Reveal className="flex min-w-0 flex-col gap-3 lg:h-full">
            <div className="relative aspect-[10/9] overflow-hidden rounded-[20px] bg-ink shadow-[inset_0_0_0_1px_#202a31] lg:aspect-auto lg:min-h-[320px] lg:flex-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.whyImage ?? '/images/why.svg'}
                alt={`${profile.name}, ${profile.title}`}
                loading="lazy"
                decoding="async"
                // Fills the card without stretching. A tall portrait is anchored near the top
                // (only the bottom is trimmed) so the head and shoulders always stay in view.
                className="absolute inset-0 h-full w-full object-cover object-[50%_5%]"
              />
              <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2.5">
                <div className="flex min-w-0 flex-col gap-0.5 rounded-xl bg-[rgba(9,13,15,0.6)] px-3.5 py-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] backdrop-blur-md">
                  <span className="font-display text-[16px] font-semibold leading-tight">{profile.name}</span>
                  <span className="truncate font-mono text-[10px] uppercase tracking-[0.06em] text-muted">{profile.title}</span>
                </div>
                <span className="shrink-0 rounded-full bg-lime px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-ink">
                  ★ Full-Stack
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {pillars.map((s) => (
                <div key={s.id} className="min-w-0 rounded-[14px] bg-panel px-4 py-4 shadow-[inset_0_0_0_1px_#202a31]">
                  <p
                    className={cn(
                      'whitespace-nowrap font-display text-[17px] font-semibold leading-tight tracking-tight2 sm:text-[21px] lg:text-[18px]',
                      s.highlight ? 'text-lime' : 'text-fg',
                    )}
                  >
                    {s.value}
                  </p>
                  <p className="mt-1 truncate text-[13px] text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right: the difference board (stretches to the left column's height on desktop) */}
          <Reveal delay={100} className="min-w-0 lg:h-full">
            <DifferenceBoard comparisons={comparisons} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
