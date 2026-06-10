'use client'

import { m } from 'motion/react'

type Props = {
  children: React.ReactNode
}

// Templates remount on every navigation, so this gives each page a soft
// fade-rise entrance. (Next's View Transitions API is still behind an
// experimental flag in 16.2 — revisit when it stabilizes.)
export default function Template({ children }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  )
}
