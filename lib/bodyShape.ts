// Body shape classification, style tips, and item scoring

export type BodyShape = 'hourglass' | 'pear' | 'apple' | 'rectangle' | 'inverted-triangle'
export type AccentuationGoal = 'waist' | 'hips' | 'shoulders' | 'legs' | 'torso'

export interface StyleTip {
  title: string
  description: string
  categories: string[]   // maps to item categories: tops, bottoms, shoes, accessories, outerwear
  keywords: string[]     // keywords to match in item names
  priority: number       // 1-10 scoring weight
}

export interface ShapeInfo {
  name: string
  emoji: string
  description: string
  color: string
  bgColor: string
}

// --- Classification ---

export function classifyBodyShape(bust: number, waist: number, hips: number): BodyShape | null {
  if (!bust || !waist || !hips || bust <= 0 || waist <= 0 || hips <= 0) return null

  const bustHipRatio = bust / hips
  const waistHipRatio = waist / hips
  const waistBustRatio = waist / bust

  // Hourglass: bust ≈ hips, waist notably smaller
  if (bustHipRatio >= 0.9 && bustHipRatio <= 1.1 && waistHipRatio < 0.75) {
    return 'hourglass'
  }

  // Pear: hips wider than bust
  if (bustHipRatio < 0.95 && waistHipRatio < 0.80) {
    return 'pear'
  }

  // Apple: bust larger, waist not well-defined
  if (bustHipRatio > 1.05 && waistBustRatio > 0.75) {
    return 'apple'
  }

  // Inverted triangle: bust significantly wider than hips
  if (bustHipRatio > 1.1 && waistBustRatio < 0.80) {
    return 'inverted-triangle'
  }

  // Rectangle: fairly straight up and down
  return 'rectangle'
}

export function parseMeasurement(value: string | undefined): number {
  if (!value) return 0
  const num = parseFloat(value.replace(/[^\d.]/g, ''))
  return isNaN(num) ? 0 : num
}

// --- Shape Info ---

const SHAPE_INFO: Record<BodyShape, ShapeInfo> = {
  'hourglass': {
    name: 'Hourglass',
    emoji: '⏳',
    description: 'Balanced bust and hips with a defined waist. Your proportions are naturally balanced — most styles work beautifully on you.',
    color: 'text-[#BE123C]',
    bgColor: 'bg-[#FFE0E6]',
  },
  'pear': {
    name: 'Pear',
    emoji: '🍐',
    description: 'Hips wider than shoulders with a defined waist. Your lower body is your power zone — embrace it or balance it with structured tops.',
    color: 'text-[#047857]',
    bgColor: 'bg-[#D1FAE5]',
  },
  'apple': {
    name: 'Apple',
    emoji: '🍎',
    description: 'Fuller through the middle with great legs. Draw attention to your legs and décolletage with the right cuts.',
    color: 'text-[#C2410C]',
    bgColor: 'bg-[#FFE0D0]',
  },
  'rectangle': {
    name: 'Rectangle',
    emoji: '▬',
    description: 'Balanced proportions throughout. You have a versatile frame — create curves with strategic layering and shapes.',
    color: 'text-[#0369A1]',
    bgColor: 'bg-[#E0F2FE]',
  },
  'inverted-triangle': {
    name: 'Inverted Triangle',
    emoji: '🔻',
    description: 'Broader shoulders tapering to narrower hips. Balance your silhouette with volume on the bottom and clean lines on top.',
    color: 'text-[#6D28D9]',
    bgColor: 'bg-[#EDE9FE]',
  },
}

export function getShapeInfo(shape: BodyShape): ShapeInfo {
  return SHAPE_INFO[shape]
}

// --- Style Tips Matrix ---

type TipMatrix = Record<BodyShape, Record<AccentuationGoal, StyleTip[]>>

