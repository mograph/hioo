// Early-2000s scrapbook elements: folders, clothing racks, tape, photo corners
'use client'

import { ReactNode } from 'react'

// ─── FOLDER ────────────────────────────────────────────────────
interface FolderProps {
  /** Items that "stick up" out of the folder pocket (visible above the front face) */
  peekContent?: ReactNode
  /** Title shown at the bottom of the folder front */
  title: string
  /** Subtitle (e.g., "7 items") */
  subtitle?: string
  /** Optional badge content in bottom-right corner (e.g., avatar / category icon) */
  badge?: ReactNode
  color?: string
  textColor?: string
  className?: string
  onClick?: () => void
}

/**
 * File folder pocket — colored rounded rect where content visually
 * overflows the top edge, like items stuffed in a folder.
 * Inspired by Pinterest "Saved" boards.
 */
export function Folder({
  peekContent,
  title,
  subtitle,
  badge,
  color = '#FCD34D',
  textColor = '#0A0A0A',
  className = '',
  onClick,
}: FolderProps) {
  return (
    <div
      onClick={onClick}
      className={`relative ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Peek content — overflows above the folder pocket */}
      {peekContent && (
        <div className="absolute inset-x-0 -top-12 sm:-top-14 flex items-end justify-center px-3 z-0 pointer-events-none">
          {peekContent}
        </div>
      )}

      {/* Folder front face — solid color rounded rect */}
      <div
        className="relative rounded-[28px] aspect-[5/4] flex flex-col justify-end p-4 z-10"
        style={{
          background: color,
          // Subtle inner top-edge shadow so the pocket reads as a pocket
          boxShadow: 'inset 0 6px 12px -4px rgba(0,0,0,0.10), 0 8px 16px -4px rgba(0,0,0,0.08)',
        }}
      >
        {/* Title + subtitle, anchored bottom-left like the reference */}
        <div className="relative z-20" style={{ color: textColor }}>
          <p className="font-display text-xl leading-tight">{title}</p>
          {subtitle && (
            <p className="text-xs mt-0.5 opacity-70">{subtitle}</p>
          )}
        </div>

        {/* Optional badge bottom-right */}
        {badge && (
          <div className="absolute bottom-3 right-3 z-30">
            {badge}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── HANGER ────────────────────────────────────────────────────
interface HangerProps {
  size?: number
  color?: string
  className?: string
}

/** SVG clothes hanger — wire/metal style */
export function Hanger({ size = 60, color = '#404040', className = '' }: HangerProps) {
  return (
    <svg viewBox="0 0 100 50" width={size} className={className} fill="none">
      {/* Hook */}
      <path
        d="M50 4 Q50 10 53 12 Q56 14 56 18"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Triangle body */}
      <path
        d="M50 18 L8 42 L92 42 Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Bottom bar */}
      <line x1="8" y1="42" x2="92" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── RACK ──────────────────────────────────────────────────────
/** Horizontal clothing rack rod with chrome shine — used as a section header */
export function RackRod({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Left bracket */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#404040] rounded-l-sm" />
      {/* Right bracket */}
      <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#404040] rounded-r-sm" />
      {/* The rod itself — chrome gradient */}
      <div
        className="h-3 mx-1.5 rounded-full"
        style={{
          background: 'linear-gradient(180deg, #B8B8B8 0%, #ECECEC 30%, #888 60%, #5A5A5A 100%)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  )
}

/** Item hanging from a hanger — wraps content with hanger above and slight sway */
export function HangingItem({
  children,
  hangerColor = '#404040',
  className = '',
}: {
  children: ReactNode
  hangerColor?: string
  className?: string
}) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Hanger size={56} color={hangerColor} className="-mb-1 relative z-10" />
      <div className="w-full" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>
        {children}
      </div>
    </div>
  )
}

// ─── TAPE ──────────────────────────────────────────────────────
interface TapeProps {
  color?: string
  width?: number
  rotate?: number
  className?: string
}

/** Washi tape strip — semi-transparent with paper texture */
export function Tape({ color = '#FFE0D0', width = 60, rotate = -8, className = '' }: TapeProps) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        width,
        height: 18,
        background: color,
        opacity: 0.85,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        backgroundImage: 'linear-gradient(90deg, transparent 0%, transparent 49%, rgba(0,0,0,0.05) 50%, transparent 51%, transparent 100%)',
        backgroundSize: '8px 100%',
      }}
    />
  )
}

// ─── PHOTO CORNERS ─────────────────────────────────────────────
/** Triangular paper corner mounts — for scrapbook photos */
export function PhotoCorners({ color = '#0A0A0A', className = '' }: { color?: string; className?: string }) {
  return (
    <>
      <div
        className={`absolute top-0 left-0 w-4 h-4 ${className}`}
        style={{
          background: color,
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          opacity: 0.85,
        }}
      />
      <div
        className={`absolute top-0 right-0 w-4 h-4 ${className}`}
        style={{
          background: color,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
          opacity: 0.85,
        }}
      />
      <div
        className={`absolute bottom-0 left-0 w-4 h-4 ${className}`}
        style={{
          background: color,
          clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
          opacity: 0.85,
        }}
      />
      <div
        className={`absolute bottom-0 right-0 w-4 h-4 ${className}`}
        style={{
          background: color,
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
          opacity: 0.85,
        }}
      />
    </>
  )
}

// ─── PAPERCLIP ─────────────────────────────────────────────────
/** SVG paperclip for adding to corners of cards */
export function Paperclip({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 32 48" width={size} className={className} fill="none" stroke="#888" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 8 L22 32 Q22 42 12 42 Q4 42 4 32 L4 14 Q4 8 10 8 Q16 8 16 14 L16 30 Q16 34 12 34 Q9 34 9 30 L9 18" />
    </svg>
  )
}
