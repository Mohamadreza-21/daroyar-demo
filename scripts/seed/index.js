import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildSearchText } from '../../src/mock/lib/normalize.js'
import { hashPassword } from '../../src/mock/lib/passwords.js'
import { calcTotals, priceAfterDiscount } from '../../src/mock/lib/pricing.js'
import { ARTICLES } from './articles.js'
import { buildReviews, CATEGORIES, PRODUCTS, seededRandom } from './products.js'
import { placeholderSvg } from './svg.js'
import { PRODUCT_PHOTOS } from './product-images.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const imagesDir = join(root, 'public', 'images')
const DAY = 86400000
const now = Date.now()
const rand = seededRandom(20261019)

rmSync(join(imagesDir, 'products'), { recursive: true, force: true })
mkdirSync(imagesDir, { recursive: true })
writeFileSync(join(imagesDir, 'placeholder.svg'), placeholderSvg)
if (PRODUCT_PHOTOS.length !== PRODUCTS.length) {
  throw new Error(`Expected ${PRODUCTS.length} product photos, received ${PRODUCT_PHOTOS.length}`)
}

const products = PRODUCTS.map(
  ([title, brand, category, basePrice, discount, stock, rating, tags, description], index) => {
    const id = index + 1
    const thumbnail = PRODUCT_PHOTOS[index]
    return {
      id,
      title,
      brand,
      category,
      description,
      basePrice,
      discount,
      price: priceAfterDiscount(basePrice, discount),
      stock,
      rating,
      reviewCount: 0,
      tags,
      sku: `DR-${String(id).padStart(4, '0')}`,
      thumbnail,
      images: [thumbnail],
      createdAt: new Date(now - (PRODUCTS.length - index) * 2 * DAY).toISOString(),
      searchText: buildSearchText(title, brand, tags),
    }
  },
)

const reviews = []
products.forEach((product) => {
  const count = Math.floor(rand() * 5)
  buildReviews(product.id, count, product.rating, rand, now).forEach((review) => reviews.push(review))
  product.reviewCount = count
})
reviews.forEach((review, index) => {
  review.id = index + 1
})

const demoPassword = await hashPassword('demo1234')
const users = [
  {
    username: 'admin',
    email: 'admin@darooyar.ir',
    firstName: 'مدیر',
    lastName: 'سایت',
    phone: '09120000000',
    role: 'admin',
    passwordHash: await hashPassword('admin1234'),
  },
  {
    username: 'customer',
    email: 'customer@darooyar.ir',
    firstName: 'مشتری',
    lastName: 'نمونه',
    phone: '09350000000',
    role: 'customer',
    passwordHash: await hashPassword('customer123'),
  },
  {
    username: 'sara.rad',
    email: 'sara@example.com',
    firstName: 'سارا',
    lastName: 'راد',
    phone: '09121111111',
    role: 'customer',
    passwordHash: demoPassword,
  },
  {
    username: 'ali.karimi',
    email: 'ali@example.com',
    firstName: 'علی',
    lastName: 'کریمی',
    phone: '09122222222',
    role: 'customer',
    passwordHash: demoPassword,
  },
  {
    username: 'maryam.h',
    email: 'maryam@example.com',
    firstName: 'مریم',
    lastName: 'حسینی',
    phone: '09123333333',
    role: 'customer',
    passwordHash: demoPassword,
  },
].map((user, index) => ({
  id: index + 1,
  image: '',
  createdAt: new Date(now - (30 - index) * DAY).toISOString(),
  ...user,
}))

const shippingMethods = [
  { id: 'standard', label: 'پست پیشتاز', description: 'تحویل در ۳ تا ۵ روز کاری', cost: 85000, freeFrom: 2000000 },
  {
    id: 'express',
    label: 'پیک ویژه',
    description: 'تحویل در همان روز یا روز بعد (شهرهای بزرگ)',
    cost: 180000,
    freeFrom: null,
  },
]

const coupons = [
  { id: 1, code: 'DAROO10', percent: 10, label: '۱۰٪ تخفیف ویژه مشتریان', active: true },
  { id: 2, code: 'SALAMAT15', percent: 15, label: '۱۵٪ تخفیف هفتهٔ سلامت', active: true },
]

const addresses = [
  {
    province: 'تهران',
    city: 'تهران',
    address: 'خیابان نمونه، کوچهٔ آزمایشی، پلاک ۱۲، واحد ۳',
    postalCode: '1234567890',
  },
  { province: 'اصفهان', city: 'اصفهان', address: 'میدان نمونه، خیابان فرضی، پلاک ۸۰', postalCode: '8123456789' },
  { province: 'فارس', city: 'شیراز', address: 'بلوار نمونه، کوچهٔ ۴، ساختمان آزمایشی', postalCode: '7123456780' },
]

