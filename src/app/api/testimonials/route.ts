import { NextRequest, NextResponse } from 'next/server';
import { ensureSeeded, getAllTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/db';

export async function GET() {
  ensureSeeded();
  return NextResponse.json(getAllTestimonials());
}

export async function POST(req: NextRequest) {
  ensureSeeded();
  const data = await req.json();
  const id = addTestimonial(data);
  return NextResponse.json({ id });
}

export async function PUT(req: NextRequest) {
  ensureSeeded();
  const data = await req.json();
  if (!data.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  updateTestimonial(data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  ensureSeeded();
  const { id } = await req.json();
  deleteTestimonial(id);
  return NextResponse.json({ ok: true });
}
