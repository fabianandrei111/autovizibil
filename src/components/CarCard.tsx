import Link from 'next/link';
import Image from 'next/image';

export type Car = {
  id: string;
  brand: string;
  model: string;
  version: string;
  slug: string;
  year: number;
  price: number;
  currency: string;
  mileage: number;
  fuel: string;
  transmission: string;
  engine: string;
  horsepower: number;
  drivetrain: string;
  body_type: string;
  color: string;
  location: string;
  description: string;
  features: string;
  images: string;
  video_url: string;
  status: string;
  featured: number;
  views: number;
  created_at: string;
  dealer?: string;
  deal_type?: string;
};

function getBadge(car: Car) {
  if (car.status === 'sold') return { label: 'Vandut', cls: 'badge-sold' };
  if (car.status === 'reserved') return { label: 'Rezervat', cls: 'badge-reserved' };
  if (car.featured) return { label: 'Featured', cls: 'badge-featured' };
  const created = new Date(car.created_at);
  const now = new Date();
  const daysDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  if (daysDiff < 7) return { label: 'Nou', cls: 'badge-new' };
  return null;
}

export default function CarCard({ car, layout = 'grid' }: { car: Car; layout?: 'grid' | 'list' }) {
  const images: string[] = JSON.parse(car.images || '[]');
  const mainImage = images[0] || '';
  const badge = getBadge(car);
  const imageCount = images.length;

  // List layout (horizontal) - used on mobile in /masini
  if (layout === 'list') {
    return (
      <Link href={`/masini/${car.slug}`} className="group flex bg-white rounded-xl overflow-hidden border border-border hover:shadow-md transition-all">
        <div className="relative w-[140px] min-h-[120px] flex-shrink-0 overflow-hidden bg-surface-dark">
          {mainImage ? (
            <Image src={mainImage} alt={`${car.brand} ${car.model}`} fill className="object-cover" sizes="140px" />
          ) : (
            <div className="img-placeholder w-full h-full"><span className="text-xs">{car.brand}</span></div>
          )}
          {badge && <span className={`badge absolute top-2 left-2 text-[10px] px-1.5 py-0.5 ${badge.cls}`}>{badge.label}</span>}
          {imageCount > 1 && (
            <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"/></svg>
              {imageCount}
            </span>
          )}
        </div>
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-bold text-sm text-primary leading-tight truncate">{car.brand} {car.model}</h3>
            {car.version && <p className="text-xs text-text-light truncate">{car.version}</p>}
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1.5 text-xs text-text-light">
              <span>{car.year}</span>
              <span className="text-border">|</span>
              <span>{car.mileage.toLocaleString('ro-RO')} km</span>
              <span className="text-border">|</span>
              <span>{car.fuel}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-base font-bold text-primary">
              {car.currency === 'EUR' ? '\u20AC' : 'RON'}{car.price.toLocaleString('ro-RO')}
            </span>
            <span className="text-xs text-text-lighter">{car.transmission}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Grid layout (vertical cards) - default
  return (
    <Link href={`/masini/${car.slug}`} className="group block bg-white rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-dark">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={`${car.brand} ${car.model} ${car.version}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="img-placeholder w-full h-full">
            <span>{car.brand} {car.model}</span>
          </div>
        )}
        {badge && (
          <span className={`badge absolute top-3 left-3 ${badge.cls}`}>{badge.label}</span>
        )}
        {imageCount > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"/></svg>
            {imageCount}
          </span>
        )}
      </div>

      <div className="p-4 lg:p-5">
        <h3 className="font-bold text-lg text-primary">
          {car.brand} {car.model}
          {car.version && <span className="font-normal text-text-light text-sm ml-1">{car.version}</span>}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-text-light">
          <span>{car.year}</span>
          <span>{car.mileage.toLocaleString('ro-RO')} km</span>
          <span>{car.fuel}</span>
          <span>{car.transmission}</span>
          {car.horsepower > 0 && <span>{car.horsepower} CP</span>}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-xl font-bold text-primary">
            {car.currency === 'EUR' ? '\u20AC' : 'RON'}{car.price.toLocaleString('ro-RO')}
          </span>
          <span className="text-sm font-semibold text-accent group-hover:translate-x-1 transition-transform">
            Vezi detalii &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
