'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getItems, addOutfit } from '@/lib/db'
import { useRouter } from 'next/navigation'

const OCCASIONS = ['casual', 'formal', 'business', 'date night', 'cozy']
const CATEGORIES = ['all', 'tops', 'bottoms', 'shoes', 'accessories', 'outerwear']

export default function CreateOutfitPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [form, setForm] = useState({ name: '', occasion: '', date: '' })
  const [saving, setSaving] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      getItems(user.uid).then(data => { setItems(data); setFetching(false) }).catch(() => setFetching(false))
    }
  }, [user])

  const toggleItem = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const filtered = activeCategory === 'all' ? items : items.filter(i => i.category === activeCategory)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !selectedIds.length || !user) return
    setSaving(true)
    await addOutfit(user.uid, { ...form, itemIds: selectedIds })
    router.push('/outfits')
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.back()} className="text-[#A3A3A3] hover:text-[#0A0A0A]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 className="font-display text-2xl font-bold text-[#0A0A0A] tracking-tight">Create Look</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-5">
        <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Name this look..." className="w-full text-lg font-display font-bold placeholder:text-[#D4D4D4] focus:outline-none mb-3" />
        <div className="flex flex-wrap gap-2 mb-3">
          {OCCASIONS.map(o => (
            <button key={o} type="button" onClick={() => setForm({ ...form, occasion: form.occasion === o ? '' : o })}
              className={`px-3 py-1.5 rounded-full text-xs font-bold font-display transition-all ${form.occasion === o ? 'bg-[#0A0A0A] text-white' : 'bg-[#F5F5F5] text-[#525252]'}`}>
              {o}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-display font-semibold text-[#A3A3A3]">{selectedIds.length} selected</span>
          {form.name && selectedIds.length > 0 && (
            <button onClick={handleSubmit} disabled={saving}
              className="ml-auto bg-[#B8F044] text-[#0A0A0A] px-5 py-2 rounded-full font-display font-bold text-sm">
              {saving ? 'Saving...' : 'Save Look'}
            </button>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold font-display whitespace-nowrap ${activeCategory === cat ? 'bg-[#0A0A0A] text-white' : 'bg-[#F5F5F5] text-[#525252]'}`}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Items grid */}
      {fetching ? (
        <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {filtered.map((item: any) => (
            <button key={item.id} onClick={() => toggleItem(item.id)}
              className={`rounded-2xl overflow-hidden border-2 transition-all ${selectedIds.includes(item.id) ? 'border-[#B8F044] ring-2 ring-[#B8F044]/30' : 'border-transparent'}`}>
              <div className="aspect-square bg-[#F5F5F5] flex items-center justify-center">
                {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : (
                  <span className="text-2xl">{item.category === 'tops' ? '👕' : item.category === 'bottoms' ? '👖' : item.category === 'shoes' ? '👟' : item.category === 'accessories' ? '👜' : '🧥'}</span>
                )}
              </div>
              <p className="text-[10px] font-display font-bold text-center p-1.5 truncate">{item.name}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
