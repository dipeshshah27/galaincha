import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { Link } from '@/i18n/navigation'
import { asMedia } from '@/lib/media'
import type { Product } from '@/payload-types'

type Props = {
  product: Product
}

// Universal component: useTranslations works in Server Components and in the
// client RugsExplorer grid alike.
export function ProductCard({ product }: Props) {
  const t = useTranslations()
  const cover = asMedia(product.images?.[0])

  return (
    <Link
      href={`/rugs/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-crimson/40 hover:shadow-xl"
    >
      <div className="relative aspect-4/5 overflow-hidden">
        {cover?.url && (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {product.knotCount && (
          <span className="px-2.5 py-1 absolute bottom-3 left-3 rounded-full bg-night/75 text-xs font-medium text-snow backdrop-blur-sm">
            {t('catalog.knotsPerInch', { count: product.knotCount })}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-crimson">
          {product.name}
        </h3>
        <div className="mt-1 flex items-baseline justify-between gap-2 text-sm text-ink-soft">
          {product.material && <span>{t(`materials.${product.material}`)}</span>}
          {product.size && <span>{product.size}</span>}
        </div>
        {product.priceRange && (
          <p className="mt-2 text-sm font-semibold text-marigold">{product.priceRange}</p>
        )}
      </div>
    </Link>
  )
}
