import { NextRequest, NextResponse } from 'next/server';
import { ensureSeeded, getAllBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/db';
import { requireAdmin, sanitizeString, sanitizeHtml } from '@/lib/auth';

export async function GET() {
  ensureSeeded();
  return NextResponse.json(getAllBlogPosts());
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

  if (!data.title?.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const result = addBlogPost({
    ...data,
    title: sanitizeString(data.title, 300),
    excerpt: sanitizeString(data.excerpt, 1000),
    content: sanitizeHtml(data.content),
    category: sanitizeString(data.category, 100),
    seo_title: sanitizeString(data.seo_title, 200),
    seo_description: sanitizeString(data.seo_description, 500),
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

  updateBlogPost({
    ...data,
    title: data.title ? sanitizeString(data.title, 300) : undefined,
    content: data.content ? sanitizeHtml(data.content) : undefined,
    excerpt: data.excerpt ? sanitizeString(data.excerpt, 1000) : undefined,
    seo_title: data.seo_title ? sanitizeString(data.seo_title, 200) : undefined,
    seo_description: data.seo_description ? sanitizeString(data.seo_description, 500) : undefined,
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

  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  deleteBlogPost(body.id);
  return NextResponse.json({ ok: true });
}
