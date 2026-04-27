// Background removal — calls our /api/remove-bg route which uses BiRefNet via fal.ai
// MIT-licensed model, ~$0.003 per image, far better edges than the old Canvas hack

import { fetchWithAuth } from './api'

/**
 * Removes background from an image. Two paths:
 *  1. If you have a public URL for the image already, pass it as `imageUrl`.
 *  2. If you have a Blob (e.g. just-captured photo), we upload it first then process.
 *
 * Returns a public URL to the bg-removed PNG (transparent background).
 */
export async function removeBackgroundFromUrl(
  imageUrl: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  onProgress?.(20)
  const res = await fetchWithAuth('/api/remove-bg', {
    method: 'POST',
    body: JSON.stringify({ imageUrl }),
  })
  onProgress?.(80)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  onProgress?.(100)
  return data.resultUrl
}

/**
 * Convenience: take a Blob, upload to /api/upload, then remove background.
 * Returns the bg-removed image URL.
 */
export async function removeImageBackground(
  imageBlob: Blob,
  onProgress?: (pct: number) => void
): Promise<Blob> {
  // Step 1: upload the original to get a public URL
  onProgress?.(10)
  const formData = new FormData()
  formData.append('file', new File([imageBlob], 'photo.png', { type: imageBlob.type || 'image/png' }))
  const uploadRes = await fetchWithAuth('/api/upload', { method: 'POST', body: formData })
  const uploadData = await uploadRes.json()
  if (!uploadData.url) throw new Error('Upload failed')
  const absoluteUrl = uploadData.url.startsWith('http') ? uploadData.url : `${window.location.origin}${uploadData.url}`

  // Step 2: send to bg-removal API
  onProgress?.(40)
  const resultUrl = await removeBackgroundFromUrl(absoluteUrl)

  // Step 3: download the processed image as a Blob
  onProgress?.(85)
  const blobRes = await fetch(resultUrl)
  const blob = await blobRes.blob()
  onProgress?.(100)
  return blob
}
