import { nextId, requireUser, respond } from '../lib/context.js'
import { fail } from '../lib/errors.js'
import { syncRating } from '../lib/rating.js'
import { parse, reviewSchema } from '../lib/schemas.js'

export const reviewRoutes = [
  [
    'POST',
    '/reviews',
    (ctx) => {
      const user = requireUser(ctx)
      if (user.role === 'admin') fail(403, 'مدیر نمی‌تواند برای محصولات نظر ثبت کند.', { code: 'FORBIDDEN' })
      const { productId, rating, comment } = parse(reviewSchema, ctx.body)
      const { db } = ctx
      if (!db.products.some((product) => product.id === productId)) fail(404, 'محصول مورد نظر پیدا نشد')
      if (db.reviews.some((review) => review.productId === productId && review.userId === user.id)) {
        fail(409, 'شما قبلاً برای این محصول نظر ثبت کرده‌اید', { code: 'ALREADY_REVIEWED' })
      }
      const review = {
        id: nextId(db.reviews),
        productId,
        userId: user.id,
        reviewerName: `${user.firstName} ${user.lastName}`.trim(),
        rating,
        comment,
        date: new Date().toISOString(),
      }
      db.reviews.push(review)
      syncRating(db, productId)
      return respond(review, { status: 201 })
    },
  ],
]
