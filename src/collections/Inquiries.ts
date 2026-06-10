import type { CollectionConfig } from 'payload'

// Created exclusively through the inquiry Server Action (Local API);
// no public REST access — default auth-only access applies.
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Purchase', value: 'purchase' },
        { label: 'Custom order', value: 'custom-order' },
        { label: 'Washing', value: 'washing' },
        { label: 'General', value: 'general' },
      ],
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
