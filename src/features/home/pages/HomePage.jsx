import { lazy, Suspense } from 'react'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import { useCatalogMeta, useProducts } from '../../catalog/hooks/useCatalog'
import { useArticles } from '../../articles/hooks/useArticles'
import Hero from '../components/Hero'
import TrustBar from '../components/TrustBar'
import CategorySection from '../components/CategorySection'
import FeaturedProducts from '../components/FeaturedProducts'
import { SectionSkeleton } from '../../../shared/components/loaders/PublicSkeletons'
import ErrorState from '../../../shared/components/feedback/ErrorState'

const BEST = { sort: 'popular', available: true, limit: 12 }
const DEALS = { sort: 'discount', discounted: true, available: true, limit: 12 }
const NEWEST = { sort: 'newest', available: true, limit: 12 }

const OfferBanner = lazy(() => import('../components/OfferBanner'))
const WhyUs = lazy(() => import('../components/WhyUs'))
const HomeArticles = lazy(() => import('../components/HomeArticles'))
const Testimonials = lazy(() => import('../components/Testimonials'))
const Faq = lazy(() => import('../components/Faq'))
const Newsletter = lazy(() => import('../components/Newsletter'))

function Section({ query, ...props }) {
  if (query.isPending) return <SectionSkeleton height={380} />
  return <FeaturedProducts {...props} products={query.data?.items ?? []} />
}

export default function HomePage() {
  useDocumentTitle('')
  const best = useProducts(BEST)
  const deals = useProducts(DEALS)
  const newest = useProducts(NEWEST)
  const { data: meta } = useCatalogMeta()
  const { data: articles = [] } = useArticles()

  const failed = [best, deals, newest].find((query) => query.isError)
  if (failed && !failed.data)
    return <ErrorState error={failed.error} onRetry={() => [best, deals, newest].forEach((query) => query.refetch())} />

  return (
    <div className="animate-page-in">
      <h1 className="sr-only">دارویار؛ فروشگاه نمایشی مراقبت روزانه</h1>
      <Hero />
      <TrustBar />
      <CategorySection counts={meta?.counts} />
      <Section
        query={best}
        id="best"
        eyebrow="منتخب داده‌های نمونه"
        title="محصولات برگزیدهٔ نمونه"
        text="بر اساس امتیاز داده‌های نمایشی."
      />
      <Suspense fallback={<SectionSkeleton height={280} />}>
        <OfferBanner product={deals.data?.items[0]} />
      </Suspense>
      <Section
        query={deals}
        id="deals"
        eyebrow="تخفیف‌های ویژه"
        title="فرصت‌های امروز"
        text="محصولات با بیشترین تخفیف."
        to="/shop?sort=discount"
      />
      <Suspense fallback={<SectionSkeleton />}>
        <WhyUs />
      </Suspense>
      <Section query={newest} id="new" eyebrow="تازه‌ها" title="جدیدترین محصولات" to="/shop?sort=newest" />
      <Suspense fallback={<SectionSkeleton height={300} />}>
        <HomeArticles articles={articles.slice(0, 3)} />
        <Testimonials />
        <Faq />
        <Newsletter />
      </Suspense>
    </div>
  )
}
