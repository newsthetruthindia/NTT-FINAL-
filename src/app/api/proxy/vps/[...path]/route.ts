import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathArray = resolvedParams.path;
  const path = pathArray.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  
  const apiUrl = `http://117.252.16.132/api/${path}${searchParams ? `?${searchParams}` : ''}`;
  
  try {
    const res = await fetch(apiUrl, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    
    const contentType = res.headers.get('content-type');
    // Guard: If response is not JSON or is an error, return empty success object
    if (!res.ok || (contentType && !contentType.includes('application/json'))) {
      return NextResponse.json({ success: true, data: [] });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Proxy Fetch Error:', err.message);
    return NextResponse.json({ success: true, data: [] });
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
