'use client'

interface FilterBarProps {
  filters: {
    category: string
    color: string
    occasion: string
    season: string
  }
  onChange: (key: string, value: string) => void
}

const CATEGORIES = ['all', 'tops', 'bottoms', 'shoes', 'accessories', 'outerwear']
const OCCASIONS = ['all', 'casual', 'formal', 'business', 'informal']
const SEASONS = ['all', 'spring', 'summer', 'fall', 'winter']
const COLORS = ['all', 'black', 'white', 'gray', 'navy', 'blue', 'red', 'pink', 'green', 'beige', 'brown', 'yellow', 'purple', 'orange']

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="bg-[#2d1f0e]/60 backdrop-blur-sm rounded-xl p-4 border border-[#8B6914]/30 shadow-inner">
      <p className="font-handwritten text-[#faf5e4] text-lg mb-3">Filter your closet</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-[#faf5e4]/60 uppercase tracking-wider mb-1 block">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full bg-[#faf5e4] text-[#2d1f0e] rounded-lg px-3 py-2 text-sm font-handwritten border-2 border-[#c8a06a] focus:border-[#cc2200] focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c === 'all' ? '' : c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-[#faf5e4]/60 uppercase tracking-wider mb-1 block">Color</label>
          <select
            value={filters.color}
            onChange={(e) => onChange('color', e.target.value)}
            className="w-full bg-[#faf5e4] text-[#2d1f0e] rounded-lg px-3 py-2 text-sm font-handwritten border-2 border-[#c8a06a] focus:border-[#cc2200] focus:outline-none"
          >
            {COLORS.map((c) => (
              <option key={c} value={c === 'all' ? '' : c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-[#faf5e4]/60 uppercase tracking-wider mb-1 block">Occasion</label>
          <select
            value={filters.occasion}
            onChange={(e) => onChange('occasion', e.target.value)}
            className="w-full bg-[#faf5e4] text-[#2d1f0e] rounded-lg px-3 py-2 text-sm font-handwritten border-2 border-[#c8a06a] focus:border-[#cc2200] focus:outline-none"
          >
            {OCCASIONS.map((o) => (
              <option key={o} value={o === 'all' ? '' : o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-[#faf5e4]/60 uppercase tracking-wider mb-1 block">Season</label>
          <select
            value={filters.season}
            onChange={(e) => onChange('season', e.target.value)}
            className="w-full bg-[#faf5e4] text-[#2d1f0e] rounded-lg px-3 py-2 text-sm font-handwritten border-2 border-[#c8a06a] focus:border-[#cc2200] focus:outline-none"
          >
            {SEASONS.map((s) => (
              <option key={s} value={s === 'all' ? '' : s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
