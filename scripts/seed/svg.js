const PALETTES = {
  'skin-care': { bg: ['#e6f6f3', '#cdeee8'], main: '#0f9d8a', accent: '#ff7a59' },
  beauty: { bg: ['#fff0ec', '#ffe0d8'], main: '#ff7a59', accent: '#0f9d8a' },
  fragrances: { bg: ['#eceefe', '#dde1fb'], main: '#5b63d3', accent: '#f2b84b' },
  groceries: { bg: ['#fff6e2', '#ffeab8'], main: '#e0a020', accent: '#0f9d8a' },
}

const SHAPES = {
  tube: (c) =>
    `<path d="M150 70h100l14 40v190a16 16 0 0 1-16 16H152a16 16 0 0 1-16-16V110z" fill="${c.main}"/><rect x="156" y="46" width="88" height="30" rx="8" fill="${c.accent}"/>`,
  jar: (c) =>
    `<rect x="120" y="120" width="160" height="170" rx="26" fill="${c.main}"/><rect x="132" y="84" width="136" height="44" rx="12" fill="${c.accent}"/>`,
  bottle: (c) =>
    `<rect x="168" y="58" width="64" height="48" rx="10" fill="${c.accent}"/><path d="M178 100h44v26c28 12 40 30 40 56v100a22 22 0 0 1-22 22H160a22 22 0 0 1-22-22V182c0-26 12-44 40-56z" fill="${c.main}"/>`,
  pump: (c) =>
    `<rect x="190" y="40" width="20" height="40" rx="6" fill="${c.accent}"/><rect x="170" y="36" width="60" height="14" rx="7" fill="${c.accent}"/><rect x="140" y="80" width="120" height="224" rx="24" fill="${c.main}"/>`,
  spray: (c) =>
    `<rect x="176" y="44" width="48" height="40" rx="8" fill="${c.accent}"/><rect x="150" y="82" width="100" height="216" rx="20" fill="${c.main}"/><rect x="186" y="22" width="30" height="22" rx="6" fill="${c.accent}"/>`,
  perfume: (c) =>
    `<rect x="176" y="40" width="48" height="52" rx="8" fill="${c.accent}"/><rect x="190" y="88" width="20" height="22" fill="${c.main}"/><rect x="118" y="108" width="164" height="190" rx="30" fill="${c.main}" opacity=".95"/>`,
  box: (c) =>
    `<rect x="100" y="110" width="200" height="180" rx="14" fill="${c.main}"/><rect x="100" y="110" width="200" height="40" rx="14" fill="${c.accent}"/>`,
  pouch: (c) =>
    `<path d="M130 90h140l14 200a16 16 0 0 1-16 18H132a16 16 0 0 1-16-18z" fill="${c.main}"/><rect x="128" y="70" width="144" height="30" rx="8" fill="${c.accent}"/>`,
}

const SHAPE_BY_CATEGORY = {
  'skin-care': ['tube', 'jar', 'pump'],
  beauty: ['pump', 'bottle', 'tube'],
  fragrances: ['spray', 'perfume', 'bottle'],
  groceries: ['pouch', 'jar', 'box'],
}

const esc = (value) => String(value).replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`)

export function productSvg({ category, id, brand, variant = 0 }) {
  const palette = PALETTES[category] ?? PALETTES['skin-care']
  const shapes = SHAPE_BY_CATEGORY[category] ?? SHAPE_BY_CATEGORY['skin-care']
  const shape = SHAPES[shapes[id % shapes.length]](palette)
  const [bgA, bgB] = variant === 1 ? [palette.bg[1], palette.bg[0]] : palette.bg
  const scale = variant === 2 ? 1.18 : 1
  const labelY = 210
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="${esc(brand)}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bgA}"/><stop offset="1" stop-color="${bgB}"/></linearGradient></defs>
<rect width="400" height="400" fill="url(#g)"/>
<circle cx="${variant === 1 ? 110 : 300}" cy="${variant === 1 ? 110 : 96}" r="${variant === 2 ? 130 : 70}" fill="#fff" opacity=".45"/>
<ellipse cx="200" cy="332" rx="${96 * scale}" ry="12" fill="#0e2a2f" opacity=".12"/>
<g transform="translate(${200 - 200 * scale} ${variant === 2 ? -40 : 0}) scale(${scale})">${shape}
<rect x="${variant === 0 ? 150 : 140}" y="${labelY}" width="${variant === 0 ? 100 : 120}" height="56" rx="10" fill="#fff" opacity=".92"/>
<text x="200" y="${labelY + 35}" text-anchor="middle" font-family="Vazirmatn, Tahoma, 'DejaVu Sans', sans-serif" font-size="22" font-weight="700" fill="#0e2a2f">${esc(brand)}</text></g>
</svg>`
}

export const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#eef2f3"/><path d="M120 260l54-68 40 48 26-30 40 50z" fill="#c3cdd1"/><circle cx="154" cy="148" r="24" fill="#c3cdd1"/></svg>`