const STYLE_TIPS: TipMatrix = {
  'hourglass': {
    waist: [
      { title: 'Wrap dresses', description: 'Highlights your naturally defined waist', categories: ['tops'], keywords: ['wrap', 'dress', 'fitted'], priority: 9 },
      { title: 'Belted outerwear', description: 'Cinch coats and jackets at the waist', categories: ['outerwear', 'accessories'], keywords: ['belt', 'cinch', 'wrap'], priority: 8 },
      { title: 'High-waisted bottoms', description: 'Sits right at your narrowest point', categories: ['bottoms'], keywords: ['high-rise', 'high-waist', 'paperbag'], priority: 8 },
    ],
    hips: [
      { title: 'Pencil skirts', description: 'Follows your natural curve beautifully', categories: ['bottoms'], keywords: ['pencil', 'fitted', 'midi', 'skirt'], priority: 9 },
      { title: 'Bodycon fits', description: 'Your proportions make these work', categories: ['tops', 'bottoms'], keywords: ['fitted', 'bodycon', 'slim'], priority: 7 },
      { title: 'Straight-leg pants', description: 'Clean line from hip to hem', categories: ['bottoms'], keywords: ['straight', 'tailored', 'trouser'], priority: 7 },
    ],
    shoulders: [
      { title: 'Off-shoulder tops', description: 'Shows off balanced shoulder line', categories: ['tops'], keywords: ['off-shoulder', 'bardot', 'strapless'], priority: 8 },
      { title: 'Structured blazers', description: 'Frames your upper body', categories: ['outerwear'], keywords: ['blazer', 'structured', 'jacket'], priority: 7 },
      { title: 'Boat necklines', description: 'Elegant horizontal emphasis', categories: ['tops'], keywords: ['boat', 'bateau', 'wide-neck'], priority: 6 },
    ],
    legs: [
      { title: 'Mini skirts', description: 'Show off legs from your balanced frame', categories: ['bottoms'], keywords: ['mini', 'short'], priority: 7 },
      { title: 'Ankle-strap heels', description: 'Draw the eye downward', categories: ['shoes'], keywords: ['heel', 'strap', 'pointed'], priority: 6 },
      { title: 'Cropped pants', description: 'Ankle-showing length elongates legs', categories: ['bottoms'], keywords: ['cropped', 'ankle', 'capri'], priority: 7 },
    ],
    torso: [
      { title: 'Fitted tees', description: 'Simple and effective on your frame', categories: ['tops'], keywords: ['fitted', 'tee', 'crew'], priority: 8 },
      { title: 'V-necklines', description: 'Elongates your torso beautifully', categories: ['tops'], keywords: ['v-neck', 'deep', 'plunge'], priority: 7 },
      { title: 'Monochrome outfits', description: 'Creates one long unbroken line', categories: ['tops', 'bottoms'], keywords: [], priority: 5 },
    ],
  },
  'pear': {
    waist: [
      { title: 'Fitted crop tops', description: 'Ends right at your smallest point', categories: ['tops'], keywords: ['crop', 'fitted', 'cropped'], priority: 9 },
      { title: 'Wide belts', description: 'Defines your waist with a statement piece', categories: ['accessories'], keywords: ['belt', 'wide', 'cinch'], priority: 8 },
      { title: 'Peplum tops', description: 'Nips in at waist, flares to balance hips', categories: ['tops'], keywords: ['peplum', 'flare', 'ruffle'], priority: 9 },
    ],
    hips: [
      { title: 'A-line skirts', description: 'Skims over hips with elegant flow', categories: ['bottoms'], keywords: ['a-line', 'flare', 'midi', 'skirt'], priority: 9 },
      { title: 'Bootcut jeans', description: 'Balances hip-to-hem proportions', categories: ['bottoms'], keywords: ['bootcut', 'flare', 'wide'], priority: 8 },
      { title: 'Dark-wash bottoms', description: 'Creates a sleek lower-body line', categories: ['bottoms'], keywords: ['dark', 'black', 'navy'], priority: 6 },
    ],
    shoulders: [
      { title: 'Structured shoulders', description: 'Adds width to balance your hips', categories: ['tops', 'outerwear'], keywords: ['structured', 'padded', 'blazer', 'shoulder'], priority: 9 },
      { title: 'Bold necklines', description: 'Draws attention upward', categories: ['tops'], keywords: ['boat', 'square', 'halter', 'statement'], priority: 8 },
      { title: 'Statement earrings', description: 'Pulls focus to your face and shoulders', categories: ['accessories'], keywords: ['earring', 'statement', 'necklace'], priority: 7 },
    ],
    legs: [
      { title: 'High-waisted wide-leg', description: 'Elongates from waist down', categories: ['bottoms'], keywords: ['wide-leg', 'palazzo', 'high-waist'], priority: 8 },
      { title: 'Pointed-toe shoes', description: 'Creates a lengthening effect', categories: ['shoes'], keywords: ['pointed', 'heel', 'slim'], priority: 7 },
      { title: 'Midi lengths', description: 'Shows just enough calf to elongate', categories: ['bottoms'], keywords: ['midi', 'skirt', 'below-knee'], priority: 6 },
    ],
    torso: [
      { title: 'Bright-colored tops', description: 'Draws the eye to your upper body', categories: ['tops'], keywords: ['bright', 'print', 'stripe', 'pattern'], priority: 8 },
      { title: 'Detailed necklines', description: 'Adds visual interest up top', categories: ['tops'], keywords: ['ruffle', 'collar', 'bow', 'embellished'], priority: 7 },
      { title: 'Layered tops', description: 'Adds volume where you want it', categories: ['tops', 'outerwear'], keywords: ['layer', 'cardigan', 'jacket'], priority: 7 },
    ],
  },
  'apple': {
    waist: [
      { title: 'Empire waistlines', description: 'Creates a waist right under the bust', categories: ['tops'], keywords: ['empire', 'babydoll', 'smock'], priority: 9 },
      { title: 'Wrap tops', description: 'Creates a diagonal waist-defining line', categories: ['tops'], keywords: ['wrap', 'surplice', 'crossover'], priority: 9 },
      { title: 'Structured jackets', description: 'Creates shape through the middle', categories: ['outerwear'], keywords: ['blazer', 'structured', 'tailored'], priority: 8 },
    ],
    hips: [
      { title: 'Straight-leg pants', description: 'Clean line balances your frame', categories: ['bottoms'], keywords: ['straight', 'trouser', 'tailored'], priority: 8 },
      { title: 'A-line skirts', description: 'Adds gentle volume at hips', categories: ['bottoms'], keywords: ['a-line', 'flare', 'skirt'], priority: 7 },
      { title: 'Bootcut jeans', description: 'Balances proportions beautifully', categories: ['bottoms'], keywords: ['bootcut', 'flare'], priority: 7 },
    ],
    shoulders: [
      { title: 'V-neck tops', description: 'Elongates torso and opens neckline', categories: ['tops'], keywords: ['v-neck', 'deep', 'scoop'], priority: 9 },
      { title: 'Open cardigans', description: 'Creates vertical lines', categories: ['outerwear'], keywords: ['cardigan', 'open', 'duster', 'long'], priority: 7 },
      { title: 'Fitted shoulders', description: 'Clean shoulder line frames you well', categories: ['tops', 'outerwear'], keywords: ['fitted', 'structured'], priority: 6 },
    ],
    legs: [
      { title: 'Slim-fit pants', description: 'Your legs are your best asset — show them', categories: ['bottoms'], keywords: ['slim', 'skinny', 'fitted', 'legging'], priority: 9 },
      { title: 'Above-knee skirts', description: 'Shows off great legs', categories: ['bottoms'], keywords: ['mini', 'short', 'above-knee'], priority: 8 },
      { title: 'Statement shoes', description: 'Draws the eye to your legs', categories: ['shoes'], keywords: ['heel', 'statement', 'boot', 'strappy'], priority: 7 },
    ],
    torso: [
      { title: 'Longline layers', description: 'Creates a vertical lengthening effect', categories: ['outerwear'], keywords: ['long', 'duster', 'longline', 'coat'], priority: 8 },
      { title: 'Monochrome dressing', description: 'One color head-to-toe elongates', categories: ['tops', 'bottoms'], keywords: [], priority: 6 },
      { title: 'Vertical details', description: 'Stripes, zippers, buttons draw the eye down', categories: ['tops'], keywords: ['stripe', 'vertical', 'button-down'], priority: 7 },
    ],
  },
  'rectangle': {
    waist: [
      { title: 'Belted everything', description: 'Create a waist with accessories', categories: ['accessories'], keywords: ['belt', 'sash', 'tie'], priority: 10 },
      { title: 'Peplum tops', description: 'Adds curves at the waist', categories: ['tops'], keywords: ['peplum', 'ruffle', 'flare'], priority: 9 },
      { title: 'Wrap dresses', description: 'Defines a waist where one is subtle', categories: ['tops'], keywords: ['wrap', 'tie', 'surplice'], priority: 9 },
    ],
    hips: [
      { title: 'Pleated skirts', description: 'Adds volume and movement at the hip', categories: ['bottoms'], keywords: ['pleat', 'flare', 'full', 'skirt'], priority: 9 },
      { title: 'Cargo details', description: 'Pocket details add visual width', categories: ['bottoms'], keywords: ['cargo', 'pocket', 'utility'], priority: 7 },
      { title: 'Paperbag waist', description: 'Gathers create the illusion of curves', categories: ['bottoms'], keywords: ['paperbag', 'gathered', 'tie-waist'], priority: 8 },
    ],
    shoulders: [
      { title: 'Structured blazers', description: 'Builds shoulder definition', categories: ['outerwear'], keywords: ['blazer', 'structured', 'padded'], priority: 8 },
      { title: 'Statement sleeves', description: 'Puff or bell sleeves add dimension', categories: ['tops'], keywords: ['puff', 'bell', 'balloon', 'sleeve'], priority: 8 },
      { title: 'Halter tops', description: 'Highlights shoulder line', categories: ['tops'], keywords: ['halter', 'tie-neck'], priority: 7 },
    ],
    legs: [
      { title: 'High-waisted pants', description: 'Makes legs look longer', categories: ['bottoms'], keywords: ['high-waist', 'high-rise'], priority: 8 },
      { title: 'Heeled boots', description: 'Adds height and leg length', categories: ['shoes'], keywords: ['heel', 'boot', 'platform'], priority: 7 },
      { title: 'Cropped flares', description: 'Adds shape while showing ankle', categories: ['bottoms'], keywords: ['flare', 'cropped', 'kick'], priority: 7 },
    ],
    torso: [
      { title: 'Layered looks', description: 'Creates dimension and visual interest', categories: ['tops', 'outerwear'], keywords: ['layer', 'vest', 'jacket', 'cardigan'], priority: 8 },
      { title: 'Textured fabrics', description: 'Ribbing, knits, and texture add depth', categories: ['tops'], keywords: ['ribbed', 'knit', 'texture', 'cable'], priority: 7 },
      { title: 'Color blocking', description: 'Break up your silhouette with contrast', categories: ['tops', 'bottoms'], keywords: [], priority: 6 },
    ],
  },
  'inverted-triangle': {
    waist: [
      { title: 'Cinched waists', description: 'Balance your broader upper body', categories: ['accessories', 'tops'], keywords: ['belt', 'cinch', 'fitted-waist'], priority: 8 },
      { title: 'Fit-and-flare shapes', description: 'Narrow at waist, flare below', categories: ['tops', 'bottoms'], keywords: ['fit-and-flare', 'flare', 'skater'], priority: 9 },
      { title: 'Dropped waist details', description: 'Shifts the focus lower', categories: ['tops'], keywords: ['dropped', 'low-waist', 'tunic'], priority: 6 },
    ],
    hips: [
      { title: 'Full skirts', description: 'Adds volume to balance shoulders', categories: ['bottoms'], keywords: ['full', 'circle', 'maxi', 'skirt'], priority: 9 },
      { title: 'Wide-leg pants', description: 'Creates width to match your upper body', categories: ['bottoms'], keywords: ['wide-leg', 'palazzo', 'flare'], priority: 9 },
      { title: 'Bright bottoms', description: 'Color on the bottom draws the eye down', categories: ['bottoms'], keywords: ['bright', 'pattern', 'print', 'color'], priority: 8 },
    ],
    shoulders: [
      { title: 'Raglan sleeves', description: 'Softens the shoulder line', categories: ['tops'], keywords: ['raglan', 'set-in', 'dolman'], priority: 8 },
      { title: 'V-necklines', description: 'Narrows the visual width on top', categories: ['tops'], keywords: ['v-neck', 'deep', 'narrow'], priority: 8 },
      { title: 'Dark tops', description: 'Minimizes upper body visually', categories: ['tops'], keywords: ['dark', 'black', 'navy', 'muted'], priority: 7 },
    ],
    legs: [
      { title: 'Statement pants', description: 'Bold bottoms balance broad shoulders', categories: ['bottoms'], keywords: ['print', 'pattern', 'stripe', 'bold'], priority: 8 },
      { title: 'Platform shoes', description: 'Adds height for balanced proportions', categories: ['shoes'], keywords: ['platform', 'chunky', 'boot'], priority: 7 },
      { title: 'Bootcut or flare', description: 'Echoes shoulder width at the hem', categories: ['bottoms'], keywords: ['bootcut', 'flare', 'wide'], priority: 8 },
    ],
    torso: [
      { title: 'Simple, fitted tops', description: 'Clean lines without bulk', categories: ['tops'], keywords: ['fitted', 'simple', 'minimal', 'tee'], priority: 7 },
      { title: 'Long necklaces', description: 'Creates vertical lines through torso', categories: ['accessories'], keywords: ['necklace', 'long', 'pendant', 'chain'], priority: 6 },
      { title: 'Soft fabrics on top', description: 'Drape rather than structure up top', categories: ['tops'], keywords: ['silk', 'soft', 'drape', 'flow'], priority: 7 },
    ],
  },
}

