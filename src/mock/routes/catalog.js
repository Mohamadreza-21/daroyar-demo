import { nextId, requireAdmin, respond } from '../lib/context.js'
import { fail } from '../lib/errors.js'
import { buildSearchText } from '../lib/normalize.js'
import { priceAfterDiscount } from '../lib/pricing.js'
import { categorySchema, parse, productSchema, stockSchema } from '../lib/schemas.js'

const skuOf = (id) => `DR-${String(id).padStart(4, '0')}`
const idOf = (params) => Number(params.id)

function productFields(values) {
  return {
    title: values.title,
    brand: values.brand,
    category: values.category,
    description: values.description,
    basePrice: values.basePrice,
    discount: values.discount,
    price: priceAfterDiscount(values.basePrice, values.discount),
    stock: values.stock,
    thumbnail: values.thumbnail,
    searchText: buildSearchText(values.title, values.brand, values.tags ?? []),
  }
}

const requireCategory = (db, slug) => {
  if (!db.categories.some((category) => category.slug === slug)) {
    fail(422, 'دستهٔ انتخاب‌شده وجود ندارد', { errors: { category: 'دستهٔ انتخاب‌شده وجود ندارد' } })
  }
}

const findProduct = (db, params) => {
  const product = db.products.find((item) => item.id === idOf(params))
  if (!product) fail(404, 'محصول مورد نظر پیدا نشد')
  return product
}

const findCategory = (db, params) => {
  const category = db.categories.find((item) => item.id === idOf(params))
  if (!category) fail(404, 'دسته‌بندی پیدا نشد')
  return category
}

export const catalogRoutes = [
  ['GET', '/products/:id', ({ db, params }) => respond(findProduct(db, params))],
  [
    'POST',
    '/products',
    (ctx) => {
      requireAdmin(ctx)
      const values = parse(productSchema, ctx.body)
      requireCategory(ctx.db, values.category)
      const id = nextId(ctx.db.products)
      const created = {
        id,
        ...productFields(values),
        sku: skuOf(id),
        images: [values.thumbnail],
        tags: [],
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
      }
      ctx.db.products.push(created)
      return respond(created, { status: 201 })
    },
  ],
  [
    'PATCH',
    '/products/:id',
    (ctx) => {
      requireAdmin(ctx)
      const current = findProduct(ctx.db, ctx.params)
      const values = parse(productSchema, { ...current, ...ctx.body })
      requireCategory(ctx.db, values.category)
      const images = [
        values.thumbnail,
        ...(current.images ?? []).filter((src) => src !== values.thumbnail && src !== current.thumbnail),
      ]
      Object.assign(current, productFields({ ...values, tags: current.tags }), { images })
      return respond(current)
    },
  ],
  [
    'PATCH',
    '/products/:id/stock',
    (ctx) => {
      requireAdmin(ctx)
      const current = findProduct(ctx.db, ctx.params)
      current.stock = parse(stockSchema, ctx.body).stock
      return respond(current)
    },
  ],
  [
    'DELETE',
    '/products/:id',
    (ctx) => {
      requireAdmin(ctx)
      const { db } = ctx
      const current = findProduct(db, ctx.params)
      db.products = db.products.filter((item) => item.id !== current.id)
      db.reviews = db.reviews.filter((review) => review.productId !== current.id)
      db.wishlists.forEach((list) => {
        list.productIds = list.productIds.filter((id) => id !== current.id)
      })
      return respond(undefined, { status: 204 })
    },
  ],
  [
    'POST',
    '/categories',
    (ctx) => {
      requireAdmin(ctx)
      const values = parse(categorySchema, ctx.body)
      if (ctx.db.categories.some((category) => category.slug === values.slug)) {
        fail(409, 'این شناسه قبلاً استفاده شده است', { errors: { slug: 'این شناسه قبلاً استفاده شده است' } })
      }
      const created = { id: nextId(ctx.db.categories), ...values }
      ctx.db.categories.push(created)
      return respond(created, { status: 201 })
    },
  ],
  [
    'PATCH',
    '/categories/:id',
    (ctx) => {
      requireAdmin(ctx)
      const current = findCategory(ctx.db, ctx.params)
      const { slug: _ignored, ...values } = parse(categorySchema, { ...current, ...ctx.body, slug: current.slug })
      Object.assign(current, values)
      return respond(current)
    },
  ],
  [
    'DELETE',
    '/categories/:id',
    (ctx) => {
      requireAdmin(ctx)
      const current = findCategory(ctx.db, ctx.params)
      const used = ctx.db.products.filter((product) => product.category === current.slug).length
      if (used > 0) fail(409, `این دسته ${used} محصول دارد؛ ابتدا محصولات را به دستهٔ دیگری منتقل یا حذف کنید.`)
      ctx.db.categories = ctx.db.categories.filter((item) => item.id !== current.id)
      return respond(undefined, { status: 204 })
    },
  ],
  [
    'GET',
    '/catalog/meta',
    ({ db }) => {
      const counts = {}
      db.products.forEach((product) => {
        counts[product.category] = (counts[product.category] ?? 0) + 1
      })
      return respond({
        total: db.products.length,
        maxPrice: Math.max(0, ...db.products.map((product) => product.price)),
        counts,
      })
    },
  ],
]
