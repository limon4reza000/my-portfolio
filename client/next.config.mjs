/** @type {import('next').NextConfig} */
const API_URL = process.env.API_URL || 'http://localhost:4000';

const nextConfig = {
  reactStrictMode: true,
  // Browser requests to /api/* are proxied to the Express server,
  // so the frontend and backend share one origin (no CORS needed in the browser).
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_URL}/api/:path*` }];
  },
};

export default nextConfig;
