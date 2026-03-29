export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { adminDb, verifyToken } from '@/lib/firebase-admin'

export async function GET(req: NextRequest) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const snap = await adminDb.collection('users').doc(userId).collection('moments').orderBy('date', 'desc').get()
  const moments = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  return NextResponse.json(moments)
}

export async function POST(req: NextRequest) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const now = new Date().toISOString()
    const data = {
      imageUrl: body.imageUrl,
      date: body.date || now,
      notes: body.notes || null,
      mood: body.mood || null,
      occasion: body.occasion || null,
      outfitId: body.outfitId || null,
      itemIds: body.itemIds || [],
      createdAt: now,
    }

    const ref = await adminDb.collection('users').doc(userId).collection('moments').add(data)

    // Also create a wear log if outfit is tagged
    if (body.outfitId) {
      await adminDb.collection('users').doc(userId).collection('wearLogs').add({
        outfitId: body.outfitId,
        date: data.date,
        notes: body.notes || null,
        createdAt: now,
      })
    }

    return NextResponse.json({ id: ref.id, ...data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save moment' }, { status: 500 })
  }
}
