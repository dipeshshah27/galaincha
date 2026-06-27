import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { InquiryForm } from '@/components/InquiryForm'
import { RichTextContent } from '@/components/RichTextContent'
import { JsonLd } from '@/components/seo/JsonLd'
import { AnimatedDivider } from '@/components/motion/AnimatedDivider'
import { Reveal } from '@/components/motion/Reveal'
import { RevealStagger, RevealStaggerItem } from '@/components/motion/RevealStagger'
import { resolveLocale } from '@/i18n/locale'
import { asMedia } from '@/lib/media'
import { getServiceBySlug } from '@/lib/queries'
import { getBaseUrl, pageMetadata } from '@/lib/seo'
import { serviceLdJson } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const { slug } = await params
  const service = await getServiceBySlug(locale, slug)
  if (!service) {
    return {}
  }
  return pageMetadata({
    locale,
    path: `/services/${slug}`,
    title: service.title,
    description: service.summary,
  })
}

export default async function ServicePage({ params }: Props) {
  const locale = await resolveLocale(params)
  setRequestLocale(locale)
  const { slug } = await params

  const [t, service] = await Promise.all([getTranslations(), getServiceBySlug(locale, slug)])

  if (!service) {
    notFound()
  }

  const image = asMedia(service.image)
  const steps = service.steps ?? []

  return (
    <div className="px-4 py-16 sm:px-6 mx-auto max-w-6xl">
      <JsonLd data={serviceLdJson(service, locale, getBaseUrl())} />
      <header className="max-w-3xl">
        <h1 className="animate-rise font-display text-5xl font-semibold text-ink sm:text-6xl">
          {service.title}
        </h1>
        <p className="animate-rise delay-1 mt-4 text-xl text-ink-soft">{service.summary}</p>
      </header>

      <AnimatedDivider className="my-12" />

      <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
        <div>
          {service.body && (
            <Reveal>
              <RichTextContent data={service.body} />
            </Reveal>
          )}

          {steps.length > 0 && (
            <section className="mt-12">
              <Reveal>
                <h2 className="font-display text-3xl font-semibold text-ink">
                  {t('services.processHeading')}
                </h2>
              </Reveal>
              <RevealStagger className="mt-8 space-y-6">
                {steps.map((step, index) => (
                  <RevealStaggerItem key={step.id ?? index} className="flex gap-5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-crimson font-display text-lg font-semibold text-snow">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
                      {step.description && <p className="mt-1 text-ink-soft">{step.description}</p>}
                    </div>
                  </RevealStaggerItem>
                ))}
              </RevealStagger>
            </section>
          )}
        </div>

        <div className="space-y-8">
          {image?.url && (
            <Reveal direction="right">
              <div className="relative aspect-4/5 overflow-hidden rounded-lg border border-line">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}
        </div>
      </div>

      <Reveal className="mx-auto mt-20 max-w-2xl">
        <InquiryForm
          type={service.inquiryType}
          heading={t('services.enquireHeading')}
          sub={t('services.enquireSub')}
        />
      </Reveal>
    </div>
  )
}
