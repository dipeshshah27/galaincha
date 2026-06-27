import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { getProducts, getServices } from '@/lib/queries'
import { getBaseUrl, localePath } from '@/lib/seo'

type Entry = {
  path: string
  lastModified?: string | Date
  changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency']
  priority?: number
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl()

  // Slugs are not localized, so one fetch covers both locales.
  const [products, services] = await Promise.all([getProducts('en'), getServices('en')])

  const entries: Entry[] = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/rugs', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
    ...services.map((service) => ({
      path: `/services/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      path: `/rugs/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return entries.map(({ path, lastModified, changeFrequency, priority }) => {
    const languages: Record<string, string> = {}
    for (const locale of routing.locales) {
      languages[locale] = `${base}${localePath(locale, path)}`
    }

    return {
      url: `${base}${localePath(routing.defaultLocale, path)}`,
      lastModified: lastModified ?? new Date(),
      changeFrequency,
      priority,
      alternates: { languages },
    }
  })
}
