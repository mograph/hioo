// Server-side helpers for virtual try-on via CatVTON on fal.ai
// Caches results in Firestore: users/{uid}/tryonResults/{hash}

import { adminDb } from './firebase-admin'
import crypto from 'crypto'

export type GarmentCategory = 'upper' | 'lower' | 'overall' | 'outer' | 'inner'

export function categoryToFalCategory(category: string): GarmentCategory {
  const c = category.toLowerCase()
  if (c === 'tops') return 'upper'
  if (c === 'outerwear') return 'outer'
  if (c === 'bottoms') return 'lower'
  return 'overall'
}

export function makeCacheKey(personUrl: string, garmentUrl: string, category: string): string {
  return crypto.createHash('sha256').update(`${personUrl}|${garmentUrl}|${category}`).digest('hex').slice(0, 16)
}

export async function getCachedTryOn(userId: string, key: string): Promise<string | null> {
  const doc = await adminDb.collection('users').doc(userId).collection('tryonResults').doc(key).get()
  if (!doc.exists) return null
  const data = doc.data()
  return data?.resultUrl || null
}

export async function setCachedTryOn(userId: string, key: string, resultUrl: string, meta: any) {
  await adminDb.collection('users').doc(userId).collection('tryonResults').doc(key).set({
    resultUrl,
    ...meta,
    createdAt: new Date().toISOString(),
  })
}

export async function runTryOn(personUrl: string, garmentUrl: string, category: GarmentCategory): Promise<string> {
  const { fal } = await import('@fal-ai/client')

  if (!process.env.FAL_KEY) {
    throw new Error('FAL_KEY not configured')
  }

  fal.config({ credentials: process.env.FAL_KEY })

  const result: any = await fal.subscribe('fal-ai/cat-vton', {
    input: {
      human_image_url: personUrl,
      garment_image_url: garmentUrl,
      cloth_type: category,
    },
    logs: false,
  })

  const imageUrl = result?.data?.image?.url || result?.image?.url
  if (!imageUrl) throw new Error('No image returned from try-on')
  return imageUrl
}
