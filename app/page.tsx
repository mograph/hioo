'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faImages, faShirt, faGrip, faCalendarDays, faChartLine, faLightbulb, faPerson, faFlask } from '@fortawesome/free-solid-svg-icons'
import { Blob, Sticker, Squiggle, StarBurst } from '@/components/Decorative'

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

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav relative overflow-hidden">
      {/* Floating color blobs for depth */}
      <Blob color="#B8F044" size={260} variant={1} className="-top-20 -right-16" />
      <Blob color="#FFE0D0" size={200} variant={2} className="top-72 -left-12" />
      <Blob color="#EDE9FE" size={220} variant={3} className="top-[420px] -right-20" />

      {/* Greeting */}
      <div className="mb-7 pt-2 relative z-10">
        <p className="text-[#A3A3A3] font-display text-sm">{greeting()}</p>
        <h1 className="font-display text-4xl text-[#0A0A0A] tracking-tight mt-1 leading-none">
          <span className="wavy-underline">Hey {name}</span> 👋
        </h1>
      </div>

      {/* HERO: Capture (huge) + Diary (tall) — bento layout */}
      <div className="grid grid-cols-3 gap-3 mb-3 relative z-10">
        {/* Capture — 2 cols, big */}
        <Link href="/capture" className="col-span-2">
          <div className="bg-[#B8F044] rounded-[36px] p-5 h-44 flex flex-col justify-between relative overflow-hidden card-color">
            <Sticker bg="#0A0A0A" text="#B8F044" rotate="left" className="absolute top-3 right-3">NEW</Sticker>
            <FontAwesomeIcon icon={faCamera} className="w-9 h-9 text-[#0A0A0A]" />
            <div>
              <p className="font-display text-2xl text-[#0A0A0A] leading-none">Capture</p>
              <p className="font-display text-2xl text-[#0A0A0A] leading-tight">your fit</p>
              <Squiggle color="#0A0A0A" className="w-12 h-2 mt-1.5" />
            </div>
          </div>
        </Link>
        {/* Diary — 1 col, tall, asymmetric */}
        <Link href="/moments">
          <div className="bg-[#FFE0D0] bento-tr p-4 h-44 flex flex-col justify-between card-color">
            <FontAwesomeIcon icon={faImages} className="w-7 h-7 text-[#C2410C]" />
            <div>
              <p className="font-display text-lg text-[#C2410C] leading-tight">My Diary</p>
              <p className="text-[10px] font-display uppercase text-[#C2410C]/70 mt-0.5">Photo log</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Wide tile: Suggest */}
      <Link href="/recommend" className="block mb-3 relative z-10">
        <div className="bg-[#FFE0E6] rounded-[28px] p-5 flex items-center gap-4 card-color relative overflow-hidden">
          <div className="relative">
            <StarBurst color="#FF8FA3" size={68} className="absolute -inset-2 -z-10" />
            <FontAwesomeIcon icon={faLightbulb} className="w-7 h-7 text-[#BE123C] relative" />
          </div>
          <div className="flex-1">
            <p className="font-display text-xl text-[#BE123C] leading-tight">Style me today</p>
            <p className="text-[11px] font-display text-[#BE123C]/60">Slide & shuffle outfits for your shape</p>
          </div>
          <span className="text-[#BE123C] text-2xl">→</span>
        </div>
      </Link>

      {/* Bento grid for remaining features — varied shapes & sizes */}
      <div className="grid grid-cols-3 gap-3 relative z-10">
        {/* Closet — square */}
        <Link href="/closet">
          <div className="bg-[#E0F2FE] rounded-[24px] p-3 aspect-square flex flex-col items-center justify-center gap-1.5 card-color">
            <FontAwesomeIcon icon={faShirt} className="w-7 h-7 text-[#0369A1]" />
            <p className="font-display text-xs text-[#0A0A0A]">Closet</p>
          </div>
        </Link>
        {/* Try-On — circle */}
        <Link href="/try-on">
          <div className="bg-[#0A0A0A] rounded-full aspect-square flex flex-col items-center justify-center gap-1 card-color text-center">
            <FontAwesomeIcon icon={faPerson} className="w-7 h-7 text-[#B8F044]" />
            <p className="font-display text-[11px] text-white">Try-On</p>
          </div>
        </Link>
        {/* Outfits — squircle */}
        <Link href="/outfits">
          <div className="bg-[#EDE9FE] squircle p-3 aspect-square flex flex-col items-center justify-center gap-1.5 card-color">
            <FontAwesomeIcon icon={faGrip} className="w-7 h-7 text-[#6D28D9]" />
            <p className="font-display text-xs text-[#0A0A0A]">Outfits</p>
          </div>
        </Link>
        {/* Calendar — bento corner */}
        <Link href="/calendar">
          <div className="bg-[#FEF9C3] bento-bl p-3 aspect-square flex flex-col items-center justify-center gap-1.5 card-color">
            <FontAwesomeIcon icon={faCalendarDays} className="w-7 h-7 text-[#A16207]" />
            <p className="font-display text-xs text-[#0A0A0A]">Calendar</p>
          </div>
        </Link>
        {/* Analytics — squircle */}
        <Link href="/analytics">
          <div className="bg-[#D1FAE5] squircle p-3 aspect-square flex flex-col items-center justify-center gap-1.5 card-color">
            <FontAwesomeIcon icon={faChartLine} className="w-7 h-7 text-[#047857]" />
            <p className="font-display text-xs text-[#0A0A0A]">Analytics</p>
          </div>
        </Link>
        {/* Demo — circle, eye-catching */}
        <Link href="/demo">
          <div className="bg-[#FF6B35] rounded-full aspect-square flex flex-col items-center justify-center gap-1 card-color text-center text-white relative">
            <FontAwesomeIcon icon={faFlask} className="w-7 h-7" />
            <p className="font-display text-[11px]">Demo</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
