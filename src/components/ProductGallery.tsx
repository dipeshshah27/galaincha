'use client'

import { AnimatePresence, m } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'

import { cn } from '@/lib/cn'

export type GalleryImage = {
  id: number
  url: string
  alt: string
}

type Props = {
  images: GalleryImage[]
}

export function ProductGallery({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = images[activeIndex]

  if (!active) {
    return null
  }

  return (
    <div>
      <div className="relative aspect-4/5 overflow-hidden rounded-lg border border-line bg-surface">
        <AnimatePresence initial={false}>
          <m.div
            key={active.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Image
              src={active.url}
              alt={active.alt}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </m.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={image.alt}
              aria-current={index === activeIndex}
              className={cn(
                'relative aspect-square overflow-hidden rounded-md border transition-all',
                index === activeIndex
                  ? 'border-crimson ring-2 ring-crimson/30'
                  : 'border-line opacity-70 hover:opacity-100',
              )}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 25vw, 12vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
