import Link from 'next/link';
import type { Experience, Profile, Skill, Stat } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Reveal } from '../ui/Reveal';
import { ExperienceList } from '../ui/ExperienceList';
import { TechIcon } from '../ui/TechIcon';
import { ToolkitList } from '../ui/ToolkitList';
import { techStack } from '@/config/techStack';
import { Text } from '../ui/Text';

interface Props {
  profile: Profile;
  stats: Stat[];
  experiences: Experience[];
  skills: Skill[];
}

export function About({ profile, stats, experiences, skills }: Props) {
  const firstYear = experiences.map((e) => e.year).filter(Boolean).at(-1);
  const platforms = profile.platforms.filter((p) => p.url);
  const skillGroups = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});

  return (
    <section id="about" className="section pt-6 md:pt-20">
      <div className="container-x">
        {/* Row 1: portrait + introduction / background */}
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Phones/tablets: "About Me" + headline come first, above the photo. */}
          <Reveal className="md:hidden">
            <p className="eyebrow mb-4">About Me</p>
            <h2 className="font-display text-[length:clamp(20px,6.4vw,32px)] font-medium leading-[1.1] tracking-tight3">{profile.aboutHeadline}</h2>
          </Reveal>

          <Reveal className="relative">
            {/* About photo (public/assets/about.png). The frame takes the photo's own aspect
                ratio (w-full, h-auto), so the full image is shown, uncropped and unscaled in quality. */}
            <div className="overflow-hidden rounded-[20px] border border-hairline bg-card md:sticky md:top-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.aboutImage} alt={`${profile.name} sitting on a rock in the misty hills`} className="block h-auto w-full" loading="lazy" decoding="async" />
            </div>
          </Reveal>

          <div>
            {/* Desktop: heading sits beside the photo (hidden on phones, shown above the photo instead). */}
            <Reveal className="hidden md:block">
              <p className="eyebrow mb-4">About Me</p>
              <h2 className="font-display text-[40px] font-medium leading-[1.06] tracking-tight3 lg:text-[46px]">{profile.aboutHeadline}</h2>
            </Reveal>
            {/* Intro: its own card on phones/tablets; plain text beside the photo on desktop. */}
            <Reveal
              delay={80}
              className="rounded-2xl border border-hairline bg-panel p-5 md:mt-6 md:rounded-none md:border-0 md:bg-transparent md:p-0"
            >
              {/* "Now" note: pill-shaped for short text; softer corners when it wraps */}
              <span className="inline-flex items-start gap-2 rounded-[14px] border border-line bg-card px-3 py-2 text-[13px] font-medium leading-snug">
                <span className="dot mt-[5px] animate-pulse-dot bg-lime" />
                <span className="md:text-justify [hyphens:auto]">
                  <Text>{profile.nowText}</Text>
                </span>
              </span>
              <p className="mt-5 md:text-justify text-[16px] leading-relaxed [hyphens:auto] md:mt-6 md:text-[18px]">
                <Text>{profile.aboutIntro}</Text>
              </p>
              <p className="mt-4 md:text-justify text-[15px] leading-relaxed text-muted [hyphens:auto] md:text-[16px]">
                <Text>{profile.aboutBody}</Text>
              </p>
            </Reveal>

            <Reveal delay={160} className="mt-4 grid grid-cols-2 md:mt-10 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline">
              {stats.map((s) => (
                <div key={s.id} className="bg-panel p-5">
                  <p
                    className={cn(
                      'font-display text-[28px] font-semibold leading-none tracking-tight3 sm:text-[36px] lg:text-[40px]',
                      s.highlight ? 'text-lime' : 'text-fg',
                    )}
                  >
                    <Text>{s.value}</Text>
                  </p>
                  <p className="mt-2 text-[13px] text-muted">{s.label}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>

        {/* Row 2 (reference layout): wide experience card | toolkit + availability; skills full width below */}
        <div className="mt-4 grid gap-4 md:mt-20 lg:grid-cols-[1.75fr_1fr]">
          {/* Education & Experience */}
          <Reveal id="experience" className="card min-w-0 p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg">Education &amp; Experience</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                <Text>{`${firstYear ?? '[Year]'} → Now`}</Text>
              </span>
            </div>
            <ExperienceList experiences={experiences} />
          </Reveal>

          {/* Right column: toolkit + availability */}
          <div className="flex min-w-0 flex-col gap-4">
            {/* Technical Toolkit */}
            <Reveal id="toolkit" delay={60} className="card flex flex-1 flex-col p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg">Toolkit</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">Daily drivers</span>
              </div>
              {/* Interactive list: hover (desktop) / auto-cycle (touch); icons rendered here on the server */}
              {/* All names, levels and percentages come from src/config/techStack.ts */}
              <ToolkitList
                items={techStack}
                icons={techStack.map((t) => ({
                  brand: <TechIcon slug={t.icon} fallback={t.abbr} size={17} />,
                  mono: <TechIcon slug={t.icon} fallback={t.abbr} size={17} brand={false} />,
                }))}
              />
            </Reveal>

            {/* Focus areas & availability */}
            <Reveal delay={100} className="rounded-[14px] border border-line bg-ink p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{profile.focusLabel}</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {profile.focusAreas.map((c) => (
                  <span key={c} className="rounded-md border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-fg">
                    {c}
                  </span>
                ))}
              </div>
              {platforms.length > 0 && (
                <div className="mt-4 grid gap-2">
                  {platforms.map((p) => (
                    <a
                      key={p.name}
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 rounded-[10px] border border-line bg-card p-2.5 transition-colors hover:border-[#3a4750] hover:bg-raised"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-lime">
                        <TechIcon slug={p.icon} fallback={p.mark} size={14} brand={false} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-semibold leading-tight">{p.name}</span>
                        <span className="block truncate font-mono text-[9px] uppercase tracking-[0.08em] text-lime">{p.badge}</span>
                      </span>
                    </a>
                  ))}
                </div>
              )}
              <div className="mt-4 border-t border-hairline pt-4">
                <p className="flex items-center gap-2 text-[14px] font-semibold">
                  <span className={cn('dot', profile.available ? 'animate-pulse-dot bg-lime' : 'bg-danger')} />
                  {profile.statusText}
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted">
                  <Text>{profile.location}</Text>
                </p>
                <Link href="/#contact" className="btn-primary mt-4 w-full">
                  Get in Touch
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

    {/* Skills: full width, label on the left */}
        <Reveal id="skills" className="card mt-4 grid gap-4 p-6 md:grid-cols-[140px_1fr] md:gap-6">
          <span className="pt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-fg">Skills</span>
          <div className="flex flex-col gap-3">
            {Object.entries(skillGroups).map(([group, items]) => (
              <div key={group} className="grid gap-2 sm:grid-cols-[118px_1fr] sm:items-start sm:gap-3">
                <span className="pt-0 font-mono text-[10px] uppercase tracking-[0.08em] text-lime sm:pt-2">{group}</span>
                {/* Chips keep their own column, so wrapped chips line up instead of sliding under the label */}
                <div className="flex flex-wrap gap-2">
                  {items.map((s) => (
                    <span
                      key={s.id}
                      className="rounded-lg border border-line bg-ink px-3 py-1.5 text-[13px] transition-colors hover:border-lime/60 hover:text-lime"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
