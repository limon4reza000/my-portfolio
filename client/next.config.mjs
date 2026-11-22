/** @type {import('next').NextConfig} */
// Accept API_URL with or without a scheme / trailing slash.
const raw = (process.env.API_URL || 'http://localhost:4000').trim().replace(/\/+$/, '');
const API_URL = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;

const nextConfig = {
  reactStrictMode: true,
  // Browser requests to /api/* are proxied to the Express server,
  // so the frontend and backend share one origin (no CORS needed in the browser).
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_URL}/api/:path*` }];
  },
};

export default nextConfig;
