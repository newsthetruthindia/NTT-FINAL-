import { NextResponse } from 'next/server';
import { fetchLatestPosts, getImageUrl } from '@/lib/api';

export const revalidate = 600; // Cache for 10 minutes

export async function GET() {
  const posts = await fetchLatestPosts(50);
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsthetruth.com';

  const rssItems = posts.map((post) => {
    const imageUrl = post.thumbnails?.url ? getImageUrl(post.thumbnails.url) : '';
    const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`;
    const postUrl = `${SITE_URL}/news/${post.slug}`;
    const publishDate = new Date(post.created_at).toUTCString();
    const description = post.excerpt || post.title;
    const author = post.user?.firstname ? `${post.user.firstname} ${post.user.lastname || ''}` : 'NTT News Desk';

    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${publishDate}</pubDate>
      <dc:creator><![CDATA[${author}]]></dc:creator>
      <description><![CDATA[${description}]]></description>
      <content:encoded><![CDATA[${post.content || ''}]]></content:encoded>
      <media:content url="${absoluteImageUrl}" medium="image" type="image/jpeg" width="1200" height="630">
        <media:title type="plain"><![CDATA[${post.title}]]></media:title>
        <media:copyright>News The Truth India</media:copyright>
      </media:content>
    </item>`;
  }).join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:media="http://search.yahoo.com/mrss/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>News The Truth India - Latest News Syndication</title>
    <link>${SITE_URL}</link>
    <description>Breaking News, Analysis, and Reports from News The Truth India.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/feed/syndication" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/logo-dark.png</url>
      <title>News The Truth India</title>
      <link>${SITE_URL}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=600, stale-while-revalidate',
    },
  });
}
