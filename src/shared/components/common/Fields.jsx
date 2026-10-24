import { forwardRef, memo, useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../utils/format'

const CONTROL =
  'w-full min-h-12 px-3.5 py-2.5 rounded-[14px] border-[1.5px] bg-surface outline-none transition-[border-color,box-shadow] duration-200 ease-[ease]'
const CONTROL_OK =
  'border-line focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-primary)_16%,transparent)]'
const CONTROL_ERR =
  'border-danger shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-danger)_12%,transparent)] focus:border-danger focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-danger)_12%,transparent)]'
const control = (error, ...extra) => cn(CONTROL, error ? CONTROL_ERR : CONTROL_OK, ...extra)

function FieldShell({ id, label, error, hint, className, children }) {
  return (
    <div className={cn('grid min-w-0 gap-1.5', className)}>
      {label && (
        <label className="text-[13.5px] font-bold text-ink-2" htmlFor={id}>
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-err`} className="text-[12.5px] font-semibold text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[12.5px] text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

export const Input = memo(
  forwardRef(function Input({ label, error, hint, icon: Icon, type = 'text', className, ltr, ...rest }, ref) {
    const id = useId()
    const [visible, setVisible] = useState(false)
    const isPassword = type === 'password'
    return (
      <FieldShell id={id} label={label} error={error} hint={hint} className={className}>
        <div className="relative flex items-center">
          {Icon && <Icon size={18} className="pointer-events-none absolute start-3.5 text-muted" aria-hidden="true" />}
          <input
            id={id}
            ref={ref}
            type={isPassword && visible ? 'text' : type}
            className={control(
              error,
              Icon && 'ps-11',
              isPassword && 'pe-[46px]',
              (ltr || isPassword) && '[direction:ltr] text-left',
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-err` : undefined}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute end-2 grid size-[34px] place-items-center rounded-[10px] text-muted hover:bg-primary-50"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? 'پنهان کردن گذرواژه' : 'نمایش گذرواژه'}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </FieldShell>
    )
  }),
)

export const Textarea = memo(
  forwardRef(function Textarea({ label, error, hint, className, ...rest }, ref) {
    const id = useId()
    return (
      <FieldShell id={id} label={label} error={error} hint={hint} className={className}>
        <div className="relative flex items-center">
          <textarea
            id={id}
            ref={ref}
            className={control(error, 'min-h-[120px] resize-y leading-[1.8]')}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-err` : undefined}
            {...rest}
          />
        </div>
      </FieldShell>
    )
  }),
)

export const Select = memo(
  forwardRef(function Select({ label, error, hint, className, children, ...rest }, ref) {
    const id = useId()
    return (
      <FieldShell id={id} label={label} error={error} hint={hint} className={className}>
        <div className="relative flex items-center">
          <select
            id={id}
            ref={ref}
            className={control(
              error,
              'appearance-none bg-(image:--select-arrow) bg-[position:left_14px_center] bg-no-repeat pe-[38px]',
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-err` : undefined}
            {...rest}
          >
            {children}
          </select>
        </div>
      </FieldShell>
    )
  }),
)