export function getStyleTips(shape: BodyShape, goals: AccentuationGoal[]): StyleTip[] {
  if (!goals.length) {
    // Return top tips for all goals
    const all: StyleTip[] = []
    for (const goal of Object.keys(STYLE_TIPS[shape]) as AccentuationGoal[]) {
      all.push(...STYLE_TIPS[shape][goal].slice(0, 1))
    }
    return all.sort((a, b) => b.priority - a.priority)
  }
  const tips: StyleTip[] = []
  for (const goal of goals) {
    tips.push(...(STYLE_TIPS[shape]?.[goal] || []))
  }
  return tips.sort((a, b) => b.priority - a.priority)
}

// --- Item Scoring ---

export function scoreItemForBody(
  item: { name: string; category: string; color?: string; brand?: string },
  shape: BodyShape,
  goals: AccentuationGoal[]
): { score: number; tip: string | null } {
  const tips = getStyleTips(shape, goals)
  const itemName = (item.name || '').toLowerCase()
  const itemCategory = (item.category || '').toLowerCase()

  let bestScore = 30 // base score — everything gets at least 30
  let bestTip: string | null = null

  for (const tip of tips) {
    let matchScore = 0

    // Category match
    if (tip.categories.includes(itemCategory)) {
      matchScore += 20
    }

    // Keyword match in item name
    for (const kw of tip.keywords) {
      if (itemName.includes(kw.toLowerCase())) {
        matchScore += 30
        break
      }
    }

    // Priority bonus
    matchScore += tip.priority * 2

    const total = 30 + matchScore
    if (total > bestScore) {
      bestScore = total
      bestTip = tip.description
    }
  }

  return { score: Math.min(bestScore, 100), tip: bestTip }
}
