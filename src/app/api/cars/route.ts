import { NextRequest, NextResponse } from 'next/server';
import { ensureSeeded, filterCars, addCar, updateCar, deleteCar } from '@/lib/db';

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
  ensureSeeded();
  const data = await req.json();
  const result = addCar(data);
  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  ensureSeeded();
  const data = await req.json();
  if (!data.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  updateCar(data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  ensureSeeded();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  deleteCar(id);
  return NextResponse.json({ ok: true });
}
