'use client'

import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

const ORDER = ['light', 'dark', 'system'] as const

const emptySubscribe = () => () => {}

export function ThemeToggle() {
  const t = useTranslations('theme')
  const { theme, setTheme } = useTheme()
  // Theme is unknown until hydration; render a neutral button first to avoid
  // a server/client mismatch.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  const current = mounted && theme ? theme : 'system'
  const next = ORDER[(ORDER.indexOf(current as (typeof ORDER)[number]) + 1) % ORDER.length]

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="p-2 inline-flex items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface hover:text-crimson"
      title={mounted ? t(current as (typeof ORDER)[number]) : t('toggle')}
      aria-label={t('toggle')}
    >
      {current === 'light' && <SunIcon />}
      {current === 'dark' && <MoonIcon />}
      {current === 'system' && <SystemIcon />}
    </button>
  )
}

function SunIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4.5" width="18" height="13" rx="1.5" />
      <path d="M9 20.5h6" />
    </svg>
  )
}
