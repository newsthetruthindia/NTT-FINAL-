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
    
    const contentType = res.headers.get('content-type');
    
    // NUCLEAR: If the backend returns HTML (404/500/Redirect), return a safe JSON empty state
    // This prevents "Unexpected token <" console errors.
    if (!res.ok || (contentType && !contentType.includes('application/json'))) {
      console.warn(`Proxy warning: ${path} returned status ${res.status} or non-JSON content-type.`);
      
      // If fetching a single resource (user/post), return null
      if (path.includes('user/') || path.includes('post/')) {
        return NextResponse.json({ success: false, data: null });
      }
      
      return NextResponse.json({ success: true, data: [], items: [] });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(`Proxy Error for ${path}:`, err.message);
    
    // If fetching a single resource (user/post), return null
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
