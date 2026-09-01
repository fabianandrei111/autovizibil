import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSetting } from '@/lib/db';

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  for (const [key, value] of Object.entries(data)) {
    updateSetting(key, String(value));
  }
  return NextResponse.json({ ok: true });
}
