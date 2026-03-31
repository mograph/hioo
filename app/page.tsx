'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faImages, faShirt, faGrip, faCalendarDays, faChartLine, faLightbulb, faPerson, faFlask } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) return null

  if (user) return <AuthenticatedHome name={user.displayName || user.email?.split('@')[0] || 'you'} />

  return (
    <div className="min-h-screen pb-nav">
      {/* Hero */}
      <section className="px-6 pt-24 pb-16 max-w-2xl mx-auto">
        <div className="animate-fade-in">
          <div className="inline-block bg-[#B8F044] rounded-full px-4 py-1.5 mb-6">
            <span className="font-display text-sm font-bold text-[#0A0A0A]">Your digital wardrobe</span>
          </div>
          <h1 className="font-display text-[2.75rem] sm:text-6xl font-bold text-[#0A0A0A] leading-[1.05] mb-5 tracking-tight">
            Know what<br/>you own.<br/>
            <span className="text-[#FF6B35]">Wear what<br/>you love.</span>
          </h1>
          <p className="text-lg text-[#525252] leading-relaxed mb-8 max-w-md">
            Stop overbuying. Start re-discovering your wardrobe. Capture fits, track wears, and find your style.
          </p>
          <div className="flex gap-3">
            <Link href="/auth/register" className="btn-primary text-base !px-8 !py-3.5">
              Get Started
            </Link>
            <Link href="#how" className="btn-secondary text-base !px-8 !py-3.5">
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how" className="px-6 py-16 max-w-2xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-[#0A0A0A] mb-8">
          Three things.<br/>That&apos;s it.
        </h2>
        <div className="space-y-4">
          {[
            { num: '01', title: 'Capture', desc: 'Snap your outfit. Every day.', color: 'bg-[#FFE0D0]', accent: 'text-[#FF6B35]' },
            { num: '02', title: 'Organize', desc: 'Your entire closet, digitized and searchable.', color: 'bg-[#E0F2FE]', accent: 'text-[#0369A1]' },
            { num: '03', title: 'Discover', desc: 'See what you actually wear. Find hidden gems.', color: 'bg-[#D1FAE5]', accent: 'text-[#047857]' },
          ].map(f => (
            <div key={f.num} className={`${f.color} rounded-2xl p-6`}>
              <span className={`font-display text-sm font-bold ${f.accent}`}>{f.num}</span>
              <h3 className="font-display text-2xl font-bold text-[#0A0A0A] mt-1">{f.title}</h3>
              <p className="text-[#525252] mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 max-w-2xl mx-auto">
        <div className="bg-[#0A0A0A] rounded-3xl px-8 py-14 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Ready?
          </h2>
          <p className="text-white/50 mb-8 text-lg">It&apos;s free. No credit card.</p>
          <Link href="/auth/register" className="inline-block bg-[#B8F044] text-[#0A0A0A] px-8 py-3.5 rounded-full font-display font-bold text-lg hover:bg-[#C8F864] transition-colors">
            Start Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E5E5] mt-8">
        <div className="max-w-2xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="font-display text-lg font-bold">hioo</span>
          <p className="text-[13px] text-[#A3A3A3]">&copy; 2026</p>
        </div>
      </footer>
    </div>
  )
}

function AuthenticatedHome({ name }: { name: string }) {
  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const quickActions = [
    { href: '/capture', title: 'Capture\nMoment', color: 'bg-[#B8F044]', textColor: 'text-[#0A0A0A]', icon: faCamera },
    { href: '/moments', title: 'My\nDiary', color: 'bg-[#FFE0D0]', textColor: 'text-[#C2410C]', icon: faImages },
  ]

  const features = [
    { href: '/closet', title: 'My Closet', color: 'bg-[#E0F2FE]', icon: faShirt, iconColor: 'text-[#0369A1]' },
    { href: '/outfits', title: 'Outfits', color: 'bg-[#EDE9FE]', icon: faGrip, iconColor: 'text-[#6D28D9]' },
    { href: '/calendar', title: 'Calendar', color: 'bg-[#FEF9C3]', icon: faCalendarDays, iconColor: 'text-[#A16207]' },
    { href: '/analytics', title: 'Analytics', color: 'bg-[#D1FAE5]', icon: faChartLine, iconColor: 'text-[#047857]' },
    { href: '/recommend', title: 'Suggest', color: 'bg-[#FFE0E6]', icon: faLightbulb, iconColor: 'text-[#BE123C]' },
    { href: '/avatar', title: 'Try-On', color: 'bg-[#FFE0D0]', icon: faPerson, iconColor: 'text-[#C2410C]' },
  ]

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      {/* Greeting */}
      <div className="mb-6 pt-2">
        <p className="text-[#A3A3A3] font-display text-sm font-semibold">{greeting()}</p>
        <h1 className="font-display text-3xl font-bold text-[#0A0A0A] tracking-tight mt-0.5">
          {name} 👋
        </h1>
      </div>

      {/* Quick actions — big cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {quickActions.map(a => (
          <Link key={a.href} href={a.href}>
            <div className={`${a.color} rounded-2xl p-5 h-36 flex flex-col justify-between card-color`}>
              <FontAwesomeIcon icon={a.icon} className={`w-7 h-7 ${a.textColor}`} />
              <p className={`font-display text-lg font-bold leading-tight whitespace-pre-line ${a.textColor}`}>
                {a.title}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {features.map(f => (
          <Link key={f.href} href={f.href}>
            <div className={`${f.color} rounded-2xl p-4 text-center card-color aspect-square flex flex-col items-center justify-center gap-1.5`}>
              <FontAwesomeIcon icon={f.icon} className={`w-6 h-6 ${f.iconColor}`} />
              <p className="font-display text-xs font-bold text-[#0A0A0A]">{f.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Demo data link */}
      <Link href="/demo" className="block mt-6">
        <div className="bg-[#F5F5F5] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faFlask} className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-[#0A0A0A]">Load Demo Data</p>
            <p className="text-xs text-[#A3A3A3]">26 items, 8 outfits, wear history</p>
          </div>
        </div>
      </Link>
    </div>
  )
}
