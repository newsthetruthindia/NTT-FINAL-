import { NextRequest, NextResponse } from 'next/server';

const EDGE_CACHE_SECONDS = 1800;

// Public read endpoints safe to cache at the edge (cuts CPU + origin transfer).
const CACHEABLE_GET = [
  /^posts\//,
  /^post\//,
  /^categories\/?$/,
  /^tags\/?$/,
  /^videos\/?$/,
  /^reporters\/?$/,
  /^archive\/stats\/?$/,
  /^sponsor\//,
  /^poll\/active\/?$/,
];

const AUTH_REQUIRED_PATHS = [
  /^user\/\d+$/,
  /^users/,
  /^auth\/logout/,
];

const BLOCKED_PATHS = [
  /^admin/,
  /^filament/,
  /^\.well-known/,
];

function isCacheablePublicGet(path: string, hasAuth: boolean): boolean {
  if (hasAuth) return false;
  return CACHEABLE_GET.some((pattern) => pattern.test(path));
}

function cacheControlHeader(): string {
  return `public, s-maxage=${EDGE_CACHE_SECONDS}, stale-while-revalidate=86400`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathArray = resolvedParams.path;
  const path = pathArray.join('/');
  const searchParams = request.nextUrl.searchParams.toString();

  if (BLOCKED_PATHS.some((r) => r.test(path))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const authHeader = request.headers.get('Authorization');
  if (AUTH_REQUIRED_PATHS.some((r) => r.test(path)) && !authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const rawLimit = parseInt(url.searchParams.get('limit') || '20');
  const safeLimit = Math.min(isNaN(rawLimit) ? 20 : rawLimit, 50);
  const cappedSearchParams = new URLSearchParams(searchParams);
  cappedSearchParams.set('limit', String(safeLimit));
  const finalSearchParams = cappedSearchParams.toString();

  const backendBase = process.env.NEXT_PUBLIC_API_URL || 'https://backend.newsthetruth.com/api';
  const apiBase = backendBase.endsWith('/') ? backendBase : `${backendBase}/`;
  const apiUrl = `${apiBase}${path}${finalSearchParams ? `?${finalSearchParams}` : ''}`;
  const cacheable = isCacheablePublicGet(path, !!authHeader);

  try {
    const forwardHeaders: Record<string, string> = { Accept: 'application/json' };
    if (authHeader) forwardHeaders.Authorization = authHeader;

    const res = await fetch(
      apiUrl,
      cacheable
        ? { next: { revalidate: EDGE_CACHE_SECONDS }, headers: forwardHeaders }
        : { cache: 'no-store', headers: forwardHeaders }
    );

    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/xml') || contentType.includes('text/xml')) {
      const xmlData = await res.text();
      return new NextResponse(xmlData, {
        status: res.status,
        headers: {
          'Content-Type': contentType,
          ...(cacheable ? { 'Cache-Control': cacheControlHeader() } : {}),
        },
      });
    }

    if (!contentType.includes('application/json')) {
      if (path.startsWith('sponsor/')) {
        return NextResponse.json({ success: false, data: null });
      }
      if (path.includes('user/') || path.includes('post/')) {
        return NextResponse.json({ success: false, data: null });
      }
      return NextResponse.json({ success: true, data: [], items: [] });
    }

    const data = await res.json();
    return NextResponse.json(data, {
      status: res.ok ? 200 : res.status,
      headers: cacheable ? { 'Cache-Control': cacheControlHeader() } : undefined,
    });
  } catch {
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

  const backendBase = process.env.NEXT_PUBLIC_API_URL || 'https://backend.newsthetruth.com/api';
  const apiBase = backendBase.endsWith('/') ? backendBase : `${backendBase}/`;
  const apiUrl = `${apiBase}${path}${searchParams ? `?${searchParams}` : ''}`;
  const body = await request.json();

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get('content-type');
    if (!res.ok || (contentType && !contentType.includes('application/json'))) {
      return NextResponse.json({ error: 'Backend error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Request failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
