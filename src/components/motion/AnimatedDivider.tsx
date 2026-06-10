'use client'

import { m } from 'motion/react'

import { cn } from '@/lib/cn'

type Props = {
  className?: string
}

const DIAMOND_COUNT = 8

// Animated variant of CarpetDivider: the khaden diamonds draw themselves in
// stroke by stroke when scrolled into view, like knots appearing on a loom.
export function AnimatedDivider({ className }: Props) {
  return (
    <div aria-hidden className={cn('flex items-center gap-4', className)}>
      <m.span
        className="h-px flex-1 origin-right bg-line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <svg className="h-3 w-40 text-crimson" viewBox="0 0 160 12" fill="none">
        {Array.from({ length: DIAMOND_COUNT }, (_, i) => (
          <m.path
            key={i}
            d={`M${i * 20 + 10} 1 L${i * 20 + 19} 6 L${i * 20 + 10} 11 L${i * 20 + 1} 6 Z`}
            stroke="currentColor"
            strokeWidth="1.2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 + i * 0.07, ease: 'easeOut' }}
          />
        ))}
      </svg>
      <m.span
        className="h-px flex-1 origin-left bg-line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}
