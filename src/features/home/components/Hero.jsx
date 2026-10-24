import { memo, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { ArrowLeft, Pause, Pill, Play, ShieldCheck, Truck } from 'lucide-react'
import Button, { ICON_BTN } from '../../../shared/components/common/Button'
import { loopAutoplay, prefersReducedMotion } from '../../../shared/utils/motion'
import { cn } from '../../../shared/utils/format'

const SLIDES = [
  {
    id: 1,
    tone: 'teal',
    badge: 'فروشگاه نمایشی مراقبت روزانه',
    title: 'مراقبت روزانه، ساده‌تر از همیشه',
    text: 'محصولات نمونهٔ مراقبت پوست، بهداشت و سبک زندگی را در یک تجربهٔ خرید تعاملی مرور کنید.',
    cta: { to: '/shop', label: 'شروع خرید' },
    alt: { to: '/articles', label: 'مطالعهٔ راهنماها' },
  },
  {
    id: 2,
    tone: 'coral',
    badge: 'کد تخفیف نمایشی DAROO10',
    title: '۱۰٪ تخفیف نمایشی',
    text: 'کد تخفیف را در سبد خرید امتحان کنید و جریان ثبت سفارش آزمایشی را ببینید.',
    cta: { to: '/shop?category=skin-care', label: 'مراقبت پوست' },
    alt: { to: '/register', label: 'ثبت‌نام رایگان' },
  },
  {
    id: 3,
    tone: 'indigo',
    badge: 'مجلهٔ سلامت دارویار',
    title: 'بیشتر بدانید، سالم‌تر زندگی کنید',
    text: 'مقالات نمونه دربارهٔ تغذیه و مراقبت‌های روزمره را در بخش مجله مرور کنید.',
    cta: { to: '/articles', label: 'خواندن مقالات' },
    alt: { to: '/shop', label: 'مشاهدهٔ محصولات' },
  },
]

const SLIDE_TONES = {
  teal: 'bg-[linear-gradient(135deg,#096a5f_0%,#0b8576_100%)]',
  coral: 'bg-[linear-gradient(135deg,#b53b17_0%,#d1481f_100%)]',
  indigo: 'bg-[linear-gradient(135deg,#3a3eb5_0%,#4a4ecf_100%)]',
}

const FLOAT_BASE =
  'absolute grid size-[62px] animate-floaty-5 place-items-center rounded-[20px] bg-white text-primary-700 shadow-md'

const FLOATERS = [
  { icon: Pill, className: cn(FLOAT_BASE, 'start-[4%] top-[8%] [animation-delay:-1s]') },
  { icon: ShieldCheck, className: cn(FLOAT_BASE, 'start-0 bottom-[12%] text-accent-600 [animation-delay:-2.5s]') },
  { icon: Truck, className: cn(FLOAT_BASE, 'end-[2%] top-[20%] text-indigo [animation-delay:-3.5s]') },
]

const Hero = memo(function Hero() {
  const [swiper, setSwiper] = useState(null)
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const toggle = useCallback(() => {
    if (!swiper) return
    if (playing) swiper.autoplay.stop()
    else swiper.autoplay.start()
    setPlaying(!playing)
  }, [swiper, playing])
  const hold = useCallback(() => playing && swiper?.autoplay.pause(), [swiper, playing])
  const release = useCallback(() => playing && swiper?.autoplay.resume(), [swiper, playing])
  return (
    <section className="site-container relative pt-5" aria-label="بنرهای اصلی" onFocus={hold} onBlur={release}>
      <button
        type="button"
        className={cn(
          ICON_BTN,
          'absolute end-4 bottom-4 z-5 rounded-full bg-black/28 text-white hover:bg-black/45 hover:text-white',
        )}
        onClick={toggle}
        aria-label={playing ? 'توقف چرخش بنرها' : 'ادامهٔ چرخش بنرها'}
      >
        {playing ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <Swiper
        onSwiper={setSwiper}
        dir="rtl"
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={700}
        autoplay={loopAutoplay(5200)}
        pagination={{ clickable: true }}
        className="overflow-hidden rounded-xl shadow-lg [&_.swiper-pagination-bullet-active]:w-7 [&_.swiper-pagination-bullet-active]:rounded-full [&_.swiper-pagination-bullet-active]:opacity-100 [&_.swiper-pagination-bullet]:size-[9px] [&_.swiper-pagination-bullet]:bg-white [&_.swiper-pagination-bullet]:opacity-50 [&_.swiper-pagination-bullet]:[transition:width_0.3s,opacity_0.3s] [&_.swiper-pagination]:bottom-[18px]"
      >
        {SLIDES.map((s) => (
          <SwiperSlide key={s.id}>
            <div
              className={cn(
                'relative grid min-h-[clamp(420px,46vw,540px)] grid-cols-[1.15fr_0.85fr] items-center gap-6 overflow-hidden p-[clamp(28px,5vw,64px)] text-white max-[1025px]:grid-cols-1',
                SLIDE_TONES[s.tone],
              )}
            >
              <div className="pointer-events-none absolute -top-[140px] -end-[100px] size-[420px] rounded-full bg-white/12" />
              <div className="pointer-events-none absolute -bottom-[90px] start-1/4 size-[260px] rounded-full bg-white/8" />
              <motion.div
                className="relative z-2 grid justify-items-start gap-[18px]"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 0.8, 0.3, 1] }}
              >
                <span className="rounded-full bg-white/20 px-4 py-1.5 text-[13px] font-extrabold backdrop-blur-[6px]">
                  {s.badge}
                </span>
                <h2 className="text-[clamp(28px,4.6vw,52px)] leading-[1.3] font-black">{s.title}</h2>
                <p className="max-w-[520px] text-[clamp(14px,1.6vw,17px)] leading-[2] opacity-92">{s.text}</p>
                <div className="mt-1.5 flex flex-wrap gap-3">
                  <Button to={s.cta.to} variant="white" size="lg" icon={<ArrowLeft size={20} />}>
                    {s.cta.label}
                  </Button>
                  <Button
                    to={s.alt.to}
                    variant="outline"
                    size="lg"
                    className="[--btn-bd:rgba(255,255,255,0.55)] [--btn-fg:#fff] not-disabled:hover:[--btn-bd:#fff] not-disabled:hover:[--btn-bg:rgba(255,255,255,0.14)] not-disabled:hover:[--btn-fg:#fff]"
                  >
                    {s.alt.label}
                  </Button>
                </div>
              </motion.div>
              <div className="relative z-1 grid place-items-center max-[1025px]:hidden" aria-hidden="true">
                <div className="grid aspect-square w-[min(100%,340px)] animate-floaty place-items-center rounded-full border-2 border-white/35 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),rgba(255,255,255,0.1))] shadow-[inset_0_0_60px_rgba(255,255,255,0.2)]">
                  <svg viewBox="0 0 64 64" width="46%" height="46%">
                    <path d="M26 10h12v16h16v12H38v16H26V38H10V26h16z" fill="#fff" />
                  </svg>
                </div>
                {FLOATERS.map(({ icon: Icon, className }) => (
                  <span key={className} className={className}>
                    <Icon size={26} />
                  </span>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
})

export default Hero
