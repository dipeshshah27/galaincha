import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroEyebrow',
      type: 'text',
      localized: true,
      admin: {
        description: 'Small line above the main heading',
      },
    },
    {
      name: 'heroHeading',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'heroSub',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'featuredProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'storyHeading',
      type: 'text',
      localized: true,
    },
    {
      name: 'storyBody',
      type: 'richText',
      localized: true,
    },
  ],
}
