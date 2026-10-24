import { useClampPage, useUrlParams } from '../../../shared/hooks/useUrlState'
import BusyOverlay from '../../../shared/components/common/BusyOverlay'
import { memo, useCallback, useState } from 'react'
import { Link } from 'react-router'
import { Package } from 'lucide-react'
import { toast } from 'sonner'
import { useCancelOrder, useOrders } from '../../orders/hooks/useOrders'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import { Badge, EmptyState, Pagination } from '../../../shared/components/common/Primitives'
import Button from '../../../shared/components/common/Button'
import { CARD, PANEL_TITLE, STACK } from '../../../shared/components/common/styles'
import { ConfirmDialog } from '../../../shared/components/common/Modal'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import { PanelOrdersSkeleton } from '../../../shared/components/loaders/PanelSkeletons'
import { CUSTOMER_CANCELABLE, ORDER_STATUS, PAYMENT_METHODS } from '../../../shared/utils/constants'
import { formatDate, formatNumber, formatToman } from '../../../shared/utils/format'
import { handleImgError } from '../../../shared/utils/image'

const PAGE_SIZE = 5
const OCARD_BAR = 'flex flex-wrap items-center justify-between gap-3'

export const OrderCard = memo(function OrderCard({ order, onCancel }) {
  const status = ORDER_STATUS[order.status]
  const handleCancel = useCallback(() => onCancel?.(order.id), [onCancel, order.id])
  return (
    <li className={CARD}>
      <header className={OCARD_BAR}>
        <div>
          <b dir="ltr">{order.id}</b>
          <small className="block text-muted">{formatDate(order.createdAt)}</small>
        </div>
        <Badge tone={status.tone}>{status.label}</Badge>
      </header>
      <ul className="my-4 grid gap-2.5 border-y border-dashed border-line py-3.5">
        {order.items.map((i) => (
          <li key={i.productId} className="flex items-center gap-3">
            <Link to={`/product/${i.productId}`} aria-label={i.title}>
              <img
                className="size-[52px] rounded-[12px] bg-bg-2 object-contain"
                onError={handleImgError}
                src={i.thumbnail}
                alt=""
                loading="lazy"
              />
            </Link>
            <span dir="auto" className="line-clamp-2 flex-1 text-[14px]">
              {i.title}
            </span>
            <small>× {formatNumber(i.qty)}</small>
          </li>
        ))}
      </ul>
      <footer className={OCARD_BAR}>
        <p className="text-[14px] text-muted [&_b]:text-ink">
          پرداخت: <b>{PAYMENT_METHODS[order.payment]}</b> · مبلغ: <b>{formatToman(order.totals.total)}</b>
        </p>
        <div className="flex gap-2">
          <Button to={`/account/orders/${order.id}`} variant="soft" size="sm">
            جزئیات سفارش
          </Button>
          {onCancel && CUSTOMER_CANCELABLE.includes(order.status) && (
            <Button variant="outline" size="sm" onClick={handleCancel}>
              لغو سفارش
            </Button>
          )}
        </div>
      </footer>
    </li>
  )
})

export default function AccountOrders() {
  useDocumentTitle('سفارش‌های من')
  const { page, setPage } = useUrlParams()
  const { data, isPending, isError, error, refetch, isPlaceholderData, isFetching } = useOrders({
    _page: page,
    _limit: PAGE_SIZE,
  })
  const cancel = useCancelOrder()
  const [cancelId, setCancelId] = useState(null)

  const askCancel = useCallback((id) => setCancelId(id), [])
  const close = useCallback(() => setCancelId(null), [])
  const confirm = useCallback(() => {
    cancel.mutate(cancelId, {
      onSuccess: () => {
        toast.success('سفارش لغو شد و موجودی کالاها بازگردانده شد')
        setCancelId(null)
      },
      onError: (e) => {
        toast.error(e.message || 'لغو سفارش انجام نشد')
        setCancelId(null)
      },
    })
  }, [cancelId, cancel])

  const { totalPages, current } = useClampPage({
    page,
    total: data?.total ?? 0,
    pageSize: PAGE_SIZE,
    ready: !!data && !isPlaceholderData,
    setPage,
  })

  if (isPending) return <PanelOrdersSkeleton />
  if (isError) return <ErrorState error={error} onRetry={refetch} compact home={false} />

  const orders = data.items

  return (
    <div className={STACK}>
      <h1 className={PANEL_TITLE}>سفارش‌های من</h1>
      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="هنوز سفارشی ندارید"
          text="بعد از ثبت اولین سفارش، وضعیت آن را اینجا می‌بینید."
        >
          <Button to="/shop">رفتن به فروشگاه</Button>
        </EmptyState>
      ) : (
        <>
          <BusyOverlay busy={isPlaceholderData && isFetching} label="در حال دریافت سفارش‌ها…">
            <ul className={STACK}>
              {orders.map((o) => (
                <OrderCard key={o.id} order={o} onCancel={askCancel} />
              ))}
            </ul>
          </BusyOverlay>
          <Pagination page={current} totalPages={totalPages} onChange={setPage} />
        </>
      )}
      <ConfirmDialog
        open={Boolean(cancelId)}
        onClose={close}
        onConfirm={confirm}
        loading={cancel.isPending}
        title="لغو سفارش"
        text="آیا از لغو این سفارش مطمئن هستید؟ موجودی کالاها به انبار برمی‌گردد."
        confirmLabel="بله، لغو شود"
      />
    </div>
  )
}
