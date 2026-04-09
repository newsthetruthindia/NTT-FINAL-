import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// SECURITY: Paths that require authentication to proxy.
// These contain PII or admin-level data and must not be forwarded
// unless the request includes a valid Bearer token.
const AUTH_REQUIRED_PATHS = [
  /^user\/\d+$/,      // /api/user/{id} — exposes PII, salaries, 2FA secrets
  /^users/,           // any /api/users/* route
  /^auth\/logout/,    // logout must be authed
];

// SECURITY: Paths that are completely blocked (admin/internal endpoints)
const BLOCKED_PATHS = [
  /^admin/,
  /^filament/,
  /^\.well-known/,
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathArray = resolvedParams.path;
  const path = pathArray.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  
  // SECURITY: Block admin/internal paths entirely
  if (BLOCKED_PATHS.some(r => r.test(path))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // SECURITY: Require auth header for sensitive user data paths
  const authHeader = request.headers.get('Authorization');
  if (AUTH_REQUIRED_PATHS.some(r => r.test(path)) && !authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // SECURITY: Cap the limit param to prevent DoS via forced memory exhaustion
  const url = new URL(request.url);
  const rawLimit = parseInt(url.searchParams.get('limit') || '20');
  const safeLimit = Math.min(isNaN(rawLimit) ? 20 : rawLimit, 50);
  const cappedSearchParams = new URLSearchParams(searchParams);
  cappedSearchParams.set('limit', String(safeLimit));
  const finalSearchParams = cappedSearchParams.toString();
  
  // Directly targeting the VPS API via professional subdomain
  const apiUrl = `https://backend.newsthetruth.com/api/${path}${finalSearchParams ? `?${finalSearchParams}` : ''}`;
  
  try {
    const forwardHeaders: Record<string, string> = { 'Accept': 'application/json' };
    if (authHeader) forwardHeaders['Authorization'] = authHeader;

    const res = await fetch(apiUrl, { 
      cache: 'no-store',
      headers: forwardHeaders,
    });
    
    const contentType = res.headers.get('content-type') || '';
    
    // If backend returns a non-JSON response (HTML error page / redirect), return safe fallback
    if (!contentType.includes('application/json')) {
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
    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });

  } catch (err: any) {
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
  
  const apiUrl = `https://backend.newsthetruth.com/api/${path}${searchParams ? `?${searchParams}` : ''}`;
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
