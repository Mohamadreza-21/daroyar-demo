import { memo } from 'react'
import { formatNumber } from '../../../shared/utils/format'

const CartLineStatus = memo(function CartLineStatus({ line }) {
  if (line.pending)
    return (
      <small className="text-muted [font-size:smaller]" role="status">
        در حال بررسی موجودی…
      </small>
    )
  if (line.unknown)
    return (
      <small className="text-[12.5px] font-semibold text-danger" role="alert">
        اطلاعات این محصول دریافت نشد؛ اتصال را بررسی و دوباره تلاش کنید.
      </small>
    )
  if (!line.product)
    return (
      <small className="text-[12.5px] font-semibold text-danger" role="alert">
        این محصول دیگر در فروشگاه نیست؛ آن را از سبد حذف کنید.
      </small>
    )
  if (!line.available)
    return (
      <small className="text-[12.5px] font-semibold text-danger" role="alert">
        ناموجود شد؛ در جمع سبد حساب نمی‌شود.
      </small>
    )
  if (line.limited)
    return (
      <small className="text-[12.5px] font-semibold text-danger" role="status">
        تعداد به موجودی انبار ({formatNumber(line.stock)} عدد) محدود شد.
      </small>
    )
  return null
})

export default CartLineStatus
