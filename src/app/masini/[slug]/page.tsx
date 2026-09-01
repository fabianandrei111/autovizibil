import PublicLayout from '@/components/PublicLayout';
import LeadForm from '@/components/LeadForm';
import { Car } from '@/components/CarCard';
import { ensureSeeded, getCarBySlug, getSettings } from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import CarGallery from './CarGallery';
import FinancingCalculator from './FinancingCalculator';
import ShareButtons from './ShareButtons';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  ensureSeeded();
  const { slug } = await params;
  const car = getCarBySlug(slug) as unknown as Car | undefined;
  if (!car) return { title: 'Masina negasita | AutoVizibil' };
  const title = `${car.brand} ${car.model} ${car.version} ${car.year} | AutoVizibil`;
  const description = `${car.brand} ${car.model} ${car.version}, ${car.year}, ${car.mileage.toLocaleString('ro-RO')} km, ${car.fuel}, ${car.transmission}, ${car.horsepower} CP - ${car.currency === 'EUR' ? '\u20AC' : 'RON'}${car.price.toLocaleString('ro-RO')}`;
  const images: string[] = JSON.parse(car.images || '[]');
  return {
    title,
    description,
    openGraph: { title, description, images: images[0] ? [images[0]] : [], type: 'article', locale: 'ro_RO' },
  };
}

export default async function CarPage({ params }: Props) {
  ensureSeeded();
  const { slug } = await params;
  const car = getCarBySlug(slug) as unknown as Car | undefined;
  if (!car) notFound();

  const settings = getSettings();
  const images: string[] = JSON.parse(car.images || '[]');
  const features: string[] = JSON.parse(car.features || '[]');
  const carName = `${car.brand} ${car.model} ${car.version} ${car.year}`;
  const waMessage = `Buna! Sunt interesat de ${car.brand} ${car.model} ${car.version} ${car.year} de pe AutoVizibil. Mai este disponibila?`;
  const waLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(waMessage)}`;
  const phoneLink = `tel:${settings.phone.replace(/\s/g, '')}`;

  const specs = [
    { label: 'Motor', value: car.engine },
    { label: 'Putere', value: car.horsepower > 0 ? `${car.horsepower} CP` : '' },
    { label: 'Combustibil', value: car.fuel },
    { label: 'Cutie', value: car.transmission },
    { label: 'Tractiune', value: car.drivetrain },
    { label: 'Kilometraj', value: `${car.mileage.toLocaleString('ro-RO')} km` },
    { label: 'An', value: String(car.year) },
    { label: 'Culoare', value: car.color },
    { label: 'Caroserie', value: car.body_type },
    { label: 'Locatie', value: car.location },
  ].filter(s => s.value);

  return (
    <PublicLayout>
      {/* Breadcrumbs */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="text-sm text-text-lighter flex items-center gap-2">
            <Link href="/" className="hover:text-primary">Acasa</Link>
            <span>/</span>
            <Link href="/masini" className="hover:text-primary">Masini</Link>
            <span>/</span>
            <span className="text-primary font-medium">{car.brand} {car.model}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex gap-8">
          {/* Left - Gallery + Details */}
          <div className="lg:flex-1">
            {/* Gallery */}
            <CarGallery images={images} carName={carName} />

            {/* Title + Price (mobile) */}
            <div className="lg:hidden mt-6">
              <h1 className="text-2xl font-bold text-primary">{car.brand} {car.model} <span className="text-text-light font-normal">{car.version}</span></h1>
              <p className="text-3xl font-bold text-primary mt-2">{car.currency === 'EUR' ? '\u20AC' : 'RON'}{car.price.toLocaleString('ro-RO')}</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="bg-surface px-3 py-1.5 rounded-lg text-sm text-text-light">{car.year}</span>
                <span className="bg-surface px-3 py-1.5 rounded-lg text-sm text-text-light">{car.mileage.toLocaleString('ro-RO')} km</span>
                <span className="bg-surface px-3 py-1.5 rounded-lg text-sm text-text-light">{car.fuel}</span>
                <span className="bg-surface px-3 py-1.5 rounded-lg text-sm text-text-light">{car.transmission}</span>
                {car.horsepower > 0 && <span className="bg-surface px-3 py-1.5 rounded-lg text-sm text-text-light">{car.horsepower} CP</span>}
              </div>
              {/* Mobile CTAs */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <a href={phoneLink} className="flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-lg text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  Suna acum
                </a>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-whatsapp text-white font-semibold py-3 rounded-lg text-sm">
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Specs */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-primary mb-4">Specificatii</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {specs.map(s => (
                  <div key={s.label} className="bg-surface rounded-lg p-4">
                    <p className="text-xs text-text-lighter uppercase tracking-wider">{s.label}</p>
                    <p className="font-semibold text-primary mt-1">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-primary mb-4">Dotari</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-text-light py-1">
                      <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {car.description && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-primary mb-4">Descriere</h2>
                <p className="text-text-light leading-relaxed">{car.description}</p>
              </div>
            )}

            {/* Financing Calculator */}
            <div className="mt-8">
              <FinancingCalculator price={car.price} currency={car.currency} />
            </div>

            {/* Share */}
            <div className="mt-8">
              <ShareButtons carName={carName} />
            </div>
          </div>

          {/* Right Sidebar - desktop only */}
          <div className="hidden lg:block lg:w-96">
            <div className="sticky top-24 space-y-6">
              {/* Price card */}
              <div className="bg-white rounded-xl border border-border p-6">
                <h1 className="text-2xl font-bold text-primary">{car.brand} {car.model}</h1>
                <p className="text-text-light">{car.version}</p>
                <p className="text-3xl font-bold text-primary mt-4">{car.currency === 'EUR' ? '\u20AC' : 'RON'}{car.price.toLocaleString('ro-RO')}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="bg-surface px-3 py-1.5 rounded text-sm text-text-light">{car.year}</span>
                  <span className="bg-surface px-3 py-1.5 rounded text-sm text-text-light">{car.mileage.toLocaleString('ro-RO')} km</span>
                  <span className="bg-surface px-3 py-1.5 rounded text-sm text-text-light">{car.fuel}</span>
                  <span className="bg-surface px-3 py-1.5 rounded text-sm text-text-light">{car.transmission}</span>
                  {car.horsepower > 0 && <span className="bg-surface px-3 py-1.5 rounded text-sm text-text-light">{car.horsepower} CP</span>}
                </div>

                <div className="space-y-3 mt-6">
                  <a href={phoneLink} className="flex items-center justify-center gap-2 w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-light transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    Suna acum
                  </a>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-whatsapp text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Scrie pe WhatsApp
                  </a>
                </div>

                <p className="text-center text-xs text-text-lighter mt-3">{settings.phone}</p>
              </div>

              {/* Lead Form */}
              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="font-bold text-primary mb-1">Te intereseaza aceasta masina?</h3>
                <p className="text-sm text-text-light mb-4">Completeaza formularul si te contactam noi.</p>
                <LeadForm carId={car.id} carName={carName} type="car_inquiry" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Lead Form */}
        <div className="lg:hidden mt-8 bg-white rounded-xl border border-border p-6">
          <h3 className="font-bold text-primary mb-1">Te intereseaza aceasta masina?</h3>
          <p className="text-sm text-text-light mb-4">Completeaza formularul si te contactam noi.</p>
          <LeadForm carId={car.id} carName={carName} type="car_inquiry" />
        </div>
      </div>
    </PublicLayout>
  );
}
