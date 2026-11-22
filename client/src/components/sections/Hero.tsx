import Link from 'next/link';
import type { Profile, Stat, Technology } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Marquee } from '../ui/Marquee';
import { Reveal } from '../ui/Reveal';
import { TechIcon } from '../ui/TechIcon';
import { Text } from '../ui/Text';

interface Props {
  profile: Profile;
  stats: Stat[];
  technologies: Technology[];
  showProjects: boolean;
}

/** Keep long stat values inside the 104px-tall cards. */
function statSize(value: string) {
  if (value.length <= 5) return 'text-[40px] laptop:text-[44px]';
  if (value.length <= 8) return 'text-[30px] laptop:text-[32px]';
  return 'text-[24px]';
}

/**
 * Hero — mirrors the reference layout:
 * giant ghost name behind · copy (left) · arched cut-out portrait (centre) · results (right)
 * followed by the centred "worked with" marquee (here: technologies).
 */
export function Hero({ profile, stats, technologies, showProjects }: Props) {
  const platforms = profile.platforms.filter((p) => p.url);

  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-6 sm:px-6 md:px-10 md:pb-20">
      <div className="relative mx-auto flex w-full max-w-container flex-col items-center">
        {/* Giant ghost name */}
        <div className="pointer-events-none w-full select-none laptop:absolute laptop:inset-x-0 laptop:top-0">
          <p
            aria-hidden
            className="whitespace-nowrap text-center font-display text-[length:clamp(36px,14vw,80px)] font-semibold leading-none tracking-tightest text-ghost laptop:text-[length:clamp(40px,10.6vw,120px)]"
          >
            {profile.shortName.split('').map((ch, i) =>
              ch === ' ' ? (
                <span key={i}>{' '}</span>
              ) : (
                <span key={i} className="letter-rise" style={{ animationDelay: `${120 + i * 45}ms` }}>
                  {ch}
                </span>
              ),
            )}
          </p>
        </div>

        {/* Columns */}
        <div className="relative z-[1] flex w-full flex-col items-center gap-10 pt-5 laptop:flex-row laptop:items-end laptop:justify-between laptop:gap-0 laptop:pt-[72px]">
          {/* Copy */}
          <div className="relative z-[2] order-1 flex w-full flex-col items-start gap-[22px] md:max-w-[560px] laptop:order-1 laptop:max-w-[330px] laptop:pb-[32px] laptop:pt-[92px] lg:max-w-[370px]">
            <Reveal delay={80}>
              <h1 className="font-display text-[34px] font-semibold leading-[1.08] tracking-tight3 sm:text-[38px] md:text-[44px] laptop:text-[40px] lg:text-[46px]">{profile.headline}</h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-[16px] leading-relaxed text-muted">
                <Text>{profile.subheadline}</Text>
              </p>
            </Reveal>
            <Reveal delay={200} className="flex w-full flex-wrap gap-2.5">
              {showProjects ? (
                <Link href="/#work" className="btn-primary">
                  View Selected Work
                </Link>
              ) : (
                <Link href="/#about" className="btn-primary">
                  About Me
                </Link>
              )}
              {/* Hover: a lime line traces the border all the way round (SVG stroke animation).
                  Dash > path length so the loop always closes fully despite rounded-corner measuring quirks. */}
              <Link href="/#contact" className="btn-ghost group relative hover:border-line focus-visible:border-line">
                Get in Touch
                <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    rx="8"
                    ry="8"
                    pathLength={100}
                    fill="none"
                    stroke="#b7f36b"
                    strokeWidth="1.5"
                    strokeDasharray="120 120"
                    className="transition-[stroke-dashoffset] duration-700 ease-in-out [stroke-dashoffset:120] group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0]"
                  />
                </svg>
              </Link>
            </Reveal>
          </div>

          {/*
            Arched cut-out portrait (public/assets/hero.png).
            The image keeps its natural aspect ratio (w-full, h-auto): nothing is cropped or
            stretched, whatever the photo's proportions. The arch (rounded top) is the frame; with a
            near-square cut-out its curve stays clear of the hair and ears. It is sized so the head
            rises into the ghost name, like the reference, while copy and results stay layered above it.
            Only a short fade sits over the bottom edge so the photo's hard crop blends into the page.
          */}
          <div className="order-2 flex shrink-0 justify-center laptop:pointer-events-none laptop:absolute laptop:bottom-0 laptop:left-1/2 laptop:z-[1] laptop:-translate-x-1/2">
          <Reveal delay={120}>
            <div className="relative w-[min(118vw,520px)] overflow-hidden rounded-t-full laptop:w-[450px] lg:w-[510px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.heroImage}
                alt={`${profile.name}, ${profile.title}`}
                draggable={false}
                fetchPriority="high"
                className="relative block h-auto w-full select-none"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[16%]"
                style={{ background: 'linear-gradient(#090d0f00 0%, #090d0f 100%)' }}
              />
            </div>
          </Reveal>
          </div>

          {/* Results (right) */}
          <Reveal delay={180} className="relative z-[2] order-3 flex w-full max-w-[340px] flex-col items-end gap-4 laptop:max-w-[300px] laptop:pb-[72px] lg:max-w-[340px]">
            <p className="text-[14px] font-semibold">At a glance</p>
            <div className="flex w-full gap-2.5">
              {stats.map((s) => (
                <div
                  key={s.id}
                  className={cn(
                    'flex h-[104px] flex-1 flex-col justify-between rounded-[14px] px-[18px] py-4',
                    s.highlight ? 'bg-lime text-ink' : 'border border-line bg-card',
                  )}
                >
                  <span className={cn('text-[14px] font-medium', s.highlight ? 'text-ink' : 'text-muted')}>{s.label}</span>
                  <span
                    className={cn(
                      'font-display font-semibold leading-none tracking-tight3',
                      statSize(s.value),
                      s.highlight ? 'text-ink' : 'text-lime',
                    )}
                  >
                    <Text>{s.value}</Text>
                  </span>
                </div>
              ))}
            </div>
            {platforms.length > 0 && (
              <div className="flex w-full items-center justify-between px-0.5 pt-2.5">
                <span className="text-[14px] text-muted">Find me on</span>
                <div className="flex gap-1.5">
                  {platforms.map((p) => (
                    <a
                      key={p.name}
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-[6px] border border-line px-2 py-1 font-mono text-[11px] uppercase tracking-[0.04em] text-fg transition-colors hover:border-lime hover:text-lime"
                    >
                      {p.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </Reveal>
        </div>

        {/* Technologies marquee (reference: "Worked with") */}
        <Reveal className="flex w-full flex-col items-center gap-5 pt-14">
          <span className="font-mono text-[12px] uppercase tracking-label text-muted">Technologies I use</span>
          <Marquee duration={40} className="w-full" gapClass="gap-14">
            {technologies.map((t) => (
              <div key={t.id} className="flex items-center gap-3 whitespace-nowrap">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card">
                  <TechIcon slug={t.icon} fallback={t.name.slice(0, 2)} size={18} />
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-[15px] font-semibold leading-tight">{t.name}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">{t.category}</span>
                </span>
              </div>
            ))}
          </Marquee>
        </Reveal>
      </div>
    </section>
  );
}
