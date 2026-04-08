import { NextRequest, NextResponse } from 'next/server';

// SECURITY: Allowlist of permitted domains for the image proxy
// This prevents SSRF attacks where an attacker could use this endpoint
// to probe internal networks, cloud metadata services, or arbitrary URLs.
const ALLOWED_HOSTS = [
  '117.252.16.132',
  'newsthetruth.com',
  'www.newsthetruth.com',
  'i.ytimg.com',
  'img.youtube.com',
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  // SECURITY: Validate URL and check against allowlist
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  // Enforce HTTPS or HTTP only (no file://, data://, etc.)
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return new NextResponse('Forbidden: Invalid protocol', { status: 403 });
  }

  // Check hostname against allowlist
  if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
    return new NextResponse('Forbidden: Host not allowed', { status: 403 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'NTT-ImageProxy/1.0',
      },
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch image', { status: response.status });
    }

    const contentType = response.headers.get('content-type');
    
    // Only allow actual image/video content types
    if (!contentType || (!contentType.startsWith('image/') && !contentType.startsWith('video/'))) {
      return new NextResponse('Resource is not an image', { status: 415 });
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
