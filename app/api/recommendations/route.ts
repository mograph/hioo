export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { adminDb, verifyToken } from '@/lib/firebase-admin'
import { getRecommendations } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const occasion = searchParams.get('occasion') || undefined
  const temperature = searchParams.get('temperature') ? parseFloat(searchParams.get('temperature')!) : undefined

  const snap = await adminDb.collection('users').doc(userId).collection('items').get()
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))

  const recommendations = getRecommendations(items, occasion, temperature)
  return NextResponse.json({ recommendations })
}
