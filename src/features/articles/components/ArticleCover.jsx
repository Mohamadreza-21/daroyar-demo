import { memo } from 'react'
import { Droplets, Leaf, Moon, Pill, ShieldCheck, Snowflake, Stethoscope, Sun } from 'lucide-react'
import { cn } from '../../../shared/utils/format'

const ICONS = { Sun, Pill, Stethoscope, Moon, ShieldCheck, Snowflake, Droplets, Leaf }

const TONES = [
  'bg-[linear-gradient(135deg,#0b8576,#35c4ae)]',
  'bg-[linear-gradient(135deg,#4a4ecf,#8b8ff3)]',
  'bg-[linear-gradient(135deg,#ef6340,#ffa07a)]',
  'bg-[linear-gradient(135deg,#0e2a2f,#1f6f78)]',
]

export const ArticleCover = memo(function ArticleCover({ article, large = false, className }) {
  const Icon = ICONS[article.icon] ?? Leaf
  return (
    <div
      className={cn(
        'relative grid h-[190px] place-items-center overflow-hidden text-white',
        TONES[article.tone],
        large && 'my-6 h-[clamp(200px,30vw,320px)] rounded-xl',
        className,
      )}
    >
      <span className="absolute size-[190px] rounded-full border-2 border-white/25" />
      <span className="absolute size-[320px] rounded-full border-2 border-white/14" />
      <Icon size={large ? 96 : 64} strokeWidth={1.5} className="relative z-1" />
    </div>
  )
})
