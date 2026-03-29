'use client'
import Link from 'next/link'
import { useAuth } from './AuthContext'

export default function CaptureButton() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <Link
      href="/capture"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#1a1a1a] hover:bg-[#333] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 md:w-12 md:h-12 md:bottom-8 md:right-8"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    </Link>
  )
}
