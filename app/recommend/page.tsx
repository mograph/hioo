'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getItems, getRecommendations, getProfile } from '@/lib/db'
import { scoreItemForBody, type BodyShape, type AccentuationGoal } from '@/lib/bodyShape'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles, faDice, faTemperatureHalf, faPerson } from '@fortawesome/free-solid-svg-icons'

const OCCASIONS = ['casual', 'formal', 'business', 'date night', 'cozy']

export default function RecommendPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [allItems, setAllItems] = useState<any[]>([])
  const [occasion, setOccasion] = useState('')
  const [temperature, setTemperature] = useState('')
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [bodyAware, setBodyAware] = useState(false)
  const [bodyShape, setBodyShape] = useState<BodyShape | null>(null)
  const [styleGoals, setStyleGoals] = useState<AccentuationGoal[]>([])

  useEffect(() => { if (!authLoading && !user) router.push('/auth/login') }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      getItems(user.uid).then(setAllItems).catch(() => {})
      getProfile(user.uid).then((data: any) => {
        if (data.bodyShape) { setBodyShape(data.bodyShape); setBodyAware(true) }
        if (data.styleGoals) setStyleGoals(data.styleGoals)
      }).catch(() => {})
    }
  }, [user])

  const handleGenerate = () => {
    setLoading(true); setHasSearched(true)
    setTimeout(() => {
      let results = getRecommendations(allItems, occasion || undefined, temperature ? parseFloat(temperature) : undefined)

      // Apply body-aware scoring
      if (bodyAware && bodyShape) {
        results = results.map(item => {
          const { score, tip } = scoreItemForBody(item, bodyShape, styleGoals)
          return { ...item, bodyScore: score, bodyTip: tip }
        }).sort((a, b) => (b.bodyScore || 0) - (a.bodyScore || 0))
      }

      setRecommendations(results); setLoading(false)
    }, 400)
  }

  const handleSurprise = () => {
    setOccasion(''); setTemperature(''); setLoading(true); setHasSearched(true)
    setTimeout(() => {
      let results = getRecommendations(allItems)
      if (bodyAware && bodyShape) {
        results = results.map(item => {
          const { score, tip } = scoreItemForBody(item, bodyShape, styleGoals)
          return { ...item, bodyScore: score, bodyTip: tip }
        })
      }
      setRecommendations(results); setLoading(false)
    }, 400)
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      <h1 className="font-display text-3xl text-[#0A0A0A] tracking-tight mb-2">Outfit Ideas</h1>
      <p className="text-[#A3A3A3] text-sm mb-5">Styled for your body, from your closet</p>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-5">
        {/* Body-aware toggle */}
        {bodyShape && (
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F5F5F5]">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPerson} className="w-4 h-4 text-[#FF6B35]" />
              <span className="font-display text-sm">For Your Shape</span>
            </div>
            <button onClick={() => setBodyAware(!bodyAware)}
              className={`w-11 h-6 rounded-full transition-colors relative ${bodyAware ? 'bg-[#B8F044]' : 'bg-[#E5E5E5]'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform ${bodyAware ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
            </button>
          </div>
        )}

        <p className="font-display text-sm mb-2">What's the vibe?</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {OCCASIONS.map(o => (
            <button key={o} onClick={() => setOccasion(occasion === o ? '' : o)}
              className={`px-4 py-2 rounded-full text-sm font-display transition-all ${occasion === o ? 'bg-[#0A0A0A] text-white' : 'bg-[#F5F5F5] text-[#525252]'}`}>
              {o}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <FontAwesomeIcon icon={faTemperatureHalf} className="w-4 h-4 text-[#A3A3A3]" />
          <input type="number" value={temperature} onChange={e => setTemperature(e.target.value)} placeholder="Temperature °C"
            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" />
        </div>

        <div className="flex gap-2">
          <button onClick={handleGenerate} disabled={loading}
            className="flex-1 btn-primary !py-3 flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4" />
            Style Me
          </button>
          <button onClick={handleSurprise} disabled={loading}
            className="px-5 py-3 bg-[#B8F044] text-[#0A0A0A] rounded-full font-display text-sm flex items-center gap-2">
            <FontAwesomeIcon icon={faDice} className="w-4 h-4" />
            Random
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-10">
          <div className="w-10 h-10 border-2 border-[#E5E5E5] border-t-[#FF6B35] rounded-full animate-spin mx-auto mb-3" />
          <p className="font-display text-sm text-[#A3A3A3]">
            {bodyAware ? 'Styling for your shape...' : 'Putting together a look...'}
          </p>
        </div>
      )}

      {!loading && hasSearched && recommendations.length === 0 && (
        <div className="bg-[#FEF9C3] rounded-2xl p-6 text-center">
          <p className="font-display text-lg text-[#0A0A0A]">No matches found</p>
          <p className="text-sm text-[#525252] mt-1">Try different filters or add more items</p>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-[#B8F044] flex items-center justify-center">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4 text-[#0A0A0A]" />
            </div>
            <h2 className="font-display text-lg text-[#0A0A0A]">
              {occasion ? `${occasion} look` : 'Your look'}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recommendations.map((item: any) => (
              <div key={item.id} className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                <div className="aspect-square bg-[#F5F5F5] flex items-center justify-center">
                  {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : (
                    <span className="text-3xl">{item.category === 'tops' ? '👕' : item.category === 'bottoms' ? '👖' : item.category === 'shoes' ? '👟' : item.category === 'accessories' ? '👜' : '🧥'}</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-display text-sm truncate">{item.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] font-display uppercase text-[#A3A3A3]">{item.brand || item.category}</span>
                    {item.bodyScore && (
                      <span className={`text-[9px] font-display px-1.5 py-0.5 rounded-full ${item.bodyScore >= 70 ? 'bg-[#D1FAE5] text-[#047857]' : 'bg-[#F5F5F5] text-[#525252]'}`}>
                        {item.bodyScore}% match
                      </span>
                    )}
                  </div>
                  {item.bodyTip && bodyAware && (
                    <p className="text-[9px] text-[#FF6B35] mt-1.5 leading-tight">{item.bodyTip}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!bodyShape && (
        <div className="bg-[#F5F5F5] rounded-2xl p-5 mt-5 text-center">
          <FontAwesomeIcon icon={faPerson} className="w-8 h-8 text-[#D4D4D4] mb-2" />
          <p className="font-display text-sm text-[#A3A3A3]">Add measurements in your Profile to get body-aware suggestions</p>
        </div>
      )}
    </div>
  )
}
