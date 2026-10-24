const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#eef2f3"/><path d="M36 78l16-20 12 14 8-9 12 15z" fill="#c3cdd1"/><circle cx="46" cy="44" r="7" fill="#c3cdd1"/></svg>',
  )

export const assetUrl = (src) =>
  typeof src === 'string' && src.startsWith('/') ? `${import.meta.env.BASE_URL}${src.slice(1)}` : src

export function handleImgError(event) {
  const img = event.currentTarget
  if (img.dataset.fallback) return
  img.dataset.fallback = '1'
  img.src = PLACEHOLDER
}
