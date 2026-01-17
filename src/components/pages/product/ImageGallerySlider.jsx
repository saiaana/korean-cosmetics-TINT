import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ImageWithLoader from "../../ui/ImageWithLoader";

export default function ImageGallerySlider({ imageTitle, images, onClick }) {
  return (
    <div className="mb-3 w-full flex-shrink-0">
      {images.length === 0 && (
        <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-200">
          <span className="text-sm text-gray-400">No image</span>
        </div>
      )}
      {images.length && (
        <div
          className="relative aspect-square w-full overflow-hidden rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <Swiper
            slidesPerView={1}
            spaceBetween={0}
            pagination={{ clickable: true, dynamicBullets: true }}
            modules={[Pagination, Navigation]}
            className="h-full w-full [--swiper-pagination-bullet-inactive-color:#9b4476] [--swiper-pagination-bullet-inactive-opacity:1] [--swiper-pagination-color:#db2778] [&_.swiper-pagination]:!bottom-2"
          >
            {images.map((imgUrl, index) => (
              <SwiperSlide key={index}>
                <ImageWithLoader
                  src={imgUrl}
                  alt={`${imageTitle} - image ${index + 1}`}
                  className="h-full w-full cursor-pointer object-cover transition-opacity hover:opacity-90"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(imgUrl);
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
