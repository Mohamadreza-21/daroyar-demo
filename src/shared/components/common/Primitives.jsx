import { memo } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, ChevronLeft, ChevronRight, Minus, Plus, Star } from 'lucide-react'
import { cn, formatNumber, formatToman } from '../../utils/format'

export const AVATAR =
  'grid size-11 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-primary),#35c4ae)] object-cover font-extrabold text-white'

const BADGE_TONES = {
  primary: 'bg-primary-50 text-primary-700',
  success: 'bg-success-50 text-[#0f8a5b]',
  warn: 'bg-warn-50 text-warn',
  danger: 'bg-danger-50 text-[#c4282d]',
  info: 'bg-info-50 text-[#2563c9]',
  accent: 'bg-accent-50 text-accent-600',
  neutral: 'bg-[#eef3f3] text-ink-2',
}

export const Badge = memo(function Badge({ tone = 'primary', children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] px-[11px] py-[3px] rounded-full text-[12px] font-bold whitespace-nowrap',
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
})

export const Rating = memo(function Rating({ value = 0, count, size = 15 }) {
  return (
    <span
      className="inline-flex items-center gap-[3px] text-[13px] text-muted"
      role="img"
      aria-label={`امتیاز ${formatNumber(value)} از ۵`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={value >= i - 0.5 ? 'text-gold fill-gold' : 'text-[#d9e4e3]'} />
      ))}
      <b className="ms-1 text-ink">{formatNumber(Number(value.toFixed(1)))}</b>
      {count != null && <span>({formatNumber(count)})</span>}
    </span>
  )
})

export const Price = memo(function Price({ price, oldPrice, large = false }) {
  const hasDiscount = oldPrice && oldPrice > price
  return (
    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <span
        className={cn(
          'text-[17px] font-extrabold text-ink max-[641px]:text-[15px]',
          large && 'text-[30px] max-[641px]:text-[30px]',
        )}
      >
        {formatNumber(price)}
        <small className="ms-1 text-[12px] font-semibold text-muted">تومان</small>
      </span>
      {hasDiscount && (
        <span
          className={cn(
            'text-[13px] text-muted line-through max-[641px]:text-[12px]',
            large && 'text-[16px] max-[641px]:text-[16px]',
          )}
        >
          {formatToman(oldPrice)}
        </span>
      )}
    </div>
  )
})

const qtyBtn = (small) =>
  cn(
    'grid h-[42px] w-[38px] place-items-center text-ink-2 transition-[background-color] duration-200 enabled:hover:bg-primary-50 enabled:hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-35',
    small && 'h-[34px] w-[30px]',
  )

export const QuantityControl = memo(function QuantityControl({
  value,
  min = 1,
  max = 99,
  onChange,
  small = false,
  className,
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center overflow-hidden rounded-[14px] border-[1.5px] border-line bg-surface',
        className,
      )}
    >
      <button
        type="button"
        className={qtyBtn(small)}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="افزایش تعداد"
      >
        <Plus size={16} />
      </button>
      <output className="min-w-[34px] text-center font-extrabold" aria-live="polite">
        {formatNumber(value)}
      </output>
      <button
        type="button"
        className={qtyBtn(small)}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="کاهش تعداد"
      >
        <Minus size={16} />
      </button>
    </div>
  )
})

export const SectionHeading = memo(function SectionHeading({
  eyebrow,
  title,
  text,
  to,
  linkLabel = 'مشاهدهٔ همه',
  center,
}) {
  return (
    <header
      className={cn('mb-8 flex flex-wrap items-end justify-between gap-4', center && 'justify-center text-center')}
    >
      <div>
        {eyebrow && (
          <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3.5 py-1 text-[12.5px] font-extrabold text-primary-700">
            {eyebrow}
          </span>
        )}
        <h2 className="text-[clamp(22px,3.4vw,34px)]">{title}</h2>
        {text && <p className={cn('mt-1.5 max-w-[560px] text-muted', center && 'mx-auto')}>{text}</p>}
      </div>
      {to && (
        <Link to={to} className="group inline-flex items-center gap-1.5 font-extrabold text-primary-700">
          {linkLabel}
          <ArrowLeft size={18} className="transition-transform duration-200 group-hover:-translate-x-1" />
        </Link>
      )}
    </header>
  )
})

export const Breadcrumb = memo(function Breadcrumb({ items }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 py-[18px] text-[13px] text-muted" aria-label="مسیر صفحه">
      {items.map((item, index) => {
        const last = index === items.length - 1
        return (
          <span key={item.label} className="contents">
            {last || !item.to ? (
              <span aria-current={last ? 'page' : undefined} className={last ? 'font-bold text-ink' : undefined}>
                {item.label}
              </span>
            ) : (
              <Link to={item.to} className="hover:text-primary-700">
                {item.label}
              </Link>
            )}
            {!last && <ChevronLeft size={14} aria-hidden="true" />}
          </span>
        )
      })}
    </nav>
  )
})

export const EmptyState = memo(function EmptyState({ icon: Icon, title, text, children }) {
  return (
    <div className="grid justify-items-center gap-3 px-5 py-14 text-center">
      <div className="grid size-[92px] -rotate-6 place-items-center rounded-[28px] bg-primary-50 text-primary">
        {Icon && <Icon size={42} />}
      </div>
      <h3 className="text-[19px]">{title}</h3>
      {text && <p className="max-w-[420px] text-muted">{text}</p>}
      {children}
    </div>
  )
})

function pageList(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, total, page - 1, page, page + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out = []
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push('gap')
    out.push(p)
  })
  return out
}

const pagerBtn = (active) =>
  cn(
    'grid h-[42px] min-w-[42px] place-items-center rounded-[12px] border-[1.5px] border-line bg-surface px-2 font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40',
    active ? 'border-primary bg-primary text-white' : 'enabled:hover:border-primary enabled:hover:text-primary-700',
  )

export const Pagination = memo(function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <nav className="mt-9 flex flex-wrap justify-center gap-2" aria-label="صفحه‌بندی">
      <button
        type="button"
        className={pagerBtn(false)}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="صفحهٔ قبل"
      >
        <ChevronRight size={18} />
      </button>
      {pageList(page, totalPages).map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className="grid min-w-6 place-items-center text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={pagerBtn(p === page)}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {formatNumber(p)}
          </button>
        ),
      )}
      <button
        type="button"
        className={pagerBtn(false)}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="صفحهٔ بعد"
      >
        <ChevronLeft size={18} />
      </button>
    </nav>
  )
})
