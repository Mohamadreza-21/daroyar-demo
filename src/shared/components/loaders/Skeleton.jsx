import { memo } from 'react'
import { cn } from '../../utils/format'

export const SK_ROW = 'grid gap-[18px]'
export const SK_ROW_3 = 'grid-cols-[repeat(3,minmax(0,1fr))] max-[641px]:grid-cols-1'
export const SK_ROW_4 = 'grid-cols-[repeat(4,minmax(0,1fr))] max-[1025px]:grid-cols-[repeat(2,minmax(0,1fr))]'
export const SK_STACK = 'grid content-start gap-3.5'
export const SK_CENTER = 'mt-[22px] mb-2 flex justify-center'
export const SK_HERO = 'relative grid min-h-[clamp(320px,52vw,520px)] place-items-center overflow-hidden rounded-xl'
export const SK_SPLIT = 'mt-3 grid grid-cols-[280px_minmax(0,1fr)] gap-7 max-[1025px]:grid-cols-1'
export const SK_ASIDE = 'grid content-start gap-4 max-[1025px]:hidden'
export const SK_PRODUCT = 'mt-6 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 max-[1025px]:grid-cols-1'
export const SK_CART = 'mt-3 grid grid-cols-[minmax(0,1fr)_380px] gap-6 max-[1025px]:grid-cols-1'
export const SK_FORMGRID = 'grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3.5 max-[641px]:grid-cols-1'

const SK =
  'block animate-shimmer rounded-[10px] bg-[linear-gradient(100deg,#e4efed_30%,#f3f9f8_50%,#e4efed_70%)] bg-[length:300%_100%]'

export const Sk = memo(function Sk({ w, h = 16, r, className, style }) {
  return (
    <span className={cn(SK, className)} style={{ width: w, height: h, borderRadius: r, ...style }} aria-hidden="true" />
  )
})

export const ProductCardSkeleton = memo(function ProductCardSkeleton() {
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface"
      aria-hidden="true"
    >
      <Sk
        h="auto"
        className="relative mx-2.5 mt-2.5 aspect-square overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#fff,var(--color-bg-2))]"
        r={18}
      />
      <div className="grid flex-1 content-start gap-2 px-4 pt-3.5 pb-4 max-[641px]:p-3">
        <Sk w="40%" h={12} />
        <Sk w="90%" h={16} />
        <Sk w="60%" h={16} />
        <Sk w="45%" h={22} className="mt-1.5" />
      </div>
    </div>
  )
})

export const ProductGridSkeleton = memo(function ProductGridSkeleton({ count = 8 }) {
  return (
    <ul
      className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5 max-[641px]:grid-cols-[repeat(2,minmax(0,1fr))] max-[641px]:gap-3"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <ProductCardSkeleton />
        </li>
      ))}
    </ul>
  )
})

export const ArticleCardSkeleton = memo(function ArticleCardSkeleton() {
  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-surface p-2.5"
      aria-hidden="true"
    >
      <Sk h={180} r={20} />
      <div className="grid flex-1 content-start gap-2.5 px-5 pt-3 pb-5">
        <Sk w="30%" h={12} />
        <Sk w="95%" h={18} />
        <Sk w="70%" h={18} />
        <Sk w="100%" h={12} />
        <Sk w="80%" h={12} />
      </div>
    </div>
  )
})
