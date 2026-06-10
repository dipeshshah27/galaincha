'use server'

import { getPayload } from 'payload'
import { z } from 'zod'

import config from '@/payload.config'

const INQUIRY_TYPES = ['purchase', 'custom-order', 'washing', 'general'] as const

// Keys into the `form.errors` message namespace — translated client-side
// so the response stays locale-agnostic.
export type InquiryErrorKey =
  | 'nameRequired'
  | 'contactRequired'
  | 'emailInvalid'
  | 'messageRequired'

export type InquiryFormState = {
  status: 'idle' | 'success' | 'error'
  fieldErrors?: Partial<Record<'name' | 'email' | 'phone' | 'message', InquiryErrorKey>>
  formError?: boolean
}

const inquirySchema = z.object({
  name: z.string().trim().min(1),
  email: z.email().or(z.literal('')),
  phone: z.string().trim().max(40),
  message: z.string().trim().min(1).max(5000),
  type: z.enum(INQUIRY_TYPES),
  productId: z.coerce.number().int().positive().optional(),
})

export async function submitInquiry(
  _prev: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  // Honeypot: bots fill every field; humans never see this one.
  if (typeof formData.get('website') === 'string' && formData.get('website') !== '') {
    return { status: 'success' }
  }

  const raw = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? '').trim(),
    phone: String(formData.get('phone') ?? ''),
    message: String(formData.get('message') ?? ''),
    type: String(formData.get('type') ?? 'general'),
    productId: formData.get('productId') ? String(formData.get('productId')) : undefined,
  }

  const parsed = inquirySchema.safeParse(raw)

  if (!parsed.success) {
    const fieldErrors: InquiryFormState['fieldErrors'] = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]
      if (field === 'name') fieldErrors.name = 'nameRequired'
      if (field === 'email') fieldErrors.email = 'emailInvalid'
      if (field === 'message') fieldErrors.message = 'messageRequired'
    }
    return { status: 'error', fieldErrors }
  }

  const { name, email, phone, message, type, productId } = parsed.data

  if (email === '' && phone === '') {
    return { status: 'error', fieldErrors: { email: 'contactRequired' } }
  }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'inquiries',
      data: {
        name,
        email: email === '' ? undefined : email,
        phone: phone === '' ? undefined : phone,
        message,
        type,
        product: productId,
        status: 'new',
      },
    })
    return { status: 'success' }
  } catch {
    return { status: 'error', formError: true }
  }
}
