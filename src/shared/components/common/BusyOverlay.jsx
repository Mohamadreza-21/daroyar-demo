import { memo } from 'react'
import { cn } from '../../utils/format'
import BrandLoader from '../loaders/BrandLoader'

const BusyOverlay = memo(function BusyOverlay({ busy, label = 'در حال دریافت…', variant = 'cross', children }) {
  return (
    <div className="relative" aria-busy={busy}>
      <div
        className={cn(
          'transition-opacity duration-200 motion-reduce:transition-none',
          busy && 'pointer-events-none opacity-35',
        )}
      >
        {children}
      </div>
      {busy && (
        <div className="absolute inset-0 z-[2] grid place-items-start justify-items-center pt-[72px]">
          <BrandLoader
            variant={variant}
            label={label}
            className="rounded-md bg-surface px-[22px] py-3.5 shadow-[0_8px_30px_rgb(14_42_47_/_0.14)]"
          />
        </div>
      )}
    </div>
  )
})

export default BusyOverlay
