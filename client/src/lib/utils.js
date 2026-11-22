// Small framework-free helpers (plain JavaScript with JSDoc types).

/**
 * Join class names, skipping falsy values.
 * @param {...(string | false | null | undefined)} parts
 * @returns {string}
 */
export function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

/**
 * "Limon Reza" -> "LR"
 * @param {string} name
 * @returns {string}
 */
export function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

/**
 * Split a display value like "2K+" or "95%" into its numeric part and affixes,
 * so it can be animated with a count-up. Non-numeric values return null.
 * @param {string} value
 * @returns {{ prefix: string, number: number, decimals: number, suffix: string } | null}
 */
export function parseCountable(value) {
  const m = /^([^\d]*)(\d+(?:\.\d+)?)(.*)$/.exec(value.trim());
  if (!m) return null;
  return {
    prefix: m[1],
    number: parseFloat(m[2]),
    decimals: m[2].includes('.') ? m[2].split('.')[1].length : 0,
    suffix: m[3],
  };
}

/**
 * Convert a YouTube watch/share URL to an embeddable URL. Other URLs pass through.
 * @param {string} url
 * @returns {string}
 */
export function toEmbedUrl(url) {
  const yt = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/.exec(url);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`;
  const vimeo = /vimeo\.com\/(\d+)/.exec(url);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  return url;
}

/**
 * Whether a URL points at an embeddable video (vs. a website to open in a new tab).
 * @param {string | null | undefined} url
 * @returns {boolean}
 */
export function isVideoUrl(url) {
  return !!url && /(youtube\.com|youtu\.be|vimeo\.com|\.mp4$)/i.test(url);
}
