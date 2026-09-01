'use client';
import { useState } from 'react';

type LeadFormProps = {
  carId?: string;
  carName?: string;
  type?: string;
};

export default function LeadForm({ carId, carName, type = 'contact' }: LeadFormProps) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, car_id: carId || '', car_name: carName || '', type, source: 'Website' }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', phone: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <svg className="w-12 h-12 text-success mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <h3 className="font-semibold text-lg text-primary">Mesaj trimis!</h3>
        <p className="text-text-light mt-1">Te vom contacta in cel mai scurt timp.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input type="text" placeholder="Numele tau *" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
      </div>
      <div>
        <input type="tel" placeholder="Telefon *" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
      </div>
      <div>
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
      </div>
      <div>
        <textarea placeholder="Mesajul tau" rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none" />
      </div>
      <label className="flex items-start gap-2 text-xs text-text-light">
        <input type="checkbox" required className="mt-0.5" />
        <span>Sunt de acord cu <a href="/politica-confidentialitate" className="underline">politica de confidentialitate</a>.</span>
      </label>
      <button type="submit" disabled={status === 'loading'} className="w-full bg-accent text-white font-semibold py-3 rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50">
        {status === 'loading' ? 'Se trimite...' : 'Solicita informatii'}
      </button>
    </form>
  );
}
