export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { adminDb, verifyToken } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function GET(req: NextRequest) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month')
  const year = searchParams.get('year')

  let query = adminDb.collection('users').doc(userId).collection('wearLogs').orderBy('date', 'desc') as FirebaseFirestore.Query

  if (month && year) {
    const start = new Date(parseInt(year), parseInt(month) - 1, 1).toISOString()
    const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59).toISOString()
    query = query.where('date', '>=', start).where('date', '<=', end)
  }

  const snap = await query.get()
  const logs = []

  for (const doc of snap.docs) {
    const data = doc.data()
    let outfit = null
    if (data.outfitId) {
      const outfitDoc = await adminDb.collection('users').doc(userId).collection('outfits').doc(data.outfitId).get()
      if (outfitDoc.exists) {
        const outfitData = outfitDoc.data()!
        const items: any[] = []
        if (outfitData.itemIds?.length) {
          for (let i = 0; i < outfitData.itemIds.length; i += 10) {
            const batch = outfitData.itemIds.slice(i, i + 10)
            const itemsSnap = await adminDb.collection('users').doc(userId).collection('items')
              .where('__name__', 'in', batch).get()
            itemsSnap.docs.forEach(d => items.push({ clothingItem: { id: d.id, ...d.data() } }))
          }
        }
        outfit = { id: outfitDoc.id, ...outfitData, items }
      }
    }
    logs.push({ id: doc.id, ...data, outfit })
  }

  return NextResponse.json(logs)
}

export async function POST(req: NextRequest) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = {
      outfitId: body.outfitId || null,
      date: body.date || new Date().toISOString(),
      notes: body.notes || null,
      createdAt: new Date().toISOString(),
    }
    const ref = await adminDb.collection('users').doc(userId).collection('wearLogs').add(data)

    if (body.outfitId) {
      const outfitDoc = await adminDb.collection('users').doc(userId).collection('outfits').doc(body.outfitId).get()
      if (outfitDoc.exists) {
        const itemIds = outfitDoc.data()!.itemIds || []
        await Promise.all(itemIds.map((itemId: string) =>
          adminDb.collection('users').doc(userId).collection('items').doc(itemId).update({
            timesWorn: FieldValue.increment(1),
          })
        ))
      }
    }

    return NextResponse.json({ id: ref.id, ...data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create wear log' }, { status: 500 })
  }
}
