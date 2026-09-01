import { NextRequest, NextResponse } from 'next/server';

const SITE_PASSWORD = process.env.SITE_PASSWORD || 'autovizibil2026';
const AUTH_COOKIE = 'av_site_auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip password for API routes, static files, and the password page itself
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname === '/password' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  // Check if user has the site auth cookie
  const authCookie = request.cookies.get(AUTH_COOKIE);
  if (authCookie?.value === 'granted') {
    return NextResponse.next();
  }

  // Redirect to password page
  const url = request.nextUrl.clone();
  url.pathname = '/password';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
