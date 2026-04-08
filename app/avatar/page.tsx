'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getItems, getProfile } from '@/lib/db'
import { useRouter } from 'next/navigation'
import BodySilhouette from '@/components/BodySilhouette'
import { type BodyShape } from '@/lib/bodyShape'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPerson, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons'

const CATEGORY_POSITIONS: Record<string, { x: number; y: number }> = {
  tops: { x: 150, y: 120 }, bottoms: { x: 150, y: 280 }, shoes: { x: 150, y: 450 },
  accessories: { x: 250, y: 80 }, outerwear: { x: 150, y: 130 },
}
const CATEGORIES = ['all', 'tops', 'bottoms', 'shoes', 'accessories', 'outerwear']

export default function AvatarPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [layered, setLayered] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [userBodyShape, setUserBodyShape] = useState<BodyShape | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (!authLoading && !user) router.push('/auth/login') }, [authLoading, user, router])
  useEffect(() => {
    if (user) {
      getItems(user.uid).then(setItems).catch(() => {})
      getProfile(user.uid).then((data: any) => {
        if (data.bodyShape) setUserBodyShape(data.bodyShape)
      }).catch(() => {})
    }
  }, [user])

  const filtered = activeCategory === 'all' ? items : items.filter(i => i.category === activeCategory)
  const addToAvatar = (item: any) => {
    const pos = CATEGORY_POSITIONS[item.category] || { x: 150, y: 200 }
    setLayered(prev => {
      const idx = prev.findIndex(l => l.item.id === item.id)
      if (idx >= 0) return prev.filter((_, i) => i !== idx)
      return [...prev, { item, x: pos.x - 50, y: pos.y - 50, scale: 1 }]
    })
  }
  const isOnAvatar = (id: string) => layered.some(l => l.item.id === id)

  const handleMouseDown = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault()
    const l = layered.find(l => l.item.id === itemId)
    if (!l || !boardRef.current) return
    const rect = boardRef.current.getBoundingClientRect()
    setDragging(itemId)
    setDragOffset({ x: e.clientX - rect.left - l.x, y: e.clientY - rect.top - l.y })
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !boardRef.current) return
    const rect = boardRef.current.getBoundingClientRect()
    setLayered(prev => prev.map(l => l.item.id === dragging ? { ...l, x: e.clientX - rect.left - dragOffset.x, y: e.clientY - rect.top - dragOffset.y } : l))
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-6 pb-nav">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0A0A0A] tracking-tight">Try-On</h1>
          <p className="text-[#A3A3A3] font-display text-sm font-semibold">Drag pieces onto the board</p>
        </div>
        {layered.length > 0 && (
          <button onClick={() => setLayered([])} className="text-sm font-display font-bold text-[#FF6B35]">
            <FontAwesomeIcon icon={faTrash} className="w-3 h-3 mr-1" />Clear
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Canvas */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div ref={boardRef} className="relative w-full" style={{ height: '500px' }}
              onMouseMove={handleMouseMove} onMouseUp={() => setDragging(null)} onMouseLeave={() => setDragging(null)}>
              <BodySilhouette bodyShape={userBodyShape} className="absolute inset-0 w-full h-full" />

              {layered.map(({ item, x, y, scale }) => (
                <div key={item.id} className={`absolute cursor-grab active:cursor-grabbing select-none ${dragging === item.id ? 'z-50' : 'z-10'}`}
                  style={{ left: x, top: y, width: 100, height: 100, transform: `scale(${scale})` }}
                  onMouseDown={e => handleMouseDown(e, item.id)}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain drop-shadow-lg pointer-events-none" draggable={false} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#F5F5F5] rounded-2xl text-3xl">
                      {item.category === 'tops' ? '👕' : item.category === 'bottoms' ? '👖' : item.category === 'shoes' ? '👟' : item.category === 'accessories' ? '👜' : '🧥'}
                    </div>
                  )}
                  <button className="absolute -top-2 -right-2 bg-[#0A0A0A] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    onClick={() => setLayered(prev => prev.filter(l => l.item.id !== item.id))} onMouseDown={e => e.stopPropagation()}>×</button>
                </div>
              ))}

              {layered.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <FontAwesomeIcon icon={faPerson} className="w-12 h-12 text-[#E5E5E5] mb-2" />
                    <p className="font-display text-sm font-bold text-[#D4D4D4]">Click items to add</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Item picker */}
        <div>
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-display whitespace-nowrap ${activeCategory === cat ? 'bg-[#0A0A0A] text-white' : 'bg-[#F5F5F5] text-[#525252]'}`}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-[460px] overflow-y-auto">
            {filtered.map((item: any) => (
              <button key={item.id} onClick={() => addToAvatar(item)}
                className={`rounded-2xl overflow-hidden border-2 transition-all ${isOnAvatar(item.id) ? 'border-[#B8F044] ring-2 ring-[#B8F044]/30' : 'border-[#E5E5E5]'}`}>
                <div className="aspect-square bg-[#F5F5F5] flex items-center justify-center relative">
                  {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : (
                    <span className="text-2xl">{item.category === 'tops' ? '👕' : item.category === 'bottoms' ? '👖' : item.category === 'shoes' ? '👟' : item.category === 'accessories' ? '👜' : '🧥'}</span>
                  )}
                  {isOnAvatar(item.id) && (
                    <div className="absolute top-1 right-1 bg-[#B8F044] text-[#0A0A0A] rounded-full w-5 h-5 flex items-center justify-center">
                      <FontAwesomeIcon icon={faCheck} className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] font-display font-bold text-center p-1.5 truncate">{item.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
