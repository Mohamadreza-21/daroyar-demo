import { useMemo } from 'react'
import { useParams } from 'react-router'
import { Clock, User } from 'lucide-react'
import { useArticle, useArticles } from '../hooks/useArticles'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import { Badge, Breadcrumb, SectionHeading } from '../../../shared/components/common/Primitives'
import ArticleCard from '../components/ArticleCard'
import { ArticleCover } from '../components/ArticleCover'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import { ArticleSkeleton } from '../../../shared/components/loaders/PublicSkeletons'
import { formatDate, formatNumber } from '../../../shared/utils/format'

export default function ArticlePage() {
  const { slug } = useParams()
  const { data: article, isPending, isError, error, refetch } = useArticle(slug)
  const { data: all = [] } = useArticles()
  useDocumentTitle(article?.title, article?.excerpt)

  const more = useMemo(() => all.filter((a) => a.slug !== slug).slice(0, 3), [all, slug])

  if (isPending) return <ArticleSkeleton />
  if (isError) return <ErrorState error={error} onRetry={error?.status === 404 ? undefined : refetch} />

  return (
    <div className="site-container animate-page-in">
      <Breadcrumb
        items={[{ label: 'خانه', to: '/' }, { label: 'مقالات', to: '/articles' }, { label: article.title }]}
      />
      <article className="mx-auto max-w-[820px]">
        <header className="grid justify-items-start gap-3.5">
          <Badge>{article.category}</Badge>
          <h1 className="text-[clamp(24px,3.6vw,38px)] leading-[1.6]">{article.title}</h1>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <User size={16} /> {article.author} — {article.role}
            </span>
            <span className="inline-flex items-center gap-1.5">{formatDate(article.date)}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={16} /> {formatNumber(article.readTime)} دقیقه مطالعه
            </span>
          </div>
        </header>
        <ArticleCover article={article} large />
        <div className="text-[16.5px] leading-[2.2] text-ink-2 max-[641px]:text-[15.5px]">
          {article.content.map((block, i) => {
            if (block.type === 'h2')
              return (
                <h2 key={i} className="mt-8 mb-2.5 text-[22px] text-ink">
                  {block.text}
                </h2>
              )
            if (block.type === 'ul')
              return (
                <ul key={i} className="mb-[18px] grid gap-1.5 ps-1.5">
                  {block.items.map((it) => (
                    <li
                      key={it}
                      className="relative ps-6 before:absolute before:start-1 before:top-[0.9em] before:size-2 before:rounded-full before:bg-primary before:content-['']"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              )
            return (
              <p key={i} className="mb-4">
                {block.text}
              </p>
            )
          })}
          <p className="mt-7 mb-4 rounded-2xl bg-warn-50 px-[18px] py-3.5 text-[14px] text-[#8a5a00]">
            این مقاله برای آگاهی عمومی است و جایگزین مشاورهٔ پزشک یا داروساز نیست. نویسنده و محتوای این نسخه نمایشی
            تأیید حرفه‌ای نشده‌اند.
          </p>
        </div>
        {article.references?.length > 0 && (
          <section
            className="mt-[22px] rounded-2xl border border-line bg-surface p-5"
            aria-labelledby="article-sources-title"
          >
            <h2 id="article-sources-title" className="mb-3 text-[17px] text-ink">
              منابع برای مطالعهٔ بیشتر
            </h2>
            <ul className="grid gap-2.5 ps-[18px]">
              {article.references.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-primary underline underline-offset-[3px] focus-visible:rounded-[3px] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary"
                  >
                    {source.label}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
      {more.length > 0 && (
        <section className="section-y">
          <SectionHeading eyebrow="بیشتر بخوانید" title="مقالات مرتبط" to="/articles" />
          <div className="grid grid-cols-3 gap-[22px] max-[1025px]:grid-cols-2 max-[641px]:grid-cols-1">
            {more.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
