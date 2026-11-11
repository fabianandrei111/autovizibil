'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const BRANDS = ['Audi', 'BMW', 'Citroen', 'Ford', 'Mercedes-Benz', 'Opel', 'Skoda', 'Volkswagen', 'Volvo'];
const FUELS = ['Benzina', 'Diesel', 'Hybrid', 'Electric'];

export default function SearchBar({ variant = 'hero' }: { variant?: 'hero' | 'compact' }) {
  const router = useRouter();
  const [brand, setBrand] = useState('');
  const [fuel, setFuel] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [year, setYear] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brand) params.set('brand', brand);
    if (fuel) params.set('fuel', fuel);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (year) params.set('year', year);
    router.push(`/masini?${params.toString()}`);
  }

  const inputCls = variant === 'hero'
    ? 'w-full px-4 py-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20'
    : 'w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

  return (
    <form onSubmit={handleSearch} className={variant === 'hero' ? 'bg-white rounded-2xl p-6 shadow-xl border border-border' : ''}>
      {variant === 'hero' && <h2 className="text-lg font-bold text-primary mb-4">Ce masina cauti?</h2>}
      <div className={`grid gap-3 ${variant === 'hero' ? 'grid-cols-2 lg:grid-cols-6' : 'grid-cols-2 lg:grid-cols-5'}`}>
        <div>
          <label htmlFor={`search-brand-${variant}`} className="sr-only">Marca</label>
          <select id={`search-brand-${variant}`} value={brand} onChange={e => setBrand(e.target.value)} className={inputCls}>
            <option value="">Marca</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`search-fuel-${variant}`} className="sr-only">Combustibil</label>
          <select id={`search-fuel-${variant}`} value={fuel} onChange={e => setFuel(e.target.value)} className={inputCls}>
            <option value="">Combustibil</option>
            {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`search-minprice-${variant}`} className="sr-only">Pret minim</label>
          <input id={`search-minprice-${variant}`} type="number" placeholder="Pret min (EUR)" value={minPrice} onChange={e => setMinPrice(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label htmlFor={`search-maxprice-${variant}`} className="sr-only">Pret maxim</label>
          <input id={`search-maxprice-${variant}`} type="number" placeholder="Pret max (EUR)" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label htmlFor={`search-year-${variant}`} className="sr-only">An minim</label>
          <input id={`search-year-${variant}`} type="number" placeholder="An minim" value={year} onChange={e => setYear(e.target.value)} className={inputCls} />
        </div>
        <button type="submit" className="bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-light transition-colors text-sm min-h-[44px]">
          Cauta masina
        </button>
      </div>
    </form>
  );
}
