import PublicLayout from '@/components/PublicLayout';
import type { Metadata } from 'next';
import SearchRequestForm from './SearchRequestForm';

export const metadata: Metadata = {
  title: 'Cauta-mi o masina | AutoVizibil',
  description: 'Nu ai gasit ce cauti? Spune-ne ce masina cauti si te ajutam sa gasesti varianta potrivita.',
};

export default function CautaMasinaPage() {
  return (
    <PublicLayout>
      <section className="bg-surface py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary">Nu ai gasit ce cauti?</h1>
          <p className="text-text-light mt-3">Spune-ne ce masina cauti si te ajutam sa gasesti varianta potrivita.</p>
        </div>
      </section>
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchRequestForm />
      </section>
    </PublicLayout>
  );
}
