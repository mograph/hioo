'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getWearLogs } from '@/lib/db'
import { useRouter } from 'next/navigation'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'

export default function CalendarPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [logs, setLogs] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [authLoading, user, router])

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

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      <h1 className="font-display text-3xl font-bold text-[#0A0A0A] tracking-tight mb-5">Calendar</h1>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
          className="w-10 h-10 rounded-xl bg-[#F5F5F5] flex items-center justify-center font-display font-bold text-lg hover:bg-[#E5E5E5]">‹</button>
        <h2 className="font-display text-lg font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
          className="w-10 h-10 rounded-xl bg-[#F5F5F5] flex items-center justify-center font-display font-bold text-lg hover:bg-[#E5E5E5]">›</button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 mb-4">
        <div className="grid grid-cols-7 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-display font-bold text-[#A3A3A3] py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
          {days.map(day => {
            const dayLogs = getLogsForDay(day)
            const hasLogs = dayLogs.length > 0
            const isSelected = selectedDay && isSameDay(day, selectedDay)
            return (
              <button key={day.toISOString()} onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-display font-semibold transition-all ${
                  isSelected ? 'bg-[#0A0A0A] text-white' :
                  isToday(day) ? 'bg-[#B8F044] text-[#0A0A0A]' :
                  hasLogs ? 'bg-[#FFE0D0] text-[#C2410C]' :
                  'hover:bg-[#F5F5F5] text-[#525252]'
                }`}>
                {format(day, 'd')}
                {hasLogs && !isSelected && <div className="w-1 h-1 rounded-full bg-[#FF6B35] mt-0.5" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Day detail */}
      {selectedDay && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
          <p className="font-display text-lg font-bold">{format(selectedDay, 'EEEE, MMM d')}</p>
          {selectedLogs.length === 0 ? (
            <p className="text-[#A3A3A3] text-sm mt-2">No outfit logged</p>
          ) : (
            <div className="mt-3 space-y-2">
              {selectedLogs.map((log: any) => (
                <div key={log.id} className="bg-[#F5F5F5] rounded-xl p-3">
                  <p className="font-display font-bold text-sm">{log.outfit?.name || 'Outfit'}</p>
                  {log.notes && <p className="text-xs text-[#525252] mt-1">{log.notes}</p>}
                  {log.outfit?.items && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {log.outfit.items.map((item: any) => (
                        <span key={item.clothingItem?.id} className="text-[10px] font-bold font-display px-2 py-0.5 rounded-full bg-white text-[#525252]">
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
      )}
    </div>
  )
}
