# AutoVizibil - Plan Implementare Demo

## Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (better-sqlite3) - zero config, fisier local
- **Auth**: Simple session cookie (demo only)
- **Images**: Unsplash automotive photos via direct URLs

## Arhitectura

### Public Pages
- `/` - Homepage (hero, search, featured, how it works, social, testimonials, FAQ)
- `/masini` - Listing cu filtre si sortare
- `/masini/[slug]` - Pagina individuala masina
- `/cauta-masina` - Formular cerere masina
- `/despre-noi` - Despre AutoVizibil
- `/contact` - Contact
- `/blog` - Blog listing
- `/blog/[slug]` - Articol individual
- `/politica-confidentialitate` - Privacy
- `/termeni` - Terms

### Admin Pages
- `/admin` - Dashboard (stats, recent leads)
- `/admin/masini` - CRUD masini
- `/admin/masini/new` - Adauga masina
- `/admin/masini/[id]/edit` - Editeaza masina
- `/admin/leads` - Lead management
- `/admin/reclame` - Ad banners
- `/admin/testimoniale` - Testimonials
- `/admin/blog` - Blog CRUD
- `/admin/setari` - Settings (business info, social, homepage)
- `/admin/login` - Login page

### Database Tables
1. **settings** - key/value store for business config
2. **cars** - toate datele masinilor
3. **car_images** - imagini per masina
4. **car_features** - dotari per masina
5. **leads** - lead-uri de la formulare
6. **ads** - reclame/bannere
7. **testimonials** - testimoniale
8. **blog_posts** - articole blog

### Componente
- Header, Footer, CarCard, CarGrid, SearchBar, FilterSidebar
- CarGallery, CarSpecs, LeadForm, WhatsAppButton, PhoneButton
- FeaturedCars, AdBanner, TestimonialCard, BlogCard
- Breadcrumbs, FinancingCalculator, SocialLinks
- FloatingActions, CookieBanner, HowItWorks, FAQ

### Demo Data
- 10 masini cu date realiste
- 8 lead-uri demo
- 4 testimoniale
- 4 articole blog
- 3 reclame demo
- Settings pre-populate

### Prioritati
1. Database + seed data
2. Design system (fonts, colors, components)
3. Layout (header, footer, floating actions)
4. Homepage
5. Car listing + car page
6. Lead forms
7. Admin dashboard + CRUD
8. Blog, testimonials, ads
9. SEO, GDPR, settings
10. Final testing + build

## Ce NU se implementeaza acum
- Conturi clienti/dealeri
- Marketplace multi-vendor
- Plati online
- Import automat masini
- Notificari push
- App mobila
- CRM avansat
