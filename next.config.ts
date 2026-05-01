import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development", // Only run SW in production
});

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'http', hostname: '117.252.16.132' },
      { protocol: 'https', hostname: '117.252.16.132' },
      { protocol: 'https', hostname: 'backend.newsthetruth.com' },
      { protocol: 'https', hostname: 'newsthetruth.com' },
      { protocol: 'https', hostname: 'www.newsthetruth.com' },
      { protocol: 'https', hostname: 'ntt-final.vercel.app' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/feed/news',
        destination: '/api/feed/news',
      },
      {
        source: '/sitemap-news.xml',
        destination: '/api/sitemap-news',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: 'https://backend.newsthetruth.com/admin',
        permanent: true,
      },
    ]
  },
};

export default withSerwist(nextConfig);

