export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { adminDb, verifyToken } from '@/lib/firebase-admin'

export async function GET(req: NextRequest) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const itemsSnap = await adminDb.collection('users').doc(userId).collection('items').orderBy('timesWorn', 'desc').get()
  const items = itemsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]

  const logsSnap = await adminDb.collection('users').doc(userId).collection('wearLogs').orderBy('date', 'desc').get()
  const wearLogs = logsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]

  const categoryBreakdown: Record<string, number> = {}
  items.forEach(item => {
    categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + 1
  })

  const now = new Date()
  const ago = (days: number) => new Date(now.getTime() - days * 86400000)

  const notWorn = (cutoff: Date) => items.filter(i => {
    if (i.timesWorn === 0) return true
    const updated = i.updatedAt ? new Date(i.updatedAt) : new Date(0)
    return updated < cutoff
  }).length

  const wearByMonth: Record<string, number> = {}
  wearLogs.forEach(log => {
    const d = new Date(log.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    wearByMonth[key] = (wearByMonth[key] || 0) + 1
  })

  const wearTrend = Object.entries(wearByMonth)
    .sort(([a], [b]) => a.localeCompare(b)).slice(-12)
    .map(([month, count]) => ({ month, count }))

  const costPerWear = items
    .filter(i => i.price && i.timesWorn > 0)
    .map(i => ({ name: i.name, costPerWear: Math.round((i.price / i.timesWorn) * 100) / 100, price: i.price, timesWorn: i.timesWorn }))
    .sort((a, b) => a.costPerWear - b.costPerWear).slice(0, 10)

  return NextResponse.json({
    totalItems: items.length,
    mostWorn: items.slice(0, 10).map(i => ({ name: i.name, timesWorn: i.timesWorn, category: i.category })),
    categoryBreakdown: Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value })),
    notWorn: { days30: notWorn(ago(30)), days60: notWorn(ago(60)), days90: notWorn(ago(90)) },
    wearTrend,
    costPerWear,
    totalWearLogs: wearLogs.length,
  })
}
