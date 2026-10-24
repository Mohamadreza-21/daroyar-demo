import { useCallback } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AtSign, Lock, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { registerSchema } from '../schemas'
import { useRegister } from '../hooks/useAuthActions'
import { useAuthStore } from '../store/authStore'
import { toEnglishDigits } from '../../../shared/utils/format'
import { applyServerErrors } from '../../../shared/api/client'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import AuthShell from '../components/AuthShell'
import { Input } from '../../../shared/components/common/Fields'
import Button from '../../../shared/components/common/Button'

import { CHECK_INPUT, CHECK_LABEL, FIELD_ERROR, FORM_GRID } from '../../../shared/components/common/styles'

export default function RegisterPage() {
  useDocumentTitle('ثبت‌نام')
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const location = useLocation()
  const registerMutation = useRegister()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirm: '',
      terms: false,
    },
  })

  const from = location.state?.from

  const onSubmit = useCallback(
    (values) =>
      registerMutation.mutate(
        { ...values, phone: toEnglishDigits(values.phone) },
        {
          onSuccess: () => {
            toast.success('ثبت‌نام با موفقیت انجام شد')
            navigate(from ?? '/account', { replace: true })
          },
          onError: (e) => {
            if (!applyServerErrors(e, setError))
              toast.error(
                e.status === 0 ? 'ارتباط با سرور برقرار نیست؛ دوباره تلاش کنید.' : e.message || 'ثبت‌نام انجام نشد',
              )
          },
        },
      ),
    [registerMutation, navigate, from, setError],
  )

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/account'} replace />

  return (
    <AuthShell
      title="ساخت حساب کاربری"
      subtitle="چند ثانیه وقت بگذارید و عضو دارویار شوید."
      footer={
        <>
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link to="/login" state={{ from }}>
            وارد شوید
          </Link>
        </>
      }
    >
      <form className="mt-1.5 grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={FORM_GRID}>
          <Input label="نام" autoComplete="given-name" error={errors.firstName?.message} {...register('firstName')} />
          <Input
            label="نام خانوادگی"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
          <Input
            label="نام کاربری"
            icon={AtSign}
            ltr
            autoComplete="username"
            error={errors.username?.message}
            {...register('username')}
          />
          <Input
            label="شمارهٔ موبایل"
            icon={Phone}
            ltr
            inputMode="tel"
            autoComplete="tel"
            error={errors.phone?.message}
            {...register('phone', { setValueAs: toEnglishDigits })}
          />
          <Input
            className="col-span-full"
            label="ایمیل"
            type="email"
            icon={Mail}
            ltr
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="گذرواژه"
            type="password"
            icon={Lock}
            autoComplete="new-password"
            hint="حداقل ۸ کاراکتر، شامل حرف و عدد"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="تکرار گذرواژه"
            type="password"
            icon={Lock}
            autoComplete="new-password"
            error={errors.confirm?.message}
            {...register('confirm')}
          />
        </div>
        <div>
          <label className={CHECK_LABEL}>
            <input className={CHECK_INPUT} type="checkbox" {...register('terms')} />
            <span>
              <a href={`${import.meta.env.BASE_URL}contact#terms`} target="_blank" rel="noreferrer">
                قوانین و مقررات
              </a>{' '}
              دارویار را می‌پذیرم.
            </span>
          </label>
          {errors.terms && <p className={FIELD_ERROR}>{errors.terms.message}</p>}
        </div>
        <Button type="submit" size="lg" block loading={registerMutation.isPending}>
          ثبت‌نام
        </Button>
      </form>
    </AuthShell>
  )
}
