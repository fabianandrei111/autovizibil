import { NextRequest, NextResponse } from 'next/server';

const SITE_PASSWORD = process.env.SITE_PASSWORD || 'autovizibil2026';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== SITE_PASSWORD) {
    return NextResponse.json({ error: 'Parola incorecta' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('av_site_auth', 'granted', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 zile
  });

  return response;
}
