'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getOutfits } from '@/lib/db'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
          <h1 className="font-display text-3xl font-bold text-[#0A0A0A] tracking-tight">Outfits</h1>
          <p className="text-[#A3A3A3] font-display text-sm font-semibold">{outfits.length} looks</p>
        </div>
        <Link href="/outfits/create" className="bg-[#B8F044] text-[#0A0A0A] px-5 py-2.5 rounded-full font-display font-bold text-sm hover:bg-[#C8F864] transition-colors">
          + New Look
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin" />
        </div>
      ) : outfits.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-[#EDE9FE] rounded-3xl p-8">
            <span className="text-4xl">✨</span>
            <p className="font-display text-xl font-bold text-[#0A0A0A] mt-3">No outfits yet</p>
            <p className="text-[#525252] text-sm mt-1 mb-4">Create your first look</p>
            <Link href="/outfits/create" className="btn-primary !text-sm">Create Look</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {outfits.map((outfit: any) => (
            <div key={outfit.id} className="bg-white rounded-2xl border border-[#E5E5E5] p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex -space-x-2">
                  {(outfit.items || []).slice(0, 3).map((item: any, i: number) => (
                    <div key={i} className="w-12 h-12 rounded-xl bg-[#F5F5F5] border-2 border-white flex items-center justify-center text-lg overflow-hidden">
                      {item.clothingItem?.imageUrl ? (
                        <img src={item.clothingItem.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        item.clothingItem?.category === 'tops' ? '👕' : item.clothingItem?.category === 'bottoms' ? '👖' : '👗'
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-base font-bold text-[#0A0A0A] truncate">{outfit.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {outfit.occasion && (
                      <span className="text-[10px] font-bold font-display uppercase px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#525252]">
                        {outfit.occasion}
                      </span>
                    )}
                    <span className="text-[11px] text-[#A3A3A3]">{(outfit.items || []).length} pieces</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
