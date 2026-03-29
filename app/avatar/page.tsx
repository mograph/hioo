'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/AuthContext'
import { fetchWithAuth } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface ClothingItem {
  id: string
  name: string
  category: string
  imageUrl?: string | null
  timesWorn: number
  color?: string | null
  brand?: string | null
}

interface LayeredItem {
  item: ClothingItem
  x: number
  y: number
  scale: number
}

const CATEGORY_POSITIONS: Record<string, { x: number; y: number }> = {
  tops: { x: 150, y: 120 },
  bottoms: { x: 150, y: 280 },
  shoes: { x: 150, y: 450 },
  accessories: { x: 250, y: 80 },
  outerwear: { x: 150, y: 130 },
}

export default function AvatarPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<ClothingItem[]>([])
  const [layered, setLayered] = useState<LayeredItem[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const boardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      fetchWithAuth('/api/items')
        .then((r) => r.json())
        .then(setItems)
    }
  }, [user])

  const CATEGORIES = ['all', 'tops', 'bottoms', 'shoes', 'accessories', 'outerwear']
  const filteredItems = activeCategory === 'all' ? items : items.filter((i) => i.category === activeCategory)

  const addToAvatar = (item: ClothingItem) => {
    const pos = CATEGORY_POSITIONS[item.category] || { x: 150, y: 200 }
    setLayered((prev) => {
      const existing = prev.findIndex((l) => l.item.id === item.id)
      if (existing >= 0) return prev.filter((_, i) => i !== existing)
      return [...prev, { item, x: pos.x - 50, y: pos.y - 50, scale: 1 }]
    })
  }

  const isOnAvatar = (id: string) => layered.some((l) => l.item.id === id)

  const handleMouseDown = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault()
    const layeredItem = layered.find((l) => l.item.id === itemId)
    if (!layeredItem || !boardRef.current) return
    const rect = boardRef.current.getBoundingClientRect()
    setDragging(itemId)
    setDragOffset({
      x: e.clientX - rect.left - layeredItem.x,
      y: e.clientY - rect.top - layeredItem.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !boardRef.current) return
    const rect = boardRef.current.getBoundingClientRect()
    const newX = e.clientX - rect.left - dragOffset.x
    const newY = e.clientY - rect.top - dragOffset.y
    setLayered((prev) =>
      prev.map((l) => l.item.id === dragging ? { ...l, x: newX, y: newY } : l)
    )
  }

  const handleMouseUp = () => setDragging(null)

  const clearAll = () => setLayered([])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-handwritten text-5xl text-[#faf5e4] drop-shadow-md mb-2">Try-On Studio</h1>
      <p className="font-handwritten text-[#faf5e4]/70 text-xl mb-6">Drag pieces onto your silhouette</p>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar canvas */}
        <div className="lg:col-span-2">
          <div className="relative bg-[#faf5e4]/90 rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-[#c8a06a]/30">
              <span className="font-handwritten text-[#2d1f0e] text-lg">Style Board</span>
              <button onClick={clearAll} className="text-sm text-[#cc2200] hover:underline">Clear All</button>
            </div>
            <div
              ref={boardRef}
              className="relative w-full"
              style={{ height: '600px' }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* SVG Silhouette */}
              <svg
                viewBox="0 0 300 600"
                className="absolute inset-0 w-full h-full"
                style={{ opacity: 0.15 }}
              >
                <ellipse cx="150" cy="60" rx="40" ry="50" fill="#2d1f0e" />
                <rect x="135" y="105" width="30" height="30" fill="#2d1f0e" />
                <path d="M90 135 Q75 150 70 200 L70 320 Q70 330 150 330 Q230 330 230 320 L230 200 Q225 150 210 135 L200 130 Q175 140 150 140 Q125 140 100 130 Z" fill="#2d1f0e" />
                <path d="M90 140 Q60 160 50 220 Q45 250 55 260 Q65 270 70 250 Q70 220 90 200 Z" fill="#2d1f0e" />
                <path d="M210 140 Q240 160 250 220 Q255 250 245 260 Q235 270 230 250 Q230 220 210 200 Z" fill="#2d1f0e" />
                <path d="M100 320 Q90 380 88 440 Q86 500 95 530 Q105 540 120 530 Q125 500 125 440 L130 320 Z" fill="#2d1f0e" />
                <path d="M200 320 Q210 380 212 440 Q214 500 205 530 Q195 540 180 530 Q175 500 175 440 L170 320 Z" fill="#2d1f0e" />
                <ellipse cx="105" cy="545" rx="25" ry="12" fill="#2d1f0e" />
                <ellipse cx="195" cy="545" rx="25" ry="12" fill="#2d1f0e" />
              </svg>

              {/* Layered items */}
              {layered.map(({ item, x, y, scale }) => (
                <div
                  key={item.id}
                  className={`absolute cursor-grab active:cursor-grabbing select-none ${dragging === item.id ? 'z-50' : 'z-10'}`}
                  style={{ left: x, top: y, width: 100, height: 100, transform: `scale(${scale})` }}
                  onMouseDown={(e) => handleMouseDown(e, item.id)}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain drop-shadow-lg pointer-events-none"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/80 rounded-lg shadow text-3xl">
                      {item.category === 'tops' ? '👕' : item.category === 'bottoms' ? '👖' :
                       item.category === 'shoes' ? '👟' : item.category === 'accessories' ? '👜' : '🧥'}
                    </div>
                  )}
                  <button
                    className="absolute -top-2 -right-2 bg-[#cc2200] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow"
                    onClick={() => setLayered((prev) => prev.filter((l) => l.item.id !== item.id))}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    ×
                  </button>
                </div>
              ))}

              {layered.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="font-handwritten text-[#8B6914]/50 text-xl">Click items to layer them here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Item picker */}
        <div>
          <div className="bg-[#2d1f0e]/60 rounded-xl p-3 mb-3">
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeCategory === cat ? 'bg-[#faf5e4] text-[#2d1f0e]' : 'text-[#faf5e4]/70 hover:text-[#faf5e4]'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addToAvatar(item)}
                className={`relative group transition-all ${isOnAvatar(item.id) ? 'ring-2 ring-[#cc2200] ring-offset-1' : ''}`}
              >
                <div className="bg-white shadow-md p-2 hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-50 overflow-hidden mb-1">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        {item.category === 'tops' ? '👕' : item.category === 'bottoms' ? '👖' :
                         item.category === 'shoes' ? '👟' : item.category === 'accessories' ? '👜' : '🧥'}
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-handwritten truncate text-[#2d1f0e]">{item.name}</p>
                </div>
                {isOnAvatar(item.id) && (
                  <div className="absolute top-1 right-1 bg-[#cc2200] text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
