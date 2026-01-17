import ImageWithLoader from "../ImageWithLoader";

export default function HeaderSliderImage({ imageSrc, alt }) {
  return (
    <div className="relative h-[320px] w-full overflow-hidden sm:h-[400px] md:h-[480px] lg:h-[560px]">
      <ImageWithLoader
        src={imageSrc}
        alt={alt}
        className="header-slider-image h-full w-full object-cover object-center"
        loading="eager"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-gray-100/10 to-transparent" />
    </div>
  );
}
