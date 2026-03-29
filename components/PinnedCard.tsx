import { ReactNode } from 'react'

interface PinnedCardProps {
  children: ReactNode
  rotation?: number
  className?: string
  showTape?: boolean
  showPushpin?: boolean
}

export default function PinnedCard({ children, rotation = 0, className = '', showTape = false, showPushpin = true }: PinnedCardProps) {
  return (
    <div
      className={`pinned-card relative ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {showPushpin && (
        <div className="pushpin pushpin-top-center" />
      )}
      {showTape && (
        <div className="tape-strip tape-top" />
      )}
      {children}
    </div>
  )
}
