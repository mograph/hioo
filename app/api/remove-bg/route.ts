export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.FAL_KEY) {
    return NextResponse.json({ error: 'FAL_KEY not configured' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const { imageUrl } = body
    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing imageUrl' }, { status: 400 })
    }

    const { fal } = await import('@fal-ai/client')
    fal.config({ credentials: process.env.FAL_KEY })

    const result: any = await fal.subscribe('fal-ai/birefnet/v2', {
      input: {
        image_url: imageUrl,
        model: 'General Use (Heavy)',
      },
      logs: false,
    })

    const resultUrl = result?.data?.image?.url || result?.image?.url
    if (!resultUrl) {
      return NextResponse.json({ error: 'No image returned' }, { status: 500 })
    }

    return NextResponse.json({ resultUrl })
  } catch (err: any) {
    console.error('Background removal error:', err)
    return NextResponse.json({ error: err.message || 'Background removal failed' }, { status: 500 })
  }
}
