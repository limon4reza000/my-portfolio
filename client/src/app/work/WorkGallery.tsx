'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toLightbox } from '@/components/sections/Showcase';
import { Lightbox, type LightboxItem } from '@/components/ui/Lightbox';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { api } from '@/lib/api';
import type { Project } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  initialProjects: Project[];
  categories: string[];
}

/** Filterable gallery. Filtering queries the REST API (`/api/projects?category=`). */
export function WorkGallery({ initialProjects, categories }: Props) {
  const [category, setCategory] = useState('All');
  const [projects, setProjects] = useState(initialProjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [active, setActive] = useState<LightboxItem | null>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    api
      .projects({ category: category === 'All' ? undefined : category })
      .then((p) => !cancelled && setProjects(p))
      .catch((e: Error) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [category]);

  const open = useCallback((p: Project) => setActive(toLightbox(p)), []);
  const close = useCallback(() => setActive(null), []);

  const vertical = projects.filter((p) => p.format === 'VERTICAL');
  const horizontal = projects.filter((p) => p.format === 'HORIZONTAL');

  const Empty = () => <p className="rounded-2xl border border-dashed border-line p-10 text-center text-[14px] text-muted">No projects in this category yet.</p>;

  return (
    <div className={cn('container-x py-12 transition-opacity md:py-16', loading && 'opacity-50')} aria-busy={loading}>
      {/* Short-form header + filters */}
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-[30px] font-semibold tracking-tight3 md:text-[36px]">Mobile</h2>
          <span className="chip !text-[12px]">9:16</span>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:justify-end md:overflow-visible md:px-0" role="tablist" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                'shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono text-[12px] transition-colors',
                category === c ? 'border-lime bg-lime text-ink' : 'border-line bg-card text-fg hover:border-[#3a4750]',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-6 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-[14px] text-danger">
          {error}
        </p>
      )}

      {vertical.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {vertical.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={open} />
          ))}
        </div>
      ) : (
        <Empty />
      )}

      <div className="mb-8 mt-20 flex items-center gap-3">
        <h2 className="font-display text-[30px] font-semibold tracking-tight3 md:text-[36px]">Desktop</h2>
        <span className="chip !text-[12px]">16:9</span>
      </div>
      {horizontal.length ? (
        <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
          {horizontal.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={open} />
          ))}
        </div>
      ) : (
        <Empty />
      )}

      <Lightbox item={active} onClose={close} />
    </div>
  );
}
