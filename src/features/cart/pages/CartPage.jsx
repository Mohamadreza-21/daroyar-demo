import { memo, useCallback } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '../store/cartStore'
import { useCartSummary } from '../hooks/useCart'
import { useCategoryLabel } from '../../catalog/hooks/useCatalog'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import { Breadcrumb, EmptyState, Price, QuantityControl } from '../../../shared/components/common/Primitives'
import Button, { ICON_BTN } from '../../../shared/components/common/Button'
import { CART_LAYOUT, CART_SIDE, PAGEHEAD, FIELD_ERROR } from '../../../shared/components/common/styles'
import { cn } from '../../../shared/utils/format'
import OrderSummary from '../components/OrderSummary'
import CouponBox from '../components/CouponBox'
import CartLineStatus from '../components/CartLineStatus'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import { CartSkeleton } from '../../../shared/components/loaders/PublicSkeletons'
import { handleImgError } from '../../../shared/utils/image'

const Row = memo(function Row({ line, onQty, onRemove }) {
  const { product } = line
  const label = useCategoryLabel(product?.category)
  const handleQty = useCallback((q) => onQty(line.id, q, line.stock), [onQty, line.id, line.stock])
  const handleRemove = useCallback(() => onRemove(line.id), [onRemove, line.id])
  const title = product?.title ?? `محصول ${line.id}`
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="grid grid-cols-[96px_minmax(0,1fr)_auto_auto_auto] items-center gap-4 rounded-[22px] border border-line bg-surface p-3.5 max-[721px]:grid-cols-[80px_minmax(0,1fr)_auto] max-[721px]:gap-x-3 max-[721px]:gap-y-2.5 max-[721px]:[grid-template-areas:'img_info_del'_'img_qty_total']"
    >
      <Link
        to={`/product/${line.id}`}
        className="size-24 overflow-hidden rounded-[18px] bg-bg-2 max-[721px]:size-20 max-[721px]:[grid-area:img] [&_img]:size-full [&_img]:object-contain"
        aria-label={title}
      >
        {product && <img onError={handleImgError} src={product.thumbnail} alt="" loading="lazy" />}
      </Link>
      <div className="grid min-w-0 gap-1 max-[721px]:[grid-area:info] [&_small]:text-muted">
        <Link to={`/product/${line.id}`} className="font-extrabold leading-[1.6] hover:text-primary-700" dir="auto">
          {title}
        </Link>
        <small>{label}</small>
        {line.available && <Price price={line.price} oldPrice={line.basePrice > line.price ? line.basePrice : null} />}
        <CartLineStatus line={line} />
      </div>
      {line.available && (
        <QuantityControl
          value={line.qty}
          max={line.stock}
          onChange={handleQty}
          className="max-[721px]:[grid-area:qty] max-[721px]:justify-self-start"
        />
      )}
      <div className="min-w-[120px] text-end max-[721px]:min-w-0 max-[721px]:[grid-area:total]">
        {line.available && <Price price={line.price * line.qty} />}
      </div>
      <button
        type="button"
        className={cn(
          ICON_BTN,
          'hover:bg-danger-50 hover:text-danger max-[721px]:self-start max-[721px]:[grid-area:del]',
        )}
        onClick={handleRemove}
        aria-label={`حذف ${title}`}
      >
        <Trash2 size={20} />
      </button>
    </motion.li>
  )
})

export default function CartPage() {
  useDocumentTitle('سبد خرید')
  const cart = useCartSummary()
  const setQty = useCartStore((s) => s.setQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const clear = useCartStore((s) => s.clear)

  const onRemove = useCallback(
    (id) => {
      removeItem(id)
      toast.success('از سبد خرید حذف شد')
    },
    [removeItem],
  )

  if (cart.isPending && !cart.lines.some((line) => line.product)) return <CartSkeleton />
  if (cart.isError && !cart.isEmpty) return <ErrorState error={cart.error} onRetry={cart.refetch} />

  const canCheckout = cart.totals.count > 0 && !cart.lines.some((line) => !line.available)

  return (
    <div className="site-container animate-page-in">
      <Breadcrumb items={[{ label: 'خانه', to: '/' }, { label: 'سبد خرید' }]} />
      <header className={PAGEHEAD}>
        <h1>سبد خرید</h1>
        {!cart.isEmpty && (
          <Button variant="ghost" size="sm" onClick={clear} icon={<Trash2 size={16} />}>
            خالی کردن سبد
          </Button>
        )}
      </header>
      {cart.isEmpty ? (
        <EmptyState icon={ShoppingBag} title="سبد خرید شما خالی است" text="هنوز محصولی انتخاب نکرده‌اید.">
          <Button to="/shop">مشاهدهٔ محصولات</Button>
        </EmptyState>
      ) : (
        <div className={CART_LAYOUT}>
          <ul className="grid gap-3.5">
            <AnimatePresence initial={false}>
              {cart.lines.map((line) => (
                <Row key={line.id} line={line} onQty={setQty} onRemove={onRemove} />
              ))}
            </AnimatePresence>
          </ul>
          <div className={CART_SIDE}>
            <CouponBox />
            <OrderSummary totals={cart.totals} shippingLabel={cart.method?.label}>
              {!canCheckout && cart.totals.count > 0 && (
                <p className={FIELD_ERROR} role="alert">
                  ابتدا اقلام ناموجود را از سبد حذف کنید.
                </p>
              )}
              {canCheckout ? (
                <Button to="/checkout" size="lg" block>
                  ادامه و ثبت سفارش
                </Button>
              ) : (
                <Button size="lg" block disabled>
                  ادامه و ثبت سفارش
                </Button>
              )}
            </OrderSummary>
          </div>
        </div>
      )}
    </div>
  )
}
