import { memo } from 'react'
import { cn } from '../../utils/format'

const DROP_STYLE = 'h-[18px] w-[13px] animate-bl-drop rounded-[50%_50%_50%_50%/62%_62%_38%_38%]'
const BAR_STYLE = 'h-full w-[7px] animate-bl-bar rounded-full'

const VARIANTS = {
  capsule: () => (
    <span className="block h-7 w-[66px] animate-bl-capsule rounded-full bg-[linear-gradient(90deg,var(--color-primary)_50%,var(--color-accent)_50%)] shadow-[0_8px_22px_rgba(15,157,138,0.3)]" />
  ),
  cross: () => (
    <span className="relative block size-[46px] animate-bl-cross before:absolute before:inset-x-[17px] before:inset-y-0 before:rounded-[6px] before:bg-primary before:content-[''] after:absolute after:inset-x-0 after:inset-y-[17px] after:rounded-[6px] after:bg-accent after:content-['']" />
  ),
  drops: () => (
    <span className="flex h-[30px] items-end gap-2">
      <i className={cn(DROP_STYLE, 'bg-primary')} />
      <i className={cn(DROP_STYLE, 'bg-accent [animation-delay:0.15s]')} />
      <i className={cn(DROP_STYLE, 'bg-gold [animation-delay:0.3s]')} />
    </span>
  ),
  bars: () => (
    <span className="flex h-9 items-center gap-[5px]">
      <i className={cn(BAR_STYLE, 'bg-primary')} />
      <i className={cn(BAR_STYLE, 'bg-accent [animation-delay:0.1s]')} />
      <i className={cn(BAR_STYLE, 'bg-primary [animation-delay:0.2s]')} />
      <i className={cn(BAR_STYLE, 'bg-accent [animation-delay:0.3s]')} />
      <i className={cn(BAR_STYLE, 'bg-primary [animation-delay:0.4s]')} />
    </span>
  ),
  orbit: () => (
    <span className="relative block size-[58px] animate-spin-slow rounded-full border-2 border-dashed border-primary-100 after:absolute after:inset-x-3 after:inset-y-[17px] after:-rotate-35 after:rounded-full after:bg-[linear-gradient(90deg,var(--color-primary)_50%,var(--color-accent)_50%)] after:content-['']">
      <i className="absolute -top-[7px] left-[calc(50%-6px)] size-3 rounded-full bg-gold shadow-[0_0_0_4px_rgba(244,183,63,0.25)]" />
    </span>
  ),
  pulse: () => (
    <svg className="block" width="96" height="40" viewBox="0 0 96 40" fill="none" aria-hidden="true">
      <path
        className="animate-bl-pulse [stroke-dasharray:160] [stroke-dashoffset:160]"
        d="M2 22h20l6-16 10 32 8-24 6 8h42"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

const BrandLoader = memo(function BrandLoader({ variant = 'cross', label, className }) {
  const Shape = VARIANTS[variant] ?? VARIANTS.cross
  return (
    <div className={cn('grid justify-items-center gap-3.5 text-primary', className)} role="status" aria-live="polite">
      <Shape />
      {label && <p className="text-[14px] font-bold text-ink-2">{label}</p>}
    </div>
  )
})

export default BrandLoader
