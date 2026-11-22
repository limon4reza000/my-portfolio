import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './lib/env';
import { prisma } from './lib/prisma';
import { portfolioRouter } from './routes/portfolio';
import { contactRouter } from './routes/contact';
import { errorHandler, notFound } from './middleware/errors';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => {
        // Allow server-to-server calls (no Origin header) and configured origins.
        if (!origin || env.corsOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`Origin ${origin} not allowed by CORS`));
      },
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    }),
  );
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'ok', database: 'up' });
    } catch {
      res.status(503).json({ status: 'degraded', database: 'down' });
    }
  });

  app.use('/api', portfolioRouter);
  app.use('/api', contactRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
