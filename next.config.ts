import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: 'http', hostname: '117.252.16.132' },
      { protocol: 'https', hostname: '117.252.16.132' },
      { protocol: 'https', hostname: 'newsthetruth.com' },
      { protocol: 'https', hostname: 'www.newsthetruth.com' },
      { protocol: 'https', hostname: 'ntt-final.vercel.app' },
    ],
  },
};

export default nextConfig;
