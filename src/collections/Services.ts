import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'inquiryType',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'Purchase', value: 'purchase' },
        { label: 'Custom order', value: 'custom-order' },
        { label: 'Washing', value: 'washing' },
        { label: 'General', value: 'general' },
      ],
      admin: {
        description: 'Which inquiry type the form on this service page submits',
      },
    },
    {
      name: 'steps',
      type: 'array',
      admin: {
        description: 'Optional process steps (e.g. design → weave → wash → ship)',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
