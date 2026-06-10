'use client'

import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import {
  submitInquiry,
  type InquiryErrorKey,
  type InquiryFormState,
} from '@/actions/submit-inquiry'
import { cn } from '@/lib/cn'

type Props = {
  type: 'purchase' | 'custom-order' | 'washing' | 'general'
  productId?: number
  heading: string
  sub?: string
}

const INITIAL_STATE: InquiryFormState = { status: 'idle' }

export function InquiryForm({ type, productId, heading, sub }: Props) {
  const t = useTranslations('form')
  const [state, formAction, isPending] = useActionState(submitInquiry, INITIAL_STATE)

  const errorFor = (field: keyof NonNullable<InquiryFormState['fieldErrors']>) => {
    const key: InquiryErrorKey | undefined = state.fieldErrors?.[field]
    return key ? t(`errors.${key}`) : null
  }

  if (state.status === 'success') {
    return (
      <m.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="p-8 rounded-lg border border-marigold/40 bg-surface text-center"
      >
        <svg className="mx-auto size-14 text-marigold" viewBox="0 0 56 56" fill="none" stroke="currentColor">
          <m.circle
            cx="28"
            cy="28"
            r="25"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          <m.path
            d="M17 29 l8 8 l15 -16"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: 0.5, ease: 'easeOut' }}
          />
        </svg>
        <p className="mt-4 font-display text-xl font-semibold text-ink">{t('success')}</p>
      </m.div>
    )
  }

  return (
    <form action={formAction} className="p-6 sm:p-8 rounded-lg border border-line bg-surface">
      <h2 className="font-display text-2xl font-semibold text-ink">{heading}</h2>
      {sub && <p className="mt-1.5 text-ink-soft">{sub}</p>}

      <input type="hidden" name="type" value={type} />
      {productId !== undefined && <input type="hidden" name="productId" value={productId} />}
      {/* Honeypot — humans never see it, bots fill it */}
      <div aria-hidden="true" className="sr-only">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-6 grid gap-4">
        <Field label={t('name')} error={errorFor('name')}>
          <input
            type="text"
            name="name"
            required
            className={inputClasses}
            autoComplete="name"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('email')} error={errorFor('email')}>
            <input type="email" name="email" className={inputClasses} autoComplete="email" />
          </Field>
          <Field label={t('phone')} error={errorFor('phone')}>
            <input type="tel" name="phone" className={inputClasses} autoComplete="tel" />
          </Field>
        </div>
        <p className="-mt-2 text-sm text-ink-soft">{t('contactHint')}</p>

        <Field label={t('message')} error={errorFor('message')}>
          <textarea name="message" required rows={5} className={inputClasses} />
        </Field>

        {state.formError && <p className="text-sm font-medium text-crimson">{t('errorGeneric')}</p>}

        <m.button
          type="submit"
          disabled={isPending}
          whileTap={{ scale: 0.96 }}
          className="px-6 py-3 mt-2 inline-flex items-center justify-center self-start rounded-full bg-crimson font-semibold text-snow transition-colors hover:bg-crimson-deep disabled:opacity-60"
        >
          {isPending ? t('sending') : t('submit')}
        </m.button>
      </div>
    </form>
  )
}

const inputClasses =
  'px-3.5 py-2.5 w-full rounded-md border border-line bg-ground text-ink outline-none transition-colors focus:border-crimson focus:ring-2 focus:ring-crimson/20'

function Field({
  label,
  error,
  children,
}: {
  label: string
  error: string | null
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className={cn('mb-1.5 block text-sm font-medium', error ? 'text-crimson' : 'text-ink')}>
        {label}
      </span>
      {children}
      {error && (
        <m.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="mt-1 block text-sm text-crimson"
        >
          {error}
        </m.span>
      )}
    </label>
  )
}
