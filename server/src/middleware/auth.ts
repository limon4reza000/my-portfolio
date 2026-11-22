import type { RequestHandler } from 'express';
import crypto from 'node:crypto';
import { env } from '../lib/env';
import { HttpError } from '../lib/http';

/** Simple bearer-token guard for admin endpoints. */
export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (!env.adminToken) return next(new HttpError(503, 'Admin access is not configured'));
  const header = req.header('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const a = Buffer.from(token);
  const b = Buffer.from(env.adminToken);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return next(new HttpError(401, 'Unauthorized'));
  }
  next();
};
