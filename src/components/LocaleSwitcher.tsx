'use client'

import { useLocale, useTranslations } from 'next-intl'

import { routing, type Locale } from '@/i18n/routing'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  ne: 'ने',
}

export function LocaleSwitcher() {
  const t = useTranslations('locale')
  const active = useLocale()
  const pathname = usePathname()

  return (
    <div
      className="p-0.5 inline-flex items-center rounded-full border border-line bg-surface"
      role="group"
      aria-label={t('label')}
    >
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          className={cn(
            'px-2.5 py-0.5 rounded-full text-sm font-medium transition-colors',
            locale === active ? 'bg-crimson text-ground' : 'text-ink-soft hover:text-crimson',
          )}
        >
          {LOCALE_LABELS[locale]}
        </Link>
      ))}
    </div>
  )
}
