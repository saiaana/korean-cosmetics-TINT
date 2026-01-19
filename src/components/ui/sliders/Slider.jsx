import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ProductCard from "../cards/ProductCard";

const styles = {
  section: "w-full",
  headerContainer: "mb-6 flex flex-col items-center gap-2",
  title: "text-center text-2xl font-bold text-gray-900 md:text-3xl",
  divider: "h-1 w-16 rounded-full bg-pink-600",
  swiper:
    "pb-10 pt-4 [--swiper-pagination-bullet-inactive-color:#bbf7d0] [--swiper-pagination-bullet-inactive-opacity:1] [--swiper-pagination-color:#16a34a] md:px-6",
  slide: "transition-transform duration-300 hover:scale-[1.03]",
};

const breakpoints = {
  360: {
    slidesPerView: 2,
    spaceBetween: 12,
  },
  480: {
    slidesPerView: 2.2,
    spaceBetween: 14,
  },
  640: {
    slidesPerView: 2.8,
    spaceBetween: 16,
  },
  768: {
    slidesPerView: 3.2,
    spaceBetween: 18,
  },
  1024: {
    slidesPerView: 4,
    spaceBetween: 20,
  },
  1200: {
    slidesPerView: 4,
    spaceBetween: 24,
  },
};

export default function Slider({ products, title }) {
  if (!products?.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.headerContainer}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.divider} />
      </div>
      <Swiper
        slidesPerView={2}
        spaceBetween={12}
        centeredSlides={false}
        grabCursor
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        className={styles.swiper}
        breakpoints={breakpoints}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className={styles.slide}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
