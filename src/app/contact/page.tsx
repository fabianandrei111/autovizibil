import PublicLayout from '@/components/PublicLayout';
import LeadForm from '@/components/LeadForm';
import Link from 'next/link';
import { getSettings } from '@/lib/settings';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact AutoVizibil | Suna 0742 902 242 | Import Masini Europa',
  description: 'Contacteaza AutoVizibil: telefon 0742 902 242, WhatsApp sau formular de contact. Import masini verificate din Germania si Danemarca, Bucuresti.',
  openGraph: {
    title: 'Contact AutoVizibil | Suna 0742 902 242',
    description: 'Contacteaza AutoVizibil: telefon, WhatsApp sau formular de contact. Import masini verificate din Germania si Danemarca.',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'AutoVizibil',
    url: 'https://autovizibil.ro/contact',
  },
  alternates: {
    canonical: 'https://autovizibil.ro/contact',
  },
};

export default function ContactPage() {
  const settings = getSettings();
  const phoneLink = `tel:${settings.phone.replace(/\s/g, '')}`;
  const waLink = `https://wa.me/${settings.whatsapp}`;

  const contactBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Acasa", item: "https://autovizibil.ro" },
      { "@type": "ListItem", position: 2, name: "Contact", item: "https://autovizibil.ro/contact" },
    ],
  };

  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact AutoVizibil",
    description: "Contacteaza AutoVizibil: telefon 0742 902 242, WhatsApp sau formular de contact.",
    url: "https://autovizibil.ro/contact",
    mainEntity: {
      "@type": "AutoDealer",
      "@id": "https://autovizibil.ro/#organization",
      name: settings.business_name,
      telephone: "+40742902242",
      email: settings.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address,
        addressLocality: "Bucuresti",
        addressRegion: "Bucuresti",
        addressCountry: "RO",
      },
    },
  };

  return (
    <PublicLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }} />
      {/* Breadcrumbs */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb" className="text-sm text-text-lighter flex items-center gap-2">
            <Link href="/" className="hover:text-primary">Acasa</Link>
            <span aria-hidden="true">/</span>
            <span className="text-primary font-medium" aria-current="page">Contact</span>
          </nav>
        </div>
      </div>

      <section className="bg-surface py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary">Contact</h1>
          <p className="text-text-light mt-3">Suntem aici sa te ajutam. Contacteaza-ne prin orice canal preferi.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">{settings.business_name}</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-accent mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  <div>
                    <p className="font-semibold text-primary">Telefon</p>
                    <a href={phoneLink} className="text-text-light hover:text-accent">{settings.phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-whatsapp mt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <div>
                    <p className="font-semibold text-primary">WhatsApp</p>
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-text-light hover:text-whatsapp">Scrie pe WhatsApp</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-accent mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <div>
                    <p className="font-semibold text-primary">Email</p>
                    <span className="text-text-light">{settings.email}</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-accent mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <div>
                    <p className="font-semibold text-primary">Adresa</p>
                    <span className="text-text-light">{settings.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-primary mb-2">Program</h3>
              <div className="text-sm text-text-light space-y-1">
                {settings.program.split('|').map((line, i) => <p key={i}>{line.trim()}</p>)}
              </div>
            </div>

          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border border-border p-6 lg:p-8">
            <h3 className="text-xl font-bold text-primary mb-1">Trimite un mesaj</h3>
            <p className="text-sm text-text-light mb-6">Completeaza formularul si te contactam noi.</p>
            <LeadForm type="contact" />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
