import { memo, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs, Zoom } from 'swiper/modules'
import { formatNumber } from '../../../shared/utils/format'
import { handleImgError } from '../../../shared/utils/image'

const ProductGallery = memo(function ProductGallery({ images, title, discount }) {
  const [thumbs, setThumbs] = useState(null)
  return (
    <div className="sticky top-[calc(var(--header-h)+16px)] min-w-0 max-[1025px]:static" dir="rtl">
      <div className="relative overflow-hidden rounded-xl border border-line bg-[radial-gradient(circle_at_50%_40%,#fff,var(--color-bg-2))] [&_.swiper-slide]:aspect-square">
        {discount > 0 && (
          <span className="absolute start-2.5 top-2.5 z-3 rounded-full bg-accent px-2.5 py-[3px] text-[12px] font-extrabold text-white">
            {formatNumber(discount)}٪ تخفیف
          </span>
        )}
        <Swiper
          dir="rtl"
          modules={[FreeMode, Navigation, Thumbs, Zoom]}
          spaceBetween={10}
          zoom
          thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
        >
          {images.map((src, i) => (
            <SwiperSlide key={src + i}>
              <div className="swiper-zoom-container">
                <img
                  className="h-full w-full object-contain p-5"
                  onError={handleImgError}
                  src={src}
                  alt={`${title} - تصویر ${i + 1}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {images.length > 1 && (
        <Swiper
          dir="rtl"
          onSwiper={setThumbs}
          modules={[FreeMode, Thumbs]}
          spaceBetween={10}
          slidesPerView={4}
          freeMode
          watchSlidesProgress
          className="mt-3 [&_.swiper-slide]:aspect-square [&_.swiper-slide]:cursor-pointer [&_.swiper-slide]:overflow-hidden [&_.swiper-slide]:rounded-2xl [&_.swiper-slide]:border-2 [&_.swiper-slide]:border-transparent [&_.swiper-slide]:bg-bg-2 [&_.swiper-slide]:opacity-60 [&_.swiper-slide]:[transition:opacity_0.2s,border-color_0.2s] [&_.swiper-slide.swiper-slide-thumb-active]:border-primary [&_.swiper-slide.swiper-slide-thumb-active]:opacity-100"
        >
          {images.map((src, i) => (
            <SwiperSlide key={src + i}>
              <img
                className="h-full w-full object-contain p-1.5"
                onError={handleImgError}
                src={src}
                alt=""
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
})

export default ProductGallery
