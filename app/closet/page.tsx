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
import { Hanger, RackRod } from '@/components/Scrapbook'

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

  // Items that would actually hang from a rack (clothing). Others go below as a "shelf"
  const HANGABLE = ['tops', 'bottoms', 'outerwear']
  const hangingItems = filtered.filter(i => HANGABLE.includes(i.category))
  const shelfItems = filtered.filter(i => !HANGABLE.includes(i.category))

  // Group hanging items into rows of 2 so each rack rod has a sensible width
  const hangingRows: any[][] = []
  for (let i = 0; i < hangingItems.length; i += 2) {
    hangingRows.push(hangingItems.slice(i, i + 2))
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav relative overflow-hidden">
      <Blob color="#E0F2FE" size={240} variant={2} className="-top-12 -right-16" />
      <Blob color="#D1FAE5" size={180} variant={1} className="top-[500px] -left-12" />

      <div className="mb-5 relative z-10">
        <h1 className="font-display text-4xl text-[#0A0A0A] tracking-tight leading-none">
          <span className="wavy-underline">My Closet</span>
        </h1>
        <p className="text-[#A3A3A3] font-display text-sm mt-1.5">{items.length} pieces in rotation</p>
      </div>

      {/* Category pills */}
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
        <div className="space-y-8 relative z-10">
          {/* HANGING — actual clothing rack */}
          {hangingRows.length > 0 && (
            <div>
              <p className="text-[10px] font-display uppercase text-[#A3A3A3] mb-2 px-1">On the rack</p>
              <div className="space-y-7">
                {hangingRows.map((row, rowIdx) => (
                  <div key={rowIdx}>
                    <RackRod className="mb-0" />
                    <div className="grid grid-cols-2 gap-3 -mt-3">
                      {row.map((item: any) => (
                        <div key={item.id} className="flex flex-col items-center pt-2">
                          {/* Hanger SVG sits on top */}
                          <Hanger size={68} color="#3F3F46" className="-mb-2 relative z-10" />
                          {/* Garment hangs below */}
                          <div
                            className="bg-white rounded-b-[16px] rounded-t-md w-full overflow-hidden relative"
                            style={{ filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.10))' }}
                          >
                            <div className="aspect-square bg-[#FAFAFA] flex items-center justify-center p-2">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="opacity-30">{getCategoryIcon(item.category, 56)}</div>
                              )}
                              {item.timesWorn >= 30 && (
                                <Sticker bg="#B8F044" text="#0A0A0A" rotate="left" className="absolute top-1.5 left-1.5 !text-[8px] !px-1.5 !py-0.5">
                                  Fave
                                </Sticker>
                              )}
                              {item.imageUrl && (
                                <Link href={`/try-on?item=${item.id}`}
                                  className="absolute bottom-1.5 right-1.5 bg-[#0A0A0A] text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-[#262626] shadow-pop"
                                  aria-label="Try on">
                                  <FontAwesomeIcon icon={faWandMagicSparkles} className="w-3 h-3" />
                                </Link>
                              )}
                            </div>
                            <div className="px-2 py-1.5">
                              <p className="font-display text-xs text-[#0A0A0A] truncate leading-tight">{item.name}</p>
                              <div className="flex items-center justify-between mt-0.5">
                                <span className="text-[9px] font-display uppercase text-[#A3A3A3] truncate">{item.brand || item.category}</span>
                                <span className="text-[9px] font-display text-[#525252] flex-shrink-0 ml-1">{item.timesWorn}×</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SHELF — shoes, accessories sit on a wood shelf */}
          {shelfItems.length > 0 && (
            <div>
              <p className="text-[10px] font-display uppercase text-[#A3A3A3] mb-2 px-1">On the shelf</p>
              {/* The shelf itself */}
              <div className="relative">
                <div className="grid grid-cols-3 gap-3 px-1">
                  {shelfItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl overflow-hidden relative"
                      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.10))' }}
                    >
                      <div className="aspect-square bg-[#FAFAFA] flex items-center justify-center p-2 relative">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <div className="opacity-30">{getCategoryIcon(item.category, 48)}</div>
                        )}
                        {item.timesWorn >= 30 && (
                          <Sticker bg="#B8F044" text="#0A0A0A" rotate="left" className="absolute top-1 left-1 !text-[8px] !px-1.5 !py-0.5">
                            Fave
                          </Sticker>
                        )}
                      </div>
                      <div className="px-2 py-1.5">
                        <p className="font-display text-[11px] text-[#0A0A0A] truncate leading-tight">{item.name}</p>
                        <span className="text-[8px] font-display uppercase text-[#A3A3A3] truncate block">{item.brand || item.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Wooden shelf line */}
                <div
                  className="h-2 mt-2 rounded-sm"
                  style={{
                    background: 'linear-gradient(180deg, #C9A878 0%, #A88457 50%, #8B6A40 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
