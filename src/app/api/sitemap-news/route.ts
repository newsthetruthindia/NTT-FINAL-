import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Google News Sitemap — only articles from the last 48 hours are eligible
// Reference: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap

async function fetchRecentPosts() {
  try {
    const res = await fetch(
      `https://backend.newsthetruth.com/api/posts/latest?limit=50`,
      { cache: 'no-store', headers: { Accept: 'application/json' } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = await fetchRecentPosts();

  // Filter to only last 48 hours (Google News requirement)
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const recentPosts = posts.filter((post: { created_at?: string }) => {
    if (!post.created_at) return false;
    return new Date(post.created_at) >= cutoff;
  });

  const siteUrl = 'https://newsthetruth.com';
  const pubName = 'News The Truth';

  const urlEntries = recentPosts.map((post: {
    slug?: string;
    title?: string;
    created_at?: string;
    categories?: Array<{ cat_data?: { title?: string } }>;
  }) => {
    const articleUrl  = `${siteUrl}/news/${post.slug ?? ''}`;
    const pubDate     = post.created_at
      ? new Date(post.created_at).toISOString()
      : new Date().toISOString();
    const title       = escapeXml(post.title ?? 'Untitled');

    // Extract primary category as keyword
    const category    = post.categories?.[0]?.cat_data?.title
      ? escapeXml(post.categories[0].cat_data.title)
      : 'News';

    return `  <url>
    <loc>${escapeXml(articleUrl)}</loc>
    <lastmod>${pubDate}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(pubName)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
      <news:keywords>${category}</news:keywords>
    </news:news>
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${urlEntries || '  <!-- No articles in the last 48 hours -->'}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      'X-Robots-Tag': 'noindex',
    },
  });
}
