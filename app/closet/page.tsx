'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getItems } from '@/lib/db'
import { useRouter } from 'next/navigation'
import { getCategoryIcon } from '@/lib/garmentIllustrations'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
import { Blob, Sticker } from '@/components/Decorative'

const CATEGORIES = ['all', 'tops', 'bottoms', 'shoes', 'accessories', 'outerwear']

export default function ClosetPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [authLoading, user, router])

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getItems(user.uid)
      .then(data => { setItems(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  const filtered = activeCategory === 'all' ? items : items.filter(i => i.category === activeCategory)

  // Asymmetric tile shapes — alternate to break the grid feel
  const SHAPES = ['rounded-[28px]', 'bento-tr', 'rounded-[28px]', 'bento-bl', 'squircle', 'bento-br', 'rounded-[28px]', 'bento-tl']

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav relative overflow-hidden">
      <Blob color="#E0F2FE" size={240} variant={2} className="-top-12 -right-16" />
      <Blob color="#D1FAE5" size={180} variant={1} className="top-[400px] -left-12" />

      <div className="mb-5 relative z-10">
        <h1 className="font-display text-4xl text-[#0A0A0A] tracking-tight leading-none">
          <span className="wavy-underline">My Closet</span>
        </h1>
        <p className="text-[#A3A3A3] font-display text-sm mt-1.5">{items.length} pieces in rotation</p>
      </div>

      {/* Category pills — bigger, with shadow on active */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1 no-scrollbar relative z-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-display whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-[#0A0A0A] text-white shadow-pop'
                : 'bg-white text-[#525252] hover:bg-[#F5F5F5] border border-[#E5E5E5]'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 relative z-10">
          <div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 relative z-10">
          <div className="bg-[#FFE0E6] rounded-[36px] p-8">
            <span className="text-4xl">👗</span>
            <p className="font-display text-xl text-[#0A0A0A] mt-3">Empty closet</p>
            <p className="text-[#A3A3A3] text-sm mt-1">Load demo data or start adding pieces</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 relative z-10">
          {filtered.map((item: any, i: number) => (
            <div key={item.id} className={`bg-white ${SHAPES[i % SHAPES.length]} overflow-hidden shadow-soft hover:shadow-pop transition-all`}>
              <div className="relative aspect-square bg-[#F5F5F5] flex items-center justify-center p-3">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="opacity-30">
                    {getCategoryIcon(item.category, 64)}
                  </div>
                )}
                {item.timesWorn >= 30 && (
                  <Sticker bg="#B8F044" text="#0A0A0A" rotate="left" className="absolute top-2 left-2 !text-[9px] !px-2 !py-1">
                    Fave
                  </Sticker>
                )}
                {item.imageUrl && ['tops', 'bottoms', 'outerwear'].includes(item.category) && (
                  <Link href={`/try-on?item=${item.id}`}
                    className="absolute bottom-2 right-2 bg-[#0A0A0A] text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-[#262626] shadow-pop"
                    aria-label="Try on">
                    <FontAwesomeIcon icon={faWandMagicSparkles} className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
              <div className="p-3">
                <p className="font-display text-sm text-[#0A0A0A] truncate">{item.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] font-display uppercase text-[#A3A3A3] truncate">{item.brand || item.category}</span>
                  <span className="text-[10px] font-display text-[#525252] flex-shrink-0 ml-1">{item.timesWorn}×</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
