import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { Fraunces, Mukta } from 'next/font/google'
import { notFound } from 'next/navigation'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { routing } from '@/i18n/routing'
import { getServices, getSiteSettings } from '@/lib/queries'

import '../styles.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
})

const mukta = Mukta({
  subsets: ['latin', 'devanagari'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-mukta',
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  const t = await getTranslations({ locale, namespace: 'meta.home' })

  return {
    title: {
      default: t('title'),
      template: '%s — Galaincha',
    },
    description: t('description'),
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const [messages, settings, services] = await Promise.all([
    getMessages({ locale }),
    getSiteSettings(locale),
    getServices(locale),
  ])

  return (
    <html lang={locale} className={`${fraunces.variable} ${mukta.variable}`} suppressHydrationWarning>
      <body className="bg-ground font-sans text-ink antialiased">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <MotionProvider>
              <Header services={services} />
              <main>{children}</main>
              <Footer settings={settings} services={services} />
            </MotionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
