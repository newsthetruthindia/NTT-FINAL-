import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathArray = resolvedParams.path;
  const filePath = pathArray.join('/');
  
  // Determine the correct path segment based on where Filament saves it
  // New Filament 'webapp_public' disk saves directly to /uploads/... instead of /storage/...
  // Also, user profile pics are saved directly in /medias/...
  const isDirectUpload = filePath.startsWith('uploads/') || filePath.startsWith('medias/');
  
  // Primary: Proxy to the internal VPS endpoint
  const primaryStorageUrl = isDirectUpload 
      ? `http://117.252.16.132/${filePath}` 
      : `http://117.252.16.132/storage/${filePath}`;
  
  // Fallback: If migration was incomplete, use the live site
  const fallbackStorageUrl = isDirectUpload
      ? `https://newsthetruth.com/${filePath}`
      : `https://newsthetruth.com/storage/${filePath}`;
  
  try {
    let res = await fetch(primaryStorageUrl, { 
      cache: 'force-cache',
      next: { revalidate: 3600 } 
    });
    
    // If Primary fails and it was a direct upload (like /uploads/ or /medias/), 
    // try the same path under /storage/ as a fallback
    const contentType = res.headers.get('content-type');
    if ((!res.ok || (contentType && contentType.includes('text/html'))) && isDirectUpload) {
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
