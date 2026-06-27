import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { HeroRug } from '@/components/HeroRug'
import { MountainRidge } from '@/components/MountainRidge'
import { ProductCard } from '@/components/ProductCard'
import { RichTextContent } from '@/components/RichTextContent'
import { AnimatedDivider } from '@/components/motion/AnimatedDivider'
import { Reveal } from '@/components/motion/Reveal'
import { RevealStagger, RevealStaggerItem } from '@/components/motion/RevealStagger'
import { Link } from '@/i18n/navigation'
import { resolveLocale } from '@/i18n/locale'
import { getHomePage, getServices } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'
import type { Product } from '@/payload-types'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const t = await getTranslations({ locale, namespace: 'meta.home' })
  return pageMetadata({
    locale,
    path: '/',
    title: t('title'),
    description: t('description'),
    absoluteTitle: true,
  })
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
        <Reveal>
          <SectionHeading heading={t('home.servicesHeading')} sub={t('home.servicesSub')} />
        </Reveal>
        <RevealStagger className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <RevealStaggerItem key={service.id}>
              <Link
                href={`/services/${service.slug}`}
                className="group p-7 relative block h-full overflow-hidden rounded-lg border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-crimson/40 hover:shadow-xl"
              >
                <span className="font-display text-5xl font-semibold text-line transition-colors group-hover:text-marigold">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold text-ink transition-colors group-hover:text-crimson">
                  {service.title}
                </h3>
                <p className="mt-2.5 text-ink-soft">{service.summary}</p>
              </Link>
            </RevealStaggerItem>
          ))}
        </RevealStagger>
      </section>

      <AnimatedDivider className="px-4 sm:px-6 mx-auto max-w-6xl" />

      {/* Featured rugs */}
      {featured.length > 0 && (
        <section className="px-4 py-20 sm:px-6 mx-auto max-w-6xl">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading heading={t('home.featuredHeading')} sub={t('home.featuredSub')} />
              <Link
                href="/rugs"
                className="font-semibold text-crimson transition-colors hover:text-crimson-deep"
              >
                {t('common.viewAll')} →
              </Link>
            </div>
          </Reveal>
          <RevealStagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((product) => (
              <RevealStaggerItem key={product.id}>
                <ProductCard product={product} />
              </RevealStaggerItem>
            ))}
          </RevealStagger>
        </section>
      )}

      {/* Story band */}
      {home.storyBody && (
        <section className="border-y border-line bg-surface texture-weave">
          <div className="px-4 py-20 sm:px-6 mx-auto grid max-w-6xl gap-10 lg:grid-cols-[2fr_3fr]">
            <Reveal direction="left">
              <h2 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                {home.storyHeading}
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <RichTextContent data={home.storyBody} className="text-lg" />
            </Reveal>
          </div>
        </section>
      )}

      {/* Custom-order CTA */}
      <section className="px-4 py-20 sm:px-6 mx-auto max-w-6xl">
        <Reveal>
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
        </Reveal>
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
