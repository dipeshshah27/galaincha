type Props = {
  className?: string
}

// Himalayan ridge silhouette — fills with currentColor so sections can tint it.
export function MountainRidge({ className }: Props) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      fill="currentColor"
    >
      <path d="M0 120 L0 74 L96 38 L168 64 L264 14 L344 70 L420 34 L520 82 L610 24 L700 66 L780 10 L870 58 L960 30 L1060 78 L1150 18 L1240 62 L1330 36 L1440 80 L1440 120 Z" />
    </svg>
  )
}
