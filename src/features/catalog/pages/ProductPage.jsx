import { memo, useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Heart, RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { toast } from 'sonner'
import { useCategoryLabel, useProduct, useRelatedProducts, useReviews } from '../hooks/useCatalog'
import { useCanWish, useIsWished, useToggleWishlist } from '../../wishlist/hooks/useWishlist'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import { useCartStore } from '../../cart/store/cartStore'
import { useAuthStore } from '../../auth/store/authStore'
import {
  Badge,
  Breadcrumb,
  Price,
  QuantityControl,
  Rating,
  SectionHeading,
} from '../../../shared/components/common/Primitives'
import Button, { ICON_BTN } from '../../../shared/components/common/Button'
import { DEMO_NOTE } from '../../../shared/components/common/styles'
import ProductGallery from '../components/ProductGallery'
import ProductTabs from '../components/ProductTabs'
import ProductCarousel from '../components/ProductCarousel'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import { ProductSkeleton } from '../../../shared/components/loaders/PublicSkeletons'
import { cn, formatNumber } from '../../../shared/utils/format'

const Purchase = memo(function Purchase({ product }) {
  const [qty, setQty] = useState(1)
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const wished = useIsWished(product.id)
  const canWish = useCanWish()
  const { mutate: toggleWish } = useToggleWishlist()
  const authed = useAuthStore((s) => Boolean(s.user))
  const soldOut = product.stock <= 0
  const max = Math.max(1, product.stock)

  const onAdd = useCallback(() => {
    const result = addItem(product, qty)
    if (result === 'unavailable') {
      toast.error('این محصول در حال حاضر موجود نیست')
      return
    }
    if (result === 'limit') {
      toast.warning('بیشتر از موجودی انبار نمی‌توانید اضافه کنید')
      return
    }
    if (result === 'limited') {
      toast.warning('تعداد به سقف موجودی انبار محدود شد', {
        description: product.title,
      })
      return
    }
    toast.success('به سبد خرید اضافه شد', {
      description: `${formatNumber(Math.min(qty, product.stock))} عدد ${product.title}`,
    })
  }, [addItem, product, qty])

  const onWish = useCallback(() => {
    if (!authed) {
      toast.info('برای ذخیرهٔ علاقه‌مندی‌ها وارد شوید')
      navigate('/login', { state: { from: `/product/${product.id}` } })
      return
    }
    toggleWish(
      { id: product.id, wished },
      {
        onSuccess: () => toast.success(wished ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد'),
        onError: () => toast.error('ذخیرهٔ علاقه‌مندی انجام نشد؛ دوباره تلاش کنید'),
      },
    )
  }, [authed, navigate, product.id, toggleWish, wished])

  return (
    <div className="grid w-full gap-3.5 rounded-lg border border-line bg-surface p-[22px] shadow-sm">
      <Price price={product.price} oldPrice={product.discount > 0 ? product.basePrice : null} large />
      <p
        className={cn(
          'text-[13.5px] font-bold',
          soldOut ? 'text-danger' : product.stock < 10 ? 'text-warn' : 'text-success',
        )}
      >
        {soldOut
          ? 'ناموجود'
          : product.stock < 10
            ? `فقط ${formatNumber(product.stock)} عدد در انبار`
            : 'موجود در انبار'}
      </p>
      <div className="flex flex-wrap items-center gap-2.5">
        <QuantityControl value={qty} max={max} onChange={setQty} />
        <Button
          size="lg"
          className="min-w-[180px] flex-1"
          onClick={onAdd}
          disabled={soldOut}
          icon={<ShoppingBag size={20} />}
        >
          افزودن به سبد خرید
        </Button>
        {canWish && (
          <button
            type="button"
            className={cn(
              ICON_BTN,
              'border-[1.5px] border-line',
              wished && 'border-danger text-danger [&_svg]:fill-danger',
            )}
            onClick={onWish}
            aria-pressed={wished}
            aria-label="علاقه‌مندی"
          >
            <Heart size={22} />
          </button>
        )}
      </div>
      <ul className="flex flex-wrap gap-x-[18px] gap-y-2 border-t border-dashed border-line pt-3 text-[13px] text-muted [&_svg]:text-primary">
        <li className="flex items-center gap-1.5">
          <Truck size={18} /> ارسال رایگان برای سفارش‌های بالای ۲ میلیون تومان
        </li>
        <li className="flex items-center gap-1.5">
          <ShieldCheck size={18} /> اطلاعات محصول نمونه است
        </li>
        <li className="flex items-center gap-1.5">
          <RotateCcw size={18} /> خرید و مرجوعی نمایشی
        </li>
      </ul>
    </div>
  )
})

export default function ProductPage() {
  const { id } = useParams()
  const { data: product, isPending, isError, error, refetch } = useProduct(id)
  const { data: related = [] } = useRelatedProducts(product)
  const reviewsQuery = useReviews(id)
  const categoryLabel = useCategoryLabel(product?.category)
  useDocumentTitle(product?.title, product?.description)

  if (isPending && !product) return <ProductSkeleton />
  if (isError) return <ErrorState error={error} onRetry={error?.status === 404 ? undefined : refetch} />

  return (
    <div className="site-container animate-page-in">
      <Breadcrumb
        items={[
          { label: 'خانه', to: '/' },
          { label: 'فروشگاه', to: '/shop' },
          { label: categoryLabel, to: `/shop?category=${product.category}` },
          { label: product.title },
        ]}
      />
      <div className="grid grid-cols-2 items-start gap-[clamp(24px,4vw,56px)] max-[1025px]:grid-cols-1">
        <ProductGallery images={product.images} title={product.title} discount={product.discount} />
        <div className="grid justify-items-start gap-3.5">
          <Badge>{categoryLabel}</Badge>
          <h1 dir="auto" className="text-[clamp(20px,2.6vw,28px)] leading-[1.6]">
            {product.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-muted">
            {product.reviewCount > 0 && <Rating value={product.rating} count={product.reviewCount} />}
            <span>
              برند:{' '}
              <b dir="auto" className="text-ink">
                {product.brand}
              </b>
            </span>
          </div>
          <p className="line-clamp-2 leading-[2] text-muted" dir="auto">
            {product.description}
          </p>
          {product.stock <= 0 && (
            <p className={DEMO_NOTE} role="status">
              این محصول فعلاً ناموجود است. می‌توانید از محصولات مشابه زیر انتخاب کنید.
            </p>
          )}
          <Purchase key={product.id} product={product} />
        </div>
      </div>
      <ProductTabs product={product} categoryLabel={categoryLabel} reviews={reviewsQuery} />
      {related.length > 0 && (
        <section className="section-y">
          <SectionHeading
            eyebrow="پیشنهاد"
            title={product.stock > 0 ? 'محصولات مشابه' : 'جایگزین‌های موجود'}
            to={`/shop?category=${product.category}`}
          />
          <ProductCarousel id="related" products={related} />
        </section>
      )}
    </div>
  )
}
