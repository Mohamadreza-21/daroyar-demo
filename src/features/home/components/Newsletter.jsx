import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Mail } from 'lucide-react'
import { toast } from 'sonner'
import Button from '../../../shared/components/common/Button'
import { newsletterSchema } from '../schemas'
import { subscribeNewsletter } from '../../contact/api/contact'
import { cn } from '../../../shared/utils/format'

const Newsletter = memo(function Newsletter() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(newsletterSchema), defaultValues: { email: '' } })

  const mutation = useMutation({
    mutationFn: subscribeNewsletter,
    onSuccess: (data) => {
      toast.success(data.already ? 'این ایمیل قبلاً عضو شده است' : 'عضویت شما ثبت شد')
      reset()
    },
    onError: () => toast.error('ثبت عضویت انجام نشد؛ دوباره تلاش کنید'),
  })

  const onSubmit = useCallback((values) => mutation.mutate(values), [mutation])

  return (
    <section className="site-container pt-[clamp(40px,7vw,88px)] pb-0">
      <div className="grid grid-cols-2 items-center gap-6 rounded-xl border border-line bg-[linear-gradient(135deg,var(--color-accent-50),var(--color-primary-50))] p-[clamp(24px,4vw,44px)] max-[1025px]:grid-cols-1">
        <div>
          <h2 className="mb-2 text-[clamp(18px,2.4vw,26px)]">از تخفیف‌ها و مقالات تازه باخبر شوید</h2>
          <p className="text-muted">ایمیل شما در API آزمایشی ذخیره می‌شود؛ ایمیل واقعی ارسال نخواهد شد.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex gap-2.5 max-[561px]:flex-col">
            <div className="relative flex min-w-0 flex-1 items-center">
              <Mail size={18} className="absolute start-3.5 text-muted" />
              <input
                className={cn(
                  'h-[46px] w-full rounded-[14px] border-[1.5px] bg-white ps-11 pe-3.5 outline-none',
                  errors.email ? 'border-danger' : 'border-line focus:border-primary',
                )}
                type="email"
                dir="ltr"
                placeholder="email@example.com"
                aria-label="ایمیل"
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />
            </div>
            <Button type="submit" variant="accent" className="max-[561px]:w-full" loading={mutation.isPending}>
              عضویت
            </Button>
          </div>
          {errors.email && <p className="mt-1.5 text-[12.5px] font-semibold text-danger">{errors.email.message}</p>}
        </form>
      </div>
    </section>
  )
})

export default Newsletter
