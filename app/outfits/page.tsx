'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getOutfits } from '@/lib/db'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faShirt } from '@fortawesome/free-solid-svg-icons'
import { Folder, Tape, Paperclip } from '@/components/Scrapbook'
import { Blob, Sticker } from '@/components/Decorative'

// Color palette for folder tabs by occasion — like color-coded file folders
const OCCASION_COLORS: Record<string, { tab: string; body: string; text: string }> = {
  casual:        { tab: '#B8F044', body: '#E8F9C7', text: '#3F5C0A' },
  formal:        { tab: '#0A0A0A', body: '#3F3F3F', text: '#FFFFFF' },
  business:      { tab: '#7DD3FC', body: '#DCF0FB', text: '#0C4A6E' },
  'date night':  { tab: '#FF8FA3', body: '#FFE0E6', text: '#9F1239' },
  cozy:          { tab: '#C4B5FD', body: '#EDE9FE', text: '#5B21B6' },
}

const DEFAULT_COLORS = { tab: '#E8D8B7', body: '#F4E9D2', text: '#5C4A1F' }

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
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav relative overflow-hidden">
      <Blob color="#FFE0D0" size={240} variant={1} className="-top-12 -right-16" />
      <Blob color="#EDE9FE" size={200} variant={3} className="top-[400px] -left-12" />

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div>
          <h1 className="font-display text-4xl text-[#0A0A0A] tracking-tight leading-none">
            <span className="wavy-underline">My Files</span>
          </h1>
          <p className="text-[#A3A3A3] font-display text-sm mt-1.5">{outfits.length} looks on file</p>
        </div>
        <Link
          href="/outfits/create"
          className="bg-[#B8F044] text-[#0A0A0A] px-5 py-2.5 rounded-full font-display text-sm flex items-center gap-1.5 shadow-pop"
        >
          <FontAwesomeIcon icon={faPlus} className="w-3 h-3" /> New Look
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin" />
        </div>
      ) : outfits.length === 0 ? (
        <div className="text-center py-16 relative z-10">
          <Folder label="Empty" tabColor="#E8D8B7" bodyColor="#F4E9D2" textColor="#5C4A1F" tilt="left" className="max-w-sm mx-auto">
            <div className="px-3 py-8 text-center">
              <FontAwesomeIcon icon={faShirt} className="w-10 h-10 text-[#5C4A1F]/40 mb-3" />
              <p className="font-display text-xl text-[#5C4A1F]">No outfits yet</p>
              <p className="text-[#5C4A1F]/70 text-sm mt-1 mb-4">Create your first look</p>
              <Link href="/outfits/create" className="btn-primary !text-sm">Create Look</Link>
            </div>
          </Folder>
        </div>
      ) : (
        <div className="space-y-5 relative z-10">
          {outfits.map((outfit: any, i: number) => {
            const items = outfit.items || []
            const previewItems = items.slice(0, 3)
            const colors = OCCASION_COLORS[outfit.occasion?.toLowerCase()] || DEFAULT_COLORS
            const tilt = i % 3 === 0 ? 'right' : i % 3 === 2 ? 'left' : 'none'
            const tapeRotate = i % 2 === 0 ? -8 : 6
            return (
              <div key={outfit.id} className="relative">
                <Folder
                  label={outfit.occasion || 'Look'}
                  tabColor={colors.tab}
                  bodyColor={colors.body}
                  textColor={colors.text}
                  tilt={tilt}
                >
                  {/* Tape strip across the top of the folder body */}
                  <Tape
                    color="#FFFEF7"
                    width={80}
                    rotate={tapeRotate}
                    className="top-1 right-4"
                  />
                  {/* Paperclip in the corner */}
                  <Paperclip size={26} className="absolute -top-3 right-2 z-20" />

                  {/* Outfit name handwritten style */}
                  <div className="px-2 pt-2 pb-3">
                    <p className="font-display text-2xl leading-tight" style={{ color: colors.text }}>
                      {outfit.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-display uppercase opacity-70" style={{ color: colors.text }}>
                        {items.length} pieces
                      </span>
                    </div>
                  </div>

                  {/* Item photos — overlapping like polaroids inside the folder */}
                  <div className="relative h-44 mb-2 px-2">
                    {previewItems.map((it: any, j: number) => {
                      const offsets = [
                        { left: '0%', top: '8px', rotate: '-4deg' },
                        { left: '32%', top: '0px', rotate: '2deg' },
                        { left: '60%', top: '12px', rotate: '-2deg' },
                      ]
                      const o = offsets[j]
                      return (
                        <div
                          key={j}
                          className="absolute bg-white p-1.5 pb-4 rounded-sm shadow-soft"
                          style={{
                            left: o.left,
                            top: o.top,
                            transform: `rotate(${o.rotate})`,
                            width: '38%',
                            zIndex: j + 1,
                          }}
                        >
                          <div className="aspect-square bg-[#F5F5F5] overflow-hidden rounded-sm">
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
                    {items.length > 3 && (
                      <Sticker
                        bg="#0A0A0A"
                        text="white"
                        rotate="right"
                        className="!absolute bottom-1 right-2 z-20 !text-[10px]"
                      >
                        +{items.length - 3} more
                      </Sticker>
                    )}
                  </div>

                  {/* Piece labels — like file index entries */}
                  <div className="border-t border-dashed pt-2 px-2" style={{ borderColor: colors.text + '33' }}>
                    <div className="flex flex-wrap gap-1">
                      {items.map((item: any, k: number) => (
                        <span
                          key={k}
                          className="text-[9px] font-display uppercase px-2 py-0.5 rounded-sm bg-white/60"
                          style={{ color: colors.text }}
                        >
                          {item.clothingItem?.name || 'Item'}
                        </span>
                      ))}
                    </div>
                  </div>
                </Folder>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
