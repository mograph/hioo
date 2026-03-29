'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/AuthContext'
import { fetchWithAuth } from '@/lib/api'
import { getOutfits, addMoment, addWearLog } from '@/lib/db'
import { useRouter } from 'next/navigation'

const MOODS = [
  { emoji: '🔥', label: 'Fire' },
  { emoji: '😍', label: 'Love it' },
  { emoji: '😊', label: 'Good' },
  { emoji: '😐', label: 'Meh' },
  { emoji: '😩', label: 'Off day' },
]

const OCCASIONS = ['casual', 'work', 'date night', 'going out', 'formal', 'cozy']

export default function CapturePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<'photo' | 'details' | 'saving' | 'done'>('photo')
  const [imageUrl, setImageUrl] = useState('')
  const [preview, setPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [mood, setMood] = useState('')
  const [occasion, setOccasion] = useState('')
  const [notes, setNotes] = useState('')
  const [outfits, setOutfits] = useState<any[]>([])
  const [selectedOutfit, setSelectedOutfit] = useState('')

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      getOutfits(user.uid)
        .then(setOutfits)
        .catch(() => {})
    }
  }, [user])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetchWithAuth('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        setImageUrl(data.url)
        setStep('details')
      }
    } catch (err) {
      console.error('Upload failed:', err)
    }
    setUploading(false)
  }

  const handleSave = async () => {
    setStep('saving')
    try {
      const momentData = {
        imageUrl, mood, occasion, notes,
        outfitId: selectedOutfit || null,
        date: new Date().toISOString(),
      }
      await addMoment(user!.uid, momentData)
      if (selectedOutfit) {
        await addWearLog(user!.uid, { outfitId: selectedOutfit, date: momentData.date, notes })
      }
      setStep('done')
    } catch {
      setStep('details')
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 min-h-[calc(100vh-56px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.back()} className="text-[#6b6157] hover:text-[#1a1a1a] p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 className="font-serif text-xl font-medium text-[#1a1a1a]">Capture Moment</h1>
        <div className="w-8" />
      </div>

      {/* Step 1: Photo */}
      {step === 'photo' && (
        <div className="flex flex-col items-center gap-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-[3/4] bg-white rounded-2xl border-2 border-dashed border-[#e0d6ca] flex flex-col items-center justify-center cursor-pointer hover:border-[#c47d5a] transition-colors"
          >
            {uploading ? (
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-[#e0d6ca] border-t-[#c47d5a] rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-[#6b6157]">Uploading...</p>
              </div>
            ) : preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9c8e80" strokeWidth="1.5">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <p className="text-[#6b6157] font-medium mt-4">Tap to take a photo</p>
                <p className="text-[#9c8e80] text-sm mt-1">or upload from your gallery</p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          <p className="text-[13px] text-[#9c8e80] text-center">
            Capture your outfit of the day
          </p>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 'details' && (
        <div className="space-y-6">
          {/* Photo preview */}
          <div className="relative">
            <img src={preview || imageUrl} alt="Your outfit" className="w-full aspect-[3/4] object-cover rounded-2xl" />
            <button
              onClick={() => { setStep('photo'); setPreview(''); setImageUrl('') }}
              className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm backdrop-blur-sm"
            >
              ×
            </button>
          </div>

          {/* Mood */}
          <div>
            <label className="text-sm font-medium text-[#1a1a1a] block mb-2">How are you feeling?</label>
            <div className="flex gap-2">
              {MOODS.map(m => (
                <button
                  key={m.label}
                  onClick={() => setMood(mood === m.label ? '' : m.label)}
                  className={`flex-1 py-3 rounded-xl text-center transition-all ${
                    mood === m.label
                      ? 'bg-[#1a1a1a] shadow-md scale-105'
                      : 'bg-white border border-[#e0d6ca] hover:border-[#c47d5a]'
                  }`}
                >
                  <span className="text-xl">{m.emoji}</span>
                  <p className={`text-[10px] mt-1 ${mood === m.label ? 'text-white' : 'text-[#6b6157]'}`}>{m.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Occasion */}
          <div>
            <label className="text-sm font-medium text-[#1a1a1a] block mb-2">Occasion</label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map(o => (
                <button
                  key={o}
                  onClick={() => setOccasion(occasion === o ? '' : o)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    occasion === o
                      ? 'bg-[#1a1a1a] text-white'
                      : 'bg-white border border-[#e0d6ca] text-[#6b6157] hover:border-[#c47d5a]'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* Link outfit */}
          {outfits.length > 0 && (
            <div>
              <label className="text-sm font-medium text-[#1a1a1a] block mb-2">Link an outfit</label>
              <select
                value={selectedOutfit}
                onChange={e => setSelectedOutfit(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e0d6ca] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c47d5a]/30 focus:border-[#c47d5a]"
              >
                <option value="">None</option>
                {outfits.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-[#1a1a1a] block mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="How did this outfit make you feel? Any compliments?"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-[#e0d6ca] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c47d5a]/30 focus:border-[#c47d5a] resize-none"
            />
          </div>

          {/* Save */}
          <button onClick={handleSave} className="w-full btn-primary !py-3.5 text-base">
            Save Moment
          </button>
        </div>
      )}

      {/* Saving */}
      {step === 'saving' && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-[#e0d6ca] border-t-[#c47d5a] rounded-full animate-spin mb-4" />
          <p className="text-[#6b6157]">Saving your moment...</p>
        </div>
      )}

      {/* Done */}
      {step === 'done' && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="font-serif text-2xl font-medium text-[#1a1a1a] mb-2">Moment captured!</h2>
          <p className="text-[#6b6157] text-sm mb-8">Your outfit has been saved to your diary.</p>
          <div className="flex gap-3">
            <button onClick={() => router.push('/moments')} className="btn-primary !py-2.5">
              View Diary
            </button>
            <button
              onClick={() => { setStep('photo'); setPreview(''); setImageUrl(''); setMood(''); setOccasion(''); setNotes(''); setSelectedOutfit('') }}
              className="btn-secondary !py-2.5"
            >
              Capture Another
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
