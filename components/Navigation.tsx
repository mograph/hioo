'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthContext'

const tabs = [
  { href: '/', label: 'Home', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
  )},
  { href: '/closet', label: 'Closet', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="3"/><line x1="12" y1="3" x2="12" y2="21"/><path d="M7 9h2M15 9h2"/></svg>
  )},
  { href: '/capture', label: 'Capture', icon: () => (
    <div className="w-12 h-12 -mt-5 bg-[#0A0A0A] rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
    </div>
  )},
  { href: '/moments', label: 'Diary', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
  )},
  { href: '/profile', label: 'You', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>
  )},
]

const desktopLinks = [
  { href: '/closet', label: 'Closet' },
  { href: '/moments', label: 'Diary' },
  { href: '/outfits', label: 'Outfits' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/recommend', label: 'Suggest' },
  { href: '/avatar', label: 'Try-On' },
]

export default function Navigation() {
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()

  if (loading) return null

  // Desktop top nav
  const desktopNav = user && (
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        <Link href="/" className="font-display text-xl font-bold text-[#0A0A0A] tracking-tight">
          hioo
        </Link>
        <div className="flex items-center gap-1">
          {desktopLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-full text-[13px] font-semibold font-display transition-all ${
                pathname === link.href
                  ? 'bg-[#0A0A0A] text-white'
                  : 'text-[#525252] hover:text-[#0A0A0A] hover:bg-[#F5F5F5]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-[#525252] font-medium">{user.displayName || user.email}</span>
          <button onClick={() => signOut()} className="text-[13px] text-[#A3A3A3] hover:text-[#0A0A0A] font-medium">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )

  // Unauthenticated top nav
  const unauthNav = !user && (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        <Link href="/" className="font-display text-xl font-bold text-[#0A0A0A] tracking-tight">
          hioo
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-[13px] font-semibold font-display text-[#525252] hover:text-[#0A0A0A]">
            Sign In
          </Link>
          <Link href="/auth/register" className="btn-primary !py-2 !px-5 !text-[13px]">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )

  // Mobile bottom tab bar
  const mobileNav = user && (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-[#E5E5E5]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-end justify-around px-2 pt-2 pb-1">
        {tabs.map(tab => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
          const isCapture = tab.href === '/capture'
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 ${
                isCapture ? '' : isActive ? 'text-[#0A0A0A]' : 'text-[#A3A3A3]'
              }`}
            >
              {tab.icon(isActive)}
              {!isCapture && (
                <span className={`text-[10px] font-semibold font-display ${isActive ? 'text-[#0A0A0A]' : 'text-[#A3A3A3]'}`}>
                  {tab.label}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )

  // Mobile top bar (minimal, just logo)
  const mobileTopBar = user && (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl">
      <div className="px-5 flex items-center justify-between h-12">
        <span className="font-display text-lg font-bold text-[#0A0A0A] tracking-tight">hioo</span>
        <Link href="/profile" className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
          <span className="text-sm font-bold font-display text-[#525252]">
            {(user.displayName || user.email || '?')[0].toUpperCase()}
          </span>
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {desktopNav}
      {unauthNav}
      {mobileTopBar}
      {mobileNav}
    </>
  )
}
