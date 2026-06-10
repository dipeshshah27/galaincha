'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Link } from '@/i18n/navigation'

export type NavLink = {
  href: string
  label: string
}

type Props = {
  links: NavLink[]
}

export function MobileNav({ links }: Props) {
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 inline-flex items-center justify-center rounded-full text-ink-soft transition-colors hover:text-crimson"
        aria-expanded={open}
        aria-label={open ? t('closeMenu') : t('menu')}
      >
        <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          {open ? (
            <path d="M6 6l12 12M18 6 6 18" />
          ) : (
            <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
          )}
        </svg>
      </button>

      {open && (
        <nav
          className="px-4 py-4 absolute inset-x-0 top-full flex flex-col gap-1 border-b border-line bg-ground shadow-lg"
          aria-label={t('menu')}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-md text-lg font-medium text-ink transition-colors hover:bg-surface hover:text-crimson"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
