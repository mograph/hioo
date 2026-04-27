'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getMoments } from '@/lib/db'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

interface Moment { id: string; imageUrl: string; date: string; notes?: string | null; mood?: string | null; occasion?: string | null }

const MOOD_EMOJIS: Record<string, string> = { 'Fire': '🔥', 'Love it': '😍', 'Good': '😊', 'Meh': '😐', 'Off day': '😩' }

export default function MomentsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [moments, setMoments] = useState<Moment[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Moment | null>(null)

  useEffect(() => { if (!authLoading && !user) router.push('/auth/login') }, [authLoading, user, router])
  useEffect(() => { if (user) getMoments(user.uid).then(d => { setMoments(d as Moment[]); setLoading(false) }).catch(() => setLoading(false)) }, [user])

  const formatDate = (s: string) => {
    const d = Math.floor((Date.now() - new Date(s).getTime()) / 86400000)
    if (d === 0) return 'Today'; if (d === 1) return 'Yesterday'; if (d < 7) return `${d}d ago`
    return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0A0A0A] tracking-tight">Diary</h1>
          <p className="text-[#A3A3A3] font-display text-sm font-semibold">{moments.length} moments</p>
        </div>
        <Link href="/capture" className="bg-[#B8F044] text-[#0A0A0A] px-4 py-2 rounded-full font-display font-bold text-sm flex items-center gap-1.5">
          <FontAwesomeIcon icon={faPlus} className="w-3 h-3" /> Capture
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin" /></div>
      ) : moments.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-[#FFE0D0] rounded-3xl p-8">
            <FontAwesomeIcon icon={faCamera} className="w-12 h-12 text-[#FF6B35] mx-auto mb-3" />
            <p className="font-display text-xl font-bold text-[#0A0A0A] mb-1">No moments yet</p>
            <p className="text-[#525252] text-sm mb-5">Start capturing daily outfits</p>
            <Link href="/capture" className="btn-primary !text-sm">Capture First</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5 rounded-2xl overflow-hidden">
          {moments.map(m => (
            <button key={m.id} onClick={() => setSelected(m)} className="relative aspect-square group">
              <img src={m.imageUrl} alt="" className="w-full h-full object-cover rounded-xl" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl" />
              {m.mood && MOOD_EMOJIS[m.mood] && <span className="absolute bottom-1.5 right-1.5 text-sm drop-shadow-md">{MOOD_EMOJIS[m.mood]}</span>}
            </button>
          ))}
        </div>
      )}

      {/* Detail overlay */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img src={selected.imageUrl} alt="" className="w-full aspect-[3/4] object-cover rounded-t-3xl sm:rounded-t-3xl" />
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm">
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
              </button>
              {selected.mood && MOOD_EMOJIS[selected.mood] && (
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 font-display font-bold text-sm flex items-center gap-1.5">
                  <span>{MOOD_EMOJIS[selected.mood]}</span>{selected.mood}
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-sm font-semibold text-[#A3A3A3]">{formatDate(selected.date)}</span>
                {selected.occasion && <span className="text-xs font-display font-bold px-3 py-1 rounded-full bg-[#F5F5F5] text-[#525252] uppercase">{selected.occasion}</span>}
              </div>
              {selected.notes ? <p className="text-sm leading-relaxed">{selected.notes}</p> : <p className="text-[#D4D4D4] text-sm italic">No notes</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
