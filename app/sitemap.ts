import type { MetadataRoute } from 'next';

const BASE = 'https://nedo-kuca.vercel.app';
const locales = ['hr', 'de', 'en'];
const pages = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/kuca', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/galerija', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/lokacija', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/book-now', priority: 0.7, changeFrequency: 'monthly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${BASE}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }
  return entries;
}
