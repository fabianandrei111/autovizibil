'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type CarData = {
  id?: string; brand: string; model: string; version: string; year: number; price: number;
  currency: string; mileage: number; fuel: string; transmission: string; engine: string;
  horsepower: number; drivetrain: string; body_type: string; color: string; location: string;
  description: string; features: string; images: string; video_url: string; status: string; featured: boolean;
};

const DEFAULTS: CarData = {
  brand: '', model: '', version: '', year: 2024, price: 0, currency: 'EUR', mileage: 0,
  fuel: 'Benzina', transmission: 'Automata', engine: '', horsepower: 0, drivetrain: '',
  body_type: 'Sedan', color: '', location: '', description: '', features: '[]', images: '[]',
  video_url: '', status: 'active', featured: false,
};

export default function CarForm({ initial }: { initial?: CarData }) {
  const [form, setForm] = useState<CarData>(initial || DEFAULTS);
  const [featuresText, setFeaturesText] = useState(() => {
    try { return JSON.parse(form.features).join('\n'); } catch { return ''; }
  });
  const [imagesText, setImagesText] = useState(() => {
    try { return JSON.parse(form.images).join('\n'); } catch { return ''; }
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      features: JSON.stringify(featuresText.split('\n').map((s: string) => s.trim()).filter(Boolean)),
      images: JSON.stringify(imagesText.split('\n').map((s: string) => s.trim()).filter(Boolean)),
    };
    const method = form.id ? 'PUT' : 'POST';
    await fetch('/api/cars', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    router.push('/admin/masini');
    router.refresh();
  }

  const inputCls = "w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Marca *</label>
          <input required value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Model *</label>
          <input required value={form.model} onChange={e => setForm({...form, model: e.target.value})} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Versiune</label>
          <input value={form.version} onChange={e => setForm({...form, version: e.target.value})} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">An *</label>
          <input type="number" required value={form.year} onChange={e => setForm({...form, year: Number(e.target.value)})} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Pret *</label>
          <input type="number" required value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Moneda</label>
          <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className={inputCls}>
            <option value="EUR">EUR</option>
            <option value="RON">RON</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Kilometraj *</label>
          <input type="number" required value={form.mileage} onChange={e => setForm({...form, mileage: Number(e.target.value)})} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Combustibil</label>
          <select value={form.fuel} onChange={e => setForm({...form, fuel: e.target.value})} className={inputCls}>
            <option>Benzina</option><option>Diesel</option><option>Hybrid</option><option>Electric</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Transmisie</label>
          <select value={form.transmission} onChange={e => setForm({...form, transmission: e.target.value})} className={inputCls}>
            <option>Automata</option><option>Manuala</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Motor</label>
          <input value={form.engine} onChange={e => setForm({...form, engine: e.target.value})} placeholder="2.0L I4 Turbo" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Putere (CP)</label>
          <input type="number" value={form.horsepower} onChange={e => setForm({...form, horsepower: Number(e.target.value)})} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Tractiune</label>
          <input value={form.drivetrain} onChange={e => setForm({...form, drivetrain: e.target.value})} placeholder="4x4, FWD, RWD" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Caroserie</label>
          <select value={form.body_type} onChange={e => setForm({...form, body_type: e.target.value})} className={inputCls}>
            <option>Sedan</option><option>SUV</option><option>Hatchback</option><option>Coupe</option><option>Break</option><option>SUV Coupe</option><option>Cabrio</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Culoare</label>
          <input value={form.color} onChange={e => setForm({...form, color: e.target.value})} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Locatie</label>
          <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-1">Descriere</label>
        <textarea rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputCls + ' resize-none'} />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-1">Dotari (una per linie)</label>
        <textarea rows={5} value={featuresText} onChange={e => setFeaturesText(e.target.value)} placeholder="Piele&#10;Navigatie&#10;Camera 360" className={inputCls + ' resize-none'} />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-1">Imagini URLs (una per linie)</label>
        <textarea rows={4} value={imagesText} onChange={e => setImagesText(e.target.value)} placeholder="https://..." className={inputCls + ' resize-none'} />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-1">Video URL</label>
        <input value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} placeholder="https://youtube.com/..." className={inputCls} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Status</label>
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className={inputCls}>
            <option value="active">Activ</option>
            <option value="sold">Vandut</option>
            <option value="reserved">Rezervat</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="w-4 h-4" />
            <span className="text-sm font-medium text-primary">Featured</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={saving} className="bg-accent text-white font-semibold px-8 py-3 rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50">
          {saving ? 'Se salveaza...' : (form.id ? 'Salveaza modificarile' : 'Adauga masina')}
        </button>
        <button type="button" onClick={() => router.back()} className="px-8 py-3 rounded-lg border border-border text-text-light hover:bg-surface transition-colors">
          Anuleaza
        </button>
      </div>
    </form>
  );
}
