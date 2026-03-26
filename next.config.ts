import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: '117.252.16.132' },
      { protocol: 'https', hostname: 'newsthetruth.com' },
      { protocol: 'https', hostname: 'ntt-final.vercel.app' },
    ],
  },
};

export default nextConfig;
