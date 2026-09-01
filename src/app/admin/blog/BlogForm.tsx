'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type BlogData = {
  id?: string; title: string; slug: string; image: string; category: string;
  excerpt: string; content: string; published: boolean; seo_title: string; seo_description: string;
};

const DEFAULTS: BlogData = {
  title: '', slug: '', image: '', category: '', excerpt: '', content: '', published: true, seo_title: '', seo_description: '',
};

export default function BlogForm({ initial }: { initial?: BlogData }) {
  const [form, setForm] = useState<BlogData>(initial || DEFAULTS);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || generateSlug(form.title);
    const method = form.id ? 'PUT' : 'POST';
    await fetch('/api/blog', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, slug, published: form.published ? 1 : 0 }) });
    router.push('/admin/blog');
    router.refresh();
  }

  const inputCls = "w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      <div>
        <label className="block text-sm font-medium text-primary mb-1">Titlu *</label>
        <input required value={form.title} onChange={e => setForm({...form, title: e.target.value, slug: form.slug || generateSlug(e.target.value)})} className={inputCls} />
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1">Slug</label>
        <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className={inputCls} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Categorie</label>
          <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Imagine URL</label>
          <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1">Excerpt</label>
        <textarea rows={2} value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className={inputCls + ' resize-none'} />
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1">Continut (HTML)</label>
        <textarea rows={10} value={form.content} onChange={e => setForm({...form, content: e.target.value})} className={inputCls + ' font-mono text-xs'} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">SEO Title</label>
          <input value={form.seo_title} onChange={e => setForm({...form, seo_title: e.target.value})} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">SEO Description</label>
          <input value={form.seo_description} onChange={e => setForm({...form, seo_description: e.target.value})} className={inputCls} />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} className="w-4 h-4" />
        <span className="text-sm font-medium text-primary">Publicat</span>
      </label>
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={saving} className="bg-accent text-white font-semibold px-8 py-3 rounded-lg hover:bg-accent-hover disabled:opacity-50">
          {saving ? 'Se salveaza...' : (form.id ? 'Salveaza' : 'Adauga articol')}
        </button>
        <button type="button" onClick={() => router.back()} className="px-8 py-3 rounded-lg border border-border text-text-light hover:bg-surface">Anuleaza</button>
      </div>
    </form>
  );
}
