import type { Media } from '@/payload-types'

// Payload relationship fields are `number | Media` depending on query depth;
// this narrows to a populated doc with a usable URL.
export function asMedia(value: number | Media | null | undefined): Media | null {
  if (value && typeof value === 'object' && typeof value.url === 'string') {
    return value
  }
  return null
}
