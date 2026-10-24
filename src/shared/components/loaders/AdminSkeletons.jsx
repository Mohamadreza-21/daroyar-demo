import { memo } from 'react'
import BrandLoader from './BrandLoader'
import { cn } from '../../utils/format'
import { Sk, SK_CART, SK_CENTER, SK_ROW, SK_ROW_4, SK_STACK } from './Skeleton'

export const AdminOverviewSkeleton = memo(function AdminOverviewSkeleton() {
  return (
    <div aria-busy="true" className={SK_STACK}>
      <div className={cn(SK_CENTER, 'm-0')}>
        <BrandLoader variant="bars" label="در حال محاسبهٔ آمار فروشگاه…" />
      </div>
      <div className={cn(SK_ROW, SK_ROW_4)}>
        {Array.from({ length: 4 }, (_, i) => (
          <Sk key={i} h={112} r={22} />
        ))}
      </div>
      <div className={SK_CART}>
        <Sk h={280} r={24} />
        <Sk h={280} r={24} />
      </div>
    </div>
  )
})

export const AdminTableSkeleton = memo(function AdminTableSkeleton({
  label = 'در حال دریافت فهرست…',
  variant = 'capsule',
}) {
  return (
    <div aria-busy="true" className={SK_STACK}>
      <div className="flex gap-3">
        <Sk h={46} r={14} className="flex-1" />
        <Sk w={140} h={46} r={14} />
      </div>
      <BrandLoader variant={variant} label={label} />
      {Array.from({ length: 6 }, (_, i) => (
        <Sk key={i} h={62} r={16} />
      ))}
    </div>
  )
})
