import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { InquiryForm } from '@/components/InquiryForm'
import { AnimatedDivider } from '@/components/motion/AnimatedDivider'
import { Reveal } from '@/components/motion/Reveal'
import { RevealStagger, RevealStaggerItem } from '@/components/motion/RevealStagger'
import { resolveLocale } from '@/i18n/locale'
import { getSiteSettings } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const t = await getTranslations({ locale, namespace: 'meta.contact' })
  return pageMetadata({ locale, path: '/contact', title: t('title'), description: t('description') })
}

export default async function ContactPage({ params }: Props) {
  const locale = await resolveLocale(params)
  setRequestLocale(locale)

  const [t, settings] = await Promise.all([getTranslations(), getSiteSettings(locale)])
  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`
    : null

  return (
    <div className="px-4 py-16 sm:px-6 mx-auto max-w-6xl">
      <h1 className="animate-rise font-display text-5xl font-semibold text-ink sm:text-6xl">
        {t('contact.title')}
      </h1>
      <p className="animate-rise delay-1 mt-4 max-w-2xl text-xl text-ink-soft">
        {t('contact.intro')}
      </p>

      <AnimatedDivider className="my-12" />

      <div className="grid gap-12 lg:grid-cols-[2fr_3fr]">
        <RevealStagger className="space-y-6">
          {settings.contactPerson && (
            <ContactItem label={t('contact.person')}>
              <p>{settings.contactPerson}</p>
            </ContactItem>
          )}
          {settings.phone && (
            <ContactItem label={t('contact.phone')}>
              <a className="transition-colors hover:text-crimson" href={`tel:${settings.phone}`}>
                {settings.phone}
              </a>
            </ContactItem>
          )}
          {whatsappHref && (
            <ContactItem label={t('contact.whatsapp')}>
              <a
                className="transition-colors hover:text-crimson"
                href={whatsappHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                {settings.whatsapp}
              </a>
            </ContactItem>
          )}
          {settings.email && (
            <ContactItem label={t('contact.email')}>
              <a
                className="transition-colors hover:text-crimson"
                href={`mailto:${settings.email}`}
              >
                {settings.email}
              </a>
            </ContactItem>
          )}
          {settings.address && (
            <ContactItem label={t('contact.address')}>
              <p className="whitespace-pre-line">{settings.address}</p>
            </ContactItem>
          )}
        </RevealStagger>

        <Reveal direction="right">
          <InquiryForm type="general" heading={t('contact.formHeading')} />
        </Reveal>
      </div>
    </div>
  )
}

function ContactItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <RevealStaggerItem>
      <div className="p-5 rounded-lg border border-line bg-surface">
        <p className="text-sm font-semibold uppercase tracking-widest text-marigold">{label}</p>
        <div className="mt-1.5 text-lg font-medium text-ink">{children}</div>
      </div>
    </RevealStaggerItem>
  )
}
