import { memo, useCallback, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, Trash2, Truck, X } from 'lucide-react'
import { toast } from 'sonner'
import Button, { ICON_BTN, LINK_BTN } from '../common/Button'
import { EmptyState, Price, QuantityControl } from '../common/Primitives'
import { useCartStore } from '../../../features/cart/store/cartStore'
import { useCartSummary } from '../../../features/cart/hooks/useCart'
import CartLineStatus from '../../../features/cart/components/CartLineStatus'
import { useUiStore } from '../../store/uiStore'
import { useDialogA11y, useLockBodyScroll } from '../../hooks/useUtils'
import { cn, formatNumber, formatToman } from '../../utils/format'
import { assetUrl, handleImgError } from '../../utils/image'

const DrawerItem = memo(function DrawerItem({ line, onQty, onRemove }) {
  const { product } = line
  const title = product?.title ?? `محصول ${line.id}`
  const handleQty = useCallback((q) => onQty(line.id, q, line.stock), [onQty, line.id, line.stock])
  const handleRemove = useCallback(() => onRemove(line.id), [onRemove, line.id])
  return (
    <motion.li layout exit={{ opacity: 0, x: -40 }} className="flex gap-3.5 border-b border-dashed border-line py-3.5">
      <Link
        to={`/product/${line.id}`}
        className="size-[86px] shrink-0 overflow-hidden rounded-md bg-bg-2"
        aria-label={title}
      >
        {product && (
          <img
            className="size-full object-contain"
            onError={handleImgError}
            src={assetUrl(product.thumbnail)}
            alt=""
            loading="lazy"
          />
        )}
      </Link>
      <div className="grid min-w-0 flex-1 gap-1.5">
        <Link to={`/product/${line.id}`} className="line-clamp-2 leading-[1.5] font-bold">
          {title}
        </Link>
        {line.available && <Price price={line.price * line.qty} />}
        <CartLineStatus line={line} />
        <div className="flex items-center justify-between">
          {line.available && <QuantityControl small value={line.qty} max={line.stock} onChange={handleQty} />}
          <button
            type="button"
            className={cn(ICON_BTN, 'hover:bg-danger-50 hover:text-danger')}
            onClick={handleRemove}
            aria-label={`حذف ${title}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.li>
  )
})

const CartDrawer = memo(function CartDrawer() {
  const open = useUiStore((s) => s.cartOpen)
  const close = useUiStore((s) => s.closeCart)
  const cart = useCartSummary(undefined, { enabled: open })
  const { totals, lines } = cart
  const setQty = useCartStore((s) => s.setQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const { pathname } = useLocation()
  useLockBodyScroll(open)

  useEffect(() => {
    close()
  }, [pathname, close])

  const dialogRef = useDialogA11y(open, close)

  const handleRemove = useCallback(
    (id) => {
      removeItem(id)
      toast.success('از سبد خرید حذف شد')
    },
    [removeItem],
  )

  const progress = Math.min(
    100,
    Math.round(
      ((totals.subtotal - totals.couponDiscount) /
        (totals.subtotal - totals.couponDiscount + totals.remainingForFree || 1)) *
        100,
    ),
  )

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110]">
          <motion.div
            className="absolute inset-0 bg-[rgba(10,30,34,0.5)] backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            ref={dialogRef}
            tabIndex={-1}
            className="absolute top-0 bottom-0 left-0 end-auto flex w-[min(100%,420px)] flex-col bg-surface shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-label="سبد خرید"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.22, 0.8, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="flex items-center gap-2.5 text-[18px]">
                <ShoppingBag size={22} /> سبد خرید{' '}
                <span className="font-semibold text-muted">({formatNumber(totals.count)})</span>
              </h2>
              <button type="button" className={ICON_BTN} onClick={close} aria-label="بستن سبد خرید">
                <X size={22} />
              </button>
            </div>

            {cart.isEmpty ? (
              <div className="grid flex-1 place-items-center">
                <EmptyState
                  icon={ShoppingBag}
                  title="سبد خرید شما خالی است"
                  text="محصولات مورد نیازتان را به سبد اضافه کنید."
                >
                  <Button to="/shop" onClick={close}>
                    رفتن به فروشگاه
                  </Button>
                </EmptyState>
              </div>
            ) : (
              <>
                {cart.method?.freeFrom != null && (
                  <div className="mx-5 mt-3.5 flex items-center gap-3 rounded-md bg-primary-50 px-3.5 py-3 text-[13px] text-primary-700">
                    <Truck size={18} />
                    <div className="flex-1">
                      {totals.remainingForFree > 0 ? (
                        <p>
                          <b>{formatToman(totals.remainingForFree)}</b> تا ارسال رایگان باقی مانده
                        </p>
                      ) : (
                        <p>
                          <b>ارسال سفارش شما رایگان است 🎉</b>
                        </p>
                      )}
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white">
                        <span
                          className="block h-full rounded-full bg-[linear-gradient(90deg,var(--color-primary),#35c4ae)] [transition:width_0.4s_var(--ease-brand)]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {cart.isError && (
                  <div className="flex items-center gap-1.5" role="alert">
                    اطلاعات به‌روز محصولات دریافت نشد.{' '}
                    <button type="button" className={LINK_BTN} onClick={() => cart.refetch()}>
                      تلاش دوباره
                    </button>
                  </div>
                )}
                <ul className="flex-1 overflow-y-auto px-5 py-2">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <DrawerItem key={line.id} line={line} onQty={setQty} onRemove={handleRemove} />
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="grid gap-2.5 border-t border-line bg-surface px-5 pt-4 pb-5">
                  <div className="flex items-center justify-between text-[15px]">
                    <span>جمع کل</span>
                    <b className="text-[17px]">{formatToman(totals.subtotal)}</b>
                  </div>
                  <Button to="/cart" variant="outline" block>
                    مشاهدهٔ سبد خرید
                  </Button>
                  <Button to="/checkout" block disabled={totals.count === 0 || cart.isError}>
                    ادامه و پرداخت
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
})

export default CartDrawer
