'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faShirt, faCamera, faImages, faUser, faGrip, faCalendarDays, faChartLine, faLightbulb, faPerson, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const tabs = [
  { href: '/', label: 'Home', icon: faHouse },
  { href: '/closet', label: 'Closet', icon: faShirt },
  { href: '/capture', label: 'Capture', icon: faCamera, isCenter: true },
  { href: '/moments', label: 'Diary', icon: faImages },
  { href: '/profile', label: 'You', icon: faUser },
]

const desktopLinks = [
  { href: '/closet', label: 'Closet', icon: faShirt },
  { href: '/moments', label: 'Diary', icon: faImages },
  { href: '/outfits', label: 'Outfits', icon: faGrip },
  { href: '/calendar', label: 'Calendar', icon: faCalendarDays },
  { href: '/analytics', label: 'Analytics', icon: faChartLine },
  { href: '/recommend', label: 'Suggest', icon: faLightbulb },
  { href: '/avatar', label: 'Try-On', icon: faPerson },
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
              className={`px-3 py-1.5 rounded-full text-[13px] font-semibold font-display transition-all flex items-center gap-1.5 ${
                pathname === link.href
                  ? 'bg-[#0A0A0A] text-white'
                  : 'text-[#525252] hover:text-[#0A0A0A] hover:bg-[#F5F5F5]'
              }`}
            >
              <FontAwesomeIcon icon={link.icon} className="w-3.5 h-3.5" />
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-[#525252] font-medium">{user.displayName || user.email}</span>
          <button onClick={() => signOut()} className="text-[#A3A3A3] hover:text-[#0A0A0A] transition-colors">
            <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
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
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 min-w-[56px] py-1 ${
                tab.isCenter ? '' : isActive ? 'text-[#0A0A0A]' : 'text-[#A3A3A3]'
              }`}
            >
              {tab.isCenter ? (
                <div className="w-12 h-12 -mt-5 bg-[#0A0A0A] rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
                  <FontAwesomeIcon icon={tab.icon} className="w-5 h-5 text-white" />
                </div>
              ) : (
                <>
                  <FontAwesomeIcon icon={tab.icon} className="w-5 h-5" />
                  <span className={`text-[10px] font-semibold font-display ${isActive ? 'text-[#0A0A0A]' : 'text-[#A3A3A3]'}`}>
                    {tab.label}
                  </span>
                </>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )

  // Mobile top bar
  const mobileTopBar = user && (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl">
      <div className="px-5 flex items-center justify-between h-12">
        <span className="font-display text-lg font-bold text-[#0A0A0A] tracking-tight">hioo</span>
        <Link href="/profile" className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
          <FontAwesomeIcon icon={faUser} className="w-3.5 h-3.5 text-[#525252]" />
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
