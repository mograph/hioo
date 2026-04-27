// Reusable visual flourishes — blobs, waves, stickers, squiggles.
// Pure SVG / divs with no logic. Use these to break up grids and add personality.

interface BlobProps {
  color: string
  size?: number
  className?: string
  variant?: 1 | 2 | 3
}

/** Soft, blurred color blob for layering behind content */
export function Blob({ color, size = 200, className = '', variant = 1 }: BlobProps) {
  return (
    <div
      className={`blob-accent blob-${variant} ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
      }}
    />
  )
}

/** Wavy section divider — used between cards to add visual rhythm */
export function WaveDivider({ color = '#0A0A0A', className = '' }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 12" preserveAspectRatio="none" className={`w-full h-3 ${className}`}>
      <path
        d="M0 6 Q 25 0 50 6 T 100 6 T 150 6 T 200 6"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Squiggle line — fun filler accent */
export function Squiggle({ color = '#FF6B35', className = '' }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 60 14" className={className} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <path d="M3 7 Q 10 1 17 7 T 31 7 T 45 7 T 57 7" />
    </svg>
  )
}

interface StickerProps {
  children: React.ReactNode
  bg: string
  text: string
  rotate?: 'left' | 'right'
  className?: string
}

/** Sticker badge — floats over cards, adds personality */
export function Sticker({ children, bg, text, rotate = 'left', className = '' }: StickerProps) {
  return (
    <span
      className={`sticker ${rotate === 'right' ? 'sticker-r' : ''} ${className}`}
      style={{ background: bg, color: text }}
    >
      {children}
    </span>
  )
}

/** Star burst — energetic accent shape behind big numbers */
export function StarBurst({ color = '#B8F044', size = 80, className = '' }: { color?: string; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <polygon
        points="50,5 58,40 95,40 65,60 75,95 50,75 25,95 35,60 5,40 42,40"
        fill={color}
      />
    </svg>
  )
}

/** Circle accent — for pull-quotes and number callouts */
export function Circle({ color = '#FFE0D0', size = 100, className = '' }: { color?: string; size?: number; className?: string }) {
  return (
    <div
      className={`rounded-full ${className}`}
      style={{ width: size, height: size, background: color }}
    />
  )
}
