export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { adminDb, verifyToken } from '@/lib/firebase-admin'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const doc = await adminDb.collection('users').doc(userId).collection('items').doc(params.id).get()
  if (!doc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ id: doc.id, ...doc.data() })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data: any = { updatedAt: new Date().toISOString() }
    if (body.name !== undefined) data.name = body.name
    if (body.category !== undefined) data.category = body.category
    if (body.color !== undefined) data.color = body.color
    if (body.brand !== undefined) data.brand = body.brand
    if (body.occasions !== undefined) data.occasions = body.occasions
    if (body.seasons !== undefined) data.seasons = body.seasons
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl
    if (body.price !== undefined) data.price = body.price ? parseFloat(body.price) : null
    if (body.purchaseDate !== undefined) data.purchaseDate = body.purchaseDate
    if (body.timesWorn !== undefined) data.timesWorn = parseInt(body.timesWorn)

    await adminDb.collection('users').doc(userId).collection('items').doc(params.id).update(data)
    return NextResponse.json({ updated: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await adminDb.collection('users').doc(userId).collection('items').doc(params.id).delete()
  return NextResponse.json({ deleted: true })
}
