import { memo, useCallback, useRef } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { AVATAR, Badge, Rating } from '../../../shared/components/common/Primitives'
import { LINK_BTN } from '../../../shared/components/common/Button'
import ReviewForm from './ReviewForm'
import { useAuthStore } from '../../auth/store/authStore'
import { cn, formatDate, formatNumber } from '../../../shared/utils/format'

const TABS = [
  { id: 'desc', label: 'توضیحات' },
  { id: 'specs', label: 'مشخصات' },
  { id: 'reviews', label: 'نظرات' },
]

const Specs = memo(function Specs({ product, categoryLabel }) {
  const rows = [
    ['برند', product.brand],
    ['دسته‌بندی', categoryLabel],
    ['کد کالا', product.sku],
    ['موجودی', product.stock > 0 ? `${formatNumber(product.stock)} عدد` : 'ناموجود'],
  ].filter(([, v]) => v)
  return (
    <dl className="grid max-w-[640px]">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 border-b border-dashed border-line py-3">
          <dt className="text-muted">{k}</dt>
          <dd className="font-bold">{v}</dd>
        </div>
      ))}
    </dl>
  )
})

const ReviewComposer = memo(function ReviewComposer({ productId, reviews }) {
  const user = useAuthStore((s) => s.user)
  const { pathname, search } = useLocation()
  if (!user)
    return (
      <p className="mb-6 rounded-[20px] border border-dashed border-line bg-bg p-[18px] text-muted">
        برای ثبت نظر ابتدا{' '}
        <Link to="/login" state={{ from: `${pathname}${search}` }} className="font-extrabold text-primary-700">
          وارد حساب کاربری شوید
        </Link>
        .
      </p>
    )
  if (user.role === 'admin') return null
  if (reviews.data?.some((r) => r.userId === user.id))
    return (
      <p className="mb-6 rounded-[20px] border border-line bg-primary-50 p-[18px] font-bold text-primary-700">
        نظر شما برای این محصول ثبت شده است.
      </p>
    )
  return <ReviewForm productId={productId} />
})

const Reviews = memo(function Reviews({ query }) {
  if (query.isPending)
    return (
      <p className="text-muted" role="status">
        در حال دریافت نظرات…
      </p>
    )
  if (query.isError)
    return (
      <div className="flex items-center gap-1.5" role="alert">
        دریافت نظرات انجام نشد.{' '}
        <button type="button" className={LINK_BTN} onClick={() => query.refetch()}>
          تلاش دوباره
        </button>
      </div>
    )
  const reviews = query.data ?? []
  if (!reviews.length) return <p className="text-muted">هنوز نظری ثبت نشده است.</p>
  return (
    <ul className="grid gap-3.5">
      {reviews.map((r, i) => (
        <li key={i} className="rounded-[20px] border border-line bg-surface p-[18px]">
          <div className="mb-2 flex items-center gap-3">
            <span className={AVATAR}>{r.reviewerName?.charAt(0)}</span>
            <div className="flex-1">
              <b dir="auto" className="block">
                {r.reviewerName}
              </b>
              <small className="block text-muted">{formatDate(r.date)}</small>
            </div>
            <Rating value={r.rating} size={14} />
          </div>
          <p dir="auto">{r.comment}</p>
        </li>
      ))}
    </ul>
  )
})

const ProductTabs = memo(function ProductTabs({ product, categoryLabel, reviews }) {
  const [params, setParams] = useSearchParams()
  const requested = params.get('tab')
  const tab = TABS.some((t) => t.id === requested) ? requested : 'desc'
  const listRef = useRef(null)
  const select = useCallback(
    (id) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (id === 'desc') next.delete('tab')
          else next.set('tab', id)
          return next
        },
        { replace: true, preventScrollReset: true },
      ),
    [setParams],
  )
  const onKeyDown = (event) => {
    const index = TABS.findIndex((t) => t.id === tab)
    const step = { ArrowLeft: 1, ArrowRight: -1 }[event.key]
    let target = null
    if (step) target = TABS[(index + step + TABS.length) % TABS.length]
    if (event.key === 'Home') target = TABS[0]
    if (event.key === 'End') target = TABS[TABS.length - 1]
    if (!target) return
    event.preventDefault()
    select(target.id)
    listRef.current?.querySelector(`#ptab-${target.id}`)?.focus()
  }
  return (
    <section className="mt-12">
      <div
        className="flex gap-1.5 overflow-x-auto rounded-2xl bg-bg-2 p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="اطلاعات محصول"
        ref={listRef}
        onKeyDown={onKeyDown}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`ptab-${t.id}`}
            type="button"
            role="tab"
            tabIndex={tab === t.id ? 0 : -1}
            aria-controls={tab === t.id ? `ppanel-${t.id}` : undefined}
            aria-selected={tab === t.id}
            className={cn(
              'relative min-h-[42px] shrink-0 rounded-[12px] px-5 font-bold text-muted [transition:color_0.2s]',
              tab === t.id && 'text-primary-700',
            )}
            onClick={() => select(t.id)}
          >
            {tab === t.id && (
              <motion.span
                layoutId="ptab-pill"
                className="relative z-[1] rounded-[12px] bg-surface shadow-sm"
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              />
            )}
            <span className="relative z-1">
              {t.label}
              {t.id === 'reviews' && reviews.data ? ` (${formatNumber(reviews.data.length)})` : ''}
            </span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          id={`ppanel-${tab}`}
          role="tabpanel"
          aria-labelledby={`ptab-${tab}`}
          tabIndex={0}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="px-1 py-6"
        >
          {tab === 'desc' && (
            <div>
              <p dir="auto" className="leading-[2]">
                {product.description}
              </p>
              {product.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.tags.map((t) => (
                    <Badge key={t} tone="neutral">
                      #{t}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === 'specs' && <Specs product={product} categoryLabel={categoryLabel} />}
          {tab === 'reviews' && (
            <>
              <ReviewComposer productId={product.id} reviews={reviews} />
              <Reviews query={reviews} />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
})

export default ProductTabs
