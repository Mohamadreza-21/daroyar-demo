export function syncRating(db, productId) {
  const reviews = db.reviews.filter((review) => review.productId === productId)
  const reviewCount = reviews.length
  const rating = reviewCount
    ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount) * 10) / 10
    : 0
  const product = db.products.find((item) => item.id === productId)
  if (product) Object.assign(product, { rating, reviewCount })
}

export const syncAllRatings = (db) => db.products.forEach((product) => syncRating(db, product.id))
