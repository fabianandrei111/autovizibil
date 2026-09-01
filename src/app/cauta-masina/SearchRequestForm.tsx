'use client';
import { useState } from 'react';

export default function SearchRequestForm() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', budget: '', preferred_brand: '', preferred_model: '',
    min_year: '', max_mileage: '', preferred_fuel: '', preferred_transmission: '',
    preferred_body: '', preferences: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'search_request', source: 'Website', message: `Buget: ${form.budget}, Preferinte: ${form.preferences}` }),
      });
      if (res.ok) setStatus('success'); else setStatus('error');
    } catch { setStatus('error'); }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <svg className="w-16 h-16 text-success mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <h2 className="text-2xl font-bold text-primary">Cererea ta a fost trimisa!</h2>
        <p className="text-text-light mt-2">Te vom contacta in cel mai scurt timp cu variantele potrivite.</p>
      </div>
    );
  }

  const inputCls = "w-full px-4 py-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Buget (EUR)</label>
          <input type="text" placeholder="ex. 30.000 - 40.000" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Marca preferata</label>
          <select value={form.preferred_brand} onChange={e => setForm({...form, preferred_brand: e.target.value})} className={inputCls}>
            <option value="">Orice marca</option>
            {['BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Volkswagen', 'Range Rover', 'Volvo', 'Toyota', 'Hyundai', 'Skoda'].map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Model</label>
          <input type="text" placeholder="ex. Seria 5, C-Class" value={form.preferred_model} onChange={e => setForm({...form, preferred_model: e.target.value})} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">An minim</label>
          <input type="number" placeholder="2020" value={form.min_year} onChange={e => setForm({...form, min_year: e.target.value})} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Kilometri maximi</label>
          <input type="number" placeholder="100000" value={form.max_mileage} onChange={e => setForm({...form, max_mileage: e.target.value})} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Combustibil</label>
          <select value={form.preferred_fuel} onChange={e => setForm({...form, preferred_fuel: e.target.value})} className={inputCls}>
            <option value="">Orice</option>
            <option value="Benzina">Benzina</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Transmisie</label>
          <select value={form.preferred_transmission} onChange={e => setForm({...form, preferred_transmission: e.target.value})} className={inputCls}>
            <option value="">Orice</option>
            <option value="Automata">Automata</option>
            <option value="Manuala">Manuala</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Caroserie</label>
          <select value={form.preferred_body} onChange={e => setForm({...form, preferred_body: e.target.value})} className={inputCls}>
            <option value="">Orice</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Coupe">Coupe</option>
            <option value="Break">Break</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1">Alte preferinte</label>
        <textarea rows={3} placeholder="Dotari, culoare, alte detalii..." value={form.preferences} onChange={e => setForm({...form, preferences: e.target.value})} className={inputCls + ' resize-none'} />
      </div>
      <hr className="border-border" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Numele tau *</label>
          <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Telefon *</label>
          <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Email</label>
          <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputCls} />
        </div>
      </div>
      <label className="flex items-start gap-2 text-xs text-text-light">
        <input type="checkbox" required className="mt-0.5" />
        <span>Sunt de acord cu <a href="/politica-confidentialitate" className="underline">politica de confidentialitate</a>.</span>
      </label>
      <button type="submit" disabled={status === 'loading'} className="w-full bg-accent text-white font-bold py-4 rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 text-lg">
        {status === 'loading' ? 'Se trimite...' : 'Trimite cererea'}
      </button>
    </form>
  );
}
