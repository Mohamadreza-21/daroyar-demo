import { PRODUCT_PHOTO_IDS } from '../../src/shared/utils/productPhotoIds.js'

// Original stock-photo sources. The download script stores these locally before build/deploy.
export const PRODUCT_PHOTOS = PRODUCT_PHOTO_IDS.map(
  (id) => `https://images.unsplash.com/${id}?auto=format&fit=max&w=720&q=80`,
)
