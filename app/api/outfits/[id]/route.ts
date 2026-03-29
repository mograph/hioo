export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { adminDb, verifyToken } from '@/lib/firebase-admin'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const doc = await adminDb.collection('users').doc(userId).collection('outfits').doc(params.id).get()
  if (!doc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const data = doc.data()!
  const items: any[] = []
  if (data.itemIds?.length) {
    for (let i = 0; i < data.itemIds.length; i += 10) {
      const batch = data.itemIds.slice(i, i + 10)
      const itemsSnap = await adminDb.collection('users').doc(userId).collection('items')
        .where('__name__', 'in', batch).get()
      itemsSnap.docs.forEach(d => items.push({ clothingItem: { id: d.id, ...d.data() } }))
    }
  }

  const logsSnap = await adminDb.collection('users').doc(userId).collection('wearLogs')
    .where('outfitId', '==', params.id).orderBy('date', 'desc').get()
  const wearLogs = logsSnap.docs.map(d => ({ id: d.id, ...d.data() }))

  return NextResponse.json({ id: doc.id, ...data, items, wearLogs })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await adminDb.collection('users').doc(userId).collection('outfits').doc(params.id).delete()
  return NextResponse.json({ deleted: true })
}
