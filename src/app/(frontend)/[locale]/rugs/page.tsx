import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { CarpetDivider } from '@/components/CarpetDivider'
import { ProductCard } from '@/components/ProductCard'
import { Link } from '@/i18n/navigation'
import { resolveLocale } from '@/i18n/locale'
import { cn } from '@/lib/cn'
import { getCategories, getProducts } from '@/lib/queries'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const t = await getTranslations({ locale, namespace: 'meta.rugs' })
  return { title: t('title'), description: t('description') }
}

export default async function RugsPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params)
  setRequestLocale(locale)
  const { category } = await searchParams

  const [t, categories, products] = await Promise.all([
    getTranslations(),
    getCategories(locale),
    getProducts(locale, category),
  ])

  return (
    <div className="px-4 py-16 sm:px-6 mx-auto max-w-6xl">
      <h1 className="font-display text-5xl font-semibold text-ink">{t('catalog.title')}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-soft">{t('catalog.intro')}</p>

      <CarpetDivider className="my-10" />

      <nav className="flex flex-wrap items-center gap-2.5" aria-label={t('catalog.title')}>
        <FilterChip href="/rugs" active={!category}>
          {t('catalog.all')}
        </FilterChip>
        {categories.map((cat) => (
          <FilterChip
            key={cat.id}
            href={`/rugs?category=${cat.slug}`}
            active={category === cat.slug}
          >
            {cat.name}
          </FilterChip>
        ))}
      </nav>

      {products.length === 0 ? (
        <p className="py-24 text-center text-lg text-ink-soft">{t('catalog.empty')}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        'px-4 py-1.5 rounded-full border text-sm font-medium transition-colors',
        active
          ? 'border-crimson bg-crimson text-snow'
          : 'border-line bg-surface text-ink-soft hover:border-crimson hover:text-crimson',
      )}
    >
      {children}
    </Link>
  )
}
