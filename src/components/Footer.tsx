import Link from 'next/link';
import Image from 'next/image';

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
            <Image src="/logo.jpeg" alt="AutoVizibil" width={220} height={70} className="h-14 w-auto brightness-0 invert" />
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">Masini atent selectate. Consultanta personalizata. Experienta simpla de cumparare.</p>
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
