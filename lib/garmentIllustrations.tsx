// SVG illustrations for garment types used in style tips
// Each returns a simple line-art SVG icon at the given size

export function getGarmentSVG(keyword: string, size = 40): JSX.Element {
  const s = size
  const stroke = '#0A0A0A'
  const sw = 1.5

  // Match keywords to garment illustrations
  const kw = keyword.toLowerCase()

  // TOPS
  if (kw.includes('v-neck') || kw.includes('v neck')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 10L14 6h12l6 4-3 8h-3l-6 8-6-8h-3z" /><path d="M20 6v14" /><path d="M14 6l6 10 6-10" />
    </svg>
  )

  if (kw.includes('wrap')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 8l4-2h12l4 2-2 6h-2L20 34 14 14h-2z" /><path d="M14 6l12 14" /><path d="M26 6L20 14" />
    </svg>
  )

  if (kw.includes('crop') || kw.includes('cropped')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 10l4-4h12l4 4v10H10z" /><path d="M10 10l-4 4v6h4" /><path d="M30 10l4 4v6h-4" />
    </svg>
  )

  if (kw.includes('peplum')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6h16v14H12z" /><path d="M8 20Q12 24 20 24Q28 24 32 20" /><path d="M12 6l-4 4v6" /><path d="M28 6l4 4v6" />
    </svg>
  )

  if (kw.includes('blouse') || kw.includes('silk') || kw.includes('soft')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6h16v24c-4 2-12 2-16 0z" /><path d="M12 6l-4 4v8l4-2" /><path d="M28 6l4 4v8l-4-2" /><circle cx="20" cy="10" r="1" fill={stroke} />
    </svg>
  )

  if (kw.includes('fitted') || kw.includes('tee') || kw.includes('crew')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 6h12v24H14z" /><path d="M14 6l-6 4v8l6-2" /><path d="M26 6l6 4v8l-6-2" /><path d="M14 6Q17 8 20 8Q23 8 26 6" />
    </svg>
  )

  if (kw.includes('off-shoulder') || kw.includes('bardot') || kw.includes('strapless')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12Q13 8 20 8Q27 8 34 12" /><path d="M10 12v18h20V12" />
    </svg>
  )

  if (kw.includes('halter')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 4l-8 8v18h16V12z" /><path d="M12 30h16" />
    </svg>
  )

  // BOTTOMS
  if (kw.includes('a-line') || kw.includes('flare') || kw.includes('skirt')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 6h12" /><path d="M14 6L6 34h28L26 6" /><path d="M14 6v2h12V6" />
    </svg>
  )

  if (kw.includes('pencil') || kw.includes('bodycon') || kw.includes('slim')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6h16v22c0 2-4 4-8 4s-8-2-8-4z" /><path d="M12 6v2h16V6" />
    </svg>
  )

  if (kw.includes('wide-leg') || kw.includes('palazzo') || kw.includes('wide')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 6h12" /><path d="M14 6L8 34" /><path d="M26 6l6 28" /><path d="M20 6v28" /><path d="M14 6v2h12V6" />
    </svg>
  )

  if (kw.includes('straight') || kw.includes('trouser') || kw.includes('tailored')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6h16" /><path d="M12 6l-1 28" /><path d="M28 6l1 28" /><path d="M20 6v28" /><path d="M12 6v2h16V6" />
    </svg>
  )

  if (kw.includes('high-waist') || kw.includes('high-rise') || kw.includes('paperbag')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4h16v4H12z" /><path d="M12 8l-1 26" /><path d="M28 8l1 26" /><path d="M20 8v26" />
    </svg>
  )

  if (kw.includes('bootcut')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 6h12" /><path d="M14 6l-2 20-4 8" /><path d="M26 6l2 20 4 8" /><path d="M20 6v28" />
    </svg>
  )

  // OUTERWEAR
  if (kw.includes('blazer') || kw.includes('structured') || kw.includes('jacket')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 8l4-4h12l4 4v26H10z" /><path d="M10 8l-4 4v12l4-2" /><path d="M30 8l4 4v12l-4-2" /><path d="M20 4v30" />
    </svg>
  )

  if (kw.includes('cardigan') || kw.includes('open') || kw.includes('layer')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 8l4-4h12l4 4v26H10z" /><path d="M10 8l-4 4v12l4-2" /><path d="M30 8l4 4v12l-4-2" /><path d="M18 4v30M22 4v30" />
    </svg>
  )

  if (kw.includes('coat') || kw.includes('long') || kw.includes('duster')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 6l4-2h12l4 2v30H10z" /><path d="M10 6l-4 4v14l4-2" /><path d="M30 6l4 4v14l-4-2" /><path d="M20 4v32" /><circle cx="18" cy="16" r="1" fill={stroke} /><circle cx="18" cy="22" r="1" fill={stroke} />
    </svg>
  )

  // SHOES
  if (kw.includes('heel') || kw.includes('pointed')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 20Q12 16 20 14l12 2v4H8z" /><path d="M28 20v12" /><path d="M8 20v4h24" />
    </svg>
  )

  if (kw.includes('boot') || kw.includes('platform') || kw.includes('chunky')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6v22H8v6h24v-6h-4V6z" /><path d="M12 18h16" />
    </svg>
  )

  // ACCESSORIES
  if (kw.includes('belt') || kw.includes('cinch') || kw.includes('sash')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="16" width="32" height="8" rx="2" /><rect x="17" y="14" width="6" height="12" rx="1" />
    </svg>
  )

  if (kw.includes('necklace') || kw.includes('chain') || kw.includes('pendant')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 8Q10 24 20 28Q30 24 30 8" /><circle cx="20" cy="28" r="3" />
    </svg>
  )

  if (kw.includes('earring') || kw.includes('statement')) return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="10" r="2" /><path d="M14 12v8" /><circle cx="14" cy="24" r="4" />
      <circle cx="26" cy="10" r="2" /><path d="M26 12v8" /><circle cx="26" cy="24" r="4" />
    </svg>
  )

  // Default — generic garment
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 6h12v24H14z" /><path d="M14 6l-6 4v8l6-2" /><path d="M26 6l6 4v8l-6-2" />
    </svg>
  )
}
