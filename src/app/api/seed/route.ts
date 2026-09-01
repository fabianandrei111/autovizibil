import { NextResponse } from 'next/server';
import { ensureSeeded } from '@/lib/db';

export async function GET() {
  ensureSeeded();
  return NextResponse.json({ ok: true, message: 'Database seeded' });
}
