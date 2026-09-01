'use client';
import { useEffect, useState } from 'react';

type Settings = Record<string, string>;

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => { setSettings(data); setLoading(false); });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function update(key: string, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  const inputCls = "w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20";

  if (loading) return <div className="text-text-light">Se incarca...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Setari</h1>
      <form onSubmit={handleSave} className="max-w-2xl space-y-8">
        {/* Business */}
        <section>
          <h2 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-border">Business</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Numele business-ului</label>
              <input value={settings.business_name || ''} onChange={e => update('business_name', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Logo URL</label>
              <input value={settings.logo || ''} onChange={e => update('logo', e.target.value)} placeholder="URL catre logo" className={inputCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Telefon</label>
                <input value={settings.phone || ''} onChange={e => update('phone', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">WhatsApp (fara +)</label>
                <input value={settings.whatsapp || ''} onChange={e => update('whatsapp', e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Email</label>
              <input value={settings.email || ''} onChange={e => update('email', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Adresa</label>
              <input value={settings.address || ''} onChange={e => update('address', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Program (separare cu |)</label>
              <input value={settings.program || ''} onChange={e => update('program', e.target.value)} className={inputCls} />
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section>
          <h2 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-border">Social Media</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Instagram URL</label>
              <input value={settings.instagram || ''} onChange={e => update('instagram', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">TikTok URL</label>
              <input value={settings.tiktok || ''} onChange={e => update('tiktok', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Facebook URL</label>
              <input value={settings.facebook || ''} onChange={e => update('facebook', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">YouTube URL</label>
              <input value={settings.youtube || ''} onChange={e => update('youtube', e.target.value)} className={inputCls} />
            </div>
          </div>
        </section>

        {/* Homepage */}
        <section>
          <h2 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-border">Homepage</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Hero Title</label>
              <input value={settings.hero_title || ''} onChange={e => update('hero_title', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Hero Subtitle</label>
              <input value={settings.hero_subtitle || ''} onChange={e => update('hero_subtitle', e.target.value)} className={inputCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">CTA Principal</label>
                <input value={settings.hero_cta || ''} onChange={e => update('hero_cta', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">CTA Secundar</label>
                <input value={settings.hero_cta_secondary || ''} onChange={e => update('hero_cta_secondary', e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-4 pt-4">
          <button type="submit" disabled={saving} className="bg-accent text-white font-semibold px-8 py-3 rounded-lg hover:bg-accent-hover disabled:opacity-50">
            {saving ? 'Se salveaza...' : 'Salveaza setarile'}
          </button>
          {saved && <span className="text-success text-sm font-medium">Setarile au fost salvate!</span>}
        </div>
      </form>
    </div>
  );
}
