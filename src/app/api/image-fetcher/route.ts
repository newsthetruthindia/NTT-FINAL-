import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    console.log(`Proxying image request for: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, JSON.stringify(Object.fromEntries(response.headers.entries())));

    if (!response.ok) {
      console.error(`Failed to fetch image from ${url}. Status: ${response.status}`);
      return new NextResponse('Failed to fetch image', { status: response.status });
    }

    const contentType = response.headers.get('content-type');
    
    // If the origin returned HTML instead of an image (e.g. a 404 page with 200 status)
    if (contentType && contentType.includes('text/html')) {
      console.warn(`Origin returned HTML for ${url}. This usually means a redirect or 404 page.`);
      return new NextResponse('Resource not found as image', { status: 404 });
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
