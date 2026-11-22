import type { ContactPayload, PortfolioData, Profile, Project } from './types';

/**
 * Server components call the Express API directly (API_URL).
 * Browser code calls the same-origin `/api/*` path, which next.config.mjs proxies.
 */
const SERVER_BASE = process.env.API_URL || 'http://localhost:4000';
const base = () => (typeof window === 'undefined' ? SERVER_BASE : '');

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields?: Record<string, string[] | undefined>,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${base()}/api${path}`, {
      cache: 'no-store', // content is edited in the DB; always render fresh
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new ApiError(0, 'Could not reach the server. Please try again.');
  }
  const body = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, body?.error ?? `Request failed (${res.status})`, body?.fields);
  }
  return body as T;
}

export const api = {
  portfolio: () => request<PortfolioData>('/portfolio'),
  profile: () => request<Profile>('/profile'),
  projects: (params: { format?: 'vertical' | 'horizontal'; category?: string } = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter((e): e is [string, string] => Boolean(e[1])),
    ).toString();
    return request<Project[]>(`/projects${qs ? `?${qs}` : ''}`);
  },
  categories: () => request<string[]>('/projects/categories'),
  sendContact: (payload: ContactPayload) =>
    request<{ ok: true; id?: string }>('/contact', { method: 'POST', body: JSON.stringify(payload) }),
};
