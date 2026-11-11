import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE = 'av_site_auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If no SITE_PASSWORD env is set, skip password gate entirely
  if (!process.env.SITE_PASSWORD) {
    return NextResponse.next();
  }

  // Skip password for API routes, static files, and the password page itself
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname === '/password' ||
    pathname === '/login' ||
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

  // Redirect to password page - sanitize the 'next' param to prevent open redirect
  const url = request.nextUrl.clone();
  url.pathname = '/password';
  // Only allow relative paths in 'next' param to prevent open redirect
  const nextPath = pathname.startsWith('/') ? pathname : '/';
  url.searchParams.set('next', nextPath);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
