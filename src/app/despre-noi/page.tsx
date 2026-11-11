import PublicLayout from '@/components/PublicLayout';
import { getSettings } from '@/lib/settings';
import { ensureSeeded, getAllTestimonials } from '@/lib/db';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Despre AutoVizibil | Dealer Auto Import Germania & Danemarca',
  description: 'AutoVizibil - intermediere auto profesionala cu accent pe transparenta. Import masini verificate din Germania si Danemarca, Bucuresti, Romania.',
};

type Testimonial = { id: string; name: string; car: string; text: string; rating: number };

export default function DesprePage() {
  ensureSeeded();
  const settings = getSettings();
  const testimonials = getAllTestimonials().filter(t => t.published === 1).slice(0, 4) as unknown as Testimonial[];
  const waLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Buna! As vrea sa aflu mai multe despre serviciile AutoVizibil.')}`;

  return (
    <PublicLayout>
      <section className="bg-surface py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-primary">Despre AutoVizibil</h1>
          <p className="text-lg text-text-light mt-4 leading-relaxed">
            AutoVizibil este mai mult decat un simplu intermediar auto. Suntem partenerul tau in procesul de achizitie, oferindu-ti acces la masini atent selectate, consultanta personalizata si o experienta simpla de cumparare.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { icon: '🔍', title: 'Selectie riguroasa', desc: 'Fiecare masina trece prin procesul nostru de verificare inainte de a fi prezentata. Nu promovam orice — promovam doar ce merita.' },
            { icon: '🤝', title: 'Transparenta totala', desc: 'Informatii clare despre fiecare masina: istoric, stare tehnica, kilometraj real. Fara surprize neplacute.' },
            { icon: '⏱️', title: 'Timp economisit', desc: 'Nu mai pierzi saptamani cautand. Spune-ne ce vrei si noi gasim variantele potrivite din reteaua noastra.' },
            { icon: '💬', title: 'Consultanta personalizata', desc: 'Te ghidam in alegerea masinii potrivite, negociem in interesul tau si te insotim pana la finalizare.' },
          ].map((item, i) => (
            <div key={i}>
              <span className="text-3xl">{item.icon}</span>
              <h3 className="text-xl font-bold text-primary mt-3">{item.title}</h3>
              <p className="text-text-light mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-surface py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-primary text-center mb-2">Ce spun clientii</h2>
            <p className="text-text-lighter text-center text-sm mb-10">(Date demonstrative)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map(t => (
                <div key={t.id} className="bg-white rounded-xl p-6 border border-border">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  <p className="text-sm text-text-light leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="font-semibold text-sm text-primary">{t.name}</p>
                    {t.car && <p className="text-xs text-text-lighter">{t.car}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Hai sa vorbim</h2>
          <p className="text-gray-400 mt-3">Contacteaza-ne si discutam despre ce masina ti se potriveste.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="bg-whatsapp text-white font-bold px-8 py-4 rounded-lg hover:opacity-90">Scrie pe WhatsApp</a>
            <Link href="/cauta-masina" className="bg-white text-primary font-bold px-8 py-4 rounded-lg hover:bg-gray-100">Cauta-mi o masina</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
