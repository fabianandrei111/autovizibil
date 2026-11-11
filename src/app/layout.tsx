import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: "AutoVizibil | Masini din Europa - Import Auto Germania & Danemarca",
    template: "%s | AutoVizibil",
  },
  description: "AutoVizibil - import masini verificate din Germania si Danemarca. Peste 40 masini disponibile, leasing, finantare, documente complete. Suna: 0742 902 242",
  keywords: ["masini import germania", "masini import danemarca", "import auto europa", "masini second hand verificate", "dealer auto romania", "autovizibil", "masini la comanda", "import auto bucuresti"],
  openGraph: {
    title: "AutoVizibil | Masini din Europa - Import Auto Germania & Danemarca",
    description: "Import masini verificate din Germania si Danemarca. Peste 40 masini disponibile. Leasing si finantare.",
    type: "website",
    locale: "ro_RO",
    siteName: "AutoVizibil",
    url: "https://autovizibil.ro",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoVizibil | Masini din Europa - Import Auto Germania & Danemarca",
    description: "Import masini verificate din Germania si Danemarca. Peste 40 masini disponibile. Leasing si finantare.",
  },
  metadataBase: new URL("https://autovizibil.ro"),
  alternates: {
    canonical: "https://autovizibil.ro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AutoDealer",
      "@id": "https://autovizibil.ro/#organization",
      name: "AutoVizibil",
      alternateName: "AutoVizibil - Import Masini Europa",
      url: "https://autovizibil.ro",
      logo: "https://autovizibil.ro/logo.jpeg",
      image: "https://autovizibil.ro/logo.jpeg",
      description: "AutoVizibil - dealer auto specializat in importul de masini verificate din Germania si Danemarca. Peste 40 masini disponibile, leasing, finantare, documente complete.",
      telephone: "+40742902242",
      email: "contact@autovizibil.ro",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Bucuresti",
        addressLocality: "Bucuresti",
        addressRegion: "Bucuresti",
        postalCode: "010000",
        addressCountry: "RO",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "44.4268",
        longitude: "26.1025",
      },
      areaServed: {
        "@type": "Country",
        name: "Romania",
      },
      priceRange: "5000 EUR - 60000 EUR",
      currenciesAccepted: "EUR, RON",
      paymentAccepted: "Cash, Bank Transfer, Leasing",
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "09:00", closes: "18:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "14:00" },
      ],
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+40742902242",
        contactType: "sales",
        availableLanguage: ["Romanian", "English"],
        areaServed: "RO",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://autovizibil.ro/#website",
      url: "https://autovizibil.ro",
      name: "AutoVizibil",
      description: "Import masini verificate din Germania si Danemarca. Peste 40 masini disponibile.",
      inLanguage: "ro-RO",
      publisher: { "@id": "https://autovizibil.ro/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: "https://autovizibil.ro/masini?q={search_term_string}" },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`h-full antialiased ${inter.variable}`}>
      <head>
        <meta name="geo.region" content="RO" />
        <meta name="geo.placename" content="Bucuresti" />
        <meta name="geo.position" content="44.4268;26.1025" />
        <meta name="ICBM" content="44.4268, 26.1025" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
