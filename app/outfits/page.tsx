'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getOutfits } from '@/lib/db'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faShirt } from '@fortawesome/free-solid-svg-icons'

export default function OutfitsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [outfits, setOutfits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      getOutfits(user.uid)
        .then(data => { setOutfits(data); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [user])

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-3xl text-[#0A0A0A] tracking-tight">Outfits</h1>
          <p className="text-[#A3A3A3] text-sm">{outfits.length} looks</p>
        </div>
        <Link href="/outfits/create" className="bg-[#B8F044] text-[#0A0A0A] px-5 py-2.5 rounded-full font-display text-sm flex items-center gap-1.5">
          <FontAwesomeIcon icon={faPlus} className="w-3 h-3" /> New Look
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin" />
        </div>
      ) : outfits.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-[#EDE9FE] rounded-3xl p-8">
            <FontAwesomeIcon icon={faShirt} className="w-10 h-10 text-[#6D28D9] mb-3" />
            <p className="font-display text-xl text-[#0A0A0A] mt-1">No outfits yet</p>
            <p className="text-[#525252] text-sm mt-1 mb-4">Create your first look</p>
            <Link href="/outfits/create" className="btn-primary !text-sm">Create Look</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {outfits.map((outfit: any) => {
            const items = outfit.items || []
            const gridItems = items.slice(0, 4)
            return (
              <div key={outfit.id} className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden hover:shadow-md transition-shadow">
                {/* Item images grid */}
                <div className={`grid ${gridItems.length === 1 ? 'grid-cols-1' : gridItems.length === 2 ? 'grid-cols-2' : gridItems.length === 3 ? 'grid-cols-3' : 'grid-cols-2 grid-rows-2'} gap-px bg-[#E5E5E5]`}>
                  {gridItems.map((item: any, i: number) => (
                    <div key={i} className={`bg-[#F5F5F5] flex items-center justify-center overflow-hidden ${gridItems.length <= 2 ? 'aspect-[3/2]' : 'aspect-square'}`}>
                      {item.clothingItem?.imageUrl ? (
                        <img src={item.clothingItem.imageUrl} alt={item.clothingItem.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">
                          {item.clothingItem?.category === 'tops' ? '👕' : item.clothingItem?.category === 'bottoms' ? '👖' :
                           item.clothingItem?.category === 'shoes' ? '👟' : item.clothingItem?.category === 'accessories' ? '👜' : '🧥'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display text-lg text-[#0A0A0A]">{outfit.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {outfit.occasion && (
                          <span className="text-[10px] font-display uppercase px-2.5 py-0.5 rounded-full bg-[#F5F5F5] text-[#525252]">
                            {outfit.occasion}
                          </span>
                        )}
                        <span className="text-[11px] text-[#A3A3A3]">{items.length} pieces</span>
                      </div>
                    </div>
                    {items.length > 4 && (
                      <span className="text-xs font-display text-[#A3A3A3]">+{items.length - 4} more</span>
                    )}
                  </div>

                  {/* Piece names */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {items.map((item: any, i: number) => (
                      <span key={i} className="text-[10px] font-display px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#525252]">
                        {item.clothingItem?.name || 'Item'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
