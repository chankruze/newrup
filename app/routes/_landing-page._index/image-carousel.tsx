import { Autoplay, Navigation, Pagination } from "swiper/modules";
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
      modules={[Autoplay, Pagination, Navigation]}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      loop={true}
      className="h-[480px] overflow-hidden rounded-lg"
    >
      {images.map((image) => (
        <SwiperSlide key={image} className="bg-cover bg-center">
          <img
            src={image}
            alt={image}
            className="block h-full w-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
