'use client'

import { m, useMotionValue, useSpring, useTransform } from 'motion/react'

// The hero's stylized hand-knotted rug. Floats gently and tilts toward the
// pointer (springed, 3D perspective) — the site's first interactive moment.
export function HeroRug() {
  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-7, 7]), {
    stiffness: 120,
    damping: 18,
  })
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [6, -6]), {
    stiffness: 120,
    damping: 18,
  })

  return (
    <div
      aria-hidden
      className="animate-rise delay-2 relative mx-auto w-full max-w-sm [perspective:1000px] lg:max-w-none"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        pointerX.set((event.clientX - rect.left) / rect.width)
        pointerY.set((event.clientY - rect.top) / rect.height)
      }}
      onPointerLeave={() => {
        pointerX.set(0.5)
        pointerY.set(0.5)
      }}
    >
      <m.div
        style={{ rotateX, rotateY }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 360 460" className="w-full drop-shadow-2xl">
          {/* field */}
          <rect width="360" height="460" rx="10" className="fill-indigo dark:fill-indigo-deep" />
          {/* outer khaden border */}
          <rect x="14" y="14" width="332" height="432" rx="6" fill="none" className="stroke-marigold" strokeWidth="3" />
          <rect x="26" y="26" width="308" height="408" rx="4" fill="none" className="stroke-crimson" strokeWidth="6" strokeDasharray="14 8" />
          <rect x="40" y="40" width="280" height="380" rx="3" fill="none" className="stroke-snow/40" strokeWidth="1.5" />
          {/* central medallion: nested diamonds */}
          <g transform="translate(180 230)">
            <path d="M0 -150 L110 0 L0 150 L-110 0 Z" className="fill-crimson/90" />
            <path d="M0 -118 L86 0 L0 118 L-86 0 Z" fill="none" className="stroke-marigold" strokeWidth="3" />
            <path d="M0 -88 L64 0 L0 88 L-64 0 Z" className="fill-snow/95 dark:fill-snow/85" />
            <path d="M0 -58 L42 0 L0 58 L-42 0 Z" className="fill-marigold" />
            <path d="M0 -30 L22 0 L0 30 L-22 0 Z" className="fill-crimson-deep" />
            <circle r="6" className="fill-snow" />
          </g>
          {/* corner motifs */}
          {[
            'translate(70 80)',
            'translate(290 80) scale(-1 1)',
            'translate(70 380) scale(1 -1)',
            'translate(290 380) scale(-1 -1)',
          ].map((transform) => (
            <g key={transform} transform={transform}>
              <path d="M0 0 L26 0 L26 5 L5 5 L5 26 L0 26 Z" className="fill-marigold/90" />
              <path d="M12 12 L30 12 L30 16 L16 16 L16 30 L12 30 Z" className="fill-snow/50" />
            </g>
          ))}
          {/* fringe */}
          {Array.from({ length: 18 }, (_, i) => 24 + i * 18).map((x) => (
            <g key={x} className="stroke-ink-soft/70" strokeWidth="2">
              <line x1={x} y1="460" x2={x} y2="472" />
              <line x1={x} y1="0" x2={x} y2="-12" />
            </g>
          ))}
        </svg>
      </m.div>
    </div>
  )
}
