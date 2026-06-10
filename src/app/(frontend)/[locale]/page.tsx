import { getTranslations, setRequestLocale } from 'next-intl/server'

import { CarpetDivider } from '@/components/CarpetDivider'
import { MountainRidge } from '@/components/MountainRidge'
import { ProductCard } from '@/components/ProductCard'
import { RichTextContent } from '@/components/RichTextContent'
import { Link } from '@/i18n/navigation'
import { resolveLocale } from '@/i18n/locale'
import { getHomePage, getServices } from '@/lib/queries'
import type { Product } from '@/payload-types'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const locale = await resolveLocale(params)
  setRequestLocale(locale)

  const [t, home, services] = await Promise.all([
    getTranslations(),
    getHomePage(locale),
    getServices(locale),
  ])

  const featured = (home.featuredProducts ?? []).filter(
    (item): item is Product => typeof item === 'object',
  )

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden texture-weave">
        <div className="px-4 pt-16 pb-24 sm:px-6 lg:pt-24 lg:pb-32 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[7fr_5fr]">
          <div>
            {home.heroEyebrow && (
              <p className="animate-rise mb-4 text-sm font-semibold uppercase tracking-widest text-marigold">
                {home.heroEyebrow}
              </p>
            )}
            <h1 className="animate-rise delay-1 max-w-2xl font-display text-5xl font-semibold leading-tight text-ink sm:text-6xl lg:text-7xl">
              {home.heroHeading}
            </h1>
            {home.heroSub && (
              <p className="animate-rise delay-2 mt-6 max-w-xl text-lg text-ink-soft">
                {home.heroSub}
              </p>
            )}
            <div className="animate-rise delay-3 mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/rugs"
                className="px-7 py-3.5 inline-flex items-center rounded-full bg-crimson font-semibold text-snow shadow-lg shadow-crimson/25 transition-all hover:bg-crimson-deep hover:shadow-crimson/40"
              >
                {t('home.browseRugs')}
              </Link>
              <Link
                href="/services/custom-orders"
                className="px-7 py-3.5 inline-flex items-center rounded-full border border-line bg-surface font-semibold text-ink transition-colors hover:border-crimson hover:text-crimson"
              >
                {t('home.ctaButton')}
              </Link>
            </div>
          </div>

          <HeroRug />
        </div>

        <MountainRidge className="absolute inset-x-0 bottom-0 h-12 w-full text-indigo/10 dark:text-indigo/15" />
      </section>

      {/* Services */}
      <section className="px-4 py-20 sm:px-6 mx-auto max-w-6xl">
        <SectionHeading heading={t('home.servicesHeading')} sub={t('home.servicesSub')} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group p-7 relative overflow-hidden rounded-lg border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-crimson/40 hover:shadow-xl"
            >
              <span className="font-display text-5xl font-semibold text-line transition-colors group-hover:text-marigold">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold text-ink transition-colors group-hover:text-crimson">
                {service.title}
              </h3>
              <p className="mt-2.5 text-ink-soft">{service.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <CarpetDivider className="px-4 sm:px-6 mx-auto max-w-6xl" />

      {/* Featured rugs */}
      {featured.length > 0 && (
        <section className="px-4 py-20 sm:px-6 mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading heading={t('home.featuredHeading')} sub={t('home.featuredSub')} />
            <Link
              href="/rugs"
              className="font-semibold text-crimson transition-colors hover:text-crimson-deep"
            >
              {t('common.viewAll')} →
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Story band */}
      {home.storyBody && (
        <section className="border-y border-line bg-surface texture-weave">
          <div className="px-4 py-20 sm:px-6 mx-auto grid max-w-6xl gap-10 lg:grid-cols-[2fr_3fr]">
            <h2 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              {home.storyHeading}
            </h2>
            <RichTextContent data={home.storyBody} className="text-lg" />
          </div>
        </section>
      )}

      {/* Custom-order CTA */}
      <section className="px-4 py-20 sm:px-6 mx-auto max-w-6xl">
        <div className="px-8 py-14 sm:px-14 relative overflow-hidden rounded-xl bg-crimson text-center">
          <MountainRidge className="absolute inset-x-0 bottom-0 h-16 w-full text-crimson-deep/60" />
          <div className="relative">
            <h2 className="font-display text-4xl font-semibold text-snow sm:text-5xl">
              {t('home.ctaHeading')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-snow/85">{t('home.ctaBody')}</p>
            <Link
              href="/services/custom-orders"
              className="px-8 py-3.5 mt-8 inline-flex items-center rounded-full bg-snow font-semibold text-crimson transition-transform hover:scale-105"
            >
              {t('home.ctaButton')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function SectionHeading({ heading, sub }: { heading: string; sub?: string }) {
  return (
    <div>
      <h2 className="font-display text-4xl font-semibold text-ink">{heading}</h2>
      {sub && <p className="mt-2 max-w-xl text-ink-soft">{sub}</p>}
    </div>
  )
}

// A stylized hand-knotted rug, drawn with nested khaden borders — the visual
// signature of the hero. Pure SVG so it's crisp in both themes.
function HeroRug() {
  return (
    <div className="animate-rise delay-2 relative mx-auto w-full max-w-sm lg:max-w-none" aria-hidden>
      <svg viewBox="0 0 360 460" className="w-full drop-shadow-2xl">
        {/* field */}
        <rect width="360" height="460" rx="10" className="fill-indigo dark:fill-indigo-deep" />
        {/* outer khaden border */}
        <rect x="14" y="14" width="332" height="432" rx="6" fill="none" className="stroke-marigold" strokeWidth="3" />
        <rect x="26" y="26" width="308" height="408" rx="4" fill="none" className="stroke-crimson" strokeWidth="6" strokeDasharray="14 8" />
        <rect x="40" y="40" width="280" height="380" rx="3" fill="none" className="stroke-snow/40" strokeWidth="1.5" />
        {/* central medallion: nested diamonds */}
        <g transform="translate(180 230)">
          <path d="M0 -150 L110 0 L0 150 L-110 0 Z" className="fill-crimson/90" />
          <path d="M0 -118 L86 0 L0 118 L-86 0 Z" fill="none" className="stroke-marigold" strokeWidth="3" />
          <path d="M0 -88 L64 0 L0 88 L-64 0 Z" className="fill-snow/95 dark:fill-snow/85" />
          <path d="M0 -58 L42 0 L0 58 L-42 0 Z" className="fill-marigold" />
          <path d="M0 -30 L22 0 L0 30 L-22 0 Z" className="fill-crimson-deep" />
          <circle r="6" className="fill-snow" />
        </g>
        {/* corner motifs */}
        {[
          'translate(70 80)',
          'translate(290 80) scale(-1 1)',
          'translate(70 380) scale(1 -1)',
          'translate(290 380) scale(-1 -1)',
        ].map((transform) => (
          <g key={transform} transform={transform}>
            <path d="M0 0 L26 0 L26 5 L5 5 L5 26 L0 26 Z" className="fill-marigold/90" />
            <path d="M12 12 L30 12 L30 16 L16 16 L16 30 L12 30 Z" className="fill-snow/50" />
          </g>
        ))}
        {/* fringe */}
        {Array.from({ length: 18 }, (_, i) => 24 + i * 18).map((x) => (
          <g key={x} className="stroke-ink-soft/70" strokeWidth="2">
            <line x1={x} y1="460" x2={x} y2="472" />
            <line x1={x} y1="0" x2={x} y2="-12" />
          </g>
        ))}
      </svg>
    </div>
  )
}
