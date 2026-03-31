'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getWearLogs } from '@/lib/db'
import { useRouter } from 'next/navigation'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faShirt, faFire, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

export default function CalendarPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [logs, setLogs] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (!authLoading && !user) router.push('/auth/login') }, [authLoading, user, router])

  useEffect(() => {
    if (!user) return
    setLoading(true)
    const month = currentDate.getMonth() + 1
    const year = currentDate.getFullYear()
    getWearLogs(user.uid, month, year)
      .then(data => { setLogs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user, currentDate])

  const days = eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) })
  const getLogsForDay = (day: Date) => logs.filter(l => isSameDay(new Date(l.date), day))
  const selectedLogs = selectedDay ? getLogsForDay(selectedDay) : []
  const firstDayOfWeek = startOfMonth(currentDate).getDay()

  // Calculate streak
  const daysWithOutfits = days.filter(d => getLogsForDay(d).length > 0).length
  const uniqueOutfits = new Set(logs.map(l => l.outfitId).filter(Boolean)).size

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      <h1 className="font-display text-3xl text-[#0A0A0A] tracking-tight mb-2">Wear Diary</h1>
      <p className="text-[#A3A3A3] text-sm mb-5">Track what you wear every day</p>

      {/* Month stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="bg-[#FFE0D0] rounded-2xl p-3 text-center">
          <FontAwesomeIcon icon={faCalendarCheck} className="w-4 h-4 text-[#FF6B35] mb-1" />
          <p className="font-display text-2xl text-[#FF6B35]">{daysWithOutfits}</p>
          <p className="text-[9px] font-display text-[#525252] uppercase">Days Logged</p>
        </div>
        <div className="bg-[#EDE9FE] rounded-2xl p-3 text-center">
          <FontAwesomeIcon icon={faShirt} className="w-4 h-4 text-[#6D28D9] mb-1" />
          <p className="font-display text-2xl text-[#6D28D9]">{uniqueOutfits}</p>
          <p className="text-[9px] font-display text-[#525252] uppercase">Outfits</p>
        </div>
        <div className="bg-[#D1FAE5] rounded-2xl p-3 text-center">
          <FontAwesomeIcon icon={faFire} className="w-4 h-4 text-[#047857] mb-1" />
          <p className="font-display text-2xl text-[#047857]">{daysWithOutfits > 0 ? Math.round((daysWithOutfits / days.length) * 100) : 0}%</p>
          <p className="text-[9px] font-display text-[#525252] uppercase">Tracked</p>
        </div>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
          className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center hover:bg-[#E5E5E5]">
          <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3 text-[#525252]" />
        </button>
        <h2 className="font-display text-lg">{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
          className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center hover:bg-[#E5E5E5]">
          <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-[#525252]" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-3 mb-4">
        <div className="grid grid-cols-7 mb-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-display text-[#A3A3A3] py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} className="aspect-square" />)}
          {days.map(day => {
            const dayLogs = getLogsForDay(day)
            const hasLogs = dayLogs.length > 0
            const isSelected = selectedDay && isSameDay(day, selectedDay)
            const outfitName = hasLogs ? (dayLogs[0].outfit?.name || '') : ''
            return (
              <button key={day.toISOString()} onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-display transition-all relative ${
                  isSelected ? 'bg-[#0A0A0A] text-white scale-110 z-10 shadow-lg' :
                  isToday(day) ? 'bg-[#B8F044] text-[#0A0A0A]' :
                  hasLogs ? 'bg-[#FFE0D0] text-[#C2410C]' :
                  'hover:bg-[#F5F5F5] text-[#525252]'
                }`}>
                <span className="font-semibold">{format(day, 'd')}</span>
                {hasLogs && !isSelected && (
                  <FontAwesomeIcon icon={faShirt} className="w-2 h-2 mt-0.5 text-[#FF6B35]" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Day detail */}
      {selectedDay ? (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
          <div className="bg-[#F5F5F5] px-5 py-3 border-b border-[#E5E5E5]">
            <p className="font-display text-base">{format(selectedDay, 'EEEE, MMMM d')}</p>
          </div>
          <div className="p-5">
            {selectedLogs.length === 0 ? (
              <div className="text-center py-6">
                <FontAwesomeIcon icon={faShirt} className="w-8 h-8 text-[#E5E5E5] mb-2" />
                <p className="font-display text-sm text-[#A3A3A3]">No outfit logged</p>
                <Link href="/capture" className="inline-block mt-3 bg-[#B8F044] text-[#0A0A0A] px-4 py-2 rounded-full font-display text-xs">
                  Log an outfit
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedLogs.map((log: any) => (
                  <div key={log.id} className="bg-[#F5F5F5] rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#FFE0D0] flex items-center justify-center">
                        <FontAwesomeIcon icon={faShirt} className="w-3.5 h-3.5 text-[#FF6B35]" />
                      </div>
                      <p className="font-display text-sm">{log.outfit?.name || 'Outfit'}</p>
                    </div>
                    {log.notes && <p className="text-xs text-[#525252] ml-10">{log.notes}</p>}
                    {log.outfit?.items && (
                      <div className="flex gap-1.5 mt-2 ml-10 flex-wrap">
                        {log.outfit.items.map((item: any) => (
                          <span key={item.clothingItem?.id} className="text-[9px] font-display px-2 py-0.5 rounded-full bg-white text-[#525252] border border-[#E5E5E5]">
                            {item.clothingItem?.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#F5F5F5] rounded-2xl p-5 text-center">
          <p className="font-display text-sm text-[#A3A3A3]">Tap a day to see your outfit</p>
          {loading && <p className="text-xs text-[#D4D4D4] mt-1">Loading...</p>}
        </div>
      )}
    </div>
  )
}
