import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ntt-final.vercel.app'
const API_URL = 'http://117.252.16.132/api/'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/archive`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/report`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  // Category pages
  const categories = ['india', 'world', 'bengal', 'politics', 'the-exclusive-truth', 'the-untold-truth', 'your-truth']
  const categoryPages: MetadataRoute.Sitemap = categories.map(slug => ({
    url: `${SITE_URL}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Dynamic article pages
  let articlePages: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${API_URL}posts/latest?limit=200`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const json = await res.json()
      const posts = json?.data?.data || json?.data || []
      articlePages = posts.map((post: any) => ({
        url: `${SITE_URL}/news/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }))
    }
  } catch (e) {
    console.error('Sitemap: Failed to fetch posts', e)
  }

  return [...staticPages, ...categoryPages, ...articlePages]
}
