export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { adminDb, verifyToken } from '@/lib/firebase-admin'

export async function GET(req: NextRequest) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const color = searchParams.get('color')

  let query = adminDb.collection('users').doc(userId).collection('items').orderBy('createdAt', 'desc') as FirebaseFirestore.Query
  if (category) query = query.where('category', '==', category)
  if (color) query = query.where('color', '==', color)

  const snap = await query.get()
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const now = new Date().toISOString()
    const data = {
      name: body.name,
      category: body.category,
      color: body.color || null,
      brand: body.brand || null,
      occasions: body.occasions || null,
      seasons: body.seasons || null,
      imageUrl: body.imageUrl || null,
      price: body.price ? parseFloat(body.price) : null,
      purchaseDate: body.purchaseDate || null,
      timesWorn: 0,
      createdAt: now,
      updatedAt: now,
    }
    const ref = await adminDb.collection('users').doc(userId).collection('items').add(data)
    return NextResponse.json({ id: ref.id, ...data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}
