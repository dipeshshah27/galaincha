import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import type { Service } from '@/payload-types'
import type { SiteSetting } from '@/payload-types'
import { MountainRidge } from './MountainRidge'

type Props = {
  settings: SiteSetting
  services: Service[]
}

export async function Footer({ settings, services }: Props) {
  const t = await getTranslations()
  const year = new Date().getFullYear()
  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}`
    : null

  return (
    <footer className="mt-24">
      <MountainRidge className="h-14 w-full text-night" />

      <div className="bg-night text-snow">
        <div className="px-4 py-14 sm:px-6 mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-3xl font-semibold text-snow">{t('common.brand')}</p>
            <p className="mt-1 text-snow-soft">{settings.tagline}</p>
            <p className="mt-6 text-sm text-snow-soft">{t('footer.madeIn')}</p>
          </div>

          <FooterColumn heading={t('footer.navHeading')}>
            <FooterLink href="/">{t('nav.home')}</FooterLink>
            <FooterLink href="/rugs">{t('nav.rugs')}</FooterLink>
            <FooterLink href="/about">{t('nav.about')}</FooterLink>
            <FooterLink href="/contact">{t('nav.contact')}</FooterLink>
          </FooterColumn>

          <FooterColumn heading={t('footer.servicesHeading')}>
            {services.map((service) => (
              <FooterLink key={service.id} href={`/services/${service.slug}`}>
                {service.title}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn heading={t('footer.contactHeading')}>
            {settings.phone && (
              <a className="transition-colors hover:text-marigold" href={`tel:${settings.phone}`}>
                {settings.phone}
              </a>
            )}
            {settings.email && (
              <a className="transition-colors hover:text-marigold" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            )}
            {whatsappHref && (
              <a
                className="transition-colors hover:text-marigold"
                href={whatsappHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                WhatsApp
              </a>
            )}
            {settings.address && (
              <p className="whitespace-pre-line text-snow-soft">{settings.address}</p>
            )}
          </FooterColumn>
        </div>

        <div className="border-t border-snow/10">
          <div className="px-4 py-5 sm:px-6 mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-sm text-snow-soft sm:flex-row">
            <p>
              © {year} {t('common.brand')}. {t('footer.rights')}
            </p>
            {settings.footerNote && <p>{settings.footerNote}</p>}
          </div>
        </div>

        <KhadenBand />
      </div>
    </footer>
  )
}

function FooterColumn({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-marigold">
        {heading}
      </h2>
      <div className="flex flex-col gap-2.5 text-snow">{children}</div>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="transition-colors hover:text-marigold">
      {children}
    </Link>
  )
}

// Closing carpet-border strip along the very bottom edge of the page.
function KhadenBand() {
  return (
    <svg aria-hidden className="h-2.5 w-full text-crimson" preserveAspectRatio="none" fill="none">
      <defs>
        <pattern id="khaden-footer" width="18" height="10" patternUnits="userSpaceOnUse">
          <path d="M9 1 L17 5 L9 9 L1 5 Z" stroke="currentColor" strokeWidth="1.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#khaden-footer)" />
    </svg>
  )
}
