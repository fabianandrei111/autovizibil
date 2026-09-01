import { NextRequest, NextResponse } from 'next/server';
import { ensureSeeded, getAllLeads, addLead, updateLeadStatus } from '@/lib/db';

export async function GET() {
  ensureSeeded();
  return NextResponse.json(getAllLeads());
}

export async function POST(req: NextRequest) {
  ensureSeeded();
  const data = await req.json();
  if (!data.name?.trim() || !data.phone?.trim()) {
    return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
  }
  const id = addLead({ ...data, name: data.name.trim(), phone: data.phone.trim() });
  return NextResponse.json({ id });
}

export async function PUT(req: NextRequest) {
  ensureSeeded();
  const data = await req.json();
  if (!data.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  updateLeadStatus(data.id, data.status);
  return NextResponse.json({ ok: true });
}
