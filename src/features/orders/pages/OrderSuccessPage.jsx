import { useParams } from 'react-router'
import { motion } from 'framer-motion'
import { CircleCheck } from 'lucide-react'
import { useOrder } from '../hooks/useOrders'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import Button from '../../../shared/components/common/Button'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import { PanelOverviewSkeleton } from '../../../shared/components/loaders/PanelSkeletons'
import { formatToman } from '../../../shared/utils/format'

export default function OrderSuccessPage() {
  useDocumentTitle('سفارش ثبت شد')
  const { id } = useParams()
  const { data: order, isPending, isError, error, refetch } = useOrder(id)
  if (isPending)
    return (
      <div className="site-container">
        <PanelOverviewSkeleton />
      </div>
    )
  if (isError) return <ErrorState error={error} onRetry={error.status === 404 ? undefined : refetch} />
  return (
    <div className="site-container animate-page-in">
      <div className="mx-auto my-12 grid max-w-[520px] justify-items-center gap-2.5 rounded-xl border border-line bg-surface px-6 py-10 text-center shadow-md">
        <motion.span
          className="grid size-[110px] place-items-center rounded-full bg-success-50 text-success"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12 }}
        >
          <CircleCheck size={64} aria-hidden="true" />
        </motion.span>
        <h1>سفارش شما با موفقیت ثبت شد</h1>
        <p>
          شمارهٔ سفارش: <b dir="ltr">{order.id}</b>
        </p>
        <p>
          مبلغ سفارش: <b>{formatToman(order.totals.total)}</b>
        </p>
        <p className="text-muted">وضعیت سفارش را از پنل کاربری می‌توانید پیگیری کنید.</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2.5">
          <Button to={`/account/orders/${order.id}`}>مشاهدهٔ جزئیات سفارش</Button>
          <Button to="/shop" variant="outline">
            ادامهٔ خرید
          </Button>
        </div>
      </div>
    </div>
  )
}
