// In-memory mock database for Vercel demo deployment
import { v4 as uuid } from 'uuid';

export interface Car {
  id: string; brand: string; model: string; version: string; slug: string;
  year: number; price: number; currency: string; mileage: number; fuel: string;
  transmission: string; engine: string; horsepower: number; drivetrain: string;
  body_type: string; color: string; location: string; description: string;
  features: string; images: string; video_url: string; status: string;
  featured: number; views: number; created_at: string; updated_at: string;
}

export interface Lead {
  id: string; name: string; phone: string; email: string; message: string;
  car_id: string; car_name: string; source: string; status: string;
  budget: string; preferred_brand: string; preferred_model: string;
  min_year: string; max_mileage: string; preferred_fuel: string;
  preferred_transmission: string; preferred_body: string; preferences: string;
  type: string; created_at: string;
}

export interface Ad {
  id: string; title: string; image: string; link: string; position: string;
  start_date: string; end_date: string; active: number; created_at: string;
}

export interface Testimonial {
  id: string; name: string; car: string; text: string; rating: number;
  image: string; published: number; created_at: string;
}

export interface BlogPost {
  id: string; title: string; slug: string; image: string; category: string;
  excerpt: string; content: string; published: number; seo_title: string;
  seo_description: string; created_at: string; updated_at: string;
}

export type Settings = {
  business_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  program: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  youtube: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta: string;
  hero_cta_secondary: string;
  logo: string;
  [key: string]: string;
};

// In-memory stores
let cars: Car[] = [];
let leads: Lead[] = [];
let ads: Ad[] = [];
let testimonials: Testimonial[] = [];
let blogPosts: BlogPost[] = [];
let settings = {} as Settings;
let seeded = false;

const now = () => new Date().toISOString();

// --- Cars ---
export function getAllCars(): Car[] { return cars; }
export function getCarBySlug(slug: string): Car | undefined { return cars.find(c => c.slug === slug); }
export function getCarById(id: string): Car | undefined { return cars.find(c => c.id === id); }
export function getFeaturedCars(): Car[] { return cars.filter(c => c.featured === 1 && c.status === 'active'); }
export function getActiveCars(): Car[] { return cars.filter(c => c.status === 'active'); }

