'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Car = { id: string; brand: string; model: string; version: string; price: number; currency: string; status: string; featured: number; images: string; views: number; year: number };

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCars(); }, []);

  async function fetchCars() {
    const res = await fetch('/api/cars');
    const data = await res.json();
    setCars(data);
    setLoading(false);
  }

  async function deleteCar(id: string) {
    if (!confirm('Stergi aceasta masina?')) return;
    await fetch('/api/cars', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchCars();
  }

  async function toggleFeatured(car: Car) {
    await fetch('/api/cars', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...car, featured: !car.featured }) });
    fetchCars();
  }

  async function setStatus(car: Car, status: string) {
    await fetch('/api/cars', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...car, status }) });
    fetchCars();
  }

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    sold: 'bg-gray-100 text-gray-800',
    reserved: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-blue-100 text-blue-800',
  };

  if (loading) return <div className="text-text-light">Se incarca...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Masini ({cars.length})</h1>
        <Link href="/admin/masini/new" className="bg-accent text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-hover text-sm">+ Adauga masina</Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-text-lighter">Imagine</th>
                <th className="text-left py-3 px-4 font-medium text-text-lighter">Masina</th>
                <th className="text-left py-3 px-4 font-medium text-text-lighter">Pret</th>
                <th className="text-left py-3 px-4 font-medium text-text-lighter">Status</th>
                <th className="text-left py-3 px-4 font-medium text-text-lighter">Featured</th>
                <th className="text-left py-3 px-4 font-medium text-text-lighter">Views</th>
                <th className="text-left py-3 px-4 font-medium text-text-lighter">Actiuni</th>
              </tr>
            </thead>
            <tbody>
              {cars.map(car => {
                const images: string[] = JSON.parse(car.images || '[]');
                return (
                  <tr key={car.id} className="border-t border-border hover:bg-surface/50">
                    <td className="py-3 px-4">
                      {images[0] ? (
                        <div className="relative w-16 h-12 rounded overflow-hidden">
                          <Image src={images[0]} alt="" fill className="object-cover" sizes="64px" />
                        </div>
                      ) : <div className="w-16 h-12 bg-surface-dark rounded" />}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-primary">{car.brand} {car.model}</p>
                      <p className="text-xs text-text-lighter">{car.version} · {car.year}</p>
                    </td>
                    <td className="py-3 px-4 font-semibold">{car.currency === 'EUR' ? '\u20AC' : 'RON'}{car.price.toLocaleString('ro-RO')}</td>
                    <td className="py-3 px-4">
                      <select value={car.status} onChange={e => setStatus(car, e.target.value)} className={`badge cursor-pointer ${statusColors[car.status] || 'bg-gray-100'}`}>
                        <option value="active">Active</option>
                        <option value="sold">Vandut</option>
                        <option value="reserved">Rezervat</option>
                        <option value="draft">Draft</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => toggleFeatured(car)} className={`w-8 h-8 rounded-full flex items-center justify-center ${car.featured ? 'bg-warning text-white' : 'bg-surface text-text-lighter'}`}>
                        ★
                      </button>
                    </td>
                    <td className="py-3 px-4 text-text-light">{car.views}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link href={`/admin/masini/${car.id}/edit`} className="text-primary hover:text-accent text-sm font-medium">Edit</Link>
                        <button onClick={() => deleteCar(car.id)} className="text-accent hover:text-accent-hover text-sm font-medium">Sterge</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
