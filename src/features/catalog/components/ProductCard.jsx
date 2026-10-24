import { memo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router'
import { Heart, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { Badge, Price, Rating } from '../../../shared/components/common/Primitives'
import { useCartStore } from '../../cart/store/cartStore'
import { useCanWish, useIsWished, useToggleWishlist } from '../../wishlist/hooks/useWishlist'
import { useCategoryLabel } from '../hooks/useCatalog'
import { useAuthStore } from '../../auth/store/authStore'
import { cn, formatNumber } from '../../../shared/utils/format'
import { assetUrl, handleImgError } from '../../../shared/utils/image'

const WishToggle = memo(function WishToggle({ id }) {
  const active = useIsWished(id)
  const { mutate: toggle } = useToggleWishlist()
  const authed = useAuthStore((s) => Boolean(s.user))
  const navigate = useNavigate()
  const onClick = useCallback(
    (e) => {
      e.preventDefault()
      if (!authed) {
        toast.info('برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید')
        navigate('/login', { state: { from: '/shop' } })
        return
      }
      toggle(
        { id, wished: active },
        {
          onSuccess: () => toast.success(active ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد'),
          onError: () => toast.error('ذخیرهٔ علاقه‌مندی انجام نشد؛ دوباره تلاش کنید'),
        },
      )
    },
    [authed, toggle, id, active, navigate],
  )
  return (
    <button
      type="button"
      className={cn(
        'absolute end-2 top-2 grid size-[38px] place-items-center rounded-[50%] bg-[rgba(255,255,255,0.92)] text-ink-2 shadow-sm [transition:transform_0.2s,translate_0.2s,rotate_0.2s,scale_0.2s,color_0.2s,background_0.2s] hover:scale-110 hover:text-danger',
        active && 'text-danger [&_svg]:fill-danger',
      )}
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
    >
      <Heart size={19} />
    </button>
  )
})

const ProductCard = memo(function ProductCard({ product }) {
  const canWish = useCanWish()
  const addItem = useCartStore((s) => s.addItem)
  const soldOut = product.stock <= 0
  const categoryLabel = useCategoryLabel(product.category)

  const onAdd = useCallback(() => {
    const result = addItem(product, 1)
    if (result === 'unavailable') {
      toast.error('این محصول در حال حاضر موجود نیست')
    } else if (result === 'limit') {
      toast.warning('موجودی این محصول در سبد خرید به سقف رسیده است')
    } else if (result === 'limited') {
      toast.warning('تعداد به سقف موجودی انبار محدود شد', { description: product.title })
    } else {
      toast.success('به سبد خرید اضافه شد', { description: product.title })
    }
  }, [addItem, product])

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface [transition:transform_0.3s_var(--ease-brand),translate_0.3s_var(--ease-brand),rotate_0.3s_var(--ease-brand),scale_0.3s_var(--ease-brand),box-shadow_0.3s,border-color_0.3s] hover:-translate-y-1.5 hover:border-primary-100 hover:shadow-md">
      <div className="relative mx-2.5 mt-2.5 aspect-square overflow-hidden rounded-[18px] bg-[radial-gradient(circle_at_50%_40%,#fff,var(--color-bg-2))]">
        <Link to={`/product/${product.id}`} aria-label={product.title} tabIndex={-1} className="block h-full">
          <img
            onError={handleImgError}
            src={assetUrl(product.thumbnail)}
            alt={product.title}
            loading="lazy"
            width="320"
            height="320"
            className="h-full w-full object-contain p-2.5 transition-transform duration-500 ease-brand group-hover:scale-[1.08]"
          />
        </Link>
        {product.discount > 0 && (
          <span className="absolute start-2.5 top-2.5 rounded-[99px] bg-accent px-2.5 py-[3px] text-[12px] font-extrabold text-white">
            {formatNumber(product.discount)}٪ تخفیف
          </span>
        )}
        {soldOut && (
          <span className="absolute inset-0 grid place-items-center bg-[rgba(255,255,255,0.72)] font-extrabold text-danger">
            ناموجود
          </span>
        )}
        {canWish && <WishToggle id={product.id} />}
      </div>
      <div className="grid flex-1 content-start gap-2 px-4 pt-3.5 pb-4 max-[640px]:p-3">
        <Badge tone="neutral" className="justify-self-start">
          {categoryLabel}
        </Badge>
        <h3 className="line-clamp-2 min-h-[3.4em] text-[14.5px] leading-[1.7] max-[640px]:text-[13px]">
          <Link to={`/product/${product.id}`} className="hover:text-primary-700">
            {product.title}
          </Link>
        </h3>
        {product.reviewCount > 0 && <Rating value={product.rating} size={14} />}
        <div className="mt-auto flex items-end justify-between gap-2 pt-1 max-[640px]:[&>div>span:first-child]:text-[15px] max-[640px]:[&>div>span:nth-child(2)]:text-[12px]">
          <Price price={product.price} oldPrice={product.discount > 0 ? product.basePrice : null} />
          <button
            type="button"
            className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-primary text-white [transition:transform_0.2s,translate_0.2s,rotate_0.2s,scale_0.2s,background_0.2s,box-shadow_0.2s] enabled:hover:-translate-y-0.5 enabled:hover:-rotate-6 enabled:hover:bg-accent enabled:hover:shadow-[0_8px_18px_rgba(255,122,89,0.4)] disabled:cursor-not-allowed disabled:bg-[#cfdad9] max-[640px]:size-10"
            onClick={onAdd}
            disabled={soldOut}
            aria-label={`افزودن ${product.title} به سبد`}
          >
            <ShoppingBag size={19} />
          </button>
        </div>
      </div>
    </article>
  )
})

export default ProductCard
