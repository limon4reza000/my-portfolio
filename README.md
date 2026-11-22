# Limon Reza — Software Engineer Portfolio (full stack)

A dark, lime-accented single-page portfolio with a `/work` gallery. The design is based on the reference
site's layout, colour tokens (`#090D0F` / `#B7F36B`), and typography (Space Grotesk, Inter, Geist Mono).

| Layer    | Tech                                                   |
| -------- | ------------------------------------------------------ |
| Frontend | Next.js 15 (App Router, React 19), TypeScript + JS, Tailwind CSS |
| Backend  | Node.js, Express, TypeScript, Zod validation           |
| Database | PostgreSQL + Prisma ORM                                |
| API      | REST (`/api/*`)                                        |

```
my-portfolio/
├─ client/   Next.js app (pages, sections, UI components, placeholder images)
├─ server/   Express API + Prisma schema, migrations and seed (all site content)
└─ docker-compose.yml   PostgreSQL for local development
```

## 1. Prerequisites

- Node.js 20+ (tested on 22)
- PostgreSQL 14+. Either install it, or run `docker compose up -d db` (needs Docker Desktop),
  or use a free hosted database (Neon, Supabase, Railway) and put its URL in `server/.env`.

## 2. Setup

```bash
# install everything (root, server, client)
npm install
npm run install:all

# configure
cp server/.env.example server/.env        # set DATABASE_URL and ADMIN_TOKEN
cp client/.env.example client/.env.local  # API_URL (default http://localhost:4000)

# start Postgres (if using Docker), then create tables + load content
npm run db:up
npm run db:setup
```

## 3. Run

```bash
npm run dev     # API on http://localhost:4000, site on http://localhost:3000
```

Production: `npm run build && npm start`.

## Personalising

**Everything on the site comes from the database.** Edit `server/prisma/seed.ts`, then run
`npm --prefix server run db:seed` (or edit rows live with `npm --prefix server run db:studio`).

- **Placeholders:** text written as `[Like This]` is information still to fill in (degree, university,
  experience, city, "now" line, start year…). The site underlines these with a dashed lime line so
  they're easy to find. Search the seed for `[` to see them all.
- **Links:** a link with an empty `url` (LinkedIn, email) is hidden everywhere, so there are no dead links.
  GitHub is set to `https://github.com/limon4reza000?tab=repositories`.
- **Photos & images:** drop files into `client/public/assets/`. The file name picks the slot, no code or
  seed change needed: `hero.png` (hero cut-out, transparent PNG best), `about.jpg`, `avatar.jpg`, and
  `code-editor` / `terminal` / `schema` for the development-environment visuals. Any image whose path
  ends in the same base name (e.g. project screenshots) is swapped the same way. Files are served
  at original quality, and replacing one shows up on refresh. See `client/public/assets/README.txt`.
- **Process timeline:** each stage in `processSteps` has a `duration` (seconds). It sets both how long
  the stage plays on the auto-playing timeline and how wide its clip is.
- **Toolkit levels:** proficiency levels are off. Set `level` (e.g. "Comfortable") and/or `percent`
  (0–100, shows the segmented meter) on a tool once you want to show them.

### Enabling the project sections

*Selected Projects* (plus the `/work` page and the nav "Work" link), *Project Highlights* and
*Project Walkthroughs* are hidden. Each one appears only when **its flag is on and real data exists**:

| Section              | Flag on `profile`         | Needs a project with…            |
| -------------------- | ------------------------- | -------------------------------- |
| Selected Projects    | `showProjects`            | `featured: true`                 |
| Project Highlights   | `showProjectHighlights`   | `highlight` (or `beforeImage` + `afterImage`) |
| Project Walkthroughs | `showProjectWalkthroughs` | `videoUrl` (YouTube / Vimeo / mp4) |

Add projects using the template in the seed (title, description, screenshot, tech stack, `liveUrl`,
`githubUrl`), set the flags to `true`, and re-seed. Project cards open a viewer with **Live demo** and
**GitHub** buttons.

## REST API

| Method | Endpoint                           | Description                                   |
| ------ | ---------------------------------- | --------------------------------------------- |
| GET    | `/api/health`                      | API + DB status                               |
| GET    | `/api/portfolio`                   | All home-page data + section visibility       |
| GET    | `/api/profile`                     | Identity, copy and flags                      |
| GET    | `/api/projects?format=&category=`  | Projects (`format`: `vertical`/`horizontal`)  |
| GET    | `/api/projects/categories`         | Filter chips for `/work`                      |
| GET    | `/api/projects/:id`                | Single project                                |
| GET    | `/api/{stats,technologies,experiences,tools,skills,services,highlights,visuals,process,comparisons,faqs}` | Collections |
| POST   | `/api/contact`                     | `{ name, email, subject, message }`, validated and rate-limited to 5 per 15 min, with a honeypot |
| GET    | `/api/contact?status=NEW`          | 🔒 List messages                              |
| PATCH  | `/api/contact/:id`                 | 🔒 `{ "status": "READ" \| "ARCHIVED" }`        |
| DELETE | `/api/contact/:id`                 | 🔒 Delete a message                           |

🔒 = requires `Authorization: Bearer <ADMIN_TOKEN>`. Example:

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:4000/api/contact
```

The browser talks to the API through Next.js rewrites (`/api/*` → `API_URL`), so there are no CORS
issues in development. Set `CORS_ORIGIN` in `server/.env` if you call the API directly from another origin.

Technology logos come from [simple-icons](https://simpleicons.org) (CC0).
