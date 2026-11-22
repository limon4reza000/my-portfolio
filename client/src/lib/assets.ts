import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import type { PortfolioData, Profile, Project, Visual } from './types';

/**
 * Personal images live in `client/public/assets/`. A file there REPLACES the image
 * with the same base name, whatever extension it has. No code or database change needed:
 *
 *   assets/hero.png         → hero portrait (arched cut-out; transparent PNG recommended)
 *   assets/about.jpg        → About Me photo
 *   assets/why.jpg          → photo card in "Why Work With Me?" (third photo; placeholder until added)
 *   assets/avatar.jpg       → small round photo (falls back to a face crop of hero)
 *   assets/code-editor.png  → Development environment visuals (also: terminal, schema)
 *   assets/<name>.png       → any other image whose path ends in "<name>.<ext>", e.g. project screenshots
 *
 * Files are served as-is (original quality). The URL carries the file's modified time,
 * so swapping a photo shows up immediately without stale browser caches.
 */

const ASSET_DIR = path.join(process.cwd(), 'public', 'assets');
const IMAGE_EXT = new Set(['.avif', '.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg']);
// When several files share a name, prefer the more efficient formats.
const EXT_PRIORITY = ['.avif', '.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg'];

/** base name (lower-case) → public URL, rebuilt on every call so new uploads are picked up. */
function scan(): Map<string, string> {
  const found = new Map<string, { url: string; rank: number }>();
  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(ASSET_DIR, { withFileTypes: true, recursive: true });
  } catch {
    return new Map(); // folder missing → placeholders are used
  }
  for (const e of entries) {
    if (!e.isFile()) continue;
    const ext = path.extname(e.name).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;
    const full = path.join(e.parentPath ?? ASSET_DIR, e.name);
    const rel = path.relative(ASSET_DIR, full).split(path.sep).join('/');
    const key = path.basename(e.name, path.extname(e.name)).toLowerCase();
    const rank = EXT_PRIORITY.indexOf(ext);
    const prev = found.get(key);
    if (prev && prev.rank <= rank) continue;
    let v = '';
    try {
      v = `?v=${Math.floor(fs.statSync(full).mtimeMs)}`;
    } catch {}
    found.set(key, { url: `/assets/${rel.split('/').map(encodeURIComponent).join('/')}${v}`, rank });
  }
  return new Map([...found].map(([k, { url }]) => [k, url]));
}

const baseOf = (src: string) => path.posix.basename(src.split('?')[0], path.posix.extname(src.split('?')[0])).toLowerCase();

function makeResolver() {
  const assets = scan();
  /** Uploaded asset for a slot name, if any. */
  const slot = (name: string) => assets.get(name.toLowerCase());
  /** Swap an image path for an uploaded file with the same base name. */
  const swap = (src: string | null | undefined) => (src ? (assets.get(baseOf(src)) ?? src) : src);
  return { slot, swap };
}

/** avatarFromHero: the avatar is the hero cut-out, so the UI zooms in on the face. */
export type ResolvedProfile = Profile & { avatarImage: string; avatarFromHero: boolean; whyImage: string };

function resolveProfile(profile: Profile, r = makeResolver()): ResolvedProfile {
  const heroImage = r.slot('hero') ?? r.swap(profile.heroImage)!;
  const aboutImage = r.slot('about') ?? r.swap(profile.aboutImage)!;
  // A dedicated avatar wins; otherwise zoom into the hero cut-out (scene photos like
  // about.* don't crop well into a small circle).
  const avatar = r.slot('avatar');
  return {
    ...profile,
    heroImage,
    aboutImage,
    avatarImage: avatar ?? heroImage,
    avatarFromHero: !avatar,
    whyImage: r.slot('why') ?? '/images/why.svg',
  };
}

const resolveProject = (p: Project, r: ReturnType<typeof makeResolver>): Project => ({
  ...p,
  thumbnail: r.swap(p.thumbnail)!,
  beforeImage: r.swap(p.beforeImage) ?? null,
  afterImage: r.swap(p.afterImage) ?? null,
});

/** Apply uploaded assets to everything the home page renders. */
export function withAssets(data: PortfolioData): PortfolioData & { profile: ResolvedProfile } {
  const r = makeResolver();
  const projects = (list: Project[]) => list.map((p) => resolveProject(p, r));
  return {
    ...data,
    profile: resolveProfile(data.profile, r),
    visuals: data.visuals.map((v: Visual) => ({ ...v, image: r.swap(v.image)! })),
    projects: {
      vertical: projects(data.projects.vertical),
      horizontal: projects(data.projects.horizontal),
      highlights: projects(data.projects.highlights),
      walkthroughs: projects(data.projects.walkthroughs),
    },
  };
}

export function withProfileAssets(profile: Profile) {
  return resolveProfile(profile);
}

export function withProjectAssets(list: Project[]) {
  const r = makeResolver();
  return list.map((p) => resolveProject(p, r));
}
