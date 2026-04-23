'use client'
import { useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { getCategoryIcon } from '@/lib/garmentIllustrations'

interface Props {
  category: string
  items: any[]
  selectedIndex: number
  locked: boolean
  onSelect: (index: number) => void
  onToggleLock: () => void
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  tops:        { bg: 'bg-[#FFE0D0]', text: 'text-[#C2410C]' },
  bottoms:     { bg: 'bg-[#E0F2FE]', text: 'text-[#0369A1]' },
  shoes:       { bg: 'bg-[#FFE0E6]', text: 'text-[#BE123C]' },
  outerwear:   { bg: 'bg-[#EDE9FE]', text: 'text-[#6D28D9]' },
  accessories: { bg: 'bg-[#D1FAE5]', text: 'text-[#047857]' },
}

export default function CategoryCarousel({ category, items, selectedIndex, locked, onSelect, onToggleLock }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const colors = CATEGORY_COLORS[category] || { bg: 'bg-[#F5F5F5]', text: 'text-[#525252]' }

  // When selectedIndex changes externally (shuffle), scroll the carousel to that item
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const child = el.children[selectedIndex] as HTMLElement | undefined
    if (child) {
      el.scrollTo({ left: child.offsetLeft - el.offsetLeft - 16, behavior: 'smooth' })
    }
  }, [selectedIndex])

  // Detect which item is centered as user scrolls
  const handleScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    const center = el.scrollLeft + el.clientWidth / 2
    let closestIdx = 0
    let closestDist = Infinity
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as HTMLElement
      const childCenter = child.offsetLeft + child.offsetWidth / 2 - el.offsetLeft
      const dist = Math.abs(center - childCenter)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = i
      }
    }
    if (closestIdx !== selectedIndex) onSelect(closestIdx)
  }

  if (!items.length) {
    return (
      <div className={`${colors.bg} rounded-2xl p-4 opacity-60`}>
        <p className={`font-display text-xs uppercase ${colors.text} mb-1`}>{category}</p>
        <p className="text-xs text-[#A3A3A3]">No items in your closet</p>
      </div>
    )
  }

  const selected = items[selectedIndex]

  return (
    <div className={`${locked ? 'bg-white border-2 border-[#0A0A0A]' : 'bg-white border border-[#E5E5E5]'} rounded-2xl overflow-hidden transition-all`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#F5F5F5]">
        <div className="flex items-center gap-2">
          <span className={`font-display text-[11px] uppercase px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
            {category}
          </span>
          <span className="text-[10px] text-[#A3A3A3] font-display">
            {selectedIndex + 1}/{items.length}
          </span>
        </div>
        <button
          onClick={onToggleLock}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${locked ? 'bg-[#0A0A0A] text-white' : 'bg-[#F5F5F5] text-[#525252] hover:bg-[#E5E5E5]'}`}
          aria-label={locked ? 'Unlock' : 'Lock'}
        >
          <FontAwesomeIcon icon={locked ? faLock : faLockOpen} className="w-3 h-3" />
        </button>
      </div>

      {/* Scroller */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 py-4 no-scrollbar"
        style={{ scrollPaddingLeft: '16px', scrollPaddingRight: '16px' }}
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onSelect(i)}
            className={`snap-center flex-shrink-0 w-28 transition-transform ${i === selectedIndex ? 'scale-100' : 'scale-90 opacity-50'}`}
          >
            <div className="aspect-square bg-[#F5F5F5] rounded-xl flex items-center justify-center overflow-hidden">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="opacity-40 p-3">{getCategoryIcon(item.category, 48)}</div>
              )}
            </div>
            <p className="font-display text-[11px] text-[#0A0A0A] mt-1.5 truncate leading-tight">{item.name}</p>
            {item.bodyScore && (
              <span className={`text-[9px] font-display px-1.5 py-0.5 rounded-full mt-0.5 inline-block ${item.bodyScore >= 70 ? 'bg-[#D1FAE5] text-[#047857]' : 'bg-[#F5F5F5] text-[#525252]'}`}>
                {item.bodyScore}%
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Selected item details */}
      {selected && (
        <div className="px-4 pb-3 -mt-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-display uppercase text-[#A3A3A3]">{selected.brand || selected.category}</span>
            {selected.price && <span className="text-[10px] font-display text-[#525252]">${selected.price}</span>}
          </div>
          {selected.bodyTip && (
            <p className="text-[10px] text-[#FF6B35] mt-1 leading-tight">{selected.bodyTip}</p>
          )}
        </div>
      )}
    </div>
  )
}
