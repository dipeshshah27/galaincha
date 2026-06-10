'use client'

import { AnimatePresence, m } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

import { ProductCard } from '@/components/ProductCard'
import { cn } from '@/lib/cn'
import type { Category, Product } from '@/payload-types'

type Props = {
  products: Product[]
  categories: Category[]
  initialCategory: string | null
}

// Client-side catalog: category chips + text search filter instantly (no
// navigation), with layout animations as the grid reflows. The category is
// mirrored into the URL so filtered views stay shareable.
export function RugsExplorer({ products, categories, initialCategory }: Props) {
  const t = useTranslations('catalog')
  const [category, setCategory] = useState<string | null>(initialCategory)
  const [query, setQuery] = useState('')

  // ≤60 products, but filtering runs on every keystroke (compiler is off)
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return products.filter((product) => {
      const slug = typeof product.category === 'object' ? product.category?.slug : null
      if (category && slug !== category) return false
      if (needle && !product.name.toLowerCase().includes(needle)) return false
      return true
    })
  }, [products, category, query])

  const selectCategory = (slug: string | null) => {
    setCategory(slug)
    const url = new URL(window.location.href)
    if (slug) {
      url.searchParams.set('category', slug)
    } else {
      url.searchParams.delete('category')
    }
    window.history.replaceState(null, '', url.toString())
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav className="flex flex-wrap items-center gap-2.5" aria-label={t('title')}>
          <FilterChip active={!category} onClick={() => selectCategory(null)}>
            {t('all')}
          </FilterChip>
          {categories.map((cat) => (
            <FilterChip
              key={cat.id}
              active={category === cat.slug}
              onClick={() => selectCategory(cat.slug)}
            >
              {cat.name}
            </FilterChip>
          ))}
        </nav>

        <label className="relative">
          <span className="sr-only">{t('searchPlaceholder')}</span>
          <svg
            aria-hidden
            className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-soft"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20.5 20.5-4.2-4.2" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('searchPlaceholder')}
            className="pl-10 pr-4 py-2 w-full rounded-full border border-line bg-surface text-sm text-ink outline-none transition-colors focus:border-crimson focus:ring-2 focus:ring-crimson/20 sm:w-64"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-24 text-center text-lg text-ink-soft"
        >
          {t('empty')}
        </m.p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((product) => (
              <m.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={product} />
              </m.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-4 py-1.5 rounded-full border text-sm font-medium transition-colors',
        active
          ? 'border-crimson bg-crimson text-snow'
          : 'border-line bg-surface text-ink-soft hover:border-crimson hover:text-crimson',
      )}
    >
      {children}
    </button>
  )
}
