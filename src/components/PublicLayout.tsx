import Header from './Header';
import Footer from './Footer';
import FloatingActions from './FloatingActions';
import CookieBanner from './CookieBanner';
import { getSettings } from '@/lib/settings';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();

  return (
    <>
      <a href="#main-content" className="skip-to-content">Salt la continut</a>
      <Header settings={settings} />
      <main id="main-content" className="flex-1 pt-16 lg:pt-20">
        {children}
      </main>
      <Footer settings={settings} />
      <FloatingActions whatsapp={settings.whatsapp} phone={settings.phone} />
      <CookieBanner />
    </>
  );
}
