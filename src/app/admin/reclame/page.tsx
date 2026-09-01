'use client';
import { useEffect, useState } from 'react';

type Ad = { id: string; title: string; image: string; link: string; position: string; start_date: string; end_date: string; active: number };

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Ad | null>(null);
  const [form, setForm] = useState({ title: '', image: '', link: '', position: 'homepage', start_date: '', end_date: '', active: true });

  useEffect(() => { fetchAds(); }, []);

  async function fetchAds() {
    const res = await fetch('/api/ads');
    setAds(await res.json());
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const payload = editing ? { ...form, id: editing.id, active: form.active ? 1 : 0 } : { ...form, active: form.active ? 1 : 0 };
    await fetch('/api/ads', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setEditing(null);
    setForm({ title: '', image: '', link: '', position: 'homepage', start_date: '', end_date: '', active: true });
    fetchAds();
  }

  async function deleteAd(id: string) {
    if (!confirm('Stergi aceasta reclama?')) return;
    await fetch('/api/ads', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchAds();
  }

  async function toggleActive(ad: Ad) {
    await fetch('/api/ads', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...ad, active: ad.active ? 0 : 1 }) });
    fetchAds();
  }

  function startEdit(ad: Ad) {
    setEditing(ad);
    setForm({ title: ad.title, image: ad.image, link: ad.link, position: ad.position, start_date: ad.start_date, end_date: ad.end_date, active: !!ad.active });
  }

  const inputCls = "w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20";

  if (loading) return <div className="text-text-light">Se incarca...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Reclame ({ads.length})</h1>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-border p-6 mb-8">
        <h2 className="font-semibold text-primary mb-4">{editing ? 'Editeaza reclama' : 'Adauga reclama noua'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Titlu *</label>
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Imagine URL</label>
            <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Link</label>
            <input value={form.link} onChange={e => setForm({...form, link: e.target.value})} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Pozitie</label>
            <select value={form.position} onChange={e => setForm({...form, position: e.target.value})} className={inputCls}>
              <option value="homepage">Homepage</option>
              <option value="listing">Listing masini</option>
              <option value="car_page">Pagina masina</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Data start</label>
            <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Data sfarsit</label>
            <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} className={inputCls} />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} className="w-4 h-4" />
            <span className="text-sm font-medium text-primary">Activa</span>
          </label>
          <button type="submit" className="bg-accent text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-accent-hover text-sm">
            {editing ? 'Salveaza' : 'Adauga'}
          </button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ title: '', image: '', link: '', position: 'homepage', start_date: '', end_date: '', active: true }); }} className="text-sm text-text-light hover:text-primary">Anuleaza</button>}
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-text-lighter">Titlu</th>
              <th className="text-left py-3 px-4 font-medium text-text-lighter">Pozitie</th>
              <th className="text-left py-3 px-4 font-medium text-text-lighter">Activa</th>
              <th className="text-left py-3 px-4 font-medium text-text-lighter">Actiuni</th>
            </tr>
          </thead>
          <tbody>
            {ads.map(ad => (
              <tr key={ad.id} className="border-t border-border hover:bg-surface/50">
                <td className="py-3 px-4 font-medium text-primary">{ad.title}</td>
                <td className="py-3 px-4 text-text-light capitalize">{ad.position}</td>
                <td className="py-3 px-4">
                  <button onClick={() => toggleActive(ad)} className={`badge ${ad.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {ad.active ? 'Da' : 'Nu'}
                  </button>
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <button onClick={() => startEdit(ad)} className="text-primary hover:text-accent text-sm font-medium">Edit</button>
                  <button onClick={() => deleteAd(ad.id)} className="text-accent hover:text-accent-hover text-sm font-medium">Sterge</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
