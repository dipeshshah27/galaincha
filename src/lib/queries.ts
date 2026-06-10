import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Locale } from '@/i18n/routing'

// getPayload caches the initialized instance internally, so calling this
// per-request is cheap.
const client = () => getPayload({ config })

export async function getSiteSettings(locale: Locale) {
  const payload = await client()
  return payload.findGlobal({ slug: 'site-settings', locale })
}

export async function getHomePage(locale: Locale) {
  const payload = await client()
  // depth 2 so featuredProducts arrive with their images populated
  return payload.findGlobal({ slug: 'home-page', locale, depth: 2 })
}

export async function getAboutPage(locale: Locale) {
  const payload = await client()
  return payload.findGlobal({ slug: 'about-page', locale })
}

export async function getServices(locale: Locale) {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'services',
    locale,
    sort: 'order',
    limit: 10,
  })
  return docs
}

export async function getServiceBySlug(locale: Locale, slug: string) {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'services',
    locale,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getCategories(locale: Locale) {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'categories',
    locale,
    sort: 'slug',
    limit: 50,
  })
  return docs
}

export async function getProducts(locale: Locale, categorySlug?: string) {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'products',
    locale,
    where: categorySlug ? { 'category.slug': { equals: categorySlug } } : undefined,
    sort: '-createdAt',
    limit: 60,
  })
  return docs
}

export async function getProductBySlug(locale: Locale, slug: string) {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'products',
    locale,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
}
