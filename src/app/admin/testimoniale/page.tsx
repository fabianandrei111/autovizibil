'use client';
import { useEffect, useState } from 'react';

type Testimonial = { id: string; name: string; car: string; text: string; rating: number; image: string; published: number };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ name: '', car: '', text: '', rating: 5, image: '', published: true });

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const res = await fetch('/api/testimonials');
    setItems(await res.json());
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const payload = editing ? { ...form, id: editing.id, published: form.published ? 1 : 0 } : { ...form, published: form.published ? 1 : 0 };
    await fetch('/api/testimonials', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setEditing(null);
    setForm({ name: '', car: '', text: '', rating: 5, image: '', published: true });
    fetchItems();
  }

  async function deleteItem(id: string) {
    if (!confirm('Stergi acest testimonial?')) return;
    await fetch('/api/testimonials', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchItems();
  }

  function startEdit(t: Testimonial) {
    setEditing(t);
    setForm({ name: t.name, car: t.car, text: t.text, rating: t.rating, image: t.image, published: !!t.published });
  }

  const inputCls = "w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20";

  if (loading) return <div className="text-text-light">Se incarca...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Testimoniale ({items.length})</h1>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-border p-6 mb-8">
        <h2 className="font-semibold text-primary mb-4">{editing ? 'Editeaza' : 'Adauga testimonial'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Nume *</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Masina</label>
            <input value={form.car} onChange={e => setForm({...form, car: e.target.value})} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-primary mb-1">Text *</label>
            <textarea required rows={3} value={form.text} onChange={e => setForm({...form, text: e.target.value})} className={inputCls + ' resize-none'} />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Rating (1-5)</label>
            <input type="number" min={1} max={5} value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Imagine URL</label>
            <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className={inputCls} />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} className="w-4 h-4" />
            <span className="text-sm font-medium text-primary">Publicat</span>
          </label>
          <button type="submit" className="bg-accent text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-accent-hover text-sm">
            {editing ? 'Salveaza' : 'Adauga'}
          </button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', car: '', text: '', rating: 5, image: '', published: true }); }} className="text-sm text-text-light">Anuleaza</button>}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(t => (
          <div key={t.id} className={`bg-white rounded-xl border border-border p-5 ${!t.published ? 'opacity-50' : ''}`}>
            <div className="flex gap-1 mb-2">
              {Array.from({ length: t.rating }).map((_, i) => <span key={i} className="text-warning">★</span>)}
            </div>
            <p className="text-sm text-text-light italic">&ldquo;{t.text}&rdquo;</p>
            <p className="font-semibold text-primary text-sm mt-3">{t.name}</p>
            {t.car && <p className="text-xs text-text-lighter">{t.car}</p>}
            <div className="flex gap-2 mt-3 pt-3 border-t border-border">
              <button onClick={() => startEdit(t)} className="text-primary hover:text-accent text-sm font-medium">Edit</button>
              <button onClick={() => deleteItem(t.id)} className="text-accent hover:text-accent-hover text-sm font-medium">Sterge</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
