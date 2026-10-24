import { Link } from 'react-router'
import { Heart, Package, ShoppingBag, Wallet } from 'lucide-react'
import { useAuthStore } from '../../auth/store/authStore'
import { useOrders } from '../../orders/hooks/useOrders'
import { useWishlistIds } from '../../wishlist/hooks/useWishlist'
import { useCartBadge } from '../../cart/hooks/useCart'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import { PanelOverviewSkeleton } from '../../../shared/components/loaders/PanelSkeletons'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import { Badge } from '../../../shared/components/common/Primitives'
import Button from '../../../shared/components/common/Button'
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
  WELCOME,
} from '../../../shared/components/common/styles'
import { cn } from '../../../shared/utils/format'
import { ORDER_STATUS } from '../../../shared/utils/constants'
import { formatDate, formatNumber, formatToman } from '../../../shared/utils/format'

export default function AccountOverview() {
  useDocumentTitle('پنل کاربری')
  const user = useAuthStore((s) => s.user)
  const { data, isPending, isError, error, refetch } = useOrders({ _page: 1, _limit: 100 })
  const wishCount = useWishlistIds().length
  const cartCount = useCartBadge()
  if (isPending) return <PanelOverviewSkeleton />
  if (isError) return <ErrorState error={error} onRetry={refetch} compact home={false} />
  const orders = data.items
  const spent = orders.filter((o) => o.status !== 'canceled').reduce((n, o) => n + o.totals.total, 0)

  const stats = [
    { icon: Package, label: 'سفارش‌ها', value: formatNumber(orders.length), tone: 'teal' },
    { icon: Wallet, label: 'مجموع خرید', value: formatToman(spent), tone: 'coral' },
    { icon: Heart, label: 'علاقه‌مندی‌ها', value: formatNumber(wishCount), tone: 'indigo' },
    { icon: ShoppingBag, label: 'در سبد خرید', value: formatNumber(cartCount), tone: 'amber' },
  ]

  return (
    <div className={STACK}>
      <div className={WELCOME}>
        <div>
          <h1 className={cn(PANEL_TITLE, 'mb-1')}>سلام {user.firstName} 👋</h1>
          <p className="max-w-[520px] opacity-90">
            به پنل کاربری دارویار خوش آمدید. از اینجا سفارش‌ها و اطلاعات حسابتان را مدیریت کنید.
          </p>
        </div>
        <Button to="/shop" variant="white">
          ادامهٔ خرید
        </Button>
      </div>
      <ul className={STATGRID}>
        {stats.map(({ icon: Icon, label, value, tone }) => (
          <li key={label} className={cn(STAT, STAT_TONES[tone])}>
            <span className={STAT_ICON}>
              <Icon size={22} />
            </span>
            <div>
              <small className="block text-muted">{label}</small>
              <b className="text-[17px] leading-normal">{value}</b>
            </div>
          </li>
        ))}
      </ul>
      <section className={CARD}>
        <div className={CARD_ROW}>
          <h2 className={cn(CARD_TITLE, 'mb-0')}>آخرین سفارش‌ها</h2>
          <Link to="/account/orders" className={LINK_MORE}>
            همه
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-muted">هنوز سفارشی ثبت نکرده‌اید.</p>
        ) : (
          <ul className={OLIST}>
            {orders.slice(0, 3).map((o) => (
              <li key={o.id} className={OLIST_LI}>
                <Link to={`/account/orders/${o.id}`} dir="ltr">
                  <b>{o.id}</b>
                </Link>
                <span>{formatDate(o.createdAt)}</span>
                <span>{formatToman(o.totals.total)}</span>
                <Badge tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
