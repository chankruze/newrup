import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

type Props = {
  images: string[];
};

export const ImageCarousel = ({ images }: Props) => {
  return (
    <Swiper
      grabCursor={true}
      spaceBetween={30}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      centeredSlides={true}
      slidesPerView={1}
      modules={[Autoplay]}
      loop={true}
      className="h-full w-full"
    >
      {images.map((image) => (
        <SwiperSlide key={image} className="w-24">
          <img src={image} alt={image} className="block w-full object-cover" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
