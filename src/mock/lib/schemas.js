import { z } from 'zod'
import { toEnglishDigits } from './normalize.js'

const phone = z
  .string()
  .transform(toEnglishDigits)
  .pipe(z.string().regex(/^(\+98|0098|0)?9\d{9}$/, 'شمارهٔ موبایل معتبر نیست (مثال: 09123456789)'))
const email = z.string().trim().toLowerCase().pipe(z.email('ایمیل معتبر نیست'))
const name = (label) => z.string().trim().min(2, `${label} را وارد کنید`).max(60, 'حداکثر ۶۰ کاراکتر')

export const ICONS = [
  'Sparkles',
  'Flower2',
  'SprayCan',
  'Apple',
  'Pill',
  'Droplets',
  'Leaf',
  'HeartPulse',
  'Baby',
  'Stethoscope',
]
export const TONES = ['teal', 'coral', 'indigo', 'amber']
export const ORDER_STATUSES = ['processing', 'packed', 'shipped', 'delivered', 'canceled']

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'نام کاربری را وارد کنید'),
  password: z.string().min(1, 'گذرواژه را وارد کنید'),
})

export const registerSchema = z.object({
  firstName: name('نام'),
  lastName: name('نام خانوادگی'),
  username: z
    .string()
    .trim()
    .min(3, 'نام کاربری حداقل ۳ کاراکتر است')
    .max(30)
    .regex(/^[a-zA-Z0-9_.]+$/, 'فقط حروف انگلیسی، عدد، _ و . مجاز است'),
  email,
  phone,
  password: z
    .string()
    .min(8, 'گذرواژه حداقل ۸ کاراکتر است')
    .regex(/[A-Za-z]/, 'حداقل یک حرف انگلیسی لازم است')
    .regex(/\d/, 'حداقل یک عدد لازم است'),
})

export const profileSchema = z.object({ firstName: name('نام'), lastName: name('نام خانوادگی'), email, phone })

export const productSchema = z.object({
  title: z.string().trim().min(3, 'نام محصول را وارد کنید').max(120),
  brand: z.string().trim().min(2, 'برند را وارد کنید').max(60),
  category: z.string().trim().min(1, 'دسته‌بندی را انتخاب کنید'),
  basePrice: z.coerce.number('قیمت را وارد کنید').int().min(1000, 'قیمت حداقل ۱۰۰۰ تومان است').max(1_000_000_000),
  discount: z.coerce.number('عدد وارد کنید').int().min(0, 'حداقل ۰').max(90, 'حداکثر ۹۰٪'),
  stock: z.coerce.number('عدد وارد کنید').int('عدد صحیح وارد کنید').min(0, 'حداقل ۰').max(100000),
  thumbnail: z
    .string()
    .trim()
    .refine((value) => /^(https?:\/\/|\/)/.test(value), 'آدرس تصویر معتبر نیست'),
  description: z.string().trim().min(10, 'توضیحات حداقل ۱۰ کاراکتر باشد').max(2000),
})

export const stockSchema = z.object({
  stock: z.coerce.number('عدد وارد کنید').int('عدد صحیح وارد کنید').min(0, 'حداقل ۰').max(100000),
})

export const categorySchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'شناسه فقط شامل حروف کوچک انگلیسی، عدد و خط تیره باشد')
    .max(40),
  label: z.string().trim().min(2, 'نام دسته را وارد کنید').max(40),
  blurb: z.string().trim().max(80).default(''),
  tone: z.enum(TONES).default('teal'),
  icon: z.enum(ICONS).default('Sparkles'),
})

export const MAX_QTY = 99

export const orderSchema = z.object({
  items: z
    .array(
      z.object({ productId: z.coerce.number().int().positive(), qty: z.coerce.number().int().min(1).max(MAX_QTY) }),
    )
    .min(1, 'سبد خرید خالی است')
    .max(50),
  couponCode: z.string().trim().max(30).optional().nullable(),
  shippingMethodId: z.string().min(1, 'روش ارسال را انتخاب کنید'),
  payment: z.enum(['online', 'cod']),
  expectedTotal: z.coerce.number().int().optional(),
  shipping: z.object({
    fullName: z.string().trim().min(3, 'نام و نام خانوادگی گیرنده را وارد کنید').max(80),
    phone,
    province: z.string().trim().min(1, 'استان را انتخاب کنید'),
    city: z.string().trim().min(2, 'شهر را وارد کنید').max(60),
    address: z.string().trim().min(10, 'نشانی کامل‌تری وارد کنید').max(300),
    postalCode: z
      .string()
      .transform(toEnglishDigits)
      .pipe(z.string().regex(/^\d{10}$/, 'کد پستی باید ۱۰ رقم باشد')),
    note: z.string().trim().max(300, 'حداکثر ۳۰۰ کاراکتر').optional().default(''),
  }),
})

export const statusSchema = z.object({ status: z.enum(ORDER_STATUSES, 'وضعیت نامعتبر است') })

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'نام خود را وارد کنید').max(80),
  email,
  subject: z.string().trim().min(1, 'موضوع را انتخاب کنید').max(80),
  message: z.string().trim().min(10, 'پیام حداقل ۱۰ کاراکتر باشد').max(1000, 'حداکثر ۱۰۰۰ کاراکتر'),
})

export const reviewSchema = z.object({
  productId: z.coerce.number().int().positive(),
  rating: z.coerce
    .number('امتیاز را انتخاب کنید')
    .int()
    .min(1, 'امتیاز را انتخاب کنید')
    .max(5, 'امتیاز را انتخاب کنید'),
  comment: z.string().trim().min(5, 'نظر حداقل ۵ کاراکتر باشد').max(500, 'حداکثر ۵۰۰ کاراکتر'),
})

export const replySchema = z.object({
  reply: z.string().trim().min(2, 'پاسخ را بنویسید').max(1000, 'حداکثر ۱۰۰۰ کاراکتر'),
})

export const newsletterSchema = z.object({ email })

export const couponSchema = z.object({ code: z.string().trim().min(1, 'کد تخفیف را وارد کنید').max(30) })

export function parse(schema, data) {
  const result = schema.safeParse(data ?? {})
  if (result.success) return result.data
  const errors = {}
  for (const issue of result.error.issues) {
    const key = issue.path.join('.') || '_'
    if (!errors[key]) errors[key] = issue.message.startsWith('Invalid input') ? 'این فیلد الزامی است' : issue.message
  }
  const error = new Error(Object.values(errors)[0] ?? 'اطلاعات واردشده معتبر نیست')
  error.status = 422
  error.extra = { errors }
  throw error
}
