import { NextRequest, NextResponse } from 'next/server';
import { ensureSeeded } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  ensureSeeded();
  return NextResponse.json({ ok: true, message: 'Database seeded' });
}
