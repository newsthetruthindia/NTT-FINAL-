import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiUrl = `https://backend.newsthetruth.com/api/feed/news`;
  
  try {
    const res = await fetch(apiUrl, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/xml' },
    });
    
    if (!res.ok) {
        throw new Error(`Backend returned ${res.status}`);
    }

    const xmlData = await res.text();
    
    return new NextResponse(xmlData, {
      status: 200,
      headers: { 
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=600'
      }
    });

  } catch (err: any) {
    console.error('RSS Feed Proxy error:', err);
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>News The Truth</title><description>Error generating feed</description></channel></rss>', {
      status: 500,
      headers: { 'Content-Type': 'application/xml' }
    });
  }
}
