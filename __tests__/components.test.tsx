import { classifyBodyShape, parseMeasurement, getShapeInfo, getStyleTips, scoreItemForBody } from '@/lib/bodyShape'

describe('Body Shape Classification', () => {
  it('classifies hourglass (bust ≈ hips, small waist)', () => {
    expect(classifyBodyShape(36, 26, 36)).toBe('hourglass')
  })

  it('classifies pear (hips > bust)', () => {
    expect(classifyBodyShape(32, 26, 38)).toBe('pear')
  })

  it('classifies apple (bust > hips, larger waist)', () => {
    expect(classifyBodyShape(40, 36, 36)).toBe('apple')
  })

  it('classifies rectangle (all similar)', () => {
    expect(classifyBodyShape(34, 32, 34)).toBe('rectangle')
  })

  it('classifies inverted triangle (bust >> hips)', () => {
    expect(classifyBodyShape(42, 30, 34)).toBe('inverted-triangle')
  })

  it('returns null for missing measurements', () => {
    expect(classifyBodyShape(0, 0, 0)).toBeNull()
    expect(classifyBodyShape(34, 0, 36)).toBeNull()
  })
})

describe('parseMeasurement', () => {
  it('parses plain numbers', () => {
    expect(parseMeasurement('34')).toBe(34)
  })

  it('parses numbers with units', () => {
    expect(parseMeasurement('5\'6"')).toBe(5)
  })

  it('returns 0 for empty/undefined', () => {
    expect(parseMeasurement(undefined)).toBe(0)
    expect(parseMeasurement('')).toBe(0)
  })
})

describe('getShapeInfo', () => {
  it('returns info for each shape', () => {
    const info = getShapeInfo('hourglass')
    expect(info.name).toBe('Hourglass')
    expect(info.emoji).toBe('⏳')
    expect(info.description).toBeTruthy()
  })
})

describe('getStyleTips', () => {
  it('returns tips for shape + goals', () => {
    const tips = getStyleTips('pear', ['waist'])
    expect(tips.length).toBeGreaterThan(0)
    expect(tips[0].title).toBeTruthy()
  })

  it('returns general tips when no goals selected', () => {
    const tips = getStyleTips('hourglass', [])
    expect(tips.length).toBeGreaterThan(0)
  })
})

describe('scoreItemForBody', () => {
  it('scores matching items higher', () => {
    const item = { name: 'A-line Skirt', category: 'bottoms' }
    const { score } = scoreItemForBody(item, 'pear', ['hips'])
    expect(score).toBeGreaterThan(50)
  })

  it('gives base score to non-matching items', () => {
    const item = { name: 'Random Thing', category: 'accessories' }
    const { score } = scoreItemForBody(item, 'pear', ['hips'])
    expect(score).toBe(30)
  })
})
