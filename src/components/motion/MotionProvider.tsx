'use client'

import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'

type Props = {
  children: React.ReactNode
}

// LazyMotion + `m` components keep the animation runtime out of the main
// bundle; reducedMotion="user" makes every animation respect OS settings.
export function MotionProvider({ children }: Props) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
