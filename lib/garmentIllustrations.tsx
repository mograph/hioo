// Maps keywords to SVG icon files from /public/garments/
// Returns <img> tags pointing to the professional garment illustrations

const ICON_MAP: [string[], string][] = [
  // Skirts
  [['a-line', 'flare skirt'], '001-skirt-20.svg'],
  [['pencil skirt', 'bodycon skirt'], '003-skirt-18.svg'],
  [['mini skirt', 'short skirt'], '005-skirt-16.svg'],
  [['pleated', 'pleat'], '008-skirt-13.svg'],
  [['midi skirt', 'midi'], '012-skirt-10.svg'],
  [['circle skirt', 'full skirt'], '015-skirt-7.svg'],
  [['wrap skirt'], '017-skirt-5.svg'],
  [['skirt'], '198-skirt.svg'],

  // Dresses
  [['wrap dress', 'wrap'], '021-dress-49.svg'],
  [['maxi dress', 'maxi'], '090-dress-47.svg'],
  [['shirt dress'], '091-dress-46.svg'],
  [['fitted dress', 'bodycon dress'], '093-dress-44.svg'],
  [['fit-and-flare', 'skater'], '092-dress-45.svg'],
  [['slip dress'], '196-dress-1.svg'],
  [['empire'], '163-dress-29.svg'],
  [['mini dress'], '170-dress-23.svg'],
  [['dress'], '197-dress.svg'],

  // Pants / Trousers
  [['wide-leg', 'palazzo', 'wide leg'], '035-trousers-7.svg'],
  [['high-waist', 'high-rise', 'paperbag'], '036-trousers-6.svg'],
  [['bootcut'], '038-trousers-4.svg'],
  [['cargo'], '039-trousers-3.svg'],
  [['slim', 'skinny', 'legging'], '040-trousers-2.svg'],
  [['straight', 'trouser', 'tailored'], '042-trousers.svg'],
  [['jogger', 'sweatpant'], '041-trousers-1.svg'],
  [['culottes'], '037-trousers-5.svg'],
  [['pant', 'jean', 'denim', 'bottom'], '031-pants.svg'],

  // Shorts
  [['shorts', 'bermuda', 'short'], '032-shorts-1.svg'],

  // Tops / Shirts
  [['v-neck', 'v neck'], '145-shirt-3.svg'],
  [['button-down', 'button down', 'oxford'], '147-shirt-1.svg'],
  [['blouse', 'silk'], '146-shirt-2.svg'],
  [['peplum'], '143-shirt-4.svg'],
  [['crop', 'cropped'], '140-shirt-7.svg'],
  [['polo'], '142-shirt-5.svg'],
  [['fitted', 'tee', 'crew', 'basic'], '148-shirt.svg'],
  [['shirt', 'top'], '148-shirt.svg'],

  // Sleeveless / Tank
  [['tank', 'cami', 'camisole', 'spaghetti'], '078-tank-top-2.svg'],
  [['sleeveless'], '084-sleeveless-2.svg'],
  [['off-shoulder', 'bardot', 'strapless'], '086-sleeveless.svg'],
  [['halter'], '085-sleeveless-1.svg'],
  [['tube', 'bandeau'], '080-tank-top.svg'],

  // Knits / Sweaters
  [['sweater', 'knit', 'pullover', 'jumper', 'turtleneck'], '136-shirt-11.svg'],
  [['hoodie', 'sweatshirt'], '137-shirt-10.svg'],
  [['raglan'], '138-shirt-9.svg'],

  // Outerwear
  [['blazer', 'structured jacket'], '131-coat.svg'],
  [['leather jacket', 'moto', 'biker'], '104-coat-25.svg'],
  [['denim jacket', 'jean jacket'], '109-coat-20.svg'],
  [['bomber'], '112-coat-18.svg'],
  [['puffer', 'down jacket'], '101-coat-28.svg'],
  [['trench', 'trenchcoat'], '098-coat-30.svg'],
  [['cardigan', 'open front', 'layer'], '107-coat-22.svg'],
  [['rain', 'windbreaker', 'anorak'], '110-coat-19.svg'],
  [['vest', 'gilet'], '119-coat-11.svg'],
  [['cape', 'poncho'], '120-coat-10.svg'],
  [['coat', 'overcoat', 'long', 'duster', 'longline'], '095-coat-33.svg'],
  [['jacket'], '131-coat.svg'],

  // Corsets / Bodywear
  [['corset', 'bustier'], '081-corset.svg'],
  [['body', 'bodysuit'], '083-body.svg'],
  [['pyjama', 'pajama', 'robe', 'kimono'], '082-pyjamas.svg'],

  // Swimwear
  [['swimsuit', 'one-piece'], '200-swimsuit.svg'],
  [['bikini'], '166-bikini.svg'],

  // Suits
  [['suit', 'tuxedo', 'tux'], '189-suit.svg'],

  // Underwear (for completeness)
  [['bra', 'bralette', 'sports bra'], '076-brassiere.svg'],
]

// Category fallback icons (for closet items without photos)
const CATEGORY_FALLBACKS: Record<string, string> = {
  tops: '148-shirt.svg',
  bottoms: '031-pants.svg',
  shoes: '032-shorts-1.svg', // no shoes in this pack, use shorts as placeholder
  accessories: '081-corset.svg',
  outerwear: '131-coat.svg',
  dresses: '197-dress.svg',
}

export function getGarmentSVG(keyword: string, size = 40): JSX.Element {
  const kw = keyword.toLowerCase()

  // Find matching icon
  for (const [keywords, file] of ICON_MAP) {
    for (const k of keywords) {
      if (kw.includes(k)) {
        return <img src={`/garments/${file}`} alt={keyword} width={size} height={size} className="object-contain" />
      }
    }
  }

  // Fallback — generic shirt
  return <img src="/garments/148-shirt.svg" alt={keyword} width={size} height={size} className="object-contain" />
}

export function getGarmentIcon(filename: string, size = 40, alt = ''): JSX.Element {
  return <img src={`/garments/${filename}`} alt={alt} width={size} height={size} className="object-contain" />
}

export function getCategoryIcon(category: string, size = 40): JSX.Element {
  const file = CATEGORY_FALLBACKS[category] || '148-shirt.svg'
  return <img src={`/garments/${file}`} alt={category} width={size} height={size} className="object-contain" />
}

// Get a pairing suggestion — returns two icons that go together
export function getPairingIcons(tip: { title: string; categories: string[] }, size = 32): JSX.Element {
  const topIcon = getGarmentSVG(tip.title, size)

  // Find a complementary item based on categories
  let pairFile = ''
  if (tip.categories.includes('tops')) pairFile = '001-skirt-20.svg' // pair top with skirt
  else if (tip.categories.includes('bottoms')) pairFile = '148-shirt.svg' // pair bottom with top
  else if (tip.categories.includes('outerwear')) pairFile = '042-trousers.svg' // pair coat with pants
  else if (tip.categories.includes('accessories')) pairFile = '197-dress.svg' // pair accessory with dress

  return (
    <div className="flex items-center gap-1">
      {topIcon}
      {pairFile && (
        <>
          <span className="text-[#D4D4D4] text-xs">+</span>
          <img src={`/garments/${pairFile}`} alt="pair" width={size} height={size} className="object-contain opacity-50" />
        </>
      )}
    </div>
  )
}
