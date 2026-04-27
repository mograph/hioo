'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getItems, getProfile, updateProfile } from '@/lib/db'
import { fetchWithAuth } from '@/lib/api'
import { getCategoryIcon } from '@/lib/garmentIllustrations'
import { useRouter, useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faArrowLeft, faWandMagicSparkles, faXmark, faShirt, faRotate } from '@fortawesome/free-solid-svg-icons'

const CATEGORIES = ['all', 'tops', 'bottoms', 'outerwear']

export default function TryOnPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin" /></div>}>
      <TryOnInner />
    </Suspense>
  )
}

function TryOnInner() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialItemId = searchParams.get('item')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [bodyPhotoUrl, setBodyPhotoUrl] = useState('')
  const [bodyPhotoLoading, setBodyPhotoLoading] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [resultUrl, setResultUrl] = useState('')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { if (!authLoading && !user) router.push('/auth/login') }, [authLoading, user, router])

  useEffect(() => {
    if (!user) return
    getItems(user.uid).then(data => {
      setItems(data)
      if (initialItemId) {
        const item = data.find((i: any) => i.id === initialItemId)
        if (item) setSelectedItem(item)
      }
    }).catch(() => {})
    getProfile(user.uid).then((data: any) => {
      if (data.bodyPhotoUrl) setBodyPhotoUrl(data.bodyPhotoUrl)
    }).catch(() => {})
  }, [user, initialItemId])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setBodyPhotoLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetchWithAuth('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        // Make absolute URL for the AI service to fetch
        const absoluteUrl = data.url.startsWith('http') ? data.url : `${window.location.origin}${data.url}`
        setBodyPhotoUrl(absoluteUrl)
        await updateProfile(user.uid, { bodyPhotoUrl: absoluteUrl })
      }
    } catch (err) {
      setError('Failed to upload photo')
    }
    setBodyPhotoLoading(false)
  }

  const handleTryOn = async () => {
    if (!bodyPhotoUrl || !selectedItem?.imageUrl) return
    setGenerating(true)
    setError('')
    setResultUrl('')
    try {
      const res = await fetchWithAuth('/api/tryon', {
        method: 'POST',
        body: JSON.stringify({
          personUrl: bodyPhotoUrl,
          garmentUrl: selectedItem.imageUrl,
          category: selectedItem.category,
          itemId: selectedItem.id,
        }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setResultUrl(data.resultUrl)
    } catch (err: any) {
      setError(err.message || 'Try-on failed')
    }
    setGenerating(false)
  }

  const filtered = activeCategory === 'all'
    ? items.filter(i => ['tops', 'bottoms', 'outerwear'].includes(i.category))
    : items.filter(i => i.category === activeCategory)

  const tryableItems = filtered.filter(i => i.imageUrl)

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.back()} className="text-[#A3A3A3] hover:text-[#0A0A0A]">
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl text-[#0A0A0A] tracking-tight">Virtual Try-On</h1>
          <p className="text-[#A3A3A3] text-xs">See your clothes on you</p>
        </div>
      </div>

      {/* Step 1: Body photo */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-[#0A0A0A] text-white font-display text-xs flex items-center justify-center">1</span>
          <p className="font-display text-sm">Your photo</p>
        </div>
        {bodyPhotoUrl ? (
          <div className="flex gap-3 items-start">
            <img src={bodyPhotoUrl} alt="You" className="w-20 h-28 object-cover rounded-xl" />
            <div className="flex-1">
              <p className="text-xs text-[#525252] mb-2">Saved! We'll use this for all try-ons.</p>
              <button onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-display bg-[#F5F5F5] text-[#525252] px-3 py-1.5 rounded-full">
                <FontAwesomeIcon icon={faRotate} className="w-3 h-3 mr-1" />Replace
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => fileInputRef.current?.click()} disabled={bodyPhotoLoading}
            className="w-full aspect-[3/4] max-h-64 bg-[#F5F5F5] rounded-xl flex flex-col items-center justify-center hover:bg-[#E5E5E5] transition-colors disabled:opacity-50">
            {bodyPhotoLoading ? (
              <>
                <div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin mb-2" />
                <p className="text-xs font-display text-[#A3A3A3]">Uploading...</p>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCamera} className="w-10 h-10 text-[#D4D4D4] mb-2" />
                <p className="font-display text-sm text-[#525252]">Take or upload a full-body photo</p>
                <p className="text-[10px] text-[#A3A3A3] mt-1">Neutral pose, plain background works best</p>
              </>
            )}
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
      </div>

      {/* Step 2: Pick item */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-[#0A0A0A] text-white font-display text-xs flex items-center justify-center">2</span>
          <p className="font-display text-sm">Pick a piece</p>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-display whitespace-nowrap ${activeCategory === cat ? 'bg-[#0A0A0A] text-white' : 'bg-[#F5F5F5] text-[#525252]'}`}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {tryableItems.length === 0 ? (
          <div className="bg-[#FEF9C3] rounded-xl p-4 text-center">
            <p className="font-display text-sm text-[#0A0A0A]">No items with photos yet</p>
            <p className="text-xs text-[#525252] mt-1">Add photos to your closet items to try them on</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {tryableItems.map(item => (
              <button key={item.id} onClick={() => { setSelectedItem(item); setResultUrl('') }}
                className={`rounded-xl overflow-hidden border-2 transition-all ${selectedItem?.id === item.id ? 'border-[#0A0A0A] ring-2 ring-[#B8F044]/40' : 'border-transparent'}`}>
                <div className="aspect-square bg-[#F5F5F5]">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-[9px] font-display p-1 truncate">{item.name}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Step 3: Generate */}
      <button onClick={handleTryOn} disabled={!bodyPhotoUrl || !selectedItem || generating}
        className="w-full btn-primary !py-3.5 mb-4 flex items-center justify-center gap-2 disabled:opacity-40">
        <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4" />
        {generating ? 'Rendering...' : 'Try It On'}
      </button>

      {/* Generating state */}
      {generating && (
        <div className="bg-[#EDE9FE] rounded-2xl p-6 text-center mb-4">
          <div className="w-10 h-10 border-2 border-[#C4B5FD] border-t-[#6D28D9] rounded-full animate-spin mx-auto mb-3" />
          <p className="font-display text-sm text-[#6D28D9]">Putting it on you...</p>
          <p className="text-[10px] text-[#525252] mt-1">This usually takes 5-15 seconds</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-[#FFE0E6] rounded-2xl p-4 mb-4">
          <p className="font-display text-sm text-[#BE123C]">{error}</p>
          {error.includes('FAL_KEY') && (
            <p className="text-[10px] text-[#525252] mt-1">Add FAL_KEY to your .env to enable try-on</p>
          )}
        </div>
      )}

      {/* Result */}
      {resultUrl && !generating && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
          <div className="relative aspect-[3/4] bg-[#F5F5F5]">
            <img src={resultUrl} alt="Try-on result" className="w-full h-full object-contain" />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-display text-sm">{selectedItem?.name}</p>
              <p className="text-[10px] text-[#A3A3A3] uppercase">{selectedItem?.brand || selectedItem?.category}</p>
            </div>
            <a href={resultUrl} download
              className="text-[11px] font-display bg-[#B8F044] text-[#0A0A0A] px-3 py-1.5 rounded-full">
              Save image
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
