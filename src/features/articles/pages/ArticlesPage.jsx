import { useMemo, useState } from 'react'
import { BookOpen } from 'lucide-react'
import { useArticles } from '../hooks/useArticles'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import { Breadcrumb, EmptyState } from '../../../shared/components/common/Primitives'
import ArticleCard from '../components/ArticleCard'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import { ArticlesSkeleton } from '../../../shared/components/loaders/PublicSkeletons'
import { cn } from '../../../shared/utils/format'
import { CHIP_SM, PAGEHEAD, chipClass } from '../../../shared/components/common/styles'

export default function ArticlesPage() {
  useDocumentTitle(
    'مقالات سلامت',
    'مقالات آموزشی نمونه دربارهٔ مراقبت پوست، مصرف صحیح دارو، تغذیه و سبک زندگی سالم. این محتوا برای نمایش پروژه است و جایگزین توصیهٔ پزشکی نیست.',
  )
  const { data: articles = [], isPending, isError, error, refetch } = useArticles()
  const [cat, setCat] = useState('all')

  const categories = useMemo(() => ['all', ...new Set(articles.map((a) => a.category))], [articles])
  const list = useMemo(() => (cat === 'all' ? articles : articles.filter((a) => a.category === cat)), [articles, cat])
  const [featured, ...rest] = list

  if (isPending) return <ArticlesSkeleton />
  if (isError) return <ErrorState error={error} onRetry={refetch} />

  return (
    <div className="site-container animate-page-in">
      <Breadcrumb items={[{ label: 'خانه', to: '/' }, { label: 'مقالات سلامت' }]} />
      <header className={cn(PAGEHEAD, 'flex-col items-start gap-1.5')}>
        <h1>مجلهٔ سلامت دارویار</h1>
        <p className="text-muted">مقالات آموزشی دربارهٔ مراقبت پوست، مصرف صحیح دارو، تغذیه و سبک زندگی سالم.</p>
      </header>
      <div className="mb-7 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c} type="button" className={chipClass(cat === c, CHIP_SM)} onClick={() => setCat(c)}>
            {c === 'all' ? 'همه' : c}
          </button>
        ))}
      </div>
      {featured ? (
        <>
          <ArticleCard article={featured} featured />
          {rest.length > 0 && (
            <div className="mt-7 grid grid-cols-3 gap-[22px] max-[1025px]:grid-cols-2 max-[641px]:grid-cols-1">
              {rest.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </>
      ) : (
        <EmptyState icon={BookOpen} title="مقاله‌ای پیدا نشد" />
      )}
    </div>
  )
}
