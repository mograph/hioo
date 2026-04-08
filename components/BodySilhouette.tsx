'use client'
import { type BodyShape } from '@/lib/bodyShape'

interface Props {
  bodyShape?: BodyShape | null
  opacity?: number
  className?: string
}

// Pre-drawn silhouette proportions per body shape
const SHAPES: Record<BodyShape, { bust: number; waist: number; hips: number }> = {
  'hourglass':         { bust: 100, waist: 65, hips: 100 },
  'pear':              { bust: 80,  waist: 65, hips: 110 },
  'apple':             { bust: 105, waist: 90, hips: 85 },
  'rectangle':         { bust: 90,  waist: 85, hips: 90 },
  'inverted-triangle': { bust: 110, waist: 75, hips: 80 },
}

export default function BodySilhouette({ bodyShape, opacity = 0.08, className = '' }: Props) {
  const shape = bodyShape ? SHAPES[bodyShape] : SHAPES['rectangle']
  const { bust, waist, hips } = shape

  // Scale factors (base is 90 for rectangle)
  const bustW = bust * 0.7
  const waistW = waist * 0.7
  const hipW = hips * 0.7

  const cx = 150

  return (
    <svg viewBox="0 0 300 600" className={`${className}`} style={{ opacity }}>
      {/* Head */}
      <ellipse cx={cx} cy="55" rx="35" ry="42" fill="#0A0A0A" />
      {/* Neck */}
      <rect x={cx - 12} y="93" width="24" height="25" rx="4" fill="#0A0A0A" />
      {/* Torso */}
      <path d={`
        M ${cx - bustW/2} 118
        Q ${cx - bustW/2 - 5} 160 ${cx - waistW/2} 220
        Q ${cx - waistW/2 - 2} 260 ${cx - hipW/2} 300
        L ${cx - hipW/2} 330
        Q ${cx} 340 ${cx + hipW/2} 330
        L ${cx + hipW/2} 300
        Q ${cx + waistW/2 + 2} 260 ${cx + waistW/2} 220
        Q ${cx + bustW/2 + 5} 160 ${cx + bustW/2} 118
        Q ${cx + 15} 115 ${cx} 115
        Q ${cx - 15} 115 ${cx - bustW/2} 118
        Z
      `} fill="#0A0A0A" />
      {/* Left arm */}
      <path d={`
        M ${cx - bustW/2 - 5} 125
        Q ${cx - bustW/2 - 35} 160 ${cx - bustW/2 - 40} 220
        Q ${cx - bustW/2 - 42} 240 ${cx - bustW/2 - 35} 248
        Q ${cx - bustW/2 - 28} 255 ${cx - bustW/2 - 25} 240
        Q ${cx - bustW/2 - 20} 200 ${cx - bustW/2 + 5} 170
      `} fill="#0A0A0A" />
      {/* Right arm */}
      <path d={`
        M ${cx + bustW/2 + 5} 125
        Q ${cx + bustW/2 + 35} 160 ${cx + bustW/2 + 40} 220
        Q ${cx + bustW/2 + 42} 240 ${cx + bustW/2 + 35} 248
        Q ${cx + bustW/2 + 28} 255 ${cx + bustW/2 + 25} 240
        Q ${cx + bustW/2 + 20} 200 ${cx + bustW/2 - 5} 170
      `} fill="#0A0A0A" />
      {/* Left leg */}
      <path d={`
        M ${cx - hipW/4 - 10} 330
        Q ${cx - hipW/4 - 15} 400 ${cx - hipW/4 - 17} 460
        Q ${cx - hipW/4 - 18} 510 ${cx - hipW/4 - 10} 535
        Q ${cx - hipW/4} 542 ${cx - hipW/4 + 10} 535
        Q ${cx - hipW/4 + 12} 510 ${cx - hipW/4 + 10} 460
        L ${cx - 5} 330
      `} fill="#0A0A0A" />
      {/* Right leg */}
      <path d={`
        M ${cx + hipW/4 + 10} 330
        Q ${cx + hipW/4 + 15} 400 ${cx + hipW/4 + 17} 460
        Q ${cx + hipW/4 + 18} 510 ${cx + hipW/4 + 10} 535
        Q ${cx + hipW/4} 542 ${cx + hipW/4 - 10} 535
        Q ${cx + hipW/4 - 12} 510 ${cx + hipW/4 - 10} 460
        L ${cx + 5} 330
      `} fill="#0A0A0A" />
      {/* Feet */}
      <ellipse cx={cx - hipW/4 - 5} cy="548" rx="22" ry="10" fill="#0A0A0A" />
      <ellipse cx={cx + hipW/4 + 5} cy="548" rx="22" ry="10" fill="#0A0A0A" />
    </svg>
  )
}
