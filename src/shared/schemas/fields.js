import { z } from 'zod'
import { toEnglishDigits } from '../utils/format'

export const phone = z
  .string()
  .transform((value) => toEnglishDigits(value.trim()))
  .pipe(z.string().regex(/^(\+98|0098|0)?9\d{9}$/, 'شمارهٔ موبایل معتبر نیست (مثال: 09123456789)'))

export const email = z.string().trim().toLowerCase().pipe(z.email('ایمیل معتبر نیست'))
export const name = (label) => z.string().trim().min(2, `${label} را وارد کنید`).max(60, 'حداکثر ۶۰ کاراکتر')