export function filterCars(filters: {
  brand?: string; fuel?: string; minPrice?: number; maxPrice?: number;
  year?: number; transmission?: string; body_type?: string; status?: string;
  featured?: boolean; sort?: string;
}): Car[] {
  let result = [...cars];
  if (filters.brand) result = result.filter(c => c.brand === filters.brand);
  if (filters.fuel) result = result.filter(c => c.fuel === filters.fuel);
  if (filters.minPrice) result = result.filter(c => c.price >= filters.minPrice!);
  if (filters.maxPrice) result = result.filter(c => c.price <= filters.maxPrice!);
  if (filters.year) result = result.filter(c => c.year >= filters.year!);
  if (filters.transmission) result = result.filter(c => c.transmission === filters.transmission);
  if (filters.body_type) result = result.filter(c => c.body_type === filters.body_type);
  if (filters.status) result = result.filter(c => c.status === filters.status);
  if (filters.featured) result = result.filter(c => c.featured === 1);

  switch (filters.sort) {
    case 'price_asc': result.sort((a, b) => a.price - b.price); break;
    case 'price_desc': result.sort((a, b) => b.price - a.price); break;
    case 'mileage': result.sort((a, b) => a.mileage - b.mileage); break;
    default: result.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  return result;
}

export function addCar(data: Partial<Car>): { id: string; slug: string } {
  const id = uuid();
  const slug = `${data.brand}-${data.model}-${data.version || ''}-${data.year}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  cars.push({
    id, brand: data.brand || '', model: data.model || '', version: data.version || '', slug,
    year: data.year || 0, price: data.price || 0, currency: data.currency || 'EUR',
    mileage: data.mileage || 0, fuel: data.fuel || '', transmission: data.transmission || '',
    engine: data.engine || '', horsepower: data.horsepower || 0, drivetrain: data.drivetrain || '',
    body_type: data.body_type || '', color: data.color || '', location: data.location || '',
    description: data.description || '', features: data.features || '[]', images: data.images || '[]',
    video_url: data.video_url || '', status: data.status || 'active', featured: data.featured || 0,
    views: 0, created_at: now(), updated_at: now(),
  });
  return { id, slug };
}

export function updateCar(data: Partial<Car> & { id: string }) {
  const idx = cars.findIndex(c => c.id === data.id);
  if (idx === -1) return;
  const slug = `${data.brand}-${data.model}-${data.version || ''}-${data.year}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  cars[idx] = { ...cars[idx], ...data, slug, updated_at: now() };
}

export function deleteCar(id: string) { cars = cars.filter(c => c.id !== id); }

// --- Leads ---
export function getAllLeads(): Lead[] { return [...leads].sort((a, b) => b.created_at.localeCompare(a.created_at)); }
export function addLead(data: Partial<Lead>): string {
  const id = uuid();
  leads.push({
    id, name: data.name || '', phone: data.phone || '', email: data.email || '',
    message: data.message || '', car_id: data.car_id || '', car_name: data.car_name || '',
    source: data.source || 'Website', status: 'NEW', budget: data.budget || '',
    preferred_brand: data.preferred_brand || '', preferred_model: data.preferred_model || '',
    min_year: data.min_year || '', max_mileage: data.max_mileage || '',
    preferred_fuel: data.preferred_fuel || '', preferred_transmission: data.preferred_transmission || '',
    preferred_body: data.preferred_body || '', preferences: data.preferences || '',
    type: data.type || 'contact', created_at: now(),
  });
  return id;
}
export function updateLeadStatus(id: string, status: string) {
  const lead = leads.find(l => l.id === id);
  if (lead) lead.status = status;
}

// --- Ads ---
export function getAllAds(): Ad[] { return [...ads].sort((a, b) => b.created_at.localeCompare(a.created_at)); }
export function addAd(data: Partial<Ad>): string {
  const id = uuid();
  ads.push({
    id, title: data.title || '', image: data.image || '', link: data.link || '',
    position: data.position || 'homepage', start_date: data.start_date || '',
    end_date: data.end_date || '', active: data.active ?? 1, created_at: now(),
  });
  return id;
}
export function updateAd(data: Partial<Ad> & { id: string }) {
  const idx = ads.findIndex(a => a.id === data.id);
  if (idx !== -1) ads[idx] = { ...ads[idx], ...data };
}
export function deleteAd(id: string) { ads = ads.filter(a => a.id !== id); }

// --- Testimonials ---
export function getAllTestimonials(): Testimonial[] { return [...testimonials].sort((a, b) => b.created_at.localeCompare(a.created_at)); }
export function addTestimonial(data: Partial<Testimonial>): string {
  const id = uuid();
  testimonials.push({
    id, name: data.name || '', car: data.car || '', text: data.text || '',
    rating: data.rating || 5, image: data.image || '', published: data.published ?? 1,
    created_at: now(),
  });
  return id;
}
export function updateTestimonial(data: Partial<Testimonial> & { id: string }) {
  const idx = testimonials.findIndex(t => t.id === data.id);
  if (idx !== -1) testimonials[idx] = { ...testimonials[idx], ...data };
}
export function deleteTestimonial(id: string) { testimonials = testimonials.filter(t => t.id !== id); }

// --- Blog Posts ---
export function getAllBlogPosts(): BlogPost[] { return [...blogPosts].sort((a, b) => b.created_at.localeCompare(a.created_at)); }
export function getBlogBySlug(slug: string): BlogPost | undefined { return blogPosts.find(b => b.slug === slug); }
export function addBlogPost(data: Partial<BlogPost>): { id: string; slug: string } {
  const id = uuid();
  const slug = data.slug || (data.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  blogPosts.push({
    id, title: data.title || '', slug, image: data.image || '', category: data.category || '',
    excerpt: data.excerpt || '', content: data.content || '', published: data.published ?? 1,
    seo_title: data.seo_title || '', seo_description: data.seo_description || '',
    created_at: now(), updated_at: now(),
  });
  return { id, slug };
}
export function updateBlogPost(data: Partial<BlogPost> & { id: string }) {
  const idx = blogPosts.findIndex(b => b.id === data.id);
  if (idx !== -1) blogPosts[idx] = { ...blogPosts[idx], ...data, updated_at: now() };
}
export function deleteBlogPost(id: string) { blogPosts = blogPosts.filter(b => b.id !== id); }

// --- Settings ---
export function getSettings(): Settings { ensureSeeded(); return { ...settings }; }
export function getSetting(key: string): string { return settings[key] || ''; }
export function updateSetting(key: string, value: string) { settings[key] = value; }

// --- Seed ---
export function ensureSeeded() {
  if (seeded) return;
  seeded = true;

  const CARS_DATA = [
    { brand: 'BMW', model: '530d', version: 'xDrive M Sport', year: 2022, price: 38900, mileage: 82000, fuel: 'Diesel', transmission: 'Automata', engine: '3.0L I6 TwinPower Turbo', horsepower: 286, drivetrain: 'xDrive (4x4)', body_type: 'Sedan', color: 'Sophisto Grey', location: 'Bucuresti', description: 'BMW 530d xDrive in pachet M Sport, cu dotari premium si intretinere completa la reprezentanta. Masina a fost utilizata exclusiv in regim personal, cu verificari tehnice la zi. Interior din piele Dakota, head-up display, sistem Harman Kardon, faruri LED adaptive.', features: JSON.stringify(['Piele Dakota', 'Head-Up Display', 'Harman Kardon', 'LED Adaptive', 'Trapa panoramica', 'Camera 360', 'Keyless Entry', 'Incalzire scaune', 'Navigatie Professional', 'Parking Assistant']), images: JSON.stringify(['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800']), featured: 1 },
    { brand: 'BMW', model: 'M340i', version: 'xDrive', year: 2023, price: 52900, mileage: 35000, fuel: 'Benzina', transmission: 'Automata', engine: '3.0L I6 TwinPower Turbo', horsepower: 374, drivetrain: 'xDrive (4x4)', body_type: 'Sedan', color: 'Tanzanite Blue', location: 'Bucuresti', description: 'BMW M340i xDrive cu performante de top in segmentul sau. Motor 3.0 cu 374 CP, acceleratie 0-100 in 4.4 secunde. Dotari complete M Sport, suspensie adaptiva, diferential M Sport.', features: JSON.stringify(['M Sport Package', 'Suspensie adaptiva', 'Diferential M Sport', 'Piele Vernasca', 'Harman Kardon', 'Head-Up Display', 'Trapa panoramica', 'ACC', 'Lane Assist', 'LED Laser']), images: JSON.stringify(['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800', 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800']), featured: 1 },
    { brand: 'Mercedes-Benz', model: 'C220d', version: 'AMG Line', year: 2021, price: 34500, mileage: 68000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 Turbo', horsepower: 200, drivetrain: 'Spate (RWD)', body_type: 'Sedan', color: 'Obsidian Black', location: 'Cluj-Napoca', description: 'Mercedes-Benz C220d in pachet AMG Line, cu design sportiv si motor eficient. Interior premium cu sistem MBUX, ambient lighting, scaune sport cu memorie. Consum excelent pentru categoria sa.', features: JSON.stringify(['AMG Line', 'MBUX', 'Ambient Lighting', 'Scaune sport', 'Camera marsarier', 'Navigatie', 'Faruri LED', 'Keyless-Go', 'Incalzire scaune', 'Pilot automat']), images: JSON.stringify(['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800']), featured: 1 },
    { brand: 'Mercedes-Benz', model: 'E220d', version: '4MATIC AMG Line', year: 2022, price: 45900, mileage: 55000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 Turbo', horsepower: 197, drivetrain: '4MATIC (4x4)', body_type: 'Sedan', color: 'Selenite Grey', location: 'Bucuresti', description: 'Mercedes-Benz E-Class in configuratie 4MATIC cu pachet AMG Line. Confort de clasa business cu tractiune integrala. Interior din piele, sistem Burmester, digital cockpit complet.', features: JSON.stringify(['4MATIC', 'AMG Line', 'Burmester', 'Digital Cockpit', 'Piele Nappa', 'Trapa panoramica', 'Distronic Plus', 'Camera 360', 'Air Balance', 'Incalzire + ventilatie scaune']), images: JSON.stringify(['https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800', 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800']), featured: 1 },
    { brand: 'Mercedes-Benz', model: 'GLC 300', version: '4MATIC Coupe', year: 2023, price: 56900, mileage: 28000, fuel: 'Benzina', transmission: 'Automata', engine: '2.0L I4 Turbo', horsepower: 258, drivetrain: '4MATIC (4x4)', body_type: 'SUV Coupe', color: 'Polar White', location: 'Timisoara', description: 'Mercedes-Benz GLC Coupe in versiunea 300 4MATIC. Design coupe dinamic combinat cu spatiul si versatilitatea unui SUV. Motor puternic de 258 CP cu consum optimizat.', features: JSON.stringify(['4MATIC', 'AMG Line', 'MBUX', 'Piele Artico', 'Trapa panoramica', 'Camera 360', 'Parking Pilot', 'LED Multibeam', 'Navigatie AR', 'Wireless charging']), images: JSON.stringify(['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800']), featured: 1 },
    { brand: 'Audi', model: 'A6', version: '40 TDI S Line', year: 2021, price: 37900, mileage: 72000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 TDI', horsepower: 204, drivetrain: 'Fata (FWD)', body_type: 'Sedan', color: 'Mythos Black', location: 'Iasi', description: 'Audi A6 in linia S Line cu motor TDI eficient. Design elegant si sportiv, cu interior digitalizat complet (Virtual Cockpit + MMI Touch). Masina ideala pentru drumuri lungi.', features: JSON.stringify(['S Line', 'Virtual Cockpit Plus', 'MMI Touch', 'Matrix LED', 'Bang & Olufsen', 'Piele Valcona', 'ACC', 'Lane Assist', 'Navigatie MMI', 'Audi Pre Sense']), images: JSON.stringify(['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800']), featured: 0 },
    { brand: 'Audi', model: 'Q5', version: '45 TFSI quattro S Line', year: 2022, price: 48500, mileage: 42000, fuel: 'Benzina', transmission: 'Automata', engine: '2.0L TFSI', horsepower: 265, drivetrain: 'quattro (4x4)', body_type: 'SUV', color: 'Navarra Blue', location: 'Bucuresti', description: 'Audi Q5 cu motor TFSI de 265 CP si tractiune quattro. SUV premium cu dotari complete si spatiu generos. Pachet S Line exterior si interior pentru un look sportiv.', features: JSON.stringify(['quattro', 'S Line', 'Virtual Cockpit', 'MMI Navigation', 'B&O Sound', 'Piele sport', 'Camera 360', 'Keyless', 'Trapa panoramica', 'Matrix LED']), images: JSON.stringify(['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800']), featured: 0 },
    { brand: 'Porsche', model: 'Macan', version: 'S', year: 2021, price: 54900, mileage: 48000, fuel: 'Benzina', transmission: 'Automata', engine: '2.9L V6 Twin-Turbo', horsepower: 380, drivetrain: 'AWD', body_type: 'SUV', color: 'Carrara White', location: 'Bucuresti', description: 'Porsche Macan S cu motor V6 biturbo de 380 CP. Performanta Porsche intr-un format SUV compact. Suspensie PASM, frane sport, interior complet din piele cu elemente sport.', features: JSON.stringify(['PASM', 'Sport Chrono', 'Frane ceramice PCCB', 'Bose Surround', 'Piele sport', '14-way sport seats', 'Panoramic roof', 'LED PDLS+', 'Sport Exhaust', 'PCM Navigation']), images: JSON.stringify(['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800']), featured: 0 },
    { brand: 'Volkswagen', model: 'Golf', version: 'R 4MOTION', year: 2022, price: 38900, mileage: 31000, fuel: 'Benzina', transmission: 'Automata', engine: '2.0L TSI', horsepower: 320, drivetrain: '4MOTION (4x4)', body_type: 'Hatchback', color: 'Lapiz Blue', location: 'Constanta', description: 'Volkswagen Golf R — performanta pura in format compact. Motor 2.0 TSI cu 320 CP, tractiune 4MOTION cu torque vectoring. Ideal pentru cei care vor o masina practica si extrem de rapida.', features: JSON.stringify(['4MOTION', 'R-Performance Torque Vectoring', 'DCC Adaptive', 'Digital Cockpit Pro', 'Harman Kardon', 'Scaune R sport', 'LED Matrix IQ.Light', 'ACC', 'Travel Assist', 'Akrapovic Exhaust']), images: JSON.stringify(['https://images.unsplash.com/photo-1471479917193-f00955256257?w=800', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800']), featured: 0 },
    { brand: 'Range Rover', model: 'Velar', version: 'D300 R-Dynamic HSE', year: 2022, price: 62900, mileage: 38000, fuel: 'Diesel', transmission: 'Automata', engine: '3.0L I6 Mild-Hybrid', horsepower: 300, drivetrain: 'AWD', body_type: 'SUV', color: 'Silicon Silver', location: 'Bucuresti', description: 'Range Rover Velar — design iconic cu tehnologie de varf. Motor diesel mild-hybrid de 300 CP, interior cu Touch Pro Duo, materiale premium si prezenta impunatoare pe sosea.', features: JSON.stringify(['R-Dynamic HSE', 'Touch Pro Duo', 'Meridian Surround', 'Piele Windsor', 'Head-Up Display', 'Terrain Response 2', 'Camera 360', 'Air Suspension', 'Matrix LED', 'Wireless charging']), images: JSON.stringify(['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800']), featured: 0 },
    { brand: 'BMW', model: 'X5', version: 'xDrive40d M Sport', year: 2023, price: 69900, mileage: 22000, fuel: 'Diesel', transmission: 'Automata', engine: '3.0L I6 Mild-Hybrid', horsepower: 340, drivetrain: 'xDrive (4x4)', body_type: 'SUV', color: 'Arctic Grey', location: 'Brasov', description: 'BMW X5 xDrive40d — SUV premium cu motor diesel mild-hybrid de 340 CP. Comfort de limuzina cu capabilitati off-road. Pachet M Sport complet, interior din piele Merino, sistem audio Bowers & Wilkins.', features: JSON.stringify(['M Sport', 'Piele Merino', 'Bowers & Wilkins', 'Trapa Sky Lounge', 'Driving Assistant Professional', 'Parking Assistant Plus', 'Air Suspension', 'Laser Light', 'Gesture Control', 'Wireless CarPlay']), images: JSON.stringify(['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800']), featured: 0 },
    { brand: 'Mercedes-Benz', model: 'CLA 200', version: 'AMG Line Coupe', year: 2023, price: 36500, mileage: 18000, fuel: 'Benzina', transmission: 'Automata', engine: '1.3L I4 Turbo', horsepower: 163, drivetrain: 'Fata (FWD)', body_type: 'Coupe', color: 'Mountain Grey', location: 'Bucuresti', description: 'Mercedes-Benz CLA Coupe — design coupe patru usi cu linia AMG Line. Ideal pentru cei care vor un Mercedes elegant si sportiv la un pret accesibil. MBUX cu ecran widescreen, ambient lighting cu 64 culori.', features: JSON.stringify(['AMG Line', 'MBUX Widescreen', 'Ambient 64 culori', 'Piele Artico', 'Camera marsarier', 'LED High Performance', 'Mirror Package', 'Pilot automat', 'Keyless-Go', 'Navigatie AR']), images: JSON.stringify(['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800']), featured: 0 },
  ];

  for (const car of CARS_DATA) {
    addCar({ ...car, status: 'active' });
  }

  const LEADS_DATA = [
    { name: 'Andrei Popescu', phone: '0722123456', email: 'andrei@example.com', message: 'Sunt interesat de BMW 530d. Mai este disponibil?', car_name: 'BMW 530d xDrive M Sport', source: 'TikTok', status: 'CONTACTED', type: 'car_inquiry' },
    { name: 'Maria Ionescu', phone: '0733234567', email: 'maria@example.com', message: 'Caut un Mercedes sub 40.000 EUR', car_name: 'Mercedes-Benz C220d AMG Line', source: 'Instagram', status: 'NEW', type: 'car_inquiry' },
    { name: 'Cristian Dumitru', phone: '0744345678', email: 'cristian@example.com', message: 'As vrea sa programez o vizionare pentru Porsche Macan', car_name: 'Porsche Macan S', source: 'Website', status: 'QUALIFIED', type: 'car_inquiry' },
    { name: 'Elena Stanescu', phone: '0755456789', email: 'elena@example.com', message: 'Caut un SUV benzina, buget ~50.000 EUR', source: 'Google', status: 'NEW', type: 'search_request' },
    { name: 'Alexandru Marin', phone: '0766567890', email: 'alex@example.com', message: 'Ma intereseaza Golf R. Se poate testa?', car_name: 'Volkswagen Golf R 4MOTION', source: 'Facebook', status: 'NEGOTIATION', type: 'car_inquiry' },
    { name: 'Diana Preda', phone: '0777678901', email: 'diana@example.com', message: 'Vreau un Audi A6 sau BMW seria 5, diesel, automat', source: 'WhatsApp', status: 'CONTACTED', type: 'search_request' },
    { name: 'Mihai Gheorghe', phone: '0788789012', email: 'mihai@example.com', message: 'Am vazut Range Rover Velar pe TikTok. Cat costa?', car_name: 'Range Rover Velar D300 R-Dynamic HSE', source: 'TikTok', status: 'WON', type: 'car_inquiry' },
    { name: 'Ioana Vasilescu', phone: '0799890123', email: 'ioana@example.com', message: 'Caut ceva premium sub 35.000 EUR', source: 'OLX', status: 'LOST', type: 'search_request' },
  ];
  for (const lead of LEADS_DATA) {
    const id = addLead(lead);
    if (lead.status !== 'NEW') updateLeadStatus(id, lead.status);
  }

  const TESTIMONIALS_DATA = [
    { name: 'Radu M.', car: 'BMW 530d xDrive', text: 'Am gasit exact masina pe care o cautam fara sa pierd saptamani intregi. Comunicarea a fost excelenta de la primul mesaj.', rating: 5 },
    { name: 'Andreea P.', car: 'Mercedes-Benz GLC 300', text: 'Profesionalism si transparenta la cel mai inalt nivel. M-au ajutat sa aleg varianta potrivita si m-au ghidat prin tot procesul.', rating: 5 },
    { name: 'Bogdan T.', car: 'Audi Q5 quattro', text: 'Am apelat la AutoVizibil dupa ce am cautat luni de zile singur. In doua saptamani aveam masina perfecta.', rating: 5 },
    { name: 'Cristina D.', car: 'Volkswagen Golf R', text: 'Echipa AutoVizibil m-a ajutat sa negociez un pret excelent. Recomand cu incredere oricui cauta o masina.', rating: 4 },
  ];
  for (const t of TESTIMONIALS_DATA) addTestimonial(t);

  const BLOG_DATA = [
    { title: 'Cum verifici o masina second hand inainte de cumparare', slug: 'cum-verifici-masina-second-hand', category: 'Ghid cumparare', excerpt: 'Pasi esentiali pe care trebuie sa ii urmezi inainte de a achizitiona o masina rulata. De la verificarea istoricului la inspectia tehnica.', content: '<h2>1. Verificarea istoricului</h2><p>Primul pas este sa verifici istoricul masinii. Solicita cartea de service, verificarile la RAR si asigura-te ca kilometrajul este real.</p><h2>2. Inspectia vizuala</h2><p>Examineaza caroseria cu atentie: diferente de culoare, rosturi inegale sau urme de revopsire pot indica reparatii dupa accidente.</p><h2>3. Test drive</h2><p>Testeaza masina pe diferite tipuri de drum. Asculta zgomotele motorului, verifica schimbarile de viteze, testeaza franele si directia.</p><h2>4. Verificarea tehnica independenta</h2><p>Cea mai buna investitie: du masina la un service independent pentru o verificare completa.</p>', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800' },
    { title: 'Ce trebuie sa stii inainte sa cumperi prima masina', slug: 'ce-trebuie-sa-stii-prima-masina', category: 'Sfaturi', excerpt: 'Ghid complet pentru cei care cumpara prima masina. De la stabilirea bugetului la alegerea combustibilului potrivit.', content: '<h2>Stabileste bugetul total</h2><p>Pretul masinii nu este singurul cost. Adauga asigurarea, impozitul, reviziile, anvelopele si combustibilul lunar.</p><h2>Diesel sau benzina?</h2><p>Daca faci peste 20.000 km pe an, diesel-ul poate fi mai economic. Pentru condus in oras, benzina sau hybrid sunt alegeri mai bune.</p>', image: 'https://images.unsplash.com/photo-1449965408869-ebd13bc0c637?w=800' },
    { title: 'Cum alegi intre diesel si benzina in 2024', slug: 'diesel-vs-benzina', category: 'Comparatii', excerpt: 'Analiza detaliata a avantajelor si dezavantajelor fiecarui tip de combustibil.', content: '<h2>Motorele diesel</h2><p>Diesel-ul ramane o alegere excelenta pentru distante mari. Consumul redus si cuplul generos fac din diesel optiunea ideala pentru autostrada.</p><h2>Motorele benzina</h2><p>Benzina ofera o experienta de condus mai lina, mai silentioasa si cu raspuns mai prompt la acceleratie.</p>', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800' },
    { title: 'Ce inseamna o masina bine intretinuta', slug: 'masina-bine-intretinuta', category: 'Intretinere', excerpt: 'Semnele care iti arata ca o masina a fost ingrijita corespunzator.', content: '<h2>Cartea de service completa</h2><p>O masina bine intretinuta are istoricul complet de revizii, facute la timp si cu piese originale.</p><h2>Aspectul interior</h2><p>Interiorul spune povestea masinii. Uzura uniforma a volanului, scaunelor si pedalelor indica un proprietar atent.</p>', image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=800' },
  ];
  for (const b of BLOG_DATA) addBlogPost(b);

  const ADS_DATA = [
    { title: 'Finantare avantajoasa', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=300&fit=crop', link: '#', position: 'homepage', active: 1 },
    { title: 'Masini noi in stoc', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=300&fit=crop', link: '/masini', position: 'listing', active: 1 },
    { title: 'Vinde-ti masina rapid', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=300&fit=crop', link: '/contact', position: 'car_page', active: 0 },
  ];
  for (const a of ADS_DATA) addAd(a);

  settings = {
    business_name: 'AutoVizibil',
    phone: '+40 779 366 785',
    whatsapp: '40779366785',
    email: 'contact@autovizibil.ro',
    address: 'Bucuresti, Romania',
    program: 'Luni - Vineri: 09:00 - 18:00 | Sambata: 10:00 - 14:00 | Duminica: Inchis',
    instagram: 'https://www.instagram.com/autovizibil.ro',
    tiktok: 'https://www.tiktok.com/@autovizibil.ro',
    facebook: '',
    youtube: '',
    hero_title: 'Masina potrivita incepe cu alegerea potrivita.',
    hero_subtitle: 'Descopera masini atent selectate si vorbeste direct cu AutoVizibil.',
    hero_cta: 'Vezi masinile',
    hero_cta_secondary: 'Cauta-mi o masina',
    logo: '',
  };
}

// Helper for settings used by components
export function getWhatsAppLink(message?: string): string {
  ensureSeeded();
  const msg = encodeURIComponent(message || 'Buna! Sunt interesat de masinile AutoVizibil si as vrea mai multe informatii.');
  return `https://wa.me/${settings.whatsapp}?text=${msg}`;
}

export function getPhoneLink(): string {
  ensureSeeded();
  return `tel:${settings.phone.replace(/\s/g, '')}`;
}
