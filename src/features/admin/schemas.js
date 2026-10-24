import { z } from 'zod'
import { CATEGORY_ICONS, CATEGORY_TONES } from '../../shared/utils/constants'

export const productSchema = z.object({
  title: z.string().trim().min(3, 'نام محصول را وارد کنید').max(120, 'حداکثر ۱۲۰ کاراکتر'),
  brand: z.string().trim().min(2, 'برند را وارد کنید').max(60, 'حداکثر ۶۰ کاراکتر'),
  category: z.string().min(1, 'دسته‌بندی را انتخاب کنید'),
  basePrice: z.coerce
    .number('قیمت را وارد کنید')
    .int('قیمت باید عدد صحیح باشد')
    .min(1000, 'قیمت حداقل ۱۰۰۰ تومان است')
    .max(1_000_000_000, 'قیمت بیش از حد مجاز است'),
  discount: z.coerce.number('عدد وارد کنید').int('عدد صحیح وارد کنید').min(0, 'حداقل ۰').max(90, 'حداکثر ۹۰٪'),
  stock: z.coerce.number('عدد وارد کنید').int('عدد صحیح وارد کنید').min(0, 'حداقل ۰').max(100000, 'حداکثر ۱۰۰٬۰۰۰'),
  thumbnail: z
    .string()
    .trim()
    .refine((value) => /^(https?:\/\/|\/)/.test(value), 'آدرس تصویر معتبر نیست (با https:// یا / شروع شود)'),
  description: z.string().trim().min(10, 'توضیحات حداقل ۱۰ کاراکتر باشد').max(2000, 'حداکثر ۲۰۰۰ کاراکتر'),
})

export const categorySchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'فقط حروف کوچک انگلیسی، عدد و خط تیره'),
  label: z.string().trim().min(2, 'نام دسته را وارد کنید').max(40, 'حداکثر ۴۰ کاراکتر'),
  blurb: z.string().trim().max(80, 'حداکثر ۸۰ کاراکتر'),
  tone: z.enum(CATEGORY_TONES.map((tone) => tone.value)),
  icon: z.enum(Object.keys(CATEGORY_ICONS)),
})

export const replySchema = z.object({
  reply: z.string().trim().min(2, 'پاسخ را بنویسید').max(1000, 'حداکثر ۱۰۰۰ کاراکتر'),
})
