import { nextId, paginate, publicUser, requireAdmin, requireUser, respond } from '../lib/context.js'
import { fail } from '../lib/errors.js'
import { matchesQuery } from '../lib/normalize.js'
import { contactSchema, newsletterSchema, parse, replySchema } from '../lib/schemas.js'

function requireCustomer(ctx) {
  const user = requireUser(ctx)
  if (user.role === 'admin') fail(403, 'لیست علاقه‌مندی برای مدیر در دسترس نیست.', { code: 'FORBIDDEN' })
  return user
}

function listFor(db, user) {
  let list = db.wishlists.find((item) => item.userId === user.id)
  if (!list) {
    list = { id: nextId(db.wishlists), userId: user.id, productIds: [] }
    db.wishlists.push(list)
  }
  return list
}

const byNewest = (a, b) => b.createdAt.localeCompare(a.createdAt)

export const accountRoutes = [
  ['GET', '/wishlist', (ctx) => respond({ productIds: listFor(ctx.db, requireCustomer(ctx)).productIds })],
  [
    'PUT',
    '/wishlist/:productId',
    (ctx) => {
      const list = listFor(ctx.db, requireCustomer(ctx))
      const id = Number(ctx.params.productId)
      if (!ctx.db.products.some((product) => product.id === id)) fail(404, 'محصول مورد نظر پیدا نشد')
      list.productIds = [...new Set([...list.productIds, id])]
      return respond({ productIds: list.productIds })
    },
  ],
  [
    'DELETE',
    '/wishlist/:productId',
    (ctx) => {
      const list = listFor(ctx.db, requireCustomer(ctx))
      const id = Number(ctx.params.productId)
      list.productIds = list.productIds.filter((item) => item !== id)
      return respond({ productIds: list.productIds })
    },
  ],
  [
    'POST',
    '/messages',
    (ctx) => {
      const values = parse(contactSchema, ctx.body)
      const message = {
        id: nextId(ctx.db.messages),
        ...values,
        userId: ctx.user?.id ?? null,
        status: 'pending',
        reply: null,
        repliedAt: null,
        createdAt: new Date().toISOString(),
      }
      ctx.db.messages.push(message)
      return respond(message, { status: 201 })
    },
  ],
  [
    'GET',
    '/messages/mine',
    (ctx) => {
      const user = requireUser(ctx)
      return respond(ctx.db.messages.filter((message) => message.userId === user.id).sort(byNewest))
    },
  ],
  [
    'GET',
    '/messages',
    (ctx) => {
      requireAdmin(ctx)
      const { status } = ctx.query
      let list = ctx.db.messages
      if (status) list = list.filter((message) => message.status === status)
      const page = paginate([...list].sort(byNewest), ctx.query, 10)
      return respond(page.items, { total: page.total })
    },
  ],
  [
    'POST',
    '/messages/:id/reply',
    (ctx) => {
      requireAdmin(ctx)
      const message = ctx.db.messages.find((item) => item.id === Number(ctx.params.id))
      if (!message) fail(404, 'پیام مورد نظر پیدا نشد')
      const { reply } = parse(replySchema, ctx.body)
      Object.assign(message, { reply, status: 'answered', repliedAt: new Date().toISOString() })
      return respond(message)
    },
  ],
  [
    'POST',
    '/subscribers',
    (ctx) => {
      const { email } = parse(newsletterSchema, ctx.body)
      const existing = ctx.db.subscribers.find((item) => item.email === email)
      if (existing) return respond({ ...existing, already: true })
      const created = { id: nextId(ctx.db.subscribers), email, createdAt: new Date().toISOString() }
      ctx.db.subscribers.push(created)
      return respond(created, { status: 201 })
    },
  ],
  [
    'GET',
    '/users',
    (ctx) => {
      requireAdmin(ctx)
      const { q, role } = ctx.query
      let list = ctx.db.users
      if (role) list = list.filter((user) => user.role === role)
      if (q) {
        list = list.filter((user) =>
          matchesQuery(`${user.firstName} ${user.lastName} ${user.username} ${user.email} ${user.phone}`, q),
        )
      }
      const page = paginate(list, ctx.query, 10)
      return respond(page.items.map(publicUser), { total: page.total })
    },
  ],
  [
    'GET',
    '/stats',
    (ctx) => {
      requireAdmin(ctx)
      const { products, orders, categories, users } = ctx.db
      const sold = orders.filter((order) => order.status !== 'canceled')
      const byStatus = {}
      orders.forEach((order) => {
        byStatus[order.status] = (byStatus[order.status] ?? 0) + 1
      })
      return respond({
        products: products.length,
        lowStock: products.filter((product) => product.stock > 0 && product.stock < 10).length,
        outOfStock: products.filter((product) => product.stock === 0).length,
        users: users.length,
        orders: orders.length,
        revenue: sold.reduce((sum, order) => sum + order.totals.total, 0),
        byStatus,
        byCategory: categories.map((category) => ({
          slug: category.slug,
          label: category.label,
          count: products.filter((product) => product.category === category.slug).length,
        })),
        recentOrders: [...orders].sort(byNewest).slice(0, 5),
      })
    },
  ],
]
