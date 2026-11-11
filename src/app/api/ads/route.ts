import { NextRequest, NextResponse } from 'next/server';
import { ensureSeeded, getAllAds, addAd, updateAd, deleteAd } from '@/lib/db';
import { requireAdmin, sanitizeString } from '@/lib/auth';

export async function GET() {
  ensureSeeded();
  return NextResponse.json(getAllAds());
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  ensureSeeded();

  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalida' }, { status: 400 });
  }

  if (!data.title?.trim()) {
    return NextResponse.json({ error: 'Titlul este obligatoriu' }, { status: 400 });
  }

  const id = addAd({
    title: sanitizeString(data.title, 300),
    image: sanitizeString(data.image, 500),
    link: sanitizeString(data.link, 500),
    position: sanitizeString(data.position, 50),
    start_date: sanitizeString(data.start_date, 20),
    end_date: sanitizeString(data.end_date, 20),
    active: data.active === 0 ? 0 : 1,
  });
  return NextResponse.json({ id });
}

export async function PUT(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  ensureSeeded();

  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalida' }, { status: 400 });
  }

  if (!data.id) return NextResponse.json({ error: 'ID lipsa' }, { status: 400 });

  updateAd({
    ...data,
    title: data.title ? sanitizeString(data.title, 300) : undefined,
    link: data.link ? sanitizeString(data.link, 500) : undefined,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  ensureSeeded();

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalida' }, { status: 400 });
  }

  if (!body.id) return NextResponse.json({ error: 'ID lipsa' }, { status: 400 });
  deleteAd(body.id);
  return NextResponse.json({ ok: true });
}
