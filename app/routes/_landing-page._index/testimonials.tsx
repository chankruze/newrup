import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { TestimonialCard } from "./testimonial-card";

type Props = {
  testimonials: any[];
};

export const Testimonials = ({ testimonials }: Props) => {
  return (
    <Swiper
      grabCursor={true}
      spaceBetween={20}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      centeredSlides={true}
      slidesPerView={3}
      modules={[Autoplay]}
      loop={true}
      className="flex flex-wrap"
      breakpoints={{
        0: {
          slidesPerView: 1,
        },
        400: {
          slidesPerView: 2,
        },
        639: {
          slidesPerView: 3,
        },
      }}
    >
      {testimonials.map((testimonial) => (
        <SwiperSlide key={testimonial.name}>
          <TestimonialCard testimony={testimonial} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
