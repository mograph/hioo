// Comprehensive SVG illustrations for all garment types
// Simple line-art style, returns JSX SVG elements

export function getGarmentSVG(keyword: string, size = 40): JSX.Element {
  const s = size
  const c = '#0A0A0A'
  const w = 1.5

  const kw = keyword.toLowerCase()

  // ═══════════════════════════════════════
  // TOPS
  // ═══════════════════════════════════════

  if (kw.includes('v-neck') || kw.includes('v neck'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M8 10L14 6h12l6 4-3 8h-3l-6 8-6-8h-3z"/><path d="M14 6l6 10 6-10"/></svg>

  if (kw.includes('scoop') || kw.includes('u-neck'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M8 10L14 6h12l6 4v20H8z"/><path d="M14 6Q20 14 26 6"/></svg>

  if (kw.includes('crew') || kw.includes('round neck'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 6h12v24H14z"/><path d="M14 6l-6 4v8l6-2"/><path d="M26 6l6 4v8l-6-2"/><path d="M14 6Q17 8 20 8Q23 8 26 6"/></svg>

  if (kw.includes('turtleneck') || kw.includes('mock neck') || kw.includes('roll neck'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 10h12v22H14z"/><rect x="16" y="4" width="8" height="6" rx="2"/><path d="M14 10l-6 4v8l6-2"/><path d="M26 10l6 4v8l-6-2"/></svg>

  if (kw.includes('boat') || kw.includes('bateau') || kw.includes('wide-neck'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M6 8h28"/><path d="M10 8v22h20V8"/><path d="M10 8l-4 4v8l4-2"/><path d="M30 8l4 4v8l-4-2"/></svg>

  if (kw.includes('square neck'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10 8h20v22H10z"/><rect x="15" y="6" width="10" height="6"/><path d="M10 8l-4 4v8l4-2"/><path d="M30 8l4 4v8l-4-2"/></svg>

  if (kw.includes('wrap'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10 8l4-2h12l4 2-2 6h-2L20 34 14 14h-2z"/><path d="M14 6l12 14"/><path d="M26 6L20 14"/></svg>

  if (kw.includes('crop') || (kw.includes('cropped') && !kw.includes('pant') && !kw.includes('flare')))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10 10l4-4h12l4 4v10H10z"/><path d="M10 10l-4 4v6h4"/><path d="M30 10l4 4v6h-4"/></svg>

  if (kw.includes('peplum'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12 6h16v14H12z"/><path d="M8 20Q12 26 20 26Q28 26 32 20"/><path d="M12 6l-4 4v6"/><path d="M28 6l4 4v6"/></svg>

  if (kw.includes('blouse') || kw.includes('silk blouse'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12 6h16v24c-4 2-12 2-16 0z"/><path d="M12 6l-4 4v8l4-2"/><path d="M28 6l4 4v8l-4-2"/><circle cx="20" cy="12" r="1" fill={c}/><circle cx="20" cy="18" r="1" fill={c}/></svg>

  if (kw.includes('button-down') || kw.includes('button down') || kw.includes('oxford'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12 8h16v24H12z"/><path d="M12 8l-4 4v10l4-2"/><path d="M28 8l4 4v10l-4-2"/><path d="M16 6l4 4 4-4"/><path d="M20 10v22"/><circle cx="20" cy="14" r="0.8" fill={c}/><circle cx="20" cy="19" r="0.8" fill={c}/><circle cx="20" cy="24" r="0.8" fill={c}/></svg>

  if (kw.includes('polo'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 8h12v24H14z"/><path d="M14 8l-6 4v8l6-2"/><path d="M26 8l6 4v8l-6-2"/><path d="M17 6h6v4l-3 2-3-2z"/><circle cx="20" cy="14" r="0.8" fill={c}/><circle cx="20" cy="18" r="0.8" fill={c}/></svg>

  if (kw.includes('henley'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 6h12v26H14z"/><path d="M14 6l-6 4v8l6-2"/><path d="M26 6l6 4v8l-6-2"/><path d="M20 6v10"/><circle cx="20" cy="10" r="0.8" fill={c}/><circle cx="20" cy="14" r="0.8" fill={c}/></svg>

  if (kw.includes('tank') || kw.includes('cami') || kw.includes('camisole') || kw.includes('spaghetti'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 10h12v22H14z"/><path d="M14 10L17 4"/><path d="M26 10L23 4"/></svg>

  if (kw.includes('tube') || kw.includes('bandeau'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="10" y="10" width="20" height="18" rx="2"/></svg>

  if (kw.includes('off-shoulder') || kw.includes('bardot') || kw.includes('strapless'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M6 12Q13 8 20 8Q27 8 34 12"/><path d="M10 12v18h20V12"/></svg>

  if (kw.includes('halter'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M20 4l-8 8v18h16V12z"/></svg>

  if (kw.includes('corset') || kw.includes('bustier'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10 6h20v24H10z"/><path d="M10 6Q8 18 10 30"/><path d="M30 6Q32 18 30 30"/><path d="M18 8v22M22 8v22"/></svg>

  if (kw.includes('hoodie') || kw.includes('sweatshirt'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12 8h16v24H12z"/><path d="M12 8l-6 4v10l6-2"/><path d="M28 8l6 4v10l-6-2"/><path d="M16 6Q20 10 24 6"/><path d="M16 20h8v6h-8z"/></svg>

  if (kw.includes('sweater') || kw.includes('knit') || kw.includes('pullover') || kw.includes('jumper'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12 8h16v24H12z"/><path d="M12 8l-6 4v10l6-2"/><path d="M28 8l6 4v10l-6-2"/><path d="M12 28h16"/><path d="M12 8Q17 10 20 10Q23 10 28 8"/></svg>

  if (kw.includes('raglan'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 6h12v26H14z"/><path d="M14 6L4 16v6l10-4"/><path d="M26 6l10 10v6l-10-4"/></svg>

  if (kw.includes('puff') || kw.includes('balloon sleeve') || kw.includes('statement sleeve'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 8h12v24H14z"/><ellipse cx="8" cy="14" rx="5" ry="7"/><ellipse cx="32" cy="14" rx="5" ry="7"/></svg>

  if (kw.includes('bell sleeve') || kw.includes('fluted'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 8h12v24H14z"/><path d="M14 8l-4 4v4Q4 20 2 24"/><path d="M26 8l4 4v4Q34 20 38 24"/></svg>

  // ═══════════════════════════════════════
  // DRESSES
  // ═══════════════════════════════════════

  if (kw.includes('maxi dress') || kw.includes('maxi'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h12l2 32H12z"/><path d="M14 4l-4 4v6l4-2"/><path d="M26 4l4 4v6l-4-2"/><path d="M14 16h12"/></svg>

  if (kw.includes('midi dress') || kw.includes('midi'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h12l1 24H13z"/><path d="M14 4l-4 4v6l4-2"/><path d="M26 4l4 4v6l-4-2"/><path d="M14 14h12"/></svg>

  if (kw.includes('mini dress') || kw.includes('mini') && !kw.includes('skirt'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 6h12l1 16H13z"/><path d="M14 6l-4 4v6l4-2"/><path d="M26 6l4 4v6l-4-2"/></svg>

  if (kw.includes('shirt dress'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h12l2 32H12z"/><path d="M14 4l-4 4v8l4-2"/><path d="M26 4l4 4v8l-4-2"/><path d="M20 4v32"/><circle cx="20" cy="10" r="0.8" fill={c}/><circle cx="20" cy="16" r="0.8" fill={c}/><circle cx="20" cy="22" r="0.8" fill={c}/></svg>

  if (kw.includes('fit-and-flare') || kw.includes('skater dress'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h8v12L8 36h24L26 16V4"/><path d="M16 4l-4 4v4l4-2"/><path d="M24 4l4 4v4l-4-2"/></svg>

  if (kw.includes('bodycon dress'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 4Q13 18 14 32h12Q27 18 26 4z"/><path d="M14 4l-2 2v4l2-2"/><path d="M26 4l2 2v4l-2-2"/></svg>

  if (kw.includes('empire'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h8v6L10 34h20L24 10V4"/><path d="M16 10h8"/></svg>

  if (kw.includes('slip dress'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 10h12l1 24H13z"/><path d="M14 10L17 4"/><path d="M26 10L23 4"/></svg>

  // ═══════════════════════════════════════
  // BOTTOMS — SKIRTS
  // ═══════════════════════════════════════

  if (kw.includes('mini skirt'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12 8h16"/><path d="M12 8L8 22h24l-4-14"/><rect x="12" y="6" width="16" height="4" rx="1"/></svg>

  if (kw.includes('pleated') || kw.includes('pleat'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="12" y="6" width="16" height="4" rx="1"/><path d="M12 10L6 34h28L28 10"/><path d="M15 10l-2 24M19 10l-1 24M23 10l1 24M27 10l2 24"/></svg>

  if (kw.includes('circle skirt') || kw.includes('full skirt'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="14" y="6" width="12" height="4" rx="1"/><path d="M14 10Q4 20 6 34h28Q36 20 26 10"/></svg>

  if (kw.includes('a-line') || (kw.includes('skirt') && !kw.includes('mini') && !kw.includes('pencil') && !kw.includes('pleat') && !kw.includes('circle')))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 6h12"/><path d="M14 6L6 34h28L26 6"/><rect x="14" y="4" width="12" height="4" rx="1"/></svg>

  if (kw.includes('pencil') || kw.includes('bodycon') && kw.includes('skirt'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12 6h16v22c0 2-4 4-8 4s-8-2-8-4z"/><rect x="12" y="4" width="16" height="4" rx="1"/></svg>

  // ═══════════════════════════════════════
  // BOTTOMS — PANTS
  // ═══════════════════════════════════════

  if (kw.includes('wide-leg') || kw.includes('palazzo') || kw.includes('wide leg'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="12" y="4" width="16" height="4" rx="1"/><path d="M12 8L6 36"/><path d="M28 8l6 28"/><path d="M20 8v28"/></svg>

  if (kw.includes('bootcut'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="12" y="4" width="16" height="4" rx="1"/><path d="M14 8l-2 20-4 8"/><path d="M26 8l2 20 4 8"/><path d="M20 8v28"/></svg>

  if (kw.includes('flare') && (kw.includes('pant') || kw.includes('jean')))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="12" y="4" width="16" height="4" rx="1"/><path d="M14 8v14L4 36"/><path d="M26 8v14l10 14"/><path d="M20 8v28"/></svg>

  if (kw.includes('skinny') || kw.includes('legging'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="12" y="4" width="16" height="4" rx="1"/><path d="M14 8l-1 28"/><path d="M26 8l1 28"/><path d="M20 8v28"/></svg>

  if (kw.includes('cargo'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="12" y="4" width="16" height="4" rx="1"/><path d="M13 8l-2 28"/><path d="M27 8l2 28"/><path d="M20 8v28"/><rect x="9" y="18" width="5" height="4" rx="0.5"/><rect x="26" y="18" width="5" height="4" rx="0.5"/></svg>

  if (kw.includes('jogger') || kw.includes('sweatpant'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="12" y="4" width="16" height="4" rx="1"/><path d="M13 8Q11 22 13 34"/><path d="M27 8Q29 22 27 34"/><path d="M20 8v26"/><path d="M13 34h4M23 34h4"/></svg>

  if (kw.includes('high-waist') || kw.includes('high-rise') || kw.includes('paperbag'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="12" y="2" width="16" height="6" rx="1"/><path d="M13 8l-1 28"/><path d="M27 8l1 28"/><path d="M20 8v28"/></svg>

  if (kw.includes('bermuda') || kw.includes('shorts') || kw.includes('short'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="10" y="6" width="20" height="4" rx="1"/><path d="M10 10l-2 14h12"/><path d="M30 10l2 14H20"/></svg>

  if (kw.includes('culottes'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="12" y="6" width="16" height="4" rx="1"/><path d="M12 10L8 30"/><path d="M28 10l4 20"/><path d="M20 10v20"/></svg>

  if (kw.includes('straight') || kw.includes('trouser') || kw.includes('tailored'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="12" y="4" width="16" height="4" rx="1"/><path d="M13 8l-1 28"/><path d="M27 8l1 28"/><path d="M20 8v28"/><path d="M13 20l3-1M27 20l-3-1"/></svg>

  // ═══════════════════════════════════════
  // JUMPSUITS / ROMPERS
  // ═══════════════════════════════════════

  if (kw.includes('jumpsuit'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h12v14H14z"/><path d="M14 4l-4 4v6l4-2"/><path d="M26 4l4 4v6l-4-2"/><path d="M14 18l-2 18"/><path d="M26 18l2 18"/><path d="M20 18v18"/></svg>

  if (kw.includes('romper'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h12v14H14z"/><path d="M14 4l-4 4v6l4-2"/><path d="M26 4l4 4v6l-4-2"/><path d="M14 18l-4 10h10"/><path d="M26 18l4 10H20"/></svg>

  if (kw.includes('overalls') || kw.includes('dungaree'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10 12h20v8H10z"/><path d="M14 4l-4 8"/><path d="M26 4l4 8"/><path d="M10 20l-2 16"/><path d="M30 20l2 16"/><path d="M20 20v16"/></svg>

  // ═══════════════════════════════════════
  // OUTERWEAR
  // ═══════════════════════════════════════

  if (kw.includes('blazer') || kw.includes('structured jacket'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10 8l4-4h12l4 4v26H10z"/><path d="M10 8l-4 4v12l4-2"/><path d="M30 8l4 4v12l-4-2"/><path d="M20 4v30"/><path d="M16 4l4 6 4-6"/></svg>

  if (kw.includes('denim jacket') || kw.includes('jean jacket'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10 8l4-4h12l4 4v22H10z"/><path d="M10 8l-4 4v10l4-2"/><path d="M30 8l4 4v10l-4-2"/><path d="M20 4v26"/><rect x="12" y="14" width="5" height="4" rx="0.5"/><rect x="23" y="14" width="5" height="4" rx="0.5"/></svg>

  if (kw.includes('leather jacket') || kw.includes('moto') || kw.includes('biker'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10 8l4-4h12l4 4v24H10z"/><path d="M10 8l-4 4v10l4-2"/><path d="M30 8l4 4v10l-4-2"/><path d="M14 4l14 20"/><path d="M16 4l4 6 4-6"/></svg>

  if (kw.includes('bomber'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12 8h16v22H12z"/><path d="M12 8l-6 4v12l6-2"/><path d="M28 8l6 4v12l-6-2"/><path d="M12 8Q17 10 20 10Q23 10 28 8"/><path d="M12 28h16"/><path d="M20 10v18"/></svg>

  if (kw.includes('puffer') || kw.includes('down jacket'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10 8l4-4h12l4 4v24H10z"/><path d="M10 8l-6 4v12l6-2"/><path d="M30 8l6 4v12l-6-2"/><path d="M10 14h20M10 20h20M10 26h20"/></svg>

  if (kw.includes('trench') || kw.includes('trenchcoat'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10 6l4-2h12l4 2v30H10z"/><path d="M10 6l-4 4v14l4-2"/><path d="M30 6l4 4v14l-4-2"/><path d="M18 4v32M22 4v32"/><path d="M10 18h8M22 18h8"/><circle cx="22" cy="14" r="0.8" fill={c}/><circle cx="22" cy="22" r="0.8" fill={c}/></svg>

  if (kw.includes('cardigan') || kw.includes('open front'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10 8l4-4h12l4 4v26H10z"/><path d="M10 8l-4 4v12l4-2"/><path d="M30 8l4 4v12l-4-2"/><path d="M18 4v30M22 4v30"/></svg>

  if (kw.includes('coat') || kw.includes('overcoat') || kw.includes('topcoat'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10 6l4-2h12l4 2v30H10z"/><path d="M10 6l-4 4v14l4-2"/><path d="M30 6l4 4v14l-4-2"/><path d="M20 4v32"/><circle cx="18" cy="16" r="0.8" fill={c}/><circle cx="18" cy="22" r="0.8" fill={c}/><circle cx="18" cy="28" r="0.8" fill={c}/></svg>

  if (kw.includes('rain') || kw.includes('windbreaker') || kw.includes('anorak'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12 10h16v22H12z"/><path d="M12 10l-6 4v10l6-2"/><path d="M28 10l6 4v10l-6-2"/><path d="M14 6Q20 10 26 6"/><path d="M20 10v22"/><path d="M16 18h8v5h-8z"/></svg>

  if (kw.includes('vest') || kw.includes('gilet'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12 6h16v28H12z"/><path d="M16 4l4 4 4-4"/><path d="M20 8v26"/></svg>

  if (kw.includes('cape') || kw.includes('poncho'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L4 30h32z"/><circle cx="20" cy="6" r="3"/></svg>

  if (kw.includes('duster') || kw.includes('longline') || kw.includes('long'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12 6l4-2h8l4 2v30H12z"/><path d="M12 6l-4 4v14l4-2"/><path d="M28 6l4 4v14l-4-2"/><path d="M18 4v32M22 4v32"/></svg>

  // ═══════════════════════════════════════
  // SHOES
  // ═══════════════════════════════════════

  if (kw.includes('sneaker') || kw.includes('trainer') || kw.includes('athletic'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M6 22Q8 16 16 14l14 2v6H6z"/><path d="M6 24h28v4H6z"/><path d="M20 14v8"/></svg>

  if (kw.includes('flat') || kw.includes('ballet') || kw.includes('loafer'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M4 24Q8 18 18 16l16 4v4H4z"/><path d="M4 28h32"/></svg>

  if (kw.includes('sandal') || kw.includes('slide') || kw.includes('flip'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><ellipse cx="20" cy="26" rx="14" ry="6"/><path d="M14 22l6-8 6 8"/></svg>

  if (kw.includes('heel') || kw.includes('pump') || kw.includes('stiletto') || kw.includes('pointed'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M4 22Q10 16 20 14l12 4v4H4z"/><path d="M30 22v10"/><path d="M4 26h28"/></svg>

  if (kw.includes('wedge'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M4 20Q10 16 20 14l14 4v4H4z"/><path d="M4 24L34 24 34 32 4 28z"/></svg>

  if (kw.includes('platform'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M4 18Q10 14 20 12l14 4v4H4z"/><rect x="4" y="22" width="30" height="10" rx="2"/></svg>

  if (kw.includes('boot') || kw.includes('chelsea') || kw.includes('ankle boot'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v22H8v6h24v-6h-4V6z"/><path d="M12 18h16"/></svg>

  if (kw.includes('knee') || kw.includes('tall boot') || kw.includes('riding'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2v28H8v6h24v-6h-6V2z"/><path d="M14 20h18"/></svg>

  if (kw.includes('mule') || kw.includes('clog'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M4 22Q10 16 24 14v10H4z"/><rect x="4" y="24" width="30" height="6" rx="2"/></svg>

  if (kw.includes('espadrille'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M4 22Q10 16 20 14l14 4v4H4z"/><path d="M4 26h30"/><path d="M6 28Q10 30 14 28Q18 30 22 28Q26 30 30 28"/></svg>

  // ═══════════════════════════════════════
  // ACCESSORIES
  // ═══════════════════════════════════════

  if (kw.includes('belt') || kw.includes('cinch') || kw.includes('sash'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="16" width="32" height="8" rx="2"/><rect x="17" y="14" width="6" height="12" rx="1"/></svg>

  if (kw.includes('scarf') || kw.includes('shawl'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M8 8Q20 4 32 8"/><path d="M8 8v6Q8 20 14 22v10"/><path d="M32 8v6Q32 20 26 22v10"/></svg>

  if (kw.includes('hat') || kw.includes('cap') || kw.includes('beret') || kw.includes('beanie'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><ellipse cx="20" cy="24" rx="16" ry="4"/><path d="M8 24Q8 10 20 8Q32 10 32 24"/></svg>

  if (kw.includes('sunglasses') || kw.includes('glasses'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="20" r="6"/><circle cx="28" cy="20" r="6"/><path d="M18 20h4"/><path d="M6 18L4 14"/><path d="M34 18l2-4"/></svg>

  if (kw.includes('watch'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="20" cy="20" r="10"/><circle cx="20" cy="20" r="7"/><path d="M20 15v5l3 3"/><path d="M16 10V4h8v6"/><path d="M16 30v6h8v-6"/></svg>

  if (kw.includes('bracelet') || kw.includes('bangle'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><ellipse cx="20" cy="20" rx="12" ry="8"/><ellipse cx="20" cy="20" rx="9" ry="5"/></svg>

  if (kw.includes('ring') || kw.includes('band'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><ellipse cx="20" cy="22" rx="10" ry="8"/><ellipse cx="20" cy="22" rx="7" ry="5"/><circle cx="20" cy="14" r="4"/></svg>

  if (kw.includes('necklace') || kw.includes('chain') || kw.includes('pendant'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10 8Q10 24 20 28Q30 24 30 8"/><circle cx="20" cy="28" r="3"/></svg>

  if (kw.includes('earring'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="14" cy="10" r="2"/><path d="M14 12v8"/><circle cx="14" cy="24" r="4"/><circle cx="26" cy="10" r="2"/><path d="M26 12v8"/><circle cx="26" cy="24" r="4"/></svg>

  if (kw.includes('bag') || kw.includes('tote') || kw.includes('purse') || kw.includes('handbag'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="14" width="24" height="20" rx="3"/><path d="M14 14V8Q14 4 20 4Q26 4 26 8v6"/></svg>

  if (kw.includes('clutch'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="12" width="28" height="16" rx="3"/><path d="M6 20h28"/><circle cx="20" cy="20" r="2"/></svg>

  if (kw.includes('backpack'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="10" y="10" width="20" height="24" rx="4"/><path d="M14 10V6Q14 2 20 2Q26 2 26 6v4"/><rect x="14" y="20" width="12" height="8" rx="2"/></svg>

  if (kw.includes('crossbody'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="10" y="18" width="20" height="16" rx="3"/><path d="M10 22Q4 10 20 4Q36 10 30 22"/></svg>

  // ═══════════════════════════════════════
  // ACTIVEWEAR / LOUNGEWEAR
  // ═══════════════════════════════════════

  if (kw.includes('sports bra') || kw.includes('bralette'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h24v8Q28 24 20 24Q12 24 8 20z"/><path d="M12 8l-4 4"/><path d="M28 8l4 4"/><path d="M20 12v8"/></svg>

  if (kw.includes('yoga') || kw.includes('athletic pant'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="12" y="4" width="16" height="4" rx="1"/><path d="M14 8l-1 28"/><path d="M26 8l1 28"/><path d="M20 8v28"/><path d="M12 4Q14 6 16 4M24 4Q26 6 28 4"/></svg>

  if (kw.includes('swimsuit') || kw.includes('bikini') || kw.includes('one-piece'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12 6h16v24H12z"/><path d="M12 6l-2 2v4l2-2"/><path d="M28 6l2 2v4l-2-2"/><path d="M12 20h16"/></svg>

  if (kw.includes('robe') || kw.includes('kimono'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10 6l4-2h12l4 2v30H10z"/><path d="M10 6l-6 6v16l6-4"/><path d="M30 6l6 6v16l-6-4"/><path d="M14 4l6 14 6-14"/><path d="M10 20h20"/></svg>

  // ═══════════════════════════════════════
  // SUITS / FORMALWEAR
  // ═══════════════════════════════════════

  if (kw.includes('suit'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10 8l4-4h12l4 4v28H10z"/><path d="M10 8l-4 4v12l4-2"/><path d="M30 8l4 4v12l-4-2"/><path d="M16 4l4 8 4-8"/><path d="M20 12v24"/></svg>

  if (kw.includes('tuxedo') || kw.includes('tux'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10 8l4-4h12l4 4v28H10z"/><path d="M10 8l-4 4v12l4-2"/><path d="M30 8l4 4v12l-4-2"/><path d="M16 4l4 8 4-8"/><path d="M20 12v24"/><path d="M18 12h4"/></svg>

  // ═══════════════════════════════════════
  // GENERIC / FALLBACK
  // ═══════════════════════════════════════

  if (kw.includes('top') || kw.includes('shirt') || kw.includes('tee') || kw.includes('fitted'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 6h12v24H14z"/><path d="M14 6l-6 4v8l6-2"/><path d="M26 6l6 4v8l-6-2"/></svg>

  if (kw.includes('pant') || kw.includes('jean') || kw.includes('denim') || kw.includes('bottom'))
    return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="12" y="4" width="16" height="4" rx="1"/><path d="M13 8l-1 28"/><path d="M27 8l1 28"/><path d="M20 8v28"/></svg>

  // Ultimate fallback — generic garment
  return <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 6h12v24H14z"/><path d="M14 6l-6 4v8l6-2"/><path d="M26 6l6 4v8l-6-2"/></svg>
}
