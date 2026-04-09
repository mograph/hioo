'use client'
import { type BodyShape } from '@/lib/bodyShape'

interface Props {
  bodyShape?: BodyShape | null
  opacity?: number
  className?: string
}

const SHAPE_FILES: Record<BodyShape, string> = {
  'hourglass': '/body-shapes/hourglass.svg',
  'pear': '/body-shapes/pear.svg',
  'apple': '/body-shapes/apple.svg',
  'rectangle': '/body-shapes/rectangle.svg',
  'inverted-triangle': '/body-shapes/inverted-triangle.svg',
}

export default function BodySilhouette({ bodyShape, opacity = 0.85, className = '' }: Props) {
  const file = bodyShape ? SHAPE_FILES[bodyShape] : '/body-shapes/rectangle.svg'

  return (
    <img
      src={file}
      alt={bodyShape || 'body shape'}
      className={className}
      style={{ opacity }}
    />
  )
}
