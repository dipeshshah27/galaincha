'use client'

import { m, type Variants } from 'motion/react'

const parentVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
}

type Props = {
  children: React.ReactNode
  className?: string
}

// Parent/child pair for grids and lists: wrap the container in
// <RevealStagger> and each cell in <RevealStaggerItem>.
export function RevealStagger({ children, className }: Props) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={parentVariants}
    >
      {children}
    </m.div>
  )
}

export function RevealStaggerItem({ children, className }: Props) {
  return (
    <m.div className={className} variants={itemVariants}>
      {children}
    </m.div>
  )
}
