import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler, HttpError } from '../lib/http';
import { requireAdmin } from '../middleware/auth';

export const contactRouter = Router();

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100),
  email: z.string().trim().email('Please enter a valid email').max(200),
  subject: z.string().trim().min(3, 'Please add a subject').max(150),
  message: z.string().trim().min(10, 'Your message should be at least 10 characters').max(5000),
  // Honeypot: real users never fill this hidden field.
  website: z.string().optional(),
});

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many messages sent. Please try again in a few minutes.' },
});

contactRouter.post(
  '/contact',
  submitLimiter,
  asyncHandler(async (req, res) => {
    const { website, ...data } = contactSchema.parse(req.body);
    // A filled honeypot gets a fake success so bots learn nothing.
    if (website) {
      res.status(201).json({ ok: true });
      return;
    }
    const message = await prisma.contactMessage.create({
      data: { ...data, ip: req.ip },
      select: { id: true, createdAt: true },
    });
    res.status(201).json({ ok: true, id: message.id, createdAt: message.createdAt });
  }),
);

// ---- Admin (Authorization: Bearer <ADMIN_TOKEN>) ----
const statusEnum = z.enum(['NEW', 'READ', 'ARCHIVED']);

contactRouter.get(
  '/contact',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const status = statusEnum.optional().parse(req.query.status);
    const messages = await prisma.contactMessage.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    res.json(messages);
  }),
);

async function ensureMessage(id: string) {
  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'Message not found');
}

contactRouter.patch(
  '/contact/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { status } = z.object({ status: statusEnum }).parse(req.body);
    await ensureMessage(req.params.id);
    res.json(await prisma.contactMessage.update({ where: { id: req.params.id }, data: { status } }));
  }),
);

contactRouter.delete(
  '/contact/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    await ensureMessage(req.params.id);
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.status(204).end();
  }),
);
