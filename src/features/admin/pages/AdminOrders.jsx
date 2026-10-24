import { useClampPage, useSearchInput, useUrlParams } from '../../../shared/hooks/useUrlState'
import BusyOverlay from '../../../shared/components/common/BusyOverlay'
import { memo, useCallback, useState } from 'react'
import { ReceiptText, Search } from 'lucide-react'
import { toast } from 'sonner'
import { useOrder, useOrders, useUpdateOrderStatus } from '../../orders/hooks/useOrders'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import { Badge, EmptyState, Pagination } from '../../../shared/components/common/Primitives'
import Button from '../../../shared/components/common/Button'
import Modal, { ConfirmDialog } from '../../../shared/components/common/Modal'
import {
  ADMIN_FILTERS,
  ADMIN_SEARCH,
  MINI_SELECT,
  PANEL_TITLE,
  ROW_ACTIONS,
  SEARCH_ICON,
  SEARCH_INPUT,
  STACK,
  TABLE,
  TABLE_WRAP,
  TD,
  TH,
  TR,
  chipClass,
} from '../../../shared/components/common/styles'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import OrderDetails from '../../orders/components/OrderDetails'
import { AdminTableSkeleton } from '../../../shared/components/loaders/AdminSkeletons'
import { ORDER_STATUS, ORDER_TRANSITIONS } from '../../../shared/utils/constants'
import { formatDate, formatNumber, formatToman } from '../../../shared/utils/format'

const PAGE_SIZE = 10
const STATUS_FILTERS = [
  { value: '', label: 'همه' },
  ...Object.entries(ORDER_STATUS).map(([value, { label }]) => ({ value, label })),
]

const Row = memo(function Row({ order, onStatus, onDetails }) {
  const change = useCallback((e) => onStatus(order, e.target.value), [onStatus, order])
  const options = ORDER_TRANSITIONS[order.status]
  return (
    <tr className={TR}>
      <td className={TD}>
        <b dir="ltr">{order.id}</b>
      </td>
      <td className={TD}>
        {order.customer}
        <small className="block text-muted">{order.shipping?.city}</small>
      </td>
      <td className={TD}>{formatDate(order.createdAt)}</td>
      <td className={TD}>{formatNumber(order.items.reduce((n, i) => n + i.qty, 0))}</td>
      <td className={TD}>
        <b>{formatToman(order.totals.total)}</b>
      </td>
      <td className={TD}>
        <Badge tone={ORDER_STATUS[order.status].tone}>{ORDER_STATUS[order.status].label}</Badge>
      </td>
      <td className={TD}>
        <div className={ROW_ACTIONS}>
          <select
            className={MINI_SELECT}
            value=""
            onChange={change}
            disabled={!options.length}
            aria-label={`تغییر وضعیت سفارش ${order.id}`}
          >
            <option value="">{options.length ? 'تغییر وضعیت…' : 'بدون تغییر'}</option>
            {options.map((key) => (
              <option key={key} value={key}>
                {ORDER_STATUS[key].label}
              </option>
            ))}
          </select>
          <Button size="sm" variant="soft" onClick={() => onDetails(order.id)}>
            جزئیات
          </Button>
        </div>
      </td>
    </tr>
  )
})

function DetailsModal({ id, onClose }) {
  const { data, isPending, isError, error, refetch } = useOrder(id)
  return (
    <Modal open={Boolean(id)} onClose={onClose} title="جزئیات سفارش" size="lg">
      {isPending && (
        <p className="text-muted" role="status">
          در حال دریافت…
        </p>
      )}
      {isError && <ErrorState error={error} onRetry={refetch} compact home={false} />}
      {data && (
        <>
          <OrderDetails order={data} />
          {data.user && (
            <p className="mt-4 text-muted">
              حساب کاربری: <b dir="ltr">@{data.user.username}</b> — {data.user.email}
            </p>
          )}
        </>
      )}
    </Modal>
  )
}

