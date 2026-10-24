import { paginate, publicUser, requireAdmin, requireUser, respond } from '../lib/context.js'
import { fail } from '../lib/errors.js'
import { matchesQuery } from '../lib/normalize.js'
import { calcTotals } from '../lib/pricing.js'
import { MAX_QTY, couponSchema, orderSchema, parse, statusSchema } from '../lib/schemas.js'

const TRANSITIONS = {
  processing: ['packed', 'canceled'],
  packed: ['shipped', 'canceled'],
  shipped: ['delivered'],
  delivered: [],
  canceled: [],
}
const STATUS_LABELS = {
  processing: 'در حال پردازش',
  packed: 'آماده ارسال',
  shipped: 'ارسال شده',
  delivered: 'تحویل شد',
  canceled: 'لغو شد',
}
const CUSTOMER_CANCELABLE = ['processing']

const makeOrderId = () =>
  `DR-${[...crypto.getRandomValues(new Uint8Array(4))]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`

const findCoupon = (db, code) => {
  const wanted = String(code ?? '')
    .trim()
    .toUpperCase()
  return db.coupons.find((coupon) => coupon.active && coupon.code === wanted)
}

const visibleTo = (user, order) => user.role === 'admin' || order.userId === user.id

function changeStatus(db, order, status) {
  const at = new Date().toISOString()
  Object.assign(order, { status, updatedAt: at, history: [...order.history, { status, at }] })
  if (status === 'canceled') {
    order.items.forEach((item) => {
      const product = db.products.find((p) => p.id === item.productId)
      if (product) product.stock += item.qty
    })
  }
  return order
}

function findOrder(db, id) {
  const order = db.orders.find((item) => item.id === id)
  if (!order) fail(404, 'سفارش مورد نظر پیدا نشد')
  return order
}

export const orderRoutes = [
  [
    'POST',
    '/coupons/validate',
    ({ db, body }) => {
      const coupon = findCoupon(db, parse(couponSchema, body).code)
      if (!coupon) fail(404, 'کد تخفیف معتبر نیست')
      return respond({ code: coupon.code, percent: coupon.percent, label: coupon.label })
    },
  ],
  [
    'POST',
    '/orders',
    (ctx) => {
      const user = requireUser(ctx)
      const { db } = ctx
      const input = parse(orderSchema, ctx.body)

      const merged = new Map()
      input.items.forEach(({ productId, qty }) => merged.set(productId, (merged.get(productId) ?? 0) + qty))
      if ([...merged.values()].some((qty) => qty > MAX_QTY)) {
        fail(422, `حداکثر تعداد هر محصول در یک سفارش ${MAX_QTY} عدد است`)
      }

      const changes = []
      const lines = []
      merged.forEach((qty, productId) => {
        const product = db.products.find((p) => p.id === productId)
        if (!product) {
          changes.push({ productId, type: 'removed' })
        } else if (product.stock < qty) {
          changes.push({
            productId,
            title: product.title,
            type: product.stock > 0 ? 'stock' : 'soldout',
            available: product.stock,
          })
        } else {
          lines.push({ product, qty })
        }
      })
      if (changes.length) {
        fail(409, 'موجودی یا وضعیت برخی کالاها تغییر کرده است؛ سبد خرید را بررسی کنید.', {
          code: 'CART_CHANGED',
          changes,
        })
      }

      const shippingMethod = db.shippingMethods.find((method) => method.id === input.shippingMethodId)
      if (!shippingMethod) fail(422, 'روش ارسال نامعتبر است', { errors: { shippingMethodId: 'روش ارسال نامعتبر است' } })

      const coupon = input.couponCode ? findCoupon(db, input.couponCode) : null
      if (input.couponCode && !coupon) fail(422, 'کد تخفیف معتبر نیست', { code: 'INVALID_COUPON' })

      const totals = calcTotals(
        lines.map(({ product, qty }) => ({ price: product.price, basePrice: product.basePrice, qty })),
        coupon,
        shippingMethod,
      )
      if (input.expectedTotal != null && input.expectedTotal !== totals.total) {
        fail(409, 'قیمت کالاها یا هزینهٔ ارسال تغییر کرده است؛ مبلغ جدید را بررسی کنید.', {
          code: 'PRICE_CHANGED',
          totals,
        })
      }

      lines.forEach(({ product, qty }) => {
        product.stock -= qty
      })

      let id = makeOrderId()
      while (db.orders.some((order) => order.id === id)) id = makeOrderId()
      const now = new Date().toISOString()
      const order = {
        id,
        userId: user.id,
        status: 'processing',
        createdAt: now,
        updatedAt: now,
        history: [{ status: 'processing', at: now }],
        items: lines.map(({ product, qty }) => ({
          productId: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          category: product.category,
          price: product.price,
          basePrice: product.basePrice,
          qty,
        })),
        totals,
        coupon: coupon ? { code: coupon.code, percent: coupon.percent } : null,
        shippingMethod: { id: shippingMethod.id, label: shippingMethod.label, cost: shippingMethod.cost },
        payment: input.payment,
        shipping: input.shipping,
        customer: input.shipping.fullName,
      }
      db.orders.push(order)
      return respond(order, { status: 201 })
    },
  ],
  [
    'GET',
    '/orders',
    (ctx) => {
      const user = requireUser(ctx)
      const { db, query } = ctx
      const { status, q, userId } = query
      const customers = new Map(db.users.map((u) => [u.id, u]))
      let list = db.orders.filter((order) => visibleTo(user, order))
      if (user.role === 'admin' && userId) list = list.filter((order) => String(order.userId) === String(userId))
      if (status) list = list.filter((order) => order.status === status)
      if (q) {
        list = list.filter((order) =>
          matchesQuery(
            `${order.id} ${order.customer} ${order.shipping.city} ${customers.get(order.userId)?.username ?? ''}`,
            q,
          ),
        )
      }
      list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      const page = paginate(list, query, 10)
      return respond(page.items, { total: page.total })
    },
  ],
  [
    'GET',
    '/orders/:id',
    (ctx) => {
      const user = requireUser(ctx)
      const order = findOrder(ctx.db, ctx.params.id)
      if (!visibleTo(user, order)) fail(404, 'سفارش مورد نظر پیدا نشد')
      const owner = ctx.db.users.find((u) => u.id === order.userId)
      return respond(user.role === 'admin' ? { ...order, user: publicUser(owner) } : order)
    },
  ],
  [
    'PATCH',
    '/orders/:id/status',
    (ctx) => {
      requireAdmin(ctx)
      const order = findOrder(ctx.db, ctx.params.id)
      const { status } = parse(statusSchema, ctx.body)
      if (!TRANSITIONS[order.status].includes(status)) {
        fail(409, `تغییر وضعیت از «${STATUS_LABELS[order.status]}» به «${STATUS_LABELS[status]}» مجاز نیست`, {
          code: 'INVALID_TRANSITION',
          allowed: TRANSITIONS[order.status],
        })
      }
      return respond(changeStatus(ctx.db, order, status))
    },
  ],
  [
    'POST',
    '/orders/:id/cancel',
    (ctx) => {
      const user = requireUser(ctx)
      const order = ctx.db.orders.find((item) => item.id === ctx.params.id)
      if (!order || !visibleTo(user, order)) fail(404, 'سفارش مورد نظر پیدا نشد')
      if (!CUSTOMER_CANCELABLE.includes(order.status)) {
        fail(409, 'لغو سفارش فقط در مرحلهٔ «در حال پردازش» امکان‌پذیر است')
      }
      return respond(changeStatus(ctx.db, order, 'canceled'))
    },
  ],
]
