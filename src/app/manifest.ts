import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shah Washing',
    short_name: 'Shah Washing',
    description: 'Handwoven Himalayan carpets and professional carpet washing — Kathmandu, Nepal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f0e3',
    theme_color: '#ae1a37',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  }
}
