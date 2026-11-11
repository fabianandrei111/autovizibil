import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitResponse, sanitizeString } from '@/lib/auth';

export async function POST(req: NextRequest) {
  // Rate limit: 10 attempts per minute per IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(ip, 10, 60_000)) {
    return rateLimitResponse();
  }

  const SITE_PASSWORD = process.env.SITE_PASSWORD;
  if (!SITE_PASSWORD) {
    // If no site password is configured, allow access
    const response = NextResponse.json({ ok: true });
    response.cookies.set('av_site_auth', 'granted', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalida' }, { status: 400 });
  }

  const password = sanitizeString(body.password, 200);

  if (password !== SITE_PASSWORD) {
    return NextResponse.json({ error: 'Parola incorecta' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('av_site_auth', 'granted', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
