'use client'
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getItems, getRecommendations, getProfile, updateProfile } from '@/lib/db'
import { classifyBodyShape, parseMeasurement, getShapeInfo, getStyleTips, scoreItemForBody, type BodyShape, type AccentuationGoal } from '@/lib/bodyShape'
import { getGarmentSVG } from '@/lib/garmentIllustrations'
import BodySilhouette from '@/components/BodySilhouette'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles, faDice, faTemperatureHalf, faPerson, faRuler, faHeart, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

const OCCASIONS = ['casual', 'formal', 'business', 'date night', 'cozy']
const GOALS: { key: AccentuationGoal; label: string }[] = [
  { key: 'waist', label: 'Waist' }, { key: 'hips', label: 'Hips' },
  { key: 'shoulders', label: 'Shoulders' }, { key: 'legs', label: 'Legs' }, { key: 'torso', label: 'Torso' },
]

export default function RecommendPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [allItems, setAllItems] = useState<any[]>([])
  const [occasion, setOccasion] = useState('')
  const [temperature, setTemperature] = useState('')
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Body shape state
  const [measurements, setMeasurements] = useState<any>({})
  const [styleGoals, setStyleGoals] = useState<AccentuationGoal[]>([])
  const [showMeasurements, setShowMeasurements] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (!authLoading && !user) router.push('/auth/login') }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      getItems(user.uid).then(setAllItems).catch(() => {})
      getProfile(user.uid).then((data: any) => {
        if (data.measurements) {
          const m = typeof data.measurements === 'string' ? JSON.parse(data.measurements) : data.measurements
          setMeasurements(m)
        }
        if (data.styleGoals) setStyleGoals(data.styleGoals)
      }).catch(() => {})
    }
  }, [user])

  const bodyShape = useMemo(() => {
    const bust = parseMeasurement(measurements.bust)
    const waist = parseMeasurement(measurements.waist)
    const hips = parseMeasurement(measurements.hips)
    return classifyBodyShape(bust, waist, hips)
  }, [measurements.bust, measurements.waist, measurements.hips])

  const shapeInfo = bodyShape ? getShapeInfo(bodyShape) : null
  const tips = bodyShape ? getStyleTips(bodyShape, styleGoals) : []

  const toggleGoal = (goal: AccentuationGoal) => {
    setStyleGoals(prev => prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal])
  }

  const saveMeasurements = async () => {
    if (!user) return
    setSaving(true)
    await updateProfile(user.uid, { measurements, bodyShape, styleGoals })
    setSaving(false)
  }

  const handleGenerate = () => {
    setLoading(true); setHasSearched(true)
    setTimeout(() => {
      let results = getRecommendations(allItems, occasion || undefined, temperature ? parseFloat(temperature) : undefined)
      if (bodyShape) {
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
      if (bodyShape) {
        results = results.map(item => {
          const { score, tip } = scoreItemForBody(item, bodyShape, styleGoals)
          return { ...item, bodyScore: score, bodyTip: tip }
        })
      }
      setRecommendations(results); setLoading(false)
    }, 400)
  }

  const measureFields = [
    { key: 'bust', label: 'Bust' }, { key: 'waist', label: 'Waist' }, { key: 'hips', label: 'Hips' },
  ]

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      <h1 className="font-display text-3xl text-[#0A0A0A] tracking-tight mb-2">Outfit Ideas</h1>
      <p className="text-[#A3A3A3] text-sm mb-5">Styled for your body, from your closet</p>

      {/* Body Shape Section */}
      {bodyShape && shapeInfo ? (
        <div className={`${shapeInfo.bgColor} rounded-2xl p-5 mb-4`}>
          <div className="flex gap-4">
            <div className="w-16 flex-shrink-0">
              <BodySilhouette bodyShape={bodyShape} opacity={0.18} className="w-full" />
            </div>
            <div className="flex-1">
              <p className={`font-display text-lg ${shapeInfo.color}`}>{shapeInfo.name}</p>
              <p className="text-[10px] font-display uppercase text-[#525252] mb-2">Your Shape</p>

              {/* Accentuate goals */}
              <div className="flex flex-wrap gap-1.5">
                {GOALS.map(({ key, label }) => (
                  <button key={key} onClick={() => { toggleGoal(key); setTimeout(saveMeasurements, 100) }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-display transition-all ${
                      styleGoals.includes(key) ? 'bg-[#0A0A0A] text-white' : 'bg-white/60 text-[#525252]'
                    }`}>{label}</button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={() => setShowMeasurements(!showMeasurements)}
            className="w-full mt-3 pt-3 border-t border-black/10 flex items-center justify-center gap-1 text-[10px] font-display text-[#525252]">
            Edit measurements <FontAwesomeIcon icon={showMeasurements ? faChevronUp : faChevronDown} className="w-2.5 h-2.5" />
          </button>

          {showMeasurements && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {measureFields.map(({ key, label }) => (
                <div key={key}>
                  <label className="text-[9px] font-display uppercase text-[#525252] block mb-0.5">{label}</label>
                  <input type="text" value={measurements[key] || ''} onChange={e => setMeasurements({ ...measurements, [key]: e.target.value })}
                    onBlur={saveMeasurements}
                    className="w-full px-2 py-1.5 rounded-lg border border-black/10 text-xs bg-white/60 focus:outline-none focus:bg-white" />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#F5F5F5] rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FontAwesomeIcon icon={faRuler} className="w-4 h-4 text-[#A3A3A3]" />
            <p className="font-display text-sm">Add measurements for personalized styling</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {measureFields.map(({ key, label }) => (
              <div key={key}>
                <label className="text-[9px] font-display uppercase text-[#A3A3A3] block mb-0.5">{label}</label>
                <input type="text" value={measurements[key] || ''} onChange={e => setMeasurements({ ...measurements, [key]: e.target.value })}
                  onBlur={saveMeasurements}
                  className="w-full px-2 py-1.5 rounded-lg border-2 border-[#E5E5E5] text-xs focus:outline-none focus:border-[#0A0A0A]" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Style Tips with illustrations */}
      {tips.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 mb-4">
          <p className="font-display text-sm mb-3">Recommended for you</p>
          <div className="grid grid-cols-2 gap-2">
            {tips.slice(0, 6).map((tip, i) => (
              <div key={i} className="bg-[#F5F5F5] rounded-xl p-3 flex gap-2.5">
                <div className="flex-shrink-0 opacity-60">
                  {getGarmentSVG(tip.title, 32)}
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xs leading-tight">{tip.title}</p>
                  <p className="text-[9px] text-[#A3A3A3] leading-tight mt-0.5">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Occasion + Temperature */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-5">
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
            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4" /> Style Me
          </button>
          <button onClick={handleSurprise} disabled={loading}
            className="px-5 py-3 bg-[#B8F044] text-[#0A0A0A] rounded-full font-display text-sm flex items-center gap-2">
            <FontAwesomeIcon icon={faDice} className="w-4 h-4" /> Random
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10">
          <div className="w-10 h-10 border-2 border-[#E5E5E5] border-t-[#FF6B35] rounded-full animate-spin mx-auto mb-3" />
          <p className="font-display text-sm text-[#A3A3A3]">{bodyShape ? 'Styling for your shape...' : 'Putting together a look...'}</p>
        </div>
      )}

      {/* No results */}
      {!loading && hasSearched && recommendations.length === 0 && (
        <div className="bg-[#FEF9C3] rounded-2xl p-6 text-center">
          <p className="font-display text-lg text-[#0A0A0A]">No matches found</p>
          <p className="text-sm text-[#525252] mt-1">Try different filters or add more items</p>
        </div>
      )}

      {/* Results */}
      {!loading && recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-[#B8F044] flex items-center justify-center">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4 text-[#0A0A0A]" />
            </div>
            <h2 className="font-display text-lg text-[#0A0A0A]">{occasion ? `${occasion} look` : 'Your look'}</h2>
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
                        {item.bodyScore}%
                      </span>
                    )}
                  </div>
                  {item.bodyTip && (
                    <p className="text-[9px] text-[#FF6B35] mt-1.5 leading-tight">{item.bodyTip}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
