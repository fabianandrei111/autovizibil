import { NextRequest, NextResponse } from 'next/server';
import { ensureSeeded, getAllAds, addAd, updateAd, deleteAd } from '@/lib/db';

export async function GET() {
  ensureSeeded();
  return NextResponse.json(getAllAds());
}

export async function POST(req: NextRequest) {
  ensureSeeded();
  const data = await req.json();
  const id = addAd(data);
  return NextResponse.json({ id });
}

export async function PUT(req: NextRequest) {
  ensureSeeded();
  const data = await req.json();
  if (!data.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  updateAd(data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  ensureSeeded();
  const { id } = await req.json();
  deleteAd(id);
  return NextResponse.json({ ok: true });
}
