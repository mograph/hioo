'use client'
import { useState, useEffect, useRef, Suspense, useMemo } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getItems, getProfile, updateProfile } from '@/lib/db'
import { fetchWithAuth } from '@/lib/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faArrowLeft, faRotate, faLock, faLockOpen, faShuffle, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

const TRYON_CATEGORIES = ['tops', 'bottoms', 'outerwear'] as const
type Cat = typeof TRYON_CATEGORIES[number]

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  tops:      { bg: 'bg-[#FFE0D0]', text: 'text-[#C2410C]' },
  bottoms:   { bg: 'bg-[#E0F2FE]', text: 'text-[#0369A1]' },
  outerwear: { bg: 'bg-[#EDE9FE]', text: 'text-[#6D28D9]' },
}

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

  // Per-category selected index + lock + cached render URL
  const [selectedIndex, setSelectedIndex] = useState<Record<string, number>>({})
  const [locked, setLocked] = useState<Record<string, boolean>>({})
  const [renderedUrl, setRenderedUrl] = useState<Record<string, string>>({})
  const [renderingFor, setRenderingFor] = useState<string | null>(null)
  const [activePreviewCat, setActivePreviewCat] = useState<Cat>('tops')
  const [error, setError] = useState('')

  useEffect(() => { if (!authLoading && !user) router.push('/auth/login') }, [authLoading, user, router])

  useEffect(() => {
    if (!user) return
    getItems(user.uid).then((data: any[]) => {
      setItems(data)
      if (initialItemId) {
        const item: any = data.find((i: any) => i.id === initialItemId)
        if (item && TRYON_CATEGORIES.includes(item.category as Cat)) {
          setActivePreviewCat(item.category as Cat)
          const catItems = data.filter((i: any) => i.category === item.category && i.imageUrl)
          const idx = catItems.findIndex((i: any) => i.id === item.id)
          if (idx >= 0) setSelectedIndex(prev => ({ ...prev, [item.category]: idx }))
        }
      }
    }).catch(() => {})
    getProfile(user.uid).then((data: any) => {
      if (data.bodyPhotoUrl) setBodyPhotoUrl(data.bodyPhotoUrl)
    }).catch(() => {})
  }, [user, initialItemId])

  const itemsByCat = useMemo(() => {
    const result: Record<Cat, any[]> = { tops: [], bottoms: [], outerwear: [] }
    for (const item of items) {
      if (item.imageUrl && TRYON_CATEGORIES.includes(item.category as Cat)) {
        result[item.category as Cat].push(item)
      }
    }
    return result
  }, [items])

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
        const absoluteUrl = data.url.startsWith('http') ? data.url : `${window.location.origin}${data.url}`
        setBodyPhotoUrl(absoluteUrl)
        await updateProfile(user.uid, { bodyPhotoUrl: absoluteUrl })
        setRenderedUrl({})
      }
    } catch (err) {
      setError('Failed to upload photo')
    }
    setBodyPhotoLoading(false)
  }

  const renderTryOn = async (cat: Cat, item: any) => {
    if (!bodyPhotoUrl || !item?.imageUrl) return
    const cacheKey = `${cat}:${item.id}`
    if (renderedUrl[cacheKey]) {
      setActivePreviewCat(cat)
      return
    }
    setRenderingFor(cacheKey)
    setActivePreviewCat(cat)
    setError('')
    try {
      const res = await fetchWithAuth('/api/tryon', {
        method: 'POST',
        body: JSON.stringify({
          personUrl: bodyPhotoUrl,
          garmentUrl: item.imageUrl,
          category: item.category,
          itemId: item.id,
        }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else if (data.resultUrl) {
        setRenderedUrl(prev => ({ ...prev, [cacheKey]: data.resultUrl }))
      }
    } catch (err: any) {
      setError(err.message || 'Try-on failed')
    }
    setRenderingFor(null)
  }

  const selectAt = (cat: Cat, idx: number) => {
    setSelectedIndex(prev => ({ ...prev, [cat]: idx }))
    const item = itemsByCat[cat][idx]
    if (item) renderTryOn(cat, item)
  }

  const toggleLock = (cat: Cat) => {
    setLocked(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  const shuffle = () => {
    const next = { ...selectedIndex }
    for (const cat of TRYON_CATEGORIES) {
      if (locked[cat]) continue
      const list = itemsByCat[cat]
      if (!list.length) continue
      next[cat] = Math.floor(Math.random() * list.length)
    }
    setSelectedIndex(next)
    // Auto-render the active category's new pick
    const item = itemsByCat[activePreviewCat][next[activePreviewCat] ?? 0]
    if (item) renderTryOn(activePreviewCat, item)
  }

  const activeItem = itemsByCat[activePreviewCat]?.[selectedIndex[activePreviewCat] ?? 0]
  const activeRenderKey = activeItem ? `${activePreviewCat}:${activeItem.id}` : null
  const previewUrl = activeRenderKey && renderedUrl[activeRenderKey]
  const isRenderingActive = renderingFor === activeRenderKey

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.back()} className="text-[#A3A3A3] hover:text-[#0A0A0A]">
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-2xl text-[#0A0A0A] tracking-tight">Try-On</h1>
          <p className="text-[#A3A3A3] text-xs">Slide to swap clothes on you</p>
        </div>
        {bodyPhotoUrl && (
          <button onClick={() => fileInputRef.current?.click()}
            className="text-[10px] font-display bg-[#F5F5F5] text-[#525252] px-3 py-1.5 rounded-full">
            <FontAwesomeIcon icon={faRotate} className="w-2.5 h-2.5 mr-1" />Replace photo
          </button>
        )}
      </div>

      {/* No body photo yet */}
      {!bodyPhotoUrl ? (
        <button onClick={() => fileInputRef.current?.click()} disabled={bodyPhotoLoading}
          className="w-full aspect-[3/4] bg-white rounded-3xl border-2 border-dashed border-[#E5E5E5] flex flex-col items-center justify-center hover:border-[#0A0A0A] transition-colors">
          {bodyPhotoLoading ? (
            <>
              <div className="w-10 h-10 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin mb-3" />
              <p className="font-display text-sm text-[#525252]">Uploading...</p>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCamera} className="w-12 h-12 text-[#D4D4D4] mb-3" />
              <p className="font-display text-base text-[#0A0A0A]">Add your photo to start</p>
              <p className="text-xs text-[#A3A3A3] mt-1">Full body, neutral pose, plain background</p>
            </>
          )}
        </button>
      ) : (
        <>
          {/* Big preview area */}
          <div className="bg-[#F5F5F5] rounded-3xl overflow-hidden mb-4 relative aspect-[3/4]">
            {isRenderingActive ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <img src={bodyPhotoUrl} alt="You" className="w-full h-full object-cover absolute inset-0 opacity-30" />
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#E5E5E5] border-t-[#FF6B35] rounded-full animate-spin" />
                  <p className="font-display text-xs text-[#525252]">Putting it on you...</p>
                </div>
              </div>
            ) : previewUrl ? (
              <img src={previewUrl} alt="Try-on result" className="w-full h-full object-cover" />
            ) : (
              <img src={bodyPhotoUrl} alt="You" className="w-full h-full object-cover" />
            )}
            {activeItem && (
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                <p className="font-display text-xs">{activeItem.name}</p>
              </div>
            )}
          </div>

          {/* Shuffle button */}
          <button onClick={shuffle}
            className="w-full mb-4 bg-[#B8F044] text-[#0A0A0A] py-3 rounded-full font-display flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faShuffle} className="w-4 h-4" /> Shuffle Unlocked
          </button>

          {/* Error */}
          {error && (
            <div className="bg-[#FFE0E6] rounded-2xl p-4 mb-4">
              <p className="font-display text-sm text-[#BE123C]">{error}</p>
              {error.includes('FAL_KEY') && (
                <p className="text-[10px] text-[#525252] mt-1">Add FAL_KEY to your .env to enable try-on</p>
              )}
            </div>
          )}

          {/* Category carousels */}
          <div className="space-y-3">
            {TRYON_CATEGORIES.map(cat => {
              const list = itemsByCat[cat]
              const selectedIdx = selectedIndex[cat] ?? 0
              const isLocked = !!locked[cat]
              const colors = CATEGORY_COLORS[cat]

              if (!list.length) {
                return (
                  <div key={cat} className={`${colors.bg} rounded-2xl p-4 opacity-60`}>
                    <p className={`font-display text-[11px] uppercase ${colors.text} mb-1`}>{cat}</p>
                    <p className="text-xs text-[#A3A3A3]">No items with photos in this category</p>
                  </div>
                )
              }

              return (
                <div key={cat}
                  className={`${isLocked ? 'bg-white border-2 border-[#0A0A0A]' : 'bg-white border border-[#E5E5E5]'} rounded-2xl overflow-hidden transition-all ${activePreviewCat === cat ? 'ring-2 ring-[#B8F044]/50' : ''}`}>
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#F5F5F5]">
                    <div className="flex items-center gap-2">
                      <span className={`font-display text-[11px] uppercase px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                        {cat}
                      </span>
                      <span className="text-[10px] text-[#A3A3A3] font-display">{selectedIdx + 1}/{list.length}</span>
                    </div>
                    <button onClick={() => toggleLock(cat)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isLocked ? 'bg-[#0A0A0A] text-white' : 'bg-[#F5F5F5] text-[#525252] hover:bg-[#E5E5E5]'}`}>
                      <FontAwesomeIcon icon={isLocked ? faLock : faLockOpen} className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 py-4 no-scrollbar">
                    {list.map((item, i) => {
                      const cacheKey = `${cat}:${item.id}`
                      const hasRender = !!renderedUrl[cacheKey]
                      const isActive = i === selectedIdx
                      return (
                        <button key={item.id} onClick={() => selectAt(cat, i)}
                          className={`snap-center flex-shrink-0 w-24 transition-transform ${isActive ? 'scale-100' : 'scale-90 opacity-50'}`}>
                          <div className="relative aspect-square bg-[#F5F5F5] rounded-xl overflow-hidden">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            {hasRender && (
                              <div className="absolute top-1 right-1 bg-[#B8F044] rounded-full w-4 h-4 flex items-center justify-center">
                                <FontAwesomeIcon icon={faWandMagicSparkles} className="w-2 h-2 text-[#0A0A0A]" />
                              </div>
                            )}
                          </div>
                          <p className="font-display text-[10px] text-[#0A0A0A] mt-1 truncate leading-tight">{item.name}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
    </div>
  )
}
