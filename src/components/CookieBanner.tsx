'use client';
import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('av_cookies_accepted')) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem('av_cookies_accepted', 'true');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-white p-4 lg:p-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300">
          Acest site foloseste cookie-uri pentru a imbunatati experienta ta. Continuand navigarea, esti de acord cu{' '}
          <a href="/politica-confidentialitate" className="underline text-white">politica de confidentialitate</a>.
        </p>
        <button onClick={accept} className="bg-accent text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-accent-hover transition-colors whitespace-nowrap">
          Accept
        </button>
      </div>
    </div>
  );
}
