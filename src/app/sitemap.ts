import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsthetruth.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.newsthetruth.com/api/'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use fixed dates for static pages — avoids sitemap churn on every build
  const staticLastMod = '2025-01-01T00:00:00Z'

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'hourly', priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: staticLastMod, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: staticLastMod, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: staticLastMod, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: staticLastMod, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/archive`, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/report`, lastModified: staticLastMod, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/editorial-policy`, lastModified: staticLastMod, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/fact-check-policy`, lastModified: staticLastMod, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/corrections-policy`, lastModified: staticLastMod, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/ownership-disclosure`, lastModified: staticLastMod, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Category pages
  const categories = ['india', 'world', 'bengal', 'politics', 'the-exclusive-truth', 'the-untold-truth', 'your-truth']
  const categoryPages: MetadataRoute.Sitemap = categories.map(slug => ({
    url: `${SITE_URL}/category/${slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Dynamic article pages — paginate to fetch up to 5000 articles
  let articlePages: MetadataRoute.Sitemap = []
  const PAGE_SIZE = 500
  const MAX_PAGES = 10 // 500 * 10 = 5000 max articles
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await fetch(
        `${API_URL}posts/latest?limit=${PAGE_SIZE}&page=${page}`,
        {
          headers: { Accept: 'application/json' },
          next: { revalidate: 3600 },
        }
      )
      if (!res.ok) break

      const json = await res.json()
      const posts = json?.data?.data || json?.data || []
      if (!Array.isArray(posts) || posts.length === 0) break

      const pageArticles: MetadataRoute.Sitemap = posts.map((post: any) => ({
        url: `${SITE_URL}/news/${post.slug}`,
        lastModified: post.updated_at || post.created_at
          ? new Date(post.updated_at || post.created_at).toISOString()
          : undefined,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }))
      articlePages = [...articlePages, ...pageArticles]

      // If we got fewer than PAGE_SIZE, there are no more pages
      if (posts.length < PAGE_SIZE) break
    }
  } catch (e) {
    console.error('Sitemap: Failed to fetch posts', e)
  }

  // Tag pages — fetch tags and add them to the sitemap
  let tagPages: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${API_URL}tags`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const json = await res.json()
      const tags = json?.data || json || []
      if (Array.isArray(tags)) {
        tagPages = tags
          .filter((tag: any) => tag?.slug || tag?.title)
          .map((tag: any) => ({
            url: `${SITE_URL}/search?q=${encodeURIComponent(tag.slug || tag.title)}`,
            changeFrequency: 'weekly' as const,
            priority: 0.5,
          }))
      }
    }
  } catch (e) {
    console.error('Sitemap: Failed to fetch tags', e)
  }

  return [...staticPages, ...categoryPages, ...articlePages, ...tagPages]
}

