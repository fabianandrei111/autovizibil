'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PasswordForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/site-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(next);
      router.refresh();
    } else {
      setError('Parola incorecta.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <span className="text-3xl font-black text-white tracking-tight">
            AUTO<span className="text-[#dc2626]">VIZIBIL</span>
          </span>
          <p className="text-gray-500 text-sm mt-3">Acest site este protejat. Introdu parola pentru a continua.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-8 space-y-4">
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Parola de acces"
            autoFocus
            className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#dc2626]/50 focus:border-[#dc2626]"
          />
          {error && <p className="text-[#dc2626] text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#dc2626] text-white font-semibold py-3 rounded-lg hover:bg-[#b91c1c] transition-colors disabled:opacity-50"
          >
            {loading ? 'Se verifica...' : 'Acceseaza site-ul'}
          </button>
        </form>
        <p className="text-gray-600 text-xs mt-6">Demo privat &mdash; acces restrictionat</p>
      </div>
    </div>
  );
}

export default function PasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <span className="text-white">Se incarca...</span>
      </div>
    }>
      <PasswordForm />
    </Suspense>
  );
}
