'use client'
import Link from 'next/link'
import { useMemo } from 'react'

interface OutfitCardProps {
  outfit: {
    id: string
    name: string
    occasion?: string | null
    date?: string | null
    imageUrl?: string | null
    items: Array<{
      clothingItem: {
        id: string
        name: string
        imageUrl?: string | null
        category: string
      }
    }>
  }
  showLink?: boolean
}

export default function OutfitCard({ outfit, showLink = true }: OutfitCardProps) {
  const rotation = useMemo(() => Math.floor(Math.random() * 5) - 2, [])

  return (
    <div
      className="relative group"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="pushpin pushpin-top-center" />
      <div className="polaroid bg-white shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-105">
        <div className="w-full aspect-square bg-gray-50 overflow-hidden mb-2 relative">
          {outfit.imageUrl ? (
            <img src={outfit.imageUrl} alt={outfit.name} className="w-full h-full object-cover" />
          ) : (
            <div className="grid grid-cols-2 gap-0.5 p-1 h-full">
              {outfit.items.slice(0, 4).map(({ clothingItem }) => (
                <div key={clothingItem.id} className="bg-gradient-to-br from-[#faf5e4] to-[#e8d5b0] flex items-center justify-center rounded overflow-hidden">
                  {clothingItem.imageUrl ? (
                    <img src={clothingItem.imageUrl} alt={clothingItem.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">
                      {clothingItem.category === 'tops' ? '👕' :
                       clothingItem.category === 'bottoms' ? '👖' :
                       clothingItem.category === 'shoes' ? '👟' :
                       clothingItem.category === 'accessories' ? '👜' : '🧥'}
                    </span>
                  )}
                </div>
              ))}
              {outfit.items.length === 0 && (
                <div className="col-span-2 row-span-2 flex items-center justify-center text-4xl">✨</div>
              )}
            </div>
          )}
          {outfit.occasion && (
            <div className="absolute bottom-1 left-1 right-1">
              <span className="label-tag text-xs bg-[#faf5e4]/90">{outfit.occasion}</span>
            </div>
          )}
        </div>
        <p className="font-handwritten text-lg text-[#2d1f0e] truncate px-1">{outfit.name}</p>
        <p className="text-xs text-gray-400 px-1 font-handwritten">{outfit.items.length} pieces</p>
        {outfit.date && (
          <p className="text-xs text-gray-400 px-1">
            {new Date(outfit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        )}
      </div>
      {showLink && (
        <Link href={`/outfits/${outfit.id}`} className="absolute inset-0 z-20" aria-label={outfit.name} />
      )}
    </div>
  )
}
