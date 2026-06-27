import { ImageResponse } from 'next/og'

// Brand share card shown when the site is linked on social / chat. Applies to
// every route under this layout. ImageResponse (Satori) requires inline style
// objects and every multi-child element to declare `display: flex`.
export const alt = 'Shah Washing — handwoven Himalayan carpets, rugs and carpet washing in Kathmandu'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const WOOL = '#f6f0e3'
const CRIMSON = '#ae1a37'
const MARIGOLD = '#d2941f'
const INK = '#33281c'
const INK_SOFT = '#71614d'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: WOOL,
          padding: '72px 80px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 104,
              height: 104,
              borderRadius: 24,
              backgroundColor: WOOL,
              border: `4px solid ${MARIGOLD}`,
              color: CRIMSON,
              fontSize: 56,
              fontWeight: 700,
            }}
          >
            SW
          </div>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: INK_SOFT,
            }}
          >
            Kathmandu, Nepal
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 104, fontWeight: 700, color: CRIMSON, lineHeight: 1.05 }}>
            Shah Washing
          </div>
          <div style={{ marginTop: 24, fontSize: 40, color: INK, lineHeight: 1.25 }}>
            Handwoven Himalayan carpets, custom rugs & professional carpet washing.
          </div>
        </div>

        <div style={{ display: 'flex', height: 14, width: '100%' }}>
          <div style={{ flex: 1, backgroundColor: CRIMSON }} />
          <div style={{ flex: 1, backgroundColor: MARIGOLD }} />
          <div style={{ flex: 1, backgroundColor: INK }} />
        </div>
      </div>
    ),
    { ...size },
  )
}
