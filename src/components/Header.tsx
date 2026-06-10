import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import type { Service } from '@/payload-types'
import { HeaderShell } from './HeaderShell'
import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileNav, type NavLink } from './MobileNav'
import { ThemeToggle } from './ThemeToggle'

type Props = {
  services: Service[]
}

export async function Header({ services }: Props) {
  const t = await getTranslations()

  const links: NavLink[] = [
    { href: '/rugs', label: t('nav.rugs') },
    ...services.map((service) => ({
      href: `/services/${service.slug}`,
      label: service.title,
    })),
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ]

  return (
    <HeaderShell>
      <div className="px-4 sm:px-6 mx-auto flex h-16 max-w-6xl items-center justify-between gap-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-crimson">
            {t('common.brand')}
          </span>
          <span className="hidden sm:inline text-sm text-ink-soft">{t('common.tagline')}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label={t('nav.menu')}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-crimson"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <LocaleSwitcher />
          <ThemeToggle />
          <MobileNav links={links} />
        </div>
      </div>
    </HeaderShell>
  )
}
