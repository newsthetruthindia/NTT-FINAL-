import type { NextConfig } from "next";

const nextConfig = {
  // @ts-ignore
  eslint: {
    ignoreDuringBuilds: true,
  },
  // @ts-ignore
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: '117.252.16.132' },
      { protocol: 'https', hostname: '117.252.16.132' },
      { protocol: 'https', hostname: 'newsthetruth.com' },
      { protocol: 'https', hostname: 'www.newsthetruth.com' },
      { protocol: 'https', hostname: 'ntt-final.vercel.app' },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
