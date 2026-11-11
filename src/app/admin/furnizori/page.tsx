import { ensureSeeded, getCarsByDealer, getDealers, getActiveCars } from '@/lib/db';
import Link from 'next/link';

const DEALER_INFO: Record<string, { location: string; url: string; country: string }> = {
  'HJA Auto': { location: 'Danemarca', url: 'https://home.mobile.de/home/index.html?customerId=28417172', country: 'DK' },
  'Altergott Automobile': { location: 'Bruchsal, Germania', url: 'https://home.mobile.de/ALTERGOTTAUTOMOBILE', country: 'DE' },
  'MC Automobile': { location: 'Heidelberg, Germania', url: 'https://home.mobile.de/AUTOMOBILE-MC', country: 'DE' },
};

export default function FurnizoriPage() {
  ensureSeeded();
  const dealers = getDealers();
  const allActive = getActiveCars();

  const dealerStats = dealers.map(name => {
    const cars = getCarsByDealer(name);
    const info = DEALER_INFO[name] || { location: 'Necunoscut', url: '#', country: '??' };
    const totalValue = cars.reduce((sum, c) => sum + c.price, 0);
    const avgPrice = cars.length > 0 ? Math.round(totalValue / cars.length) : 0;
    const brands = [...new Set(cars.map(c => c.brand))];
    return { name, cars, info, totalValue, avgPrice, brands };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Furnizori</h1>
          <p className="text-sm text-text-lighter mt-1">Dealerii din care importam masini pe mobile.de</p>
        </div>
        <div className="text-sm text-text-lighter">
          Total: <span className="font-bold text-primary">{allActive.length} masini active</span> de la <span className="font-bold text-primary">{dealers.length} furnizori</span>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {dealerStats.map(d => (
          <div key={d.name} className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-primary">{d.name}</h3>
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">{d.info.country}</span>
            </div>
            <p className="text-sm text-text-light">{d.info.location}</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <p className="text-2xl font-bold text-primary">{d.cars.length}</p>
                <p className="text-xs text-text-lighter">masini active</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">&euro;{d.avgPrice.toLocaleString('ro-RO')}</p>
                <p className="text-xs text-text-lighter">pret mediu</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {d.brands.map(b => (
                <span key={b} className="text-xs bg-surface px-2 py-0.5 rounded">{b}</span>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <a href={d.info.url} target="_blank" rel="noopener noreferrer" className="text-accent text-xs hover:underline">
                mobile.de &#8599;
              </a>
              <Link href={`/admin/masini?dealer=${encodeURIComponent(d.name)}`} className="text-xs text-accent hover:underline">
                Vezi masini &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Full cars table by dealer */}
      {dealerStats.map(d => (
        <div key={d.name} className="bg-white rounded-xl border border-border overflow-hidden mb-6">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-primary">{d.name}</h2>
              <p className="text-xs text-text-lighter">{d.info.location} &middot; {d.cars.length} masini</p>
            </div>
            <a href={d.info.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">
              Sursa mobile.de &#8599;
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="text-left py-3 px-5 font-medium text-text-lighter">Masina</th>
                  <th className="text-left py-3 px-5 font-medium text-text-lighter">An</th>
                  <th className="text-left py-3 px-5 font-medium text-text-lighter">KM</th>
                  <th className="text-left py-3 px-5 font-medium text-text-lighter">Pret</th>
                  <th className="text-left py-3 px-5 font-medium text-text-lighter hidden md:table-cell">Combustibil</th>
                  <th className="text-left py-3 px-5 font-medium text-text-lighter hidden lg:table-cell">Tip oferta</th>
                </tr>
              </thead>
              <tbody>
                {d.cars.map(car => (
                  <tr key={car.id} className="border-t border-border hover:bg-surface/50">
                    <td className="py-3 px-5">
                      <Link href={`/masini/${car.slug}`} className="font-medium text-primary hover:text-accent">
                        {car.brand} {car.model} {car.version}
                      </Link>
                    </td>
                    <td className="py-3 px-5 text-text-light">{car.year}</td>
                    <td className="py-3 px-5 text-text-light">{car.mileage.toLocaleString('ro-RO')} km</td>
                    <td className="py-3 px-5 font-medium text-primary">&euro;{car.price.toLocaleString('ro-RO')}</td>
                    <td className="py-3 px-5 text-text-light hidden md:table-cell">{car.fuel}</td>
                    <td className="py-3 px-5 hidden lg:table-cell">
                      {car.deal_type === 'car_of_day' && <span className="badge bg-yellow-100 text-yellow-800">Masina Zilei</span>}
                      {car.deal_type === 'weekly_deal' && <span className="badge bg-red-100 text-red-800">Oferta Saptamanii</span>}
                      {!car.deal_type && <span className="text-text-lighter">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
