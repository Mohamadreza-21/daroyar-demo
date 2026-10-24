import { useCallback } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, ShieldCheck, TriangleAlert, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { loginSchema } from '../schemas'
import { useLogin } from '../hooks/useAuthActions'
import { useAuthStore } from '../store/authStore'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import AuthShell from '../components/AuthShell'
import { Input } from '../../../shared/components/common/Fields'
import Button from '../../../shared/components/common/Button'

import { DEMO_NOTE, FIELD_ERROR } from '../../../shared/components/common/styles'

const DEMOS = [
  {
    label: 'مشتری نمونه',
    description: 'مشاهدهٔ سفارش‌ها و حساب کاربری',
    username: 'customer',
    password: 'customer123',
    icon: UserRound,
  },
  {
    label: 'مدیر نمونه',
    description: 'ورود به پنل مدیریت فروشگاه',
    username: 'admin',
    password: 'admin1234',
    icon: ShieldCheck,
  },
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
          icon={UserRound}
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
      <section className="grid gap-3 rounded-2xl border border-line bg-bg p-3.5 text-[13px]" aria-label="حساب‌های نمایشی">
        <div>
          <h2 className="font-extrabold">حساب‌های آمادهٔ آزمایش</h2>
          <p className="mt-1 text-muted">برای پرشدن خودکار فرم، یکی از حساب‌ها را انتخاب کنید.</p>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {DEMOS.map((d) => {
            const Icon = d.icon
            return (
              <button
                key={d.username}
                type="button"
                className="grid gap-2 rounded-xl border border-line bg-surface p-3.5 text-start [transition:border-color_0.2s,box-shadow_0.2s] hover:border-primary hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => fill(d)}
                aria-label={`پرکردن اطلاعات ${d.label}`}
              >
                <span className="flex items-center gap-2 font-extrabold text-ink">
                  <span className="grid size-9 place-items-center rounded-xl bg-primary-50 text-primary-700">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  {d.label}
                </span>
                <span className="text-[12px] text-muted">{d.description}</span>
                <span className="grid gap-1 border-t border-dashed border-line pt-2">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-muted">نام کاربری</span>
                    <b dir="ltr" className="font-mono text-ink">{d.username}</b>
                  </span>
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-muted">گذرواژه</span>
                    <b dir="ltr" className="font-mono text-ink">{d.password}</b>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
        <small className="text-muted">این حساب‌ها فقط برای آزمایش نمونه‌کار هستند؛ خرید و اطلاعات کاربران واقعی نیست.</small>
      </section>
    </AuthShell>
  )
}
