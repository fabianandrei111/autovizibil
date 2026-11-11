import PublicLayout from '@/components/PublicLayout';
import SearchBar from '@/components/SearchBar';
import CarCard, { Car } from '@/components/CarCard';
import LeadForm from '@/components/LeadForm';
import { getSettings, getWhatsAppLink } from '@/lib/settings';
import { ensureSeeded, getFeaturedCars, getAllTestimonials, getCarOfTheDay, getWeeklyDeals, getActiveCars } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';

type Testimonial = { id: string; name: string; car: string; text: string; rating: number };

export default function HomePage() {
  ensureSeeded();
  const settings = getSettings();
  const featuredCars = getFeaturedCars().slice(0, 6) as unknown as Car[];
  const testimonials = getAllTestimonials().filter(t => t.published === 1).slice(0, 4) as unknown as Testimonial[];
  const carOfTheDay = getCarOfTheDay() as unknown as Car | undefined;
  const weeklyDeals = getWeeklyDeals().slice(0, 4) as unknown as Car[];
  const allActive = getActiveCars();
  const categoryCounts: Record<string, number> = {};
  allActive.forEach(c => { categoryCounts[c.body_type] = (categoryCounts[c.body_type] || 0) + 1; });

  const waLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Buna! Sunt interesat de masinile AutoVizibil si as vrea mai multe informatii.')}`;

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80" alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight">
              {settings.hero_title}
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-gray-300 leading-relaxed">
              {settings.hero_subtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/masini" className="inline-flex items-center justify-center bg-accent text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-accent-hover transition-colors">
                {settings.hero_cta}
              </Link>
              <Link href="/cauta-masina" className="inline-flex items-center justify-center bg-white/10 text-white font-semibold px-8 py-4 rounded-lg text-lg hover:bg-white/20 transition-colors border border-white/20">
                {settings.hero_cta_secondary}
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 0010.86 4.48V13.4a8.27 8.27 0 005.58 2.16v-3.45a4.85 4.85 0 01-2.98-1.04V6.69h2.98z"/></svg>
                TikTok
              </a>
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <SearchBar variant="hero" />
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-primary mb-6">Categorii</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {[
            { name: 'Sedan', icon: '🚗' },
            { name: 'SUV', icon: '🚙' },
            { name: 'SUV Coupe', icon: '🏎️' },
            { name: 'Break', icon: '🚐' },
            { name: 'Hatchback', icon: '🚘' },
            { name: 'Coupe', icon: '🏎️' },
            { name: 'Monovolum', icon: '🚌' },
          ].filter(cat => categoryCounts[cat.name]).map(cat => (
            <Link key={cat.name} href={`/masini?body_type=${encodeURIComponent(cat.name)}`} className="flex flex-col items-center bg-white rounded-xl p-5 border border-border hover:shadow-md hover:border-accent transition-all">
              <span className="text-3xl">{cat.icon}</span>
              <span className="font-semibold text-primary mt-2 text-sm">{cat.name}</span>
              <span className="text-xs text-text-light">{categoryCounts[cat.name]} masini</span>
            </Link>
          ))}
        </div>
      </section>

      {/* INFO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="text-4xl">📦</div>
          <div>
            <h3 className="font-bold text-primary text-lg">Masini la comanda din Danemarca</h3>
            <p className="text-sm text-text-light mt-1">Toate masinile sunt disponibile la comanda cu avans minim 30%. Posibilitate leasing si finantare. Livrare in 7-14 zile lucratoare.</p>
          </div>
        </div>
      </section>

      {/* MASINA ZILEI + OFERTELE SAPTAMANII */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Masina Zilei */}
          {carOfTheDay && (
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-300 overflow-hidden">
                <div className="bg-yellow-400 px-4 py-2 flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  <span className="font-bold text-yellow-900 text-sm uppercase tracking-wider">Masina Zilei</span>
                </div>
                <div className="p-4">
                  <Link href={`/masini/${carOfTheDay.slug}`} className="block group">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3">
                      <Image src={JSON.parse(carOfTheDay.images)[0] || ''} alt={`${carOfTheDay.brand} ${carOfTheDay.model}`} fill className="object-cover group-hover:scale-105 transition-transform" sizes="(max-width: 1024px) 100vw, 33vw" />
                    </div>
                    <h3 className="font-bold text-lg text-primary">{carOfTheDay.brand} {carOfTheDay.model}</h3>
                    <p className="text-sm text-text-light">{carOfTheDay.version}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-text-light">
                      <span>{carOfTheDay.year}</span>
                      <span>{carOfTheDay.mileage.toLocaleString('ro-RO')} km</span>
                      <span>{carOfTheDay.horsepower} CP</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">€{carOfTheDay.price.toLocaleString('ro-RO')}</span>
                      <span className="text-accent font-semibold text-sm">Vezi detalii →</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Ofertele Saptamanii */}
          <div className={carOfTheDay ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🔥</span>
              <div>
                <h2 className="text-2xl font-bold text-primary">Ofertele Saptamanii</h2>
                <p className="text-sm text-text-light">Cele mai bune preturi, selectate pentru tine</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {weeklyDeals.map(car => <CarCard key={car.id} car={car} />)}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary">Masinile momentului</h2>
            <p className="text-text-light mt-2">Selectia noastra de masini premium, la comanda din Europa.</p>
          </div>
          <Link href="/masini" className="hidden sm:inline-flex items-center text-sm font-semibold text-accent hover:underline">
            Vezi toate &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map(car => <CarCard key={car.id} car={car} />)}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/masini" className="text-accent font-semibold">Vezi toate masinile &rarr;</Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-surface py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary text-center">Cum functioneaza</h2>
          <p className="text-text-light text-center mt-3 max-w-xl mx-auto">Procesul este simplu si transparent. In 4 pasi ajungi la masina potrivita.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {[
              { step: '01', title: 'Alegi masina', desc: 'Alegi din portofoliul nostru sau ne spui ce cauti.' },
              { step: '02', title: 'Platesti avansul', desc: 'Avans minim 30% pentru a rezerva masina. Posibilitate leasing.' },
              { step: '03', title: 'Aducem masina', desc: 'Importam masina din Danemarca in 7-14 zile lucratoare.' },
              { step: '04', title: 'Livrare si inmatriculare', desc: 'Te ajutam cu tot procesul, de la RAR la inmatriculare.' },
            ].map(s => (
              <div key={s.step} className="text-center lg:text-left">
                <span className="text-5xl font-black text-accent/20">{s.step}</span>
                <h3 className="text-lg font-bold text-primary mt-2">{s.title}</h3>
                <p className="text-sm text-text-light mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIKTOK SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-primary rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Ne vezi pe TikTok. Acum vezi masinile si aici.</h2>
            <p className="text-gray-400 mt-3">Urmareste AutoVizibil pentru prezentari, masini noi si oferte.</p>
            <div className="flex gap-4 mt-6">
              <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 0010.86 4.48V13.4a8.27 8.27 0 005.58 2.16v-3.45a4.85 4.85 0 01-2.98-1.04V6.69h2.98z"/></svg>
                Vezi TikTok-ul nostru
              </a>
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm">
                Urmareste-ne pe Instagram
              </a>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/10 rounded-xl p-8">
              <p className="text-white text-lg font-bold">Ai vazut masina pe TikTok?</p>
              <p className="text-gray-400 mt-2 text-sm">Intra pe AutoVizibil si vezi toate detaliile, fotografiile si pretul.</p>
              <Link href="/masini" className="mt-4 inline-block bg-accent text-white font-semibold px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors text-sm">
                Vezi toate masinile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-surface py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary text-center">Ce spun clientii</h2>
            <p className="text-text-light text-center mt-2 text-sm">(Date demonstrative)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
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

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-primary text-center mb-10">Intrebari frecvente</h2>
        {[
          { q: 'Cum functioneaza importul la comanda?', a: 'Alegi masina din portofoliul nostru, platesti un avans minim de 30%, iar noi ne ocupam de import, transport si livrare din Danemarca in 7-14 zile lucratoare.' },
          { q: 'Cat costa avansul?', a: 'Avansul minim este de 30% din pretul masinii. Restul se poate achita integral la livrare sau prin leasing/finantare.' },
          { q: 'Pot face leasing?', a: 'Da! Oferim posibilitate de leasing prin partenerii nostri financiari. Te ajutam cu tot procesul de la A la Z.' },
          { q: 'Masina are garantie?', a: 'Toate masinile importate au istoric verificat si documente complete. Te ajutam si cu inmatricularea in Romania.' },
          { q: 'Cum iau legatura cu voi?', a: 'Ne poti contacta prin telefon, WhatsApp sau formularul de contact. Raspundem rapid la orice intrebare.' },
        ].map((faq, i) => (
          <details key={i} className="group border-b border-border">
            <summary className="py-5 cursor-pointer flex items-center justify-between text-primary font-semibold hover:text-accent transition-colors">
              {faq.q}
              <svg className="w-5 h-5 text-text-lighter group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </summary>
            <p className="pb-5 text-sm text-text-light leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </section>

      {/* CTA FINAL */}
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Cauti o masina?</h2>
          <p className="text-gray-400 mt-3">Contacteaza-ne acum si te ajutam sa gasesti varianta potrivita.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              Suna acum
            </a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-bold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Scrie pe WhatsApp
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
