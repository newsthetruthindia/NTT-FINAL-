import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ntt-final.vercel.app'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/diagnose/', '/login', '/register', '/forgot-password', '/reset-password'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
