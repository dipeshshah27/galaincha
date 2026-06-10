import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'material', 'featured'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
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
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'size',
      type: 'text',
      admin: {
        description: 'e.g. 170 × 240 cm',
      },
    },
    {
      name: 'material',
      type: 'select',
      options: [
        { label: { en: 'Himalayan Wool', ne: 'हिमाली ऊन' }, value: 'wool' },
        { label: { en: 'Silk', ne: 'रेशम' }, value: 'silk' },
        { label: { en: 'Wool & Silk', ne: 'ऊन र रेशम' }, value: 'wool-silk' },
        { label: { en: 'Hemp', ne: 'भाङ' }, value: 'hemp' },
        { label: { en: 'Allo (Nettle)', ne: 'अल्लो' }, value: 'allo' },
      ],
    },
    {
      name: 'knotCount',
      type: 'number',
      admin: {
        description: 'Knots per square inch',
      },
    },
    {
      name: 'priceRange',
      type: 'text',
      localized: true,
      admin: {
        description: 'e.g. NPR 45,000 – 60,000',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
