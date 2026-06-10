import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'contactPerson',
      type: 'text',
      localized: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'whatsapp',
      type: 'text',
      admin: {
        description: 'Number in international format, e.g. +9779801234567',
      },
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'address',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'instagram',
      type: 'text',
    },
    {
      name: 'facebook',
      type: 'text',
    },
    {
      name: 'footerNote',
      type: 'textarea',
      localized: true,
    },
  ],
}
