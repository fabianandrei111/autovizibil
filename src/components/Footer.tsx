import Link from 'next/link';

type FooterProps = {
  settings: {
    business_name: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    program: string;
    instagram: string;
    tiktok: string;
  };
};

export default function Footer({ settings }: FooterProps) {
  const phoneLink = `tel:${settings.phone.replace(/\s/g, '')}`;
  const waLink = `https://wa.me/${settings.whatsapp}`;

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <span className="text-2xl font-black tracking-tight">AUTO<span className="text-accent">VIZIBIL</span></span>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">Masini atent selectate. Consultanta personalizata. Experienta simpla de cumparare.</p>
            <div className="flex gap-4 mt-6">
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 0010.86 4.48V13.4a8.27 8.27 0 005.58 2.16v-3.45a4.85 4.85 0 01-2.98-1.04V6.69h2.98z"/></svg>
              </a>
            </div>
          </div>

          {/* Navigatie */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Navigatie</h3>
            <ul className="space-y-3">
              <li><Link href="/masini" className="text-sm text-gray-400 hover:text-white transition-colors">Masini</Link></li>
              <li><Link href="/cauta-masina" className="text-sm text-gray-400 hover:text-white transition-colors">Cauta o masina</Link></li>
              <li><Link href="/despre-noi" className="text-sm text-gray-400 hover:text-white transition-colors">Despre noi</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li><a href={phoneLink} className="text-sm text-gray-400 hover:text-white transition-colors">{settings.phone}</a></li>
              <li><a href={waLink} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">WhatsApp</a></li>
              <li><span className="text-sm text-gray-400">{settings.email}</span></li>
              <li><span className="text-sm text-gray-400">{settings.address}</span></li>
            </ul>
          </div>

          {/* Program */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Program</h3>
            <div className="text-sm text-gray-400 space-y-2">
              {settings.program.split('|').map((line, i) => (
                <p key={i}>{line.trim()}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} {settings.business_name}. Toate drepturile rezervate.</p>
          <div className="flex gap-6">
            <Link href="/politica-confidentialitate" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Confidentialitate</Link>
            <Link href="/termeni" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Termeni</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
