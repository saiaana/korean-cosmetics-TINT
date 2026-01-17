import { useEffect, useState } from "react";
import ImageFullSizeModal from "../../ui/modals/ImageFullSizeModal";
import ImageGallerySlider from "./ImageGallerySlider";

function ImagesViewer({ images = [] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullSize, setIsFullSize] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isFullSize ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullSize]);

  const handleImageClick = (clickedImage) => {
    const index = images.indexOf(clickedImage);
    if (index >= 0) {
      setCurrentImageIndex(index);
      setIsFullSize(true);
    }
  };

  if (!images.length) {
    return (
      <div className="flex w-full items-center justify-center bg-gray-200 py-10">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ImageGallerySlider
        imageTitle="Product image"
        images={images}
        onClick={handleImageClick}
      />

      {isFullSize && images.length > 0 && (
        <ImageFullSizeModal
          images={images}
          initialIndex={currentImageIndex}
          onClose={() => setIsFullSize(false)}
        />
      )}
    </div>
  );
}

export default ImagesViewer;
