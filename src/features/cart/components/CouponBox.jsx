import { memo, useCallback, useState } from 'react'
import { BadgePercent, X } from 'lucide-react'
import { toast } from 'sonner'
import Button, { ICON_BTN } from '../../../shared/components/common/Button'
import { useApplyCoupon } from '../../orders/hooks/useOrders'
import { useCart, useCartStore } from '../store/cartStore'

const CouponBox = memo(function CouponBox() {
  const { coupon } = useCart()
  const setCoupon = useCartStore((s) => s.setCoupon)
  const removeCoupon = useCartStore((s) => s.removeCoupon)
  const apply = useApplyCoupon()
  const [code, setCode] = useState('')

  const onApply = useCallback(
    (e) => {
      e?.preventDefault()
      if (!code.trim() || apply.isPending) return
      apply.mutate(code, {
        onSuccess: (result) => {
          setCoupon(result)
          toast.success('کد تخفیف اعمال شد')
          setCode('')
        },
        onError: (error) =>
          toast.error(error.status === 404 ? 'کد تخفیف معتبر نیست' : 'بررسی کد تخفیف انجام نشد؛ دوباره تلاش کنید'),
      })
    },
    [code, apply, setCoupon],
  )

  if (coupon)
    return (
      <div className="flex items-center gap-2.5 rounded-[18px] border-[1.5px] border-success bg-success-50 py-2.5 pr-2.5 pl-3 text-[#0f7a53]">
        <BadgePercent size={20} aria-hidden="true" />
        <div className="flex-1">
          <b dir="ltr">{coupon.code}</b>
          <small className="block">{coupon.label}</small>
        </div>
        <button type="button" className={ICON_BTN} onClick={removeCoupon} aria-label="حذف کد تخفیف">
          <X size={18} />
        </button>
      </div>
    )

  return (
    <div
      className="flex items-center gap-2.5 rounded-[18px] border-[1.5px] border-dashed border-primary-100 bg-surface py-2.5 pr-2.5 pl-3"
      role="group"
      aria-label="اعمال کد تخفیف"
    >
      <input
        className="h-10 min-w-0 flex-1 border-0 bg-transparent px-3 font-bold outline-none"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onApply(e)}
        placeholder="کد تخفیف (مثلاً DAROO10)"
        dir="ltr"
        aria-label="کد تخفیف"
      />
      <Button variant="soft" size="sm" loading={apply.isPending} onClick={onApply}>
        اعمال
      </Button>
    </div>
  )
})

export default CouponBox
