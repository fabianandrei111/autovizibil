import PublicLayout from '@/components/PublicLayout';
import CarCard, { Car } from '@/components/CarCard';
import MobileFilters from '@/components/MobileFilters';
import { ensureSeeded, filterCars, getAllCars } from '@/lib/db';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masini de Vanzare | Import Auto Germania & Danemarca | AutoVizibil',
  description: 'Peste 40 masini verificate de vanzare - import din Germania si Danemarca. BMW, Mercedes, Volvo, Audi. Preturi transparente, leasing disponibil. AutoVizibil Bucuresti.',
  openGraph: {
    title: 'Masini de Vanzare | Import Auto Germania & Danemarca',
    description: 'Peste 40 masini verificate de vanzare - import din Germania si Danemarca. BMW, Mercedes, Volvo, Audi. Preturi transparente, leasing disponibil.',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'AutoVizibil',
    url: 'https://autovizibil.ro/masini',
  },
  alternates: {
    canonical: 'https://autovizibil.ro/masini',
  },
};

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function MasiniPage({ searchParams }: Props) {
  ensureSeeded();
  const params = await searchParams;

  const cars = filterCars({
    brand: params.brand,
    fuel: params.fuel,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    year: params.year ? Number(params.year) : undefined,
    transmission: params.transmission,
    body_type: params.body_type,
    sort: params.sort,
  }).filter(c => c.status !== 'sold') as unknown as Car[];

  const allCars = getAllCars().filter(c => c.status !== 'sold');
  const brands = [...new Set(allCars.map(c => c.brand))].sort();
  const bodyTypes = [...new Set(allCars.map(c => c.body_type).filter(Boolean))].sort();

  const hasFilters = !!(params.brand || params.fuel || params.transmission || params.body_type || params.minPrice || params.maxPrice || params.year);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Acasa", item: "https://autovizibil.ro" },
      { "@type": "ListItem", position: 2, name: "Masini", item: "https://autovizibil.ro/masini" },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Masini de Vanzare - AutoVizibil",
    description: "Peste 40 masini verificate de vanzare - import din Germania si Danemarca.",
    url: "https://autovizibil.ro/masini",
    isPartOf: { "@id": "https://autovizibil.ro/#website" },
    about: {
      "@type": "OfferCatalog",
      name: "Masini Import Europa",
      itemListElement: cars.slice(0, 10).map((car, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://autovizibil.ro/masini/${car.slug}`,
        name: `${car.brand} ${car.model} ${car.version} ${car.year}`,
      })),
    },
  };

  return (
    <PublicLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      {/* Breadcrumbs */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb" className="text-sm text-text-lighter flex items-center gap-2">
            <Link href="/" className="hover:text-primary">Acasa</Link>
            <span aria-hidden="true">/</span>
            <span className="text-primary font-medium" aria-current="page">Masini</span>
          </nav>
        </div>
      </div>

      {/* Header bar */}
      <section className="bg-surface py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Masini disponibile</h1>
          <p className="text-text-light mt-0.5 text-sm">{cars.length} masini gasite</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile: collapsible filters */}
        <div className="lg:hidden mb-4">
          <MobileFilters
            brands={brands}
            bodyTypes={bodyTypes}
            params={params}
            hasFilters={hasFilters}
          />
        </div>

        <div className="lg:flex gap-8">
          {/* Desktop filters sidebar */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <form method="GET" action="/masini" className="space-y-4 sticky top-24">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Marca</label>
                <select name="brand" defaultValue={params.brand || ''} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white">
                  <option value="">Toate</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Combustibil</label>
                <select name="fuel" defaultValue={params.fuel || ''} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white">
                  <option value="">Toate</option>
                  <option value="Benzina">Benzina</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Transmisie</label>
                <select name="transmission" defaultValue={params.transmission || ''} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white">
                  <option value="">Toate</option>
                  <option value="Automata">Automata</option>
                  <option value="Manuala">Manuala</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Caroserie</label>
                <select name="body_type" defaultValue={params.body_type || ''} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white">
                  <option value="">Toate</option>
                  {bodyTypes.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Pret min</label>
                  <input type="number" name="minPrice" defaultValue={params.minPrice || ''} placeholder="EUR" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Pret max</label>
                  <input type="number" name="maxPrice" defaultValue={params.maxPrice || ''} placeholder="EUR" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">An minim</label>
                <input type="number" name="year" defaultValue={params.year || ''} placeholder="2020" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Sorteaza</label>
                <select name="sort" defaultValue={params.sort || ''} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white">
                  <option value="">Cele mai noi</option>
                  <option value="price_asc">Pret crescator</option>
                  <option value="price_desc">Pret descrescator</option>
                  <option value="mileage">Kilometri</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-light transition-colors text-sm">
                Aplica filtre
              </button>
            </form>
          </aside>

          {/* Cars grid/list */}
          <div className="flex-1">
            {cars.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl font-semibold text-primary">Nu am gasit masini cu aceste criterii.</p>
                <p className="text-text-light mt-2">Incearca sa modifici filtrele sau <a href="/cauta-masina" className="text-accent underline">spune-ne ce cauti</a>.</p>
              </div>
            ) : (
              <>
                {/* Mobile: list view (horizontal cards) */}
                <div className="sm:hidden space-y-3">
                  {cars.map(car => <CarCard key={car.id} car={car} layout="list" />)}
                </div>
                {/* Tablet+: grid view */}
                <div className="hidden sm:grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {cars.map(car => <CarCard key={car.id} car={car} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
