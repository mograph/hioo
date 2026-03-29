'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { getAnalytics } from '@/lib/db'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#FF6B35', '#B8F044', '#7DD3FC', '#C4B5FD', '#FF8FA3', '#FDE047']

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) { getAnalytics(user.uid).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false)) }
  }, [user])

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin" /></div>
  if (!data) return null

  const stats = [
    { label: 'Pieces', value: data.totalItems, color: 'bg-[#FFE0D0]', text: 'text-[#FF6B35]' },
    { label: 'Wears', value: data.totalWearLogs, color: 'bg-[#D1FAE5]', text: 'text-[#047857]' },
    { label: 'Unworn', value: data.notWorn.days30, color: 'bg-[#FEF9C3]', text: 'text-[#A16207]' },
  ]

  return (
    <div className="max-w-lg mx-auto px-5 py-6 pb-nav">
      <h1 className="font-display text-3xl font-bold text-[#0A0A0A] tracking-tight mb-5">Analytics</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <p className={`font-display text-3xl font-bold ${s.text}`}>{s.value}</p>
            <p className="font-display text-xs font-bold text-[#525252] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Most worn */}
      {data.mostWorn.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-4">
          <h2 className="font-display text-lg font-bold text-[#0A0A0A] mb-3">Most Worn</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.mostWorn.slice(0, 6)} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="timesWorn" fill="#FF6B35" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category breakdown */}
      {data.categoryBreakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-4">
          <h2 className="font-display text-lg font-bold text-[#0A0A0A] mb-3">Categories</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.categoryBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value"
                label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                {data.categoryBreakdown.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cost per wear */}
      {data.costPerWear.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
          <h2 className="font-display text-lg font-bold text-[#0A0A0A] mb-3">Best Value</h2>
          <div className="space-y-2">
            {data.costPerWear.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#F5F5F5] last:border-0">
                <div>
                  <p className="font-display text-sm font-bold">{item.name}</p>
                  <p className="text-[10px] text-[#A3A3A3]">${item.price} / {item.timesWorn} wears</p>
                </div>
                <span className="font-display text-sm font-bold text-[#047857]">${item.costPerWear}/wear</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
