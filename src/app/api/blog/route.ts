import { NextRequest, NextResponse } from 'next/server';
import { ensureSeeded, getAllBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/db';

export async function GET() {
  ensureSeeded();
  return NextResponse.json(getAllBlogPosts());
}

export async function POST(req: NextRequest) {
  ensureSeeded();
  const data = await req.json();
  const result = addBlogPost(data);
  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  ensureSeeded();
  const data = await req.json();
  if (!data.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  updateBlogPost(data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  ensureSeeded();
  const { id } = await req.json();
  deleteBlogPost(id);
  return NextResponse.json({ ok: true });
}
