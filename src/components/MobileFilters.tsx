'use client';
import { useState } from 'react';

type Props = {
  brands: string[];
  bodyTypes: string[];
  params: { [key: string]: string | undefined };
  hasFilters: boolean;
};

export default function MobileFilters({ brands, bodyTypes, params, hasFilters }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
            hasFilters ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-border'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          Filtre {hasFilters && '(active)'}
        </button>
        {hasFilters && (
          <a href="/masini" className="flex items-center px-3 py-2.5 rounded-lg text-sm text-accent border border-border bg-white">
            Sterge filtre
          </a>
        )}

        {/* Sort quick select */}
        <form method="GET" action="/masini" className="ml-auto">
          {params.brand && <input type="hidden" name="brand" value={params.brand} />}
          {params.fuel && <input type="hidden" name="fuel" value={params.fuel} />}
          {params.transmission && <input type="hidden" name="transmission" value={params.transmission} />}
          {params.body_type && <input type="hidden" name="body_type" value={params.body_type} />}
          {params.minPrice && <input type="hidden" name="minPrice" value={params.minPrice} />}
          {params.maxPrice && <input type="hidden" name="maxPrice" value={params.maxPrice} />}
          {params.year && <input type="hidden" name="year" value={params.year} />}
          <label htmlFor="mf-sort" className="sr-only">Sorteaza dupa</label>
          <select
            id="mf-sort"
            name="sort"
            defaultValue={params.sort || ''}
            onChange={e => (e.target.form as HTMLFormElement).submit()}
            className="px-3 py-2.5 rounded-lg text-sm border border-border bg-white text-primary min-h-[44px]"
          >
            <option value="">Cele mai noi</option>
            <option value="price_asc">Pret ↑</option>
            <option value="price_desc">Pret ↓</option>
            <option value="mileage">Km ↑</option>
          </select>
        </form>
      </div>

      {/* Filter panel */}
      {open && (
        <form method="GET" action="/masini" className="mt-3 bg-white rounded-xl border border-border p-4 space-y-3" aria-label="Filtre masini">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="mf-brand" className="sr-only">Marca</label>
              <select id="mf-brand" name="brand" defaultValue={params.brand || ''} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-white min-h-[44px]">
                <option value="">Marca</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="mf-fuel" className="sr-only">Combustibil</label>
              <select id="mf-fuel" name="fuel" defaultValue={params.fuel || ''} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-white min-h-[44px]">
                <option value="">Combustibil</option>
                <option value="Benzina">Benzina</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
            <div>
              <label htmlFor="mf-transmission" className="sr-only">Transmisie</label>
              <select id="mf-transmission" name="transmission" defaultValue={params.transmission || ''} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-white min-h-[44px]">
                <option value="">Transmisie</option>
                <option value="Automata">Automata</option>
                <option value="Manuala">Manuala</option>
              </select>
            </div>
            <div>
              <label htmlFor="mf-body_type" className="sr-only">Caroserie</label>
              <select id="mf-body_type" name="body_type" defaultValue={params.body_type || ''} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-white min-h-[44px]">
                <option value="">Caroserie</option>
                {bodyTypes.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="mf-minPrice" className="sr-only">Pret minim</label>
              <input id="mf-minPrice" type="number" name="minPrice" defaultValue={params.minPrice || ''} placeholder="Pret min" className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-white min-h-[44px]" />
            </div>
            <div>
              <label htmlFor="mf-maxPrice" className="sr-only">Pret maxim</label>
              <input id="mf-maxPrice" type="number" name="maxPrice" defaultValue={params.maxPrice || ''} placeholder="Pret max" className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-white min-h-[44px]" />
            </div>
          </div>
          <div>
            <label htmlFor="mf-year" className="sr-only">An minim</label>
            <input id="mf-year" type="number" name="year" defaultValue={params.year || ''} placeholder="An minim" className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-white min-h-[44px]" />
          </div>
          {params.sort && <input type="hidden" name="sort" value={params.sort} />}
          <button type="submit" className="w-full bg-primary text-white font-semibold py-3 rounded-lg text-sm min-h-[44px]">
            Aplica filtre
          </button>
        </form>
      )}
    </>
  );
}
