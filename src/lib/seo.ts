import type { Metadata } from 'next'

import { routing, type Locale } from '@/i18n/routing'

export const SITE_NAME = 'Shah Washing'

// One env var swaps the canonical domain later. On Vercel,
// VERCEL_PROJECT_PRODUCTION_URL is the stable production hostname (no protocol);
// locally we fall back to localhost so absolute URLs still resolve in dev.
export function getBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`

  return 'http://localhost:3000'
}

// next-intl prefixes every route with its locale. Build the path for a locale,
// collapsing the home route so we get `/en` rather than `/en/`.
export function localePath(locale: Locale, path: string): string {
  const suffix = path === '/' ? '' : path
  return `/${locale}${suffix}`
}

// Open Graph wants a BCP-47-ish locale; map our two codes to their regions.
function ogLocale(locale: Locale): string {
  return locale === 'ne' ? 'ne_NP' : 'en_US'
}

type PageMetaArgs = {
  locale: Locale
  /** Route without the locale prefix, e.g. '/' or '/rugs' */
  path: string
  title: string
  description?: string
  /**
   * Home page only: keep the title exactly as given instead of letting the
   * root layout's `%s — Shah Washing` template wrap it (which would duplicate
   * the brand). Off-page titles like "Rugs" become "Rugs — Shah Washing".
   */
  absoluteTitle?: boolean
}

// Shared canonical + hreflang + Open Graph/Twitter so every page is consistent.
// The file-based opengraph-image is appended to `openGraph.images` by Next, so
// it is intentionally not set here.
export function pageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle,
}: PageMetaArgs): Metadata {
  const base = getBaseUrl()
  const canonical = `${base}${localePath(locale, path)}`

  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = `${base}${localePath(l, path)}`
  }
  languages['x-default'] = `${base}${localePath(routing.defaultLocale, path)}`

  // OG ignores the title template, so mirror what the template would produce.
  const ogTitle = absoluteTitle ? title : `${title} — ${SITE_NAME}`

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      url: canonical,
      title: ogTitle,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
    },
  }
}

type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
}

// Flatten a Lexical rich-text value to a short plaintext excerpt for meta
// descriptions. Walks text nodes, separating blocks with a space.
export function richTextToPlain(data: unknown, max = 200): string {
  if (!data || typeof data !== 'object' || !('root' in data)) {
    return ''
  }
  const root = (data as { root?: LexicalNode }).root
  if (!root) {
    return ''
  }

  let out = ''
  const walk = (node: LexicalNode) => {
    if (typeof node.text === 'string') {
      out += node.text
    }
    if (Array.isArray(node.children)) {
      node.children.forEach(walk)
      if (node.type === 'paragraph' || node.type === 'heading') {
        out += ' '
      }
    }
  }
  walk(root)

  out = out.replace(/\s+/g, ' ').trim()
  return out.length > max ? `${out.slice(0, max - 1).trimEnd()}…` : out
}
