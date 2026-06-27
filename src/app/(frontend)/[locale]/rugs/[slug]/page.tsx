import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { CarpetDivider } from '@/components/CarpetDivider'
import { InquiryForm } from '@/components/InquiryForm'
import { ProductGallery, type GalleryImage } from '@/components/ProductGallery'
import { RichTextContent } from '@/components/RichTextContent'
import { JsonLd } from '@/components/seo/JsonLd'
import { Reveal } from '@/components/motion/Reveal'
import { Link } from '@/i18n/navigation'
import { resolveLocale } from '@/i18n/locale'
import { asMedia } from '@/lib/media'
import { getProductBySlug } from '@/lib/queries'
import { getBaseUrl, pageMetadata, richTextToPlain } from '@/lib/seo'
import { breadcrumbLdJson, productLdJson } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const { slug } = await params
  const product = await getProductBySlug(locale, slug)
  if (!product) {
    return {}
  }
  const description =
    richTextToPlain(product.description) ||
    [product.size, product.priceRange].filter(Boolean).join(' · ') ||
    undefined
  return pageMetadata({ locale, path: `/rugs/${slug}`, title: product.name, description })
}

export default async function ProductPage({ params }: Props) {
  const locale = await resolveLocale(params)
  setRequestLocale(locale)
  const { slug } = await params

  const [t, product] = await Promise.all([getTranslations(), getProductBySlug(locale, slug)])

  if (!product) {
    notFound()
  }

  const images: GalleryImage[] = (product.images ?? [])
    .map(asMedia)
    .flatMap((media) =>
      media && typeof media.url === 'string'
        ? [{ id: media.id, url: media.url, alt: media.alt }]
        : [],
    )
  const category = typeof product.category === 'object' ? product.category : null

  const base = getBaseUrl()
  const breadcrumb = breadcrumbLdJson(
    [
      { name: t('nav.home'), path: '/' },
      { name: t('nav.rugs'), path: '/rugs' },
      { name: product.name, path: `/rugs/${product.slug}` },
    ],
    locale,
    base,
  )

  return (
    <div className="px-4 py-16 sm:px-6 mx-auto max-w-6xl">
      <JsonLd data={[productLdJson(product, locale, base), breadcrumb]} />
      <Link
        href="/rugs"
        className="text-sm font-medium text-ink-soft transition-colors hover:text-crimson"
      >
        ← {t('product.backToRugs')}
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="animate-rise">
          <ProductGallery images={images} />
        </div>

        {/* Details */}
        <div className="animate-rise delay-1">
          {category && (
            <p className="text-sm font-semibold uppercase tracking-widest text-marigold">
              {category.name}
            </p>
          )}
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
            {product.name}
          </h1>
          {product.priceRange && (
            <p className="mt-4 text-2xl font-semibold text-crimson">{product.priceRange}</p>
          )}

          <CarpetDivider className="my-8" />

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
            {product.size && <Spec label={t('product.size')} value={product.size} />}
            {product.material && (
              <Spec label={t('product.material')} value={t(`materials.${product.material}`)} />
            )}
            {product.knotCount && (
              <Spec
                label={t('product.knotDensity')}
                value={t('catalog.knotsPerInch', { count: product.knotCount })}
              />
            )}
          </dl>

          {product.description && (
            <RichTextContent data={product.description} className="mt-8" />
          )}
        </div>
      </div>

      <Reveal className="mx-auto mt-20 max-w-2xl">
        <InquiryForm
          type="purchase"
          productId={product.id}
          heading={t('product.enquireHeading')}
          sub={t('product.enquireSub')}
        />
      </Reveal>
    </div>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-medium uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="mt-1 font-semibold text-ink">{value}</dd>
    </div>
  )
}
