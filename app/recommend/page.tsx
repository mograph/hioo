'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getItems, getRecommendations } from '@/lib/db'
import { useRouter } from 'next/navigation'

const OCCASIONS = ['casual', 'formal', 'business', 'date night']

export default function RecommendPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [allItems, setAllItems] = useState<any[]>([])
  const [occasion, setOccasion] = useState('')
  const [temperature, setTemperature] = useState('')
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) getItems(user.uid).then(setAllItems).catch(() => {})
  }, [user])

  const handleGenerate = () => {
    setLoading(true); setHasSearched(true)
    const results = getRecommendations(allItems, occasion || undefined, temperature ? parseFloat(temperature) : undefined)
    setRecommendations(results); setLoading(false)
  }

  const handleSurprise = () => {
    setOccasion(''); setTemperature(''); setLoading(true); setHasSearched(true)
    const results = getRecommendations(allItems)
    setRecommendations(results); setLoading(false)
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      <h1 className="font-display text-3xl font-bold text-[#0A0A0A] tracking-tight">Suggest</h1>
      <p className="text-[#A3A3A3] font-display text-sm font-semibold mb-5">Let hioo pick a look</p>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-5">
        <p className="font-display text-sm font-bold mb-2">Occasion</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {OCCASIONS.map(o => (
            <button key={o} onClick={() => setOccasion(occasion === o ? '' : o)}
              className={`px-4 py-2 rounded-full text-sm font-bold font-display transition-all ${occasion === o ? 'bg-[#0A0A0A] text-white' : 'bg-[#F5F5F5] text-[#525252]'}`}>
              {o}
            </button>
          ))}
        </div>
        <p className="font-display text-sm font-bold mb-2">Temperature</p>
        <input type="number" value={temperature} onChange={e => setTemperature(e.target.value)} placeholder="°C"
          className="w-full px-4 py-2.5 rounded-xl border-2 border-[#E5E5E5] text-sm font-medium focus:outline-none focus:border-[#0A0A0A] mb-4" />
        <div className="flex gap-2">
          <button onClick={handleGenerate} disabled={loading} className="flex-1 btn-primary !py-3">Suggest</button>
          <button onClick={handleSurprise} disabled={loading} className="px-5 py-3 bg-[#B8F044] text-[#0A0A0A] rounded-full font-display font-bold text-sm">🎲 Random</button>
        </div>
      </div>

      {hasSearched && recommendations.length === 0 && !loading && (
        <div className="bg-[#FEF9C3] rounded-2xl p-6 text-center">
          <p className="font-display font-bold">No matches</p>
          <p className="text-sm text-[#525252] mt-1">Try different filters or add more items</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-bold mb-3">Your Look</h2>
          <div className="grid grid-cols-2 gap-3">
            {recommendations.map((item: any) => (
              <div key={item.id} className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                <div className="aspect-square bg-[#F5F5F5] flex items-center justify-center">
                  {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : (
                    <span className="text-3xl">{item.category === 'tops' ? '👕' : item.category === 'bottoms' ? '👖' : item.category === 'shoes' ? '👟' : item.category === 'accessories' ? '👜' : '🧥'}</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-display text-sm font-bold truncate">{item.name}</p>
                  <p className="text-[10px] font-display font-bold uppercase text-[#A3A3A3]">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
