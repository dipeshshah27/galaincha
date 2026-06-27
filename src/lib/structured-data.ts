import type { JsonLdObject } from '@/components/seo/JsonLd'
import type { Locale } from '@/i18n/routing'
import { localePath, richTextToPlain, SITE_NAME } from '@/lib/seo'
import type { Product, Service, SiteSetting } from '@/payload-types'

const BUSINESS_DESCRIPTION =
  'Shah Washing is a Kathmandu carpet house — hand-knotted Himalayan rugs, custom orders, and professional carpet washing and restoration. Three generations of weaving since 1974.'

// Split the multi-line CMS address into a schema.org PostalAddress. The first
// line is the street; locality/region/country are fixed for the Kathmandu shop.
function postalAddress(raw?: string | null): JsonLdObject {
  const lines = (raw ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return {
    '@type': 'PostalAddress',
    streetAddress: lines[0] || 'Narayantar, Jorpati',
    addressLocality: 'Kathmandu',
    addressRegion: 'Bagmati',
    addressCountry: 'NP',
  }
}

// The brand entity. Drives the Google knowledge panel / local result for the
// "Shah Washing" query. Sourced from the Site Settings global.
export function businessLdJson(
  settings: SiteSetting,
  services: Service[],
  baseUrl: string,
): JsonLdObject {
  const sameAs = [settings.instagram, settings.facebook].filter(
    (value): value is string => Boolean(value),
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#business`,
    name: SITE_NAME,
    url: baseUrl,
    logo: `${baseUrl}/apple-icon.png`,
    image: `${baseUrl}/apple-icon.png`,
    description: BUSINESS_DESCRIPTION,
    telephone: settings.phone ?? undefined,
    email: settings.email ?? undefined,
    address: postalAddress(settings.address),
    areaServed: 'Nepal',
    sameAs: sameAs.length ? sameAs : undefined,
    knowsAbout: [
      'Handwoven carpets',
      'Tibetan rugs',
      'Carpet washing',
      'Carpet restoration',
      'Custom rugs',
    ],
    makesOffer: services.length
      ? services.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.title,
            description: service.summary || undefined,
          },
        }))
      : undefined,
  }
}

// Lets search engines tie pages to the brand entity.
export function websiteLdJson(baseUrl: string): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: SITE_NAME,
    url: baseUrl,
    publisher: { '@id': `${baseUrl}/#business` },
    inLanguage: ['en', 'ne'],
  }
}

export function productLdJson(
  product: Product,
  locale: Locale,
  baseUrl: string,
): JsonLdObject {
  const url = `${baseUrl}${localePath(locale, `/rugs/${product.slug}`)}`
  const images = (product.images ?? [])
    .map((image) => (typeof image === 'object' && image.url ? image.url : null))
    .filter((value): value is string => Boolean(value))
    // schema.org wants absolute image URLs; media URLs can be relative in dev.
    .map((src) => (src.startsWith('http') ? src : `${baseUrl}${src}`))

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    url,
    image: images.length ? images : undefined,
    description: richTextToPlain(product.description) || undefined,
    brand: { '@type': 'Brand', name: SITE_NAME },
    category: typeof product.category === 'object' ? product.category?.name : undefined,
    material: product.material ?? undefined,
  }
}

export function serviceLdJson(
  service: Service,
  locale: Locale,
  baseUrl: string,
): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    url: `${baseUrl}${localePath(locale, `/services/${service.slug}`)}`,
    description: service.summary || richTextToPlain(service.body) || undefined,
    provider: { '@id': `${baseUrl}/#business` },
    areaServed: 'Nepal',
  }
}

// A breadcrumb trail improves how the URL is shown in results.
export function breadcrumbLdJson(
  items: { name: string; path: string }[],
  locale: Locale,
  baseUrl: string,
): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${localePath(locale, item.path)}`,
    })),
  }
}
