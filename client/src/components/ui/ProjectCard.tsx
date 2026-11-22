'use client';

import type { Project } from '@/lib/types';
import { cn } from '@/lib/utils';

/** 9:16 or 16:9 media tile with hover zoom and a play/open affordance. */
export function ProjectCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const vertical = project.format === 'VERTICAL';
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className={cn(
        'group relative block w-full overflow-hidden rounded-2xl border border-hairline bg-card text-left',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime',
        vertical ? 'aspect-[9/16]' : 'aspect-video',
      )}
      aria-label={`Open ${project.title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.thumbnail}
        alt={project.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,13,15,0.85)] via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />
      <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 scale-90 items-center justify-center rounded-full bg-lime text-ink opacity-0 shadow-[0_8px_30px_rgba(183,243,107,0.35)] transition duration-300 group-hover:scale-100 group-hover:opacity-100">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </svg>
      </span>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
        <span className="font-display text-[15px] font-medium leading-tight md:text-[16px]">{project.title}</span>
        <span className="hidden shrink-0 rounded-full border border-white/[0.14] bg-[rgba(9,13,15,0.55)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-fg backdrop-blur sm:inline">
          {project.category}
        </span>
      </div>
    </button>
  );
}
