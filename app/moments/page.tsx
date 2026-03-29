'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getMoments } from '@/lib/db'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Moment {
  id: string
  imageUrl: string
  date: string
  notes?: string | null
  mood?: string | null
  occasion?: string | null
  outfitId?: string | null
}

const MOOD_EMOJIS: Record<string, string> = {
  'Fire': '🔥',
  'Love it': '😍',
  'Good': '😊',
  'Meh': '😐',
  'Off day': '😩',
}

export default function MomentsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [moments, setMoments] = useState<Moment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      getMoments(user.uid)
        .then(data => { setMoments(data as Moment[]); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [user])

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / 86400000)

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 min-h-[calc(100vh-56px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-medium text-[#1a1a1a]">My Diary</h1>
          <p className="text-sm text-[#6b6157]">{moments.length} moments captured</p>
        </div>
        <Link href="/capture" className="btn-primary !py-2 !px-4 !text-sm">
          + Capture
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#e0d6ca] border-t-[#c47d5a] rounded-full animate-spin" />
        </div>
      ) : moments.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-white rounded-2xl border border-[#e0d6ca] p-8">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9c8e80" strokeWidth="1.5" className="mx-auto mb-4">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <h2 className="font-serif text-xl font-medium text-[#1a1a1a] mb-2">No moments yet</h2>
            <p className="text-sm text-[#6b6157] mb-6">Start capturing your daily outfits</p>
            <Link href="/capture" className="btn-primary">Capture First Moment</Link>
          </div>
        </div>
      ) : (
        <>
          {/* Photo grid */}
          <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">
            {moments.map(moment => (
              <button
                key={moment.id}
                onClick={() => setSelectedMoment(moment)}
                className="relative aspect-square group"
              >
                <img
                  src={moment.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                {moment.mood && MOOD_EMOJIS[moment.mood] && (
                  <span className="absolute bottom-1 right-1 text-sm drop-shadow-md">
                    {MOOD_EMOJIS[moment.mood]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Moment detail overlay */}
      {selectedMoment && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center" onClick={() => setSelectedMoment(null)}>
          <div
            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedMoment.imageUrl}
                alt=""
                className="w-full aspect-[3/4] object-cover rounded-t-2xl sm:rounded-t-2xl"
              />
              <button
                onClick={() => setSelectedMoment(null)}
                className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm"
              >
                ×
              </button>
              {selectedMoment.mood && MOOD_EMOJIS[selectedMoment.mood] && (
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1.5">
                  <span>{MOOD_EMOJIS[selectedMoment.mood]}</span>
                  <span className="text-[#1a1a1a]">{selectedMoment.mood}</span>
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#6b6157]">{formatDate(selectedMoment.date)}</span>
                {selectedMoment.occasion && (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#f6f1eb] text-[#6b6157]">
                    {selectedMoment.occasion}
                  </span>
                )}
              </div>
              {selectedMoment.notes && (
                <p className="text-[#1a1a1a] text-sm leading-relaxed">{selectedMoment.notes}</p>
              )}
              {!selectedMoment.notes && !selectedMoment.occasion && (
                <p className="text-[#9c8e80] text-sm italic">No notes added</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
