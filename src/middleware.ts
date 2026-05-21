import { NextRequest, NextResponse } from 'next/server';

/** Scrapers that burn free-tier bandwidth without helping SEO */
const BLOCKED_AGENTS =
  /ahrefs|semrush|dotbot|petalbot|bytespider|gptbot|claudebot|mj12bot|barkrowler|dataforseo|serpstat|megaindex/i;

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

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)'],
};
