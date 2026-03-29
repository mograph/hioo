export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { adminDb, verifyToken } from '@/lib/firebase-admin'

export async function GET(req: NextRequest) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const snap = await adminDb.collection('users').doc(userId).collection('outfits').orderBy('createdAt', 'desc').get()
  const outfits = []

  for (const doc of snap.docs) {
    const data = doc.data()
    const items: any[] = []
    if (data.itemIds?.length) {
      for (let i = 0; i < data.itemIds.length; i += 10) {
        const batch = data.itemIds.slice(i, i + 10)
        const itemsSnap = await adminDb.collection('users').doc(userId).collection('items')
          .where('__name__', 'in', batch).get()
        itemsSnap.docs.forEach(d => items.push({ clothingItem: { id: d.id, ...d.data() } }))
      }
    }
    outfits.push({ id: doc.id, ...data, items })
  }

  return NextResponse.json(outfits)
}

export async function POST(req: NextRequest) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const now = new Date().toISOString()
    const data = {
      name: body.name,
      occasion: body.occasion || null,
      date: body.date || null,
      imageUrl: body.imageUrl || null,
      itemIds: body.itemIds || [],
      createdAt: now,
      updatedAt: now,
    }
    const ref = await adminDb.collection('users').doc(userId).collection('outfits').add(data)
    return NextResponse.json({ id: ref.id, ...data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create outfit' }, { status: 500 })
  }
}
