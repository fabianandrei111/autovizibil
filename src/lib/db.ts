// In-memory mock database for Vercel demo deployment
import { randomUUID as uuid } from 'crypto';

export interface Car {
  id: string; brand: string; model: string; version: string; slug: string;
  year: number; price: number; currency: string; mileage: number; fuel: string;
  transmission: string; engine: string; horsepower: number; drivetrain: string;
  body_type: string; color: string; location: string; description: string;
  features: string; images: string; video_url: string; status: string;
  featured: number; views: number; created_at: string; updated_at: string;
  dealer: string; deal_type: string;
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
export function getCarOfTheDay(): Car | undefined {
  const active = cars.filter(c => c.status === 'active' && c.deal_type === 'car_of_day');
  return active[0] || cars.filter(c => c.status === 'active').sort((a, b) => (b.price / Math.max(b.mileage, 1)) - (a.price / Math.max(a.mileage, 1)))[0];
}
export function getWeeklyDeals(): Car[] { return cars.filter(c => c.status === 'active' && c.deal_type === 'weekly_deal'); }
export function getCarsByDealer(dealer: string): Car[] { return cars.filter(c => c.dealer === dealer && c.status === 'active'); }
export function getDealers(): string[] { return [...new Set(cars.map(c => c.dealer).filter(Boolean))]; }

export function filterCars(filters: {
  brand?: string; fuel?: string; minPrice?: number; maxPrice?: number;
  year?: number; transmission?: string; body_type?: string; status?: string;
  featured?: boolean; sort?: string; dealer?: string;
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
  if (filters.dealer) result = result.filter(c => c.dealer === filters.dealer);

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
    dealer: data.dealer || '', deal_type: data.deal_type || '',
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
    // === SEDAN ===
    { brand: 'Mercedes-Benz', model: 'A 200 d', version: 'DCT AMG', year: 2022, price: 21500, mileage: 141888, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 Turbo', horsepower: 150, drivetrain: 'Fata (FWD)', body_type: 'Sedan', color: 'Gri', location: 'Import Danemarca', description: 'Mercedes-Benz A 200 d in pachet AMG cu transmisie automata DCT. Motor diesel eficient de 150 CP, ideal pentru oras si drumuri lungi. Dotari premium, design sportiv, consum redus. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Pachet AMG', 'Transmisie DCT', 'Navigatie', 'Camera marsarier', 'Faruri LED', 'Keyless-Go', 'Incalzire scaune', 'Pilot automat', 'MBUX', 'Senzori parcare']), images: JSON.stringify(["/cars/car_1.jpg", "/cars/car_1_2.jpg", "/cars/car_1_3.jpg", "/cars/car_1_4.jpg", "/cars/car_1_5.jpg", "/cars/car_1_6.jpg", "/cars/car_1_7.jpg", "/cars/car_1_8.jpg", "/cars/car_1_9.jpg", "/cars/car_1_10.jpg", "/cars/car_1_11.jpg", "/cars/car_1_12.jpg", "/cars/car_1_13.jpg", "/cars/car_1_14.jpg"]), featured: 1, dealer: 'HJA Auto' },
    { brand: 'Mercedes-Benz', model: 'A 200 d', version: 'Automata', year: 2022, price: 18125, mileage: 163001, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 Turbo', horsepower: 150, drivetrain: 'Fata (FWD)', body_type: 'Sedan', color: 'Negru', location: 'Import Danemarca', description: 'Mercedes-Benz A 200 d cu transmisie automata. Motor diesel de 150 CP, consum excelent si dotari complete. Interior premium Mercedes, sistem MBUX. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Transmisie automata', 'MBUX', 'Camera marsarier', 'Faruri LED', 'Senzori parcare', 'Navigatie', 'Bluetooth', 'Clima automata', 'Start/Stop', 'Pilot automat']), images: JSON.stringify(["/cars/car_2.jpg", "/cars/car_2_2.jpg", "/cars/car_2_3.jpg", "/cars/car_2_4.jpg", "/cars/car_2_5.jpg", "/cars/car_2_6.jpg", "/cars/car_2_7.jpg", "/cars/car_2_8.jpg", "/cars/car_2_9.jpg", "/cars/car_2_10.jpg", "/cars/car_2_11.jpg", "/cars/car_2_12.jpg", "/cars/car_2_13.jpg", "/cars/car_2_14.jpg"]), featured: 0, dealer: 'HJA Auto' },
    { brand: 'Mercedes-Benz', model: 'CLA 220 d', version: 'Limousine', year: 2021, price: 21875, mileage: 195000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 Turbo', horsepower: 190, drivetrain: 'Fata (FWD)', body_type: 'Coupe', color: 'Alb', location: 'Import Danemarca', description: 'Mercedes-Benz CLA 220 d — design coupe elegant cu motor diesel de 190 CP. Linie sportiva, interior premium cu MBUX, consum economic. Masina ideala pentru cei care vor stil si eficienta. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Design Coupe', 'MBUX', 'Faruri LED', 'Piele', 'Camera marsarier', 'Navigatie', 'Clima automata', 'Senzori parcare', 'Keyless-Go', 'Pilot automat']), images: JSON.stringify(["/cars/car_7.jpg", "/cars/car_7_2.jpg", "/cars/car_7_3.jpg", "/cars/car_7_4.jpg", "/cars/car_7_5.jpg", "/cars/car_7_6.jpg", "/cars/car_7_7.jpg", "/cars/car_7_8.jpg", "/cars/car_7_9.jpg", "/cars/car_7_10.jpg", "/cars/car_7_11.jpg", "/cars/car_7_12.jpg", "/cars/car_7_13.jpg", "/cars/car_7_14.jpg"]), featured: 1, dealer: 'HJA Auto' },
    { brand: 'Mercedes-Benz', model: 'GLA 250 e', version: 'Progressive', year: 2022, price: 23125, mileage: 189440, fuel: 'Hybrid', transmission: 'Automata', engine: '1.3L I4 + Electric', horsepower: 218, drivetrain: 'Fata (FWD)', body_type: 'SUV', color: 'Alb', location: 'Import Danemarca', description: 'Mercedes-Benz GLA 250 e Plug-In Hybrid cu 218 CP combinati. Autonomie electrica in oras, motor pe benzina pentru drumuri lungi. Pachet Progressive cu dotari complete. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Plug-In Hybrid', 'Pachet Progressive', 'MBUX', 'Camera marsarier', 'Faruri LED', 'Navigatie', 'Clima automata', 'Senzori parcare', 'Keyless-Go', 'Incarcare rapida']), images: JSON.stringify(["/cars/car_12.jpg", "/cars/car_12_2.jpg", "/cars/car_12_3.jpg", "/cars/car_12_4.jpg", "/cars/car_12_5.jpg", "/cars/car_12_6.jpg", "/cars/car_12_7.jpg", "/cars/car_12_8.jpg", "/cars/car_12_9.jpg", "/cars/car_12_10.jpg", "/cars/car_12_11.jpg", "/cars/car_12_12.jpg", "/cars/car_12_13.jpg", "/cars/car_12_14.jpg"]), featured: 1, dealer: 'HJA Auto' },
    { brand: 'BMW', model: '320 d', version: 'Sport Line Limousine', year: 2021, price: 21250, mileage: 185106, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 Turbo', horsepower: 190, drivetrain: 'Spate (RWD)', body_type: 'Sedan', color: 'Negru', location: 'Import Danemarca', description: 'BMW 320d Sport Line — sedan premium cu motor diesel de 190 CP si transmisie automata. Dinamica de condus BMW, pachet Sport Line cu accente sportive. Interior premium cu navigatie si dotari complete. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Sport Line', 'Navigatie Professional', 'Piele', 'Faruri LED', 'Camera marsarier', 'Pilot automat', 'ACC', 'Senzori parcare', 'Keyless Entry', 'Start/Stop']), images: JSON.stringify(["/cars/car_5.jpg", "/cars/car_5_2.jpg", "/cars/car_5_3.jpg", "/cars/car_5_4.jpg", "/cars/car_5_5.jpg", "/cars/car_5_6.jpg", "/cars/car_5_7.jpg", "/cars/car_5_8.jpg", "/cars/car_5_9.jpg", "/cars/car_5_10.jpg", "/cars/car_5_11.jpg", "/cars/car_5_12.jpg", "/cars/car_5_13.jpg"]), featured: 1, dealer: 'HJA Auto' },
    { brand: 'BMW', model: '320 d', version: 'M Sport Limousine', year: 2022, price: 22125, mileage: 248543, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 Turbo', horsepower: 190, drivetrain: 'Spate (RWD)', body_type: 'Sedan', color: 'Gri', location: 'Import Danemarca', description: 'BMW 320d M Sport — sedan cu pachet M Sport complet, motor diesel de 190 CP. Design sportiv agresiv, jante M, suspensie sport. Interior din piele cu accente M. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['M Sport Package', 'Jante M', 'Piele', 'Navigatie', 'Faruri LED', 'Camera marsarier', 'ACC', 'Senzori parcare', 'Keyless Entry', 'Suspensie sport']), images: JSON.stringify(["/cars/car_20.jpg", "/cars/car_20_2.jpg", "/cars/car_20_3.jpg", "/cars/car_20_4.jpg", "/cars/car_20_5.jpg", "/cars/car_20_6.jpg", "/cars/car_20_7.jpg", "/cars/car_20_8.jpg", "/cars/car_20_9.jpg", "/cars/car_20_10.jpg", "/cars/car_20_11.jpg", "/cars/car_20_12.jpg", "/cars/car_20_13.jpg"]), featured: 0, dealer: 'HJA Auto' },
    { brand: 'BMW', model: '520 d', version: 'M Sport Limousine', year: 2020, price: 26250, mileage: 215512, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 Turbo', horsepower: 190, drivetrain: 'Spate (RWD)', body_type: 'Sedan', color: 'Negru', location: 'Import Danemarca', description: 'BMW 520d M Sport — limuzina de clasa business cu motor diesel de 190 CP. Confort suprem, dotari complete, pachet M Sport exterior si interior. Ideala pentru drumuri lungi si reprezentare. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['M Sport', 'Piele Dakota', 'Head-Up Display', 'Harman Kardon', 'Navigatie Professional', 'Camera 360', 'ACC', 'LED Adaptive', 'Trapa panoramica', 'Parking Assistant']), images: JSON.stringify(["/cars/car_9.jpg", "/cars/car_9_2.jpg", "/cars/car_9_3.jpg", "/cars/car_9_4.jpg", "/cars/car_9_5.jpg", "/cars/car_9_6.jpg", "/cars/car_9_7.jpg", "/cars/car_9_8.jpg", "/cars/car_9_9.jpg", "/cars/car_9_10.jpg", "/cars/car_9_11.jpg", "/cars/car_9_12.jpg", "/cars/car_9_13.jpg", "/cars/car_9_14.jpg"]), featured: 1, dealer: 'HJA Auto' },
    { brand: 'BMW', model: '530 e', version: 'Sportline Limousine', year: 2021, price: 25000, mileage: 198326, fuel: 'Hybrid', transmission: 'Automata', engine: '2.0L I4 + Electric', horsepower: 292, drivetrain: 'Spate (RWD)', body_type: 'Sedan', color: 'Alb', location: 'Import Danemarca', description: 'BMW 530e Plug-In Hybrid cu 292 CP combinati. Autonomie electrica pentru oras, performanta pentru autostrada. Pachet Sportline cu dotari premium. Consum foarte redus. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Plug-In Hybrid', 'Sportline', 'Navigatie Professional', 'Piele', 'LED Adaptive', 'Camera marsarier', 'ACC', 'Pilot automat', 'Incarcare rapida', 'Clima automata']), images: JSON.stringify(["/cars/car_13.jpg", "/cars/car_13_2.jpg", "/cars/car_13_3.jpg", "/cars/car_13_4.jpg", "/cars/car_13_5.jpg", "/cars/car_13_6.jpg", "/cars/car_13_7.jpg", "/cars/car_13_8.jpg", "/cars/car_13_9.jpg", "/cars/car_13_10.jpg", "/cars/car_13_11.jpg", "/cars/car_13_12.jpg", "/cars/car_13_13.jpg", "/cars/car_13_14.jpg", "/cars/car_13_15.jpg"]), featured: 0, dealer: 'HJA Auto' },
    { brand: 'BMW', model: 'M550 d', version: 'xDrive Touring', year: 2015, price: 15000, mileage: 264251, fuel: 'Diesel', transmission: 'Automata', engine: '3.0L I6 Triple-Turbo', horsepower: 381, drivetrain: 'xDrive (4x4)', body_type: 'Break', color: 'Negru', location: 'Import Danemarca', description: 'BMW M550d xDrive Touring — bestia diesel cu 381 CP din motorul tri-turbo. Tractiune integrala xDrive, performante de masina sport in format break practic. Acceleratie 0-100 in 4.7 secunde. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['xDrive', 'Triple-Turbo', 'M Sport', 'Piele', 'Navigatie Professional', 'Harman Kardon', 'Head-Up Display', 'Camera 360', 'Suspensie adaptiva', 'Launch Control']), images: JSON.stringify(["/cars/car_15.jpg", "/cars/car_15_2.jpg", "/cars/car_15_3.jpg", "/cars/car_15_4.jpg", "/cars/car_15_5.jpg", "/cars/car_15_6.jpg", "/cars/car_15_7.jpg", "/cars/car_15_8.jpg", "/cars/car_15_9.jpg", "/cars/car_15_10.jpg", "/cars/car_15_11.jpg", "/cars/car_15_12.jpg", "/cars/car_15_13.jpg", "/cars/car_15_14.jpg", "/cars/car_15_15.jpg"]), featured: 0, dealer: 'HJA Auto' },
    { brand: 'BMW', model: '530 e', version: 'Touring M Sport', year: 2023, price: 26875, mileage: 195603, fuel: 'Hybrid', transmission: 'Automata', engine: '2.0L I4 + Electric', horsepower: 292, drivetrain: 'Spate (RWD)', body_type: 'Break', color: 'Gri', location: 'Import Danemarca', description: 'BMW 530e Touring M Sport — break plug-in hybrid cu 292 CP si pachet M Sport. Spatiu generos de incarcare combinat cu propulsie electrica eficienta. Design M Sport agresiv. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Plug-In Hybrid', 'M Sport', 'Touring', 'Navigatie Professional', 'Piele', 'LED Adaptive', 'Camera 360', 'ACC', 'Trapa panoramica', 'Incarcare rapida']), images: JSON.stringify(["/cars/car_16.jpg", "/cars/car_16_2.jpg", "/cars/car_16_3.jpg", "/cars/car_16_4.jpg", "/cars/car_16_5.jpg", "/cars/car_16_6.jpg", "/cars/car_16_7.jpg", "/cars/car_16_8.jpg", "/cars/car_16_9.jpg", "/cars/car_16_10.jpg", "/cars/car_16_11.jpg", "/cars/car_16_12.jpg", "/cars/car_16_13.jpg", "/cars/car_16_14.jpg"]), featured: 1, dealer: 'HJA Auto' },
    { brand: 'Skoda', model: 'Octavia', version: '2.0 TDI DSG Style', year: 2021, price: 16250, mileage: 201431, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 TDI', horsepower: 150, drivetrain: 'Fata (FWD)', body_type: 'Sedan', color: 'Gri', location: 'Import Danemarca', description: 'Skoda Octavia in versiunea Style cu motor 2.0 TDI de 150 CP si cutie automata DSG. Spatiu interior generos, dotari complete, consum economic. Una dintre cele mai practice masini din segment. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Pachet Style', 'DSG', 'Navigatie Columbus', 'Camera marsarier', 'Faruri LED Matrix', 'Virtual Cockpit', 'Clima automata 3 zone', 'Senzori parcare', 'ACC', 'Lane Assist']), images: JSON.stringify(["/cars/car_17.jpg", "/cars/car_17_2.jpg", "/cars/car_17_3.jpg", "/cars/car_17_4.jpg", "/cars/car_17_5.jpg", "/cars/car_17_6.jpg", "/cars/car_17_7.jpg", "/cars/car_17_8.jpg", "/cars/car_17_9.jpg", "/cars/car_17_10.jpg", "/cars/car_17_11.jpg", "/cars/car_17_12.jpg", "/cars/car_17_13.jpg", "/cars/car_17_14.jpg"]), featured: 0, dealer: 'HJA Auto' },
    // === SUV / CROSSOVER ===
    { brand: 'Volvo', model: 'XC 60', version: 'T8 Momentum Plug-In Hybrid AWD', year: 2018, price: 21250, mileage: 148265, fuel: 'Hybrid', transmission: 'Automata', engine: '2.0L I4 + Electric', horsepower: 407, drivetrain: 'AWD (4x4)', body_type: 'SUV', color: 'Alb', location: 'Import Danemarca', description: 'Volvo XC60 T8 Plug-In Hybrid cu 407 CP! Tractiune integrala, siguranta Volvo de top, autonomie electrica in oras. Confort scandinav premium cu dotari complete. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Plug-In Hybrid', 'AWD', 'Pachet Momentum', 'Pilot Assist', 'Navigatie Sensus', 'Piele', 'Camera 360', 'Harman Kardon', 'Incalzire scaune', 'Head-Up Display']), images: JSON.stringify(["/cars/car_4.jpg", "/cars/car_4_2.jpg", "/cars/car_4_3.jpg", "/cars/car_4_4.jpg", "/cars/car_4_5.jpg", "/cars/car_4_6.jpg", "/cars/car_4_7.jpg", "/cars/car_4_8.jpg", "/cars/car_4_9.jpg", "/cars/car_4_10.jpg", "/cars/car_4_11.jpg", "/cars/car_4_12.jpg", "/cars/car_4_13.jpg", "/cars/car_4_14.jpg", "/cars/car_4_15.jpg"]), featured: 1, dealer: 'HJA Auto' },
    { brand: 'Volkswagen', model: 'T-Roc', version: '2.0 TDI DSG Sport', year: 2021, price: 19000, mileage: 192646, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 TDI', horsepower: 150, drivetrain: 'Fata (FWD)', body_type: 'SUV', color: 'Albastru', location: 'Import Danemarca', description: 'Volkswagen T-Roc Sport cu motor 2.0 TDI de 150 CP si cutie DSG. SUV compact cu design sportiv, ideal pentru oras si excursii. Dotari complete pachet Sport. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Pachet Sport', 'DSG', 'Navigatie Discover', 'Camera marsarier', 'Faruri LED', 'Digital Cockpit', 'Clima automata', 'ACC', 'Senzori parcare', 'Apple CarPlay']), images: JSON.stringify(["/cars/car_6.jpg", "/cars/car_6_2.jpg", "/cars/car_6_3.jpg", "/cars/car_6_4.jpg", "/cars/car_6_5.jpg", "/cars/car_6_6.jpg", "/cars/car_6_7.jpg", "/cars/car_6_8.jpg", "/cars/car_6_9.jpg", "/cars/car_6_10.jpg", "/cars/car_6_11.jpg", "/cars/car_6_12.jpg", "/cars/car_6_13.jpg", "/cars/car_6_14.jpg"]), featured: 0, dealer: 'HJA Auto' },
    { brand: 'Ford', model: 'Kuga', version: '1.5 EcoBlue ST-Line X Auto', year: 2021, price: 15000, mileage: 182625, fuel: 'Diesel', transmission: 'Automata', engine: '1.5L I3 EcoBlue', horsepower: 120, drivetrain: 'Fata (FWD)', body_type: 'SUV', color: 'Negru', location: 'Import Danemarca', description: 'Ford Kuga ST-Line X cu motor EcoBlue de 120 CP si transmisie automata. SUV practic cu design sportiv ST-Line, dotari premium, consum redus. Spatiu generos pentru familie. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['ST-Line X', 'Transmisie automata', 'SYNC 3', 'Camera marsarier', 'Faruri LED', 'Senzori parcare', 'ACC', 'Lane Assist', 'Apple CarPlay', 'Clima automata']), images: JSON.stringify(["/cars/car_10.jpg", "/cars/car_10_2.jpg", "/cars/car_10_3.jpg", "/cars/car_10_4.jpg", "/cars/car_10_5.jpg", "/cars/car_10_6.jpg", "/cars/car_10_7.jpg", "/cars/car_10_8.jpg", "/cars/car_10_9.jpg", "/cars/car_10_10.jpg", "/cars/car_10_11.jpg", "/cars/car_10_12.jpg", "/cars/car_10_13.jpg", "/cars/car_10_14.jpg"]), featured: 0, dealer: 'HJA Auto' },
    { brand: 'Ford', model: 'Kuga', version: '1.5 EcoBlue ST-Line X Auto', year: 2022, price: 15000, mileage: 202733, fuel: 'Diesel', transmission: 'Automata', engine: '1.5L I3 EcoBlue', horsepower: 120, drivetrain: 'Fata (FWD)', body_type: 'SUV', color: 'Albastru', location: 'Import Danemarca', description: 'Ford Kuga ST-Line X model 2022. Motor EcoBlue de 120 CP, transmisie automata, pachet ST-Line X complet. Design modern si spatiu generos. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['ST-Line X', 'Transmisie automata', 'SYNC 3', 'Camera marsarier', 'Faruri LED', 'Senzori parcare', 'ACC', 'Lane Assist', 'Navigatie', 'Head-Up Display']), images: JSON.stringify(["/cars/car_19.jpg", "/cars/car_19_2.jpg", "/cars/car_19_3.jpg", "/cars/car_19_4.jpg", "/cars/car_19_5.jpg", "/cars/car_19_6.jpg", "/cars/car_19_7.jpg", "/cars/car_19_8.jpg", "/cars/car_19_9.jpg", "/cars/car_19_10.jpg", "/cars/car_19_11.jpg", "/cars/car_19_12.jpg", "/cars/car_19_13.jpg", "/cars/car_19_14.jpg"]), featured: 0, dealer: 'HJA Auto' },
    { brand: 'BMW', model: 'X1', version: 'xDrive 25 e M Sport', year: 2022, price: 18750, mileage: 207000, fuel: 'Hybrid', transmission: 'Automata', engine: '1.5L I3 + Electric', horsepower: 220, drivetrain: 'xDrive (4x4)', body_type: 'SUV', color: 'Alb', location: 'Import Danemarca', description: 'BMW X1 xDrive 25e M Sport — SUV compact plug-in hybrid cu 220 CP si tractiune integrala. Pachet M Sport complet, autonomie electrica pentru naveta zilnica. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Plug-In Hybrid', 'xDrive', 'M Sport', 'Navigatie', 'Camera marsarier', 'Faruri LED', 'ACC', 'Senzori parcare', 'Keyless Entry', 'Incarcare rapida']), images: JSON.stringify(["/cars/car_18.jpg", "/cars/car_18_2.jpg", "/cars/car_18_3.jpg", "/cars/car_18_4.jpg", "/cars/car_18_5.jpg", "/cars/car_18_6.jpg", "/cars/car_18_7.jpg", "/cars/car_18_8.jpg", "/cars/car_18_9.jpg", "/cars/car_18_10.jpg", "/cars/car_18_11.jpg", "/cars/car_18_12.jpg", "/cars/car_18_13.jpg", "/cars/car_18_14.jpg"]), featured: 0, dealer: 'HJA Auto' },
    // === BREAK / MONOVOLUM / FAMILIE ===
    { brand: 'Opel', model: 'Insignia B', version: '1.5 Sports Tourer Dynamic', year: 2018, price: 9500, mileage: 156395, fuel: 'Benzina', transmission: 'Automata', engine: '1.5L I4 Turbo', horsepower: 165, drivetrain: 'Fata (FWD)', body_type: 'Break', color: 'Gri', location: 'Import Danemarca', description: 'Opel Insignia Sports Tourer Dynamic — break spatios cu motor 1.5 turbo benzina de 165 CP. Design elegant, portbagaj generos, dotari complete pachet Dynamic. Ideal pentru familie. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Pachet Dynamic', 'Transmisie automata', 'Navigatie IntelliLink', 'Camera marsarier', 'Faruri LED Matrix', 'Clima automata', 'Senzori parcare', 'Scaune ergonomice', 'Apple CarPlay', 'Pilot automat']), images: JSON.stringify(["/cars/car_3.jpg", "/cars/car_3_2.jpg", "/cars/car_3_3.jpg", "/cars/car_3_4.jpg", "/cars/car_3_5.jpg", "/cars/car_3_6.jpg", "/cars/car_3_7.jpg", "/cars/car_3_8.jpg", "/cars/car_3_9.jpg", "/cars/car_3_10.jpg", "/cars/car_3_11.jpg", "/cars/car_3_12.jpg", "/cars/car_3_13.jpg", "/cars/car_3_14.jpg"]), featured: 0, dealer: 'HJA Auto' },
    { brand: 'Volvo', model: 'V60', version: 'B4 R-Design', year: 2022, price: 20000, mileage: 181583, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 Mild-Hybrid', horsepower: 197, drivetrain: 'Fata (FWD)', body_type: 'Break', color: 'Negru', location: 'Import Danemarca', description: 'Volvo V60 B4 R-Design — break premium scandinav cu motor mild-hybrid de 197 CP. Design R-Design sportiv, siguranta Volvo de top, interior din piele. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['R-Design', 'Mild-Hybrid', 'Pilot Assist', 'Navigatie Sensus', 'Piele', 'Camera marsarier', 'Harman Kardon', 'Faruri LED', 'Clima automata', 'Senzori parcare']), images: JSON.stringify(["/cars/car_11.jpg", "/cars/car_11_2.jpg", "/cars/car_11_3.jpg", "/cars/car_11_4.jpg", "/cars/car_11_5.jpg", "/cars/car_11_6.jpg", "/cars/car_11_7.jpg", "/cars/car_11_8.jpg", "/cars/car_11_9.jpg", "/cars/car_11_10.jpg", "/cars/car_11_11.jpg", "/cars/car_11_12.jpg", "/cars/car_11_13.jpg", "/cars/car_11_14.jpg"]), featured: 0, dealer: 'HJA Auto' },
    { brand: 'Ford', model: 'C-MAX', version: '2.0 TDCI Titanium', year: 2018, price: 7500, mileage: 166084, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 TDCI', horsepower: 170, drivetrain: 'Fata (FWD)', body_type: 'Monovolum', color: 'Gri', location: 'Import Danemarca', description: 'Ford C-MAX Titanium cu motor 2.0 TDCI de 170 CP si transmisie automata. Monovolum practic si spatios, ideal pentru familie. Pachet Titanium cu dotari premium. Pret excelent. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Pachet Titanium', 'Transmisie automata', 'SYNC', 'Camera marsarier', 'Senzori parcare', 'Clima automata', 'Faruri auto', 'Scaune incalzite', 'Pilot automat', 'Bluetooth']), images: JSON.stringify(["/cars/car_8.jpg", "/cars/car_8_2.jpg", "/cars/car_8_3.jpg", "/cars/car_8_4.jpg", "/cars/car_8_5.jpg", "/cars/car_8_6.jpg", "/cars/car_8_7.jpg", "/cars/car_8_8.jpg", "/cars/car_8_9.jpg", "/cars/car_8_10.jpg", "/cars/car_8_11.jpg", "/cars/car_8_12.jpg", "/cars/car_8_13.jpg"]), featured: 0, dealer: 'HJA Auto' },
    { brand: 'Ford', model: 'S-Max', version: '2.0 EcoBlue ST-Line 7 locuri', year: 2021, price: 15625, mileage: 203232, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 EcoBlue', horsepower: 190, drivetrain: 'Fata (FWD)', body_type: 'Monovolum', color: 'Albastru', location: 'Import Danemarca', description: 'Ford S-Max ST-Line cu 7 locuri si motor EcoBlue de 190 CP. Monovolumul sportiv ideal pentru familii mari. Design ST-Line dinamic, spatiu generos pe toate cele 3 randuri de scaune. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['7 locuri', 'ST-Line', 'EcoBlue', 'SYNC 3', 'Camera marsarier', 'Faruri LED', 'Senzori parcare', 'ACC', 'Clima automata 3 zone', 'Apple CarPlay']), images: JSON.stringify(["/cars/car_14.jpg", "/cars/car_14_2.jpg", "/cars/car_14_3.jpg", "/cars/car_14_4.jpg", "/cars/car_14_5.jpg", "/cars/car_14_6.jpg", "/cars/car_14_7.jpg", "/cars/car_14_8.jpg", "/cars/car_14_9.jpg", "/cars/car_14_10.jpg", "/cars/car_14_11.jpg", "/cars/car_14_12.jpg", "/cars/car_14_13.jpg", "/cars/car_14_14.jpg", "/cars/car_14_15.jpg"]), featured: 0, dealer: 'HJA Auto' },
    // === ALTERGOTT AUTOMOBILE (Bruchsal, Germania) ===
    { brand: 'Mercedes-Benz', model: 'GLC 350 d', version: 'Coupe 4Matic', year: 2017, price: 22450, mileage: 168000, fuel: 'Diesel', transmission: 'Automata', engine: '3.0L V6 Turbo', horsepower: 258, drivetrain: '4Matic (4x4)', body_type: 'SUV Coupe', color: 'Negru', location: 'Import Germania', description: 'Mercedes-Benz GLC 350d Coupe 4Matic cu motor V6 diesel de 258 CP. Design coupe sportiv cu tractiune integrala, faruri LED, piele, navigatie, camera 360. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['4Matic', 'LED', 'Piele', 'Navigatie', 'Camera 360', 'Senzori parcare', 'Clima automata', 'Keyless-Go', 'Pilot automat', 'Trapa panoramica']), images: JSON.stringify(["/cars/car_21.jpg", "/cars/car_21_2.jpg", "/cars/car_21_3.jpg", "/cars/car_21_4.jpg", "/cars/car_21_5.jpg", "/cars/car_21_6.jpg", "/cars/car_21_7.jpg", "/cars/car_21_8.jpg", "/cars/car_21_9.jpg", "/cars/car_21_10.jpg", "/cars/car_21_11.jpg", "/cars/car_21_12.jpg", "/cars/car_21_13.jpg", "/cars/car_21_14.jpg", "/cars/car_21_15.jpg", "/cars/car_21_16.jpg"]), featured: 1, dealer: 'Altergott Automobile', deal_type: 'weekly_deal' },
    { brand: 'Volkswagen', model: 'Tiguan', version: '2.0 TDI 4Motion', year: 2024, price: 29300, mileage: 134000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 TDI', horsepower: 193, drivetrain: '4Motion (4x4)', body_type: 'SUV', color: 'Gri', location: 'Import Germania', description: 'Volkswagen Tiguan 2024 cu motor 2.0 TDI de 193 CP si tractiune integrala 4Motion. SUV-ul familiei, cu dotari complete, LED, camera 360, piele. Model recent! Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['4Motion', 'LED', 'Camera 360', 'Piele partiala', 'Navigatie Discover', 'ACC', 'Senzori parcare', 'Digital Cockpit', 'Clima automata', 'Apple CarPlay']), images: JSON.stringify(["/cars/car_22.jpg", "/cars/car_22_2.jpg", "/cars/car_22_3.jpg", "/cars/car_22_4.jpg", "/cars/car_22_5.jpg", "/cars/car_22_6.jpg", "/cars/car_22_7.jpg", "/cars/car_22_8.jpg", "/cars/car_22_9.jpg", "/cars/car_22_10.jpg", "/cars/car_22_11.jpg", "/cars/car_22_12.jpg", "/cars/car_22_13.jpg", "/cars/car_22_14.jpg", "/cars/car_22_15.jpg", "/cars/car_22_16.jpg", "/cars/car_22_17.jpg", "/cars/car_22_18.jpg", "/cars/car_22_19.jpg", "/cars/car_22_20.jpg"]), featured: 1, dealer: 'Altergott Automobile' },
    { brand: 'BMW', model: '730 d', version: 'xDrive', year: 2018, price: 23000, mileage: 184200, fuel: 'Diesel', transmission: 'Automata', engine: '3.0L I6 Turbo', horsepower: 265, drivetrain: 'xDrive (4x4)', body_type: 'Sedan', color: 'Negru', location: 'Import Germania', description: 'BMW 730d xDrive — limuzina de lux cu motor diesel de 265 CP si tractiune integrala. Confort de clasa superioara, dotari complete, ideal pentru reprezentare si drumuri lungi. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['xDrive', 'Piele Nappa', 'Head-Up Display', 'Harman Kardon', 'Navigatie Professional', 'Camera 360', 'Soft-close', 'Suspensie pneumatica', 'LED Adaptive', 'Masaj scaune']), images: JSON.stringify(["/cars/car_23.jpg", "/cars/car_23_2.jpg", "/cars/car_23_3.jpg", "/cars/car_23_4.jpg", "/cars/car_23_5.jpg", "/cars/car_23_6.jpg", "/cars/car_23_7.jpg", "/cars/car_23_8.jpg", "/cars/car_23_9.jpg", "/cars/car_23_10.jpg", "/cars/car_23_11.jpg", "/cars/car_23_12.jpg", "/cars/car_23_13.jpg", "/cars/car_23_14.jpg", "/cars/car_23_15.jpg", "/cars/car_23_16.jpg", "/cars/car_23_17.jpg", "/cars/car_23_18.jpg", "/cars/car_23_19.jpg", "/cars/car_23_20.jpg"]), featured: 0, dealer: 'Altergott Automobile', deal_type: 'car_of_day' },
    { brand: 'Mercedes-Benz', model: 'GLC 300 e', version: '4Matic', year: 2021, price: 23450, mileage: 157700, fuel: 'Hybrid', transmission: 'Automata', engine: '2.0L I4 + Electric', horsepower: 306, drivetrain: '4Matic (4x4)', body_type: 'SUV', color: 'Alb', location: 'Import Germania', description: 'Mercedes-Benz GLC 300e Plug-In Hybrid 4Matic cu 306 CP combinati. Tractiune integrala, autonomie electrica in oras, piele, LED, navigatie. Combina performanta cu eficienta. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Plug-In Hybrid', '4Matic', 'LED', 'Piele', 'Navigatie', 'Camera 360', 'Senzori parcare', 'Clima automata', 'Keyless-Go', 'Incarcare rapida']), images: JSON.stringify(["/cars/car_24.jpg", "/cars/car_24_2.jpg", "/cars/car_24_3.jpg", "/cars/car_24_4.jpg", "/cars/car_24_5.jpg", "/cars/car_24_6.jpg", "/cars/car_24_7.jpg", "/cars/car_24_8.jpg", "/cars/car_24_9.jpg", "/cars/car_24_10.jpg", "/cars/car_24_11.jpg", "/cars/car_24_12.jpg", "/cars/car_24_13.jpg", "/cars/car_24_14.jpg", "/cars/car_24_15.jpg", "/cars/car_24_16.jpg", "/cars/car_24_17.jpg", "/cars/car_24_18.jpg"]), featured: 0, dealer: 'Altergott Automobile' },
    { brand: 'Volkswagen', model: 'Tiguan', version: '2.0 TDI Life 4Motion', year: 2022, price: 19400, mileage: 180200, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 TDI', horsepower: 150, drivetrain: '4Motion (4x4)', body_type: 'SUV', color: 'Alb', location: 'Import Germania', description: 'Volkswagen Tiguan Life cu motor 2.0 TDI de 150 CP si tractiune 4Motion. SUV practic cu dotari Life complete, LED, navigatie, camera. Pret excelent. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['4Motion', 'Pachet Life', 'LED', 'Navigatie', 'Camera marsarier', 'ACC', 'Senzori parcare', 'Clima automata', 'Digital Cockpit', 'Lane Assist']), images: JSON.stringify(["/cars/car_25.jpg", "/cars/car_25_2.jpg", "/cars/car_25_3.jpg", "/cars/car_25_4.jpg", "/cars/car_25_5.jpg", "/cars/car_25_6.jpg", "/cars/car_25_7.jpg", "/cars/car_25_8.jpg", "/cars/car_25_9.jpg", "/cars/car_25_10.jpg", "/cars/car_25_11.jpg", "/cars/car_25_12.jpg"]), featured: 0, dealer: 'Altergott Automobile' },
    { brand: 'Volkswagen', model: 'Touareg', version: '3.0 TDI 4Motion', year: 2020, price: 25400, mileage: 200000, fuel: 'Diesel', transmission: 'Automata', engine: '3.0L V6 TDI', horsepower: 231, drivetrain: '4Motion (4x4)', body_type: 'SUV', color: 'Negru', location: 'Import Germania', description: 'Volkswagen Touareg cu motor V6 TDI de 231 CP si tractiune 4Motion. SUV premium cu spatiu generos, dotari de top, confort de limuzina. Ideal pentru familie si drumuri lungi. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['4Motion', 'V6 TDI', 'Piele', 'LED Matrix', 'Navigatie Discover Pro', 'Camera 360', 'Head-Up Display', 'Suspensie pneumatica', 'Clima 4 zone', 'Trapa panoramica']), images: JSON.stringify(["/cars/car_26.jpg", "/cars/car_26_2.jpg", "/cars/car_26_3.jpg", "/cars/car_26_4.jpg", "/cars/car_26_5.jpg", "/cars/car_26_6.jpg", "/cars/car_26_7.jpg", "/cars/car_26_8.jpg", "/cars/car_26_9.jpg", "/cars/car_26_10.jpg", "/cars/car_26_11.jpg", "/cars/car_26_12.jpg", "/cars/car_26_13.jpg", "/cars/car_26_14.jpg", "/cars/car_26_15.jpg", "/cars/car_26_16.jpg", "/cars/car_26_17.jpg", "/cars/car_26_18.jpg", "/cars/car_26_19.jpg"]), featured: 0, dealer: 'Altergott Automobile' },
    { brand: 'Audi', model: 'Q7', version: '45 TDI quattro', year: 2023, price: 37300, mileage: 145200, fuel: 'Diesel', transmission: 'Automata', engine: '3.0L V6 TDI', horsepower: 231, drivetrain: 'quattro (4x4)', body_type: 'SUV', color: 'Gri', location: 'Import Germania', description: 'Audi Q7 45 TDI quattro model 2023 — SUV premium cu 7 locuri optionale, motor V6 TDI de 231 CP si tractiune quattro. Dotari complete, confort de prima clasa. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['quattro', 'V6 TDI', 'Virtual Cockpit Plus', 'MMI Touch', 'Matrix LED', 'Bang & Olufsen', 'Piele Valcona', 'Camera 360', 'ACC', 'Air Suspension']), images: JSON.stringify(["/cars/car_27.jpg", "/cars/car_27_2.jpg", "/cars/car_27_3.jpg", "/cars/car_27_4.jpg", "/cars/car_27_5.jpg", "/cars/car_27_6.jpg", "/cars/car_27_7.jpg", "/cars/car_27_8.jpg", "/cars/car_27_9.jpg", "/cars/car_27_10.jpg", "/cars/car_27_11.jpg", "/cars/car_27_12.jpg", "/cars/car_27_13.jpg", "/cars/car_27_14.jpg", "/cars/car_27_15.jpg", "/cars/car_27_16.jpg", "/cars/car_27_17.jpg", "/cars/car_27_18.jpg", "/cars/car_27_19.jpg", "/cars/car_27_20.jpg", "/cars/car_27_21.jpg", "/cars/car_27_22.jpg", "/cars/car_27_23.jpg", "/cars/car_27_24.jpg"]), featured: 1, dealer: 'Altergott Automobile', deal_type: 'weekly_deal' },
    { brand: 'Volkswagen', model: 'Touran', version: '2.0 TDI DSG Comfortline', year: 2023, price: 16800, mileage: 189500, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 TDI', horsepower: 150, drivetrain: 'Fata (FWD)', body_type: 'Monovolum', color: 'Gri', location: 'Import Germania', description: 'Volkswagen Touran Comfortline cu motor 2.0 TDI de 150 CP si cutie DSG. Monovolum spatios cu 7 locuri, ideal pentru familie. Model 2023 cu dotari complete. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['7 locuri', 'DSG', 'Comfortline', 'LED', 'Navigatie', 'Camera marsarier', 'Senzori parcare', 'Clima automata', 'ACC', 'Apple CarPlay']), images: JSON.stringify(["/cars/car_28.jpg", "/cars/car_28_2.jpg", "/cars/car_28_3.jpg", "/cars/car_28_4.jpg", "/cars/car_28_5.jpg", "/cars/car_28_6.jpg", "/cars/car_28_7.jpg", "/cars/car_28_8.jpg", "/cars/car_28_9.jpg", "/cars/car_28_10.jpg", "/cars/car_28_11.jpg", "/cars/car_28_12.jpg", "/cars/car_28_13.jpg", "/cars/car_28_14.jpg", "/cars/car_28_15.jpg", "/cars/car_28_16.jpg"]), featured: 0, dealer: 'Altergott Automobile' },
    { brand: 'Audi', model: 'Q5', version: '45 TDI quattro', year: 2019, price: 18900, mileage: 214500, fuel: 'Diesel', transmission: 'Automata', engine: '3.0L V6 TDI', horsepower: 231, drivetrain: 'quattro (4x4)', body_type: 'SUV', color: 'Negru', location: 'Import Germania', description: 'Audi Q5 45 TDI quattro cu motor V6 de 231 CP. SUV premium cu tractiune integrala, piele, LED, navigatie. Raport pret-dotari excelent. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['quattro', 'V6 TDI', 'Virtual Cockpit', 'LED', 'Piele', 'Navigatie MMI', 'Camera marsarier', 'ACC', 'Senzori parcare', 'Clima automata']), images: JSON.stringify(["/cars/car_29.jpg", "/cars/car_29_2.jpg", "/cars/car_29_3.jpg", "/cars/car_29_4.jpg", "/cars/car_29_5.jpg", "/cars/car_29_6.jpg", "/cars/car_29_7.jpg", "/cars/car_29_8.jpg", "/cars/car_29_9.jpg", "/cars/car_29_10.jpg", "/cars/car_29_11.jpg", "/cars/car_29_12.jpg", "/cars/car_29_13.jpg", "/cars/car_29_14.jpg", "/cars/car_29_15.jpg"]), featured: 0, dealer: 'Altergott Automobile' },
    { brand: 'BMW', model: '420', version: 'Gran Coupe xDrive M Sport', year: 2022, price: 28300, mileage: 225000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 Turbo', horsepower: 190, drivetrain: 'xDrive (4x4)', body_type: 'Coupe', color: 'Alb Metalic', location: 'Import Germania', description: 'BMW 420 Gran Coupe xDrive M Sport — coupe cu 4 usi, pachet M Sport, tractiune integrala. Motor diesel de 190 CP, design sportiv agresiv. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['xDrive', 'M Sport', 'Gran Coupe', 'Piele', 'LED Adaptive', 'Navigatie', 'Camera marsarier', 'ACC', 'Keyless Entry', 'Harman Kardon']), images: JSON.stringify(["/cars/car_30.jpg", "/cars/car_30_2.jpg", "/cars/car_30_3.jpg", "/cars/car_30_4.jpg", "/cars/car_30_5.jpg", "/cars/car_30_6.jpg", "/cars/car_30_7.jpg", "/cars/car_30_8.jpg", "/cars/car_30_9.jpg", "/cars/car_30_10.jpg", "/cars/car_30_11.jpg", "/cars/car_30_12.jpg", "/cars/car_30_13.jpg", "/cars/car_30_14.jpg", "/cars/car_30_15.jpg", "/cars/car_30_16.jpg", "/cars/car_30_17.jpg", "/cars/car_30_18.jpg", "/cars/car_30_19.jpg", "/cars/car_30_20.jpg"]), featured: 0, dealer: 'Altergott Automobile' },
    // === MC AUTOMOBILE (Heidelberg, Germania) ===
    { brand: 'Volkswagen', model: 'Golf VIII', version: '2.0 TDI DSG Life', year: 2020, price: 18565, mileage: 117000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 TDI', horsepower: 150, drivetrain: 'Fata (FWD)', body_type: 'Hatchback', color: 'Gri', location: 'Import Germania', description: 'Volkswagen Golf 8 Life cu motor 2.0 TDI de 150 CP si cutie DSG. Generatia cea mai noua, dotari complete, LED, navigatie, Virtual Cockpit. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Pachet Life', 'DSG', 'LED', 'Navigatie', 'Virtual Cockpit', 'ACC', 'Senzori parcare', 'Clima automata', 'Apple CarPlay', 'Lane Assist']), images: JSON.stringify(["/cars/car_31.jpg", "/cars/car_31_2.jpg", "/cars/car_31_3.jpg", "/cars/car_31_4.jpg", "/cars/car_31_5.jpg", "/cars/car_31_6.jpg", "/cars/car_31_7.jpg", "/cars/car_31_8.jpg", "/cars/car_31_9.jpg", "/cars/car_31_10.jpg"]), featured: 0, dealer: 'MC Automobile', deal_type: 'weekly_deal' },
    { brand: 'Volkswagen', model: 'Golf VIII', version: '2.0 TDI DSG Life', year: 2021, price: 19517, mileage: 97400, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 TDI', horsepower: 150, drivetrain: 'Fata (FWD)', body_type: 'Hatchback', color: 'Alb', location: 'Import Germania', description: 'Volkswagen Golf 8 Life model 2021 cu doar 97.400 km. Motor 2.0 TDI de 150 CP, cutie DSG, Virtual Cockpit. Kilometraj redus! Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Pachet Life', 'DSG', 'Virtual Cockpit', 'LED', 'Navigatie', 'ACC', 'Senzori parcare', 'Clima automata', 'Camera marsarier', 'Lane Assist']), images: JSON.stringify(["/cars/car_32.jpg", "/cars/car_32_2.jpg", "/cars/car_32_3.jpg", "/cars/car_32_4.jpg", "/cars/car_32_5.jpg", "/cars/car_32_6.jpg", "/cars/car_32_7.jpg", "/cars/car_32_8.jpg", "/cars/car_32_9.jpg", "/cars/car_32_10.jpg", "/cars/car_32_11.jpg", "/cars/car_32_12.jpg", "/cars/car_32_13.jpg", "/cars/car_32_14.jpg", "/cars/car_32_15.jpg", "/cars/car_32_16.jpg", "/cars/car_32_17.jpg"]), featured: 0, dealer: 'MC Automobile' },
    { brand: 'BMW', model: 'M4', version: 'Cabrio', year: 2015, price: 40000, mileage: 127500, fuel: 'Benzina', transmission: 'Automata', engine: '3.0L I6 Twin-Turbo', horsepower: 431, drivetrain: 'Spate (RWD)', body_type: 'Cabrio', color: 'Alb', location: 'Import Germania', description: 'BMW M4 Cabrio cu motor biturbo de 431 CP! Masina sport decapotabila cu performante de top. Experienta de condus unica, sunet M caracteristic. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['M Power', 'Cabrio', 'Twin-Turbo', 'Piele Merino', 'Harman Kardon', 'Head-Up Display', 'Navigatie Professional', 'LED Adaptive', 'M Sport Exhaust', 'Launch Control']), images: JSON.stringify(["/cars/car_33.jpg", "/cars/car_33_2.jpg", "/cars/car_33_3.jpg", "/cars/car_33_4.jpg", "/cars/car_33_5.jpg", "/cars/car_33_6.jpg", "/cars/car_33_7.jpg", "/cars/car_33_8.jpg", "/cars/car_33_9.jpg", "/cars/car_33_10.jpg", "/cars/car_33_11.jpg", "/cars/car_33_12.jpg", "/cars/car_33_13.jpg", "/cars/car_33_14.jpg", "/cars/car_33_15.jpg", "/cars/car_33_16.jpg", "/cars/car_33_17.jpg", "/cars/car_33_18.jpg", "/cars/car_33_19.jpg", "/cars/car_33_20.jpg"]), featured: 1, dealer: 'MC Automobile' },
    { brand: 'BMW', model: '320 d', version: 'Facelift Automata', year: 2022, price: 26181, mileage: 96800, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 Turbo', horsepower: 190, drivetrain: 'Spate (RWD)', body_type: 'Sedan', color: 'Negru', location: 'Import Germania', description: 'BMW 320d Facelift cu Live Cockpit Professional. Motor diesel de 190 CP, kilometraj redus sub 100.000 km. Dotari complete, design actualizat. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Facelift', 'Live Cockpit Professional', 'LED', 'Navigatie', 'Piele', 'Camera marsarier', 'ACC', 'Senzori parcare', 'Keyless Entry', 'Pilot automat']), images: JSON.stringify(["/cars/car_34.jpg", "/cars/car_34_2.jpg", "/cars/car_34_3.jpg", "/cars/car_34_4.jpg", "/cars/car_34_5.jpg", "/cars/car_34_6.jpg", "/cars/car_34_7.jpg", "/cars/car_34_8.jpg", "/cars/car_34_9.jpg", "/cars/car_34_10.jpg", "/cars/car_34_11.jpg", "/cars/car_34_12.jpg", "/cars/car_34_13.jpg", "/cars/car_34_14.jpg", "/cars/car_34_15.jpg", "/cars/car_34_16.jpg", "/cars/car_34_17.jpg"]), featured: 0, dealer: 'MC Automobile' },
    { brand: 'BMW', model: '120 d', version: 'Advantage Automata', year: 2023, price: 19517, mileage: 102000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 Turbo', horsepower: 190, drivetrain: 'Fata (FWD)', body_type: 'Hatchback', color: 'Gri', location: 'Import Germania', description: 'BMW 120d Advantage model 2023 cu motor diesel de 190 CP. Live Cockpit, LED, dotari complete. Hatchback premium la pret accesibil. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Pachet Advantage', 'Live Cockpit', 'LED', 'Navigatie', 'Camera marsarier', 'ACC', 'Senzori parcare', 'Clima automata', 'Keyless Entry', 'Start/Stop']), images: JSON.stringify(["/cars/car_36.jpg", "/cars/car_36_2.jpg", "/cars/car_36_3.jpg", "/cars/car_36_4.jpg", "/cars/car_36_5.jpg", "/cars/car_36_6.jpg", "/cars/car_36_7.jpg", "/cars/car_36_8.jpg"]), featured: 0, dealer: 'MC Automobile' },
    { brand: 'Mercedes-Benz', model: 'C 220 d', version: 'AMG Styling', year: 2023, price: 31060, mileage: 118000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 Turbo', horsepower: 197, drivetrain: 'Spate (RWD)', body_type: 'Sedan', color: 'Negru', location: 'Import Germania', description: 'Mercedes-Benz C 220d cu pachet AMG Styling, Head-Up Display, LED. Motor diesel de 197 CP, model 2023. Premium la superlativ. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['AMG Styling', 'Head-Up Display', 'LED', 'MBUX', 'Piele', 'Camera marsarier', 'Navigatie', 'ACC', 'Clima automata', 'Keyless-Go']), images: JSON.stringify(["/cars/car_37.jpg", "/cars/car_37_2.jpg", "/cars/car_37_3.jpg", "/cars/car_37_4.jpg", "/cars/car_37_5.jpg", "/cars/car_37_6.jpg", "/cars/car_37_7.jpg", "/cars/car_37_8.jpg", "/cars/car_37_9.jpg", "/cars/car_37_10.jpg", "/cars/car_37_11.jpg", "/cars/car_37_12.jpg", "/cars/car_37_13.jpg", "/cars/car_37_14.jpg", "/cars/car_37_15.jpg", "/cars/car_37_16.jpg", "/cars/car_37_17.jpg", "/cars/car_37_18.jpg"]), featured: 1, dealer: 'MC Automobile' },
    { brand: 'Audi', model: 'Q3 Sportback', version: '35 TDI S line', year: 2020, price: 23801, mileage: 150000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 TDI', horsepower: 150, drivetrain: 'Fata (FWD)', body_type: 'SUV Coupe', color: 'Negru', location: 'Import Germania', description: 'Audi Q3 Sportback S line cu motor 2.0 TDI de 150 CP. Design coupe sportiv, pachet S line, dotari complete. SUV compact cu stil. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['S line', 'Sportback', 'Virtual Cockpit', 'LED', 'Navigatie MMI', 'Camera marsarier', 'ACC', 'Senzori parcare', 'Clima automata', 'Piele sport']), images: JSON.stringify(["/cars/car_38.jpg", "/cars/car_38_2.jpg", "/cars/car_38_3.jpg", "/cars/car_38_4.jpg", "/cars/car_38_5.jpg", "/cars/car_38_6.jpg", "/cars/car_38_7.jpg", "/cars/car_38_8.jpg"]), featured: 0, dealer: 'MC Automobile' },
    { brand: 'Volkswagen', model: 'Tiguan', version: 'Elegance 2.0 TDI DSG', year: 2022, price: 21778, mileage: 144700, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 TDI', horsepower: 150, drivetrain: 'Fata (FWD)', body_type: 'SUV', color: 'Gri', location: 'Import Germania', description: 'Volkswagen Tiguan Elegance cu motor 2.0 TDI de 150 CP si cutie DSG. Pachet Elegance cu Matrix LED, navigatie, dotari premium. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Pachet Elegance', 'DSG', 'Matrix LED', 'Navigatie', 'Camera marsarier', 'ACC', 'Senzori parcare', 'Digital Cockpit', 'Clima automata', 'Lane Assist']), images: JSON.stringify(["/cars/car_39.jpg", "/cars/car_39_2.jpg", "/cars/car_39_3.jpg", "/cars/car_39_4.jpg", "/cars/car_39_5.jpg", "/cars/car_39_6.jpg", "/cars/car_39_7.jpg", "/cars/car_39_8.jpg"]), featured: 0, dealer: 'MC Automobile' },
    { brand: 'Volkswagen', model: 'Tiguan', version: 'R-Line 2.0 TDI DSG', year: 2022, price: 24277, mileage: 145000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 TDI', horsepower: 150, drivetrain: 'Fata (FWD)', body_type: 'SUV', color: 'Negru', location: 'Import Germania', description: 'Volkswagen Tiguan R-Line cu motor 2.0 TDI de 150 CP si cutie DSG. Design sportiv R-Line, jante 19 inch, Virtual Cockpit. Look agresiv si premium. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['R-Line', 'DSG', 'Jante 19"', 'Virtual Cockpit', 'LED', 'Navigatie', 'Camera marsarier', 'ACC', 'Senzori parcare', 'Clima automata']), images: JSON.stringify(["/cars/car_41.jpg", "/cars/car_41_2.jpg", "/cars/car_41_3.jpg", "/cars/car_41_4.jpg", "/cars/car_41_5.jpg", "/cars/car_41_6.jpg", "/cars/car_41_7.jpg", "/cars/car_41_8.jpg", "/cars/car_41_9.jpg"]), featured: 0, dealer: 'MC Automobile' },
    { brand: 'Mercedes-Benz', model: 'C 200 d', version: 'AMG Line', year: 2022, price: 30465, mileage: 138000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 Turbo', horsepower: 163, drivetrain: 'Spate (RWD)', body_type: 'Sedan', color: 'Alb', location: 'Import Germania', description: 'Mercedes-Benz C 200d AMG Line cu motor diesel de 163 CP. Design AMG sportiv, LED, navigatie, camera, interior premium. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['AMG Line', 'LED', 'MBUX', 'Navigatie', 'Piele', 'Camera marsarier', 'ACC', 'Senzori parcare', 'Clima automata', 'Keyless-Go']), images: JSON.stringify(["/cars/car_42.jpg", "/cars/car_42_2.jpg", "/cars/car_42_3.jpg", "/cars/car_42_4.jpg", "/cars/car_42_5.jpg", "/cars/car_42_6.jpg", "/cars/car_42_7.jpg", "/cars/car_42_8.jpg", "/cars/car_42_9.jpg", "/cars/car_42_10.jpg"]), featured: 0, dealer: 'MC Automobile' },
    { brand: 'Volkswagen', model: 'T-Roc', version: '2.0 TDI DSG Style 4Motion', year: 2023, price: 20231, mileage: 134000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 TDI', horsepower: 150, drivetrain: '4Motion (4x4)', body_type: 'SUV', color: 'Gri', location: 'Import Germania', description: 'Volkswagen T-Roc Style cu motor 2.0 TDI de 150 CP, cutie DSG si tractiune 4Motion. Model 2023, Matrix LED. SUV compact performant. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['4Motion', 'Pachet Style', 'DSG', 'Matrix LED', 'Navigatie', 'Camera marsarier', 'ACC', 'Senzori parcare', 'Digital Cockpit', 'Clima automata']), images: JSON.stringify(["/cars/car_43.jpg", "/cars/car_43_2.jpg", "/cars/car_43_3.jpg", "/cars/car_43_4.jpg", "/cars/car_43_5.jpg", "/cars/car_43_6.jpg", "/cars/car_43_7.jpg", "/cars/car_43_8.jpg"]), featured: 0, dealer: 'MC Automobile' },
    { brand: 'Volkswagen', model: 'Tiguan', version: 'Elegance 2.0 TDI DSG 4Motion', year: 2023, price: 24515, mileage: 146000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 TDI', horsepower: 200, drivetrain: '4Motion (4x4)', body_type: 'SUV', color: 'Alb', location: 'Import Germania', description: 'Volkswagen Tiguan Elegance 4Motion cu motor 2.0 TDI de 200 CP. Model 2023, tractiune integrala, Matrix LED. Cel mai complet Tiguan. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['4Motion', 'Pachet Elegance', 'DSG', 'Matrix LED', 'Navigatie', 'Camera marsarier', 'ACC', 'Digital Cockpit', 'Clima automata', 'Lane Assist']), images: JSON.stringify(["/cars/car_46.jpg", "/cars/car_46_2.jpg", "/cars/car_46_3.jpg", "/cars/car_46_4.jpg", "/cars/car_46_5.jpg", "/cars/car_46_6.jpg", "/cars/car_46_7.jpg", "/cars/car_46_8.jpg", "/cars/car_46_9.jpg", "/cars/car_46_10.jpg", "/cars/car_46_11.jpg", "/cars/car_46_12.jpg", "/cars/car_46_13.jpg"]), featured: 0, dealer: 'MC Automobile' },
    { brand: 'Audi', model: 'Q5', version: '40 TDI quattro', year: 2021, price: 22968, mileage: 156000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 TDI', horsepower: 204, drivetrain: 'quattro (4x4)', body_type: 'SUV', color: 'Gri', location: 'Import Germania', description: 'Audi Q5 40 TDI quattro cu motor de 204 CP si tractiune integrala. Virtual Cockpit, LED, dotari complete. SUV premium la pret atractiv. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['quattro', 'Virtual Cockpit', 'LED', 'Navigatie MMI', 'Camera marsarier', 'ACC', 'Senzori parcare', 'Clima automata', 'Piele', 'Lane Assist']), images: JSON.stringify(["/cars/car_47.jpg", "/cars/car_47_2.jpg", "/cars/car_47_3.jpg", "/cars/car_47_4.jpg", "/cars/car_47_5.jpg", "/cars/car_47_6.jpg", "/cars/car_47_7.jpg", "/cars/car_47_8.jpg", "/cars/car_47_9.jpg"]), featured: 0, dealer: 'MC Automobile' },
    { brand: 'Volkswagen', model: 'Passat', version: '2.0 TDI DSG Business', year: 2020, price: 17970, mileage: 163000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 TDI', horsepower: 150, drivetrain: 'Fata (FWD)', body_type: 'Sedan', color: 'Gri', location: 'Import Germania', description: 'Volkswagen Passat Business cu motor 2.0 TDI de 150 CP si cutie DSG. Sedan de clasa business, LED, navigatie, dotari complete. Consum excelent. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Pachet Business', 'DSG', 'LED', 'Navigatie Discover', 'Camera marsarier', 'ACC', 'Senzori parcare', 'Clima automata', 'Digital Cockpit', 'Apple CarPlay']), images: JSON.stringify(["/cars/car_48.jpg", "/cars/car_48_2.jpg", "/cars/car_48_3.jpg", "/cars/car_48_4.jpg", "/cars/car_48_5.jpg", "/cars/car_48_6.jpg", "/cars/car_48_7.jpg"]), featured: 0, dealer: 'MC Automobile' },
    { brand: 'Citroen', model: 'Grand C4 Spacetourer', version: 'Shine Pack 2.0D', year: 2020, price: 16000, mileage: 117441, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 BlueHDi', horsepower: 163, drivetrain: 'Fata (FWD)', body_type: 'Monovolum', color: 'Gri', location: 'Import Germania', description: 'Citroen Grand C4 Spacetourer Shine Pack cu motor 2.0 diesel de 163 CP si transmisie automata. Monovolum spatios cu 7 locuri, confort exceptional. Ideal pentru familie. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['7 locuri', 'Shine Pack', 'Transmisie automata', 'LED', 'Navigatie', 'Camera marsarier', 'Senzori parcare', 'Clima automata', 'Panoramic', 'Apple CarPlay']), images: JSON.stringify(["/cars/car_49.jpg", "/cars/car_49_2.jpg", "/cars/car_49_3.jpg", "/cars/car_49_4.jpg", "/cars/car_49_5.jpg", "/cars/car_49_6.jpg", "/cars/car_49_7.jpg", "/cars/car_49_8.jpg", "/cars/car_49_9.jpg", "/cars/car_49_10.jpg", "/cars/car_49_11.jpg", "/cars/car_49_12.jpg", "/cars/car_49_13.jpg", "/cars/car_49_14.jpg", "/cars/car_49_15.jpg", "/cars/car_49_16.jpg", "/cars/car_49_17.jpg", "/cars/car_49_18.jpg", "/cars/car_49_19.jpg", "/cars/car_49_20.jpg", "/cars/car_49_21.jpg", "/cars/car_49_22.jpg", "/cars/car_49_23.jpg", "/cars/car_49_24.jpg", "/cars/car_49_25.jpg"]), featured: 0, dealer: 'MC Automobile' },
    { brand: 'Mercedes-Benz', model: 'C 200 d', version: 'Avantgarde', year: 2022, price: 25586, mileage: 160000, fuel: 'Diesel', transmission: 'Automata', engine: '2.0L I4 Turbo', horsepower: 163, drivetrain: 'Spate (RWD)', body_type: 'Sedan', color: 'Gri', location: 'Import Germania', description: 'Mercedes-Benz C 200d Avantgarde cu LED, Head-Up Display. Motor diesel de 163 CP, model 2022. Interior premium, dotari complete. Disponibil la comanda cu avans 30%, leasing si finantare.', features: JSON.stringify(['Avantgarde', 'LED', 'Head-Up Display', 'MBUX', 'Navigatie', 'Camera marsarier', 'ACC', 'Senzori parcare', 'Clima automata', 'Piele']), images: JSON.stringify(["/cars/car_50.jpg", "/cars/car_50_2.jpg", "/cars/car_50_3.jpg", "/cars/car_50_4.jpg", "/cars/car_50_5.jpg", "/cars/car_50_6.jpg", "/cars/car_50_7.jpg", "/cars/car_50_8.jpg", "/cars/car_50_9.jpg", "/cars/car_50_10.jpg", "/cars/car_50_11.jpg", "/cars/car_50_12.jpg", "/cars/car_50_13.jpg"]), featured: 0, dealer: 'MC Automobile' },
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
    phone: '0742 902 242',
    whatsapp: '40742902242',
    email: 'contact@autovizibil.ro',
    address: 'Bucuresti, Romania',
    program: 'Luni - Vineri: 09:00 - 18:00 | Sambata: 10:00 - 14:00 | Duminica: Inchis',
    instagram: '',
    tiktok: '',
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
