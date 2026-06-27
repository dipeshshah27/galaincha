import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { Fraunces, Mukta } from 'next/font/google'
import { notFound } from 'next/navigation'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { JsonLd } from '@/components/seo/JsonLd'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { routing } from '@/i18n/routing'
import { getServices, getSiteSettings } from '@/lib/queries'
import { getBaseUrl, SITE_NAME } from '@/lib/seo'
import { businessLdJson, websiteLdJson } from '@/lib/structured-data'

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
  const base = getBaseUrl()

  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = `${base}/${l}`
  }
  languages['x-default'] = `${base}/${routing.defaultLocale}`

  return {
    metadataBase: new URL(base),
    title: {
      default: t('title'),
      template: `%s — ${SITE_NAME}`,
    },
    description: t('description'),
    alternates: {
      canonical: `${base}/${locale}`,
      languages,
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: locale === 'ne' ? 'ne_NP' : 'en_US',
      url: `${base}/${locale}`,
      title: t('title'),
      description: t('description'),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
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

  const base = getBaseUrl()

  return (
    <html lang={locale} className={`${fraunces.variable} ${mukta.variable}`} suppressHydrationWarning>
      <body className="bg-ground font-sans text-ink antialiased">
        <JsonLd data={[businessLdJson(settings, services, base), websiteLdJson(base)]} />
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
