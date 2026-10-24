import { memo, useId } from 'react'
import { Link } from 'react-router'
import { BRAND } from '../../utils/constants'
import { cn } from '../../utils/format'

export const LogoMark = memo(function LogoMark({ size = 42 }) {
  const gradientId = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#12b5a0" />
          <stop offset="1" stopColor="#09665a" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="19" fill={`url(#${gradientId})`} />
      <path d="M26 14h12v12h12v12H38v12H26V38H14V26h12z" fill="#fff" />
      <circle cx="49" cy="15" r="6" fill="#ff7a59" />
    </svg>
  )
})

const Logo = memo(function Logo({ light = false, className }) {
  return (
    <Link
      to="/"
      className={cn('inline-flex shrink-0 items-center gap-2.5', className)}
      aria-label={`${BRAND.name} - صفحهٔ اصلی`}
    >
      <LogoMark />
      <span className="grid leading-[1.15]">
        <b className={cn('text-[20px] font-black', light ? 'text-white' : 'text-ink')}>{BRAND.name}</b>
        <small className={cn('text-[11px]', light ? 'text-white/65' : 'text-muted')}>فروشگاه نمایشی</small>
      </span>
    </Link>
  )
})

export default Logo
