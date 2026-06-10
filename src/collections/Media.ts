import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Attribution shown under the image where required (e.g. CC-licensed photos)',
      },
    },
  ],
  upload: true,
}
