import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'

import { RichTextContent } from '@/components/RichTextContent'
import { AnimatedDivider } from '@/components/motion/AnimatedDivider'
import { Reveal } from '@/components/motion/Reveal'
import { resolveLocale } from '@/i18n/locale'
import { asMedia } from '@/lib/media'
import { getAboutPage } from '@/lib/queries'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const t = await getTranslations({ locale, namespace: 'meta.about' })
  return { title: t('title'), description: t('description') }
}

export default async function AboutRoute({ params }: Props) {
  const locale = await resolveLocale(params)
  setRequestLocale(locale)

  const about = await getAboutPage(locale)
  const image = asMedia(about.image)

  return (
    <div className="px-4 py-16 sm:px-6 mx-auto max-w-4xl">
      <h1 className="animate-rise font-display text-5xl font-semibold text-ink sm:text-6xl">
        {about.heading}
      </h1>
      {about.intro && <p className="animate-rise delay-1 mt-4 text-xl text-ink-soft">{about.intro}</p>}

      <AnimatedDivider className="my-12" />

      {image?.url && (
        <Reveal className="mb-12">
          <div className="relative aspect-video overflow-hidden rounded-lg border border-line">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        </Reveal>
      )}

      {about.body && (
        <Reveal>
          <RichTextContent data={about.body} className="text-lg" />
        </Reveal>
      )}
    </div>
  )
}
