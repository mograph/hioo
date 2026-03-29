export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { adminDb, verifyToken } from '@/lib/firebase-admin'

export async function GET(req: NextRequest) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const doc = await adminDb.collection('users').doc(userId).get()
  if (!doc.exists) return NextResponse.json({ id: userId, email: null, name: null, measurements: null })
  return NextResponse.json({ id: doc.id, ...doc.data() })
}

export async function PUT(req: NextRequest) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data: any = {}
    if (body.name !== undefined) data.name = body.name
    if (body.measurements !== undefined) data.measurements = body.measurements

    await adminDb.collection('users').doc(userId).set(data, { merge: true })
    const doc = await adminDb.collection('users').doc(userId).get()
    return NextResponse.json({ id: doc.id, ...doc.data() })
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
