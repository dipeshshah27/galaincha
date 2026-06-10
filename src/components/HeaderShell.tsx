'use client'

import { m, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { useState } from 'react'

type Props = {
  children: React.ReactNode
}

// Client chrome around the server-rendered header content: hides when
// scrolling down, springs back on scroll-up, and draws a crimson reading
// progress bar along the bottom edge.
export function HeaderShell({ children }: Props) {
  const { scrollY, scrollYProgress } = useScroll()
  const [hidden, setHidden] = useState(false)
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 })

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setHidden(latest > previous && latest > 120)
  })

  return (
    <m.header
      className="sticky top-0 z-40 border-b border-line bg-ground/85 backdrop-blur-md"
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
      <m.span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-crimson"
        style={{ scaleX: progress }}
      />
    </m.header>
  )
}
