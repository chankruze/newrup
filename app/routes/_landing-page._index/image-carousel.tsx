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
      className="w-full overflow-hidden rounded-lg lg:h-[480px]"
    >
      {images.map((image) => (
        <SwiperSlide key={image} className="bg-cover bg-center">
          <img
            src={image}
            alt={image}
            className="mx-auto block w-full object-cover lg:h-full"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
