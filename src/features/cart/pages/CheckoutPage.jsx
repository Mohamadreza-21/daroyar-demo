import { useCallback, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Banknote, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { checkoutSchema } from '../schemas'
import { applyServerErrors } from '../../../shared/api/client'
import { useAuthStore } from '../../auth/store/authStore'
import { useCartSummary } from '../hooks/useCart'
import { useCreateOrder } from '../../orders/hooks/useOrders'
import { keys } from '../../../shared/hooks/queryKeys'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import { Input, Select, Textarea } from '../../../shared/components/common/Fields'
import { Breadcrumb } from '../../../shared/components/common/Primitives'
import Button from '../../../shared/components/common/Button'
import {
  CARD,
  CARD_TITLE,
  CART_LAYOUT,
  CART_SIDE,
  DEMO_NOTE,
  FORM_GRID,
  PAGEHEAD,
} from '../../../shared/components/common/styles'
import OrderSummary from '../components/OrderSummary'
import CouponBox from '../components/CouponBox'
import CartLineStatus from '../components/CartLineStatus'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import { CheckoutSkeleton } from '../../../shared/components/loaders/PublicSkeletons'
import { PROVINCES } from '../../../shared/utils/constants'
import { cn, formatNumber, formatToman, toEnglishDigits } from '../../../shared/utils/format'
import { handleImgError } from '../../../shared/utils/image'

const PAYGRID = 'grid grid-cols-2 gap-3 max-[721px]:grid-cols-1'
const LEGEND = 'mb-3 p-0 text-[17px]'
const payopt = (active) =>
  cn(
    'relative flex cursor-pointer items-center gap-3 rounded-[18px] border-2 p-4 [transition:all_0.2s] focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-[color-mix(in_srgb,var(--color-primary)_40%,transparent)] [&_b]:block [&_small]:text-[12px]',
    active ? 'border-primary bg-primary-50 text-primary' : 'border-line text-muted [&_b]:text-ink',
  )
const PAYOPT_INPUT = 'absolute opacity-0'

export default function CheckoutPage() {
  useDocumentTitle('تسویه‌حساب')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const createOrder = useCreateOrder()

  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
      phone: user?.phone ?? '',
      province: '',
      city: '',
      address: '',
      postalCode: '',
      shippingMethodId: 'standard',
      payment: 'online',
      note: '',
    },
  })

  const payment = watch('payment')
  const shippingMethodId = watch('shippingMethodId')
  const cart = useCartSummary(shippingMethodId)
  const { lines, totals, shippingMethods } = cart

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['products', 'ids'] })
    queryClient.invalidateQueries({ queryKey: keys.shipping })
  }, [queryClient])

  useEffect(() => {
    const first = Object.keys(errors)[0]
    if (first) setFocus(first)
  }, [errors, setFocus])

  const blocked = lines.some((line) => !line.available)

  const onSubmit = useCallback(
    (values) => {
      if (createOrder.isPending || !cart.method) return
      if (blocked) {
        toast.error('ابتدا مشکل اقلام سبد را برطرف کنید')
        return
      }
      const { shippingMethodId: methodId, payment: pay, ...address } = values
      createOrder.mutate(
        {
          items: lines.map((line) => ({ productId: line.id, qty: line.qty })),
          couponCode: cart.coupon?.code ?? null,
          shippingMethodId: methodId,
          payment: pay,
          expectedTotal: totals.total,
          shipping: {
            ...address,
            phone: toEnglishDigits(address.phone),
            postalCode: toEnglishDigits(address.postalCode),
          },
        },
        {
          onSuccess: (order) => {
            toast.success('سفارش شما ثبت شد')
            navigate(`/order-success/${order.id}`, { replace: true })
          },
          onError: (error) => {
            if (applyServerErrors(error, setError)) return toast.error(error.message)
            if (error.code === 'CART_CHANGED')
              return toast.error('موجودی برخی کالاها تغییر کرده است؛ سبد خرید به‌روز شد.')
            if (error.code === 'PRICE_CHANGED')
              return toast.warning('قیمت یا هزینهٔ ارسال تغییر کرده است؛ مبلغ جدید را بررسی و دوباره ثبت کنید.')
            if (error.code === 'INVALID_COUPON') {
              return toast.error('کد تخفیف دیگر معتبر نیست؛ آن را حذف کنید.')
            }
            return toast.error(
              error.status === 0
                ? 'ارتباط با سرور برقرار نیست؛ دوباره تلاش کنید'
                : error.message || 'ثبت سفارش انجام نشد',
            )
          },
        },
      )
    },
    [createOrder, blocked, lines, cart.coupon, cart.method, totals.total, navigate, setError],
  )

  if (cart.isEmpty && !createOrder.isPending && !createOrder.isSuccess) return <Navigate to="/cart" replace />
  if (cart.isPending || (!cart.method && !cart.isError)) return <CheckoutSkeleton />
  if (cart.isError) return <ErrorState error={cart.error} onRetry={cart.refetch} />

  return (
    <div className="site-container animate-page-in">
      <Breadcrumb items={[{ label: 'خانه', to: '/' }, { label: 'سبد خرید', to: '/cart' }, { label: 'تسویه‌حساب' }]} />
      <header className={PAGEHEAD}>
        <h1>اطلاعات ارسال و پرداخت</h1>
      </header>
      <p className={DEMO_NOTE} role="note">
        این فروشگاه نمایشی است: پرداخت واقعی انجام نمی‌شود. لطفاً اطلاعات واقعی خود را وارد نکنید؛ سفارش در API آزمایشی
        ثبت می‌شود.
      </p>
      <form className={CART_LAYOUT} onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={createOrder.isPending}>
        <div className="grid gap-[18px]">
          <section className={CARD}>
            <h2 className={CARD_TITLE}>نشانی تحویل</h2>
            <div className={FORM_GRID}>
              <Input
                label="نام و نام خانوادگی گیرنده"
                autoComplete="name"
                error={errors.fullName?.message}
                {...register('fullName')}
              />
              <Input
                label="شمارهٔ موبایل"
                inputMode="tel"
                autoComplete="tel"
                ltr
                error={errors.phone?.message}
                {...register('phone', { setValueAs: toEnglishDigits })}
              />
              <Select label="استان" error={errors.province?.message} {...register('province')}>
                <option value="">انتخاب کنید…</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
              <Input label="شهر" error={errors.city?.message} {...register('city')} />
              <Textarea
                className="col-span-full"
                label="نشانی کامل"
                autoComplete="street-address"
                error={errors.address?.message}
                {...register('address')}
              />
              <Input
                label="کد پستی (۱۰ رقم)"
                inputMode="numeric"
                autoComplete="postal-code"
                ltr
                maxLength={10}
                error={errors.postalCode?.message}
                {...register('postalCode', { setValueAs: toEnglishDigits })}
              />
              <Input label="توضیحات (اختیاری)" error={errors.note?.message} {...register('note')} />
            </div>
          </section>

          <section className={CARD}>
            <fieldset className="min-w-0">
              <legend className={LEGEND}>روش ارسال</legend>
              <div className={PAYGRID}>
                {shippingMethods.map((method) => {
                  const free = method.freeFrom != null && totals.subtotal - totals.couponDiscount >= method.freeFrom
                  return (
                    <label key={method.id} className={payopt(shippingMethodId === method.id)}>
                      <input
                        className={PAYOPT_INPUT}
                        type="radio"
                        value={method.id}
                        {...register('shippingMethodId')}
                      />
                      <div>
                        <b>{method.label}</b>
                        <small>
                          {method.description} · {free ? 'رایگان' : formatToman(method.cost)}
                        </small>
                      </div>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </section>

          <section className={CARD}>
            <fieldset className="min-w-0">
              <legend className={LEGEND}>روش پرداخت</legend>
              <div className={PAYGRID}>
                <label className={payopt(payment === 'online')}>
                  <input className={PAYOPT_INPUT} type="radio" value="online" {...register('payment')} />
                  <CreditCard size={26} aria-hidden="true" />
                  <div>
                    <b>پرداخت آنلاین</b>
                    <small>درگاه امن بانکی (نمایشی)</small>
                  </div>
                </label>
                <label className={payopt(payment === 'cod')}>
                  <input className={PAYOPT_INPUT} type="radio" value="cod" {...register('payment')} />
                  <Banknote size={26} aria-hidden="true" />
                  <div>
                    <b>پرداخت در محل</b>
                    <small>هنگام تحویل بسته</small>
                  </div>
                </label>
              </div>
            </fieldset>
          </section>

          <section className={CARD}>
            <h2 className={CARD_TITLE}>مرور کالاها ({formatNumber(totals.count)})</h2>
            <ul className="grid gap-2.5">
              {lines.map((line) => (
                <li key={line.id} className="flex items-center gap-3">
                  {line.product && (
                    <img
                      className="size-[52px] rounded-[12px] bg-bg-2 object-contain"
                      onError={handleImgError}
                      src={line.product.thumbnail}
                      alt=""
                      loading="lazy"
                    />
                  )}
                  <span dir="auto" className="line-clamp-2 flex-1 text-[13.5px]">
                    {line.product?.title ?? `محصول ${line.id}`}
                  </span>
                  <b>× {formatNumber(line.qty)}</b>
                  <CartLineStatus line={line} />
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className={CART_SIDE}>
          <CouponBox />
          <OrderSummary totals={totals} shippingLabel={cart.method?.label}>
            <Button type="submit" size="lg" block loading={createOrder.isPending} disabled={blocked}>
              ثبت نهایی سفارش
            </Button>
          </OrderSummary>
        </div>
      </form>
    </div>
  )
}
