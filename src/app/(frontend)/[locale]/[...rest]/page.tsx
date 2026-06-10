import { notFound } from 'next/navigation'

// Funnels every unmatched path under a valid locale to the localized 404.
export default function CatchAllPage() {
  notFound()
}
