// Lightweight background removal using Canvas API
// Removes white/light backgrounds by converting them to transparent

export async function removeImageBackground(
  imageBlob: Blob,
  onProgress?: (pct: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        onProgress?.(20)
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)

        onProgress?.(40)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Sample corners to detect background color
        const corners = [
          [0, 0], [canvas.width - 1, 0],
          [0, canvas.height - 1], [canvas.width - 1, canvas.height - 1],
        ]
        let bgR = 0, bgG = 0, bgB = 0
        for (const [x, y] of corners) {
          const i = (y * canvas.width + x) * 4
          bgR += data[i]; bgG += data[i + 1]; bgB += data[i + 2]
        }
        bgR = Math.round(bgR / 4)
        bgG = Math.round(bgG / 4)
        bgB = Math.round(bgB / 4)

        onProgress?.(60)

        // Remove pixels similar to the background color
        const threshold = 45 // color distance threshold
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2]
          const dist = Math.sqrt(
            (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2
          )
          if (dist < threshold) {
            data[i + 3] = 0 // make transparent
          } else if (dist < threshold * 1.5) {
            // Soft edge — partial transparency
            data[i + 3] = Math.round(((dist - threshold) / (threshold * 0.5)) * 255)
          }
        }

        onProgress?.(80)
        ctx.putImageData(imageData, 0, 0)

        onProgress?.(100)
        canvas.toBlob(blob => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to create blob'))
        }, 'image/png')
      } catch (err) {
        reject(err)
      }
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(imageBlob)
  })
}
