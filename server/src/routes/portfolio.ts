import { Router } from 'express';
import { z } from 'zod';
import { ProjectFormat } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { asyncHandler, HttpError } from '../lib/http';

export const portfolioRouter = Router();

const byOrder = { orderBy: { order: 'asc' as const } };

async function getProfile() {
  const profile = await prisma.profile.findUnique({ where: { id: 1 } });
  if (!profile) throw new HttpError(404, 'Profile not found. Did you run the seed?');
  return profile;
}

/** Everything the home page needs, in one round trip. */
portfolioRouter.get(
  '/portfolio',
  asyncHandler(async (_req, res) => {
    const [profile, stats, technologies, experiences, tools, skills, services, projects, highlights, visuals, process, comparisons, faqs] =
      await Promise.all([
        getProfile(),
        prisma.stat.findMany(byOrder),
        prisma.technology.findMany(byOrder),
        prisma.experience.findMany(byOrder),
        prisma.tool.findMany(byOrder),
        prisma.skill.findMany(byOrder),
        prisma.service.findMany(byOrder),
        prisma.project.findMany(byOrder),
        prisma.highlight.findMany(byOrder),
        prisma.visual.findMany(byOrder),
        prisma.processStep.findMany(byOrder),
        prisma.comparison.findMany(byOrder),
        prisma.faq.findMany(byOrder),
      ]);

    const featured = projects.filter((p) => p.featured);

    res.json({
      profile,
      // A section is shown only when its flag is on AND it has real content.
      sections: {
        projects: profile.showProjects && featured.length > 0,
        projectHighlights: profile.showProjectHighlights && projects.some((p) => p.highlight || (p.beforeImage && p.afterImage)),
        projectWalkthroughs: profile.showProjectWalkthroughs && projects.some((p) => p.videoUrl),
      },
      stats: {
        hero: stats.filter((s) => s.group === 'hero'),
        about: stats.filter((s) => s.group === 'about'),
        approach: stats.filter((s) => s.group === 'approach'),
      },
      technologies,
      experiences,
      tools,
      skills,
      services,
      projects: {
        vertical: featured.filter((p) => p.format === 'VERTICAL'),
        horizontal: featured.filter((p) => p.format === 'HORIZONTAL'),
        highlights: projects.filter((p) => p.highlight || (p.beforeImage && p.afterImage)),
        walkthroughs: projects.filter((p) => p.videoUrl),
      },
      highlights,
      visuals,
      process,
      comparisons,
      faqs,
    });
  }),
);

portfolioRouter.get('/profile', asyncHandler(async (_req, res) => res.json(await getProfile())));

// Plain list endpoints for each collection.
const lists: Record<string, () => Promise<unknown>> = {
  stats: () => prisma.stat.findMany(byOrder),
  technologies: () => prisma.technology.findMany(byOrder),
  experiences: () => prisma.experience.findMany(byOrder),
  tools: () => prisma.tool.findMany(byOrder),
  skills: () => prisma.skill.findMany(byOrder),
  services: () => prisma.service.findMany(byOrder),
  highlights: () => prisma.highlight.findMany(byOrder),
  visuals: () => prisma.visual.findMany(byOrder),
  process: () => prisma.processStep.findMany(byOrder),
  comparisons: () => prisma.comparison.findMany(byOrder),
  faqs: () => prisma.faq.findMany(byOrder),
};

for (const [path, load] of Object.entries(lists)) {
  portfolioRouter.get(`/${path}`, asyncHandler(async (_req, res) => res.json(await load())));
}

const projectQuery = z.object({
  format: z.enum(['vertical', 'horizontal']).optional(),
  category: z.string().trim().min(1).max(60).optional(),
  featured: z.enum(['true', 'false']).optional(),
});

/** GET /api/projects?format=vertical&category=Web%20App */
portfolioRouter.get(
  '/projects',
  asyncHandler(async (req, res) => {
    const q = projectQuery.parse(req.query);
    const projects = await prisma.project.findMany({
      where: {
        format: q.format ? (q.format.toUpperCase() as ProjectFormat) : undefined,
        category: q.category && q.category !== 'All' ? q.category : undefined,
        featured: q.featured ? q.featured === 'true' : undefined,
      },
      ...byOrder,
    });
    res.json(projects);
  }),
);

/** Distinct categories, used for the filter chips on /work. */
portfolioRouter.get(
  '/projects/categories',
  asyncHandler(async (_req, res) => {
    const rows = await prisma.project.findMany({ select: { category: true }, ...byOrder });
    res.json(['All', ...new Set(rows.map((r) => r.category))]);
  }),
);

portfolioRouter.get(
  '/projects/:id',
  asyncHandler(async (req, res) => {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new HttpError(404, 'Project not found');
    res.json(project);
  }),
);
