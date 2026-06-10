import { cn } from '@/lib/cn'

type Props = {
  className?: string
}

// A thin band of repeating diamonds — the border motif found on the edge of
// Tibetan-Nepali khaden rugs. Used as a section divider.
export function CarpetDivider({ className }: Props) {
  return (
    <div aria-hidden className={cn('flex items-center gap-4', className)}>
      <span className="h-px flex-1 bg-line" />
      <svg className="h-3 w-40 text-crimson" viewBox="0 0 160 12" fill="none">
        <defs>
          <pattern id="khaden" width="20" height="12" patternUnits="userSpaceOnUse">
            <path d="M10 1 L19 6 L10 11 L1 6 Z" stroke="currentColor" strokeWidth="1.2" />
            <rect x="8.75" y="4.75" width="2.5" height="2.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="160" height="12" fill="url(#khaden)" />
      </svg>
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}
