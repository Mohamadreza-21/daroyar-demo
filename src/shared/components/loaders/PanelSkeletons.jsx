import { memo } from 'react'
import BrandLoader from './BrandLoader'
import { cn } from '../../utils/format'
import { ProductGridSkeleton, Sk, SK_CENTER, SK_FORMGRID, SK_ROW, SK_ROW_3, SK_STACK } from './Skeleton'

export const PanelOverviewSkeleton = memo(function PanelOverviewSkeleton() {
  return (
    <div aria-busy="true" className={SK_STACK}>
      <Sk h={150} r={26} />
      <div className={cn(SK_ROW, SK_ROW_3)}>
        {Array.from({ length: 3 }, (_, i) => (
          <Sk key={i} h={104} r={22} />
        ))}
      </div>
      <Sk h={240} r={24} />
    </div>
  )
})

export const PanelFormSkeleton = memo(function PanelFormSkeleton() {
  return (
    <div aria-busy="true" className={SK_STACK}>
      <div className={cn(SK_CENTER, 'm-0')}>
        <BrandLoader variant="pulse" label="در حال دریافت اطلاعات حساب…" />
      </div>
      <div className={SK_FORMGRID}>
        {Array.from({ length: 6 }, (_, i) => (
          <Sk key={i} h={52} r={14} />
        ))}
      </div>
    </div>
  )
})

export const PanelOrdersSkeleton = memo(function PanelOrdersSkeleton() {
  return (
    <div aria-busy="true" className={SK_STACK}>
      <div className={cn(SK_CENTER, 'm-0')}>
        <BrandLoader variant="drops" label="در حال یافتن سفارش‌ها…" />
      </div>
      {Array.from({ length: 3 }, (_, i) => (
        <Sk key={i} h={130} r={22} />
      ))}
    </div>
  )
})

export const PanelWishlistSkeleton = memo(function PanelWishlistSkeleton() {
  return (
    <div aria-busy="true">
      <ProductGridSkeleton count={6} />
    </div>
  )
})
