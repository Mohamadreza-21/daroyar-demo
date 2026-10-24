import { z } from 'zod'
import { phone } from '../../shared/schemas/fields'
import { toEnglishDigits } from '../../shared/utils/format'

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(3, 'نام و نام خانوادگی گیرنده را وارد کنید').max(80, 'حداکثر ۸۰ کاراکتر'),
  phone,
  province: z.string().min(1, 'استان را انتخاب کنید'),
  city: z.string().trim().min(2, 'شهر را وارد کنید').max(60, 'حداکثر ۶۰ کاراکتر'),
  address: z.string().trim().min(10, 'نشانی کامل‌تری وارد کنید').max(300, 'حداکثر ۳۰۰ کاراکتر'),
  postalCode: z
    .string()
    .transform((value) => toEnglishDigits(value.trim()))
    .pipe(z.string().regex(/^\d{10}$/, 'کد پستی باید ۱۰ رقم باشد')),
  shippingMethodId: z.string().min(1, 'روش ارسال را انتخاب کنید'),
  payment: z.enum(['online', 'cod']),
  note: z.string().trim().max(300, 'حداکثر ۳۰۰ کاراکتر').optional(),
})
