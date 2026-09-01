import Header from './Header';
import Footer from './Footer';
import FloatingActions from './FloatingActions';
import CookieBanner from './CookieBanner';
import { getSettings } from '@/lib/settings';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1 pt-16 lg:pt-20">
        {children}
      </main>
      <Footer settings={settings} />
      <FloatingActions whatsapp={settings.whatsapp} phone={settings.phone} />
      <CookieBanner />
    </>
  );
}
