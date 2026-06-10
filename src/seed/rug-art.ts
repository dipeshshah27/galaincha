// Procedurally drawn rug artwork for seed data — nested khaden borders and a
// diamond medallion, rendered to PNG via sharp at seed time.

export type Colorway = {
  ground: string
  field: string
  border: string
  medallion: string
  accent: string
}

export function rugSVG({ ground, field, border, medallion, accent }: Colorway): string {
  const cornerMotifs = [
    'translate(150 180)',
    'translate(650 180) scale(-1 1)',
    'translate(150 820) scale(1 -1)',
    'translate(650 820) scale(-1 -1)',
  ]
    .map(
      (transform) => `
  <g transform="${transform}">
    <path d="M0 0 L70 0 L70 14 L14 14 L14 70 L0 70 Z" fill="${accent}"/>
    <path d="M30 30 L84 30 L84 42 L42 42 L42 84 L30 84 Z" fill="${border}" opacity="0.7"/>
  </g>`,
    )
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="${ground}"/>
  <rect x="24" y="24" width="752" height="952" rx="12" fill="${field}"/>
  <rect x="52" y="52" width="696" height="896" fill="none" stroke="${border}" stroke-width="12"/>
  <rect x="84" y="84" width="632" height="832" fill="none" stroke="${accent}" stroke-width="5" stroke-dasharray="28 16"/>
  <g opacity="0.08" stroke="${ground}" stroke-width="1">
    ${Array.from({ length: 49 }, (_, i) => `<line x1="${24 + i * 16}" y1="24" x2="${24 + i * 16}" y2="976"/>`).join('')}
  </g>
  ${cornerMotifs}
  <g transform="translate(400 500)">
    <path d="M0 -300 L225 0 L0 300 L-225 0 Z" fill="${medallion}"/>
    <path d="M0 -238 L178 0 L0 238 L-178 0 Z" fill="none" stroke="${accent}" stroke-width="8"/>
    <path d="M0 -172 L128 0 L0 172 L-128 0 Z" fill="${ground}"/>
    <path d="M0 -106 L78 0 L0 106 L-78 0 Z" fill="${accent}"/>
    <path d="M0 -52 L38 0 L0 52 L-38 0 Z" fill="${medallion}"/>
    <circle r="11" fill="${ground}"/>
  </g>
</svg>`
}