const plan = [
  {
    user: 2,
    status: 'delivered',
    daysAgo: 21,
    picks: [
      [1, 2],
      [9, 1],
    ],
    coupon: null,
    method: 'standard',
    payment: 'online',
  },
  {
    user: 2,
    status: 'shipped',
    daysAgo: 6,
    picks: [
      [2, 1],
      [31, 1],
      [12, 2],
    ],
    coupon: 'DAROO10',
    method: 'standard',
    payment: 'cod',
  },
  { user: 2, status: 'processing', daysAgo: 1, picks: [[23, 1]], coupon: null, method: 'express', payment: 'online' },
  {
    user: 3,
    status: 'delivered',
    daysAgo: 14,
    picks: [
      [4, 1],
      [20, 3],
    ],
    coupon: 'SALAMAT15',
    method: 'standard',
    payment: 'online',
  },
  { user: 3, status: 'canceled', daysAgo: 10, picks: [[24, 1]], coupon: null, method: 'standard', payment: 'cod' },
  {
    user: 4,
    status: 'packed',
    daysAgo: 3,
    picks: [
      [13, 4],
      [15, 2],
      [34, 1],
    ],
    coupon: null,
    method: 'standard',
    payment: 'cod',
  },
  {
    user: 5,
    status: 'delivered',
    daysAgo: 28,
    picks: [
      [27, 1],
      [31, 2],
    ],
    coupon: 'DAROO10',
    method: 'express',
    payment: 'online',
  },
  {
    user: 5,
    status: 'processing',
    daysAgo: 0,
    picks: [
      [19, 1],
      [11, 1],
    ],
    coupon: null,
    method: 'standard',
    payment: 'online',
  },
]

const orders = plan.map((entry, index) => {
  const user = users.find((u) => u.id === entry.user)
  const coupon = coupons.find((c) => c.code === entry.coupon) ?? null
  const method = shippingMethods.find((m) => m.id === entry.method)
  const items = entry.picks.map(([productId, qty]) => {
    const product = products.find((p) => p.id === productId)
    return {
      productId,
      title: product.title,
      thumbnail: product.thumbnail,
      category: product.category,
      price: product.price,
      basePrice: product.basePrice,
      qty,
    }
  })
  const createdAt = new Date(now - entry.daysAgo * DAY - index * 3600000).toISOString()
  const flow = ['processing', 'packed', 'shipped', 'delivered']
  const stepIndex = flow.indexOf(entry.status)
  const history =
    entry.status === 'canceled'
      ? [
          { status: 'processing', at: createdAt },
          { status: 'canceled', at: new Date(new Date(createdAt).getTime() + 3600000).toISOString() },
        ]
      : flow
          .slice(0, stepIndex + 1)
          .map((status, i) => ({ status, at: new Date(new Date(createdAt).getTime() + i * 8 * 3600000).toISOString() }))
  return {
    id: `DR-${(0xa1b2c3d4 + index * 7919).toString(16).toUpperCase()}`,
    userId: user.id,
    status: entry.status,
    createdAt,
    updatedAt: history.at(-1).at,
    history,
    items,
    totals: calcTotals(items, coupon, method),
    coupon: coupon ? { code: coupon.code, percent: coupon.percent } : null,
    shippingMethod: { id: method.id, label: method.label, cost: method.cost },
    payment: entry.payment,
    shipping: {
      fullName: `${user.firstName} ${user.lastName}`,
      phone: user.phone,
      note: '',
      ...addresses[index % addresses.length],
    },
    customer: `${user.firstName} ${user.lastName}`,
  }
})

const db = {
  categories: CATEGORIES.map((category, index) => ({ id: index + 1, ...category })),
  products,
  reviews,
  users,
  sessions: [],
  wishlists: [{ id: 1, userId: 2, productIds: [4, 23, 31] }],
  orders,
  shippingMethods,
  coupons,
  articles: ARTICLES,
  messages: [],
  subscribers: [],
}

writeFileSync(join(root, 'src', 'mock', 'seed.json'), `${JSON.stringify(db, null, 2)}\n`)
console.log(
  `seed.json ساخته شد: ${products.length} محصول، ${orders.length} سفارش، ${users.length} کاربر، ${reviews.length} نظر`,
)
