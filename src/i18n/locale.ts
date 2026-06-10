import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'

import { routing, type Locale } from './routing'

// Pages can't rely on the layout having validated the segment (they render in
// parallel), so each page narrows its own `locale` param through this.
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  return locale
}
