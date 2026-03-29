export function parseJsonField(value: string | null | undefined): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function stringifyJsonField(arr: string[]): string {
  return JSON.stringify(arr)
}

export function filterItemsByTags(
  items: any[],
  filters: { category?: string; color?: string; occasion?: string; season?: string }
): any[] {
  return items.filter((item) => {
    if (filters.category && item.category !== filters.category) return false
    if (filters.color && item.color?.toLowerCase() !== filters.color.toLowerCase()) return false
    if (filters.occasion) {
      const occasions = parseJsonField(item.occasions)
      if (!occasions.includes(filters.occasion)) return false
    }
    if (filters.season) {
      const seasons = parseJsonField(item.seasons)
      if (!seasons.includes(filters.season)) return false
    }
    return true
  })
}

export function getRecommendations(
  items: any[],
  occasion?: string,
  temperature?: number
): any[] {
  let filtered = [...items]

  if (occasion) {
    filtered = filtered.filter((item) => {
      const occasions = parseJsonField(item.occasions)
      return occasions.includes(occasion) || occasions.length === 0
    })
  }

  if (temperature !== undefined) {
    const season = temperature < 10 ? 'winter' : temperature < 20 ? 'fall' : temperature < 28 ? 'spring' : 'summer'
    filtered = filtered.filter((item) => {
      const seasons = parseJsonField(item.seasons)
      return seasons.includes(season) || seasons.length === 0
    })
  }

  const byCategory: Record<string, any[]> = {}
  filtered.forEach((item) => {
    if (!byCategory[item.category]) byCategory[item.category] = []
    byCategory[item.category].push(item)
  })

  const outfit: any[] = []
  const categories = ['tops', 'bottoms', 'shoes', 'outerwear', 'accessories']
  categories.forEach((cat) => {
    if (byCategory[cat]?.length) {
      const items = byCategory[cat]
      outfit.push(items[Math.floor(Math.random() * items.length)])
    }
  })

  return outfit
}

export function calculateCostPerWear(price: number, timesWorn: number): number {
  if (timesWorn === 0) return price
  return Math.round((price / timesWorn) * 100) / 100
}

export function getUnwornItems(items: any[], days: number): any[] {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return items.filter((item) => {
    if (item.timesWorn === 0) return true
    if (!item.updatedAt) return true
    return new Date(item.updatedAt) < cutoff
  })
}

export function getRandomRotation(): number {
  return Math.floor(Math.random() * 7) - 3
}