export default function AdminOrders() {
  useDocumentTitle('سفارش‌ها')
  const { params, update: setParam, reset, page, setPage } = useUrlParams()
  const qParam = params.get('q') ?? ''
  const status = ORDER_STATUS[params.get('status')] ? params.get('status') : ''
  const commitSearch = useCallback((value) => setParam({ q: value }, { replace: true }), [setParam])
  const search = useSearchInput(qParam, commitSearch)
  const [detailsId, setDetailsId] = useState(null)
  const [pending, setPending] = useState(null)
  const updateStatus = useUpdateOrderStatus()

  const { data, isPending, isError, error, refetch, isPlaceholderData, isFetching } = useOrders({
    q: qParam || undefined,
    status: status || undefined,
    _page: page,
    _limit: PAGE_SIZE,
  })

  const apply = useCallback(
    (order, next) =>
      updateStatus.mutate(
        { id: order.id, status: next },
        {
          onSuccess: () =>
            toast.success(next === 'canceled' ? 'سفارش لغو و موجودی بازگردانده شد' : 'وضعیت سفارش به‌روز شد'),
          onError: (e) => toast.error(e.message || 'تغییر وضعیت انجام نشد'),
          onSettled: () => setPending(null),
        },
      ),
    [updateStatus],
  )

  const onStatus = useCallback(
    (order, next) => {
      if (!next) return
      if (next === 'canceled') setPending({ order, status: next })
      else apply(order, next)
    },
    [apply],
  )

  const { totalPages, current } = useClampPage({
    page,
    total: data?.total ?? 0,
    pageSize: PAGE_SIZE,
    ready: !!data && !isPlaceholderData,
    setPage,
  })

  if (isPending) return <AdminTableSkeleton label="در حال دریافت سفارش‌ها…" />
  if (isError) return <ErrorState error={error} onRetry={refetch} compact home={false} />

  const filtered = Boolean(qParam || search.text || status)

  return (
    <div className={STACK}>
      <h1 className={PANEL_TITLE}>سفارش‌ها ({formatNumber(data.total)})</h1>
      <div className={ADMIN_FILTERS}>
        <label className={ADMIN_SEARCH}>
          <Search size={18} className={SEARCH_ICON} aria-hidden="true" />
          <input
            className={SEARCH_INPUT}
            type="search"
            value={search.text}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder="شماره سفارش، نام مشتری یا شهر…"
            aria-label="جستجو در سفارش‌ها"
          />
        </label>
        {filtered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              search.clear()
              reset()
            }}
          >
            پاک کردن فیلترها
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="فیلتر وضعیت سفارش">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={chipClass(status === f.value)}
            aria-pressed={status === f.value}
            onClick={() => setParam({ status: f.value })}
          >
            {f.label}
          </button>
        ))}
      </div>
      {data.items.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title={filtered ? 'سفارشی با این فیلتر پیدا نشد' : 'هنوز سفارشی ثبت نشده'}
          text={filtered ? undefined : 'با حساب مشتری یک سفارش ثبت کنید تا اینجا دیده شود.'}
        />
      ) : (
        <>
          <BusyOverlay busy={isPlaceholderData && isFetching} label="در حال دریافت سفارش‌ها…">
            <div className={TABLE_WRAP}>
              <table className={TABLE}>
                <caption className="sr-only">فهرست سفارش‌ها</caption>
                <thead>
                  <tr>
                    <th scope="col" className={TH}>
                      شمارهٔ سفارش
                    </th>
                    <th scope="col" className={TH}>
                      مشتری
                    </th>
                    <th scope="col" className={TH}>
                      تاریخ
                    </th>
                    <th scope="col" className={TH}>
                      تعداد
                    </th>
                    <th scope="col" className={TH}>
                      مبلغ
                    </th>
                    <th scope="col" className={TH}>
                      وضعیت
                    </th>
                    <th scope="col" className={TH}>
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((o) => (
                    <Row key={o.id} order={o} onStatus={onStatus} onDetails={setDetailsId} />
                  ))}
                </tbody>
              </table>
            </div>
          </BusyOverlay>
          <Pagination page={current} totalPages={totalPages} onChange={setPage} />
        </>
      )}
      <DetailsModal id={detailsId} onClose={() => setDetailsId(null)} />
      <ConfirmDialog
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        loading={updateStatus.isPending}
        title="لغو سفارش"
        text={`سفارش ${pending?.order.id ?? ''} لغو شود؟ این کار قابل بازگشت نیست و موجودی کالاها به انبار برمی‌گردد.`}
        confirmLabel="بله، لغو شود"
        onConfirm={() => apply(pending.order, pending.status)}
      />
    </div>
  )
}
