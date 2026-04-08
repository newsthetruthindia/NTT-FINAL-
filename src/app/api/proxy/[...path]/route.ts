import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathArray = resolvedParams.path;
  const path = pathArray.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  
  // Directly targeting the VPS API
  const apiUrl = `http://117.252.16.132/api/${path}${searchParams ? `?${searchParams}` : ''}`;
  
  try {
    const res = await fetch(apiUrl, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    
    const contentType = res.headers.get('content-type') || '';
    
    // If backend returns a non-JSON response (HTML error page / redirect), return safe fallback
    if (!contentType.includes('application/json')) {
      console.warn(`Proxy warning: ${path} returned non-JSON content-type: ${contentType} (status ${res.status})`);
      
      // For sponsor/ad endpoints, return empty success to prevent frontend crashes
      if (path.startsWith('sponsor/')) {
        return NextResponse.json({ success: false, data: null });
      }
      // For single-resource endpoints, return null data
      if (path.includes('user/') || path.includes('post/')) {
        return NextResponse.json({ success: false, data: null });
      }
      return NextResponse.json({ success: true, data: [], items: [] });
    }

    // Backend returned JSON — pass it through as-is (even if {}, 404, etc.)
    // The frontend components handle empty/missing data gracefully.
    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });

  } catch (err: any) {
    console.error(`Proxy Error for ${path}:`, err.message);
    
    if (path.startsWith('sponsor/')) {
      return NextResponse.json({ success: false, data: null });
    }
    if (path.includes('user/') || path.includes('post/')) {
      return NextResponse.json({ success: false, data: null });
    }
    return NextResponse.json({ success: true, data: [], items: [] });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathArray = resolvedParams.path;
  const path = pathArray.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  
  const apiUrl = `http://117.252.16.132/api/${path}${searchParams ? `?${searchParams}` : ''}`;
  const body = await request.json();

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const contentType = res.headers.get('content-type');
    if (!res.ok || (contentType && !contentType.includes('application/json'))) {
        return NextResponse.json({ error: 'Backend error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
