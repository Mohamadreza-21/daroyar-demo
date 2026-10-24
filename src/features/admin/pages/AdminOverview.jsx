import { lazy, Suspense } from 'react'
import { Boxes, Package, ReceiptText, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router'
import { useStats } from '../hooks/useAdmin'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import { AdminOverviewSkeleton } from '../../../shared/components/loaders/AdminSkeletons'
import { ORDER_STATUS } from '../../../shared/utils/constants'
import { cn, formatNumber, formatToman } from '../../../shared/utils/format'
import { Badge } from '../../../shared/components/common/Primitives'
import {
  CARD,
  CARD_ROW,
  CARD_TITLE,
  LINK_MORE,
  OLIST,
  OLIST_LI,
  PANEL_TITLE,
  STACK,
  STAT,
  STAT_ICON,
  STAT_TONES,
  STATGRID,
  TWO,
} from '../../../shared/components/common/styles'

const CategoryChart = lazy(() => import('../components/StatsCharts').then((m) => ({ default: m.CategoryChart })))
const StockChart = lazy(() => import('../components/StatsCharts').then((m) => ({ default: m.StockChart })))
const ChartFallback = () => (
  <div
    className="h-[280px] w-full rounded-[12px] bg-[linear-gradient(90deg,var(--color-bg-2),var(--color-line),var(--color-bg-2))]"
    aria-hidden="true"
  />
)

export default function AdminOverview() {
  useDocumentTitle('داشبورد مدیریت')
  const { data, isPending, isError, error, refetch } = useStats()

  if (isPending) return <AdminOverviewSkeleton />
  if (isError) return <ErrorState error={error} onRetry={refetch} compact home={false} />

  const stats = [
    { icon: Package, label: 'تعداد محصولات', value: formatNumber(data.products), tone: 'teal' },
    { icon: Users, label: 'کاربران', value: formatNumber(data.users), tone: 'indigo' },
    { icon: ReceiptText, label: 'سفارش‌های ثبت‌شده', value: formatNumber(data.orders), tone: 'coral' },
    { icon: TrendingUp, label: 'مجموع فروش', value: formatToman(data.revenue), tone: 'amber' },
  ]

  return (
    <div className={STACK}>
      <h1 className={PANEL_TITLE}>داشبورد مدیریت</h1>
      <ul className={STATGRID}>
        {stats.map(({ icon: Icon, label, value, tone }) => (
          <li key={label} className={cn(STAT, STAT_TONES[tone])}>
            <span className={STAT_ICON}>
              <Icon size={22} aria-hidden="true" />
            </span>
            <div>
              <small className="block text-muted">{label}</small>
              <b className="text-[17px] leading-normal">{value}</b>
            </div>
          </li>
        ))}
      </ul>
      <div className={TWO}>
        <section className={CARD}>
          <h2 className={CARD_TITLE}>محصولات هر دسته</h2>
          {data.byCategory.length ? (
            <Suspense fallback={<ChartFallback />}>
              <CategoryChart data={data.byCategory.map((c) => ({ label: c.label, value: c.count }))} />
            </Suspense>
          ) : (
            <p className="text-muted">هنوز دسته‌ای ساخته نشده است.</p>
          )}
          <p className="mt-3.5 text-muted">
            <Boxes size={16} className="inline align-middle" aria-hidden="true" /> {formatNumber(data.lowStock)} محصول
            کم‌موجودی (کمتر از ۱۰ عدد) و {formatNumber(data.outOfStock)} محصول ناموجود است.
          </p>
        </section>
        <section className={CARD}>
          <h2 className={CARD_TITLE}>وضعیت موجودی</h2>
          <Suspense fallback={<ChartFallback />}>
            <StockChart
              available={Math.max(0, data.products - data.lowStock - data.outOfStock)}
              low={data.lowStock}
              out={data.outOfStock}
            />
          </Suspense>
        </section>
      </div>
      <div className={TWO}>
        <section className={CARD}>
          <div className={CARD_ROW}>
            <h2 className={cn(CARD_TITLE, 'mb-0')}>آخرین سفارش‌ها</h2>
            <Link to="/admin/orders" className={LINK_MORE}>
              همه
            </Link>
          </div>
          {data.recentOrders.length ? (
            <ul className={OLIST}>
              {data.recentOrders.map((o) => (
                <li key={o.id} className={OLIST_LI}>
                  <b dir="ltr">{o.id}</b>
                  <span>{o.customer}</span>
                  <span>{formatToman(o.totals.total)}</span>
                  <Badge tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">هنوز سفارشی ثبت نشده است.</p>
          )}
        </section>
      </div>
    </div>
  )
}
