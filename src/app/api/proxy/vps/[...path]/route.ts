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
    // Double check that we actually got JSON
    const contentType = res.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Proxy Error: Expected JSON but got HTML/Text', text.substring(0, 100));
      return NextResponse.json({ error: 'Backend returned non-JSON response', detail: text.substring(0, 100) }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
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
