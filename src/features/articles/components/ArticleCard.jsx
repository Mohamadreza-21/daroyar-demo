import { memo } from 'react'
import { Link } from 'react-router'
import { Clock } from 'lucide-react'
import { Badge } from '../../../shared/components/common/Primitives'
import { cn, formatDate, formatNumber } from '../../../shared/utils/format'
import { ArticleCover } from './ArticleCover'

const ArticleCard = memo(function ArticleCard({ article, featured = false }) {
  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-surface [transition:transform_0.3s_var(--ease-brand),translate_0.3s_var(--ease-brand),rotate_0.3s_var(--ease-brand),scale_0.3s_var(--ease-brand),box-shadow_0.3s] hover:-translate-y-[5px] hover:shadow-md',
        featured && 'grid grid-cols-[1.1fr_1fr] max-[1025px]:grid-cols-1',
      )}
    >
      <Link
        to={`/articles/${article.slug}`}
        className={cn('m-2.5 block overflow-hidden rounded-[20px]', featured && 'm-3')}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ArticleCover
          article={article}
          className={featured ? 'h-full min-h-[280px] max-[1025px]:min-h-[200px]' : undefined}
        />
      </Link>
      <div className={cn('grid flex-1 content-start gap-2.5 px-5 pt-3 pb-5', featured && 'content-center px-7 py-6')}>
        <Badge className="justify-self-start">{article.category}</Badge>
        <h3 className={cn('text-[17px]', featured && 'text-[clamp(20px,2.4vw,28px)]', 'leading-[1.7]')}>
          <Link to={`/articles/${article.slug}`} className="hover:text-primary-700">
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-[14px] text-muted">{article.excerpt}</p>
        <div className="mt-auto flex flex-wrap gap-x-3.5 gap-y-1.5 pt-2.5 text-[12.5px] text-muted">
          <span className="inline-flex items-center gap-1">{article.author}</span>
          <span className="inline-flex items-center gap-1">{formatDate(article.date)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={14} /> {formatNumber(article.readTime)} دقیقه
          </span>
        </div>
      </div>
    </article>
  )
})

export default ArticleCard
