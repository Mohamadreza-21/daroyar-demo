import { memo } from 'react'
import { Link } from 'react-router'
import { Timer } from 'lucide-react'
import Button from '../../../shared/components/common/Button'
import { useCountdown } from '../../../shared/hooks/useUtils'
import { formatNumber } from '../../../shared/utils/format'
import { handleImgError } from '../../../shared/utils/image'

const Box = memo(function Box({ value, label }) {
  return (
    <div className="grid min-w-[68px] justify-items-center rounded-md bg-white/14 px-2 py-2.5 backdrop-blur-[6px] max-[561px]:min-w-[58px]">
      <b className="text-[24px] leading-[1.3]">
        {String(value)
          .padStart(2, '0')
          .replace(/\d/g, (d) => formatNumber(Number(d)))}
      </b>
      <small className="text-[11px] opacity-75">{label}</small>
    </div>
  )
})

const OfferBanner = memo(function OfferBanner({ product }) {
  const { hours, minutes, seconds } = useCountdown()
  return (
    <section className="site-container py-6">
      <div className="relative grid grid-cols-[1.3fr_0.7fr] items-center gap-6 overflow-hidden rounded-xl bg-[linear-gradient(120deg,#0e2a2f,#0b8576)] p-[clamp(24px,4vw,48px)] text-white before:absolute before:-end-[60px] before:-top-[120px] before:size-[380px] before:rounded-full before:bg-[radial-gradient(circle,rgba(255,122,89,0.5),transparent_70%)] before:content-[''] max-[1025px]:grid-cols-1">
        <div className="relative grid justify-items-start gap-3.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-[5px] text-[13px] font-extrabold">
            <Timer size={16} /> پیشنهاد نمایشی امروز
          </span>
          <h2 className="text-[clamp(20px,3vw,32px)]">{product ? product.title : 'تخفیف نمایشی امروز'}</h2>
          <p className="opacity-85">
            تایمر و تخفیف برای نمایش تعاملات فرانت‌اند فعال‌اند؛ ارسال و خرید واقعی وجود ندارد.
          </p>
          <div className="flex gap-2.5 [direction:ltr]" aria-label="زمان باقی‌مانده">
            <Box value={seconds} label="ثانیه" />
            <Box value={minutes} label="دقیقه" />
            <Box value={hours} label="ساعت" />
          </div>
          <Button to={product ? `/product/${product.id}` : '/shop'} variant="white" size="lg">
            مشاهدهٔ محصول
          </Button>
        </div>
        {product && (
          <Link
            to={`/product/${product.id}`}
            className="relative grid aspect-square w-full max-w-[300px] place-items-center justify-self-center rounded-full bg-white/95 [transition:transform_0.4s_var(--ease-brand),translate_0.4s_var(--ease-brand),rotate_0.4s_var(--ease-brand),scale_0.4s_var(--ease-brand)] hover:-rotate-4 hover:scale-[1.04] max-[1025px]:-order-1 max-[1025px]:max-w-[220px]"
            aria-label={product.title}
          >
            <span className="absolute start-[4%] top-[6%] grid size-[68px] place-items-center rounded-full bg-accent text-[17px] font-black text-white shadow-[0_8px_20px_rgba(255,122,89,0.5)]">
              {product.discount}٪
            </span>
            <img
              className="size-[78%] object-contain"
              onError={handleImgError}
              src={product.thumbnail}
              alt={product.title}
              loading="lazy"
            />
          </Link>
        )}
      </div>
    </section>
  )
})

export default OfferBanner
