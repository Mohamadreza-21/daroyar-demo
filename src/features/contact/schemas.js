import { z } from 'zod'
import { email } from '../../shared/schemas/fields'

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'نام خود را وارد کنید').max(80, 'حداکثر ۸۰ کاراکتر'),
  email,
  subject: z.string().min(1, 'موضوع را انتخاب کنید').max(80),
  message: z.string().trim().min(10, 'پیام حداقل ۱۰ کاراکتر باشد').max(1000, 'حداکثر ۱۰۰۰ کاراکتر'),
})
