import { memo } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { SectionHeading } from '../../../shared/components/common/Primitives'
import { useCategories } from '../../catalog/hooks/useCatalog'
import { CATEGORY_ICONS } from '../../../shared/utils/constants'
import { cn, formatNumber } from '../../../shared/utils/format'

const TONES = {
  coral: '[--tone-bg:var(--color-accent-50)] [--tone:var(--color-accent-600)]',
  indigo: '[--tone-bg:var(--color-indigo-50)] [--tone:var(--color-indigo)]',
  amber: '[--tone-bg:var(--color-warn-50)] [--tone:var(--color-warn)]',
}

const CategorySection = memo(function CategorySection({ counts = {} }) {
  const { data: categories = [] } = useCategories()
  return (
    <section className="section-y site-container">
      <SectionHeading
        eyebrow="دسته‌بندی‌ها"
        title="هر آنچه برای مراقبت از خود نیاز دارید"
        text="دسته‌بندی مورد نظرتان را انتخاب کنید و سریع‌تر به محصول برسید."
      />
      <ul className="grid grid-cols-4 gap-[18px] max-[1025px]:grid-cols-2 max-[561px]:gap-3">
        {categories.map((meta, i) => {
          const slug = meta.slug
          const Icon = CATEGORY_ICONS[meta.icon] ?? CATEGORY_ICONS.Sparkles
          return (
            <motion.li
              key={slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
            >
              <Link
                to={`/shop?category=${slug}`}
                className={cn(
                  "group relative grid h-full gap-1 overflow-hidden rounded-[26px] bg-(--tone-bg) p-6 [--tone-bg:var(--color-primary-50)] [--tone:var(--color-primary)] [transition:transform_0.3s_var(--ease-brand),translate_0.3s_var(--ease-brand),rotate_0.3s_var(--ease-brand),scale_0.3s_var(--ease-brand),box-shadow_0.3s] hover:-translate-y-1.5 hover:shadow-md max-[561px]:p-[18px] after:absolute after:-start-[50px] after:-bottom-[60px] after:size-[150px] after:rounded-full after:bg-(--tone) after:opacity-[0.08] after:[transition:transform_0.4s_var(--ease-brand),translate_0.4s_var(--ease-brand),rotate_0.4s_var(--ease-brand),scale_0.4s_var(--ease-brand)] after:content-[''] hover:after:scale-[1.6]",
                  TONES[meta.tone],
                )}
              >
                <span className="mb-2.5 grid size-[62px] place-items-center rounded-[20px] bg-white text-(--tone) shadow-sm">
                  <Icon size={30} />
                </span>
                <b className="text-[17px]">{meta.label}</b>
                <small className="text-muted">{meta.blurb}</small>
                {counts[slug] != null && (
                  <em className="text-[12.5px] font-extrabold text-(--tone) not-italic">
                    {formatNumber(counts[slug])} محصول
                  </em>
                )}
                <ArrowLeft
                  size={18}
                  className="absolute end-[22px] top-[22px] translate-x-2 text-(--tone) opacity-0 [transition:all_0.3s] group-hover:translate-x-0 group-hover:opacity-100"
                />
              </Link>
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
})

export default CategorySection
