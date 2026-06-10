import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'

export default async function NotFound() {
  const t = await getTranslations('notFound')

  return (
    <div className="px-4 py-32 sm:px-6 mx-auto max-w-2xl text-center">
      <p className="font-display text-7xl font-semibold text-crimson">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">{t('title')}</h1>
      <p className="mt-3 text-lg text-ink-soft">{t('body')}</p>
      <Link
        href="/"
        className="px-7 py-3 mt-8 inline-flex items-center rounded-full bg-crimson font-semibold text-snow transition-colors hover:bg-crimson-deep"
      >
        {t('cta')}
      </Link>
    </div>
  )
}
