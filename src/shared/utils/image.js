import { PRODUCT_PHOTO_IDS } from './productPhotoIds.js'

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#eef2f3"/><path d="M36 78l16-20 12 14 8-9 12 15z" fill="#c3cdd1"/><circle cx="46" cy="44" r="7" fill="#c3cdd1"/></svg>',
  )

const BASE_URL = import.meta.env.BASE_URL || '/'
const BUNDLED_PHOTO_IDS = new Set(PRODUCT_PHOTO_IDS)

function localPhotoUrl(src) {
  try {
    const url = new URL(src)
    const photoId = url.pathname.replace(/^\/+/, '')
    if (url.hostname === 'images.unsplash.com' && BUNDLED_PHOTO_IDS.has(photoId)) {
      return `${BASE_URL}images/products/${photoId}.jpg`
    }
  } catch {
    // Non-URL values are handled by assetUrl below.
  }
  return null
}

export const assetUrl = (src) => {
  if (typeof src !== 'string' || !src.trim()) return PLACEHOLDER
  const localPhoto = localPhotoUrl(src)
  if (localPhoto) return localPhoto
  if (/^(?:https?:|data:|blob:)/i.test(src)) return src
  if (src.startsWith('/')) return `${BASE_URL}${src.slice(1)}`
  return src
}

export function handleImgError(event) {
  const img = event.currentTarget
  if (img.dataset.fallback) return
  img.dataset.fallback = '1'
  img.src = PLACEHOLDER
}
