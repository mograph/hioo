'use client'
import Link from 'next/link'
import { useMemo } from 'react'

interface ClothingItem {
  id: string
  name: string
  category: string
  color?: string | null
  brand?: string | null
  imageUrl?: string | null
  timesWorn: number
}

interface ClothingItemCardProps {
  item: ClothingItem
  selectable?: boolean
  selected?: boolean
  onSelect?: (id: string) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  tops: 'cat-tops',
  bottoms: 'cat-bottoms',
  shoes: 'cat-shoes',
  accessories: 'cat-accessories',
  outerwear: 'cat-outerwear',
}

export default function ClothingItemCard({ item, selectable, selected, onSelect }: ClothingItemCardProps) {
  const rotation = useMemo(() => Math.floor(Math.random() * 7) - 3, [])

  const handleClick = () => {
    if (selectable && onSelect) onSelect(item.id)
  }

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-200 ${
        selected ? 'scale-95 ring-4 ring-[#cc2200] ring-offset-2 ring-offset-transparent' : ''
      }`}
      style={{ transform: selectable ? undefined : `rotate(${rotation}deg)` }}
      onClick={handleClick}
    >
      <div className="pushpin pushpin-top-center" />
      <div className="polaroid bg-white shadow-lg hover:shadow-2xl transition-shadow">
        <div className="w-full aspect-square bg-gray-100 overflow-hidden mb-2">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#faf5e4] to-[#e8d5b0]">
              <span className="text-4xl">
                {item.category === 'tops' ? '👕' :
                 item.category === 'bottoms' ? '👖' :
                 item.category === 'shoes' ? '👟' :
                 item.category === 'accessories' ? '👜' : '🧥'}
              </span>
            </div>
          )}
        </div>
        <div className="px-1">
          <p className="font-handwritten text-lg text-[#2d1f0e] truncate">{item.name}</p>
          <div className="flex items-center justify-between mt-1">
            <span className={`label-tag text-xs ${CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-600'}`}>
              {item.category}
            </span>
            <span className="text-xs text-gray-400 font-handwritten">×{item.timesWorn}</span>
          </div>
          {item.brand && <p className="text-xs text-gray-400 mt-0.5 truncate">{item.brand}</p>}
        </div>
      </div>
      {!selectable && (
        <Link
          href={`/closet/${item.id}`}
          className="absolute inset-0 z-20"
          aria-label={item.name}
        />
      )}
    </div>
  )
}
