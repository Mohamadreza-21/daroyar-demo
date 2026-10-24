import { memo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { loopAutoplay } from '../../../shared/utils/motion'

const NAV =
  'absolute top-[calc(50%-30px)] z-5 grid size-12 place-items-center rounded-[50%] bg-white text-ink shadow-md [transition:background_0.2s,color_0.2s,opacity_0.2s] hover:bg-primary hover:text-white max-[820px]:hidden [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-0'

const BREAKPOINTS = {
  0: { slidesPerView: 1.55, spaceBetween: 12 },
  520: { slidesPerView: 2.3, spaceBetween: 14 },
  820: { slidesPerView: 3.2, spaceBetween: 16 },
  1100: { slidesPerView: 4, spaceBetween: 18 },
}

const ProductCarousel = memo(function ProductCarousel({ products, id }) {
  return (
    <div className="relative [&_.swiper-slide]:h-auto!" dir="rtl">
      <button type="button" className={`${NAV} -right-3.5 ${id}-prev`} aria-label="قبلی">
        <ChevronRight size={22} />
      </button>
      <button type="button" className={`${NAV} -left-3.5 ${id}-next`} aria-label="بعدی">
        <ChevronLeft size={22} />
      </button>
      <Swiper
        dir="rtl"
        modules={[Navigation, Autoplay]}
        navigation={{ prevEl: `.${id}-prev`, nextEl: `.${id}-next` }}
        loop={products.length > 4}
        speed={600}
        autoplay={products.length > 4 ? loopAutoplay(3600) : false}
        breakpoints={BREAKPOINTS}
      >
        {products.map((p) => (
          <SwiperSlide key={p.id}>
            <ProductCard product={p} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
})

export default ProductCarousel
