import { memo } from 'react'
import BrandLoader from './BrandLoader'
import { cn } from '../../utils/format'
import {
  ArticleCardSkeleton,
  ProductCardSkeleton,
  ProductGridSkeleton,
  Sk,
  SK_ASIDE,
  SK_CART,
  SK_CENTER,
  SK_FORMGRID,
  SK_HERO,
  SK_PRODUCT,
  SK_ROW,
  SK_ROW_3,
  SK_ROW_4,
  SK_SPLIT,
  SK_STACK,
} from './Skeleton'

const Shell = ({ label, children }) => (
  <div aria-busy="true" aria-label={label}>
    {children}
  </div>
)

export const HomeSkeleton = memo(function HomeSkeleton() {
  return (
    <Shell label="در حال بارگذاری صفحهٔ اصلی">
      <div className="site-container pt-6">
        <div className={SK_HERO}>
          <Sk h="100%" r={32} className="absolute inset-0" />
          <BrandLoader variant="cross" label="در حال آماده‌سازی داروخانه…" className="relative z-[1]" />
        </div>
        <div className={cn(SK_ROW, SK_ROW_4, 'mt-7')}>
          {Array.from({ length: 4 }, (_, i) => (
            <Sk key={i} h={84} r={20} />
          ))}
        </div>
        <div className={cn(SK_ROW, SK_ROW_4, 'mt-14')}>
          {Array.from({ length: 4 }, (_, i) => (
            <Sk key={i} h={140} r={24} />
          ))}
        </div>
        <div className={cn(SK_ROW, SK_ROW_4, 'mt-14 mb-[72px]')}>
          {Array.from({ length: 4 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </Shell>
  )
})

export const ShopSkeleton = memo(function ShopSkeleton() {
  return (
    <Shell label="در حال بارگذاری فروشگاه">
      <div className="site-container py-7">
        <Sk w={220} h={34} />
        <div className={SK_CENTER}>
          <BrandLoader variant="capsule" label="در حال چیدن قفسه‌ها…" />
        </div>
        <div className={SK_SPLIT}>
          <div className={SK_ASIDE}>
            <Sk h={48} r={14} />
            <Sk h={190} r={20} />
            <Sk h={110} r={20} />
          </div>
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </Shell>
  )
})

export const ProductSkeleton = memo(function ProductSkeleton() {
  return (
    <Shell label="در حال بارگذاری محصول">
      <div className="site-container py-7">
        <Sk w={260} h={18} />
        <div className={SK_PRODUCT}>
          <div>
            <Sk h="auto" r={28} className="aspect-square" />
            <div className={cn(SK_ROW, SK_ROW_4, 'mt-3.5')}>
              {Array.from({ length: 4 }, (_, i) => (
                <Sk key={i} h="auto" r={16} className="aspect-square" />
              ))}
            </div>
          </div>
          <div className={SK_STACK}>
            <BrandLoader variant="orbit" label="در حال بررسی جزئیات کالا…" />
            <Sk w="35%" h={14} />
            <Sk w="85%" h={30} />
            <Sk w="50%" h={18} />
            <Sk w="40%" h={42} />
            <Sk h={90} r={16} />
            <Sk h={56} r={16} />
          </div>
        </div>
      </div>
    </Shell>
  )
})

export const CartSkeleton = memo(function CartSkeleton() {
  return (
    <Shell label="در حال بارگذاری سبد خرید">
      <div className="site-container py-7">
        <Sk w={200} h={34} />
        <div className={SK_CENTER}>
          <BrandLoader variant="drops" label="در حال شمارش سبد شما…" />
        </div>
        <div className={SK_CART}>
          <div className={SK_STACK}>
            {Array.from({ length: 3 }, (_, i) => (
              <Sk key={i} h={118} r={22} />
            ))}
          </div>
          <Sk h={300} r={24} />
        </div>
      </div>
    </Shell>
  )
})

export const CheckoutSkeleton = memo(function CheckoutSkeleton() {
  return (
    <Shell label="در حال آماده‌سازی تسویه‌حساب">
      <div className="site-container py-7">
        <Sk w={240} h={34} />
        <div className={SK_CENTER}>
          <BrandLoader variant="bars" label="در حال آماده‌سازی فرم پرداخت…" />
        </div>
        <div className={SK_CART}>
          <div className={SK_FORMGRID}>
            {Array.from({ length: 8 }, (_, i) => (
              <Sk key={i} h={i === 6 ? 110 : 52} r={14} className={i === 6 ? 'col-span-full' : undefined} />
            ))}
          </div>
          <Sk h={340} r={24} />
        </div>
      </div>
    </Shell>
  )
})

export const ArticlesSkeleton = memo(function ArticlesSkeleton() {
  return (
    <Shell label="در حال بارگذاری مقالات">
      <div className="site-container py-7">
        <Sk w={260} h={38} />
        <div className={SK_CENTER}>
          <BrandLoader variant="pulse" label="در حال یافتن مقاله‌های تازه…" />
        </div>
        <Sk h={260} r={28} className="mb-7" />
        <div className={cn(SK_ROW, SK_ROW_3)}>
          {Array.from({ length: 3 }, (_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </Shell>
  )
})

export const ArticleSkeleton = memo(function ArticleSkeleton() {
  return (
    <Shell label="در حال بارگذاری مقاله">
      <div className="site-container max-w-[820px] py-7">
        <Sk w="60%" h={18} />
        <Sk w="90%" h={42} className="mt-[18px]" />
        <Sk w="50%" h={42} className="mt-2.5" />
        <Sk h={280} r={28} className="my-[26px]" />
        <div className={SK_STACK}>
          {Array.from({ length: 7 }, (_, i) => (
            <Sk key={i} w={i % 3 === 2 ? '65%' : '100%'} h={14} />
          ))}
        </div>
      </div>
    </Shell>
  )
})

export const ContactSkeleton = memo(function ContactSkeleton() {
  return (
    <Shell label="در حال بارگذاری صفحهٔ تماس">
      <div className="site-container py-7">
        <Sk w={220} h={38} />
        <div className={cn(SK_ROW, SK_ROW_4, 'my-7')}>
          {Array.from({ length: 4 }, (_, i) => (
            <Sk key={i} h={130} r={22} />
          ))}
        </div>
        <div className={SK_CART}>
          <Sk h={420} r={28} />
          <Sk h={420} r={28} />
        </div>
      </div>
    </Shell>
  )
})

export const SectionSkeleton = memo(function SectionSkeleton({ height = 360 }) {
  return (
    <div className="site-container py-10" aria-hidden="true">
      <Sk w={260} h={30} />
      <Sk h={height} r={28} className="mt-6" />
    </div>
  )
})
