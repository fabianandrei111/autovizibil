import { NextRequest, NextResponse } from 'next/server';
import { ensureSeeded, getAllTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/db';
import { requireAdmin, sanitizeString } from '@/lib/auth';

export async function GET() {
  ensureSeeded();
  return NextResponse.json(getAllTestimonials());
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

  if (!data.name?.trim() || !data.text?.trim()) {
    return NextResponse.json({ error: 'Numele si textul sunt obligatorii' }, { status: 400 });
  }

  const id = addTestimonial({
    name: sanitizeString(data.name, 200),
    car: sanitizeString(data.car, 200),
    text: sanitizeString(data.text, 2000),
    rating: Math.min(5, Math.max(1, Number(data.rating) || 5)),
    image: sanitizeString(data.image, 500),
    published: data.published === 0 ? 0 : 1,
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

  updateTestimonial({
    ...data,
    name: data.name ? sanitizeString(data.name, 200) : undefined,
    text: data.text ? sanitizeString(data.text, 2000) : undefined,
    rating: data.rating ? Math.min(5, Math.max(1, Number(data.rating))) : undefined,
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
  deleteTestimonial(body.id);
  return NextResponse.json({ ok: true });
}
