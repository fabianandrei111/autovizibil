import { ensureSeeded, getActiveCars, getAllBlogPosts } from '@/lib/db';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  ensureSeeded();
  const cars = getActiveCars();
  const blogs = getAllBlogPosts().filter(b => b.published === 1);

  const base = 'https://autovizibil.ro';

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/masini`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/cauta-masina`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/despre-noi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ...cars.map(c => ({ url: `${base}/masini/${c.slug}`, lastModified: new Date(c.updated_at), changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...blogs.map(b => ({ url: `${base}/blog/${b.slug}`, lastModified: new Date(b.updated_at), changeFrequency: 'monthly' as const, priority: 0.5 })),
  ];
}
