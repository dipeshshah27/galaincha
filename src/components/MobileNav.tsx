'use client'

import { AnimatePresence, m, type Variants } from 'motion/react'
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

const panelVariants: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut', staggerChildren: 0.05 },
  },
  exit: { opacity: 0, y: -12, transition: { duration: 0.18, ease: 'easeIn' } },
}

const linkVariants: Variants = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0 },
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
          {/* top and bottom bars rotate into an X; middle bar fades */}
          <m.path
            d="M3.5 7 L20.5 7"
            animate={open ? { d: 'M6 6 L18 18' } : { d: 'M3.5 7 L20.5 7' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          />
          <m.path
            d="M3.5 12 L20.5 12"
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: 0.15 }}
          />
          <m.path
            d="M3.5 17 L20.5 17"
            animate={open ? { d: 'M18 6 L6 18' } : { d: 'M3.5 17 L20.5 17' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <m.nav
            className="px-4 py-4 absolute inset-x-0 top-full flex flex-col gap-1 border-b border-line bg-ground shadow-lg"
            aria-label={t('menu')}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
          >
            {links.map((link) => (
              <m.div key={link.href} variants={linkVariants}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 block rounded-md text-lg font-medium text-ink transition-colors hover:bg-surface hover:text-crimson"
                >
                  {link.label}
                </Link>
              </m.div>
            ))}
          </m.nav>
        )}
      </AnimatePresence>
    </div>
  )
}
