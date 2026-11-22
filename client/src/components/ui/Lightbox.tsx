'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { isVideoUrl, toEmbedUrl } from '@/lib/utils';

export interface LightboxItem {
  title: string;
  subtitle?: string;
  image: string;
  /** Video to embed (YouTube / Vimeo / .mp4). */
  url?: string | null;
  vertical?: boolean;
  /** Buttons under the media, e.g. Live demo / GitHub. Empty urls are skipped. */
  links?: { label: string; url: string | null | undefined }[];
  description?: string;
}

/** Modal viewer: embeds a video when the item has a video URL, otherwise shows the image large. */
export function Lightbox({ item, onClose }: { item: LightboxItem | null; onClose: () => void }) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [item, onClose]);

  if (!item) return null;
  const video = isVideoUrl(item.url);
  const aspect = item.vertical ? 'aspect-[9/16] max-h-[80vh]' : 'aspect-video w-full';

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[100] flex animate-fade-in items-center justify-center bg-[rgba(9,13,15,0.92)] p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className={item.vertical ? 'flex w-auto flex-col items-center' : 'w-full max-w-5xl'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex w-full items-center justify-between gap-4">
          <div>
            <p className="font-display text-[18px] font-medium">{item.title}</p>
            {item.subtitle && <p className="font-mono text-[11px] uppercase tracking-label text-muted">{item.subtitle}</p>}
          </div>
          <button onClick={onClose} className="btn-ghost !px-3 !py-2" aria-label="Close">
            ✕
          </button>
        </div>
        <div className={`${aspect} overflow-hidden rounded-2xl border border-line bg-card`}>
          {video ? (
            item.url!.endsWith('.mp4') ? (
              <video src={item.url!} controls autoPlay playsInline className="h-full w-full object-cover" />
            ) : (
              <iframe
                src={toEmbedUrl(item.url!)}
                title={item.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="h-full w-full"
              />
            )
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          )}
        </div>
        {item.description && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">{item.description}</p>}
        {item.links?.some((l) => l.url) && (
          <div className="mt-4 flex flex-wrap gap-3">
            {item.links
              .filter((l) => l.url)
              .map((l, i) => (
                <a key={l.label} href={l.url!} target="_blank" rel="noreferrer" className={i === 0 ? 'btn-primary' : 'btn-ghost'}>
                  {l.label} ↗
                </a>
              ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
