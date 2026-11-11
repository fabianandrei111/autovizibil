import { NextRequest, NextResponse } from 'next/server';
import { ensureSeeded, filterCars, addCar, updateCar, deleteCar } from '@/lib/db';
import { requireAdmin, rateLimit, rateLimitResponse, sanitizeString } from '@/lib/auth';

export async function GET(req: NextRequest) {
  ensureSeeded();
  const url = req.nextUrl;
  const cars = filterCars({
    brand: url.searchParams.get('brand') || undefined,
    fuel: url.searchParams.get('fuel') || undefined,
    minPrice: url.searchParams.get('minPrice') ? Number(url.searchParams.get('minPrice')) : undefined,
    maxPrice: url.searchParams.get('maxPrice') ? Number(url.searchParams.get('maxPrice')) : undefined,
    year: url.searchParams.get('year') ? Number(url.searchParams.get('year')) : undefined,
    transmission: url.searchParams.get('transmission') || undefined,
    body_type: url.searchParams.get('body_type') || undefined,
    status: url.searchParams.get('status') || undefined,
    featured: url.searchParams.get('featured') === '1',
    sort: url.searchParams.get('sort') || 'newest',
  });
  return NextResponse.json(cars);
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  ensureSeeded();

  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Validate required fields
  if (!data.brand?.trim() || !data.model?.trim()) {
    return NextResponse.json({ error: 'Brand and model are required' }, { status: 400 });
  }

  const result = addCar({
    ...data,
    brand: sanitizeString(data.brand, 100),
    model: sanitizeString(data.model, 100),
    version: sanitizeString(data.version, 100),
    description: sanitizeString(data.description, 5000),
    color: sanitizeString(data.color, 50),
    location: sanitizeString(data.location, 200),
  });
  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  ensureSeeded();

  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!data.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  updateCar({
    ...data,
    brand: data.brand ? sanitizeString(data.brand, 100) : undefined,
    model: data.model ? sanitizeString(data.model, 100) : undefined,
    description: data.description ? sanitizeString(data.description, 5000) : undefined,
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
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  deleteCar(id);
  return NextResponse.json({ ok: true });
}
