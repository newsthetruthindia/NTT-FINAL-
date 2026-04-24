import { NextResponse } from 'next/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsthetruth.com';
const API_URL = 'http://117.252.16.132/api/';

export async function GET() {
  try {
    const res = await fetch(`${API_URL}posts/latest?limit=100`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 1800 }, // Revalidate every 30 minutes
    });

    if (!res.ok) throw new Error('Failed to fetch posts');

    const json = await res.json();
    const posts = json?.data?.data || json?.data || [];

    // Google News sitemap only wants articles from the last 2 days
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const newsPosts = posts.filter((post: any) => {
      const pubDate = new Date(post.created_at);
      return pubDate >= twoDaysAgo;
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${newsPosts.map((post: any) => `
  <url>
    <loc>${SITE_URL}/news/${post.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>News The Truth</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(post.created_at).toISOString()}</news:publication_date>
      <news:title>${post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')}</news:title>
    </news:news>
  </url>
  `).join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('News Sitemap error:', error);
    return new NextResponse('Error generating news sitemap', { status: 500 });
  }
}
