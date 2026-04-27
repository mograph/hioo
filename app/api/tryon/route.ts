export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/firebase-admin'
import { runTryOn, getCachedTryOn, setCachedTryOn, categoryToFalCategory, makeCacheKey } from '@/lib/tryon'

export async function POST(req: NextRequest) {
  const userId = await verifyToken(req.headers.get('authorization'))
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { personUrl, garmentUrl, category, itemId } = body

    if (!personUrl || !garmentUrl) {
      return NextResponse.json({ error: 'Missing personUrl or garmentUrl' }, { status: 400 })
    }

    const falCat = categoryToFalCategory(category || 'overall')
    const cacheKey = makeCacheKey(personUrl, garmentUrl, falCat)

    // Check cache first — same inputs = same output, no need to re-run
    const cached = await getCachedTryOn(userId, cacheKey)
    if (cached) return NextResponse.json({ resultUrl: cached, cached: true })

    // Run try-on
    const resultUrl = await runTryOn(personUrl, garmentUrl, falCat)

    // Cache result
    await setCachedTryOn(userId, cacheKey, resultUrl, {
      personUrl, garmentUrl, category: falCat, itemId: itemId || null,
    })

    return NextResponse.json({ resultUrl, cached: false })
  } catch (err: any) {
    console.error('Try-on error:', err)
    return NextResponse.json({ error: err.message || 'Try-on failed' }, { status: 500 })
  }
}
