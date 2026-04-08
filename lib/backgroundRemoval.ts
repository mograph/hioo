import { removeBackground } from '@imgly/background-removal'

export async function removeImageBackground(
  imageBlob: Blob,
  onProgress?: (pct: number) => void
): Promise<Blob> {
  const result = await removeBackground(imageBlob, {
    progress: (_key: string, current: number, total: number) => {
      if (onProgress && total > 0) {
        onProgress(Math.round((current / total) * 100))
      }
    },
  })
  return result
}
