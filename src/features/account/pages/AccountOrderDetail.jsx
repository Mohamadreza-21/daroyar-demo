import { useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import { useCancelOrder, useOrder } from '../../orders/hooks/useOrders'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import Button from '../../../shared/components/common/Button'
import { CARD, CARD_ROW, PANEL_TITLE, STACK } from '../../../shared/components/common/styles'
import { ConfirmDialog } from '../../../shared/components/common/Modal'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import OrderDetails from '../../orders/components/OrderDetails'
import { PanelOrdersSkeleton } from '../../../shared/components/loaders/PanelSkeletons'
import { CUSTOMER_CANCELABLE } from '../../../shared/utils/constants'

export default function AccountOrderDetail() {
  const { id } = useParams()
  useDocumentTitle('جزئیات سفارش')
  const { data: order, isPending, isError, error, refetch } = useOrder(id)
  const cancel = useCancelOrder()
  const [confirming, setConfirming] = useState(false)

  if (isPending) return <PanelOrdersSkeleton />
  if (isError)
    return <ErrorState error={error} onRetry={error.status === 404 ? undefined : refetch} compact home={false} />

  return (
    <div className={STACK}>
      <div className={CARD_ROW}>
        <h1 className={PANEL_TITLE}>جزئیات سفارش</h1>
        <Button to="/account/orders" variant="ghost" size="sm">
          بازگشت به سفارش‌ها
        </Button>
      </div>
      <section className={CARD}>
        <OrderDetails order={order} />
        {CUSTOMER_CANCELABLE.includes(order.status) && (
          <Button variant="outline" className="mt-5" onClick={() => setConfirming(true)}>
            لغو سفارش
          </Button>
        )}
      </section>
      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        loading={cancel.isPending}
        title="لغو سفارش"
        text="آیا از لغو این سفارش مطمئن هستید؟"
        confirmLabel="بله، لغو شود"
        onConfirm={() =>
          cancel.mutate(order.id, {
            onSuccess: () => {
              toast.success('سفارش لغو شد')
              setConfirming(false)
            },
            onError: (e) => {
              toast.error(e.message || 'لغو سفارش انجام نشد')
              setConfirming(false)
            },
          })
        }
      />
    </div>
  )
}
