import PublicLayout from '@/components/PublicLayout';
import { getSettings } from '@/lib/settings';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Politica de confidentialitate | AutoVizibil' };

export default function PrivacyPage() {
  const settings = getSettings();
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-primary mb-8">Politica de confidentialitate</h1>
        <div className="prose max-w-none text-text-light space-y-4 text-sm leading-relaxed">
          <p><strong>{settings.business_name}</strong> respecta confidentialitatea datelor tale personale.</p>
          <h2 className="text-lg font-bold text-primary mt-6">Ce date colectam</h2>
          <p>Colectam doar datele pe care ni le furnizezi voluntar prin formularele de contact: nume, telefon, email si preferintele legate de masini.</p>
          <h2 className="text-lg font-bold text-primary mt-6">Cum folosim datele</h2>
          <p>Datele sunt folosite exclusiv pentru a te contacta in legatura cu solicitarea ta si pentru a-ti oferi informatii relevante despre masinile disponibile.</p>
          <h2 className="text-lg font-bold text-primary mt-6">Stocarea datelor</h2>
          <p>Datele tale sunt stocate in siguranta si nu sunt partajate cu terti fara acordul tau explicit.</p>
          <h2 className="text-lg font-bold text-primary mt-6">Cookie-uri</h2>
          <p>Acest site foloseste cookie-uri esentiale pentru functionare si cookie-uri analitice pentru a imbunatati experienta utilizatorilor.</p>
          <h2 className="text-lg font-bold text-primary mt-6">Drepturile tale</h2>
          <p>Ai dreptul de a solicita accesul, rectificarea sau stergerea datelor tale personale contactandu-ne la {settings.email} sau {settings.phone}.</p>
        </div>
      </div>
    </PublicLayout>
  );
}
