import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { profileSchema } from '../../auth/schemas'
import { useAuthStore } from '../../auth/store/authStore'
import { useUpdateProfile } from '../../auth/hooks/useAuthActions'
import { applyServerErrors } from '../../../shared/api/client'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import { Input } from '../../../shared/components/common/Fields'
import Button from '../../../shared/components/common/Button'
import { CARD, FORM_GRID, PANEL_TITLE, STACK } from '../../../shared/components/common/styles'
import { toEnglishDigits } from '../../../shared/utils/format'

export default function AccountProfile() {
  useDocumentTitle('اطلاعات حساب')
  const user = useAuthStore((s) => s.user)
  const update = useUpdateProfile()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone ?? '' },
  })

  const onSubmit = useCallback(
    (values) => {
      if (update.isPending) return
      update.mutate(values, {
        onSuccess: (saved) => {
          reset({ firstName: saved.firstName, lastName: saved.lastName, email: saved.email, phone: saved.phone })
          toast.success('اطلاعات حساب ذخیره شد')
        },
        onError: (error) => {
          if (!applyServerErrors(error, setError)) toast.error(error.message || 'ذخیرهٔ اطلاعات انجام نشد')
        },
      })
    },
    [update, reset, setError],
  )

  return (
    <div className={STACK}>
      <h1 className={PANEL_TITLE}>اطلاعات حساب</h1>
      <form className={CARD} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={FORM_GRID}>
          <Input label="نام" error={errors.firstName?.message} {...register('firstName')} />
          <Input label="نام خانوادگی" error={errors.lastName?.message} {...register('lastName')} />
          <Input label="ایمیل" type="email" icon={Mail} ltr error={errors.email?.message} {...register('email')} />
          <Input
            label="شمارهٔ موبایل"
            icon={Phone}
            ltr
            error={errors.phone?.message}
            {...register('phone', { setValueAs: toEnglishDigits })}
          />
          <Input
            label="نام کاربری"
            ltr
            value={user.username}
            disabled
            readOnly
            hint="نام کاربری قابل تغییر نیست"
            onChange={() => {}}
          />
        </div>
        <Button type="submit" size="lg" loading={update.isPending} disabled={!isDirty} className="mt-5">
          ذخیرهٔ تغییرات
        </Button>
      </form>
    </div>
  )
}
