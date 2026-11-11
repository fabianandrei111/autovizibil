'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Email sau parola incorecta.');
      }
    } catch {
      setError('Eroare de conexiune.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/logo.jpeg" alt="AutoVizibil" width={240} height={75} className="h-20 w-auto mx-auto" />
          <p className="text-sm text-text-light mt-2">Panou de administrare</p>
        </div>
        <form onSubmit={handleLogin} className="bg-white rounded-xl border border-border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Parola</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Parola" className="w-full px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          {error && <p className="text-sm text-accent">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50">
            {loading ? 'Se conecteaza...' : 'Conecteaza-te'}
          </button>
          <p className="text-xs text-text-lighter text-center">Acces restrictionat</p>
        </form>
      </div>
    </div>
  );
}
