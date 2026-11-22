/**
 * Generates placeholder visuals into public/images.
 * Run: `npm run placeholders` (from /client)
 *
 *  - portrait.svg / about.svg  → replace with your professional photos
 *  - env/*.svg                 → development-environment illustrations (keep or replace
 *                                with real screenshots of your editor / terminal / schema)
 *
 * Project screenshots go in public/images/projects/ once your projects are ready.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');
const write = (rel, svg) => {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, svg.trim() + '\n');
};

const BG = '#090d0f', PANEL = '#101619', CARD = '#151d21', LINE = '#283238', MUTED = '#929b9f', TEXT = '#f4f5f2', LIME = '#b7f36b';
const mono = `font-family="Geist Mono, ui-monospace, monospace"`;

// --- Profile photo placeholders ---------------------------------------------
const portrait = (w, h, file) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <radialGradient id="g" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="#1f2a30"/><stop offset="1" stop-color="${BG}"/></radialGradient>
    <linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4750"/><stop offset="1" stop-color="#1b2429"/></linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w / 2}" cy="${h * 0.36}" r="${w * 0.17}" fill="url(#s)"/>
  <path d="M ${w * 0.14} ${h} C ${w * 0.16} ${h * 0.66}, ${w * 0.34} ${h * 0.58}, ${w / 2} ${h * 0.58} C ${w * 0.66} ${h * 0.58}, ${w * 0.84} ${h * 0.66}, ${w * 0.86} ${h} Z" fill="url(#s)"/>
  <text x="${w / 2}" y="${h * 0.93}" text-anchor="middle" ${mono} font-size="${w * 0.026}" fill="${MUTED}" letter-spacing="2">[ DROP ${file}.jpg INTO public/assets ]</text>
</svg>`;
// Hero uses a transparent cut-out (like a background-removed photo) inside an arch.
write(
  'portrait.svg',
  `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1160" width="800" height="1160">
  <defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a5862"/><stop offset="1" stop-color="#1b2429"/></linearGradient></defs>
  <path d="M 335 470 L 335 560 C 335 600, 465 600, 465 560 L 465 470 Z" fill="#2c373e"/>
  <ellipse cx="400" cy="340" rx="150" ry="175" fill="url(#s)"/>
  <path d="M 60 1160 C 70 800, 180 620, 330 585 C 360 610, 440 610, 470 585 C 620 620, 730 800, 740 1160 Z" fill="url(#s)"/>
  <text x="400" y="1020" text-anchor="middle" ${mono} font-size="20" fill="${MUTED}" letter-spacing="2">[ DROP hero.png INTO public/assets ]</text>
</svg>`,
);
write('about.svg', portrait(800, 900, 'about'));
write('why.svg', portrait(880, 800, 'why'));

// --- Shared window chrome ----------------------------------------------------
const windowFrame = (title, body) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <rect width="600" height="380" fill="${PANEL}"/>
  <rect width="600" height="34" fill="${CARD}"/>
  <circle cx="18" cy="17" r="5" fill="#f05252"/><circle cx="36" cy="17" r="5" fill="#f5c451"/><circle cx="54" cy="17" r="5" fill="${LIME}"/>
  <text x="300" y="21" text-anchor="middle" ${mono} font-size="11" fill="${MUTED}">${title}</text>
  <line x1="0" y1="34" x2="600" y2="34" stroke="${LINE}"/>
  ${body}
</svg>`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Each line: array of [text, colour] tokens.
const codeLines = (lines, x0, y0, lh = 19, numbers = true) =>
  lines
    .map((tokens, i) => {
      const y = y0 + i * lh;
      const num = numbers ? `<text x="${x0 - 28}" y="${y}" ${mono} font-size="11" fill="#3a4750" text-anchor="end">${i + 1}</text>` : '';
      const spans = tokens.map(([t, c]) => `<tspan fill="${c}">${esc(t)}</tspan>`).join('');
      return `${num}<text x="${x0}" y="${y}" ${mono} font-size="12" xml:space="preserve">${spans}</text>`;
    })
    .join('\n  ');

const K = '#c792ea', S = LIME, F = '#82aaff', C = '#546e7a', T = TEXT, N = '#f78c6c';

// --- Code editor ---------------------------------------------------------------
write(
  'env/code-editor.svg',
  windowFrame(
    'routes/contact.ts',
    `<rect x="0" y="34" width="120" height="346" fill="${BG}"/>
  <text x="14" y="58" ${mono} font-size="10" fill="${MUTED}">EXPLORER</text>
  ${['src', '  routes', '    contact.ts', '    portfolio.ts', '  lib', '  app.ts', 'prisma', '  schema.prisma']
    .map((f, i) => `<text x="14" y="${82 + i * 18}" ${mono} font-size="11" xml:space="preserve" fill="${f.includes('contact') ? LIME : MUTED}">${f}</text>`)
    .join('\n  ')}
  ${codeLines(
    [
      [["import", K], [" { z } ", T], ["from", K], [" 'zod'", S], [";", T]],
      [],
      [["const", K], [" contactSchema ", T], ["=", K], [" z.", T], ["object", F], ["({", T]],
      [["  name: z.", T], ["string", F], ["().", T], ["min", F], ["(", T], ["2", N], ["),", T]],
      [["  email: z.", T], ["string", F], ["().", T], ["email", F], ["(),", T]],
      [["  subject: z.", T], ["string", F], ["().", T], ["min", F], ["(", T], ["3", N], ["),", T]],
      [["  message: z.", T], ["string", F], ["().", T], ["min", F], ["(", T], ["10", N], ["),", T]],
      [["});", T]],
      [],
      [["// validate, then store in PostgreSQL", C]],
      [["router.", T], ["post", F], ["(", T], ["'/contact'", S], [", ", T], ["async", K], [" (req, res) => {", T]],
      [["  const", K], [" data ", T], ["=", K], [" contactSchema.", T], ["parse", F], ["(req.body);", T]],
      [["  await", K], [" prisma.message.", T], ["create", F], ["({ data });", T]],
      [["  res.", T], ["status", F], ["(", T], ["201", N], [").", T], ["json", F], ["({ ok: ", T], ["true", N], [" });", T]],
      [["});", T]],
    ],
    168,
    64,
  )}`,
  ),
);

// --- Terminal ------------------------------------------------------------------
write(
  'env/terminal.svg',
  windowFrame(
    'zsh — my-portfolio',
    `<rect x="0" y="35" width="600" height="345" fill="${BG}"/>
  ${codeLines(
    [
      [["➜ ", LIME], ["my-portfolio ", F], ["git:(", K], ["main", N], [") ", K], ["npm run dev", T]],
      [["[api] ", LIME], ["API listening on http://localhost:4000/api", MUTED]],
      [["[web] ", F], ["▲ Next.js 15 · Local: http://localhost:3000", MUTED]],
      [["[web] ", F], ["✓ Ready in 2.1s", LIME]],
      [],
      [["➜ ", LIME], ["my-portfolio ", F], ["npx prisma migrate dev", T]],
      [["✔ ", LIME], ["Your database is now in sync with your schema.", MUTED]],
      [],
      [["➜ ", LIME], ["my-portfolio ", F], ["npm run build", T]],
      [["✓ ", LIME], ["Compiled successfully", MUTED]],
      [["✓ ", LIME], ["Linting and checking validity of types", MUTED]],
      [],
      [["➜ ", LIME], ["my-portfolio ", F], ["git push origin main", T]],
      [["█", LIME]],
    ],
    24,
    62,
    20,
    false,
  )}`,
  ),
);

// --- Database schema -----------------------------------------------------------
// Canvas is 600 wide; each table is 168 wide, so x must stay <= 410 (22px side margins).
const table = (x, y, name, cols) => `
  <g>
    <rect x="${x}" y="${y}" width="168" height="${30 + cols.length * 22}" rx="8" fill="${CARD}" stroke="${LINE}"/>
    <rect x="${x}" y="${y}" width="168" height="28" rx="8" fill="#1d272d"/>
    <text x="${x + 12}" y="${y + 19}" ${mono} font-size="12" fill="${LIME}">${name}</text>
    ${cols
      .map(
        ([c, t], i) =>
          `<text x="${x + 12}" y="${y + 47 + i * 22}" ${mono} font-size="11" fill="${TEXT}">${c}</text><text x="${x + 156}" y="${y + 47 + i * 22}" ${mono} font-size="10" fill="${MUTED}" text-anchor="end">${t}</text>`,
      )
      .join('')}
  </g>`;
write(
  'env/schema.svg',
  windowFrame(
    'schema.prisma · PostgreSQL',
    `<rect x="0" y="35" width="600" height="345" fill="${BG}"/>
  <path d="M190 120 C 203 120, 203 190, 216 190" stroke="${LIME}" stroke-width="1.5" fill="none" stroke-dasharray="4 3"/>
  <path d="M384 190 C 397 190, 397 110, 410 110" stroke="${LIME}" stroke-width="1.5" fill="none" stroke-dasharray="4 3"/>
  ${table(22, 64, 'User', [['id', 'Int @id'], ['email', 'String'], ['name', 'String'], ['createdAt', 'DateTime']])}
  ${table(216, 150, 'Project', [['id', 'Int @id'], ['title', 'String'], ['techStack', 'String[]'], ['liveUrl', 'String?'], ['authorId', 'Int']])}
  ${table(410, 64, 'Tag', [['id', 'Int @id'], ['name', 'String']])}
  ${table(22, 230, 'Message', [['id', 'cuid'], ['subject', 'String'], ['message', 'String']])}`,
  ),
);

console.log('Placeholders written to', root);
