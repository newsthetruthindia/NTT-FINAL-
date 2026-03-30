import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathArray = resolvedParams.path;
  const filePath = pathArray.join('/');
  
  // Proxy to the internal VPS storage endpoint
  const storageUrl = `http://117.252.16.132/storage/${filePath}`;
  
  try {
    const res = await fetch(storageUrl, { 
      cache: 'force-cache', // Enable edge caching for images
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) {
        return new NextResponse('Image Not Found', { status: 404 });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const blob = await res.blob();
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: any) {
    console.error('Storage Proxy Error:', err.message);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
