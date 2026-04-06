import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathArray = resolvedParams.path;
  const filePath = pathArray.join('/');
  
  // Primary: Proxy to the internal VPS endpoint (Always use /storage/ prefix for Nginx compatibility)
  const primaryStorageUrl = `http://117.252.16.132/storage/${filePath}`;
  
  // Fallback: If migration was incomplete, use the live site
  const fallbackStorageUrl = `https://newsthetruth.com/storage/${filePath}`;
  
  try {
    let res = await fetch(primaryStorageUrl, { 
      cache: 'force-cache',
      next: { revalidate: 3600 } 
    });
    
    // If Primary fails, try the same path under /storage/ as a fallback (some legacy paths might not have it)
    const contentType = res.headers.get('content-type');
    if (!res.ok || (contentType && contentType.includes('text/html'))) {
        const secondaryStorageUrl = `http://117.252.16.132/storage/${filePath}`;
        console.warn(`[Storage Proxy] Direct path failed for ${filePath}. Trying /storage/ fallback...`);
        res = await fetch(secondaryStorageUrl, { 
          cache: 'force-cache',
          next: { revalidate: 3600 } 
        });
    }

    // Still failing? Try the live site fallback
    const finalCheckContentType = res.headers.get('content-type');
    if (!res.ok || (finalCheckContentType && finalCheckContentType.includes('text/html'))) {
      console.warn(`[Storage Proxy] VPS failed for ${filePath}. Trying Live Site fallback...`);
      res = await fetch(fallbackStorageUrl, { 
        cache: 'force-cache',
        next: { revalidate: 3600 } 
      });
      
      if (!res.ok) {
        return new NextResponse('Image Not Found completely', { status: 404 });
      }
    }

    const finalContentType = res.headers.get('content-type') || 'image/jpeg';
    const blob = await res.blob();
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': finalContentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: any) {
    console.error(`[Storage Proxy] Error fetching ${filePath}:`, err.message);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
