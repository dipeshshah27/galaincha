'use client'

import { m } from 'motion/react'

type Direction = 'up' | 'left' | 'right' | 'none'

type Props = {
  children: React.ReactNode
  direction?: Direction
  delay?: number
  className?: string
}

const OFFSETS: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  left: { x: -32, y: 0 },
  right: { x: 32, y: 0 },
  none: { x: 0, y: 0 },
}

// Scroll-triggered entrance for server-rendered content. Animates only
// transform/opacity, fires once, ~80px before entering the viewport.
export function Reveal({ children, direction = 'up', delay = 0, className }: Props) {
  const offset = OFFSETS[direction]

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  )
}
