import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsthetruth.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/diagnose/', '/login', '/register', '/forgot-password', '/reset-password'],
      },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'Google-Extended', 'PerplexityBot', 'Applebot-Extended', 'Amazonbot', 'OAI-SearchBot'],
        allow: '/',
      },
    ],
    sitemap: [
        `${siteUrl}/sitemap.xml`,
        `${siteUrl}/sitemap-news.xml`,
    ],
  }
}
