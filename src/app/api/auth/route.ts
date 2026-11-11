import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, SESSION_COOKIE, generateSessionToken, invalidateSession, rateLimit, rateLimitResponse, sanitizeString } from '@/lib/auth';

export async function POST(req: NextRequest) {
  // Rate limit: 5 login attempts per minute per IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(ip, 5, 60_000)) {
    return rateLimitResponse();
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalida' }, { status: 400 });
  }

  const email = sanitizeString(body.email, 200);
  const password = sanitizeString(body.password, 200);

  if (!email || !password) {
    return NextResponse.json({ error: 'Email-ul si parola sunt obligatorii' }, { status: 400 });
  }

  try {
    if (!validateCredentials(email, password)) {
      return NextResponse.json({ error: 'Credentiale invalide' }, { status: 401 });
    }
  } catch {
    // timingSafeEqual throws if buffer lengths differ - credentials don't match
    return NextResponse.json({ error: 'Credentiale invalide' }, { status: 401 });
  }

  const token = generateSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours instead of 24
  });

  return response;
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token) invalidateSession(token);

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
