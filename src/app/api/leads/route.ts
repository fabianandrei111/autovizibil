import { NextRequest, NextResponse } from 'next/server';
import { ensureSeeded, getAllLeads, addLead, updateLeadStatus } from '@/lib/db';
import { requireAdmin, rateLimit, rateLimitResponse, sanitizeString } from '@/lib/auth';

export async function GET(req: NextRequest) {
  // Leads list is admin-only
  const authError = await requireAdmin(req);
  if (authError) return authError;

  ensureSeeded();
  return NextResponse.json(getAllLeads());
}

export async function POST(req: NextRequest) {
  // Rate limit lead submissions: 5 per minute per IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(ip, 5, 60_000)) {
    return rateLimitResponse();
  }

  ensureSeeded();

  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalida' }, { status: 400 });
  }

  const name = sanitizeString(data.name, 200);
  const phone = sanitizeString(data.phone, 30);

  if (!name || !phone) {
    return NextResponse.json({ error: 'Numele si telefonul sunt obligatorii' }, { status: 400 });
  }

  // Validate phone format (Romanian phone: digits, spaces, +, -)
  if (!/^[\d\s+\-().]{7,25}$/.test(phone)) {
    return NextResponse.json({ error: 'Numar de telefon invalid' }, { status: 400 });
  }

  // Validate email if provided
  const email = sanitizeString(data.email, 200);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Adresa de email invalida' }, { status: 400 });
  }

  const id = addLead({
    name,
    phone,
    email,
    message: sanitizeString(data.message, 2000),
    car_id: sanitizeString(data.car_id, 100),
    car_name: sanitizeString(data.car_name, 200),
    source: sanitizeString(data.source, 50),
    type: sanitizeString(data.type, 50),
    budget: sanitizeString(data.budget, 100),
    preferred_brand: sanitizeString(data.preferred_brand, 100),
    preferred_model: sanitizeString(data.preferred_model, 100),
    min_year: sanitizeString(data.min_year, 10),
    max_mileage: sanitizeString(data.max_mileage, 20),
    preferred_fuel: sanitizeString(data.preferred_fuel, 50),
    preferred_transmission: sanitizeString(data.preferred_transmission, 50),
    preferred_body: sanitizeString(data.preferred_body, 50),
    preferences: sanitizeString(data.preferences, 2000),
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

  const allowedStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST'];
  if (data.status && !allowedStatuses.includes(data.status)) {
    return NextResponse.json({ error: 'Status invalid' }, { status: 400 });
  }

  updateLeadStatus(data.id, data.status);
  return NextResponse.json({ ok: true });
}
