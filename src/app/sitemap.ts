import type { MetadataRoute } from 'next';
import { ensureSeeded, getActiveCars, getAllBlogPosts } from '@/lib/db';

export default function sitemap(): MetadataRoute.Sitemap {
  ensureSeeded();
  const baseUrl = 'https://autovizibil.ro';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/masini`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/oferte`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cauta-masina`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/despre-noi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const cars = getActiveCars();
  const carPages: MetadataRoute.Sitemap = cars.map((car) => ({
    url: `${baseUrl}/masini/${car.slug}`,
    lastModified: new Date(car.updated_at || car.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const posts = getAllBlogPosts().filter((p) => p.published === 1);
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...carPages, ...blogPages];
}
