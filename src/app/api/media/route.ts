import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Media Resolver API
 * Handles inconsistent backend storage paths by attempting multiple resolutions.
 * 1. Direct path (e.g., uploads/media/...)
 * 2. Storage alias (e.g., storage/uploads/media/...)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return new NextResponse('Path is required', { status: 400 });
  }

  const cleanPath = path.replace(/^\/+/, '');
  
  // Dynamically determine the base URL (removing the /api suffix if present)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const BASE_URL = apiUrl.replace(/\/api\/?$/, '').endsWith('/') 
    ? apiUrl.replace(/\/api\/?$/, '') 
    : `${apiUrl.replace(/\/api\/?$/, '')}/`;

  // Resolution candidates in order of priority
  const candidates = [
    `${BASE_URL}${cleanPath}`,
    `${BASE_URL}storage/${cleanPath}`
  ];

  // For uploads/media/, we specifically check both because of backend inconsistency
  // (Recent files are direct, older files are in storage alias)
  
  try {
    // Try the first candidate
    const res1 = await fetch(candidates[0], { 
      method: 'HEAD', 
      cache: 'no-store',
      redirect: 'manual' 
    });
    
    const isImage = (contentType: string | null) => 
      contentType?.startsWith('image/') || contentType === 'application/octet-stream';
    
    if (res1.ok && isImage(res1.headers.get('content-type'))) {
      return NextResponse.redirect(candidates[0], { status: 302 });
    }

    // Try the second candidate
    const res2 = await fetch(candidates[1], { 
      method: 'HEAD', 
      cache: 'no-store',
      redirect: 'manual'
    });
    
    if (res2.ok && isImage(res2.headers.get('content-type'))) {
      return NextResponse.redirect(candidates[1], { status: 302 });
    }

    // If both fail, redirect to local placeholder
    return NextResponse.redirect(new URL('/placeholder-news.jpg', request.url), { status: 302 });
  } catch (error) {
    // On network error, fallback to first candidate and let browser handle it
    return NextResponse.redirect(candidates[0], { status: 302 });
  }
}
