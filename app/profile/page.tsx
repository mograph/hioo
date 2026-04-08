'use client'
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getProfile, updateProfile } from '@/lib/db'
import { classifyBodyShape, parseMeasurement, getShapeInfo, getStyleTips, type BodyShape, type AccentuationGoal } from '@/lib/bodyShape'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faRuler, faHeart, faLightbulb } from '@fortawesome/free-solid-svg-icons'

const GOALS: { key: AccentuationGoal; label: string }[] = [
  { key: 'waist', label: 'Waist' },
  { key: 'hips', label: 'Hips' },
  { key: 'shoulders', label: 'Shoulders' },
  { key: 'legs', label: 'Legs' },
  { key: 'torso', label: 'Torso' },
]

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ name: '' })
  const [measurements, setMeasurements] = useState<any>({})
  const [styleGoals, setStyleGoals] = useState<AccentuationGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { if (!authLoading && !user) router.push('/auth/login') }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      getProfile(user.uid).then((data: any) => {
        setForm({ name: data.name || '' })
        if (data.measurements) {
          setMeasurements(typeof data.measurements === 'string' ? JSON.parse(data.measurements) : data.measurements)
        }
        if (data.styleGoals) setStyleGoals(data.styleGoals)
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [user])

  // Compute body shape from measurements
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    await updateProfile(user.uid, { name: form.name, measurements, bodyShape, styleGoals })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const fields = [
    { key: 'height', label: 'Height' }, { key: 'bust', label: 'Bust/Chest' },
    { key: 'waist', label: 'Waist' }, { key: 'hips', label: 'Hips' },
    { key: 'inseam', label: 'Inseam' }, { key: 'shoeSize', label: 'Shoe Size' },
  ]

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin" /></div>

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      <h1 className="font-display text-3xl text-[#0A0A0A] tracking-tight mb-5">Profile</h1>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Info */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-[#B8F044] flex items-center justify-center">
              <span className="font-display text-2xl">{(user?.displayName || user?.email || '?')[0].toUpperCase()}</span>
            </div>
            <div>
              <p className="font-display">{user?.displayName || 'No name set'}</p>
              <p className="text-sm text-[#A3A3A3]">{user?.email}</p>
            </div>
          </div>
          <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Display name"
            className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E5E5] text-sm font-medium focus:outline-none focus:border-[#0A0A0A]" />
        </div>

        {/* Measurements */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
          <div className="flex items-center gap-2 mb-3">
            <FontAwesomeIcon icon={faRuler} className="w-4 h-4 text-[#A3A3A3]" />
            <h2 className="font-display text-lg">Measurements</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {fields.map(({ key, label }) => (
              <div key={key}>
                <label className="text-[10px] font-display uppercase text-[#A3A3A3] block mb-1">{label}</label>
                <input type="text" value={measurements[key] || ''} onChange={e => setMeasurements({ ...measurements, [key]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" />
              </div>
            ))}
          </div>
        </div>

        {/* Body Shape Result */}
        {shapeInfo && (
          <div className={`${shapeInfo.bgColor} rounded-2xl p-5`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{shapeInfo.emoji}</span>
              <div>
                <p className={`font-display text-xl ${shapeInfo.color}`}>{shapeInfo.name}</p>
                <p className="text-[10px] font-display uppercase text-[#525252]">Your Body Shape</p>
              </div>
            </div>
            <p className="text-sm text-[#525252] leading-relaxed">{shapeInfo.description}</p>
          </div>
        )}

        {/* Accentuation Goals */}
        {bodyShape && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faHeart} className="w-4 h-4 text-[#FF6B35]" />
              <h2 className="font-display text-lg">What do you want to accentuate?</h2>
            </div>
            <p className="text-xs text-[#A3A3A3] mb-3">Pick areas you want to highlight — we'll tailor outfit suggestions</p>
            <div className="flex flex-wrap gap-2">
              {GOALS.map(({ key, label }) => (
                <button key={key} type="button" onClick={() => toggleGoal(key)}
                  className={`px-4 py-2.5 rounded-full text-sm font-display transition-all ${
                    styleGoals.includes(key) ? 'bg-[#0A0A0A] text-white' : 'bg-[#F5F5F5] text-[#525252]'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Style Tips */}
        {bodyShape && tips.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faLightbulb} className="w-4 h-4 text-[#FDE047]" />
              <h2 className="font-display text-lg">Style Tips For You</h2>
            </div>
            <div className="space-y-3">
              {tips.slice(0, 5).map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="font-display text-xs text-[#525252]">{i + 1}</span>
                  </div>
                  <div>
                    <p className="font-display text-sm">{tip.title}</p>
                    <p className="text-xs text-[#A3A3A3]">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" disabled={saving}
          className={`w-full py-3.5 rounded-full font-display text-base transition-all ${saved ? 'bg-[#D1FAE5] text-[#047857]' : 'bg-[#0A0A0A] text-white'}`}>
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
        </button>
      </form>

      <button onClick={() => { signOut(); router.push('/') }}
        className="w-full mt-4 py-3 rounded-full font-display text-sm text-[#A3A3A3] hover:text-[#FF6B35] transition-colors">
        Sign Out
      </button>
    </div>
  )
}
