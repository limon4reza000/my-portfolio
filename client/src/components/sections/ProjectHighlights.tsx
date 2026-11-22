'use client';

import { useCallback, useState } from 'react';
import type { Project } from '@/lib/types';
import { Lightbox, type LightboxItem } from '../ui/Lightbox';
import { Marquee } from '../ui/Marquee';
import { SectionHeading } from '../ui/SectionHeading';
import { toLightbox } from './Showcase';
import { Transformation } from './Transformation';

/**
 * Project Highlights (reference: "Testimonials" + "Channel Transformation").
 * Hidden until `profile.showProjectHighlights` is true and a project has a `highlight`
 * (or before/after images). See server/prisma/seed.ts.
 */
export function ProjectHighlights({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<LightboxItem | null>(null);
  const close = useCallback(() => setActive(null), []);
  const withStory = projects.filter((p) => p.highlight);
  const comparison = projects.find((p) => p.beforeImage && p.afterImage);

  return (
    <section id="project-highlights" className="section border-t border-hairline">
      <div className="container-x">
        <SectionHeading eyebrow="Project Highlights" title="What went into the work" lede="Key features, challenges and decisions behind my projects." />
      </div>

      {withStory.length > 0 && (
        <Marquee duration={60} gapClass="gap-4" className="py-2">
          {withStory.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(toLightbox(p))}
              className="flex w-[300px] shrink-0 flex-col justify-between rounded-2xl border border-hairline bg-panel p-6 text-left transition-colors hover:border-line sm:w-[380px]"
            >
              <span className="block whitespace-normal text-[15px] leading-relaxed text-fg/90">
                <span className="mb-3 block font-display text-[32px] leading-none text-lime">✦</span>
                {p.highlight}
              </span>
              <span className="mt-6 flex items-center gap-3 border-t border-hairline pt-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.thumbnail} alt="" className="h-10 w-10 rounded-full border border-line object-cover" />
                <span>
                  <span className="block font-display text-[15px] font-medium">{p.title}</span>
                  <span className="block font-mono text-[11px] text-muted">{p.techStack.join(' · ')}</span>
                </span>
              </span>
            </button>
          ))}
        </Marquee>
      )}

      {comparison && (
        <div className="mt-16">
          <Transformation
            embedded
            before={comparison.beforeImage!}
            after={comparison.afterImage!}
            eyebrow={comparison.title}
            title="Same project. A better build."
            lede="Drag the slider to compare the first version with the improved one."
          />
        </div>
      )}
      <Lightbox item={active} onClose={close} />
    </section>
  );
}
