import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSetting } from '@/lib/db';
import { requireAdmin, sanitizeString } from '@/lib/auth';

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function PUT(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalida' }, { status: 400 });
  }

  // Whitelist allowed setting keys
  const allowedKeys = [
    'business_name', 'phone', 'whatsapp', 'email', 'address', 'program',
    'instagram', 'tiktok', 'facebook', 'youtube',
    'hero_title', 'hero_subtitle', 'hero_cta', 'hero_cta_secondary', 'logo',
  ];

  for (const [key, value] of Object.entries(data)) {
    if (!allowedKeys.includes(key)) continue;
    updateSetting(key, sanitizeString(value, 1000));
  }
  return NextResponse.json({ ok: true });
}
