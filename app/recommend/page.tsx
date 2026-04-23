'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getItems, getOutfitByCategory, getProfile, updateProfile, addOutfit, OUTFIT_CATEGORIES } from '@/lib/db'
import { classifyBodyShape, parseMeasurement, getShapeInfo, getStyleTips, scoreItemForBody, type BodyShape, type AccentuationGoal } from '@/lib/bodyShape'
import { getPairingIcons } from '@/lib/garmentIllustrations'
import BodySilhouette from '@/components/BodySilhouette'
import CategoryCarousel from '@/components/CategoryCarousel'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles, faShuffle, faTemperatureHalf, faPerson, faRuler, faChevronDown, faChevronUp, faBookmark, faCheck } from '@fortawesome/free-solid-svg-icons'

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

  // Carousel state
  const [selectedIndex, setSelectedIndex] = useState<Record<string, number>>({})
  const [locked, setLocked] = useState<Record<string, boolean>>({})
  const [hasGenerated, setHasGenerated] = useState(false)

  // Save state
  const [savedLook, setSavedLook] = useState(false)

  // Body shape state
  const [measurements, setMeasurements] = useState<any>({})
  const [styleGoals, setStyleGoals] = useState<AccentuationGoal[]>([])
  const [showMeasurements, setShowMeasurements] = useState(false)

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

  // Build category items with body scoring applied
  const categoryItems = useMemo(() => {
    const byCategory = getOutfitByCategory(allItems, occasion || undefined, temperature ? parseFloat(temperature) : undefined)
    if (bodyShape) {
      for (const cat of OUTFIT_CATEGORIES) {
        byCategory[cat] = byCategory[cat].map(item => {
          const { score, tip } = scoreItemForBody(item, bodyShape, styleGoals)
          return { ...item, bodyScore: score, bodyTip: tip }
        }).sort((a, b) => (b.bodyScore || 0) - (a.bodyScore || 0))
      }
    }
    return byCategory
  }, [allItems, occasion, temperature, bodyShape, styleGoals])

  const toggleGoal = (goal: AccentuationGoal) => {
    setStyleGoals(prev => prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal])
  }

  const saveMeasurements = useCallback(async () => {
    if (!user) return
    await updateProfile(user.uid, { measurements, bodyShape, styleGoals })
  }, [user, measurements, bodyShape, styleGoals])

  const handleGenerate = () => {
    const newSelected: Record<string, number> = {}
    for (const cat of OUTFIT_CATEGORIES) {
      if (categoryItems[cat]?.length) newSelected[cat] = 0
    }
    setSelectedIndex(newSelected)
    setLocked({})
    setHasGenerated(true)
    setSavedLook(false)
  }

  const handleShuffle = () => {
    setSelectedIndex(prev => {
      const next = { ...prev }
      for (const cat of OUTFIT_CATEGORIES) {
        if (locked[cat]) continue
        const list = categoryItems[cat]
        if (!list?.length) continue
        next[cat] = Math.floor(Math.random() * list.length)
      }
      return next
    })
    setSavedLook(false)
  }

  const toggleLock = (cat: string) => {
    setLocked(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  const selectItem = (cat: string, idx: number) => {
    setSelectedIndex(prev => ({ ...prev, [cat]: idx }))
    setSavedLook(false)
  }

  const handleSaveLook = async () => {
    if (!user) return
    const itemIds: string[] = []
    for (const cat of OUTFIT_CATEGORIES) {
      const idx = selectedIndex[cat]
      const item = categoryItems[cat]?.[idx]
      if (item) itemIds.push(item.id)
    }
    if (!itemIds.length) return
    const name = occasion ? `${occasion.charAt(0).toUpperCase() + occasion.slice(1)} Look` : 'My Look'
    await addOutfit(user.uid, { name, occasion: occasion || null, itemIds, imageUrl: null, date: null })
    setSavedLook(true)
    setTimeout(() => setSavedLook(false), 3000)
  }

  const measureFields = [
    { key: 'bust', label: 'Bust' }, { key: 'waist', label: 'Waist' }, { key: 'hips', label: 'Hips' },
    { key: 'shoulders', label: 'Shoulders' }, { key: 'height', label: 'Height' }, { key: 'inseam', label: 'Inseam' },
  ]

  const hasAnyItems = OUTFIT_CATEGORIES.some(cat => categoryItems[cat]?.length > 0)
  const selectedCount = OUTFIT_CATEGORIES.filter(cat => selectedIndex[cat] !== undefined && categoryItems[cat]?.[selectedIndex[cat]]).length

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      <h1 className="font-display text-3xl text-[#0A0A0A] tracking-tight mb-2">Outfit Ideas</h1>
      <p className="text-[#A3A3A3] text-sm mb-5">Slide, lock, and shuffle to find your look</p>

      {/* Body Shape Section */}
      {bodyShape && shapeInfo ? (
        <div className={`${shapeInfo.bgColor} rounded-2xl p-5 mb-4`}>
          <div className="flex gap-4">
            <div className="w-16 flex-shrink-0">
              <BodySilhouette bodyShape={bodyShape} opacity={0.9} className="w-full" />
            </div>
            <div className="flex-1">
              <p className={`font-display text-lg ${shapeInfo.color}`}>{shapeInfo.name}</p>
              <p className="text-[10px] font-display uppercase text-[#525252] mb-2">Your Shape</p>
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

      {/* Style Tips with garment pairing */}
      {tips.length > 0 && !hasGenerated && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 mb-4">
          <p className="font-display text-sm mb-3">Pair these together</p>
          <div className="grid grid-cols-2 gap-2">
            {tips.slice(0, 4).map((tip, i) => (
              <div key={i} className="bg-[#F5F5F5] rounded-xl p-3">
                <div className="flex justify-center mb-2">
                  {getPairingIcons(tip, 36)}
                </div>
                <p className="font-display text-xs leading-tight text-center">{tip.title}</p>
                <p className="text-[9px] text-[#A3A3A3] leading-tight mt-0.5 text-center">{tip.description}</p>
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

        {!hasGenerated ? (
          <button onClick={handleGenerate} disabled={!hasAnyItems}
            className="w-full btn-primary !py-3 flex items-center justify-center gap-2 disabled:opacity-50">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4" />
            Style Me
          </button>
        ) : (
          <button onClick={handleShuffle}
            className="w-full bg-[#B8F044] text-[#0A0A0A] px-5 py-3 rounded-full font-display flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faShuffle} className="w-4 h-4" />
            Shuffle Unlocked
          </button>
        )}
      </div>

      {/* Empty state */}
      {hasGenerated && !hasAnyItems && (
        <div className="bg-[#FEF9C3] rounded-2xl p-6 text-center">
          <p className="font-display text-lg text-[#0A0A0A]">No matches found</p>
          <p className="text-sm text-[#525252] mt-1">Try different filters or load demo data</p>
        </div>
      )}

      {/* Carousels */}
      {hasGenerated && hasAnyItems && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#B8F044] flex items-center justify-center">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4 text-[#0A0A0A]" />
            </div>
            <h2 className="font-display text-lg text-[#0A0A0A]">
              {occasion ? `${occasion} look` : 'Your look'}
            </h2>
          </div>

          {OUTFIT_CATEGORIES.map(cat => {
            const items = categoryItems[cat] || []
            if (!items.length) return null
            const idx = selectedIndex[cat] ?? 0
            return (
              <CategoryCarousel
                key={cat}
                category={cat}
                items={items}
                selectedIndex={idx}
                locked={!!locked[cat]}
                onSelect={(i) => selectItem(cat, i)}
                onToggleLock={() => toggleLock(cat)}
              />
            )
          })}

          {/* Save */}
          {selectedCount > 0 && (
            <button onClick={handleSaveLook}
              className={`w-full !py-3.5 rounded-full font-display text-base flex items-center justify-center gap-2 transition-all ${savedLook ? 'bg-[#D1FAE5] text-[#047857]' : 'bg-[#0A0A0A] text-white hover:bg-[#262626]'}`}>
              <FontAwesomeIcon icon={savedLook ? faCheck : faBookmark} className="w-4 h-4" />
              {savedLook ? 'Saved to Outfits!' : `Save This Look (${selectedCount} pieces)`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
