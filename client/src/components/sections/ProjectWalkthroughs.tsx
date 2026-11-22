'use client';

import { useCallback, useState } from 'react';
import type { Project } from '@/lib/types';
import { Lightbox, type LightboxItem } from '../ui/Lightbox';
import { Reveal } from '../ui/Reveal';

/**
 * Project Walkthroughs (reference: "Video testimonials").
 * Hidden until `profile.showProjectWalkthroughs` is true and a project has a `videoUrl`.
 */
export function ProjectWalkthroughs({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<LightboxItem | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <section id="walkthroughs" className="section border-t border-hairline">
      <div className="container-x">
        <Reveal className="mb-10 md:mb-14">
          <p className="eyebrow mb-4">Project Walkthroughs</p>
          <h2 className="h-section-lg">See it in action</h2>
          <p className="lede mt-4">Short video tours of my projects: features, code and decisions.</p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <button
                type="button"
                onClick={() =>
                  setActive({
                    title: p.title,
                    subtitle: p.techStack.join(' · '),
                    image: p.thumbnail,
                    url: p.videoUrl,
                    links: [
                      { label: 'Live demo', url: p.liveUrl },
                      { label: 'GitHub', url: p.githubUrl },
                    ],
                  })
                }
                className="group relative block aspect-[9/14] w-full overflow-hidden rounded-2xl border border-hairline bg-card text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                aria-label={`Play walkthrough of ${p.title}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.thumbnail} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-[rgba(9,13,15,0.2)] to-transparent" />
                <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.14] bg-[rgba(9,13,15,0.55)] backdrop-blur transition duration-300 group-hover:scale-110 group-hover:border-lime group-hover:bg-lime group-hover:text-ink">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="block font-display text-[16px] font-medium">{p.title}</span>
                  <span className="block font-mono text-[11px] text-muted">{p.category}</span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      <Lightbox item={active} onClose={close} />
    </section>
  );
}
