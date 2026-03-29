import {
  parseJsonField,
  stringifyJsonField,
  filterItemsByTags,
  getRecommendations,
  calculateCostPerWear,
  getUnwornItems,
} from '@/lib/utils'

describe('parseJsonField', () => {
  it('returns empty array for null', () => {
    expect(parseJsonField(null)).toEqual([])
  })
  it('returns empty array for undefined', () => {
    expect(parseJsonField(undefined)).toEqual([])
  })
  it('parses a valid JSON array', () => {
    expect(parseJsonField('["casual","formal"]')).toEqual(['casual', 'formal'])
  })
  it('returns empty array for invalid JSON', () => {
    expect(parseJsonField('not-json')).toEqual([])
  })
  it('returns empty array for non-array JSON', () => {
    expect(parseJsonField('{"key":"value"}')).toEqual([])
  })
})

describe('stringifyJsonField', () => {
  it('converts array to JSON string', () => {
    expect(stringifyJsonField(['casual', 'formal'])).toBe('["casual","formal"]')
  })
  it('handles empty array', () => {
    expect(stringifyJsonField([])).toBe('[]')
  })
})

describe('filterItemsByTags', () => {
  const items = [
    { id: '1', name: 'White Shirt', category: 'tops', color: 'white', occasions: '["casual","formal"]', seasons: '["spring","summer"]' },
    { id: '2', name: 'Blue Jeans', category: 'bottoms', color: 'blue', occasions: '["casual"]', seasons: '["fall","winter"]' },
    { id: '3', name: 'Black Heels', category: 'shoes', color: 'black', occasions: '["formal"]', seasons: '["spring","fall"]' },
  ]

  it('returns all items when no filters', () => {
    expect(filterItemsByTags(items, {})).toHaveLength(3)
  })
  it('filters by category', () => {
    const result = filterItemsByTags(items, { category: 'tops' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('White Shirt')
  })
  it('filters by color', () => {
    const result = filterItemsByTags(items, { color: 'blue' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Blue Jeans')
  })
  it('filters by occasion', () => {
    const result = filterItemsByTags(items, { occasion: 'formal' })
    expect(result).toHaveLength(2)
  })
  it('filters by season', () => {
    const result = filterItemsByTags(items, { season: 'summer' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('White Shirt')
  })
  it('combines multiple filters', () => {
    const result = filterItemsByTags(items, { category: 'shoes', occasion: 'formal' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Black Heels')
  })
})

describe('calculateCostPerWear', () => {
  it('returns price when timesWorn is 0', () => {
    expect(calculateCostPerWear(100, 0)).toBe(100)
  })
  it('calculates cost per wear correctly', () => {
    expect(calculateCostPerWear(100, 10)).toBe(10)
  })
  it('rounds to 2 decimal places', () => {
    expect(calculateCostPerWear(10, 3)).toBe(3.33)
  })
})

describe('getRecommendations', () => {
  const items = [
    { id: '1', name: 'Shirt', category: 'tops', occasions: '["casual"]', seasons: '["summer"]' },
    { id: '2', name: 'Jeans', category: 'bottoms', occasions: '["casual"]', seasons: '["summer","fall"]' },
    { id: '3', name: 'Suit', category: 'tops', occasions: '["formal"]', seasons: '["fall","winter"]' },
    { id: '4', name: 'Sneakers', category: 'shoes', occasions: '[]', seasons: '[]' },
  ]

  it('returns items from different categories', () => {
    const result = getRecommendations(items)
    const categories = result.map((i: any) => i.category)
    const uniqueCategories = [...new Set(categories)]
    expect(uniqueCategories.length).toBe(result.length)
  })
  it('filters by occasion', () => {
    const result = getRecommendations(items, 'formal')
    const ids = result.map((i: any) => i.id)
    expect(ids).not.toContain('1')
  })
})

describe('getUnwornItems', () => {
  it('returns items with 0 wears', () => {
    const items = [
      { id: '1', timesWorn: 0, updatedAt: new Date().toISOString() },
      { id: '2', timesWorn: 5, updatedAt: new Date().toISOString() },
    ]
    const result = getUnwornItems(items, 30)
    expect(result.map((i) => i.id)).toContain('1')
    expect(result.map((i) => i.id)).not.toContain('2')
  })
})
