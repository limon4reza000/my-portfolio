'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import type { Project } from '@/lib/types';
import { BandMarquee } from '../ui/BandMarquee';
import { Lightbox, type LightboxItem } from '../ui/Lightbox';
import { ProjectCard } from '../ui/ProjectCard';
import { Reveal } from '../ui/Reveal';

/**
 * Selected Projects (reference: "Showcase").
 * Hidden until `profile.showProjects` is true AND featured projects exist — see server/prisma/seed.ts.
 */
interface Props {
  vertical: Project[];
  horizontal: Project[];
}

export function toLightbox(p: Project): LightboxItem {
  return {
    title: p.title,
    subtitle: [p.category, ...p.techStack].join(' · '),
    image: p.thumbnail,
    vertical: p.format === 'VERTICAL',
    description: p.description,
    links: [
      { label: 'Live demo', url: p.liveUrl },
      { label: 'GitHub', url: p.githubUrl },
    ],
  };
}

function ShowcaseHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mb-8 md:mb-10">
      <p className="mb-3 text-[15px] text-lime">{eyebrow}</p>
      <h3 className="h-section-lg">{title}</h3>
    </Reveal>
  );
}

export function Showcase({ vertical, horizontal }: Props) {
  const [active, setActive] = useState<LightboxItem | null>(null);
  const open = useCallback((p: Project) => setActive(toLightbox(p)), []);
  const close = useCallback(() => setActive(null), []);

  return (
    <section id="work" className="pt-10 md:pt-16">
      <BandMarquee text="Selected Projects" />

      <div className="container-x section">
        {vertical.length > 0 && (
          <div className="mb-20 md:mb-28">
            <ShowcaseHeading eyebrow="Mobile · Responsive on every screen" title="Vertical Showcase" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {vertical.map((p, i) => (
                <Reveal key={p.id} delay={i * 70}>
                  <ProjectCard project={p} onOpen={open} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {horizontal.length > 0 && (
          <div>
            <ShowcaseHeading eyebrow="Desktop · Full web applications" title="Horizontal Showcase" />
            <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
              {horizontal.map((p, i) => (
                <Reveal key={p.id} delay={i * 70}>
                  <ProjectCard project={p} onOpen={open} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <Reveal className="mt-10 flex justify-center">
          <Link href="/work" className="btn-ghost font-mono !text-[13px] !font-normal">
            View all work →
          </Link>
        </Reveal>
      </div>

      <Lightbox item={active} onClose={close} />
    </section>
  );
}
