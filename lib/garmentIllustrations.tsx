// Maps keywords to SVG icon files from /public/garments/
// Returns <img> tags pointing to the professional garment illustrations

const ICON_MAP: [string[], string][] = [
  // Skirts — verified by path analysis
  [['pencil skirt', 'bodycon skirt', 'straight skirt'], '015-skirt-7.svg'],  // very narrow, most pencil-like
  [['a-line'], '005-skirt-16.svg'],              // moderate flare, wrap detail
  [['flare skirt', 'flared'], '198-skirt.svg'],  // dramatic A-line, wide sweep
  [['mini skirt', 'short skirt'], '007-skirt-14.svg'],  // short + ruffled hem
  [['pleated', 'pleat'], '008-skirt-13.svg'],    // full circle, 4 panels
  [['midi skirt', 'midi'], '012-skirt-10.svg'],  // A-line, V-waistband
  [['circle skirt', 'full skirt'], '004-skirt-17.svg'],  // full circle maxi
  [['wrap skirt', 'sarong'], '009-skirt-12.svg'], // wrap/sarong, diagonal
  [['tiered', 'ruffle skirt', 'layered'], '018-skirt-4.svg'],  // 4 tiered layers
  [['skirt'], '006-skirt-15.svg'],               // A-line with pockets (good default)

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

  // Pants / Trousers — verified by path analysis
  [['wide-leg', 'palazzo', 'wide leg'], '037-trousers-5.svg'],    // legs flare outward, rounded hem
  [['skinny', 'legging', 'slim-fit'], '035-trousers-7.svg'],      // narrow taper, button fly
  [['high-waist', 'high-rise', 'paperbag'], '038-trousers-4.svg'],// high rise starts at top of canvas
  [['bootcut'], '040-trousers-2.svg'],                             // tapers at knee then flares at hem
  [['straight', 'trouser', 'tailored'], '036-trousers-6.svg'],    // parallel legs, belt loops
  [['cargo'], '039-trousers-3.svg'],                               // straight with pocket detail
  [['slim', 'fitted pant'], '041-trousers-1.svg'],                 // moderate taper, button closure
  [['jogger', 'sweatpant'], '042-trousers.svg'],                   // basic plain straight
  [['culottes'], '037-trousers-5.svg'],                             // wide-leg works for culottes too
  [['pant', 'jean', 'denim', 'bottom'], '036-trousers-6.svg'],    // default: straight with belt loops

  // Shorts
  [['shorts', 'bermuda', 'short'], '032-shorts-1.svg'],

  // Tops / Shirts — verified by path analysis
  [['button-down', 'button down', 'oxford', 'dress shirt'], '143-shirt-4.svg'],  // collared, 3 buttons, striped panels
  [['v-neck', 'v neck'], '145-shirt-3.svg'],         // collared dress shirt, plain body
  [['blouse', 'silk'], '146-shirt-2.svg'],            // polo-style with shoulder detail
  [['polo'], '146-shirt-2.svg'],                       // polo with epaulets
  [['bow', 'ribbon'], '141-shirt-6.svg'],              // long-sleeve with ribbon bow
  [['tie', 'necktie', 'formal shirt'], '139-shirt-8.svg'],  // button-front with necktie
  [['crop', 'cropped'], '140-shirt-7.svg'],            // long-sleeve with bow-tie/buckle
  [['pocket'], '132-shirt-14.svg'],                    // long-sleeve with chest pocket
  [['fitted', 'tee', 'crew', 'basic', 't-shirt'], '142-shirt-5.svg'],  // plain t-shirt, no embellishments
  [['shirt', 'top'], '148-shirt.svg'],                 // basic plain collared (good default)

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
