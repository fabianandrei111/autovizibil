'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CarForm from '../../CarForm';

export default function EditCarPage() {
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);

  useEffect(() => {
    fetch('/api/cars').then(r => r.json()).then(cars => {
      const found = cars.find((c: any) => c.id === id);
      if (found) setCar({ ...found, featured: !!found.featured });
    });
  }, [id]);

  if (!car) return <div className="text-text-light">Se incarca...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Editeaza: {car.brand} {car.model} {car.version}</h1>
      <CarForm initial={car} />
    </div>
  );
}
