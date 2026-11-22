import 'server-only';
import * as icons from 'simple-icons';
import { cn } from '@/lib/utils';

type SimpleIcon = { title: string; path: string; hex: string };

/** Look up a simple-icons slug ("nextdotjs") → icon data. */
function find(slug?: string | null): SimpleIcon | undefined {
  if (!slug) return undefined;
  const key = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}` as keyof typeof icons;
  return icons[key] as SimpleIcon | undefined;
}

/** Brand colours that are too dark on the #090d0f background get the light text colour instead. */
function readable(hex: string) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 70 ? '#f4f5f2' : `#${hex}`;
}

interface Props {
  slug?: string | null;
  /** Monogram shown when no icon exists for the slug. */
  fallback: string;
  size?: number;
  className?: string;
  /** Render in brand colour (default) or currentColor. */
  brand?: boolean;
}

/** Technology logo from simple-icons (CC0), rendered as inline SVG on the server. */
export function TechIcon({ slug, fallback, size = 20, className, brand = true }: Props) {
  const icon = find(slug);
  if (!icon) {
    return (
      <span className={cn('font-display font-semibold leading-none', className)} style={{ fontSize: size * 0.7 }} aria-hidden>
        {fallback}
      </span>
    );
  }
  return (
    <svg
      role="img"
      aria-label={icon.title}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill={brand ? readable(icon.hex) : 'currentColor'}
    >
      <path d={icon.path} />
    </svg>
  );
}
