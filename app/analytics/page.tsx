'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getAnalytics } from '@/lib/db'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShirt, faCalendarCheck, faEyeSlash, faDollarSign } from '@fortawesome/free-solid-svg-icons'

const COLORS = ['#FF6B35', '#B8F044', '#7DD3FC', '#C4B5FD', '#FF8FA3', '#FDE047']

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (!authLoading && !user) router.push('/auth/login') }, [authLoading, user, router])
  useEffect(() => { if (user) getAnalytics(user.uid).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false)) }, [user])

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin" /></div>
  if (!data) return null

  const stats = [
    { label: 'Pieces', value: data.totalItems, color: 'bg-[#FFE0D0]', text: 'text-[#FF6B35]', icon: faShirt },
    { label: 'Wears', value: data.totalWearLogs, color: 'bg-[#D1FAE5]', text: 'text-[#047857]', icon: faCalendarCheck },
    { label: 'Unworn', value: data.notWorn.days30, color: 'bg-[#FEF9C3]', text: 'text-[#A16207]', icon: faEyeSlash },
  ]

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      <h1 className="font-display text-3xl text-[#0A0A0A] tracking-tight mb-2">Style Stats</h1>
      <p className="text-[#A3A3A3] text-sm mb-5">Your wardrobe at a glance</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <FontAwesomeIcon icon={s.icon} className={`w-4 h-4 ${s.text} mb-1`} />
            <p className={`font-display text-3xl ${s.text}`}>{s.value}</p>
            <p className="font-display text-[10px] text-[#525252] uppercase mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Most worn */}
      {data.mostWorn.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-4">
          <h2 className="font-display text-lg text-[#0A0A0A] mb-4">Most Worn Items</h2>
          <div className="space-y-2.5">
            {data.mostWorn.slice(0, 6).map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FFE0D0] flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-xs text-[#FF6B35]">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm truncate">{item.name}</p>
                  <p className="text-[10px] text-[#A3A3A3] uppercase">{item.category}</p>
                </div>
                <span className="font-display text-sm text-[#FF6B35]">{item.timesWorn}x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category breakdown */}
      {data.categoryBreakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-4">
          <h2 className="font-display text-lg text-[#0A0A0A] mb-3">Wardrobe Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.categoryBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value"
                label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                {data.categoryBreakdown.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {data.categoryBreakdown.map((cat: any, i: number) => (
              <div key={cat.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-[10px] font-display text-[#525252] capitalize">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost per wear */}
      {data.costPerWear.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
          <div className="flex items-center gap-2 mb-3">
            <FontAwesomeIcon icon={faDollarSign} className="w-4 h-4 text-[#047857]" />
            <h2 className="font-display text-lg text-[#0A0A0A]">Cost Per Wear</h2>
          </div>
          <div className="space-y-2">
            {data.costPerWear.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#F5F5F5] last:border-0">
                <div>
                  <p className="font-display text-sm">{item.name}</p>
                  <p className="text-[10px] text-[#A3A3A3]">${item.price} &middot; {item.timesWorn} wears</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-display ${item.costPerWear < 10 ? 'bg-[#D1FAE5] text-[#047857]' : item.costPerWear < 25 ? 'bg-[#FEF9C3] text-[#A16207]' : 'bg-[#FFE0E6] text-[#BE123C]'}`}>
                  ${item.costPerWear}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
