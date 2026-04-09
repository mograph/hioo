'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getProfile, updateProfile } from '@/lib/db'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRuler } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ name: '' })
  const [measurements, setMeasurements] = useState<any>({})
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
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    await updateProfile(user.uid, { name: form.name, measurements })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const measureSections = [
    { title: 'Core', fields: [
      { key: 'height', label: 'Height' },
      { key: 'weight', label: 'Weight' },
      { key: 'bust', label: 'Bust/Chest' },
      { key: 'underbust', label: 'Underbust' },
      { key: 'waist', label: 'Waist' },
      { key: 'hips', label: 'Hips' },
    ]},
    { title: 'Upper Body', fields: [
      { key: 'shoulders', label: 'Shoulders' },
      { key: 'armLength', label: 'Arm Length' },
      { key: 'bicep', label: 'Bicep' },
      { key: 'wrist', label: 'Wrist' },
      { key: 'neck', label: 'Neck' },
      { key: 'torsoLength', label: 'Torso Length' },
    ]},
    { title: 'Lower Body', fields: [
      { key: 'inseam', label: 'Inseam' },
      { key: 'outseam', label: 'Outseam' },
      { key: 'thigh', label: 'Thigh' },
      { key: 'knee', label: 'Knee' },
      { key: 'calf', label: 'Calf' },
      { key: 'ankle', label: 'Ankle' },
    ]},
    { title: 'Feet & Hands', fields: [
      { key: 'shoeSize', label: 'Shoe Size' },
      { key: 'footWidth', label: 'Foot Width' },
      { key: 'ringSize', label: 'Ring Size' },
      { key: 'braceletSize', label: 'Bracelet' },
    ]},
  ]

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin" /></div>

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      <h1 className="font-display text-3xl text-[#0A0A0A] tracking-tight mb-5">Profile</h1>

      <form onSubmit={handleSave} className="space-y-4">
        {/* User info */}
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

        {/* Measurements — organized by body section */}
        {measureSections.map(section => (
          <div key={section.title} className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faRuler} className="w-4 h-4 text-[#A3A3A3]" />
              <h2 className="font-display text-lg">{section.title}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {section.fields.map(({ key, label }) => (
                <div key={key}>
                  <label className="text-[10px] font-display uppercase text-[#A3A3A3] block mb-1">{label}</label>
                  <input type="text" value={measurements[key] || ''} onChange={e => setMeasurements({ ...measurements, [key]: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Link to Suggest for body shape results */}
        <Link href="/recommend" className="block bg-[#FFE0D0] rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B35] flex items-center justify-center">
              <FontAwesomeIcon icon={faRuler} className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-display text-sm text-[#0A0A0A]">See your body shape & style tips</p>
              <p className="text-[10px] text-[#C2410C]">Go to Outfit Ideas →</p>
            </div>
          </div>
        </Link>

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
