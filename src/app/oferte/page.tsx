import PublicLayout from '@/components/PublicLayout';
import CarCard, { Car } from '@/components/CarCard';
import Link from 'next/link';
import Image from 'next/image';
import { ensureSeeded, getCarOfTheDay, getWeeklyDeals, getActiveCars } from '@/lib/db';

export const metadata = {
  title: 'Oferte - AutoVizibil',
  description: 'Cele mai bune oferte la masini importate din Europa. Masina zilei, ofertele saptamanii si reduceri speciale.',
};

export default function OfertePage() {
  ensureSeeded();
  const carOfTheDay = getCarOfTheDay() as unknown as Car | undefined;
  const weeklyDeals = getWeeklyDeals() as unknown as Car[];
  const allActive = getActiveCars() as unknown as Car[];
  // Best value = lowest price per km
  const bestValue = allActive
    .filter(c => c.mileage > 0 && c.price > 0)
    .sort((a, b) => (a.price / a.mileage) - (b.price / b.mileage))
    .slice(0, 4);
  // Newest arrivals
  const newest = [...allActive].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 4);

  return (
    <PublicLayout>
      {/* Header */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-black text-white">Oferte AutoVizibil</h1>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">Cele mai bune preturi la masini premium importate din Europa. Selectie actualizata saptamanal.</p>
        </div>
      </section>

      {/* Masina Zilei */}
      {carOfTheDay && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-300 overflow-hidden shadow-lg">
            <div className="bg-yellow-400 px-6 py-3 flex items-center gap-2">
              <span className="text-2xl">&#11088;</span>
              <span className="font-bold text-yellow-900 uppercase tracking-wider">Masina Zilei</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <Link href={`/masini/${carOfTheDay.slug}`} className="block group">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                  <Image src={JSON.parse(carOfTheDay.images)[0] || ''} alt={`${carOfTheDay.brand} ${carOfTheDay.model}`} fill className="object-cover group-hover:scale-105 transition-transform" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
              </Link>
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-primary">{carOfTheDay.brand} {carOfTheDay.model}</h2>
                <p className="text-text-light mt-1">{carOfTheDay.version}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-text-light">
                  <span>{carOfTheDay.year}</span>
                  <span>{carOfTheDay.mileage.toLocaleString('ro-RO')} km</span>
                  <span>{carOfTheDay.fuel}</span>
                  <span>{carOfTheDay.transmission}</span>
                  {carOfTheDay.horsepower > 0 && <span>{carOfTheDay.horsepower} CP</span>}
                </div>
                <p className="text-sm text-text-light mt-4 leading-relaxed line-clamp-3">{carOfTheDay.description}</p>
                <div className="mt-6 flex items-center gap-6">
                  <span className="text-3xl font-bold text-primary">&euro;{carOfTheDay.price.toLocaleString('ro-RO')}</span>
                  <Link href={`/masini/${carOfTheDay.slug}`} className="bg-accent text-white font-semibold px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors text-sm">
                    Vezi detalii &rarr;
                  </Link>
                </div>
                <p className="text-xs text-text-lighter mt-3">La comanda cu avans minim 30%. Posibilitate leasing.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Ofertele Saptamanii */}
      {weeklyDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">&#128293;</span>
            <div>
              <h2 className="text-3xl font-bold text-primary">Ofertele Saptamanii</h2>
              <p className="text-text-light mt-1">Selectate manual — cele mai bune preturi din portofoliu</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {weeklyDeals.map(car => <CarCard key={car.id} car={car} />)}
          </div>
        </section>
      )}

      {/* Best Value */}
      {bestValue.length > 0 && (
        <section className="bg-surface py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">&#128176;</span>
              <div>
                <h2 className="text-3xl font-bold text-primary">Cel mai bun raport pret/km</h2>
                <p className="text-text-light mt-1">Masini cu cel mai bun raport calitate-pret din stoc</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestValue.map(car => <CarCard key={car.id} car={car} />)}
            </div>
          </div>
        </section>
      )}

      {/* Newest */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">&#127381;</span>
          <div>
            <h2 className="text-3xl font-bold text-primary">Nou adaugate</h2>
            <p className="text-text-light mt-1">Cele mai recente masini din portofoliu</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newest.map(car => <CarCard key={car.id} car={car} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Nu gasesti ce cauti?</h2>
          <p className="text-gray-400 mt-3">Spune-ne ce masina vrei si o gasim noi pentru tine. Import la comanda din toata Europa.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link href="/cauta-masina" className="inline-flex items-center justify-center bg-accent text-white font-bold px-8 py-4 rounded-lg hover:bg-accent-hover transition-colors">
              Cauta masina personalizata
            </Link>
            <Link href="/masini" className="inline-flex items-center justify-center bg-white/10 text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/20 transition-colors border border-white/20">
              Vezi toate masinile
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
