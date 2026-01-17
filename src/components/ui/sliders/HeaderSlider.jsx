import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Autoplay,
  Pagination,
  Scrollbar,
  A11y,
  EffectFade,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import HeaderSliderImage from "./HeaderSliderImage";

function HeaderSlider() {
  const images = [
    {
      src: "src/assets/images/mainPage1.png",
      alt: "Korean cosmetics banner",
    },
    {
      src: "src/assets/images/mainPage2.png",
      alt: "Korean cosmetics banner",
    },
    {
      src: "src/assets/images/mainPage3.png",
      alt: "Korean cosmetics banner",
    },
    {
      src: "src/assets/images/mainPage4.png",
      alt: "Korean cosmetics banner",
    },
  ];

  return (
    <div className="w-full">
      <Swiper
        modules={[
          Navigation,
          Autoplay,
          Pagination,
          Scrollbar,
          A11y,
          EffectFade,
        ]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          enabled: true,
          hideOnClick: false,
        }}
        effect="fade"
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="header-swiper [--swiper-pagination-bullet-inactive-color:#bbf7d0] [--swiper-pagination-bullet-inactive-opacity:1] [--swiper-pagination-color:#16a34a]"
      >
        {images.map((image) => (
          <SwiperSlide key={image.src}>
            <HeaderSliderImage
              key={image.src}
              imageSrc={image.src}
              alt={image.alt}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default HeaderSlider;
