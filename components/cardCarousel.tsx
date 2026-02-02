'use client'

import { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/effect-coverflow'

interface Area {
  title: string;
  description: string;
  image: string;
}

interface CardCarouselProps {
  items: Area[];
  onIndexChange?: (index: number) => void;
  activeIndex?: number;
}

export default function CardCarousel({ items, onIndexChange, activeIndex }: CardCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  // Sincroniza o Swiper quando o activeIndex externo muda
  useEffect(() => {
    if (swiperRef.current && activeIndex !== undefined && swiperRef.current.realIndex !== activeIndex) {
      swiperRef.current.slideTo(activeIndex);
    }
  }, [activeIndex]);

  return (
    <Swiper
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      effect="coverflow"
      grabCursor
      centeredSlides
      slidesPerView="auto"
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2,
        slideShadows: false,
      }}
      initialSlide={activeIndex}
      onSlideChange={(swiper) => onIndexChange?.(swiper.realIndex)}
      modules={[EffectCoverflow]}
      className="w-full py-10 overflow-visible"
    >
      {items.map((item, index) => (
        <SwiperSlide key={index} className="w-[280px] sm:w-[320px]">
          <div className="relative h-[420px] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/10 group">
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Conteúdo */}
            <div className="relative z-10 p-8 text-white flex flex-col justify-end h-full">
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-sm text-white/80 leading-relaxed line-clamp-4">
                {item.description}
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
