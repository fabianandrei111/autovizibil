'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

type HeaderProps = {
  settings: {
    business_name: string;
    phone: string;
    whatsapp: string;
    instagram: string;
    tiktok: string;
  };
};

export default function Header({ settings }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const phoneLink = `tel:${settings.phone.replace(/\s/g, '')}`;
  const waLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Buna! Sunt interesat de masinile AutoVizibil si as vrea mai multe informatii.')}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.jpeg" alt="AutoVizibil" width={220} height={70} className="h-14 lg:h-16 w-auto" priority />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-text-light hover:text-primary transition-colors">Acasa</Link>
            <Link href="/masini" className="text-sm font-medium text-text-light hover:text-primary transition-colors">Masini</Link>
            <Link href="/oferte" className="text-sm font-medium text-accent hover:text-primary transition-colors">Oferte</Link>
            <Link href="/cauta-masina" className="text-sm font-medium text-text-light hover:text-primary transition-colors">Cauta o masina</Link>
            <Link href="/despre-noi" className="text-sm font-medium text-text-light hover:text-primary transition-colors">Despre noi</Link>
            <Link href="/blog" className="text-sm font-medium text-text-light hover:text-primary transition-colors">Blog</Link>
            <Link href="/contact" className="text-sm font-medium text-text-light hover:text-primary transition-colors">Contact</Link>
          </nav>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-text-light hover:text-primary transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="text-text-light hover:text-primary transition-colors" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 0010.86 4.48V13.4a8.27 8.27 0 005.58 2.16v-3.45a4.85 4.85 0 01-2.98-1.04V6.69h2.98z"/></svg>
              </a>
            </div>
            <a href={phoneLink} className="text-sm font-semibold text-primary">{settings.phone}</a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="bg-primary text-white px-5 py-2.5 text-sm font-semibold rounded-lg hover:bg-primary-light transition-colors">
              Vorbeste cu noi
            </a>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-3 lg:hidden">
            <a href={phoneLink} className="p-2 text-primary" aria-label="Suna">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            </a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="p-2 text-whatsapp" aria-label="WhatsApp">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-primary" aria-label="Menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-border">
          <nav className="px-4 py-4 space-y-1">
            <Link href="/" onClick={() => setMenuOpen(false)} className="block py-3 text-base font-medium text-text-light hover:text-primary">Acasa</Link>
            <Link href="/masini" onClick={() => setMenuOpen(false)} className="block py-3 text-base font-medium text-text-light hover:text-primary">Masini</Link>
            <Link href="/oferte" onClick={() => setMenuOpen(false)} className="block py-3 text-base font-medium text-accent hover:text-primary">Oferte</Link>
            <Link href="/cauta-masina" onClick={() => setMenuOpen(false)} className="block py-3 text-base font-medium text-text-light hover:text-primary">Cauta o masina</Link>
            <Link href="/despre-noi" onClick={() => setMenuOpen(false)} className="block py-3 text-base font-medium text-text-light hover:text-primary">Despre noi</Link>
            <Link href="/blog" onClick={() => setMenuOpen(false)} className="block py-3 text-base font-medium text-text-light hover:text-primary">Blog</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="block py-3 text-base font-medium text-text-light hover:text-primary">Contact</Link>
            <div className="pt-4 border-t border-border flex gap-3">
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-text-light">Instagram</a>
              <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="text-text-light">TikTok</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
