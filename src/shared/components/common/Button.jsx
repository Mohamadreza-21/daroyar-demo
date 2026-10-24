import { forwardRef, memo } from 'react'
import { Link } from 'react-router'
import { cn } from '../../utils/format'

const BASE =
  'inline-flex items-center justify-center gap-2 min-h-[46px] px-[22px] rounded-[14px] border-[1.5px] border-(--btn-bd) bg-(--btn-bg) text-(--btn-fg) font-bold text-[14.5px] whitespace-nowrap [--btn-bg:var(--color-primary)] [--btn-fg:#fff] [--btn-bd:transparent] [transition:transform_0.2s_var(--ease-brand),translate_0.2s_var(--ease-brand),rotate_0.2s_var(--ease-brand),scale_0.2s_var(--ease-brand),box-shadow_0.25s,background_0.2s,border-color_0.2s,color_0.2s] disabled:opacity-55 disabled:cursor-not-allowed not-disabled:hover:-translate-y-0.5 not-disabled:hover:shadow-[0_10px_24px_color-mix(in_srgb,var(--btn-bg)_35%,transparent)] not-disabled:active:translate-y-0'

export const BUTTON_VARIANTS = {
  primary: 'not-disabled:hover:[--btn-bg:var(--color-primary-600)]',
  accent: '[--btn-bg:var(--color-accent)] not-disabled:hover:[--btn-bg:var(--color-accent-600)]',
  dark: '[--btn-bg:var(--color-ink)]',
  soft: '[--btn-bg:var(--color-primary-50)] [--btn-fg:var(--color-primary-700)] not-disabled:hover:[--btn-bg:var(--color-primary-100)] not-disabled:hover:shadow-none',
  outline:
    '[--btn-bg:transparent] [--btn-fg:var(--color-ink)] [--btn-bd:var(--color-line)] not-disabled:hover:[--btn-bd:var(--color-primary)] not-disabled:hover:[--btn-fg:var(--color-primary-700)] not-disabled:hover:shadow-none',
  ghost:
    '[--btn-bg:transparent] [--btn-fg:var(--color-ink-2)] not-disabled:hover:[--btn-bg:var(--color-primary-50)] not-disabled:hover:shadow-none',
  danger: '[--btn-bg:var(--color-danger)]',
  white: '[--btn-bg:#fff] [--btn-fg:var(--color-primary-700)]',
}

const SIZES = {
  sm: 'min-h-[38px] px-3.5 text-[13px] rounded-[11px]',
  lg: 'min-h-[54px] px-[30px] text-[16px] rounded-2xl',
}

export const buttonClass = ({ variant = 'primary', size = 'md', block = false, className } = {}) =>
  cn(BASE, BUTTON_VARIANTS[variant], SIZES[size], block && 'w-full', className)

export const ICON_BTN =
  'relative inline-grid place-items-center size-11 rounded-[14px] text-ink-2 [transition:background_0.2s,color_0.2s,transform_0.2s,translate_0.2s,rotate_0.2s,scale_0.2s] hover:bg-primary-50 hover:text-primary-700'

export const LINK_BTN =
  'cursor-pointer text-primary-700 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

const Button = forwardRef(function Button(
  { to, variant = 'primary', size = 'md', block = false, loading = false, icon, className, children, ...rest },
  ref,
) {
  const classes = buttonClass({ variant, size, block, className })
  if (to && !rest.disabled) {
    return (
      <Link ref={ref} to={to} className={classes} {...rest}>
        {icon}
        {children}
      </Link>
    )
  }
  return (
    <button ref={ref} type={rest.type ?? 'button'} className={classes} {...rest} disabled={loading || rest.disabled}>
      {loading ? (
        <span
          className="size-[18px] rounded-full border-[2.5px] border-white/40 border-t-white animate-spin-fast"
          aria-hidden="true"
        />
      ) : (
        icon
      )}
      {children}
    </button>
  )
})

export default memo(Button)
