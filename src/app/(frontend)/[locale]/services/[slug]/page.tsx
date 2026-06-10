import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { CarpetDivider } from '@/components/CarpetDivider'
import { InquiryForm } from '@/components/InquiryForm'
import { RichTextContent } from '@/components/RichTextContent'
import { resolveLocale } from '@/i18n/locale'
import { asMedia } from '@/lib/media'
import { getServiceBySlug } from '@/lib/queries'

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
  return { title: service.title, description: service.summary }
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
      <header className="max-w-3xl">
        <h1 className="font-display text-5xl font-semibold text-ink sm:text-6xl">
          {service.title}
        </h1>
        <p className="mt-4 text-xl text-ink-soft">{service.summary}</p>
      </header>

      <CarpetDivider className="my-12" />

      <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
        <div>
          {service.body && <RichTextContent data={service.body} />}

          {steps.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-3xl font-semibold text-ink">
                {t('services.processHeading')}
              </h2>
              <ol className="mt-8 space-y-6">
                {steps.map((step, index) => (
                  <li key={step.id ?? index} className="flex gap-5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-crimson font-display text-lg font-semibold text-snow">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
                      {step.description && <p className="mt-1 text-ink-soft">{step.description}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <div className="space-y-8">
          {image?.url && (
            <figure>
              <div className="relative aspect-4/5 overflow-hidden rounded-lg border border-line">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              {image.credit && (
                <figcaption className="mt-2 text-xs text-ink-soft">{image.credit}</figcaption>
              )}
            </figure>
          )}
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-2xl">
        <InquiryForm
          type={service.inquiryType}
          heading={t('services.enquireHeading')}
          sub={t('services.enquireSub')}
        />
      </div>
    </div>
  )
}
