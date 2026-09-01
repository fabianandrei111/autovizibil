import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoVizibil | Masini atent selectate",
  description: "Descopera masini atent selectate si vorbeste direct cu AutoVizibil. Intermediere auto profesionala cu accent pe transparenta si calitate.",
  openGraph: {
    title: "AutoVizibil | Masini atent selectate",
    description: "Descopera masini atent selectate si vorbeste direct cu AutoVizibil.",
    type: "website",
    locale: "ro_RO",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
