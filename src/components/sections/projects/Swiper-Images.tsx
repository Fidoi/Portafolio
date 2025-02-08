'use client';
import { Image } from '@heroui/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

interface SwiperImagesProps {
  images: string[];
}

export const SwiperImages = ({ images }: SwiperImagesProps) => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation={{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }}
      modules={[Autoplay, Pagination, Navigation]}
      className='mySwiper bg-background-foreground/85 rounded-lg '
    >
      {images.map((image, index) => (
        <SwiperSlide key={index} className='flex justify-center items-center '>
          <div className='flex justify-center items-center h-screen'>
            <Image
              src={image}
              alt={`Image ${index}`}
              className='max-w-full max-h-full object-contain'
            />
          </div>
        </SwiperSlide>
      ))}

      <div className='swiper-button-next !text-primary-500 hover:!text-primary-700' />
      <div className='swiper-button-prev !text-primary-500 hover:!text-primary-700' />
    </Swiper>
  );
};
