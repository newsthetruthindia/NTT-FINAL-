import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  // PWA service worker duplicates CDN traffic on Vercel free tier
  disable: process.env.NODE_ENV === "development" || process.env.VERCEL === "1",
});

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: 'http', hostname: '117.252.16.132' },
      { protocol: 'https', hostname: '117.252.16.132' },
      { protocol: 'https', hostname: 'backend.newsthetruth.com' },
      { protocol: 'https', hostname: 'newsthetruth.com' },
      { protocol: 'https', hostname: 'www.newsthetruth.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/feed/news',
        destination: '/api/feed/news',
      },
      {
        source: '/feed/news.xml',
        destination: '/api/feed/news',
      },
      {
        source: '/feed/syndication.xml',
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

