import { memo } from 'react'
import { cn, formatToman } from '../../../shared/utils/format'

const ROW = 'flex justify-between gap-3 text-[14px]'
const DT = 'text-muted'
const DD = 'm-0 font-bold'
const GREEN = 'text-success'

const Row = ({ label, value, green, total }) => (
  <div className={cn(ROW, total && 'border-t border-dashed border-line pt-3.5')}>
    <dt className={cn(DT, green && GREEN, total && 'font-extrabold text-ink')}>{label}</dt>
    <dd className={cn(DD, green && GREEN, total && 'text-[18px] text-primary-700')}>{value}</dd>
  </div>
)

const OrderSummary = memo(function OrderSummary({ totals, children, title = 'خلاصهٔ سفارش', shippingLabel }) {
  return (
    <aside className="rounded-lg border border-line bg-surface p-[22px] shadow-sm">
      <h2 className="mb-3.5 text-[17px]">{title}</h2>
      <dl className="m-0 mb-[18px] grid gap-3">
        <Row label="مبلغ کالاها" value={formatToman(totals.subtotal)} />
        {totals.savings > 0 && <Row green label="سود شما از تخفیف" value={formatToman(totals.savings)} />}
        {totals.couponDiscount > 0 && <Row green label="کد تخفیف" value={`- ${formatToman(totals.couponDiscount)}`} />}
        <Row
          label={`هزینهٔ ارسال${shippingLabel ? ` (${shippingLabel})` : ''}`}
          value={totals.shipping === 0 ? 'رایگان' : formatToman(totals.shipping)}
        />
        <Row total label="مبلغ قابل پرداخت" value={formatToman(totals.total)} />
      </dl>
      {children}
    </aside>
  )
})

export default OrderSummary
