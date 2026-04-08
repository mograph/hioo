'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/AuthContext'
import { fetchWithAuth } from '@/lib/api'
import { getOutfits, addMoment, addWearLog } from '@/lib/db'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons'
import BackgroundRemoval from '@/components/BackgroundRemoval'

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
  const [step, setStep] = useState<'photo' | 'bg-remove' | 'details' | 'saving' | 'done'>('photo')
  const [imageUrl, setImageUrl] = useState('')
  const [preview, setPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [originalBlob, setOriginalBlob] = useState<Blob | null>(null)
  const [mood, setMood] = useState('')
  const [occasion, setOccasion] = useState('')
  const [notes, setNotes] = useState('')
  const [outfits, setOutfits] = useState<any[]>([])
  const [selectedOutfit, setSelectedOutfit] = useState('')

  useEffect(() => { if (!authLoading && !user) router.push('/auth/login') }, [authLoading, user, router])
  useEffect(() => { if (user) getOutfits(user.uid).then(setOutfits).catch(() => {}) }, [user])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setOriginalBlob(file)
    setStep('bg-remove')
  }

  const uploadBlob = async (blob: Blob) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', new File([blob], 'photo.png', { type: 'image/png' }))
    try {
      const res = await fetchWithAuth('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) { setImageUrl(data.url); setStep('details') }
    } catch (err) { console.error('Upload failed:', err) }
    setUploading(false)
  }

  const handleBgRemoveComplete = (processedBlob: Blob) => {
    setPreview(URL.createObjectURL(processedBlob))
    uploadBlob(processedBlob)
  }

  const handleBgRemoveSkip = () => {
    if (originalBlob) uploadBlob(originalBlob)
  }

  const handleSave = async () => {
    setStep('saving')
    try {
      const momentData = { imageUrl, mood, occasion, notes, outfitId: selectedOutfit || null, date: new Date().toISOString() }
      await addMoment(user!.uid, momentData)
      if (selectedOutfit) await addWearLog(user!.uid, { outfitId: selectedOutfit, date: momentData.date, notes })
      setStep('done')
    } catch { setStep('details') }
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.back()} className="text-[#A3A3A3] hover:text-[#0A0A0A]">
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
        </button>
        <h1 className="font-display text-xl font-bold text-[#0A0A0A]">Capture Moment</h1>
        <div className="w-8" />
      </div>

      {/* Photo step */}
      {step === 'photo' && (
        <div className="flex flex-col items-center gap-6">
          <div onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-[3/4] bg-white rounded-3xl border-2 border-dashed border-[#E5E5E5] flex flex-col items-center justify-center cursor-pointer hover:border-[#0A0A0A] transition-colors">
            {uploading ? (
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-[#A3A3A3] font-display font-semibold">Uploading...</p>
              </div>
            ) : preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-3xl" />
            ) : (
              <>
                <FontAwesomeIcon icon={faCamera} className="w-12 h-12 text-[#D4D4D4]" />
                <p className="font-display font-bold text-[#525252] mt-4">Tap to take a photo</p>
                <p className="text-[#A3A3A3] text-sm mt-1">or upload from gallery</p>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
        </div>
      )}

      {/* Background removal step */}
      {step === 'bg-remove' && originalBlob && (
        <BackgroundRemoval
          originalBlob={originalBlob}
          originalPreview={preview}
          onComplete={handleBgRemoveComplete}
          onSkip={handleBgRemoveSkip}
        />
      )}

      {/* Details step */}
      {step === 'details' && (
        <div className="space-y-5">
          <div className="relative">
            <img src={preview || imageUrl} alt="" className="w-full aspect-[3/4] object-cover rounded-3xl" />
            <button onClick={() => { setStep('photo'); setPreview(''); setImageUrl('') }}
              className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm text-sm">×</button>
          </div>

          <div>
            <label className="font-display text-sm font-bold block mb-2">How are you feeling?</label>
            <div className="flex gap-2">
              {MOODS.map(m => (
                <button key={m.label} onClick={() => setMood(mood === m.label ? '' : m.label)}
                  className={`flex-1 py-3 rounded-2xl text-center transition-all ${mood === m.label ? 'bg-[#0A0A0A] shadow-md scale-105' : 'bg-white border-2 border-[#E5E5E5]'}`}>
                  <span className="text-xl">{m.emoji}</span>
                  <p className={`text-[10px] font-display font-bold mt-1 ${mood === m.label ? 'text-white' : 'text-[#A3A3A3]'}`}>{m.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-display text-sm font-bold block mb-2">Occasion</label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map(o => (
                <button key={o} onClick={() => setOccasion(occasion === o ? '' : o)}
                  className={`px-4 py-2 rounded-full text-sm font-display font-bold transition-all ${occasion === o ? 'bg-[#0A0A0A] text-white' : 'bg-[#F5F5F5] text-[#525252]'}`}>{o}</button>
              ))}
            </div>
          </div>

          {outfits.length > 0 && (
            <div>
              <label className="font-display text-sm font-bold block mb-2">Link outfit</label>
              <select value={selectedOutfit} onChange={e => setSelectedOutfit(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#E5E5E5] text-sm font-medium bg-white focus:outline-none focus:border-[#0A0A0A]">
                <option value="">None</option>
                {outfits.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="font-display text-sm font-bold block mb-2">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="How did this outfit make you feel?"
              rows={3} className="w-full px-4 py-3 rounded-2xl border-2 border-[#E5E5E5] text-sm bg-white focus:outline-none focus:border-[#0A0A0A] resize-none" />
          </div>

          <button onClick={handleSave} className="w-full btn-primary !py-3.5 text-base">Save Moment</button>
        </div>
      )}

      {step === 'saving' && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin mb-4" />
          <p className="text-[#A3A3A3] font-display font-semibold">Saving...</p>
        </div>
      )}

      {step === 'done' && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-[#D1FAE5] flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faCheck} className="w-8 h-8 text-[#047857]" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#0A0A0A] mb-2">Captured!</h2>
          <p className="text-[#A3A3A3] text-sm mb-8">Saved to your diary</p>
          <div className="flex gap-3">
            <button onClick={() => router.push('/moments')} className="btn-primary !py-2.5">View Diary</button>
            <button onClick={() => { setStep('photo'); setPreview(''); setImageUrl(''); setMood(''); setOccasion(''); setNotes(''); setSelectedOutfit('') }}
              className="btn-secondary !py-2.5">Another</button>
          </div>
        </div>
      )}
    </div>
  )
}
