import { z } from 'zod'

export const reviewSchema = z.object({
  rating: z.number({ error: 'امتیاز را انتخاب کنید' }).int().min(1, 'امتیاز را انتخاب کنید').max(5),
  comment: z.string().trim().min(5, 'نظر حداقل ۵ کاراکتر باشد').max(500, 'حداکثر ۵۰۰ کاراکتر'),
})
