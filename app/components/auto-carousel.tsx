import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

export const AutoCarousel = ({
  images,
  interval = 5000,
}: {
  images: string[];
  interval?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(slideInterval);
  }, [currentIndex, images.length, interval]);

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-full w-full">
      <div className="carousel-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "h-full hidden w-full transition-all duration-500 ease-in-out",
              {
                block: index === currentIndex,
              },
            )}
          >
            <img
              src={image}
              alt={`Slide ${index}`}
              loading="lazy"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
