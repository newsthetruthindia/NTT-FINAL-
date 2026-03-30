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
  const isDirectUpload = filePath.startsWith('uploads/');
  
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
    
    // If VPS returns 404 or HTML error page instead of image, try the fallback
    const contentType = res.headers.get('content-type');
    if (!res.ok || (contentType && contentType.includes('text/html'))) {
      console.warn(`[Storage Proxy] Primary VPS failed for ${filePath}. Trying fallback...`);
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
