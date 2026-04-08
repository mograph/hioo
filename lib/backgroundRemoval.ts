export async function removeImageBackground(
  imageBlob: Blob,
  onProgress?: (pct: number) => void
): Promise<Blob> {
  // Dynamic import — only loads in the browser, never bundled server-side
  const { removeBackground } = await import('@imgly/background-removal')
  const result = await removeBackground(imageBlob, {
    progress: (_key: string, current: number, total: number) => {
      if (onProgress && total > 0) {
        onProgress(Math.round((current / total) * 100))
      }
    },
  })
  return result
}
