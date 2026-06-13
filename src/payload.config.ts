import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Services } from './collections/Services'
import { Inquiries } from './collections/Inquiries'
import { SiteSettings } from './globals/SiteSettings'
import { HomePage } from './globals/HomePage'
import { AboutPage } from './globals/AboutPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Galaincha CMS',
    },
  },
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'नेपाली', code: 'ne' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  collections: [Products, Categories, Services, Inquiries, Media, Users],
  globals: [SiteSettings, HomePage, AboutPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
