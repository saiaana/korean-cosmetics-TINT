import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ImageWithLoader from "../ImageWithLoader";

export default function ImageFullSizeModal({
  image,
  images,
  initialIndex = 0,
  onClose,
}) {
  const imageList = images && images.length > 0 ? images : image ? [image] : [];
  const [swiper, setSwiper] = useState(null);

  useEffect(() => {
    if (swiper && imageList.length > 0) {
      const index =
        initialIndex >= 0 && initialIndex < imageList.length ? initialIndex : 0;
      swiper.slideTo(index);
    }
  }, [swiper, initialIndex, imageList.length]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (imageList.length === 0) {
    return null;
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={handleBackdropClick}
    >
      <div className="animate-zoom-in relative w-[92vw] max-w-[720px] rounded-2xl shadow-2xl">
        <button
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-2xl text-pink-300 backdrop-blur transition hover:bg-black/70 hover:text-pink-500"
          onClick={onClose}
          aria-label="Close full size image"
        >
          ×
        </button>
        <Swiper
          onSwiper={setSwiper}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          keyboard={{ enabled: true }}
          modules={[Navigation, Pagination, Keyboard]}
          initialSlide={initialIndex}
          onClick={(e) => e.stopPropagation()}
          className="bg-neutral-900 [--swiper-navigation-color:#db2777] [--swiper-pagination-bullet-inactive-color:#fbcfe8] [--swiper-pagination-bullet-inactive-opacity:1] [--swiper-pagination-color:#db2777]"
        >
          {imageList.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="flex h-[85vh] items-center justify-center">
                <ImageWithLoader
                  src={img}
                  alt={`Full size product - image ${index + 1}`}
                  className="max-h-full w-auto object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
