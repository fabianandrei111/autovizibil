import PublicLayout from '@/components/PublicLayout';
import { getSettings } from '@/lib/settings';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Termeni si conditii | AutoVizibil' };

export default function TermsPage() {
  const settings = getSettings();
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-primary mb-8">Termeni si conditii</h1>
        <div className="prose max-w-none text-text-light space-y-4 text-sm leading-relaxed">
          <p>Prin utilizarea site-ului <strong>{settings.business_name}</strong> accepti urmatorii termeni si conditii.</p>
          <h2 className="text-lg font-bold text-primary mt-6">Servicii</h2>
          <p>{settings.business_name} ofera servicii de intermediere auto si consultanta in achizitia de vehicule. Nu suntem dealer auto si nu vindem masini in mod direct.</p>
          <h2 className="text-lg font-bold text-primary mt-6">Informatii</h2>
          <p>Informatiile prezentate pe site (preturi, specificatii, disponibilitate) sunt cu titlu informativ si pot suferi modificari. Preturile finale se stabilesc in discutia directa.</p>
          <h2 className="text-lg font-bold text-primary mt-6">Responsabilitate</h2>
          <p>Nu ne asumam responsabilitatea pentru tranzactii efectuate in afara serviciilor noastre de intermediere.</p>
          <h2 className="text-lg font-bold text-primary mt-6">Contact</h2>
          <p>Pentru orice intrebari legate de acesti termeni, contacteaza-ne la {settings.email} sau {settings.phone}.</p>
        </div>
      </div>
    </PublicLayout>
  );
}
