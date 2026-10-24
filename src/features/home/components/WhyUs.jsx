import { memo, useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import { Award, HeartPulse, PackageCheck, Users } from 'lucide-react'
import { SectionHeading } from '../../../shared/components/common/Primitives'
import { STATS } from '../data'
import { formatNumber } from '../../../shared/utils/format'

const Counter = memo(function Counter({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return undefined
    const controls = animate(0, value, { duration: 1.8, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) })
    return () => controls.stop()
  }, [inView, value])
  return (
    <b ref={ref} className="block text-[clamp(24px,3.4vw,38px)] leading-[1.3] font-black">
      {formatNumber(n)}
      {suffix}
    </b>
  )
})

const REASONS = [
  { icon: PackageCheck, title: 'جزئیات محصول', text: 'دسته‌بندی، قیمت و موجودی نمونه برای نمایش جریان خرید.' },
  { icon: Award, title: 'فیلترهای کاربردی', text: 'جستجو، مرتب‌سازی و فیلتر برای پیدا کردن سریع‌تر کالاها.' },
  { icon: HeartPulse, title: 'جریان خرید تعاملی', text: 'سبد خرید، کوپن و ثبت سفارش آزمایشی را تجربه کنید.' },
  { icon: Users, title: 'پنل‌های مجزا', text: 'صفحه‌های حساب کاربری و مدیریت در یک نمونه‌کار فرانت‌اند.' },
]

const WhyUs = memo(function WhyUs() {
  return (
    <section className="section-y bg-[linear-gradient(180deg,transparent,var(--color-bg-2)_40%,transparent)]">
      <div className="site-container">
        <SectionHeading
          center
          eyebrow="چرا دارویار؟"
          title="تجربهٔ خریدی ساده و تعاملی"
          text="امکانات اصلی یک فروشگاه را در محیط نمایشی بررسی کنید."
        />
        <ul className="grid grid-cols-4 gap-[18px] max-[1025px]:grid-cols-2 max-[561px]:gap-3">
          {REASONS.map(({ icon: Icon, title, text }, i) => (
            <motion.li
              className="rounded-lg border border-line bg-surface px-[22px] py-[26px] text-center [transition:transform_0.3s_var(--ease-brand),translate_0.3s_var(--ease-brand),rotate_0.3s_var(--ease-brand),scale_0.3s_var(--ease-brand),box-shadow_0.3s] hover:-translate-y-[5px] hover:shadow-md"
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <span className="mb-3.5 inline-grid size-16 place-items-center rounded-[22px] bg-primary-50 text-primary">
                <Icon size={28} />
              </span>
              <h3 className="mb-1.5 text-[16px]">{title}</h3>
              <p className="text-[13.5px] text-muted">{text}</p>
            </motion.li>
          ))}
        </ul>
        <ul className="mt-8 grid grid-cols-4 gap-4 rounded-[28px] bg-primary bg-[linear-gradient(135deg,#0b8576,#12b5a0)] p-7 text-center text-white max-[1025px]:grid-cols-2 max-[561px]:px-3.5 max-[561px]:py-5">
          {STATS.map((s) => (
            <li key={s.label}>
              <Counter value={s.value} suffix={s.suffix} />
              <span className="text-[13.5px] opacity-88">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
})

export default WhyUs
