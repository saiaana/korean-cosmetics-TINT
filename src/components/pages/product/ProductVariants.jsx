import { useState } from "react";
import ProductVariantCard from "./ProductVariantCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

function ProductVariants({
  variants,
  productPrice,
  onVariantSelect,
  selectedVariantId: externalSelectedVariantId,
}) {
  const [internalSelectedVariantId, setInternalSelectedVariantId] =
    useState(null);
  const selectedVariantId =
    externalSelectedVariantId ?? internalSelectedVariantId;

  if (!variants || variants.length === 0) {
    return null;
  }

  const handleVariantClick = (variant) => {
    if (!externalSelectedVariantId) {
      setInternalSelectedVariantId(variant.id);
    }
    if (onVariantSelect) {
      onVariantSelect(variant);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-gray-800">
        Available Variants
      </h3>
      <div>
        <Swiper
          slidesPerView={1.2}
          spaceBetween={12}
          centeredSlides={false}
          grabCursor
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[Pagination]}
          className="pb-10 pt-4 [--swiper-pagination-bullet-inactive-color:#bbf7d0] [--swiper-pagination-bullet-inactive-opacity:1] [--swiper-pagination-color:#16a34a] md:px-6 [&_.swiper-slide]:!h-auto [&_.swiper-wrapper]:!items-stretch"
          breakpoints={{
            360: {
              slidesPerView: 1.4,
              spaceBetween: 12,
            },
            480: {
              slidesPerView: 1.6,
              spaceBetween: 14,
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 2.8,
              spaceBetween: 18,
            },
            1024: {
              slidesPerView: 3.5,
              spaceBetween: 20,
            },
            1200: {
              slidesPerView: 4.2,
              spaceBetween: 24,
            },
            1440: {
              slidesPerView: 5,
              spaceBetween: 24,
            },
          }}
        >
          {variants.map((variant) => {
            return (
              <SwiperSlide key={variant.id} className="!h-auto">
                <ProductVariantCard
                  onClick={() => handleVariantClick(variant)}
                  variant={variant}
                  productPrice={productPrice}
                  selectedVariantId={selectedVariantId}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default ProductVariants;
