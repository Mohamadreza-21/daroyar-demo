import { Apple, Baby, Droplets, Flower2, HeartPulse, Leaf, Pill, SprayCan, Sparkles, Stethoscope } from 'lucide-react'

export const BRAND = {
  name: 'دارویار',
  tagline: 'فروشگاه نمایشی محصولات بهداشتی و مراقبتی',
  phone: 'شمارهٔ نمایشی',
  phoneRaw: '00000000000',
  email: 'demo@example.com',
  address: 'نشانی ساختگی برای نمایش رابط کاربری',
  hours: 'خدمت واقعی ارائه نمی‌شود',
}

export const NAV_LINKS = [
  { to: '/', label: 'خانه', end: true },
  { to: '/shop', label: 'فروشگاه' },
  { to: '/articles', label: 'مقالات سلامت' },
  { to: '/contact', label: 'تماس با ما' },
]

export const CATEGORY_ICONS = {
  Sparkles,
  Flower2,
  SprayCan,
  Apple,
  Pill,
  Droplets,
  Leaf,
  HeartPulse,
  Baby,
  Stethoscope,
}
export const CATEGORY_TONES = [
  { value: 'teal', label: 'سبزآبی' },
  { value: 'coral', label: 'مرجانی' },
  { value: 'indigo', label: 'نیلی' },
  { value: 'amber', label: 'کهربایی' },
]

export const ORDER_STATUS = {
  processing: { label: 'در حال پردازش', tone: 'warn' },
  packed: { label: 'آماده ارسال', tone: 'info' },
  shipped: { label: 'ارسال شده', tone: 'info' },
  delivered: { label: 'تحویل شد', tone: 'success' },
  canceled: { label: 'لغو شد', tone: 'danger' },
}

export const ORDER_TRANSITIONS = {
  processing: ['packed', 'canceled'],
  packed: ['shipped', 'canceled'],
  shipped: ['delivered'],
  delivered: [],
  canceled: [],
}
export const CUSTOMER_CANCELABLE = ['processing']

export const MESSAGE_STATUS = {
  pending: { label: 'در انتظار پاسخ', tone: 'warn' },
  answered: { label: 'پاسخ داده شد', tone: 'success' },
}

export const PAYMENT_METHODS = { online: 'پرداخت آنلاین', cod: 'پرداخت در محل' }

export const PROVINCES = [
  'آذربایجان شرقی',
  'آذربایجان غربی',
  'اردبیل',
  'اصفهان',
  'البرز',
  'ایلام',
  'بوشهر',
  'تهران',
  'چهارمحال و بختیاری',
  'خراسان جنوبی',
  'خراسان رضوی',
  'خراسان شمالی',
  'خوزستان',
  'زنجان',
  'سمنان',
  'سیستان و بلوچستان',
  'فارس',
  'قزوین',
  'قم',
  'کردستان',
  'کرمان',
  'کرمانشاه',
  'کهگیلویه و بویراحمد',
  'گلستان',
  'گیلان',
  'لرستان',
  'مازندران',
  'مرکزی',
  'هرمزگان',
  'همدان',
  'یزد',
]

export const SORT_OPTIONS = [
  { value: 'popular', label: 'محبوب‌ترین' },
  { value: 'newest', label: 'جدیدترین' },
  { value: 'discount', label: 'بیشترین تخفیف' },
  { value: 'cheap', label: 'ارزان‌ترین' },
  { value: 'expensive', label: 'گران‌ترین' },
]

export const LOW_STOCK = 10
