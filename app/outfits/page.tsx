'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getOutfits } from '@/lib/db'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Folder } from '@/components/Scrapbook'

// Color palette per occasion — bright, confident colors like the reference
const OCCASION_COLORS: Record<string, { color: string; text: string }> = {
  casual:        { color: '#FCD34D', text: '#0A0A0A' },  // yellow
  formal:        { color: '#0A0A0A', text: '#FFFFFF' },  // black
  business:      { color: '#60A5FA', text: '#0A0A0A' },  // blue
  'date night':  { color: '#F87171', text: '#0A0A0A' },  // red/coral
  cozy:          { color: '#C4B5FD', text: '#0A0A0A' },  // purple
}

const FALLBACK_COLORS = [
  { color: '#FCD34D', text: '#0A0A0A' }, // yellow
  { color: '#60A5FA', text: '#0A0A0A' }, // blue
  { color: '#FB923C', text: '#0A0A0A' }, // orange
  { color: '#C4B5FD', text: '#0A0A0A' }, // purple
  { color: '#F87171', text: '#0A0A0A' }, // red
  { color: '#86EFAC', text: '#0A0A0A' }, // green
]

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
    <div
      className="max-w-lg mx-auto px-5 py-6 pb-nav min-h-screen"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
      }}
    >
      {/* Header — huge title left, count + add button right (matches reference) */}
      <div className="flex items-end justify-between mb-8 mt-2">
        <h1 className="font-display text-5xl text-[#0A0A0A] tracking-tight leading-none">Saved</h1>
        <div className="flex items-center gap-3">
          <span className="font-display text-sm text-[#525252]">{outfits.length} folders</span>
          <Link
            href="/outfits/create"
            className="w-10 h-10 rounded-full bg-[#F0EBE0] hover:bg-[#E5E0D5] flex items-center justify-center transition-colors"
            aria-label="New outfit"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-[#0A0A0A]" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin" />
        </div>
      ) : outfits.length === 0 ? (
        <div className="max-w-xs mx-auto mt-12">
          <Folder
            title="Empty"
            subtitle="0 looks"
            color="#FCD34D"
            peekContent={
              <div className="text-3xl pb-3 opacity-50">📁</div>
            }
          />
          <div className="text-center mt-6">
            <Link href="/outfits/create" className="btn-primary !text-sm">Create your first look</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 pt-12">
          {outfits.map((outfit: any, i: number) => {
            const items = outfit.items || []
            const previewItems = items.slice(0, 3)
            const colors = OCCASION_COLORS[outfit.occasion?.toLowerCase()] || FALLBACK_COLORS[i % FALLBACK_COLORS.length]

            return (
              <Folder
                key={outfit.id}
                title={outfit.name}
                subtitle={`${items.length} ${items.length === 1 ? 'piece' : 'pieces'}`}
                color={colors.color}
                textColor={colors.text}
                onClick={() => {/* future: drill into outfit */}}
                peekContent={
                  <div className="flex items-end justify-center">
                    {previewItems.map((it: any, j: number) => {
                      // Stagger: slight rotations, varied heights, overlapping each other
                      const rotations = ['-rotate-6', 'rotate-3', '-rotate-3']
                      const offsets = ['translate-y-3', 'translate-y-0', 'translate-y-2']
                      // Taller-than-wide polaroids so a real portion sticks up above the pocket
                      const widths = ['w-16', 'w-20', 'w-16']
                      const zIdx = j === 1 ? 'z-20' : j === 0 ? 'z-10' : 'z-10'
                      return (
                        <div
                          key={j}
                          className={`bg-white p-1.5 pb-4 rounded-sm shadow-lg ${rotations[j]} ${offsets[j]} ${widths[j]} ${zIdx} ${j > 0 ? '-ml-4' : ''}`}
                        >
                          <div className="aspect-[3/4] bg-[#F5F5F5] overflow-hidden">
                            {it.clothingItem?.imageUrl ? (
                              <img src={it.clothingItem.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">
                                {it.clothingItem?.category === 'tops' ? '👕' : it.clothingItem?.category === 'bottoms' ? '👖' : '🧥'}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                }
                badge={
                  outfit.occasion ? (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-display uppercase"
                      style={{ background: 'rgba(255,255,255,0.5)', color: colors.text }}
                    >
                      {outfit.occasion[0].toUpperCase()}
                    </div>
                  ) : undefined
                }
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
