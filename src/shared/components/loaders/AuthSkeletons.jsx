import { memo } from 'react'
import BrandLoader from './BrandLoader'
import { Sk, SK_FORMGRID, SK_STACK } from './Skeleton'
import { cn } from '../../utils/format'

export const LoginSkeleton = memo(function LoginSkeleton() {
  return (
    <div aria-busy="true" className={cn(SK_STACK, 'w-[min(100%,420px)]')}>
      <BrandLoader variant="cross" label="در حال آماده‌سازی ورود…" />
      <Sk w="50%" h={32} />
      <Sk h={52} r={14} />
      <Sk h={52} r={14} />
      <Sk h={54} r={16} />
    </div>
  )
})

export const RegisterSkeleton = memo(function RegisterSkeleton() {
  return (
    <div aria-busy="true" className={cn(SK_STACK, 'w-[min(100%,520px)]')}>
      <BrandLoader variant="capsule" label="در حال ساخت فرم ثبت‌نام…" />
      <Sk w="55%" h={32} />
      <div className={SK_FORMGRID}>
        {Array.from({ length: 6 }, (_, i) => (
          <Sk key={i} h={52} r={14} />
        ))}
      </div>
      <Sk h={54} r={16} />
    </div>
  )
})
