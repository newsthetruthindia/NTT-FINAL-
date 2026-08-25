import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * On-Demand Revalidation API
 *
 * Called by the Laravel backend after publishing/updating/deleting a post.
 * Invalidates cached pages so new content appears immediately.
 *
 * Usage:
 *   POST https://newsthetruth.com/api/revalidate?secret=YOUR_TOKEN
 *   Body (optional JSON): { "path": "/news/article-slug", "paths": ["/", "/category/india"] }
 *
 * If no path is provided, revalidates the homepage + all category pages.
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  const expectedToken = process.env.REVALIDATION_TOKEN || 'ntt_secure_revalidate_123';

  if (secret !== expectedToken) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // No body is fine — default revalidation
    }

    const revalidated: string[] = [];

    // If specific paths provided, revalidate those
    if (body.path) {
      revalidatePath(body.path);
      revalidated.push(body.path);
    }

    if (body.paths && Array.isArray(body.paths)) {
      for (const p of body.paths) {
        revalidatePath(p);
        revalidated.push(p);
      }
    }

    // Always revalidate homepage + key pages
    revalidatePath('/');
    revalidated.push('/');

    // Revalidate common category pages
    const categories = ['india', 'world', 'bengal', 'politics', 'the-exclusive-truth', 'the-untold-truth', 'your-truth'];
    for (const cat of categories) {
      revalidatePath(`/category/${cat}`);
      revalidated.push(`/category/${cat}`);
    }

    // Revalidate archive
    revalidatePath('/archive');
    revalidated.push('/archive');

    // Invalidate any tag-based caches
    revalidateTag('posts');

    return NextResponse.json({
      revalidated: true,
      paths: revalidated,
      now: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json({ message: 'Error revalidating', error: err?.message }, { status: 500 });
  }
}

// Also support GET for easy testing from browser/curl
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  const expectedToken = process.env.REVALIDATION_TOKEN || 'ntt_secure_revalidate_123';

  if (secret !== expectedToken) {
    return NextResponse.json({ message: 'Invalid token. Use POST with ?secret=YOUR_TOKEN' }, { status: 401 });
  }

  const path = request.nextUrl.searchParams.get('path') || '/';

  try {
    revalidatePath(path);
    revalidatePath('/');
    revalidateTag('posts');

    return NextResponse.json({
      revalidated: true,
      paths: [path, '/'],
      now: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json({ message: 'Error revalidating', error: err?.message }, { status: 500 });
  }
}
