'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getItems } from '@/lib/db'
import { useRouter } from 'next/navigation'
import ClothingItemCard from '@/components/ClothingItemCard'

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

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      <div className="mb-5">
        <h1 className="font-display text-3xl font-bold text-[#0A0A0A] tracking-tight">My Closet</h1>
        <p className="text-[#A3A3A3] font-display text-sm font-semibold">{items.length} pieces</p>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold font-display whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-[#0A0A0A] text-white'
                : 'bg-[#F5F5F5] text-[#525252] hover:bg-[#E5E5E5]'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-[#F5F5F5] rounded-3xl p-8">
            <span className="text-4xl">👗</span>
            <p className="font-display text-xl font-bold text-[#0A0A0A] mt-3">Empty closet</p>
            <p className="text-[#A3A3A3] text-sm mt-1">Load demo data or start adding pieces</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item: any) => (
            <div key={item.id} className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-[#F5F5F5] flex items-center justify-center">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">
                    {item.category === 'tops' ? '👕' : item.category === 'bottoms' ? '👖' :
                     item.category === 'shoes' ? '👟' : item.category === 'accessories' ? '👜' : '🧥'}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="font-display text-sm font-bold text-[#0A0A0A] truncate">{item.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] font-bold font-display uppercase text-[#A3A3A3]">{item.brand || item.category}</span>
                  <span className="text-[10px] font-bold font-display text-[#525252]">{item.timesWorn}x worn</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
