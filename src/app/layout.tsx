import type { Metadata } from "next";
import "./globals.css";

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
  },
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
      url: "https://autovizibil.ro",
      telephone: "+40742902242",
      email: "contact@autovizibil.ro",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bucuresti",
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
      priceRange: "€€",
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "09:00", closes: "18:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "14:00" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://autovizibil.ro/#website",
      url: "https://autovizibil.ro",
      name: "AutoVizibil",
      publisher: { "@id": "https://autovizibil.ro/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: "https://autovizibil.ro/masini?q={search_term_string}" },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Cum functioneaza importul la comanda?", acceptedAnswer: { "@type": "Answer", text: "Alegi masina din portofoliul nostru, platesti un avans minim de 30%, iar noi ne ocupam de import, transport si livrare din Europa in 7-14 zile lucratoare." } },
        { "@type": "Question", name: "Cat costa avansul?", acceptedAnswer: { "@type": "Answer", text: "Avansul minim este de 30% din pretul masinii. Restul se poate achita integral la livrare sau prin leasing/finantare." } },
        { "@type": "Question", name: "Pot face leasing?", acceptedAnswer: { "@type": "Answer", text: "Da! Oferim posibilitate de leasing prin partenerii nostri financiari. Te ajutam cu tot procesul de la A la Z." } },
        { "@type": "Question", name: "Masina are garantie si documente?", acceptedAnswer: { "@type": "Answer", text: "Toate masinile importate au istoric verificat si documente complete. Te ajutam si cu inmatricularea in Romania." } },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
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
