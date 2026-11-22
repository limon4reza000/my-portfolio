import { Fragment } from 'react';

/**
 * Renders text, marking any `[placeholder]` segment with a dashed underline so
 * unfinished content is easy to spot. Edit placeholders in server/prisma/seed.ts.
 */
export function Text({ children }: { children: string }) {
  const parts = children.split(/(\[[^\]]+\])/g);
  if (parts.length === 1) return <>{children}</>;
  return (
    <>
      {parts.map((part, i) =>
        /^\[[^\]]+\]$/.test(part) ? (
          <span
            key={i}
            title="Placeholder — edit in server/prisma/seed.ts"
            className="rounded-sm bg-lime/[0.08] text-lime/90 underline decoration-lime/60 decoration-dashed underline-offset-4"
          >
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
