import { memo } from 'react'
import { loopAutoplay } from '../../../shared/utils/motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Quote } from 'lucide-react'
import { AVATAR, Rating, SectionHeading } from '../../../shared/components/common/Primitives'
import { TESTIMONIALS } from '../data'
import { initials } from '../../../shared/utils/format'

const BREAKPOINTS = {
  0: { slidesPerView: 1.08, spaceBetween: 14 },
  700: { slidesPerView: 2, spaceBetween: 18 },
  1100: { slidesPerView: 3, spaceBetween: 20 },
}

const Testimonials = memo(function Testimonials() {
  return (
    <section className="section-y site-container">
      <SectionHeading center eyebrow="محتوای ساختگی" title="نمونه‌هایی از بازخورد رابط کاربری" />
      <Swiper
        dir="rtl"
        modules={[Autoplay, Pagination]}
        loop
        autoplay={loopAutoplay(4200)}
        pagination={{ clickable: true }}
        breakpoints={BREAKPOINTS}
        className="pb-11 [&_.swiper-pagination-bullet-active]:bg-primary [&_.swiper-slide]:h-auto"
      >
        {TESTIMONIALS.map((t) => (
          <SwiperSlide key={t.id}>
            <figure className="relative grid h-full gap-3.5 rounded-[26px] border border-line bg-surface p-[26px]">
              <Quote size={34} className="absolute end-[22px] top-[18px] text-primary-100" />
              <Rating value={t.rating} />
              <blockquote className="leading-[2] text-ink-2">{t.text}</blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <span className={AVATAR}>{initials(...t.name.split(' '))}</span>
                <div>
                  <b className="block">{t.name}</b>
                  <small className="text-muted">{t.city}</small>
                </div>
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
})

export default Testimonials
