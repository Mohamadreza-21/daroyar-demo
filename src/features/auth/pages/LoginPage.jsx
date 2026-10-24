import { useCallback } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, TriangleAlert, User } from 'lucide-react'
import { toast } from 'sonner'
import { loginSchema } from '../schemas'
import { useLogin } from '../hooks/useAuthActions'
import { useAuthStore } from '../store/authStore'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import AuthShell from '../components/AuthShell'
import { Input } from '../../../shared/components/common/Fields'
import Button from '../../../shared/components/common/Button'

import { DEMO_NOTE, FIELD_ERROR, chipClass } from '../../../shared/components/common/styles'

const DEMOS = [
  { label: 'مشتری نمونه', username: 'customer', password: 'customer123' },
  { label: 'مدیر سایت', username: 'admin', password: 'admin1234' },
]

export default function LoginPage() {
  useDocumentTitle('ورود')
  const user = useAuthStore((s) => s.user)
  const expired = useAuthStore((s) => s.sessionExpired)
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { username: '', password: '' } })

  const from = location.state?.from

  const onSubmit = useCallback(
    (values) =>
      login.mutate(values, {
        onSuccess: ({ user: u }) => {
          toast.success(`خوش آمدید ${u.firstName}`)
          navigate(from ?? (u.role === 'admin' ? '/admin' : '/account'), { replace: true })
        },
        onError: (e) => {
          if (e.status === 0) toast.error('ارتباط با سرور برقرار نیست؛ اتصال را بررسی کنید.')
        },
      }),
    [login, navigate, from],
  )

  const fill = useCallback(
    (d) => {
      setValue('username', d.username, { shouldValidate: true })
      setValue('password', d.password, { shouldValidate: true })
    },
    [setValue],
  )

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/account'} replace />

  return (
    <AuthShell
      title="ورود به حساب کاربری"
      subtitle="نام کاربری و گذرواژهٔ خود را وارد کنید."
      footer={
        <>
          حساب ندارید؟{' '}
          <Link to="/register" state={{ from }}>
            ثبت‌نام کنید
          </Link>
        </>
      }
    >
      {expired && (
        <p className={DEMO_NOTE} role="status">
          نشست قبلی شما منقضی شده است؛ دوباره وارد شوید.
        </p>
      )}
      <form className="mt-1.5 grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {login.isError && login.error.status !== 0 && (
          <p className={`${FIELD_ERROR} flex items-center gap-1.5`} role="alert">
            <TriangleAlert size={16} aria-hidden="true" /> {login.error.message}
          </p>
        )}
        <Input
          label="نام کاربری یا ایمیل"
          icon={User}
          ltr
          autoComplete="username"
          error={errors.username?.message}
          {...register('username')}
        />
        <Input
          label="گذرواژه"
          type="password"
          icon={Lock}
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" size="lg" block loading={login.isPending}>
          ورود
        </Button>
      </form>
      <div className="grid gap-2 rounded-2xl bg-bg px-4 py-3.5 text-[13px]">
        <p>ورود سریع با حساب نمونه:</p>
        <div className="flex flex-wrap gap-2">
          {DEMOS.map((d) => (
            <button
              key={d.username}
              type="button"
              className={chipClass(false, 'min-h-[34px] px-3.5 text-[13px]')}
              onClick={() => fill(d)}
            >
              {d.label}
            </button>
          ))}
        </div>
        <small className="text-muted">ورود با حساب‌های نمونه یا حساب‌هایی که ثبت‌نام کرده‌اید انجام می‌شود.</small>
      </div>
    </AuthShell>
  )
}
