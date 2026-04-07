import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathArray = resolvedParams.path;
  const filePath = pathArray.join('/');
  
  // Potential VPS endpoints (Primary uses /storage/ prefix, Fallback is direct)
  const endpoints = [
    `http://117.252.16.132/storage/${filePath}`,
    `http://117.252.16.132/${filePath}`
  ];
  
  for (const url of endpoints) {
    try {
      console.log(`[Storage Proxy] Attempting: ${url}`);
      
      let res = await fetch(url, { 
        cache: 'force-cache',
        next: { revalidate: 3600 },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Vercel Storage Proxy)',
        }
      });
      
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && !contentType.includes('text/html')) {
          const finalContentType = contentType || 'image/jpeg';
          const blob = await res.blob();
          
          return new NextResponse(blob, {
            headers: {
              'Content-Type': finalContentType,
              'Cache-Control': 'public, max-age=31536000, immutable',
              'X-Proxy-Source': 'VPS',
              'X-Proxy-Url': url,
            },
          });
      }
      
      console.warn(`[Storage Proxy] Failed endpoint: ${url}. Status: ${res.status}`);
    } catch (err: any) {
      console.error(`[Storage Proxy] Error fetching from ${url}:`, err.message);
    }
  }

  // Final Catch: If all internal endpoints fail
  return new NextResponse('Image Not Found on VPS after multiple attempts', { status: 404 });
}
