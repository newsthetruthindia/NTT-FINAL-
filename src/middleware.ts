import { NextRequest, NextResponse } from 'next/server';

const BLOCKED_AGENTS =
  /dotbot|petalbot|bytespider|mj12bot|barkrowler|dataforseo|serpstat|megaindex/i;

// Pages that require authentication to view
const PROTECTED_PATTERNS = [
  /^\/news\/.+/,       // Article detail pages
  /^\/category\/.+/,   // Category listing pages
  /^\/search/,         // Search results
  /^\/archive/,        // Archive
  /^\/reporter\/.+/,   // Reporter profiles
  /^\/tv/,             // TV section
];

// Pages that should never be blocked (even if they match above)
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/corrections-policy',
  '/editorial-policy',
  '/fact-check-policy',
  '/journalist-verification',
  '/ownership-disclosure',
  '/physical-office',
  '/report',
];

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') || '';

  if (BLOCKED_AGENTS.test(ua)) {
    return new NextResponse('Blocked', { status: 403 });
  }

  if (process.env.VERCEL === '1') {
    const path = request.nextUrl.pathname;
    if (path.startsWith('/test-api') || path.startsWith('/diagnose')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  const path = request.nextUrl.pathname;

  // Allow public paths
  if (PUBLIC_PATHS.includes(path)) {
    return NextResponse.next();
  }

  // Allow API routes, auth callbacks, static assets
  if (path.startsWith('/api/') || path.startsWith('/auth/') || path.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  const isProtected = PROTECTED_PATTERNS.some((pattern) => pattern.test(path));

  if (isProtected) {
    const token = request.cookies.get('ntt_auth_token')?.value;

    if (!token) {
      // If they are visiting an article page, we now let them through to see the Soft Paywall
      if (path.startsWith('/news/')) {
        return NextResponse.next();
      }

      // For other protected pages like /search or /reporter, we still redirect
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      loginUrl.searchParams.set('reason', 'auth_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)'],
};
