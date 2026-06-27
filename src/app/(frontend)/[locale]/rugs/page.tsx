import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { RugsExplorer } from '@/components/RugsExplorer'
import { AnimatedDivider } from '@/components/motion/AnimatedDivider'
import { resolveLocale } from '@/i18n/locale'
import { getCategories, getProducts } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const t = await getTranslations({ locale, namespace: 'meta.rugs' })
  return pageMetadata({ locale, path: '/rugs', title: t('title'), description: t('description') })
}

export default async function RugsPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params)
  setRequestLocale(locale)
  const { category } = await searchParams

  // The full catalog ships to the client so filtering and search are instant.
  const [t, categories, products] = await Promise.all([
    getTranslations(),
    getCategories(locale),
    getProducts(locale),
  ])

  return (
    <div className="px-4 py-16 sm:px-6 mx-auto max-w-6xl">
      <h1 className="animate-rise font-display text-5xl font-semibold text-ink">
        {t('catalog.title')}
      </h1>
      <p className="animate-rise delay-1 mt-3 max-w-2xl text-lg text-ink-soft">
        {t('catalog.intro')}
      </p>

      <AnimatedDivider className="my-10" />

      <RugsExplorer products={products} categories={categories} initialCategory={category ?? null} />
    </div>
  )
}
