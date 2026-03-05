/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint runs locally via `npm run lint` — skip during Vercel production builds
    // to prevent FlatCompat / parser serialization errors from failing deploys.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
